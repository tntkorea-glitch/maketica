import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return Response.json({ error: "이메일을 입력해주세요." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  // 보안상 사용자가 없어도 같은 응답 반환
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1시간

    await prisma.verificationToken.upsert({
      where: { identifier_token: { identifier: `reset:${email}`, token: "" } },
      update: { token, expires },
      create: { identifier: `reset:${email}`, token, expires },
    }).catch(async () => {
      // 기존 토큰 삭제 후 재생성
      await prisma.verificationToken.deleteMany({ where: { identifier: `reset:${email}` } });
      await prisma.verificationToken.create({ data: { identifier: `reset:${email}`, token, expires } });
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    // 개발: 콘솔 출력 / 프로덕션: 이메일 발송 서비스 연동 필요
    if (process.env.NODE_ENV === "development") {
      console.log(`\n🔑 비밀번호 재설정 링크:\n${resetUrl}\n`);
    }
    // TODO: Resend 등 이메일 서비스 연동 시 여기서 발송
  }

  return Response.json({ ok: true });
}
