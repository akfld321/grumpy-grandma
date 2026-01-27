const lunisolar = require('lunisolar');

// Test date: 1996-05-05 14:30
const date = new Date(1996, 4, 5, 14, 30); // Month is 0-indexed
const result = lunisolar(date);

console.log("Format Test (Default):", result.format('cY cM cD cH'));
console.log("Gan-Zhi Year:", result.char8.year);
console.log("Gan-Zhi Month:", result.char8.month);
console.log("Gan-Zhi Day:", result.char8.day);
console.log("Gan-Zhi Hour:", result.char8.hour);

// Check if we can get Korean strings or if we need a mapping table
console.log("Full Object:", JSON.stringify(result, null, 2));
