// test.mjs — ESM test suite for luxon-hijri
import { describe, it } from 'node:test';
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

// ─── Exports ────────────────────────────────────────────────────────────────

describe('exports', () => {
  it('toHijri is a function', () => assert.strictEqual(typeof toHijri, 'function'));
  it('toGregorian is a function', () => assert.strictEqual(typeof toGregorian, 'function'));
  it('isValidHijriDate is a function', () =>
    assert.strictEqual(typeof isValidHijriDate, 'function'));
  it('formatHijriDate is a function', () => assert.strictEqual(typeof formatHijriDate, 'function'));
  it('formatPatterns is an object', () => assert.strictEqual(typeof formatPatterns, 'object'));
  it('hDatesTable is an array', () => assert(Array.isArray(hDatesTable)));
  it('hDatesTable has 184 entries (1318-1500 + sentinel 1501)', () =>
    assert.strictEqual(hDatesTable.length, 184));
  it('hmLong has 12 entries', () => assert.strictEqual(hmLong.length, 12));
  it('hmMedium has 12 entries', () => assert.strictEqual(hmMedium.length, 12));
  it('hmShort has 12 entries', () => assert.strictEqual(hmShort.length, 12));
  it('hwLong has 7 entries', () => assert.strictEqual(hwLong.length, 7));
  it('hwShort has 7 entries', () => assert.strictEqual(hwShort.length, 7));
  it('hwNumeric has 7 entries', () => assert.strictEqual(hwNumeric.length, 7));
});

// ─── toGregorian ────────────────────────────────────────────────────────────

describe('toGregorian - known dates', () => {
  it('1 Muharram 1444 = 2022-07-30', () => {
    const d = toGregorian(1444, 1, 1);
    assert(d instanceof Date);
    assert.strictEqual(d.toISOString().slice(0, 10), '2022-07-30');
  });

  it('1 Ramadan 1444 = 2023-03-23', () => {
    const d = toGregorian(1444, 9, 1);
    assert(d instanceof Date);
    assert.strictEqual(d.toISOString().slice(0, 10), '2023-03-23');
  });

  it('1 Shawwal 1444 = 2023-04-21', () => {
    const d = toGregorian(1444, 10, 1);
    assert(d instanceof Date);
    assert.strictEqual(d.toISOString().slice(0, 10), '2023-04-21');
  });

  it('1 Muharram 1446 = 2024-07-07', () => {
    const d = toGregorian(1446, 1, 1);
    assert(d instanceof Date);
    assert.strictEqual(d.toISOString().slice(0, 10), '2024-07-07');
  });

  it('first table entry: 1 Muharram 1318 = 1900-04-30', () => {
    const d = toGregorian(1318, 1, 1);
    assert(d instanceof Date);
    assert.strictEqual(d.toISOString().slice(0, 10), '1900-04-30');
  });
});

describe('toGregorian - error cases', () => {
  it('throws on invalid Hijri year (out of table range)', () => {
    assert.throws(() => toGregorian(1317, 1, 1), /Invalid Hijri date/);
  });
  it('throws on month 0', () => {
    assert.throws(() => toGregorian(1444, 0, 1), /Invalid Hijri date/);
  });
  it('throws on month 13', () => {
    assert.throws(() => toGregorian(1444, 13, 1), /Invalid Hijri date/);
  });
  it('throws on day 0', () => {
    assert.throws(() => toGregorian(1444, 9, 0), /Invalid Hijri date/);
  });
  it('throws on day 30 in 29-day month (Ramadan 1444)', () => {
    assert.throws(() => toGregorian(1444, 9, 30), /Invalid Hijri date/);
  });
});

// ─── toHijri ────────────────────────────────────────────────────────────────

