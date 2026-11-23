import "@fontsource-variable/dm-sans";
import "@fontsource-variable/noto-sans-arabic";
import "./admin.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getAdminLang } from "@/lib/admin-lang";

export const metadata: Metadata = {
  title: "Clinic dashboard",
  robots: { index: false, follow: false },
  icons: { icon: "/mark.svg" },
};

export default async function AdminRoot({ children }: { children: ReactNode }) {
  const lang = await getAdminLang();
  return (
    // Browser extensions add attributes to <html>/<body> before React loads.
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className="a-body" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
