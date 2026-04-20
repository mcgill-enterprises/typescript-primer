// =============================================================================
// SECTION 15: Quick Reference for Your SDK Work
// McGill Enterprises — TypeScript Primer
// =============================================================================
//
// Bookmark this file. It's a condensed cheat sheet of the TypeScript you'll
// reach for every day when building or consuming APIs and SDKs.
// All examples use the McGill HR domain.
// =============================================================================


// ─────────────────────────────────────────────────────────────────────────────
// TYPE ANNOTATIONS
// ─────────────────────────────────────────────────────────────────────────────

let name:    string  = "Sarah Chen";
let salary:  number  = 95_000;
let active:  boolean = true;
let managed: null    = null;
let pending: undefined;

// Arrays
let ids:   number[] = [1001, 1002, 1003];
let names: string[] = ["Sarah", "James", "Priya"];

// Tuples
let record: [number, string, number] = [1001, "Sarah", 95_000];

// Union
let id: number | string = "EMP-1001";

// Literal union
type Status = "active" | "on-leave" | "terminated";
let status: Status = "active";


// ─────────────────────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────────────────────

interface Employee {
  id:           number;
  name:         string;
  department:   string;
  salary:       number;
  phoneNumber?: string;           // optional
  readonly code: string;          // immutable after creation
}

interface Manager extends Employee {
  teamSize: number;
  budget:   number;
}


// ─────────────────────────────────────────────────────────────────────────────
// TYPE ALIASES
// ─────────────────────────────────────────────────────────────────────────────

type EmployeeId = number;
type Salary     = number;

// Intersection — must satisfy BOTH
type FullManager = Employee & { teamSize: number; budget: number };

// Generic wrapper
type ApiResponse<T> = {
  success:   boolean;
  data:      T;
  requestId: string;
};


// ─────────────────────────────────────────────────────────────────────────────
// FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

// Named function
function greet(name: string): string {
  return `Hello, ${name}`;
}

// Arrow function
const double = (n: number): number => n * 2;

// Optional parameter
function buildEmail(first: string, last: string, domain?: string): string {
  return `${first}.${last}@${domain ?? "mcgill.com"}`;
}

// Default parameter
function applyRaise(salary: number, percent: number = 5): number {
  return Math.round(salary * (1 + percent / 100));
}

// Rest parameter
function sum(...values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

// Overloads
function find(id: number): Employee | undefined;
function find(name: string): Employee[];
function find(arg: number | string): Employee | Employee[] | undefined {
  return typeof arg === "number" ? undefined : [];
}

// Function type alias
type FilterFn = (emp: Employee) => boolean;


// ─────────────────────────────────────────────────────────────────────────────
// CLASSES
// ─────────────────────────────────────────────────────────────────────────────

class EmployeeService {
  // Constructor shorthand auto-creates properties:
  constructor(
    private readonly apiKey: string,
    public baseUrl: string,
  ) {}

  // Async method
  async getEmployee(id: number): Promise<Employee | null> {
    try {
      // ... fetch logic
      return null;
    } catch {
      return null;
    }
  }

  // Getter
  get isConfigured(): boolean {
    return this.apiKey.length > 0;
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// GENERICS
// ─────────────────────────────────────────────────────────────────────────────

// Generic function
function first<T>(arr: T[]): T | undefined { return arr[0]; }

// Generic with constraint
function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find((item) => item.id === id);
}

// Generic class
class Repository<T extends { id: number }> {
  private store: T[] = [];
  add(item: T): void        { this.store.push(item); }
  findById(id: number): T | undefined { return this.store.find((i) => i.id === id); }
  getAll(): T[]             { return [...this.store]; }
}


// ─────────────────────────────────────────────────────────────────────────────
// UTILITY TYPES
// ─────────────────────────────────────────────────────────────────────────────

type UpdatePayload     = Partial<Employee>;          // all fields optional
type RequiredEmployee  = Required<Employee>;          // all fields required
type FrozenEmployee    = Readonly<Employee>;          // all fields immutable
type EmployeeSummary   = Pick<Employee, "id"|"name">; // only these fields
type CreatePayload     = Omit<Employee, "id"|"code">; // drop these fields
type DeptMap           = Record<string, number>;      // { [key: string]: number }
type EmpReturnType     = ReturnType<typeof greet>;    // string
type EmpParams         = Parameters<typeof greet>;    // [name: string]
type DefiniteId        = NonNullable<number | null>;  // number


// ─────────────────────────────────────────────────────────────────────────────
// ASYNC / AWAIT
// ─────────────────────────────────────────────────────────────────────────────

async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json() as Promise<T>;
}

// Parallel — run together, faster:
// const [a, b] = await Promise.all([fetchA(), fetchB()]);

// Batch — don't fail fast:
// const results = await Promise.allSettled([...]);

// Type predicate for promise results:
function isFulfilled<T>(r: PromiseSettledResult<T>): r is PromiseFulfilledResult<T> {
  return r.status === "fulfilled";
}


// ─────────────────────────────────────────────────────────────────────────────
// DISCRIMINATED UNIONS
// ─────────────────────────────────────────────────────────────────────────────

type Result<T> =
  | { ok: true;  value: T }
  | { ok: false; error: string };

function handleResult<T>(result: Result<T>): void {
  if (result.ok) {
    console.log("Value:", result.value);   // narrowed to success branch
  } else {
    console.log("Error:", result.error);   // narrowed to failure branch
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// COMMON OPERATORS
// ─────────────────────────────────────────────────────────────────────────────

// Nullish coalescing — use right side if left is null or undefined:
const display = name ?? "Unknown";

// Optional chaining — short-circuit if left side is null/undefined:
const upper = name?.toUpperCase();
const dept  = (null as Employee | null)?.department;

// Non-null assertion — you're sure it's not null (use sparingly):
// const el = document.getElementById("root")!;

// Type assertion — override TypeScript's inference (use with care):
const raw: unknown = "hello";
const str = raw as string;

// keyof — get the union of an object's keys as a type:
type EmployeeKey = keyof Employee; // "id" | "name" | "department" | "salary" | ...

// typeof — get the type of a value or variable:
type SalaryType = typeof salary; // number

// as const — deeply freeze a literal object:
const CONFIG = { url: "https://api.mcgill.com", retries: 3 } as const;


// ─────────────────────────────────────────────────────────────────────────────
// ERROR HANDLING PATTERNS
// ─────────────────────────────────────────────────────────────────────────────

class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function safeCall<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof ApiError) console.error(`API ${err.statusCode}:`, err.message);
    else if (err instanceof Error) console.error("Unexpected:", err.message);
    return null;
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────────────────────────────────

enum Department {
  Engineering = "ENGINEERING",
  Finance     = "FINANCE",
  Operations  = "OPERATIONS",
}

// Use: Department.Engineering  → "ENGINEERING"
// Reverse lookup (numeric only): EmployeeLevel[3] → "Senior"


// ─────────────────────────────────────────────────────────────────────────────
// IMPORTS / EXPORTS AT A GLANCE
// ─────────────────────────────────────────────────────────────────────────────

// Named:    export interface Foo { ... }        import { Foo } from "./types"
// Default:  export default class Bar { ... }    import Bar from "./services/bar"
// Re-export: export { Foo } from "./types"
// Type-only: export type { Foo }                import type { Foo } from "./types"
// Namespace: import * as Utils from "./utils"   Utils.format(...)


console.log("✅ Section 15 — Quick Reference loaded. Bookmark this file!");
