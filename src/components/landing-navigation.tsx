"use client";

import { useRef, useSyncExternalStore, type ReactNode } from "react";
import { Menu } from "lucide-react";
import type { Locale } from "@/lib/content";
import { gsap, motionOK, useGSAP } from "@/lib/gsap";

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
  const header = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(motionOK, () => {
        gsap.fromTo(
          ".scroll-progress",
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.35 } },
        );
      });
      return () => mm.revert();
    },
    { scope: header },
  );
  return (
    <header className="site-header" data-compact={compact} ref={header}>
      {children}
      <span className="scroll-progress" aria-hidden="true" />
    </header>
  );
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
