"use client";

import { useRouter } from "next/navigation";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { GiftedTags } from "@/components/ui/GiftedTags";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { StatsGrid } from "@/components/profile/StatsGrid";
import { people, posts } from "@/lib/sample-data";

// Demo: 田中裕子さんとしてログイン中
const me = people.find((p) => p.id === "tanaka")!;
const mySkillPosts = posts.filter((p) => p.type === "skill" && p.personId === me.id);
const myHelpPosts = posts.filter(
  (p) => p.type === "help" && p.report && p.report.helperId === me.id
);

export default function MyPage() {
  const router = useRouter();

  return (
    <div className="pb-20">
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 sticky top-0 bg-background z-10">
        <div className="text-lg font-bold text-foreground tracking-tight">マイページ</div>
      </div>

      <div className="px-4 pt-4 pb-4">
        <ProfileHeader
          name={me.name}
          ch={me.ch}
          dots={me.dots}
          colorClass={me.colorClass}
          area={me.area}
          isMilkEndorsed={!!me.milkComment}
          sns={me.sns}
          showEditButton
          onEdit={() => {/* TODO: open edit mode */}}
        />
        <StatsGrid
          completedHelp={me.completedHelp}
          completedReq={me.completedReq}
          referrals={me.referrals}
          tagCount={me.gifted.length}
        />
      </div>

      <div className="px-4 space-y-5">
        {/* Skills */}
        <div>
          <div className="text-xs text-gray-400 mb-2 font-medium">できること</div>
          <div className="flex gap-1.5 flex-wrap">
            {me.can.map((skill) => (
              <SkillBadge key={skill} skill={skill} />
            ))}
          </div>
        </div>

        {/* Gifted tags */}
        {me.gifted.length > 0 && (
          <div>
            <div className="text-xs text-gray-400 mb-2 font-medium">もらったタグ</div>
            <GiftedTags tags={me.gifted} />
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
                <div className="text-[11px] text-gray-400 mt-1">🙋 {sp.interestedCount}人が興味</div>
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
                <div className="text-[11px] text-gray-400 mt-0.5">{hp.report?.completedDate}完了</div>
              </div>
            ))}
          </div>
        )}

        {/* Menu items */}
        <div className="space-y-1 pt-2">
          {[
            { icon: "⭐", label: "お気に入り" },
            { icon: "🔔", label: "通知設定" },
            { icon: "📋", label: "利用履歴" },
            { icon: "❓", label: "ヘルプ" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer active:bg-gray-50 transition-colors"
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-sm text-foreground">{item.label}</span>
              <span className="ml-auto text-gray-200 text-sm">›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
