"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Orb } from "@/components/ui/Orb";
import { Chip } from "@/components/ui/Chip";
import { ConceptHero } from "@/components/ui/ConceptHero";
import { HelpPostCard } from "@/components/post/HelpPostCard";
import { SkillPostCard } from "@/components/post/SkillPostCard";
import type { Post } from "@/lib/types";
import { fetchPosts } from "@/lib/data";

const TAGS = ["all", "💬 困りごと", "✋ できます"];

export default function HomePage() {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [heroVisible, setHeroVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    fetchPosts()
      .then((dbPosts) => {
        setPosts(dbPosts.filter((p) => p.status !== "resolved" && p.status !== "closed"));
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    const handler = () => setScrolled(main.scrollTop > 20);
    main.addEventListener("scroll", handler);
    return () => main.removeEventListener("scroll", handler);
  }, []);

  const isSkillOnly = filter === "✋ できます";
  const isHelpOnly = filter === "💬 困りごと";

  const filtered = isSkillOnly
    ? posts.filter((p) => p.type === "skill")
    : isHelpOnly
      ? posts.filter((p) => p.type === "help")
      : posts;

  const helpCount = posts.filter((p) => p.type === "help").length;
  const skillCount = posts.filter((p) => p.type === "skill").length;

  return (
    <div className="pb-20">
      {/* Header */}
      <div
        className={`sticky top-0 z-10 transition-all duration-300 ${
          scrolled
            ? "py-2.5 px-4 border-b border-gray-100 bg-white/92 backdrop-blur-xl"
            : "px-4 pt-4 pb-3 bg-background"
        }`}
      >
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => setHeroVisible(true)}
          >
            <Orb ch="mi" dots={6} size={scrolled ? 30 : 36} colorClass="primary" />
            <div>
              <div
                className={`font-bold text-foreground tracking-tight transition-all duration-300 ${
                  scrolled ? "text-base" : "text-lg"
                }`}
              >
                ミセル
              </div>
              {!scrolled && (
                <div className="text-[11px] text-gray-400 mt-px">milkの困りごと掲示板</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <ConceptHero dismissed={!heroVisible} onDismiss={() => setHeroVisible(false)} />

      {/* Filter chips */}
      <div className="flex gap-1.5 px-4 py-2 overflow-x-auto">
        {TAGS.map((t) => {
          const count =
            t === "all" ? posts.length :
            t === "💬 困りごと" ? helpCount :
            t === "✋ できます" ? skillCount : undefined;
          return (
            <Chip
              key={t}
              label={t === "all" ? "すべて" : t}
              selected={filter === t}
              onClick={() => setFilter(t)}
              count={count && count > 0 ? count : undefined}
            />
          );
        })}
      </div>

      {/* Count */}
      <div className="px-4 pt-1.5 pb-0.5">
        <span className="text-xs text-gray-400">
          {loading ? "読み込み中..." : `${filtered.length}件`}
        </span>
      </div>

      {/* Post list */}
      <div className="pb-20">
        {filtered.map((p) => {
          if (p.type === "skill") {
            return <SkillPostCard key={p.id} post={p} onSelect={(post) => router.push(`/skill/${post.id}`)} />;
          }
          return <HelpPostCard key={p.id} post={p} onSelect={(post) => router.push(`/help/${post.id}`)} />;
        })}
        {!loading && loadError && (
          <div className="p-10 text-center">
            <div className="text-3xl mb-3">⚠️</div>
            <div className="text-sm text-gray-400 mb-3">読み込みに失敗しました</div>
            <button onClick={() => window.location.reload()} className="text-xs text-primary-600 bg-primary-50 px-4 py-2 rounded-lg border-none cursor-pointer">
              再読み込み
            </button>
          </div>
        )}
        {!loading && !loadError && filtered.length === 0 && (
          <div className="p-10 text-center">
            <div className="text-3xl mb-3">📭</div>
            <div className="text-sm text-gray-400">まだ投稿がありません</div>
          </div>
        )}
      </div>
    </div>
  );
}
