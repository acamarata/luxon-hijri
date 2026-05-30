/**
 * Purpose: Convert a Hijri date to a UTC Gregorian Date, throwing on invalid input.
 * Inputs: hy: number, hm: number (1-12), hd: number (1-30), options?: ConversionOptions
 * Outputs: Date — UTC midnight on the corresponding Gregorian day
 * Constraints: throws Error (not null) for invalid dates; UAQ range 1318-1500 AH; FCNA all years >= 1
 * SPORT: packages.md — luxon-hijri row
 */
// toGregorian.ts: thin wrapper over hijri-core; preserves throw-on-invalid behavior
import { toGregorian as coreToGregorian } from 'hijri-core';
import type { ConversionOptions } from './types';

/**
 * Convert a Hijri date to a Gregorian Date object.
 *
 * Unlike the hijri-core function (which returns null for invalid input), this
 * wrapper throws an Error so callers always receive a valid Date.
 *
 * @param hy - Hijri year
 * @param hm - Hijri month (1-12)
 * @param hd - Hijri day (1-30)
 * @param options - conversion options (calendar engine selection)
 * @returns a UTC Date corresponding to the given Hijri date
 * @throws {Error} if the Hijri date is invalid or out of range
 */
export function toGregorian(hy: number, hm: number, hd: number, options?: ConversionOptions): Date {
  const result = coreToGregorian(hy, hm, hd, options);
  if (result === null) throw new Error('Invalid Hijri date');
  return result;
}
