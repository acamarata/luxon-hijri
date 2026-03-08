// formatHijriDate.ts
import { DateTime } from 'luxon';
import { hmLong, hmMedium } from './hMonths';
import { hwLong, hwShort, hwNumeric } from './hWeekdays';
import { toGregorian } from './toGregorian';
import type { HijriDate } from './types';

// Token regex: longest tokens first to prevent partial matches.
const TOKEN_RE =
  /iYYYY|iYY|iMMMM|iMMM|iMM|iM|iDD|iD|iEEEE|iEEE|iE|ioooo|iooo|HH|H|hh|h|mm|m|ss|s|a|z{1,3}|ZZ|Z/g;

/**
 * Format a Hijri date using a token-based format string.
 *
 * Hijri-specific tokens use the `i` prefix (iYYYY, iMM, iDD, iEEEE, etc.).
 * Time and timezone tokens (HH, mm, ss, a, Z, z) are delegated to Luxon via the
 * corresponding Gregorian date.
 *
 * @param hijriDate - the Hijri date to format
 * @param format - a format string containing Hijri and/or Luxon tokens
 * @returns the formatted date string
 * @throws {RangeError} if the Hijri month is outside the 1-12 range
 */
export function formatHijriDate(hijriDate: HijriDate, format: string): string {
  if (hijriDate.hm < 1 || hijriDate.hm > 12) {
    throw new RangeError(`Hijri month must be 1-12, got ${hijriDate.hm}`);
  }

  // Lazy Gregorian DateTime, computed at most once per format call,
  // only when a token that needs it is encountered.
  let _gregDt: DateTime | undefined;

  function getGregDt(): DateTime {
    if (!_gregDt) {
      const greg = toGregorian(hijriDate.hy, hijriDate.hm, hijriDate.hd);
      _gregDt = DateTime.fromJSDate(greg, { zone: 'UTC' });
    }
    return _gregDt;
  }

  return format.replace(TOKEN_RE, (match) => {
    switch (match) {
      case 'iYYYY':
        return String(hijriDate.hy).padStart(4, '0');
      case 'iYY':
        return String(hijriDate.hy % 100).padStart(2, '0');
      case 'iMM':
        return String(hijriDate.hm).padStart(2, '0');
      case 'iM':
        return String(hijriDate.hm);
      case 'iMMM':
        return hmMedium[hijriDate.hm - 1];
      case 'iMMMM':
        return hmLong[hijriDate.hm - 1];
      case 'iDD':
        return String(hijriDate.hd).padStart(2, '0');
      case 'iD':
        return String(hijriDate.hd);
      case 'iE':
      case 'iEEE':
      case 'iEEEE': {
        // Luxon weekday: 1=Mon … 7=Sun. Modulo 7: Mon=1 … Sat=6, Sun=0.
        // hwLong/hwShort/hwNumeric arrays: index 0=Sunday, 1=Monday, … 6=Saturday.
        const idx = getGregDt().weekday % 7;
        if (match === 'iE') return String(hwNumeric[idx]);
        if (match === 'iEEE') return hwShort[idx];
        return hwLong[idx];
      }
      case 'iooo':
      case 'ioooo':
        return 'AH';
      default:
        // Delegate time and timezone tokens to Luxon using the Gregorian DateTime.
        return getGregDt().toFormat(match);
    }
  });
}
