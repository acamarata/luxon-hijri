# luxon-hijri

[![npm version](https://img.shields.io/npm/v/luxon-hijri.svg)](https://www.npmjs.com/package/luxon-hijri)
[![CI](https://github.com/acamarata/luxon-hijri/actions/workflows/ci.yml/badge.svg)](https://github.com/acamarata/luxon-hijri/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

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

// Gregorian to Hijri (Umm al-Qura, default)
const h = toHijri(new Date(2023, 2, 23, 12));
// { hy: 1444, hm: 9, hd: 1 }

// Hijri to Gregorian
const g = toGregorian(1444, 9, 1);
// Date: 2023-03-23T00:00:00.000Z

// Format a Hijri date
formatHijriDate({ hy: 1444, hm: 9, hd: 1 }, 'iEEEE, iD iMMMM iYYYY ioooo');
// "Yawm al-Khamis, 1 Ramadan 1444 AH"

// FCNA/ISNA calendar
toHijri(new Date(2025, 2, 1, 12), { calendar: 'fcna' });
```

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
