import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, password, phone, role, companyName } = body;

  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: "필수 항목을 모두 입력하세요." }, { status: 400 });
  }

  if (!["PUBLISHER", "ADVERTISER"].includes(role)) {
    return NextResponse.json({ error: "올바르지 않은 역할입니다." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "이미 사용 중인 이메일입니다." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      phone: phone || null,
      role,
    },
  });

  if (role === "ADVERTISER") {
    await prisma.advertiserProfile.create({
      data: {
        userId: user.id,
        companyName: companyName || name,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
