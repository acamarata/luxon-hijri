// types.ts: re-exports from hijri-core for backward compatibility
export type { HijriDate, HijriYearRecord, ConversionOptions } from 'hijri-core';

// CalendarSystem documents the built-in calendar identifiers.
// hijri-core accepts any string via registerCalendar(); this type covers the defaults.
export type CalendarSystem = 'uaq' | 'fcna';
