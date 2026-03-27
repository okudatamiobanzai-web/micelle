"use client";

import { usePathname, useRouter } from "next/navigation";
import { NavIcon } from "./NavIcon";

const NAV_ITEMS: { id: string; icon: "board" | "post" | "people" | "mypage"; label: string; href: string }[] = [
  { id: "board", icon: "board", label: "掲示板", href: "/" },
  { id: "post", icon: "post", label: "書く", href: "/post" },
  { id: "people", icon: "people", label: "見せる", href: "/people" },
  { id: "mypage", icon: "mypage", label: "マイページ", href: "/mypage" },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = NAV_ITEMS.find((n) => {
    if (n.href === "/") return pathname === "/";
    return pathname.startsWith(n.href);
  })?.id || "board";

  return (
    <nav role="navigation" aria-label="メインナビゲーション" className="fixed bottom-0 left-0 right-0 flex border-t border-gray-100 bg-white/92 backdrop-blur-2xl pb-[env(safe-area-inset-bottom,8px)] z-20 max-w-[430px] mx-auto">
      {NAV_ITEMS.map((n) => {
        const active = activeTab === n.id;
        return (
          <button
            key={n.id}
            onClick={() => router.push(n.href)}
            aria-label={n.label}
            aria-current={active ? "page" : undefined}
            className={`flex-1 flex flex-col items-center gap-0.5 pt-2.5 pb-1.5 bg-transparent border-none cursor-pointer relative transition-all duration-200 ${
              active ? "text-primary-600 font-semibold" : "text-gray-400 font-normal"
            }`}
            style={{ fontSize: 10 }}
          >
            {active && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-sm bg-primary-600" />
            )}
            <NavIcon type={n.icon} active={active} />
            {n.label}
          </button>
        );
      })}
    </nav>
  );
}
