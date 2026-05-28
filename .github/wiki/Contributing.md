# Contributing

## Prerequisites

- Node.js 20 or later
- pnpm (enabled via corepack: `corepack enable`)

## Setup

```sh
git clone https://github.com/acamarata/luxon-hijri.git
cd luxon-hijri
pnpm install
```

## Development

```sh
pnpm build          # compile TypeScript
pnpm test           # build + run test suite
pnpm run typecheck  # type-check without emitting
pnpm run lint       # ESLint
pnpm run format     # Prettier format
```

## Architecture

luxon-hijri is a thin adapter layer. All calendar conversion logic lives in `hijri-core`. This package's responsibility is mapping Luxon's API surface to hijri-core's conversion functions.

When adding features, ask first whether the logic belongs in `hijri-core` (shared across all wrappers) or in this package (Luxon-specific adapter code).

## Test Cross-Validation

The test suite validates against known UAQ table dates and ICOP Ramadan moon sighting dates. When modifying conversion logic, run the cross-validation tests and verify all pass.

See [Architecture](Architecture) for the expected date ranges.

## Pull Requests

- One logical change per PR
- Include cross-validation tests for any new date logic
- Update `CHANGELOG.md` under `[Unreleased]`
- Do not bump the version number
