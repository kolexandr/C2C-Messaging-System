import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import ConversationThread from "@/components/ConversationThread";

type Props = {
  params: Promise<{
    conversationId: string;
  }>;
};

export default async function ConversationPage(props: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const params = await props.params;
  const conversationId = params?.conversationId;

  if (!conversationId) {
    redirect("/messages");
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      listing: { select: { id: true, title: true, price: true, imageUrl: true } },
      buyer: { select: { id: true, name: true } },
      seller: { select: { id: true, name: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, name: true } } },
      },
    },
  });

  if (!conversation) {
    redirect("/messages");
  }

  if (
    conversation.buyerId !== session.user.id &&
    conversation.sellerId !== session.user.id
  ) {
    redirect("/messages");
  }

  const otherUser = conversation.buyerId === session.user.id ? conversation.seller : conversation.buyer;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Conversation</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight">{conversation.listing.title}</h1>
              <p className="mt-4 max-w-3xl text-slate-300">
                Chat with <span className="font-medium text-white">{otherUser?.name}</span> about this listing.
              </p>
            </div>
            <Link
              href="/messages"
              className="inline-flex items-center rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 transition hover:border-emerald-500/30 hover:bg-slate-800"
            >
              Back to inbox
            </Link>
          </div>
        </section>

        <ConversationThread
          conversationId={conversation.id}
          currentUserId={session.user.id}
          otherUserName={otherUser?.name ?? "Buyer"}
          listingTitle={conversation.listing.title}
          initialMessages={conversation.messages.map((message) => ({
            id: message.id,
            text: message.text,
            createdAt: message.createdAt.toISOString(),
            sender: { id: message.sender.id, name: message.sender.name },
          }))}
        />
      </div>
    </main>
  );
}
