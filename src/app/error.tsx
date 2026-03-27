"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-4xl mb-4">😵</div>
      <div className="text-lg font-bold text-foreground mb-2">
        エラーが発生しました
      </div>
      <div className="text-sm text-gray-400 mb-6 leading-relaxed max-w-xs">
        予期しないエラーが発生しました。
        <br />
        もう一度お試しください。
      </div>
      <button
        onClick={reset}
        className="px-6 py-3 rounded-xl text-sm font-medium bg-primary-400 text-white border-none cursor-pointer shadow-[0_2px_8px_rgba(29,158,117,.26)]"
      >
        もう一度試す
      </button>
    </div>
  );
}
