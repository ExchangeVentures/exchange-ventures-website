import { useEffect, useRef, useState } from "react";
import { reducedMotion } from "./Primitives.jsx";

/**
 * Scroll-driven focus list. Everything dims except the row the reader has
 * reached. Lifted from the AURA scope-of-work section, where the highlight
 * advances as you scroll rather than on hover.
 */
export default function FocusList({ items, renderItem }) {
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    if (reducedMotion()) { setActive(-1); return; }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.index));
        });
      },
      // A narrow band across the middle of the viewport is the "read" line.
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [items.length]);

  return (
    <div className="focuslist">
      {items.map((item, i) => (
        <div
          key={i}
          data-index={i}
          ref={(el) => (refs.current[i] = el)}
          className={`focusrow${active === i ? " on" : ""}${active === -1 ? " on" : ""}`}
        >
          {renderItem(item, i, active === i)}
        </div>
      ))}
    </div>
  );
}
