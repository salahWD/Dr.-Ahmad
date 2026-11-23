"use server";

import { and, count, eq, gte } from "drizzle-orm";
import { after } from "next/server";
import { getDb } from "@/db";
import * as t from "@/db/schema";
import { getOpenDays, getSettings, pick } from "./data";
import { getCalendarBusySafe, syncBookingQuietly } from "./google-calendar";
import { allow, clientIp, withBookingLock } from "./guards";
import { normalizePhone } from "./phone";
import { clinicNow, isDate, isTime } from "./schedule";

export type BookingError =
  | "invalid_name"
  | "invalid_phone"
  | "invalid_slot"
  | "slot_taken"
  | "too_many"
  | "closed"
  | "server";

export type BookingState =
  | { status: "idle" }
  | { status: "success"; date: string; time: string; at: number }
  | { status: "error"; code: BookingError; at: number };

const fail = (code: BookingError): BookingState => ({ status: "error", code, at: Date.now() });

const text = (formData: FormData, name: string) => {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
};

/** Public: request a free time. The request stays pending until the clinic approves it. */
export async function requestBooking(
  _previous: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const date = text(formData, "date");
  const time = text(formData, "time");
  // Bots fill the hidden field; pretend it worked and store nothing.
  if (text(formData, "company")) {
    return { status: "success", date, time, at: Date.now() };
  }

  const locale = text(formData, "locale") === "en" ? "en" : "ar";
  const name = text(formData, "name").replace(/\s+/g, " ");
  const phone = normalizePhone(text(formData, "phone"));
  const note = text(formData, "note").slice(0, 600);
  const serviceId = Number.parseInt(text(formData, "service"), 10);

  if (!isDate(date) || !isTime(time)) return fail("invalid_slot");
  if (name.length < 2 || name.length > 80) return fail("invalid_name");
  if (!phone) return fail("invalid_phone");
  if (!allow(`book:${await clientIp()}`, 6, 60 * 60 * 1000)) return fail("too_many");

  try {
    // Fetch the latest Google Calendar busy times before taking the lock (network
    // time shouldn't hold up other requests); the check inside then uses them.
    const { horizonDays } = await getSettings();
    await getCalendarBusySafe(clinicNow().date, horizonDays + 1, { fresh: true });

    return await withBookingLock(async () => {
      const db = await getDb();
      const { days, settings } = await getOpenDays(db);
      if (!settings.bookingEnabled) return fail("closed");
      const day = days.find((d) => d.date === date);
      if (!day?.slots.includes(time)) return fail("slot_taken");

      const [open] = await db
        .select({ n: count() })
        .from(t.bookings)
        .where(
          and(
            eq(t.bookings.phone, phone),
            eq(t.bookings.status, "pending"),
            gte(t.bookings.date, clinicNow().date),
          ),
        );
      if ((open?.n ?? 0) >= 3) return fail("too_many");

      const [service] = Number.isFinite(serviceId)
        ? await db.select().from(t.services).where(eq(t.services.id, serviceId)).limit(1)
        : [];

      const [created] = await db
        .insert(t.bookings)
        .values({
          date,
          time,
          duration: settings.slotMinutes,
          name,
          phone,
          note,
          locale,
          serviceId: service?.id ?? null,
          serviceLabel: service ? pick(service, "title", locale) : "",
        })
        .returning({ id: t.bookings.id });
      // The time is already held in the database; the calendar event (tentative,
      // until approved) is added after the patient gets their answer.
      if (created) after(() => syncBookingQuietly(created.id));
      return { status: "success", date, time, at: Date.now() } as const;
    });
  } catch (error) {
    if (String((error as Error)?.message).includes("UNIQUE")) return fail("slot_taken");
    console.error("Booking request failed", error);
    return fail("server");
  }
}
