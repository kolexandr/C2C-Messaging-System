import { NextResponse } from "next/server";
import zod from "zod";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { error } from "console";

const listingSchema = zod.object({
  title: zod.string().min(5, "Title is too short").max(30, "Title is too long"),
  description: zod.string().min(10, "Description is too short").max(100, "Description is too long"),
  price: zod.coerce.number().positive("Price must be greater than 0"),
  imageUrl: zod.string().url("Image URL must be valid").optional().or(zod.literal("")),
});

const listingPatchSchema = listingSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field is required" },
);

export async function GET(req:Request) {
  const { searchParams }  = new URL(req.url);
  const mine = searchParams.get("mine") === "1";

  if (mine) {
    const session = await auth();

    if (!session?.user?.id){
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const myListings = await prisma.listing.findMany({
      where: {sellerId: session.user.id},
      orderBy: {createdAt: "desc"}
    });

    return NextResponse.json(myListings)
  }

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

export async function PATCH(req:Request){
  const session = await auth();

  if (!session?.user?.id){
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Listing id is required" }, { status: 400 });
  }

  const body = await req.json();
  const validated = listingPatchSchema.safeParse(body);

  if (!validated.success){
    return NextResponse.json(
      { error: validated.error.issues[0].message },
      { status: 400 }
    );
  }

  const listing = await prisma.listing.findUnique({ where: { id } });

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  if (listing.sellerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updateData: Record<string, unknown> = { ...validated.data };

  if (Object.prototype.hasOwnProperty.call(updateData, "imageUrl")) {
    updateData.imageUrl = updateData.imageUrl === "" ? null : updateData.imageUrl;
  }

  const updatedListing = await prisma.listing.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(updatedListing);
}

export async function DELETE(req: Request){
  const session = await auth();

  if (!session?.user?.id){
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Listing id is required" }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({where: {id}});

  if (!listing){
    return NextResponse.json({error: "Listing not found"}, {status: 404});
  }

  if (listing.sellerId !== session.user.id){
    return NextResponse.json({error: "Forbidden"}, {status: 403})
  }

  await prisma.listing.delete({where: {id}});

  return NextResponse.json("Deleted successfully", {status:200});
}
