"use client";

import { useState, useEffect } from "react";
import { fetchPosts, fetchPeople } from "@/lib/data";
import type { Post, Profile } from "@/lib/types";

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [people, setPeople] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchPosts(), fetchPeople()])
      .then(([postsData, peopleData]) => {
        setPosts(postsData);
        setPeople(peopleData);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-gray-400">読み込み中...</div>;
  }

  const openPosts = posts.filter((p) => p.status === "open" || p.status === "active");
  const resolvedPosts = posts.filter((p) => p.status === "resolved");
  const helpPosts = posts.filter((p) => p.type === "help");
  const skillPosts = posts.filter((p) => p.type === "skill");

  const stats = [
    { label: "登録ユーザー", value: people.length, icon: "👥" },
    { label: "投稿数", value: posts.length, icon: "📋" },
    { label: "募集中", value: openPosts.length, icon: "🟢" },
    { label: "完了", value: resolvedPosts.length, icon: "✅" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">ダッシュボード</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-3xl font-bold text-foreground">{s.value}</div>
            <div className="text-sm text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <h2 className="text-base font-semibold text-foreground mb-4">最近の困りごと</h2>
          <div className="space-y-3">
            {helpPosts.length === 0 ? (
              <div className="text-sm text-gray-300 py-4 text-center">まだ困りごとの投稿がありません</div>
            ) : helpPosts.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <div className="text-sm font-medium text-foreground">{p.title}</div>
                  <div className="text-xs text-gray-400">
                    {p.author?.display_name} ·{" "}
                    {new Date(p.created_at).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-lg ${
                  p.status === "open" ? "bg-primary-50 text-primary-600" :
                  p.status === "matched" ? "bg-amber-50 text-amber-800" :
                  p.status === "resolved" ? "bg-gray-50 text-gray-600" : "bg-gray-50 text-gray-400"
                }`}>
                  {p.status === "open" ? "募集中" : p.status === "matched" ? "マッチ済" : p.status === "resolved" ? "完了" : p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <h2 className="text-base font-semibold text-foreground mb-4">「できます」一覧</h2>
          <div className="space-y-3">
            {skillPosts.length === 0 ? (
              <div className="text-sm text-gray-300 py-4 text-center">まだ「できます」の投稿がありません</div>
            ) : skillPosts.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <div className="text-sm font-medium text-foreground">{p.title}</div>
                  <div className="text-xs text-gray-400">{p.author?.display_name} · {p.pricing}</div>
                </div>
                <span className="text-xs text-gray-400">🙋 {p.interested_count ?? 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
