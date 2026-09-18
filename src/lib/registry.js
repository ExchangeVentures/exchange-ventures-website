/**
 * A small slice of the Alberta facility register, taken verbatim from the
 * Petrinex Facility Infrastructure report. Used by the demo resolver so the
 * page cannot show a facility that does not exist.
 */
export const REGISTRY = [
  { id: "ABBT0049013", type: "BT", label: "Battery", name: "REDWATER 08-24",
    loc: "08-24-055-21W4", status: "ACTIVE", operator: "LONGSHORE RESOURCES LTD.",
    ba: "A76W", category: "CRUDE OIL SINGLE-WELL BATTERY" },
  { id: "ABBT0058097", type: "BT", label: "Battery", name: "LONGSHORE PROVOST HZ 2-19",
    loc: "02-19-040-06W4", status: "ACTIVE", operator: "LONGSHORE RESOURCES LTD.",
    ba: "A76W", category: "CRUDE OIL MULTIWELL PRORATION BATTERY" },
  { id: "ABBT0086355", type: "BT", label: "Battery", name: "HORSESHOE LK 13-14-39-06W4 MWB",
    loc: "13-14-039-06W4", status: "ACTIVE", operator: "LONGSHORE RESOURCES LTD.",
    ba: "A76W", category: "CRUDE OIL MULTIWELL PRORATION BATTERY" },
  { id: "ABBT0125328", type: "BT", label: "Battery", name: "Renaissance Hayter 6-29",
    loc: "06-29-041-01W4", status: "ACTIVE", operator: "LONGSHORE RESOURCES LTD.",
    ba: "A76W", category: "CRUDE OIL MULTIWELL PRORATION BATTERY" },
  { id: "ABIF0081519", type: "IF", label: "Injection / disposal", name: "Redwater Water Disposal 10-24-55-21W",
    loc: "15-24-055-21W4", status: "ACTIVE", operator: "LONGSHORE RESOURCES LTD.",
    ba: "A76W", category: "DISPOSAL" },
  { id: "ABTM0000829", type: "TM", label: "Terminal", name: "GIBSON EDMONTON TERMINAL",
    loc: "13-05-053-23W4", status: "ACTIVE", operator: "GIBSON ENERGY INC.",
    ba: "0195", category: "TANK FARM / OIL LOADING TERMINAL" },
  { id: "ABTM0000843", type: "TM", label: "Terminal", name: "HUSKY HARDISTY TERMINAL",
    loc: "05-29-042-09W4", status: "ACTIVE", operator: "CENOVUS ENERGY INC.",
    ba: "A5D4", category: "TANK FARM / OIL LOADING TERMINAL" },
];

/** Groups the hero animation resolves, all real records. */
export const RESOLVE_GROUPS = [
  { messy: ["Pembina Battery", "PEMBINA BTY", "pembina batt 4-11", "Pemb. Battery", "PEMBINA BATTERY 04-11", "pembina"],
    code: "ABBT0089114", name: "PEMBINA 04-11-048-08W5" },
  { messy: ["Redwater 08-24", "REDWATER BTY", "redwater 8-24", "RW 08-24", "Redwater  Battery"],
    code: "ABBT0049013", name: "REDWATER 08-24-055-21W4" },
  { messy: ["Horseshoe Lk", "HORSESHOE LAKE 13-14", "horseshoe lk mwb", "H-Lake 13-14", "horseshoe"],
    code: "ABBT0086355", name: "HORSESHOE LK 13-14-039-06W4" },
];
