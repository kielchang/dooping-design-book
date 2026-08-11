---
title: "System Architecture"
---

# System Architecture

## Data flow at a glance

Tokens define semantic values. The React package consumes tokens and exposes components, demos,
and stories. The registry packages selected components for copying. The Docusaurus site consumes
the same source plus documentation and generated ADRs.

```
tokens → react components → stories / registry → docs site
                    ↘ application demo data
```

## Three layers and change rights

Foundations may change token values, components may implement reusable behavior, and pages may
compose them into workflows. A lower layer must not import an upper layer. If a page-specific
need reaches down, add a generic contract rather than a product dependency.

## Token and registry pipelines

The token build produces CSS and typed data. The registry build derives copyable entries and
metadata from the component source. Both are generated artifacts and should be reproducible from
the source files.

## Guards and CI

When one fact is copied into two locations, add a guard. CI runs type checks, unit tests, token
and registry builds, documentation hooks, and the site build. Application changes and docs-only
changes may use different deployment paths, but neither bypasses its relevant guards.

## Version model and docs build

Token and component contracts can version independently. The docs build publishes the original
locale and English locale from the same commit; generated ADR and root-document copies are
refreshed during the site prebuild.

## Branches and deployment

Feature work is reviewed before merging to the main branch. Preview builds are for validation;
release tags identify artifacts that downstream users can depend on.

## Proposing a change

Start with the affected layer, the contract, evidence, alternatives, migration, and guard that
will prevent regression. Use an RFC for a new shared rule and an ADR for a durable architectural
decision.
