import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin ルートの保護（/admin/login は除外）
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    // Supabase のセッショントークンを確認
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Cookie から Supabase セッションを取得
    const accessToken = request.cookies.get("sb-access-token")?.value;
    if (!accessToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${accessToken}` } },
      });
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }

      // admin_users テーブルで管理者か確認
      const { data: adminUser } = await supabase
        .from("admin_users")
        .select("id")
        .eq("email", user.email)
        .single();

      if (!adminUser) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
