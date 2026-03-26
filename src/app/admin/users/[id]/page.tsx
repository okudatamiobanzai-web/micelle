"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Orb } from "@/components/ui/Orb";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { GiftedTags } from "@/components/ui/GiftedTags";
import { StatsGrid } from "@/components/profile/StatsGrid";
import { PortfolioEditor } from "@/components/profile/PortfolioEditor";
import { PortfolioSection } from "@/components/profile/PortfolioSection";
import { people, samplePortfolios } from "@/lib/sample-data";
import type { PortfolioItemType } from "@/lib/types";

export default function AdminUserDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const router = useRouter();
  const person = people.find((p) => p.id === id);

  const [milkEndorsed, setMilkEndorsed] = useState(!!person?.milkComment);
  const [milkComment, setMilkComment] = useState(person?.milkComment || "");
  const [aboutMe, setAboutMe] = useState(person?.aboutMe || "");
  const [pubInstagram, setPubInstagram] = useState(person?.snsPublic?.instagram || "");
  const [pubTwitter, setPubTwitter] = useState(person?.snsPublic?.twitter || "");
  const [pubWebsite, setPubWebsite] = useState(person?.snsPublic?.website || "");
  const [privLine, setPrivLine] = useState(person?.snsPrivate?.line || "");
  const [privFacebook, setPrivFacebook] = useState(person?.snsPrivate?.facebook || "");
  const [portfolioItems, setPortfolioItems] = useState(samplePortfolios[id] || []);
  const [saved, setSaved] = useState(false);

  if (!person) {
    return <div className="p-10 text-center text-gray-400">ユーザーが見つかりません</div>;
  }

  const handleSave = () => {
    // TODO: Save to Supabase
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddPortfolio = (item: { type: PortfolioItemType; title?: string; description?: string; url?: string }) => {
    const newItem = {
      id: `temp-${Date.now()}`,
      ...item,
      sort_order: portfolioItems.length,
    };
    setPortfolioItems((prev) => [...prev, newItem]);
  };

  const handleDeletePortfolio = (itemId: string) => {
    setPortfolioItems((prev) => prev.filter((i) => i.id !== itemId));
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
              <Orb ch={person.ch} dots={person.dots} size={56} colorClass={person.colorClass} />
              <div>
                <div className="text-xl font-bold text-foreground">{person.name}</div>
                <div className="text-sm text-gray-400">{person.area}</div>
              </div>
            </div>
            <StatsGrid
              completedHelp={person.completedHelp}
              completedReq={person.completedReq}
              referrals={person.referrals}
              tagCount={person.gifted.length}
            />
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
              {person.can.map((s) => (
                <SkillBadge key={s} skill={s} variant="compact" />
              ))}
            </div>
          </div>

          {/* Gifted tags */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <div className="text-sm font-medium text-foreground mb-2">もらったタグ</div>
            <GiftedTags tags={person.gifted} />
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            className={`w-full py-3 rounded-xl text-sm font-medium border-none cursor-pointer transition-all ${
              saved
                ? "bg-primary-50 text-primary-600"
                : "bg-primary-400 text-white shadow-[0_2px_8px_rgba(29,158,117,.26)]"
            }`}
          >
            {saved ? "✓ 保存しました" : "保存する"}
          </button>
        </div>
      </div>
    </div>
  );
}
