// =============================================================================
// SECTION 16: Learning Resources (If You Want More)
// McGill Enterprises — TypeScript Primer
// =============================================================================
//
// You've covered the fundamentals. Here are the best resources to go deeper,
// organised by what you're ready for next.
// =============================================================================

const RESOURCES = `

════════════════════════════════════════════════════════════════
  OFFICIAL DOCUMENTATION
════════════════════════════════════════════════════════════════

TypeScript Official Handbook
  https://www.typescriptlang.org/docs/handbook/intro.html
  The authoritative reference. Start with "The Basics" and work forward.
  Solid explanations, runnable examples, updated with each release.

TypeScript Playground
  https://www.typescriptlang.org/play
  Write TypeScript in the browser — no setup needed. See compiled output,
  type errors, and AST all in one place. Great for testing ideas quickly.

What's New in TypeScript
  https://www.typescriptlang.org/docs/handbook/release-notes/overview.html
  Skim this occasionally to stay current with new features and syntax.


════════════════════════════════════════════════════════════════
  INTERACTIVE LEARNING
════════════════════════════════════════════════════════════════

TypeHero
  https://typehero.dev
  Hands-on TypeScript challenges, from beginner to advanced. The best way
  to build intuition for generics and type-level programming.

Execute Program — TypeScript Course
  https://www.executeprogram.com/courses/typescript
  Spaced-repetition exercises. Short sessions, high retention.
  Paid, but worth it if you want a structured curriculum.

Total TypeScript (Matt Pocock)
  https://www.totaltypescript.com
  Free video tutorials + paid workshops. Matt is the clearest explainer
  of advanced TypeScript on the internet. Start with the free beginner series.


════════════════════════════════════════════════════════════════
  BOOKS
════════════════════════════════════════════════════════════════

"Programming TypeScript" — Boris Cherny (O'Reilly)
  The best book for developers who already know JavaScript.
  Covers the type system in depth with practical examples.

"Effective TypeScript" — Dan Vanderkam (O'Reilly)
  62 specific, actionable items — like "Effective C++" but for TypeScript.
  Read it after you're comfortable with the basics.

"Learning TypeScript" — Josh Goldberg (O'Reilly)
  Beginner-friendly. Good if you're new to both TypeScript and typed languages.


════════════════════════════════════════════════════════════════
  VIDEOS & COURSES
════════════════════════════════════════════════════════════════

No BS TS (Jack Herrington) — YouTube
  https://www.youtube.com/playlist?list=PLNqp92_EXZBJYFrpEzdO2EapvU0GOJ09n
  Free. Practical, fast-paced. Especially good for generics and advanced patterns.

TypeScript Full Course (Hitesh Choudhary) — YouTube
  https://www.youtube.com/watch?v=30LWjhZzg50
  Free. Good for beginners. Covers basics through interfaces and classes.

Frontend Masters — TypeScript Courses
  https://frontendmasters.com/learn/typescript/
  Paid. High-quality production. "TypeScript Fundamentals" by Mike North
  is particularly well-regarded.


════════════════════════════════════════════════════════════════
  COMMUNITY & STAYING CURRENT
════════════════════════════════════════════════════════════════

TypeScript Discord
  https://discord.com/invite/typescript
  The official community. Ask questions, follow announcements.

Matt Pocock on X/Twitter
  @mattpocockuk
  Real-world TypeScript tips daily. One of the most useful follows in the ecosystem.

Theo (t3.gg) — YouTube
  https://www.youtube.com/@t3dotgg
  TypeScript in the context of modern full-stack development.


════════════════════════════════════════════════════════════════
  TOOLS TO INSTALL NOW
════════════════════════════════════════════════════════════════

ESLint + typescript-eslint
  Lint your TypeScript with rules specifically designed for the type system.
  https://typescript-eslint.io/getting-started

Prettier
  Automatic code formatting. Works seamlessly with TypeScript.
  https://prettier.io

ts-node
  Run .ts files directly without a compile step. Already in this project.
  npx ts-node src/any-file.ts

tsx
  A faster alternative to ts-node for running scripts.
  npx tsx src/any-file.ts


════════════════════════════════════════════════════════════════
  NEXT TOPICS AFTER THIS PRIMER
════════════════════════════════════════════════════════════════

Once you're comfortable with everything in this primer, explore:

  • Mapped types              — transform every key of a type programmatically
  • Conditional types         — types that branch based on other types (T extends U ? A : B)
  • Template literal types    — string manipulation at the type level
  • Decorators                — metadata annotations for classes and methods
  • Declaration files (.d.ts) — how to add types to untyped JavaScript libraries
  • Type-safe environment vars — using zod or t3-env to validate process.env
  • Zod                       — runtime schema validation that generates TypeScript types

`;

console.log(RESOURCES);
console.log("✅ Section 16 complete — Learning Resources");
