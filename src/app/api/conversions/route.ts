import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// GET /api/conversions?code=TRACKING_CODE&name=홍길동&phone=010-1234-5678&email=...
// 광고주 랜딩 페이지에서 전환 발생 시 호출하는 postback 엔드포인트
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const leadName = searchParams.get("name");
  const leadPhone = searchParams.get("phone");
  const leadEmail = searchParams.get("email");

  if (!code) {
    return Response.json({ error: "code is required" }, { status: 400 });
  }

  const application = await prisma.application.findUnique({
    where: { trackingCode: code },
    include: {
      campaign: {
        select: {
          id: true,
          status: true,
          advertiserPrice: true,
          publisherPrice: true,
          budget: true,
          usedBudget: true,
        },
      },
    },
  });

  if (!application) {
    return Response.json({ error: "invalid code" }, { status: 404 });
  }

  if (application.campaign.status !== "ACTIVE") {
    return Response.json({ error: "campaign not active" }, { status: 400 });
  }

  const remaining = application.campaign.budget - application.campaign.usedBudget;
  if (remaining < application.campaign.advertiserPrice) {
    return Response.json({ error: "budget exhausted" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? null;
  const userAgent = req.headers.get("user-agent") ?? null;
  const referer = req.headers.get("referer") ?? null;

  await prisma.conversion.create({
    data: {
      campaignId: application.campaign.id,
      applicationId: application.id,
      status: "PENDING",
      advertiserPrice: application.campaign.advertiserPrice,
      publisherPrice: application.campaign.publisherPrice,
      leadName: leadName ?? null,
      leadPhone: leadPhone ?? null,
      leadEmail: leadEmail ?? null,
      ipAddress: ip,
      userAgent,
      referer,
    },
  });

  return Response.json({ ok: true });
}

// POST /api/conversions — JSON body 방식 (선택적 지원)
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const url = new URL(req.url);
  if (body.code) url.searchParams.set("code", body.code);
  if (body.name) url.searchParams.set("name", body.name);
  if (body.phone) url.searchParams.set("phone", body.phone);
  if (body.email) url.searchParams.set("email", body.email);
  return GET(new NextRequest(url, req));
}
