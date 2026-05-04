import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ConversionFilter from "./ConversionFilter";

const statusMap: Record<string, { label: string; className: string }> = {
  PENDING:  { label: "확인 대기", className: "bg-yellow-100 text-yellow-700" },
  APPROVED: { label: "승인 확정", className: "bg-green-100 text-green-700" },
  REJECTED: { label: "반려",     className: "bg-red-100 text-red-600" },
  PAID:     { label: "정산 완료", className: "bg-blue-100 text-blue-600" },
};

const categoryLabel: Record<string, string> = {
  LOAN: "대출", INSURANCE: "보험", LEGAL: "개인회생/법률",
  PLASTIC: "성형/다이어트", BEAUTY: "뷰티/피부", HEALTHCARE: "건강/의료",
  EDUCATION: "교육/자격증", REALESTATE: "부동산", IT: "IT/앱/게임",
  FOOD: "식품", SHOPPING: "쇼핑", OTHER: "기타",
};

export default async function AdvertiserConversionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; campaignId?: string }>;
}) {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;
  const { status = "", campaignId = "" } = await searchParams;

  const myCampaigns = await prisma.campaign.findMany({
    where: { advertiserId: userId },
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
  });

  const conversions = await prisma.conversion.findMany({
    where: {
      campaign: { advertiserId: userId },
      ...(status ? { status: status as never } : {}),
      ...(campaignId ? { campaignId } : {}),
    },
    include: {
      campaign: { select: { title: true, category: true } },
      application: {
        include: { publisher: { select: { name: true, email: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  // 집계
  const stats = {
    total: conversions.length,
    pending: conversions.filter((c) => c.status === "PENDING").length,
    approved: conversions.filter((c) => c.status === "APPROVED").length,
    rejected: conversions.filter((c) => c.status === "REJECTED").length,
    totalCost: conversions
      .filter((c) => c.status === "APPROVED" || c.status === "PAID")
      .reduce((s, c) => s + c.advertiserPrice, 0),
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">전환 리포트</h1>
        <p className="text-sm text-gray-500 mt-1">캠페인별 전환 현황과 비용을 확인하세요.</p>
      </div>

      {/* 집계 카드 */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <StatCard label="전체 전환" value={stats.total} unit="건" />
        <StatCard label="확인 대기" value={stats.pending} unit="건" warn={stats.pending > 0} />
        <StatCard label="승인 확정" value={stats.approved} unit="건" />
        <StatCard label="총 광고비" value={stats.totalCost.toLocaleString()} unit="원" />
      </div>

      <ConversionFilter
        campaigns={myCampaigns}
        currentStatus={status}
        currentCampaignId={campaignId}
      />

      {/* 테이블 */}
      {conversions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 px-6 py-16 text-center text-sm text-gray-400">
          해당 조건의 전환 기록이 없습니다.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left">날짜</th>
                <th className="px-5 py-3 text-left">캠페인</th>
                <th className="px-5 py-3 text-left">마케터</th>
                <th className="px-5 py-3 text-left">리드 정보</th>
                <th className="px-5 py-3 text-right">광고비</th>
                <th className="px-5 py-3 text-right">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {conversions.map((c) => {
                const s = statusMap[c.status] ?? { label: c.status, className: "bg-gray-100 text-gray-600" };
                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-5 py-3 max-w-[160px]">
                      <p className="font-medium text-gray-900 truncate">{c.campaign.title}</p>
                      <p className="text-xs text-gray-400">{categoryLabel[c.campaign.category] ?? c.campaign.category}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-600 text-xs">
                      {c.application.publisher.name ?? c.application.publisher.email}
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-600">
                      {c.leadName && <span className="font-medium">{c.leadName}</span>}
                      {c.leadPhone && <span className="ml-1 text-gray-400">{c.leadPhone}</span>}
                      {!c.leadName && !c.leadPhone && <span className="text-gray-300">-</span>}
                    </td>
                    <td className="px-5 py-3 text-right font-medium">{c.advertiserPrice.toLocaleString()}원</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.className}`}>{s.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, unit, warn }: { label: string; value: number | string; unit: string; warn?: boolean }) {
  return (
    <div className={`rounded-xl border px-5 py-4 ${warn ? "border-orange-200 bg-orange-50" : "bg-white border-gray-100"}`}>
      <p className={`text-xs mb-1 ${warn ? "text-orange-600" : "text-gray-500"}`}>{label}</p>
      <p className={`text-xl font-bold ${warn ? "text-orange-700" : "text-gray-900"}`}>
        {value} <span className={`text-sm font-normal ${warn ? "text-orange-400" : "text-gray-400"}`}>{unit}</span>
      </p>
    </div>
  );
}
