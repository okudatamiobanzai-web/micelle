"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Orb } from "@/components/ui/Orb";
import { people, type SamplePost } from "@/lib/sample-data";

const TAG_BADGE: Record<string, { bg: string; fg: string }> = {
  作業: { bg: "bg-primary-50", fg: "text-primary-800" },
  送迎: { bg: "bg-blue-50", fg: "text-blue-800" },
  制作: { bg: "bg-purple-50", fg: "text-purple-800" },
  子ども: { bg: "bg-coral-50", fg: "text-coral-800" },
  相談: { bg: "bg-amber-50", fg: "text-amber-800" },
  暮らし: { bg: "bg-primary-50", fg: "text-primary-800" },
};

interface ReportCardProps {
  post: SamplePost;
  onSelect: (post: SamplePost) => void;
}

export function ReportCard({ post: p, onSelect }: ReportCardProps) {
  if (!p.report) return null;
  const r = p.report;
  const tag = p.tag || "作業";
  const badge = TAG_BADGE[tag] || TAG_BADGE["作業"];
  const helper = people.find((pp) => pp.id === r.helperId);

  return (
    <Card onClick={() => onSelect(p)} className="!p-0 overflow-hidden">
      {/* Photo strip */}
      {r.photos?.length > 0 && (
        <div className="flex h-20">
          {r.photos.slice(0, 3).map((ph, i) => (
            <div
              key={i}
              className="flex-1 flex items-center justify-center"
              style={{
                background: ph.color || "var(--color-surface)",
                borderRight: i < Math.min(r.photos.length, 3) - 1 ? "2px solid white" : "none",
              }}
            >
              <span className="text-[22px] opacity-20">{ph.icon || "📷"}</span>
            </div>
          ))}
          {r.photos.length > 3 && (
            <div className="flex-1 bg-gray-50 flex items-center justify-center text-xs text-gray-600 font-medium">
              +{r.photos.length - 3}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Badge text="完了" bgClass="bg-primary-400" fgClass="text-white" />
          <Badge text={tag} bgClass={badge.bg} fgClass={badge.fg} />
          <span className="text-[11px] text-gray-400 ml-auto">{r.completedDate}</span>
        </div>
        <div className="text-sm font-semibold text-foreground mb-2">{p.title}</div>
        <div className="flex items-center gap-1">
          <Orb
            ch={p.posterCh || "?"}
            dots={p.posterDots || 0}
            size={20}
            colorClass={(p.posterDots || 0) > 2 ? "primary" : "gray"}
          />
          <span className="text-[11px] text-gray-400">{p.poster}</span>
          <span className="text-gray-200 text-[10px] mx-0.5">×</span>
          {helper && (
            <>
              <Orb ch={helper.ch} dots={helper.dots} size={20} colorClass={helper.colorClass} />
              <span className="text-[11px] text-gray-400">{helper.name}</span>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
