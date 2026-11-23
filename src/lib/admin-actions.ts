"use server";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { and, eq, inArray, ne } from "drizzle-orm";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { dataDir, getDb } from "@/db";
import * as t from "@/db/schema";
import { getAdminDict, ADMIN_LANG_COOKIE } from "./admin-lang";
import { adminConfigured, endSession, passwordMatches, requireAdmin, startSession } from "./auth";
import { collections, isCollection, reservedSlugs, type Field } from "./collections";
import { deleteCalendarEvent, syncBookingQuietly, testCalendarConnection } from "./google-calendar";
import { allow, clientIp, withBookingLock } from "./guards";
import { bundledPhotos, serviceIcons } from "./media";
import { normalizePhone } from "./phone";
import { isDate, isTime, toMinutes } from "./schedule";

export type FormState =
  | { status: "idle" }
  | { status: "ok"; message: string; at: number }
  | { status: "error"; message: string; at: number; fields?: Record<string, string> };

const ok = (message: string): FormState => ({ status: "ok", message, at: Date.now() });
const fail = (message: string, fields?: Record<string, string>): FormState => ({
  status: "error",
  message,
  fields,
  at: Date.now(),
});

const str = (formData: FormData, name: string) => {
  const v = formData.get(name);
  return typeof v === "string" ? v.trim() : "";
};
const int = (formData: FormData, name: string) => Number.parseInt(str(formData, name), 10);

/** Every content change refreshes the dashboard and both landing pages. */
function refreshAll() {
  revalidatePath("/admin", "layout");
  revalidatePath("/");
  revalidatePath("/en");
}

// ── Session ────────────────────────────────────────────────────────────────

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const { t: d } = await getAdminDict();
  if (!adminConfigured()) return fail(d.notConfigured);
  if (!allow(`login:${await clientIp()}`, 8, 15 * 60 * 1000)) return fail(d.tooManyAttempts);
  if (!passwordMatches(String(formData.get("password") ?? ""))) return fail(d.wrongPassword);
  await startSession();
  redirect("/admin/");
}

export async function logout() {
  await endSession();
  redirect("/admin/login/");
}

export async function setAdminLang(formData: FormData) {
  const lang = str(formData, "lang") === "en" ? "en" : "ar";
  (await cookies()).set(ADMIN_LANG_COOKIE, lang, { path: "/admin", maxAge: 365 * 86_400, sameSite: "lax" });
  revalidatePath("/admin", "layout");
}

// ── Bookings ───────────────────────────────────────────────────────────────

export async function setBookingStatus(formData: FormData) {
  await requireAdmin();
  const id = int(formData, "id");
  const status = str(formData, "status") as t.BookingStatus;
  const back = str(formData, "back") || "/admin/bookings/";
  if (!Number.isFinite(id) || !t.bookingStatuses.includes(status)) return;
  const db = await getDb();
  try {
    await withBookingLock(() =>
      db.update(t.bookings).set({ status, decidedAt: new Date() }).where(eq(t.bookings.id, id)),
    );
  } catch {
    // Re-activating a request whose time has since been taken breaks the one-live-booking rule.
    redirect(`${safeBack(back)}${back.includes("?") ? "&" : "?"}error=taken`);
  }
  // Approved → confirmed event; declined or cancelled → event removed; restored → tentative event.
  await syncBookingQuietly(id);
  refreshAll();
}

export async function deleteBooking(formData: FormData) {
  await requireAdmin();
  const id = int(formData, "id");
  if (!Number.isFinite(id)) return;
  const db = await getDb();
  const [row] = await db.delete(t.bookings).where(eq(t.bookings.id, id)).returning();
  if (row?.googleEventId) {
    await deleteCalendarEvent(row.googleEventId).catch((error) =>
      console.error(`Google Calendar: could not remove the event of booking ${id}:`, (error as Error).message),
    );
  }
  refreshAll();
}

/** Retries the Google Calendar update for one booking (the "Sync" button). */
export async function syncBooking(formData: FormData) {
  await requireAdmin();
  const id = int(formData, "id");
  const back = str(formData, "back") || "/admin/bookings/";
  if (!Number.isFinite(id)) return;
  const result = await syncBookingQuietly(id);
  if (result === "failed") redirect(`${safeBack(back)}${back.includes("?") ? "&" : "?"}error=calendar`);
  refreshAll();
}

export async function testCalendar(_prev: FormState): Promise<FormState> {
  await requireAdmin();
  const { t: d } = await getAdminDict();
  const result = await testCalendarConnection();
  if (result.ok) return ok(d.calendarOk(Number(result.detail)));
  return fail(result.detail === "off" ? d.calendarOff : `${d.calendarFailed} ${result.detail}`);
}

const safeBack = (back: string) => (back.startsWith("/admin/") ? back.split("?")[0] : "/admin/bookings/");

