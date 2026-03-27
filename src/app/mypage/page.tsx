"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { GiftedTags } from "@/components/ui/GiftedTags";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { StatsGrid } from "@/components/profile/StatsGrid";
import { useAuth } from "@/components/AuthProvider";
import { fetchProfile, fetchPosts, fetchProfileStats } from "@/lib/data";
import { LoginPrompt } from "@/components/ui/LoginPrompt";
import { logout } from "@/lib/liff";
import type { Profile, Post } from "@/lib/types";

export default function MyPage() {
  const router = useRouter();
  const { user, lineProfile, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mySkillPosts, setMySkillPosts] = useState<Post[]>([]);
  const [myHelpPosts, setMyHelpPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState({ completedHelp: 0, completedReq: 0, referrals: 0, tagCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }

    async function load() {
      try {
        const [p, skillPosts, helpPosts, profileStats] = await Promise.all([
          fetchProfile(user!.id),
          fetchPosts({ type: "skill" }),
          fetchPosts({ type: "help", status: "resolved" }),
          fetchProfileStats(user!.id),
        ]);
        setProfile(p);
        setMySkillPosts(skillPosts.filter((sp) => sp.author_id === user!.id));
        setMyHelpPosts(helpPosts.filter((hp) => hp.helper_id === user!.id));
        setStats({
          completedHelp: profileStats.completed_help,
          completedReq: profileStats.completed_req,
          referrals: profileStats.referrals,
          tagCount: profileStats.tag_count,
        });
      } catch (e) {
        // load failed
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-400 text-sm">読み込み中...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return <LoginPrompt message="LINEでログインしてプロフィールを確認しましょう" />;
  }

  return (
    <div className="pb-20">
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 sticky top-0 bg-background z-10">
        <div className="text-lg font-bold text-foreground tracking-tight">マイページ</div>
      </div>

      <div className="px-4 pt-4 pb-4">
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
          isMatched={true}
          showEditButton
          onEdit={() => router.push("/mypage/edit")}
        />
        <StatsGrid
          completedHelp={stats.completedHelp}
          completedReq={stats.completedReq}
          referrals={stats.referrals}
          tagCount={stats.tagCount}
        />
      </div>

      <div className="px-4 space-y-5">
        {/* Skills */}
        {profile.can && profile.can.length > 0 ? (
          <div>
            <div className="text-xs text-gray-400 mb-2 font-medium">できること</div>
            <div className="flex gap-1.5 flex-wrap">
              {profile.can.map((skill) => (
                <SkillBadge key={skill} skill={skill} />
              ))}
            </div>
          </div>
        ) : (
          <div
            onClick={() => router.push("/mypage/edit")}
            className="p-4 bg-surface rounded-xl text-center cursor-pointer active:scale-[0.98] transition-all"
          >
            <div className="text-sm text-gray-400 mb-1">できることを登録しましょう</div>
            <div className="text-xs text-primary-600 font-medium">プロフィールを編集 →</div>
          </div>
        )}

        {/* My skill posts */}
        {mySkillPosts.length > 0 && (
          <div>
            <div className="text-xs text-gray-400 mb-2 font-medium">自分の「できます」</div>
            {mySkillPosts.map((sp) => (
              <div
                key={sp.id}
                onClick={() => router.push(`/skill/${sp.id}`)}
                className="p-3 bg-gradient-to-br from-skill-50 to-background rounded-xl border border-skill-100/30 cursor-pointer active:scale-[0.98] transition-all mb-2"
              >
                <div className="text-sm font-semibold text-foreground">{sp.title}</div>
                <div className="text-xs text-skill-600 mt-1">{sp.pricing}</div>
                <div className="text-[11px] text-gray-400 mt-1">🙋 {sp.interested_count ?? 0}人が興味</div>
              </div>
            ))}
          </div>
        )}

        {/* My help history */}
        {myHelpPosts.length > 0 && (
          <div>
            <div className="text-xs text-gray-400 mb-2 font-medium">お手伝い実績</div>
            {myHelpPosts.map((hp) => (
              <div
                key={hp.id}
                onClick={() => router.push(`/help/${hp.id}`)}
                className="p-3 bg-surface rounded-xl cursor-pointer active:scale-[0.98] transition-all mb-2"
              >
                <div className="text-sm font-medium text-foreground">{hp.title}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  {new Date(hp.updated_at).toLocaleDateString("ja-JP")}完了
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Menu items */}
        <div className="space-y-1 pt-2">
          <div
            onClick={() => router.push("/notifications")}
            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer active:bg-gray-50 transition-colors"
          >
            <span className="text-base">🔔</span>
            <span className="text-sm text-foreground">通知</span>
            <span className="ml-auto text-gray-200 text-sm">›</span>
          </div>
        </div>

        {/* Logout */}
        <div className="pt-4 border-t border-gray-100 mt-4">
          <button
            onClick={() => {
              if (confirm("ログアウトしますか？")) {
                logout();
              }
            }}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-sm text-gray-400 bg-transparent border border-gray-100 cursor-pointer active:bg-gray-50 transition-colors"
            aria-label="ログアウト"
          >
            🚪 ログアウト
          </button>
        </div>
      </div>
    </div>
  );
}
