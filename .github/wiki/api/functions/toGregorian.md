[**luxon-hijri v3.0.0**](../README.md)

***

[luxon-hijri](../README.md) / toGregorian

# Function: toGregorian()

> **toGregorian**(`hy`, `hm`, `hd`, `options?`): `Date`

Defined in: [src/toGregorian.ts:25](https://github.com/acamarata/luxon-hijri/blob/e663b343ac1cd16188500a4302fd3e68ff29b3c1/src/toGregorian.ts#L25)

Convert a Hijri date to a Gregorian Date object.

Unlike the hijri-core function (which returns null for invalid input), this
wrapper throws an Error so callers always receive a valid Date.

## Parameters

### hy

`number`

Hijri year

### hm

`number`

Hijri month (1-12)

### hd

`number`

Hijri day (1-30)

### options?

[`ConversionOptions`](../interfaces/ConversionOptions.md)

conversion options (calendar engine selection)

## Returns

`Date`

a UTC Date corresponding to the given Hijri date

## Throws

if the Hijri date is invalid or out of range
