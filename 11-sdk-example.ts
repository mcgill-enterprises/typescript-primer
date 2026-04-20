// =============================================================================
// SECTION 11: Practical SDK Example (Putting It All Together)
// McGill Enterprises — TypeScript Primer
// =============================================================================
//
// This is the McGill HR API Client — a realistic SDK that demonstrates
// every concept from the previous sections working together:
//
//   ✅ Basic types and type annotations         (Section 2)
//   ✅ Interfaces and type definitions          (Section 3)
//   ✅ Functions with typed parameters          (Section 4)
//   ✅ Generics for reusable code              (Section 5)
//   ✅ Classes with access modifiers           (Section 6)
//   ✅ Promises and async/await               (Section 7)
//   ✅ Type aliases vs interfaces              (Section 8)
//   ✅ Union types                             (Section 9)
// =============================================================================


// =============================================================================
// PART A: TYPE DEFINITIONS
// =============================================================================

// --- Primitive aliases for semantic clarity ---
type EmployeeId   = number;
type ISODate      = string;   // "2024-03-15"
type CurrencyCAD  = number;

// --- Enums ---
enum Department {
  Engineering = "ENGINEERING",
  Finance     = "FINANCE",
  Operations  = "OPERATIONS",
  HR          = "HR",
  Legal       = "LEGAL",
}

enum EmployeeLevel {
  Junior = 1, Mid = 2, Senior = 3, Lead = 4, Staff = 5,
}

type EmploymentStatus = "active" | "on-leave" | "terminated";

// --- Domain interfaces ---
interface Address {
  street: string; city: string; province: string; postalCode: string; country: string;
}

interface Employee {
  id:              EmployeeId;
  readonly code:   string;
  firstName:       string;
  lastName:        string;
  email:           string;
  department:      Department;
  level:           EmployeeLevel;
  status:          EmploymentStatus;
  salary:          CurrencyCAD;
  startDate:       ISODate;
  address:         Address;
  managerId?:      EmployeeId;
}

// --- API contract interfaces ---
interface ApiResponse<T> {
  success:   boolean;
  data:      T;
  error?:    string;
  meta: {
    requestId:  string;
    timestamp:  ISODate;
    durationMs: number;
  };
}

interface PaginatedData<T> {
  items:      T[];
  total:      number;
  page:       number;
  pageSize:   number;
  totalPages: number;
}

interface EmployeeFilters {
  department?: Department;
  status?:     EmploymentStatus;
  level?:      EmployeeLevel;
  minSalary?:  number;
  maxSalary?:  number;
  search?:     string;
}

type CreateEmployeePayload = Omit<Employee, "id" | "code" | "status">;
type UpdateEmployeePayload = Partial<Omit<CreateEmployeePayload, "email">>;


// =============================================================================
// PART B: ERROR TYPES
// =============================================================================

class HRApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly requestId: string,
  ) {
    super(message);
    this.name = "HRApiError";
  }
}

class HRValidationError extends Error {
  constructor(message: string, public readonly field: string) {
    super(message);
    this.name = "HRValidationError";
  }
}


// =============================================================================
// PART C: CONFIGURATION
// =============================================================================

interface HRClientConfig {
  baseUrl:   string;
  apiKey:    string;
  timeout?:  number;
  retries?:  number;
  debug?:    boolean;
}


// =============================================================================
// PART D: THE SDK CLIENT
// =============================================================================

class HRClient {
  private readonly config: Required<HRClientConfig>;
  private db:              Map<EmployeeId, Employee> = new Map();
  private nextId:          EmployeeId = 1000;
  private requestCount:    number = 0;

  constructor(config: HRClientConfig) {
    this.config = { timeout: 5_000, retries: 3, debug: false, ...config };
    this.seedDatabase();
  }

  // ---- Public API ----

  async listEmployees(
    filters:  EmployeeFilters = {},
    page:     number = 1,
    pageSize: number = 10,
  ): Promise<ApiResponse<PaginatedData<Employee>>> {
    return this.request("GET", "/employees", filters);
  }

  async getEmployee(id: EmployeeId): Promise<ApiResponse<Employee>> {
    return this.request("GET", `/employees/${id}`);
  }

  async createEmployee(payload: CreateEmployeePayload): Promise<ApiResponse<Employee>> {
    this.validate(payload);
    return this.request("POST", "/employees", payload);
  }

  async updateEmployee(
    id:      EmployeeId,
    updates: UpdateEmployeePayload,
  ): Promise<ApiResponse<Employee>> {
    return this.request("PATCH", `/employees/${id}`, updates);
  }

  async getDepartmentPayroll(dept: Department): Promise<ApiResponse<{
    department:    Department;
    headcount:     number;
    totalPayroll:  CurrencyCAD;
    averageSalary: CurrencyCAD;
  }>> {
    return this.request("GET", `/departments/${dept}/payroll`);
  }

