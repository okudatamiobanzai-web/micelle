"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Orb } from "@/components/ui/Orb";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { MilkBadge } from "@/components/ui/MilkBadge";
import type { Post } from "@/lib/types";

interface SkillPostCardProps {
  post: Post;
  onSelect: (post: Post) => void;
}

export function SkillPostCard({ post: p, onSelect }: SkillPostCardProps) {
  const author = p.author;
  if (!author) return null;

  return (
    <Card
      onClick={() => onSelect(p)}
      accentColor="var(--color-skill-400)"
      className="bg-gradient-to-br from-skill-50 to-background"
    >
      <div className="flex items-start gap-3">
        <Orb ch={author.avatar_char} dots={0} size={44} colorClass="primary" imageUrl={author.picture_url} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Badge text="できます" bgClass="bg-skill-100" fgClass="text-skill-800" icon="✋" />
          </div>
          <div className="text-[15px] font-semibold text-foreground mb-1 leading-snug line-clamp-2">
            {p.title}
          </div>
          {p.body && (
            <div className="text-[13px] text-gray-600 leading-relaxed mb-2 line-clamp-2">
              {p.body}
            </div>
          )}

          {/* Skills */}
          <div className="flex gap-1.5 flex-wrap mb-2">
            {(p.skills || []).map((s) => (
              <SkillBadge key={s} skill={s} variant="compact" />
            ))}
          </div>

          {/* Author + pricing */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-foreground">{author.display_name}</span>
              {author.is_milk_endorsed && <MilkBadge />}
            </div>
            <div className="text-xs text-skill-600 font-medium">{p.pricing}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-skill-100/30">
        <span className="text-[11px] text-gray-400 shrink-0">
          🙋 {p.interested_count ?? 0}人が興味
        </span>
      </div>
    </Card>
  );
}
