"use client";

import { useTransition } from "react";
import { confirmCharge } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

export default function ChargeActions({ chargeId }: { chargeId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(async () => {
        await confirmCharge(chargeId);
        router.refresh();
      })}
      className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
    >
      {isPending ? "처리중..." : "입금 확인"}
    </button>
  );
}
