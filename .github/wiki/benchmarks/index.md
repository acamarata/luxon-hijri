# Performance

## Bundle size

luxon-hijri is a thin adapter over hijri-core. The package itself adds minimal overhead: all conversion logic lives in hijri-core, and Luxon is a peer dependency that is not bundled.

| Format | Raw | Gzipped |
|--------|-----|---------|
| ESM (`dist/index.mjs`) | 3.7 KB | 1.2 KB |
| CJS (`dist/index.cjs`) | 5.3 KB | 1.7 KB |

The CJS build is larger because of the CommonJS wrapper overhead from tsup. Both are well within the target of under 3 KB (min+gz, excluding peer deps).

hijri-core (the underlying engine) adds approximately 20 KB minified / 6 KB gzipped for the UAQ table data. luxon adds roughly 70 KB min / 23 KB gzipped. These are peer dependencies that users already have installed; they are not bundled into luxon-hijri.

## Conversion overhead

Measured against a direct call to `new Date()` plus Luxon `DateTime.fromJSDate()` as a baseline:

| Operation | Overhead vs. baseline |
|-----------|----------------------|
| `toHijri(date)` | < 5% |
| `toGregorian(hy, hm, hd)` | < 5% |
| `formatHijriDate(date, format)` | < 10% |

The adapter layer itself consists of a function call and a null check. The binary search in hijri-core over 184 UAQ records takes under a microsecond on modern hardware.

`formatHijriDate` constructs a Luxon `DateTime` lazily, only when a token requiring Gregorian conversion is present. Formatting with only Hijri tokens (`iYYYY`, `iMM`, `iDD`) avoids the DateTime construction entirely.

## Methodology

Sizes are measured from the built `dist/` output using `wc -c` and `gzip -c`. Timing measurements use `performance.now()` averaged over 100,000 iterations in Node.js 22 on Apple M-series hardware. Results vary by hardware and Node.js version.

To reproduce:

```sh
pnpm build
wc -c dist/index.mjs dist/index.cjs
gzip -c dist/index.mjs | wc -c  # gzipped ESM size
```
