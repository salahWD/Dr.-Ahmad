/**
 * Pure scheduling rules. Dates are "YYYY-MM-DD" and times "HH:MM", both as
 * wall-clock values in the clinic's time zone, so results never depend on the
 * server's own time zone.
 */

export const clinicTimeZone =
  process.env.CLINIC_TIMEZONE?.trim() || "Asia/Beirut";

export type HoursRange = { weekday: number; start: string; end: string };
export type BusyBooking = { date: string; time: string; duration: number };
export type ScheduleSettings = {
  slotMinutes: number;
  horizonDays: number;
  minNoticeHours: number;
};
export type DaySlots = {
  date: string;
  weekday: number;
  closed: boolean;
  slots: string[];
};

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
const datePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export const isTime = (value: string) => timePattern.test(value);
export const isDate = (value: string) =>
  datePattern.test(value) && addDays(value, 0) === value;

export function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function fromMinutes(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function utcDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function addDays(date: string, days: number) {
  const d = utcDate(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export const weekdayOf = (date: string) => utcDate(date).getUTCDay();
const dayNumber = (date: string) => utcDate(date).getTime() / 86_400_000;

/** The clinic's current date and minute of day. */
export function clinicNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: clinicTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const part = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "00";
  return {
    date: `${part("year")}-${part("month")}-${part("day")}`,
    minutes: Number(part("hour")) * 60 + Number(part("minute")),
  };
}

/**
 * Free start times for each working day in the booking horizon. Days the
 * clinic never opens are left out; closed dates are kept with `closed: true`.
 */
export function computeDays({
  hours,
  closedDates,
  busy,
  settings,
  now = new Date(),
}: {
  hours: HoursRange[];
  closedDates: string[];
  busy: BusyBooking[];
  settings: ScheduleSettings;
  now?: Date;
}): DaySlots[] {
  const { slotMinutes, horizonDays, minNoticeHours } = settings;
  const today = clinicNow(now);
  const earliest =
    dayNumber(today.date) * 1440 + today.minutes + minNoticeHours * 60;
  const closed = new Set(closedDates);
  const busyByDate = new Map<string, { start: number; end: number }[]>();
  for (const b of busy) {
    const start = toMinutes(b.time);
    const list = busyByDate.get(b.date) ?? [];
    list.push({ start, end: start + b.duration });
    busyByDate.set(b.date, list);
  }

  const days: DaySlots[] = [];
  for (let i = 0; i < horizonDays; i++) {
    const date = addDays(today.date, i);
    const weekday = weekdayOf(date);
    const ranges = hours
      .filter((h) => h.weekday === weekday)
      .sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
    if (!ranges.length) continue;
    if (closed.has(date)) {
      days.push({ date, weekday, closed: true, slots: [] });
      continue;
    }
    const taken = busyByDate.get(date) ?? [];
    const slots = new Set<string>();
    for (const range of ranges) {
      const end = toMinutes(range.end);
      for (let t = toMinutes(range.start); t + slotMinutes <= end; t += slotMinutes) {
        if (dayNumber(date) * 1440 + t < earliest) continue;
        const clash = taken.some(
          (b) => t < b.end && b.start < t + slotMinutes,
        );
        if (!clash) slots.add(fromMinutes(t));
      }
    }
    days.push({ date, weekday, closed: false, slots: [...slots].sort() });
  }
  return days;
}

export const localeTag = (locale: "ar" | "en") =>
  locale === "ar" ? "ar-LB" : "en-GB";

export function formatDay(
  date: string,
  locale: "ar" | "en",
  options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
  },
) {
  return new Intl.DateTimeFormat(localeTag(locale), {
    ...options,
    timeZone: "UTC",
  }).format(utcDate(date));
}

export function formatTime(time: string, locale: "ar" | "en") {
  const [h, m] = time.split(":").map(Number);
  return new Intl.DateTimeFormat(localeTag(locale), {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(new Date(Date.UTC(2000, 0, 1, h, m)));
}
