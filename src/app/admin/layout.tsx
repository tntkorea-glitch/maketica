import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import RoleSwitch from "@/components/RoleSwitch";

const navItems = [
  { href: "/admin", label: "대시보드", icon: "📊" },
  { href: "/admin/conversions", label: "전환 관리", icon: "✅" },
  { href: "/admin/campaigns", label: "캠페인 관리", icon: "📋" },
  { href: "/admin/withdrawals", label: "출금 관리", icon: "💸" },
  { href: "/admin/charges", label: "충전 관리", icon: "💳" },
  { href: "/admin/users", label: "사용자 관리", icon: "👥" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  const role = (session.user as { role?: string }).role;
  if (role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col shrink-0">
        <div className="px-5 py-6 border-b border-gray-100">
          <Link href="/" className="text-lg font-bold text-gray-900">maketica</Link>
          <p className="text-xs text-red-500 font-semibold mt-0.5">관리자</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
        </div>
        <RoleSwitch />
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
