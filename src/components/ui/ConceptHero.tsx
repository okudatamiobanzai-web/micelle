"use client";

import { Orb } from "./Orb";

interface ConceptHeroProps {
  dismissed: boolean;
  onDismiss: () => void;
}

const steps = [
  { icon: "💬", title: "困りごとを書く", desc: "選ぶだけで投稿" },
  { icon: "✋", title: "できることを出す", desc: "スキルで貢献" },
  { icon: "🔗", title: "つながりが動く", desc: "紹介でつなぐ" },
];

export function ConceptHero({ dismissed, onDismiss }: ConceptHeroProps) {
  if (dismissed) return null;

  return (
    <div className="mx-4 my-3 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-50 via-[#f2faf6] to-background border border-primary-200/15 shadow-[0_2px_12px_rgba(93,202,165,.08)] relative">
      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3.5 bg-white/70 border-none text-gray-400 text-sm w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
      >
        ×
      </button>

      {/* Header */}
      <div className="px-5 pt-5 flex items-center gap-3.5">
        <Orb ch="mi" dots={6} size={48} colorClass="primary" pulse />
        <div>
          <div className="text-lg font-bold text-foreground tracking-tight">
            ミセルへようこそ
          </div>
          <div className="text-xs text-gray-600 mt-0.5 leading-relaxed">
            コワーキングスペースmilkのつながりから生まれた
            <br />
            道東の共助プラットフォーム
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="flex gap-0 px-3.5 pt-4.5 pb-4">
        {steps.map((s, i) => (
          <div key={i} className="flex-1 text-center relative">
            {i < 2 && (
              <div className="absolute top-4 -right-0.5 text-gray-200 text-xs">
                ›
              </div>
            )}
            <div className="w-9 h-9 rounded-[10px] bg-white/80 inline-flex items-center justify-center text-lg mb-1.5 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
              {s.icon}
            </div>
            <div className="text-[11px] font-semibold text-foreground">
              {s.title}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Tagline */}
      <div className="px-5 pb-4">
        <div className="py-2.5 px-3.5 bg-white/60 rounded-[10px] text-[11px] text-gray-600 leading-relaxed text-center backdrop-blur-sm">
          milkに集まる人のつながりが、地域のインフラになる。
          <br />
          困りごとも、スキルも、活動も。すべてが見える場所です。
        </div>
      </div>
    </div>
  );
}
