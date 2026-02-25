# Architecture

## Overview

luxon-hijri v2.1 delegates all calendar engine logic to [hijri-core](https://github.com/acamarata/hijri-core), a zero-dependency package that houses the Umm al-Qura table, FCNA algorithm, and calendar registry. This package re-exports the conversion functions and data with identical signatures, then adds Luxon-based date formatting on top.

Luxon is used for one thing only: computing the equivalent Gregorian DateTime inside `formatHijriDate` when tokens like `iEEEE` (weekday) or time/timezone tokens are used. All conversion arithmetic (`toHijri`, `toGregorian`, `isValidHijriDate`) runs through hijri-core without Luxon.

## The Umm al-Qura Table

The table lives in `hijri-core` and is re-exported from this package as `hDatesTable`. It has 184 rows. The first 183 are real Hijri years (1318–1500). The 184th is a sentinel entry (year 1501, `dpm: 0`) that records the Gregorian start date of 1 Muharram 1501, used as an upper boundary when converting Gregorian dates near the end of the table.

Each row stores:

| Field | Type | Description |
| --- | --- | --- |
| `hy` | number | Hijri year |
| `dpm` | number | 12-bit bitmask: bit 0 = month 1, bit 11 = month 12. 1 means 30 days, 0 means 29 days. |
| `gy` | number | Gregorian year of 1 Muharram |
| `gm` | number | Gregorian month of 1 Muharram (1-based) |
| `gd` | number | Gregorian day of 1 Muharram |

Example entry: `{ hy: 1444, dpm: 0x0555, gy: 2022, gm: 7, gd: 30 }`. Year 1444 started on July 30, 2022 (Gregorian). The `dpm` bitmask tells us which months have 30 days vs 29.

Reading `dpm`: for month `m` (1-based), the day count is `((dpm >> (m - 1)) & 1) ? 30 : 29`.

## Conversion Algorithm

### Gregorian to Hijri (`toHijri`)

1. Normalize the input `Date` to UTC midnight using `Date.UTC(year, month, day)`. This uses local date components (`getFullYear`, `getMonth`, `getDate`) to determine the calendar date, making the result independent of the machine's timezone.

2. Binary search the table to find the last entry whose Gregorian start date is on or before the input. This is the Hijri year that contains the input date.

3. Compute `remainingDays = (inputUtc - entryStartUtc) / 86_400_000`.

4. Walk through the 12 months of that Hijri year, subtracting each month's day count until `remainingDays` falls within a month. The month index where it fits is the Hijri month; `remainingDays + 1` is the day.

5. Return `{ hy, hm, hd }`.

Returns `null` for input before the first entry or if the sentinel is hit (input is in Gregorian year 2077 or later).

### Hijri to Gregorian (`toGregorian`)

1. Validate the input with `isValidHijriDate`. Throws on failure.

2. Binary search the table on the `hy` field to find the row for the given Hijri year.

3. Sum the day counts for months 1 through `hm - 1` using the `dpm` bitmask. Add `hd - 1` for the day within the current month. This gives `totalDays` elapsed since 1 Muharram of that year.

4. Sum days elapsed from 1 Muharram, then offset from the entry's UTC start date to produce a UTC midnight `Date`.

### Validation (`isValidHijriDate`)

Binary search on `hy` to locate the row. If the row has `dpm === 0` (sentinel), returns `false`. Otherwise validates month range (1–12), then computes the actual day count for that month from `dpm` and checks the day.

## Format Token Resolution (`formatHijriDate`)

The regex `TOKEN_RE` matches all supported tokens in a single pass, ordered longest-first to prevent partial matches (e.g. `iMMMM` before `iMMM` before `iMM` before `iM`).

For pure Hijri tokens (`iYYYY`, `iMM`, etc.) the value is read directly from `hijriDate.hy`, `.hm`, or `.hd`.

For weekday tokens (`iE`, `iEEE`, `iEEEE`), era tokens, and time/timezone tokens, a Gregorian `DateTime` is needed. It is computed lazily via a closure:

```typescript
let _gregDt: DateTime | undefined;

function getGregDt(): DateTime {
  if (!_gregDt) {
    const greg = toGregorian(hijriDate.hy, hijriDate.hm, hijriDate.hd);
    _gregDt = DateTime.fromJSDate(greg, { zone: 'UTC' });
  }
  return _gregDt;
}
```

This avoids the Gregorian lookup entirely when only pure Hijri tokens are used.

**Weekday index mapping**: Luxon's `weekday` runs 1 (Monday) through 7 (Sunday). The weekday arrays (`hwLong`, `hwShort`, `hwNumeric`) are indexed 0–6 with Sunday at index 0. The mapping is:

```text
arrayIndex = luxonWeekday % 7
// Monday=1 → 1, Tuesday=2 → 2, ..., Saturday=6 → 6, Sunday=7 → 0
```

## Binary Search Complexity

All three functions (`toHijri`, `toGregorian`, `isValidHijriDate`) use binary search on a 184-entry table. This gives O(log 184) ≈ 8 comparisons worst case, compared to the O(184) linear scan used in v1.

For typical usage, converting a handful of dates per request, the difference is negligible. For batch workloads converting thousands of dates, the reduction is meaningful.

## FCNA Calendar Engine

The FCNA/ISNA calendar is computed astronomically rather than looked up from a table. It works for all Hijri years, not just the 1318–1500 range covered by the UAQ table. The implementation lives in [hijri-core](https://github.com/acamarata/hijri-core) and is accessed through the calendar registry.

### FCNA Criterion

The Fiqh Council of North America uses a global visibility rule: if the astronomical new moon conjunction occurs before **12:00 noon UTC** on day D, the new Hijri month begins at midnight starting day D+1. If the conjunction is at or after 12:00 UTC, the month begins at midnight starting day D+2.

### New Moon Computation

New moon times come from Jean Meeus, *Astronomical Algorithms* (2nd ed.), Chapter 49. The algorithm takes an integer k (count of new moons since a reference epoch near J2000) and returns the Julian Ephemeris Day (JDE) of the corrected new moon. The correction terms include the solar anomaly, lunar anomaly, argument of latitude, ascending node, and 14 additional planetary terms. Accuracy: within a few minutes for 1000–3000 CE.

### Anchor Strategy

For years within the UAQ table (1318–1500 H), the UAQ month start date is used as the anchor for the nearest-new-moon search. This ensures the FCNA computation is consistent with the validated UAQ dataset for the date range where both systems overlap.

For years outside the table, the anchor comes from the Islamic epoch (1 Muharram 1 AH approximately JDE 1948438.5) plus the mean number of synodic months elapsed. Meeus corrections then adjust the mean estimate to the actual conjunction time.

### Nearest New Moon Search

Given an anchor UTC timestamp, the engine estimates k, then checks k-2 through k+2 (five candidates) for the corrected new moon closest to the anchor. This handles any estimation error from the anchor strategy.

### Calendar Conversion

`fcnaToGregorian(hy, hm, hd)`: sum the FCNA month-start offsets and add hd-1 days.

`fcnaToHijri(date)`: shift back ~15 days to ensure kApprox points to the current month's conjunction rather than the next. Try three adjacent k values; for each, compute the FCNA month start and next month start, then check whether the input falls within that window. Map the matching k to (hy, hm) via the K_EPOCH offset, and compute hd from the day offset.

FCNA uses UTC date components (`getUTCFullYear`, `getUTCMonth`, `getUTCDate`) because the FCNA criterion itself is defined in UTC. UAQ uses local date components.

### Performance

FCNA conversion calls `newMoonJDE` (the Meeus formula) 3–5 times per call. Each call is a fixed set of floating-point trig operations, sub-millisecond in any modern JS engine. Month length computation calls it twice more. No caching is done since usage patterns are typically small-batch.

## Why Luxon

Luxon is used for one purpose only in this package:

`DateTime.fromJSDate(greg, { zone: 'UTC' })` in `formatHijriDate` provides `.weekday` and `.toFormat()` for time/timezone tokens.

All conversion arithmetic (`toHijri`, `toGregorian`, `isValidHijriDate`) runs through hijri-core without Luxon. Neither Luxon's timezone database nor its date arithmetic is needed for standard Hijri date formatting. If you only use Hijri date tokens (no time/timezone tokens), the Gregorian DateTime is never constructed.

---

[Home](Home) . [API Reference](API-Reference) . [Hijri Calendar](Hijri-Calendar)
