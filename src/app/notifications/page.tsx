"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from "@/lib/data";
import type { Notification } from "@/lib/types";

const ICON_MAP: Record<string, string> = {
  comment: "💬",
  interested: "🙋",
  tag: "✦",
  matched: "✓",
  resolved: "🎉",
};

export default function NotificationsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) {
      setLoading(false);
      return;
    }
    fetchNotifications(user.id)
      .then(setNotifications)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRead = async (notif: Notification) => {
    if (!notif.read) {
      await markNotificationRead(notif.id).catch(() => {});
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );
    }
    if (notif.link) router.push(notif.link);
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    await markAllNotificationsRead(user.id).catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "たった今";
    if (hours < 24) return `${hours}時間前`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "昨日";
    return `${days}日前`;
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 sticky top-0 bg-background z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-[13px] text-gray-400 bg-transparent border-none cursor-pointer"
          >
            ← 戻る
          </button>
          <div className="text-base font-bold text-foreground">通知</div>
          {unreadCount > 0 ? (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-primary-600 bg-transparent border-none cursor-pointer"
            >
              全て既読
            </button>
          ) : (
            <div className="w-12" />
          )}
        </div>
        {unreadCount > 0 && (
          <div className="text-xs text-gray-400 mt-1 text-center">
            {unreadCount}件の未読
          </div>
        )}
      </div>

      {/* Notification list */}
      {loading || authLoading ? (
        <div className="p-8 text-center text-sm text-gray-400">読み込み中...</div>
      ) : !user ? (
        <div className="p-10 text-center">
          <div className="text-3xl mb-3">🔒</div>
          <div className="text-sm text-gray-400">ログインすると通知を確認できます</div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-8 text-center text-sm text-gray-400">通知はありません</div>
      ) : (
        <div>
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleRead(n)}
              className={`flex gap-3 px-4 py-3.5 border-b border-gray-50 cursor-pointer active:bg-gray-50 transition-colors ${
                !n.read ? "bg-primary-50/30" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-lg shrink-0">
                {ICON_MAP[n.type] || "📌"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`text-[13px] font-medium ${!n.read ? "text-foreground" : "text-gray-600"}`}>
                    {n.title}
                  </span>
                  {!n.read && (
                    <div className="w-2 h-2 rounded-full bg-coral-400 shrink-0" />
                  )}
                </div>
                {n.body && (
                  <div className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                    {n.body}
                  </div>
                )}
                <div className="text-[10px] text-gray-200 mt-1">{formatTime(n.created_at)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
