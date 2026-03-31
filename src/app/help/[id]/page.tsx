"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Orb } from "@/components/ui/Orb";
import { Badge } from "@/components/ui/Badge";
import { TAG_ICON, TAG_BADGE, TAG_ICON_BG } from "@/lib/constants";
import { useAuth } from "@/components/AuthProvider";
import { fetchPost } from "@/lib/data";
import type { Post } from "@/lib/types";

export default function HelpDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const router = useRouter();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [offered, setOffered] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const result = await fetchPost(id);
        if (result) setPost(result);
      } catch (e) {
        // fetch failed
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleOffer = async () => {
    if (!user || !post || submitting) return;
    setSubmitting(true);
    try {
      await fetch("/api/notify/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interestedUser: user.email || "ユーザー",
          postTitle: post.title,
          postAuthor: post.author?.display_name || "",
          postId: post.id,
          postType: "help",
          authorId: post.author_id,
        }),
      });
      setOffered(true);
    } catch {
      alert("送信に失敗しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
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

  const tag = post.tag || "相談";
  const badge = TAG_BADGE[tag] || TAG_BADGE["相談"];

  return (
    <div className="pb-20">
      <div className="px-4 pt-4 pb-3.5 border-b border-gray-100">
        <button onClick={() => router.back()} className="text-[13px] text-gray-400 bg-transparent border-none cursor-pointer">← 戻る</button>
        <div className="flex items-center gap-1.5 mt-2.5 mb-2">
          <div className={`w-8 h-8 rounded-lg ${TAG_ICON_BG[tag] || "bg-gray-50"} flex items-center justify-center text-base`}>{TAG_ICON[tag] || "💬"}</div>
          <Badge text={tag} bgClass={badge.bg} fgClass={badge.fg} />
          {post.status === "matched" && <Badge text="対応中" bgClass="bg-primary-50" fgClass="text-primary-600" icon="✓" />}
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
      </div>

      {post.body && (
        <div className="px-4 py-4">
          <div className="text-sm leading-loose text-gray-600 whitespace-pre-wrap">{post.body}</div>
        </div>
      )}

      {(post.status === "open" || post.status === "active") && (
        <div className="px-4 pb-6">
          {!user ? (
            <div className="text-center text-sm text-gray-400 py-3">
              ログインするとオファーできます
            </div>
          ) : offered ? (
            <div className="text-center p-3.5 rounded-xl bg-primary-50">
              <div className="text-[15px] font-medium text-primary-800">🙌 オファーしました！</div>
              <div className="text-xs text-gray-400 mt-1">管理者が確認後、LINEでご連絡します。</div>
            </div>
          ) : (
            <button
              onClick={handleOffer}
              disabled={submitting}
              className="w-full p-3.5 rounded-xl text-[15px] font-medium bg-primary-400 text-white border-none cursor-pointer shadow-[0_2px_8px_rgba(29,158,117,.26)] disabled:opacity-50"
            >
              {submitting ? "送信中..." : "🙋 手伝いたい・オファーする"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
