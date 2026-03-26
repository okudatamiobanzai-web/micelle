"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Orb } from "@/components/ui/Orb";

interface NotifItem {
  id: string;
  type: string;
  icon: string;
  title: string;
  body: string;
  link: string;
  time: string;
  read: boolean;
}

const SAMPLE_NOTIFICATIONS: NotifItem[] = [
  {
    id: "1",
    type: "comment",
    icon: "💬",
    title: "milk運営がコメントしました",
    body: "「雪下ろしをお願いしたい」に山田太一さんを紹介しました",
    link: "/help/1",
    time: "3時間前",
    read: false,
  },
  {
    id: "2",
    type: "interested",
    icon: "🙋",
    title: "新しい興味があります",
    body: "「チラシ・ポスターのデザインできます」に3人が興味を持っています",
    link: "/skill/8",
    time: "5時間前",
    read: false,
  },
  {
    id: "3",
    type: "tag",
    icon: "✦",
    title: "タグを贈られました",
    body: "山田太一さんから「頼りになる」のタグが届きました",
    link: "/people/tanaka",
    time: "昨日",
    read: true,
  },
  {
    id: "4",
    type: "matched",
    icon: "✓",
    title: "マッチしました",
    body: "「ベビーシッターお願いしたい」にマッチしました",
    link: "/help/7",
    time: "2日前",
    read: true,
  },
  {
    id: "5",
    type: "resolved",
    icon: "🎉",
    title: "完了レポートが届きました",
    body: "「PCの初期設定がわからない」が完了しました",
    link: "/help/5",
    time: "3日前",
    read: true,
  },
];

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
              onClick={markAllRead}
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
      <div>
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => {
              markAsRead(n.id);
              router.push(n.link);
            }}
            className={`flex gap-3 px-4 py-3.5 border-b border-gray-50 cursor-pointer active:bg-gray-50 transition-colors ${
              !n.read ? "bg-primary-50/30" : ""
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-lg shrink-0">
              {n.icon}
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
              <div className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                {n.body}
              </div>
              <div className="text-[10px] text-gray-200 mt-1">{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
