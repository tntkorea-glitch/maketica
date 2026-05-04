import { prisma } from "@/lib/prisma";
import ChargeActions from "./ChargeActions";

export default async function AdminChargesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = "PENDING" } = await searchParams;

  const charges = await prisma.charge.findMany({
    where: { status: status as never },
    include: {
      advertiserProfile: {
        include: { user: { select: { name: true, email: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const tabs = [
    { value: "PENDING", label: "확인 대기" },
    { value: "CONFIRMED", label: "반영 완료" },
    { value: "FAILED", label: "실패" },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">충전 관리</h1>
        <p className="text-sm text-gray-500 mt-1">입금 확인 후 반영 완료 처리해주세요. 잔액이 자동으로 증가합니다.</p>
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

      {charges.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 px-6 py-16 text-center text-sm text-gray-400">
          해당 상태의 충전 요청이 없습니다.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left">신청일</th>
                <th className="px-6 py-3 text-left">광고주</th>
                <th className="px-6 py-3 text-left">방법</th>
                <th className="px-6 py-3 text-right">금액</th>
                {status === "PENDING" && <th className="px-6 py-3 text-right">처리</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {charges.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-500 text-xs">{new Date(c.createdAt).toLocaleDateString("ko-KR")}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{c.advertiserProfile.companyName}</p>
                    <p className="text-xs text-gray-400">{c.advertiserProfile.user.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{c.method === "transfer" ? "무통장입금" : c.method}</td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900">{c.amount.toLocaleString()}원</td>
                  {status === "PENDING" && (
                    <td className="px-6 py-4 text-right">
                      <ChargeActions chargeId={c.id} />
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