describe('toHijri - known dates', () => {
  it('2022-07-30 = 1 Muharram 1444', () => {
    const h = toHijri(new Date(2022, 6, 30, 12));
    assert.deepEqual(h, { hy: 1444, hm: 1, hd: 1 });
  });
  it('2023-03-23 = 1 Ramadan 1444', () => {
    const h = toHijri(new Date(2023, 2, 23, 12));
    assert.deepEqual(h, { hy: 1444, hm: 9, hd: 1 });
  });
  it('2023-04-21 = 1 Shawwal 1444', () => {
    const h = toHijri(new Date(2023, 3, 21, 12));
    assert.deepEqual(h, { hy: 1444, hm: 10, hd: 1 });
  });
  it('2024-07-07 = 1 Muharram 1446', () => {
    const h = toHijri(new Date(2024, 6, 7, 12));
    assert.deepEqual(h, { hy: 1446, hm: 1, hd: 1 });
  });
  it('1900-04-30 = 1 Muharram 1318 (first table entry)', () => {
    const h = toHijri(new Date(1900, 3, 30, 12));
    assert.deepEqual(h, { hy: 1318, hm: 1, hd: 1 });
  });
});

describe('toHijri - error cases', () => {
  it('throws on invalid Date', () => {
    assert.throws(() => toHijri(new Date('not a date')), /Invalid Gregorian date/);
  });
  it('returns null for date before first table entry', () => {
    const h = toHijri(new Date(1800, 0, 1, 12));
    assert.strictEqual(h, null);
  });
});

// ─── isValidHijriDate ───────────────────────────────────────────────────────

describe('isValidHijriDate', () => {
  it('1444-09-01 is valid', () => assert.strictEqual(isValidHijriDate(1444, 9, 1), true));
  it('1444-09-29 is valid (last day of Ramadan 1444)', () =>
    assert.strictEqual(isValidHijriDate(1444, 9, 29), true));
  it('1318-01-01 is valid (first table entry)', () =>
    assert.strictEqual(isValidHijriDate(1318, 1, 1), true));
  it('1500-12-29 is valid (last table entry)', () =>
    assert.strictEqual(isValidHijriDate(1500, 12, 29), true));
  it('year 1317 is out of range', () => assert.strictEqual(isValidHijriDate(1317, 1, 1), false));
  it('year 1501 is out of range', () => assert.strictEqual(isValidHijriDate(1501, 1, 1), false));
  it('month 0 is invalid', () => assert.strictEqual(isValidHijriDate(1444, 0, 1), false));
  it('month 13 is invalid', () => assert.strictEqual(isValidHijriDate(1444, 13, 1), false));
  it('day 0 is invalid', () => assert.strictEqual(isValidHijriDate(1444, 9, 0), false));
  it('day 30 in Ramadan 1444 (29-day month) is invalid', () =>
    assert.strictEqual(isValidHijriDate(1444, 9, 30), false));
});

// ─── formatHijriDate ────────────────────────────────────────────────────────

const ramadan1 = { hy: 1444, hm: 9, hd: 1 };

describe('formatHijriDate - date tokens', () => {
  it('iYYYY-iMM-iDD', () => {
    assert.strictEqual(formatHijriDate(ramadan1, 'iYYYY-iMM-iDD'), '1444-09-01');
  });
  it('iYY (last 2 digits of year)', () => {
    assert.strictEqual(formatHijriDate(ramadan1, 'iYY'), '44');
  });
  it('iM (month without padding)', () => {
    assert.strictEqual(formatHijriDate(ramadan1, 'iM'), '9');
  });
  it('iMM (month zero-padded)', () => {
    assert.strictEqual(formatHijriDate(ramadan1, 'iMM'), '09');
  });
  it('iMMM (medium month name: Ramadan)', () => {
    assert.strictEqual(formatHijriDate(ramadan1, 'iMMM'), 'Ramadan');
  });
  it('iMMMM (full month name: Ramadan)', () => {
    assert.strictEqual(formatHijriDate(ramadan1, 'iMMMM'), 'Ramadan');
  });
  it('iD (day without padding)', () => {
    assert.strictEqual(formatHijriDate(ramadan1, 'iD'), '1');
  });
  it('iDD (day zero-padded)', () => {
    assert.strictEqual(formatHijriDate(ramadan1, 'iDD'), '01');
  });
});

