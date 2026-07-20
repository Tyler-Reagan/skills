# SWE highlights — reference

Load when packaging a suite, collapsing a dense collection, or checking link bar.

## Hierarchy

```
Suite project highlight          ← one per multi-repo product (optional if single collection)
  └── Collection top             ← one per repo / surface
        ├── optional breakout
        └── optional breakout
Case studies                     ← substrate linked from cards (not 1:1)
```

**Budget**

| Layer | Cap |
| --- | --- |
| Suite project cards | Exactly **1** when a suite exists |
| Cards inside one child collection | **≤ 3** (1 top + ≤ 2 breakouts) |

Breakouts earn a slot only when their thesis would **drown** the collection top
or needs a distinct interview screen (e.g. Owned vs Interfaced fence).

## Collapse

When substrate theses exceed the budget:

1. Pick the **collection top** = the repo’s 0→1 or consume climax screen.
2. Rank remaining theses by interview distinctness (not MR count).
3. Merge into one breakout when they share one user-visible skill.
4. Leave the rest as substrate-only (linked from top/breakout Substrate sections).
5. If two merges both look right, invoke `/grilling` before deleting cards.

Record an absorb map while rewriting (`old file → new code`) so README retargets
are exhaustive.

## Altitude

| Card | Job |
| --- | --- |
| Suite project | Year/product transformation; points at child tops for specificity |
| Collection top | Surface thesis for one repo; frames breakouts |
| Breakout | One screen that would drown the top (privilege, operability, bridge, …) |

## Suite layout (when multi-repo)

Prefer nesting collections under one suite parent with an umbrella README:

```text
portfolio-arcs-{product}-suite/
├── README.md                 # arc index + stack→arc map + how to use
├── cards/01-….md             # suite project highlight
├── portfolio-arcs-{surface-a}/
│   ├── README.md
│   ├── cards/
│   └── case-studies/
└── portfolio-arcs-{surface-b}/
    ├── …
```

Coding schemes (S1 / U1 / I1 / …) are local conventions — pick stable prefixes
per suite and use them in the arc index. Do not require a particular letter set.

Single-repo portfolios may skip the suite layer: one collection top + breakouts
is enough.

## README duties after a wave

- Arc index links every live card code → file
- Skill / stack maps cite card paths (not deleted names)
- Child READMEs point at suite parent (if any) and sibling fences
- Deferred work stays clearly labeled deferred

## Link bar

After structural edits:

1. Grep for deleted card filenames and old codes
2. Resolve relative markdown links under the tree you touched
3. Prefer path checks over eyeballing

## Out of scope

- Public sanitize / site publish folders — only if the user asks
- Rewriting case studies into the highlight template — substrate stays dense
- Mining new MR evidence — `/portfolio-arcs-from-history`
