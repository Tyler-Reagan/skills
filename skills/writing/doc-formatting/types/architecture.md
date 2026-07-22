# Type spec: architecture (state-of-code)

An architecture doc describes how a sub-domain works **now**. It is the doc a reader trusts over their memory and almost over the code — which is why its contract is the strictest of the three.

## Naming

The file name is the capability in **user-facing nouns** — descriptive enough that a reader who has never seen the code picks the right doc from a directory listing. No protocol names, no route-derived jargon, no subject-less filler ("path", "flow", "pipeline" without whose). Test: does the name still mean something if the implementation is swapped?

## Contract

- **Present tense throughout.** No chronology, no phase history, no status emojis, no "recently/now supports" framing (it's all "now").
- **Opens with `## At a glance`** — the orientation block (template below). No prose preamble.
- **`## How it works` is the centerpiece** — the single most informative diagram(s) of the sub-domain, drawn to the **scan path** bar below, with clarifying bullets beneath that name geometry (admit spine vs alternate branch, what was omitted) rather than re-narrating the picture.
- **The centerpiece is self-sufficient.** When orientation-ish content (a taxonomy, a lane table) wants to precede the diagram, push the framing it provides into `## At a glance` instead and let the taxonomy section follow `## How it works` — the section order holds.
- **Free-form per-concern `##` sections** carry the rest — doc-specific pedestrian names, bulleted, tables for taxonomies. Diagram use within them is case-by-case agent discretion; no placement rules.
- **Bullets over paragraphs** everywhere. A paragraph over ~2 sentences is a diagram note, a list, or padding.
- **Every citation verified.** Each file path, symbol, route, or config key mentioned must be grepped/read in the current tree during the edit that touches it.
- **Altitude is bounded.** One sub-domain per doc, one level below the apex overview.
- **`## Boundaries` section.** What this sub-domain explicitly does *not* cover today, with ticket/doc pointers for the gaps.
- **Closing pointer block** (italic, after a rule): the decision record(s) carrying the *why*, the archived source plan(s) carrying the chronology, and the apex doc. One level deep, no chains.

## The `## At a glance` opener

Bold topic + colon + definition; sub-bullets for heavy points; labels stay pedestrian:

```markdown
## At a glance

- **What**: <the capability in one line — its arc, not its mechanism>.
- **Owns**:
  - <surface/mechanism this sub-domain is responsible for>;
  - <another>.
- **Does not own**:
  - <adjacent concern> — <pointer to where it lives>;
  - <another>.
- **Ground rules**:
  - <invariant the rest of the doc depends on>;
  - <another>.
- **Why**: <link to the decision record(s)>.
```

`Owns` / `Does not own` are almost always 3+ item series with per-item pointers — the sub-bullet threshold (see SKILL.md) usually fires; taller beats wider. `What` and `Why` stay single-line.

## Scan path (diagrams)

Teaching diagrams are a **scan path**: a readable story for the eye, not a complete schema and not a stylized artifact. Source Mermaid in the markdown is enough — no committed SVG, no theme/`%%{init}%%`, no pretty-mermaid pass unless the user asks for a render.

Pick the figure's **job** first — many teaching centerpieces are **spatial**, not flow:

- **Spatial / nesting** — containment and “what lives inside what” (process co-location, host → VMM → guest, Kernel inside ci-worker, disks vs mounts). Nested subgraphs and placement carry the meaning; do **not** flatten these into an admit-spine flowchart.
- **Flow** — state machines and caller ops (admit → live → alternate exits). Use admit spine + alternate branches (below).

Label rules (short domain nouns, no ellipsis) apply to **both**. Flow-only rules (admit spine numbering) apply only when the job is flow.

### Story shape (flow figures)

- **Admit spine** — draw the required path first (left-to-right or top-to-bottom): the edge that always happens (e.g. create/admit → live state).
- **Alternate branches** — optional or choice exits fan from a pivot node. Never lay out optional ops as a left-to-right pipeline that implies they always run in order.
- **Omit crowding edges** — reverse/busy/re-arm loops that cross the spine stay in clarifying bullets when drawing them overlaps or diagonalizes the figure.
- Prefer **TB forks** when an LR layout forces edge crossings; prefer **LR spines** when the story is admit → live → one teardown chain.

### Labels

- **Short domain nouns** on nodes and edges — readable width; no ellipsis (`...` / `…`); no em-dash run-ons packing clauses into a box.
- Wire names, RPC lists, and outcome mechanics live in **bullets under the figure**, not in labels.
- Number edges (`1`, `2a` / `2b`) when bullets need anchors; bullets explain geometry (required vs alternate, what was omitted) — they do not re-narrate the picture.
- Sequence diagrams may use `autonumber` and solid vs dashed for request vs response. CAPS on a single load-bearing edge phrase is optional, not mandatory.
- **Code-map exception** — only when the figure's job is “find this in the tree,” a second label line may carry a file/symbol anchor; default figures stay domain-only.

## Section order

1. Title — `# <Capability> — <one-line qualifier>`
2. `## At a glance`
3. `## How it works`
4. Free-form per-concern sections
5. `## Boundaries`
6. Closing pointer block

## Review checklist

- [ ] File name = capability in user-facing nouns; passes the never-seen-the-code test
- [ ] Opens with `## At a glance` in the template shape; labels pedestrian; bold+colon separators
- [ ] Zero status lines, zero dates-as-status, zero chronology
- [ ] `## How it works` present; bullets explain geometry, not re-narration
- [ ] Diagrams follow **scan path** for their job (spatial nesting vs flow spine); short domain labels; no ellipsis/em-dash stuffed boxes; wire detail under the figure
- [ ] Every diagram stock-validated; no init directives; no committed renders
- [ ] No paragraph over ~2 sentences outside diagram notes
- [ ] Every cited path/symbol grepped this edit
- [ ] Abbreviations glossed at first prose use; jargon replaced or (if load-bearing house vocabulary) kept deliberately
- [ ] `## Boundaries` present and honest
- [ ] Pointer block present, one level deep
