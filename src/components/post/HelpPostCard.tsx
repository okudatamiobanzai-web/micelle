"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Orb } from "@/components/ui/Orb";
import { TAG_ICON } from "@/lib/constants";
import type { SamplePost } from "@/lib/sample-data";

// Tag color CSS values (for Card accent border)
const TAG_ACCENT: Record<string, string> = {
  作業: "var(--color-primary-400)",
  送迎: "var(--color-blue-400)",
  制作: "var(--color-purple-400)",
  子ども: "var(--color-coral-400)",
  相談: "var(--color-amber-400)",
  暮らし: "var(--color-primary-400)",
  高齢者: "var(--color-primary-400)",
};

// Tag badge color classes
const TAG_BADGE: Record<string, { bg: string; fg: string }> = {
  作業: { bg: "bg-primary-50", fg: "text-primary-800" },
  送迎: { bg: "bg-blue-50", fg: "text-blue-800" },
  制作: { bg: "bg-purple-50", fg: "text-purple-800" },
  子ども: { bg: "bg-coral-50", fg: "text-coral-800" },
  相談: { bg: "bg-amber-50", fg: "text-amber-800" },
  暮らし: { bg: "bg-primary-50", fg: "text-primary-800" },
  高齢者: { bg: "bg-primary-50", fg: "text-primary-800" },
};

// Tag icon bg classes
const TAG_ICON_BG: Record<string, string> = {
  作業: "bg-primary-50",
  送迎: "bg-blue-50",
  制作: "bg-purple-50",
  子ども: "bg-coral-50",
  相談: "bg-amber-50",
  暮らし: "bg-primary-50",
  高齢者: "bg-primary-50",
};

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
