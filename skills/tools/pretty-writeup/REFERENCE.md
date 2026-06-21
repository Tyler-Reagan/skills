# Pretty Writeup — Reference

This is the working catalog for turning a topic or source material into a self-contained HTML artifact. Components are templates, not slots. Use the nearest fit when it clarifies the page; simplify or extend when it does not.

## Substrate dialogue

Before writing HTML, establish the brief. For rich source material, draft this from the source and ask for confirmation. For topic-only or conflicting material, ask until the essentials are clear.

| Field | Purpose |
| --- | --- |
| Audience | Who reads: technical, mixed, leadership, customer, other |
| Job | Decide, align, inform, record, persuade, or brief |
| Thesis | One sentence the reader should leave believing or knowing |
| Critical path | 3-7 ideas that must land |
| In / out | What belongs in the body vs footer vs omission |
| Register | Brief default or evidence default; borrowing is allowed |
| Visuals | Diagrams / metrics required, optional, or omitted |
| Source map | Which inputs feed the artifact; footer provenance |
| Success | Optional: how the user knows the artifact worked |

### Guided vs enforced

| Intake | Mode | Recommended dialogue |
| --- | --- | --- |
| Rich presentation-ready source | Guided | Present a drafted substrate and ask for one confirmation |
| Topic-only prompt | Enforced | Ask for audience, job, thesis, and critical path |
| Multiple conflicting docs | Enforced | Resolve thesis and in/out before choosing layout |
| "Just make it pretty" | Guided | Ask one compact form, then proceed |
| "Skip questions" / "draft it" | Waived | Proceed; note assumptions only if non-obvious |

### Suggested AskQuestion rounds

Round 1 (guided minimum):

- Audience: leadership / mixed / technical / other
- Job: decide / align / inform / record / other
- Register: brief / evidence / infer from source

Round 2 (enforced or ambiguous):

- Confirm or edit the one-sentence thesis the agent drafts.
- Confirm or edit the 3-7 critical-path bullets the agent drafts.
- Choose out-of-scope items: implementation detail, ticket history, API flags, benchmarks, unresolved alternatives, other.

Keep dialogue proportional. If the user gives a strong source and clear audience, one confirm round is enough.

## Idea-type packaging

Map distilled idea units to packaging options. Source syntax is a hint, not routing law.

| Idea type | Packaging options | Source hint |
| --- | --- | --- |
| Parallel constraints / pillars | `.facts`, diagram, short `ul` | 2-3 peer bullets, "constraints" |
| Supporting arguments | `.points`, plain `ul`, tight `p` | Section with 3-6 reasons |
| Section takeaway | `.bridge`, omit | Closing paragraph, important note |
| Before/after / flow | `figure.diagram`, table | Mermaid, numbered steps, process prose |
| Option comparison | Two-column diagram, table | Two approaches, alternatives |
| Headline numbers | `.kpis`, inline | Leading metrics |
| Magnitude comparison | `.bars`, table | Benchmark or cost table |
| Copy-paste detail | `pre` | Commands or code readers need |
| Provenance | `footer`, `.meta` | Tickets, paths, generated date |

## Template fit

A component fits when all three are true:

1. **Structural**: item count and layout match the component.
2. **Semantic**: the component's job matches why the unit exists.
3. **Non-redundant**: it adds something adjacent units do not already say.

| Template | Fits when | Otherwise |
| --- | --- | --- |
| `.facts` | 2-3 peers at the same abstraction | Use `p`, `ul`, `.points`, table, or diagram |
| `.points` | 3-6 parallel arguments with distinct headlines | Use `ul`, split sections, or table |
| `.bridge` | One phrase captures the takeaway or constraint | Omit if cards or heading already land it |
| `.block` | A major section benefits from visual grouping | Use plain `h2` for simpler docs |
| `.masthead` | The artifact benefits from kicker/tags | Use `h1` + `.sub` only |
| `.kpis` | 2-4 numbers are the headline | Put a single number inline |
| `.bars` | 3+ values share one magnitude axis | Use table or prose |
| `table` | Row/column reference or verdict matrix | Use `.points` for arguments |
| `figure.diagram` | Seeing flow/layout/comparison beats prose | Skip; do not force a visual |
| `.key` / `.note` | Evidence artifact needs a short paragraph callout | Use `.bridge` for brief takeaways |

Anti-fit signals: one-card grids, paragraph-length `.point-copy`, multi-sentence `.bridge`, diagrams duplicating tables, or components that exist only because the source had a heading.

## Extending the shell

Start from `assets/shell.html`. Prefer simplify-down before extend-out.

Allowed:

- New classes in the same `<style>` block using existing `--tokens`.
- Omit unused component markup; the full shell CSS can remain.
- Plain HTML (`h2`, `p`, `ul`, table) when it communicates best.

Avoid:

- New color palettes unrelated to `:root`.
- External CSS, JS, images, or fonts beyond the light-theme font link.
- Copying proprietary user HTML/CSS into the skill assets.

## Registers

Registers are density defaults, not exclusive modes.

| Register | Best for | Consider first |
| --- | --- | --- |
| Brief | Presentation, lineage, decisions, mixed audiences | `.masthead`, `.block`, `.facts`, `.points`, `.bridge`, diagrams |
| Evidence | Benchmarks, tuning guides, reproducible details | `.kpis`, `.bars`, `table`, `pre`, `.key`, `.note`, `.stop` |

