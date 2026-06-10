# luxon-hijri

[![npm version](https://img.shields.io/npm/v/luxon-hijri.svg)](https://www.npmjs.com/package/luxon-hijri)
[![CI](https://github.com/acamarata/luxon-hijri/actions/workflows/ci.yml/badge.svg)](https://github.com/acamarata/luxon-hijri/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Wiki](https://img.shields.io/badge/docs-wiki-blue)](https://github.com/acamarata/luxon-hijri/wiki)

Hijri/Gregorian date conversion and formatting for Luxon users. Thin adapter over [hijri-core](https://github.com/acamarata/hijri-core). Supports the Umm al-Qura calendar (1318-1500 AH, table-based) and the FCNA/ISNA calendar (astronomical, all Hijri years).

## Installation

```bash
pnpm add luxon-hijri luxon hijri-core
# or
npm install luxon-hijri luxon hijri-core
```

## Quick Start

```javascript
import { toHijri, toGregorian, formatHijriDate } from 'luxon-hijri';

// Gregorian to Hijri (Umm al-Qura, default) — use Date.UTC for cross-host consistency
const h = toHijri(new Date(Date.UTC(2023, 2, 23)));
// { hy: 1444, hm: 9, hd: 1 }

// Hijri to Gregorian
const g = toGregorian(1444, 9, 1);
// Date: 2023-03-23T00:00:00.000Z

// Format a Hijri date
formatHijriDate({ hy: 1444, hm: 9, hd: 1 }, 'iEEEE, iD iMMMM iYYYY ioooo');
// "Yawm al-Khamis, 1 Ramadan 1444 AH"

// FCNA/ISNA calendar
toHijri(new Date(Date.UTC(2025, 2, 1)), { calendar: 'fcna' });
```

## Day boundaries and time zones

`toHijri(date)` reads the **UTC calendar day** of the Date you pass. `toGregorian(hy, hm, hd)` returns a Date at **UTC midnight** on the corresponding Gregorian day. Round-trips are therefore exact and produce identical results on any machine regardless of local timezone.

**Converting a zone-aware Luxon DateTime.** Pass the DateTime's calendar fields, not `.toJSDate()`, unless the DateTime is already pinned to UTC:

```javascript
import { DateTime } from 'luxon';
import { toHijri } from 'luxon-hijri';

const dt = DateTime.now().setZone('America/New_York');

// Correct — reads the calendar date in the DateTime's own zone
const h = toHijri(new Date(Date.UTC(dt.year, dt.month - 1, dt.day)));

// Wrong if dt is not UTC-anchored — toJSDate() produces local-zone midnight,
// which may land on the previous UTC day for western timezones
// const h = toHijri(dt.toJSDate());
```

**ISO string parsing.** `new Date("2025-03-01")` parses as UTC midnight — that is exactly the right input for a calendar-day conversion and will produce the correct Hijri date.

Note: determining when the Hijri day begins at local sunset is out of scope for this library.

## TypeScript

```typescript
import { toHijri, toGregorian, formatHijriDate, isValidHijriDate } from 'luxon-hijri';
import type { HijriDate, CalendarSystem, ConversionOptions } from 'luxon-hijri';
```

## Documentation

Full API reference, format token guide, calendar background, and architecture notes: [GitHub Wiki](https://github.com/acamarata/luxon-hijri/wiki)

## Related

- [hijri-core](https://github.com/acamarata/hijri-core): The underlying calendar engine
- [pray-calc](https://www.npmjs.com/package/pray-calc): Islamic prayer times
- [nrel-spa](https://www.npmjs.com/package/nrel-spa): NREL Solar Position Algorithm

## Acknowledgments

The Umm al-Qura table is derived from data published by KACST (King Abdulaziz City for Science and Technology). The FCNA new moon algorithm follows Jean Meeus, "Astronomical Algorithms," 2nd ed., Chapter 49.

## License

MIT. Copyright (c) 2024-2026 Aric Camarata.
