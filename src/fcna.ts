// fcna.ts — FCNA/ISNA Hijri calendar engine
//
// The Fiqh Council of North America (FCNA) uses a global astronomical criterion:
// if the new moon conjunction occurs before 12:00 noon UTC on day D, the new
// Hijri month begins at midnight starting day D+1 (next calendar day); if at or
// after 12:00 UTC, the month begins at midnight starting day D+2.
//
// For years in the Umm al-Qura table (1318–1500 H), the UAQ month start date
// serves as the anchor for locating the nearest new moon. For years outside that
// range the anchor comes from the Islamic epoch plus mean synodic months.
//
// New moon times come from Jean Meeus, Astronomical Algorithms (2nd ed.),
// Chapter 49 — accurate to within a few minutes for 1000 CE to 3000 CE.

import { hDatesTable } from './hDates';
import type { HijriDate } from './types';

// ─── Constants ───────────────────────────────────────────────────────────────

const SYNODIC     = 29.530588861;   // Mean synodic month (days)
const JDE0        = 2451550.09766;  // Meeus k=0: mean new moon ~2000-01-06
const JDE_UNIX    = 2440587.5;      // JDE of Unix epoch 1970-01-01 00:00 UTC
const MS_PER_DAY  = 86_400_000;
const TO_RAD      = Math.PI / 180;

// Approximate k index of 1 Muharram 1 AH in Meeus numbering.
// Derived: Islamic epoch JDE ≈ 1948438.5 → k ≈ (1948438.5 − JDE0) / SYNODIC ≈ −17037.
const K_EPOCH = -17037;

// ─── Meeus Chapter 49: corrected new moon JDE ────────────────────────────────

function newMoonJDE(k: number): number {
  const T  = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T3 * T;

  // Mean JDE (Meeus Eq. 49.1)
  let jde = JDE0
    + SYNODIC * k
    + 0.00015437 * T2
    - 0.000000150 * T3
    + 0.00000000073 * T4;

  // Sun's mean anomaly M (degrees)
  const M = (2.5534
    + 29.10535670 * k
    - 0.0000014 * T2
    - 0.00000011 * T3) % 360;

  // Moon's mean anomaly M' (degrees)
  const Mprime = (201.5643
    + 385.81693528 * k
    + 0.0107582 * T2
    + 0.00001238 * T3
    - 0.000000058 * T4) % 360;

  // Moon's argument of latitude F (degrees)
  const F = (160.7108
    + 390.67050284 * k
    - 0.0016118 * T2
    - 0.00000227 * T3
    + 0.000000011 * T4) % 360;

  // Longitude of ascending node Omega (degrees)
  const Omega = (124.7746
    - 1.56375588 * k
    + 0.0020672 * T2
    + 0.00000215 * T3) % 360;

  // Eccentricity correction factor E
  const E  = 1 - 0.002516 * T - 0.0000074 * T2;
  const E2 = E * E;

  // Angles to radians
  const Mrad  = M * TO_RAD;
  const Mprad = Mprime * TO_RAD;
  const Frad  = F * TO_RAD;
  const Orad  = Omega * TO_RAD;

  // Planetary correction (Meeus Table 49.a — new moon phase)
  jde +=
    - 0.40720 * Math.sin(Mprad)
    + 0.17241 * E  * Math.sin(Mrad)
    + 0.01608 * Math.sin(2 * Mprad)
    + 0.01039 * Math.sin(2 * Frad)
    + 0.00739 * E  * Math.sin(Mprad - Mrad)
    - 0.00514 * E  * Math.sin(Mprad + Mrad)
    + 0.00208 * E2 * Math.sin(2 * Mrad)
    - 0.00111 * Math.sin(Mprad - 2 * Frad)
    - 0.00057 * Math.sin(Mprad + 2 * Frad)
    + 0.00056 * E  * Math.sin(2 * Mprad + Mrad)
    - 0.00042 * Math.sin(3 * Mprad)
    + 0.00042 * E  * Math.sin(Mrad + 2 * Frad)
    + 0.00038 * E  * Math.sin(Mrad - 2 * Frad)
    - 0.00024 * E  * Math.sin(2 * Mprad - Mrad)
    - 0.00017 * Math.sin(Orad)
    - 0.00007 * Math.sin(Mprad + 2 * Mrad)
    + 0.00004 * Math.sin(2 * Mprad - 2 * Frad)
    + 0.00004 * Math.sin(3 * Mrad)
    + 0.00003 * Math.sin(Mprad + Mrad - 2 * Frad)
    + 0.00003 * Math.sin(2 * Mprad + 2 * Frad)
    - 0.00003 * Math.sin(Mprad + Mrad + 2 * Frad)
    + 0.00003 * Math.sin(Mprad - Mrad + 2 * Frad)
    - 0.00002 * Math.sin(Mprad - Mrad - 2 * Frad)
    - 0.00002 * Math.sin(3 * Mprad + Mrad)
    + 0.00002 * Math.sin(4 * Mprad);

  // Additional planetary corrections (Meeus Table 49.b)
  const A1  = (299.77 +  0.107408 * k - 0.009173 * T2) * TO_RAD;
  const A2  = (251.88 +  0.016321 * k) * TO_RAD;
  const A3  = (251.83 + 26.651886 * k) * TO_RAD;
  const A4  = (349.42 + 36.412478 * k) * TO_RAD;
  const A5  = ( 84.66 + 18.206239 * k) * TO_RAD;
  const A6  = (141.74 + 53.303771 * k) * TO_RAD;
  const A7  = (207.14 +  2.453732 * k) * TO_RAD;
  const A8  = (154.84 +  7.306860 * k) * TO_RAD;
  const A9  = ( 34.52 + 27.261239 * k) * TO_RAD;
  const A10 = (207.19 +  0.121824 * k) * TO_RAD;
  const A11 = (291.34 +  1.844379 * k) * TO_RAD;
  const A12 = (161.72 + 24.198154 * k) * TO_RAD;
  const A13 = (239.56 + 25.513099 * k) * TO_RAD;
  const A14 = (331.55 +  3.592518 * k) * TO_RAD;

  jde +=
    + 0.000325 * Math.sin(A1)
    + 0.000165 * Math.sin(A2)
    + 0.000164 * Math.sin(A3)
    + 0.000126 * Math.sin(A4)
    + 0.000110 * Math.sin(A5)
    + 0.000062 * Math.sin(A6)
    + 0.000060 * Math.sin(A7)
    + 0.000056 * Math.sin(A8)
    + 0.000047 * Math.sin(A9)
    + 0.000042 * Math.sin(A10)
    + 0.000040 * Math.sin(A11)
    + 0.000037 * Math.sin(A12)
    + 0.000035 * Math.sin(A13)
    + 0.000023 * Math.sin(A14);

  return jde;
}

