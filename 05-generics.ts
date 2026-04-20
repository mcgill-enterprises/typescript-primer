// =============================================================================
// SECTION 5: Generics (For Reusable Code)
// McGill Enterprises — TypeScript Primer
// =============================================================================
//
// Generics let you write code that works with ANY type while remaining fully
// type-safe. Instead of hardcoding a specific type, you use a *type parameter*
// (commonly written as T) as a placeholder that gets filled in at call time.
//
// Without generics → you write a separate function for each type
// With generics    → one function, any type, full safety
// =============================================================================


// -----------------------------------------------------------------------------
// 1. THE PROBLEM GENERICS SOLVE
// -----------------------------------------------------------------------------

// Without generics, you'd need one function per type:
function firstNumber(arr: number[]): number | undefined { return arr[0]; }
function firstString(arr: string[]): string | undefined { return arr[0]; }
// ...and so on. Not scalable.

// WITH generics — one function works for every type:
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
// The <T> declares the type parameter. TypeScript fills it in from the argument.

const f1 = first([10, 20, 30]);          // T inferred as number → returns number | undefined
const f2 = first(["a", "b", "c"]);       // T inferred as string → returns string | undefined
const f3 = first<boolean>([true, false]); // T explicitly set to boolean

console.log("--- Generic Function ---");
console.log(f1, f2, f3); // 10, "a", true


// -----------------------------------------------------------------------------
// 2. GENERIC INTERFACES
// A shape that works for any data type inside it.
// The ApiResponse wrapper below is used across all of McGill's services.
// -----------------------------------------------------------------------------

interface ApiResponse<T> {
  success:   boolean;
  data:      T;              // T is whatever the endpoint returns
  error?:    string;
  requestId: string;
  timestamp: string;
}

interface Employee {
  id:         number;
  name:       string;
  department: string;
  salary:     number;
}

interface Project {
  id:     string;
  name:   string;
  budget: number;
}

// The same wrapper, but T = Employee here:
const employeeResponse: ApiResponse<Employee> = {
  success:   true,
  data:      { id: 1001, name: "Aino Mäkinen", department: "Engineering", salary: 95_000 },
  requestId: "req-001",
  timestamp: new Date().toISOString(),
};

// And T = Project[] here:
const projectResponse: ApiResponse<Project[]> = {
  success:   true,
  data:      [
    { id: "PRJ-001", name: "Alpha Modernization", budget: 450_000 },
    { id: "PRJ-002", name: "Data Platform",       budget: 320_000 },
  ],
  requestId: "req-002",
  timestamp: new Date().toISOString(),
};

console.log("\n--- Generic Interface ---");
console.log("Employee:", employeeResponse.data.name);
console.log("Projects:", projectResponse.data.map((p) => p.name).join(", "));


// -----------------------------------------------------------------------------
// 3. GENERIC CONSTRAINTS  ( T extends SomeType )
// Constrain T so it must have at least certain properties.
// This lets you access those properties safely inside the generic function.
// -----------------------------------------------------------------------------

interface HasId {
  id: number | string;
}

function findById<T extends HasId>(items: T[], id: number | string): T | undefined {
  return items.find((item) => item.id === id);
}
// T can be anything, as long as it has an `id` field.

const employees: Employee[] = [
  { id: 1001, name: "Aino Mäkinen",   department: "Engineering", salary: 95_000 },
  { id: 1002, name: "Siiri Korhonen", department: "Finance",     salary: 88_000 },
];

const found = findById(employees, 1002); // TypeScript knows this returns Employee | undefined
console.log("\n--- Generic Constraint ---");
console.log("Found:", found?.name); // Siiri Korhonen


// -----------------------------------------------------------------------------
// 4. MULTIPLE TYPE PARAMETERS
// A function can have more than one type parameter.
// -----------------------------------------------------------------------------

// Pairs two values of potentially different types
function zip<A, B>(listA: A[], listB: B[]): [A, B][] {
  return listA.map((a, i) => [a, listB[i]] as [A, B]);
}

const names  = ["Sarah", "Priya", "Amara"];
const levels = [3, 2, 2];
const pairs  = zip(names, levels);

console.log("\n--- Multiple Type Parameters ---");
console.log(pairs); // [["Sarah", 3], ["Priya", 2], ["Amara", 2]]


// -----------------------------------------------------------------------------
// 5. GENERIC CLASS — a reusable in-memory repository
// -----------------------------------------------------------------------------

class Repository<T extends HasId> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  findById(id: number | string): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  getAll(): T[] {
    return [...this.items]; // return a copy — never expose the internal array
  }

  get count(): number {
    return this.items.length;
  }
}

const employeeRepo = new Repository<Employee>();
employeeRepo.add({ id: 1001, name: "Aino Mäkinen",   department: "Engineering", salary: 95_000 });
employeeRepo.add({ id: 1002, name: "Siiri Korhonen", department: "Finance",     salary: 88_000 });
employeeRepo.add({ id: 1003, name: "Taavi Leinonen", department: "Operations",  salary: 79_000 });

console.log("\n--- Generic Class ---");
console.log("Total employees:", employeeRepo.count);
console.log("Find 1002:", employeeRepo.findById(1002)?.name);


// -----------------------------------------------------------------------------
// 6. BUILT-IN UTILITY TYPES (generic helpers TypeScript ships with)
// These deserve their own full section — see Section 12.
// Here's a quick preview of the most common ones:
// -----------------------------------------------------------------------------

// Partial<T> — make every field optional (useful for update payloads)
type EmployeeUpdate = Partial<Employee>;
const patch: EmployeeUpdate = { salary: 100_000 }; // only update salary ✅

// Pick<T, Keys> — keep only specific fields
type EmployeeSummary = Pick<Employee, "id" | "name">;
const summary: EmployeeSummary = { id: 1001, name: "Aino Mäkinen" };

// Omit<T, Keys> — drop specific fields
type NewEmployee = Omit<Employee, "id">;
const newHire: NewEmployee = { name: "Liisa Nieminen", department: "Finance", salary: 72_000 };

// Record<Keys, Values> — typed key-value map
type SalaryMap = Record<string, number>;
const salaries: SalaryMap = { Engineering: 95_000, Finance: 88_000, Operations: 79_000 };

console.log("\n--- Utility Types Preview ---");
console.log("Patch:", patch);
console.log("Summary:", summary);
console.log("Salaries:", salaries);


console.log("\n✅ Section 5 complete — Generics (For Reusable Code)");
