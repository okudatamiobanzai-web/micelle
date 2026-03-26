export type PostType = "help" | "skill";

export type PostStatus = "open" | "active" | "matched" | "resolved" | "closed";

export type TagName = "作業" | "送迎" | "制作" | "子ども" | "相談" | "暮らし" | "高齢者";

export type RewardType = "hourly" | "fixed" | "free" | "actual_cost";

export interface Profile {
  id: string;
  display_name: string;
  avatar_char: string;
  area?: string;
  bio?: string;
  about_me?: string;
  sns?: Record<string, string>;
  can: string[];
  is_milk_endorsed: boolean;
  milk_comment?: string;
  created_at: string;
  updated_at: string;
}

export type PortfolioItemType = "photo" | "video" | "link" | "work" | "document";

export interface PortfolioItem {
  id: string;
  profile_id: string;
  type: PortfolioItemType;
  title?: string;
  description?: string;
  url?: string;
  storage_path?: string;
  sort_order: number;
  created_at: string;
}

export interface ProfileStats {
  id: string;
  completed_help: number;
  completed_req: number;
  referrals: number;
  tag_count: number;
  gifted_tags: string[];
}

export interface Post {
  id: string;
  type: PostType;
  author_id: string;
  title: string;
  body?: string;
  status: PostStatus;
  created_at: string;
  updated_at: string;
  tag?: TagName;
  reward_type?: RewardType;
  reward_amount?: string;
  location?: Record<string, unknown>;
  scheduled_date?: string;
  scheduled_time?: string;
  skills: string[];
  pricing?: string;
  helper_id?: string;
  // Joined data
  author?: Profile;
  author_stats?: ProfileStats;
  helper?: Profile;
  interested_count?: number;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  is_milk_admin: boolean;
  ref_user_id?: string;
  ref_free_text?: string;
  created_at: string;
  author?: Profile;
  ref_user?: Profile;
}

export interface Report {
  id: string;
  post_id: string;
  author_id: string;
  role: "requester" | "helper";
  body: string;
  duration?: string;
  photos?: { desc: string; url?: string }[];
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
  read: boolean;
  created_at: string;
}
