"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Orb } from "@/components/ui/Orb";
import { Badge } from "@/components/ui/Badge";
import { GiftedTags } from "@/components/ui/GiftedTags";
import { GiftTagModal } from "@/components/ui/GiftTagModal";
import { SKILL_ICON } from "@/lib/constants";
import { people, posts } from "@/lib/sample-data";

export default function PersonDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const router = useRouter();
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [extraTags, setExtraTags] = useState<string[]>([]);

  const person = people.find((p) => p.id === id);

  if (!person) {
    return (
      <div className="p-10 text-center">
        <div className="text-3xl mb-3">🔍</div>
        <div className="text-base font-semibold text-foreground">見つかりません</div>
      </div>
    );
  }

  // Posts by this person (skills)
  const skillPosts = posts.filter((p) => p.type === "skill" && p.personId === person.id);
  // Posts this person helped
  const helpedPosts = posts.filter(
    (p) => p.report && p.report.helperId === person.id
  );

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="px-4 pt-4 pb-4 border-b border-gray-100">
        <button
          onClick={() => router.back()}
          className="text-[13px] text-gray-400 bg-transparent border-none cursor-pointer mb-3"
        >
          ← 戻る
        </button>

        {/* Profile card */}
        <div className="flex items-center gap-3.5">
          <Orb ch={person.ch} dots={person.dots} size={64} colorClass={person.colorClass} pulse />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-bold text-foreground">{person.name}</span>
              {person.milkComment && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary-50 text-primary-800 font-medium">
                  milk紹介
                </span>
              )}
            </div>
            <div className="text-xs text-gray-400">{person.area}</div>
            {person.sns?.instagram && (
              <div className="text-xs text-blue-400 mt-0.5">@{person.sns.instagram}</div>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-0 mt-4 bg-surface rounded-xl overflow-hidden">
          {[
            { label: "お手伝い", value: person.completedHelp },
            { label: "依頼", value: person.completedReq },
            { label: "紹介", value: person.referrals },
            { label: "タグ", value: person.gifted.length },
          ].map((s, i) => (
            <div
              key={i}
              className="flex-1 text-center py-3 border-r border-gray-100 last:border-r-0"
            >
              <div className="text-lg font-bold text-primary-600">{s.value}</div>
              <div className="text-[10px] text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-5">
        {/* Skills */}
        <div>
          <div className="text-xs text-gray-400 mb-2 font-medium">できること</div>
          <div className="flex gap-1.5 flex-wrap">
            {person.can.map((skill) => (
              <span
                key={skill}
                className="text-xs px-3 py-1.5 rounded-[10px] bg-skill-50 border border-skill-100 text-skill-800 inline-flex items-center gap-1"
              >
                <span>{SKILL_ICON[skill] || "✦"}</span>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Gifted tags */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-400 font-medium">もらったタグ</div>
            <button
              onClick={() => setShowGiftModal(true)}
              className="text-xs text-primary-600 font-medium bg-primary-50 px-2.5 py-1 rounded-lg border-none cursor-pointer"
            >
              ✦ タグを贈る
            </button>
          </div>
          <GiftedTags tags={[...person.gifted, ...extraTags]} />
          {person.gifted.length === 0 && extraTags.length === 0 && (
            <div className="text-xs text-gray-200 py-1">まだタグがありません</div>
          )}
        </div>

        {/* Milk comment */}
        {person.milkComment && (
          <div className="p-3 bg-primary-50 rounded-xl">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Orb ch="mi" dots={6} size={20} colorClass="primary" />
              <span className="text-xs font-medium text-primary-800">milkより</span>
            </div>
            <div className="text-[13px] leading-relaxed text-gray-600">{person.milkComment}</div>
          </div>
        )}

        {/* Skill posts */}
        {skillPosts.length > 0 && (
          <div>
            <div className="text-xs text-gray-400 mb-2 font-medium">「できます」の投稿</div>
            <div className="space-y-2">
              {skillPosts.map((sp) => (
                <div
                  key={sp.id}
                  onClick={() => router.push(`/skill/${sp.id}`)}
                  className="p-3 bg-gradient-to-br from-skill-50 to-background rounded-xl border border-skill-100/30 cursor-pointer active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Badge text="できます" bgClass="bg-skill-100" fgClass="text-skill-800" icon="✋" />
                  </div>
                  <div className="text-sm font-semibold text-foreground leading-snug">
                    {sp.title}
                  </div>
                  <div className="text-xs text-skill-600 mt-1">{sp.pricing}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Helped posts */}
        {helpedPosts.length > 0 && (
          <div>
            <div className="text-xs text-gray-400 mb-2 font-medium">お手伝い実績</div>
            <div className="space-y-2">
              {helpedPosts.map((hp) => (
                <div
                  key={hp.id}
                  onClick={() => router.push(`/help/${hp.id}`)}
                  className="p-3 bg-surface rounded-xl cursor-pointer active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Badge text="完了" bgClass="bg-primary-400" fgClass="text-white" />
                    {hp.tag && <Badge text={hp.tag} bgClass="bg-gray-50" fgClass="text-gray-600" />}
                  </div>
                  <div className="text-sm font-medium text-foreground">{hp.title}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{hp.report?.completedDate}完了</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Favorite button */}
        <button className="w-full p-3.5 rounded-xl text-[15px] font-medium bg-primary-400 text-white border-none cursor-pointer shadow-[0_2px_8px_rgba(29,158,117,.26)]">
          ⭐ お気に入りに追加
        </button>
      </div>

      {/* Gift tag modal */}
      {showGiftModal && person && (
        <GiftTagModal
          personName={person.name}
          onClose={() => setShowGiftModal(false)}
          onSend={(tag) => setExtraTags((prev) => [...prev, tag])}
        />
      )}
    </div>
  );
}
