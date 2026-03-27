import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service role client (server-side only, bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json({ error: "accessToken required" }, { status: 400 });
    }

    // 1. LINE API でアクセストークンを検証してプロフィール取得
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

    // 2. 既存ユーザーを検索
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find((u) => u.email === email);

    let user;

    if (existingUser) {
      // 3a. 既存ユーザー → パスワード更新 + プロフィール写真更新
      await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
        password,
      });
      // LINE プロフィール写真を毎回更新
      await supabaseAdmin.from("profiles").update({
        picture_url: pictureUrl || null,
        updated_at: new Date().toISOString(),
      }).eq("id", existingUser.id);

      const { data: signInData, error: signInError } =
        await supabaseAdmin.auth.signInWithPassword({ email, password });

      if (signInError) {
        return NextResponse.json({ error: signInError.message }, { status: 500 });
      }
      user = signInData.user;

      return NextResponse.json({
        user: signInData.user,
        session: signInData.session,
        lineProfile: { userId, displayName, pictureUrl },
        isNew: false,
      });
    } else {
      // 3b. 新規ユーザー → Admin API で作成（rate limit なし）
      const { data: createData, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true, // メール確認をスキップ
        });

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }

      user = createData.user;

      // プロフィール作成
      await supabaseAdmin.from("profiles").upsert({
        id: user.id,
        display_name: displayName || "名無し",
        avatar_char: displayName?.charAt(0) || "？",
        picture_url: pictureUrl || null,
      });

      // サインインしてセッションを取得
      const { data: signInData, error: signInError } =
        await supabaseAdmin.auth.signInWithPassword({ email, password });

      if (signInError) {
        return NextResponse.json({ error: signInError.message }, { status: 500 });
      }

      return NextResponse.json({
        user: signInData.user,
        session: signInData.session,
        lineProfile: { userId, displayName, pictureUrl },
        isNew: true,
      });
    }
  } catch (e) {
    console.error("LINE auth error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
