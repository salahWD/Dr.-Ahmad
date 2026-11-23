import { sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
};

const listing = {
  sortOrder: integer("sort_order").notNull().default(0),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
};

export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  icon: text("icon").notNull().default("activity"),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull().default(""),
  summaryAr: text("summary_ar").notNull().default(""),
  summaryEn: text("summary_en").notNull().default(""),
  ...listing,
  ...timestamps,
});

export const articles = sqliteTable("articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  image: text("image").notNull().default(""),
  categoryAr: text("category_ar").notNull().default(""),
  categoryEn: text("category_en").notNull().default(""),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull().default(""),
  introAr: text("intro_ar").notNull().default(""),
  introEn: text("intro_en").notNull().default(""),
  bodyAr: text("body_ar").notNull().default(""),
  bodyEn: text("body_en").notNull().default(""),
  ...listing,
  ...timestamps,
});

export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  quoteAr: text("quote_ar").notNull(),
  quoteEn: text("quote_en").notNull().default(""),
  subjectAr: text("subject_ar").notNull().default(""),
  subjectEn: text("subject_en").notNull().default(""),
  illustrative: integer("illustrative", { mode: "boolean" })
    .notNull()
    .default(false),
  ...listing,
  ...timestamps,
});

/** Patient cases (حالات) shown on the landing page. */
export const cases = sqliteTable("cases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  image: text("image").notNull().default(""),
  conditionAr: text("condition_ar").notNull().default(""),
  conditionEn: text("condition_en").notNull().default(""),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull().default(""),
  summaryAr: text("summary_ar").notNull().default(""),
  summaryEn: text("summary_en").notNull().default(""),
  treatmentAr: text("treatment_ar").notNull().default(""),
  treatmentEn: text("treatment_en").notNull().default(""),
  outcomeAr: text("outcome_ar").notNull().default(""),
  outcomeEn: text("outcome_en").notNull().default(""),
  sessions: integer("sessions"),
  illustrative: integer("illustrative", { mode: "boolean" })
    .notNull()
    .default(false),
  ...listing,
  ...timestamps,
});

/** Weekly opening hours. weekday: 0 = Sunday … 6 = Saturday. Times are "HH:MM" in the clinic's time zone. */
export const weeklyHours = sqliteTable(
  "weekly_hours",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    weekday: integer("weekday").notNull(),
    start: text("start").notNull(),
    end: text("end").notNull(),
  },
  (t) => [index("weekly_hours_weekday").on(t.weekday)],
);

/** Single dates when the clinic takes no bookings (holidays, leave). */
export const closedDates = sqliteTable("closed_dates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull().unique(),
  note: text("note").notNull().default(""),
});

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const bookingStatuses = [
  "pending",
  "approved",
  "rejected",
  "cancelled",
] as const;
export type BookingStatus = (typeof bookingStatuses)[number];

export const bookings = sqliteTable(
  "bookings",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    date: text("date").notNull(),
    time: text("time").notNull(),
    duration: integer("duration").notNull(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    serviceId: integer("service_id").references(() => services.id, {
      onDelete: "set null",
    }),
    serviceLabel: text("service_label").notNull().default(""),
    note: text("note").notNull().default(""),
    locale: text("locale").notNull().default("ar"),
    source: text("source").notNull().default("website"),
    status: text("status", { enum: bookingStatuses })
      .notNull()
      .default("pending"),
    /** The matching event in the clinic's Google Calendar, when one exists. */
    googleEventId: text("google_event_id"),
    createdAt: timestamps.createdAt,
    decidedAt: integer("decided_at", { mode: "timestamp" }),
  },
  (t) => [
    index("bookings_date").on(t.date),
    index("bookings_status").on(t.status),
    // A time can only be held by one live request.
    uniqueIndex("bookings_active_slot")
      .on(t.date, t.time)
      .where(sql`status in ('pending', 'approved')`),
  ],
);

export type Service = typeof services.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Case = typeof cases.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type WeeklyHours = typeof weeklyHours.$inferSelect;
export type ClosedDate = typeof closedDates.$inferSelect;
