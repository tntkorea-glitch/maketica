import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const gradeLabel: Record<string, string> = {
  BRONZE: "🥉 BRONZE", SILVER: "🥈 SILVER", GOLD: "🥇 GOLD", PLATINUM: "💎 PLATINUM",
};

export default async function PublisherDashboard() {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  const [user, applications, earnings] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { grade: true, name: true } }),
    prisma.application.findMany({
      where: { publisherId: userId },
      include: { campaign: { select: { title: true, publisherPrice: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.earning.findMany({
      where: { publisherId: userId },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const totalConversions = applications.reduce((s, a) => s + a.conversionCount, 0);
  const totalClicks = applications.reduce((s, a) => s + a.clickCount, 0);
  const pendingEarnings = earnings.filter((e) => e.status === "PENDING").reduce((s, e) => s + e.amount, 0);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="text-sm text-gray-500 mt-1">
            {user?.name ?? "마케터"}님의 등급: <span className="font-semibold text-gray-700">{gradeLabel[user?.grade ?? "BRONZE"]}</span>
          </p>
        </div>
        <Link
          href="/publisher/campaigns"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          캠페인 탐색
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="누적 클릭" value={totalClicks.toLocaleString()} unit="회" />
        <StatCard label="누적 전환" value={totalConversions.toLocaleString()} unit="건" />
        <StatCard label="정산 대기 수익" value={pendingEarnings.toLocaleString()} unit="원" highlight />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">신청한 캠페인</h2>
          <Link href="/publisher/my-campaigns" className="text-xs text-blue-600 hover:underline">전체보기</Link>
        </div>
        {applications.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">
            아직 신청한 캠페인이 없습니다.{" "}
            <Link href="/publisher/campaigns" className="text-blue-600 hover:underline">캠페인 탐색하기</Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left">캠페인명</th>
                <th className="px-6 py-3 text-right">클릭</th>
                <th className="px-6 py-3 text-right">전환</th>
                <th className="px-6 py-3 text-right">건당 수익</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {applications.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">{a.campaign.title}</td>
                  <td className="px-6 py-3 text-right text-gray-600">{a.clickCount}</td>
                  <td className="px-6 py-3 text-right text-gray-600">{a.conversionCount}</td>
                  <td className="px-6 py-3 text-right font-medium text-blue-600">{a.campaign.publisherPrice.toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, highlight }: { label: string; value: string; unit: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border px-6 py-5 ${highlight ? "bg-blue-600 border-blue-600" : "bg-white border-gray-100"}`}>
      <p className={`text-xs mb-1 ${highlight ? "text-blue-100" : "text-gray-500"}`}>{label}</p>
      <p className={`text-2xl font-bold ${highlight ? "text-white" : "text-gray-900"}`}>
        {value} <span className={`text-sm font-normal ${highlight ? "text-blue-200" : "text-gray-400"}`}>{unit}</span>
      </p>
    </div>
  );
}
