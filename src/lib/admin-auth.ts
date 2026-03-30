import { supabase } from "./supabase";

export async function adminSignIn(email: string, password: string) {
  // 1. パスワード認証
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { error: error.message };
  if (!data.user) return { error: "ログインに失敗しました" };

  // 2. 管理者チェック（サービスロールキー使用のAPIルート経由）
  try {
    const response = await fetch("/api/admin/auth-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: data.user.id }),
    });

    if (!response.ok) {
      await supabase.auth.signOut();
      return { error: "管理者権限がありません" };
    }

    const result = await response.json();
    if (!result.admin) {
      await supabase.auth.signOut();
      return { error: "管理者権限がありません" };
    }

    return { user: data.user, admin: result.admin };
  } catch {
    await supabase.auth.signOut();
    return { error: "管理者チェックに失敗しました" };
  }
}

export async function adminSignOut() {
  await supabase.auth.signOut();
}

export async function getAdminSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  try {
    const response = await fetch("/api/admin/auth-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: session.user.id }),
    });

    if (!response.ok) return null;

    const result = await response.json();
    if (!result.admin) return null;

    return { user: session.user, admin: result.admin };
  } catch {
    return null;
  }
}
