import { useEffect, useState } from "react";
import Nav from "./components/Nav.jsx";
import MeshField from "./components/MeshField.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Platform from "./pages/Platform.jsx";

const routeFromHash = () =>
  (window.location.hash || "").includes("platform") ? "platform" : "home";

export default function App() {
  const [route, setRoute] = useState(routeFromHash);
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("xv-theme"); } catch { return null; }
  });

  useEffect(() => {
    const el = document.documentElement;
    if (theme) el.setAttribute("data-theme", theme);
    else el.removeAttribute("data-theme");
    try {
      if (theme) localStorage.setItem("xv-theme", theme);
      else localStorage.removeItem("xv-theme");
    } catch { /* storage unavailable, theme still applies for this visit */ }
  }, [theme]);

  useEffect(() => {
    const onHash = () => { setRoute(routeFromHash()); window.scrollTo({ top: 0, behavior: "auto" }); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    document.title = route === "platform"
      ? "Datum | Exchange Ventures"
      : "Exchange Ventures | Oil and gas intelligence";
  }, [route]);

  const isDark = theme
    ? theme === "dark"
    : window.matchMedia?.("(prefers-color-scheme: dark)").matches;

  return (
    <>
      <div className="aura" aria-hidden="true" />
      <MeshField />
      <div className="grain" aria-hidden="true" />
      <Nav route={route} isDark={isDark} onToggleTheme={() => setTheme(isDark ? "light" : "dark")} />
      <div className="wrap">
        {route === "platform" ? <Platform /> : <Home />}
        <Footer route={route} />
      </div>
    </>
  );
}
