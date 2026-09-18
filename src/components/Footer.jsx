export default function Footer({ route }) {
  return (
    <footer>
      <span className="f">Exchange Ventures</span>
      <span className="sp" />
      <span className="f">
        {route === "platform" ? "Register data from Petrinex public data" : "Calgary, Alberta"}
      </span>
    </footer>
  );
}
