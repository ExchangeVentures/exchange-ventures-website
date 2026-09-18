import { useMemo, useState } from "react";
import { Shell } from "./Primitives.jsx";
import { REGISTRY } from "../lib/registry.js";
import { validateUwi, rejectionReason } from "../lib/dls.js";

const SEGMENTS = [["le", "LE", 3], ["lsd", "LSD", 2], ["sec", "Sec", 2], ["twp", "Twp", 3], ["rge", "Rge", 2]];
const PRESETS = [["Redwater Battery", "Free text"], ["ABBT004", "A code"], ["longshore", "An operator"]];

/** A working slice of the product. Free text never resolves. */
export default function Resolver() {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState(null);
  const [seg, setSeg] = useState({ le: "100", lsd: "08", sec: "24", twp: "055", rge: "21", mer: "W4" });

  const hits = useMemo(() => {
    const t = query.trim().toLowerCase();
    if (!t || (picked && query === picked.id)) return [];
    return REGISTRY.filter((f) =>
      f.id.toLowerCase().includes(t) || f.name.toLowerCase().includes(t) ||
      f.operator.toLowerCase().includes(t) || f.label.toLowerCase().includes(t));
  }, [query, picked]);

  const rejected = Boolean(query.trim()) && !hits.length && !(picked && query === picked.id);
  const uwi = useMemo(() => validateUwi(seg), [seg]);

  const rows = picked ? [
    ["Facility ID", picked.id, true], ["Legal name", picked.name],
    ["Subtype", `${picked.type}  ${picked.label}`], ["Category", picked.category],
    ["Operator", picked.operator], ["BA", picked.ba],
    ["Location", picked.loc], ["Status", picked.status],
  ] : [];

  return (
    <Shell>
      <div className="demohead">
        <span className="t">Live resolver</span>
        <span className="sp" />
        {PRESETS.map(([value, label]) => (
          <button key={value} className="chip" type="button"
                  onClick={() => { setQuery(value); setPicked(null); }}>{label}</button>
        ))}
      </div>

      <div className="demogrid">
        <div className="dleft">
          <div className="fwrap">
            <label className="flabel" htmlFor="facq">Facility</label>
            <input id="facq" className={`finput${rejected ? " bad" : ""}`} value={query}
                   autoComplete="off" spellCheck="false" placeholder="Code, name or operator"
                   onChange={(e) => { setQuery(e.target.value); setPicked(null); }} />
          </div>

          {hits.length > 0 && (
            <div className="hits">
              {hits.map((f) => (
                <button key={f.id} className="hit" type="button"
                        onClick={() => { setPicked(f); setQuery(f.id); }}>
                  <span className="c">{f.id}</span>
                  <span className="n">{`${f.name}  ·  ${f.operator}`}</span>
                </button>
              ))}
            </div>
          )}

          {rejected && (
            <div className="reject"><b>REJECTED</b><span>{rejectionReason(query)}</span></div>
          )}

          <div className="fwrap" style={{ marginTop: 4 }}>
            <span className="flabel">Well identifier</span>
            <div className="segs">
              {SEGMENTS.map(([key, label, len]) => (
                <div key={key} className={`seg${uwi.bad.includes(key) ? " err" : ""}`}>
                  <small>{label}</small>
                  <input value={seg[key]} maxLength={len} inputMode="numeric" aria-label={label}
                         onChange={(e) => {
                           const v = e.target.value.replace(/[^0-9]/g, "");
                           setSeg((p) => ({ ...p, [key]: v }));
                         }} />
                </div>
              ))}
              <div className="seg">
                <small>Mer</small>
                <select value={seg.mer} aria-label="Meridian"
                        onChange={(e) => setSeg((p) => ({ ...p, mer: e.target.value }))}>
                  {["W3", "W4", "W5", "W6"].map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className={`uout${uwi.uwi ? "" : " no"}`}>
            {uwi.uwi || (uwi.errors.length ? "segment out of range" : "incomplete")}
          </div>
          {uwi.errors.length > 0 && (
            <div className="reject"><b>OUT OF RANGE</b><span>{uwi.errors[0]}</span></div>
          )}
        </div>

        <div className="dright">
          <span className="flabel">Derived from the code<span className="lock">READ ONLY</span></span>
          {picked ? (
            <dl style={{ margin: 0 }}>
              {rows.map(([k, v, big], i) => (
                <div key={k} className="drow" style={{ animationDelay: `${i * 40}ms` }}>
                  <dt>{k}</dt><dd className={big ? "big" : ""}>{v}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="empty">
              Resolve a facility and its legal name, subtype, operator and licence appear here.
              None of them can be keyed, so none can disagree with the register.
            </p>
          )}
        </div>
      </div>
    </Shell>
  );
}
