// toHijri.ts
import { hDatesTable } from './hDates';
import { fcnaToHijri } from './fcna';
import type { HijriDate, HijriYearRecord, ConversionOptions } from './types';

export function toHijri(gregorianDate: Date, options?: ConversionOptions): HijriDate | null {
  if (options?.calendar === 'fcna') {
    return fcnaToHijri(gregorianDate);
  }

  if (!(gregorianDate instanceof Date) || isNaN(gregorianDate.getTime())) {
    throw new Error('Invalid Gregorian date');
  }

  // Normalize input to UTC midnight so comparisons are timezone-independent.
  const inputUtc = Date.UTC(
    gregorianDate.getFullYear(),
    gregorianDate.getMonth(),
    gregorianDate.getDate(),
  );

  // Binary search: find the last table entry whose Gregorian date <= input.
  // Table is sorted ascending by (gy, gm, gd).
  let lo = 0;
  let hi = hDatesTable.length - 1;
  let found = -1;

  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const entry = hDatesTable[mid];
    const entryUtc = Date.UTC(entry.gy, entry.gm - 1, entry.gd);

    if (entryUtc <= inputUtc) {
      found = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  // dpm === 0 means sentinel entry (marks end-of-table boundary, not a real year).
  if (found === -1 || hDatesTable[found].dpm === 0) return null;

  const record: HijriYearRecord = hDatesTable[found];
  const startUtc = Date.UTC(record.gy, record.gm - 1, record.gd);
  let remainingDays = Math.round((inputUtc - startUtc) / 86_400_000);
  let hijriMonth = 0;

  for (let i = 0; i < 12; i++) {
    const daysInThisMonth = (record.dpm >> i) & 1 ? 30 : 29;
    if (remainingDays < daysInThisMonth) {
      hijriMonth = i + 1;
      break;
    }
    remainingDays -= daysInThisMonth;
  }

  // hijriMonth remains 0 if the date falls beyond the last table entry's year.
  if (hijriMonth === 0) return null;

  return { hy: record.hy, hm: hijriMonth, hd: remainingDays + 1 };
}
