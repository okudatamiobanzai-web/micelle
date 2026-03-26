"use client";

import { useState } from "react";
import type { PortfolioItemType } from "@/lib/types";

interface PortfolioItemLike {
  id: string;
  type: "photo" | "video" | "link" | "work" | "document";
  title?: string;
  description?: string;
  url?: string;
  storage_path?: string;
}

const TYPE_OPTIONS: { id: PortfolioItemType; label: string; icon: string }[] = [
  { id: "photo", label: "写真", icon: "📷" },
  { id: "document", label: "資料", icon: "📄" },
  { id: "video", label: "動画", icon: "🎬" },
  { id: "link", label: "リンク", icon: "🔗" },
  { id: "work", label: "制作物", icon: "🎨" },
];

interface PortfolioEditorProps {
  items: PortfolioItemLike[];
  onAdd: (item: { type: PortfolioItemType; title?: string; description?: string; url?: string; file?: File }) => void;
  onDelete: (id: string) => void;
  getImageUrl: (path: string) => string;
}

export function PortfolioEditor({ items, onAdd, onDelete, getImageUrl }: PortfolioEditorProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [addType, setAddType] = useState<PortfolioItemType>("photo");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setUrl("");
    setFile(null);
    setShowAddForm(false);
  };

  const handleSubmit = () => {
    onAdd({
      type: addType,
      title: title.trim() || undefined,
      description: description.trim() || undefined,
      url: url.trim() || undefined,
      file: file || undefined,
    });
    resetForm();
  };

  const canSubmit =
    (addType === "photo" && (file || url.trim())) ||
    (addType === "video" && url.trim()) ||
    (addType === "link" && url.trim()) ||
    (addType === "work" && title.trim()) ||
    (addType === "document" && (file || url.trim()));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-gray-400 font-medium">ポートフォリオ</div>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="text-xs text-primary-600 font-medium bg-primary-50 px-2.5 py-1 rounded-lg border-none cursor-pointer"
          >
            + 追加
          </button>
        )}
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="p-3 bg-surface rounded-xl mb-3">
          {/* Type selector */}
          <div className="flex gap-2 mb-3">
            {TYPE_OPTIONS.map((t) => (
              <button
                key={t.id}
                onClick={() => setAddType(t.id)}
                className={`flex-1 py-2 rounded-lg text-xs border cursor-pointer transition-all ${
                  addType === t.id
                    ? "bg-primary-400 text-white border-primary-400 font-medium"
                    : "bg-background text-gray-600 border-gray-100"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Title (for work, link, video, document) */}
          {(addType === "work" || addType === "link" || addType === "video" || addType === "document") && (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タイトル"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-100 text-sm text-foreground placeholder:text-gray-200 focus:outline-none focus:border-primary-200 bg-background mb-2"
            />
          )}

          {/* URL (for video, link, photo URL) */}
          {(addType === "video" || addType === "link" || addType === "photo") && (
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={
                addType === "video"
                  ? "YouTube URLなど"
                  : addType === "link"
                    ? "https://..."
                    : "画像URL（またはファイルをアップロード）"
              }
              className="w-full px-3 py-2.5 rounded-lg border border-gray-100 text-sm text-foreground placeholder:text-gray-200 focus:outline-none focus:border-primary-200 bg-background mb-2"
            />
          )}

          {/* File upload (for photo, work, document) */}
          {(addType === "photo" || addType === "work" || addType === "document") && (
            <label className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-gray-200 cursor-pointer mb-2 bg-background">
              <span className="text-sm text-gray-400">
                {file ? file.name : "📎 ファイルを選択"}
              </span>
              <input
                type="file"
                accept={addType === "document" ? "application/pdf,image/*" : "image/*"}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          )}

          {/* Description (for work) */}
          {addType === "work" && (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="説明（任意）"
              rows={2}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-100 text-sm text-foreground placeholder:text-gray-200 focus:outline-none focus:border-primary-200 bg-background resize-none mb-2"
            />
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={resetForm}
              className="flex-1 py-2 rounded-lg text-xs text-gray-400 bg-transparent border border-gray-100 cursor-pointer"
            >
              キャンセル
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`flex-1 py-2 rounded-lg text-xs font-medium border-none cursor-pointer ${
                canSubmit
                  ? "bg-primary-400 text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              追加
            </button>
          </div>
        </div>
      )}

      {/* Existing items */}
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 bg-background rounded-xl border border-gray-50"
            >
              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center shrink-0 overflow-hidden">
                {item.storage_path ? (
                  <img
                    src={getImageUrl(item.storage_path)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : item.type === "photo" && item.url ? (
                  <img src={item.url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg">
                    {item.type === "photo" ? "📷" : item.type === "video" ? "🎬" : item.type === "link" ? "🔗" : "🎨"}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {item.title || (item.type === "photo" ? "写真" : item.url || "アイテム")}
                </div>
                <div className="text-[11px] text-gray-400">
                  {TYPE_OPTIONS.find((t) => t.id === item.type)?.label}
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={() => onDelete(item.id)}
                className="text-xs text-gray-400 bg-transparent border-none cursor-pointer p-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        !showAddForm && (
          <div className="text-xs text-gray-200 py-2">
            まだポートフォリオがありません
          </div>
        )
      )}
    </div>
  );
}
