import { Orb } from "./Orb";

interface MilkBadgeProps {
  variant?: "inline" | "with-orb";
}

export function MilkBadge({ variant = "inline" }: MilkBadgeProps) {
  if (variant === "with-orb") {
    return (
      <div className="flex items-center gap-1">
        <Orb ch="mi" dots={6} size={16} colorClass="primary" />
        <span className="text-[11px] text-primary-600 font-medium">milk紹介</span>
      </div>
    );
  }
  return (
    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary-50 text-primary-800 font-medium">
      milk紹介
    </span>
  );
}
