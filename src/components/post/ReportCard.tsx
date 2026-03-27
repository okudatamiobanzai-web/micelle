"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Orb } from "@/components/ui/Orb";
import { TAG_BADGE } from "@/lib/constants";
import type { Post } from "@/lib/types";

interface ReportCardProps {
  post: Post;
  onSelect: (post: Post) => void;
}

export function ReportCard({ post: p, onSelect }: ReportCardProps) {
  const tag = p.tag || "作業";
  const badge = TAG_BADGE[tag] || TAG_BADGE["作業"];

  return (
    <Card onClick={() => onSelect(p)} className="!p-0 overflow-hidden">
      {/* Content */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Badge text="完了" bgClass="bg-primary-400" fgClass="text-white" />
          <Badge text={tag} bgClass={badge.bg} fgClass={badge.fg} />
          <span className="text-[11px] text-gray-400 ml-auto">
            {new Date(p.updated_at).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}
          </span>
        </div>
        <div className="text-sm font-semibold text-foreground mb-2">{p.title}</div>
        <div className="flex items-center gap-1">
          <Orb
            ch={p.author?.avatar_char || "?"}
            dots={0}
            size={20}
            colorClass="primary"
          />
          <span className="text-[11px] text-gray-400">{p.author?.display_name}</span>
          {p.helper && (
            <>
              <span className="text-gray-200 text-[10px] mx-0.5">×</span>
              <Orb ch={p.helper.avatar_char} dots={0} size={20} colorClass="primary" />
              <span className="text-[11px] text-gray-400">{p.helper.display_name}</span>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
