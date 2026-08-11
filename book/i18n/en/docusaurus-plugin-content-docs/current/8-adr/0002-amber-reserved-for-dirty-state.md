# ADR-0002: Reserve Amber for Unsaved Changes

- **Status**: Accepted

## Context

Amber is commonly used for warnings, pending work, and unsaved changes. Reusing it for unrelated
states makes a back-office interface ambiguous.

## Decision

Reserve amber for the specific state “changed locally but not submitted”. Other warnings use the
warning role and must not imply dirty form state.

## Rationale

The dirty state is an action cue: the user needs to save, discard, or leave carefully. Giving it
a stable visual channel makes unsaved work discoverable without making every warning look alike.

## Consequences

Forms need an explicit dirty-state token and copy. Existing uses of amber must be reviewed and
either moved to warning semantics or renamed.
