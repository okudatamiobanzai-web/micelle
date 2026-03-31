"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { useAuth } from "@/components/AuthProvider";
import { fetchProfile, fetchPosts, closePost, resolvePost } from "@/lib/data";
import { LoginPrompt } from "@/components/ui/LoginPrompt";
import { logout } from "@/lib/liff";
import type { Profile, Post } from "@/lib/types";

export default function MyPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mySkillPosts, setMySkillPosts] = useState<Post[]>([]);
  const [myHelpPosts, setMyHelpPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }

    async function load() {
      try {
        const [p, skillPosts, helpPosts] = await Promise.all([
          fetchProfile(user!.id),
          fetchPosts({ type: "skill" }),
          fetchPosts({ type: "help" }),
        ]);
        setProfile(p);
        setMySkillPosts(skillPosts.filter((sp) => sp.author_id === user!.id));
        setMyHelpPosts(helpPosts.filter((hp) => hp.author_id === user!.id && hp.status !== "closed" && hp.status !== "resolved"));
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
          pictureUrl={profile.picture_url}
          snsPublic={profile.sns_public}
          showEditButton
          onEdit={() => router.push("/mypage/edit")}
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
                className="p-3 bg-gradient-to-br from-skill-50 to-background rounded-xl border border-skill-100/30 mb-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="flex-1 cursor-pointer active:scale-[0.98] transition-all"
                    onClick={() => router.push(`/skill/${sp.id}`)}
                  >
                    <div className="text-sm font-semibold text-foreground">{sp.title}</div>
                    <div className="text-xs text-skill-600 mt-1">{sp.pricing}</div>
                    <div className="text-[11px] text-gray-400 mt-1">🙋 {sp.interested_count ?? 0}人が興味</div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => router.push(`/skill/${sp.id}/edit`)}
                      className="text-[11px] text-gray-400 bg-white border border-gray-100 px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      編集
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm("この投稿を取り下げますか？")) return;
                        await closePost(sp.id);
                        setMySkillPosts((prev) => prev.filter((p) => p.id !== sp.id));
                      }}
                      className="text-[11px] text-gray-400 bg-white border border-gray-100 px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      取り下げ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My help posts */}
        {myHelpPosts.length > 0 && (
          <div>
            <div className="text-xs text-gray-400 mb-2 font-medium">自分の「困りごと」</div>
            {myHelpPosts.map((hp) => (
              <div
                key={hp.id}
                className="p-3 bg-white rounded-xl border border-gray-100 mb-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="flex-1 cursor-pointer active:scale-[0.98] transition-all"
                    onClick={() => router.push(`/help/${hp.id}`)}
                  >
                    <div className="text-sm font-semibold text-foreground">{hp.title}</div>
                    <div className="text-[11px] text-gray-400 mt-1">
                      {hp.status === "matched" ? "✓ 対応中" : "受付中"}
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      if (!confirm("この投稿を取り下げますか？")) return;
                      await closePost(hp.id);
                      setMyHelpPosts((prev) => prev.filter((p) => p.id !== hp.id));
                    }}
                    className="text-[11px] text-gray-400 bg-white border border-gray-100 px-3 py-1.5 rounded-lg cursor-pointer shrink-0"
                  >
                    取り下げ
                  </button>
                </div>
                {hp.status === "matched" && (
                  <button
                    onClick={async () => {
                      if (!confirm("解決済みにしますか？")) return;
                      await resolvePost(hp.id);
                      setMyHelpPosts((prev) => prev.filter((p) => p.id !== hp.id));
                    }}
                    className="mt-2 w-full text-[11px] text-primary-600 bg-primary-50 border border-primary-100 py-1.5 rounded-lg cursor-pointer"
                  >
                    ✅ 解決済みにする
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

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
