/**
 * Purpose: Shared type definitions for luxon-hijri's public API.
 * Inputs: n/a — type-only exports
 * Outputs: HijriDate, HijriYearRecord, ConversionOptions (re-exported from hijri-core), CalendarSystem
 * Constraints: CalendarSystem covers built-in engines only; hijri-core accepts any string via registerCalendar()
 * SPORT: packages.md — luxon-hijri row
 */
// types.ts: re-exports from hijri-core for backward compatibility
export type { HijriDate, HijriYearRecord, ConversionOptions } from 'hijri-core';

/**
 * Built-in calendar system identifiers.
 *
 * - `'uaq'`: Umm al-Qura (default). Table-based, covers 1318-1500 AH / 1900-2076 CE.
 * - `'fcna'`: FCNA/ISNA. Astronomical calculation, works for all Hijri years >= 1 AH.
 *
 * hijri-core accepts any string identifier via `registerCalendar()`. This type covers
 * the built-in defaults only.
 */
export type CalendarSystem = 'uaq' | 'fcna';
