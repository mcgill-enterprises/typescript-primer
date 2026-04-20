// =============================================================================
// SECTION 13: TypeScript Config (tsconfig.json)
// McGill Enterprises — TypeScript Primer
// =============================================================================
//
// tsconfig.json is the configuration file for the TypeScript compiler.
// Every TypeScript project has one. It tells the compiler:
//
//   - Which files to include
//   - How strict to be
//   - What JavaScript to compile down to
//   - Where to put the output
//
// Run `npx tsc --init` to generate a starter config, then adjust from there.
// =============================================================================

// The tsconfig.json at the root of this project is annotated below.
// Read through it — each option is explained with a comment.
//
// (This is a .ts file for the primer format, but the real config is JSON.
//  See tsconfig.json in the project root to view the live version.)

const TSCONFIG_ANNOTATED = `
{
  "compilerOptions": {

    // -------------------------------------------------------------------------
    // OUTPUT TARGET
    // -------------------------------------------------------------------------

    // target: which JavaScript version to compile DOWN to.
    // ES2020 is a safe choice — supported by Node.js 14+ and all modern browsers.
    // Older targets (ES5, ES6) add polyfill code; newer targets produce leaner output.
    "target": "ES2020",

    // module: which module system to use in the compiled output.
    // "commonjs" → require() / module.exports  (Node.js standard)
    // "ESNext"   → import / export             (modern bundlers, Deno)
    "module": "commonjs",

    // lib: which built-in APIs TypeScript should know about.
    // "ES2020" gives you Promise, Map, Set, Object.entries, etc.
    // Add "DOM" if you're writing browser code (document, window, fetch).
    "lib": ["ES2020"],

    // -------------------------------------------------------------------------
    // FILE LOCATIONS
    // -------------------------------------------------------------------------

    // rootDir: where your TypeScript source files live.
    // The compiler mirrors this folder structure in outDir.
    "rootDir": "./src",

    // outDir: where compiled JavaScript files are written.
    // Always add this folder to .gitignore — you commit .ts, not .js.
    "outDir": "./dist",

    // -------------------------------------------------------------------------
    // STRICT MODE (recommended: always enable)
    // -------------------------------------------------------------------------

    // strict: master switch that enables ALL strict type-checking options below.
    // Turn this on from day one — retrofitting strict mode into a large codebase
    // is painful. It's much easier to start strict.
    "strict": true,

    // What "strict: true" enables under the hood:
    //   strictNullChecks      — null and undefined are not assignable to other types
    //   strictFunctionTypes   — stricter checking of function parameter types
    //   strictBindCallApply   — better types for .bind(), .call(), .apply()
    //   strictPropertyInitialization — class properties must be assigned in constructor
    //   noImplicitAny         — variables must have an explicit or inferable type (no silent any)
    //   noImplicitThis        — `this` must have an explicit type
    //   alwaysStrict          — emits "use strict" at the top of every output file

    // -------------------------------------------------------------------------
    // ADDITIONAL STRICTNESS (recommended for new projects)
    // -------------------------------------------------------------------------

    // Warn when a local variable is declared but never used:
    "noUnusedLocals": true,

    // Warn when a function parameter is declared but never used:
    "noUnusedParameters": true,

    // Error if a function has a code path that returns without a value:
    "noImplicitReturns": true,

    // Error on switch statements that fall through to the next case without a break:
    "noFallthroughCasesInSwitch": true,

    // -------------------------------------------------------------------------
    // MODULE RESOLUTION
    // -------------------------------------------------------------------------

    // How TypeScript finds imported modules.
    // "node" mirrors Node.js module resolution (looks in node_modules, etc.)
    "moduleResolution": "node",

    // Allows default imports from CommonJS modules that don't have a default export.
    // Required for imports like: import express from 'express'
    "esModuleInterop": true,

    // Treat all file imports as case-sensitive, even on macOS/Windows.
    // Prevents bugs where a file works locally but breaks on Linux CI servers.
    "forceConsistentCasingInFileNames": true,

    // Skip type checking of .d.ts files in node_modules.
    // This dramatically speeds up compilation without sacrificing safety.
    "skipLibCheck": true,

    // -------------------------------------------------------------------------
    // OUTPUT HELPERS (optional but useful)
    // -------------------------------------------------------------------------

    // Emit .d.ts declaration files alongside the compiled JS.
    // Required if you're building a library others will import.
    "declaration": true,

    // Emit source maps (.js.map) so debuggers can map compiled JS back to .ts.
    // Essential for debugging in VS Code and production error tracing.
    "sourceMap": true,

    // Emit declaration maps (.d.ts.map) so editors can jump to the .ts source
    // from a .d.ts type definition.
    "declarationMap": true

  },

  // Which files/folders to include in compilation:
  "include": ["src/**/*"],

  // Which files/folders to exclude (always exclude node_modules and dist):
  "exclude": ["node_modules", "dist"]
}
`;

// =============================================================================
// COMMON tsconfig RECIPES
// =============================================================================

// ---- For a Node.js API (backend) ----
// {
//   "compilerOptions": {
//     "target": "ES2022",
//     "module": "commonjs",
//     "lib": ["ES2022"],
//     "strict": true,
//     "esModuleInterop": true,
//     "outDir": "./dist",
//     "rootDir": "./src"
//   }
// }

// ---- For a React app (frontend) ----
// {
//   "compilerOptions": {
//     "target": "ES2020",
//     "module": "ESNext",
//     "lib": ["ES2020", "DOM", "DOM.Iterable"],
//     "jsx": "react-jsx",
//     "strict": true,
//     "moduleResolution": "bundler",
//     "esModuleInterop": true
//   }
// }

// ---- For a published npm library ----
// {
//   "compilerOptions": {
//     "target": "ES2018",
//     "module": "commonjs",
//     "declaration": true,
//     "declarationMap": true,
//     "sourceMap": true,
//     "strict": true,
//     "outDir": "./dist"
//   }
// }

// =============================================================================
// USEFUL CLI COMMANDS
// =============================================================================

// npx tsc              → compile the project (uses tsconfig.json)
// npx tsc --noEmit     → type-check only, don't write any files (great for CI)
// npx tsc --watch      → watch mode, recompile on every save
// npx tsc --init       → generate a starter tsconfig.json
// npx tsc --showConfig → print the resolved config (after extends/merging)

console.log("=".repeat(60));
console.log("  tsconfig.json — annotated");
console.log("=".repeat(60));
console.log(TSCONFIG_ANNOTATED);
console.log("\n✅ Section 13 complete — TypeScript Config (tsconfig.json)");
