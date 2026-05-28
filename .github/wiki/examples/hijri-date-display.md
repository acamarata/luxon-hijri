# Example: Hijri Date Display

Format today's date as a Hijri date string in multiple formats.

```js
import { toHijri, formatHijriDate } from 'luxon-hijri';

const today = new Date();
const h     = toHijri(today);

if (!h) {
  console.log('Date outside supported range');
  process.exit(1);
}

const formats = [
  { label: 'Short',    pattern: 'DD/MM/YYYY'       },
  { label: 'Medium',   pattern: 'D MMMM YYYY'      },
  { label: 'Long',     pattern: 'D MMMM YYYY AH'   },
  { label: 'Compact',  pattern: 'D/M/YY'            },
];

console.log(`Gregorian: ${today.toDateString()}\n`);

for (const { label, pattern } of formats) {
  console.log(`${label.padEnd(10)} ${formatHijriDate(h, pattern)}`);
}
```

Sample output (run on 2025-03-20):

```
Gregorian: Thu Mar 20 2025

Short      20/09/1446
Medium     20 Ramadan 1446
Long       20 Ramadan 1446 AH
Compact    20/9/46
```
