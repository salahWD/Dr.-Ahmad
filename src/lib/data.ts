import "server-only";
import { and, asc, desc, eq, gte, inArray } from "drizzle-orm";
import { getDb, type Db } from "@/db";
import * as t from "@/db/schema";
import { defaultSettings } from "@/db/seed";
import type { Locale } from "./content";
import { getCalendarBusySafe } from "./google-calendar";
import {
  clinicNow,
  computeDays,
  formatDay,
  formatTime,
  type DaySlots,
} from "./schedule";

export type BookingSettings = {
  slotMinutes: number;
  horizonDays: number;
  minNoticeHours: number;
  bookingEnabled: boolean;
};

const clampInt = (value: string | undefined, fallback: number, min: number, max: number) => {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};

export async function getSettings(db?: Db): Promise<BookingSettings> {
  const conn = db ?? (await getDb());
  const rows = await conn.select().from(t.settings);
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string | undefined>;
  return {
    slotMinutes: clampInt(map.slotMinutes, Number(defaultSettings.slotMinutes), 15, 240),
    horizonDays: clampInt(map.horizonDays, Number(defaultSettings.horizonDays), 1, 90),
    minNoticeHours: clampInt(map.minNoticeHours, Number(defaultSettings.minNoticeHours), 0, 168),
    bookingEnabled: (map.bookingEnabled ?? defaultSettings.bookingEnabled) === "true",
  };
}

/**
 * Free times per working day, computed from hours, closed dates, live bookings
 * and busy times in Dr. Ahmad's Google Calendar (when connected).
 */
export async function getOpenDays(
  db?: Db,
  { freshCalendar = false } = {},
): Promise<{ days: DaySlots[]; settings: BookingSettings }> {
  const conn = db ?? (await getDb());
  const settings = await getSettings(conn);
  const today = clinicNow().date;
  const [hours, closed, busy, calendarBusy] = await Promise.all([
    conn.select().from(t.weeklyHours),
    conn.select().from(t.closedDates).where(gte(t.closedDates.date, today)),
    conn
      .select({ date: t.bookings.date, time: t.bookings.time, duration: t.bookings.duration })
      .from(t.bookings)
      .where(and(gte(t.bookings.date, today), inArray(t.bookings.status, ["pending", "approved"]))),
    getCalendarBusySafe(today, settings.horizonDays + 1, { fresh: freshCalendar }),
  ]);
  const days = computeDays({
    hours,
    closedDates: closed.map((c) => c.date),
    busy: [...busy, ...calendarBusy],
    settings,
  });
  return { days, settings };
}

export type PublicDay = {
  date: string;
  weekday: string;
  day: string;
  month: string;
  label: string;
  closed: boolean;
  slots: { time: string; label: string }[];
};

/** Free times with labels formatted on the server, so markup matches during hydration. */
export async function getPublicAvailability(locale: Locale) {
  const { days, settings } = await getOpenDays();
  const publicDays: PublicDay[] = days.map((d) => ({
    date: d.date,
    weekday: formatDay(d.date, locale, { weekday: "short" }),
    day: formatDay(d.date, locale, { day: "numeric" }),
    month: formatDay(d.date, locale, { month: "short" }),
    label: formatDay(d.date, locale),
    closed: d.closed,
    slots: d.slots.map((time) => ({ time, label: formatTime(time, locale) })),
  }));
  return { days: publicDays, settings };
}

/** Picks the localized field, falling back to Arabic when English is empty. */
export function pick<T extends Record<string, unknown>>(
  row: T,
  field: string,
  locale: Locale,
): string {
  const en = row[`${field}En`];
  const ar = row[`${field}Ar`];
  if (locale === "en" && typeof en === "string" && en.trim()) return en;
  return typeof ar === "string" ? ar : "";
}

export async function getSiteContent() {
  const db = await getDb();
  const [services, articles, testimonials, cases] = await Promise.all([
    db.select().from(t.services).where(eq(t.services.published, true)).orderBy(asc(t.services.sortOrder), asc(t.services.id)),
    db.select().from(t.articles).where(eq(t.articles.published, true)).orderBy(asc(t.articles.sortOrder), desc(t.articles.id)),
    db.select().from(t.testimonials).where(eq(t.testimonials.published, true)).orderBy(asc(t.testimonials.sortOrder), asc(t.testimonials.id)),
    db.select().from(t.cases).where(eq(t.cases.published, true)).orderBy(asc(t.cases.sortOrder), asc(t.cases.id)),
  ]);
  return { services, articles, testimonials, cases };
}
