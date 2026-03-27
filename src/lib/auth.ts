import { supabase } from "./supabase";
import { initLiff, getProfile, getAccessToken, isLoggedIn, login } from "./liff";

/**
 * LIFF初期化 → LINEログイン → Supabase Auth にセッション作成
 * プロフィールがなければ自動作成
 */
export async function initAuth() {
  await initLiff();

  if (!isLoggedIn()) {
    return null;
  }

  const profile = await getProfile();
  if (!profile) return null;

  // Supabase に LINE ユーザーとしてサインイン
  // LINE userId をベースにした固定の認証情報を使用
  const email = `${profile.userId}@line.micelle.local`;
  const password = `micelle_liff_${profile.userId}_stable_key`;

  // まずサインインを試みる
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInData?.user) {
    return { user: signInData.user, profile };
  }

  // サインイン失敗 → サインアップを試みる
  if (signInError) {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    // 既にユーザーが存在する場合（古いパスワードで作成済み）
    // → service_role で管理者APIからパスワードを更新する必要があるが、
    //   クライアント側では不可能なので、新規ユーザーのみ対応
    if (signUpError) {
      console.warn("Auth: signup failed, user may already exist with different password");
      return null;
    }

    if (signUpData?.user) {
      // プロフィール自動作成
      await supabase.from("profiles").upsert({
        id: signUpData.user.id,
        display_name: profile.displayName || "名無し",
        avatar_char: profile.displayName?.charAt(0) || "？",
      });

      return { user: signUpData.user, profile };
    }
  }

  return null;
}

export async function requireLogin() {
  await initLiff();
  if (!isLoggedIn()) {
    login();
    return null;
  }
  return initAuth();
}
