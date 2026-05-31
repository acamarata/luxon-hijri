/**
 * Purpose: UAQ table data and year record type, re-exported from hijri-core.
 * Inputs: n/a — data export
 * Outputs: hDatesTable (HijriYearRecord[184]) and HijriYearRecord type
 * Constraints: table covers 1318-1501 AH (183 real years + 1 sentinel); maintained in hijri-core
 * SPORT: packages.md — luxon-hijri row
 */
// hDates.ts: re-exports from hijri-core; table is maintained in the core package
export { hDatesTable } from "hijri-core";
export type { HijriYearRecord } from "hijri-core";
