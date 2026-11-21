"use client";

import { useRef, useSyncExternalStore, type ReactNode } from "react";
import { Menu } from "lucide-react";
import type { Locale } from "@/lib/content";

function subscribeToHash(update: () => void) {
  window.addEventListener("hashchange", update);
  return () => window.removeEventListener("hashchange", update);
}

function subscribeToScroll(update: () => void) {
  window.addEventListener("scroll", update, { passive: true });
  return () => window.removeEventListener("scroll", update);
}

export function FixedHeader({ children }: { children: ReactNode }) {
  const compact = useSyncExternalStore(subscribeToScroll, () => window.scrollY > 32, () => false);
  return <header className="site-header" data-compact={compact}>{children}</header>;
}

export function LanguageLink({
  locale,
  base,
}: {
  locale: Locale;
  base: string;
}) {
  const hash = useSyncExternalStore(
    subscribeToHash,
    () => window.location.hash,
    () => "",
  );
  return (
    <a className="language" hrefLang={locale} lang={locale} href={base + hash}>
      {locale === "ar" ? "العربية" : "English"}
    </a>
  );
}

export function MobileMenu({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const menu = useRef<HTMLDetailsElement>(null);
  return (
    <details className="mobile-menu" ref={menu}>
      <summary aria-label={label}>
        <Menu size={23} />
      </summary>
      <nav
        aria-label={label}
        onClick={(event) => {
          if (
            event.target instanceof Element &&
            event.target.closest("a") &&
            menu.current
          ) {
            menu.current.open = false;
          }
        }}
      >
        {children}
      </nav>
    </details>
  );
}
