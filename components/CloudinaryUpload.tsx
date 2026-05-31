"use client";

import { ChangeEvent, useState } from "react";

type Props = {
  onImageUrlChange: (url: string) => void;
};

export default function CloudinaryUpload({ onImageUrlChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function uploadImage(file: File) {
    const formData = new FormData();

    formData.append("file", file);

    formData.append(
      "upload_preset",
      "marketplace-images"
    );

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dbwxcmbso/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || "Upload failed");
    }

    return data.secure_url;
  }

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const imageUrl = await uploadImage(file);

      setPreview(imageUrl);
      onImageUrlChange(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreview(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="flex cursor-pointer items-center justify-center rounded-3xl border-2 border-dashed border-white/10 bg-white/5 px-6 py-12 transition hover:border-slate-400 hover:bg-white/10">
        <div className="space-y-2 text-center">
          {preview ? (
            <>
              <img
                src={preview}
                alt="Preview"
                className="mx-auto h-32 w-32 rounded-2xl object-cover"
              />
              <p className="text-sm text-emerald-300">Image uploaded successfully</p>
            </>
          ) : (
            <>
              <svg
                className="mx-auto h-12 w-12 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33A3 3 0 0116.5 19.5H6.75z" />
              </svg>
              <p className="text-sm font-medium text-slate-200">
                {loading ? "Uploading..." : "Click to upload image"}
              </p>
              <p className="text-xs text-slate-400">PNG, JPG, GIF up to 10MB</p>
            </>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          disabled={loading}
          className="hidden"
        />
      </label>

      {error ? (
        <p className="text-sm text-rose-300">{error}</p>
      ) : null}
    </div>
  );
}
