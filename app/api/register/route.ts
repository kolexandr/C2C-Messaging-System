import { NextResponse } from 'next/server'
import { prisma } from "../../lib/prisma"
import bcrypt from "bcrypt";
import zod from "zod";

const registerSchema = zod.object({
  name: zod.string().min(3, "Name is required").max(25, "Name is too long"),
  email: zod.email("Invalid email"),
  password: zod.string().min(6, "Password must be at least 6 characters")
})

export async function POST(req: Request) {
  const payload = await req.json();
  const validated = registerSchema.safeParse(payload);

  if (!validated.success) {
    return NextResponse.json(
      { error: validated.error.issues[0].message },
      { status: 400 },
    );
  }

  const { name, email, password } = validated.data;
  const isExists = await prisma.user.findUnique({ where: { email } });

  if (isExists) {
    return NextResponse.json({ error: "User already exists." }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
