# ADR-0005: Tokens Are the Only Hard Dependency

- **Status**: Accepted

## Context

The component source should be portable. Requiring a large package stack would make adoption
expensive and make copied components difficult to understand.

## Decision

The token package is the only hard dependency. Components may use small local utilities and
explicit peer capabilities, but they do not require the whole repository runtime.

## Rationale

Tokens carry the visual contract. Keeping everything else local preserves ownership, reduces
install cost, and makes registry entries genuinely copyable.

## Consequences

Each registry item must declare its dependencies clearly. Shared behavior is duplicated only when
that makes ownership and portability better than a hidden package dependency.
