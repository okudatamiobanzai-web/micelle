"use client";

import { useRouter } from "next/navigation";

export default function PostPage() {
  const router = useRouter();

  return (
    <div className="pb-20">
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 sticky top-0 bg-background z-10">
        <div className="text-lg font-bold text-foreground tracking-tight">書く</div>
      </div>

      <div className="p-4 space-y-3 pt-6">
        {/* 困りごと */}
        <button
          onClick={() => router.push("/post/help")}
          className="w-full text-left p-5 rounded-2xl bg-gradient-to-br from-primary-50 to-white border-2 border-primary-100 cursor-pointer active:scale-[0.98] transition-all duration-200 shadow-[0_2px_12px_rgba(29,158,117,.08)]"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-2xl">
              💬
            </div>
            <div>
              <div className="text-[17px] font-bold text-foreground">困りごとを書く</div>
              <div className="text-xs text-primary-600 font-medium mt-0.5">手伝ってほしいことを投稿</div>
            </div>
          </div>
          <div className="text-sm text-gray-500 leading-relaxed mb-3">
            雪下ろし・送迎・PC設定・空き家相談など、<br />
            地域の人に頼みたいことを書いてみましょう。
          </div>
          <div className="flex justify-end">
            <span className="text-sm font-medium text-primary-600 bg-primary-100 px-4 py-1.5 rounded-full">
              困りごとを投稿 →
            </span>
          </div>
        </button>

        <div className="flex items-center gap-3 px-2">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-300">または</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* できます */}
        <button
          onClick={() => router.push("/post/skill")}
          className="w-full text-left p-5 rounded-2xl bg-gradient-to-br from-skill-50 to-white border-2 border-skill-100 cursor-pointer active:scale-[0.98] transition-all duration-200 shadow-[0_2px_12px_rgba(232,163,23,.08)]"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-skill-100 flex items-center justify-center text-2xl">
              ✋
            </div>
            <div>
              <div className="text-[17px] font-bold text-foreground">できますを出す</div>
              <div className="text-xs text-skill-600 font-medium mt-0.5">スキルや得意なことを掲示</div>
            </div>
          </div>
          <div className="text-sm text-gray-500 leading-relaxed mb-3">
            デザイン・力仕事・写真撮影・不動産相談など、<br />
            あなたが得意なことを地域にアピールしましょう。
          </div>
          <div className="flex justify-end">
            <span className="text-sm font-medium text-skill-700 bg-skill-100 px-4 py-1.5 rounded-full">
              できますを投稿 →
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
