"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SKILL_ICON } from "@/lib/constants";
import { useAuth } from "@/components/AuthProvider";
import { LoginPrompt } from "@/components/ui/LoginPrompt";
import { createSkillPost } from "@/lib/data";

const SKILL_OPTIONS = [
  "デザイン", "保育", "送迎", "力仕事", "DIY", "除雪",
  "不動産", "写真撮影", "酪農体験", "IT", "相続相談", "空き家",
];

export default function PostSkillPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [pricing, setPricing] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newPostId, setNewPostId] = useState<string | null>(null);

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const canSubmit = title.trim().length > 0 && skills.length > 0 && !submitting && !!user;

  const handleSubmit = async () => {
    if (!canSubmit || !user) return;
    setSubmitting(true);
    try {
      const postId = await createSkillPost({
        author_id: user.id,
        title: title.trim(),
        body: body.trim() || undefined,
        skills,
        pricing: pricing || undefined,
      });
      setNewPostId(postId);
      setSubmitted(true);
    } catch (e) {
      alert("投稿に失敗しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return <LoginPrompt message="LINEでログインしてから投稿してください" />;
  }

  if (submitted) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-4 text-center">
        <div className="text-5xl mb-4">✋</div>
        <div className="text-xl font-bold text-foreground mb-2">「できます」を掲示しました！</div>
        <div className="text-sm text-gray-400 mb-6 leading-relaxed">
          興味を持った人から
          <br />
          連絡が届きます。
        </div>
        <div className="flex flex-col gap-3 items-center">
          {newPostId && (
            <button
              onClick={() => router.push(`/skill/${newPostId}`)}
              className="px-6 py-3 rounded-xl text-sm font-medium bg-skill-400 text-white border-none cursor-pointer"
            >
              投稿を見る
            </button>
          )}
          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-400 bg-transparent border-none cursor-pointer"
          >
            掲示板に戻る
          </button>
        </div>
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
          <div className="text-base font-bold text-foreground">できますを出す</div>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Title */}
        <div>
          <label className="text-xs text-gray-400 font-medium mb-2 block">
            タイトル <span className="text-coral-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例: チラシ・ポスターのデザインできます"
            maxLength={100}
            className="w-full px-3.5 py-3 rounded-xl border border-gray-100 text-sm text-foreground placeholder:text-gray-200 focus:outline-none focus:border-skill-200 transition-colors bg-background"
          />
          {title.length > 80 && (
            <div className="text-[11px] text-gray-400 text-right mt-0.5">{title.length}/100</div>
          )}
        </div>

        {/* Skills */}
        <div>
          <label className="text-xs text-gray-400 font-medium mb-2 block">
            できること <span className="text-coral-400">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {SKILL_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => toggleSkill(s)}
                className={`px-3 py-2 rounded-xl text-sm border cursor-pointer transition-all ${
                  skills.includes(s)
                    ? "bg-skill-400 text-white border-skill-400 font-medium shadow-[0_2px_8px_rgba(232,163,23,.2)]"
                    : "bg-background text-gray-600 border-gray-100"
                }`}
              >
                {SKILL_ICON[s] || "✦"} {s}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div>
          <label className="text-xs text-gray-400 font-medium mb-2 block">
            詳しい説明
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="どんなことができるか、経験や得意なことを書いてください"
            rows={4}
            className="w-full px-3.5 py-3 rounded-xl border border-gray-100 text-sm text-foreground placeholder:text-gray-200 focus:outline-none focus:border-skill-200 transition-colors bg-background resize-none"
          />
        </div>

        {/* Pricing */}
        <div>
          <label className="text-xs text-gray-400 font-medium mb-2 block">
            料金の目安
          </label>
          <input
            type="text"
            value={pricing}
            onChange={(e) => setPricing(e.target.value)}
            placeholder="例: 要相談 / 初回無料 / 時給1,000円〜"
            className="w-full px-3.5 py-3 rounded-xl border border-gray-100 text-sm text-foreground placeholder:text-gray-200 focus:outline-none focus:border-skill-200 transition-colors bg-background"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full p-3.5 rounded-xl text-[15px] font-medium border-none cursor-pointer transition-all ${
            canSubmit
              ? "bg-skill-400 text-white shadow-[0_2px_8px_rgba(232,163,23,.26)]"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          ✋ 掲示する
        </button>
      </div>
    </div>
  );
}
