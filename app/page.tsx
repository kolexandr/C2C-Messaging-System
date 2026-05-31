"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ProductCard, { ListingCard } from "@/components/ProductCard";

export default function Home() {
  const router = useRouter();
  const { status, data: session } = useSession();
  const [listings, setListings] = useState<ListingCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    async function loadListings() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/listings");
        const data = await response.json();

        if (!response.ok) {
          setError(data?.error || "Unable to load products.");
          return;
        }

        setListings(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    }

    loadListings();
  }, []);

  async function handleMessageSeller(listingId: string) {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    setActionError("");
    setActionLoading(listingId);

    const response = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId }),
    });

    const data = await response.json();
    setActionLoading(null);

    if (!response.ok) {
      setActionError(data?.error || "Unable to start a conversation.");
      return;
    }

    router.push("/messages");
  }

  const userId = session?.user?.id;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl shadow-black/30 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Available products</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Shop the marketplace</h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            Browse items created by sellers and discover products available for purchase. Use the dashboard to add your own listings.
          </p>
        </section>

        {actionError ? (
          <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
            {actionError}
          </div>
        ) : null}

        <section className="space-y-6">
          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-12 text-center text-slate-400">
              Loading products...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-12 text-center text-rose-200">{error}</div>
          ) : listings.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-12 text-center text-slate-400">
              No available products yet.
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {listings.map((listing) => (
                <ProductCard
                  key={listing.id}
                  listing={listing}
                  actions={
                    listing.seller?.id === userId ? (
                      <span className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                        Your listing
                      </span>
                    ) : status === "authenticated" ? (
                      <button
                        type="button"
                        onClick={() => void handleMessageSeller(listing.id)}
                        disabled={actionLoading === listing.id}
                        className="rounded-2xl border border-white/10 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {actionLoading === listing.id ? "Starting..." : "Message seller"}
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        className="rounded-2xl border border-white/10 bg-slate-700/70 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-600"
                      >
                        Sign in to message
                      </Link>
                    )
                  }
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
