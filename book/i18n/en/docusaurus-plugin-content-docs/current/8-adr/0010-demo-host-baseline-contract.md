# ADR-0010: The Host Provides the Style Baseline

- **Status**: Accepted

## Context

Components render inside a host application and in the docs site. If each host supplies a
different reset, font, or token scope, a story can look correct while production is wrong.

## Decision

The host owns the baseline contract: scoped preflight, font loading, token CSS, and the root
layout assumptions. The docs site supplies the same baseline in a scoped form and uses rendered
checks to verify it.

## Rationale

The component should not secretly reset an application or depend on browser defaults. A named
host contract makes the integration boundary explicit.

## Consequences

Storybook, the docs site, and the demo host must all load the baseline. Changes to the baseline
require visual and interaction checks in each host, especially for tables, forms, portals, and
print output.
