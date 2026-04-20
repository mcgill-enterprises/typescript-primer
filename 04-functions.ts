// =============================================================================
// SECTION 4: Functions
// McGill Enterprises — TypeScript Primer
// =============================================================================
//
// TypeScript adds type annotations to every part of a function:
//   - what types the parameters must be
//   - what type the function returns
//   - which parameters are optional or have defaults
//
// This makes it impossible to call a function the wrong way, and gives your
// editor perfect autocomplete on the return value.
// =============================================================================

interface Employee {
  id:         number;
  name:       string;
  department: string;
  salary:     number;
  active:     boolean;
}


// -----------------------------------------------------------------------------
// 1. BASIC TYPED FUNCTION
// Syntax: function name(param: Type): ReturnType { ... }
// -----------------------------------------------------------------------------

function formatCurrency(amount: number, currencyCode: string): string {
  return `${currencyCode} ${amount.toLocaleString("en-CA", { minimumFractionDigits: 2 })}`;
}

console.log("--- Basic Typed Function ---");
console.log(formatCurrency(1_450_000, "CAD")); // CAD 1,450,000.00

// TypeScript prevents wrong calls (uncomment to see errors):
// formatCurrency("one million", "CAD"); // ❌ string is not assignable to number
// formatCurrency(1_000_000);            // ❌ Expected 2 arguments, but got 1


// -----------------------------------------------------------------------------
// 2. OPTIONAL PARAMETERS  ( param?: Type )
// Optional parameters must come AFTER required ones.
// Inside the function, an optional param is Type | undefined.
// -----------------------------------------------------------------------------

function buildEmail(firstName: string, lastName: string, domain?: string): string {
  const host = domain ?? "mcgill-enterprises.net"; // use the default if domain was not passed
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${host}`;
}

console.log("\n--- Optional Parameters ---");
console.log(buildEmail("Sarah", "Chen"));                       // s.chen@mcgill-enterprises.net
console.log(buildEmail("James", "Okafor", "corp.mcgill-enterprises.net")); // james.okafor@corp.mcgill-enterprises.net


// -----------------------------------------------------------------------------
// 3. DEFAULT PARAMETERS  ( param: Type = defaultValue )
// The parameter gets a value even when the caller doesn't provide one.
// Unlike optional params, defaults are never undefined inside the function.
// -----------------------------------------------------------------------------

function calculateBonus(
  salary:          number,
  performanceRating: number,
  bonusCapPercent: number = 20,   // default: 20% cap
): number {
  const rawBonus = salary * (performanceRating / 100);
  const cap      = salary * (bonusCapPercent / 100);
  return Math.min(rawBonus, cap);
}

console.log("\n--- Default Parameters ---");
console.log("Bonus (default 20% cap):", formatCurrency(calculateBonus(95_000, 18), "CAD"));
console.log("Bonus (custom 25% cap): ", formatCurrency(calculateBonus(95_000, 18, 25), "CAD"));


// -----------------------------------------------------------------------------
// 4. REST PARAMETERS  ( ...param: Type[] )
// Accepts any number of arguments of the same type.
// Always the last parameter; TypeScript treats it as an array inside.
// -----------------------------------------------------------------------------

function averageRatings(employeeName: string, ...ratings: number[]): string {
  if (ratings.length === 0) return `${employeeName}: no ratings yet`;
  const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
  return `${employeeName}: avg ${avg.toFixed(1)} / 10`;
}

console.log("\n--- Rest Parameters ---");
console.log(averageRatings("Aino Mäkinen", 8, 9, 7, 10, 9));
console.log(averageRatings("Eero Virtanen", 9, 10, 9, 10));


// -----------------------------------------------------------------------------
// 5. ARROW FUNCTIONS
// Same typing rules, more concise syntax. The return type can usually
// be inferred when the body is a single expression.
// -----------------------------------------------------------------------------

// Full annotation:
const applyRaise = (emp: Employee, percent: number): Employee => ({
  ...emp,
  salary: Math.round(emp.salary * (1 + percent / 100)),
});

// Return type inferred (TypeScript figures it out from the expression):
const getFullName = (emp: Employee) => `${emp.name}`;

const sarah: Employee = { id: 1001, name: "Aino Mäkinen", department: "Engineering", salary: 95_000, active: true };
const raisedSarah     = applyRaise(sarah, 10);

console.log("\n--- Arrow Functions ---");
console.log(`${getFullName(sarah)}: $${sarah.salary.toLocaleString()} → $${raisedSarah.salary.toLocaleString()} (+10%)`);


// -----------------------------------------------------------------------------
// 6. FUNCTION TYPE ALIASES
// Give a function signature a name so you can reuse it as a type.
// Very common when passing functions as arguments (callbacks, handlers).
// -----------------------------------------------------------------------------

type FilterFn    = (emp: Employee) => boolean;
type TransformFn = (emp: Employee) => Employee;

const isActive:        FilterFn = (emp) => emp.active;
const isEngineering:   FilterFn = (emp) => emp.department === "Engineering";
const applyTenPercent: TransformFn = (emp) => applyRaise(emp, 10);

const employees: Employee[] = [
  sarah,
  { id: 1002, name: "Siiri Korhonen",   department: "Finance",     salary: 88_000, active: true  },
  { id: 1003, name: "Paavo Salminen",   department: "Engineering", salary: 102_000, active: false },
  { id: 1004, name: "Taavi Leinonen",   department: "Operations",  salary: 79_000, active: true  },
  { id: 1005, name: "Mikko Järvinen", department: "Engineering", salary: 91_000, active: true  },
];

const activeEngineers = employees.filter(isActive).filter(isEngineering);
console.log("\n--- Function Type Aliases ---");
console.log("Active engineers:", activeEngineers.map((e) => e.name));


// -----------------------------------------------------------------------------
// 7. HIGHER-ORDER FUNCTIONS
// Functions that accept or return other functions.
// This pattern is everywhere in TypeScript codebases.
// -----------------------------------------------------------------------------

// A factory that creates a department filter on the fly:
function byDepartment(dept: string): FilterFn {
  return (emp) => emp.department === dept && emp.active;
}

// A function that applies any transform to a list:
function applyToAll(list: Employee[], transform: TransformFn): Employee[] {
  return list.map(transform);
}

const raisedEngineers = applyToAll(activeEngineers, applyTenPercent);
console.log("\n--- Higher-Order Functions ---");
for (const emp of raisedEngineers) {
  console.log(`  ${emp.name}: $${emp.salary.toLocaleString()}`);
}


// -----------------------------------------------------------------------------
// 8. FUNCTION OVERLOADS
// When a function behaves differently depending on the argument type.
// Declare the call signatures first (no body), then the implementation.
// -----------------------------------------------------------------------------

// Overload signatures — callers see these:
function findEmployee(id: number): Employee | undefined;
function findEmployee(name: string): Employee[];

// Implementation — handles both cases:
function findEmployee(idOrName: number | string): Employee | Employee[] | undefined {
  if (typeof idOrName === "number") {
    return employees.find((e) => e.id === idOrName);
  }
  return employees.filter((e) =>
    e.name.toLowerCase().includes(idOrName.toLowerCase())
  );
}

console.log("\n--- Function Overloads ---");
const byId   = findEmployee(1001);        // returns Employee | undefined
const byName = findEmployee("a");         // returns Employee[]
console.log("By ID 1001:", byId?.name);
console.log("Names containing 'a':", byName.map((e) => e.name));


console.log("\n✅ Section 4 complete — Functions");
