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

  const campaigns = [
    {
      id: "seed-campaign-legal-01",
      title: "법무법인 정윤 | 개인회생 무료상담",
      category: "LEGAL",
      description: "부채 5천만원 이상, 소득이 있는 분을 대상으로 개인회생·파산 전문 법무법인의 무료상담을 연결합니다. 실제 상담 연결 완료 건에 대해 건당 지급합니다.",
      requirement: "실명 상담 신청 필수 / 허위·중복 DB 적발 시 미지급 / 상담원 통화 연결 완료 후 확정",
      targetAction: "상담신청",
      landingUrl: "https://example.com/legal-landing",
      advertiserPrice: 120_000, publisherPrice: 80_000,
      budget: 10_000_000, approvalRate: 75, minGrade: "BRONZE",
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=450&fit=crop",
    },
    {
      id: "seed-campaign-insurance-01",
      title: "현대해상 태아보험 | 임산부 무료 설계",
      category: "INSURANCE",
      description: "임신 중인 분들을 대상으로 현대해상 태아보험 무료 설계 서비스를 제공합니다. 설계 신청 완료 건당 지급되는 안정적인 보험 캠페인입니다.",
      requirement: "임신 중인 분 대상 / 실명 신청 필수 / 중복 신청 불가",
      targetAction: "상담신청",
      landingUrl: "https://example.com/insurance-landing",
      advertiserPrice: 65_000, publisherPrice: 45_000,
      budget: 8_000_000, approvalRate: 88, minGrade: "BRONZE",
      imageUrl: "https://images.unsplash.com/photo-1609220136736-443140cfeaa8?w=800&h=450&fit=crop",
    },
    {
      id: "seed-campaign-diet-01",
      title: "서재걸박사 면역다이어트 | 체험단 모집",
      category: "HEALTHCARE",
      description: "면역 기능을 강화하면서 건강하게 살을 빼는 면역다이어트 프로그램 체험단을 모집합니다. 체험 신청 완료 건당 지급합니다.",
      requirement: "20~50대 여성 / BMI 23 이상 / 온라인 신청 완료 기준",
      targetAction: "회원가입",
      landingUrl: "https://example.com/diet-landing",
      advertiserPrice: 55_000, publisherPrice: 37_000,
      budget: 6_000_000, approvalRate: 100, minGrade: "BRONZE",
      imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=450&fit=crop",
    },
    {
      id: "seed-campaign-loan-01",
      title: "햇살론 대출 비교 | 저신용자 전문",
      category: "LOAN",
      description: "신용등급 4~7등급 대상 정부지원 햇살론 대출 비교 서비스입니다. 대출 신청 완료 건당 높은 단가를 지급합니다.",
      requirement: "만 19세 이상 성인 / 재직자 또는 사업자 / 신청 완료 기준",
      targetAction: "상담신청",
      landingUrl: "https://example.com/loan-landing",
      advertiserPrice: 50_000, publisherPrice: 32_000,
      budget: 7_000_000, approvalRate: 82, minGrade: "BRONZE",
      imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop",
    },
    {
      id: "seed-campaign-clean-01",
      title: "모두클린 | 전국 청소업체 연결 플랫폼",
      category: "OTHER",
      description: "전국 검증된 청소업체를 연결해주는 모두클린 서비스 이용 신청 건당 지급합니다. 승인율 100%, 초보자도 쉽게 수익을 낼 수 있는 캠페인입니다.",
      requirement: "실제 청소 서비스 신청 희망자 / 중복 신청 불가",
      targetAction: "견적신청",
      landingUrl: "https://example.com/clean-landing",
      advertiserPrice: 12_000, publisherPrice: 8_000,
      budget: 3_000_000, approvalRate: 100, minGrade: "BRONZE",
      imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=450&fit=crop",
    },
    {
      id: "seed-campaign-plastic-01",
      title: "강남 BK성형외과 | 쌍꺼풀 무료상담",
      category: "PLASTIC",
      description: "강남 유명 성형외과 쌍꺼풀·눈매교정 무료 상담 신청 건당 지급합니다. SNS 채널 보유자에게 적합한 고단가 성형 캠페인입니다.",
      requirement: "만 18세 이상 / 상담 신청 완료 기준 / 중복 신청 불가",
      targetAction: "상담신청",
      landingUrl: "https://example.com/plastic-landing",
      advertiserPrice: 90_000, publisherPrice: 60_000,
      budget: 9_000_000, approvalRate: 70, minGrade: "SILVER",
      imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=450&fit=crop",
    },
    {
      id: "seed-campaign-realestate-01",
      title: "무촌철거 | 무료 철거 비용 견적",
      category: "REALESTATE",
      description: "전국 1위 철거 전문 업체 무촌철거의 무료 비용 견적 신청 건당 지급합니다. 승인율 100%로 안정적인 수익이 가능합니다.",
      requirement: "건물 철거 예정자 / 견적 신청 완료 기준",
      targetAction: "견적신청",
      landingUrl: "https://example.com/demolition-landing",
      advertiserPrice: 35_000, publisherPrice: 24_000,
      budget: 4_000_000, approvalRate: 100, minGrade: "BRONZE",
      imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=450&fit=crop",
    },
    {
      id: "seed-campaign-edu-01",
      title: "패스트캠퍼스 | 데이터분석 부트캠프",
      category: "EDUCATION",
      description: "직장인을 위한 주말 데이터분석 부트캠프 수강 신청 건당 지급합니다. IT/교육 채널 운영자에게 적합한 캠페인입니다.",
      requirement: "만 20세 이상 / 수강 신청 완료 기준 / 중복 불가",
      targetAction: "회원가입",
      landingUrl: "https://example.com/edu-landing",
      advertiserPrice: 45_000, publisherPrice: 30_000,
      budget: 5_000_000, approvalRate: 92, minGrade: "BRONZE",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop",
    },
    {
      id: "seed-campaign-beauty-01",
      title: "닥터방기원 | 탈모 치료 무료 상담",
      category: "BEAUTY",
      description: "탈모 전문 클리닉 닥터방기원의 무료 상담 신청 건당 지급합니다. 30~50대 남성 타겟 채널에 특히 적합합니다.",
      requirement: "탈모 고민 성인 남녀 / 상담 신청 완료 기준",
      targetAction: "상담신청",
      landingUrl: "https://example.com/beauty-landing",
      advertiserPrice: 60_000, publisherPrice: 40_000,
      budget: 6_000_000, approvalRate: 85, minGrade: "BRONZE",
      imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=450&fit=crop",
    },
  ];

  for (const c of campaigns) {
    await prisma.campaign.upsert({
      where: { id: c.id },
      update: { imageUrl: c.imageUrl, status: "ACTIVE" },
      create: {
        id: c.id,
        advertiserId: advertiser.id,
        type: "CPA",
        status: "ACTIVE",
        startDate: new Date("2026-05-01"),
        endDate: new Date("2026-07-31"),
        usedBudget: 0,
        ...c,
        minGrade: c.minGrade as never,
        category: c.category as never,
      },
    });
  }

  console.log(`✅ 캠페인 ${campaigns.length}개 seed 완료`);
  console.log("─────────────────────────────────");
  console.log("관리자  : admin@maketica.kr       / Test1234!");
  console.log("광고주  : advertiser@maketica.kr  / Test1234!");
  console.log("마케터  : publisher@maketica.kr   / Test1234!");
  console.log("캠페인  : 법무법인 정윤 | 개인회생 무료상담 (ACTIVE)");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
