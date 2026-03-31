"use client";

import { useState, useEffect, useRef } from "react";

interface EmbedData {
  type: "youtube" | "twitter" | "instagram" | "unknown";
  html?: string;
  tweetId?: string;
  title?: string;
  author_name?: string;
  image?: string;
  description?: string;
  url?: string;
}

interface EmbedCardProps {
  url: string;
}

let twitterScriptPromise: Promise<void> | null = null;
function loadTwitterScript(): Promise<void> {
  if ((window as any).twttr?.widgets) return Promise.resolve();
  if (twitterScriptPromise) return twitterScriptPromise;
  twitterScriptPromise = new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://platform.twitter.com/widgets.js";
    s.async = true;
    s.onload = () => resolve();
    document.head.appendChild(s);
  });
  return twitterScriptPromise;
}

function TwitterEmbed({ tweetId }: { tweetId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    loadTwitterScript().then(() => {
      if (cancelled || !containerRef.current) return;
      containerRef.current.innerHTML = "";
      (window as any).twttr.widgets.createTweet(tweetId, containerRef.current, {
        dnt: true,
        theme: "light",
      });
    });
    return () => { cancelled = true; };
  }, [tweetId]);

  return <div ref={containerRef} className="rounded-xl overflow-hidden min-h-[100px]" />;
}

export function EmbedCard({ url }: EmbedCardProps) {
  const [data, setData] = useState<EmbedData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/embed?url=${encodeURIComponent(url)}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ type: "unknown", url }))
      .finally(() => setLoading(false));
  }, [url]);

  if (loading) {
    return <div className="rounded-xl bg-gray-50 h-16 animate-pulse" />;
  }

  if (!data) return null;

  if (data.type === "youtube" && data.html) {
    return (
      <div className="rounded-xl overflow-hidden border border-gray-100">
        <div
          className="w-full"
          style={{ aspectRatio: "16/9" }}
          dangerouslySetInnerHTML={{ __html: data.html }}
        />
        {(data.title || data.author_name) && (
          <div className="px-3 py-2 bg-white">
            {data.title && (
              <div className="text-[13px] font-medium text-foreground line-clamp-2 leading-snug">
                {data.title}
              </div>
            )}
            {data.author_name && (
              <div className="text-[11px] text-gray-400 mt-0.5">▶ {data.author_name}</div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (data.type === "twitter" && data.tweetId) {
    return <TwitterEmbed tweetId={data.tweetId} />;
  }

  if (data.type === "instagram") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-colors"
        style={{ textDecoration: "none" }}
      >
        {data.image && (
          <img
            src={data.image}
            alt=""
            className="w-20 h-20 rounded-lg object-cover shrink-0 bg-gray-100"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            referrerPolicy="no-referrer"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-pink-500 font-medium mb-1">📸 Instagram</div>
          {data.title && (
            <div className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
              {data.title}
            </div>
          )}
          {data.description && (
            <div className="text-xs text-gray-400 mt-1 line-clamp-2">{data.description}</div>
          )}
          <div className="text-[11px] text-gray-300 mt-1">タップして開く ↗</div>
        </div>
      </a>
    );
  }

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
