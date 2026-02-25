// toGregorian.ts: thin wrapper over hijri-core; preserves throw-on-invalid behavior
import { toGregorian as coreToGregorian } from 'hijri-core';
import type { ConversionOptions } from './types';

export function toGregorian(hy: number, hm: number, hd: number, options?: ConversionOptions): Date {
  const result = coreToGregorian(hy, hm, hd, options);
  if (result === null) throw new Error('Invalid Hijri date');
  return result;
}
