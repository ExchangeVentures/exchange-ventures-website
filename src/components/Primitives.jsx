import { useEffect, useRef } from "react";

export const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Nested bezel. Outer shell, inner core, concentric radii. */
export function Shell({ children, className = "", style }) {
  return (
    <div className={`shell ${className}`} style={style}>
      <div className="core">{children}</div>
    </div>
  );
}

/** Pill CTA with the trailing icon nested in its own circle. */
export function Btn({ href, children, variant, size, icon = "↗" }) {
  return (
    <a className={`btn ${variant === "ghost" ? "ghost " : ""}${size === "sm" ? "sm" : ""}`} href={href}>
      <span>{children}</span>
      <span className="ic" aria-hidden="true">{icon}</span>
    </a>
  );
}

/** Blur-up entry on scroll. Collapses to static under reduced motion. */
export function Reveal({ children, delay = 0, className = "", style }) {
  const ref = useRef(null);
  const reduce = reducedMotion();
  useEffect(() => {
    if (reduce || !ref.current) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }),
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [reduce]);
  return (
    <div ref={ref} className={`rv ${reduce ? "in " : ""}${className}`}
         style={{ transitionDelay: `${delay}ms`, ...(style || {}) }}>
      {children}
    </div>
  );
}
