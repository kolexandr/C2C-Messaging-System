import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export default async function MessagesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ buyerId: session.user.id }, { sellerId: session.user.id }],
    },
    include: {
      listing: { select: { id: true, title: true, price: true, imageUrl: true } },
      buyer: { select: { id: true, name: true } },
      seller: { select: { id: true, name: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl shadow-black/30 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Messages</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Your conversations</h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            Review your active conversations and continue messaging sellers or buyers from the marketplace.
          </p>
        </section>

        {conversations.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-12 text-center text-slate-400">
            No conversations yet. Start messaging a seller from the home page.
          </div>
        ) : (
          <div className="grid gap-6">
            {conversations.map((conversation) => {
              const otherUser =
                conversation.buyerId === session.user.id ? conversation.seller : conversation.buyer;
              const lastMessage = conversation.messages[0];

              return (
                <Link
                  key={conversation.id}
                  href={`/messages/${conversation.id}`}
                  className="group block overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-6 transition hover:border-emerald-500/30 hover:bg-slate-800"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{otherUser?.name}</p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">{conversation.listing.title}</h2>
                    </div>
                    <div className="rounded-2xl bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200">
                      ${conversation.listing.price.toFixed(2)}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-300">
                    <p>
                      {conversation.buyerId === session.user.id ? "Seller" : "Buyer"}: <span className="font-medium text-white">{otherUser?.name}</span>
                    </p>
                    <p className="text-slate-400">
                      {lastMessage ? lastMessage.text : "No messages yet."}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                    <span>Open conversation</span>
                    <span className="rounded-full border border-white/10 px-3 py-1 transition group-hover:border-emerald-300 group-hover:text-emerald-200">
                      View
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
