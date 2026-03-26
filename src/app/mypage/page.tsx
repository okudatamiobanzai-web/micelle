"use client";

import { useRouter } from "next/navigation";
import { Orb } from "@/components/ui/Orb";
import { GiftedTags } from "@/components/ui/GiftedTags";
import { SKILL_ICON } from "@/lib/constants";
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
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 sticky top-0 bg-background z-10">
        <div className="text-lg font-bold text-foreground tracking-tight">マイページ</div>
      </div>

      {/* Profile */}
      <div className="px-4 pt-4 pb-4">
        <div className="flex items-center gap-3.5">
          <Orb ch={me.ch} dots={me.dots} size={64} colorClass={me.colorClass} pulse />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-bold text-foreground">{me.name}</span>
              {me.milkComment && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary-50 text-primary-800 font-medium">
                  milk紹介
                </span>
              )}
            </div>
            <div className="text-xs text-gray-400">{me.area}</div>
          </div>
          <button className="text-xs text-gray-400 bg-surface border border-gray-100 px-3 py-1.5 rounded-lg cursor-pointer">
            編集
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-0 mt-4 bg-surface rounded-xl overflow-hidden">
          {[
            { label: "お手伝い", value: me.completedHelp },
            { label: "依頼", value: me.completedReq },
            { label: "紹介", value: me.referrals },
            { label: "タグ", value: me.gifted.length },
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

      <div className="px-4 space-y-5">
        {/* Skills */}
        <div>
          <div className="text-xs text-gray-400 mb-2 font-medium">できること</div>
          <div className="flex gap-1.5 flex-wrap">
            {me.can.map((skill) => (
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
