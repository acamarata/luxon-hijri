// index.ts
export { formatPatterns } from "./formatPatterns";
export { hDatesTable } from "./hDates";
export type { HijriYearRecord } from "./hDates";
export { hmLong, hmMedium, hmShort } from "./hMonths";
export { hwLong, hwShort, hwNumeric } from "./hWeekdays";
export { toGregorian } from "./toGregorian";
export { toHijri } from "./toHijri";
export { formatHijriDate } from "./formatHijriDate";
export { isValidHijriDate } from "./utils";
export type { HijriDate, CalendarSystem, ConversionOptions } from "./types";

// ── Opt-in anonymous telemetry ────────────────────────────────────────────────
// Off by default. Enable: ACAMARATA_TELEMETRY=1
// What is sent + how to disable: https://github.com/acamarata/telemetry/blob/main/TELEMETRY.md
import('@acamarata/telemetry')
  .then(({ track }) =>
    track('load', { package: 'luxon-hijri', version: '3.0.3' }),
  )
  .catch(() => {
    // telemetry not installed or disabled — that's fine
  });
