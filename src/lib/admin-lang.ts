import "server-only";
import { cookies } from "next/headers";
import { adminDict, type AdminLang } from "./admin-i18n";

export const ADMIN_LANG_COOKIE = "admin_lang";

export async function getAdminLang(): Promise<AdminLang> {
  return (await cookies()).get(ADMIN_LANG_COOKIE)?.value === "en" ? "en" : "ar";
}

export async function getAdminDict() {
  const lang = await getAdminLang();
  return { lang, t: adminDict[lang] };
}
