[**luxon-hijri v3.0.0**](../README.md)

***

[luxon-hijri](../README.md) / CalendarSystem

# Type Alias: CalendarSystem

> **CalendarSystem** = `"uaq"` \| `"fcna"`

Defined in: [src/types.ts:20](https://github.com/acamarata/luxon-hijri/blob/19dc465d7f7d279e07bf7505e42f4bba5f93ef3b/src/types.ts#L20)

Built-in calendar system identifiers.

- `'uaq'`: Umm al-Qura (default). Table-based, covers 1318-1500 AH / 1900-2076 CE.
- `'fcna'`: FCNA/ISNA. Astronomical calculation, works for all Hijri years >= 1 AH.

hijri-core accepts any string identifier via `registerCalendar()`. This type covers
the built-in defaults only.
