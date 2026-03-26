"use client";

import { useRouter } from "next/navigation";

const POST_TYPES = [
  {
    id: "help",
    icon: "💬",
    title: "困りごとを書く",
    desc: "手伝ってほしいこと・相談したいことを投稿",
    examples: "雪下ろし、送迎、PC設定、空き家相談…",
    color: "from-primary-50 to-background",
    border: "border-primary-200/30",
    href: "/post/help",
  },
  {
    id: "skill",
    icon: "✋",
    title: "できますを出す",
    desc: "あなたのスキルや得意なことを掲示",
    examples: "デザイン、力仕事、写真撮影、不動産相談…",
    color: "from-skill-50 to-background",
    border: "border-skill-200/30",
    href: "/post/skill",
  },
];

export default function PostPage() {
  const router = useRouter();

  return (
    <div className="pb-20">
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 sticky top-0 bg-background z-10">
        <div className="text-lg font-bold text-foreground tracking-tight">書く</div>
        <div className="text-[11px] text-gray-400 mt-0.5">
          どちらを投稿しますか？
        </div>
      </div>

      <div className="p-4 space-y-4">
        {POST_TYPES.map((type) => (
          <div
            key={type.id}
            onClick={() => router.push(type.href)}
            className={`p-5 rounded-2xl bg-gradient-to-br ${type.color} border ${type.border} cursor-pointer active:scale-[0.98] transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,.04)]`}
          >
            <div className="text-3xl mb-3">{type.icon}</div>
            <div className="text-base font-semibold text-foreground mb-1">
              {type.title}
            </div>
            <div className="text-sm text-gray-600 leading-relaxed mb-3">
              {type.desc}
            </div>
            <div className="text-xs text-gray-400">例: {type.examples}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
