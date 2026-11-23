import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "clinic_admin";
const SESSION_DAYS = 7;

const signingKey = () =>
  process.env.SESSION_SECRET?.trim() || process.env.ADMIN_PASSWORD || "";

const sign = (payload: string, key: string) =>
  createHmac("sha256", key).update(payload).digest("base64url");

const sameText = (a: string, b: string) => {
  const x = createHash("sha256").update(a).digest();
  const y = createHash("sha256").update(b).digest();
  return timingSafeEqual(x, y);
};

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

export function passwordMatches(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && sameText(input, expected as string);
}

function verify(token: string) {
  const key = signingKey();
  const [version, exp, signature] = token.split(".");
  if (!key || version !== "v1" || !exp || !signature) return false;
  if (!(Number(exp) > Date.now())) return false;
  return sameText(signature, sign(`${version}.${exp}`, key));
}

/** True when the request carries a valid admin session. */
export async function isAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? verify(token) : false;
}

/** Call at the top of every admin page and admin Server Function. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login/");
}

export async function startSession() {
  const payload = `v1.${Date.now() + SESSION_DAYS * 86_400_000}`;
  (await cookies()).set(SESSION_COOKIE, `${payload}.${sign(payload, signingKey())}`, {
    httpOnly: true,
    sameSite: "lax",
    secure:
      process.env.NODE_ENV === "production" &&
      process.env.ADMIN_COOKIE_INSECURE !== "true",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}
