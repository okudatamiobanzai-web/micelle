"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Orb } from "@/components/ui/Orb";
import { Badge } from "@/components/ui/Badge";
import { TAG_ICON, TAG_BADGE, TAG_ICON_BG } from "@/lib/constants";
import { useAuth } from "@/components/AuthProvider";
import { fetchPost, addComment, createNotification } from "@/lib/data";
import type { Post, Comment } from "@/lib/types";

export default function HelpDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const router = useRouter();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const result = await fetchPost(id);
        if (result) {
          setPost(result);
          setComments(result.comments);
        }
      } catch (e) {
        // fetch failed
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !user || !post) return;
    try {
      const comment = await addComment({
        post_id: post.id,
        author_id: user.id,
        body: newComment.trim(),
      });
      setComments((prev) => [...prev, comment]);
      setNewComment("");
      setShowCommentInput(false);

      // 投稿者に通知（自分へのコメントでなければ）
      if (post.author_id !== user.id) {
        await createNotification({
          user_id: post.author_id,
          type: "comment",
          title: "コメントが届きました",
          body: newComment.trim().slice(0, 100),
          link: `/help/${post.id}`,
        });
      }
    } catch {
      alert("コメントの送信に失敗しました。もう一度お試しください。");
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-400 text-sm">読み込み中...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-10 text-center">
        <div className="text-3xl mb-3">🔍</div>
        <div className="text-base font-semibold text-foreground">見つかりません</div>
      </div>
    );
  }

  const tag = post.tag || "作業";
  const badge = TAG_BADGE[tag] || TAG_BADGE["作業"];

  return (
    <div className="pb-20">
      <div className="px-4 pt-4 pb-3.5 border-b border-gray-100">
        <button onClick={() => router.back()} className="text-[13px] text-gray-400 bg-transparent border-none cursor-pointer">← 戻る</button>
        <div className="flex items-center gap-1.5 mt-2.5 mb-2">
          <div className={`w-8 h-8 rounded-lg ${TAG_ICON_BG[tag]} flex items-center justify-center text-base`}>{TAG_ICON[tag]}</div>
          <Badge text={tag} bgClass={badge.bg} fgClass={badge.fg} />
          {post.status === "matched" && <Badge text="マッチ済" bgClass="bg-primary-50" fgClass="text-primary-600" icon="✓" />}
          {post.status === "resolved" && <Badge text="完了" bgClass="bg-primary-400" fgClass="text-white" />}
        </div>
        <div className="text-xl font-semibold text-foreground leading-snug">{post.title}</div>
      </div>

      <div
        className="px-4 py-3 flex items-center gap-2.5 border-b border-gray-50 cursor-pointer active:bg-gray-50 transition-colors"
        onClick={() => post.author_id && router.push(`/people/${post.author_id}`)}
      >
        <Orb ch={post.author?.avatar_char || "?"} dots={0} size={36} colorClass="primary" imageUrl={post.author?.picture_url} />
        <div className="flex-1">
          <div className="text-sm font-medium text-foreground">{post.author?.display_name}</div>
          <div className="text-[11px] text-gray-400">{new Date(post.created_at).toLocaleDateString("ja-JP")}</div>
        </div>
        {post.reward_amount ? (
          <div className="text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg">{post.reward_amount}</div>
        ) : post.reward_type === "free" ? (
          <div className="text-xs text-gray-400 px-2 py-1">無償</div>
        ) : null}
      </div>

      {post.body && (
        <div className="px-4 py-4">
          <div className="text-sm leading-loose text-gray-600 whitespace-pre-wrap">{post.body}</div>
        </div>
      )}

      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-gray-400 font-medium">やりとり</div>
          {!showCommentInput && post.status !== "resolved" && user && (
            <button onClick={() => setShowCommentInput(true)} className="text-xs text-primary-600 font-medium bg-primary-50 px-2.5 py-1 rounded-lg border-none cursor-pointer">💬 コメントする</button>
          )}
        </div>

        {comments.length > 0 ? (
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-2.5">
                <Orb ch={c.author?.avatar_char || "?"} dots={0} size={32} colorClass="primary" imageUrl={c.author?.picture_url} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs font-medium text-foreground">{c.author?.display_name}</span>
                    {c.is_milk_admin && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-50 text-primary-800 font-medium">milk運営</span>
                    )}
                  </div>
                  <div className="text-[13px] leading-relaxed text-gray-600">{c.body}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-200 py-2">まだやりとりがありません</div>
        )}

        {showCommentInput && (
          <div className="mt-3 p-3 bg-surface rounded-xl">
            <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="コメントを書く..." rows={3} className="w-full px-3 py-2.5 rounded-lg border border-gray-100 text-sm text-foreground placeholder:text-gray-200 focus:outline-none focus:border-primary-200 bg-background resize-none mb-2" autoFocus />
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setShowCommentInput(false); setNewComment(""); }} className="px-3 py-1.5 rounded-lg text-xs text-gray-400 bg-transparent border border-gray-100 cursor-pointer">キャンセル</button>
              <button onClick={handleAddComment} disabled={!newComment.trim()} className={`px-4 py-1.5 rounded-lg text-xs font-medium border-none cursor-pointer ${newComment.trim() ? "bg-primary-400 text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>送信</button>
            </div>
          </div>
        )}
      </div>

      {(post.status === "open" || post.status === "active") && (
        <div className="px-4 pb-6">
          {user ? (
            <button
              onClick={() => setShowCommentInput(true)}
              className="w-full p-3.5 rounded-xl text-[15px] font-medium bg-primary-400 text-white border-none cursor-pointer shadow-[0_2px_8px_rgba(29,158,117,.26)]"
            >
              🙋 手伝いたい・相談したい
            </button>
          ) : (
            <div className="text-center text-sm text-gray-400 py-3">
              ログインするとコメントできます
            </div>
          )}
        </div>
      )}
    </div>
  );
}
