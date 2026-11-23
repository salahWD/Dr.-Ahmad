import { CalendarCheck2, CalendarX2, Check, MessageCircle, Phone, RefreshCw, Trash2, Undo2, X } from "lucide-react";
import type { Booking } from "@/db/schema";
import { adminDict, type AdminDict, type AdminLang } from "@/lib/admin-i18n";
import { deleteBooking, setBookingStatus, syncBooking } from "@/lib/admin-actions";
import { whatsappDigits } from "@/lib/phone";
import { clinicNow, clinicTimeZone, formatDay, formatTime, localeTag } from "@/lib/schedule";
import { ConfirmButton, SubmitButton } from "./forms";

function StatusButton({ id, status, back, children, className }: { id: number; status: string; back: string; children: React.ReactNode; className?: string }) {
  return (
    <form action={setBookingStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="back" value={back} />
      <SubmitButton className={className}>{children}</SubmitButton>
    </form>
  );
}

/** Whether the booking's Google Calendar event matches its status, with a retry when it doesn't. */
function CalendarState({ booking: b, t: d, back }: { booking: Booking; t: AdminDict; back: string }) {
  const active = b.status === "pending" || b.status === "approved";
  if (!active && !b.googleEventId) return null;
  if (active && b.googleEventId) {
    return (
      <small className="a-cal" data-state="ok">
        <CalendarCheck2 size={14} aria-hidden="true" />
        {d.inCalendar}
      </small>
    );
  }
  return (
    <form action={syncBooking} className="a-cal" data-state="off">
      <CalendarX2 size={14} aria-hidden="true" />
      <small>{active ? d.notInCalendar : d.stillInCalendar}</small>
      <input type="hidden" name="id" value={b.id} />
      <input type="hidden" name="back" value={back} />
      <SubmitButton className="a-link-btn" pendingLabel="…">
        <RefreshCw size={13} aria-hidden="true" />
        {d.sync}
      </SubmitButton>
    </form>
  );
}

export function BookingCard({
  booking: b,
  lang,
  t: d,
  back,
  compact = false,
  calendar = false,
}: {
  booking: Booking;
  lang: AdminLang;
  t: AdminDict;
  back: string;
  compact?: boolean;
  /** True when Google Calendar is connected. */
  calendar?: boolean;
}) {
  const patientLang = b.locale === "en" ? "en" : "ar";
  const when = `${formatDay(b.date, patientLang)} ${formatTime(b.time, patientLang)}`;
  const message =
    b.status === "approved"
      ? adminDict[patientLang].waApproved(b.name, when)
      : b.status === "pending"
        ? adminDict[patientLang].waPending(b.name, when)
        : adminDict[patientLang].waRejected(b.name, when);
  const past = b.date < clinicNow().date;
  const requested = new Intl.DateTimeFormat(localeTag(lang), {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: clinicTimeZone,
  }).format(b.createdAt);

  return (
    <article className="a-booking" data-status={b.status} data-past={past || undefined}>
      <div className="a-booking-when">
        <strong>{formatDay(b.date, lang, { weekday: "short", day: "numeric", month: "short" })}</strong>
        <span>
          <bdi>{formatTime(b.time, lang)}</bdi> · <bdi>{b.duration}</bdi> {d.minutes}
        </span>
      </div>
      <div className="a-booking-who">
        <strong dir="auto">{b.name}</strong>
        <a href={`tel:${b.phone}`} dir="ltr">
          {b.phone}
        </a>
        {b.serviceLabel && <span className="a-muted">{b.serviceLabel}</span>}
        {b.note && !compact && <p className="a-note" dir="auto">{b.note}</p>}
      </div>
      <div className="a-booking-meta">
        <span className="a-status" data-status={b.status}>
          {d[b.status]}
        </span>
        {!compact && (
          <small className="a-muted">
            {b.source === "admin" ? d.fromAdmin : `${d.requested}: ${requested}`}
          </small>
        )}
        {calendar && <CalendarState booking={b} t={d} back={back} />}
      </div>
      <div className="a-booking-actions">
        {b.status === "pending" && (
          <>
            <StatusButton id={b.id} status="approved" back={back} className="a-btn a-btn-sm">
              <Check size={16} aria-hidden="true" />
              {d.approve}
            </StatusButton>
            <StatusButton id={b.id} status="rejected" back={back} className="a-btn a-btn-sm a-btn-ghost">
              <X size={16} aria-hidden="true" />
              {d.reject}
            </StatusButton>
          </>
        )}
        {b.status === "approved" && !past && (
          <form action={setBookingStatus}>
            <input type="hidden" name="id" value={b.id} />
            <input type="hidden" name="status" value="cancelled" />
            <input type="hidden" name="back" value={back} />
            <ConfirmButton message={d.confirmCancel} className="a-btn a-btn-sm a-btn-ghost">
              <X size={16} aria-hidden="true" />
              {d.cancelBooking}
            </ConfirmButton>
          </form>
        )}
        {(b.status === "rejected" || b.status === "cancelled") && !past && (
          <StatusButton id={b.id} status="pending" back={back} className="a-btn a-btn-sm a-btn-ghost">
            <Undo2 size={16} aria-hidden="true" />
            {d.restore}
          </StatusButton>
        )}
        <a
          className="a-btn a-btn-sm a-btn-wa"
          href={`https://wa.me/${whatsappDigits(b.phone)}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={16} aria-hidden="true" />
          {d.whatsapp}
        </a>
        {!compact && (
          <>
            <a className="a-btn a-btn-sm a-btn-ghost" href={`tel:${b.phone}`}>
              <Phone size={16} aria-hidden="true" />
              {d.call}
            </a>
            <form action={deleteBooking}>
              <input type="hidden" name="id" value={b.id} />
              <ConfirmButton message={d.confirmDelete} className="a-btn a-btn-sm a-btn-icon">
                <Trash2 size={16} aria-label={d.delete} />
              </ConfirmButton>
            </form>
          </>
        )}
      </div>
    </article>
  );
}
