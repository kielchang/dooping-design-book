# ADR-0004: Use the Registry Instead of an npm Component Package

- **Status**: Accepted

## Context

Products need to own copied component source and adapt it to their framework and release cycle.
A runtime package would centralize upgrades but make local ownership and customization harder.

## Decision

Publish copyable components through the registry. Products install selected source, review it,
and own the resulting code. The token package remains a separate dependency.

## Rationale

Copying keeps the boundary visible, avoids a hidden runtime contract, and lets a product migrate
at its own pace while still receiving a canonical implementation.

## Consequences

Registry metadata and generated content need drift guards. Products must consciously pull updates
and resolve their own local changes.
