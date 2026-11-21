import type { Metadata } from "next";
import { content, practice, type Locale } from "./content";

export function href(locale: Locale) {
  return locale === "en" ? "/en/" : "/";
}

export function buildMetadata(locale: Locale): Metadata {
  const copy = content[locale];
  const { title, description } = copy;
  const canonical =
    practice.siteUrl && new URL(href(locale), practice.siteUrl).href;
  const image =
    practice.siteUrl &&
    new URL("/images/blue-portrait-1200.webp", practice.siteUrl).href;

  return {
    title,
    description,
    robots: { index: Boolean(practice.approved && canonical), follow: true },
    alternates:
      canonical && practice.siteUrl
        ? {
            canonical,
            languages: {
              ar: new URL(href("ar"), practice.siteUrl).href,
              en: new URL(href("en"), practice.siteUrl).href,
              "x-default": new URL(href("ar"), practice.siteUrl).href,
            },
          }
        : undefined,
    openGraph: {
      title,
      description,
      type: "website",
      locale,
      siteName: practice.name[locale],
      url: canonical || undefined,
      images: image
        ? [{ url: image, width: 1200, height: 800, alt: copy.portrait }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
    icons: { icon: "/mark.svg" },
    other: { "page-type": "service", "site-kind": "other" },
  };
}
