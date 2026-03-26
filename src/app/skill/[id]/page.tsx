"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Orb } from "@/components/ui/Orb";
import { Badge } from "@/components/ui/Badge";
import { GiftedTags } from "@/components/ui/GiftedTags";
import { SKILL_ICON } from "@/lib/constants";
import { posts, people } from "@/lib/sample-data";

export default function SkillDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const router = useRouter();
  const [interested, setInterested] = useState(false);
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [message, setMessage] = useState("");

  const post = posts.find((p) => p.id === Number(id));
  const person = post?.personId ? people.find((pp) => pp.id === post.personId) : null;

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
      {/* Header */}
      <div className="px-4 pt-4 pb-3.5 border-b border-gray-100">
        <button
          onClick={() => router.back()}
          className="text-[13px] text-gray-400 bg-transparent border-none cursor-pointer"
        >
          ← 戻る
        </button>

        <div className="flex gap-1.5 mt-2.5 mb-2">
          <Badge text="できます" bgClass="bg-skill-100" fgClass="text-skill-800" icon="✋" />
        </div>

        <div className="text-xl font-semibold text-foreground mb-3 leading-snug">{post.title}</div>

        {/* Author info */}
        <div className="flex items-center gap-2.5 p-3 bg-gradient-to-br from-skill-50 to-background rounded-xl">
          <Orb ch={person.ch} dots={person.dots} size={48} colorClass={person.colorClass} />
          <div className="flex-1">
            <div className="text-[15px] font-semibold text-foreground">{person.name}</div>
            <div className="text-xs text-gray-400 mt-0.5">{person.area}</div>
            {person.milkComment && (
              <div className="flex items-center gap-1 mt-1">
                <Orb ch="mi" dots={6} size={16} colorClass="primary" />
                <span className="text-[11px] text-primary-600 font-medium">milk紹介</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="text-sm leading-loose text-gray-600 mb-4">{post.body}</div>

        {/* Skills */}
        <div className="mb-4">
          <div className="text-xs text-gray-400 mb-2">できること</div>
          <div className="flex gap-1.5 flex-wrap">
            {(post.skills || []).map((s) => (
              <span
                key={s}
                className="text-xs px-3 py-1.5 rounded-[10px] bg-skill-50 border border-skill-100 text-skill-800 inline-flex items-center gap-1"
              >
                <span>{SKILL_ICON[s] || "✦"}</span>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-4 p-3 bg-surface rounded-[10px]">
          <div className="text-xs text-gray-400 mb-1">料金の目安</div>
          <div className="text-sm font-medium text-foreground">{post.pricing}</div>
        </div>

        {/* Gifted tags */}
        {person.gifted?.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-400 mb-2">もらったタグ</div>
            <GiftedTags tags={person.gifted} />
          </div>
        )}

        {/* Milk comment */}
        {person.milkComment && (
          <div className="p-3 bg-primary-50 rounded-[10px] mb-4">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Orb ch="mi" dots={6} size={20} colorClass="primary" />
              <span className="text-xs font-medium text-primary-800">milkより</span>
            </div>
            <div className="text-[13px] leading-relaxed text-gray-600">{person.milkComment}</div>
          </div>
        )}

        {/* Interest count */}
        <div className="text-xs text-gray-400 text-center mb-2.5">
          🙋 {post.interestedCount}人がこのスキルに興味を持っています
        </div>

        {/* CTA */}
        {interested ? (
          <div className="text-center p-3.5 rounded-xl bg-primary-50">
            <div className="text-[15px] font-medium text-primary-800">🙌 興味を伝えました！</div>
            <div className="text-xs text-gray-400 mt-1">
              {person.name}さんに通知が届きます。
            </div>
          </div>
        ) : showMessageInput ? (
          <div className="p-3.5 rounded-xl bg-skill-50 border border-skill-100/30">
            <div className="text-sm font-medium text-foreground mb-2">
              {person.name}さんにメッセージ
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="例: デザインをお願いしたいのですが、詳しくお話できますか？"
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-100 text-sm text-foreground placeholder:text-gray-200 focus:outline-none focus:border-skill-200 bg-background resize-none mb-2"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setShowMessageInput(false); setMessage(""); }}
                className="flex-1 py-2.5 rounded-lg text-xs text-gray-400 bg-transparent border border-gray-100 cursor-pointer"
              >
                やめる
              </button>
              <button
                onClick={() => setInterested(true)}
                className="flex-1 py-2.5 rounded-lg text-xs font-medium bg-skill-400 text-white border-none cursor-pointer"
              >
                🙋 送信する
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowMessageInput(true)}
            className="w-full p-3.5 rounded-xl text-[15px] font-medium bg-skill-400 text-white border-none cursor-pointer shadow-[0_2px_8px_rgba(232,163,23,.26)]"
          >
            🙋 興味がある・相談したい
          </button>
        )}
      </div>
    </div>
  );
}
