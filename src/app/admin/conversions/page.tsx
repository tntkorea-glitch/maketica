import { prisma } from "@/lib/prisma";
import ConversionActions from "./ConversionActions";

export default async function AdminConversionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = "PENDING" } = await searchParams;

  const conversions = await prisma.conversion.findMany({
    where: { status: status as never },
    include: {
      campaign: { select: { title: true, category: true } },
      application: {
        include: { publisher: { select: { name: true, email: true, grade: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const tabs = [
    { value: "PENDING", label: "대기중" },
    { value: "APPROVED", label: "승인됨" },
    { value: "REJECTED", label: "반려됨" },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">전환 관리</h1>
        <p className="text-sm text-gray-500 mt-1">전환을 승인하면 마케터 수익에 자동 반영됩니다.</p>
      </div>

      {/* 탭 */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <a
            key={tab.value}
            href={`?status=${tab.value}`}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              status === tab.value ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {conversions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 px-6 py-16 text-center text-sm text-gray-400">
          해당 상태의 전환이 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {conversions.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{c.campaign.title}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {c.application.publisher.grade}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    마케터: {c.application.publisher.name ?? c.application.publisher.email}
                  </p>
                  {(c.leadName || c.leadPhone) && (
                    <p className="text-xs text-gray-600 mt-1.5 bg-gray-50 px-3 py-1.5 rounded-lg inline-block">
                      👤 {c.leadName ?? "이름없음"} · {c.leadPhone ?? "번호없음"}
                      {c.leadEmail ? ` · ${c.leadEmail}` : ""}
                    </p>
                  )}
                  <div className="flex gap-4 mt-2 text-xs text-gray-400">
                    <span>신청: {formatDate(c.createdAt)}</span>
                    {c.ipAddress && <span>IP: {c.ipAddress}</span>}
                    {c.referer && <span className="max-w-[200px] truncate">Ref: {c.referer}</span>}
                  </div>
                  {c.rejectedReason && (
                    <p className="text-xs text-red-500 mt-1.5">반려 사유: {c.rejectedReason}</p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm text-gray-500">광고주 <span className="font-semibold text-gray-900">{c.advertiserPrice.toLocaleString()}원</span></p>
                  <p className="text-sm text-gray-500">마케터 <span className="font-semibold text-blue-600">{c.publisherPrice.toLocaleString()}원</span></p>
                  <p className="text-xs text-green-600 font-medium mt-0.5">
                    수수료 {(c.advertiserPrice - c.publisherPrice).toLocaleString()}원
                  </p>
                  {c.status === "PENDING" && (
                    <div className="mt-3">
                      <ConversionActions conversionId={c.id} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("ko-KR", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}
