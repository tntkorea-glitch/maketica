import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const statusMap: Record<string, { label: string; className: string }> = {
  PENDING:   { label: "정산 대기", className: "bg-yellow-100 text-yellow-700" },
  CONFIRMED: { label: "출금 가능", className: "bg-blue-100 text-blue-700" },
  PAID:      { label: "지급 완료", className: "bg-green-100 text-green-700" },
};

export default async function PublisherEarningsPage() {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  const [earnings, summary] = await Promise.all([
    prisma.earning.findMany({
      where: { publisherId: userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.earning.groupBy({
      by: ["status"],
      where: { publisherId: userId },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  const byStatus = Object.fromEntries(summary.map((s) => [s.status, s._sum.amount ?? 0]));
  const total = Object.values(byStatus).reduce((a, b) => a + b, 0);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">수익 내역</h1>
        <p className="text-sm text-gray-500 mt-1">매주 금요일 정산 확정 후 출금 신청 가능합니다.</p>
      </div>

      {/* 요약 */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-gray-900 text-white rounded-xl px-5 py-4">
          <p className="text-xs text-gray-400 mb-1">누적 총 수익</p>
          <p className="text-xl font-bold">{total.toLocaleString()}<span className="text-sm font-normal text-gray-400 ml-1">원</span></p>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-5 py-4">
          <p className="text-xs text-yellow-600 mb-1">정산 대기 (이번 주)</p>
          <p className="text-xl font-bold text-yellow-700">{(byStatus["PENDING"] ?? 0).toLocaleString()}<span className="text-sm font-normal ml-1">원</span></p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4">
          <p className="text-xs text-blue-600 mb-1">출금 가능 (확정)</p>
          <p className="text-xl font-bold text-blue-700">{(byStatus["CONFIRMED"] ?? 0).toLocaleString()}<span className="text-sm font-normal ml-1">원</span></p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl px-5 py-4">
          <p className="text-xs text-green-600 mb-1">지급 완료</p>
          <p className="text-xl font-bold text-green-700">{(byStatus["PAID"] ?? 0).toLocaleString()}<span className="text-sm font-normal ml-1">원</span></p>
        </div>
      </div>

      {/* 주차별 내역 */}
      {earnings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 px-6 py-16 text-center text-sm text-gray-400">
          수익 내역이 없습니다.{" "}
          <a href="/publisher/campaigns" className="text-blue-600 hover:underline">캠페인 신청하기</a>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left">정산 주차</th>
                <th className="px-6 py-3 text-left">상태</th>
                <th className="px-6 py-3 text-right">수익</th>
                <th className="px-6 py-3 text-right">확정일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {earnings.map((e) => {
                const s = statusMap[e.status] ?? { label: e.status, className: "bg-gray-100 text-gray-600" };
                return (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {e.settleWeek ?? "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.className}`}>{s.label}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      {e.amount.toLocaleString()}원
                    </td>
                    <td className="px-6 py-4 text-right text-gray-400 text-xs">
                      {e.settledAt ? new Date(e.settledAt).toLocaleDateString("ko-KR") : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {(byStatus["CONFIRMED"] ?? 0) > 0 && (
        <div className="mt-4 text-center">
          <a href="/publisher/withdraw"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            출금 신청하기 →
          </a>
        </div>
      )}
    </div>
  );
}
