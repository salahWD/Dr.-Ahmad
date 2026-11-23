import "server-only";
import { headers } from "next/headers";

const store = globalThis as unknown as {
  __rateBuckets?: Map<string, number[]>;
  __bookingLock?: Promise<unknown>;
};
const buckets = (store.__rateBuckets ??= new Map<string, number[]>());

/** Sliding-window limiter kept in memory. Returns false once `limit` hits happen within `windowMs`. */
export function allow(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    buckets.set(key, recent);
    return false;
  }
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 5000) {
    for (const [k, list] of buckets) {
      if (!list.some((t) => now - t < windowMs)) buckets.delete(k);
    }
  }
  return true;
}

export async function clientIp() {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "local"
  );
}

/** Runs booking writes one at a time, so two requests can't take the same time. */
export function withBookingLock<T>(task: () => Promise<T>): Promise<T> {
  const run = (store.__bookingLock ?? Promise.resolve()).then(task, task);
  store.__bookingLock = run.catch(() => undefined);
  return run;
}
