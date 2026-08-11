# ADR-0008: Page Chapter Scope

- **Status**: Accepted

## Context

The page chapter needs to standardize composition and workflow without becoming another place to
define shell components or duplicate the component chapter.

## Decision

The page chapter contains page anatomy, composition rules, states, and page-level stories. It does
not contain application shells or new low-level controls.

## Rationale

Pages answer work questions by composing existing contracts. Keeping shell and primitive concerns
out of the chapter preserves the three-layer boundary.

## Consequences

Missing primitives are proposed in the component chapter; product-specific shells remain in the
application. Page stories must use the same real components as production.
