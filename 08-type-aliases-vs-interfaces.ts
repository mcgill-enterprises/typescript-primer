// =============================================================================
// SECTION 8: Type Aliases vs Interfaces
// McGill Enterprises — TypeScript Primer
// =============================================================================
//
// Both `type` and `interface` let you name and reuse type definitions,
// and for basic object shapes they look almost identical. But they have
// meaningful differences that affect which one to reach for.
//
// SHORT ANSWER:
//   Use `interface` for object shapes (especially those others extend or implement)
//   Use `type`      for everything else: unions, intersections, tuples, primitives
// =============================================================================


// -----------------------------------------------------------------------------
// 1. THEY LOOK ALMOST THE SAME FOR BASIC OBJECTS
// -----------------------------------------------------------------------------

// Using interface:
interface EmployeeInterface {
  id:         number;
  name:       string;
  department: string;
}

// Using type alias:
type EmployeeType = {
  id:         number;
  name:       string;
  department: string;
};

// Both work identically for creating objects:
const emp1: EmployeeInterface = { id: 1001, name: "Aino Mäkinen",   department: "Engineering" };
const emp2: EmployeeType      = { id: 1002, name: "Siiri Korhonen", department: "Finance"     };

console.log("--- Both look the same ---");
console.log(emp1.name, emp2.name);


// -----------------------------------------------------------------------------
// 2. KEY DIFFERENCE: type CAN do things interface CANNOT
// -----------------------------------------------------------------------------

// ✅ Union types — only possible with `type`
type EmploymentStatus = "active" | "on-leave" | "terminated";
type EmployeeId       = number | string;   // could be a DB int OR a URL slug

// ✅ Tuple types
type Coordinate = [latitude: number, longitude: number];
type NamePair   = [firstName: string, lastName: string];

// ✅ Primitive aliases (adds semantic meaning)
type Salary    = number;
type Email     = string;
type Timestamp = string; // ISO 8601 date string

// ✅ Intersection — combine multiple types into one
type Manager = EmployeeInterface & {
  teamSize:  number;
  budget:    Salary;
};

// ✅ Computed / mapped types (advanced)
type ReadonlyEmployee = Readonly<EmployeeInterface>;
type PartialEmployee  = Partial<EmployeeInterface>;

const status: EmploymentStatus  = "active";
const coords: Coordinate        = [45.5017, -73.5673]; // Montreal
const mgr: Manager              = { id: 2001, name: "Eero Virtanen", department: "Engineering", teamSize: 12, budget: 2_400_000 };

console.log("\n--- type-only features ---");
console.log("Status:", status);
console.log("Coords:", coords);
console.log("Manager:", mgr.name, "— team:", mgr.teamSize);


// -----------------------------------------------------------------------------
// 3. KEY DIFFERENCE: interface SUPPORTS DECLARATION MERGING
// If you declare the same interface name twice, TypeScript merges them.
// This is impossible with type aliases.
// -----------------------------------------------------------------------------

interface AppConfig {
  apiUrl:  string;
  version: string;
}

// Declared again — TypeScript merges this into the same interface:
interface AppConfig {
  timeout:      number;
  maxRetries:   number;
}

// Now AppConfig requires ALL four fields:
const config: AppConfig = {
  apiUrl:     "https://api.mcgill.com",
  version:    "2.1.0",
  timeout:    5_000,
  maxRetries: 3,
};

console.log("\n--- Declaration merging (interface only) ---");
console.log("Config:", config);

// With type, this would be an error:
// type AppConfig = { apiUrl: string };
// type AppConfig = { timeout: number }; // ❌ Duplicate identifier 'AppConfig'


// -----------------------------------------------------------------------------
// 4. KEY DIFFERENCE: interface SUPPORTS implements IN CLASSES
// A class can declare that it implements an interface — TypeScript checks
// that every required method and property is present.
// -----------------------------------------------------------------------------

interface Repository<T> {
  findById(id: number): T | undefined;
  findAll(): T[];
  save(item: T): void;
}

interface Employee {
  id:         number;
  name:       string;
  department: string;
  salary:     number;
}

class EmployeeRepository implements Repository<Employee> {
  private store: Employee[] = [];

  findById(id: number): Employee | undefined {
    return this.store.find((e) => e.id === id);
  }

  findAll(): Employee[] {
    return [...this.store];
  }

  save(emp: Employee): void {
    const index = this.store.findIndex((e) => e.id === emp.id);
    if (index >= 0) {
      this.store[index] = emp;
    } else {
      this.store.push(emp);
    }
  }
}

const repo = new EmployeeRepository();
repo.save({ id: 1001, name: "Aino Mäkinen", department: "Engineering", salary: 95_000 });
repo.save({ id: 1002, name: "Siiri Korhonen", department: "Finance", salary: 88_000 });

console.log("\n--- interface with implements ---");
console.log("All employees:", repo.findAll().map((e) => e.name).join(", "));


// -----------------------------------------------------------------------------
// 5. THE DECISION GUIDE
// -----------------------------------------------------------------------------
//
//  Is it an object shape that classes implement?        → interface
//  Will other interfaces extend it?                     → interface
//  Does it use union  (A | B)?                         → type
//  Does it use intersection (A & B)?                   → type
//  Is it a primitive alias, tuple, or function type?   → type
//  Is it a library type you need to extend/augment?    → interface
//
// When in doubt: reach for interface first.
// If you need something interface can't express, switch to type.

console.log("\n✅ Section 8 complete — Type Aliases vs Interfaces");
