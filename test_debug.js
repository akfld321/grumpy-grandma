const { calculateSaju } = require('./lib/saju');

try {
    console.log("Testing calculateSaju...");
    const result = calculateSaju(1996, 5, 5, 12);
    console.log("Result:", result);
} catch (error) {
    console.error("Error running calculateSaju:", error);
}
