// =============================================================================
// SECTION 10: Importing / Exporting
// McGill Enterprises — TypeScript Primer
// =============================================================================
//
// TypeScript uses ES Module syntax for sharing code between files.
// You `export` from one file and `import` into another.
//
// This section shows all the patterns you'll encounter in a real codebase.
// The examples below are written as if each block were in its own file —
// see the comments for the filename each section represents.
// =============================================================================


// =============================================================================
// FILE: src/types.ts
// Central place for shared type definitions.
// Exporting types keeps them reusable across the whole codebase.
// =============================================================================

// Named export — anything with `export` is importable by name
export interface Employee {
  id:         number;
  name:       string;
  department: string;
  salary:     number;
}

export interface Project {
  id:     string;
  name:   string;
  budget: number;
  ownerId: number;
}

export type EmploymentStatus = "active" | "on-leave" | "terminated";
export type Department       = "Engineering" | "Finance" | "Operations" | "HR";

// Type-only export — signals to bundlers that this is only a type, not a value
// Helps with tree-shaking and avoids import cycles in large projects
export type { Employee as EmployeeShape }; // re-export under an alias


// =============================================================================
// FILE: src/utils.ts
// Utility functions — each exported individually.
// =============================================================================

export function formatCurrency(amount: number, code: string = "CAD"): string {
  return `${code} ${amount.toLocaleString("en-CA", { minimumFractionDigits: 2 })}`;
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-CA", {
    year: "month", month: "long", day: "numeric",
  });
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

// Default export — a file can have ONE default export.
// Usually used for the "main thing" a module provides.
export default function calculateBonus(salary: number, rating: number): number {
  return Math.round(salary * (rating / 100));
}


// =============================================================================
// FILE: src/constants.ts
// Application-wide constants — export as a const object (barrel pattern).
// =============================================================================

export const API_CONFIG = {
  BASE_URL:    "https://api.mcgill-enterprises.net/v2",
  TIMEOUT_MS:  5_000,
  MAX_RETRIES: 3,
  VERSION:     "2.1.0",
} as const; // `as const` makes all values readonly literals — prevents mutation

export const DEPARTMENTS: Department[] = ["Engineering", "Finance", "Operations", "HR"];
export const MAX_SALARY  = 500_000;
export const MIN_SALARY  =  30_000;


// =============================================================================
// FILE: src/services/employee-service.ts
// A class — typically one class per file, default-exported.
// =============================================================================

// In a real file you'd import from the other files:
// import type { Employee } from "../types";
// import { formatCurrency, API_CONFIG } from "../utils";
// import calculateBonus from "../utils";

class EmployeeService {
  private employees: Employee[] = [];

  add(emp: Employee): void { this.employees.push(emp); }

  findAll(): Employee[] { return [...this.employees]; }

  getPayroll(): string {
    const total = this.employees.reduce((sum, e) => sum + e.salary, 0);
    return formatCurrency(total);
  }
}

export default EmployeeService;


// =============================================================================
// FILE: src/index.ts  (barrel file)
// A barrel file re-exports everything from a folder in one place.
// Consumers can then import from "src" instead of "src/types", "src/utils", etc.
// =============================================================================

// In a real barrel file:
// export * from "./types";
// export * from "./utils";
// export * from "./constants";
// export { default as EmployeeService } from "./services/employee-service";


// =============================================================================
// IMPORT SYNTAX CHEAT SHEET
// (shown as comments since this is all one file in the primer)
// =============================================================================

// --- Named imports ---
// import { Employee, Project, formatCurrency } from "./types";

// --- Import with alias (rename to avoid collision) ---
// import { Employee as EmployeeModel } from "./types";

// --- Default import ---
// import calculateBonus from "./utils";

// --- Default + named in one line ---
// import calculateBonus, { formatCurrency, slugify } from "./utils";

// --- Import everything as a namespace ---
// import * as Utils from "./utils";
// Utils.formatCurrency(95_000);

// --- Type-only import (erased at compile time, better for performance) ---
// import type { Employee } from "./types";

// --- Dynamic import (lazy-load a module at runtime) ---
// const { EmployeeService } = await import("./services/employee-service");


// =============================================================================
// DEMO — using what we've defined in this file
// =============================================================================

const service = new EmployeeService();
service.add({ id: 1001, name: "Aino Mäkinen",    department: "Engineering", salary: 95_000 });
service.add({ id: 1002, name: "Siiri Korhonen",  department: "Finance",     salary: 88_000 });
service.add({ id: 1003, name: "Taavi Leinonen",  department: "Operations",  salary: 79_000 });

console.log("--- Module Demo ---");
console.log("All employees:", service.findAll().map((e) => e.name).join(", "));
console.log("Total payroll:", service.getPayroll());
console.log("Formatted date:", formatDate("2024-03-15"));
console.log("Slugified:", slugify("Alpha Modernization Project"));
console.log("API base URL:", API_CONFIG.BASE_URL);


console.log("\n✅ Section 10 complete — Importing / Exporting");
