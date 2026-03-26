"use client";

import { usePathname, useRouter } from "next/navigation";
import { adminSignOut } from "@/lib/admin-auth";

const NAV_ITEMS = [
  { href: "/admin", label: "ダッシュボード", icon: "📊" },
  { href: "/admin/users", label: "ユーザー管理", icon: "👥" },
  { href: "/admin/posts", label: "投稿管理", icon: "📋" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await adminSignOut();
    router.push("/admin/login");
  };

  return (
    <aside className="w-56 h-screen bg-gray-800 text-white flex flex-col shrink-0">
      <div className="p-4 border-b border-gray-600">
        <div className="text-lg font-bold text-primary-200">ミセル</div>
        <div className="text-xs text-gray-400">管理画面</div>
      </div>

      <nav className="flex-1 p-2">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left border-none cursor-pointer mb-1 ${
                active
                  ? "bg-primary-600 text-white font-medium"
                  : "bg-transparent text-gray-300 hover:bg-gray-700"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-2 border-t border-gray-600">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 bg-transparent border-none cursor-pointer hover:bg-gray-700"
        >
          <span>🚪</span>
          ログアウト
        </button>
      </div>
    </aside>
  );
}
