import * as t from "@/db/schema";
import type { AdminDict } from "./admin-i18n";

type Label = { ar: string; en: string } | keyof AdminDict;

export type Field =
  | { name: string; kind: "text" | "textarea" | "body"; label: Label; bilingual: true; required?: boolean; max?: number; hint?: Label }
  | { name: string; kind: "slug"; label: Label; from: string }
  | { name: string; kind: "number"; label: Label; optional?: boolean; min: number; max: number; hint?: Label }
  | { name: string; kind: "checkbox"; label: Label }
  | { name: string; kind: "icon"; label: Label }
  | { name: string; kind: "image"; label: Label };

const order: Field = { name: "sortOrder", kind: "number", label: "order", min: -999, max: 999, hint: "orderHint" };
const published: Field = { name: "published", kind: "checkbox", label: "published" };
const illustrative: Field = { name: "illustrative", kind: "checkbox", label: "illustrativeLabel" };

export const collections = {
  services: {
    table: t.services,
    label: "services",
    fields: [
      { name: "title", kind: "text", label: { ar: "اسم الخدمة", en: "Service name" }, bilingual: true, required: true, max: 120 },
      { name: "summary", kind: "textarea", label: { ar: "وصف قصير", en: "Short description" }, bilingual: true, max: 400 },
      { name: "icon", kind: "icon", label: "icon" },
      order,
      published,
    ],
  },
  articles: {
    table: t.articles,
    label: "articles",
    fields: [
      { name: "title", kind: "text", label: { ar: "العنوان", en: "Title" }, bilingual: true, required: true, max: 160 },
      { name: "slug", kind: "slug", label: { ar: "رابط المقال (بالإنجليزية)", en: "Link name (letters, numbers, dashes)" }, from: "titleEn" },
      { name: "category", kind: "text", label: { ar: "التصنيف", en: "Category" }, bilingual: true, max: 80 },
      { name: "intro", kind: "textarea", label: { ar: "المقدمة", en: "Introduction" }, bilingual: true, max: 600 },
      {
        name: "body",
        kind: "body",
        label: { ar: "نص المقال", en: "Article text" },
        bilingual: true,
        max: 20000,
        hint: {
          ar: "اترك سطراً فارغاً بين الفقرات. ابدأ السطر بـ «## » ليصبح عنواناً فرعياً.",
          en: "Leave a blank line between paragraphs. Start a line with “## ” to make it a subheading.",
        },
      },
      { name: "image", kind: "image", label: "image" },
      order,
      published,
    ],
  },
  testimonials: {
    table: t.testimonials,
    label: "testimonials",
    fields: [
      { name: "quote", kind: "textarea", label: { ar: "نص الرأي", en: "Quote" }, bilingual: true, required: true, max: 800, hint: "consentHint" },
      { name: "subject", kind: "text", label: { ar: "الخدمة أو السياق", en: "Service or context" }, bilingual: true, max: 120 },
      illustrative,
      order,
      published,
    ],
  },
  cases: {
    table: t.cases,
    label: "cases",
    fields: [
      { name: "title", kind: "text", label: { ar: "عنوان الحالة", en: "Case title" }, bilingual: true, required: true, max: 160, hint: "consentHint" },
      { name: "condition", kind: "text", label: { ar: "نوع الحالة", en: "Condition or category" }, bilingual: true, max: 120 },
      { name: "summary", kind: "textarea", label: { ar: "الحالة باختصار", en: "The situation" }, bilingual: true, max: 600 },
      { name: "treatment", kind: "textarea", label: { ar: "ما قمنا به", en: "What we did" }, bilingual: true, max: 1200 },
      { name: "outcome", kind: "textarea", label: { ar: "النتيجة", en: "Outcome" }, bilingual: true, max: 800 },
      { name: "sessions", kind: "number", label: { ar: "عدد الجلسات", en: "Number of sessions" }, optional: true, min: 1, max: 500 },
      { name: "image", kind: "image", label: "image" },
      illustrative,
      order,
      published,
    ],
  },
} satisfies Record<string, { table: unknown; label: keyof AdminDict; fields: Field[] }>;

export type CollectionKey = keyof typeof collections;
export const collectionKeys = Object.keys(collections) as CollectionKey[];
export const isCollection = (value: string): value is CollectionKey =>
  Object.hasOwn(collections, value);

/** Section ids on the landing page; article links must not reuse them. */
export const reservedSlugs = new Set([
  "home", "main", "certifications", "about-me", "approach", "values", "numbers",
  "testimonials", "services", "related-concerns", "cases", "articles",
  "article-library", "faq", "cancellation-policy", "booking",
]);

export function labelText(label: Label, dict: AdminDict, lang: "ar" | "en"): string {
  if (typeof label === "string") {
    const value = dict[label];
    return typeof value === "string" ? value : label;
  }
  return label[lang];
}
