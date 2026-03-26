"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Orb } from "@/components/ui/Orb";
import { PortfolioEditor } from "@/components/profile/PortfolioEditor";
import { SKILL_ICON } from "@/lib/constants";
import { people, samplePortfolios } from "@/lib/sample-data";
import type { PortfolioItemType } from "@/lib/types";

// Demo: 田中裕子さんとしてログイン中
const me = people.find((p) => p.id === "tanaka")!;

const ALL_SKILLS = [
  "デザイン", "保育", "送迎", "力仕事", "DIY", "除雪",
  "不動産", "写真撮影", "酪農体験", "IT", "相続相談", "空き家",
];

export default function EditProfilePage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(me.name);
  const [avatarChar, setAvatarChar] = useState(me.ch);
  const [area, setArea] = useState(me.area);
  const [aboutMe, setAboutMe] = useState(me.aboutMe || "");
  const [skills, setSkills] = useState<string[]>(me.can);
  const [snsInstagram, setSnsInstagram] = useState(me.sns?.instagram || "");
  const [snsTwitter, setSnsTwitter] = useState("");
  const [snsFacebook, setSnsFacebook] = useState("");
  const [portfolioItems, setPortfolioItems] = useState(samplePortfolios[me.id] || []);
  const [saved, setSaved] = useState(false);

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleAddPortfolio = (item: { type: PortfolioItemType; title?: string; description?: string; url?: string }) => {
    setPortfolioItems((prev) => [
      ...prev,
      { id: `temp-${Date.now()}`, ...item, sort_order: prev.length },
    ]);
  };

  const handleDeletePortfolio = (id: string) => {
    setPortfolioItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleSave = () => {
    // TODO: Save to Supabase
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      router.push("/mypage");
    }, 1500);
  };

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
          <div className="text-base font-bold text-foreground">プロフィール編集</div>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <Orb ch={avatarChar} dots={me.dots} size={80} colorClass={me.colorClass} />
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400">表示文字</label>
            <input
              type="text"
              value={avatarChar}
              onChange={(e) => setAvatarChar(e.target.value.slice(0, 1))}
              maxLength={1}
              className="w-12 text-center px-2 py-1.5 rounded-lg border border-gray-100 text-sm text-foreground focus:outline-none focus:border-primary-200 bg-background"
            />
          </div>
        </div>

        {/* Basic info */}
        <div>
          <label className="text-xs text-gray-400 font-medium mb-1.5 block">
            表示名 <span className="text-coral-400">*</span>
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-3.5 py-3 rounded-xl border border-gray-100 text-sm text-foreground focus:outline-none focus:border-primary-200 bg-background"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 font-medium mb-1.5 block">エリア</label>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="例: 中標津町、東2条"
            className="w-full px-3.5 py-3 rounded-xl border border-gray-100 text-sm text-foreground placeholder:text-gray-200 focus:outline-none focus:border-primary-200 bg-background"
          />
        </div>

        {/* About me */}
        <div>
          <label className="text-xs text-gray-400 font-medium mb-1.5 block">自己紹介</label>
          <textarea
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            placeholder="自分のことを書いてください"
            rows={4}
            className="w-full px-3.5 py-3 rounded-xl border border-gray-100 text-sm text-foreground placeholder:text-gray-200 focus:outline-none focus:border-primary-200 bg-background resize-none"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="text-xs text-gray-400 font-medium mb-2 block">できること</label>
          <div className="flex flex-wrap gap-2">
            {ALL_SKILLS.map((s) => (
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

        {/* SNS */}
        <div>
          <label className="text-xs text-gray-400 font-medium mb-2 block">SNS</label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm w-20 text-gray-600 shrink-0">Instagram</span>
              <input
                type="text"
                value={snsInstagram}
                onChange={(e) => setSnsInstagram(e.target.value)}
                placeholder="ユーザー名"
                className="flex-1 px-3 py-2.5 rounded-xl border border-gray-100 text-sm text-foreground placeholder:text-gray-200 focus:outline-none focus:border-primary-200 bg-background"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm w-20 text-gray-600 shrink-0">X (Twitter)</span>
              <input
                type="text"
                value={snsTwitter}
                onChange={(e) => setSnsTwitter(e.target.value)}
                placeholder="ユーザー名"
                className="flex-1 px-3 py-2.5 rounded-xl border border-gray-100 text-sm text-foreground placeholder:text-gray-200 focus:outline-none focus:border-primary-200 bg-background"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm w-20 text-gray-600 shrink-0">Facebook</span>
              <input
                type="text"
                value={snsFacebook}
                onChange={(e) => setSnsFacebook(e.target.value)}
                placeholder="ユーザー名"
                className="flex-1 px-3 py-2.5 rounded-xl border border-gray-100 text-sm text-foreground placeholder:text-gray-200 focus:outline-none focus:border-primary-200 bg-background"
              />
            </div>
          </div>
        </div>

        {/* Portfolio */}
        <PortfolioEditor
          items={portfolioItems}
          onAdd={handleAddPortfolio}
          onDelete={handleDeletePortfolio}
          getImageUrl={(p) => p}
        />

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={!displayName.trim()}
          className={`w-full p-3.5 rounded-xl text-[15px] font-medium border-none cursor-pointer transition-all ${
            saved
              ? "bg-primary-50 text-primary-600"
              : displayName.trim()
                ? "bg-primary-400 text-white shadow-[0_2px_8px_rgba(29,158,117,.26)]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {saved ? "✓ 保存しました！" : "保存する"}
        </button>
      </div>
    </div>
  );
}
