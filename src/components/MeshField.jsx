import { useEffect, useRef } from "react";
import { reducedMotion } from "./Primitives.jsx";

/**
 * Ambient wave field behind the page. Monochrome, drawn from theme tokens,
 * and fixed so it never repaints on scroll.
 *
 * Taken from the AURA case study's flowing mesh, with the colour dropped:
 * the brand carries no hue, so depth comes from line density and opacity.
 */
export default function MeshField() {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const reduce = reducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    let raf = 0, W = 0, H = 0, stroke = "#888";

    const readToken = () => {
      stroke = getComputedStyle(document.documentElement).getPropertyValue("--ink-4").trim() || "#888";
    };
    readToken();

    function size() {
      W = window.innerWidth; H = window.innerHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      cv.style.width = `${W}px`; cv.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();

    const ROWS = 34, COLS = 58;

    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;

      // The field sits in the lower right, so it never fights the headline.
      const originX = W * 0.52, originY = H * 0.58;
      const spanX = W * 0.78, spanY = H * 0.74;

      for (let r = 0; r < ROWS; r++) {
        const v = r / (ROWS - 1);
        ctx.beginPath();
        for (let c = 0; c < COLS; c++) {
          const u = c / (COLS - 1);
          const wave =
            Math.sin(u * 5.2 + t * 0.00022 + v * 2.6) * 26 +
            Math.sin(u * 2.1 - t * 0.00015 + v * 4.4) * 16 +
            Math.cos(v * 3.3 + t * 0.00011) * 10;
          const x = originX - spanX / 2 + u * spanX;
          const y = originY - spanY / 2 + v * spanY + wave * (0.35 + v * 0.9);
          if (c === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        // Denser toward the bottom, so it reads as a surface rather than a grid.
        ctx.globalAlpha = 0.05 + v * 0.16;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    let last = 0;
    function frame(now) {
      // 30fps is plenty for an ambient field and halves the paint cost.
      if (now - last > 33) { draw(now); last = now; }
      raf = requestAnimationFrame(frame);
    }

    const onResize = () => { size(); if (reduce) draw(0); };
    window.addEventListener("resize", onResize);
    const mo = new MutationObserver(() => { readToken(); if (reduce) draw(0); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onTheme = () => { readToken(); if (reduce) draw(0); };
    mq.addEventListener?.("change", onTheme);

    if (reduce) draw(0); else raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      mo.disconnect();
      mq.removeEventListener?.("change", onTheme);
    };
  }, []);

  return <canvas className="mesh" ref={ref} aria-hidden="true" />;
}
