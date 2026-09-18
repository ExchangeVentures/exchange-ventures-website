import { useEffect, useRef, useState } from "react";
import { reducedMotion } from "./Primitives.jsx";

/**
 * The product, doing its job, in the hero. A query types itself, is rejected
 * for free text, then resolves against a real register record.
 */
const SCRIPT = [
  { q: "pembina batt 4-11", bad: "No register match. Free text is not a facility." },
  { q: "ABBT0049013", good: ["REDWATER 08-24", "Battery · LONGSHORE RESOURCES LTD. · 08-24-055-21W4"] },
  { q: "ABBT004", bad: "A facility ID carries seven digits after the four letter prefix. This has three." },
  { q: "ABTM0000829", good: ["GIBSON EDMONTON TERMINAL", "Terminal · GIBSON ENERGY INC. · 13-05-053-23W4"] },
];

export default function ResolveTerminal() {
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState("typing");   // typing | result
  const timers = useRef([]);
  const reduce = reducedMotion();

  useEffect(() => {
    if (reduce) { setTyped(SCRIPT[1].q); setStep(1); setPhase("result"); return; }
    const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
    clear();
    const target = SCRIPT[step].q;
    setTyped(""); setPhase("typing");

    let i = 0;
    const type = () => {
      if (i <= target.length) {
        setTyped(target.slice(0, i++));
        timers.current.push(setTimeout(type, 44 + Math.random() * 52));
      } else {
        timers.current.push(setTimeout(() => setPhase("result"), 440));
        timers.current.push(setTimeout(() => setStep((s) => (s + 1) % SCRIPT.length), 2840));
      }
    };
    type();
    return clear;
  }, [step, reduce]);

  const current = SCRIPT[step];

  return (
    <div className="term">
      <div className="termbar"><span>Facility resolver</span></div>
      <div className="termbody">
        <div className="tline">
          <span className="pr">&rsaquo;</span>
          <span>{typed}</span>
          {!reduce && phase === "typing" && <span className="caret" />}
        </div>
        <div className="toutslot">
          {phase === "result" && current.bad && (
            <div className="tout bad">REJECTED&nbsp;&nbsp;{current.bad}</div>
          )}
          {phase === "result" && current.good && (
            <div className="tout good">
              <b>{current.good[0]}</b><br />{current.good[1]}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
