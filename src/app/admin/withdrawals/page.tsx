import { prisma } from "@/lib/prisma";
import WithdrawActions from "./WithdrawActions";

export default async function AdminWithdrawalsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = "PENDING" } = await searchParams;

  const requests = await prisma.withdrawRequest.findMany({
    where: { status: status as never },
    include: {
      publisher: { select: { name: true, email: true, grade: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const tabs = [
    { value: "PENDING", label: "대기중" },
    { value: "PROCESSING", label: "처리중" },
    { value: "COMPLETED", label: "완료" },
    { value: "REJECTED", label: "반려" },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">출금 관리</h1>
        <p className="text-sm text-gray-500 mt-1">실제 계좌 이체 후 완료 처리해주세요.</p>
      </div>

      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <a key={tab.value} href={`?status=${tab.value}`}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              status === tab.value ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>
            {tab.label}
          </a>
        ))}
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 px-6 py-16 text-center text-sm text-gray-400">
          해당 상태의 출금 요청이 없습니다.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left">신청일</th>
                <th className="px-6 py-3 text-left">마케터</th>
                <th className="px-6 py-3 text-left">계좌 정보</th>
                <th className="px-6 py-3 text-right">금액</th>
                {status === "PENDING" && <th className="px-6 py-3 text-right">처리</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-500 text-xs">{new Date(r.createdAt).toLocaleDateString("ko-KR")}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{r.publisher.name ?? "이름없음"}</p>
                    <p className="text-xs text-gray-400">{r.publisher.email} · {r.publisher.grade}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-xs">
                    {r.bankName} {r.bankAccount}<br />
                    <span className="text-gray-400">예금주: {r.bankHolder}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900">{r.amount.toLocaleString()}원</td>
                  {status === "PENDING" && (
                    <td className="px-6 py-4 text-right">
                      <WithdrawActions withdrawId={r.id} />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