describe('formatHijriDate - weekday tokens (1 Ramadan 1444 = Thursday)', () => {
  it('iE = 5 (Thursday = 5th Islamic day, Sunday=1)', () => {
    assert.strictEqual(formatHijriDate(ramadan1, 'iE'), '5');
  });
  it('iEEE = Kham (Thursday abbreviated)', () => {
    assert.strictEqual(formatHijriDate(ramadan1, 'iEEE'), 'Kham');
  });
  it('iEEEE = Yawm al-Khamis (Thursday full)', () => {
    assert.strictEqual(formatHijriDate(ramadan1, 'iEEEE'), 'Yawm al-Khamis');
  });
});

describe('formatHijriDate - era tokens', () => {
  it('iooo = AH', () => {
    assert.strictEqual(formatHijriDate(ramadan1, 'iooo'), 'AH');
  });
  it('ioooo = AH', () => {
    assert.strictEqual(formatHijriDate(ramadan1, 'ioooo'), 'AH');
  });
});

describe('formatHijriDate - composite format', () => {
  it('iMMMM iD, iYYYY', () => {
    assert.strictEqual(formatHijriDate(ramadan1, 'iMMMM iD, iYYYY'), 'Ramadan 1, 1444');
  });
  it('iDD/iMM/iYYYY', () => {
    assert.strictEqual(formatHijriDate(ramadan1, 'iDD/iMM/iYYYY'), '01/09/1444');
  });
  it('iEEEE, iD iMMMM iYYYY ioooo', () => {
    assert.strictEqual(
      formatHijriDate(ramadan1, 'iEEEE, iD iMMMM iYYYY ioooo'),
      'Yawm al-Khamis, 1 Ramadan 1444 AH',
    );
  });
});

