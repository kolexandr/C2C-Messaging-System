import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../lib/auth";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Profile</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Authenticated</h1>
        <p className="mt-4 text-slate-300">
          You are signed in as <span className="font-medium text-white">{session.user?.name}</span>.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="rounded-2xl bg-white px-5 py-3 font-medium text-slate-950 transition hover:bg-slate-200"
            href="/"
          >
            Home
          </Link>
          <Link
            className="rounded-2xl border border-white/15 px-5 py-3 font-medium text-white transition hover:bg-white/10"
            href="/login"
          >
            Login again
          </Link>
        </div>
      </div>
    </main>
  );
}
