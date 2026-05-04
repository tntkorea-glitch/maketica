"use client";

import { useState, useTransition } from "react";
import { approveConversion, rejectConversion } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

export default function ConversionActions({ conversionId }: { conversionId: string }) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handle(action: () => Promise<{ success?: boolean; error?: string }>) {
    startTransition(async () => {
      const result = await action();
      if (result.success) router.refresh();
    });
  }

  if (rejecting) {
    return (
      <div className="space-y-2 text-right">
        <input
          type="text"
          placeholder="반려 사유 입력"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-48 px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
          autoFocus
        />
        <div className="flex gap-1.5 justify-end">
          <button
            onClick={() => setRejecting(false)}
            className="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            취소
          </button>
          <button
            disabled={!reason.trim() || isPending}
            onClick={() => handle(() => rejectConversion(conversionId, reason))}
            className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            반려 확정
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 justify-end">
      <button
        onClick={() => setRejecting(true)}
        className="px-3 py-1.5 text-xs border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
      >
        반려
      </button>
      <button
        disabled={isPending}
        onClick={() => handle(() => approveConversion(conversionId))}
        className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "처리중..." : "승인"}
      </button>
    </div>
  );
}
