# Hijri Calendar

## The Islamic Calendar

The Islamic calendar (also called the Hijri calendar) is a lunar calendar consisting of 12 months in a year of 354 or 355 days. Because the lunar year is roughly 11 days shorter than the solar year, the Islamic calendar cycles through all seasons over a period of approximately 33 years.

The calendar begins from the year of the Hijra: the migration of the Prophet Muhammad from Mecca to Medina in 622 CE. That year is 1 AH (Anno Hegirae). The Hijri year is written with the suffix "H" or "AH."

Each month begins with the sighting of the crescent moon (hilal). Because actual lunar visibility depends on atmospheric conditions and geographic location, two methods exist for determining month start:

- **Moon sighting** (rukyah): the month begins when the crescent moon is physically observed, potentially varying by region.
- **Astronomical calculation** (hisab): the month is computed mathematically from the astronomical new moon.

Different countries and communities follow different approaches.

## Hijri Months

| No. | Arabic Name | Common Transliteration |
| --- | --- | --- |
| 1 | محرم | Muharram |
| 2 | صفر | Safar |
| 3 | ربيع الأول | Rabi' al-Awwal |
| 4 | ربيع الثاني | Rabi' al-Thani |
| 5 | جمادى الأولى | Jumada al-Awwal |
| 6 | جمادى الآخرة | Jumada al-Thani |
| 7 | رجب | Rajab |
| 8 | شعبان | Sha'ban |
| 9 | رمضان | Ramadan |
| 10 | شوال | Shawwal |
| 11 | ذو القعدة | Dhul Qi'dah |
| 12 | ذو الحجة | Dhul Hijjah |

Months alternate between 29 and 30 days. Dhul Hijjah has 29 days in a normal year and 30 in a leap year.

## Hijri Weekdays

The Islamic week begins on Sunday. Friday (Yawm al-Jum'a) is the day of congregational prayer.

| No. | Arabic Name | Transliteration |
| --- | --- | --- |
| 1 | الأحد | Yawm al-Ahad (Sunday) |
| 2 | الاثنين | Yawm al-Ithnayn (Monday) |
| 3 | الثلاثاء | Yawm ath-Thulatha' (Tuesday) |
| 4 | الأربعاء | Yawm al-Arba'a' (Wednesday) |
| 5 | الخميس | Yawm al-Khamis (Thursday) |
| 6 | الجمعة | Yawm al-Jum'a (Friday) |
| 7 | السبت | Yawm as-Sabt (Saturday) |

## The Umm al-Qura Calendar

The Umm al-Qura calendar is the official civil calendar of Saudi Arabia, published by the Umm al-Qura University in Mecca. It determines month start dates through astronomical calculation of the lunar crescent visibility at the coordinates of Mecca, rather than physical observation.

**Key properties:**

- Published in advance for civil and administrative use
- Based on a fixed astronomical rule, not physical sighting
- Accepted as the reference Hijri calendar in most Islamic finance and legal contexts globally
- Covers years 1318 AH onward in published tables

The calendar is deterministic: a given Gregorian date corresponds to exactly one Hijri date, and vice versa. This makes it suitable for database storage, financial records, and software applications.

luxon-hijri ships the Umm al-Qura table covering 1318–1500 H (April 30, 1900 – November 2076 CE). For dates outside this range, the FCNA calendar option (`{ calendar: 'fcna' }`) provides astronomical computation for all Hijri years.

## Encoding the Days-per-Month Bitmask

Each year in the table stores a 12-bit integer (`dpm`) where bit 0 represents month 1 (Muharram) and bit 11 represents month 12 (Dhul Hijjah). A set bit means the month has 30 days; a clear bit means 29 days.

```
bit 11  bit 10  ...  bit 1  bit 0
Dhul H  Dhul Q      Safar  Muharram
```

To get the day count for month `m`:

```javascript
const days = (dpm >> (m - 1)) & 1 ? 30 : 29;
```

This encoding packs an entire year's month structure into a single 16-bit integer, keeping the table compact.

## Year Length

A Hijri year has either 354 days (12 months × 29.5 days average) or 355 days. The `dpm` bitmask determines whether a given year is 354 or 355 days by counting how many bits are set. A year with 6 set bits has 6 months of 30 days and 6 months of 29 days: (6 × 30) + (6 × 29) = 354 days. A year with 7 set bits has 355 days.

## Epoch and Date Range

| | Hijri | Gregorian |
| --- | --- | --- |
| Table start | 1 Muharram 1318 H | April 30, 1900 |
| Table end | Last day of Dhul Hijjah 1500 H | ~November 2076 |
| Sentinel boundary | 1 Muharram 1501 H | November 17, 2077 |

For the Umm al-Qura calendar (default), dates outside this range return `null` from `toHijri` and throw from `toGregorian`. The FCNA calendar supports all Hijri years and has no range limit.

---

[Home](Home) . [API Reference](API-Reference) . [Architecture](Architecture)
