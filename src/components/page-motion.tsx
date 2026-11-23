"use client";

import { useRef, type ReactNode } from "react";
import { gsap, motionOK, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Wraps <main> and runs the landing page's GSAP choreography:
 * the hero entrance, scroll reveals, the photo reveal and the counters.
 * Under prefers-reduced-motion nothing moves and everything is shown at rest.
 */
export function MotionMain({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const rtl = document.documentElement.dir === "rtl";
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(motionOK, () => {
        // 1. Hero entrance, once on load: the arch and portrait settle, then the name, then what to do.
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(q(".hero-arch"), { autoAlpha: 0, scale: 0.94, transformOrigin: "50% 100%", duration: 1.3 }, 0)
          .fromTo(
            q(".portrait-window"),
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.15, ease: "power4.out", clearProps: "clipPath" },
            0.1,
          )
          .from(q(".portrait-window .photo"), { scale: 1.14, duration: 1.7, ease: "power2.out" }, 0.1)
          .from(q(".specialty"), { autoAlpha: 0, x: rtl ? 18 : -18, duration: 0.6 }, 0.2)
          .from(
            q(".specialty span"),
            { scaleX: 0, transformOrigin: rtl ? "100% 50%" : "0% 50%", duration: 0.7 },
            0.25,
          )
          .from(q(".hero h1 > span"), { autoAlpha: 0, yPercent: 35, stagger: 0.12, duration: 0.95 }, 0.3)
          .from(q(".hero-copy [data-hero-tail]"), { autoAlpha: 0, y: 18, stagger: 0.1, duration: 0.7 }, 0.7);

        // 2. Section content rises into place as it enters the viewport.
        const revealed = new WeakSet<Element>();
        const reveal = (batch: Element[]) => {
          const fresh = batch.filter((node) => !revealed.has(node));
          if (!fresh.length) return;
          fresh.forEach((node) => revealed.add(node));
          // Content already scrolled past (e.g. the page opened at #booking) appears at once;
          // only what is on screen animates, with the stagger capped to keep it brief.
          const passed = fresh.filter((node) => node.getBoundingClientRect().bottom < 0);
          const visible = fresh.filter((node) => !passed.includes(node));
          if (passed.length) gsap.set(passed, { autoAlpha: 1, y: 0, clearProps: "transform,opacity,visibility" });
          if (!visible.length) return;
          const each = Math.min(0.09, 0.6 / visible.length);
          gsap.to(visible, {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            stagger: each,
            overwrite: true,
            clearProps: "transform,opacity,visibility",
          });
          const photos = visible.flatMap((node) => [...node.querySelectorAll(".card-image .photo")]);
          if (photos.length) {
            gsap.from(photos, { scale: 1.08, duration: 1.3, stagger: each, ease: "power2.out", clearProps: "transform" });
          }
        };
        const items = q("[data-reveal]");
        gsap.set(items, { autoAlpha: 0, y: 28 });
        ScrollTrigger.batch(items, {
          start: "top 90%",
          onEnter: reveal,
          onEnterBack: reveal,
          onLeave: reveal,
        });

        // 3. The profile photograph is uncovered from its leading edge.
        const aboutPhoto = q(".about-photo")[0];
        if (aboutPhoto) {
          gsap.fromTo(
            aboutPhoto,
            { clipPath: rtl ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.25,
              ease: "power4.inOut",
              clearProps: "clipPath",
              scrollTrigger: { trigger: aboutPhoto, start: "top 82%" },
            },
          );
        }

        // 4. The practice figures count up once.
        const counters = q<HTMLElement>("[data-count]");
        counters.forEach((node) => {
          const target = Number(node.dataset.count);
          const prefix = node.dataset.prefix ?? "";
          const state = { value: 0 };
          node.textContent = `${prefix}0`;
          gsap.to(state, {
            value: target,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
              node.textContent = `${prefix}${Math.round(state.value)}`;
            },
            scrollTrigger: { trigger: node, start: "top 92%" },
          });
        });

        // New triggers measure themselves but only fire callbacks on the next full refresh
        // or scroll. Refresh now, so a page opened at #booking reveals what is already in view.
        ScrollTrigger.refresh();

        // Expanding a question, a case or a linked panel moves everything below it, so
        // positions are measured again — but only once scrolling has settled. A refresh
        // restores the scroll position it recorded, so running it while the browser
        // smooth-scrolls to an in-page link (#articles) would stop the page mid-way.
        let pending = false;
        const settled = gsap
          .delayedCall(0.2, () => {
            pending = false;
            ScrollTrigger.refresh();
          })
          .pause();
        const refreshWhenSettled = () => {
          pending = true;
          settled.restart(true);
        };
        const onScroll = () => {
          if (pending) settled.restart(true);
        };
        el.addEventListener("toggle", refreshWhenSettled, true);
        window.addEventListener("hashchange", refreshWhenSettled);
        window.addEventListener("scroll", onScroll, { passive: true });
        document.fonts?.ready.then(refreshWhenSettled);

        return () => {
          el.removeEventListener("toggle", refreshWhenSettled, true);
          window.removeEventListener("hashchange", refreshWhenSettled);
          window.removeEventListener("scroll", onScroll);
          counters.forEach((node) => {
            node.textContent = `${node.dataset.prefix ?? ""}${node.dataset.count}`;
          });
        };
      });

      // Gentle depth on large screens only: photographs drift slower than the page.
      mm.add(`${motionOK} and (min-width: 768px)`, () => {
        const hero = q(".hero")[0];
        if (hero) {
          gsap.to(q(".portrait-window .photo"), {
            yPercent: 7,
            ease: "none",
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
          });
        }
        const about = q(".about-photo")[0];
        if (about) {
          gsap.fromTo(
            q(".about-photo .photo"),
            { yPercent: -5, scale: 1.12 },
            {
              yPercent: 5,
              scale: 1.12,
              ease: "none",
              scrollTrigger: { trigger: about, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }
      });

      // The CSS that hides animated parts before hydration can step aside now.
      document.documentElement.classList.add("motion-ready");
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <main id="main" ref={root}>
      {children}
    </main>
  );
}
