# Changelog

<!-- markdownlint-disable MD024 -->

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [2.1.0] - 2026-02-25

### Changed

- Engine logic extracted to `hijri-core` (new dependency). All Hijri conversion algorithms now live in that package and are re-exported from `luxon-hijri` with identical signatures. Zero breaking changes to the public API.
- `src/hDates.ts`, `src/hMonths.ts`, `src/hWeekdays.ts`, `src/fcna.ts`, `src/utils.ts`, `src/toHijri.ts`, `src/toGregorian.ts`: all now delegate to `hijri-core`. The UAQ table, FCNA engine, month/weekday names, and conversion functions have a single source of truth across the hijri ecosystem.
- `hijri-core ^1.0.0` added as a runtime dependency. `luxon` stays as a runtime dependency (still needed by `formatHijriDate` for time and timezone tokens).

## [2.0.0] - 2026-02-25

### Added

- **FCNA/ISNA calendar support**: `toHijri`, `toGregorian`, and `isValidHijriDate` now accept an optional `{ calendar: 'fcna' }` option. The FCNA criterion: if the astronomical conjunction occurs before 12:00 UTC the month begins D+1, otherwise D+2. New moon times use the full Meeus Chapter 49 formula (accurate to within a few minutes for 1000–3000 CE). The FCNA calendar works for all Hijri years, not just the 1318–1500 H range covered by the UAQ table.
- New exported types: `CalendarSystem` (`'uaq' | 'fcna'`) and `ConversionOptions` (`{ calendar?: CalendarSystem }`).
- `src/fcna.ts`: standalone FCNA engine. Meeus Ch.49 new moon algorithm, UAQ anchor lookup, FCNA criterion, and full Hijri/Gregorian conversion without external dependencies beyond the existing hDatesTable.
- Dual CJS and ESM build via tsup (`dist/index.cjs`, `dist/index.mjs`)
- Full TypeScript declarations for both module formats (`dist/index.d.ts`, `dist/index.d.mts`)
- `src/types.ts` with named exported `HijriDate` and `HijriYearRecord` interfaces
- Exports: `hwLong`, `hwShort`, `hwNumeric` weekday arrays now public
- Exports: `HijriDate`, `HijriYearRecord`, `CalendarSystem`, `ConversionOptions` types exported from the package root
- `isValidHijriDate` now correctly handles the table sentinel entry (Hijri year 1501 boundary marker)
- Comprehensive test suite: `test.mjs` (ESM) and `test-cjs.cjs` (CJS), including FCNA test cases verified against ISNA 2024–2025 calendar announcements
- CI workflow: Node 20/22/24 matrix, typecheck, and pack-check jobs
- GitHub Wiki with four pages: Home, API Reference, Architecture, Hijri Calendar Background
- `.editorconfig`, `.nvmrc` (24), `.npmrc`, `pnpm-workspace.yaml`
- `CHANGELOG.md`

### Fixed

- **Critical weekday bug**: `iE`, `iEEE`, `iEEEE` format tokens previously called `DateTime.fromObject({ year: hijriDate.hy, ... })` which Luxon interprets as Gregorian, returning dates in the year ~1444 CE (January 1444 CE is ~580 years ago). Every weekday result was wrong. Fix: convert Hijri to Gregorian via `toGregorian()` first, then call `DateTime.fromJSDate()` for weekday lookup.
- **Era tokens**: `iooo` and `ioooo` were delegated to Luxon's `toFormat()` which returned Gregorian era strings. Both now return `"AH"` directly.
- **Time/timezone tokens**: These also used the broken `DateTime.fromObject()` path. Now use a lazily computed Gregorian DateTime via `toGregorian()` + `DateTime.fromJSDate()`.
- **Format token regex**: Previous word-boundary (`\b`) regex caused partial token matches and missed some tokens. Replaced with an ordered alternation that matches longest tokens first.
- **`toGregorian` timezone sensitivity**: Was using `DateTime.local()` to build the start date, which shifted the result by the host machine's UTC offset. Now uses `DateTime.utc()` for consistent UTC output across all environments.
- `README.md` license reference corrected from ISC to MIT.

### Changed

- **Breaking**: Package now ships dual ESM/CJS with a conditional `exports` map. The old `main: dist/index.js` entry is replaced by `main: dist/index.cjs` + `module: dist/index.mjs`. Bundlers and Node 20+ resolve automatically.
- **Breaking**: `hDates` interface renamed to `HijriYearRecord` (cleaner public API name).
- **Breaking**: Luxon upgraded from `^2.5.2` to `^3.5.0`.
- **Breaking**: `engines.node` set to `>=20` (Node 18 EOL April 2025).
- Build system changed from `tsc` to `tsup`. Manual `src/index.d.ts` deleted (tsup auto-generates).
- Package manager changed from npm to pnpm. `package-lock.json` replaced by `pnpm-lock.yaml`.
- `toHijri` lookup replaced with binary search (O(log 183) vs O(n) reduce+find).
- `toGregorian` lookup replaced with binary search on `hy` (O(log 183) vs O(n) find).
- `isValidHijriDate` lookup replaced with binary search (O(log 183) vs O(n) find).
- `author` field corrected to `"Aric Camarata"`.
- `repository.url` updated to use `git+https://` prefix (prevents npm publish warnings).

### Removed

- `@umalqura/core` runtime dependency (was unused in the implementation).
- `jest` and related test infrastructure.
- `typescript ^4.0.0` (replaced with `^5.5.0`).
- `src/index.d.ts` (manual, incomplete, generated automatically by tsup).

## [1.0.4] - 2024-01-01

Initial public release on npm. CommonJS only. Umm al-Qura table-based conversion with Luxon formatting.
