"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Orb } from "@/components/ui/Orb";
import { Badge } from "@/components/ui/Badge";
import { fetchPost, fetchPeople, addComment } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { TAG_ICON, TAG_BADGE } from "@/lib/constants";
import type { Post, Comment, Report, Profile } from "@/lib/types";

const STATUS_OPTIONS = ["open", "active", "matched", "resolved", "closed"];
const STATUS_LABEL: Record<string, string> = {
  open: "募集中", active: "公開中", matched: "マッチ済", resolved: "完了", closed: "終了",
};

export default function AdminPostDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const router = useRouter();

  const [post, setPost] = useState<(Post & { comments: Comment[]; reports: Report[] }) | null>(null);
  const [people, setPeople] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("open");
  const [milkComment, setMilkComment] = useState("");
  const [refUser, setRefUser] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [commentPosting, setCommentPosting] = useState(false);

  useEffect(() => {
    Promise.all([fetchPost(id), fetchPeople()])
      .then(([postData, peopleData]) => {
        setPost(postData);
        setPeople(peopleData);
        if (postData) {
          setStatus(postData.status);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-10 text-center text-gray-400">読み込み中...</div>;
  }

  if (!post) {
    return <div className="p-10 text-center text-gray-400">投稿が見つかりません</div>;
  }

  const tag = post.tag || "";
  const badge = TAG_BADGE[tag] || { bg: "bg-gray-50", fg: "text-gray-600" };

  const rewardLabel = post.reward_amount
    ? post.reward_type === "hourly"
      ? `時給${post.reward_amount}`
      : post.reward_type === "fixed"
        ? post.reward_amount
        : post.reward_type === "free"
          ? "無償"
          : "実費"
    : post.reward_type === "free"
      ? "無償"
      : null;

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
    } catch (e) {
      alert("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const handlePostComment = async () => {
    if (!milkComment.trim() || commentPosting) return;
    setCommentPosting(true);
    try {
      // Get admin user's ID for comment author
      const { data: { user: adminUser } } = await supabase.auth.getUser();
      const commentAuthorId = adminUser?.id || post.author_id;
      const comment = await addComment({
        post_id: id,
        author_id: commentAuthorId,
        body: milkComment.trim(),
        is_milk_admin: true,
        ref_user_id: refUser || undefined,
      });
      setPost((prev) =>
        prev ? { ...prev, comments: [...prev.comments, comment] } : prev
      );
      setMilkComment("");
      setRefUser("");
    } catch (e) {
      alert("コメント投稿に失敗しました");
    } finally {
      setCommentPosting(false);
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
        <div className="col-span-2 space-y-6">
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
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">{post.title}</h2>
            {post.body && <div className="text-sm text-gray-600 leading-relaxed mb-4 whitespace-pre-wrap">{post.body}</div>}

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-xs font-semibold text-primary-800">
                {post.author?.avatar_char || "?"}
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">
                  {post.author?.display_name || "—"}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(post.created_at).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}
                </div>
              </div>
              {rewardLabel && (
                <div className="ml-auto text-sm font-semibold text-primary-600">{rewardLabel}</div>
              )}
            </div>
          </div>

          {/* Existing comments */}
          {post.comments.length > 0 && (
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <h3 className="text-sm font-medium text-foreground mb-3">やりとり</h3>
              <div className="space-y-3">
                {post.comments.map((c) => (
                  <div key={c.id} className="flex gap-2.5 p-3 bg-gray-50 rounded-xl">
                    <Orb ch={c.author?.avatar_char || "?"} dots={0} size={28} colorClass="primary" />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs font-medium text-foreground">{c.author?.display_name || "—"}</span>
                        {c.is_milk_admin && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-50 text-primary-800 font-medium">
                            milk運営
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">{c.body}</div>
                      {c.ref_user && (
                        <div className="mt-1 text-xs text-primary-600 font-medium">
                          🔗 {c.ref_user.display_name}さんを紹介
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Post milk comment */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h3 className="text-sm font-medium text-foreground mb-3">milk運営としてコメント</h3>
            <textarea
              value={milkComment}
              onChange={(e) => setMilkComment(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-sm text-foreground focus:outline-none focus:border-primary-200 bg-white resize-none mb-3"
              placeholder="milk運営としてのコメントを書く..."
            />

            {/* Referral */}
            <div className="mb-3">
              <label className="text-xs text-gray-400 mb-1.5 block">つなぎ（任意）</label>
              <select
                value={refUser}
                onChange={(e) => setRefUser(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-foreground bg-white"
              >
                <option value="">紹介する人を選択...</option>
                {people.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.display_name}{p.can?.length ? `（${p.can.join("・")}）` : ""}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handlePostComment}
              disabled={!milkComment.trim() || commentPosting}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium border-none cursor-pointer ${
                milkComment.trim() && !commentPosting
                  ? "bg-primary-400 text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {commentPosting ? "投稿中..." : "💬 コメント投稿"}
            </button>
          </div>
        </div>

        {/* Right: Status control */}
        <div className="space-y-6">
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
          </div>

          {post.type === "help" && rewardLabel && (
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <div className="text-xs text-gray-400 mb-1">報酬</div>
              <div className="text-lg font-bold text-primary-600">{rewardLabel}</div>
            </div>
          )}

          <button
            onClick={handleSave}
            className={`w-full py-3 rounded-xl text-sm font-medium border-none cursor-pointer transition-all ${
              saved
                ? "bg-primary-50 text-primary-600"
                : "bg-primary-400 text-white shadow-[0_2px_8px_rgba(29,158,117,.26)]"
            }`}
          >
            {saved ? "✓ 保存しました" : saving ? "保存中..." : "変更を保存"}
          </button>
        </div>
      </div>
    </div>
  );
}
