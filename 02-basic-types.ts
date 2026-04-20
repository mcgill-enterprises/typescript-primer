// =============================================================================
// SECTION 2: Basic Types You'll Use
// McGill Enterprises — TypeScript Primer
// =============================================================================
//
// TypeScript has a small set of core types that cover the vast majority of
// day-to-day code. Learn these and you're ready for 80% of real-world work.
// =============================================================================


// -----------------------------------------------------------------------------
// 1. THE THREE PRIMITIVES
// string, number, boolean — the building blocks of almost everything.
// -----------------------------------------------------------------------------

let companyName:      string  = "McGill Enterprises";
let employeeCount:    number  = 142;
let isPubliclyTraded: boolean = false;

// Numbers in TypeScript are always floating point (no separate int type).
// You can use underscores as digit separators for readability:
let annualRevenue: number = 12_400_000; // same as 12400000, just easier to read
let taxRate:       number = 0.26;

console.log("--- Primitives ---");
console.log(`${companyName}: ${employeeCount} employees, revenue $${annualRevenue.toLocaleString()}`);


// -----------------------------------------------------------------------------
// 2. ARRAYS
// Two equivalent syntaxes — pick one and be consistent.
// -----------------------------------------------------------------------------

let departments:      string[] = ["Engineering", "Finance", "Operations", "HR"];
let quarterlyRevenue: number[] = [3_100_000, 2_980_000, 3_450_000, 2_870_000];

// Alternative syntax using the generic form (covered more in Section 5):
let projectIds: Array<string> = ["PRJ-001", "PRJ-002", "PRJ-003"];

console.log("\n--- Arrays ---");
console.log("Departments:", departments.join(", "));
console.log("Best quarter: $" + Math.max(...quarterlyRevenue).toLocaleString());


// -----------------------------------------------------------------------------
// 3. TUPLES
// A fixed-length array where each position has a known, specific type.
// Great for structured pairs or rows of data.
// -----------------------------------------------------------------------------

// [id, name, salary]
let topEarner: [number, string, number] = [1001, "James Okafor", 120_000];

console.log("\n--- Tuples ---");
console.log(`Top earner: #${topEarner[0]} — ${topEarner[1]}, $${topEarner[2].toLocaleString()}`);


// -----------------------------------------------------------------------------
// 4. ENUMS
// A named set of constants — far more readable than sprinkling raw strings
// or magic numbers throughout your code.
// -----------------------------------------------------------------------------

// String enums: the value IS the string (great for logs, APIs, databases)
enum Department {
  Engineering = "ENGINEERING",
  Finance     = "FINANCE",
  Operations  = "OPERATIONS",
  HR          = "HR",
}

// Numeric enums: auto-increments from 0, or you set the start
enum EmployeeLevel {
  Junior = 1,
  Mid    = 2,
  Senior = 3,
  Lead   = 4,
  Staff  = 5,
}

let myDept:  Department    = Department.Engineering;
let myLevel: EmployeeLevel = EmployeeLevel.Senior;

console.log("\n--- Enums ---");
console.log(`Department: ${myDept}`);                      // "ENGINEERING"
console.log(`Level: ${EmployeeLevel[myLevel]} (${myLevel})`); // "Senior (3)"


// -----------------------------------------------------------------------------
// 5. any AND unknown — the escape hatches (use sparingly)
// -----------------------------------------------------------------------------

// `any` turns off all type checking. It's a last resort — avoid it.
// Use it only when integrating with truly untyped legacy code.
let legacyConfig: any = { timeout: 5000 };
legacyConfig = "reassigned to a string"; // TypeScript won't complain, but you lose all safety

// `unknown` is the SAFE alternative to any.
// You must check the type before using it — TypeScript forces you to be careful.
let apiPayload: unknown = JSON.parse('{"status":"ok","code":200}');

if (typeof apiPayload === "object" && apiPayload !== null && "code" in apiPayload) {
  console.log("\n--- unknown type ---");
  console.log("Parsed payload:", apiPayload);
}


// -----------------------------------------------------------------------------
// 6. null AND undefined
// With strict mode on (our tsconfig has this), TypeScript tracks these
// separately and prevents you from calling methods on a value that might
// be null or undefined.
// -----------------------------------------------------------------------------

let managerId: number | null = null; // explicitly "no manager yet"
let nickname:  string | undefined;   // not yet assigned

// To safely use a nullable value, check it first:
if (managerId !== null) {
  console.log("Manager ID:", managerId);
} else {
  console.log("\n--- null/undefined ---");
  console.log("This employee has no manager (top of the hierarchy)");
}

// Nullish coalescing (??) provides a default when a value is null or undefined:
let displayName = nickname ?? "No nickname set";
console.log("Nickname:", displayName);

// Optional chaining (?.) short-circuits instead of throwing if something is null:
let upperNickname = nickname?.toUpperCase(); // undefined instead of a crash
console.log("Upper nickname:", upperNickname);


// -----------------------------------------------------------------------------
// 7. void AND never
// -----------------------------------------------------------------------------

// void — a function that intentionally returns nothing
function logEvent(event: string): void {
  console.log(`\n[EVENT] ${new Date().toISOString()} — ${event}`);
}

// never — a function that never returns at all (always throws or loops forever)
function failWith(message: string): never {
  throw new Error(`[FATAL] ${message}`);
}

logEvent("Section 2 — basic types demo completed");

// Uncomment to see never in action:
// failWith("Something went catastrophically wrong");


// -----------------------------------------------------------------------------
// 8. TYPE ASSERTIONS
// When YOU know more about a type than TypeScript does.
// Use with care — you're telling the compiler "trust me".
// -----------------------------------------------------------------------------

// Common when working with DOM elements or JSON from an API:
const rawValue: unknown = "McGill Enterprises";
const companyString = rawValue as string; // assert that this unknown is a string
console.log("Asserted string length:", companyString.length);


console.log("\n✅ Section 2 complete — Basic Types You'll Use");
