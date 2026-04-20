// =============================================================================
// SECTION 6: Classes
// McGill Enterprises — TypeScript Primer
// =============================================================================
//
// TypeScript classes bring full object-oriented programming to JavaScript —
// with access control modifiers that don't exist in plain JS.
//
//   public    — accessible from anywhere (this is the default)
//   private   — only accessible inside THIS class
//   protected — accessible inside this class AND its subclasses
//   readonly  — set in the constructor, never changed afterward
//   static    — belongs to the class itself, not to any instance
//   abstract  — a contract that subclasses MUST implement
// =============================================================================


// -----------------------------------------------------------------------------
// 1. A CLASS WITH ACCESS MODIFIERS
// -----------------------------------------------------------------------------

class Employee {
  public readonly id:     number;
  public name:            string;
  public department:      string;
  private salary:         number;         // only this class can touch salary
  private performanceRating: number = 3;  // default: average (1–5 scale)

  // static: one shared value for the whole class, not per-instance
  static readonly COMPANY = "McGill Enterprises";
  private static nextId   = 1000;

  constructor(name: string, department: string, salary: number) {
    Employee.nextId++;
    this.id         = Employee.nextId;
    this.name       = name;
    this.department = department;
    this.salary     = salary;
  }

  // --- Getters and Setters ---
  // Getters expose private data as read-only properties.
  // Setters validate before allowing a change.

  get currentSalary(): number {
    return this.salary;
  }

  get rating(): number {
    return this.performanceRating;
  }

  set rating(value: number) {
    if (value < 1 || value > 5) {
      throw new RangeError("Rating must be between 1 and 5");
    }
    this.performanceRating = value;
  }

  // Public method — part of the class's external API
  getSummary(): string {
    return `[${this.id}] ${this.name} — ${this.department}`;
  }

  // Private method — internal helper; callers never see it
  private bonusPercent(): number {
    return this.performanceRating >= 4 ? 0.15 : 0.08;
  }

  getCompensation(): string {
    const bonus = Math.round(this.salary * this.bonusPercent());
    return `Salary: $${this.salary.toLocaleString()} + Bonus: $${bonus.toLocaleString()}`;
  }
}

const sarah = new Employee("Aino Mäkinen", "Engineering", 95_000);
sarah.rating = 4; // uses the setter — validates the value

console.log("--- Class with Access Modifiers ---");
console.log(sarah.getSummary());
console.log(sarah.getCompensation());
console.log(`Company: ${Employee.COMPANY}`);

// These would be compile errors (uncomment to see):
// console.log(sarah.salary);       // ❌ 'salary' is private
// sarah.bonusPercent();            // ❌ 'bonusPercent' is private
// sarah.id = 9999;                 // ❌ 'id' is read-only


// -----------------------------------------------------------------------------
// 2. CONSTRUCTOR SHORTHAND
// Prefix constructor parameters with an access modifier to automatically
// create and assign class properties. This removes a lot of boilerplate.
// -----------------------------------------------------------------------------

// WITHOUT shorthand (verbose):
// class Project {
//   public readonly id: string;
//   public name: string;
//   private budget: number;
//   constructor(id: string, name: string, budget: number) {
//     this.id = id; this.name = name; this.budget = budget;
//   }
// }

// WITH shorthand (idiomatic TypeScript):
class Project {
  constructor(
    public readonly id:      string,
    public name:             string,
    private budget:          number,
    public readonly ownerId: number,
    private spent:           number = 0,
  ) {}

  getRemainingBudget(): number {
    return this.budget - this.spent;
  }

  recordExpense(amount: number): void {
    if (amount > this.getRemainingBudget()) {
      throw new Error(`Insufficient budget — $${amount.toLocaleString()} requested, $${this.getRemainingBudget().toLocaleString()} remaining`);
    }
    this.spent += amount;
  }

  getBudgetSummary(): string {
    const pct = ((this.spent / this.budget) * 100).toFixed(1);
    return `${this.name}: $${this.spent.toLocaleString()} spent of $${this.budget.toLocaleString()} (${pct}%)`;
  }
}

