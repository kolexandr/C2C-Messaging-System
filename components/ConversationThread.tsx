"use client";

import { type FormEvent, useState } from "react";

type Message = {
  id: string;
  text: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
  };
};

type Props = {
  conversationId: string;
  currentUserId: string;
  otherUserName: string;
  listingTitle: string;
  initialMessages: Message[];
};

export default function ConversationThread({
  conversationId,
  currentUserId,
  otherUserName,
  listingTitle,
  initialMessages,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!text.trim()) {
      setError("Type a message before sending.");
      return;
    }

    setStatus("sending");
    setError("");

    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, text: text.trim() }),
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus("error");
      setError(data?.error || "Unable to send message.");
      return;
    }

    setMessages((current) => [...current, data]);
    setText("");
    setStatus("idle");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Conversation</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">{listingTitle}</h2>
            <p className="mt-1 text-sm text-slate-400">Messaging with {otherUserName}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-3xl p-5 ${message.sender.id === currentUserId ? "bg-emerald-500/10 text-white self-end" : "bg-slate-800/80 text-slate-100"}`}
          >
            <div className="flex items-center justify-between gap-4 text-sm text-slate-400">
              <span>{message.sender.name}</span>
              <span>{new Date(message.createdAt).toLocaleString()}</span>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
        <label className="space-y-3 text-sm text-slate-200">
          <span>Write a message</span>
          <textarea
            className="min-h-[120px] w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-800"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={`Ask ${otherUserName} about the listing...`}
          />
        </label>

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-4 inline-flex items-center rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : "Send message"}
        </button>
      </form>
    </div>
  );
}
