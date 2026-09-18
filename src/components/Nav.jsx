export default function Nav({ route, isDark, onToggleTheme }) {
  return (
    <div className="navpad">
      <nav className="nav">
        <a className="brand" href="#/" aria-label="Exchange Ventures home">
          <span className="mark" aria-hidden="true" />
          <b>Exchange Ventures</b>
        </a>
        <div className="tabs">
          <a className={`tab${route === "home" ? " on" : ""}`} href="#/">Company</a>
          <a className={`tab${route === "platform" ? " on" : ""}`} href="#/platform">Platform</a>
        </div>
        <button className="tgl" data-on={isDark ? "dark" : "light"} type="button"
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                onClick={onToggleTheme}><i /></button>
      </nav>
    </div>
  );
}
