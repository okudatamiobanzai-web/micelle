"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Orb } from "@/components/ui/Orb";
import { Badge } from "@/components/ui/Badge";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { fetchProfile, fetchPosts } from "@/lib/data";
import { useAuth } from "@/components/AuthProvider";
import type { Profile, Post } from "@/lib/types";

export default function PersonDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const router = useRouter();
  const { user } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [skillPosts, setSkillPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [p, allSkills] = await Promise.all([
          fetchProfile(id),
          fetchPosts({ type: "skill" }),
        ]);
        if (p) {
          setProfile(p);
          setSkillPosts(allSkills.filter((sp) => sp.author_id === id));
        }
      } catch (e) {
        // fetch failed
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

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
          pictureUrl={profile.picture_url}
          snsPublic={profile.sns_public}
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

        {/* About me */}
        {profile.about_me && (
          <div>
            <div className="text-xs text-gray-400 mb-2 font-medium">自己紹介</div>
            <div className="text-sm leading-relaxed text-gray-600">{profile.about_me}</div>
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
    </div>
  );
}
