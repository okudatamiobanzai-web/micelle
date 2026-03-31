import { supabase } from "./supabase";
import type { Post, Profile } from "./types";

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
    .select("*, author:profiles!author_id(*)")
    .order("created_at", { ascending: false });

  if (filter?.type) query = query.eq("type", filter.type);
  if (filter?.tag) query = query.eq("tag", filter.tag);
  if (filter?.status) query = query.eq("status", filter.status);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as Post[];
}

export async function fetchPost(id: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*, author:profiles!author_id(*)")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as unknown as Post;
}

export async function createHelpPost(params: {
  author_id: string;
  title: string;
  body?: string;
  tag: string;
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
  portfolio_links?: string[];
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

export async function closePost(id: string): Promise<void> {
  const { error } = await supabase
    .from("posts")
    .update({ status: "closed", updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function resolvePost(id: string): Promise<void> {
  const { error } = await supabase
    .from("posts")
    .update({ status: "resolved", updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function updateSkillPost(id: string, params: {
  title: string;
  body?: string;
  skills: string[];
  pricing?: string;
  portfolio_links?: string[];
}): Promise<void> {
  const { error } = await supabase
    .from("posts")
    .update({ ...params, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
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
}): Promise<Profile[]> {
  let query = supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

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
