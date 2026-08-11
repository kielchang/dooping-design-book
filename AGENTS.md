# Adoption Guide (for other projects)

> Canonical web copy: <https://kielchang.github.io/dooping-design-book/AGENTS.md> (kept in sync with the repository root).
> If you are reading a `/preview/` copy, treat it as a work in progress and use the production site as the reference.
> Machine-readable map: <https://kielchang.github.io/dooping-design-book/llms.txt>

This repository is the source of truth for a framework-neutral design language. Downstream projects should not reinvent
buttons, tables, or confirmation flows; they should take the relevant pieces from here. This page is the one-page contract
for what to use and what must remain consistent. The full rationale lives in the documentation site.

For an AI agent taking over a project that follows this design language: read this page first, then read the relevant
documentation chapter. **Do not rewrite components from memory**—the components already exist and can be installed below.

## Three layers, with deliberately decreasing coupling

| Layer | Contents | How to use it | Change authority |
| --- | --- | --- | --- |
| `packages/tokens` | Semantic colors, spacing, type, shadows, and motion | `npm install @dooping/tokens` | **Do not change meaning; values may change** |
| `packages/react` | React reference implementations (see [`/r/index.json`](https://kielchang.github.io/dooping-design-book/r/index.json)) | `npx shadcn add <URL>` | Copied code is yours to adapt |
| `book/docs` | Framework-neutral interaction patterns and five page compositions | Read and implement in your own stack | No code dependency |

See [ADR-0004](https://kielchang.github.io/dooping-design-book/adr/registry-over-npm-package/) for why components are copied
instead of published as a package, and [ADR-0005](https://kielchang.github.io/dooping-design-book/adr/tokens-are-the-only-hard-dependency/)
for why tokens are the hard dependency.

## Install components from the shadcn registry

```bash
npx shadcn@latest add https://kielchang.github.io/dooping-design-book/r/data-table.json
```

Dependencies are included automatically. For example, `data-table` brings `table`, `input`, `button`, `select`, `tooltip`,
and `utils`. The complete list is at <https://kielchang.github.io/dooping-design-book/r/index.json>; individual items are always
available at `/r/<name>.json`.

### Components and page bundles

- **Machine-readable list:** `/r/index.json`; every item has `name`, `title`, `description`, and `url`.
- **Human-readable list:** the [component overview](https://kielchang.github.io/dooping-design-book/components/overview/).
- **Page bundles:** the five page chapters each end with a minimum-install command:
  [list](https://kielchang.github.io/dooping-design-book/pages/list-page/),
  [detail](https://kielchang.github.io/dooping-design-book/pages/detail-page/),
  [form](https://kielchang.github.io/dooping-design-book/pages/form-page/),
  [dashboard](https://kielchang.github.io/dooping-design-book/pages/dashboard/), and
  [settings](https://kielchang.github.io/dooping-design-book/pages/settings-page/).

**Large dependency warning:** `graph-canvas` installs `@xyflow/react`, the registry's only large external dependency.
If you need zero external dependencies, use `charts` instead.

**Prerequisites:** the host needs `components.json` and an `@/*` path alias. If not, run `npx shadcn@latest init` first.
Tailwind's `content` scan must include `./src/**/*.{ts,tsx}` and therefore `components/dooping/`.

**Fixed destinations:**

```
src/
├── components/dooping/    # components (.tsx)
└── lib/dooping/           # utilities (utils, sorting, CSV, downloads, form diffs)
```

The `dooping/` directory makes copied design-system code easy to identify and synchronize when an upstream bug is fixed.

### Host prerequisite: the style baseline

Component utility classes declare border width; Tailwind preflight supplies `border-style: solid`, a zero default border width,
and the default border color. **Without that baseline, the component will not throw an error—it will quietly deform:** borders
disappear, bare buttons expose browser styling, and tables inherit host grid lines.

- **Standard Tailwind/shadcn project:** `shadcn init` includes `@tailwind base` and satisfies this requirement. We also recommend:

  ```css
  @layer base {
    * { border-color: hsl(var(--border)); }
  }
  ```

- **Existing site with its own CSS:** do not enable preflight globally; add an equivalent baseline inside the component scope.
  The documentation site uses [`book/src/css/demo-base.css`](https://github.com/kielchang/dooping-design-book/blob/main/book/src/css/demo-base.css).
  Portal content (Dialog, Select, Tooltip, and data-table filters) is mounted directly under `body`, so the scope must cover it too.
  See [ADR-0010](https://kielchang.github.io/dooping-design-book/adr/demo-host-baseline-contract/) for tradeoffs and verification.

## Use tokens

```bash
npm install @dooping/tokens
```

Tokens are the only recommended hard dependency. Choose the entry point that fits the host:

```css title="Plain CSS (any host)"
@import "@dooping/tokens/tokens.css";

.my-alert {
  background: hsl(var(--danger) / 0.1);
  border: 1px solid hsl(var(--danger) / 0.35);
  color: hsl(var(--danger));
}
```

```js title="tailwind.config.js"
module.exports = {
  presets: [require("@dooping/tokens/tailwind-preset")],
  content: ["./src/**/*.{ts,tsx}"],
};
```

```ts title="JS API (canvas charts, server PDFs, Figma plugins, ...)"
import { semanticColors, chartColors, TOKENS_VERSION } from "@dooping/tokens";

chartColors("dark");   // eight color-vision-friendly series colors
semanticColors();      // semantic colors as HSL triplets
```

The fourth entry point is `@dooping/tokens/tokens.json`, the source file for non-JavaScript toolchains.

`tokens.css` is plain CSS and does not require Tailwind. Both `.dark` and `[data-theme="dark"]` are built in:

```js
document.documentElement.classList.toggle("dark");
// Or use the attribute hook:
document.documentElement.setAttribute("data-theme", "dark");
```

Change token values in `packages/tokens/src/tokens.json`. Do not edit `dist/` or `src/tokens.data.ts`; they are generated outputs.

## Contracts that must not drift

Copied component source is yours to adapt. These contracts are different:

1. **Semantic color names and meanings.** `--danger` means danger and `--success` means success. Change a brand value, not a name.
2. **Amber means “changed but not submitted.”** Do not reuse it for another meaning. See [ADR-0002](https://kielchang.github.io/dooping-design-book/adr/amber-reserved-for-dirty-state/).
3. **Dark-mode hooks live on `document.documentElement`.** Use either `.dark` or `[data-theme="dark"]`; putting the hook on a wrapper misses portal content.
4. **Never communicate meaning with color alone.** Pair state with text or an icon; see the [accessibility principles](https://kielchang.github.io/dooping-design-book/accessibility/principles/).

## Compatibility and versions

Use `main` as the reference. `dev` is an active development branch and is not a stable source.

| Layer | How to pin it | How to tell you are behind |
| --- | --- | --- |
| Tokens | Pin the `/r/index.json` `tokensVersion` | `npm outdated @dooping/tokens` |
| Components | You cannot and do not need to pin copied code | Compare the version stamp |

Copied components carry the same design-version stamp as the GitHub `vX.Y.Z` tag. Compare it with the online version in `/r/index.json`.
The registry's `tokensVersion` is the compatibility source of truth: equal numbers mean the layers are paired.

### How to hear about updates

- **Watch releases:** GitHub → Watch → Custom → Releases.
- **Pull:** compare the online `/r/index.json` `version` with the stamp in your copied files.

Documentation-only releases do not create a tag or release; that quietness means no downstream action is required.

### A conformance ledger to copy

Keep this ledger in your own repository, not upstream:

```markdown
# Conformance ledger

Upstream version: v<version copied> (tokens <paired version>)   Last checked: <date>

| Local implementation | Status | Upstream reference | Reason (required for intentional divergence) |
| --- | --- | --- | --- |
| Data table | Conforming | data-table | — |
| <component or pattern> | Custom | (missing piece claimed) | Upstream does not have it yet |
| <component or pattern> | Intentional divergence | <reference> | <write a falsifiable reason> |
```

The three statuses are **conforming**, **custom**, and **intentional divergence**. A divergence without a reason is a repair item.

## Adding something to this repository

All three admission principles must pass:

1. **De-domainized:** it still works when the original industry context is removed.
2. **General:** another back-office system could use it.
3. **Three-use rule:** it has been used successfully at least three times. Known accessibility or security issues are exceptions.

Before opening a PR, run the repository's existing checks:

```bash
npm run build:tokens
npm run typecheck
npm test
npm run build:registry
```

`registry/*.json` is committed output. If `packages/react/src` changes, regenerate the registry and commit it together.

## Entry points

- 📘 [Documentation](https://kielchang.github.io/dooping-design-book/)
- 🧩 [Storybook](https://kielchang.github.io/dooping-design-book/storybook/)
- 📦 [Registry index](https://kielchang.github.io/dooping-design-book/r/index.json)
- 🤖 [Machine-readable map](https://kielchang.github.io/dooping-design-book/llms.txt)
- 🧭 [ADR index](https://kielchang.github.io/dooping-design-book/adr/)
- 🏗 [Architecture](https://github.com/kielchang/dooping-design-book/blob/main/ARCHITECTURE.md)
- 💬 [Suggest an improvement](https://github.com/kielchang/dooping-design-book/issues/new/choose)
