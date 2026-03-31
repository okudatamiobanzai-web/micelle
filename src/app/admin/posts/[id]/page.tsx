"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { fetchPost, fetchPeople } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { TAG_ICON, TAG_BADGE } from "@/lib/constants";
import type { Post, Profile } from "@/lib/types";

const STATUS_OPTIONS = ["open", "active", "matched", "resolved", "closed"];
const STATUS_LABEL: Record<string, string> = {
  open: "募集中", active: "公開中", matched: "対応中", resolved: "完了", closed: "終了",
};

export default function AdminPostDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [people, setPeople] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("open");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [matchUser, setMatchUser] = useState("");
  const [matching, setMatching] = useState(false);
  const [matchDone, setMatchDone] = useState(false);

  useEffect(() => {
    Promise.all([fetchPost(id), fetchPeople()])
      .then(([postData, peopleData]) => {
        setPost(postData);
        setPeople(peopleData);
        if (postData) setStatus(postData.status);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-10 text-center text-gray-400">読み込み中...</div>;
  if (!post) return <div className="p-10 text-center text-gray-400">投稿が見つかりません</div>;

  const tag = post.tag || "";
  const badge = TAG_BADGE[tag] || { bg: "bg-gray-50", fg: "text-gray-600" };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("posts")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const handleMatch = async () => {
    if (!matchUser || matching || !post) return;
    const targetPerson = people.find(p => p.id === matchUser);
    if (!confirm(`${targetPerson?.display_name}さんとマッチさせますか？`)) return;
    setMatching(true);
    try {
      const res = await fetch("/api/admin/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post.id,
          user1Id: post.author_id,
          user2Id: matchUser,
        }),
      });
      if (!res.ok) throw new Error("Match failed");
      setMatchDone(true);
      setStatus("matched");
      alert("マッチしました！双方にSlack通知を送りました。");
    } catch {
      alert("マッチングに失敗しました");
    } finally {
      setMatching(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => router.push("/admin/posts")}
        className="text-sm text-gray-400 bg-transparent border-none cursor-pointer mb-4"
      >
        ← 投稿一覧に戻る
      </button>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Post content */}
        <div className="col-span-2">
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              {tag && (
                <>
                  <span className="text-lg">{TAG_ICON[tag]}</span>
                  <Badge text={tag} bgClass={badge.bg} fgClass={badge.fg} />
                </>
              )}
              <span className={`text-xs px-2 py-1 rounded-lg ${
                post.type === "help" ? "bg-primary-50 text-primary-800" : "bg-skill-50 text-skill-800"
              }`}>
                {post.type === "help" ? "困りごと" : "できます"}
              </span>
              <span className="text-xs px-2 py-1 rounded-lg bg-gray-50 text-gray-600 ml-auto">
                {STATUS_LABEL[post.status] || post.status}
              </span>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">{post.title}</h2>
            {post.body && (
              <div className="text-sm text-gray-600 leading-relaxed mb-4 whitespace-pre-wrap">{post.body}</div>
            )}

            {post.pricing && (
              <div className="text-sm font-medium text-skill-600 bg-skill-50 px-3 py-2 rounded-lg inline-block mb-4">
                {post.pricing}
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-xs font-semibold text-primary-800">
                {post.author?.avatar_char || "?"}
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">{post.author?.display_name || "—"}</div>
                <div className="text-xs text-gray-400">
                  {new Date(post.created_at).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h3 className="text-sm font-medium text-foreground mb-3">ステータス変更</h3>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`w-full py-2.5 rounded-lg text-sm border cursor-pointer transition-all ${
                    status === s
                      ? "bg-primary-400 text-white border-primary-400 font-medium"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
            <button
              onClick={handleSave}
              className={`w-full mt-3 py-3 rounded-xl text-sm font-medium border-none cursor-pointer transition-all ${
                saved
                  ? "bg-primary-50 text-primary-600"
                  : "bg-primary-400 text-white shadow-[0_2px_8px_rgba(29,158,117,.26)]"
              }`}
            >
              {saved ? "✓ 保存しました" : saving ? "保存中..." : "変更を保存"}
            </button>
          </div>

          {/* Match */}
          {post.status !== "matched" && post.status !== "resolved" && (
            <div className="bg-white p-5 rounded-xl shadow-sm border-2 border-primary-100">
              <h3 className="text-sm font-bold text-foreground mb-1">🤝 マッチさせる</h3>
              <p className="text-xs text-gray-400 mb-3">選んだ人とマッチさせ、Slackに通知します</p>
              <select
                value={matchUser}
                onChange={(e) => setMatchUser(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-foreground bg-white mb-3"
              >
                <option value="">マッチさせる人を選択...</option>
                {people.filter(p => p.id !== post.author_id).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.display_name}{p.can?.length ? `（${p.can.slice(0, 2).join("・")}）` : ""}
                  </option>
                ))}
              </select>
              <button
                onClick={handleMatch}
                disabled={!matchUser || matching || matchDone}
                className={`w-full py-2.5 rounded-xl text-sm font-medium border-none cursor-pointer transition-all ${
                  matchDone
                    ? "bg-primary-50 text-primary-600"
                    : matchUser && !matching
                      ? "bg-primary-400 text-white shadow-[0_2px_8px_rgba(29,158,117,.26)]"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {matchDone ? "✓ マッチ済" : matching ? "マッチ中..." : "🤝 マッチさせる"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
