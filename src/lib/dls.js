/**
 * Dominion Land Survey and Petrinex identifier rules.
 * Mirrors src/lib/dls.js in the Datum repo so the marketing demo cannot
 * claim behaviour the product does not have.
 */
export const RANGE_MAX = { W1: 34, W2: 30, W3: 30, W4: 30, W5: 28, W6: 13 };

const pad = (n, w) => String(n).padStart(w, "0");
const toInt = (v) => (v === "" || v == null ? NaN : parseInt(v, 10));

export function validateUwi(u) {
  const bad = [];
  const errors = [];
  const le = toInt(u.le), lsd = toInt(u.lsd), sec = toInt(u.sec),
        twp = toInt(u.twp), rge = toInt(u.rge);
  const mer = u.mer || "W4";

  if (u.le && (!Number.isFinite(le) || le < 100 || le > 199)) {
    bad.push("le");
    errors.push(`Location exception must be 100 to 199. Got ${u.le}.`);
  }
  if (u.lsd && (!Number.isFinite(lsd) || lsd < 1 || lsd > 16)) {
    bad.push("lsd");
    errors.push(`LSD must be 1 to 16. A section holds sixteen legal subdivisions. Got ${u.lsd}.`);
  }
  if (u.sec && (!Number.isFinite(sec) || sec < 1 || sec > 36)) {
    bad.push("sec");
    errors.push(`Section must be 1 to 36. A township holds thirty six sections. Got ${u.sec}.`);
  }
  if (u.twp && (!Number.isFinite(twp) || twp < 1 || twp > 126)) {
    bad.push("twp");
    errors.push(`Township must be 1 to 126. Got ${u.twp}.`);
  }
  const max = RANGE_MAX[mer] ?? 34;
  if (u.rge && (!Number.isFinite(rge) || rge < 1 || rge > max)) {
    bad.push("rge");
    errors.push(`Range ${u.rge} does not exist west of the ${mer.charAt(1)} meridian. ${mer} runs 1 to ${max}.`);
  }

  const blank = !u.le || !u.lsd || !u.sec || !u.twp || !u.rge;
  const uwi = !bad.length && !blank
    ? `${pad(le, 3)}/${pad(lsd, 2)}-${pad(sec, 2)}-${pad(twp, 3)}-${pad(rge, 2)}${mer}/00`
    : null;
  return { bad, errors, uwi, blank };
}

/** Petrinex facility ID: province, subtype, seven digits. */
export function rejectionReason(q) {
  const u = q.trim().toUpperCase();
  if (/^[A-Z]{4}\d+$/.test(u)) {
    const digits = (u.match(/\d/g) || []).length;
    return `No facility "${q.trim()}". A facility ID carries seven digits after the four letter prefix. This has ${digits}.`;
  }
  return `No register match for "${q.trim()}". Free text is not a facility. Search by code, legal name or operator.`;
}

/** Meridian longitudes, degrees west, for the Dominion Land Survey. */
export const MERIDIAN_LON = { W1: 97.46, W2: 102.0, W3: 106.0, W4: 110.0, W5: 114.0, W6: 118.0 };

/**
 * Approximate lat/lon from a DLS location such as "08-24-055-21W4".
 * A township is six miles north to south; range width is six miles converted
 * at that latitude. Accurate to roughly a tenth of a degree, which is well
 * inside what a facility marker needs.
 */
export function dlsToLatLon(location) {
  const m = /^(\d{1,2})-(\d{1,2})-(\d{1,3})-(\d{1,2})(W\d)$/.exec((location || "").trim());
  if (!m) return null;
  const twp = +m[3], rge = +m[4], mer = m[5];
  const base = MERIDIAN_LON[mer];
  if (base == null) return null;
  const lat = 49 + (twp - 0.5) * 0.0869;
  const degPerRange = 9.656 / (111.32 * Math.cos((lat * Math.PI) / 180));
  return { lat, lon: -(base + (rge - 0.5) * degPerRange), twp, rge, mer };
}
