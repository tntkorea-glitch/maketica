import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdvertiserDashboard() {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  const [campaigns, profile] = await Promise.all([
    prisma.campaign.findMany({
      where: { advertiserId: userId },
      include: { _count: { select: { applications: true, conversions: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.advertiserProfile.findUnique({ where: { userId } }),
  ]);

  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE").length;
  const totalConversions = campaigns.reduce((sum, c) => sum + c._count.conversions, 0);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="text-sm text-gray-500 mt-1">광고주 센터에 오신 걸 환영합니다.</p>
        </div>
        <Link
          href="/advertiser/campaigns/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          + 캠페인 등록
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="예치금 잔액" value={`${(profile?.balance ?? 0).toLocaleString()}원`} />
        <StatCard label="진행 중 캠페인" value={`${activeCampaigns}개`} />
        <StatCard label="누적 전환" value={`${totalConversions}건`} />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">최근 캠페인</h2>
          <Link href="/advertiser/campaigns" className="text-xs text-blue-600 hover:underline">전체보기</Link>
        </div>
        {campaigns.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">
            등록된 캠페인이 없습니다.{" "}
            <Link href="/advertiser/campaigns/new" className="text-blue-600 hover:underline">
              첫 캠페인 등록하기
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left">캠페인명</th>
                <th className="px-6 py-3 text-left">상태</th>
                <th className="px-6 py-3 text-right">신청자</th>
                <th className="px-6 py-3 text-right">전환</th>
                <th className="px-6 py-3 text-right">광고주 단가</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">{c.title}</td>
                  <td className="px-6 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-6 py-3 text-right text-gray-600">{c._count.applications}</td>
                  <td className="px-6 py-3 text-right text-gray-600">{c._count.conversions}</td>
                  <td className="px-6 py-3 text-right font-medium">{c.advertiserPrice.toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 px-6 py-5">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
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
  return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${s.className}`}>{s.label}</span>;
}
