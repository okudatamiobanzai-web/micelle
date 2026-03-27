"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Orb } from "@/components/ui/Orb";
import { Chip } from "@/components/ui/Chip";
import { ConceptHero } from "@/components/ui/ConceptHero";
import { HelpPostCard } from "@/components/post/HelpPostCard";
import { SkillPostCard } from "@/components/post/SkillPostCard";
import { ReportCard } from "@/components/post/ReportCard";
import type { Post } from "@/lib/types";
import { fetchPosts, fetchNotifications } from "@/lib/data";
import { useAuth } from "@/components/AuthProvider";

const TAGS = [
  "all",
  "💬 困りごと",
  "✋ できます",
  "作業",
  "送迎",
  "制作",
  "子ども",
  "相談",
  "暮らし",
  "📋 完了",
];

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");
  const [heroVisible, setHeroVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [resolvedPosts, setResolvedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchPosts()
      .then((dbPosts) => {
        setPosts(dbPosts.filter((p) => p.status !== "resolved"));
        setResolvedPosts(dbPosts.filter((p) => p.status === "resolved"));
      })
      .catch(() => { setLoadError(true); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchNotifications(user.id)
      .then((notifs) => setUnreadCount(notifs.filter((n) => !n.read).length))
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    const handler = () => setScrolled(main.scrollTop > 20);
    main.addEventListener("scroll", handler);
    return () => main.removeEventListener("scroll", handler);
  }, []);

  const isCom = filter === "📋 完了";
  const isSkillOnly = filter === "✋ できます";
  const isHelpOnly = filter === "💬 困りごと";

  let filtered: Post[];
  if (isCom) filtered = resolvedPosts;
  else if (isSkillOnly) filtered = posts.filter((p) => p.type === "skill");
  else if (isHelpOnly) filtered = posts.filter((p) => p.type === "help" && p.status !== "resolved");
  else if (filter === "all") filtered = posts;
  else filtered = posts.filter((p) => p.type === "help" && p.tag === filter);

  const sorted = [...filtered].sort((a, b) => {
    if (a.status === "open" && b.status !== "open" && b.status !== "active") return -1;
    if ((a.status === "open" || a.status === "active") && b.status === "resolved") return -1;
    if (a.status === "resolved" && (b.status === "open" || b.status === "active")) return 1;
    return b.created_at.localeCompare(a.created_at);
  });

  const openCount = posts.filter((p) => p.status === "open" || p.status === "active").length;
  const helpCount = posts.filter((p) => p.type === "help" && p.status === "open").length;
  const skillCount = posts.filter((p) => p.type === "skill").length;

  const handleSelect = (post: Post) => {
    router.push(`/help/${post.id}`);
  };

  const handleSkillSelect = (post: Post) => {
    router.push(`/skill/${post.id}`);
  };

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

          <button onClick={() => router.push("/notifications")} className="relative bg-transparent border-none cursor-pointer p-1" aria-label="通知">
            <svg width="22" height="22" viewBox="0 0 22 22">
              <path
                d="M11 3a5.5 5.5 0 00-5.5 5.5v3l-1.5 2h14l-1.5-2v-3A5.5 5.5 0 0011 3z"
                fill="none"
                stroke="var(--color-gray-600)"
                strokeWidth="1.3"
              />
              <path
                d="M9 18.5a2 2 0 004 0"
                stroke="var(--color-gray-600)"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            {unreadCount > 0 && (
              <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-coral-400 text-white text-[8px] font-bold flex items-center justify-center border-2 border-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Hero */}
      <ConceptHero dismissed={!heroVisible} onDismiss={() => setHeroVisible(false)} />

      {/* Filter chips */}
      <div className="flex gap-1.5 px-4 py-2 overflow-x-auto">
        {TAGS.map((t) => {
          let count: number | undefined;
          if (t === "all") count = openCount;
          else if (t === "💬 困りごと") count = helpCount;
          else if (t === "✋ できます") count = skillCount;
          else if (t === "📋 完了") count = resolvedPosts.length;
          else count = posts.filter((p) => p.type === "help" && p.tag === t && p.status === "open").length;
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
      <div className="px-4 pt-1.5 pb-0.5 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {loading
            ? "読み込み中..."
            : isCom
              ? `${sorted.length}件の完了レポート`
              : isSkillOnly
                ? `${sorted.length}件の「できます」`
                : isHelpOnly
                  ? `${sorted.length}件の困りごと`
                  : `${sorted.length}件`}
        </span>
      </div>

      {/* Post list */}
      <div className="pb-20">
        {sorted.map((p) => {
          if (p.type === "skill") {
            return <SkillPostCard key={p.id} post={p} onSelect={handleSkillSelect} />;
          }
          if (p.status === "resolved") {
            return <ReportCard key={p.id} post={p} onSelect={handleSelect} />;
          }
          return <HelpPostCard key={p.id} post={p} onSelect={handleSelect} />;
        })}
        {!loading && loadError && (
          <div className="p-10 text-center">
            <div className="text-3xl mb-3">⚠️</div>
            <div className="text-sm text-gray-400 mb-3">読み込みに失敗しました</div>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-primary-600 bg-primary-50 px-4 py-2 rounded-lg border-none cursor-pointer"
            >
              再読み込み
            </button>
          </div>
        )}
        {!loading && !loadError && sorted.length === 0 && (
          <div className="p-10 text-center">
            <div className="text-3xl mb-3">📭</div>
            <div className="text-sm text-gray-400">まだ投稿がありません</div>
          </div>
        )}
      </div>
    </div>
  );
}
