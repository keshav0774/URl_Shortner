import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Link2,
  Zap,
  CheckCircle2,
  BarChart3,
  Settings,
  ShieldCheck,
  ArrowRight,
  Copy,
  X,
  Mail,
  Lock,
  User,
} from "lucide-react";

const API_BASE = "/api/short/user";

const features = [
  {
    icon: <Link2 size={27} />,
    title: "Short & Clean Links",
    text: "Turn long, messy URLs into short, shareable links.",
  },
  {
    icon: <BarChart3 size={27} />,
    title: "Detailed Analytics",
    text: "Track clicks, view charts and understand your links.",
  },
  {
    icon: <Settings size={27} />,
    title: "Custom Aliases",
    text: "Create your own custom short links with premium.",
  },
  {
    icon: <ShieldCheck size={27} />,
    title: "Secure & Reliable",
    text: "Built with authentication, rate limiting and secure link management.",
  },
];

export default function Home() {
  const navigate = useNavigate();

  // null | "login" | "signup"
  const [authModal, setAuthModal] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================================
  // OPEN AUTH MODAL
  // ================================

  const openModal = (type) => {
    setError("");

    setForm({
      name: "",
      email: "",
      password: "",
    });

    setAuthModal(type);
  };

  // ================================
  // CLOSE AUTH MODAL
  // ================================

  const closeModal = () => {
    if (loading) return;

    setAuthModal(null);
    setError("");

    setForm({
      name: "",
      email: "",
      password: "",
    });
  };

  // ================================
  // LOGIN / SIGNUP
  // ================================

  const handleAuth = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const endpoint =
        authModal === "login"
          ? `${API_BASE}/login`
          : `${API_BASE}/signup`;

      const body =
        authModal === "login"
          ? {
              email: form.email,
              password: form.password,
            }
          : {
              name: form.name,
              email: form.email,
              password: form.password,
            };

      const response = await fetch(endpoint, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        // IMPORTANT:
        // Backend JWT cookie ke liye
        credentials: "include",

        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Something went wrong"
        );
      }

      // Auth successful
      setAuthModal(null);

      setForm({
        name: "",
        email: "",
        password: "",
      });

      navigate("/dashboard");

    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  // ================================
  // SWITCH LOGIN / SIGNUP
  // ================================

  const switchAuthMode = () => {
    setError("");

    setForm({
      name: "",
      email: "",
      password: "",
    });

    setAuthModal(
      authModal === "login"
        ? "signup"
        : "login"
    );
  };

  return (
    <div className="min-h-screen bg-white text-slate-950">

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="relative overflow-hidden bg-[#071328] text-white">

        {/* Background Glow */}

        <div className="absolute -left-40 top-80 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute -right-32 top-20 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-3xl" />

        {/* ================================================= */}
        {/* NAVBAR */}
        {/* ================================================= */}

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">

          {/* LOGO */}

          <button
            onClick={() => window.scrollTo({
              top: 0,
              behavior: "smooth",
            })}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Link2
                size={30}
                strokeWidth={3}
              />
            </div>

            <span className="text-2xl font-bold tracking-tight">
              Linkify
            </span>
          </button>

          {/* NAV LINKS */}

          <div className="hidden items-center gap-12 text-[15px] text-slate-200 md:flex">

            <a
              href="#features"
              className="transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="transition hover:text-white"
            >
              How it works
            </a>

            <a
              href="#pricing"
              className="transition hover:text-white"
            >
              Pricing
            </a>

            <a
              href="#faq"
              className="transition hover:text-white"
            >
              FAQs
            </a>

          </div>

          {/* AUTH BUTTONS */}

          <div className="flex items-center gap-3">

            <button
              onClick={() => openModal("login")}
              className="rounded-xl border border-slate-600 px-5 py-2.5 text-sm font-medium transition hover:bg-white/10"
            >
              Login
            </button>

            <button
              onClick={() => openModal("signup")}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-violet-700/20 transition hover:scale-[1.02]"
            >
              Sign Up
            </button>

          </div>

        </nav>

        {/* ================================================= */}
        {/* HERO CONTENT */}
        {/* ================================================= */}

        <div className="relative z-10 mx-auto grid max-w-7xl gap-16 px-6 pb-24 pt-14 lg:grid-cols-2 lg:px-8 lg:pt-20">

          {/* ================= LEFT ================= */}

          <div className="flex flex-col justify-center">

            {/* BADGE */}

            <div className="mb-6 flex w-fit items-center gap-2 rounded-full border border-indigo-400/10 bg-indigo-500/15 px-5 py-2 text-sm text-indigo-100">

              <Zap size={16} />

              <span>Fast</span>
              <span>•</span>
              <span>Secure</span>
              <span>•</span>
              <span>Insightful</span>

            </div>

            {/* HEADING */}

            <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">

              Shorten Links.

              <span className="mt-2 block bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-400 bg-clip-text text-transparent">
                Track Everything.
              </span>

            </h1>

            {/* DESCRIPTION */}

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">

              Turn long URLs into short, memorable links and
              get powerful analytics to understand what's
              working.

            </p>

            {/* BUTTONS */}

            <div className="mt-8 flex flex-wrap gap-4">

              <button
                onClick={() => openModal("signup")}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-4 font-semibold shadow-xl shadow-indigo-950/30 transition hover:-translate-y-0.5"
              >

                Get Started Free

                <ArrowRight size={18} />

              </button>

              <a
                href="#features"
                className="rounded-xl border border-slate-500 px-7 py-4 font-semibold transition hover:bg-white/10"
              >
                View Demo
              </a>

            </div>

            {/* SMALL BENEFITS */}

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-300">

              <div className="flex items-center gap-2">

                <CheckCircle2 size={19} />

                Free to start

              </div>

              <div className="flex items-center gap-2">

                <CheckCircle2 size={19} />

                No credit card required

              </div>

              <div className="flex items-center gap-2">

                <CheckCircle2 size={19} />

                Link analytics

              </div>

            </div>

          </div>

          {/* ================= RIGHT MOCKUP ================= */}

          <div className="relative flex min-h-[470px] items-center justify-center">

            {/* LONG URL */}

            <div className="absolute left-4 top-16 w-[90%] rotate-2 rounded-2xl border border-slate-600/60 bg-slate-800/80 p-5 shadow-2xl backdrop-blur-xl">

              <p className="mb-2 text-sm text-slate-400">
                Long URL
              </p>

              <div className="overflow-hidden text-ellipsis whitespace-nowrap rounded-lg bg-slate-700/80 px-4 py-3 text-sm text-slate-200">

                https://www.youtube.com/watch?v=dQw4w9WgXcQ

              </div>

            </div>

            {/* SHORT URL */}

            <div className="absolute right-0 top-48 w-[92%] -rotate-1 rounded-2xl border border-slate-600/60 bg-slate-800/90 p-5 shadow-2xl backdrop-blur-xl">

              <p className="mb-2 text-sm text-slate-400">
                Short URL
              </p>

              <div className="flex overflow-hidden rounded-lg">

                <div className="flex-1 bg-slate-100 px-4 py-3 font-semibold text-indigo-700">

                  linkify.dev/abc123

                </div>

                <button
                  type="button"
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 px-5 font-semibold"
                >

                  <Copy size={17} />

                  Copy

                </button>

              </div>

            </div>

            {/* TOTAL CLICKS */}

            <div className="absolute bottom-5 right-3 w-[88%] rounded-2xl border border-slate-600/60 bg-slate-800/80 p-6 shadow-2xl backdrop-blur-xl">

              <p className="text-sm text-slate-400">
                Total Clicks
              </p>

              <div className="mt-2 flex items-end justify-between">

                <div className="flex items-center gap-3">

                  <span className="text-4xl font-bold">
                    12,482
                  </span>

                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-medium text-emerald-400">
                    ↑ 27%
                  </span>

                </div>

                {/* MINI GRAPH */}

                <div className="flex h-14 items-end gap-2">

                  {[
                    15,
                    27,
                    39,
                    31,
                    50,
                    43,
                    59,
                    55,
                    72,
                  ].map((height, index) => (

                    <div
                      key={index}
                      style={{
                        height: `${height}%`,
                      }}
                      className="w-2 rounded-t bg-gradient-to-t from-indigo-600 to-blue-400"
                    />

                  ))}

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================================================= */}
      {/* FEATURES */}
      {/* ================================================= */}

      <section
        id="features"
        className="bg-gradient-to-b from-slate-50 to-white px-6 py-20"
      >

        <div className="mx-auto max-w-7xl">

          {/* TITLE */}

          <div className="text-center">

            <h2 className="text-3xl font-bold sm:text-4xl">

              Why Choose Linkify?

            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-slate-500">

              More than just a URL shortener. Get analytics,
              custom links and a seamless experience.

            </p>

          </div>

          {/* FEATURE CARDS */}

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {features.map((feature) => (

              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                  {feature.icon}

                </div>

                <h3 className="text-lg font-bold">

                  {feature.title}

                </h3>

                <p className="mt-2 leading-6 text-slate-500">

                  {feature.text}

                </p>

              </div>

            ))}

          </div>

          {/* ================================================= */}
          {/* BOTTOM CTA */}
          {/* ================================================= */}

          <div className="mt-12 flex flex-col items-start justify-between gap-7 rounded-2xl bg-[#0c1930] px-8 py-8 text-white shadow-xl md:flex-row md:items-center">

            <div>

              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">

                Ready to get started?

              </p>

              <h3 className="mt-2 text-2xl font-bold">

                Start shortening smarter links today.

              </h3>

              <p className="mt-1 text-slate-300">

                Shorten. Share. Analyze. All in one place.

              </p>

            </div>

            <button
              onClick={() => openModal("signup")}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-4 font-semibold transition hover:scale-[1.02]"
            >

              Create Your Free Account

              <ArrowRight size={18} />

            </button>

          </div>

        </div>

      </section>

      {/* ================================================= */}
      {/* LOGIN / SIGNUP MODAL */}
      {/* ================================================= */}

      {authModal && (

        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm"
        >

          {/* MODAL */}

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl"
          >

            {/* CLOSE BUTTON */}

            <button
              type="button"
              onClick={closeModal}
              className="absolute right-5 top-5 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
            >

              <X size={20} />

            </button>

            {/* LOGO */}

            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

              <Link2 size={26} />

            </div>

            {/* TITLE */}

            <h2 className="text-3xl font-bold text-slate-900">

              {authModal === "login"
                ? "Welcome back"
                : "Create your account"}

            </h2>

            {/* DESCRIPTION */}

            <p className="mt-2 text-sm text-slate-500">

              {authModal === "login"
                ? "Login to manage and track your links."
                : "Start shortening and tracking your links."}

            </p>

            {/* ================================================= */}
            {/* FORM */}
            {/* ================================================= */}

            <form
              onSubmit={handleAuth}
              className="mt-7 space-y-4"
            >

              {/* ================= NAME ================= */}

              {authModal === "signup" && (

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">

                    Name

                  </label>

                  <div className="flex items-center rounded-xl border border-slate-200 px-4 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">

                    <User
                      size={18}
                      className="shrink-0 text-slate-400"
                    />

                    <input
                      required
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          name: e.target.value,
                        })
                      }
                      className="w-full bg-transparent px-3 py-3 text-slate-900 outline-none placeholder:text-slate-400"
                    />

                  </div>

                </div>

              )}

              {/* ================= EMAIL ================= */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">

                  Email

                </label>

                <div className="flex items-center rounded-xl border border-slate-200 px-4 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">

                  <Mail
                    size={18}
                    className="shrink-0 text-slate-400"
                  />

                  <input
                    required
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    className="w-full bg-transparent px-3 py-3 text-slate-900 outline-none placeholder:text-slate-400"
                  />

                </div>

              </div>

              {/* ================= PASSWORD ================= */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">

                  Password

                </label>

                <div className="flex items-center rounded-xl border border-slate-200 px-4 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">

                  <Lock
                    size={18}
                    className="shrink-0 text-slate-400"
                  />

                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value,
                      })
                    }
                    className="w-full bg-transparent px-3 py-3 text-slate-900 outline-none placeholder:text-slate-400"
                  />

                </div>

              </div>

              {/* ================= ERROR ================= */}

              {error && (

                <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">

                  {error}

                </p>

              )}

              {/* ================= SUBMIT ================= */}

              <button
                disabled={loading}
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading
                  ? "Please wait..."
                  : authModal === "login"
                  ? "Login"
                  : "Create Account"}

              </button>

            </form>

            {/* ================================================= */}
            {/* SWITCH LOGIN / SIGNUP */}
            {/* ================================================= */}

            <p className="mt-6 text-center text-sm text-slate-500">

              {authModal === "login"
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                type="button"
                onClick={switchAuthMode}
                className="ml-2 font-semibold text-indigo-600 transition hover:text-indigo-700"
              >

                {authModal === "login"
                  ? "Sign up"
                  : "Login"}

              </button>

            </p>

          </div>

        </div>

      )}

    </div>
  );
}
