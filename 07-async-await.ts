// =============================================================================
// SECTION 7: Promises and Async/Await
// McGill Enterprises — TypeScript Primer
// =============================================================================
//
// Most real-world TypeScript code is asynchronous — fetching data from APIs,
// reading files, querying databases. TypeScript types Promises and async
// functions so you always know what an async operation will resolve to.
//
// Promise<T>  — a value of type T that will arrive in the future
// async       — marks a function as asynchronous; it always returns a Promise
// await       — pauses execution until the Promise resolves, then unwraps the value
// =============================================================================


// -----------------------------------------------------------------------------
// 1. TYPING A PROMISE
// Promise<T> means "this will eventually resolve to a value of type T"
// -----------------------------------------------------------------------------

interface Employee {
  id:         number;
  name:       string;
  department: string;
  salary:     number;
}

// A function that returns a Promise<Employee> — callers know exactly what they'll get
function fetchEmployee(id: number): Promise<Employee> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 1001) {
        resolve({ id: 1001, name: "Aino Mäkinen", department: "Engineering", salary: 95_000 });
      } else {
        reject(new Error(`Employee ${id} not found`));
      }
    }, 100);
  });
}


// -----------------------------------------------------------------------------
// 2. ASYNC / AWAIT
// `async` makes a function return a Promise.
// `await` unwraps the resolved value — code reads like synchronous logic.
// -----------------------------------------------------------------------------

async function printEmployee(id: number): Promise<void> {
  const employee = await fetchEmployee(id); // pauses here until the Promise resolves
  console.log(`Fetched: ${employee.name} — ${employee.department}`);
  // TypeScript knows `employee` is an Employee, so .name, .department are valid
}

console.log("--- Async/Await ---");
await printEmployee(1001);


// -----------------------------------------------------------------------------
// 3. ERROR HANDLING WITH TRY/CATCH
// A rejected Promise throws inside an async function — catch it like any error.
// -----------------------------------------------------------------------------

async function safelyFetchEmployee(id: number): Promise<Employee | null> {
  try {
    const employee = await fetchEmployee(id);
    return employee;
  } catch (error) {
    // TypeScript types `error` as `unknown` in strict mode — always check the type
    if (error instanceof Error) {
      console.log(`  ⚠ Could not fetch employee ${id}: ${error.message}`);
    }
    return null;
  }
}

console.log("\n--- Error Handling ---");
const found   = await safelyFetchEmployee(1001); // succeeds
const missing = await safelyFetchEmployee(9999); // fails gracefully
console.log("Found:", found?.name ?? "none");
console.log("Missing:", missing?.name ?? "none");


// -----------------------------------------------------------------------------
// 4. PROMISE.ALL — run multiple async operations in parallel
// Waits for ALL promises to resolve; fails fast if any reject.
// Much faster than awaiting each one in sequence.
// -----------------------------------------------------------------------------

async function fetchDepartmentData(): Promise<void> {
  console.log("\n--- Promise.all (parallel) ---");

  // Simulate three API calls at the same time
  const [engineers, revenue, headcount] = await Promise.all([
    fetchEmployeeList("Engineering"),
    fetchRevenue("Q3-2024"),
    fetchHeadcount(),
  ]);

  console.log("Engineers:", engineers.map((e) => e.name).join(", "));
  console.log("Q3 Revenue:", `$${revenue.toLocaleString()}`);
  console.log("Total headcount:", headcount);
}

// --- Simulated API helpers ---
function fetchEmployeeList(department: string): Promise<Employee[]> {
  return Promise.resolve([
    { id: 1001, name: "Aino Mäkinen",    department, salary: 95_000 },
    { id: 1005, name: "Mikko Järvinen",department, salary: 91_000 },
  ]);
}
function fetchRevenue(quarter: string): Promise<number> {
  return Promise.resolve(3_450_000);
}
function fetchHeadcount(): Promise<number> {
  return Promise.resolve(142);
}

await fetchDepartmentData();


// -----------------------------------------------------------------------------
// 5. PROMISE.ALLSETTLED — run in parallel, don't fail fast
// Unlike Promise.all, this waits for every promise to finish regardless
// of whether individual ones succeed or fail. Useful for batch operations.
// -----------------------------------------------------------------------------

async function batchFetchEmployees(ids: number[]): Promise<void> {
  console.log("\n--- Promise.allSettled (batch) ---");

  const results = await Promise.allSettled(ids.map((id) => fetchEmployee(id)));

  for (const [index, result] of results.entries()) {
    if (result.status === "fulfilled") {
      console.log(`  ✅ ${ids[index]}: ${result.value.name}`);
    } else {
      console.log(`  ❌ ${ids[index]}: ${result.reason.message}`);
    }
  }
}

await batchFetchEmployees([1001, 9999, 1001]); // 9999 will fail; others succeed


// -----------------------------------------------------------------------------
// 6. ASYNC FUNCTIONS IN CLASSES
// Regular class methods can be async — just add the keyword.
// -----------------------------------------------------------------------------

class HRService {
  async getEmployee(id: number): Promise<Employee | null> {
    return safelyFetchEmployee(id);
  }

  async getPayrollSummary(ids: number[]): Promise<number> {
    const results = await Promise.all(ids.map((id) => safelyFetchEmployee(id)));
    const employees = results.filter((e): e is Employee => e !== null);
    // The filter above uses a *type predicate* — (e): e is Employee — to tell
    // TypeScript that after filtering, nulls are gone and the array is Employee[].
    return employees.reduce((sum, e) => sum + e.salary, 0);
  }
}

const hrService = new HRService();
const payroll   = await hrService.getPayrollSummary([1001, 1001, 1001]);

console.log("\n--- Async Class Methods ---");
console.log(`Payroll total (3 × Sarah): $${payroll.toLocaleString()}`);


// -----------------------------------------------------------------------------
// 7. COMMON PITFALL — floating promises
// Always await async calls or handle their errors.
// An unawaited promise that rejects causes an unhandled rejection warning.
// -----------------------------------------------------------------------------

// ❌ BAD — error is silently lost
// fetchEmployee(9999); // Promise rejects, nobody is listening

// ✅ GOOD — always handle the result
fetchEmployee(9999).catch((err) => {
  if (err instanceof Error) console.log("\n[Caught floating rejection]:", err.message);
});


console.log("\n✅ Section 7 complete — Promises and Async/Await");
