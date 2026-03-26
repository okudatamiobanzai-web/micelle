import { Orb } from "@/components/ui/Orb";
import { MilkBadge } from "@/components/ui/MilkBadge";

interface ProfileHeaderProps {
  name: string;
  ch: string;
  dots: number;
  colorClass: string;
  area: string;
  isMilkEndorsed: boolean;
  sns?: Record<string, string>;
  showEditButton?: boolean;
  onEdit?: () => void;
}

export function ProfileHeader({
  name,
  ch,
  dots,
  colorClass,
  area,
  isMilkEndorsed,
  sns,
  showEditButton,
  onEdit,
}: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-3.5">
      <Orb ch={ch} dots={dots} size={64} colorClass={colorClass} pulse />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl font-bold text-foreground">{name}</span>
          {isMilkEndorsed && <MilkBadge />}
        </div>
        <div className="text-xs text-gray-400">{area}</div>
        {sns?.instagram && (
          <div className="text-xs text-blue-400 mt-0.5">@{sns.instagram}</div>
        )}
      </div>
      {showEditButton && (
        <button
          onClick={onEdit}
          className="text-xs text-gray-400 bg-surface border border-gray-100 px-3 py-1.5 rounded-lg cursor-pointer"
        >
          編集
        </button>
      )}
    </div>
  );
}
