# ADR-0003: Hard Locks Do Not Auto-Unlock

- **Status**: Accepted

## Context

Period close and other consequential workflows need a clear boundary. Automatically unlocking
after a timer, refresh, or incidental navigation can invalidate a review.

## Decision

A hard lock stays locked until the deliberate unlock action is completed by an authorized user.
The interface explains why it is locked and what permission or action is required.

## Rationale

The lock is a business decision, not a temporary disabled button. Silent recovery is surprising
and can allow changes after a record was believed to be final.

## Consequences

The application must persist lock state, enforce it server-side, and test reload, navigation,
timeout, and permission boundaries. Unlock is explicit and auditable.
