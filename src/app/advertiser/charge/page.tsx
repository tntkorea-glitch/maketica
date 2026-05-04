import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ChargeForm from "./ChargeForm";

// 무통장 입금 계좌 정보 (환경변수로 관리 가능)
const BANK_INFO = {
  bank: process.env.COMPANY_BANK ?? "국민은행",
  account: process.env.COMPANY_ACCOUNT ?? "123-456-789012",
  holder: process.env.COMPANY_HOLDER ?? "주식회사 메이케티카",
};

export default async function ChargePage() {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  const [profile, charges] = await Promise.all([
    prisma.advertiserProfile.findUnique({
      where: { userId },
      select: { balance: true, companyName: true },
    }),
    prisma.charge.findMany({
      where: { advertiserProfile: { userId } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">예치금 충전</h1>
        <p className="text-sm text-gray-500 mt-1">무통장 입금 후 관리자가 확인하면 잔액에 반영됩니다.</p>
      </div>

      {/* 현재 잔액 */}
      <div className="bg-blue-600 rounded-xl p-6 text-white mb-6">
        <p className="text-sm text-blue-100 mb-1">현재 예치금 잔액</p>
        <p className="text-3xl font-bold">{(profile?.balance ?? 0).toLocaleString()}원</p>
        {profile?.companyName && <p className="text-sm text-blue-200 mt-1">{profile.companyName}</p>}
      </div>

      {/* 입금 계좌 안내 */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">무통장 입금 계좌</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">은행</span>
            <span className="font-medium text-gray-900">{BANK_INFO.bank}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">계좌번호</span>
            <span className="font-medium text-gray-900 font-mono">{BANK_INFO.account}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">예금주</span>
            <span className="font-medium text-gray-900">{BANK_INFO.holder}</span>
          </div>
        </div>
        <p className="text-xs text-amber-600 mt-3 bg-amber-50 px-3 py-2 rounded-lg">
          ⚠️ 반드시 <strong>사업자명 또는 회사명</strong>으로 입금해주세요. 확인 후 1~2시간 내 반영됩니다.
        </p>
      </div>

      {/* 충전 신청 폼 */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">충전 신청 등록</h2>
        <ChargeForm />
      </div>

      {/* 충전 내역 */}
      {charges.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">충전 내역</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left">신청일</th>
                <th className="px-6 py-3 text-left">방법</th>
                <th className="px-6 py-3 text-right">금액</th>
                <th className="px-6 py-3 text-right">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {charges.map((c) => (
                <tr key={c.id}>
                  <td className="px-6 py-3 text-gray-500 text-xs">{new Date(c.createdAt).toLocaleDateString("ko-KR")}</td>
                  <td className="px-6 py-3 text-gray-600">{c.method === "transfer" ? "무통장입금" : c.method}</td>
                  <td className="px-6 py-3 text-right font-medium">{c.amount.toLocaleString()}원</td>
                  <td className="px-6 py-3 text-right">
                    <ChargeStatusBadge status={c.status} />
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

function ChargeStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    PENDING: { label: "확인 대기", className: "bg-yellow-100 text-yellow-700" },
    CONFIRMED: { label: "반영 완료", className: "bg-green-100 text-green-700" },
    FAILED: { label: "실패", className: "bg-red-100 text-red-600" },
  };
  const s = map[status] ?? { label: status, className: "bg-gray-100 text-gray-600" };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.className}`}>{s.label}</span>;
}
