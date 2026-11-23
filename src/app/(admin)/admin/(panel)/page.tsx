import Link from "next/link";
import { and, asc, count, eq, gte, lte } from "drizzle-orm";
import { getDb } from "@/db";
import * as t from "@/db/schema";
import { BookingCard } from "@/components/admin/booking-card";
import { getAdminDict } from "@/lib/admin-lang";
import { requireAdmin } from "@/lib/auth";
import { calendarEnabled } from "@/lib/google-calendar";
import { getOpenDays } from "@/lib/data";
import { addDays, clinicNow, formatDay } from "@/lib/schedule";

export default async function Overview() {
  await requireAdmin();
  const { lang, t: d } = await getAdminDict();
  const db = await getDb();
  const today = clinicNow().date;
  const weekEnd = addDays(today, 6);
  const calendar = calendarEnabled();

  const [pending, upcoming, { days }, ...counts] = await Promise.all([
    db.select().from(t.bookings)
      .where(and(eq(t.bookings.status, "pending"), gte(t.bookings.date, today)))
      .orderBy(asc(t.bookings.date), asc(t.bookings.time)),
    db.select().from(t.bookings)
      .where(and(eq(t.bookings.status, "approved"), gte(t.bookings.date, today), lte(t.bookings.date, weekEnd)))
      .orderBy(asc(t.bookings.date), asc(t.bookings.time)),
    getOpenDays(db),
    db.select({ n: count() }).from(t.articles),
    db.select({ n: count() }).from(t.services),
    db.select({ n: count() }).from(t.testimonials),
    db.select({ n: count() }).from(t.cases),
  ]);
  const freeThisWeek = days.filter((day) => day.date <= weekEnd).reduce((sum, day) => sum + day.slots.length, 0);
  const agenda = Map.groupBy(upcoming, (b) => b.date);
  const contentLinks = [
    ["/admin/articles/", d.articles, counts[0][0]?.n ?? 0],
    ["/admin/services/", d.services, counts[1][0]?.n ?? 0],
    ["/admin/testimonials/", d.testimonials, counts[2][0]?.n ?? 0],
    ["/admin/cases/", d.cases, counts[3][0]?.n ?? 0],
  ] as const;

  return (
    <>
      <header className="a-head">
        <h1>{d.overview}</h1>
      </header>
      <div className="a-stats">
        <Link href="/admin/bookings/" className="a-stat" data-tone={pending.length ? "alert" : undefined}>
          <strong>{pending.length}</strong>
          <span>{d.pendingRequests}</span>
        </Link>
        <Link href="/admin/bookings/?view=upcoming" className="a-stat">
          <strong>{upcoming.length}</strong>
          <span>{d.upcomingWeek}</span>
        </Link>
        <Link href="/admin/availability/" className="a-stat">
          <strong>{freeThisWeek}</strong>
          <span>{d.freeTimes}</span>
        </Link>
      </div>

      {pending.length > 0 && (
        <section className="a-section">
          <div className="a-section-head">
            <h2>{d.pendingRequests}</h2>
            <Link href="/admin/bookings/">{d.reviewRequests}</Link>
          </div>
          <div className="a-list">
            {pending.slice(0, 5).map((b) => (
              <BookingCard key={b.id} booking={b} lang={lang} t={d} back="/admin/" compact calendar={calendar} />
            ))}
          </div>
        </section>
      )}

      <section className="a-section">
        <div className="a-section-head">
          <h2>{d.upcomingWeek}</h2>
          <Link href="/admin/availability/">{d.manageHours}</Link>
        </div>
        {upcoming.length ? (
          <ol className="a-agenda">
            {[...agenda].map(([date, list]) => (
              <li key={date}>
                <h3>{formatDay(date, lang)}</h3>
                <div className="a-list">
                  {list.map((b) => (
                    <BookingCard key={b.id} booking={b} lang={lang} t={d} back="/admin/" compact calendar={calendar} />
                  ))}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="a-empty">{d.noUpcoming}</p>
        )}
      </section>

      <section className="a-section">
        <div className="a-content-links">
          {contentLinks.map(([href, label, n]) => (
            <Link key={href} href={href} className="a-stat a-stat-sm">
              <strong>{n}</strong>
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
