
const { calculateSaju } = require('./lib/saju');

// Test Case: 1990-01-01 12:00
const result = calculateSaju(1990, 1, 1, 12);

console.log("=== Saju Result Debug ===");
console.log(JSON.stringify(result.pillars, null, 2));

if (!result.pillars.year.stem.char || result.pillars.year.stem.char === 'undefined') {
    console.error("FAIL: Year Stem Char is missing/undefined");
} else {
    console.log("PASS: Year Stem Char is present: " + result.pillars.year.stem.char);
}
