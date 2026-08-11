---
title: Dooping Design Book
slug: /
sidebar_position: 0
---

# Dooping Design Book

**A design language you can actually implement.** It answers how this class of interface should work—not just what a collection of attractive color swatches should look like.

This book distills a real internal back-office system that people use every day. Every rule, component, and pattern included here has been tested with real users, challenged, and refined.

## What this book contains

| Layer | Contents | Recommended use |
| --- | --- | --- |
| **[Foundations](foundations)** | Semantic color, type, spacing, radius, elevation, motion, and light/dark themes | Install `@dooping/tokens` (**the only layer recommended as a hard dependency**) |
| **[Components](components)** | The purpose, boundaries, states, and accessibility of common components (see the [component overview](components/overview)) | Copy the source into your project with the registry |
| **[Patterns](patterns)** | Reusable interaction logic for back-office systems | Understand it, then implement it with your own stack |
| **[Pages](pages)** | Composition rules and examples for five common page types | Read the guidance and assemble it with your own stack |
| **[Accessibility](accessibility)** | Touch targets, keyboard interaction, contrast, and non-color cues | Use it as an acceptance checklist |
| **[Governance](governance)** | Versioning, feedback, and drift protection | Read it once before adoption |
| **[ADRs](adr)** | The reasoning behind contentious decisions | Read the rationale before proposing to overturn a rule |

## Three inclusion rules

This book is intentionally small. Anything included must pass all three gates:

1. **De-domainization** — Does it still stand when the original industry context is removed? Tables, delta displays, and empty states do. Forms tied to a specific business process do not.
2. **Generality** — Would another back-office system use it? Inline field editing, hard locking, and audit-and-restore would; a screen serving one industry's workflow would not.
3. **The rule of three** — Only include things that have been used at least three times in practice and have proven stable. Speculative abstractions are the first step toward a decaying design system.

## What this book does not do

- **It does not define brand visuals.** Color values can change; semantics are the contract. To apply your brand colors, change the token values without touching the code that consumes them.
- **It does not force you to use React.** The [foundations](foundations) and [patterns](patterns) chapters are framework-agnostic; React is only one reference implementation.
- **It is not a component maintenance service.** Components are meant to be copied and **adapted to your needs**. The one thing we ask you not to casually change is the token names—they are the contract. See [ADR-0004](adr/registry-over-npm-package).

## Where to start

- New to the project → [What is this book?](start/what-is-this)
- Want to use it immediately → [Three ways to adopt it](start/three-ways)
- Planning screens for a new project → Start with a page type in the [pages](pages) chapter
- Need to convince your team → Show them two entries from the [patterns](patterns) chapter; that is where the real time savings are
- AI and machine entry points → [llms.txt](https://kielchang.github.io/dooping-design-book/llms.txt), [AGENTS.md](https://kielchang.github.io/dooping-design-book/AGENTS.md), and [/r/index.json](https://kielchang.github.io/dooping-design-book/r/index.json) (static files, not site routes—always use their full URLs)