describe('formatHijriDate - invalid month', () => {
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

// ─── hDatesTable structure ──────────────────────────────────────────────────

describe('hDatesTable structure', () => {
  it('first entry is 1318', () => assert.strictEqual(hDatesTable[0].hy, 1318));
  it('last valid year is 1500 (index 182)', () => assert.strictEqual(hDatesTable[182].hy, 1500));
  it('index 183 is sentinel year 1501 with dpm=0', () => {
    assert.strictEqual(hDatesTable[183].hy, 1501);
    assert.strictEqual(hDatesTable[183].dpm, 0);
  });
  it('table is sorted ascending by hy', () => {
    for (let i = 1; i < hDatesTable.length; i++) {
      assert(hDatesTable[i].hy > hDatesTable[i - 1].hy);
    }
  });
});

// ─── FCNA calendar ──────────────────────────────────────────────────────────

describe('FCNA toGregorian', () => {
  it('1 Ramadan 1446 = 2025-03-01 (ISNA 2025 calendar)', () => {
    const d = toGregorian(1446, 9, 1, FCNA);
    assert(d instanceof Date);
    assert.strictEqual(d.toISOString().slice(0, 10), '2025-03-01');
  });
  it('1 Shawwal 1446 = 2025-03-30 (Eid al-Fitr per ISNA)', () => {
    const d = toGregorian(1446, 10, 1, FCNA);
    assert(d instanceof Date);
    assert.strictEqual(d.toISOString().slice(0, 10), '2025-03-30');
  });
  it('1 Ramadan 1445 = 2024-03-11 (ISNA 2024 calendar)', () => {
    const d = toGregorian(1445, 9, 1, FCNA);
    assert(d instanceof Date);
    assert.strictEqual(d.toISOString().slice(0, 10), '2024-03-11');
  });
  it('1 Muharram 1444 = ~2022-07-30', () => {
    const d = toGregorian(1444, 1, 1, FCNA);
    assert(d instanceof Date);
    const iso = d.toISOString().slice(0, 10);
    assert(
      iso === '2022-07-29' || iso === '2022-07-30' || iso === '2022-07-31',
      `Expected ~2022-07-30, got ${iso}`,
    );
  });
});

describe('FCNA toHijri', () => {
  it('2025-03-01 = 1 Ramadan 1446', () => {
    const h = toHijri(new Date(2025, 2, 1, 12), FCNA);
    assert.deepEqual(h, { hy: 1446, hm: 9, hd: 1 });
  });
  it('2025-03-30 = 1 Shawwal 1446', () => {
    const h = toHijri(new Date(2025, 2, 30, 12), FCNA);
    assert.deepEqual(h, { hy: 1446, hm: 10, hd: 1 });
  });
  it('2024-03-11 = 1 Ramadan 1445', () => {
    const h = toHijri(new Date(2024, 2, 11, 12), FCNA);
    assert.deepEqual(h, { hy: 1445, hm: 9, hd: 1 });
  });
});

describe('FCNA round-trips', () => {
  it('1446/9/1 toGregorian then toHijri', () => {
    const greg = toGregorian(1446, 9, 1, FCNA);
    const hijri = toHijri(greg, FCNA);
    assert.deepEqual(hijri, { hy: 1446, hm: 9, hd: 1 });
  });
  it('1446/10/15 toGregorian then toHijri', () => {
    const greg = toGregorian(1446, 10, 15, FCNA);
    const hijri = toHijri(greg, FCNA);
    assert.deepEqual(hijri, { hy: 1446, hm: 10, hd: 15 });
  });
  it('1318/1/1 toGregorian then toHijri', () => {
    const greg = toGregorian(1318, 1, 1, FCNA);
    assert(greg instanceof Date);
    const hijri = toHijri(greg, FCNA);
    assert.deepEqual(hijri, { hy: 1318, hm: 1, hd: 1 });
  });
  it('out-of-range year 1200/6/1 round-trip', () => {
    const greg = toGregorian(1200, 6, 1, FCNA);
    assert(greg instanceof Date);
    const hijri = toHijri(greg, FCNA);
    assert.deepEqual(hijri, { hy: 1200, hm: 6, hd: 1 });
  });
});

describe('FCNA isValidHijriDate', () => {
  it('1446/9/1 = true', () => assert.strictEqual(isValidHijriDate(1446, 9, 1, FCNA), true));
  it('month 0 = false', () => assert.strictEqual(isValidHijriDate(1446, 0, 1, FCNA), false));
  it('month 13 = false', () => assert.strictEqual(isValidHijriDate(1446, 13, 1, FCNA), false));
  it('day 0 = false', () => assert.strictEqual(isValidHijriDate(1446, 9, 0, FCNA), false));
  it('day 31 = false', () => assert.strictEqual(isValidHijriDate(1446, 9, 31, FCNA), false));
  it('year 1 AH = true', () => assert.strictEqual(isValidHijriDate(1, 1, 1, FCNA), true));
  it('year 1600 = true (beyond UAQ table)', () =>
    assert.strictEqual(isValidHijriDate(1600, 1, 1, FCNA), true));
});

describe('UAQ default regression', () => {
  it('1 Ramadan 1446 = 2025-03-01 (UAQ matches FCNA here)', () => {
    const d = toGregorian(1446, 9, 1);
    assert.strictEqual(d.toISOString().slice(0, 10), '2025-03-01');
  });
  it('toHijri still works without options', () => {
    const h = toHijri(new Date(2023, 2, 23, 12));
    assert.deepEqual(h, { hy: 1444, hm: 9, hd: 1 });
  });
  it('isValidHijriDate still works without options', () => {
    assert.strictEqual(isValidHijriDate(1444, 9, 1), true);
    assert.strictEqual(isValidHijriDate(1501, 1, 1), false);
  });
});
