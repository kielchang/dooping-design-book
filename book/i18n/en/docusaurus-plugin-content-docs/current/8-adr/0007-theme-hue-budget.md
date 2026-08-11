# ADR-0007: Theme Hues Belong to Identity; Actions Stay Neutral

- **Status**: Accepted

## Context

If the brand hue colors every button, hover state, focus ring, and chart, the interface becomes
visually loud and unrelated states become difficult to distinguish.

## Decision

Use the theme hue primarily in the identity layer. Actions, interaction states, and focus use
neutral semantic channels unless meaning requires a status color.

## Rationale

Neutral interaction states remain legible across themes and leave success, warning, and danger
available for their actual meaning. A hue budget also makes brand changes less invasive.

## Consequences

Theme authors validate hue usage across surfaces, text, borders, charts, and focus. Components do
not invent a branded hover color when the neutral interaction token is sufficient.
