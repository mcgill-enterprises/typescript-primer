// =============================================================================
// SECTION 14: Common Patterns in Your SDK
// McGill Enterprises — TypeScript Primer
// =============================================================================
//
// This section covers the design patterns you'll encounter and write most
// often when building or consuming TypeScript SDKs and APIs.
// Each pattern is shown in the context of the McGill HR platform.
// =============================================================================

interface Employee {
  id:         number;
  name:       string;
  department: string;
  salary:     number;
  status:     "active" | "on-leave" | "terminated";
}


// =============================================================================
// PATTERN 1: THE RESULT TYPE (safe error handling without try/catch everywhere)
// =============================================================================
//
// Instead of throwing errors (which callers might forget to catch), return a
// discriminated union that forces the caller to handle both success and failure.

type Result<T, E = Error> =
  | { ok: true;  value: T }
  | { ok: false; error: E };

function ok<T>(value: T): Result<T>          { return { ok: true, value }; }
function fail<E>(error: E): Result<never, E> { return { ok: false, error }; }

async function findEmployee(id: number): Promise<Result<Employee>> {
  if (id === 1001) {
    return ok({ id: 1001, name: "Aino Mäkinen", department: "Engineering", salary: 95_000, status: "active" });
  }
  return fail(new Error(`Employee ${id} not found`));
}

console.log("=== PATTERN 1: Result Type ===");
const result = await findEmployee(1001);
if (result.ok) {
  console.log("Found:", result.value.name);   // TypeScript knows .value exists
} else {
  console.log("Error:", result.error.message); // TypeScript knows .error exists
}


// =============================================================================
// PATTERN 2: THE BUILDER PATTERN (fluent, chainable configuration)
// =============================================================================
//
// Lets callers configure complex objects step by step, with full type safety
// at each step. Common in query builders, test fixtures, and SDK clients.

class EmployeeQueryBuilder {
  private filters: Partial<{
    department: string;
    status:     Employee["status"];
    minSalary:  number;
    maxSalary:  number;
    search:     string;
  }> = {};
  private _page:     number = 1;
  private _pageSize: number = 10;
  private _sortBy:   keyof Employee = "name";
  private _sortDir:  "asc" | "desc" = "asc";

  department(dept: string):             this { this.filters.department = dept; return this; }
  status(s: Employee["status"]):        this { this.filters.status = s;        return this; }
  minSalary(amount: number):            this { this.filters.minSalary = amount; return this; }
  maxSalary(amount: number):            this { this.filters.maxSalary = amount; return this; }
  search(term: string):                 this { this.filters.search = term;      return this; }
  page(n: number):                      this { this._page = n;                  return this; }
  pageSize(n: number):                  this { this._pageSize = n;              return this; }
  sortBy(field: keyof Employee, dir: "asc" | "desc" = "asc"): this {
    this._sortBy = field; this._sortDir = dir; return this;
  }

  build(): { filters: typeof this.filters; page: number; pageSize: number; sort: string } {
    return {
      filters:  this.filters,
      page:     this._page,
      pageSize: this._pageSize,
      sort:     `${String(this._sortBy)}:${this._sortDir}`,
    };
  }
}

console.log("\n=== PATTERN 2: Builder Pattern ===");
const query = new EmployeeQueryBuilder()
  .department("Engineering")
  .status("active")
  .minSalary(80_000)
  .sortBy("salary", "desc")
  .pageSize(5)
  .build();

console.log("Query:", JSON.stringify(query, null, 2));


// =============================================================================
// PATTERN 3: THE FACTORY FUNCTION (create objects without `new`)
// =============================================================================
//
// Factory functions are plain functions that return typed objects.
// They're often simpler than classes when you don't need inheritance.

interface ApiClient {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body: unknown): Promise<T>;
}

