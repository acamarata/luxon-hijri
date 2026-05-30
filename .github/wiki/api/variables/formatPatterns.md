[**luxon-hijri v3.0.0**](../README.md)

***

[luxon-hijri](../README.md) / formatPatterns

# Variable: formatPatterns

> `const` **formatPatterns**: `object`

Defined in: [src/formatPatterns.ts:10](https://github.com/acamarata/luxon-hijri/blob/19dc465d7f7d279e07bf7505e42f4bba5f93ef3b/src/formatPatterns.ts#L10)

Purpose: Reference map of all supported format tokens to their human-readable descriptions.
Inputs: n/a — static data export
Outputs: Record<string, string> mapping token string to description
Constraints: keys must match the TOKEN_RE in formatHijriDate.ts; used for documentation and introspection
SPORT: packages.md — luxon-hijri row

## Type Declaration

### a

> **a**: `string` = `'AM/PM marker'`

### h

> **h**: `string` = `'Hour (1 or 2 digits without zero-padding, 12-hour clock)'`

### H

> **H**: `string` = `'Hour (1 or 2 digits without zero-padding, 24-hour clock)'`

### hh

> **hh**: `string` = `'Hour (2 digits, zero-padded, 12-hour clock)'`

### HH

> **HH**: `string` = `'Hour (2 digits, zero-padded, 24-hour clock)'`

### iD

> **iD**: `string` = `'Hijri day of the month (1 or 2 digits without zero-padding)'`

### iDD

> **iDD**: `string` = `'Hijri day of the month (2 digits, zero-padded)'`

### iE

> **iE**: `string` = `'Hijri weekday (1 digit)'`

### iEEE

> **iEEE**: `string` = `'Hijri weekday (abbreviated name)'`

### iEEEE

> **iEEEE**: `string` = `'Hijri weekday (full name)'`

### iM

> **iM**: `string` = `'Hijri month (1 or 2 digits without zero-padding)'`

### iMM

> **iMM**: `string` = `'Hijri month (2 digits, zero-padded)'`

### iMMM

> **iMMM**: `string` = `'Hijri month (abbreviated name)'`

### iMMMM

> **iMMMM**: `string` = `'Hijri month (full name)'`

### iooo

> **iooo**: `string` = `'Hijri era (abbreviated)'`

### ioooo

> **ioooo**: `string` = `'Hijri era (full)'`

### iYY

> **iYY**: `string` = `'Hijri year (2 digits)'`

### iYYYY

> **iYYYY**: `string` = `'Hijri year (4 digits)'`

### m

> **m**: `string` = `'Minute (1 or 2 digits without zero-padding)'`

### mm

> **mm**: `string` = `'Minute (2 digits, zero-padded)'`

### s

> **s**: `string` = `'Second (1 or 2 digits without zero-padding)'`

### ss

> **ss**: `string` = `'Second (2 digits, zero-padded)'`

### z

> **z**: `string` = `'Timezone (abbreviated)'`

### Z

> **Z**: `string` = `'Timezone offset from UTC (+HH:MM)'`

### zz

> **zz**: `string` = `'Timezone (medium)'`

### ZZ

> **ZZ**: `string` = `'Timezone offset from UTC (condensed)'`

### zzz

> **zzz**: `string` = `'Timezone (full)'`
