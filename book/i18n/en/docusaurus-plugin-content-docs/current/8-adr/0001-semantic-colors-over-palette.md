# ADR-0001: Semantic Colors, Not Palette Names

- **Status**: Accepted
- **Date**: 2024-01

## Context

Product code needs to express roles such as surface, foreground, border, focus, success, and
danger. Raw palette names do not communicate those roles and make theme changes unsafe.

## Options

Use raw hue names, use semantic tokens, or allow both with a convention.

## Decision

Use semantic color tokens in components and product code. Palette values belong only in the token
definition layer.

## Rationale

Semantic names survive light/dark themes and make contrast review possible. A component should
not need to know whether a surface is blue, gray, or amber.

## Consequences

Token authors must define every role in every theme. Raw palette literals are rejected by guards;
the small upfront vocabulary prevents large-scale recoloring later.
