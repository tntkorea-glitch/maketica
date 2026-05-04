"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const email = params.get("email") ?? "";
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("비밀번호가 일치하지 않습니다."); return; }
    if (password.length < 8) { setError("비밀번호는 8자 이상이어야 합니다."); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) { setError(data.error); return; }
    router.push("/login?reset=1");
  }

  if (!email || !token) {
    return (
      <div className="text-center space-y-3">
        <p className="text-sm text-red-500">유효하지 않은 링크입니다.</p>
        <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">다시 요청하기</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">{email}</p>
      <input
        type="password" required minLength={8}
        placeholder="새 비밀번호 (8자 이상)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="password" required
        placeholder="비밀번호 확인"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors">
        {loading ? "변경 중..." : "비밀번호 변경"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">새 비밀번호 설정</h1>
          <p className="text-sm text-gray-500 mt-1">새로운 비밀번호를 입력해주세요.</p>
        </div>
        <Suspense fallback={<p className="text-center text-sm text-gray-400">불러오는 중...</p>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}
