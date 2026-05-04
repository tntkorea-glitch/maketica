"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full text-left px-3 py-2 text-xs text-gray-400 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-colors"
    >
      로그아웃
    </button>
  );
}
