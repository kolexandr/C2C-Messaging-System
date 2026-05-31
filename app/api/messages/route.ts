import Pusher from "pusher";
import { prisma } from "../../lib/prisma";
import { auth } from "@/app/lib/auth";
import { NextResponse } from "next/server";

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    useTLS: true,
});

 
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { conversationId, text } = await req.json();

  if (!text?.trim()) return NextResponse.json({ error: "Message is empty" }, { status: 400 });

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isMember =
    conversation.buyerId === session.user.id ||
    conversation.sellerId === session.user.id;

  if (!isMember) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [message] = await prisma.$transaction([
    prisma.message.create({
      data: {
        conversationId,
        senderId: session.user.id,
        text: text.trim(),
      },
      include: {
        sender: { select: { id: true, name: true } },
      },
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }, // keeps conversations sorted correctly
    }),
  ]);

  await pusher.trigger(`conversation-${conversationId}`, "new-message", message);

  return NextResponse.json(message, { status: 201 });
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) return NextResponse.json({ error: "Missing conversationId" }, { status: 400 });

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isMember =
    conversation.buyerId === session.user.id ||
    conversation.sellerId === session.user.id;

  if (!isMember) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(messages);
}