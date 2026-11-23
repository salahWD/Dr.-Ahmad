import "server-only";
import { createSign } from "node:crypto";
import { readFileSync } from "node:fs";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import * as t from "@/db/schema";
import {
  addDays,
  clinicNow,
  clinicTimeZone,
  fromMinutes,
  toMinutes,
  type BusyBooking,
} from "./schedule";

/**
 * Google Calendar through a service account: Dr. Ahmad shares his calendar with
 * the service account's address ("Make changes to events"), and the server signs
 * its own short-lived tokens. No browser sign-in, no refresh token to expire.
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API = "https://www.googleapis.com/calendar/v3";
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.freebusy",
].join(" ");

type Config = { calendarId: string; clientEmail: string; privateKey: string };
export type CalendarSetup =
  | { state: "off" }
  | { state: "invalid"; detail: string }
  | { state: "ready"; config: Config };

export class CalendarError extends Error {
  constructor(message: string, readonly status = 0) {
    super(message);
  }
}

function readCredentials(): { clientEmail?: string; privateKey?: string; error?: string } {
  const file = process.env.GOOGLE_SERVICE_ACCOUNT_FILE?.trim();
  const inline = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (file || inline) {
    try {
      const json = JSON.parse(file ? readFileSync(file, "utf8") : (inline as string));
      return { clientEmail: json.client_email, privateKey: json.private_key };
    } catch {
      return { error: file ? `Cannot read the key file ${file}.` : "GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON." };
    }
  }
  return {
    clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim(),
    privateKey: process.env.GOOGLE_PRIVATE_KEY,
  };
}

/** Reads the calendar settings from the environment. */
export function calendarSetup(): CalendarSetup {
  const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim();
  const creds = readCredentials();
  if (!calendarId && !creds.clientEmail && !creds.privateKey && !creds.error) return { state: "off" };
  if (creds.error) return { state: "invalid", detail: creds.error };
  if (!calendarId) return { state: "invalid", detail: "GOOGLE_CALENDAR_ID is not set." };
  if (!creds.clientEmail || !creds.privateKey) {
    return { state: "invalid", detail: "The service account email or private key is missing." };
  }
  // Keys pasted into a single-line variable carry literal "\n" sequences.
  const privateKey = creds.privateKey.replace(/\\n/g, "\n");
  if (!privateKey.includes("PRIVATE KEY")) return { state: "invalid", detail: "The private key is not a PEM key." };
  return { state: "ready", config: { calendarId, clientEmail: creds.clientEmail, privateKey } };
}

export const calendarEnabled = () => calendarSetup().state === "ready";

const store = globalThis as unknown as {
  __gcalToken?: { token: string; expiresAt: number; email: string };
  __gcalBusy?: Map<string, { at: number; busy: BusyBooking[] }>;
  __gcalSync?: Map<number, Promise<unknown>>;
};
const busyCache = (store.__gcalBusy ??= new Map());
const syncChains = (store.__gcalSync ??= new Map());

const b64url = (value: string) => Buffer.from(value).toString("base64url");

async function accessToken(config: Config) {
  const cached = store.__gcalToken;
  if (cached && cached.email === config.clientEmail && cached.expiresAt - 60_000 > Date.now()) return cached.token;
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${b64url(
    JSON.stringify({ iss: config.clientEmail, scope: SCOPES, aud: TOKEN_URL, iat: now, exp: now + 3600 }),
  )}`;
  let signature: string;
  try {
    signature = createSign("RSA-SHA256").update(unsigned).sign(config.privateKey).toString("base64url");
  } catch {
    throw new CalendarError("The service account private key could not be used to sign.");
  }
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  const body = (await response.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error_description?: string; error?: string };
  if (!response.ok || !body.access_token) {
    throw new CalendarError(`Google sign-in failed: ${body.error_description || body.error || response.status}`, response.status);
  }
  store.__gcalToken = {
    token: body.access_token,
    expiresAt: Date.now() + (body.expires_in ?? 3600) * 1000,
    email: config.clientEmail,
  };
  return body.access_token;
}

async function api<T>(config: Config, path: string, init: { method: string; body?: unknown }): Promise<T | null> {
  const response = await fetch(`${API}${path}`, {
    method: init.method,
    headers: {
      Authorization: `Bearer ${await accessToken(config)}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (response.status === 204) return null;
  const data = (await response.json().catch(() => null)) as (T & { error?: { message?: string } }) | null;
  if (!response.ok) {
    throw new CalendarError(data?.error?.message || `Google Calendar returned ${response.status}`, response.status);
  }
  return data;
}

