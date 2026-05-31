import { auth } from "@/app/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function POST(req: Request){
    const session = await auth();
    if (!session) return NextResponse.json({error: "Unauthorized"}, {status: 401});
    
    const { listingId } = await req.json();

    if (!listingId) {
      return NextResponse.json({ error: "Listing id is required" }, { status: 400 });
    }

    const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        select: { sellerId: true },
    });

    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

    if (listing.sellerId === session.user.id) {
        return NextResponse.json({ error: "Cannot message your own listing" }, { status: 400 });
    }

      const conversation = await prisma.conversation.upsert({
    where: {
      listingId_buyerId: {
        listingId,
        buyerId: session.user.id,
      },
    },
    create: {
      listingId,
      buyerId: session.user.id,
      sellerId: listing.sellerId,
    },
    update: {},
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, name: true } } },
      },
      listing: { select: { id: true, title: true, price: true, imageUrl: true } },
    },
  });

  return NextResponse.json(conversation);
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        { buyerId: session.user.id },
        { sellerId: session.user.id },
      ],
    },
    include: {
      listing: { select: { id: true, title: true, imageUrl: true } },
      buyer:  { select: { id: true, name: true} },
      seller: { select: { id: true, name: true} },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1, // only the last message for the preview
      },
    },
    orderBy: { updatedAt: "desc" }, // most recent conversation first
  });

  return NextResponse.json(conversations);
}