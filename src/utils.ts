/**
 * Purpose: Validate a Hijri date against the active calendar system.
 * Inputs: hy: number, hm: number, hd: number, options?: ConversionOptions
 * Outputs: boolean — true if date is valid for the given calendar
 * Constraints: delegates to hijri-core; UAQ range is 1318-1500 AH; FCNA supports all years >= 1
 * SPORT: packages.md — luxon-hijri row
 */
// utils.ts: delegates to hijri-core
export { isValidHijriDate } from 'hijri-core';
