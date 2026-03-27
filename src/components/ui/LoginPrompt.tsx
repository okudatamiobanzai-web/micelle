"use client";

import { login } from "@/lib/liff";

interface LoginPromptProps {
  message?: string;
}

export function LoginPrompt({ message = "LINEでログインしてください" }: LoginPromptProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-4 text-center">
      <div className="text-3xl mb-3">🔒</div>
      <div className="text-base font-semibold text-foreground mb-2">ログインが必要です</div>
      <div className="text-sm text-gray-400 mb-6">{message}</div>
      <button
        onClick={() => login()}
        className="px-6 py-3 rounded-xl text-sm font-medium bg-[#06C755] text-white border-none cursor-pointer shadow-[0_2px_8px_rgba(6,199,85,.3)]"
      >
        LINEでログイン
      </button>
    </div>
  );
}
