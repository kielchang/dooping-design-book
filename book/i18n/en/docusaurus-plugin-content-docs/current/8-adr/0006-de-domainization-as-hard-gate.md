# ADR-0006: De-Domainization Is a Release Gate

- **Status**: Accepted

## Context

The library was initially built around one operational domain. Domain vocabulary and assumptions
can quietly leak into generic components and make adoption elsewhere misleading.

## Decision

Before a component or pattern is treated as generic, remove source-domain names, data, and
behavioral assumptions. Do not merely rename the visible label; inspect logic, stories, tests,
and defaults.

## Rationale

Generic interfaces describe user roles and interaction contracts, not one industry's nouns.
Examples should prove portability rather than hide coupling.

## Consequences

De-domainization is checked during review and by vocabulary guards. A component that still needs
domain behavior remains explicitly product-specific until the boundary is repaired.

## Revision

The rule covers any industry coupling, not only the original source vocabulary. The cost is an
extra review pass; the benefit is preventing a misleading “generic” package.
