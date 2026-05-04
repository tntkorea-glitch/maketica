import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, token, password } = await req.json();

  if (!email || !token || !password) {
    return Response.json({ error: "필수 값이 누락되었습니다." }, { status: 400 });
  }
  if (password.length < 8) {
    return Response.json({ error: "비밀번호는 8자 이상이어야 합니다." }, { status: 400 });
  }

  const record = await prisma.verificationToken.findFirst({
    where: { identifier: `reset:${email}`, token },
  });

  if (!record || record.expires < new Date()) {
    return Response.json({ error: "링크가 만료되었거나 유효하지 않습니다." }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 10);
  await prisma.$transaction([
    prisma.user.update({ where: { email }, data: { passwordHash: hash } }),
    prisma.verificationToken.deleteMany({ where: { identifier: `reset:${email}` } }),
  ]);

  return Response.json({ ok: true });
}
