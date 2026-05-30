"use client";

import { FormEvent, useEffect, useState } from "react";
import ProductCard, { ListingCard } from "./ProductCard";

type FormState = {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
};

type Props = {
  userName: string;
  userEmail: string;
};

export default function ProfileListingManager({ userName, userEmail }: Props) {
  const [listings, setListings] = useState<ListingCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
  });

  useEffect(() => {
    async function loadListings() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/listings?mine=1");
        const data = await response.json();

        if (!response.ok) {
          setError(data?.error || "Unable to load your products.");
          return;
        }

        setListings(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Unable to load your products.");
      } finally {
        setLoading(false);
      }
    }

    loadListings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) {
      return;
    }

    const response = await fetch(`/api/listings?id=${id}`, {
      method: "DELETE",
    });
    const data = await response.json();

    if (!response.ok) {
      setStatusMessage(data?.error || "Failed to delete product.");
      return;
    }

    setListings((current) => current.filter((listing) => listing.id !== id));
    setStatusMessage("Product deleted successfully.");
  };

  const startEdit = (listing: ListingCard) => {
    setEditingId(listing.id);
    setFormState({
      title: listing.title,
      description: listing.description,
      price: String(listing.price),
      imageUrl: listing.imageUrl ?? "",
    });
    setStatusMessage("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormState({ title: "", description: "", price: "", imageUrl: "" });
    setStatusMessage("");
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingId) {
      return;
    }

    const parsedPrice = Number(formState.price);

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setStatusMessage("Price must be a valid number greater than 0.");
      return;
    }

    const response = await fetch(`/api/listings?id=${editingId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: formState.title,
        description: formState.description,
        price: parsedPrice,
        imageUrl: formState.imageUrl,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setStatusMessage(data?.error || "Failed to update product.");
      return;
    }

    setListings((current) => current.map((item) => (item.id === data.id ? data : item)));
    setStatusMessage("Product updated successfully.");
    cancelEdit();
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Profile</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">{userName}</h2>
            <p className="mt-2 max-w-2xl text-slate-300">Your email address: {userEmail}</p>
          </div>
          <div className="rounded-3xl bg-white/5 px-5 py-4 text-right text-sm text-slate-200">
            <p className="text-slate-400">Your products</p>
            <p className="mt-2 text-3xl font-semibold text-white">{listings.length}</p>
          </div>
        </div>
      </div>

      {editingId ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
          <h3 className="text-xl font-semibold text-white">Edit product</h3>
          <form onSubmit={handleUpdate} className="mt-5 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-200">
                <span>Title</span>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-800"
                  value={formState.title}
                  onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))}
                  required
                />
              </label>
              <label className="space-y-2 text-sm text-slate-200">
                <span>Price</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-800"
                  value={formState.price}
                  onChange={(event) => setFormState((current) => ({ ...current, price: event.target.value }))}
                  required
                />
              </label>
            </div>
            <label className="space-y-2 text-sm text-slate-200">
              <span>Description</span>
              <textarea
                className="min-h-[120px] w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-800"
                value={formState.description}
                onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
                required
              />
            </label>
            <label className="space-y-2 text-sm text-slate-200">
              <span>Image URL</span>
              <input
                type="url"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-800"
                value={formState.imageUrl}
                onChange={(event) => setFormState((current) => ({ ...current, imageUrl: event.target.value }))}
              />
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-emerald-400"
                >
                  Save changes
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
              {statusMessage ? (
                <p className="text-sm text-emerald-300">{statusMessage}</p>
              ) : null}
            </div>
          </form>
        </div>
      ) : null}

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Your products</p>
            <h3 className="mt-2 text-3xl font-semibold text-white">Manage your listings</h3>
          </div>
          <p className="text-sm text-slate-400">Click edit to update or delete a product.</p>
        </div>

        {statusMessage && !editingId ? (
          <div className="rounded-3xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{statusMessage}</div>
        ) : null}

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-center text-slate-400">
            Loading your products...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8 text-center text-rose-200">{error}</div>
        ) : listings.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-center text-slate-400">
            No products found. Add new items from the dashboard.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {listings.map((listing) => (
              <ProductCard
                key={listing.id}
                listing={listing}
                actions={(
                  <>
                    <button
                      type="button"
                      onClick={() => startEdit(listing)}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(listing.id)}
                      className="rounded-2xl border border-rose-500 bg-rose-500/10 px-4 py-2 text-sm text-rose-100 transition hover:bg-rose-500/20"
                    >
                      Delete
                    </button>
                  </>
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
