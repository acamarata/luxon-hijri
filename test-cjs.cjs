// test-cjs.cjs — CJS test suite for luxon-hijri
'use strict';
const { describe, it } = require('node:test');
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

const FCNA = { calendar: 'fcna' };

// ─── Exports ────────────────────────────────────────────────────────────────

describe('CJS exports', () => {
  it('toHijri is a function', () => assert.strictEqual(typeof toHijri, 'function'));
  it('toGregorian is a function', () => assert.strictEqual(typeof toGregorian, 'function'));
  it('isValidHijriDate is a function', () =>
    assert.strictEqual(typeof isValidHijriDate, 'function'));
  it('formatHijriDate is a function', () => assert.strictEqual(typeof formatHijriDate, 'function'));
  it('hDatesTable has 184 entries', () => assert.strictEqual(hDatesTable.length, 184));
  it('hwLong has 7 entries', () => assert.strictEqual(hwLong.length, 7));
  it('hwShort has 7 entries', () => assert.strictEqual(hwShort.length, 7));
  it('hwNumeric has 7 entries', () => assert.strictEqual(hwNumeric.length, 7));
});

// ─── Core conversions ──────────────────────────────────────────────────────

describe('CJS core conversions', () => {
  it('toGregorian(1444, 1, 1) = 2022-07-30', () => {
    const d = toGregorian(1444, 1, 1);
    assert(d instanceof Date);
    assert.strictEqual(d.toISOString().slice(0, 10), '2022-07-30');
  });
  it('toGregorian(1444, 9, 1) = 2023-03-23', () => {
    const d = toGregorian(1444, 9, 1);
    assert.strictEqual(d.toISOString().slice(0, 10), '2023-03-23');
  });
  it('toHijri(2022-07-30) = 1 Muharram 1444', () => {
    const h = toHijri(new Date(2022, 6, 30, 12));
    assert.deepEqual(h, { hy: 1444, hm: 1, hd: 1 });
  });
  it('toHijri(2023-03-23) = 1 Ramadan 1444', () => {
    const h = toHijri(new Date(2023, 2, 23, 12));
    assert.deepEqual(h, { hy: 1444, hm: 9, hd: 1 });
  });
});

// ─── Validation ─────────────────────────────────────────────────────────────

describe('CJS validation', () => {
  it('isValidHijriDate(1444, 9, 1) = true', () =>
    assert.strictEqual(isValidHijriDate(1444, 9, 1), true));
  it('isValidHijriDate(1444, 0, 1) = false', () =>
    assert.strictEqual(isValidHijriDate(1444, 0, 1), false));
  it('isValidHijriDate(1317, 1, 1) = false (out of range)', () =>
    assert.strictEqual(isValidHijriDate(1317, 1, 1), false));
});

// ─── Formatting ─────────────────────────────────────────────────────────────

const ramadan1 = { hy: 1444, hm: 9, hd: 1 };

describe('CJS formatting', () => {
  it('iYYYY-iMM-iDD = 1444-09-01', () => {
    assert.strictEqual(formatHijriDate(ramadan1, 'iYYYY-iMM-iDD'), '1444-09-01');
  });
  it('iMMMM = Ramadan', () => {
    assert.strictEqual(formatHijriDate(ramadan1, 'iMMMM'), 'Ramadan');
  });
  it('iEEEE = Yawm al-Khamis (Thursday)', () => {
    assert.strictEqual(formatHijriDate(ramadan1, 'iEEEE'), 'Yawm al-Khamis');
  });
  it('iooo = AH', () => {
    assert.strictEqual(formatHijriDate(ramadan1, 'iooo'), 'AH');
  });
});

describe('CJS formatHijriDate - invalid month', () => {
  it('throws for month 0', () => {
    assert.throws(
      () => formatHijriDate({ hy: 1444, hm: 0, hd: 1 }, 'iMMMM'),
      /Hijri month must be 1-12/,
    );
  });
  it('throws for month 13', () => {
    assert.throws(
      () => formatHijriDate({ hy: 1444, hm: 13, hd: 1 }, 'iMMMM'),
      /Hijri month must be 1-12/,
    );
  });
});

// ─── FCNA calendar ──────────────────────────────────────────────────────────

describe('CJS FCNA calendar', () => {
  it('1 Ramadan 1446 = 2025-03-01', () => {
    const d = toGregorian(1446, 9, 1, FCNA);
    assert(d instanceof Date);
    assert.strictEqual(d.toISOString().slice(0, 10), '2025-03-01');
  });
  it('2025-03-01 = 1 Ramadan 1446', () => {
    const h = toHijri(new Date(2025, 2, 1, 12), FCNA);
    assert.deepEqual(h, { hy: 1446, hm: 9, hd: 1 });
  });
  it('isValidHijriDate(1446, 9, 1) = true', () => {
    assert.strictEqual(isValidHijriDate(1446, 9, 1, FCNA), true);
  });
  it('isValidHijriDate(1, 1, 1) = true (year 1 AH)', () => {
    assert.strictEqual(isValidHijriDate(1, 1, 1, FCNA), true);
  });
  it('round-trip 1446/9/1', () => {
    const greg = toGregorian(1446, 9, 1, FCNA);
    const hijri = toHijri(greg, FCNA);
    assert.deepEqual(hijri, { hy: 1446, hm: 9, hd: 1 });
  });
});