// ─── JDE / UTC conversion ─────────────────────────────────────────────────────

function jdeToUtcMs(jde: number): number {
  return (jde - JDE_UNIX) * MS_PER_DAY;
}

function utcMsToKApprox(ms: number): number {
  const jde = ms / MS_PER_DAY + JDE_UNIX;
  return (jde - JDE0) / SYNODIC;
}

// ─── Find nearest corrected new moon ─────────────────────────────────────────

// Returns the UTC ms of the corrected new moon closest to anchorMs.
// Searches k0-2 through k0+2 (5 candidates) to handle any estimation error.
function nearestNewMoonMs(anchorMs: number): number {
  const k0 = Math.round(utcMsToKApprox(anchorMs));
  let bestMs   = 0;
  let bestDist = Infinity;

  for (let k = k0 - 2; k <= k0 + 2; k++) {
    const ms   = jdeToUtcMs(newMoonJDE(k));
    const dist = Math.abs(ms - anchorMs);
    if (dist < bestDist) {
      bestDist = dist;
      bestMs   = ms;
    }
  }

  return bestMs;
}

// ─── FCNA criterion ──────────────────────────────────────────────────────────

// Given a conjunction UTC ms, return the midnight UTC ms that starts the
// new FCNA Hijri month: D+1 if conjunction before 12:00 UTC, D+2 otherwise.
function fcnaCriterionMs(conjMs: number): number {
  const midnight = Math.floor(conjMs / MS_PER_DAY) * MS_PER_DAY;
  const noon     = midnight + 12 * 3_600_000;
  return conjMs < noon ? midnight + MS_PER_DAY : midnight + 2 * MS_PER_DAY;
}

// ─── UAQ anchor ──────────────────────────────────────────────────────────────

