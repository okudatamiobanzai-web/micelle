"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/ui/BottomNav";
import { AuthProvider } from "@/components/AuthProvider";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    // Admin: full-width desktop layout, no BottomNav
    return <>{children}</>;
  }

  // User: mobile shell with BottomNav
  return (
    <AuthProvider>
      <div className="max-w-[430px] mx-auto h-dvh flex flex-col bg-background relative shadow-[0_0_60px_rgba(0,0,0,.06)]">
        <main className="flex-1 overflow-y-auto pb-16">{children}</main>
        <BottomNav />
      </div>
    </AuthProvider>
  );
}
