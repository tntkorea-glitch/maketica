"use client";

import { useActionState } from "react";
import { requestWithdraw } from "@/app/actions/withdraw";

const banks = [
  "국민은행", "신한은행", "우리은행", "하나은행", "카카오뱅크",
  "토스뱅크", "농협은행", "기업은행", "SC제일은행", "씨티은행", "케이뱅크", "기타",
];

export default function WithdrawForm({
  maxAmount,
  defaultBank,
  defaultAccount,
  defaultHolder,
}: {
  maxAmount: number;
  defaultBank: string;
  defaultAccount: string;
  defaultHolder: string;
}) {
  const [error, formAction, isPending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      const result = await requestWithdraw(formData);
      if (result?.error) return result.error;
      return null;
    },
    null
  );

  const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          출금 금액 <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-400 mb-1.5">출금 가능: <span className="text-blue-600 font-semibold">{maxAmount.toLocaleString()}원</span></p>
        <input name="amount" type="number" required min={10000} max={maxAmount} step={1000}
          placeholder="10000" className={inputCls} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">은행 <span className="text-red-500">*</span></label>
          <select name="bankName" required defaultValue={defaultBank} className={inputCls}>
            <option value="">선택</option>
            {banks.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">예금주 <span className="text-red-500">*</span></label>
          <input name="bankHolder" type="text" required defaultValue={defaultHolder}
            placeholder="홍길동" className={inputCls} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">계좌번호 <span className="text-red-500">*</span></label>
        <input name="bankAccount" type="text" required defaultValue={defaultAccount}
          placeholder="123-456-789012" className={inputCls} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <button type="submit" disabled={isPending}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors">
        {isPending ? "신청 중..." : "출금 신청"}
      </button>
    </form>
  );
}
