"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Orb } from "@/components/ui/Orb";
import { Badge } from "@/components/ui/Badge";
import { EmbedCard } from "@/components/ui/EmbedCard";
import { SKILL_ICON } from "@/lib/constants";
import { fetchPost, fetchProfile } from "@/lib/data";
import { useAuth } from "@/components/AuthProvider";
import type { Post, Profile } from "@/lib/types";

export default function SkillDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const [interested, setInterested] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [post, setPost] = useState<Post | null>(null);
  const [person, setPerson] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const result = await fetchPost(id);
        if (result && result.type === "skill") {
          setPost(result);
          if (result.author) {
            setPerson(result.author);
          } else if (result.author_id) {
            const p = await fetchProfile(result.author_id);
            setPerson(p);
          }
        }
      } catch (e) {
        // fetch failed
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleInterest = async () => {
    if (!user || !post || submitting) return;
    setSubmitting(true);
    try {
      await fetch("/api/notify/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interestedUser: user.email || "ユーザー",
          postTitle: post.title,
          postAuthor: person?.display_name || "",
          postId: post.id,
          postType: "skill",
          authorId: post.author_id,
        }),
      });
      setInterested(true);
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

  if (!post || !person) {
    return (
      <div className="p-10 text-center">
        <div className="text-3xl mb-3">🔍</div>
        <div className="text-base font-semibold text-foreground">見つかりません</div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="px-4 pt-4 pb-3.5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="text-[13px] text-gray-400 bg-transparent border-none cursor-pointer">← 戻る</button>
          <button
            onClick={() => {
              const shareUrl = `https://micelle.shirubelab.jp/skill/${post.id}`;
              if (navigator.share) {
                navigator.share({ title: post.title, text: `${person.display_name}さんの「${post.title}」`, url: shareUrl });
              } else {
                navigator.clipboard.writeText(shareUrl);
                alert("URLをコピーしました");
              }
            }}
            className="text-[13px] text-gray-400 bg-transparent border-none cursor-pointer"
          >
            シェア ↗
          </button>
        </div>
        <div className="flex gap-1.5 mt-2.5 mb-2">
          <Badge text="できます" bgClass="bg-skill-100" fgClass="text-skill-800" icon="✋" />
        </div>
        <div className="text-xl font-semibold text-foreground mb-3 leading-snug">{post.title}</div>

        <div
          className="flex items-center gap-2.5 p-3 bg-gradient-to-br from-skill-50 to-background rounded-xl cursor-pointer active:scale-[0.98] transition-all"
          onClick={() => router.push(`/people/${person.id}`)}
        >
          <Orb ch={person.avatar_char} dots={0} size={48} colorClass="primary" imageUrl={person.picture_url} />
          <div className="flex-1">
            <div className="text-[15px] font-semibold text-foreground">{person.display_name}</div>
            <div className="text-xs text-gray-400 mt-0.5">{person.area}</div>
          </div>
          <span className="text-gray-200 text-sm">›</span>
        </div>
      </div>

      <div className="p-4">
        {post.status === "matched" && (
          <div className="mb-4 p-4 rounded-xl bg-primary-50 border border-primary-100">
            <div className="text-sm font-semibold text-primary-800 mb-1">✓ マッチング済み</div>
            <div className="text-xs text-primary-600 leading-relaxed">
              管理者が相手をつなぎました。LINEでご連絡しますのでしばらくお待ちください。
            </div>
          </div>
        )}

        {post.body && (
          <div className="text-sm leading-loose text-gray-600 mb-4 whitespace-pre-wrap">{post.body}</div>
        )}

        {post.skills && post.skills.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-400 mb-2">できること</div>
            <div className="flex gap-1.5 flex-wrap">
              {post.skills.map((s) => (
                <span key={s} className="text-xs px-3 py-1.5 rounded-[10px] bg-skill-50 border border-skill-100 text-skill-800 inline-flex items-center gap-1">
                  <span>{SKILL_ICON[s] || "✦"}</span>{s}
                </span>
              ))}
            </div>
          </div>
        )}

        {post.pricing && (
          <div className="mb-4 p-3 bg-surface rounded-[10px]">
            <div className="text-xs text-gray-400 mb-1">料金の目安</div>
            <div className="text-sm font-medium text-foreground">{post.pricing}</div>
          </div>
        )}

        {post.portfolio_links && post.portfolio_links.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-400 mb-2">ポートフォリオ・実績</div>
            <div className="space-y-3">
              {post.portfolio_links.map((link) => (
                <EmbedCard key={link} url={link} />
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-400 text-center mb-2.5">
          🙋 {post.interested_count ?? 0}人がこのスキルに興味を持っています
        </div>

        {user?.id === post.author_id ? null : !user ? (
          <div className="text-center p-3.5 rounded-xl bg-gray-50">
            <div className="text-sm text-gray-400">ログインすると相談できます</div>
          </div>
        ) : interested ? (
          <div className="text-center p-3.5 rounded-xl bg-primary-50">
            <div className="text-[15px] font-medium text-primary-800">🙌 相談を送りました！</div>
            <div className="text-xs text-gray-400 mt-1">管理者が確認後、LINEでご連絡します。</div>
          </div>
        ) : (
          <button
            onClick={handleInterest}
            disabled={submitting}
            className="w-full p-3.5 rounded-xl text-[15px] font-medium bg-skill-400 text-white border-none cursor-pointer shadow-[0_2px_8px_rgba(232,163,23,.26)] disabled:opacity-50"
          >
            {submitting ? "送信中..." : "🙋 相談したい・興味がある"}
          </button>
        )}
      </div>
    </div>
  );
}
