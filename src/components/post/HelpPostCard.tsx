"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Orb } from "@/components/ui/Orb";
import { TAG_ICON, TAG_ACCENT, TAG_BADGE, TAG_ICON_BG } from "@/lib/constants";
import type { Post } from "@/lib/types";

interface HelpPostCardProps {
  post: Post;
  onSelect: (post: Post) => void;
}

export function HelpPostCard({ post: p, onSelect }: HelpPostCardProps) {
  const tag = p.tag || "作業";
  const badge = TAG_BADGE[tag] || TAG_BADGE["作業"];

  const rewardLabel = p.reward_amount
    ? p.reward_type === "hourly"
      ? `時給${p.reward_amount}`
      : p.reward_type === "fixed"
        ? p.reward_amount
        : p.reward_type === "free"
          ? "無償"
          : "実費"
    : p.reward_type === "free"
      ? "無償"
      : null;

  return (
    <Card onClick={() => onSelect(p)} accentColor={TAG_ACCENT[tag]}>
      <div className="flex items-start gap-3">
        {/* Tag icon */}
        <div
          className={`w-10 h-10 rounded-xl ${TAG_ICON_BG[tag]} flex items-center justify-center text-lg shrink-0`}
        >
          {TAG_ICON[tag]}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Badge text={tag} bgClass={badge.bg} fgClass={badge.fg} />
            {p.status === "matched" && (
              <Badge text="マッチ済" bgClass="bg-primary-50" fgClass="text-primary-600" icon="✓" />
            )}
          </div>
          <div className="text-[15px] font-semibold text-foreground mb-1.5 leading-snug line-clamp-2">
            {p.title}
          </div>
          <div className="flex items-center gap-1.5">
            <Orb
              ch={p.author?.avatar_char || "?"}
              dots={0}
              size={22}
              colorClass="primary"
              imageUrl={p.author?.picture_url}
            />
            <span className="text-xs text-gray-600">{p.author?.display_name}</span>
            <span className="text-[11px] text-gray-400">
              · {new Date(p.created_at).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}
            </span>
          </div>
        </div>

        {/* Reward */}
        <div className="text-right shrink-0">
          {rewardLabel ? (
            <div className="text-[13px] font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-lg">
              {rewardLabel}
            </div>
          ) : (
            <div className="text-xs text-gray-400 px-2 py-1">無償</div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-gray-50">
        <span className="text-xs text-gray-400">
          {p.status === "matched" ? "✓ マッチ済み" : p.status === "resolved" ? "✓ 完了" : "💬 詳細を見る"}
        </span>
      </div>
    </Card>
  );
}
