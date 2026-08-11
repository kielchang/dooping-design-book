---
title: What is this book?
---

# What is this book?

A **design language shared across projects**, plus a **reference implementation you can copy directly**.

## Why this is not just another component library

Most component libraries answer “What should a button look like?” But when you build back-office systems, the time-consuming questions are usually these:

- A user changed three fields in a record. How do you let them confirm exactly what changed before submitting?
- Once a record is confirmed, can it still be edited? Who is allowed to unlock it?
- When a system setting changes, should historical data change with it?
- What happens when a guided-tour card covers the button it is asking the user to click?
- What happens when a report is printed for a signature and every status badge turns into a gray rectangle?

Every system encounters these questions. Every team has to rethink them, and **usually gets one wrong before learning**. This book records the conclusions—including why each decision was made.

## Three layers, three dependency strengths

```
Hard dependency   @dooping/tokens      Design tokens (semantic color, spacing, type, motion...)
       ↑                              ← The only layer we recommend installing directly. It is the contract.
Copy it           @dooping/react       React reference implementation (copy source through the registry)
       ↑                              ← Once copied, it is your code. Change it as needed.
Read only         Patterns             Interaction logic and trade-offs
                                      ← Implement it with your own stack; this book explains the traps.
```

Dependency strength intentionally decreases from top to bottom. The reason is simple: **components will be changed; tokens almost never will**. Turning change-prone things into packages only forces everyone to fork. Turning stable contracts into packages gives them a chance to remain consistent.

## Who should read which chapter

| Role | Suggested path |
| --- | --- |
| Front-end engineer | [Three ways to adopt it](../three-ways) → [Components](../../components) → [Patterns](../../patterns) |
| Designer | [Foundations](../../foundations) → [Patterns](../../patterns) → [Accessibility](../../accessibility) |
| PM / requirements owner | [Patterns](../../patterns) (each one answers how a feature should behave) |
| Technical lead | [Governance](../../governance) → [ADRs](../../adr) |

## Where it came from

It grew out of a long-running internal back-office system: first-round interface audits found 41 issues, followed by multiple rounds of user feedback, accessibility improvements, and cross-device adjustments. We eventually extracted the parts that were **not tied to any particular industry**.

More was removed than kept—and that is intentional. A design system that includes everything is equivalent to having no design system.
