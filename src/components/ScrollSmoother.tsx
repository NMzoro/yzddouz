import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lightweight smooth-scroll + ScrollTrigger orchestration.
 * Uses GSAP's built-in smoothing via scrollerProxy on window.
 */
export function useScrollOrchestration() {
  useEffect(() => {
    // Soft parallax on any element marked data-parallax
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = Number(el.dataset.parallax ?? "0.1");
        gsap.to(el, {
          yPercent: -speed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Hero subtle scale-out
      gsap.to("[data-hero-fade]", {
        opacity: 0.2,
        scale: 0.95,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-hero-fade]",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);
}
