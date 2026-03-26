"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminSignIn } from "@/lib/admin-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await adminSignIn(email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-2xl font-bold text-foreground">ミセル</div>
          <div className="text-sm text-gray-400 mt-1">管理画面ログイン</div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-coral-50 text-coral-800 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="text-xs text-gray-400 font-medium mb-1.5 block">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-3 rounded-xl border border-gray-100 text-sm text-foreground focus:outline-none focus:border-primary-200 bg-white"
            />
          </div>

          <div className="mb-6">
            <label className="text-xs text-gray-400 font-medium mb-1.5 block">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-3 rounded-xl border border-gray-100 text-sm text-foreground focus:outline-none focus:border-primary-200 bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-medium bg-primary-400 text-white border-none cursor-pointer disabled:opacity-50"
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>
      </div>
    </div>
  );
}
