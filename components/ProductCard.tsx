"use client";

import type { ReactNode } from "react";

export type ListingCard = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string | null;
  seller?: {
    id: string;
    name: string;
    email: string;
  };
};

type Props = {
  listing: ListingCard;
  actions?: ReactNode;
};

export default function ProductCard({ listing, actions }: Props) {
  return (
    <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
      {listing.imageUrl ? (
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="h-56 w-full rounded-3xl object-cover border border-white/10"
        />
      ) : (
        <div className="flex h-56 items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 text-slate-400">
          No image provided
        </div>
      )}

      <div className="mt-5 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">{listing.title}</h2>
            <p className="mt-1 text-sm text-slate-400">{listing.description}</p>
          </div>

          <div className="rounded-2xl bg-emerald-500/10 px-4 py-2 text-right text-sm font-semibold text-emerald-200">
            ${listing.price.toFixed(2)}
          </div>
        </div>

        {listing.seller ? (
          <p className="text-sm text-slate-400">
            Seller: <span className="font-medium text-white">{listing.seller.name}</span>
          </p>
        ) : null}

        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </article>
  );
}
