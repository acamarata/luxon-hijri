# Quick Start

Five minutes from install to formatted Hijri dates.

## Install

```sh
npm install luxon-hijri
```

`luxon` is a peer dependency. If it is not already in your project:

```sh
npm install luxon
```

## Convert today's date to Hijri

```js
import { toHijri } from 'luxon-hijri';

const today = new Date();
const h     = toHijri(today);

if (h) {
  console.log(`${h.hd}/${h.hm}/${h.hy} AH`);
}
```

## Format a Hijri date

```js
import { toHijri, formatHijriDate } from 'luxon-hijri';

const h = toHijri(new Date('2025-03-20'));

if (h) {
  console.log(formatHijriDate(h, 'iD iMMMM iYYYY ioooo'));
  // 20 Ramadan 1446 AH
}
```

## Convert Hijri to Gregorian

```js
import { toGregorian } from 'luxon-hijri';

const greg = toGregorian(1446, 9, 1);
console.log(greg.toISOString().slice(0, 10));
// 2025-03-01
```

## Use with Luxon DateTime

```js
import { DateTime } from 'luxon';
import { toHijri, formatHijriDate } from 'luxon-hijri';

const dt  = DateTime.fromISO('2025-03-20');
const h   = toHijri(dt.toJSDate());

if (h) {
  const formatted = formatHijriDate(h, 'iD iMMMM iYYYY');
  console.log(`${dt.toFormat('DD')} = ${formatted} AH`);
  // March 20, 2025 = 20 Ramadan 1446 AH
}
```

## Choosing a calendar

```js
import { toHijri } from 'luxon-hijri';

const d = new Date('2025-03-20');

// Umm al-Qura (default, Saudi Arabia)
const uaq  = toHijri(d, { calendar: 'uaq' });

// Fiqh Council of North America (North America)
const fcna = toHijri(d, { calendar: 'fcna' });

console.log(uaq?.hd, uaq?.hm, uaq?.hy);
console.log(fcna?.hd, fcna?.hm, fcna?.hy);
```

## Out-of-range dates

`toHijri` returns `null` when the date is outside the UAQ table range (before 1900-04-30 or after 2077-11-16). Check before using the result:

```js
import { toHijri } from 'luxon-hijri';

const h = toHijri(new Date('1800-01-01'));
if (h === null) {
  console.log('Date outside supported range');
}
```

## Next steps

- [API Reference](../API-Reference) — all functions, format tokens, types
- [Advanced Guide](advanced) — date arithmetic, iteration, format tokens, FCNA vs UAQ
- [Hijri Calendar](../Hijri-Calendar) — background on the Hijri calendar system
