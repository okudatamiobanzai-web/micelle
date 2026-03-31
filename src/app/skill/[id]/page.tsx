import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import SkillDetailClient from "./SkillDetailClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await props.params;
  const { data: post } = await supabase
    .from("posts")
    .select("title, body, skills, pricing, author:profiles!author_id(display_name, area, picture_url)")
    .eq("id", id)
    .single();

  if (!post) {
    return { title: "ミセル", description: "milkの困りごと掲示板" };
  }

  const author = Array.isArray(post.author) ? post.author[0] : post.author;
  const title = `${author?.display_name ?? ""}さんの「${post.title}」`;
  const skillsText = (post.skills as string[])?.join("・") ?? "";
  const description = post.body
    ? post.body.slice(0, 100)
    : skillsText
    ? `できること: ${skillsText}${post.pricing ? `　料金: ${post.pricing}` : ""}`
    : "ミセルで「できます」を見つけよう";

  const imageUrl = author?.picture_url ?? "https://micelle.shirubelab.jp/ogp-default.png";
  const pageUrl = `https://micelle.shirubelab.jp/skill/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "ミセル",
      images: [{ url: imageUrl, width: 400, height: 400 }],
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function SkillDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return <SkillDetailClient id={id} />;
}
