import { prisma } from "@/lib/prisma";
import CampaignActions from "./CampaignActions";

const categoryLabel: Record<string, string> = {
  LOAN: "대출", INSURANCE: "보험", LEGAL: "개인회생/법률",
  PLASTIC: "성형/다이어트", BEAUTY: "뷰티/피부", HEALTHCARE: "건강/의료",
  EDUCATION: "교육/자격증", REALESTATE: "부동산", IT: "IT/앱/게임",
  FOOD: "식품", SHOPPING: "쇼핑", OTHER: "기타",
};

export default async function AdminCampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = "PENDING" } = await searchParams;

  const campaigns = await prisma.campaign.findMany({
    where: { status: status as never },
    include: {
      advertiser: {
        select: {
          name: true,
          email: true,
          advertiserProfile: { select: { companyName: true } },
        },
      },
      _count: { select: { applications: true, conversions: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const tabs = [
    { value: "PENDING", label: "검토대기" },
    { value: "ACTIVE", label: "진행중" },
    { value: "PAUSED", label: "중지" },
    { value: "ENDED", label: "종료" },
    { value: "REJECTED", label: "반려" },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">캠페인 관리</h1>
        <p className="text-sm text-gray-500 mt-1">캠페인을 승인하면 마케터에게 노출됩니다.</p>
      </div>

      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <a
            key={tab.value}
            href={`?status=${tab.value}`}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              status === tab.value ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 px-6 py-16 text-center text-sm text-gray-400">
          해당 상태의 캠페인이 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-gray-900">{c.title}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {categoryLabel[c.category] ?? c.category}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{c.type}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    광고주: {c.advertiser.name ?? c.advertiser.email}
                    {c.advertiser.advertiserProfile?.companyName && ` (${c.advertiser.advertiserProfile.companyName})`}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{c.description}</p>
                  {c.requirement && (
                    <p className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg inline-block mb-2">
                      ⚠️ {c.requirement}
                    </p>
                  )}
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span>목표: <span className="text-gray-600">{c.targetAction}</span></span>
                    <span>신청자 {c._count.applications}명</span>
                    <span>전환 {c._count.conversions}건</span>
                    <span>예산 {c.budget.toLocaleString()}원</span>
                    {c.landingUrl && (
                      <a href={c.landingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate max-w-[200px]">
                        랜딩 URL ↗
                      </a>
                    )}
                  </div>
                </div>
                <div className="shrink-0 text-right space-y-1">
                  <p className="text-sm text-gray-500">광고주 <span className="font-bold text-gray-900">{c.advertiserPrice.toLocaleString()}원</span></p>
                  <p className="text-sm text-gray-500">마케터 <span className="font-bold text-blue-600">{c.publisherPrice.toLocaleString()}원</span></p>
                  <p className="text-xs text-green-600 font-medium">
                    마진 {(c.advertiserPrice - c.publisherPrice).toLocaleString()}원 ({Math.round((c.advertiserPrice - c.publisherPrice) / c.advertiserPrice * 100)}%)
                  </p>
                  {status === "PENDING" && (
                    <div className="mt-3">
                      <CampaignActions campaignId={c.id} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
