// toGregorian.ts
import { DateTime } from 'luxon';
import { hDatesTable } from './hDates';
import { fcnaToGregorian } from './fcna';
import { isValidHijriDate } from './utils';
import type { ConversionOptions } from './types';

export function toGregorian(hy: number, hm: number, hd: number, options?: ConversionOptions): Date | null {
  if (options?.calendar === 'fcna') {
    const result = fcnaToGregorian(hy, hm, hd);
    if (result === null) throw new Error('Invalid Hijri date');
    return result;
  }

  if (!isValidHijriDate(hy, hm, hd)) {
    throw new Error('Invalid Hijri date');
  }

  // Binary search on hy (table is sorted ascending by Hijri year).
  let lo = 0;
  let hi = hDatesTable.length - 1;
  let found = -1;

  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const midHy = hDatesTable[mid].hy;

    if (midHy === hy) {
      found = mid;
      break;
    } else if (midHy < hy) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  if (found === -1) return null;

  const record = hDatesTable[found];
  let totalDays = 0;

  for (let i = 0; i < hm - 1; i++) {
    totalDays += (record.dpm >> i) & 1 ? 30 : 29;
  }
  totalDays += hd - 1;

  const startDate = DateTime.utc(record.gy, record.gm, record.gd);
  return startDate.plus({ days: totalDays }).toJSDate();
}
