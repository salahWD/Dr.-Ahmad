import "@fontsource-variable/dm-sans";
import "@fontsource-variable/noto-sans-arabic";
import "@/app/globals.css";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/content";

/**
 * Marks <html> with "js" before the first paint, so CSS can keep animated
 * parts hidden until the GSAP layer takes over (no flash before hydration).
 * The type swap keeps React from warning about a rendered <script> on the client.
 */
function MotionFlag() {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
    />
  );
}

export function Document({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="m-enter"
      data-type="service"
      data-radius="soft"
      suppressHydrationWarning
    >
      <head>
        <MotionFlag />
      </head>
      {/* Browser extensions (Grammarly, password managers) add attributes to
          <body> before React loads; this silences only that element's check. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