// Return the UTC ms of the UAQ month start for (hy, hm).
// For years 1318–1500 H: binary-search hDatesTable, sum dpm day counts.
// For years outside that range: estimate from Islamic epoch + mean month count.
export function uaqAnchorMs(hy: number, hm: number): number {
  // Binary search for hy in table.
  let lo = 0, hi = hDatesTable.length - 1, found = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const midHy = hDatesTable[mid].hy;
    if (midHy === hy)      { found = mid; break; }
    else if (midHy < hy)  lo = mid + 1;
    else                   hi = mid - 1;
  }

  if (found !== -1 && hDatesTable[found].dpm !== 0) {
    // In-range: sum prior-month day counts from table start date.
    const r = hDatesTable[found];
    let days = 0;
    for (let i = 0; i < hm - 1; i++) {
      days += (r.dpm >> i) & 1 ? 30 : 29;
    }
    return Date.UTC(r.gy, r.gm - 1, r.gd) + days * MS_PER_DAY;
  }

  // Out of range: estimate from Islamic epoch + mean months elapsed.
  const monthsFromEpoch = (hy - 1) * 12 + (hm - 1);
  const kApprox = K_EPOCH + monthsFromEpoch;
  return jdeToUtcMs(newMoonJDE(kApprox));
}

// ─── FCNA month start ─────────────────────────────────────────────────────────

// Return UTC ms of midnight beginning the given FCNA Hijri month.
export function fcnaMonthStartMs(hy: number, hm: number): number {
  const anchor = uaqAnchorMs(hy, hm);
  const conjMs = nearestNewMoonMs(anchor);
  return fcnaCriterionMs(conjMs);
}

// ─── FCNA month length ───────────────────────────────────────────────────────

export function fcnaDaysInMonth(hy: number, hm: number): number {
  const thisStart = fcnaMonthStartMs(hy, hm);
  const nextHy    = hm < 12 ? hy : hy + 1;
  const nextHm    = hm < 12 ? hm + 1 : 1;
  const nextStart = fcnaMonthStartMs(nextHy, nextHm);
  return Math.round((nextStart - thisStart) / MS_PER_DAY);
}

// ─── FCNA Gregorian → Hijri ──────────────────────────────────────────────────

export function fcnaToHijri(gregorianDate: Date): HijriDate | null {
  if (!(gregorianDate instanceof Date) || isNaN(gregorianDate.getTime())) {
    throw new Error('Invalid Gregorian date');
  }

  // Use UTC date components. The FCNA criterion is UTC-based (conjunction before
  // 12:00 UTC), so month boundaries are defined in UTC. Using UTC methods ensures
  // fcnaToGregorian ↔ fcnaToHijri round-trips correctly in any host timezone.
  const inputMs = Date.UTC(
    gregorianDate.getUTCFullYear(),
    gregorianDate.getUTCMonth(),
    gregorianDate.getUTCDate(),
  );

  // Shift back ~15 days before estimating k so that kApprox resolves to the
  // current month's conjunction rather than possibly the next month's.
  const kApprox = utcMsToKApprox(inputMs - 15 * MS_PER_DAY);
  const k0      = Math.floor(kApprox);

  // Search k0-1, k0, k0+1 for the FCNA month containing inputMs.
  for (let ki = k0 - 1; ki <= k0 + 1; ki++) {
    const conjMs      = jdeToUtcMs(newMoonJDE(ki));
    const monthStart  = fcnaCriterionMs(conjMs);

    if (monthStart > inputMs) continue;

    const nextConjMs    = jdeToUtcMs(newMoonJDE(ki + 1));
    const nextMonthStart = fcnaCriterionMs(nextConjMs);

    if (inputMs < nextMonthStart) {
      // inputMs falls in the month that began at monthStart (k = ki).
      // Map ki → Hijri (hy, hm) via K_EPOCH offset.
      const monthsFromEpoch = ki - K_EPOCH;
      let hy = Math.floor(monthsFromEpoch / 12) + 1;
      let hm = (monthsFromEpoch % 12) + 1;
      // JavaScript % can return negative; normalize to 1–12.
      if (hm <= 0) { hm += 12; hy--; }
      if (hy < 1) return null;  // before 1 AH

      const hd = Math.round((inputMs - monthStart) / MS_PER_DAY) + 1;
      return { hy, hm, hd };
    }
  }

  return null;
}

// ─── FCNA Hijri → Gregorian ──────────────────────────────────────────────────

export function fcnaToGregorian(hy: number, hm: number, hd: number): Date | null {
  if (hy < 1 || hm < 1 || hm > 12 || hd < 1) return null;
  const days = fcnaDaysInMonth(hy, hm);
  if (hd > days) return null;
  const startMs = fcnaMonthStartMs(hy, hm);
  return new Date(startMs + (hd - 1) * MS_PER_DAY);
}

// ─── FCNA validation ─────────────────────────────────────────────────────────

export function fcnaIsValid(hy: number, hm: number, hd: number): boolean {
  if (hy < 1 || hm < 1 || hm > 12 || hd < 1) return false;
  return hd <= fcnaDaysInMonth(hy, hm);
}
