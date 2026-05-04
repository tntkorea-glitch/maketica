import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// Vercel Cron 또는 외부 스케줄러에서 매주 금요일 호출
// Authorization: Bearer {CRON_SECRET}
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 현재 주차 키 계산
  const now = new Date();
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  const currentWeek = `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, "0")}`;

  // 이전 주차의 PENDING Earning을 CONFIRMED로 변경
  const result = await prisma.earning.updateMany({
    where: {
      status: "PENDING",
      settleWeek: { not: currentWeek },
    },
    data: { status: "CONFIRMED", settledAt: new Date() },
  });

  return Response.json({
    ok: true,
    settled: result.count,
    currentWeek,
    message: `${result.count}건의 수익이 정산 확정되었습니다.`,
  });
}
