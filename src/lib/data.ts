import { supabase } from "./supabase";
import type { Post, Profile, Comment, Report, Notification, PortfolioItem } from "./types";

// ==========================================
// 投稿
// ==========================================

export async function fetchPosts(filter?: {
  type?: "help" | "skill";
  tag?: string;
  status?: string;
}): Promise<Post[]> {
  let query = supabase
    .from("posts")
    .select("*, author:profiles!author_id(*), helper:profiles!helper_id(*)")
    .order("created_at", { ascending: false });

  if (filter?.type) query = query.eq("type", filter.type);
  if (filter?.tag) query = query.eq("tag", filter.tag);
  if (filter?.status) query = query.eq("status", filter.status);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as Post[];
}

export async function fetchPost(id: string): Promise<
  (Post & { comments: Comment[]; reports: Report[] }) | null
> {
  const { data, error } = await supabase
    .from("posts")
    .select("*, author:profiles!author_id(*), helper:profiles!helper_id(*)")
    .eq("id", id)
    .single();
  if (error) return null;

  const [commentsRes, reportsRes] = await Promise.all([
    supabase
      .from("comments")
      .select("*, author:profiles!author_id(*), ref_user:profiles!ref_user_id(*)")
      .eq("post_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("reports")
      .select("*")
      .eq("post_id", id)
      .order("created_at", { ascending: true }),
  ]);

  return {
    ...(data as unknown as Post),
    comments: (commentsRes.data ?? []) as unknown as Comment[],
    reports: (reportsRes.data ?? []) as unknown as Report[],
  };
}

export async function createHelpPost(params: {
  author_id: string;
  title: string;
  body?: string;
  tag: string;
  reward_type?: string;
  reward_amount?: string;
  scheduled_date?: string;
  scheduled_time?: string;
}): Promise<string> {
  const { data, error } = await supabase
    .from("posts")
    .insert({
      type: "help",
      status: "open",
      ...params,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function createSkillPost(params: {
  author_id: string;
  title: string;
  body?: string;
  skills: string[];
  pricing?: string;
}): Promise<string> {
  const { data, error } = await supabase
    .from("posts")
    .insert({
      type: "skill",
      status: "active",
      ...params,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

// ==========================================
// プロフィール
// ==========================================

export async function fetchProfile(id: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as unknown as Profile;
}

export async function fetchPeople(filter?: {
  skill?: string;
  milkOnly?: boolean;
}): Promise<Profile[]> {
  let query = supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (filter?.milkOnly) query = query.eq("is_milk_endorsed", true);
  if (filter?.skill) query = query.contains("can", [filter.skill]);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as Profile[];
}

export async function updateProfile(
  id: string,
  params: {
    display_name?: string;
    avatar_char?: string;
    area?: string;
    about_me?: string;
    sns_public?: Record<string, string>;
    sns_private?: Record<string, string>;
    can?: string[];
  }
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ ...params, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function upsertProfile(params: {
  id: string;
  display_name: string;
  avatar_char: string;
}): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .upsert(params, { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
  return data as unknown as Profile;
}

// ==========================================
// コメント
// ==========================================

export async function addComment(params: {
  post_id: string;
  author_id: string;
  body: string;
  is_milk_admin?: boolean;
  ref_user_id?: string;
  ref_free_text?: string;
}): Promise<Comment> {
  const { data, error } = await supabase
    .from("comments")
    .insert(params)
    .select("*, author:profiles!author_id(*)")
    .single();
  if (error) throw error;
  return data as unknown as Comment;
}

// ==========================================
// 通知
// ==========================================

export async function fetchNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Notification[];
}

export async function markNotificationRead(id: string): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id);
  if (error) throw error;
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);
  if (error) throw error;
}

// ==========================================
// ポートフォリオ
// ==========================================

export async function fetchPortfolio(profileId: string): Promise<PortfolioItem[]> {
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("profile_id", profileId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as PortfolioItem[];
}

export async function addPortfolioItem(params: {
  profile_id: string;
  type: string;
  title?: string;
  description?: string;
  url?: string;
  sort_order: number;
}): Promise<PortfolioItem> {
  const { data, error } = await supabase
    .from("portfolio_items")
    .insert(params)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as PortfolioItem;
}

export async function deletePortfolioItem(id: string): Promise<void> {
  const { error } = await supabase
    .from("portfolio_items")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ==========================================
// 統計（集計）
// ==========================================

export async function fetchProfileStats(profileId: string) {
  const [helpRes, reqRes] = await Promise.all([
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("helper_id", profileId)
      .eq("status", "resolved"),
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("author_id", profileId)
      .eq("type", "help")
      .eq("status", "resolved"),
  ]);

  return {
    id: profileId,
    completed_help: helpRes.count ?? 0,
    completed_req: reqRes.count ?? 0,
    referrals: 0,
    tag_count: 0,
    gifted_tags: [] as string[],
  };
}

// ==========================================
// ギフトタグ
// ==========================================

export async function addGiftedTag(params: {
  profile_id: string;
  tag: string;
  from_user_id: string;
}): Promise<void> {
  // gifted_tags テーブルがあれば保存、なければprofileのjsonbに追加
  const { error } = await supabase
    .from("gifted_tags")
    .insert(params);
  if (error) {
    // テーブルがない場合は無視（将来的に作成）
  }
}

// ==========================================
// マッチング
// ==========================================

export async function checkMatch(userId1: string, userId2: string): Promise<boolean> {
  const { data } = await supabase
    .from("matches")
    .select("id")
    .or(`and(user1_id.eq.${userId1},user2_id.eq.${userId2}),and(user1_id.eq.${userId2},user2_id.eq.${userId1})`)
    .limit(1);
  return (data?.length ?? 0) > 0;
}

// ==========================================
// 通知作成
// ==========================================

export async function createNotification(params: {
  user_id: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
}): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .insert({ ...params, read: false });
  if (error) {
    // 通知作成失敗は投稿のメイン処理をブロックしない
  }
}
