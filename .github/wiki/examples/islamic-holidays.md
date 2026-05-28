# Example: Islamic Holiday Calendar

Generate Gregorian dates for major Islamic observances for a given Hijri year.

```js
import { toGregorian } from 'luxon-hijri';

const HY = 1446;

const holidays = [
  { name: 'Islamic New Year',      hm:  1, hd:  1 },
  { name: 'Ashura',                hm:  1, hd: 10 },
  { name: "Mawlid al-Nabi",        hm:  3, hd: 12 },
  { name: 'Isra wal Miraj',        hm:  7, hd: 27 },
  { name: "Laylat al-Bara'ah",     hm:  8, hd: 15 },
  { name: 'Ramadan begins',        hm:  9, hd:  1 },
  { name: 'Laylat al-Qadr (27th)', hm:  9, hd: 27 },
  { name: 'Eid al-Fitr',           hm: 10, hd:  1 },
  { name: 'Arafat Day',            hm: 12, hd:  9 },
  { name: 'Eid al-Adha',           hm: 12, hd: 10 },
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

console.log(`Islamic holidays — ${HY} AH\n`);
console.log(`${'Observance'.padEnd(28)}  ${'Hijri'.padEnd(14)}  Gregorian`);
console.log('-'.repeat(64));

for (const { name, hm, hd } of holidays) {
  const greg    = toGregorian(HY, hm, hd);
  const iso     = greg.toISOString().slice(0, 10);
  const weekday = DAYS[greg.getUTCDay()];
  const hijri   = `${hd}/${hm}/${HY}`;

  console.log(`${name.padEnd(28)}  ${hijri.padEnd(14)}  ${iso} (${weekday})`);
}
```

Sample output:

```
Islamic holidays — 1446 AH

Observance                    Hijri           Gregorian
----------------------------------------------------------------
Islamic New Year              1/1/1446        2024-07-07 (Sunday)
Ashura                        10/1/1446       2024-07-16 (Tuesday)
Mawlid al-Nabi                12/3/1446       2024-09-15 (Sunday)
Isra wal Miraj                27/7/1446       2025-01-27 (Monday)
Laylat al-Bara'ah             15/8/1446       2025-02-13 (Thursday)
Ramadan begins                1/9/1446        2025-03-01 (Saturday)
Laylat al-Qadr (27th)         27/9/1446       2025-03-27 (Thursday)
Eid al-Fitr                   1/10/1446       2025-03-30 (Sunday)
Arafat Day                    9/12/1446       2025-06-05 (Thursday)
Eid al-Adha                   10/12/1446      2025-06-06 (Friday)
```
