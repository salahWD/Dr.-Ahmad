"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { FormState } from "@/lib/admin-actions";
import { ActionForm, SubmitButton } from "./forms";

type Range = { start: string; end: string };

/** Lebanon's working week starts on Monday; Sunday is listed last. */
const order = [1, 2, 3, 4, 5, 6, 0];

export function HoursEditor({
  action,
  initial,
  text,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initial: { weekday: number; start: string; end: string }[];
  text: {
    weekdays: readonly string[];
    open: string;
    closed: string;
    addRange: string;
    remove: string;
    from: string;
    to: string;
    save: string;
    saving: string;
  };
}) {
  const [week, setWeek] = useState<Record<number, Range[]>>(() => {
    const map: Record<number, Range[]> = {};
    for (const d of order) map[d] = [];
    for (const r of [...initial].sort((a, b) => a.start.localeCompare(b.start))) {
      map[r.weekday].push({ start: r.start, end: r.end });
    }
    return map;
  });

  const update = (day: number, next: Range[]) => setWeek((w) => ({ ...w, [day]: next }));

  return (
    <ActionForm action={action} className="a-hours">
      {order.map((day) => {
        const ranges = week[day];
        const open = ranges.length > 0;
        return (
          <div key={day} className="a-day" data-open={open || undefined}>
            <label className="a-switch">
              <input
                type="checkbox"
                checked={open}
                onChange={(e) => update(day, e.target.checked ? [{ start: "09:00", end: "13:00" }] : [])}
              />
              <span className="a-day-name">{text.weekdays[day]}</span>
              <span className="a-day-state">{open ? text.open : text.closed}</span>
            </label>
            <div className="a-ranges">
              {ranges.map((r, i) => (
                <div key={i} className="a-range">
                  <input type="hidden" name="hours" value={`${day}|${r.start}|${r.end}`} />
                  <label>
                    <span className="sr-only">{text.from}</span>
                    <input
                      type="time"
                      step={900}
                      value={r.start}
                      required
                      onChange={(e) => update(day, ranges.map((x, j) => (j === i ? { ...x, start: e.target.value } : x)))}
                    />
                  </label>
                  <span aria-hidden="true">–</span>
                  <label>
                    <span className="sr-only">{text.to}</span>
                    <input
                      type="time"
                      step={900}
                      value={r.end}
                      required
                      onChange={(e) => update(day, ranges.map((x, j) => (j === i ? { ...x, end: e.target.value } : x)))}
                    />
                  </label>
                  <button
                    type="button"
                    className="a-icon-btn"
                    aria-label={text.remove}
                    title={text.remove}
                    onClick={() => update(day, ranges.filter((_, j) => j !== i))}
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                </div>
              ))}
              {open && (
                <button
                  type="button"
                  className="a-link-btn"
                  onClick={() => {
                    const last = ranges.at(-1);
                    update(day, [...ranges, last ? { start: last.end, end: last.end } : { start: "15:00", end: "18:00" }]);
                  }}
                >
                  <Plus size={15} aria-hidden="true" />
                  {text.addRange}
                </button>
              )}
            </div>
          </div>
        );
      })}
      <div className="a-actions">
        <SubmitButton pendingLabel={text.saving}>{text.save}</SubmitButton>
      </div>
    </ActionForm>
  );
}
