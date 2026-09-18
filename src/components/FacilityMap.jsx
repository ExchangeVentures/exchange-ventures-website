import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Shell, reducedMotion } from "./Primitives.jsx";
import { REGISTRY } from "../lib/registry.js";
import { dlsToLatLon } from "../lib/dls.js";

/**
 * Real facilities on a map, positioned from their legal DLS location rather
 * than from a stored coordinate. A facility can only appear here if its
 * location parses, which makes the map a second enforcement of the same rule
 * the capture grid enforces.
 *
 * Basemap is Esri Gray Canvas, which needs no API key and is already
 * monochrome, so the map does not fight a palette that carries no hue. CARTO
 * Positron was the obvious choice and is now key-gated: its tiles still return
 * HTTP 200, but with "API KEY REQUIRED" stamped across the image.
 *
 * Gray Canvas splits terrain from place names, so labels are a second layer.
 * Both are keyed on theme and swapped together.
 */
const ESRI = (service) =>
  `https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/${service}/MapServer/tile/{z}/{y}/{x}`;
const BASE = {
  light: ESRI("World_Light_Gray_Base"),
  dark: ESRI("World_Dark_Gray_Base"),
};
const LABEL = {
  light: ESRI("World_Light_Gray_Reference"),
  dark: ESRI("World_Dark_Gray_Reference"),
};
const ATTRIB =
  'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; ' +
  'Esri, HERE, Garmin, &copy; OpenStreetMap contributors';

export default function FacilityMap() {
  const hostRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const labelRef = useRef(null);
  const [selected, setSelected] = useState(null);

  const points = REGISTRY
    .map((f) => ({ f, p: dlsToLatLon(f.loc) }))
    .filter((x) => x.p);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || mapRef.current) return;
    const reduce = reducedMotion();

    const isDark = () => {
      const stamped = document.documentElement.getAttribute("data-theme");
      if (stamped) return stamped === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    };

    const map = L.map(host, {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: false,     // never hijack the page scroll
      fadeAnimation: !reduce,
      zoomAnimation: !reduce,
    });
    mapRef.current = map;

    // Esri serves no @2x variant, so detectRetina would ask for tiles that do
    // not exist. Labels are added after the base so they sit above it, and
    // both sit in tilePane, below the SVG markers in overlayPane.
    const tileOpts = { attribution: ATTRIB, maxZoom: 14, minZoom: 4 };
    layerRef.current = L.tileLayer(isDark() ? BASE.dark : BASE.light, tileOpts).addTo(map);
    labelRef.current = L.tileLayer(isDark() ? LABEL.dark : LABEL.light, tileOpts).addTo(map);

    const ink = () => getComputedStyle(document.documentElement).getPropertyValue("--ink").trim();
    const paper = () => getComputedStyle(document.documentElement).getPropertyValue("--paper").trim();

    const markers = points.map(({ f, p }) => {
      const m = L.circleMarker([p.lat, p.lon], {
        radius: f.type === "TM" ? 9 : 7,
        color: ink(), weight: 1.5,
        fillColor: f.type === "TM" ? ink() : paper(),
        fillOpacity: f.type === "TM" ? 0.85 : 0.6,
      }).addTo(map);
      m.bindTooltip(`${f.id}  ${f.name}`, { direction: "top", offset: [0, -8], className: "mtip" });
      m.on("click", () => setSelected(f));
      return m;
    });

    map.fitBounds(L.latLngBounds(points.map(({ p }) => [p.lat, p.lon])), { padding: [48, 48] });

    // Scroll zoom only once the map has been clicked into, then released on leave.
    map.on("click", () => map.scrollWheelZoom.enable());
    map.on("mouseout", () => map.scrollWheelZoom.disable());

    const repaint = () => {
      const dark = isDark();
      layerRef.current.setUrl(dark ? BASE.dark : BASE.light);
      labelRef.current.setUrl(dark ? LABEL.dark : LABEL.light);
      markers.forEach((m, i) => m.setStyle({
        color: ink(),
        fillColor: points[i].f.type === "TM" ? ink() : paper(),
      }));
    };
    const mo = new MutationObserver(repaint);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener?.("change", repaint);

    // Leaflet mis-sizes itself if the container was laid out after init.
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(host);

    return () => {
      mo.disconnect(); ro.disconnect();
      mq.removeEventListener?.("change", repaint);
      map.remove(); mapRef.current = null;
    };
  }, []);

  return (
    <Shell>
      <div className="maphead">
        <span className="t">Facility map</span>
        <span className="sp" />
        <span className="t">{points.length} of {REGISTRY.length} plotted from DLS</span>
      </div>
      <div className="mapwrap">
        <div className="mapcanvas" ref={hostRef} />
        <div className="mapside">
          {selected ? (
            <dl className="mapinfo">
              <div><dt>Facility ID</dt><dd className="big">{selected.id}</dd></div>
              <div><dt>Legal name</dt><dd>{selected.name}</dd></div>
              <div><dt>Subtype</dt><dd>{selected.type}  {selected.label}</dd></div>
              <div><dt>Operator</dt><dd>{selected.operator}</dd></div>
              <div><dt>Location</dt><dd>{selected.loc}</dd></div>
              <div><dt>Status</dt><dd>{selected.status}</dd></div>
            </dl>
          ) : (
            <p className="mapempty">
              Select a facility. Every position here is computed from its legal survey
              location, so nothing can be plotted that the register does not recognise.
            </p>
          )}
        </div>
      </div>
    </Shell>
  );
}
