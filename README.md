# luxon-hijri

[![npm version](https://img.shields.io/npm/v/luxon-hijri.svg)](https://www.npmjs.com/package/luxon-hijri)
[![CI](https://github.com/acamarata/luxon-hijri/actions/workflows/ci.yml/badge.svg)](https://github.com/acamarata/luxon-hijri/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Hijri/Gregorian date conversion and formatting. Supports two calendar systems: Umm al-Qura (default, table-based) and FCNA/ISNA (astronomical, all Hijri years). Built on Luxon.

## Installation

```bash
npm install luxon-hijri
```

## Quick Start

```javascript
import { toHijri, toGregorian, formatHijriDate } from 'luxon-hijri';

// Gregorian to Hijri (Umm al-Qura, default)
const h = toHijri(new Date(2023, 2, 23, 12)); // March 23, 2023
// { hy: 1444, hm: 9, hd: 1 }

// Hijri to Gregorian
const g = toGregorian(1444, 9, 1); // 1 Ramadan 1444
// Date: 2023-03-23T00:00:00.000Z

// Format a Hijri date
formatHijriDate({ hy: 1444, hm: 9, hd: 1 }, 'iEEEE, iD iMMMM iYYYY ioooo');
// "Yawm al-Khamis, 1 Ramadan 1444 AH"

// FCNA/ISNA calendar (astronomical, works for all Hijri years)
toHijri(new Date(2025, 2, 1, 12), { calendar: 'fcna' });  // { hy: 1446, hm: 9, hd: 1 }
toGregorian(1446, 9, 1, { calendar: 'fcna' });             // Date: 2025-03-01T00:00:00.000Z
```

## API

### `toHijri(date, options?)`

Converts a Gregorian `Date` to a Hijri date object.

```typescript
function toHijri(date: Date, options?: ConversionOptions): HijriDate | null
```

For `'uaq'` (default): returns `null` if the date falls outside the table range (before 1 Muharram 1318 H / 1900-04-30, or at/after 1 Muharram 1501 H / 2077-11-17). Uses local date components.

For `'fcna'`: returns `null` only for dates before 1 AH. Uses UTC date components (FCNA boundaries are defined in UTC).

Throws `Error("Invalid Gregorian date")` if `date` is not a valid `Date`.

```javascript
toHijri(new Date(2024, 6, 7, 12))                           // { hy: 1446, hm: 1, hd: 1 }  (UAQ)
toHijri(new Date(2025, 2, 1, 12), { calendar: 'fcna' })    // { hy: 1446, hm: 9, hd: 1 }  (FCNA)
toHijri(new Date(1800, 0, 1))                               // null — before UAQ table range
```

### `toGregorian(hy, hm, hd, options?)`

Converts a Hijri date to a Gregorian `Date` at UTC midnight.

```typescript
function toGregorian(hy: number, hm: number, hd: number, options?: ConversionOptions): Date | null
```

Throws `Error("Invalid Hijri date")` if the date is invalid for the selected calendar.

```javascript
toGregorian(1446, 1, 1)                           // Date: 2024-07-07T00:00:00.000Z  (UAQ)
toGregorian(1446, 9, 1, { calendar: 'fcna' })     // Date: 2025-03-01T00:00:00.000Z  (FCNA)
toGregorian(1, 1, 1, { calendar: 'fcna' })        // Date: 0622-07-18T00:00:00.000Z  (Islamic epoch)
```

### `formatHijriDate(date, format)`

Formats a Hijri date using the token patterns below. Tokens not listed pass through unchanged.

```typescript
function formatHijriDate(date: HijriDate, format: string): string
```

| Token | Output | Example |
| --- | --- | --- |
| `iYYYY` | Year, 4 digits | `1444` |
| `iYY` | Year, last 2 digits | `44` |
| `iMMMM` | Month, full name | `Ramadan` |
| `iMMM` | Month, medium name | `Ramadan` |
| `iMM` | Month, zero-padded | `09` |
| `iM` | Month, no padding | `9` |
| `iDD` | Day, zero-padded | `01` |
| `iD` | Day, no padding | `1` |
| `iEEEE` | Weekday, full name | `Yawm al-Khamis` |
| `iEEE` | Weekday, abbreviated | `Kham` |
| `iE` | Weekday, numeric (Sun=1) | `5` |
| `ioooo` | Era, full | `AH` |
| `iooo` | Era, abbreviated | `AH` |
| `HH`, `H`, `hh`, `h` | Hour (via Luxon) | `14`, `14`, `02`, `2` |
| `mm`, `m` | Minute (via Luxon) | `05`, `5` |
| `ss`, `s` | Second (via Luxon) | `30`, `30` |
| `a` | AM/PM | `AM` |
| `z`, `zz`, `zzz` | Timezone | `UTC` |
| `Z`, `ZZ` | Timezone offset | `+00:00` |

### `isValidHijriDate(hy, hm, hd, options?)`

Returns `true` if the Hijri date is valid for the selected calendar.

```typescript
function isValidHijriDate(hy: number, hm: number, hd: number, options?: ConversionOptions): boolean
```

For `'uaq'` (default): year must be 1318–1500, month 1–12, day must not exceed the actual month length from the UAQ table.

For `'fcna'`: year must be ≥ 1, month 1–12, day must not exceed the computed FCNA month length.

### Types

```typescript
interface HijriDate {
  hy: number; // Hijri year
  hm: number; // Hijri month (1–12)
  hd: number; // Hijri day (1–30)
}

type CalendarSystem = 'uaq' | 'fcna';

interface ConversionOptions {
  calendar?: CalendarSystem; // default: 'uaq'
}

interface HijriYearRecord {
  hy:  number; // Hijri year
  dpm: number; // days-per-month bitmask (bit 0 = month 1, 1 = 30 days, 0 = 29 days)
  gy:  number; // Gregorian year of 1 Muharram
  gm:  number; // Gregorian month of 1 Muharram
  gd:  number; // Gregorian day of 1 Muharram
}
```

### Additional exports

```javascript
import {
  hDatesTable,    // HijriYearRecord[] — the full Umm al-Qura table (184 entries)
  hmLong,         // string[12] — full month names
  hmMedium,       // string[12] — medium month names
  hmShort,        // string[12] — abbreviated month names
  hwLong,         // string[7] — full weekday names (Sunday first)
  hwShort,        // string[7] — abbreviated weekday names
  hwNumeric,      // number[7] — weekday numbers (1–7, Sunday=1)
  formatPatterns, // Record<string, string> — token reference
} from 'luxon-hijri';
```

## Calendar Systems

**Umm al-Qura (`'uaq'`, default):** Official Saudi calendar, table-based, covers Hijri years 1318–1500 (April 1900 to November 2076). Authoritative for Saudi Arabia and widely used across the Arab world.

**FCNA/ISNA (`'fcna'`):** Used by the Fiqh Council of North America and ISNA. Astronomical criterion: if the new moon conjunction occurs before 12:00 UTC on day D, the month begins at midnight of D+1; otherwise D+2. Works for all Hijri years (no range limit). New moon times use the full Meeus Chapter 49 algorithm, accurate to within a few minutes for 1000–3000 CE.

## Architecture

The UAQ engine is a pure table lookup with binary search (O(log 183)). The FCNA engine computes new moon times astronomically using the Meeus Ch.49 formula — 3 to 5 trigonometric evaluations per call, sub-millisecond on any modern JS engine.

For more detail see the [Architecture wiki page](https://github.com/acamarata/luxon-hijri/wiki/Architecture).

## Compatibility

- Node.js 20+ (ESM and CJS)
- Bundlers: webpack, Rollup, Vite, esbuild (tree-shakeable, `sideEffects: false`)
- TypeScript: full type definitions included

## TypeScript

```typescript
import { toHijri, toGregorian, formatHijriDate, isValidHijriDate } from 'luxon-hijri';
import type { HijriDate, HijriYearRecord, CalendarSystem, ConversionOptions } from 'luxon-hijri';

const h: HijriDate | null = toHijri(new Date());
const g: Date | null = toGregorian(1444, 9, 1, { calendar: 'fcna' });
```

## Documentation

Full API reference, architecture notes, calendar background, and format token guide:
[https://github.com/acamarata/luxon-hijri/wiki](https://github.com/acamarata/luxon-hijri/wiki)

## Related

- [nrel-spa](https://www.npmjs.com/package/nrel-spa) — NREL Solar Position Algorithm (pure JS)
- [pray-calc](https://www.npmjs.com/package/pray-calc) — Islamic prayer times, depends on nrel-spa
- [solar-spa](https://www.npmjs.com/package/solar-spa) — NREL SPA compiled to WebAssembly

## License

MIT. Copyright (c) 2024-2026 Aric Camarata.

See [LICENSE](./LICENSE) for the full text.
