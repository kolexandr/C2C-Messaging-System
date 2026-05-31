import { redirect } from "next/navigation";
import { auth } from "../lib/auth";
import CreateListingForm from "@/components/CreateListingForm";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl shadow-black/30 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Dashboard</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Create a new product</h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            Use this form to add a new listing to the marketplace. Your products will appear on your profile page for editing and removal.
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-10 shadow-xl shadow-black/20">
          <CreateListingForm />
        </section>
      </div>
    </main>
  );
}
