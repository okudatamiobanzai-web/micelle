"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SKILL_ICON } from "@/lib/constants";
import { useAuth } from "@/components/AuthProvider";
import { fetchPost, updateSkillPost } from "@/lib/data";

const SKILL_OPTIONS = [
  "デザイン", "保育", "送迎", "力仕事", "DIY", "除雪",
  "不動産", "写真撮影", "酪農体験", "IT", "相続相談", "空き家",
];

export default function SkillEditPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [pricing, setPricing] = useState("");
  const [linkInputs, setLinkInputs] = useState<string[]>(["", "", ""]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notOwner, setNotOwner] = useState(false);

  useEffect(() => {
    fetchPost(id).then((post) => {
      if (!post) { router.replace("/"); return; }
      if (post.author_id !== user?.id) { setNotOwner(true); setLoading(false); return; }
      setTitle(post.title);
      setBody(post.body || "");
      setSkills(post.skills || []);
      setPricing(post.pricing || "");
      const links = post.portfolio_links || [];
      setLinkInputs([links[0] || "", links[1] || "", links[2] || ""]);
      setLoading(false);
    });
  }, [id, user]);

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSave = async () => {
    if (!title.trim() || skills.length === 0 || saving) return;
    setSaving(true);
    try {
      const portfolioLinks = linkInputs.map((l) => l.trim()).filter(Boolean);
      await updateSkillPost(id, {
        title: title.trim(),
        body: body.trim() || undefined,
        skills,
        pricing: pricing || undefined,
        portfolio_links: portfolioLinks.length > 0 ? portfolioLinks : [],
      });
      router.push(`/skill/${id}`);
    } catch {
      alert("保存に失敗しました。もう一度お試しください。");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-400 text-sm">読み込み中...</div>
      </div>
    );
  }

  if (notOwner) {
    return (
      <div className="p-10 text-center">
        <div className="text-gray-400 text-sm">編集権限がありません</div>
      </div>
    );
  }

  const canSave = title.trim().length > 0 && skills.length > 0 && !saving;

  return (
    <div className="pb-20">
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 sticky top-0 bg-background z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-[13px] text-gray-400 bg-transparent border-none cursor-pointer"
          >
            ← 戻る
          </button>
          <div className="text-base font-bold text-foreground">できますを編集</div>
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
            maxLength={100}
            className="w-full px-3.5 py-3 rounded-xl border border-gray-100 text-sm text-foreground placeholder:text-gray-200 focus:outline-none focus:border-skill-200 transition-colors bg-background"
          />
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
          <label className="text-xs text-gray-400 font-medium mb-2 block">詳しい説明</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className="w-full px-3.5 py-3 rounded-xl border border-gray-100 text-sm text-foreground placeholder:text-gray-200 focus:outline-none focus:border-skill-200 transition-colors bg-background resize-none"
          />
        </div>

        {/* Pricing */}
        <div>
          <label className="text-xs text-gray-400 font-medium mb-2 block">料金の目安</label>
          <input
            type="text"
            value={pricing}
            onChange={(e) => setPricing(e.target.value)}
            placeholder="例: 要相談 / 初回無料 / 時給1,000円〜"
            className="w-full px-3.5 py-3 rounded-xl border border-gray-100 text-sm text-foreground placeholder:text-gray-200 focus:outline-none focus:border-skill-200 transition-colors bg-background"
          />
        </div>

        {/* Portfolio Links */}
        <div>
          <label className="text-xs text-gray-400 font-medium mb-1 block">
            ポートフォリオ・実績リンク
          </label>
          <div className="text-[11px] text-gray-300 mb-2">X・YouTube・InstagramのURLを貼ってください（最大3件）</div>
          <div className="space-y-2">
            {linkInputs.map((link, i) => (
              <input
                key={i}
                type="url"
                value={link}
                onChange={(e) => {
                  const next = [...linkInputs];
                  next[i] = e.target.value;
                  setLinkInputs(next);
                }}
                placeholder="例: https://www.youtube.com/watch?v=..."
                className="w-full px-3.5 py-3 rounded-xl border border-gray-100 text-sm text-foreground placeholder:text-gray-200 focus:outline-none focus:border-skill-200 transition-colors bg-background"
              />
            ))}
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`w-full p-3.5 rounded-xl text-[15px] font-medium border-none cursor-pointer transition-all ${
            canSave
              ? "bg-skill-400 text-white shadow-[0_2px_8px_rgba(232,163,23,.26)]"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {saving ? "保存中..." : "✅ 保存する"}
        </button>
      </div>
    </div>
  );
}
