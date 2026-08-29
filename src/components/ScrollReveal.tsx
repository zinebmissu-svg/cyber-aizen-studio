import { useEffect } from "react";

/**
 * Auto blur-in reveal for content as it scrolls into view.
 * Tags top-level content blocks inside each <section> and animates them once.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const revealVisible = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
          el.classList.add("reveal-in");
        }
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.classList.add("reveal-in");
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    const collect = () => {
      const sections = document.querySelectorAll<HTMLElement>("main section");
      sections.forEach((section) => {
        if (section.id === "home") return;
        const wrapper = section.querySelector<HTMLElement>(":scope > div") ?? section;
        const targets = Array.from(wrapper.children) as HTMLElement[];
        targets.forEach((el, i) => {
          if (el.dataset.reveal || el.classList.contains("animate-marquee-x")) return;
          el.dataset.reveal = "1";
          el.style.transitionDelay = `${Math.min(i, 6) * 90}ms`;
          el.classList.add("reveal");
          io.observe(el);
        });
      });
    };

    let collectTimer = 0;
    const scheduleCollect = () => {
      window.clearTimeout(collectTimer);
      collectTimer = window.setTimeout(() => {
        collect();
        revealVisible();
      }, 100);
    };

    scheduleCollect();
    const mo = new MutationObserver(scheduleCollect);
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", revealVisible, { passive: true });
    window.addEventListener("resize", revealVisible);

    return () => {
      window.clearTimeout(collectTimer);
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", revealVisible);
      window.removeEventListener("resize", revealVisible);
    };
  }, []);

  return null;
}
