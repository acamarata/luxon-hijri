# luxon-hijri

Hijri/Gregorian date conversion and formatting based on the Umm al-Qura calendar. Built on Luxon. Zero runtime dependencies beyond Luxon itself.

**Package:** [luxon-hijri on npm](https://www.npmjs.com/package/luxon-hijri)
**Repository:** [acamarata/luxon-hijri on GitHub](https://github.com/acamarata/luxon-hijri)
**License:** MIT

## Pages

- [API Reference](API-Reference) - Function signatures, parameters, return types, format tokens
- [Architecture](Architecture) - Umm al-Qura table structure, binary search, conversion algorithm
- [Hijri Calendar](Hijri-Calendar) - Islamic calendar background, Umm al-Qura system, epoch

## Quick Example

```javascript
import { toHijri, toGregorian, formatHijriDate } from 'luxon-hijri';

// Gregorian to Hijri
const h = toHijri(new Date(2023, 2, 23, 12));
// { hy: 1444, hm: 9, hd: 1 }  →  1 Ramadan 1444

// Hijri to Gregorian
const g = toGregorian(1444, 9, 1);
// Date: 2023-03-23T00:00:00.000Z

// Format
formatHijriDate({ hy: 1444, hm: 9, hd: 1 }, 'iEEEE, iD iMMMM iYYYY ioooo');
// "Yawm al-Khamis, 1 Ramadan 1444 AH"
```

## Key Facts

- Two calendars: Umm al-Qura (default, table-based, 1318–1500 H) and FCNA/ISNA (astronomical, all years)
- FCNA criterion: conjunction before 12:00 UTC → month starts D+1, else D+2 (Meeus Ch.49 algorithm)
- Zero runtime dependencies beyond Luxon
- Synchronous: no async, no loading delay
- Dual CJS and ESM, full TypeScript definitions
- Weekday format bug from v1 is fixed in v2 (weekday tokens now use correct Gregorian conversion)

---

[API Reference](API-Reference) . [Architecture](Architecture) . [Hijri Calendar](Hijri-Calendar)
