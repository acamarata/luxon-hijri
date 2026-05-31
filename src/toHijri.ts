/**
 * Purpose: Convert a Gregorian Date to a Hijri date object.
 * Inputs: date: Date, options?: ConversionOptions
 * Outputs: HijriDate | null — null when date is outside the calendar range
 * Constraints: delegates entirely to hijri-core; no conversion logic here
 * SPORT: packages.md — luxon-hijri row
 */
// toHijri.ts: delegates to hijri-core
export { toHijri } from "hijri-core";
