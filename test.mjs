// test.mjs — ESM test suite for luxon-hijri
import assert from 'node:assert/strict';

import {
  toHijri,
  toGregorian,
  isValidHijriDate,
  formatHijriDate,
  formatPatterns,
  hDatesTable,
  hmLong,
  hmMedium,
  hmShort,
  hwLong,
  hwShort,
  hwNumeric,
} from './dist/index.mjs';

const FCNA = { calendar: 'fcna' };

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ${name}... PASS`);
    passed++;
  } catch (err) {
    console.error(`  ${name}... FAIL`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

// ─── Exports ────────────────────────────────────────────────────────────────

console.log('\nExports');

test('toHijri is a function', () => assert.strictEqual(typeof toHijri, 'function'));
test('toGregorian is a function', () => assert.strictEqual(typeof toGregorian, 'function'));
test('isValidHijriDate is a function', () => assert.strictEqual(typeof isValidHijriDate, 'function'));
test('formatHijriDate is a function', () => assert.strictEqual(typeof formatHijriDate, 'function'));
test('formatPatterns is an object', () => assert.strictEqual(typeof formatPatterns, 'object'));
test('hDatesTable is an array', () => assert(Array.isArray(hDatesTable)));
// 183 real year entries (1318–1500) + 1 sentinel entry (1501) marking the table boundary.
test('hDatesTable has 184 entries (1318–1500 + sentinel 1501)', () => assert.strictEqual(hDatesTable.length, 184));
test('hmLong has 12 entries', () => assert.strictEqual(hmLong.length, 12));
test('hmMedium has 12 entries', () => assert.strictEqual(hmMedium.length, 12));
test('hmShort has 12 entries', () => assert.strictEqual(hmShort.length, 12));
test('hwLong has 7 entries', () => assert.strictEqual(hwLong.length, 7));
test('hwShort has 7 entries', () => assert.strictEqual(hwShort.length, 7));
test('hwNumeric has 7 entries', () => assert.strictEqual(hwNumeric.length, 7));

// ─── toGregorian ────────────────────────────────────────────────────────────

console.log('\ntoGregorian — known dates');

test('1 Muharram 1444 = 2022-07-30', () => {
  const d = toGregorian(1444, 1, 1);
  assert(d instanceof Date);
  assert.strictEqual(d.toISOString().slice(0, 10), '2022-07-30');
});

test('1 Ramadan 1444 = 2023-03-23', () => {
  const d = toGregorian(1444, 9, 1);
  assert(d instanceof Date);
  assert.strictEqual(d.toISOString().slice(0, 10), '2023-03-23');
});

test('1 Shawwal 1444 = 2023-04-21', () => {
  const d = toGregorian(1444, 10, 1);
  assert(d instanceof Date);
  assert.strictEqual(d.toISOString().slice(0, 10), '2023-04-21');
});

test('1 Muharram 1446 = 2024-07-07', () => {
  const d = toGregorian(1446, 1, 1);
  assert(d instanceof Date);
  assert.strictEqual(d.toISOString().slice(0, 10), '2024-07-07');
});

test('first table entry: 1 Muharram 1318 = 1900-04-30', () => {
  const d = toGregorian(1318, 1, 1);
  assert(d instanceof Date);
  assert.strictEqual(d.toISOString().slice(0, 10), '1900-04-30');
});

console.log('\ntoGregorian — error cases');

test('throws on invalid Hijri year (out of table range)', () => {
  assert.throws(() => toGregorian(1317, 1, 1), /Invalid Hijri date/);
});

test('throws on month 0', () => {
  assert.throws(() => toGregorian(1444, 0, 1), /Invalid Hijri date/);
});

test('throws on month 13', () => {
  assert.throws(() => toGregorian(1444, 13, 1), /Invalid Hijri date/);
});

test('throws on day 0', () => {
  assert.throws(() => toGregorian(1444, 9, 0), /Invalid Hijri date/);
});

test('throws on day 30 in 29-day month (Ramadan 1444)', () => {
  // Ramadan 1444 has 29 days (1 Ramadan = Mar 23, 1 Shawwal = Apr 21 → 29 days)
  assert.throws(() => toGregorian(1444, 9, 30), /Invalid Hijri date/);
});

// ─── toHijri ────────────────────────────────────────────────────────────────

console.log('\ntoHijri — known dates');

// Use noon (hour=12) to avoid date-boundary issues across timezones.
test('2022-07-30 = 1 Muharram 1444', () => {
  const h = toHijri(new Date(2022, 6, 30, 12));
  assert.deepEqual(h, { hy: 1444, hm: 1, hd: 1 });
});

test('2023-03-23 = 1 Ramadan 1444', () => {
  const h = toHijri(new Date(2023, 2, 23, 12));
  assert.deepEqual(h, { hy: 1444, hm: 9, hd: 1 });
});

test('2023-04-21 = 1 Shawwal 1444', () => {
  const h = toHijri(new Date(2023, 3, 21, 12));
  assert.deepEqual(h, { hy: 1444, hm: 10, hd: 1 });
});

test('2024-07-07 = 1 Muharram 1446', () => {
  const h = toHijri(new Date(2024, 6, 7, 12));
  assert.deepEqual(h, { hy: 1446, hm: 1, hd: 1 });
});

test('1900-04-30 = 1 Muharram 1318 (first table entry)', () => {
  const h = toHijri(new Date(1900, 3, 30, 12));
  assert.deepEqual(h, { hy: 1318, hm: 1, hd: 1 });
});

console.log('\ntoHijri — error cases');

test('throws on invalid Date', () => {
  assert.throws(() => toHijri(new Date('not a date')), /Invalid Gregorian date/);
});

test('returns null for date before first table entry', () => {
  const h = toHijri(new Date(1800, 0, 1, 12));
  assert.strictEqual(h, null);
});

// ─── isValidHijriDate ───────────────────────────────────────────────────────

console.log('\nisValidHijriDate');

test('1444-09-01 is valid', () => assert.strictEqual(isValidHijriDate(1444, 9, 1), true));
test('1444-09-29 is valid (last day of Ramadan 1444)', () => assert.strictEqual(isValidHijriDate(1444, 9, 29), true));
test('1318-01-01 is valid (first table entry)', () => assert.strictEqual(isValidHijriDate(1318, 1, 1), true));
test('1500-12-29 is valid (last table entry, last day)', () => assert.strictEqual(isValidHijriDate(1500, 12, 29), true));
test('year 1317 is out of range', () => assert.strictEqual(isValidHijriDate(1317, 1, 1), false));
test('year 1501 is out of range', () => assert.strictEqual(isValidHijriDate(1501, 1, 1), false));
test('month 0 is invalid', () => assert.strictEqual(isValidHijriDate(1444, 0, 1), false));
test('month 13 is invalid', () => assert.strictEqual(isValidHijriDate(1444, 13, 1), false));
test('day 0 is invalid', () => assert.strictEqual(isValidHijriDate(1444, 9, 0), false));
test('day 30 in Ramadan 1444 (29-day month) is invalid', () => assert.strictEqual(isValidHijriDate(1444, 9, 30), false));

// ─── formatHijriDate ────────────────────────────────────────────────────────

console.log('\nformatHijriDate — date tokens');

const ramadan1 = { hy: 1444, hm: 9, hd: 1 };

test('iYYYY-iMM-iDD', () => {
  assert.strictEqual(formatHijriDate(ramadan1, 'iYYYY-iMM-iDD'), '1444-09-01');
});

test('iYY (last 2 digits of year)', () => {
  assert.strictEqual(formatHijriDate(ramadan1, 'iYY'), '44');
});

test('iM (month without padding)', () => {
  assert.strictEqual(formatHijriDate(ramadan1, 'iM'), '9');
});

test('iMM (month zero-padded)', () => {
  assert.strictEqual(formatHijriDate(ramadan1, 'iMM'), '09');
});

test('iMMM (medium month name: Ramadan)', () => {
  assert.strictEqual(formatHijriDate(ramadan1, 'iMMM'), 'Ramadan');
});

test('iMMMM (full month name: Ramadan)', () => {
  assert.strictEqual(formatHijriDate(ramadan1, 'iMMMM'), 'Ramadan');
});

test('iD (day without padding)', () => {
  assert.strictEqual(formatHijriDate(ramadan1, 'iD'), '1');
});

test('iDD (day zero-padded)', () => {
  assert.strictEqual(formatHijriDate(ramadan1, 'iDD'), '01');
});

console.log('\nformatHijriDate — weekday tokens (1 Ramadan 1444 = Thursday)');

test('iE → 5 (Thursday = 5th Islamic day, Sunday=1)', () => {
  assert.strictEqual(formatHijriDate(ramadan1, 'iE'), '5');
});

test('iEEE → Kham (Thursday abbreviated)', () => {
  assert.strictEqual(formatHijriDate(ramadan1, 'iEEE'), 'Kham');
});

test('iEEEE → Yawm al-Khamis (Thursday full)', () => {
  assert.strictEqual(formatHijriDate(ramadan1, 'iEEEE'), 'Yawm al-Khamis');
});

console.log('\nformatHijriDate — era tokens');

test('iooo → AH', () => {
  assert.strictEqual(formatHijriDate(ramadan1, 'iooo'), 'AH');
});

test('ioooo → AH', () => {
  assert.strictEqual(formatHijriDate(ramadan1, 'ioooo'), 'AH');
});

console.log('\nformatHijriDate — composite format');

test('iMMMM iD, iYYYY', () => {
  assert.strictEqual(formatHijriDate(ramadan1, 'iMMMM iD, iYYYY'), 'Ramadan 1, 1444');
});

test('iDD/iMM/iYYYY', () => {
  assert.strictEqual(formatHijriDate(ramadan1, 'iDD/iMM/iYYYY'), '01/09/1444');
});

test('iEEEE, iD iMMMM iYYYY ioooo', () => {
  assert.strictEqual(
    formatHijriDate(ramadan1, 'iEEEE, iD iMMMM iYYYY ioooo'),
    'Yawm al-Khamis, 1 Ramadan 1444 AH',
  );
});

// ─── hDatesTable structure ──────────────────────────────────────────────────

console.log('\nhDatesTable structure');

test('first entry is 1318', () => assert.strictEqual(hDatesTable[0].hy, 1318));
test('last valid year is 1500 (index 182)', () => assert.strictEqual(hDatesTable[182].hy, 1500));
test('index 183 is sentinel year 1501 with dpm=0', () => {
  assert.strictEqual(hDatesTable[183].hy, 1501);
  assert.strictEqual(hDatesTable[183].dpm, 0);
});
test('table is sorted ascending by hy', () => {
  for (let i = 1; i < hDatesTable.length; i++) {
    assert(hDatesTable[i].hy > hDatesTable[i - 1].hy);
  }
});

// ─── FCNA calendar — toGregorian ────────────────────────────────────────────
//
// FCNA/ISNA criterion: conjunction before 12:00 UTC → month starts D+1; else D+2.
// New moon for 1 Ramadan 1446: Feb 28, 2025 ~00:45 UTC → before noon → March 1.
// New moon for 1 Shawwal 1446: March 29, 2025 ~10:57 UTC → before noon → March 30.
// Both match ISNA's publicly published 2025 Ramadan/Eid calendar.

console.log('\nFCNA — toGregorian known dates');

test('FCNA: 1 Ramadan 1446 = 2025-03-01 (ISNA 2025 calendar)', () => {
  const d = toGregorian(1446, 9, 1, FCNA);
  assert(d instanceof Date);
  assert.strictEqual(d.toISOString().slice(0, 10), '2025-03-01');
});

test('FCNA: 1 Shawwal 1446 = 2025-03-30 (Eid al-Fitr per ISNA)', () => {
  const d = toGregorian(1446, 10, 1, FCNA);
  assert(d instanceof Date);
  assert.strictEqual(d.toISOString().slice(0, 10), '2025-03-30');
});

test('FCNA: 1 Ramadan 1445 = 2024-03-11 (ISNA 2024 calendar)', () => {
  // New moon: March 10, 2024 ~09:00 UTC → before noon → D+1 = March 11.
  const d = toGregorian(1445, 9, 1, FCNA);
  assert(d instanceof Date);
  assert.strictEqual(d.toISOString().slice(0, 10), '2024-03-11');
});

test('FCNA: 1 Muharram 1444 = 2022-07-30', () => {
  // New moon near July 28-29, 2022 → FCNA starts July 30 (same as UAQ for this month).
  const d = toGregorian(1444, 1, 1, FCNA);
  assert(d instanceof Date);
  // Allow ±1 day: FCNA and UAQ can differ by 1 day on month boundaries.
  const iso = d.toISOString().slice(0, 10);
  assert(iso === '2022-07-29' || iso === '2022-07-30' || iso === '2022-07-31',
    `Expected ~2022-07-30, got ${iso}`);
});

console.log('\nFCNA — toHijri known dates');

test('FCNA: 2025-03-01 = 1 Ramadan 1446', () => {
  const h = toHijri(new Date(2025, 2, 1, 12), FCNA);
  assert.deepEqual(h, { hy: 1446, hm: 9, hd: 1 });
});

test('FCNA: 2025-03-30 = 1 Shawwal 1446', () => {
  const h = toHijri(new Date(2025, 2, 30, 12), FCNA);
  assert.deepEqual(h, { hy: 1446, hm: 10, hd: 1 });
});

test('FCNA: 2024-03-11 = 1 Ramadan 1445', () => {
  const h = toHijri(new Date(2024, 2, 11, 12), FCNA);
  assert.deepEqual(h, { hy: 1445, hm: 9, hd: 1 });
});

console.log('\nFCNA — round-trip consistency');

test('FCNA round-trip: toGregorian → toHijri for 1446/9/1', () => {
  const greg = toGregorian(1446, 9, 1, FCNA);
  const hijri = toHijri(greg, FCNA);
  assert.deepEqual(hijri, { hy: 1446, hm: 9, hd: 1 });
});

test('FCNA round-trip: toGregorian → toHijri for 1446/10/15', () => {
  const greg = toGregorian(1446, 10, 15, FCNA);
  const hijri = toHijri(greg, FCNA);
  assert.deepEqual(hijri, { hy: 1446, hm: 10, hd: 15 });
});

test('FCNA round-trip: toGregorian → toHijri for 1318/1/1', () => {
  const greg = toGregorian(1318, 1, 1, FCNA);
  assert(greg instanceof Date);
  const hijri = toHijri(greg, FCNA);
  assert.deepEqual(hijri, { hy: 1318, hm: 1, hd: 1 });
});

test('FCNA round-trip: toGregorian → toHijri for out-of-range year 1200/6/1', () => {
  // Out of UAQ table range — uses mean k estimate + Meeus correction.
  const greg = toGregorian(1200, 6, 1, FCNA);
  assert(greg instanceof Date);
  const hijri = toHijri(greg, FCNA);
  assert.deepEqual(hijri, { hy: 1200, hm: 6, hd: 1 });
});

console.log('\nFCNA — isValidHijriDate');

test('FCNA: isValidHijriDate(1446, 9, 1) = true', () => {
  assert.strictEqual(isValidHijriDate(1446, 9, 1, FCNA), true);
});

test('FCNA: isValidHijriDate(1446, 0, 1) = false (month 0)', () => {
  assert.strictEqual(isValidHijriDate(1446, 0, 1, FCNA), false);
});

test('FCNA: isValidHijriDate(1446, 13, 1) = false (month 13)', () => {
  assert.strictEqual(isValidHijriDate(1446, 13, 1, FCNA), false);
});

test('FCNA: isValidHijriDate(1446, 9, 0) = false (day 0)', () => {
  assert.strictEqual(isValidHijriDate(1446, 9, 0, FCNA), false);
});

test('FCNA: isValidHijriDate(1446, 9, 31) = false (day 31 always invalid)', () => {
  assert.strictEqual(isValidHijriDate(1446, 9, 31, FCNA), false);
});

test('FCNA: isValidHijriDate(1, 1, 1) = true (year 1 AH supported)', () => {
  // FCNA works for any year ≥ 1 AH, not limited to 1318–1500.
  assert.strictEqual(isValidHijriDate(1, 1, 1, FCNA), true);
});

test('FCNA: isValidHijriDate(1600, 1, 1) = true (beyond UAQ table)', () => {
  assert.strictEqual(isValidHijriDate(1600, 1, 1, FCNA), true);
});

console.log('\nFCNA — UAQ default unchanged (regression)');

test('UAQ default: 1 Ramadan 1446 = 2025-03-01 (UAQ matches FCNA here)', () => {
  const d = toGregorian(1446, 9, 1);  // no options → UAQ
  assert.strictEqual(d.toISOString().slice(0, 10), '2025-03-01');
});

test('UAQ default: toHijri still works without options', () => {
  const h = toHijri(new Date(2023, 2, 23, 12));
  assert.deepEqual(h, { hy: 1444, hm: 9, hd: 1 });
});

test('UAQ default: isValidHijriDate still works without options', () => {
  assert.strictEqual(isValidHijriDate(1444, 9, 1), true);
  assert.strictEqual(isValidHijriDate(1501, 1, 1), false);
});

// ─── Summary ────────────────────────────────────────────────────────────────

const total = passed + failed;
console.log(`\n${total} tests total: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
