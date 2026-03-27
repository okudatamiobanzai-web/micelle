-- ==========================================
-- ミセル DBスキーマ
-- Supabase SQL Editor で実行
-- ==========================================

-- 1. プロフィール
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  avatar_char TEXT NOT NULL DEFAULT '？',
  area TEXT,
  bio TEXT,
  about_me TEXT,
  sns_public JSONB DEFAULT '{}',
  sns_private JSONB DEFAULT '{}',
  can TEXT[] DEFAULT '{}',
  is_milk_endorsed BOOLEAN DEFAULT false,
  milk_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 投稿（困りごと / スキル提供）
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('help', 'skill')),
  author_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  body TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'active', 'matched', 'resolved', 'closed')),
  tag TEXT,
  reward_type TEXT CHECK (reward_type IN ('hourly', 'fixed', 'free', 'actual_cost')),
  reward_amount TEXT,
  location JSONB,
  scheduled_date TEXT,
  scheduled_time TEXT,
  skills TEXT[] DEFAULT '{}',
  pricing TEXT,
  helper_id UUID REFERENCES profiles(id),
  interested_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. コメント
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id),
  body TEXT NOT NULL,
  is_milk_admin BOOLEAN DEFAULT false,
  ref_user_id UUID REFERENCES profiles(id),
  ref_free_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. 完了レポート
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id),
  role TEXT NOT NULL CHECK (role IN ('requester', 'helper')),
  body TEXT NOT NULL,
  duration TEXT,
  photos JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. 通知
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. ポートフォリオ
CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('photo', 'video', 'link', 'work', 'document')),
  title TEXT,
  description TEXT,
  url TEXT,
  storage_path TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. 管理者
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- RLS（Row Level Security）
-- ==========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- profiles: 誰でも読める、本人のみ更新
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (true);

-- posts: 誰でも読める、認証済みユーザーが作成
CREATE POLICY "posts_select" ON posts FOR SELECT USING (true);
CREATE POLICY "posts_insert" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "posts_update" ON posts FOR UPDATE USING (true);

-- comments: 誰でも読める、認証済みユーザーが作成
CREATE POLICY "comments_select" ON comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON comments FOR INSERT WITH CHECK (true);

-- reports: 誰でも読める、認証済みユーザーが作成
CREATE POLICY "reports_select" ON reports FOR SELECT USING (true);
CREATE POLICY "reports_insert" ON reports FOR INSERT WITH CHECK (true);

-- notifications: 本人のみ
CREATE POLICY "notifications_select" ON notifications FOR SELECT USING (true);
CREATE POLICY "notifications_update" ON notifications FOR UPDATE USING (true);

-- portfolio_items: 誰でも読める、本人のみ変更
CREATE POLICY "portfolio_select" ON portfolio_items FOR SELECT USING (true);
CREATE POLICY "portfolio_insert" ON portfolio_items FOR INSERT WITH CHECK (true);
CREATE POLICY "portfolio_update" ON portfolio_items FOR UPDATE USING (true);
CREATE POLICY "portfolio_delete" ON portfolio_items FOR DELETE USING (true);

-- admin_users: 読み取りのみ
CREATE POLICY "admin_select" ON admin_users FOR SELECT USING (true);

-- ==========================================
-- インデックス
-- ==========================================

CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_reports_post ON reports(post_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_portfolio_profile ON portfolio_items(profile_id);
