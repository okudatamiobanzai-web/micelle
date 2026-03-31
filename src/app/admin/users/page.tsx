"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchPeople } from "@/lib/data";
import type { Profile } from "@/lib/types";

export default function AdminUsersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [people, setPeople] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPeople()
      .then(setPeople)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-gray-400">読み込み中...</div>;
  }

  const filtered = search
    ? people.filter(
        (p) =>
          p.display_name.includes(search) ||
          (p.area || "").includes(search) ||
          (p.can || []).some((c) => c.includes(search))
      )
    : people;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">ユーザー管理</h1>
        <div className="text-sm text-gray-400">{filtered.length}人</div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="名前・エリア・スキルで検索..."
          className="w-full max-w-md px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-foreground placeholder:text-gray-300 focus:outline-none focus:border-primary-200 bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">名前</th>
              <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">エリア</th>
              <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">スキル</th>
              <th className="text-center text-xs text-gray-400 font-medium px-4 py-3">milk紹介</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((person) => (
              <tr
                key={person.id}
                onClick={() => router.push(`/admin/users/${person.id}`)}
                className="border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-xs font-semibold text-primary-800">
                      {person.avatar_char}
                    </div>
                    <span className="text-sm font-medium text-foreground">{person.display_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{person.area || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {(person.can || []).slice(0, 3).map((s) => (
                      <span key={s} className="text-[11px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-600">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs text-gray-200">—</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-300">
            {search ? "検索結果がありません" : "登録ユーザーがいません"}
          </div>
        )}
      </div>
    </div>
  );
}
