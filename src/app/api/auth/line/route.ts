import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service role client (server-side only, bypasses RLS)
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

    // 1. LINE API でアクセストークンを検証してプロフィール取得
    const profileRes = await fetch("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      const errText = await profileRes.text();
      console.error("LINE profile API error:", profileRes.status, errText);
      return NextResponse.json({ error: "Invalid LINE token" }, { status: 401 });
    }

    const lineProfile = await profileRes.json();
    const { userId, displayName, pictureUrl } = lineProfile;

    const email = `${userId}@line.micelle.local`;
    const password = `micelle_liff_${userId}_stable_key`;

    // 2. 既存ユーザーを検索
    let existingUser = null;
    const { data: userListData } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 100,
    });
    if (userListData?.users) {
      existingUser = userListData.users.find((u) => u.email === email);
    }

    let isNew = false;

    if (!existingUser) {
      // 3. 新規ユーザー → Admin API で作成（rate limit 回避）
      const { data: createData, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });

      if (createError) {
        console.error("Create user error:", createError);
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }

      existingUser = createData.user;
      isNew = true;
    } else {
      // 既存ユーザー → パスワードを再設定
      await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
        password,
      });
    }

    // 4. プロフィール upsert（新規・既存共通）
    await supabaseAdmin.from("profiles").upsert({
      id: existingUser.id,
      display_name: displayName || "名無し",
      avatar_char: displayName?.charAt(0) || "？",
      picture_url: pictureUrl || null,
      updated_at: new Date().toISOString(),
    });

    // 5. サインインしてセッションを取得
    const { data: signInData, error: signInError } =
      await supabaseAdmin.auth.signInWithPassword({ email, password });

    if (signInError) {
      console.error("SignIn error after password update:", signInError);
      return NextResponse.json({ error: signInError.message }, { status: 500 });
    }

    return NextResponse.json({
      user: signInData.user,
      session: signInData.session,
      lineProfile: { userId, displayName, pictureUrl },
      isNew,
    });
  } catch (e) {
    console.error("LINE auth error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
