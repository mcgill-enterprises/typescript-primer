// =============================================================================
// SECTION 12: Utility Types (Built-in Helpers)
// McGill Enterprises — TypeScript Primer
// =============================================================================
//
// TypeScript ships with a set of generic utility types that transform existing
// types into new ones. They eliminate boilerplate and handle the most common
// "I need a version of this type, but slightly different" situations.
//
// You don't need to install anything — these are built into TypeScript.
// =============================================================================

interface Employee {
  id:         number;
  firstName:  string;
  lastName:   string;
  email:      string;
  department: string;
  salary:     number;
  managerId?: number;
}

interface Project {
  id:     string;
  name:   string;
  budget: number;
  status: "planning" | "active" | "completed" | "archived";
}


// -----------------------------------------------------------------------------
// 1. Partial<T>
// Makes every property of T optional.
// Most useful for: update/patch payloads where you only send changed fields.
// -----------------------------------------------------------------------------

type EmployeeUpdate = Partial<Employee>;
// Equivalent to: { id?: number; firstName?: string; lastName?: string; ... }

const patch: EmployeeUpdate = { salary: 100_000 }; // only updating one field ✅

function updateEmployee(id: number, updates: Partial<Employee>): Employee {
  const existing: Employee = { id, firstName: "Sarah", lastName: "Chen", email: "s.chen@mcgill.com", department: "Engineering", salary: 95_000 };
  return { ...existing, ...updates };
}

console.log("--- Partial<T> ---");
console.log(updateEmployee(1001, { salary: 105_000, department: "Finance" }));


// -----------------------------------------------------------------------------
// 2. Required<T>
// Makes every property required — the opposite of Partial.
// Useful when you want to enforce that optional fields have been filled in.
// -----------------------------------------------------------------------------

interface DraftEmployee {
  firstName?: string;
  lastName?:  string;
  email?:     string;
  department?: string;
  salary?:    number;
}

type CompleteEmployee = Required<DraftEmployee>;
// Every field is now mandatory — no more ?

const complete: CompleteEmployee = {
  firstName: "Chloe", lastName: "Bouchard", email: "c.bouchard@mcgill.com",
  department: "Finance", salary: 72_000,
};

console.log("\n--- Required<T> ---");
console.log(complete);


// -----------------------------------------------------------------------------
// 3. Readonly<T>
// Makes every property immutable. TypeScript errors if you try to change it.
// Great for config objects, seed data, and values that should never mutate.
// -----------------------------------------------------------------------------

type FrozenEmployee = Readonly<Employee>;

const config: Readonly<{ apiUrl: string; timeout: number }> = {
  apiUrl: "https://api.mcgill.com",
  timeout: 5_000,
};

// config.timeout = 10_000; // ❌ Cannot assign — it is read-only

console.log("\n--- Readonly<T> ---");
console.log("Config is locked:", config);


// -----------------------------------------------------------------------------
// 4. Pick<T, Keys>
// Creates a new type with ONLY the specified keys from T.
// Great for trimming down a large type to just what a function or view needs.
// -----------------------------------------------------------------------------

type EmployeeSummary   = Pick<Employee, "id" | "firstName" | "lastName">;
type EmployeeContact   = Pick<Employee, "firstName" | "lastName" | "email">;
type EmployeeFinancial = Pick<Employee, "id" | "salary" | "managerId">;

const summary: EmployeeSummary = { id: 1001, firstName: "Sarah", lastName: "Chen" };
const contact: EmployeeContact = { firstName: "Sarah", lastName: "Chen", email: "s.chen@mcgill.com" };

console.log("\n--- Pick<T, Keys> ---");
console.log("Summary:", summary);
console.log("Contact:", contact);


// -----------------------------------------------------------------------------
// 5. Omit<T, Keys>
// Creates a new type with specific keys REMOVED.
// The mirror image of Pick — use when it's easier to say what to leave out.
// Most common use: omit auto-generated fields like `id` from create payloads.
// -----------------------------------------------------------------------------