/** Adds a session arranged by phone. It is approved straight away and blocks that time. */
export async function addBooking(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const { t: d } = await getAdminDict();
  const date = str(formData, "date");
  const time = str(formData, "time");
  const name = str(formData, "name").replace(/\s+/g, " ");
  const phone = normalizePhone(str(formData, "phone"));
  const duration = int(formData, "duration");
  const serviceId = int(formData, "service");
  const note = str(formData, "note").slice(0, 600);
  if (!isDate(date) || !isTime(time) || name.length < 2 || name.length > 80 || !phone || !(duration >= 15 && duration <= 240)) {
    return fail(d.invalidBooking);
  }
  const db = await getDb();
  const outcome = await withBookingLock(async (): Promise<number | "taken"> => {
    const sameDay = await db
      .select()
      .from(t.bookings)
      .where(and(eq(t.bookings.date, date), inArray(t.bookings.status, ["pending", "approved"])));
    const start = toMinutes(time);
    if (sameDay.some((b) => start < toMinutes(b.time) + b.duration && toMinutes(b.time) < start + duration)) {
      return "taken";
    }
    const [service] = Number.isFinite(serviceId)
      ? await db.select().from(t.services).where(eq(t.services.id, serviceId)).limit(1)
      : [];
    try {
      const [created] = await db
        .insert(t.bookings)
        .values({
          date,
          time,
          duration,
          name,
          phone,
          note,
          locale: str(formData, "locale") === "en" ? "en" : "ar",
          serviceId: service?.id ?? null,
          serviceLabel: service?.titleAr ?? "",
          source: "admin",
          status: "approved",
          decidedAt: new Date(),
        })
        .returning({ id: t.bookings.id });
      return created?.id ?? "taken";
    } catch {
      return "taken";
    }
  });
  if (outcome === "taken") return fail(d.slotTaken);
  // Outside the booking lock: the database already holds the time.
  const synced = await syncBookingQuietly(outcome);
  refreshAll();
  return synced === "failed" ? fail(d.calendarSyncFailed) : ok(d.saved);
}

// ── Availability ───────────────────────────────────────────────────────────

export async function saveHours(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const { t: d } = await getAdminDict();
  const ranges = formData
    .getAll("hours")
    .map(String)
    .map((v) => {
      const [weekday, start, end] = v.split("|");
      return { weekday: Number(weekday), start, end };
    });
  for (const r of ranges) {
    if (!(r.weekday >= 0 && r.weekday <= 6) || !isTime(r.start) || !isTime(r.end) || toMinutes(r.start) >= toMinutes(r.end)) {
      return fail(d.badRange);
    }
  }
  for (let day = 0; day < 7; day++) {
    const list = ranges.filter((r) => r.weekday === day).sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
    for (let i = 1; i < list.length; i++) {
      if (toMinutes(list[i].start) < toMinutes(list[i - 1].end)) return fail(d.badRange);
    }
  }
  const db = await getDb();
  // A batch runs as one transaction: the week is replaced whole or not at all.
  if (ranges.length) await db.batch([db.delete(t.weeklyHours), db.insert(t.weeklyHours).values(ranges)]);
  else await db.delete(t.weeklyHours);
  refreshAll();
  return ok(d.saved);
}

export async function saveSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const { t: d } = await getAdminDict();
  const slotMinutes = int(formData, "slotMinutes");
  const horizonDays = int(formData, "horizonDays");
  const minNoticeHours = int(formData, "minNoticeHours");
  if (!(slotMinutes >= 15 && slotMinutes <= 240) || !(horizonDays >= 1 && horizonDays <= 90) || !(minNoticeHours >= 0 && minNoticeHours <= 168)) {
    return fail(d.invalid);
  }
  const values = {
    slotMinutes: String(slotMinutes),
    horizonDays: String(horizonDays),
    minNoticeHours: String(minNoticeHours),
    bookingEnabled: formData.get("bookingEnabled") === "on" ? "true" : "false",
  };
  const db = await getDb();
  for (const [key, value] of Object.entries(values)) {
    await db.insert(t.settings).values({ key, value }).onConflictDoUpdate({ target: t.settings.key, set: { value } });
  }
  refreshAll();
  return ok(d.saved);
}

export async function addClosedDate(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const { t: d } = await getAdminDict();
  const date = str(formData, "date");
  if (!isDate(date)) return fail(d.invalid);
  const db = await getDb();
  await db
    .insert(t.closedDates)
    .values({ date, note: str(formData, "note").slice(0, 120) })
    .onConflictDoUpdate({ target: t.closedDates.date, set: { note: str(formData, "note").slice(0, 120) } });
  refreshAll();
  return ok(d.saved);
}

export async function removeClosedDate(formData: FormData) {
  await requireAdmin();
  const id = int(formData, "id");
  if (!Number.isFinite(id)) return;
  const db = await getDb();
  await db.delete(t.closedDates).where(eq(t.closedDates.id, id));
  refreshAll();
}

// ── Content collections ────────────────────────────────────────────────────

const IMAGE_LIMIT = 5 * 1024 * 1024;