function createApiClient(baseUrl: string, apiKey: string): ApiClient {
  // Private state captured in the closure — no `this`, no `private` needed
  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type":  "application/json",
  };

  async function get<T>(path: string): Promise<T> {
    console.log(`  GET ${baseUrl}${path}`);
    return {} as T; // simulated
  }

  async function post<T>(path: string, body: unknown): Promise<T> {
    console.log(`  POST ${baseUrl}${path}`, body);
    return {} as T; // simulated
  }

  return { get, post };
}

console.log("\n=== PATTERN 3: Factory Function ===");
const apiClient = createApiClient("https://api.mcgill-enterprises.net", "key-xxx");
await apiClient.get<Employee[]>("/employees");


// =============================================================================
// PATTERN 4: THE OPTIONS OBJECT (flexible function signatures)
// =============================================================================
//
// Instead of long parameter lists, accept a single typed options object.
// This makes calls self-documenting and makes it easy to add new options
// later without breaking existing callers.

interface SendNotificationOptions {
  recipient:    string;
  subject:      string;
  body:         string;
  channel:      "email" | "slack" | "sms";
  priority?:    "low" | "normal" | "high";
  retries?:     number;
  scheduledFor?: Date;
}

async function sendNotification(options: SendNotificationOptions): Promise<void> {
  const { recipient, subject, channel, priority = "normal", retries = 3 } = options;
  console.log(`  [${channel.toUpperCase()}] To: ${recipient} | Priority: ${priority} | Retries: ${retries}`);
  console.log(`  Subject: ${subject}`);
}

console.log("\n=== PATTERN 4: Options Object ===");
await sendNotification({
  recipient: "s.chen@mcgill-enterprises.net",
  subject:   "Q3 Report Available",
  body:      "Your Q3 report is ready for review.",
  channel:   "email",
  priority:  "high",
});


// =============================================================================
// PATTERN 5: TYPE GUARDS (runtime type narrowing)
// =============================================================================
//
// A type guard is a function that returns a boolean AND tells TypeScript
// to narrow the type inside the if-block where it's used.
// Essential when working with unknown data from APIs or external sources.

interface SuccessResponse {
  status:    "success";
  data:      unknown;
  requestId: string;
}

interface ErrorResponse {
  status:  "error";
  message: string;
  code:    number;
}

type ApiResponseUnion = SuccessResponse | ErrorResponse;

// Type predicate: the return type "response is SuccessResponse" is the magic
function isSuccess(response: ApiResponseUnion): response is SuccessResponse {
  return response.status === "success";
}

function isError(response: ApiResponseUnion): response is ErrorResponse {
  return response.status === "error";
}

console.log("\n=== PATTERN 5: Type Guards ===");
const mockResponses: ApiResponseUnion[] = [
  { status: "success", data: { id: 1001 }, requestId: "req-001" },
  { status: "error", message: "Not found", code: 404 },
];

for (const resp of mockResponses) {
  if (isSuccess(resp)) {
    console.log("  ✅ Success — requestId:", resp.requestId); // .requestId safe here
  } else if (isError(resp)) {
    console.log("  ❌ Error", resp.code, "—", resp.message);  // .code/.message safe here
  }
}


// =============================================================================
// PATTERN 6: CONST ASSERTION (lock down object literals)
// =============================================================================
//
// `as const` makes an object or array deeply readonly and narrows string/number
// values from their general type (string) to their literal type ("active").
// Use it for configuration objects and lookup maps.

const HTTP_STATUS = {
  OK:                    200,
  CREATED:               201,
  BAD_REQUEST:           400,
  UNAUTHORIZED:          401,
  NOT_FOUND:             404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
// HttpStatus = 200 | 201 | 400 | 401 | 404 | 500  (literal types, not just number)

// HTTP_STATUS.OK = 999; // ❌ Cannot assign — it's readonly

console.log("\n=== PATTERN 6: as const ===");
console.log("HTTP 200:", HTTP_STATUS.OK);
console.log("HTTP 404:", HTTP_STATUS.NOT_FOUND);


console.log("\n✅ Section 14 complete — Common Patterns in Your SDK");
