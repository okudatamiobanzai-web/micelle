import { SKILL_ICON } from "@/lib/constants";

interface SkillBadgeProps {
  skill: string;
  variant?: "default" | "compact";
}

export function SkillBadge({ skill, variant = "default" }: SkillBadgeProps) {
  if (variant === "compact") {
    return (
      <span className="text-[11px] px-2 py-0.5 rounded-[10px] bg-background border border-gray-100 text-gray-800 inline-flex items-center gap-0.5">
        <span className="text-[10px]">{SKILL_ICON[skill] || "✦"}</span>
        {skill}
      </span>
    );
  }
  return (
    <span className="text-xs px-3 py-1.5 rounded-[10px] bg-skill-50 border border-skill-100 text-skill-800 inline-flex items-center gap-1">
      <span>{SKILL_ICON[skill] || "✦"}</span>
      {skill}
    </span>
  );
}