Borrow freely: a brief can contain one essential table; an evidence artifact can close with one `.bridge`.

## Page frame

Standard:

```html
<h1>Title with an <span class="accent">accent word</span></h1>
<p class="sub">One-sentence subtitle describing the artifact.</p>
```

Masthead (brief register, no panel and no gradient):

```html
<header class="masthead">
  <p class="masthead-kicker">Decision brief</p>
  <h1>Title with an <span class="accent">accent phrase</span></h1>
  <p class="sub">One sentence: what this is and where it lands.</p>
  <div class="tags">
    <span class="tag on">primary theme</span>
    <span class="tag v">builds on prior work</span>
    <span class="tag">neutral scope</span>
    <span class="tag g">bounded risk</span>
  </div>
</header>
```

Omit `.masthead-kicker` when the title is self-explanatory.

Metadata is available when provenance needs to be near the title:

```html
<div class="meta">
  <span><b>Source</b> path/to/source</span>
  <span><b>Generated</b> 2026-06-11</span>
</div>
```

For presentation briefs, prefer provenance in the footer unless it needs to frame the argument.

## Section panels

```html
<section class="block block-today">
  <h2>How it works today</h2>
  <!-- content units -->
</section>
```

Semantic modifiers: `.block-today` current state, `.block-prior` historical, `.block-now` current direction, `.block-compare` side-by-side, `.block-close` conclusion. Use plain `h2` when panels add visual weight without payoff.

## Fact triads

```html
<div class="facts">
  <div class="fact accent">
    <div class="fact-label">Constraint</div>
    <p class="fact-punch">Memory is fixed at startup.</p>
    <p class="fact-detail">New size -> new machine.</p>
  </div>
  <div class="fact disk">
    <div class="fact-label">On-disk data</div>
    <p class="fact-punch">Saved files survive restart.</p>
    <p class="fact-detail">Persist to durable storage.</p>
  </div>
  <div class="fact mem">
    <div class="fact-label">In-memory data</div>
    <p class="fact-punch">Live work does not.</p>
    <p class="fact-detail">Lost when the machine restarts.</p>
  </div>
</div>
```

## Point cards

```html
<div class="points">
  <article class="point">
    <span class="point-marker" aria-hidden="true"></span>
    <div>
      <p class="point-head">Per-session sizing, designed in full.</p>
      <p class="point-copy">The scheduler places different-sized sessions safely.</p>
    </div>
  </article>
</div>
```

`.point-copy` may be one clause for presentation or a short sentence for technical audiences.

## Bridge

```html
<div class="bridge">
  <span class="bridge-label">Big picture</span>
  <p class="bridge-punch">Accepted "start bigger" as the fallback; now automate it.</p>
</div>
```

Use `.bridge` for one-phrase brief takeaways. Use labels like `Big picture` or `The constraint`.

## Callouts

```html
<div class="key"><b>Key takeaway.</b> One short paragraph.</div>
<div class="note"><b>Caveat.</b> A qualification worth surfacing.</div>
<div class="stop">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="9"/><path d="M8 8l8 8M16 8l-8 8"/></svg>
  <div><b>Don't do this.</b> Why it fails.</div>
</div>
```

Filled callouts work best in evidence artifacts. In briefs, check whether a `.bridge` or point card is cleaner.

## Evidence components

```html
<div class="kpis">
  <div class="kpi good"><div class="n">~420 MB/s</div><div class="l">peak throughput</div></div>
  <div class="kpi bad"><div class="n">2.6 GB</div><div class="l">peak memory</div></div>
</div>
```

```html
<div class="bars">
  <div class="bar-row"><span class="name">throughput</span>
    <div class="track"><div class="fill good" style="width:100%"></div></div>
    <span class="val">~420 MB/s</span></div>
</div>
```

```html
<table>
  <thead><tr><th>Profile</th><th>Best for</th><th>Verdict</th></tr></thead>
  <tbody>
    <tr><td>balanced</td><td>general use</td><td><span class="ok">yes</span></td></tr>
  </tbody>
</table>
```

```html
<pre><span class="c"># comment</span>
mytool run <span class="k">--flag</span> <span class="s">"value"</span></pre>
```

Verdicts: `.ok` / `.x` / `.mid`. Code tint: `.c` faint, `.k` amber, `.s` green, `.f` accent.

## Diagrams

Hand-build SVG when flow, layout, or comparison is clearer visually.

```html
<figure class="diagram">
  <svg viewBox="0 0 840 300" width="100%" role="img" aria-label="describe the flow">
    <!-- rounded rects, mono labels, marker arrowheads -->
  </svg>
  <figcaption>Same destination — up-front guess vs. on-demand trigger and replay.</figcaption>
</figure>
```

Captions should be staccato. Inside `.block`, caption tint follows `--block-accent`. Hardcode SVG hex to match active theme tokens.

## Footer

```html
<footer>
  <p class="footer-line">SW-12345 · epic ref · <span class="mono">docs/plans/topic/</span></p>
  <p class="footer-line footer-faint">Figures indicative — tradeoffs over exact numbers.</p>
</footer>
```

Put tickets, paths, source links, and humility notes here unless they are part of the argument.

## Default arcs, not cages

Brief: substrate-confirmed masthead -> context/constraints -> direction -> comparison -> closing takeaway -> footer.

Evidence: substrate-confirmed title -> metrics -> table/code/evidence -> diagram/callout -> footer.

Omit stages that do not earn their place.
