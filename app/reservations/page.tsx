export default function ReservationsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Reservations</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Reservations</h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Signed-in users can view or manage reservations here.
        </p>
      </div>
    </main>
  );
}
