/**
 * Slack通知ユーティリティ
 * サーバーサイドのAPI routeからのみ使用
 */

export async function sendSlackNotification(message: {
  text: string;
  blocks?: object[];
}) {
  const webhookUrl = process.env.SLACK_WEBHOOK_MICELLE;
  if (!webhookUrl) {
    console.warn("SLACK_WEBHOOK_MICELLE not set");
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
  } catch (e) {
    console.warn("Slack notification failed:", e);
  }
}

export function buildInterestNotification({
  interestedUser,
  postTitle,
  postAuthor,
  postUrl,
  postType,
}: {
  interestedUser: string;
  postTitle: string;
  postAuthor: string;
  postUrl: string;
  postType: "help" | "skill";
}) {
  const emoji = postType === "help" ? "🙋" : "✋";
  const typeLabel = postType === "help" ? "困りごと" : "できます";

  return {
    text: `${emoji} ${interestedUser}さんが「${postTitle}」に興味を持ちました`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${emoji} *${interestedUser}さん* が興味を持ちました\n\n*投稿:* 「${postTitle}」（${typeLabel}）\n*投稿者:* ${postAuthor}`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "🔗 管理画面で確認" },
            url: postUrl,
            style: "primary",
          },
        ],
      },
    ],
  };
}

export function buildMatchNotification({
  user1Name,
  user2Name,
  postTitle,
  postUrl,
}: {
  user1Name: string;
  user2Name: string;
  postTitle: string;
  postUrl: string;
}) {
  return {
    text: `🤝 マッチしました！${user1Name} × ${user2Name}`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `🤝 *マッチ完了！*\n\n*${user1Name}* × *${user2Name}*\n投稿: 「${postTitle}」\n\n双方にLINE通知を送りました。`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "📋 投稿を確認" },
            url: postUrl,
          },
        ],
      },
    ],
  };
}
