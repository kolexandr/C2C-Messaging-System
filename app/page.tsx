import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl shadow-black/30 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Auth flow</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Login and register pages</h1>
        <p className="mt-4 max-w-xl text-slate-300">
          Use these pages to test signup, signin, and the protected profile route.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="rounded-2xl bg-white px-5 py-3 font-medium text-slate-950 transition hover:bg-slate-200"
            href="/login"
          >
            Login
          </Link>
          <Link
            className="rounded-2xl border border-white/15 px-5 py-3 font-medium text-white transition hover:bg-white/10"
            href="/register"
          >
            Register
          </Link>
          <Link
            className="rounded-2xl border border-white/15 px-5 py-3 font-medium text-white transition hover:bg-white/10"
            href="/profile"
          >
            Profile
          </Link>
        </div>
      </div>
    </main>
  );
}
