// =============================================================================
// SECTION 3: Interfaces (Your Bread and Butter)
// McGill Enterprises — TypeScript Primer
// =============================================================================
//
// An interface defines the *shape* of an object — what properties it must have
// and what types those properties must be.
//
// Interfaces are the most important tool in TypeScript for day-to-day work.
// You'll use them constantly: to describe API responses, function parameters,
// configuration objects, database records, and more.
//
// Think of an interface as a contract:
// "Any object that claims to be an Employee MUST have these fields."
// =============================================================================


// -----------------------------------------------------------------------------
// 1. DEFINING A BASIC INTERFACE
// -----------------------------------------------------------------------------

interface Address {
  street:     string;
  city:       string;
  province:   string;
  postalCode: string;
  country:    string;
}

interface Employee {
  id:           number;
  firstName:    string;
  lastName:     string;
  email:        string;
  department:   string;
  salary:       number;
  startDate:    string;           // ISO date string: "2019-03-15"
  address:      Address;          // nested interface — interfaces can reference each other
  phoneNumber?: string;           // optional field — the ? means it may be absent
  readonly employeeCode: string;  // readonly — set once, never changed
}


// -----------------------------------------------------------------------------
// 2. CREATING OBJECTS THAT SATISFY AN INTERFACE
// TypeScript checks every property against the interface definition.
// -----------------------------------------------------------------------------

const sarah: Employee = {
  id:           1001,
  firstName:    "Sarah",
  lastName:     "Chen",
  email:        "s.chen@mcgill-enterprises.net",
  department:   "Engineering",
  salary:       95_000,
  startDate:    "2019-03-15",
  employeeCode: "ENG-1001",
  address: {
    street:     "845 Sherbrooke St W",
    city:       "Montreal",
    province:   "QC",
    postalCode: "H3A 0G4",
    country:    "Canada",
  },
  // phoneNumber is optional — omitting it is perfectly valid
};

console.log("--- Basic Interface ---");
console.log(`${sarah.firstName} ${sarah.lastName} — ${sarah.department}`);
console.log(`Code: ${sarah.employeeCode}, Start: ${sarah.startDate}`);

// These would be compile-time errors (uncomment to see):
// sarah.employeeCode = "ENG-9999"; // ❌ Cannot assign to 'employeeCode' — it is read-only
// const bad: Employee = { id: 1 }; // ❌ Missing required properties


// -----------------------------------------------------------------------------
// 3. EXTENDING INTERFACES (inheritance)
// One interface can build on another using `extends`.
// The child gets all the parent's properties plus its own.
// -----------------------------------------------------------------------------

interface Manager extends Employee {
  teamSize:      number;
  directReports: number[];   // array of employee IDs
  annualBudget:  number;
}

const james: Manager = {
  id:            2001,
  firstName:     "James",
  lastName:      "Okafor",
  email:         "j.okafor@mcgill-enterprises.net",
  department:    "Engineering",
  salary:        120_000,
  startDate:     "2017-08-01",
  employeeCode:  "MGR-2001",
  address:       sarah.address,
  teamSize:      12,
  directReports: [1001, 1002, 1003, 1007, 1012],
  annualBudget:  2_400_000,
};

console.log("\n--- Extended Interface (Manager) ---");
console.log(`${james.firstName} manages ${james.teamSize} people with a $${james.annualBudget.toLocaleString()} budget`);


// -----------------------------------------------------------------------------
// 4. OPTIONAL vs REQUIRED FIELDS
// -----------------------------------------------------------------------------

interface ProjectUpdate {
  projectId:    string;            // required — must always be provided
  name?:        string;            // optional — only include what changed
  budget?:      number;
  status?:      string;
  completedAt?: string;
}

// Valid: only send the fields that changed
const update1: ProjectUpdate = { projectId: "PRJ-001", status: "active" };
const update2: ProjectUpdate = { projectId: "PRJ-002", budget: 500_000, name: "Renamed Project" };

console.log("\n--- Optional Fields ---");
console.log("Update 1:", update1);
console.log("Update 2:", update2);


// -----------------------------------------------------------------------------
// 5. INDEX SIGNATURES
// When you know the value types but not the exact property names upfront.
// Common for dictionaries, maps, and dynamic config objects.
// -----------------------------------------------------------------------------

interface DepartmentHeadcount {
  [departmentName: string]: number;  // any string key → number value
}

const headcount: DepartmentHeadcount = {
  Engineering: 45,
  Finance:     22,
  Operations:  31,
  HR:          14,
  Legal:        8,
};

console.log("\n--- Index Signature ---");
console.log("Engineering headcount:", headcount["Engineering"]);
console.log("Total employees:", Object.values(headcount).reduce((a, b) => a + b, 0));


// -----------------------------------------------------------------------------
// 6. FUNCTION SIGNATURES IN INTERFACES
// An interface can describe methods — what arguments they take and what they return.
// -----------------------------------------------------------------------------

interface EmployeeService {
  findById(id: number): Employee | undefined;
  findByDepartment(dept: string): Employee[];
  create(data: Omit<Employee, "id" | "employeeCode">): Employee;
  calculateTotalPayroll(employees: Employee[]): number;
}

// An object that fulfils the EmployeeService contract:
const employeeService: EmployeeService = {
  findById(id) {
    return id === sarah.id ? sarah : undefined;
  },
  findByDepartment(dept) {
    return [sarah, james].filter((e) => e.department === dept);
  },
  create(data) {
    return {
      ...data,
      id:           Math.floor(Math.random() * 9000) + 1000,
      employeeCode: `EMP-${Date.now()}`,
    };
  },
  calculateTotalPayroll(employees) {
    return employees.reduce((sum, e) => sum + e.salary, 0);
  },
};

const engTeam = employeeService.findByDepartment("Engineering");
console.log("\n--- Function Signatures in Interface ---");
console.log("Engineering team:", engTeam.map((e) => e.firstName));
console.log("Payroll:", `$${employeeService.calculateTotalPayroll(engTeam).toLocaleString()}`);


// -----------------------------------------------------------------------------
// 7. DECLARATION MERGING
// A unique interface superpower: if you declare the same interface name twice,
// TypeScript merges them into one. Useful for extending third-party types.
// -----------------------------------------------------------------------------

interface AppConfig {
  apiUrl: string;
}
interface AppConfig {             // same name — TypeScript merges these
  timeout: number;
}

// AppConfig now requires BOTH apiUrl AND timeout:
const config: AppConfig = {
  apiUrl:  "https://api.mcgill-enterprises.net",
  timeout: 5_000,
};

console.log("\n--- Declaration Merging ---");
console.log("Config:", config);


console.log("\n✅ Section 3 complete — Interfaces (Your Bread and Butter)");
