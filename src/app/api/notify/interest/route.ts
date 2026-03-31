import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendSlackNotification, buildInterestNotification } from "@/lib/slack";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function sendLineNotification(lineUserId: string, message: string) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token || !lineUserId) return;
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
  }).catch((e) => console.warn("LINE push failed:", e));
}

function extractLineUserId(email: string): string | null {
  const match = email.match(/^(.+)@line\.micelle\.local$/);
  return match ? match[1] : null;
}

export async function POST(request: NextRequest) {
  try {
    const { interestedUser, postTitle, postAuthor, postId, postType, authorId } =
      await request.json();

    // Slack通知（管理者向け）
    await sendSlackNotification(
      buildInterestNotification({
        interestedUser: interestedUser || "誰か",
        postTitle: postTitle || "投稿",
        postAuthor: postAuthor || "投稿者",
        postUrl: `https://micelle.shirubelab.jp/admin/posts/${postId}`,
        postType: postType || "help",
      })
    );

    // LINE通知（投稿者向け）
    if (authorId) {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(authorId);
      const lineUserId = authUser.user?.email
        ? extractLineUserId(authUser.user.email)
        : null;
      if (lineUserId) {
        const verb = postType === "skill" ? "相談したい" : "オファーしたい";
        const msg = `📩 ${interestedUser}さんが「${postTitle}」に${verb}と言っています。\n管理者が確認後、あらためてご連絡します。\nhttps://micelle.shirubelab.jp`;
        await sendLineNotification(lineUserId, msg);
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Interest notification error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
