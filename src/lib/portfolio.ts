import { supabase } from "./supabase";
import type { PortfolioItem } from "./types";

export async function getPortfolioItems(profileId: string): Promise<PortfolioItem[]> {
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("profile_id", profileId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch portfolio:", error);
    return [];
  }
  return data || [];
}

export async function upsertPortfolioItem(
  item: Partial<PortfolioItem> & { profile_id: string; type: string }
): Promise<PortfolioItem | null> {
  const { data, error } = await supabase
    .from("portfolio_items")
    .upsert(item)
    .select()
    .single();

  if (error) {
    console.error("Failed to upsert portfolio item:", error);
    return null;
  }
  return data;
}

export async function deletePortfolioItem(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("portfolio_items")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete portfolio item:", error);
    return false;
  }
  return true;
}

export async function uploadPortfolioImage(
  profileId: string,
  file: File
): Promise<string | null> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${profileId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("media")
    .upload(path, file);

  if (error) {
    console.error("Failed to upload image:", error);
    return null;
  }
  return path;
}

export function getPortfolioImageUrl(storagePath: string): string {
  const { data } = supabase.storage.from("media").getPublicUrl(storagePath);
  return data.publicUrl;
}
