const PALETTE = [
  { bg: "bg-primary-50", fg: "text-primary-800" },
  { bg: "bg-blue-50", fg: "text-blue-800" },
  { bg: "bg-purple-50", fg: "text-purple-800" },
  { bg: "bg-coral-50", fg: "text-coral-800" },
  { bg: "bg-amber-50", fg: "text-amber-800" },
];

interface GiftedTagsProps {
  tags: string[];
}

export function GiftedTags({ tags }: GiftedTagsProps) {
  if (!tags?.length) return null;

  return (
    <div className="flex gap-1.5 flex-wrap">
      {tags.map((tag, i) => {
        const c = PALETTE[i % PALETTE.length];
        return (
          <span
            key={tag}
            className={`text-[11px] px-2.5 py-0.5 rounded-xl font-medium ${c.bg} ${c.fg}`}
          >
            ✦ {tag}
          </span>
        );
      })}
    </div>
  );
}
