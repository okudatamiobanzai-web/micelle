"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Orb } from "@/components/ui/Orb";
import { Badge } from "@/components/ui/Badge";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { GiftedTags } from "@/components/ui/GiftedTags";
import { GiftTagModal } from "@/components/ui/GiftTagModal";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { StatsGrid } from "@/components/profile/StatsGrid";
import { PortfolioSection } from "@/components/profile/PortfolioSection";
import { people, posts, samplePortfolios } from "@/lib/sample-data";

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

  const skillPosts = posts.filter((p) => p.type === "skill" && p.personId === person.id);
  const helpedPosts = posts.filter((p) => p.report && p.report.helperId === person.id);
  const portfolioItems = samplePortfolios[person.id] || [];

  return (
    <div className="pb-20">
      <div className="px-4 pt-4 pb-4 border-b border-gray-100">
        <button
          onClick={() => router.back()}
          className="text-[13px] text-gray-400 bg-transparent border-none cursor-pointer mb-3"
        >
          ← 戻る
        </button>
        <ProfileHeader
          name={person.name}
          ch={person.ch}
          dots={person.dots}
          colorClass={person.colorClass}
          area={person.area}
          isMilkEndorsed={!!person.milkComment}
          snsPublic={person.snsPublic}
          snsPrivate={person.snsPrivate}
          isMatched={false}
        />
        <StatsGrid
          completedHelp={person.completedHelp}
          completedReq={person.completedReq}
          referrals={person.referrals}
          tagCount={person.gifted.length + extraTags.length}
        />
      </div>

      <div className="p-4 space-y-5">
        {/* Skills */}
        <div>
          <div className="text-xs text-gray-400 mb-2 font-medium">できること</div>
          <div className="flex gap-1.5 flex-wrap">
            {person.can.map((skill) => (
              <SkillBadge key={skill} skill={skill} />
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

        {/* About me */}
        {person.aboutMe && (
          <div>
            <div className="text-xs text-gray-400 mb-2 font-medium">自己紹介</div>
            <div className="text-sm leading-relaxed text-gray-600">{person.aboutMe}</div>
          </div>
        )}

        {/* Portfolio */}
        {portfolioItems.length > 0 && (
          <PortfolioSection items={portfolioItems} getImageUrl={(p) => p} />
        )}

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
                  <Badge text="できます" bgClass="bg-skill-100" fgClass="text-skill-800" icon="✋" />
                  <div className="text-sm font-semibold text-foreground leading-snug mt-1">{sp.title}</div>
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

        <button className="w-full p-3.5 rounded-xl text-[15px] font-medium bg-primary-400 text-white border-none cursor-pointer shadow-[0_2px_8px_rgba(29,158,117,.26)]">
          ⭐ お気に入りに追加
        </button>
      </div>

      {showGiftModal && (
        <GiftTagModal
          personName={person.name}
          onClose={() => setShowGiftModal(false)}
          onSend={(tag) => setExtraTags((prev) => [...prev, tag])}
        />
      )}
    </div>
  );
}
