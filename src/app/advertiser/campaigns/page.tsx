import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdvertiserCampaignsPage() {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  const campaigns = await prisma.campaign.findMany({
    where: { advertiserId: userId },
    include: { _count: { select: { applications: true, conversions: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">캠페인 관리</h1>
        <Link
          href="/advertiser/campaigns/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          + 캠페인 등록
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 px-6 py-20 text-center">
          <p className="text-gray-400 text-sm mb-4">등록된 캠페인이 없습니다.</p>
          <Link href="/advertiser/campaigns/new" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
            첫 캠페인 등록하기
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left">캠페인명</th>
                <th className="px-6 py-3 text-left">카테고리</th>
                <th className="px-6 py-3 text-left">상태</th>
                <th className="px-6 py-3 text-right">신청자</th>
                <th className="px-6 py-3 text-right">전환</th>
                <th className="px-6 py-3 text-right">광고주 단가</th>
                <th className="px-6 py-3 text-right">마케터 단가</th>
                <th className="px-6 py-3 text-right">예산 사용</th>
                <th className="px-6 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 max-w-[200px] truncate">{c.title}</td>
                  <td className="px-6 py-4 text-gray-500">{categoryLabel(c.category)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">{c._count.applications}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{c._count.conversions}</td>
                  <td className="px-6 py-4 text-right font-medium">{c.advertiserPrice.toLocaleString()}원</td>
                  <td className="px-6 py-4 text-right text-blue-600 font-medium">{c.publisherPrice.toLocaleString()}원</td>
                  <td className="px-6 py-4 text-right text-gray-500">
                    {c.usedBudget.toLocaleString()} / {c.budget.toLocaleString()}원
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a href={`/advertiser/campaigns/${c.id}/edit`}
                      className="text-xs text-blue-600 hover:underline">수정</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    ACTIVE: { label: "진행중", className: "bg-green-100 text-green-700" },
    PENDING: { label: "검토중", className: "bg-yellow-100 text-yellow-700" },
    PAUSED: { label: "중지", className: "bg-gray-100 text-gray-600" },
    ENDED: { label: "종료", className: "bg-gray-100 text-gray-500" },
    REJECTED: { label: "반려", className: "bg-red-100 text-red-600" },
  };
  const s = map[status] ?? { label: status, className: "bg-gray-100 text-gray-600" };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.className}`}>{s.label}</span>;
}

function categoryLabel(cat: string) {
  const map: Record<string, string> = {
    LOAN: "대출", INSURANCE: "보험", LEGAL: "개인회생/법률",
    PLASTIC: "성형/다이어트", BEAUTY: "뷰티/피부", EDUCATION: "교육/자격증",
    HEALTHCARE: "건강/의료", REALESTATE: "부동산", IT: "IT/앱/게임",
    FOOD: "식품", SHOPPING: "쇼핑", OTHER: "기타",
  };
  return map[cat] ?? cat;
}
