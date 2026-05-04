"use client";

import { useTransition } from "react";
import { processWithdraw } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

export default function WithdrawActions({ withdrawId }: { withdrawId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handle(action: "complete" | "reject") {
    startTransition(async () => {
      await processWithdraw(withdrawId, action);
      router.refresh();
    });
  }

  return (
    <div className="flex gap-2 justify-end">
      <button onClick={() => handle("reject")} disabled={isPending}
        className="px-3 py-1.5 text-xs border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50">
        반려
      </button>
      <button onClick={() => handle("complete")} disabled={isPending}
        className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
        {isPending ? "처리중..." : "이체 완료"}
      </button>
    </div>
  );
}
