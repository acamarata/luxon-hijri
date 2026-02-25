# API Reference

## Functions

### `toHijri(date, options?)`

Converts a Gregorian `Date` to a Hijri date object.

```typescript
function toHijri(date: Date, options?: ConversionOptions): HijriDate | null
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `date` | `Date` | Any valid JavaScript `Date`. |
| `options` | `ConversionOptions` | Optional. `{ calendar: 'uaq' }` (default) or `{ calendar: 'fcna' }`. |

For the default `'uaq'` calendar, the local year/month/day components of the Date are used. For `'fcna'`, UTC components are used (since FCNA month boundaries are defined in UTC).

**Returns** `HijriDate | null`

For UAQ: returns `null` if the date falls outside the table range (before 1 Muharram 1318 H / 1900-04-30, or at/after 1 Muharram 1501 H / 2077-11-17).
For FCNA: returns `null` only for dates before 1 Muharram 1 AH (pre-Islamic epoch).

**Throws** `Error("Invalid Gregorian date")` if the argument is not a valid `Date` instance.

**Example**

```javascript
toHijri(new Date(2023, 2, 23, 12))              // { hy: 1444, hm: 9, hd: 1 }  (UAQ)
toHijri(new Date(2025, 2, 1, 12))               // { hy: 1446, hm: 9, hd: 1 }  (UAQ)
toHijri(new Date(2025, 2, 1, 12), { calendar: 'fcna' }) // { hy: 1446, hm: 9, hd: 1 }  (FCNA)
toHijri(new Date(1800, 0, 1), { calendar: 'uaq' })  // null (before table range)
```

---

### `toGregorian(hy, hm, hd, options?)`

Converts a Hijri date to a Gregorian `Date`.

```typescript
function toGregorian(hy: number, hm: number, hd: number, options?: ConversionOptions): Date
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `hy` | `number` | Hijri year (1318–1500 for UAQ; any year ≥ 1 for FCNA) |
| `hm` | `number` | Hijri month (1–12) |
| `hd` | `number` | Hijri day (1–29 or 1–30 depending on the month) |
| `options` | `ConversionOptions` | Optional. `{ calendar: 'uaq' }` (default) or `{ calendar: 'fcna' }`. |

**Returns** `Date`

Returns a UTC Date at midnight.

**Throws** `Error("Invalid Hijri date")` if the date fails validation.

**Example**

```javascript
toGregorian(1444, 9, 1)                           // 2023-03-23T00:00:00.000Z
toGregorian(1446, 9, 1, { calendar: 'fcna' })     // 2025-03-01T00:00:00.000Z
toGregorian(1446, 10, 1, { calendar: 'fcna' })    // 2025-03-30T00:00:00.000Z
toGregorian(1444, 0, 1)  // throws: month 0 is invalid
```

---

### `formatHijriDate(date, format)`

Formats a Hijri date using a format string with Hijri-specific tokens.

```typescript
function formatHijriDate(date: HijriDate, format: string): string
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `date` | `HijriDate` | A Hijri date object with `hy`, `hm`, `hd` properties |
| `format` | `string` | Format string with tokens listed below |

**Returns** `string`

Tokens in the format string are replaced with the corresponding Hijri values. Unrecognized substrings pass through unchanged.

**Format tokens**

| Token | Description | Example |
| --- | --- | --- |
| `iYYYY` | Year, 4 digits | `1444` |
| `iYY` | Year, last 2 digits | `44` |
| `iMMMM` | Month, full name | `Ramadan` |
| `iMMM` | Month, medium name | `Ramadan` |
| `iMM` | Month, 2 digits, zero-padded | `09` |
| `iM` | Month, no padding | `9` |
| `iDD` | Day, 2 digits, zero-padded | `01` |
| `iD` | Day, no padding | `1` |
| `iEEEE` | Weekday, full name | `Yawm al-Khamis` |
| `iEEE` | Weekday, abbreviated | `Kham` |
| `iE` | Weekday, numeric (Sunday=1) | `5` |
| `ioooo` | Era, full | `AH` |
| `iooo` | Era, abbreviated | `AH` |
| `HH` | Hour, 24h, zero-padded | `14` |
| `H` | Hour, 24h | `14` |
| `hh` | Hour, 12h, zero-padded | `02` |
| `h` | Hour, 12h | `2` |
| `mm` | Minute, zero-padded | `05` |
| `m` | Minute | `5` |
| `ss` | Second, zero-padded | `30` |
| `s` | Second | `30` |
| `a` | AM/PM | `AM` |
| `z`, `zz`, `zzz` | Timezone name | `UTC` |
| `Z`, `ZZ` | Timezone offset | `+00:00` |

Time, timezone, and weekday tokens are computed from a Gregorian DateTime derived from the Hijri date using the UAQ calendar. For FCNA-derived dates in months where UAQ and FCNA start on different days, weekday and time tokens will reflect the UAQ Gregorian equivalent, not the FCNA one. Pure Hijri tokens (`iYYYY`, `iMM`, `iDD`, `iMMMM`, etc.) are always accurate regardless of which calendar system produced the date.

**Weekday numbering**

The weekday arrays follow the Islamic convention where Sunday is the first day:

| Index | Day | `iE` value |
| --- | --- | --- |
| 0 | Sunday | 1 |
| 1 | Monday | 2 |
| 2 | Tuesday | 3 |
| 3 | Wednesday | 4 |
| 4 | Thursday | 5 |
| 5 | Friday | 6 |
| 6 | Saturday | 7 |

**Example**

```javascript
const d = { hy: 1444, hm: 9, hd: 1 };

