interface StatsGridProps {
  completedHelp: number;
  completedReq: number;
  referrals: number;
  tagCount: number;
}

export function StatsGrid({ completedHelp, completedReq, referrals, tagCount }: StatsGridProps) {
  const stats = [
    { label: "お手伝い", value: completedHelp },
    { label: "依頼", value: completedReq },
    { label: "紹介", value: referrals },
    { label: "タグ", value: tagCount },
  ];

  return (
    <div className="flex gap-0 mt-4 bg-surface rounded-xl overflow-hidden">
      {stats.map((s, i) => (
        <div
          key={i}
          className="flex-1 text-center py-3 border-r border-gray-100 last:border-r-0"
        >
          <div className="text-lg font-bold text-primary-600">{s.value}</div>
          <div className="text-[10px] text-gray-400">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
