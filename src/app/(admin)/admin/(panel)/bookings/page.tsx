import Link from "next/link";
import { and, asc, desc, eq, gte, lt } from "drizzle-orm";
import { getDb } from "@/db";
import * as t from "@/db/schema";
import { BookingCard } from "@/components/admin/booking-card";
import { ActionForm, SubmitButton } from "@/components/admin/forms";
import { addBooking } from "@/lib/admin-actions";
import { getAdminDict } from "@/lib/admin-lang";
import { requireAdmin } from "@/lib/auth";
import { calendarEnabled } from "@/lib/google-calendar";
import { getSettings, pick } from "@/lib/data";
import { clinicNow } from "@/lib/schedule";

const views = ["pending", "upcoming", "past", "all"] as const;
type View = (typeof views)[number];

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; error?: string }>;
}) {
  await requireAdmin();
  const { lang, t: d } = await getAdminDict();
  const params = await searchParams;
  const view: View = views.includes(params.view as View) ? (params.view as View) : "pending";
  const db = await getDb();
  const today = clinicNow().date;
  const b = t.bookings;
  const query = db.select().from(b);
  const rows =
    view === "pending"
      ? await query.where(and(eq(b.status, "pending"), gte(b.date, today))).orderBy(asc(b.date), asc(b.time))
      : view === "upcoming"
        ? await query.where(and(eq(b.status, "approved"), gte(b.date, today))).orderBy(asc(b.date), asc(b.time))
        : view === "past"
          ? await query.where(lt(b.date, today)).orderBy(desc(b.date), desc(b.time)).limit(200)
          : await query.orderBy(desc(b.date), desc(b.time)).limit(300);
  const [services, settings] = await Promise.all([
    db.select().from(t.services).orderBy(asc(t.services.sortOrder)),
    getSettings(db),
  ]);
  const labels: Record<View, string> = { pending: d.pending, upcoming: d.upcoming, past: d.past, all: d.all };
  const back = `/admin/bookings/?view=${view}`;
  const calendar = calendarEnabled();

  return (
    <>
      <header className="a-head">
        <h1>{d.bookings}</h1>
      </header>
      <nav className="a-tabs" aria-label={d.status}>
        {views.map((v) => (
          <Link key={v} href={`/admin/bookings/?view=${v}`} aria-current={v === view ? "page" : undefined}>
            {labels[v]}
          </Link>
        ))}
      </nav>
      {params.error === "taken" && <p className="a-flash a-flash-error">{d.slotTaken}</p>}
      {params.error === "calendar" && <p className="a-flash a-flash-error">{d.calendarError}</p>}
      {rows.length ? (
        <div className="a-list">
          {rows.map((row) => (
            <BookingCard key={row.id} booking={row} lang={lang} t={d} back={back} calendar={calendar} />
          ))}
        </div>
      ) : (
        <p className="a-empty">{d.empty}</p>
      )}

      <section className="a-section a-panel">
        <h2>{d.addBooking}</h2>
        <p className="a-hint">{d.addBookingLead}</p>
        <ActionForm action={addBooking} className="a-form a-grid" resetOnSuccess>
          <label className="a-field">
            <span>{d.date}</span>
            <input type="date" name="date" required min={today} dir="ltr" />
          </label>
          <label className="a-field">
            <span>{d.time}</span>
            <input type="time" name="time" required step={300} dir="ltr" />
          </label>
          <label className="a-field">
            <span>{d.duration}</span>
            <input type="number" name="duration" min={15} max={240} step={5} defaultValue={settings.slotMinutes} required dir="ltr" />
          </label>
          <label className="a-field">
            <span>{d.name}</span>
            <input name="name" required minLength={2} maxLength={80} />
          </label>
          <label className="a-field">
            <span>{d.phone}</span>
            <input name="phone" type="tel" required dir="ltr" />
          </label>
          <label className="a-field">
            <span>{d.service}</span>
            <select name="service" defaultValue="">
              <option value="">{d.anyService}</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {pick(s, "title", lang)}
                </option>
              ))}
            </select>
          </label>
          <label className="a-field a-span">
            <span>{d.note}</span>
            <input name="note" maxLength={600} />
          </label>
          <input type="hidden" name="locale" value={lang} />
          <div className="a-actions a-span">
            <SubmitButton pendingLabel={d.saving}>{d.addBooking}</SubmitButton>
          </div>
        </ActionForm>
      </section>
    </>
  );
}
