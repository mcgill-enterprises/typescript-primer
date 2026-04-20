// =============================================================================
// SECTION 1: TypeScript = JavaScript + Types
// McGill Enterprises — TypeScript Primer
// =============================================================================
//
// TypeScript is not a replacement for JavaScript — it IS JavaScript, with one
// powerful addition: a type system that catches mistakes before your code runs.
//
// Every .ts file compiles down to plain .js. Node.js and browsers never see
// TypeScript directly; they only ever run the compiled JavaScript output.
//
//   Your .ts file  →  tsc (compiler)  →  .js file  →  Node.js / Browser
//                        ↑
//                  Type errors caught here,
//                  before anything runs
//
// =============================================================================


// -----------------------------------------------------------------------------
// THE CORE IDEA: JavaScript lets anything happen. TypeScript says "not so fast."
// -----------------------------------------------------------------------------

// --- Plain JavaScript behaviour (no safety) ---
// In JS you could write:
//   let salary = 95000;
//   salary = "oops, a string now";   // JS: totally fine, no warning
//   salary * 1.1;                    // JS: NaN — silent bug at runtime
//
// TypeScript catches this at compile time, before it ever runs:

let salary: number = 95_000;
// salary = "oops"; // ❌ ERROR: Type 'string' is not assignable to type 'number'

salary = salary * 1.1; // ✅ TypeScript knows this is safe
console.log(`Adjusted salary: $${salary.toFixed(2)}`);


// -----------------------------------------------------------------------------
// TYPE ANNOTATIONS — telling TypeScript what a variable holds
// Syntax:  variableName: Type
// -----------------------------------------------------------------------------

let employeeName: string  = "Sarah Chen";
let isActive:     boolean = true;
let startYear:    number  = 2019;

// TypeScript can also INFER types — you don't always need to write them out.
// When the type is obvious from the value, inference keeps code clean:
let department    = "Engineering"; // inferred as string
let headcount     = 42;            // inferred as number
let isHiring      = true;          // inferred as boolean

// These still have types — TypeScript just worked them out for you.
// department = 99; // ❌ ERROR — TypeScript inferred string, not number


// -----------------------------------------------------------------------------
// WHAT YOU GET FROM TYPESCRIPT
// -----------------------------------------------------------------------------

// 1. INSTANT FEEDBACK IN YOUR EDITOR
//    VS Code underlines mistakes in red as you type — no need to run anything.

// 2. AUTOCOMPLETE
//    When TypeScript knows a variable is a string, your editor suggests
//    .toUpperCase(), .split(), .includes() — the right methods, every time.

// 3. SAFE REFACTORING
//    Rename a function or change a parameter type — TypeScript immediately
//    shows every place in the codebase that needs updating.

// 4. DOCUMENTATION BUILT INTO THE CODE
//    Types tell the next developer (or future you) exactly what a function
//    expects and returns, without reading through the implementation.


// -----------------------------------------------------------------------------
// A SIDE-BY-SIDE EXAMPLE
// The same function in JavaScript vs TypeScript
// -----------------------------------------------------------------------------

// ---- JavaScript version (no safety) ----
// function getAnnualBonus(salary, rating) {
//   return salary * (rating / 100);   // what if rating is "five"? Silent NaN.
// }

// ---- TypeScript version (safe) ----
function getAnnualBonus(salary: number, rating: number): number {
  return salary * (rating / 100);
}

console.log(getAnnualBonus(95_000, 10)); // ✅ $9,500
// getAnnualBonus("ninety-five thousand", 10); // ❌ caught before it runs


// -----------------------------------------------------------------------------
// THE COMPILATION STEP
// Run this once to install dependencies, then use ts-node to run lessons
// directly without a manual compile step:
//
//   npm install
//   npx ts-node src/01-typescript-vs-javascript.ts
//
// Or compile to JavaScript first:
//   npx tsc
//   node dist/01-typescript-vs-javascript.js
// -----------------------------------------------------------------------------

console.log("\n✅ Section 1 complete — TypeScript = JavaScript + Types");
