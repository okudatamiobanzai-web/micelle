export type PostType = "help" | "skill";

export type PostStatus = "open" | "active" | "matched" | "resolved" | "closed";

export interface Profile {
  id: string;
  display_name: string;
  avatar_char: string;
  picture_url?: string;
  area?: string;
  about_me?: string;
  sns_public?: Record<string, string>;
  can: string[];
  created_at: string;
  updated_at: string;
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
  tag?: string;
  skills: string[];
  pricing?: string;
  portfolio_links?: string[];
  // Joined data
  author?: Profile;
  interested_count?: number;
}

export interface Match {
  id: string;
  post_id: string;
  user1_id: string;
  user2_id: string;
  status: 'matched' | 'completed';
  created_at: string;
}
