// =============================================================================
// SECTION 9: Union Types (Either/Or)
// McGill Enterprises — TypeScript Primer
// =============================================================================
//
// A union type says: "this value can be ONE of these types."
// Written with a pipe |  between types:   string | number
//
// Unions are one of TypeScript's most practical and frequently used features.
// They let you model the real world accurately — where a value genuinely
// can be more than one thing depending on context.
// =============================================================================


// -----------------------------------------------------------------------------
// 1. BASIC UNIONS
// -----------------------------------------------------------------------------

// An employee ID might come in as a number from the DB or a string from a URL:
type EmployeeId = number | string;

let id1: EmployeeId = 1001;        // ✅ number
let id2: EmployeeId = "EMP-1001";  // ✅ string

// A field that might not exist yet:
let managerId: number | null = null;       // explicitly "no manager assigned"
let nickname:  string | undefined;         // not yet provided


// -----------------------------------------------------------------------------
// 2. STRING LITERAL UNIONS (the most common pattern)
// Restrict a string to a specific set of allowed values.
// Much safer than plain `string` — the compiler tells you if you typo a value.
// -----------------------------------------------------------------------------

type EmploymentStatus = "active" | "on-leave" | "terminated";
type Department       = "Engineering" | "Finance" | "Operations" | "HR" | "Legal";
type Priority         = "low" | "medium" | "high" | "critical";

let status:     EmploymentStatus = "active";
let department: Department       = "Engineering";
let priority:   Priority         = "high";

// status = "retired"; // ❌ ERROR — not one of the allowed values (catches typos!)

console.log("--- String Literal Unions ---");
console.log(`${department} employee — status: ${status}, priority: ${priority}`);


// -----------------------------------------------------------------------------
// 3. NARROWING — working with unions safely
// When you have a union, TypeScript requires you to NARROW the type before
// using type-specific operations. You narrow with typeof, instanceof, or
// a property check.
// -----------------------------------------------------------------------------

function formatId(id: EmployeeId): string {
  if (typeof id === "number") {
    // Inside this block TypeScript KNOWS id is a number
    return `#${id.toFixed(0).padStart(6, "0")}`;
  }
  // Here TypeScript KNOWS id is a string
  return id.toUpperCase();
}

console.log("\n--- Narrowing with typeof ---");
console.log(formatId(1001));       // #001001
console.log(formatId("emp-1001")); // EMP-1001


// -----------------------------------------------------------------------------
// 4. DISCRIMINATED UNIONS (tagged unions)
// Add a shared literal field (the "discriminant") to each member of the union.
// TypeScript uses the discriminant value to narrow automatically.
// This is the best pattern for modelling results, states, and events.
// -----------------------------------------------------------------------------

// A typed API result — success OR failure, never ambiguous:
type ApiResult<T> =
  | { status: "success"; data: T;            requestId: string }
  | { status: "error";   message: string;    code: number      }
  | { status: "loading";                                        };

interface Employee {
  id:         number;
  name:       string;
  department: string;
  salary:     number;
}

function handleResult(result: ApiResult<Employee>): void {
  switch (result.status) {          // TypeScript narrows inside each case
    case "success":
      console.log(`  Employee: ${result.data.name} — ${result.data.department}`);
      break;
    case "error":
      console.log(`  Error ${result.code}: ${result.message}`);
      break;
    case "loading":
      console.log("  Loading...");
      break;
  }
}

console.log("\n--- Discriminated Unions ---");
handleResult({ status: "loading" });
handleResult({ status: "success", data: { id: 1001, name: "Sarah Chen", department: "Engineering", salary: 95_000 }, requestId: "req-001" });
handleResult({ status: "error", message: "Not found", code: 404 });


// -----------------------------------------------------------------------------
// 5. UNION OF OBJECT TYPES
// Unions aren't limited to primitives — you can union entire interfaces.
// -----------------------------------------------------------------------------

interface FullTimeEmployee {
  type:       "full-time";
  id:         number;
  name:       string;
  salary:     number;   // annual
  benefits:   string[];
}

interface Contractor {
  type:      "contractor";
  id:        number;
  name:      string;
  hourlyRate: number;
  agency:    string;
}

type Worker = FullTimeEmployee | Contractor;

function getAnnualCost(worker: Worker): number {
  if (worker.type === "full-time") {
    // TypeScript narrows: worker is FullTimeEmployee — .salary is valid
    return worker.salary * 1.3; // 30% loaded cost (benefits, taxes)
  }
  // TypeScript narrows: worker is Contractor — .hourlyRate is valid
  return worker.hourlyRate * 2_000; // 2,000 working hours per year
}

const workers: Worker[] = [
  { type: "full-time", id: 1001, name: "Sarah Chen",  salary: 95_000, benefits: ["dental", "vision", "RRSP"] },
  { type: "contractor", id: 2001, name: "Dev Agency", hourlyRate: 150, agency: "TechStaff Inc." },
];

console.log("\n--- Union of Object Types ---");
for (const worker of workers) {
  console.log(`  ${worker.name}: $${getAnnualCost(worker).toLocaleString()} / year`);
}


// -----------------------------------------------------------------------------
// 6. EXHAUSTIVENESS CHECKING
// TypeScript can verify that you've handled EVERY case in a union.
// If you add a new variant and forget to handle it, the compiler tells you.
// -----------------------------------------------------------------------------

type PaymentMethod = "credit-card" | "bank-transfer" | "payroll-deduction";

function processPayment(method: PaymentMethod, amount: number): string {
  switch (method) {
    case "credit-card":         return `Charged $${amount} to card`;
    case "bank-transfer":       return `Transferred $${amount} via EFT`;
    case "payroll-deduction":   return `Deducted $${amount} from payroll`;
    default:
      // This line ensures TypeScript will error if a new PaymentMethod is
      // added but not handled above — the `never` assignment will fail.
      const _exhaustiveCheck: never = method;
      return _exhaustiveCheck;
  }
}

console.log("\n--- Exhaustiveness Check ---");
console.log(processPayment("credit-card", 500));
console.log(processPayment("payroll-deduction", 250));


console.log("\n✅ Section 9 complete — Union Types (Either/Or)");
