"use client";

interface PortfolioItemLike {
  id: string;
  type: "photo" | "video" | "link" | "work";
  title?: string;
  description?: string;
  url?: string;
  storage_path?: string;
}

interface PortfolioSectionProps {
  items: PortfolioItemLike[];
  getImageUrl: (path: string) => string;
}

export function PortfolioSection({ items, getImageUrl }: PortfolioSectionProps) {
  if (items.length === 0) return null;

  const photos = items.filter((i) => i.type === "photo");
  const videos = items.filter((i) => i.type === "video");
  const links = items.filter((i) => i.type === "link");
  const works = items.filter((i) => i.type === "work");

  return (
    <div className="space-y-5">
      {/* Photos */}
      {photos.length > 0 && (
        <div>
          <div className="text-xs text-gray-400 mb-2 font-medium">写真</div>
          <div className="grid grid-cols-3 gap-1.5">
            {photos.map((p) => (
              <div
                key={p.id}
                className="aspect-square rounded-lg overflow-hidden bg-surface"
              >
                {p.storage_path ? (
                  <img
                    src={getImageUrl(p.storage_path)}
                    alt={p.title || ""}
                    className="w-full h-full object-cover"
                  />
                ) : p.url ? (
                  <img
                    src={p.url}
                    alt={p.title || ""}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl text-gray-200">
                    📷
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <div>
          <div className="text-xs text-gray-400 mb-2 font-medium">動画</div>
          <div className="space-y-2">
            {videos.map((v) => {
              const youtubeId = extractYoutubeId(v.url || "");
              return (
                <div key={v.id}>
                  {youtubeId ? (
                    <div className="aspect-video rounded-xl overflow-hidden bg-gray-800">
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <a
                      href={v.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-surface rounded-xl"
                    >
                      <span className="text-xl">🎬</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">
                          {v.title || "動画"}
                        </div>
                        <div className="text-[11px] text-gray-400 truncate">{v.url}</div>
                      </div>
                    </a>
                  )}
                  {v.title && (
                    <div className="text-xs text-gray-600 mt-1">{v.title}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Works */}
      {works.length > 0 && (
        <div>
          <div className="text-xs text-gray-400 mb-2 font-medium">制作実績</div>
          <div className="space-y-2">
            {works.map((w) => (
              <div key={w.id} className="p-3 bg-surface rounded-xl">
                {(w.storage_path || w.url) && (
                  <div className="aspect-[16/9] rounded-lg overflow-hidden bg-gray-100 mb-2">
                    <img
                      src={w.storage_path ? getImageUrl(w.storage_path) : w.url!}
                      alt={w.title || ""}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {w.title && (
                  <div className="text-sm font-medium text-foreground">{w.title}</div>
                )}
                {w.description && (
                  <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                    {w.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {links.length > 0 && (
        <div>
          <div className="text-xs text-gray-400 mb-2 font-medium">リンク</div>
          <div className="space-y-1.5">
            {links.map((l) => (
              <a
                key={l.id}
                href={l.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-surface rounded-xl no-underline"
              >
                <span className="text-base">🔗</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {l.title || l.url}
                  </div>
                  {l.title && (
                    <div className="text-[11px] text-gray-400 truncate">{l.url}</div>
                  )}
                </div>
                <span className="text-gray-200 text-sm">›</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function extractYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] || null;
}
