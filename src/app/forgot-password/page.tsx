"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus(res.ok ? "sent" : "error");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">비밀번호 재설정</h1>
          <p className="text-sm text-gray-500 mt-1">가입한 이메일로 재설정 링크를 보내드립니다.</p>
        </div>

        {status === "sent" ? (
          <div className="text-center space-y-4">
            <div className="text-4xl">📧</div>
            <p className="text-sm text-gray-700 font-medium">재설정 링크를 발송했습니다.</p>
            <p className="text-xs text-gray-400">이메일을 확인해주세요. (개발 환경에서는 콘솔 확인)</p>
            <Link href="/login" className="block text-sm text-blue-600 hover:underline">로그인으로 돌아가기</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email" required
              placeholder="가입한 이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {status === "error" && (
              <p className="text-xs text-red-500">오류가 발생했습니다. 다시 시도해주세요.</p>
            )}
            <button type="submit" disabled={status === "loading"}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors">
              {status === "loading" ? "발송 중..." : "재설정 링크 발송"}
            </button>
            <p className="text-center text-xs text-gray-400">
              <Link href="/login" className="text-blue-600 hover:underline">로그인으로 돌아가기</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