function imageType(bytes: Uint8Array): "jpg" | "png" | "webp" | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if ([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((b, i) => bytes[i] === b)) return "png";
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.slice(from, to));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "webp";
  return null;
}

async function removeUpload(value: unknown) {
  if (typeof value !== "string" || !value.startsWith("/media/")) return;
  const file = path.basename(value);
  await unlink(path.join(dataDir, "uploads", file)).catch(() => undefined);
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

/** Creates or updates an article, service, testimonial or case. */
export async function saveItem(
  collection: string,
  id: number | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const { t: d } = await getAdminDict();
  if (!isCollection(collection)) return fail(d.invalid);
  const config = collections[collection];
  const table = config.table;
  const db = await getDb();
  const [existing] = id
    ? await db.select().from(table).where(eq(table.id, id)).limit(1)
    : [];
  if (id && !existing) return fail(d.invalid);

  const values: Record<string, unknown> = {};
  const errors: Record<string, string> = {};
  let upload: { bytes: Uint8Array; type: string } | null = null;

  for (const field of config.fields as Field[]) {
    switch (field.kind) {
      case "text":
      case "textarea":
      case "body": {
        for (const suffix of ["Ar", "En"] as const) {
          const key = `${field.name}${suffix}`;
          const value = str(formData, key).replace(/\r\n/g, "\n");
          if (field.required && suffix === "Ar" && !value) errors[key] = d.required;
          if (field.max && value.length > field.max) errors[key] = d.invalid;
          values[key] = value;
        }
        break;
      }
      case "slug": {
        const raw = str(formData, field.name) || str(formData, field.from) || str(formData, "titleAr");
        const slug = slugify(raw) || `article-${Date.now().toString(36)}`;
        if (reservedSlugs.has(slug)) errors[field.name] = d.slugTaken;
        else {
          const clash = await db
            .select({ id: t.articles.id })
            .from(t.articles)
            .where(id ? and(eq(t.articles.slug, slug), ne(t.articles.id, id)) : eq(t.articles.slug, slug))
            .limit(1);
          if (clash.length) errors[field.name] = d.slugTaken;
        }
        values[field.name] = slug;
        break;
      }
      case "number": {
        const raw = str(formData, field.name);
        if (!raw && field.optional) {
          values[field.name] = null;
          break;
        }
        const n = Number.parseInt(raw, 10);
        if (!Number.isFinite(n) || n < field.min || n > field.max) errors[field.name] = d.invalid;
        values[field.name] = Number.isFinite(n) ? n : 0;
        break;
      }
      case "checkbox":
        values[field.name] = formData.get(field.name) === "on";
        break;
      case "icon": {
        const icon = str(formData, field.name);
        values[field.name] = Object.hasOwn(serviceIcons, icon) ? icon : "activity";
        break;
      }
      case "image": {
        const file = formData.get(`${field.name}File`);
        const choice = str(formData, field.name);
        if (file instanceof File && file.size > 0) {
          const bytes = new Uint8Array(await file.arrayBuffer());
          const type = file.size <= IMAGE_LIMIT ? imageType(bytes) : null;
          if (!type) errors[field.name] = d.imageTooLarge;
          else upload = { bytes, type };
        } else if (choice === "keep") {
          values[field.name] = (existing as Record<string, unknown> | undefined)?.[field.name] ?? "";
        } else if (choice.startsWith("photo:") && (bundledPhotos as readonly string[]).includes(choice.slice(6))) {
          values[field.name] = choice;
        } else {
          values[field.name] = "";
        }
        break;
      }
    }
  }

  if (Object.keys(errors).length) return fail(d.invalid, errors);

  if (upload) {
    const name = `${randomUUID()}.${upload.type}`;
    await mkdir(path.join(dataDir, "uploads"), { recursive: true });
    await writeFile(path.join(dataDir, "uploads", name), upload.bytes);
    values.image = `/media/${name}`;
  }
  const previousImage = (existing as Record<string, unknown> | undefined)?.image;
  if (previousImage !== undefined && previousImage !== values.image) await removeUpload(previousImage);

  // The collection config and the table come from the same entry, so the shape matches.
  type Row = typeof table.$inferInsert;
  if (id) {
    await db.update(table).set({ ...(values as Partial<Row>), updatedAt: new Date() }).where(eq(table.id, id));
  } else {
    await db.insert(table).values(values as Row);
  }
  refreshAll();
  redirect(`/admin/${collection}/?saved=1`);
}

export async function deleteItem(formData: FormData) {
  await requireAdmin();
  const collection = str(formData, "collection");
  const id = int(formData, "id");
  if (!isCollection(collection) || !Number.isFinite(id)) return;
  const table = collections[collection].table;
  const db = await getDb();
  const [row] = await db.select().from(table).where(eq(table.id, id)).limit(1);
  if (!row) return;
  if (collection === "services") {
    await db.update(t.bookings).set({ serviceId: null }).where(eq(t.bookings.serviceId, id));
  }
  await db.delete(table).where(eq(table.id, id));
  await removeUpload((row as Record<string, unknown>).image);
  refreshAll();
}
