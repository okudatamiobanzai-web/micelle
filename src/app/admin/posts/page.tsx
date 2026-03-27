"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchPosts } from "@/lib/data";
import type { Post } from "@/lib/types";

const STATUS_FILTERS = [
  { id: "all", label: "すべて" },
  { id: "open", label: "募集中" },
  { id: "matched", label: "マッチ済" },
  { id: "resolved", label: "完了" },
];

export default function AdminPostsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-gray-400">読み込み中...</div>;
  }

  const filtered = filter === "all" ? posts : posts.filter((p) => p.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">投稿管理</h1>
        <div className="text-sm text-gray-400">{filtered.length}件</div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg text-sm border cursor-pointer transition-all ${
              filter === f.id
                ? "bg-primary-400 text-white border-primary-400 font-medium"
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">種別</th>
              <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">タイトル</th>
              <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">投稿者</th>
              <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">カテゴリ</th>
              <th className="text-center text-xs text-gray-400 font-medium px-4 py-3">ステータス</th>
              <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">日付</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((post) => (
              <tr
                key={post.id}
                onClick={() => router.push(`/admin/posts/${post.id}`)}
                className="border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-lg ${
                    post.type === "help" ? "bg-primary-50 text-primary-800" : "bg-skill-50 text-skill-800"
                  }`}>
                    {post.type === "help" ? "困りごと" : "できます"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-foreground max-w-xs truncate">
                  {post.title}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {post.author?.display_name || "—"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{post.tag || "—"}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs px-2 py-1 rounded-lg ${
                    post.status === "open" ? "bg-primary-50 text-primary-600" :
                    post.status === "active" ? "bg-skill-50 text-skill-600" :
                    post.status === "matched" ? "bg-amber-50 text-amber-800" :
                    post.status === "resolved" ? "bg-gray-100 text-gray-600" : "bg-gray-50 text-gray-400"
                  }`}>
                    {post.status === "open" ? "募集中" : post.status === "active" ? "公開中" : post.status === "matched" ? "マッチ済" : post.status === "resolved" ? "完了" : post.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">
                  {new Date(post.created_at).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-300">
            該当する投稿がありません
          </div>
        )}
      </div>
    </div>
  );
}
