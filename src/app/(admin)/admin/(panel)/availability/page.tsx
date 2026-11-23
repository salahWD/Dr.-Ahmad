import { asc, gte } from "drizzle-orm";
import { CalendarDays, Trash2 } from "lucide-react";
import { getDb } from "@/db";
import * as t from "@/db/schema";
import { ActionForm, ConfirmButton, SubmitButton } from "@/components/admin/forms";
import { HoursEditor } from "@/components/admin/hours-editor";
import { addClosedDate, removeClosedDate, saveHours, saveSettings, testCalendar } from "@/lib/admin-actions";
import { getAdminDict } from "@/lib/admin-lang";
import { requireAdmin } from "@/lib/auth";
import { calendarSetup } from "@/lib/google-calendar";
import { getSettings } from "@/lib/data";
import { clinicNow, formatDay } from "@/lib/schedule";

const slotChoices = [30, 45, 60, 75, 90, 120];

export default async function AvailabilityPage() {
  await requireAdmin();
  const { lang, t: d } = await getAdminDict();
  const db = await getDb();
  const today = clinicNow().date;
  const [hours, closed, settings] = await Promise.all([
    db.select().from(t.weeklyHours),
    db.select().from(t.closedDates).where(gte(t.closedDates.date, today)).orderBy(asc(t.closedDates.date)),
    getSettings(db),
  ]);
  const calendar = calendarSetup();
  const slots = slotChoices.includes(settings.slotMinutes) ? slotChoices : [...slotChoices, settings.slotMinutes].sort((a, b) => a - b);

  return (
    <>
      <header className="a-head">
        <h1>{d.availability}</h1>
      </header>

      <section className="a-section a-panel a-calendar" data-state={calendar.state}>
        <h2>
          <CalendarDays size={20} aria-hidden="true" />
          {d.googleCalendar}
        </h2>
        <p className="a-hint">{d.calendarLead}</p>
        {calendar.state === "ready" ? (
          <>
            <dl className="a-facts">
              <div>
                <dt>{d.calendarConnected}</dt>
                <dd>
                  <bdi>{calendar.config.calendarId}</bdi>
                </dd>
              </div>
              <div>
                <dt>{d.calendarServiceAccount}</dt>
                <dd>
                  <bdi>{calendar.config.clientEmail}</bdi>
                </dd>
              </div>
            </dl>
            <ActionForm action={testCalendar} className="a-form">
              <div className="a-actions">
                <SubmitButton className="a-btn a-btn-ghost" pendingLabel={d.testing}>
                  {d.testConnection}
                </SubmitButton>
              </div>
            </ActionForm>
          </>
        ) : (
          <>
            {calendar.state === "invalid" && (
              <p className="a-flash a-flash-error">
                {d.calendarInvalid} {calendar.detail}
              </p>
            )}
            <p>{d.calendarNotSetUp}</p>
            <ol className="a-steps">
              {d.calendarSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </>
        )}
      </section>

      <section className="a-section a-panel">
        <h2>{d.weeklyHours}</h2>
        <p className="a-hint">{d.weeklyHoursLead}</p>
        <HoursEditor
          action={saveHours}
          initial={hours.map(({ weekday, start, end }) => ({ weekday, start, end }))}
          text={{
            weekdays: d.weekdays,
            open: d.open,
            closed: d.closed,
            addRange: d.addRange,
            remove: d.remove,
            from: d.from,
            to: d.to,
            save: d.saveHours,
            saving: d.saving,
          }}
        />
      </section>

      <section className="a-section a-panel">
        <h2>{d.bookingSettings}</h2>
        <ActionForm action={saveSettings} className="a-form a-grid">
          <label className="a-field">
            <span>{d.slotLength}</span>
            <select name="slotMinutes" defaultValue={settings.slotMinutes}>
              {slots.map((m) => (
                <option key={m} value={m}>
                  {m} {d.minutes}
                </option>
              ))}
            </select>
          </label>
          <label className="a-field">
            <span>
              {d.horizon} ({d.days})
            </span>
            <input type="number" name="horizonDays" min={1} max={90} defaultValue={settings.horizonDays} dir="ltr" required />
          </label>
          <label className="a-field">
            <span>
              {d.notice} ({d.hours})
            </span>
            <input type="number" name="minNoticeHours" min={0} max={168} defaultValue={settings.minNoticeHours} dir="ltr" required />
          </label>
          <label className="a-check a-span">
            <input type="checkbox" name="bookingEnabled" defaultChecked={settings.bookingEnabled} />
            <span>{d.bookingEnabled}</span>
          </label>
          <div className="a-actions a-span">
            <SubmitButton pendingLabel={d.saving}>{d.saveSettings}</SubmitButton>
          </div>
        </ActionForm>
      </section>

      <section className="a-section a-panel">
        <h2>{d.closedDates}</h2>
        <p className="a-hint">{d.closedDatesLead}</p>
        {closed.length ? (
          <ul className="a-closed">
            {closed.map((c) => (
              <li key={c.id}>
                <strong>{formatDay(c.date, lang)}</strong>
                {c.note && <span className="a-muted">{c.note}</span>}
                <form action={removeClosedDate}>
                  <input type="hidden" name="id" value={c.id} />
                  <ConfirmButton message={d.confirmDelete} className="a-btn a-btn-sm a-btn-icon">
                    <Trash2 size={16} aria-label={d.remove} />
                  </ConfirmButton>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          <p className="a-empty">{d.noClosedDates}</p>
        )}
        <ActionForm action={addClosedDate} className="a-form a-inline" resetOnSuccess>
          <label className="a-field">
            <span>{d.date}</span>
            <input type="date" name="date" min={today} required dir="ltr" />
          </label>
          <label className="a-field">
            <span>{d.reason}</span>
            <input name="note" maxLength={120} />
          </label>
          <SubmitButton pendingLabel={d.saving}>{d.addClosedDate}</SubmitButton>
        </ActionForm>
      </section>
    </>
  );
}
