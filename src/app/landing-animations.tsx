"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

type LandingAnimationsProps = {
  children: ReactNode;
};

export default function LandingAnimations({ children }: LandingAnimationsProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const scrollContainer = root.closest("main") ?? window;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const anchorCleanups: Array<() => void> = [];

    const context = gsap.context(() => {
      if (prefersReducedMotion) {
        return;
      }

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-hero-reveal]", {
          autoAlpha: 0,
          y: 24,
          duration: 0.8,
          stagger: 0.1,
        })
        .from(
          "[data-product-preview]",
          { autoAlpha: 0, y: 36, scale: 0.985, duration: 1 },
          "-=0.4",
        );

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          autoAlpha: 0,
          y: 28,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            scroller: scrollContainer,
            start: "top 86%",
            once: true,
          },
        });
      });

      ScrollTrigger.batch("[data-reveal-card]", {
        scroller: scrollContainer,
        start: "top 88%",
        once: true,
        onEnter: (elements) => {
          gsap.from(elements, {
            autoAlpha: 0,
            y: 22,
            duration: 0.65,
            stagger: 0.08,
            ease: "power3.out",
          });
        },
      });

      gsap.to("[data-product-preview]", {
        yPercent: -3,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-product-preview]",
          scroller: scrollContainer,
          start: "top 72%",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
        const handleClick = (event: MouseEvent) => {
          const hash = anchor.getAttribute("href");

          if (!hash || hash === "#") {
            return;
          }

          const target = root.querySelector<HTMLElement>(hash);

          if (!target) {
            return;
          }

          event.preventDefault();
          anchor.closest("details")?.removeAttribute("open");

          gsap.to(scrollContainer, {
            scrollTo: { y: target, offsetY: 72 },
            duration: 0.9,
            ease: "power3.inOut",
            overwrite: "auto",
            onComplete: () => window.history.replaceState(null, "", hash),
          });
        };

        anchor.addEventListener("click", handleClick);
        anchorCleanups.push(() => anchor.removeEventListener("click", handleClick));
      });
    }, root);

    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      anchorCleanups.forEach((cleanup) => cleanup());
      context.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-v2-neutral-100 text-v2-neutral-600 selection:bg-v2-neutral-600 selection:text-v2-neutral-100"
    >
      {children}
    </div>
  );
}
