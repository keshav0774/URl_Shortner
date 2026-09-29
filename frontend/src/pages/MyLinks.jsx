import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Link2,
  LayoutDashboard,
  BarChart3,
  User,
  LogOut,
  Copy,
  Trash2,
  ExternalLink,
  Search,
  Check,
  Loader2,
  Crown,
} from "lucide-react";

import { API_BASE_URL } from "../config/api";

const SHORT_URL_BASE = "http://localhost:3000/api";

export default function MyLinks() {
  const navigate = useNavigate();

  const [urls, setUrls] = useState([]);
  const [user, setUser] = useState(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  // =========================================
  // FETCH DATA
  // =========================================

  const fetchData = async () => {
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

  useEffect(() => {
    fetchData();
  }, []);

  // =========================================
  // DELETE
  // =========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this URL?"
    );

    if (!confirmDelete) return;

    try {
      setError("");

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
        previousUrls.filter((url) => url._id !== id)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  // =========================================
  // COPY
  // =========================================

  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(
        `${SHORT_URL_BASE}/${url.shortCode}`
      );

      setCopiedId(url._id);

      setTimeout(() => {
        setCopiedId(null);
      }, 1500);
    } catch {
      setError("Unable to copy URL");
    }
  };

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      navigate("/");
    }
  };

  // =========================================
  // SEARCH
  // =========================================

  const filteredUrls = urls.filter((url) => {
    const value = search.toLowerCase();

    return (
      url.actualUrl?.toLowerCase().includes(value) ||
      url.shortCode?.toLowerCase().includes(value)
    );
  });

  // =========================================
  // DATE
  // =========================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2
          size={35}
          className="animate-spin text-indigo-600"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc]">

      {/* ================================= */}
      {/* SIDEBAR */}
      {/* ================================= */}

      <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-[#081426] text-white">

        {/* LOGO */}

        <div
          onClick={() => navigate("/dashboard")}
          className="flex h-20 cursor-pointer items-center gap-3 border-b border-white/10 px-6"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
            <Link2 size={27} />
          </div>

          <span className="text-xl font-bold">
            Linkify
          </span>
        </div>

        {/* NAV */}

        <nav className="flex-1 space-y-2 px-4 py-6">

          <button
            onClick={() => navigate("/dashboard")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-white/5"
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          <button className="flex w-full items-center gap-3 rounded-xl bg-indigo-600 px-4 py-3 text-left text-sm font-medium">
            <Link2 size={19} />
            My Links
          </button>

          <button
            onClick={() => navigate("/analytics")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-white/5"
          >
            <BarChart3 size={19} />
            Analytics
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-white/5"
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
            <p className="mt-2 text-xs text-slate-400">
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

      <main className="min-h-screen ml-64">

        {/* TOPBAR */}

        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">

          <div>
            <p className="text-sm text-slate-500">
              Link Management
            </p>

            <h1 className="font-bold text-slate-900">
              My Links
            </h1>
          </div>

          <div className="flex items-center gap-3">

            <div className="text-right">

              <p className="text-sm font-semibold">
                {user?.name}
              </p>

              <p className="text-xs text-slate-500">
                {user?.email}
              </p>

            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 font-bold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

          </div>

        </header>

        {/* CONTENT */}

        <div className="mx-auto max-w-7xl p-8">

          <div className="flex items-end justify-between">

            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                My Links
              </h2>

              <p className="mt-2 text-slate-500">
                Manage all your shortened URLs in one place.
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 px-5 py-3">
              <span className="text-sm text-slate-500">
                Total Links
              </span>

              <span className="ml-3 text-lg font-bold text-indigo-600">
                {urls.length}
              </span>
            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* SEARCH */}

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="relative">

              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by destination URL or short code..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />

            </div>

          </div>

          {/* ================================= */}
          {/* LINKS TABLE */}
          {/* ================================= */}

          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {filteredUrls.length === 0 ? (

              <div className="flex flex-col items-center justify-center py-20">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Link2 size={25} />
                </div>

                <h3 className="mt-4 font-semibold text-slate-800">
                  {search
                    ? "No matching links"
                    : "No links yet"}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {search
                    ? "Try another search."
                    : "Create a link from your dashboard."}
                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[900px]">

                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">

                    <tr>
                      <th className="px-6 py-4">
                        Destination
                      </th>

                      <th className="px-6 py-4">
                        Short Link
                      </th>

                      <th className="px-6 py-4">
                        Clicks
                      </th>

                      <th className="px-6 py-4">
                        Status
                      </th>

                      <th className="px-6 py-4">
                        Created
                      </th>

                      <th className="px-6 py-4 text-right">
                        Actions
                      </th>
                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {filteredUrls.map((url) => {

                      const expired =
                        url.expiredAt &&
                        new Date(url.expiredAt) <
                          new Date();

                      const active =
                        url.isActive && !expired;

                      return (
                        <tr
                          key={url._id}
                          className="transition hover:bg-slate-50"
                        >

                          {/* DESTINATION */}

                          <td className="max-w-[300px] px-6 py-5">

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

                          {/* SHORT LINK */}

                          <td className="px-6 py-5">

                            <span className="font-semibold text-indigo-600">
                              {url.shortCode}
                            </span>

                          </td>

                          {/* CLICKS */}

                          <td className="px-6 py-5 font-semibold text-slate-700">
                            {url.totalClick || 0}
                          </td>

                          {/* STATUS */}

                          <td className="px-6 py-5">

                            {active ? (
                              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                                Active
                              </span>
                            ) : (
                              <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500">
                                Inactive
                              </span>
                            )}

                          </td>

                          {/* CREATED */}

                          <td className="px-6 py-5 text-sm text-slate-500">
                            {formatDate(url.createdAt)}
                          </td>

                          {/* ACTIONS */}

                          <td className="px-6 py-5">

                            <div className="flex justify-end gap-2">

                              {/* COPY */}

                              <button
                                onClick={() =>
                                  handleCopy(url)
                                }
                                title="Copy short URL"
                                className="rounded-lg border border-slate-200 p-2.5 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                              >
                                {copiedId === url._id ? (
                                  <Check size={17} />
                                ) : (
                                  <Copy size={17} />
                                )}
                              </button>

                              {/* OPEN */}

                              <a
                                href={`${SHORT_URL_BASE}/${url.shortCode}`}
                                target="_blank"
                                rel="noreferrer"
                                title="Open short URL"
                                className="rounded-lg border border-slate-200 p-2.5 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                              >
                                <ExternalLink size={17} />
                              </a>

                              {/* DELETE */}

                              <button
                                onClick={() =>
                                  handleDelete(url._id)
                                }
                                title="Delete URL"
                                className="rounded-lg border border-slate-200 p-2.5 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                              >
                                <Trash2 size={17} />
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    })}

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