/**
 * Purpose:    Vitest suite for luxon-hijri — conversion, formatting, and validation.
 * Inputs:     Pure functions from src/index.ts. Requires luxon + hijri-core as peer deps.
 * Outputs:    Vitest pass/fail assertions.
 * Constraints: UAQ range 1318–1500 AH. toGregorian throws (not null) on invalid input.
 *             toHijri reads the Date's UTC calendar day; pass UTC midnight or use
 *             Date.UTC(year, month-1, day) for exact results on all hosts.
 * Usage:      pnpm vitest run
 * SOT:        packages.md — luxon-hijri row
 */
import { describe, it, expect } from "vitest";
import {
  toHijri,
  toGregorian,
  isValidHijriDate,
  formatHijriDate,
  hmLong,
  hmMedium,
  hmShort,
} from "./src/index";

// Anchor: toGregorian(1446, 9, 1) = 2025-03-01 midnight UTC
// toHijri on noon 2025-03-01 reliably returns { hm: 9, hd: 1 }
const RAMADAN_1446_NOON = new Date("2025-03-01T12:00:00Z");

describe("toHijri", () => {
  it("converts noon 2025-03-01 UTC to 1 Ramadan 1446", () => {
    const result = toHijri(RAMADAN_1446_NOON);
    expect(result).not.toBeNull();
    expect(result!.hy).toBe(1446);
    expect(result!.hm).toBe(9);
    expect(result!.hd).toBe(1);
  });

  it("returns null for dates outside UAQ range", () => {
    expect(toHijri(new Date("2100-01-01"))).toBeNull();
  });

  it("throws on an invalid Date", () => {
    expect(() => toHijri(new Date("not-a-date"))).toThrow();
  });
});

describe("toGregorian", () => {
  it("converts 1 Ramadan 1446 to 2025-03-01 UTC midnight", () => {
    const result = toGregorian(1446, 9, 1);
    expect(result.toISOString()).toBe("2025-03-01T00:00:00.000Z");
  });

  it("throws on invalid Hijri date (out of range)", () => {
    expect(() => toGregorian(1501, 1, 1)).toThrow("Invalid Hijri date");
  });
});

describe("isValidHijriDate", () => {
  it("returns true for 1 Ramadan 1446", () => {
    expect(isValidHijriDate(1446, 9, 1)).toBe(true);
  });

  it("returns false for month 0", () => {
    expect(isValidHijriDate(1446, 0, 1)).toBe(false);
  });

  it("returns false for day 31", () => {
    expect(isValidHijriDate(1446, 1, 31)).toBe(false);
  });
});

describe("formatHijriDate", () => {
  const hijriDate = { hy: 1446, hm: 9, hd: 1 };

  it("formats iYYYY-iMM-iDD correctly", () => {
    expect(formatHijriDate(hijriDate, "iYYYY-iMM-iDD")).toBe("1446-09-01");
  });

  it("formats iMMMM as full month name Ramadan", () => {
    expect(formatHijriDate(hijriDate, "iMMMM")).toBe("Ramadan");
  });

  it("formats iMMM as a non-empty medium month name", () => {
    const result = formatHijriDate(hijriDate, "iMMM");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("throws RangeError on invalid month 0", () => {
    expect(() => formatHijriDate({ hy: 1446, hm: 0, hd: 1 }, "iMMMM")).toThrow(RangeError);
  });
});

describe("month name tables", () => {
  it("hmLong index 8 is Ramadan", () => {
    expect(hmLong[8]).toBe("Ramadan");
  });

  it("hmMedium has 12 entries", () => {
    expect(hmMedium).toHaveLength(12);
  });

  it("hmShort has 12 entries", () => {
    expect(hmShort).toHaveLength(12);
  });
});