const calendarPath = (config: Config) => `/calendars/${encodeURIComponent(config.calendarId)}`;

/** Splits a busy period into clinic wall-clock pieces, one per day it touches. */
function toLocalPieces(startIso: string, endIso: string): BusyBooking[] {
  const start = clinicNow(new Date(startIso));
  const end = clinicNow(new Date(endIso));
  const pieces: BusyBooking[] = [];
  for (let date = start.date, n = 0; date <= end.date && n < 400; date = addDays(date, 1), n++) {
    const from = date === start.date ? start.minutes : 0;
    const to = date === end.date ? end.minutes : 1440;
    if (to > from) pieces.push({ date, time: fromMinutes(from), duration: to - from });
  }
  return pieces;
}

/**
 * Busy times in the calendar for `days` days from `fromDate` (clinic dates),
 * including events Dr. Ahmad adds himself. Cached for a minute unless `fresh`.
 */
export async function getCalendarBusy(fromDate: string, days: number, { fresh = false } = {}): Promise<BusyBooking[]> {
  const setup = calendarSetup();
  if (setup.state !== "ready") return [];
  const key = `${fromDate}|${days}`;
  const hit = busyCache.get(key);
  if (!fresh && hit && Date.now() - hit.at < 60_000) return hit.busy;

  const config = setup.config;
  // A day of margin on each side covers every UTC offset; extra periods are ignored.
  const timeMin = new Date(`${addDays(fromDate, -1)}T00:00:00Z`).toISOString();
  const timeMax = new Date(`${addDays(fromDate, days + 1)}T00:00:00Z`).toISOString();
  const data = await api<{
    calendars?: Record<string, { busy?: { start: string; end: string }[]; errors?: { reason: string }[] }>;
  }>(config, "/freeBusy", { method: "POST", body: { timeMin, timeMax, items: [{ id: config.calendarId }] } });
  const calendar = data?.calendars?.[config.calendarId];
  if (!calendar || calendar.errors?.length) {
    const reason = calendar?.errors?.[0]?.reason ?? "missing";
    throw new CalendarError(
      reason === "notFound"
        ? "The calendar was not found or is not shared with the service account."
        : `Google Calendar could not read busy times (${reason}).`,
    );
  }
  const busy = (calendar.busy ?? []).flatMap((p) => toLocalPieces(p.start, p.end));
  busyCache.set(key, { at: Date.now(), busy });
  return busy;
}

let lastWarning = 0;
/** Like getCalendarBusy, but never blocks bookings when Google is unreachable. */
export async function getCalendarBusySafe(fromDate: string, days: number, options?: { fresh?: boolean }) {
  try {
    return await getCalendarBusy(fromDate, days, options);
  } catch (error) {
    if (Date.now() - lastWarning > 60_000) {
      lastWarning = Date.now();
      console.error("Google Calendar busy times unavailable:", (error as Error).message);
    }
    return [];
  }
}

export const overlapsBusy = (date: string, time: string, duration: number, busy: BusyBooking[]) => {
  const start = toMinutes(time);
  return busy.some((b) => b.date === date && start < toMinutes(b.time) + b.duration && toMinutes(b.time) < start + duration);
};

function eventBody(b: t.Booking) {
  const approved = b.status === "approved";
  const endTotal = toMinutes(b.time) + b.duration;
  const endDate = addDays(b.date, Math.floor(endTotal / 1440));
  const site = process.env.SITE_URL?.trim();
  return {
    summary: approved ? `جلسة: ${b.name}` : `⏳ طلب حجز: ${b.name}`,
    description: [
      approved ? "الحالة: مؤكّد" : "الحالة: بانتظار الموافقة من لوحة الإدارة",
      `الهاتف: ${b.phone}`,
      b.serviceLabel && `الخدمة: ${b.serviceLabel}`,
      b.note && `ملاحظة: ${b.note}`,
      site && `${new URL("/admin/bookings/", site).href}`,
    ]
      .filter(Boolean)
      .join("\n"),
    start: { dateTime: `${b.date}T${b.time}:00`, timeZone: clinicTimeZone },
    end: { dateTime: `${endDate}T${fromMinutes(endTotal % 1440)}:00`, timeZone: clinicTimeZone },
    status: approved ? "confirmed" : "tentative",
    transparency: "opaque",
    colorId: approved ? "10" : "5",
    extendedProperties: { private: { clinicBookingId: String(b.id) } },
  };
}

