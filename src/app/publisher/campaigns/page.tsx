import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ApplyButton from "./ApplyButton";

const categoryLabel: Record<string, string> = {
  LOAN: "대출", INSURANCE: "보험", LEGAL: "개인회생/법률",
  PLASTIC: "성형/다이어트", BEAUTY: "뷰티/피부", HEALTHCARE: "건강/의료",
  EDUCATION: "교육/자격증", REALESTATE: "부동산", IT: "IT/앱/게임",
  FOOD: "식품", SHOPPING: "쇼핑", OTHER: "기타",
};

const gradeBadge: Record<string, string> = {
  BRONZE: "bg-amber-100 text-amber-700",
  SILVER: "bg-gray-100 text-gray-600",
  GOLD: "bg-yellow-100 text-yellow-700",
  PLATINUM: "bg-purple-100 text-purple-700",
};

export default async function PublisherCampaignsPage() {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { grade: true } });
  const gradeOrder = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];
  const userGradeIndex = gradeOrder.indexOf(user?.grade ?? "BRONZE");
  const eligibleGrades = gradeOrder.slice(0, userGradeIndex + 1) as never[];

  const [campaigns, myApplications] = await Promise.all([
    prisma.campaign.findMany({
      where: { status: "ACTIVE", minGrade: { in: eligibleGrades } },
      include: { _count: { select: { applications: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.application.findMany({
      where: { publisherId: userId },
      select: { campaignId: true },
    }),
  ]);

  const appliedIds = new Set(myApplications.map((a) => a.campaignId));

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">캠페인 탐색</h1>
        <p className="text-sm text-gray-500 mt-1">내 등급에 맞는 캠페인을 찾아 신청하세요. 신청 즉시 트래킹 링크가 발급됩니다.</p>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 px-6 py-20 text-center text-gray-400 text-sm">
          현재 진행 중인 캠페인이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {campaigns.map((campaign) => {
            const isApplied = appliedIds.has(campaign.id);
            return (
              <div key={campaign.id} className="bg-white rounded-xl border border-gray-100 p-6 hover:border-blue-200 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {categoryLabel[campaign.category] ?? campaign.category}
                      </span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {campaign.type}
                      </span>
                      {campaign.minGrade !== "BRONZE" && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${gradeBadge[campaign.minGrade]}`}>
                          {campaign.minGrade}+
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{campaign.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{campaign.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>목표: <span className="text-gray-600 font-medium">{campaign.targetAction}</span></span>
                      <span>마케터 {campaign._count.applications}명 참여 중</span>
                      {campaign.approvalRate != null && (
                        <span>승인율 <span className="text-green-600 font-medium">{campaign.approvalRate}%</span></span>
                      )}
                    </div>
                    {campaign.requirement && (
                      <p className="mt-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                        ⚠️ {campaign.requirement}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-gray-400 mb-0.5">건당 수익</p>
                    <p className="text-2xl font-bold text-blue-600 mb-3">
                      {campaign.publisherPrice.toLocaleString()}원
                    </p>
                    <ApplyButton campaignId={campaign.id} isApplied={isApplied} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
