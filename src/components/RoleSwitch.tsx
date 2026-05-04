"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type View = { href: string; label: string; color: string };

const views: View[] = [
  { href: "/admin", label: "관리자", color: "text-red-600" },
  { href: "/publisher", label: "마케터", color: "text-blue-600" },
  { href: "/advertiser", label: "광고주", color: "text-green-600" },
];

export default function RoleSwitch() {
  const pathname = usePathname();
  const current = views.find((v) => pathname.startsWith(v.href));

  return (
    <div className="px-3 py-3 border-t border-gray-100">
      <p className="text-[10px] text-gray-400 mb-1.5 px-1">뷰 전환 (관리자)</p>
      <div className="flex flex-col gap-0.5">
        {views.map((v) => {
          const active = pathname.startsWith(v.href);
          return (
            <Link
              key={v.href}
              href={v.href}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                active
                  ? "bg-gray-100 " + v.color
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-current" : "bg-gray-300"}`} />
              {v.label} {active && "●"}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
