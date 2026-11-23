import type { ReactNode } from "react";
import { and, count, eq, gte } from "drizzle-orm";
import { ExternalLink, Languages, LogOut } from "lucide-react";
import { getDb } from "@/db";
import * as t from "@/db/schema";
import { AdminNav } from "@/components/admin/nav";
import { logout, setAdminLang } from "@/lib/admin-actions";
import { getAdminDict } from "@/lib/admin-lang";
import { requireAdmin } from "@/lib/auth";
import { clinicNow } from "@/lib/schedule";

export default async function PanelLayout({ children }: { children: ReactNode }) {
  await requireAdmin();
  const { lang, t: d } = await getAdminDict();
  const db = await getDb();
  const [pending] = await db
    .select({ n: count() })
    .from(t.bookings)
    .where(and(eq(t.bookings.status, "pending"), gte(t.bookings.date, clinicNow().date)));

  return (
    <div className="a-shell">
      <aside className="a-side">
        <a className="a-brand" href="/admin/">
          <img src="/mark.svg" width={36} height={36} alt="" />
          <span>{d.panel}</span>
        </a>
        <AdminNav
          items={[
            { href: "/admin/", label: d.overview, icon: "overview" },
            { href: "/admin/bookings/", label: d.bookings, icon: "bookings", badge: pending?.n ?? 0 },
            { href: "/admin/availability/", label: d.availability, icon: "availability" },
            { href: "/admin/articles/", label: d.articles, icon: "articles" },
            { href: "/admin/services/", label: d.services, icon: "services" },
            { href: "/admin/testimonials/", label: d.testimonials, icon: "testimonials" },
            { href: "/admin/cases/", label: d.cases, icon: "cases" },
          ]}
        />
        <div className="a-side-foot">
          <a href={lang === "ar" ? "/" : "/en/"} target="_blank" rel="noreferrer">
            <ExternalLink size={16} aria-hidden="true" />
            <span className="a-foot-label">{d.viewSite}</span>
          </a>
          <form action={setAdminLang}>
            <input type="hidden" name="lang" value={lang === "ar" ? "en" : "ar"} />
            <button type="submit" lang={lang === "ar" ? "en" : "ar"}>
              <Languages size={16} aria-hidden="true" />
              <span className="a-foot-label">{d.switchLang}</span>
            </button>
          </form>
          <form action={logout}>
            <button type="submit">
              <LogOut size={16} aria-hidden="true" />
              <span className="a-foot-label">{d.logout}</span>
            </button>
          </form>
        </div>
      </aside>
      <main className="a-main">{children}</main>
    </div>
  );
}
