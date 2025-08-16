// Test script to verify date parsing fix
import { parseDate, formatDate } from './frontend/finance-frontend/src/utils/formatters.js';

console.log("=== Testing Date Parsing Fix ===\n");

// Test cases
const testCases = [
  { input: "08-09-2025", expected: "2025-08-09", description: "DD-MM-YYYY (8th August)" },
  { input: "09-08-2025", expected: "2025-09-08", description: "DD-MM-YYYY (9th September)" },
  { input: "2025-08-09", expected: "2025-08-09", description: "YYYY-MM-DD (already correct)" },
  { input: "08/09/2025", expected: "2025-08-09", description: "DD/MM/YYYY (8th August)" },
  { input: "09/08/2025", expected: "2025-09-08", description: "DD/MM/YYYY (9th September)" },
];

testCases.forEach(({ input, expected, description }) => {
  const result = parseDate(input);
  const formatted = formatDate(result);
  const isCorrect = result === expected;
  
  console.log(`Input: "${input}" (${description})`);
  console.log(`Parsed: "${result}"`);
  console.log(`Formatted: "${formatted}"`);
  console.log(`Correct: ${isCorrect ? "✓" : "✗"}`);
  console.log("---");
});

console.log("=== Test Complete ===");
console.log("If all tests show ✓, then the date parsing fix is working correctly!"); 