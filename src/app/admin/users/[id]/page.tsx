"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Orb } from "@/components/ui/Orb";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { fetchProfile, updateProfile } from "@/lib/data";
import type { Profile } from "@/lib/types";

export default function AdminUserDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const router = useRouter();

  const [person, setPerson] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [aboutMe, setAboutMe] = useState("");
  const [pubInstagram, setPubInstagram] = useState("");
  const [pubTwitter, setPubTwitter] = useState("");
  const [pubWebsite, setPubWebsite] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile(id)
      .then((profileData) => {
        setPerson(profileData);
        if (profileData) {
          setAboutMe(profileData.about_me || "");
          setPubInstagram(profileData.sns_public?.instagram || "");
          setPubTwitter(profileData.sns_public?.twitter || "");
          setPubWebsite(profileData.sns_public?.website || "");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-10 text-center text-gray-400">読み込み中...</div>;
  if (!person) return <div className="p-10 text-center text-gray-400">ユーザーが見つかりません</div>;

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const snsPublic: Record<string, string> = {};
      if (pubInstagram) snsPublic.instagram = pubInstagram;
      if (pubTwitter) snsPublic.twitter = pubTwitter;
      if (pubWebsite) snsPublic.website = pubWebsite;

      await updateProfile(id, {
        about_me: aboutMe.trim() || undefined,
        sns_public: snsPublic,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("保存に失敗しました");
    } finally {
      setSaving(false);
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
        <div className="col-span-2 space-y-6">
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <Orb ch={person.avatar_char} dots={0} size={56} colorClass="primary" imageUrl={person.picture_url} />
              <div>
                <div className="text-xl font-bold text-foreground">{person.display_name}</div>
                <div className="text-sm text-gray-400">{person.area || "—"}</div>
              </div>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(person.can || []).map((s) => (
                <SkillBadge key={s} skill={s} variant="compact" />
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <label className="text-sm font-medium text-foreground mb-2 block">自己紹介</label>
            <textarea
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              rows={4}
              className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-sm text-foreground focus:outline-none focus:border-primary-200 bg-white resize-none"
              placeholder="ユーザーの自己紹介文..."
            />
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <div className="text-sm font-medium text-foreground mb-3">SNS</div>
            <div className="space-y-2">
              {([
                { label: "📸 Instagram", value: pubInstagram, setter: setPubInstagram },
                { label: "𝕏 X", value: pubTwitter, setter: setPubTwitter },
                { label: "🌐 Web", value: pubWebsite, setter: setPubWebsite },
              ] as const).map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="text-xs w-20 text-gray-400 shrink-0">{item.label}</span>
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

        <div>
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
