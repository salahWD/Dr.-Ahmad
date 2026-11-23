import type { MetadataRoute } from "next";
import { practice } from "@/lib/content";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin/"] },
    sitemap: practice.approved && practice.siteUrl ? new URL("/sitemap.xml", practice.siteUrl).href : undefined,
  };
}
