import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const application = await prisma.application.findUnique({
    where: { trackingCode: code },
    include: { campaign: { select: { landingUrl: true, status: true } } },
  });

  if (!application || application.campaign.status !== "ACTIVE") {
    return Response.redirect(new URL("/", _req.url));
  }

  // 클릭 수 증가 (await 없이 fire-and-forget — 리다이렉트 속도 우선)
  prisma.application.update({
    where: { id: application.id },
    data: { clickCount: { increment: 1 } },
  }).catch(() => {});

  return Response.redirect(application.campaign.landingUrl);
}
