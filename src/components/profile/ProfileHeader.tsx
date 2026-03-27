import { Orb } from "@/components/ui/Orb";
import { MilkBadge } from "@/components/ui/MilkBadge";

const SNS_LABELS: Record<string, { icon: string; prefix: string }> = {
  instagram: { icon: "📸", prefix: "@" },
  twitter: { icon: "𝕏", prefix: "@" },
  facebook: { icon: "📘", prefix: "" },
  line: { icon: "💬", prefix: "LINE: " },
  website: { icon: "🌐", prefix: "" },
};

interface ProfileHeaderProps {
  name: string;
  ch: string;
  dots: number;
  colorClass: string;
  area: string;
  isMilkEndorsed: boolean;
  snsPublic?: Record<string, string>;
  snsPrivate?: Record<string, string>;
  isMatched?: boolean; // マッチ済みならprivate SNSも表示
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
  snsPublic,
  snsPrivate,
  isMatched = false,
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

        {/* Public SNS - always visible */}
        {snsPublic && Object.keys(snsPublic).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1.5">
            {Object.entries(snsPublic).map(([key, value]) => {
              const info = SNS_LABELS[key] || { icon: "🔗", prefix: "" };
              return (
                <span key={key} className="text-xs text-blue-400">
                  {info.icon} {info.prefix}{value}
                </span>
              );
            })}
          </div>
        )}

        {/* Private SNS - only after match */}
        {isMatched && snsPrivate && Object.keys(snsPrivate).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {Object.entries(snsPrivate).map(([key, value]) => {
              const info = SNS_LABELS[key] || { icon: "🔗", prefix: "" };
              return (
                <span key={key} className="text-xs text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">
                  {info.icon} {info.prefix}{value}
                </span>
              );
            })}
          </div>
        )}

        {/* Private SNS hint - when not matched */}
        {!isMatched && snsPrivate && Object.keys(snsPrivate).length > 0 && (
          <div className="text-[11px] text-gray-200 mt-1">
            🔒 連絡先はマッチ後に公開されます
          </div>
        )}
      </div>
      {showEditButton && (
        <button
          onClick={onEdit}
          aria-label="プロフィールを編集"
          className="text-xs text-gray-400 bg-surface border border-gray-100 px-3 py-1.5 rounded-lg cursor-pointer"
        >
          編集
        </button>
      )}
    </div>
  );
}
