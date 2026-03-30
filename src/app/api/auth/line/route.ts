import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json({ error: "accessToken required" }, { status: 400 });
    }

    // 1. LINE API でプロフィール取得
    const profileRes = await fetch("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      return NextResponse.json({ error: "Invalid LINE token" }, { status: 401 });
    }

    const lineProfile = await profileRes.json();
    const { userId, displayName, pictureUrl } = lineProfile;

    const email = `${userId}@line.micelle.local`;
    const password = `micelle_liff_${userId}_stable_key`;

    // 2. まず既存ユーザーでサインインを試みる
    const { data: signInData, error: signInError } =
      await supabaseAdmin.auth.signInWithPassword({ email, password });

    if (!signInError && signInData.session) {
      // 既存ユーザー: プロフィール更新してセッション返す
      await supabaseAdmin.from("profiles").upsert({
        id: signInData.user.id,
        display_name: displayName || "名無し",
        avatar_char: displayName?.charAt(0) || "？",
        picture_url: pictureUrl || null,
        updated_at: new Date().toISOString(),
      });

      return NextResponse.json({
        user: signInData.user,
        session: signInData.session,
        lineProfile: { userId, displayName, pictureUrl },
        isNew: false,
      });
    }

    // 3. サインイン失敗 → 新規作成を試みる
    const { data: createData, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (!createError && createData.user) {
      // 新規ユーザー作成成功
      await supabaseAdmin.from("profiles").upsert({
        id: createData.user.id,
        display_name: displayName || "名無し",
        avatar_char: displayName?.charAt(0) || "？",
        picture_url: pictureUrl || null,
      });

      const { data: newSignIn, error: newSignInError } =
        await supabaseAdmin.auth.signInWithPassword({ email, password });

      if (newSignInError) {
        return NextResponse.json({ error: newSignInError.message }, { status: 500 });
      }

      return NextResponse.json({
        user: newSignIn.user,
        session: newSignIn.session,
        lineProfile: { userId, displayName, pictureUrl },
        isNew: true,
      });
    }

    // 4. 既に登録済みでパスワードが違う場合 → Admin API でパスワードリセット
    if (createError?.message?.includes("already been registered")) {
      // 全ページを検索してユーザーを見つける
      let targetUser = null;
      let page = 1;
      while (!targetUser) {
        const { data: listData } = await supabaseAdmin.auth.admin.listUsers({
          page,
          perPage: 1000,
        });
        if (!listData?.users?.length) break;
        targetUser = listData.users.find((u) => u.email === email) || null;
        if (listData.users.length < 1000) break;
        page++;
      }

      if (!targetUser) {
        return NextResponse.json({ error: "User not found" }, { status: 500 });
      }

      // パスワードを強制リセット
      await supabaseAdmin.auth.admin.updateUserById(targetUser.id, { password });

      const { data: retrySignIn, error: retryError } =
        await supabaseAdmin.auth.signInWithPassword({ email, password });

      if (retryError) {
        return NextResponse.json({ error: retryError.message }, { status: 500 });
      }

      await supabaseAdmin.from("profiles").upsert({
        id: targetUser.id,
        display_name: displayName || "名無し",
        avatar_char: displayName?.charAt(0) || "？",
        picture_url: pictureUrl || null,
        updated_at: new Date().toISOString(),
      });

      return NextResponse.json({
        user: retrySignIn.user,
        session: retrySignIn.session,
        lineProfile: { userId, displayName, pictureUrl },
        isNew: false,
      });
    }

    return NextResponse.json({ error: createError?.message || "Unknown error" }, { status: 500 });
  } catch (e) {
    console.error("LINE auth error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
