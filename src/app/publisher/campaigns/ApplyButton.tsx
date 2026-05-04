"use client";

import { useState, useTransition } from "react";
import { applyToCampaign } from "@/app/actions/applications";
import { useRouter } from "next/navigation";

export default function ApplyButton({ campaignId, isApplied }: { campaignId: string; isApplied: boolean }) {
  const [applied, setApplied] = useState(isApplied);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (applied) {
    return (
      <button
        disabled
        className="w-full px-4 py-2 bg-gray-100 text-gray-500 text-sm font-medium rounded-lg"
      >
        ✓ 신청완료
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={() => {
          startTransition(async () => {
            const result = await applyToCampaign(campaignId);
            if (result.error) {
              setError(result.error);
            } else {
              setApplied(true);
              router.refresh();
            }
          });
        }}
        disabled={isPending}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
      >
        {isPending ? "신청 중..." : "캠페인 신청"}
      </button>
      {error && <p className="text-xs text-red-500 mt-1 text-right">{error}</p>}
    </div>
  );
}
