# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.0.1] - 2026-05-30

### Fixed

- Improved type safety in `formatHijriDate`: explicit return type annotation on `replace` callback and non-null assertions on array lookups with JSDoc justification comments.
- Added in-code comment blocks to all source modules documenting purpose, inputs, outputs, constraints, and SPORT references.

## [3.0.0] - 2026-05-28

### Changed

- BREAKING: `luxon` and `hijri-core` moved from `dependencies` to `peerDependencies`. Consumers must now install both alongside `luxon-hijri`. See the migration note below.
- Peer range for `luxon` widened from `^3.5.0` to `^3.0.0` — any Luxon 3.x release is compatible.

### Migration from v2.x

```bash
pnpm add luxon-hijri luxon hijri-core
# or
npm install luxon-hijri luxon hijri-core
```

Prior to v3.0.0, `luxon` and `hijri-core` were bundled as runtime dependencies. This caused Luxon to appear twice in bundled applications where it was already installed. v3.0.0 aligns with the peer-dependency pattern used by all other hijri wrapper packages (`date-fns-hijri`, `dayjs-hijri-plus`, `moment-hijri-plus`, `temporal-hijri`).

## [2.1.0] - 2026-05-28

### Added
- Initial release