type CreateEmployeePayload = Omit<Employee, "id">;           // drop the DB-generated id
type PublicEmployee        = Omit<Employee, "salary" | "managerId">; // drop sensitive fields

const newHirePayload: CreateEmployeePayload = {
  firstName: "Lucas", lastName: "Ferreira", email: "l.ferreira@mcgill.com",
  department: "Engineering", salary: 91_000,
};

console.log("\n--- Omit<T, Keys> ---");
console.log("Create payload:", newHirePayload);


// -----------------------------------------------------------------------------
// 6. Record<Keys, ValueType>
// Creates a type representing a key-value map.
// Keys can be a union of strings or a string type.
// -----------------------------------------------------------------------------

type DepartmentPayroll = Record<string, number>;
type ProjectsByStatus  = Record<Project["status"], Project[]>;

const payroll: DepartmentPayroll = {
  Engineering: 450_000,
  Finance:     176_000,
  Operations:  237_000,
};

const byStatus: ProjectsByStatus = {
  planning:  [],
  active:    [{ id: "PRJ-001", name: "Alpha", budget: 450_000, status: "active" }],
  completed: [],
  archived:  [],
};

console.log("\n--- Record<K, V> ---");
console.log("Payroll:", payroll);
console.log("Active projects:", byStatus.active.map((p) => p.name));


// -----------------------------------------------------------------------------
// 7. ReturnType<T>
// Extracts the return type of a function type.
// Handy when you want to type a variable as "whatever this function returns"
// without repeating yourself.
// -----------------------------------------------------------------------------

function getEmployeeProfile(id: number) {
  return { id, name: "Aino Mäkinen", department: "Engineering", yearsOfService: 5 };
}

type EmployeeProfile = ReturnType<typeof getEmployeeProfile>;
// Equivalent to: { id: number; name: string; department: string; yearsOfService: number }

const profile: EmployeeProfile = getEmployeeProfile(1001);
console.log("\n--- ReturnType<T> ---");
console.log("Profile:", profile);


// -----------------------------------------------------------------------------
// 8. Parameters<T>
// Extracts the parameter types of a function as a tuple.
// Useful for forwarding or wrapping function arguments.
// -----------------------------------------------------------------------------

function createProject(name: string, budget: number, ownerId: number): Project {
  return { id: `PRJ-${Date.now()}`, name, budget, status: "planning" };
}

type CreateProjectArgs = Parameters<typeof createProject>;
// Equivalent to: [name: string, budget: number, ownerId: number]

const args: CreateProjectArgs = ["Beta Platform", 320_000, 1001];
const project = createProject(...args);

console.log("\n--- Parameters<T> ---");
console.log("Project:", project.name, `— $${project.budget.toLocaleString()}`);


// -----------------------------------------------------------------------------
// 9. NonNullable<T>
// Removes null and undefined from a union type.
// -----------------------------------------------------------------------------

type MaybeId      = number | null | undefined;
type DefinitelyId = NonNullable<MaybeId>; // just: number

function requireId(id: MaybeId): DefinitelyId {
  if (id == null) throw new Error("ID is required");
  return id;
}

console.log("\n--- NonNullable<T> ---");
console.log("ID:", requireId(1001));


// -----------------------------------------------------------------------------
// 10. COMBINING UTILITY TYPES
// The real power comes from composing them together.
// -----------------------------------------------------------------------------

// A read-only update payload that excludes the ID and email:
type SafeUpdate = Readonly<Partial<Omit<Employee, "id" | "email">>>;

const safeUpdate: SafeUpdate = { salary: 102_000, department: "Finance" };
// safeUpdate.salary = 0; // ❌ Readonly prevents mutation

console.log("\n--- Combined Utility Types ---");
console.log("Safe update:", safeUpdate);


console.log("\n✅ Section 12 complete — Utility Types (Built-in Helpers)");
