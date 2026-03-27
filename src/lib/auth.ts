import { supabase } from "./supabase";
import { initLiff, getAccessToken, isLoggedIn, login } from "./liff";

/**
 * LIFF初期化 → LINEログイン → サーバーサイドAPI経由でSupabase Auth セッション作成
 */
export async function initAuth() {
  await initLiff();

  if (!isLoggedIn()) {
    return null;
  }

  const accessToken = getAccessToken();
  if (!accessToken) return null;

  try {
    // サーバーサイド API でLINEトークン検証 + Supabase ユーザー作成/ログイン
    const res = await fetch("/api/auth/line", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn("Auth API failed:", err);
      return null;
    }

    const { user, session, lineProfile } = await res.json();

    // Supabase クライアントにセッションをセット
    if (session) {
      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });
    }

    return { user, profile: lineProfile };
  } catch (e) {
    console.warn("Auth init error:", e);
    return null;
  }
}

export async function requireLogin() {
  await initLiff();
  if (!isLoggedIn()) {
    login();
    return null;
  }
  return initAuth();
}
