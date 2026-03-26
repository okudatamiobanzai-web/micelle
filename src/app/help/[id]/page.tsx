"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Orb } from "@/components/ui/Orb";
import { Badge } from "@/components/ui/Badge";
import { TAG_ICON, TAG_BADGE, TAG_ICON_BG } from "@/lib/constants";
import { posts, people, type SampleComment } from "@/lib/sample-data";

export default function HelpDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const router = useRouter();

  const post = posts.find((p) => p.id === Number(id));

  if (!post || post.type !== "help") {
    return (
      <div className="p-10 text-center">
        <div className="text-3xl mb-3">🔍</div>
        <div className="text-base font-semibold text-foreground">見つかりません</div>
      </div>
    );
  }

  const [comments, setComments] = useState<SampleComment[]>(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: SampleComment = {
      user: "田中裕子",
      ch: "田",
      dots: 8,
      colorClass: "primary",
      body: newComment.trim(),
    };
    setComments((prev) => [...prev, comment]);
    setNewComment("");
    setShowCommentInput(false);
  };

  const tag = post.tag || "作業";
  const badge = TAG_BADGE[tag] || TAG_BADGE["作業"];
  const report = post.report;
  const helper = report ? people.find((p) => p.id === report.helperId) : null;

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="px-4 pt-4 pb-3.5 border-b border-gray-100">
        <button
          onClick={() => router.back()}
          className="text-[13px] text-gray-400 bg-transparent border-none cursor-pointer"
        >
          ← 戻る
        </button>

        <div className="flex items-center gap-1.5 mt-2.5 mb-2">
          <div className={`w-8 h-8 rounded-lg ${TAG_ICON_BG[tag]} flex items-center justify-center text-base`}>
            {TAG_ICON[tag]}
          </div>
          <Badge text={tag} bgClass={badge.bg} fgClass={badge.fg} />
          {post.status === "matched" && (
            <Badge text="マッチ済" bgClass="bg-primary-50" fgClass="text-primary-600" icon="✓" />
          )}
          {post.status === "resolved" && (
            <Badge text="完了" bgClass="bg-primary-400" fgClass="text-white" />
          )}
        </div>

        <div className="text-xl font-semibold text-foreground leading-snug">{post.title}</div>
      </div>

      {/* Author info */}
      <div className="px-4 py-3 flex items-center gap-2.5 border-b border-gray-50">
        <Orb
          ch={post.posterCh || "?"}
          dots={post.posterDots || 0}
          size={36}
          colorClass={(post.posterDots || 0) > 2 ? "primary" : "gray"}
        />
        <div className="flex-1">
          <div className="text-sm font-medium text-foreground">{post.poster}</div>
          <div className="text-[11px] text-gray-400">{post.date}</div>
        </div>
        {post.reward ? (
          <div className="text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg">
            {post.reward}
          </div>
        ) : (
          <div className="text-xs text-gray-400 px-2 py-1">無償</div>
        )}
      </div>

      {/* Body */}
      <div className="px-4 py-4">
        <div className="text-sm leading-loose text-gray-600">{post.body}</div>
      </div>

      {/* Comments / Thread */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-gray-400 font-medium">やりとり</div>
          {!showCommentInput && post.status !== "resolved" && (
            <button
              onClick={() => setShowCommentInput(true)}
              className="text-xs text-primary-600 font-medium bg-primary-50 px-2.5 py-1 rounded-lg border-none cursor-pointer"
            >
              💬 コメントする
            </button>
          )}
        </div>

        {comments.length > 0 ? (
          <div className="space-y-3">
            {comments.map((c, i) => (
              <div key={i} className="flex gap-2.5">
                <Orb ch={c.ch} dots={c.dots} size={32} colorClass={c.colorClass || "primary"} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs font-medium text-foreground">{c.user}</span>
                    {c.isMilk && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-50 text-primary-800 font-medium">
                        milk運営
                      </span>
                    )}
                  </div>
                  <div className="text-[13px] leading-relaxed text-gray-600">{c.body}</div>
                  {c.refId && c.refName && (
                    <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-primary-50 rounded-lg">
                      <Orb
                        ch={people.find((p) => p.id === c.refId)?.ch || "?"}
                        dots={people.find((p) => p.id === c.refId)?.dots || 0}
                        size={20}
                        colorClass="primary"
                      />
                      <span className="text-xs font-medium text-primary-800">
                        🔗 {c.refName}さんを紹介
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-200 py-2">まだやりとりがありません</div>
        )}

        {/* Comment input */}
        {showCommentInput && (
          <div className="mt-3 p-3 bg-surface rounded-xl">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="コメントを書く..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-100 text-sm text-foreground placeholder:text-gray-200 focus:outline-none focus:border-primary-200 bg-background resize-none mb-2"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setShowCommentInput(false); setNewComment(""); }}
                className="px-3 py-1.5 rounded-lg text-xs text-gray-400 bg-transparent border border-gray-100 cursor-pointer"
              >
                キャンセル
              </button>
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium border-none cursor-pointer ${
                  newComment.trim()
                    ? "bg-primary-400 text-white"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                送信
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Completion Report */}
      {report && (
        <div className="px-4 pb-4">
          <div className="text-xs text-gray-400 mb-3 font-medium">完了レポート</div>

          {/* Photos */}
          {report.photos && report.photos.length > 0 && (
            <div className="flex gap-1.5 mb-3 rounded-xl overflow-hidden">
              {report.photos.map((ph, i) => (
                <div
                  key={i}
                  className="flex-1 h-24 flex items-center justify-center rounded-lg"
                  style={{ background: ph.color || "var(--color-surface)" }}
                >
                  <span className="text-2xl opacity-20">{ph.icon || "📷"}</span>
                </div>
              ))}
            </div>
          )}

          {/* Helper info */}
          {helper && (
            <div className="flex items-center gap-2.5 p-3 bg-surface rounded-xl mb-3">
              <Orb ch={helper.ch} dots={helper.dots} size={36} colorClass={helper.colorClass} />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">{helper.name}さんが対応</div>
                <div className="text-xs text-gray-400">{report.duration} · {report.completedDate}完了</div>
              </div>
            </div>
          )}

          {/* Reports */}
          {report.posterReport && (
            <div className="p-3 bg-primary-50 rounded-xl mb-2">
              <div className="text-[11px] text-primary-600 font-medium mb-1">依頼者の感想</div>
              <div className="text-[13px] leading-relaxed text-gray-600">
                {report.posterReport.text}
              </div>
            </div>
          )}
          {report.helperReport && (
            <div className="p-3 bg-surface rounded-xl">
              <div className="text-[11px] text-gray-400 font-medium mb-1">対応者のメモ</div>
              <div className="text-[13px] leading-relaxed text-gray-600">
                {report.helperReport.text}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CTA for open posts */}
      {(post.status === "open" || post.status === "active") && (
        <div className="px-4 pb-6">
          <button className="w-full p-3.5 rounded-xl text-[15px] font-medium bg-primary-400 text-white border-none cursor-pointer shadow-[0_2px_8px_rgba(29,158,117,.26)]">
            🙋 手伝いたい・相談したい
          </button>
        </div>
      )}
    </div>
  );
}
