// =============================================================================
// SECTION 17: Next Step — Try It
// McGill Enterprises — TypeScript Primer
// =============================================================================
//
// Reading about TypeScript is a start. Writing it is how it sticks.
// Below are five progressively challenging exercises using the McGill HR domain.
// Each one has a clear goal and starter code to get you going.
//
// Run your work with:  npx ts-node src/17-try-it.ts
// =============================================================================


// =============================================================================
// EXERCISE 1 — Easy
// Model a new domain type and write a function that uses it.
//
// TASK:
//   1. Create an interface `Department` with: id (number), name (string),
//      headcount (number), annualBudget (number), and managerId (number).
//   2. Write a function `getBudgetPerHead(dept: Department): number`
//      that returns the per-employee budget allocation.
//   3. Write a function `isOverBudget(dept: Department, spent: number): boolean`.
//   4. Test both functions with at least two departments.
// =============================================================================

console.log("════════════════════════════════");
console.log("EXERCISE 1 — Domain Type + Functions");
console.log("════════════════════════════════");

// YOUR CODE HERE ↓

interface Department {
  // add your fields
}

// function getBudgetPerHead(dept: Department): number { ... }
// function isOverBudget(dept: Department, spent: number): boolean { ... }

console.log("(Exercise 1 — add your code above)\n");


// =============================================================================
// EXERCISE 2 — Easy / Medium
// Practice generics with a typed cache.
//
// TASK:
//   Build a generic `Cache<T>` class that:
//   - Stores values by string key
//   - Has a `set(key: string, value: T, ttlSeconds?: number): void` method
//   - Has a `get(key: string): T | undefined` method (returns undefined if expired)
//   - Has a `clear(): void` method
//   - Has a `size` getter
//
//   Test it with both Employee objects and number values.
// =============================================================================

console.log("════════════════════════════════");
console.log("EXERCISE 2 — Generic Cache Class");
console.log("════════════════════════════════");

interface Employee {
  id:         number;
  name:       string;
  department: string;
  salary:     number;
}

// YOUR CODE HERE ↓

// class Cache<T> { ... }

// const employeeCache = new Cache<Employee>();
// employeeCache.set("1001", { id: 1001, name: "Aino Mäkinen", department: "Engineering", salary: 95_000 }, 60);

console.log("(Exercise 2 — add your code above)\n");


// =============================================================================
// EXERCISE 3 — Medium
// Build a typed event system.
//
// TASK:
//   Create a simple event emitter where events are typed.
//
//   1. Define an interface `HREvents` that maps event names to their payload types:
//        employee.created  → Employee
//        employee.updated  → { id: number; changes: Partial<Employee> }
//        employee.deleted  → { id: number }
//        payroll.processed → { totalAmount: number; employeeCount: number; period: string }
//
//   2. Create a generic `EventEmitter<Events>` class with:
//        on<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void): void
//        emit<K extends keyof Events>(event: K, payload: Events[K]): void
//        off<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void): void
//
//   3. Test it: subscribe to "employee.created", emit it, and verify the handler fires
//      with the correct payload type.
//
//   Bonus: make it so you can only `emit` events that have at least one handler registered.
// =============================================================================

console.log("════════════════════════════════");
console.log("EXERCISE 3 — Typed Event System");
console.log("════════════════════════════════");

// YOUR CODE HERE ↓

// interface HREvents { ... }
// class EventEmitter<Events> { ... }

console.log("(Exercise 3 — add your code above)\n");


// =============================================================================
// EXERCISE 4 — Medium / Hard
// Implement a Result-based API layer.
//
// TASK:
//   Using the Result<T> pattern from Section 14:
//
//   1. Define Result<T, E = Error> as a discriminated union.
//   2. Write helper functions ok<T>(value: T) and fail<E>(error: E).
//   3. Create an async function `fetchEmployee(id: number): Promise<Result<Employee>>`
//      that simulates an API call:
//        - id 1001–1005 → success (make up the data)
//        - anything else → failure with "Employee not found"
//   4. Create `fetchDepartmentRoster(dept: string): Promise<Result<Employee[]>>`
//   5. Write a function `combineResults<T>(results: Result<T>[]): Result<T[]>`
//      that returns ok([...values]) if ALL results succeeded, or fail(firstError)
//      if any failed.
//   6. Test by fetching a mix of valid and invalid IDs.
// =============================================================================

console.log("════════════════════════════════");
console.log("EXERCISE 4 — Result-Based API Layer");
console.log("════════════════════════════════");

// YOUR CODE HERE ↓

console.log("(Exercise 4 — add your code above)\n");


// =============================================================================
// EXERCISE 5 — Hard
// Build a mini query engine with method chaining.
//
// TASK:
//   Extend the EmployeeQueryBuilder from Section 14 into a fully working
//   query engine.
//
//   1. Start with this dataset of 10 employees (make up the data).
//
//   2. Implement a `QueryEngine<T>` class that accepts an array of T and supports:
//        .where(predicate: (item: T) => boolean): this
//        .sortBy(key: keyof T, direction?: "asc" | "desc"): this
//        .limit(n: number): this
//        .offset(n: number): this
//        .select<K extends keyof T>(...keys: K[]): QueryEngine<Pick<T, K>>
//        .execute(): T[]
//        .count(): number
//        .first(): T | undefined
//
//   3. All methods except execute(), count(), and first() should return `this`
//      for chaining.
//
//   4. Test with queries like:
//        "Top 3 highest-paid active engineers"
//        "All managers sorted by team size descending"
//        "Names and salaries only for Finance employees earning over $85k"
//
//   Bonus: add a `.groupBy(key: keyof T): Map<T[keyof T], T[]>` method.
// =============================================================================

console.log("════════════════════════════════");
console.log("EXERCISE 5 — Mini Query Engine");
console.log("════════════════════════════════");

// YOUR CODE HERE ↓

console.log("(Exercise 5 — add your code above)\n");


// =============================================================================
// TIPS FOR WORKING THROUGH THESE EXERCISES
// =============================================================================

console.log(`
TIPS
────
• Run this file with: npx ts-node src/17-try-it.ts
• TypeScript errors appear as red underlines in VS Code — hover for details.
• Use the TypeScript Playground (typescriptlang.org/play) to experiment quickly.
• When stuck, re-read the relevant section file — the answer is often there.
• Use the Quick Reference (Section 15) as a cheat sheet.
• Start with Exercise 1 and work forward — each builds on the last.

CHECKING YOUR WORK
──────────────────
• Your code compiles without errors:  npx tsc --noEmit
• Your functions produce expected output when you call them
• Try passing wrong types intentionally — TypeScript should stop you

GETTING HELP
────────────
• TypeScript Discord: https://discord.com/invite/typescript
• Stack Overflow tag: [typescript]
• Your team's Slack channel

Good luck! 🚀
`);

console.log("✅ Section 17 complete — Now go build something!");
