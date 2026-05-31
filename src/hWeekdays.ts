/**
 * Purpose: Hijri weekday name and numeric arrays, re-exported from hijri-core.
 * Inputs: n/a — data exports
 * Outputs: hwLong[7], hwShort[7], hwNumeric[7] — index 0 = Sunday (Islamic convention)
 * Constraints: arrays are fixed-length 7; Sunday=1 in hwNumeric; maintained in hijri-core
 * SPORT: packages.md — luxon-hijri row
 */
// hWeekdays.ts: re-exports from hijri-core
export { hwLong, hwShort, hwNumeric } from "hijri-core";
