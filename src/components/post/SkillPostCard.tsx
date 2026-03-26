"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Orb } from "@/components/ui/Orb";
import { SKILL_ICON } from "@/lib/constants";
import { people, type SamplePost } from "@/lib/sample-data";

interface SkillPostCardProps {
  post: SamplePost;
  onSelect: (post: SamplePost) => void;
}

export function SkillPostCard({ post: p, onSelect }: SkillPostCardProps) {
  const person = people.find((pp) => pp.id === p.personId);
  if (!person) return null;

  return (
    <Card
      onClick={() => onSelect(p)}
      accentColor="var(--color-skill-400)"
      className="bg-gradient-to-br from-skill-50 to-background"
    >
      <div className="flex items-start gap-3">
        <Orb ch={person.ch} dots={person.dots} size={44} colorClass={person.colorClass} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Badge text="できます" bgClass="bg-skill-100" fgClass="text-skill-800" icon="✋" />
          </div>
          <div className="text-[15px] font-semibold text-foreground mb-1 leading-snug line-clamp-2">
            {p.title}
          </div>
          <div className="text-[13px] text-gray-600 leading-relaxed mb-2 line-clamp-2">
            {p.body}
          </div>

          {/* Skills */}
          <div className="flex gap-1.5 flex-wrap mb-2">
            {(p.skills || []).map((s) => (
              <span
                key={s}
                className="text-[11px] px-2 py-0.5 rounded-[10px] bg-background border border-gray-100 text-gray-800 inline-flex items-center gap-0.5"
              >
                <span className="text-[10px]">{SKILL_ICON[s] || "✦"}</span>
                {s}
              </span>
            ))}
          </div>

          {/* Author + pricing */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-foreground">{person.name}</span>
              {person.milkComment && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary-50 text-primary-800 font-medium">
                  milk紹介
                </span>
              )}
            </div>
            <div className="text-xs text-skill-600 font-medium">{p.pricing}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-skill-100/30">
        {person.gifted?.length > 0 && (
          <div className="flex gap-1 flex-1 overflow-hidden">
            {person.gifted.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[10px] px-1.5 py-0.5 rounded-lg bg-primary-50 text-primary-800 whitespace-nowrap"
              >
                ✦ {t}
              </span>
            ))}
          </div>
        )}
        <span className="text-[11px] text-gray-400 shrink-0">
          🙋 {p.interestedCount}人が興味
        </span>
      </div>
    </Card>
  );
}
