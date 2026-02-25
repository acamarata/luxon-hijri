// test-cjs.cjs — CJS test suite for luxon-hijri
'use strict';
const assert = require('node:assert/strict');

const {
  toHijri,
  toGregorian,
  isValidHijriDate,
  formatHijriDate,
  hDatesTable,
  hwLong,
  hwShort,
  hwNumeric,
} = require('./dist/index.cjs');

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

console.log('\nCJS exports');

test('toHijri is a function', () => assert.strictEqual(typeof toHijri, 'function'));
test('toGregorian is a function', () => assert.strictEqual(typeof toGregorian, 'function'));
test('isValidHijriDate is a function', () => assert.strictEqual(typeof isValidHijriDate, 'function'));
test('formatHijriDate is a function', () => assert.strictEqual(typeof formatHijriDate, 'function'));
test('hDatesTable has 184 entries (183 real + 1 sentinel)', () => assert.strictEqual(hDatesTable.length, 184));
test('hwLong has 7 entries', () => assert.strictEqual(hwLong.length, 7));
test('hwShort has 7 entries', () => assert.strictEqual(hwShort.length, 7));
test('hwNumeric has 7 entries', () => assert.strictEqual(hwNumeric.length, 7));

// ─── Core conversions ────────────────────────────────────────────────────────

console.log('\nCJS core conversions');

test('toGregorian(1444, 1, 1) = 2022-07-30', () => {
  const d = toGregorian(1444, 1, 1);
  assert(d instanceof Date);
  assert.strictEqual(d.toISOString().slice(0, 10), '2022-07-30');
});

test('toGregorian(1444, 9, 1) = 2023-03-23', () => {
  const d = toGregorian(1444, 9, 1);
  assert.strictEqual(d.toISOString().slice(0, 10), '2023-03-23');
});

test('toHijri(2022-07-30) = 1 Muharram 1444', () => {
  const h = toHijri(new Date(2022, 6, 30, 12));
  assert.deepEqual(h, { hy: 1444, hm: 1, hd: 1 });
});

test('toHijri(2023-03-23) = 1 Ramadan 1444', () => {
  const h = toHijri(new Date(2023, 2, 23, 12));
  assert.deepEqual(h, { hy: 1444, hm: 9, hd: 1 });
});

// ─── Validation ──────────────────────────────────────────────────────────────

console.log('\nCJS validation');

test('isValidHijriDate(1444, 9, 1) = true', () => assert.strictEqual(isValidHijriDate(1444, 9, 1), true));
test('isValidHijriDate(1444, 0, 1) = false', () => assert.strictEqual(isValidHijriDate(1444, 0, 1), false));
test('isValidHijriDate(1317, 1, 1) = false (out of range)', () => assert.strictEqual(isValidHijriDate(1317, 1, 1), false));

// ─── Formatting ──────────────────────────────────────────────────────────────

console.log('\nCJS formatting');

const ramadan1 = { hy: 1444, hm: 9, hd: 1 };

test('iYYYY-iMM-iDD = 1444-09-01', () => {
  assert.strictEqual(formatHijriDate(ramadan1, 'iYYYY-iMM-iDD'), '1444-09-01');
});

test('iMMMM = Ramadan', () => {
  assert.strictEqual(formatHijriDate(ramadan1, 'iMMMM'), 'Ramadan');
});

test('iEEEE = Yawm al-Khamis (Thursday)', () => {
  assert.strictEqual(formatHijriDate(ramadan1, 'iEEEE'), 'Yawm al-Khamis');
});

test('iooo = AH', () => {
  assert.strictEqual(formatHijriDate(ramadan1, 'iooo'), 'AH');
});

// ─── FCNA calendar ───────────────────────────────────────────────────────────

console.log('\nCJS FCNA calendar');

const FCNA = { calendar: 'fcna' };

test('FCNA: 1 Ramadan 1446 = 2025-03-01', () => {
  const d = toGregorian(1446, 9, 1, FCNA);
  assert(d instanceof Date);
  assert.strictEqual(d.toISOString().slice(0, 10), '2025-03-01');
});

test('FCNA: 2025-03-01 = 1 Ramadan 1446', () => {
  const h = toHijri(new Date(2025, 2, 1, 12), FCNA);
  assert.deepEqual(h, { hy: 1446, hm: 9, hd: 1 });
});

test('FCNA: isValidHijriDate(1446, 9, 1) = true', () => {
  assert.strictEqual(isValidHijriDate(1446, 9, 1, FCNA), true);
});

test('FCNA: isValidHijriDate(1, 1, 1) = true (year 1 AH)', () => {
  assert.strictEqual(isValidHijriDate(1, 1, 1, FCNA), true);
});

test('FCNA: round-trip 1446/9/1', () => {
  const greg = toGregorian(1446, 9, 1, FCNA);
  const hijri = toHijri(greg, FCNA);
  assert.deepEqual(hijri, { hy: 1446, hm: 9, hd: 1 });
});

// ─── Summary ────────────────────────────────────────────────────────────────

const total = passed + failed;
console.log(`\n${total} tests total: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
