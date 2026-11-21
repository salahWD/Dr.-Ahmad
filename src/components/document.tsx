import "@fontsource-variable/dm-sans";
import "@fontsource-variable/noto-sans-arabic";
import "@/app/globals.css";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/content";

export function Document({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className="m-enter" data-type="service" data-radius="soft">
      <body>{children}</body>
    </html>
  );
}
