import { Orb } from "@/components/ui/Orb";

const SNS_LABELS: Record<string, { icon: string; prefix: string }> = {
  instagram: { icon: "📸", prefix: "@" },
  twitter: { icon: "𝕏", prefix: "@" },
  website: { icon: "🌐", prefix: "" },
};

interface ProfileHeaderProps {
  name: string;
  ch: string;
  dots: number;
  colorClass: string;
  area: string;
  pictureUrl?: string;
  snsPublic?: Record<string, string>;
  showEditButton?: boolean;
  onEdit?: () => void;
}

export function ProfileHeader({
  name,
  ch,
  dots,
  colorClass,
  area,
  pictureUrl,
  snsPublic,
  showEditButton,
  onEdit,
}: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-3.5">
      <Orb ch={ch} dots={dots} size={64} colorClass={colorClass} pulse imageUrl={pictureUrl} />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl font-bold text-foreground">{name}</span>
        </div>
        <div className="text-xs text-gray-400">{area}</div>

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
