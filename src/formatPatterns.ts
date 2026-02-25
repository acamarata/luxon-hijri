// formatPatterns.ts
// Define a mapping of Hijri format tokens to their meanings
export const formatPatterns = {
    // Hijri Year
    iYYYY: 'Hijri year (4 digits)',
    iYY: 'Hijri year (2 digits)',

    // Hijri Month
    iMM: 'Hijri month (2 digits, zero-padded)',
    iM: 'Hijri month (1 or 2 digits without zero-padding)',
    iMMM: 'Hijri month (abbreviated name)',
    iMMMM: 'Hijri month (full name)',

    // Hijri Day
    iDD: 'Hijri day of the month (2 digits, zero-padded)',
    iD: 'Hijri day of the month (1 or 2 digits without zero-padding)',

    // Hijri Weekday
    iE: 'Hijri weekday (1 digit)',
    iEEE: 'Hijri weekday (abbreviated name)',
    iEEEE: 'Hijri weekday (full name)',

    // Hour, Minute, Second
    // These can remain the same as in Gregorian as they don’t change in Hijri
    HH: 'Hour (2 digits, zero-padded, 24-hour clock)',
    H: 'Hour (1 or 2 digits without zero-padding, 24-hour clock)',
    hh: 'Hour (2 digits, zero-padded, 12-hour clock)',
    h: 'Hour (1 or 2 digits without zero-padding, 12-hour clock)',
    mm: 'Minute (2 digits, zero-padded)',
    m: 'Minute (1 or 2 digits without zero-padding)',
    ss: 'Second (2 digits, zero-padded)',
    s: 'Second (1 or 2 digits without zero-padding)',

    // AM/PM
    a: 'AM/PM marker',

    // Other
    iooo: 'Hijri era (abbreviated)',
    ioooo: 'Hijri era (full)',

    // Timezone
    z: 'Timezone (abbreviated)',
    zz: 'Timezone (medium)',
    zzz: 'Timezone (full)',
    Z: 'Timezone offset from UTC (+HH:MM)',
    ZZ: 'Timezone offset from UTC (condensed)',
};

// Export the patterns for use in the rest of the package
export default formatPatterns;
