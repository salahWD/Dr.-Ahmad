import type { Metadata } from "next";
import {
  articles,
  conditions,
  content,
  practice,
  type Locale,
} from "./content";

export const routes = [
  "services",
  "about-me",
  "about",
  "first-visit",
  "contact",
  "articles",
  "cancellation-policy",
  ...conditions.map(({ slug }) => `services/${slug}`),
  ...articles.map(({ slug }) => `articles/${slug}`),
];

export function href(locale: Locale, route = "") {
  const base = locale === "en" ? "/en/" : "/";
  return route ? `${base}${route}/` : base;
}

export function staticParams() {
  return routes.map((route) => ({ path: route.split("/") }));
}

export function buildMetadata(locale: Locale, route = ""): Metadata {
  const copy = content[locale];
  const service = conditions.find(({ slug }) => route === `services/${slug}`)
    ?.copy[locale];
  const article = articles.find(({ slug }) => route === `articles/${slug}`)?.[
    locale
  ];
  const pages: Partial<Record<string, [string, string]>> = {
    services: [copy.services, copy.faqItems[0][1]],
    about: [copy.about, copy.bio],
    "about-me": [copy.about, copy.bio],
    "first-visit": [copy.firstVisit, copy.faqItems[4][1]],
    contact: [copy.contact, copy.bookingNote],
    articles: [copy.articles, copy.featured],
    "cancellation-policy": [copy.policy, copy.policyText],
  };
  const page = pages[route];
  const name = article?.title ?? service?.title ?? page?.[0];
  const title = name ? `${name} | ${practice.name[locale]}` : copy.title;
  const description =
    article?.intro ?? service?.summary ?? page?.[1] ?? copy.description;
  const canonical =
    practice.siteUrl &&
    new URL(
      href(locale, route === "about" ? "about-me" : route),
      practice.siteUrl,
    ).href;
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
              ar: new URL(href("ar", route), practice.siteUrl).href,
              en: new URL(href("en", route), practice.siteUrl).href,
              "x-default": new URL(href("ar", route), practice.siteUrl).href,
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
