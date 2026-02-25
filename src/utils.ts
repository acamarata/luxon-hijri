// utils.ts
import { hDatesTable } from './hDates';
import { fcnaIsValid } from './fcna';
import type { ConversionOptions } from './types';

export function isValidHijriDate(hy: number, hm: number, hd: number, options?: ConversionOptions): boolean {
  if (options?.calendar === 'fcna') {
    return fcnaIsValid(hy, hm, hd);
  }

  // Binary search on hy.
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

  // dpm === 0 means sentinel entry (marks end-of-table boundary, not a real year).
  if (found === -1 || hDatesTable[found].dpm === 0) return false;

  const record = hDatesTable[found];
  if (hm < 1 || hm > 12 || hd < 1) return false;
  const daysInMonth = (record.dpm >> (hm - 1)) & 1 ? 30 : 29;
  return hd <= daysInMonth;
}
