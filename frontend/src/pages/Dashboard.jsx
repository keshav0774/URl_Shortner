import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Link2,
  LayoutDashboard,
  BarChart3,
  User,
  LogOut,
  Plus,
  Copy,
  Trash2,
  ExternalLink,
  MousePointerClick,
  Crown,
  Loader2,
  Check,
  Menu,
  X,
} from "lucide-react";

import { API_BASE_URL } from "../config/api";

export default function Dashboard() {
  const navigate = useNavigate();

  // ================================
  // STATE
  // ================================

  const [user, setUser] = useState(null);
  const [urls, setUrls] = useState([]);

  const [actualUrl, setActualUrl] = useState("");
  const [customUrl, setCustomUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [generatedUrl, setGeneratedUrl] = useState(null);

  const [copiedId, setCopiedId] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Change this later after deployment
  const SHORT_URL_BASE = "http://localhost:3000/api";

  // ================================
  // FETCH DASHBOARD DATA
  // ================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [profileResponse, urlsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/user/profile`, {
          credentials: "include",
        }),

        fetch(`${API_BASE_URL}/analysis/getMyUrls`, {
          credentials: "include",
        }),
      ]);

      // User is not authenticated
      if (
        profileResponse.status === 401 ||
        urlsResponse.status === 401
      ) {
        navigate("/");
        return;
      }

      const profileData = await profileResponse.json();
      const urlsData = await urlsResponse.json();

      if (!profileResponse.ok) {
        throw new Error(
          profileData.message || "Unable to load profile"
        );
      }

      if (!urlsResponse.ok) {
        throw new Error(
          urlsData.message || "Unable to load URLs"
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

  // ================================
  // INITIAL LOAD
  // ================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ================================
  // TOTAL CLICKS
  // ================================

  const totalClicks = urls.reduce((sum, url) => {
    return sum + (url.totalClick || 0);
  }, 0);

  // ================================
  // ACTIVE LINKS
  // ================================

  const activeLinks = urls.filter((url) => {
    if (!url.isActive) return false;

    if (!url.expiredAt) return true;

    return new Date(url.expiredAt) > new Date();
  }).length;

  // ================================
  // GENERATE URL
  // ================================

  const handleGenerate = async (e) => {
    e.preventDefault();

    try {
      setGenerating(true);
      setError("");
      setSuccess("");
      setGeneratedUrl(null);

      const body = {
        actualurl: actualUrl,
      };

      // Premium users only
      if (
        user?.plan === "premium" &&
        customUrl.trim()
      ) {
        body.customurl = customUrl.trim();
      }

      const response = await fetch(
        `${API_BASE_URL}/url/generate`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to create URL"
        );
      }

      setGeneratedUrl(data.url);

      // Add newly created URL at top
      setUrls((previousUrls) => [
        data.url,
        ...previousUrls,
      ]);

      setActualUrl("");
      setCustomUrl("");

      setSuccess("Short URL created successfully");
    } catch (error) {
      setError(error.message);
    } finally {
      setGenerating(false);
    }
  };

  // ================================
  // DELETE URL
  // ================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this URL?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_BASE_URL}/url/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to delete URL"
        );
      }

      setUrls((previousUrls) =>
        previousUrls.filter(
          (url) => url._id !== id
        )
      );

      if (generatedUrl?._id === id) {
        setGeneratedUrl(null);
      }

      setSuccess("URL deleted successfully");
    } catch (error) {
      setError(error.message);
    }
  };

  // ================================
  // COPY URL
  // ================================

  const handleCopy = async (shortCode, id) => {
    try {
      const shortUrl = `${SHORT_URL_BASE}/${shortCode}`;

      await navigator.clipboard.writeText(shortUrl);

      setCopiedId(id);

      setTimeout(() => {
        setCopiedId(null);
      }, 1500);
    } catch (error) {
      setError("Unable to copy URL");
    }
  };

  // ================================
  // LOGOUT
  // ================================

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      navigate("/");
    }
  };

  // ================================
  // DATE FORMATTER
  // ================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ================================
  // LOADING SCREEN
  // ================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2
            size={35}
            className="animate-spin text-indigo-600"
          />

          <p className="text-sm text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ================================
  // DASHBOARD
  // ================================

  return (
    <div className="min-h-screen bg-[#f7f8fc]">

      {/* ===================================== */}
      {/* MOBILE OVERLAY */}
      {/* ===================================== */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      {/* ===================================== */}
      {/* SIDEBAR */}
      {/* ===================================== */}

      <aside
        className={`
          fixed left-0 top-0 z-40
          flex h-screen w-64 flex-col
          bg-[#081426] text-white
          transition-transform duration-300

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:translate-x-0
        `}
      >

        {/* LOGO */}

        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
              <Link2 size={27} />
            </div>

            <span className="text-xl font-bold">
              Linkify
            </span>

          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X size={22} />
          </button>

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 space-y-2 px-4 py-6">

          <button className="flex w-full items-center gap-3 rounded-xl bg-indigo-600 px-4 py-3 text-left text-sm font-medium">

            <LayoutDashboard size={19} />

            Dashboard

          </button>

          <button
  onClick={() => navigate("/links")}
  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
>
  <Link2 size={19} />
  My Links
</button>

          <button
  onClick={() => navigate("/analytics")}
  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
>
  <BarChart3 size={19} />
  Analytics
</button>

          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">

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

      {/* ===================================== */}
      {/* MAIN */}
      {/* ===================================== */}

      <main className="min-h-screen lg:ml-64">

        {/* ===================================== */}
        {/* TOPBAR */}
        {/* ===================================== */}

        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">

          <div className="flex items-center gap-4">

            <button
              onClick={() =>
                setSidebarOpen(true)
              }
              className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div>

              <p className="text-sm text-slate-500">
                Welcome back
              </p>

              <h1 className="text-lg font-bold text-slate-900">
                {user?.name || "User"}
              </h1>

            </div>

          </div>

          {/* PROFILE */}

          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">

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
                .toUpperCase() || "U"}

            </div>

          </div>

        </header>

        {/* ===================================== */}
        {/* CONTENT */}
        {/* ===================================== */}

        <div className="mx-auto max-w-7xl p-5 sm:p-8">

          {/* TITLE */}

          <div className="mb-8">

            <h2 className="text-3xl font-bold tracking-tight text-slate-900">

              Dashboard

            </h2>

            <p className="mt-1 text-slate-500">

              Create, manage and track your short links.

            </p>

          </div>

          {/* ===================================== */}
          {/* STATS */}
          {/* ===================================== */}

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

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

                  <MousePointerClick size={23} />

                </div>

              </div>

            </div>

            {/* ACTIVE LINKS */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Active Links
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {activeLinks}
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                  <Check size={23} />

                </div>

              </div>

            </div>

          </div>

          {/* ===================================== */}
          {/* MESSAGES */}
          {/* ===================================== */}

          {error && (
            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
              {success}
            </div>
          )}

          {/* ===================================== */}
          {/* CREATE URL */}
          {/* ===================================== */}

          <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                <Plus size={22} />

              </div>

              <div>

                <h3 className="text-lg font-bold text-slate-900">
                  Create a Short Link
                </h3>

                <p className="text-sm text-slate-500">
                  Paste your long URL and create a shareable link.
                </p>

              </div>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleGenerate}
              className="mt-6"
            >

              <label className="mb-2 block text-sm font-medium text-slate-700">

                Destination URL

              </label>

              <input
                required
                type="url"
                placeholder="https://example.com/very-long-url"
                value={actualUrl}
                onChange={(e) =>
                  setActualUrl(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />

              {/* PREMIUM CUSTOM URL */}

              {user?.plan === "premium" && (

                <div className="mt-5">

                  <label className="mb-2 block text-sm font-medium text-slate-700">

                    Custom Alias

                    <span className="ml-2 text-xs font-normal text-slate-400">
                      Optional
                    </span>

                  </label>

                  <div className="flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">

                    <div className="flex items-center bg-slate-100 px-4 text-sm text-slate-500">

                      linkify/

                    </div>

                    <input
                      type="text"
                      placeholder="my-link"
                      value={customUrl}
                      onChange={(e) =>
                        setCustomUrl(
                          e.target.value
                        )
                      }
                      className="min-w-0 flex-1 px-4 py-3.5 outline-none"
                    />

                  </div>

                </div>

              )}

              <div className="mt-5 flex justify-end">

                <button
                  disabled={generating}
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {generating ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      Creating...
                    </>
                  ) : (
                    <>
                      <Link2 size={18} />

                      Shorten URL
                    </>
                  )}

                </button>

              </div>

            </form>

            {/* ===================================== */}
            {/* GENERATED URL */}
            {/* ===================================== */}

            {generatedUrl && (

              <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5">

                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">

                  Your short link is ready

                </p>

                <div className="mt-3 flex flex-col gap-3 sm:flex-row">

                  <div className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-lg border border-emerald-200 bg-white px-4 py-3 font-medium text-indigo-600">

                    {SHORT_URL_BASE}/
                    {generatedUrl.shortCode}

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        generatedUrl.shortCode,
                        generatedUrl._id
                      )
                    }
                    className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 font-medium text-white"
                  >

                    {copiedId ===
                    generatedUrl._id ? (
                      <>
                        <Check size={17} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={17} />
                        Copy
                      </>
                    )}

                  </button>

                </div>

              </div>

            )}

          </section>

          {/* ===================================== */}
          {/* RECENT LINKS */}
          {/* ===================================== */}

          <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <h3 className="text-lg font-bold text-slate-900">
                  Recent Links
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Your recently created short links.
                </p>

              </div>

            </div>

            {/* EMPTY STATE */}

            {urls.length === 0 ? (

              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

                  <Link2 size={25} />

                </div>

                <h4 className="mt-4 font-semibold text-slate-800">
                  No links yet
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Create your first short link above.
                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[800px]">

                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">

                    <tr>

                      <th className="px-6 py-4 font-semibold">
                        Destination
                      </th>

                      <th className="px-6 py-4 font-semibold">
                        Short Link
                      </th>

                      <th className="px-6 py-4 font-semibold">
                        Clicks
                      </th>

                      <th className="px-6 py-4 font-semibold">
                        Created
                      </th>

                      <th className="px-6 py-4 text-right font-semibold">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {urls
                      .slice(0, 5)
                      .map((url) => (

                        <tr
                          key={url._id}
                          className="transition hover:bg-slate-50"
                        >

                          {/* DESTINATION */}

                          <td className="max-w-[260px] px-6 py-4">

                            <a
                              href={url.actualUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="block overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-slate-700 hover:text-indigo-600"
                            >
                              {url.actualUrl}
                            </a>

                          </td>

                          {/* SHORT URL */}

                          <td className="px-6 py-4">

                            <span className="text-sm font-semibold text-indigo-600">

                              {url.shortCode}

                            </span>

                          </td>

                          {/* CLICKS */}

                          <td className="px-6 py-4">

                            <span className="text-sm font-semibold text-slate-700">

                              {url.totalClick || 0}

                            </span>

                          </td>

                          {/* CREATED */}

                          <td className="px-6 py-4 text-sm text-slate-500">

                            {formatDate(
                              url.createdAt
                            )}

                          </td>

                          {/* ACTIONS */}

                          <td className="px-6 py-4">

                            <div className="flex justify-end gap-2">

                              {/* COPY */}

                              <button
                                title="Copy"
                                onClick={() =>
                                  handleCopy(
                                    url.shortCode,
                                    url._id
                                  )
                                }
                                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                              >

                                {copiedId ===
                                url._id ? (
                                  <Check
                                    size={17}
                                  />
                                ) : (
                                  <Copy
                                    size={17}
                                  />
                                )}

                              </button>

                              {/* OPEN */}

                              <a
                                title="Open"
                                href={`${SHORT_URL_BASE}/${url.shortCode}`}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                              >

                                <ExternalLink
                                  size={17}
                                />

                              </a>

                              {/* DELETE */}

                              <button
                                title="Delete"
                                onClick={() =>
                                  handleDelete(
                                    url._id
                                  )
                                }
                                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                              >

                                <Trash2
                                  size={17}
                                />

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

    </div>
  );
}