# Type spec: architecture (state-of-code)

An architecture doc describes how a sub-domain works **now**. It is the doc a reader trusts over their memory and almost over the code — which is why its contract is the strictest of the three.

## Naming

The file name is the capability in **user-facing nouns** — descriptive enough that a reader who has never seen the code picks the right doc from a directory listing. No protocol names, no route-derived jargon, no subject-less filler ("path", "flow", "pipeline" without whose). Test: does the name still mean something if the implementation is swapped?

## Contract

- **Present tense throughout.** No chronology, no phase history, no status emojis, no "recently/now supports" framing (it's all "now").
- **Opens with `## At a glance`** — the orientation block (template below). No prose preamble.
- **`## How it works` is the centerpiece** — the single most informative diagram(s) of the sub-domain (flow, topology, or composition — whichever carries the most understanding), with clarifying bullets beneath. The bullets anchor to step numbers / node names; they never re-narrate what the diagram already shows. A good clarifying bullet states what the diagram's *geometry implies but doesn't say* (e.g. which node is the pivot between two regimes, which branch is the rare one).
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

## Diagram styling (source-level only)

Stylization must survive any markdown preview — it lives in the diagram *source*, never in theme machinery:

- **No `%%{init}%%` theme directives** — partially overridden by doc hosts and they fight viewer dark/light modes.
- **No committed rendered SVGs** — a checked-in render drifts from its source silently. Strict-renderer validation and on-demand export (e.g. the `pretty-mermaid` skill) are the renderer's two jobs.
- The portable kit — apply each item **where the diagram form supports it**, skip where it doesn't:
  - two-line labels — concept on line one, file/symbol anchor on line two (the diagram doubles as a code map);
  - edge semantics carry meaning where the form has edge styles — e.g. solid = request/action, dashed = response/stream;
  - CAPS for the one load-bearing phrase per edge/node;
  - `autonumber` on sequence diagrams, so clarifying bullets can anchor to steps.
- **The kit does not constrain diagram choice.** The centerpiece is whatever mermaid form carries the most understanding for this sub-domain — sequence, flowchart, state, ER, class, anything. Not every architecture has a numbered flow; clarifying bullets anchor to whatever the form offers (step numbers, node names, edge labels).

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
- [ ] `## How it works` present; bullets anchor to the diagram rather than re-narrating it
- [ ] Every diagram validated through a strict renderer; no init directives; no committed renders
- [ ] No paragraph over ~2 sentences outside diagram notes
- [ ] Every cited path/symbol grepped this edit
- [ ] Abbreviations glossed at first prose use; jargon replaced or (if load-bearing house vocabulary) kept deliberately
- [ ] `## Boundaries` present and honest
- [ ] Pointer block present, one level deep
