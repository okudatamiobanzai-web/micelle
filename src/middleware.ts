import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 管理画面の認証はクライアント側（AdminGuard）で処理する
// MiddlewareからはSupabaseのlocalStorageセッションを参照できないため
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
