import type { MetadataRoute } from "next";
import { practice } from "@/lib/content";
import { href } from "@/lib/routes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = practice.siteUrl;
  if (!practice.approved || !base) return [];

  const ar = new URL(href("ar"), base).href;
  const en = new URL(href("en"), base).href;
  const alternates = { languages: { ar, en, "x-default": ar } };
  return [
    { url: ar, alternates },
    { url: en, alternates },
  ];
}
