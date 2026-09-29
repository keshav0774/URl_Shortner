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
  Mail,
  Shield,
  Pencil,
  Save,
  X,
  Trash2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import { API_BASE_URL } from "../config/api";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  // ==========================================
  // FETCH PROFILE
  // ==========================================

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/user/profile`,
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
          data.message || "Unable to load profile"
        );
      }

      setUser(data.user);
      setName(data.user.name || "");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ==========================================
  // UPDATE PROFILE
  // ==========================================

  const handleUpdate = async () => {
    try {
      setError("");
      setSuccess("");

      if (!name.trim()) {
        setError("Name cannot be empty");
        return;
      }

      setUpdating(true);

      const response = await fetch(
        `${API_BASE_URL}/user/update`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            name: name.trim(),
          }),
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
            data.error ||
            "Unable to update profile"
        );
      }

      // Refresh profile so frontend always uses
      // actual backend data
      await fetchProfile();

      setEditMode(false);

      setSuccess(
        "Profile updated successfully"
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const cancelEdit = () => {
    setName(user?.name || "");
    setEditMode(false);
    setError("");
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
  // DELETE ACCOUNT
  // ==========================================

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/user/delete`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to delete account"
        );
      }

      navigate("/");
    } catch (error) {
      setError(error.message);
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

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
            Loading profile...
          </p>

        </div>

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

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          <button
            onClick={() =>
              navigate("/links")
            }
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <Link2 size={19} />
            My Links
          </button>

          <button
            onClick={() =>
              navigate("/analytics")
            }
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <BarChart3 size={19} />
            Analytics
          </button>

          <button
            className="flex w-full items-center gap-3 rounded-xl bg-indigo-600 px-4 py-3 text-left text-sm font-medium"
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

        {/* TOP BAR */}

        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">

          <div>

            <p className="text-sm text-slate-500">
              Account
            </p>

            <h1 className="font-bold text-slate-900">
              Profile
            </h1>

          </div>

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

        <div className="mx-auto max-w-5xl p-8">

          <div>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Your Profile
            </h2>

            <p className="mt-2 text-slate-500">
              Manage your account information and settings.
            </p>

          </div>

          {/* ERROR */}

          {error && (

            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">

              {error}

            </div>

          )}

          {/* SUCCESS */}

          {success && (

            <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">

              <CheckCircle2 size={18} />

              {success}

            </div>

          )}

          {/* ================================= */}
          {/* PROFILE HEADER */}
          {/* ================================= */}

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-5">

                {/* AVATAR */}

                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-3xl font-bold text-white shadow-lg shadow-indigo-100">

                  {user?.name
                    ?.charAt(0)
                    .toUpperCase()}

                </div>

                {/* NAME */}

                <div>

                  <h3 className="text-2xl font-bold text-slate-900">

                    {user?.name}

                  </h3>

                  <p className="mt-1 text-sm text-slate-500">

                    {user?.email}

                  </p>

                  {/* PLAN BADGE */}

                  <div className="mt-3 flex w-fit items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">

                    <Crown size={14} />

                    {user?.plan === "premium"
                      ? "Premium Plan"
                      : "Free Plan"}

                  </div>

                </div>

              </div>

              {!editMode && (

                <button
                  onClick={() =>
                    setEditMode(true)
                  }
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                >

                  <Pencil size={16} />

                  Edit Profile

                </button>

              )}

            </div>

          </section>

          {/* ================================= */}
          {/* ACCOUNT INFORMATION */}
          {/* ================================= */}

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-7 py-5">

              <h3 className="text-lg font-bold text-slate-900">

                Account Information

              </h3>

              <p className="mt-1 text-sm text-slate-500">

                Your personal account details.

              </p>

            </div>

            <div className="space-y-6 p-7">

              {/* NAME */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">

                  Name

                </label>

                {editMode ? (

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  />

                ) : (

                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                    <User
                      size={18}
                      className="text-slate-400"
                    />

                    <span className="font-medium text-slate-700">

                      {user?.name}

                    </span>

                  </div>

                )}

              </div>

              {/* EMAIL */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">

                  Email Address

                </label>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                  <Mail
                    size={18}
                    className="text-slate-400"
                  />

                  <span className="font-medium text-slate-700">

                    {user?.email}

                  </span>

                </div>

                <p className="mt-2 text-xs text-slate-400">

                  Email cannot be changed.

                </p>

              </div>

              {/* PLAN */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">

                  Current Plan

                </label>

                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                  <div className="flex items-center gap-3">

                    <Shield
                      size={18}
                      className="text-indigo-500"
                    />

                    <span className="font-medium capitalize text-slate-700">

                      {user?.plan || "free"}

                    </span>

                  </div>

                  {user?.plan !== "premium" && (

                    <span className="text-xs font-medium text-slate-400">

                      Custom aliases require Premium

                    </span>

                  )}

                </div>

              </div>

              {/* EDIT ACTIONS */}

              {editMode && (

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">

                  <button
                    onClick={cancelEdit}
                    disabled={updating}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >

                    <X size={16} />

                    Cancel

                  </button>

                  <button
                    onClick={handleUpdate}
                    disabled={updating}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {updating ? (
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <Save size={16} />
                    )}

                    {updating
                      ? "Saving..."
                      : "Save Changes"}

                  </button>

                </div>

              )}

            </div>

          </section>

          {/* ================================= */}
          {/* DANGER ZONE */}
          {/* ================================= */}

          <section className="mt-6 rounded-2xl border border-red-200 bg-white shadow-sm">

            <div className="border-b border-red-100 px-7 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500">

                  <AlertTriangle size={19} />

                </div>

                <div>

                  <h3 className="font-bold text-slate-900">

                    Danger Zone

                  </h3>

                  <p className="text-sm text-slate-500">

                    Irreversible account actions.

                  </p>

                </div>

              </div>

            </div>

            <div className="flex items-center justify-between p-7">

              <div>

                <p className="font-semibold text-slate-800">

                  Delete Account

                </p>

                <p className="mt-1 text-sm text-slate-500">

                  Permanently delete your Linkify account.

                </p>

              </div>

              <button
                onClick={() =>
                  setShowDeleteModal(true)
                }
                className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >

                <Trash2 size={16} />

                Delete Account

              </button>

            </div>

          </section>

        </div>

      </main>

      {/* ================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ================================= */}

      {showDeleteModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-5 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">

            {/* ICON */}

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">

              <AlertTriangle size={23} />

            </div>

            {/* TITLE */}

            <h2 className="mt-5 text-xl font-bold text-slate-900">

              Delete your account?

            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">

              This action cannot be undone. Your
              account will be permanently deleted.

            </p>

            {/* BUTTONS */}

            <div className="mt-7 flex justify-end gap-3">

              <button
                onClick={() =>
                  setShowDeleteModal(false)
                }
                disabled={deleting}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >

                Cancel

              </button>

              <button
                onClick={
                  handleDeleteAccount
                }
                disabled={deleting}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {deleting ? (

                  <Loader2
                    size={16}
                    className="animate-spin"
                  />

                ) : (

                  <Trash2 size={16} />

                )}

                {deleting
                  ? "Deleting..."
                  : "Delete Account"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}