"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Orb } from "@/components/ui/Orb";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { GiftedTags } from "@/components/ui/GiftedTags";
import { StatsGrid } from "@/components/profile/StatsGrid";
import { PortfolioEditor } from "@/components/profile/PortfolioEditor";
import { PortfolioSection } from "@/components/profile/PortfolioSection";
import { fetchProfile, fetchPortfolio, fetchProfileStats, updateProfile, addPortfolioItem as dbAddPortfolio, deletePortfolioItem as dbDeletePortfolio } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import type { Profile, PortfolioItem, PortfolioItemType, ProfileStats } from "@/lib/types";

export default function AdminUserDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const router = useRouter();

  const [person, setPerson] = useState<Profile | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [milkEndorsed, setMilkEndorsed] = useState(false);
  const [milkComment, setMilkComment] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [pubInstagram, setPubInstagram] = useState("");
  const [pubTwitter, setPubTwitter] = useState("");
  const [pubWebsite, setPubWebsite] = useState("");
  const [privLine, setPrivLine] = useState("");
  const [privFacebook, setPrivFacebook] = useState("");
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([fetchProfile(id), fetchPortfolio(id), fetchProfileStats(id)])
      .then(([profileData, portfolioData, statsData]) => {
        setPerson(profileData);
        setPortfolioItems(portfolioData);
        setStats(statsData);
        if (profileData) {
          setMilkEndorsed(profileData.is_milk_endorsed);
          setMilkComment(profileData.milk_comment || "");
          setAboutMe(profileData.about_me || "");
          setPubInstagram(profileData.sns_public?.instagram || "");
          setPubTwitter(profileData.sns_public?.twitter || "");
          setPubWebsite(profileData.sns_public?.website || "");
          setPrivLine(profileData.sns_private?.line || "");
          setPrivFacebook(profileData.sns_private?.facebook || "");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-10 text-center text-gray-400">読み込み中...</div>;
  }

  if (!person) {
    return <div className="p-10 text-center text-gray-400">ユーザーが見つかりません</div>;
  }

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await updateProfile(id, {
        about_me: aboutMe.trim() || undefined,
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
      // Update milk endorsement and comment
      const { error } = await supabase
        .from("profiles")
        .update({
          is_milk_endorsed: milkEndorsed,
          milk_comment: milkComment.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      alert("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const handleAddPortfolio = async (item: { type: PortfolioItemType; title?: string; description?: string; url?: string }) => {
    try {
      const newItem = await dbAddPortfolio({
        profile_id: id,
        type: item.type,
        title: item.title,
        description: item.description,
        url: item.url,
        sort_order: portfolioItems.length,
      });
      setPortfolioItems((prev) => [...prev, newItem]);
    } catch (e) {
      alert("追加に失敗しました");
    }
  };

  const handleDeletePortfolio = async (itemId: string) => {
    try {
      await dbDeletePortfolio(itemId);
      setPortfolioItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch (e) {
      alert("削除に失敗しました");
    }
  };

  return (
    <div>
      <button
        onClick={() => router.push("/admin/users")}
        className="text-sm text-gray-400 bg-transparent border-none cursor-pointer mb-4"
      >
        ← ユーザー一覧に戻る
      </button>

      <div className="grid grid-cols-3 gap-6">
        {/* Left column: Profile info */}
        <div className="col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <Orb ch={person.avatar_char} dots={0} size={56} colorClass="primary" />
              <div>
                <div className="text-xl font-bold text-foreground">{person.display_name}</div>
                <div className="text-sm text-gray-400">{person.area || "—"}</div>
              </div>
            </div>
            {stats && (
              <StatsGrid
                completedHelp={stats.completed_help}
                completedReq={stats.completed_req}
                referrals={stats.referrals}
                tagCount={stats.tag_count}
              />
            )}
          </div>

          {/* About me */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <label className="text-sm font-medium text-foreground mb-2 block">自己紹介</label>
            <textarea
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              rows={4}
              className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-sm text-foreground focus:outline-none focus:border-primary-200 bg-white resize-none"
              placeholder="ユーザーの自己紹介文を入力..."
            />
          </div>

          {/* Portfolio */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <PortfolioEditor
              items={portfolioItems}
              onAdd={handleAddPortfolio}
              onDelete={handleDeletePortfolio}
              getImageUrl={(p) => p}
            />
          </div>

          {/* Portfolio preview */}
          {portfolioItems.length > 0 && (
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <div className="text-sm font-medium text-foreground mb-3">プレビュー</div>
              <PortfolioSection items={portfolioItems} getImageUrl={(p) => p} />
            </div>
          )}
        </div>

        {/* Right column: Settings */}
        <div className="space-y-6">
          {/* Milk endorsement */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <label className="text-sm font-medium text-foreground mb-3 block">milk承認</label>
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => setMilkEndorsed(!milkEndorsed)}
                className={`relative w-12 h-7 rounded-full cursor-pointer transition-colors ${
                  milkEndorsed ? "bg-primary-400" : "bg-gray-200"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                    milkEndorsed ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
              <span className="text-sm text-foreground">
                {milkEndorsed ? "承認済み" : "未承認"}
              </span>
            </div>

            <label className="text-xs text-gray-400 mb-1.5 block">milkコメント</label>
            <textarea
              value={milkComment}
              onChange={(e) => setMilkComment(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-foreground focus:outline-none focus:border-primary-200 bg-white resize-none"
              placeholder="この人についてmilkからの紹介文..."
            />
          </div>

          {/* SNS */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <div className="text-sm font-medium text-foreground mb-3">SNS・連絡先</div>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-400 mb-1.5">公開SNS</div>
                <div className="space-y-1.5">
                  {([
                    { label: "📸 Instagram", value: pubInstagram, setter: setPubInstagram },
                    { label: "𝕏 X", value: pubTwitter, setter: setPubTwitter },
                    { label: "🌐 Web", value: pubWebsite, setter: setPubWebsite },
                  ] as const).map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <span className="text-[11px] w-16 text-gray-400 shrink-0">{item.label}</span>
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => item.setter(e.target.value)}
                        className="flex-1 px-2 py-1.5 rounded-lg border border-gray-200 text-xs text-foreground bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1.5">🔒 連絡先（マッチ後公開）</div>
                <div className="space-y-1.5">
                  {([
                    { label: "💬 LINE", value: privLine, setter: setPrivLine },
                    { label: "📘 FB", value: privFacebook, setter: setPrivFacebook },
                  ] as const).map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <span className="text-[11px] w-16 text-gray-400 shrink-0">{item.label}</span>
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => item.setter(e.target.value)}
                        className="flex-1 px-2 py-1.5 rounded-lg border border-gray-200 text-xs text-foreground bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <div className="text-sm font-medium text-foreground mb-2">できること</div>
            <div className="flex gap-1.5 flex-wrap">
              {(person.can || []).map((s) => (
                <SkillBadge key={s} skill={s} variant="compact" />
              ))}
            </div>
          </div>

          {/* Gifted tags */}
          {stats && stats.gifted_tags.length > 0 && (
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <div className="text-sm font-medium text-foreground mb-2">もらったタグ</div>
              <GiftedTags tags={stats.gifted_tags} />
            </div>
          )}

          {/* Save button */}
          <button
            onClick={handleSave}
            className={`w-full py-3 rounded-xl text-sm font-medium border-none cursor-pointer transition-all ${
              saved
                ? "bg-primary-50 text-primary-600"
                : "bg-primary-400 text-white shadow-[0_2px_8px_rgba(29,158,117,.26)]"
            }`}
          >
            {saved ? "✓ 保存しました" : saving ? "保存中..." : "保存する"}
          </button>
        </div>
      </div>
    </div>
  );
}