const project = new Project("PRJ-001", "Alpha Modernization", 450_000, sarah.id);
project.recordExpense(45_000);
project.recordExpense(12_500);

console.log("\n--- Constructor Shorthand ---");
console.log(project.getBudgetSummary());


// -----------------------------------------------------------------------------
// 3. INHERITANCE — extends
// A subclass inherits all public and protected members from its parent.
// `protected` = private to the outside world, but visible in subclasses.
// -----------------------------------------------------------------------------

// Generic base repository that works for any type with an id
class BaseRepository<T extends { id: number | string }> {
  protected items: T[] = [];  // protected: subclasses can access this

  add(item: T): void            { this.items.push(item); }
  findById(id: number | string) { return this.items.find((i) => i.id === id); }
  getAll(): T[]                 { return [...this.items]; }
  get count(): number           { return this.items.length; }
}

class EmployeeRepository extends BaseRepository<Employee> {
  // Adds Employee-specific query methods on top of the base
  findByDepartment(dept: string): Employee[] {
    return this.items.filter((e) => e.department === dept);
  }
  totalPayroll(): number {
    return this.items.reduce((sum, e) => sum + e.currentSalary, 0);
  }
}

const repo = new EmployeeRepository();
repo.add(sarah);
repo.add(new Employee("Eero Virtanen",   "Engineering", 120_000));
repo.add(new Employee("Siiri Korhonen",   "Finance",      88_000));
repo.add(new Employee("Taavi Leinonen",   "Operations",   79_000));
repo.add(new Employee("Mikko Järvinen", "Engineering",  91_000));

console.log("\n--- Inheritance ---");
console.log(`Total: ${repo.count} employees`);
console.log("Engineering:", repo.findByDepartment("Engineering").map((e) => e.name).join(", "));
console.log(`Payroll: $${repo.totalPayroll().toLocaleString()}`);


// -----------------------------------------------------------------------------
// 4. ABSTRACT CLASSES
// An abstract class defines a template — it cannot be instantiated directly.
// Subclasses must implement every abstract method.
// Use this when you want to share common logic but enforce that subclasses
// provide their own version of a specific behaviour.
// -----------------------------------------------------------------------------

abstract class Notification {
  constructor(
    protected readonly recipient: string,
    protected readonly subject:   string,
    protected readonly body:      string,
  ) {}

  // Must be implemented by every subclass:
  abstract send(): Promise<void>;

  // Shared by all subclasses (not abstract):
  protected formatMessage(): string {
    return `TO: ${this.recipient}\nSUBJECT: ${this.subject}\n\n${this.body}`;
  }
}

class EmailNotification extends Notification {
  constructor(
    recipient: string,
    subject: string,
    body: string,
    private readonly from: string,
  ) {
    super(recipient, subject, body); // always call super() first
  }

  async send(): Promise<void> {
    console.log(`  [EMAIL] from: ${this.from}`);
    console.log(`  ${this.formatMessage().replace(/\n/g, "\n  ")}`);
  }
}

class SlackNotification extends Notification {
  constructor(
    recipient: string,
    subject: string,
    body: string,
    private readonly channel: string,
  ) {
    super(recipient, subject, body);
  }

  async send(): Promise<void> {
    console.log(`  [SLACK #${this.channel}] → @${this.recipient}: *${this.subject}* — ${this.body}`);
  }
}

console.log("\n--- Abstract Classes ---");
const notifications: Notification[] = [
  new EmailNotification("s.chen@mcgill.com", "Q3 Report Ready", "Please review the attached.", "noreply@mcgill.com"),
  new SlackNotification("sarah.chen", "Reminder", "Stand-up in 10 minutes!", "engineering"),
];

// We call .send() without caring which concrete type each Notification is.
for (const n of notifications) {
  await n.send();
}


console.log("\n✅ Section 6 complete — Classes");
