import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Link2,
  LayoutDashboard,
  BarChart3,
  User,
  LogOut,
  Crown,
  Loader2,
  Eye,
  X,
  MousePointerClick,
  CalendarDays,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { API_BASE_URL } from "../config/api";

export default function Analytics() {
  const navigate = useNavigate();

  // ==========================================
  // STATES
  // ==========================================

  const [user, setUser] = useState(null);
  const [urls, setUrls] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedUrl, setSelectedUrl] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] =
    useState(false);

  // ==========================================
  // FETCH PAGE DATA
  // ==========================================

  const fetchPageData = async () => {
    try {
      setLoading(true);
      setError("");

      const [profileResponse, urlsResponse] =
        await Promise.all([
          fetch(`${API_BASE_URL}/user/profile`, {
            credentials: "include",
          }),

          fetch(
            `${API_BASE_URL}/analysis/getMyUrls`,
            {
              credentials: "include",
            }
          ),
        ]);

      if (
        profileResponse.status === 401 ||
        urlsResponse.status === 401
      ) {
        navigate("/");
        return;
      }

      const profileData =
        await profileResponse.json();

      const urlsData =
        await urlsResponse.json();

      if (!profileResponse.ok) {
        throw new Error(
          profileData.message ||
            "Unable to load profile"
        );
      }

      if (!urlsResponse.ok) {
        throw new Error(
          urlsData.message ||
            "Unable to load URLs"
        );
      }

      setUser(profileData.user);
      setUrls(urlsData.urls || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  // ==========================================
  // NORMALIZE DATE
  // ==========================================

  const getDateKey = (dateValue) => {
    const date = new Date(dateValue);

    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(
        2,
        "0"
      ),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  };

  // ==========================================
  // GENERATE DAILY CHART DATA
  // URL CREATED DATE -> TODAY
  // ==========================================

  const generateDailyChartData = (
    createdAt,
    analyticsData
  ) => {
    if (!createdAt) return [];

    const clickMap = {};

    // Convert backend analytics into:
    // YYYY-MM-DD -> clicks
    analyticsData.forEach((item) => {
      const key = getDateKey(item.date);

      clickMap[key] =
        (clickMap[key] || 0) +
        (item.clicks || 0);
    });

    // URL issue date
    const startDate = new Date(createdAt);

    startDate.setHours(0, 0, 0, 0);

    // Today
    const endDate = new Date();

    endDate.setHours(0, 0, 0, 0);

    const result = [];

    const currentDate = new Date(startDate);

    // Generate EVERY day
    while (currentDate <= endDate) {
      const key = getDateKey(currentDate);

      result.push({
        date: currentDate.toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
          }
        ),

        fullDate:
          currentDate.toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          ),

        clicks: clickMap[key] || 0,
      });

      currentDate.setDate(
        currentDate.getDate() + 1
      );
    }

    return result;
  };

  // ==========================================
  // Y AXIS
  // EVERY UNIT = 20 CLICKS
  // ==========================================

  const getYAxisTicks = (data) => {
    const maxClicks = Math.max(
      ...data.map(
        (item) => item.clicks || 0
      ),
      0
    );

    // At least 20
    const upperLimit = Math.max(
      20,
      Math.ceil(maxClicks / 20) * 20
    );

    const ticks = [];

    for (
      let value = 0;
      value <= upperLimit;
      value += 20
    ) {
      ticks.push(value);
    }

    return ticks;
  };

  // ==========================================
  // VIEW ANALYTICS
  // ==========================================

  const handleViewAnalytics = async (id) => {
    try {
      setAnalyticsLoading(true);
      setError("");
      setAnalytics([]);

      // Open modal immediately
      setSelectedUrl({
        _id: id,
      });

      const response = await fetch(
        `${API_BASE_URL}/analysis/${id}`,
        {
          credentials: "include",
        }
      );

      if (response.status === 401) {
        navigate("/");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load analytics"
        );
      }

      if (!data.url) {
        throw new Error("URL not found");
      }

      setSelectedUrl(data.url);

      // Generate complete daily data
      const chartData =
        generateDailyChartData(
          data.url.createdAt,
          data.analytics || []
        );

      setAnalytics(chartData);
    } catch (error) {
      setError(error.message);
      setSelectedUrl(null);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    try {
      await fetch(
        `${API_BASE_URL}/user/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch (error) {
      console.log(
        "Logout error:",
        error
      );
    } finally {
      navigate("/");
    }
  };

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(
      date
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // TOTAL CLICKS
  // ==========================================

  const totalClicks = urls.reduce(
    (sum, url) =>
      sum + (url.totalClick || 0),
    0
  );

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="flex flex-col items-center gap-3">

          <Loader2
            size={35}
            className="animate-spin text-indigo-600"
          />

          <p className="text-sm text-slate-500">
            Loading analytics...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-[#f7f8fc]">

      {/* ================================= */}
      {/* SIDEBAR */}
      {/* ================================= */}

      <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-[#081426] text-white">

        {/* LOGO */}

        <div
          onClick={() =>
            navigate("/dashboard")
          }
          className="flex h-20 cursor-pointer items-center gap-3 border-b border-white/10 px-6"
        >

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">

            <Link2 size={27} />

          </div>

          <span className="text-xl font-bold">
            Linkify
          </span>

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 space-y-2 px-4 py-6">

          {/* DASHBOARD */}

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
          >

            <LayoutDashboard size={19} />

            Dashboard

          </button>

          {/* MY LINKS */}

          <button
            onClick={() =>
              navigate("/links")
            }
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
          >

            <Link2 size={19} />

            My Links

          </button>

          {/* ANALYTICS */}

          <button className="flex w-full items-center gap-3 rounded-xl bg-indigo-600 px-4 py-3 text-left text-sm font-medium">

            <BarChart3 size={19} />

            Analytics

          </button>

          {/* PROFILE */}

          <button
            onClick={() =>
              navigate("/profile")
            }
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
          >

            <User size={19} />

            Profile

          </button>

        </nav>

        {/* PLAN */}

        <div className="mx-4 mb-4 rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-4">

          <div className="flex items-center gap-2 text-indigo-300">

            <Crown size={17} />

            <span className="text-sm font-semibold">

              {user?.plan === "premium"
                ? "Premium Plan"
                : "Free Plan"}

            </span>

          </div>

          {user?.plan !== "premium" && (

            <p className="mt-2 text-xs leading-5 text-slate-400">

              Upgrade to unlock custom aliases.

            </p>

          )}

        </div>

        {/* LOGOUT */}

        <div className="border-t border-white/10 p-4">

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
          >

            <LogOut size={19} />

            Logout

          </button>

        </div>

      </aside>

      {/* ================================= */}
      {/* MAIN */}
      {/* ================================= */}

      <main className="ml-64 min-h-screen">

        {/* TOPBAR */}

        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">

          <div>

            <p className="text-sm text-slate-500">
              Insights
            </p>

            <h1 className="font-bold text-slate-900">
              Analytics
            </h1>

          </div>

          {/* USER */}

          <div className="flex items-center gap-3">

            <div className="text-right">

              <p className="text-sm font-semibold text-slate-800">
                {user?.name}
              </p>

              <p className="text-xs text-slate-500">
                {user?.email}
              </p>

            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 font-bold text-white">

              {user?.name
                ?.charAt(0)
                .toUpperCase()}

            </div>

          </div>

        </header>

        {/* ================================= */}
        {/* CONTENT */}
        {/* ================================= */}

        <div className="mx-auto max-w-7xl p-8">

          {/* TITLE */}

          <div>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900">

              Link Analytics

            </h2>

            <p className="mt-2 text-slate-500">

              View the performance of your short
              links over time.

            </p>

          </div>

          {/* ================================= */}
          {/* SUMMARY */}
          {/* ================================= */}

          <div className="mt-8 grid gap-5 sm:grid-cols-2">

            {/* TOTAL LINKS */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Total Links
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {urls.length}
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                  <Link2 size={23} />

                </div>

              </div>

            </div>

            {/* TOTAL CLICKS */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Total Clicks
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {totalClicks}
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">

                  <MousePointerClick
                    size={23}
                  />

                </div>

              </div>

            </div>

          </div>

          {/* ERROR */}

          {error && (

            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">

              {error}

            </div>

          )}

          {/* ================================= */}
          {/* URL TABLE */}
          {/* ================================= */}

          <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* HEADER */}

            <div className="border-b border-slate-200 px-6 py-5">

              <h3 className="text-lg font-bold text-slate-900">

                Your Links

              </h3>

              <p className="mt-1 text-sm text-slate-500">

                Select a link to view detailed
                analytics.

              </p>

            </div>

            {/* EMPTY */}

            {urls.length === 0 ? (

              <div className="flex flex-col items-center justify-center py-20">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

                  <BarChart3 size={25} />

                </div>

                <h3 className="mt-4 font-semibold text-slate-800">

                  No analytics yet

                </h3>

                <p className="mt-1 text-sm text-slate-500">

                  Create a short link first.

                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[850px]">

                  {/* TABLE HEADER */}

                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">

                    <tr>

                      <th className="px-6 py-4">
                        Destination
                      </th>

                      <th className="px-6 py-4">
                        Short Code
                      </th>

                      <th className="px-6 py-4">
                        Total Clicks
                      </th>

                      <th className="px-6 py-4">
                        Created
                      </th>

                      <th className="px-6 py-4 text-right">
                        Analytics
                      </th>

                    </tr>

                  </thead>

                  {/* BODY */}

                  <tbody className="divide-y divide-slate-100">

                    {urls.map((url) => (

                      <tr
                        key={url._id}
                        className="transition hover:bg-slate-50"
                      >

                        {/* DESTINATION */}

                        <td className="max-w-[320px] px-6 py-5">

                          <a
                            href={url.actualUrl}
                            target="_blank"
                            rel="noreferrer"
                            title={url.actualUrl}
                            className="block overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-slate-700 hover:text-indigo-600"
                          >

                            {url.actualUrl}

                          </a>

                        </td>

                        {/* SHORT CODE */}

                        <td className="px-6 py-5">

                          <span className="font-semibold text-indigo-600">

                            {url.shortCode}

                          </span>

                        </td>

                        {/* CLICKS */}

                        <td className="px-6 py-5 font-semibold text-slate-700">

                          {url.totalClick || 0}

                        </td>

                        {/* DATE */}

                        <td className="px-6 py-5 text-sm text-slate-500">

                          {formatDate(
                            url.createdAt
                          )}

                        </td>

                        {/* VIEW ANALYTICS */}

                        <td className="px-6 py-5">

                          <div className="flex justify-end">

                            <button
                              onClick={() =>
                                handleViewAnalytics(
                                  url._id
                                )
                              }
                              className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100"
                            >

                              <Eye size={16} />

                              View Analytics

                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        </div>

      </main>

      {/* ================================= */}
      {/* ANALYTICS MODAL */}
      {/* ================================= */}

      {selectedUrl && (

        <div
          onClick={() => {
            if (!analyticsLoading) {
              setSelectedUrl(null);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-5 backdrop-blur-sm"
        >

          {/* MODAL */}

          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            className="relative w-full max-w-5xl rounded-3xl bg-white p-7 shadow-2xl"
          >

            {/* CLOSE */}

            <button
              onClick={() =>
                setSelectedUrl(null)
              }
              className="absolute right-5 top-5 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
            >

              <X size={21} />

            </button>

            {/* LOADING */}

            {analyticsLoading ? (

              <div className="flex h-[500px] items-center justify-center">

                <div className="flex flex-col items-center gap-3">

                  <Loader2
                    size={32}
                    className="animate-spin text-indigo-600"
                  />

                  <p className="text-sm text-slate-500">

                    Loading analytics...

                  </p>

                </div>

              </div>

            ) : (

              <>

                {/* ================================= */}
                {/* MODAL TITLE */}
                {/* ================================= */}

                <div>

                  <p className="text-sm font-semibold text-indigo-600">

                    Link Analytics

                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-900">

                    Performance Overview

                  </h2>

                </div>

                {/* ================================= */}
                {/* URL DETAILS */}
                {/* ================================= */}

                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">

                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">

                    Destination

                  </p>

                  <p className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap font-medium text-slate-700">

                    {selectedUrl.actualUrl}

                  </p>

                  <div className="mt-4 flex flex-wrap gap-8">

                    {/* SHORT CODE */}

                    <div>

                      <p className="text-xs text-slate-400">
                        Short Code
                      </p>

                      <p className="mt-1 font-semibold text-indigo-600">

                        {
                          selectedUrl.shortCode
                        }

                      </p>

                    </div>

                    {/* TOTAL CLICKS */}

                    <div>

                      <p className="text-xs text-slate-400">
                        Total Clicks
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">

                        {selectedUrl.totalClick ||
                          0}

                      </p>

                    </div>

                    {/* CREATED */}

                    <div>

                      <p className="text-xs text-slate-400">
                        Created
                      </p>

                      <p className="mt-1 flex items-center gap-2 font-semibold text-slate-800">

                        <CalendarDays
                          size={15}
                        />

                        {formatDate(
                          selectedUrl.createdAt
                        )}

                      </p>

                    </div>

                  </div>

                </div>

                {/* ================================= */}
                {/* DAILY CLICKS */}
                {/* ================================= */}

                <div className="mt-7">

                  <div className="mb-5">

                    <h3 className="font-bold text-slate-900">

                      Daily Clicks

                    </h3>

                    <p className="mt-1 text-sm text-slate-500">

                      Click activity from the day
                      this link was created.

                    </p>

                  </div>

                  {/* ================================= */}
                  {/* BAR CHART */}
                  {/* ================================= */}

                  <div className="h-[350px] w-full">

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <BarChart
                        data={analytics}
                        margin={{
                          top: 10,
                          right: 20,
                          left: 10,
                          bottom: 10,
                        }}
                      >

                        {/* GRID */}

                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                        />

                        {/* X AXIS - EACH DAY */}

                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          fontSize={12}
                          interval={0}
                        />

                        {/* Y AXIS - 20 CLICK UNIT */}

                        <YAxis
                          ticks={getYAxisTicks(
                            analytics
                          )}
                          domain={[
                            0,
                            Math.max(
                              ...getYAxisTicks(
                                analytics
                              )
                            ),
                          ]}
                          allowDecimals={false}
                          tickLine={false}
                          axisLine={false}
                          fontSize={12}
                        />

                        {/* TOOLTIP */}

                        <Tooltip
                          formatter={(value) => [
                            `${value} clicks`,
                            "Clicks",
                          ]}
                          labelFormatter={(
                            label
                          ) => {
                            const item =
                              analytics.find(
                                (data) =>
                                  data.date ===
                                  label
                              );

                            return (
                              item?.fullDate ||
                              label
                            );
                          }}
                        />

                        {/* BAR */}

                        <Bar
                          dataKey="clicks"
                          fill="#4f46e5"
                          radius={[
                            6,
                            6,
                            0,
                            0,
                          ]}
                          maxBarSize={45}
                        />

                      </BarChart>

                    </ResponsiveContainer>

                  </div>

                  {/* AXIS DESCRIPTION */}

                  <div className="mt-2 flex justify-between text-xs text-slate-400">

                    <span>
                      Y-axis: 1 unit = 20 clicks
                    </span>

                    <span>
                      X-axis: 1 unit = 1 day
                    </span>

                  </div>

                </div>

              </>

            )}

          </div>

        </div>

      )}

    </div>
  );
}