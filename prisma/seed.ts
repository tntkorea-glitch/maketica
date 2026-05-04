import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding...");

  // 광고주 유저
  const hash = await bcrypt.hash("Test1234!", 10);
  const advertiser = await prisma.user.upsert({
    where: { email: "advertiser@maketica.kr" },
    update: {},
    create: {
      email: "advertiser@maketica.kr",
      name: "법무법인 정윤",
      passwordHash: hash,
      role: "ADVERTISER",
    },
  });

  await prisma.advertiserProfile.upsert({
    where: { userId: advertiser.id },
    update: {},
    create: {
      userId: advertiser.id,
      companyName: "법무법인 정윤",
      businessNo: "123-45-67890",
      balance: 5_000_000,
    },
  });

  // 관리자 유저
  await prisma.user.upsert({
    where: { email: "admin@maketica.kr" },
    update: {},
    create: {
      email: "admin@maketica.kr",
      name: "운영팀",
      passwordHash: hash,
      role: "ADMIN",
    },
  });

  // 테스트 마케터 유저
  await prisma.user.upsert({
    where: { email: "publisher@maketica.kr" },
    update: {},
    create: {
      email: "publisher@maketica.kr",
      name: "테스트 마케터",
      passwordHash: hash,
      role: "PUBLISHER",
      grade: "BRONZE",
    },
  });

  // 추천 캠페인 — 법무법인 정윤 | 개인회생 무료상담
  await prisma.campaign.upsert({
    where: { id: "seed-campaign-legal-01" },
    update: {},
    create: {
      id: "seed-campaign-legal-01",
      advertiserId: advertiser.id,
      title: "법무법인 정윤 | 개인회생 무료상담",
      category: "LEGAL",
      type: "CPA",
      status: "ACTIVE",
      description:
        "부채 5천만원 이상, 소득이 있는 분을 대상으로 개인회생·파산 전문 법무법인의 무료상담을 연결합니다. 실제 상담 연결 완료 건에 대해 건당 8만원을 지급합니다. 고단가 + 높은 승인율로 안정적인 수익이 가능한 캠페인입니다.",
      requirement:
        "실명 상담 신청 필수 / 허위·중복 DB 적발 시 미지급 / 상담원 통화 연결 완료 후 확정 / 1인 1회 신청만 인정",
      targetAction: "상담신청",
      landingUrl: "https://example.com/jeongyon-landing",
      advertiserPrice: 120_000,
      publisherPrice: 80_000,
      budget: 5_000_000,
      approvalRate: 75,
      minGrade: "BRONZE",
      startDate: new Date("2026-05-01"),
      endDate: new Date("2026-06-30"),
    },
  });

  console.log("✅ Seed complete");
  console.log("─────────────────────────────────");
  console.log("관리자  : admin@maketica.kr       / Test1234!");
  console.log("광고주  : advertiser@maketica.kr  / Test1234!");
  console.log("마케터  : publisher@maketica.kr   / Test1234!");
  console.log("캠페인  : 법무법인 정윤 | 개인회생 무료상담 (ACTIVE)");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
