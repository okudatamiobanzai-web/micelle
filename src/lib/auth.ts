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

  const accessToken = getAccessToken();
  if (!accessToken) return null;

  // Supabase に LINE ユーザーとしてサインイン（カスタムトークン不要、IDベースで管理）
  // 簡易実装: LINE userId をメールアドレス代わりに使用
  const email = `${profile.userId}@line.micelle.local`;
  const password = `liff_${profile.userId}_${accessToken.slice(-8)}`;

  // まずサインインを試みる
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInData?.user) {
    return { user: signInData.user, profile };
  }

  // なければサインアップ
  if (signInError) {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      // sign up failed
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
