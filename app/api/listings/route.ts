import { NextResponse } from "next/server";
import zod from "zod";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

const listingSchema = zod.object({
  title: zod.string().min(5, "Title is too short").max(30, "Title is too long"),
  description: zod.string().min(10, "Description is too short").max(100, "Description is too long"),
  price: zod.coerce.number().positive("Price must be greater than 0"),
  imageUrl: zod.string().url("Image URL must be valid").optional().or(zod.literal("")),
});

export async function GET() {
  const listings = await prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json(listings);
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const validated = listingSchema.safeParse(body);

  if (!validated.success) {
    return NextResponse.json(
      { error: validated.error.issues[0].message },
      { status: 400 },
    );
  }

  const { title, description, price, imageUrl } = validated.data;

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      price,
      imageUrl: imageUrl || null,
      sellerId: session.user.id,
    },
  });

  return NextResponse.json(listing, { status: 201 });
}
