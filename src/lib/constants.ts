// Tag icons
export const TAG_ICON: Record<string, string> = {
  作業: "🔨",
  送迎: "🚗",
  制作: "🎨",
  子ども: "👶",
  相談: "💬",
  暮らし: "🏠",
  高齢者: "👴",
};

// Tag → Tailwind color prefix mapping
export const TAG_COLOR: Record<string, string> = {
  作業: "primary",
  送迎: "blue",
  制作: "purple",
  子ども: "coral",
  相談: "amber",
  暮らし: "primary",
  高齢者: "primary",
};

// Tag → CSS color value for Card accent borders
export const TAG_ACCENT: Record<string, string> = {
  作業: "var(--color-primary-400)",
  送迎: "var(--color-blue-400)",
  制作: "var(--color-purple-400)",
  子ども: "var(--color-coral-400)",
  相談: "var(--color-amber-400)",
  暮らし: "var(--color-primary-400)",
  高齢者: "var(--color-primary-400)",
};

// Tag → Tailwind badge color classes
export const TAG_BADGE: Record<string, { bg: string; fg: string }> = {
  作業: { bg: "bg-primary-50", fg: "text-primary-800" },
  送迎: { bg: "bg-blue-50", fg: "text-blue-800" },
  制作: { bg: "bg-purple-50", fg: "text-purple-800" },
  子ども: { bg: "bg-coral-50", fg: "text-coral-800" },
  相談: { bg: "bg-amber-50", fg: "text-amber-800" },
  暮らし: { bg: "bg-primary-50", fg: "text-primary-800" },
  高齢者: { bg: "bg-primary-50", fg: "text-primary-800" },
};

// Tag → icon background class
export const TAG_ICON_BG: Record<string, string> = {
  作業: "bg-primary-50",
  送迎: "bg-blue-50",
  制作: "bg-purple-50",
  子ども: "bg-coral-50",
  相談: "bg-amber-50",
  暮らし: "bg-primary-50",
  高齢者: "bg-primary-50",
};

// Skill icons
export const SKILL_ICON: Record<string, string> = {
  デザイン: "🎨",
  保育: "👶",
  送迎: "🚗",
  力仕事: "💪",
  DIY: "🔧",
  除雪: "❄️",
  不動産: "🏠",
  写真撮影: "📷",
  酪農体験: "🐄",
  IT: "💻",
  相続相談: "📋",
  空き家: "🏚️",
};

// Post status labels
export const STATUS_LABEL: Record<string, string> = {
  open: "募集中",
  active: "進行中",
  matched: "マッチ済",
  resolved: "完了",
  closed: "終了",
};

// Reward type labels
export const REWARD_TYPE_LABEL: Record<string, string> = {
  hourly: "時給",
  fixed: "固定",
  free: "無償",
  actual_cost: "実費",
};
