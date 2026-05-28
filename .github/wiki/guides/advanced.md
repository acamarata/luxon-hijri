# Advanced Usage

## Format tokens

`formatHijriDate` supports these tokens:

| Token | Example | Description |
|-------|---------|-------------|
| `D`   | `1`–`30` | Hijri day, no padding |
| `DD`  | `01`–`30` | Hijri day, zero-padded |
| `M`   | `1`–`12` | Hijri month number, no padding |
| `MM`  | `01`–`12` | Hijri month number, zero-padded |
| `MMMM` | `Ramadan` | Full Hijri month name |
| `MMMMM` | `Ramaḍān` (transliteration variant) | Extended name (where available) |
| `YY`  | `46`    | Last two digits of Hijri year |
| `YYYY` | `1446` | Full Hijri year |

```js
import { toHijri, formatHijriDate } from 'luxon-hijri';

const h = toHijri(new Date('2025-03-20'));

console.log(formatHijriDate(h, 'DD/MM/YYYY'));    // 20/09/1446
console.log(formatHijriDate(h, 'D MMMM YYYY'));   // 20 Ramadan 1446
console.log(formatHijriDate(h, 'D MMMM YYYY AH')); // 20 Ramadan 1446 AH
```

## Hijri date arithmetic with Luxon

Luxon handles Gregorian arithmetic. Combine with hijri-core conversions for Hijri-aware date math:

```js
import { DateTime } from 'luxon';
import { toHijri, toGregorian, daysInHijriMonth } from 'luxon-hijri';

// Find the last day of this Ramadan
const today = new Date();
const h = toHijri(today);

if (h) {
  const lastDay  = daysInHijriMonth(h.hy, 9);   // 29 or 30
  const eidStart = toGregorian(h.hy, 10, 1);     // 1 Shawwal

  const eid = DateTime.fromJSDate(eidStart);
  console.log(`Eid al-Fitr ${h.hy}: ${eid.toFormat('MMMM d, yyyy')}`);
}
```

## Generating a Hijri month calendar

```js
import { toGregorian, daysInHijriMonth } from 'luxon-hijri';
import { DateTime } from 'luxon';

const HY = 1446;
const HM = 9; // Ramadan

const days  = daysInHijriMonth(HY, HM);
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