async function syncNow(bookingId: number): Promise<"synced" | "removed" | "skipped"> {
  const setup = calendarSetup();
  if (setup.state !== "ready") return "skipped";
  const config = setup.config;
  const db = await getDb();
  const [booking] = await db.select().from(t.bookings).where(eq(t.bookings.id, bookingId)).limit(1);
  if (!booking) return "skipped";
  const active = booking.status === "pending" || booking.status === "approved";
  busyCache.clear();

  if (!active) {
    if (!booking.googleEventId) return "skipped";
    await deleteCalendarEvent(booking.googleEventId);
    await db.update(t.bookings).set({ googleEventId: null }).where(eq(t.bookings.id, bookingId));
    return "removed";
  }

  if (booking.googleEventId) {
    try {
      await api(config, `${calendarPath(config)}/events/${encodeURIComponent(booking.googleEventId)}`, {
        method: "PATCH",
        body: eventBody(booking),
      });
      return "synced";
    } catch (error) {
      // The event was removed in Google Calendar; create it again below.
      if (!(error instanceof CalendarError) || ![404, 410].includes(error.status)) throw error;
    }
  }
  const created = await api<{ id: string }>(config, `${calendarPath(config)}/events`, {
    method: "POST",
    body: eventBody(booking),
  });
  if (created?.id) {
    await db.update(t.bookings).set({ googleEventId: created.id }).where(eq(t.bookings.id, bookingId));
  }
  return "synced";
}

/**
 * Brings Google Calendar in line with a booking: pending and approved bookings
 * have an event (tentative or confirmed), declined and cancelled ones have none.
 * Calls for the same booking run one after another.
 */
export function syncBookingToCalendar(bookingId: number) {
  const previous = syncChains.get(bookingId) ?? Promise.resolve();
  const run = previous.catch(() => undefined).then(() => syncNow(bookingId));
  syncChains.set(bookingId, run);
  run.finally(() => {
    if (syncChains.get(bookingId) === run) syncChains.delete(bookingId);
  }).catch(() => undefined);
  return run;
}

/** Same as syncBookingToCalendar, but logs failures instead of throwing. */
export async function syncBookingQuietly(bookingId: number) {
  try {
    return await syncBookingToCalendar(bookingId);
  } catch (error) {
    console.error(`Google Calendar sync failed for booking ${bookingId}:`, (error as Error).message);
    return "failed" as const;
  }
}

export async function deleteCalendarEvent(eventId: string) {
  const setup = calendarSetup();
  if (setup.state !== "ready") return;
  const config = setup.config;
  busyCache.clear();
  try {
    await api(config, `${calendarPath(config)}/events/${encodeURIComponent(eventId)}`, { method: "DELETE" });
  } catch (error) {
    // Already gone counts as removed.
    if (!(error instanceof CalendarError) || ![404, 410].includes(error.status)) throw error;
  }
}

/** Checks sign-in, busy-time access and event access, for the dashboard's "Test" button. */
export async function testCalendarConnection(): Promise<{ ok: boolean; detail: string }> {
  const setup = calendarSetup();
  if (setup.state === "off") return { ok: false, detail: "off" };
  if (setup.state === "invalid") return { ok: false, detail: setup.detail };
  const config = setup.config;
  try {
    const today = clinicNow().date;
    const busy = await getCalendarBusy(today, 7, { fresh: true });
    const list = await api<{ accessRole?: string }>(
      config,
      `${calendarPath(config)}/events?maxResults=1&timeMin=${encodeURIComponent(new Date().toISOString())}`,
      { method: "GET" },
    );
    // Reading works with "See all event details", but bookings need write access.
    if (list?.accessRole !== "writer" && list?.accessRole !== "owner") {
      return { ok: false, detail: "The calendar is shared read-only. Change the service account’s permission to “Make changes to events”." };
    }
    return { ok: true, detail: String(busy.length) };
  } catch (error) {
    const e = error as CalendarError;
    if (e.status === 403 || e.status === 404) {
      return { ok: false, detail: "Share the calendar with the service account and allow “Make changes to events”." };
    }
    return { ok: false, detail: e.message };
  }
}
