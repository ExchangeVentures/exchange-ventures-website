import { useEffect, useRef } from "react";
import { reducedMotion } from "./Primitives.jsx";

/**
 * Ambient wave field behind the page. Monochrome, drawn from theme tokens,
 * fixed so it never repaints on scroll.
 *
 * The field reacts to the pointer: lines lift toward the cursor and brighten
 * within its radius, so the surface behaves like something under tension
 * rather than a looping texture.
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

    // Pointer lives in refs, never in state: state would re-render every move.
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, strength: 0, target: 0 };

    const readToken = () => {
      stroke = getComputedStyle(document.documentElement)
        .getPropertyValue("--mesh").trim() || "#8C8C8C";
    };
    readToken();

    function size() {
      W = window.innerWidth; H = window.innerHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      cv.style.width = `${W}px`; cv.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();

    const ROWS = 40, COLS = 66;
    const REACH = 300;          // pointer influence radius, px
    const LIFT = 46;            // how far the surface pulls toward the cursor

    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;

      // Ease the pointer so the surface trails the cursor instead of snapping.
      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;
      pointer.strength += (pointer.target - pointer.strength) * 0.06;

      // Spans the viewport now, weighted low so the headline still leads.
      const originX = W * 0.5, originY = H * 0.62;
      const spanX = W * 1.25, spanY = H * 1.15;

      for (let r = 0; r < ROWS; r++) {
        const v = r / (ROWS - 1);
        let nearest = Infinity;
        ctx.beginPath();
        for (let c = 0; c < COLS; c++) {
          const u = c / (COLS - 1);
          const wave =
            Math.sin(u * 5.2 + t * 0.00024 + v * 2.6) * 34 +
            Math.sin(u * 2.1 - t * 0.00016 + v * 4.4) * 22 +
            Math.cos(v * 3.3 + t * 0.00012) * 13;

          let x = originX - spanX / 2 + u * spanX;
          let y = originY - spanY / 2 + v * spanY + wave * (0.4 + v * 0.95);

          // Pointer pull: a smooth falloff, strongest at the cursor.
          const dx = x - pointer.x, dy = y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < REACH) {
            const f = (1 - d / REACH) ** 2 * pointer.strength;
            y -= f * LIFT;
            x += (dx / (d || 1)) * f * 12;
            if (d < nearest) nearest = d;
          }
          if (c === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        // Denser toward the bottom, and brighter wherever the cursor is close.
        const base = 0.08 + v * 0.24;                 // 20% below the previous 0.10 to 0.40
        const glow = nearest < REACH ? (1 - nearest / REACH) * 0.336 * pointer.strength : 0;
        ctx.strokeStyle = stroke;
        ctx.globalAlpha = Math.min(0.68, base + glow);
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

    const onMove = (e) => {
      pointer.tx = e.clientX; pointer.ty = e.clientY; pointer.target = 1;
      if (pointer.x < -9000) { pointer.x = e.clientX; pointer.y = e.clientY; }
    };
    const onLeave = () => { pointer.target = 0; };
    const onResize = () => { size(); if (reduce) draw(0); };

    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
      window.addEventListener("blur", onLeave);
    }
    window.addEventListener("resize", onResize);
    const mo = new MutationObserver(() => { readToken(); if (reduce) draw(0); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onTheme = () => { readToken(); if (reduce) draw(0); };
    mq.addEventListener?.("change", onTheme);

    if (reduce) draw(0); else raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("resize", onResize);
      mo.disconnect();
      mq.removeEventListener?.("change", onTheme);
    };
  }, []);

  return <canvas className="mesh" ref={ref} aria-hidden="true" />;
}
