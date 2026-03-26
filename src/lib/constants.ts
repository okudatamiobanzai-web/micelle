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
