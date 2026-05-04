import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [pendingConversions, pendingCampaigns, totalUsers, activeCampaigns, weekEarnings] =
    await Promise.all([
      prisma.conversion.count({ where: { status: "PENDING" } }),
      prisma.campaign.count({ where: { status: "PENDING" } }),
      prisma.user.count(),
      prisma.campaign.count({ where: { status: "ACTIVE" } }),
      prisma.earning.aggregate({
        where: { status: "PENDING" },
        _sum: { amount: true },
      }),
    ]);

  const recentConversions = await prisma.conversion.findMany({
    where: { status: "PENDING" },
    include: {
      campaign: { select: { title: true } },
      application: { include: { publisher: { select: { name: true, email: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-sm text-gray-500 mt-1">플랫폼 전체 현황을 확인하세요.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <StatCard
          label="승인 대기 전환"
          value={pendingConversions}
          unit="건"
          href="/admin/conversions"
          urgent={pendingConversions > 0}
        />
        <StatCard
          label="승인 대기 캠페인"
          value={pendingCampaigns}
          unit="개"
          href="/admin/campaigns"
          urgent={pendingCampaigns > 0}
        />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="전체 회원" value={totalUsers} unit="명" href="/admin/users" />
        <StatCard label="진행중 캠페인" value={activeCampaigns} unit="개" href="/admin/campaigns" />
        <StatCard
          label="미지급 수익 (주급 대기)"
          value={(weekEarnings._sum.amount ?? 0).toLocaleString()}
          unit="원"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">승인 대기 전환 (최근 5건)</h2>
          <Link href="/admin/conversions" className="text-xs text-blue-600 hover:underline">전체보기</Link>
        </div>
        {recentConversions.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-gray-400">대기 중인 전환이 없습니다.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left">캠페인</th>
                <th className="px-6 py-3 text-left">마케터</th>
                <th className="px-6 py-3 text-left">리드</th>
                <th className="px-6 py-3 text-right">광고주 단가</th>
                <th className="px-6 py-3 text-right">마케터 단가</th>
                <th className="px-6 py-3 text-right">신청일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentConversions.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900 max-w-[160px] truncate">{c.campaign.title}</td>
                  <td className="px-6 py-3 text-gray-600">{c.application.publisher.name ?? c.application.publisher.email}</td>
                  <td className="px-6 py-3 text-gray-600">{c.leadName ?? "-"} {c.leadPhone ? `(${c.leadPhone})` : ""}</td>
                  <td className="px-6 py-3 text-right">{c.advertiserPrice.toLocaleString()}원</td>
                  <td className="px-6 py-3 text-right text-blue-600">{c.publisherPrice.toLocaleString()}원</td>
                  <td className="px-6 py-3 text-right text-gray-400">{formatDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label, value, unit, href, urgent,
}: {
  label: string; value: number | string; unit: string; href?: string; urgent?: boolean;
}) {
  const content = (
    <div className={`rounded-xl border px-6 py-5 ${urgent ? "border-orange-200 bg-orange-50" : "bg-white border-gray-100"}`}>
      <p className={`text-xs mb-1 ${urgent ? "text-orange-600" : "text-gray-500"}`}>{label}</p>
      <p className={`text-2xl font-bold ${urgent ? "text-orange-700" : "text-gray-900"}`}>
        {typeof value === "number" ? value.toLocaleString() : value}{" "}
        <span className={`text-sm font-normal ${urgent ? "text-orange-500" : "text-gray-400"}`}>{unit}</span>
      </p>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
