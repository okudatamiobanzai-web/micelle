import { NextRequest, NextResponse } from "next/server";

function detectType(url: string): "youtube" | "twitter" | "instagram" | "unknown" {
  if (/youtube\.com\/watch|youtu\.be\//.test(url)) return "youtube";
  if (/twitter\.com\/.+\/status|x\.com\/.+\/status/.test(url)) return "twitter";
  if (/instagram\.com\/(p|reel|tv)\//.test(url)) return "instagram";
  return "unknown";
}

async function fetchOEmbed(endpoint: string): Promise<{ html?: string; title?: string; author_name?: string; thumbnail_url?: string } | null> {
  try {
    const res = await fetch(endpoint, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&apos;/g, "'");
}

async function fetchOGP(url: string): Promise<{ title?: string; image?: string; description?: string } | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Micelle/1.0)" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const get = (property: string) => {
      const m =
        html.match(new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i")) ||
        html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, "i"));
      return m?.[1] ? decodeHtmlEntities(m[1]) : undefined;
    };
    return {
      title: get("og:title"),
      image: get("og:image"),
      description: get("og:description"),
    };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });

  const type = detectType(url);

  if (type === "youtube") {
    const data = await fetchOEmbed(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    );
    if (!data?.html) return NextResponse.json({ error: "failed" }, { status: 502 });
    // Modify iframe for autoplay muted, ensure 100% width
    const html = data.html
      .replace(/src="([^"]+)"/, (_, src) => {
        const u = new URL(src);
        u.searchParams.set("autoplay", "1");
        u.searchParams.set("mute", "1");
        u.searchParams.set("controls", "1");
        return `src="${u.toString()}"`;
      })
      .replace(/width="\d+"/, 'width="100%"')
      .replace(/height="\d+"/, 'height="100%"');
    return NextResponse.json({
      type: "youtube",
      html,
      title: data.title,
      author_name: data.author_name,
      thumbnail_url: data.thumbnail_url,
    });
  }

  if (type === "twitter") {
    const idMatch = url.match(/\/status\/(\d+)/);
    const tweetId = idMatch?.[1];
    if (!tweetId) return NextResponse.json({ error: "invalid url" }, { status: 400 });
    return NextResponse.json({ type: "twitter", tweetId });
  }

  if (type === "instagram") {
    const ogp = await fetchOGP(url);
    return NextResponse.json({
      type: "instagram",
      title: ogp?.title,
      image: ogp?.image,
      description: ogp?.description,
      url,
    });
  }

  return NextResponse.json({ type: "unknown", url });
}
