"use client";

import { FormEvent, useState } from "react";

export default function CreateListingForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const parsedPrice = Number(price);

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setStatus("error");
      setMessage("Price must be a valid number greater than 0.");
      return;
    }

    const response = await fetch("/api/listings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        price: parsedPrice,
        imageUrl,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus("error");
      setMessage(data?.error || "Unable to create product.");
      return;
    }

    setStatus("success");
    setMessage("Product created successfully.");
    setTitle("");
    setDescription("");
    setPrice("");
    setImageUrl("");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-200">
          <span>Title</span>
          <input
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-800"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Short product name"
            required
          />
        </label>

        <label className="space-y-2 text-sm text-slate-200">
          <span>Price</span>
          <input
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-800"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="49.99"
            type="number"
            min="0"
            step="0.01"
            required
          />
        </label>
      </div>

      <label className="space-y-2 text-sm text-slate-200">
        <span>Description</span>
        <textarea
          className="min-h-[120px] w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-800"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Tell buyers what makes this product special."
          required
        />
      </label>

      <label className="space-y-2 text-sm text-slate-200">
        <span>Image URL</span>
        <input
          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-800"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          placeholder="https://example.com/image.jpg"
          type="url"
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Saving..." : "Create product"}
        </button>

        {message ? (
          <p className={`text-sm ${status === "success" ? "text-emerald-300" : "text-rose-300"}`}>
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
