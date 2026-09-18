import { useEffect, useRef, useState } from "react";
import { Shell, reducedMotion } from "./Primitives.jsx";
import { RESOLVE_GROUPS } from "../lib/registry.js";

/**
 * The company thesis as motion. Inconsistent field entries for one facility
 * drift, converge, and resolve into the single Petrinex code they all meant.
 * Brackets are measured off the rendered text so they always enclose it.
 */
export default function HeroCanvas() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [label, setLabel] = useState(RESOLVE_GROUPS[0].name);

  useEffect(() => {
    const cv = canvasRef.current, wrap = wrapRef.current;
    if (!cv || !wrap) return;
    const ctx = cv.getContext("2d");
    const reduce = reducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0, W = 0, H = 0, ink, inkMid, inkFaint;

    const token = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
    const readTokens = () => { ink = token("--ink"); inkMid = token("--ink-2"); inkFaint = token("--ink-4"); };
    readTokens();

    function size() {
      const w = wrap.clientWidth;
      const ht = Math.max(320, Math.min(470, Math.round(w * 0.76)));
      W = w; H = ht;
      cv.width = Math.round(w * dpr); cv.height = Math.round(ht * dpr);
      cv.style.height = `${ht}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();

    let gi = 0, parts = [], phase = "scatter", t0 = performance.now();
    const DUR = { scatter: 2400, converge: 1150, resolve: 2100 };

    function build() {
      const g = RESOLVE_GROUPS[gi];
      parts = g.messy.map((txt, i) => {
        const a = (i / g.messy.length) * Math.PI * 2 + gi * 0.8;
        const r = Math.min(W, H) * (0.23 + 0.14 * ((i % 3) / 2));
        return {
          txt, bx: W / 2 + Math.cos(a) * r * 1.4, by: H / 2 + Math.sin(a) * r,
          x: 0, y: 0, ph: Math.random() * 6.28, sp: 0.5 + Math.random() * 0.7,
          amp: 3 + Math.random() * 5, alpha: 0,
        };
      });
      setLabel(g.name);
    }
    build();

    const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

    function drawGrid() {
      ctx.strokeStyle = inkFaint; ctx.globalAlpha = 0.13; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, Math.round(H / 2) + 0.5); ctx.lineTo(W, Math.round(H / 2) + 0.5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(Math.round(W / 2) + 0.5, 0); ctx.lineTo(Math.round(W / 2) + 0.5, H); ctx.stroke();
      ctx.globalAlpha = 1;
    }
    function drawMessy() {
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = '400 13px "JetBrains Mono", ui-monospace, monospace';
      parts.forEach((p) => {
        ctx.globalAlpha = Math.max(0, p.alpha); ctx.fillStyle = inkMid;
        ctx.fillText(p.txt, p.x, p.y);
      });
      ctx.globalAlpha = 1;
    }
    function drawCode(inP, outP) {
      const g = RESOLVE_GROUPS[gi];
      const a = inP * outP;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      const fs = Math.max(24, Math.min(44, W * 0.078));
      const cy = H / 2 - 8 + (1 - inP) * 10;

      ctx.globalAlpha = a; ctx.fillStyle = ink;
      ctx.font = `600 ${fs}px "JetBrains Mono", ui-monospace, monospace`;
      ctx.fillText(g.code, W / 2, cy);

      ctx.globalAlpha = a * 0.7; ctx.fillStyle = inkMid;
      ctx.font = '400 11.5px "JetBrains Mono", ui-monospace, monospace';
      ctx.fillText(g.name, W / 2, H / 2 + fs * 0.76);

      // Measured off the code so the brackets always enclose it.
      ctx.font = `600 ${fs}px "JetBrains Mono", ui-monospace, monospace`;
      const tw = ctx.measureText(g.code).width;
      const padX = Math.max(14, fs * 0.42), armX = Math.max(7, fs * 0.22);
      const bw = tw + padX * 2, bh = fs * 1.5;
      ctx.globalAlpha = a * 0.42; ctx.strokeStyle = ink; ctx.lineWidth = 1;
      [-1, 1].forEach((sd) => {
        const x = Math.round(W / 2 + (sd * bw) / 2) + 0.5;
        ctx.beginPath();
        ctx.moveTo(x - sd * armX, cy - bh / 2); ctx.lineTo(x, cy - bh / 2);
        ctx.lineTo(x, cy + bh / 2);             ctx.lineTo(x - sd * armX, cy + bh / 2);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
    }

    function frame(now) {
      const el = now - t0;
      ctx.clearRect(0, 0, W, H); drawGrid();
      if (phase === "scatter") {
        const p1 = Math.min(1, el / DUR.scatter);
        parts.forEach((p, i) => {
          p.alpha = Math.min(1, Math.max(0, (p1 * parts.length - i) * 1.7)) * 0.95;
          p.x = p.bx + Math.sin((now / 900) * p.sp + p.ph) * p.amp;
          p.y = p.by + Math.cos((now / 1100) * p.sp + p.ph) * p.amp;
        });
        drawMessy();
        if (el > DUR.scatter) { phase = "converge"; t0 = now; }
      } else if (phase === "converge") {
        const p2 = ease(Math.min(1, el / DUR.converge));
        parts.forEach((p) => {
          p.x = p.bx + (W / 2 - p.bx) * p2;
          p.y = p.by + (H / 2 - p.by) * p2;
          p.alpha = 0.95 * (1 - p2);
        });
        drawMessy();
        if (el > DUR.converge) { phase = "resolve"; t0 = now; }
      } else {
        const inP = ease(Math.min(1, el / 480));
        const outP = el > DUR.resolve - 440 ? 1 - Math.min(1, (el - (DUR.resolve - 440)) / 440) : 1;
        drawCode(inP, outP);
        if (el > DUR.resolve) { gi = (gi + 1) % RESOLVE_GROUPS.length; build(); phase = "scatter"; t0 = now; }
      }
      raf = requestAnimationFrame(frame);
    }
    const still = () => { ctx.clearRect(0, 0, W, H); drawGrid(); drawCode(1, 1); };

    const ro = new ResizeObserver(() => { size(); if (reduce) still(); });
    ro.observe(wrap);
    const mo = new MutationObserver(() => { readTokens(); if (reduce) still(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onTheme = () => { readTokens(); if (reduce) still(); };
    mq.addEventListener?.("change", onTheme);

    if (reduce) still(); else raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); mo.disconnect();
      mq.removeEventListener?.("change", onTheme);
    };
  }, []);

  return (
    <Shell>
      <div className="viewport" ref={wrapRef}>
        <canvas ref={canvasRef}
          aria-label="Field entries for one facility converging into the single Petrinex code they all refer to" />
        <span className="vptag">Resolving</span>
      </div>
      <div className="vpfoot">{label}</div>
    </Shell>
  );
}
