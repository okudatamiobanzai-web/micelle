import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-4xl mb-4">🔍</div>
      <div className="text-lg font-bold text-foreground mb-2">
        ページが見つかりません
      </div>
      <div className="text-sm text-gray-400 mb-6">
        お探しのページは存在しないか、移動した可能性があります。
      </div>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl text-sm font-medium bg-primary-400 text-white no-underline"
      >
        掲示板に戻る
      </Link>
    </div>
  );
}
