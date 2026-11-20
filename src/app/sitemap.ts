import type { MetadataRoute } from "next";
import { practice } from "@/lib/content";
import { href, routes } from "@/lib/routes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = practice.siteUrl;
  if (!practice.approved || !base) return [];

  return ["", ...routes].flatMap((route) => {
    const ar = new URL(href("ar", route), base).href;
    const en = new URL(href("en", route), base).href;
    const alternates = { languages: { ar, en, "x-default": ar } };
    return [{ url: ar, alternates }, { url: en, alternates }];
  });
}
