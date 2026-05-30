# Advanced Usage

## Format tokens

All Hijri-specific tokens use the `i` prefix. For the full token table, see the [API Reference](../API-Reference).

Common tokens:

| Token | Example | Description |
|-------|---------|-------------|
| `iD`   | `1`–`30` | Hijri day, no padding |
| `iDD`  | `01`–`30` | Hijri day, zero-padded |
| `iM`   | `1`–`12` | Hijri month number, no padding |
| `iMM`  | `01`–`12` | Hijri month number, zero-padded |
| `iMMMM` | `Ramadan` | Full Hijri month name |
| `iYY`  | `46`    | Last two digits of Hijri year |
| `iYYYY` | `1446` | Full Hijri year |
| `ioooo` | `AH` | Hijri era |

```js
import { toHijri, formatHijriDate } from 'luxon-hijri';

const h = toHijri(new Date('2025-03-20'));

console.log(formatHijriDate(h, 'iDD/iMM/iYYYY'));         // 20/09/1446
console.log(formatHijriDate(h, 'iD iMMMM iYYYY'));        // 20 Ramadan 1446
console.log(formatHijriDate(h, 'iD iMMMM iYYYY ioooo')); // 20 Ramadan 1446 AH
```

## Hijri date arithmetic with Luxon

Luxon handles Gregorian arithmetic. Use `toGregorian` to convert Hijri endpoints, then work in Gregorian:

```js
import { DateTime } from 'luxon';
import { toHijri, toGregorian } from 'luxon-hijri';

// Find when Eid al-Fitr (1 Shawwal) starts for this year
const today = new Date();
const h = toHijri(today);

if (h) {
  const eidStart = toGregorian(h.hy, 10, 1); // 1 Shawwal
  const eid = DateTime.fromJSDate(eidStart);
  console.log(`Eid al-Fitr ${h.hy}: ${eid.toFormat('MMMM d, yyyy')}`);
}
```

## Generating a Hijri month calendar

The UAQ table encodes day counts per month in a bitmask. To iterate a month, convert each Hijri day to Gregorian and stop when `toGregorian` throws:

```js
import { toGregorian } from 'luxon-hijri';
import { DateTime } from 'luxon';

const HY = 1446;
const HM = 9; // Ramadan

// Determine the month length (29 or 30 days)
let days = 29;
try { toGregorian(HY, HM, 30); days = 30; } catch (_) {}

const NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

console.log(`Ramadan ${HY}\n`);
console.log(NAMES.join('  '));

const firstGreg = DateTime.fromJSDate(toGregorian(HY, HM, 1));
let line = '     '.repeat(firstGreg.weekday % 7); // Sunday = 0

for (let d = 1; d <= days; d++) {
  const greg = DateTime.fromJSDate(toGregorian(HY, HM, d));
  line += String(d).padStart(3) + '  ';
  if (greg.weekday === 6) { // Saturday ends row
    console.log(line);
    line = '';
  }
}
if (line.trim()) console.log(line);
```

## FCNA vs UAQ differences

FCNA and UAQ can differ by a day around month transitions:

```js
import { toHijri } from 'luxon-hijri';

const borderDates = [
  new Date('2025-02-28'),
  new Date('2025-03-01'),
  new Date('2025-03-02'),
];

for (const d of borderDates) {
  const uaq  = toHijri(d, { calendar: 'uaq' });
  const fcna = toHijri(d, { calendar: 'fcna' });

  const fmt = h => h ? `${h.hd}/${h.hm}/${h.hy}` : 'null';
  console.log(`${d.toISOString().slice(0, 10)}  UAQ: ${fmt(uaq)}  FCNA: ${fmt(fcna)}`);
}
```

## Batch conversion

```js
import { toHijri } from 'luxon-hijri';

const isoList = [
  '2025-01-01', '2025-03-01', '2025-03-30',
  '2025-06-06', '2025-12-31',
];

for (const iso of isoList) {
  const h = toHijri(new Date(iso));
  const result = h ? `${h.hd}/${h.hm}/${h.hy} AH` : 'out of range';
  console.log(`${iso}  →  ${result}`);
}
```

## Related pages

- [API Reference](../API-Reference) — all functions, format tokens, types
- [Hijri Calendar](../Hijri-Calendar) — background on UAQ and FCNA calendar systems
- [Architecture](../Architecture) — internals, conversion engine, accuracy
