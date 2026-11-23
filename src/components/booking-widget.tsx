"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import {
  requestBooking,
  type BookingError,
  type BookingState,
} from "@/lib/booking-actions";
import type { PublicDay } from "@/lib/data";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

export type BookingCopy = {
  chooseDay: string;
  chooseTime: string;
  yourDetails: string;
  stepDay: string;
  stepTime: string;
  stepDetails: string;
  earlier: string;
  later: string;
  dayClosed: string;
  dayFull: string;
  noSlots: string;
  noDays: string;
  bookingPaused: string;
  fieldName: string;
  fieldPhone: string;
  fieldService: string;
  anyService: string;
  fieldNote: string;
  change: string;
  privacy: string;
  submit: string;
  sending: string;
  successTitle: string;
  successText: string;
  another: string;
  chat: string;
  errors: Record<BookingError, string>;
};

type Props = {
  locale: "ar" | "en";
  days: PublicDay[];
  enabled: boolean;
  services: { id: number; title: string }[];
  copy: BookingCopy;
  whatsappHref: string;
};

const initial: BookingState = { status: "idle" };

export function BookingWidget({ locale, days, enabled, services, copy, whatsappHref }: Props) {
  const router = useRouter();
  const scope = useRef<HTMLFormElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const [state, dispatch, pending] = useActionState(requestBooking, initial);
  const [pickedDate, setPickedDate] = useState<string | null>(null);
  const [pickedTime, setPickedTime] = useState<string | null>(null);
  const [successFor, setSuccessFor] = useState<{ day: string; time: string } | null>(null);
  const submitted = useRef<{ day: string; time: string } | null>(null);

  // Derive the active selection from fresh props so a refreshed list never shows a stale time.
  const bookable = days.filter((d) => !d.closed && d.slots.length);
  const activeDay = days.find((d) => d.date === pickedDate && !d.closed && d.slots.length) ?? bookable[0];
  const activeSlot = activeDay?.slots.find((s) => s.time === pickedTime) ?? null;
  const error = state.status === "error" ? state.code : null;

  // React to each finished request: confirm it, or drop a time someone else just took.
  useEffect(() => {
    if (state.status === "idle") return;
    if (state.status === "success") {
      setSuccessFor(submitted.current ?? { day: state.date, time: state.time });
      setPickedTime(null);
      router.refresh();
    } else if (state.code === "slot_taken") {
      setPickedTime(null);
      router.refresh();
    }
  }, [state, router]);

  const { contextSafe } = useGSAP({ scope });

  // Times fall into place whenever another day is chosen.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".slot", { autoAlpha: 0, y: 10, duration: 0.45, stagger: 0.03, clearProps: "all" });
    },
    { scope, dependencies: [activeDay?.date], revertOnUpdate: true },
  );

  // The details step opens after a time is picked.
  useGSAP(
    () => {
      if (!activeSlot) return;
      const details = scope.current?.querySelector(".booking-details");
      details?.scrollIntoView({ block: "nearest", behavior: prefersReducedMotion() ? "auto" : "smooth" });
      if (prefersReducedMotion()) return;
      gsap.from(".booking-details > *", { autoAlpha: 0, y: 14, duration: 0.5, stagger: 0.05, clearProps: "all" });
    },
    { scope, dependencies: [Boolean(activeSlot)] },
  );

  // A drawn check confirms the request.
  useGSAP(
    () => {
      if (!successFor || prefersReducedMotion()) return;
      gsap
        .timeline()
        .from(".success-mark circle", { drawSVG: 0, duration: 0.8, ease: "power2.inOut" })
        .from(".success-mark path", { drawSVG: 0, duration: 0.45, ease: "power2.out" }, "-=0.25")
        .from(".booking-success > :not(.success-mark)", { autoAlpha: 0, y: 14, stagger: 0.08, duration: 0.55 }, "-=0.2");
    },
    { scope, dependencies: [successFor] },
  );

  useGSAP(
    () => {
      if (!error || prefersReducedMotion()) return;
      gsap.from(".form-error", { autoAlpha: 0, y: -6, duration: 0.35 });
    },
    { scope, dependencies: [state] },
  );

  const scrollDays = contextSafe((direction: 1 | -1) => {
    const node = strip.current;
    if (!node) return;
    const rtl = getComputedStyle(node).direction === "rtl";
    node.scrollBy({
      left: direction * (rtl ? -1 : 1) * node.clientWidth * 0.8,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  });

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeDay || !activeSlot) return;
    submitted.current = { day: activeDay.label, time: activeSlot.label };
    const data = new FormData(event.currentTarget);
    // Dispatching by hand (not via the form's action prop) keeps typed details if the request fails.
    startTransition(() => dispatch(data));
  };

  if (!enabled || !bookable.length) {
    return (
      <div className="booking-widget booking-empty">
        <Clock size={28} strokeWidth={1.5} aria-hidden="true" />
        <p>{enabled ? copy.noDays : copy.bookingPaused}</p>
        <a className="button" href={whatsappHref}>
          {copy.chat}
        </a>
      </div>
    );
  }

  const Prev = locale === "ar" ? ChevronRight : ChevronLeft;
  const Next = locale === "ar" ? ChevronLeft : ChevronRight;
  const step = successFor ? 3 : activeSlot ? 3 : 2;

  return (
    <form ref={scope} className="booking-widget" onSubmit={submit} aria-busy={pending}>
      {successFor ? (
        <div className="booking-success" role="status">
          <svg className="success-mark" viewBox="0 0 52 52" width="64" height="64" aria-hidden="true">
            <circle cx="26" cy="26" r="23" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path d="M15 27.5l7 7 15-16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3>{copy.successTitle}</h3>
          <p className="booking-summary">
            <CalendarCheck size={18} aria-hidden="true" />
            {successFor.day} · <bdi>{successFor.time}</bdi>
          </p>
          <p>{copy.successText}</p>
          <div className="booking-success-actions">
            <button type="button" className="button button-quiet" onClick={() => setSuccessFor(null)}>
              {copy.another}
            </button>
            <a className="page-link" href={whatsappHref}>
              {copy.chat}
            </a>
          </div>
        </div>
      ) : (
        <>
          <ol className="booking-steps" aria-hidden="true">
            {[copy.stepDay, copy.stepTime, copy.stepDetails].map((label, i) => (
              <li key={label} data-state={i + 1 < step ? "done" : i + 1 === step ? "current" : "next"}>
                <span>{i + 1}</span>
                {label}
              </li>
            ))}
          </ol>

          <fieldset className="booking-days">
            <legend>{copy.chooseDay}</legend>
            <div className="day-strip-wrap">
              <button type="button" className="strip-arrow" aria-label={copy.earlier} onClick={() => scrollDays(-1)}>
                <Prev size={18} aria-hidden="true" />
              </button>
              <div className="day-strip" ref={strip}>
                {days.map((d) => {
                  const disabled = d.closed || !d.slots.length;
                  return (
                    <label key={d.date} className="day" data-disabled={disabled || undefined}>
                      <input
                        type="radio"
                        name="date"
                        value={d.date}
                        className="sr-only"
                        disabled={disabled}
                        checked={activeDay?.date === d.date}
                        onChange={(event) => {
                          setPickedDate(d.date);
                          setPickedTime(null);
                          event.currentTarget.closest("label")?.scrollIntoView({ block: "nearest", inline: "nearest" });
                        }}
                      />
                      <span className="day-weekday">{d.weekday}</span>
                      <span className="day-num">{d.day}</span>
                      <span className="day-month">{disabled ? (d.closed ? copy.dayClosed : copy.dayFull) : d.month}</span>
                    </label>
                  );
                })}
              </div>
              <button type="button" className="strip-arrow" aria-label={copy.later} onClick={() => scrollDays(1)}>
                <Next size={18} aria-hidden="true" />
              </button>
            </div>
          </fieldset>

          <fieldset className="booking-times">
            <legend>
              {copy.chooseTime}
              {activeDay && <span> · {activeDay.label}</span>}
            </legend>
            {activeDay?.slots.length ? (
              <div className="slot-grid">
                {activeDay.slots.map((s) => (
                  <label key={s.time} className="slot">
                    <input
                      type="radio"
                      name="time"
                      value={s.time}
                      className="sr-only"
                      checked={activeSlot?.time === s.time}
                      onChange={() => setPickedTime(s.time)}
                    />
                    <bdi>{s.label}</bdi>
                  </label>
                ))}
              </div>
            ) : (
              <p className="booking-hint">{copy.noSlots}</p>
            )}
          </fieldset>

          <fieldset className="booking-details" hidden={!activeSlot}>
            <legend>{copy.yourDetails}</legend>
            {activeDay && activeSlot && (
              <p className="booking-summary">
                <CalendarCheck size={18} aria-hidden="true" />
                <span>
                  {activeDay.label} · <bdi>{activeSlot.label}</bdi>
                </span>
                <button type="button" className="text-button" onClick={() => setPickedTime(null)}>
                  {copy.change}
                </button>
              </p>
            )}
            <div className="field-row">
              <label className="field">
                <span>{copy.fieldName}</span>
                <input name="name" autoComplete="name" required minLength={2} maxLength={80} />
              </label>
              <label className="field">
                <span>{copy.fieldPhone}</span>
                <input name="phone" type="tel" inputMode="tel" autoComplete="tel" required dir="ltr" maxLength={24} />
              </label>
            </div>
            {services.length > 0 && (
              <label className="field">
                <span>{copy.fieldService}</span>
                <select name="service" defaultValue="">
                  <option value="">{copy.anyService}</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label className="field">
              <span>{copy.fieldNote}</span>
              <textarea name="note" rows={3} maxLength={600} />
            </label>
            <div className="hp" aria-hidden="true">
              <label>
                Company
                <input name="company" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <input type="hidden" name="locale" value={locale} />
            {error && (
              <p className="form-error" role="alert">
                {copy.errors[error]}
              </p>
            )}
            <div className="booking-submit">
              <button className="button" type="submit" disabled={pending || !activeSlot}>
                {pending ? copy.sending : copy.submit}
              </button>
              <small>{copy.privacy}</small>
            </div>
          </fieldset>
        </>
      )}
    </form>
  );
}
