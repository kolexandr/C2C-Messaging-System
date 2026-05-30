import { redirect } from "next/navigation";
import { auth } from "../lib/auth";
import ProfileListingManager from "@/components/ProfileListingManager";

function ProfileIcon() {
  return (
    <div className="grid h-16 w-16 place-items-center rounded-3xl bg-emerald-500/10 text-emerald-200">
      <svg viewBox="0 0 24 24" className="h-8 w-8 fill-none stroke-current stroke-[1.8]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20.25a7.5 7.5 0 0 1 15 0" />
      </svg>
    </div>
  );
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <ProfileIcon />
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Profile</p>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight">{session.user?.name}</h1>
                <p className="mt-2 text-slate-300">{session.user?.email}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-10 shadow-xl shadow-black/20">
          <ProfileListingManager userName={session.user?.name ?? "User"} userEmail={session.user?.email ?? ""} />
        </section>
      </div>
    </main>
  );
}
