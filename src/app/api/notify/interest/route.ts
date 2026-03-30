import { NextRequest, NextResponse } from "next/server";
import { sendSlackNotification, buildInterestNotification } from "@/lib/slack";

export async function POST(request: NextRequest) {
  try {
    const { interestedUser, postTitle, postAuthor, postId, postType } = await request.json();

    await sendSlackNotification(
      buildInterestNotification({
        interestedUser: interestedUser || "誰か",
        postTitle: postTitle || "投稿",
        postAuthor: postAuthor || "投稿者",
        postUrl: `https://micelle.shirubelab.jp/admin/posts/${postId}`,
        postType: postType || "help",
      })
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Interest notification error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
