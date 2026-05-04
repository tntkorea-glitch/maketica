"use client";

import { useActionState } from "react";
import { requestCharge } from "@/app/actions/charge";

export default function ChargeForm() {
  const [result, formAction, isPending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      return await requestCharge(formData);
    },
    null
  );

  const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  if (result?.success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-4 text-sm text-green-700">
        ✅ 충전 신청이 등록되었습니다. 입금 확인 후 1~2시간 내 잔액에 반영됩니다.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          충전 금액 <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-400 mb-1.5">최소 100,000원 이상</p>
        <input name="amount" type="number" required min={100000} step={10000}
          placeholder="1000000" className={inputCls} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">입금 방법</label>
        <select name="method" defaultValue="transfer" className={inputCls}>
          <option value="transfer">무통장 입금</option>
          <option value="card">카드 결제 (준비중)</option>
        </select>
      </div>

      {result?.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
          {result.error}
        </div>
      )}

      <button type="submit" disabled={isPending}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors">
        {isPending ? "신청 중..." : "충전 신청 등록"}
      </button>
    </form>
  );
}
