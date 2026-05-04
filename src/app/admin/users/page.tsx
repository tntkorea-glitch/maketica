import { prisma } from "@/lib/prisma";

const roleLabel: Record<string, { label: string; className: string }> = {
  ADMIN: { label: "관리자", className: "bg-red-100 text-red-600" },
  ADVERTISER: { label: "광고주", className: "bg-purple-100 text-purple-600" },
  PUBLISHER: { label: "마케터", className: "bg-blue-100 text-blue-600" },
};

const gradeLabel: Record<string, string> = {
  BRONZE: "🥉", SILVER: "🥈", GOLD: "🥇", PLATINUM: "💎",
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      advertiserProfile: { select: { companyName: true, balance: true } },
      _count: { select: { applications: true, campaigns: true, earnings: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">사용자 관리</h1>
        <p className="text-sm text-gray-500 mt-1">전체 {users.length}명</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <tr>
              <th className="px-6 py-3 text-left">이름 / 이메일</th>
              <th className="px-6 py-3 text-left">역할</th>
              <th className="px-6 py-3 text-left">등급 / 회사</th>
              <th className="px-6 py-3 text-right">신청/캠페인</th>
              <th className="px-6 py-3 text-right">예치금</th>
              <th className="px-6 py-3 text-right">가입일</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((u) => {
              const role = roleLabel[u.role] ?? { label: u.role, className: "bg-gray-100 text-gray-600" };
              return (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{u.name ?? "이름없음"}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${role.className}`}>{role.label}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-xs">
                    {u.role === "PUBLISHER" && (
                      <span>{gradeLabel[u.grade]} {u.grade}</span>
                    )}
                    {u.role === "ADVERTISER" && u.advertiserProfile && (
                      <span>{u.advertiserProfile.companyName}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">
                    {u.role === "PUBLISHER" && `신청 ${u._count.applications}`}
                    {u.role === "ADVERTISER" && `캠페인 ${u._count.campaigns}`}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">
                    {u.advertiserProfile
                      ? `${u.advertiserProfile.balance.toLocaleString()}원`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-400 text-xs">
                    {new Date(u.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
