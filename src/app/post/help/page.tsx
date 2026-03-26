"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TAG_ICON } from "@/lib/constants";

const TAGS = ["作業", "送迎", "制作", "子ども", "相談", "暮らし", "高齢者"] as const;

const REWARD_OPTIONS = [
  { id: "fixed", label: "固定金額", placeholder: "例: 5,000円" },
  { id: "hourly", label: "時給", placeholder: "例: 時給1,500円" },
  { id: "actual_cost", label: "実費のみ", placeholder: "" },
  { id: "free", label: "無償", placeholder: "" },
];

export default function PostHelpPage() {
  const router = useRouter();
  const [tag, setTag] = useState<string>("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [rewardType, setRewardType] = useState("");
  const [rewardAmount, setRewardAmount] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = tag && title.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    // TODO: Supabase に保存
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-4 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <div className="text-xl font-bold text-foreground mb-2">投稿しました！</div>
        <div className="text-sm text-gray-400 mb-6 leading-relaxed">
          milk運営が確認して、
          <br />
          ぴったりの人をつなぎます。
        </div>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 rounded-xl text-sm font-medium bg-primary-400 text-white border-none cursor-pointer"
        >
          掲示板に戻る
        </button>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 sticky top-0 bg-background z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-[13px] text-gray-400 bg-transparent border-none cursor-pointer"
          >
            ← 戻る
          </button>
          <div className="text-base font-bold text-foreground">困りごとを書く</div>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Category */}
        <div>
          <label className="text-xs text-gray-400 font-medium mb-2 block">
            カテゴリ <span className="text-coral-400">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={`px-3.5 py-2 rounded-xl text-sm border cursor-pointer transition-all ${
                  tag === t
                    ? "bg-primary-400 text-white border-primary-400 font-medium shadow-[0_2px_8px_rgba(29,158,117,.2)]"
                    : "bg-background text-gray-600 border-gray-100"
                }`}
              >
                {TAG_ICON[t]} {t}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="text-xs text-gray-400 font-medium mb-2 block">
            タイトル <span className="text-coral-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例: 雪下ろしをお願いしたい"
            className="w-full px-3.5 py-3 rounded-xl border border-gray-100 text-sm text-foreground placeholder:text-gray-200 focus:outline-none focus:border-primary-200 transition-colors bg-background"
          />
        </div>

        {/* Body */}
        <div>
          <label className="text-xs text-gray-400 font-medium mb-2 block">詳細</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="詳しい状況を書いてください（任意）"
            rows={4}
            className="w-full px-3.5 py-3 rounded-xl border border-gray-100 text-sm text-foreground placeholder:text-gray-200 focus:outline-none focus:border-primary-200 transition-colors bg-background resize-none"
          />
        </div>

        {/* Reward */}
        <div>
          <label className="text-xs text-gray-400 font-medium mb-2 block">
            お礼・報酬
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {REWARD_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setRewardType(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs border cursor-pointer transition-all ${
                  rewardType === opt.id
                    ? "bg-primary-50 text-primary-800 border-primary-200 font-medium"
                    : "bg-background text-gray-600 border-gray-100"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {rewardType && REWARD_OPTIONS.find((o) => o.id === rewardType)?.placeholder && (
            <input
              type="text"
              value={rewardAmount}
              onChange={(e) => setRewardAmount(e.target.value)}
              placeholder={REWARD_OPTIONS.find((o) => o.id === rewardType)?.placeholder}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-100 text-sm text-foreground placeholder:text-gray-200 focus:outline-none focus:border-primary-200 bg-background"
            />
          )}
        </div>

        {/* Date / Time */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-gray-400 font-medium mb-2 block">
              希望日
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-100 text-sm text-foreground focus:outline-none focus:border-primary-200 bg-background"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-400 font-medium mb-2 block">
              希望時間
            </label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="例: 14:00〜"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-100 text-sm text-foreground placeholder:text-gray-200 focus:outline-none focus:border-primary-200 bg-background"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full p-3.5 rounded-xl text-[15px] font-medium border-none cursor-pointer transition-all ${
            canSubmit
              ? "bg-primary-400 text-white shadow-[0_2px_8px_rgba(29,158,117,.26)]"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          💬 投稿する
        </button>
      </div>
    </div>
  );
}
