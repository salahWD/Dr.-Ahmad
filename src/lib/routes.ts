import type { Metadata } from "next";
import { content, practice, services, type Locale } from "./content";

export const routes = [
  "services", "about", "first-visit", "contact",
  ...services.map(({ slug }) => `services/${slug}`),
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
  const service = services.find(({ slug }) => route === `services/${slug}`)?.copy[locale];
  const pages: Partial<Record<string, [string, string]>> = {
    services: [copy.nav.services, copy.servicesIntro],
    about: [copy.nav.about, copy.aboutIntro],
    "first-visit": [copy.nav.visit, copy.firstVisitIntro],
    contact: [copy.contactTitle, copy.contactIntro],
  };
  const page = pages[route];
  const name = service?.title ?? page?.[0];
  const title = name ? `${name} | ${practice.name[locale]}` : copy.title;
  const description = service?.summary ?? page?.[1] ?? copy.description;
  const canonical = practice.siteUrl && new URL(href(locale, route), practice.siteUrl).href;
  const image = practice.siteUrl && new URL("/images/movement-assessment-1200.webp", practice.siteUrl).href;

  return {
    title,
    description,
    robots: { index: Boolean(practice.approved && canonical), follow: true },
    alternates: canonical && practice.siteUrl ? {
      canonical,
      languages: {
        ar: new URL(href("ar", route), practice.siteUrl).href,
        en: new URL(href("en", route), practice.siteUrl).href,
        "x-default": new URL(href("ar", route), practice.siteUrl).href,
      },
    } : undefined,
    openGraph: {
      title, description, type: "website", locale,
      siteName: practice.name[locale],
      url: canonical || undefined,
      images: image ? [{ url: image, width: 1200, height: 800, alt: copy.heroAlt }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined },
    icons: { icon: "/mark.svg" },
    other: { "page-type": "service", "site-kind": "other" },
  };
}
