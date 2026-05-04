"use client";

import { useRouter } from "next/navigation";

const statusMap: Record<string, string> = {
  "": "전체", PENDING: "확인 대기", APPROVED: "승인 확정", REJECTED: "반려", PAID: "정산 완료",
};

export default function ConversionFilter({
  campaigns,
  currentStatus,
  currentCampaignId,
}: {
  campaigns: { id: string; title: string }[];
  currentStatus: string;
  currentCampaignId: string;
}) {
  const router = useRouter();

  function go(status: string, campaignId: string) {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (campaignId) params.set("campaignId", campaignId);
    router.push(`/advertiser/conversions?${params.toString()}`);
  }

  return (
    <div className="flex gap-3 mb-5 flex-wrap items-center">
      <select
        value={currentCampaignId}
        onChange={(e) => go(currentStatus, e.target.value)}
        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">전체 캠페인</option>
        {campaigns.map((c) => (
          <option key={c.id} value={c.id}>{c.title}</option>
        ))}
      </select>
      <div className="flex gap-1 flex-wrap">
        {Object.entries(statusMap).map(([s, label]) => (
          <button
            key={s}
            onClick={() => go(s, currentCampaignId)}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              currentStatus === s
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
