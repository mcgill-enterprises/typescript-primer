# TypeScript Primer — McGill Enterprises

A hands-on introduction to TypeScript for complete beginners. Each file in `src/` is a self-contained lesson with runnable examples and detailed comments.

## Prerequisites

Before you begin, make sure you have the following in place.

### 1. Node.js (required)

TypeScript compiles to JavaScript, which runs on [Node.js](https://nodejs.org/). You'll need **Node.js v18 or later**.

To check whether Node.js is already installed, open a terminal and run:

```bash
node --version   # should print v18.0.0 or higher
npm --version    # npm comes bundled with Node.js
```

If either command fails, download the **LTS (Long-Term Support)** release from [nodejs.org](https://nodejs.org/) and follow the installer for your operating system.

### 2. Basic JavaScript Knowledge (required)

TypeScript is a superset of JavaScript — every valid JavaScript program is also valid TypeScript. You don't need to be a JavaScript expert, but you should be comfortable with:

- Variables (`let`, `const`) and basic data types
- Functions, `if`/`else`, and loops (`for`, `while`)
- Arrays and objects
- The basics of `async`/`await` (used in Lesson 6)

If you need a refresher, [javascript.info](https://javascript.info/) is an excellent free resource.

### 3. A Text Editor or IDE (required)

You'll need an editor to read and modify the `.ts` files. We strongly recommend **Visual Studio Code (VS Code)**:

- **[Download VS Code](https://code.visualstudio.com/)** — free, available for Windows, macOS, and Linux
- VS Code has first-class TypeScript support **built in** — no extensions required
- You'll get inline type errors, autocompletion, and hover documentation as you work through the lessons

If you already use a different editor (WebStorm, Neovim, Sublime Text, etc.) it will work fine, though TypeScript support may require additional setup.

## Setup

```bash
npm install
```

## Running the Examples

Each section can be run directly with `ts-node`:

```bash
npx ts-node src/01-typescript-vs-javascript.ts
npx ts-node src/02-basic-types.ts
# ... and so on up to 17
```

Or compile everything to JavaScript first:

```bash
npm run build
node dist/01-typescript-vs-javascript.js
```

## Sections

| # | File | Topic |
|---|------|-------|
| 1 | `src/01-typescript-vs-javascript.ts` | TypeScript = JavaScript + Types |
| 2 | `src/02-basic-types.ts` | Basic Types You'll Use |
| 3 | `src/03-interfaces.ts` | Interfaces (Your Bread and Butter) |
| 4 | `src/04-functions.ts` | Functions |
| 5 | `src/05-generics.ts` | Generics (For Reusable Code) |
| 6 | `src/06-classes.ts` | Classes |
| 7 | `src/07-async-await.ts` | Promises and Async/Await |
| 8 | `src/08-type-aliases-vs-interfaces.ts` | Type Aliases vs Interfaces |
| 9 | `src/09-union-types.ts` | Union Types (Either/Or) |
| 10 | `src/10-importing-exporting.ts` | Importing / Exporting |
| 11 | `src/11-sdk-example.ts` | Practical SDK Example (Putting It All Together) |
| 12 | `src/12-utility-types.ts` | Utility Types (Built-in Helpers) |
| 13 | `src/13-tsconfig.ts` | TypeScript Config (tsconfig.json) |
| 14 | `src/14-common-patterns.ts` | Common Patterns in Your SDK |
| 15 | `src/15-quick-reference.ts` | Quick Reference for Your SDK Work |
| 16 | `src/16-learning-resources.ts` | Learning Resources (If You Want More) |
| 17 | `src/17-try-it.ts` | Next Step: Try It |

## What is TypeScript?

TypeScript is JavaScript with **type safety** added on top. You write `.ts` files, and the TypeScript compiler checks your code for errors *before* it runs — catching bugs that JavaScript would only find at runtime (or never).

```
Your .ts file  →  TypeScript Compiler  →  .js file  →  Node.js / Browser
                       (type checks here)
```
