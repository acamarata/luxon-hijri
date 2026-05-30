[**luxon-hijri v3.0.0**](../README.md)

***

[luxon-hijri](../README.md) / formatHijriDate

# Function: formatHijriDate()

> **formatHijriDate**(`hijriDate`, `format`): `string`

Defined in: [src/formatHijriDate.ts:24](https://github.com/acamarata/luxon-hijri/blob/19dc465d7f7d279e07bf7505e42f4bba5f93ef3b/src/formatHijriDate.ts#L24)

Format a Hijri date using a token-based format string.

Hijri-specific tokens use the `i` prefix (iYYYY, iMM, iDD, iEEEE, etc.).
Time and timezone tokens (HH, mm, ss, a, Z, z) are delegated to Luxon via the
corresponding Gregorian date.

## Parameters

### hijriDate

[`HijriDate`](../interfaces/HijriDate.md)

the Hijri date to format

### format

`string`

a format string containing Hijri and/or Luxon tokens

## Returns

`string`

the formatted date string

## Throws

if the Hijri month is outside the 1-12 range
