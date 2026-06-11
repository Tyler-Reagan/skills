---
name: pretty-writeup
description: Renders an existing markdown document into a self-contained, single-file styled HTML "writeup" in a fixed house design system (dark default, light preset). Use when the user says "make an HTML writeup", "format this as an HTML report", "turn this doc into a styled page", "pretty HTML version of this", "stylize this markdown", "HTML report from this doc", or wants a shareable styled HTML artifact built from a markdown source.
license: MIT
metadata:
  author: uraniborglabs@gmail.com
  version: "1.0.0"
  domain: developer-workflow
  triggers: make an html writeup, format as html report, turn markdown into a styled page, pretty html version, stylize this markdown, html report from this doc, styled html artifact
  role: formatting
  scope: documentation
  output-format: code
  related-skills: doc-formatting, pretty-mermaid, mermaid-diagrams
---

# Pretty Writeup

Render an existing markdown doc into a single self-contained HTML page in a fixed house design system. This is an **agent-driven formatter, not a transpiler**: you are handed a frozen stylesheet you must not redesign, plus a component vocabulary, and you re-express the source in those components. The output should read as *authored*, not auto-converted.

Sister to `doc-formatting` (which formats markdown-as-markdown) and `pretty-mermaid` (which renders diagrams). This one produces a styled HTML artifact for sharing.

## Workflow

1. **Read the source `.md`** and resolve the theme: `dark` (default) or `light` if the user asked.
2. **Load the frozen shell** `assets/shell.html` — it carries the entire component stylesheet against CSS tokens, dark by default. For `light`, swap the `:root` block and add the font `<link>` per `assets/themes/light.css`.
3. **Map content into components** using the table below; the full catalog with copy-ready HTML is in [REFERENCE.md](REFERENCE.md). Author the `<body>` inside `.wrap`.
4. **Diagrams are redrawn, never embedded** — see the diagram gotcha. Any mermaid or described flow informs a hand-built SVG (or bar chart / stat cards) in the house style.
5. **Emit one `.html` next to the source**, then run the self-check (no emoji, no stray external refs beyond the light-theme font link, no raw mermaid, every callout re-tokened to the active theme).

See [assets/examples/demo.html](assets/examples/demo.html) for a synthetic page exercising every component — use it for register and structure, not content.

## Markdown -> component mapping

| Source markdown | Becomes | Class |
| --- | --- | --- |
| `# Title` + first line | page title + subtitle | `h1` + `p.sub` |
| `## Heading` | underlined section header | `h2` |
| `> [!IMPORTANT]` / `[!TIP]` | load-bearing insight / recommendation | `.key` (accent) |
| `> [!NOTE]` / `[!WARNING]` | caveat / aside | `.note` (amber) |
| `> [!CAUTION]` | don't-do-this | `.stop` (red) |
| pipe table | styled table; verdict cells tinted | `table`, `.ok`/`.x` |
| fenced code | dark code block, hand-tinted | `pre` + `.c`/`.k`/`.s`/`.f` |
| a leading list of metrics | stat-card grid | `.kpis` / `.kpi` |
| a comparison of magnitudes | horizontal bar chart | `.bars` / `.bar-row` |
| ` ```mermaid ` or a described flow | **substrate** for a hand-built SVG | `figure.diagram` |
| status words under the title | pill chips | `.tags` / `.tag` |
| ticket/build/date metadata | inline metadata row | `.meta` |
| trailing references / provenance | footer | `footer` |

The **invariant skeleton** (title + subtitle, underlined `h2`s, optional stat cards, tables, code, callouts, footer) holds across both themes. The **theme** changes only the `:root` token block — colors, radius, fonts.

## Gotchas

- **Mermaid is substrate, never output.** A ` ```mermaid ` block must never survive into the HTML. Use it (or a described flow) to inform a bespoke hand-authored `<svg>`. Color by meaning: accent = flow, green = good, red = bad/cost. If a diagram isn't warranted, leave it out — don't force one.
- **No emoji anywhere** in the output. Use text markers, the `.ok`/`.x` spans, or callout color instead.
- **Self-contained or it's broken.** All CSS is inline. The **dark theme makes zero network requests**; the **light theme's Google Fonts `<link>` is the only** permitted external reference. No external JS, no image hotlinks (inline SVG or `data:` only).
- **Re-token callouts per theme.** Box colors come from the active `:root` block — never leave a teal `.key` on a dark `#0d1117` background. Swapping the token block must restyle everything.
- **`.c`/`.k`/`.s`/`.f` are manual.** There is no syntax highlighter. Tint comments/keywords/strings/functions by hand, sparingly — enough to read, not a full grammar.
- **Keep the humility line** when the doc has measured numbers: a short "treat the relative tradeoffs as durable, not the exact figures" note. It is a genre signature, not boilerplate.
- **Don't railroad the arc.** Orient -> context -> key insight -> evidence -> diagram -> takeaway is the *typical* shape, offered as a default. Follow the source's real structure; add components only where the content earns them.
- **Re-author, never extract.** The stylesheet here is generic and house-owned. Never copy styling or content out of a user's existing proprietary HTML into this skill or its assets.
