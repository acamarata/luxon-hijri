// types.ts
export interface HijriDate {
  hy: number; // Hijri year
  hm: number; // Hijri month (1–12)
  hd: number; // Hijri day (1–30)
}

export interface HijriYearRecord {
  hy:  number; // Hijri year
  dpm: number; // days-per-month bitmask (bit 0 = month 1: 1→30 days, 0→29 days)
  gy:  number; // Gregorian year of 1 Muharram
  gm:  number; // Gregorian month of 1 Muharram
  gd:  number; // Gregorian day of 1 Muharram
}

// Calendar system selector.
// 'uaq' — Umm al-Qura (default): table-based, covers 1318–1500 H.
// 'fcna' — FCNA/ISNA: astronomical calculation, works for all Hijri years.
export type CalendarSystem = 'uaq' | 'fcna';

export interface ConversionOptions {
  calendar?: CalendarSystem;
}