  // ---- Validation ----

  private validate(payload: CreateEmployeePayload): void {
    if (!payload.firstName.trim()) throw new HRValidationError("Required", "firstName");
    if (!payload.lastName.trim())  throw new HRValidationError("Required", "lastName");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email))
      throw new HRValidationError("Invalid email", "email");
    if (payload.salary < 30_000 || payload.salary > 500_000)
      throw new HRValidationError("Must be $30k–$500k", "salary");
  }

  // ---- Generic request handler ----

  private async request<T>(
    method: "GET" | "POST" | "PATCH",
    path:   string,
    body?:  unknown,
  ): Promise<ApiResponse<T>> {
    this.requestCount++;
    const requestId = `req-${Date.now()}-${String(this.requestCount).padStart(3, "0")}`;
    const start     = Date.now();

    this.log(`→ ${method} ${path} [${requestId}]`);
    await new Promise((r) => setTimeout(r, 10 + Math.random() * 40)); // simulate latency

    const data       = this.route<T>(method, path, body);
    const durationMs = Date.now() - start;
    this.log(`← 200 OK [${requestId}] ${durationMs}ms`);

    return {
      success: true,
      data,
      meta: { requestId, timestamp: new Date().toISOString(), durationMs },
    };
  }

  // ---- Mock routing ----

  private route<T>(method: string, path: string, body: unknown): T {
    const all = Array.from(this.db.values());

    if (method === "GET" && path.startsWith("/employees") && !path.match(/\/\d+/)) {
      const filters = (body ?? {}) as EmployeeFilters;
      let results   = all;
      if (filters.department) results = results.filter((e) => e.department === filters.department);
      if (filters.status)     results = results.filter((e) => e.status    === filters.status);
      if (filters.level)      results = results.filter((e) => e.level     === filters.level);
      if (filters.minSalary)  results = results.filter((e) => e.salary    >= filters.minSalary!);
      if (filters.maxSalary)  results = results.filter((e) => e.salary    <= filters.maxSalary!);
      if (filters.search) {
        const q = filters.search.toLowerCase();
        results = results.filter((e) =>
          `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) || e.email.includes(q));
      }
      return { items: results, total: results.length, page: 1, pageSize: 10, totalPages: Math.ceil(results.length / 10) } as T;
    }

    if (method === "GET" && path.match(/\/employees\/\d+$/)) {
      const id  = Number(path.split("/").pop());
      const emp = this.db.get(id);
      if (!emp) throw new HRApiError("Not found", 404, "");
      return emp as T;
    }

    if (method === "POST" && path === "/employees") {
      const p = body as CreateEmployeePayload;
      this.nextId++;
      const emp: Employee = {
        id:     this.nextId,
        code:   `${p.department.slice(0, 3)}-${this.nextId}`,
        status: "active",
        ...p,
      };
      this.db.set(emp.id, emp);
      return emp as T;
    }

    if (method === "PATCH" && path.match(/\/employees\/\d+$/)) {
      const id      = Number(path.split("/").pop());
      const existing = this.db.get(id);
      if (!existing) throw new HRApiError("Not found", 404, "");
      const updated = { ...existing, ...(body as UpdateEmployeePayload) };
      this.db.set(id, updated);
      return updated as T;
    }

    if (method === "GET" && path.includes("/payroll")) {
      const dept        = path.split("/")[2] as Department;
      const deptEmps    = all.filter((e) => e.department === dept && e.status === "active");
      const totalPayroll = deptEmps.reduce((s, e) => s + e.salary, 0);
      return {
        department:    dept,
        headcount:     deptEmps.length,
        totalPayroll,
        averageSalary: deptEmps.length ? Math.round(totalPayroll / deptEmps.length) : 0,
      } as T;
    }

    throw new HRApiError("Route not found", 404, "");
  }

  private log(msg: string): void {
    if (this.config.debug) console.log(`  [HRClient] ${msg}`);
  }

  // ---- Seed data ----

  private seedDatabase(): void {
    const makeAddress = (street: string): Address => ({
      street, city: "Montreal", province: "QC", postalCode: "H3A 0G4", country: "Canada",
    });

    const seed = [
      { firstName: "Sarah",  lastName: "Chen",     email: "s.chen@mcgill.com",     department: Department.Engineering, level: EmployeeLevel.Senior, salary: 95_000,  startDate: "2019-03-15", address: makeAddress("845 Sherbrooke St W") },
      { firstName: "James",  lastName: "Okafor",   email: "j.okafor@mcgill.com",   department: Department.Engineering, level: EmployeeLevel.Lead,   salary: 120_000, startDate: "2017-08-01", address: makeAddress("1000 De La Gauchetière W") },
      { firstName: "Priya",  lastName: "Sharma",   email: "p.sharma@mcgill.com",   department: Department.Finance,     level: EmployeeLevel.Mid,    salary: 88_000,  startDate: "2020-11-01", address: makeAddress("500 René-Lévesque Blvd W") },
      { firstName: "Amara",  lastName: "Diallo",   email: "a.diallo@mcgill.com",   department: Department.Operations,  level: EmployeeLevel.Mid,    salary: 79_000,  startDate: "2021-02-15", address: makeAddress("3600 Mountain St") },
      { firstName: "Lucas",  lastName: "Ferreira", email: "l.ferreira@mcgill.com", department: Department.Engineering, level: EmployeeLevel.Mid,    salary: 91_000,  startDate: "2021-09-13", address: makeAddress("1250 Guy St") },
      { firstName: "Mei",    lastName: "Tanaka",   email: "m.tanaka@mcgill.com",   department: Department.HR,          level: EmployeeLevel.Senior, salary: 85_000,  startDate: "2018-05-20", address: makeAddress("2075 University St") },
    ];

    for (const emp of seed) {
      this.nextId++;
      this.db.set(this.nextId, {
        id: this.nextId, code: `${emp.department.slice(0, 3)}-${this.nextId}`, status: "active", ...emp,
      });
    }
  }
}


// =============================================================================
// PART E: DEMO
// =============================================================================

async function main(): Promise<void> {
  console.log("=".repeat(60));
  console.log("  McGill HR API Client — SDK Demo");
  console.log("=".repeat(60));

  const client = new HRClient({
    baseUrl: "https://api.mcgill-hr.internal/v1",
    apiKey:  "demo-key-xxxxx",
    debug:   true,
  });

  // 1. List active Engineering employees
  console.log("\n📋 1. Active Engineering Employees");
  const engineers = await client.listEmployees({ department: Department.Engineering, status: "active" });
  for (const emp of engineers.data.items) {
    console.log(`   • ${emp.firstName} ${emp.lastName} (${EmployeeLevel[emp.level]}) — $${emp.salary.toLocaleString()}`);
  }

  // 2. Create a new hire
  console.log("\n➕ 2. Creating a New Employee");
  const newEmpResp = await client.createEmployee({
    firstName:  "Chloe",
    lastName:   "Bouchard",
    email:      "c.bouchard@mcgill.com",
    department: Department.Finance,
    level:      EmployeeLevel.Junior,
    salary:     72_000,
    startDate:  new Date().toISOString().split("T")[0],
    address:    { street: "1455 De Maisonneuve Blvd W", city: "Montreal", province: "QC", postalCode: "H3G 1M8", country: "Canada" },
  });
  const newEmp = newEmpResp.data;
  console.log(`   Created: ${newEmp.firstName} ${newEmp.lastName} — Code: ${newEmp.code}`);

  // 3. Update after probation
  console.log("\n✏️  3. Post-Probation Salary Adjustment");
  const updated = await client.updateEmployee(newEmp.id, { salary: 76_000 });
  console.log(`   ${updated.data.firstName}'s new salary: $${updated.data.salary.toLocaleString()}`);

  // 4. Department payroll
  console.log("\n💰 4. Department Payroll Summary");
  for (const dept of [Department.Engineering, Department.Finance, Department.Operations]) {
    const { headcount, totalPayroll, averageSalary } = (await client.getDepartmentPayroll(dept)).data;
    console.log(
      `   ${dept.padEnd(14)} | ${String(headcount).padStart(2)} employees | ` +
      `Total: $${totalPayroll.toLocaleString().padStart(9)} | Avg: $${averageSalary.toLocaleString()}`
    );
  }

  // 5. Error handling
  console.log("\n🚨 5. Validation Error Handling");
  try {
    await client.createEmployee({
      firstName: "Bad", lastName: "Record", email: "not-valid",
      department: Department.Legal, level: EmployeeLevel.Junior, salary: 55_000,
      startDate: "2024-01-01",
      address: { street: "1 Test", city: "Montreal", province: "QC", postalCode: "H1A 1A1", country: "Canada" },
    });
  } catch (err) {
    if (err instanceof HRValidationError) {
      console.log(`   ✅ Caught: field="${err.field}" — ${err.message}`);
    }
  }

  // 6. Request metadata
  console.log("\n🔍 6. Response Metadata");
  const resp = await client.getEmployee(newEmp.id);
  console.log(`   Request ID : ${resp.meta.requestId}`);
  console.log(`   Duration   : ${resp.meta.durationMs}ms`);

  console.log("\n" + "=".repeat(60));
  console.log("  SDK demo complete 🎉");
  console.log("=".repeat(60));
}

main().catch(console.error);
