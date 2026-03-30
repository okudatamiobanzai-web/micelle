"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Orb } from "@/components/ui/Orb";
import { Badge } from "@/components/ui/Badge";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { GiftedTags } from "@/components/ui/GiftedTags";
import { GiftTagModal } from "@/components/ui/GiftTagModal";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { StatsGrid } from "@/components/profile/StatsGrid";
import { PortfolioSection } from "@/components/profile/PortfolioSection";
import { fetchProfile, fetchPosts, fetchPortfolio, fetchProfileStats, addGiftedTag, checkMatch } from "@/lib/data";
import { useAuth } from "@/components/AuthProvider";
import type { Profile, Post, PortfolioItem } from "@/lib/types";

export default function PersonDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const router = useRouter();
  const { user } = useAuth();
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [extraTags, setExtraTags] = useState<string[]>([]);

  const [isMatched, setIsMatched] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skillPosts, setSkillPosts] = useState<Post[]>([]);
  const [helpedPosts, setHelpedPosts] = useState<Post[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [stats, setStats] = useState({ completedHelp: 0, completedReq: 0, referrals: 0, tagCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [p, portfolio, profileStats, allSkills, allHelp] = await Promise.all([
          fetchProfile(id),
          fetchPortfolio(id),
          fetchProfileStats(id),
          fetchPosts({ type: "skill" }),
          fetchPosts({ type: "help", status: "resolved" }),
        ]);

        if (p) {
          setProfile(p);
          setSkillPosts(allSkills.filter((sp) => sp.author_id === id));
          setHelpedPosts(allHelp.filter((hp) => hp.helper_id === id));
          setPortfolioItems(portfolio);
          setStats({
            completedHelp: profileStats.completed_help,
            completedReq: profileStats.completed_req,
            referrals: profileStats.referrals,
            tagCount: profileStats.tag_count,
          });

          // Check if current user is matched with this profile
          if (user && p) {
            const matched = await checkMatch(user.id, id);
            setIsMatched(matched);
          }
        }
      } catch (e) {
        // fetch failed
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, user]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-400 text-sm">読み込み中...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-10 text-center">
        <div className="text-3xl mb-3">🔍</div>
        <div className="text-base font-semibold text-foreground">見つかりません</div>
      </div>
    );
  }

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
          name={profile.display_name}
          ch={profile.avatar_char}
          dots={0}
          colorClass="primary"
          area={profile.area || ""}
          isMilkEndorsed={profile.is_milk_endorsed}
          pictureUrl={profile.picture_url}
          snsPublic={profile.sns_public}
          snsPrivate={profile.sns_private}
          isMatched={user?.id === id || isMatched}
        />
        <StatsGrid
          completedHelp={stats.completedHelp}
          completedReq={stats.completedReq}
          referrals={stats.referrals}
          tagCount={stats.tagCount + extraTags.length}
        />
      </div>

      <div className="p-4 space-y-5">
        {/* Skills */}
        {profile.can && profile.can.length > 0 && (
          <div>
            <div className="text-xs text-gray-400 mb-2 font-medium">できること</div>
            <div className="flex gap-1.5 flex-wrap">
              {profile.can.map((skill) => (
                <SkillBadge key={skill} skill={skill} />
              ))}
            </div>
          </div>
        )}

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
          {(stats.tagCount + extraTags.length) > 0 ? (
            <GiftedTags tags={extraTags} />
          ) : (
            <div className="text-xs text-gray-200 py-1">まだタグがありません</div>
          )}
        </div>

        {/* About me */}
        {profile.about_me && (
          <div>
            <div className="text-xs text-gray-400 mb-2 font-medium">自己紹介</div>
            <div className="text-sm leading-relaxed text-gray-600">{profile.about_me}</div>
          </div>
        )}

        {/* Portfolio */}
        {portfolioItems.length > 0 && (
          <PortfolioSection items={portfolioItems} getImageUrl={(p) => p} />
        )}

        {/* Milk comment */}
        {profile.milk_comment && (
          <div className="p-3 bg-primary-50 rounded-xl">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Orb ch="mi" dots={6} size={20} colorClass="primary" />
              <span className="text-xs font-medium text-primary-800">milkより</span>
            </div>
            <div className="text-[13px] leading-relaxed text-gray-600">{profile.milk_comment}</div>
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
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    {new Date(hp.updated_at).toLocaleDateString("ja-JP")}完了
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {skillPosts.length > 0 ? (
          <button
            onClick={() => router.push(`/skill/${skillPosts[0].id}`)}
            className="w-full p-3.5 rounded-xl text-[15px] font-medium bg-primary-400 text-white border-none cursor-pointer shadow-[0_2px_8px_rgba(29,158,117,.26)]"
          >
            💬 この人に相談する
          </button>
        ) : (
          <div className="text-center text-sm text-gray-400 py-3">
            まだ「できます」の投稿がありません
          </div>
        )}
      </div>

      {showGiftModal && (
        <GiftTagModal
          personName={profile.display_name}
          onClose={() => setShowGiftModal(false)}
          onSend={async (tag) => {
            setExtraTags((prev) => [...prev, tag]);
            if (user) {
              try {
                await addGiftedTag({ profile_id: id, tag, from_user_id: user.id });
              } catch (e) {
                // tag saved locally even if DB fails
              }
            }
          }}
        />
      )}
    </div>
  );
}
