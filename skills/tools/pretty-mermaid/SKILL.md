---
name: pretty-mermaid
description: Renders Mermaid diagrams to styled SVG or ASCII art using beautiful-mermaid, with 15 themes and batch support. Use when the user wants to render a .mmd file, asks to "create a flowchart / sequence diagram / ER diagram / state diagram", wants to "apply a theme" or "beautify a diagram", needs a terminal-friendly ASCII version of a Mermaid chart, or wants to batch-render multiple diagrams at once.
license: MIT
metadata:
  author: uraniborglabs@gmail.com
  version: "1.1.0"
  domain: developer-workflow
  triggers: render mermaid, flowchart, sequence diagram, ER diagram, state diagram, apply theme, beautify diagram, ascii diagram, batch render diagrams
  role: formatting
  scope: implementation
  output-format: code
  related-skills: mermaid-diagrams
---

# Pretty Mermaid

Renders Mermaid diagrams to styled SVG or ASCII art via `beautiful-mermaid`. Scripts handle the rendering — Claude's job is to choose the right options and compose them.

## Decide first

| Goal | Script | Key flags |
|---|---|---|
| Render a single diagram | `scripts/render.mjs` | `--input` `--output` `--theme` `--format` |
| Batch render a directory | `scripts/batch.mjs` | `--input-dir` `--output-dir` `--workers` |
| List available themes | `scripts/themes.mjs` | (no args) |
| Create from scratch | Copy from `assets/example_diagrams/` | See [DIAGRAM_TYPES.md](references/DIAGRAM_TYPES.md) |

**Output format:** SVG for docs/web/presentations; ASCII (`--format ascii`) for terminal, README, plain text.

**Theme quick picks:** `tokyo-night` for dark docs, `github-light` for light docs, `dracula` for high contrast. Full guide: [THEMES.md](references/THEMES.md).

## Basic invocations

```bash
# Single diagram, SVG
node scripts/render.mjs --input diagram.mmd --output diagram.svg --theme tokyo-night

# Single diagram, ASCII
node scripts/render.mjs --input diagram.mmd --format ascii --use-ascii

# Batch render
node scripts/batch.mjs --input-dir ./diagrams --output-dir ./output --theme github-dark --workers 4

# Transparent background (dark/light mode compatible)
node scripts/render.mjs --input diagram.mmd --output diagram.svg --theme tokyo-night --transparent
```

## Gotchas

**`beautiful-mermaid` not installed.** Auto-installs on first run (pnpm → npm fallback). If it fails with `Cannot find module 'beautiful-mermaid'`, run from the skill directory specifically:
```bash
cd /path/to/pretty-mermaid-skill && pnpm install
```

**`--format ascii` vs `--use-ascii`.** `--format ascii` switches the renderer to ASCII output. `--use-ascii` additionally restricts to pure ASCII characters (no Unicode box-drawing). Use `--use-ascii` only when the target environment can't render Unicode.

**Parse errors on valid-looking syntax.** Mermaid is whitespace-sensitive. `A-->B` silently fails where `A --> B` works. Check spacing around arrows first. Validate at https://mermaid.live/ before debugging the script.

**Batch workers default (4) is too low for large sets.** Use `--workers 8` for 10+ diagrams. Each worker is a separate render process; the bottleneck is CPU, not I/O.

**`--transparent` doesn't work with all themes.** Light themes (zinc-light, github-light) treat transparency differently — the background may appear white instead of transparent in some renderers. Test before batch-rendering for a target environment.

## Folder map

```
scripts/
  render.mjs          — single diagram renderer
  batch.mjs           — batch renderer (parallel workers)
  themes.mjs          — lists all 15 available themes
  ensure-deps.mjs     — auto-installs beautiful-mermaid if missing

references/
  THEMES.md           — theme catalogue with visual descriptions and use-case guidance
  DIAGRAM_TYPES.md    — Mermaid syntax reference for all supported diagram types
  api_reference.md    — beautiful-mermaid CLI flag reference

assets/
  example_diagrams/   — starter templates: flowchart, sequence, state, class, er
```

## Anti-patterns

**DO NOT** regenerate the render script from scratch — `scripts/render.mjs` already exists; invoke it.

**DO NOT** pick a theme without checking [THEMES.md](references/THEMES.md) — the 15 options have meaningfully different aesthetics and some are context-specific.

**DO NOT** hardcode diagram syntax without checking [DIAGRAM_TYPES.md](references/DIAGRAM_TYPES.md) — Mermaid syntax varies by diagram type and version.
