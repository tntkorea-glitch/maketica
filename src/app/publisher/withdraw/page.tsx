import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import WithdrawForm from "./WithdrawForm";

export default async function WithdrawPage() {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  const [user, earnings, requests] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { bankName: true, bankAccount: true, bankHolder: true },
    }),
    prisma.earning.groupBy({
      by: ["status"],
      where: { publisherId: userId },
      _sum: { amount: true },
    }),
    prisma.withdrawRequest.findMany({
      where: { publisherId: userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const byStatus = Object.fromEntries(earnings.map((e) => [e.status, e._sum.amount ?? 0]));
  const pending = byStatus["PENDING"] ?? 0;
  const confirmed = byStatus["CONFIRMED"] ?? 0;
  const paid = byStatus["PAID"] ?? 0;
  const hasPendingRequest = requests.some((r) => r.status === "PENDING");

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">출금 신청</h1>
        <p className="text-sm text-gray-500 mt-1">매주 금요일 정산 확정 후 출금 가능합니다.</p>
      </div>

      {/* 수익 현황 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">정산 대기 (이번 주)</p>
          <p className="text-lg font-bold text-gray-400">{pending.toLocaleString()}원</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-xs text-blue-600 mb-1">출금 가능 (확정)</p>
          <p className="text-lg font-bold text-blue-700">{confirmed.toLocaleString()}원</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">누적 지급 완료</p>
          <p className="text-lg font-bold text-gray-500">{paid.toLocaleString()}원</p>
        </div>
      </div>

      {/* 출금 신청 폼 */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">출금 신청</h2>
        {hasPendingRequest ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-700">
            ⏳ 현재 처리 중인 출금 요청이 있습니다. 처리 완료 후 다시 신청해주세요.
          </div>
        ) : confirmed < 10000 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-500">
            출금 가능 금액이 부족합니다. 최소 10,000원 이상부터 신청 가능합니다.
          </div>
        ) : (
          <WithdrawForm
            maxAmount={confirmed}
            defaultBank={user?.bankName ?? ""}
            defaultAccount={user?.bankAccount ?? ""}
            defaultHolder={user?.bankHolder ?? ""}
          />
        )}
      </div>

      {/* 출금 내역 */}
      {requests.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">출금 내역</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left">신청일</th>
                <th className="px-6 py-3 text-left">계좌</th>
                <th className="px-6 py-3 text-right">금액</th>
                <th className="px-6 py-3 text-right">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {requests.map((r) => (
                <tr key={r.id}>
                  <td className="px-6 py-3 text-gray-500 text-xs">{new Date(r.createdAt).toLocaleDateString("ko-KR")}</td>
                  <td className="px-6 py-3 text-gray-600 text-xs">{r.bankName} {r.bankAccount} ({r.bankHolder})</td>
                  <td className="px-6 py-3 text-right font-medium">{r.amount.toLocaleString()}원</td>
                  <td className="px-6 py-3 text-right">
                    <WithdrawStatusBadge status={r.status} />
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

function WithdrawStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    PENDING: { label: "신청중", className: "bg-yellow-100 text-yellow-700" },
    PROCESSING: { label: "처리중", className: "bg-blue-100 text-blue-700" },
    COMPLETED: { label: "완료", className: "bg-green-100 text-green-700" },
    REJECTED: { label: "반려", className: "bg-red-100 text-red-600" },
  };
  const s = map[status] ?? { label: status, className: "bg-gray-100 text-gray-600" };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.className}`}>{s.label}</span>;
}
