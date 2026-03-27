"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Orb } from "@/components/ui/Orb";
import { PortfolioEditor } from "@/components/profile/PortfolioEditor";
import { SKILL_ICON } from "@/lib/constants";
import { useAuth } from "@/components/AuthProvider";
import { LoginPrompt } from "@/components/ui/LoginPrompt";
import { fetchProfile, updateProfile, fetchPortfolio, addPortfolioItem, deletePortfolioItem } from "@/lib/data";
import type { Profile, PortfolioItem, PortfolioItemType } from "@/lib/types";

const ALL_SKILLS = [
  "デザイン", "保育", "送迎", "力仕事", "DIY", "除雪",
  "不動産", "写真撮影", "酪農体験", "IT", "相続相談", "空き家",
];

export default function EditProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [displayName, setDisplayName] = useState("");
  const [avatarChar, setAvatarChar] = useState("？");
  const [area, setArea] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [pubInstagram, setPubInstagram] = useState("");
  const [pubTwitter, setPubTwitter] = useState("");
  const [pubWebsite, setPubWebsite] = useState("");
  const [privLine, setPrivLine] = useState("");
  const [privFacebook, setPrivFacebook] = useState("");
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }

    async function load() {
      try {
        const [p, portfolio] = await Promise.all([
          fetchProfile(user!.id),
          fetchPortfolio(user!.id),
        ]);
        if (p) {
          setProfile(p);
          setDisplayName(p.display_name);
          setAvatarChar(p.avatar_char);
          setArea(p.area || "");
          setAboutMe(p.about_me || "");
          setSkills(p.can || []);
          setPubInstagram(p.sns_public?.instagram || "");
          setPubTwitter(p.sns_public?.twitter || "");
          setPubWebsite(p.sns_public?.website || "");
          setPrivLine(p.sns_private?.line || "");
          setPrivFacebook(p.sns_private?.facebook || "");
        }
        setPortfolioItems(portfolio);
      } catch (e) {
        // load failed
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, authLoading]);

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleAddPortfolio = async (item: { type: PortfolioItemType; title?: string; description?: string; url?: string; file?: File }) => {
    if (!user) return;
    try {
      const newItem = await addPortfolioItem({
        profile_id: user.id,
        type: item.type,
        title: item.title,
        description: item.description,
        url: item.url,
        sort_order: portfolioItems.length,
      });
      setPortfolioItems((prev) => [...prev, newItem]);
    } catch (e) {
      alert("追加に失敗しました。");
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    try {
      await deletePortfolioItem(id);
      setPortfolioItems((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      alert("削除に失敗しました。");
    }
  };

  const handleSave = async () => {
    if (!user || saving) return;
    setSaving(true);
    try {
      await updateProfile(user.id, {
        display_name: displayName.trim(),
        avatar_char: avatarChar,
        area: area.trim() || undefined,
        about_me: aboutMe.trim() || undefined,
        can: skills,
        sns_public: {
          ...(pubInstagram && { instagram: pubInstagram }),
          ...(pubTwitter && { twitter: pubTwitter }),
          ...(pubWebsite && { website: pubWebsite }),
        },
        sns_private: {
          ...(privLine && { line: privLine }),
          ...(privFacebook && { facebook: privFacebook }),
        },
      });
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        router.push("/mypage");
      }, 1500);
    } catch (e) {
      alert("保存に失敗しました。もう一度お試しください。");
    } finally {
      setSaving(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-400 text-sm">読み込み中...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPrompt />;
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
          <div className="text-base font-bold text-foreground">プロフィール編集</div>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <Orb ch={avatarChar} dots={0} size={80} colorClass="primary" />
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

        {/* Public SNS */}
        <div>
          <label className="text-xs text-gray-400 font-medium mb-1 block">
            公開SNS <span className="text-[10px] text-gray-200">（誰でも見える）</span>
          </label>
          <div className="text-[11px] text-gray-200 mb-2">
            ポートフォリオとして公開したいアカウント
          </div>
          <div className="space-y-2">
            {([
              { label: "📸 Instagram", value: pubInstagram, setter: setPubInstagram },
              { label: "𝕏 X (Twitter)", value: pubTwitter, setter: setPubTwitter },
              { label: "🌐 Webサイト", value: pubWebsite, setter: setPubWebsite },
            ] as const).map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="text-xs w-24 text-gray-600 shrink-0">{item.label}</span>
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => item.setter(e.target.value)}
                  placeholder="ユーザー名 or URL"
                  className="flex-1 px-3 py-2.5 rounded-xl border border-gray-100 text-sm text-foreground placeholder:text-gray-200 focus:outline-none focus:border-primary-200 bg-background"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Private SNS */}
        <div>
          <label className="text-xs text-gray-400 font-medium mb-1 block">
            連絡先 <span className="text-[10px] text-coral-400">🔒 マッチ後のみ公開</span>
          </label>
          <div className="text-[11px] text-gray-200 mb-2">
            マッチした相手にだけ表示されます。最低1つ登録してください。
          </div>
          <div className="space-y-2">
            {([
              { label: "💬 LINE", value: privLine, setter: setPrivLine, placeholder: "LINE ID" },
              { label: "📘 Facebook", value: privFacebook, setter: setPrivFacebook, placeholder: "ユーザー名" },
            ] as const).map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="text-xs w-24 text-gray-600 shrink-0">{item.label}</span>
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => item.setter(e.target.value)}
                  placeholder={item.placeholder}
                  className="flex-1 px-3 py-2.5 rounded-xl border border-gray-100 text-sm text-foreground placeholder:text-gray-200 focus:outline-none focus:border-primary-200 bg-background"
                />
              </div>
            ))}
          </div>
          {!privLine && !privFacebook && (
            <div className="text-xs text-coral-400 mt-1.5">
              連絡先を最低1つ登録してください
            </div>
          )}
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
          disabled={!displayName.trim() || (!privLine && !privFacebook) || saving}
          className={`w-full p-3.5 rounded-xl text-[15px] font-medium border-none cursor-pointer transition-all ${
            saved
              ? "bg-primary-50 text-primary-600"
              : displayName.trim() && (privLine || privFacebook) && !saving
                ? "bg-primary-400 text-white shadow-[0_2px_8px_rgba(29,158,117,.26)]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {saved ? "✓ 保存しました！" : saving ? "保存中..." : "保存する"}
        </button>
      </div>
    </div>
  );
}
