import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendSlackNotification, buildMatchNotification } from "@/lib/slack";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function sendLineNotification(lineUserId: string, message: string) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token || !lineUserId) return;

  try {
    await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        to: lineUserId,
        messages: [{ type: "text", text: message }],
      }),
    });
  } catch (e) {
    console.warn("LINE notification failed:", e);
  }
}

function extractLineUserId(email: string): string | null {
  const match = email.match(/^(.+)@line\.micelle\.local$/);
  return match ? match[1] : null;
}

export async function POST(request: NextRequest) {
  try {
    const { postId, user1Id, user2Id } = await request.json();

    if (!postId || !user1Id || !user2Id) {
      return NextResponse.json({ error: "postId, user1Id, user2Id required" }, { status: 400 });
    }

    // 1. Create match record
    const { data: matchData, error: matchError } = await supabaseAdmin
      .from("matches")
      .insert({ post_id: postId, user1_id: user1Id, user2_id: user2Id, status: "matched" })
      .select()
      .single();

    if (matchError) {
      return NextResponse.json({ error: matchError.message }, { status: 500 });
    }

    // 2. Update post status to matched
    await supabaseAdmin
      .from("posts")
      .update({ status: "matched", updated_at: new Date().toISOString() })
      .eq("id", postId);

    // 3. Get post and user details
    const [postRes, user1Res, user2Res] = await Promise.all([
      supabaseAdmin.from("posts").select("title").eq("id", postId).single(),
      supabaseAdmin.from("profiles").select("display_name").eq("id", user1Id).single(),
      supabaseAdmin.from("profiles").select("display_name").eq("id", user2Id).single(),
    ]);

    const postTitle = postRes.data?.title || "投稿";
    const user1Name = user1Res.data?.display_name || "さん";
    const user2Name = user2Res.data?.display_name || "さん";

    // 4. Create notifications
    await supabaseAdmin.from("notifications").insert([
      {
        user_id: user1Id,
        type: "matched",
        title: "マッチしました！",
        body: `「${postTitle}」で${user2Name}さんとマッチしました。連絡先を確認してください。`,
        link: `/people/${user2Id}`,
        read: false,
      },
      {
        user_id: user2Id,
        type: "matched",
        title: "マッチしました！",
        body: `「${postTitle}」で${user1Name}さんとマッチしました。連絡先を確認してください。`,
        link: `/people/${user1Id}`,
        read: false,
      },
    ]);

    // 5. Send LINE push notifications (get LINE user IDs from auth.users)
    const getLineId = (_profileId: string) => {
      // Find user by matching profile ID - we need to query the profile to get the user's email
      return null; // Will be resolved via email lookup
    };
    void getLineId;

    // Get emails for both users
    const [auth1, auth2] = await Promise.all([
      supabaseAdmin.auth.admin.getUserById(user1Id),
      supabaseAdmin.auth.admin.getUserById(user2Id),
    ]);

    const lineId1 = auth1.data.user?.email ? extractLineUserId(auth1.data.user.email) : null;
    const lineId2 = auth2.data.user?.email ? extractLineUserId(auth2.data.user.email) : null;

    const msg1 = `🎉 マッチしました！\n\n「${postTitle}」で${user2Name}さんとつながりました。\nミセルアプリで連絡先を確認してください。\nhttps://micelle.shirubelab.jp`;
    const msg2 = `🎉 マッチしました！\n\n「${postTitle}」で${user1Name}さんとつながりました。\nミセルアプリで連絡先を確認してください。\nhttps://micelle.shirubelab.jp`;

    await Promise.all([
      lineId1 ? sendLineNotification(lineId1, msg1) : Promise.resolve(),
      lineId2 ? sendLineNotification(lineId2, msg2) : Promise.resolve(),
      // Slack通知（管理者向け）
      sendSlackNotification(buildMatchNotification({
        user1Name,
        user2Name,
        postTitle,
        postUrl: `https://micelle.shirubelab.jp/admin/posts/${postId}`,
      })),
    ]);

    return NextResponse.json({ success: true, match: matchData });
  } catch (e) {
    console.error("Match error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
