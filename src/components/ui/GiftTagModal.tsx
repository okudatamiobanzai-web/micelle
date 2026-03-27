"use client";

import { useState } from "react";

const PRESET_TAGS = [
  "丁寧", "また頼みたい", "頼りになる", "時間に正確", "黙々と丁寧",
  "子ども好き", "センスがいい", "知識が深い", "話しやすい", "信頼できる",
  "あたたかい", "また行きたい", "仕事が早い", "親切",
];

interface GiftTagModalProps {
  personName: string;
  onClose: () => void;
  onSend: (tag: string) => void;
}

export function GiftTagModal({ personName, onClose, onSend }: GiftTagModalProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [custom, setCustom] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    const tag = selected || custom.trim();
    if (!tag) return;
    onSend(tag);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        <div
          className="relative w-full max-w-[430px] bg-background rounded-t-2xl p-6 text-center animate-[slideUp_0.3s_ease]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-4xl mb-3">✨</div>
          <div className="text-lg font-bold text-foreground mb-1">タグを贈りました！</div>
          <div className="text-sm text-gray-400 mb-4">
            {personName}さんに「{selected || custom}」が届きます
          </div>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-sm font-medium bg-primary-400 text-white border-none cursor-pointer"
          >
            閉じる
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-[430px] bg-background rounded-t-2xl p-5 max-h-[70vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="text-base font-bold text-foreground">
            {personName}さんにタグを贈る
          </div>
          <button
            onClick={onClose}
            aria-label="閉じる"
            className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border-none cursor-pointer text-sm"
          >
            ×
          </button>
        </div>

        <div className="text-xs text-gray-400 mb-2">タグを選んでください</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {PRESET_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => { setSelected(tag); setCustom(""); }}
              className={`px-3 py-1.5 rounded-xl text-xs border cursor-pointer transition-all ${
                selected === tag
                  ? "bg-primary-400 text-white border-primary-400 font-medium"
                  : "bg-background text-gray-600 border-gray-100"
              }`}
            >
              ✦ {tag}
            </button>
          ))}
        </div>

        <div className="text-xs text-gray-400 mb-2">または自由入力</div>
        <input
          type="text"
          value={custom}
          onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
          placeholder="例: 笑顔が素敵"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-100 text-sm text-foreground placeholder:text-gray-200 focus:outline-none focus:border-primary-200 bg-background mb-4"
        />

        <button
          onClick={handleSend}
          disabled={!selected && !custom.trim()}
          className={`w-full py-3 rounded-xl text-sm font-medium border-none cursor-pointer transition-all ${
            selected || custom.trim()
              ? "bg-primary-400 text-white shadow-[0_2px_8px_rgba(29,158,117,.26)]"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          ✦ タグを贈る
        </button>
      </div>
    </div>
  );
}