formatHijriDate(d, 'iYYYY-iMM-iDD')                    // "1444-09-01"
formatHijriDate(d, 'iMMMM iD, iYYYY')                  // "Ramadan 1, 1444"
formatHijriDate(d, 'iEEEE, iD iMMMM iYYYY ioooo')      // "Yawm al-Khamis, 1 Ramadan 1444 AH"
```

---

### `isValidHijriDate(hy, hm, hd, options?)`

Checks whether a Hijri date is valid for the given calendar system.

```typescript
function isValidHijriDate(hy: number, hm: number, hd: number, options?: ConversionOptions): boolean
```

**Returns** `boolean`

For UAQ (default): returns `false` if `hy` is outside 1318–1500, `hm` is outside 1–12, or `hd` exceeds the actual days in that month.

For FCNA: `hy` must be ≥ 1, `hm` must be 1–12, and `hd` must not exceed the computed FCNA month length.

**Example**

```javascript
isValidHijriDate(1444, 9, 1)                          // true
isValidHijriDate(1444, 9, 30)                         // false - Ramadan 1444 has 29 days (UAQ)
isValidHijriDate(1317, 1, 1)                          // false - before table range
isValidHijriDate(1501, 1, 1)                          // false - sentinel boundary
isValidHijriDate(1, 1, 1, { calendar: 'fcna' })       // true  - FCNA supports all years
isValidHijriDate(1600, 1, 1, { calendar: 'fcna' })    // true  - beyond UAQ table, FCNA computed
```

---

## Types

```typescript
interface HijriDate {
  hy: number; // Hijri year
  hm: number; // Hijri month (1–12)
  hd: number; // Hijri day (1–30)
}

// Calendar system selector.
// 'uaq': Umm al-Qura (default): table-based, covers 1318–1500 H.
// 'fcna': FCNA/ISNA: astronomical calculation, works for all Hijri years >= 1 AH.
type CalendarSystem = 'uaq' | 'fcna';

interface ConversionOptions {
  calendar?: CalendarSystem;
}

interface HijriYearRecord {
  hy:  number; // Hijri year
  dpm: number; // days-per-month bitmask
  gy:  number; // Gregorian year of 1 Muharram
  gm:  number; // Gregorian month of 1 Muharram
  gd:  number; // Gregorian day of 1 Muharram
}
```

---

## Type exports

```typescript
import type {
  HijriDate,         // { hy, hm, hd }
  HijriYearRecord,   // UAQ table row
  CalendarSystem,    // 'uaq' | 'fcna'
  ConversionOptions, // { calendar?: CalendarSystem }
} from 'luxon-hijri';
```

## Data exports

```javascript
import {
  hDatesTable,    // HijriYearRecord[] - 184 entries (183 real years + 1 sentinel)
  hmLong,         // string[12] - full month names
  hmMedium,       // string[12] - medium month names
  hmShort,        // string[12] - abbreviated month names
  hwLong,         // string[7] - full weekday names (Sunday-first order)
  hwShort,        // string[7] - abbreviated weekday names
  hwNumeric,      // number[7] - weekday numbers (1-7, Sunday=1)
  formatPatterns, // Record<string, string> - token reference map
} from 'luxon-hijri';
```

**Month name arrays** (index 0 = Muharram, index 11 = Dhul Hijjah)

| Index | `hmLong` | `hmMedium` | `hmShort` |
| --- | --- | --- | --- |
| 0 | Muharram | Muharram | Muh |
| 1 | Safar | Safar | Saf |
| 2 | Rabi'l Awwal | Rabi1 | Ra1 |
| 3 | Rabi'l Thani | Rabi2 | Ra2 |
| 4 | Jumadal Awwal | Jumada1 | Ju1 |
| 5 | Jumadal Thani | Jumada2 | Ju2 |
| 6 | Rajab | Rajab | Raj |
| 7 | Sha'ban | Shaban | Shb |
| 8 | Ramadan | Ramadan | Ram |
| 9 | Shawwal | Shawwal | Shw |
| 10 | Dhul Qi'dah | Dhul-Qidah | DhQ |
| 11 | Dhul Hijjah | Dhul-Hijjah | DhH |

**Weekday arrays** (index 0 = Sunday, index 6 = Saturday)

| Index | `hwLong` | `hwShort` | `hwNumeric` |
| --- | --- | --- | --- |
| 0 | Yawm al-Ahad | Ahad | 1 |
| 1 | Yawm al-Ithnayn | Ithn | 2 |
| 2 | Yawm ath-Thulatha' | Thul | 3 |
| 3 | Yawm al-Arba`a' | Arba | 4 |
| 4 | Yawm al-Khamis | Kham | 5 |
| 5 | Yawm al-Jum`a | Jum`a | 6 |
| 6 | Yawm as-Sabt | Sabt | 7 |

---

[Home](Home) . [Architecture](Architecture) . [Hijri Calendar](Hijri-Calendar)
