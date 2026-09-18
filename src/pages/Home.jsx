import { Shell, Btn, Reveal } from "../components/Primitives.jsx";
import HeroCanvas from "../components/HeroCanvas.jsx";

const MAIL = "mailto:info@exchangeventures.ca?subject=Exchange%20Ventures";

const PROBLEMS = [
  ["01", "Entry is free text",
   "One battery ends up with seven names. Nothing downstream can join them, and nobody finds out until month end."],
  ["02", "Reconciliation is manual",
   "Volumes balanced by hand against a regulator deadline that does not move, in a spreadsheet nobody else can read."],
  ["03", "Analysis comes last",
   "Benchmarking, decline and netback all wait on keys that never matched in the first place."],
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="herotxt">
          <h1>Exchange Ventures</h1>
          <p className="tagline">An oil and gas intelligence company.</p>
          <p className="lede">
            We build software for producers. It makes field data easier to gather and the
            systems around it easier to <b>automate</b>.
          </p>
          <div className="cta">
            <Btn href={MAIL}>Get in touch</Btn>
            <Btn href="#/platform" variant="ghost" icon="→">See the platform</Btn>
          </div>
        </div>
        <HeroCanvas />
      </section>

      <section className="sec">
        <Reveal><div className="sechead"><h2>The industry runs on data it cannot trust.</h2></div></Reveal>
        <div className="probs">
          {PROBLEMS.map(([n, title, body], i) => (
            <Reveal key={n} delay={i * 110} className="prob">
              <Shell style={{ height: "100%" }}>
                <div className="probin"><i>{n}</i><b>{title}</b><p>{body}</p></div>
              </Shell>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="sec">
        <Reveal>
          <div className="sechead">
            <h2>So we are building the platform.</h2>
            <p className="sub">
              Datum captures field data against the live regulatory register, then carries it
              all the way through to the filing.
            </p>
          </div>
        </Reveal>
        <Reveal delay={90} style={{ marginTop: 44 }}>
          <Shell>
            <div className="band">
              <div className="bandtxt">
                <h3>Built on the register, not on a text box.</h3>
                <p>
                  Every facility, well and disposition point is matched against Petrinex before
                  it can be saved, so the keys are right the first time.
                </p>
                <div className="cta">
                  <Btn href="#/platform" size="sm" icon="→">Open the platform</Btn>
                </div>
              </div>
              <div className="bandimg">
                <img src="/platform.jpg" width="1240" height="697" loading="lazy"
                     alt="The Datum capture grid running against the Alberta facility register." />
              </div>
            </div>
          </Shell>
        </Reveal>
      </section>

      <section className="sec">
        <Reveal>
          <Shell>
            <div className="closein">
              <h2>Talk to us.</h2>
              <p>
                We are working with a small number of producers before general release.
                If this data problem is yours, we want to hear how it shows up.
              </p>
              <Btn href={MAIL}>Get in touch</Btn>
            </div>
          </Shell>
        </Reveal>
      </section>
    </main>
  );
}
