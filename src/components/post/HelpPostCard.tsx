"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Orb } from "@/components/ui/Orb";
import { TAG_ICON, TAG_ACCENT, TAG_BADGE, TAG_ICON_BG } from "@/lib/constants";
import type { SamplePost } from "@/lib/sample-data";

interface HelpPostCardProps {
  post: SamplePost;
  onSelect: (post: SamplePost) => void;
}

export function HelpPostCard({ post: p, onSelect }: HelpPostCardProps) {
  const tag = p.tag || "作業";
  const badge = TAG_BADGE[tag] || TAG_BADGE["作業"];
  const hasRef = (p.comments || []).filter((c) => c.refId).length > 0;

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
              ch={p.posterCh || "?"}
              dots={p.posterDots || 0}
              size={22}
              colorClass={(p.posterDots || 0) > 2 ? "primary" : "gray"}
            />
            <span className="text-xs text-gray-600">{p.poster}</span>
            <span className="text-[11px] text-gray-400">· {p.date}</span>
          </div>
        </div>

        {/* Reward */}
        <div className="text-right shrink-0">
          {p.reward ? (
            <div className="text-[13px] font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-lg">
              {p.reward}
            </div>
          ) : (
            <div className="text-xs text-gray-400 px-2 py-1">無償</div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-gray-50">
        <span className="text-xs text-gray-400">
          💬{" "}
          {(p.comments || []).length > 0
            ? `${(p.comments || []).length}件のやりとり`
            : "まだやりとりなし"}
        </span>
        {hasRef && (
          <span className="text-[11px] text-primary-600 font-medium inline-flex items-center gap-0.5 bg-primary-50 px-2 py-0.5 rounded-lg">
            🔗 つなぎ{(p.comments || []).filter((c) => c.refId).length}件
          </span>
        )}
      </div>
    </Card>
  );
}
