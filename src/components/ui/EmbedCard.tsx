"use client";

import { useState, useEffect, useRef } from "react";

interface EmbedData {
  type: "youtube" | "twitter" | "instagram" | "unknown";
  html?: string;
  title?: string;
  image?: string;
  description?: string;
  url?: string;
}

interface EmbedCardProps {
  url: string;
}

export function EmbedCard({ url }: EmbedCardProps) {
  const [data, setData] = useState<EmbedData | null>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/embed?url=${encodeURIComponent(url)}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ type: "unknown", url }))
      .finally(() => setLoading(false));
  }, [url]);

  // Load Twitter widget script after HTML is injected
  useEffect(() => {
    if (data?.type === "twitter" && data.html && containerRef.current) {
      if (!(window as any).twttr) {
        const s = document.createElement("script");
        s.src = "https://platform.twitter.com/widgets.js";
        s.async = true;
        document.body.appendChild(s);
      } else {
        (window as any).twttr?.widgets?.load(containerRef.current);
      }
    }
  }, [data]);

  if (loading) {
    return (
      <div className="rounded-xl bg-gray-50 h-20 animate-pulse" />
    );
  }

  if (!data) return null;

  if (data.type === "youtube" && data.html) {
    return (
      <div
        className="rounded-xl overflow-hidden w-full aspect-video"
        dangerouslySetInnerHTML={{ __html: data.html }}
      />
    );
  }

  if (data.type === "twitter" && data.html) {
    return (
      <div
        ref={containerRef}
        className="rounded-xl overflow-hidden"
        dangerouslySetInnerHTML={{ __html: data.html }}
      />
    );
  }

  if (data.type === "instagram") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-colors no-underline"
      >
        {data.image && (
          <img
            src={data.image}
            alt=""
            className="w-20 h-20 rounded-lg object-cover shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-gray-400 mb-1">📸 Instagram</div>
          {data.title && (
            <div className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
              {data.title}
            </div>
          )}
          {data.description && (
            <div className="text-xs text-gray-400 mt-1 line-clamp-2">{data.description}</div>
          )}
        </div>
      </a>
    );
  }

  // fallback: plain link
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block text-xs text-primary-600 underline break-all"
    >
      {url}
    </a>
  );
}
