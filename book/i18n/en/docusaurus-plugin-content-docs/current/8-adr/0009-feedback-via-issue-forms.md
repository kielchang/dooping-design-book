# ADR-0009: Feedback Through Issue Forms; Decisions Through ADRs

- **Status**: Accepted

## Context

Feedback needs a low-friction intake path, while durable decisions need context, alternatives,
and a stable link. A large repository of draft RFC files makes both harder to find.

## Decision

Use issue forms for bug reports, questions, and proposals. Accepted proposals become ADRs; the
ADR is the durable decision record. There is no parallel RFC-file archive.

## Rationale

Issue forms provide labels, discussion, and ownership. ADRs provide the compact historical record
that future maintainers need.

## Consequences

The governance page describes the RFC state machine, issue templates must ask for evidence, and
an accepted proposal must be linked from its ADR. Rejected proposals remain in the issue history.
