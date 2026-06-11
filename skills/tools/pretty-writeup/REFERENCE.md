# Pretty Writeup — Component Reference

Copy-ready HTML for every component in `assets/shell.html`. All visuals come from CSS tokens, so the same markup renders correctly in either theme. Use only the components the content earns — a sparse page is fine.

## Page frame

```html
<h1>Title with an <span class="accent">accent word</span></h1>
<p class="sub">One-sentence subtitle describing the artifact.</p>
```

Optional metadata row and status chips directly under the subtitle:

```html
<div class="meta">
  <span><b>Source</b> path/to/doc.md</span>
  <span><b>Generated</b> 2026-06-11</span>
</div>
<div class="tags">
  <span class="tag on">verified</span>
  <span class="tag">single-file</span>
  <span class="tag w">caveat: estimates</span>
</div>
```

`.tag.on` = accent (affirmative), `.tag` = neutral, `.tag.w` = amber (warning/caveat).

## Section headers

```html
<h2>Section</h2>     <!-- underlined; the primary divider -->
<h3>Sub-point</h3>   <!-- accent-colored inline header, no rule -->
```

## Callouts (filled, semantic)

Map GitHub admonitions in the source:

| Admonition | Class | Meaning |
| --- | --- | --- |
| `[!IMPORTANT]`, `[!TIP]` | `.key` | the load-bearing insight or recommendation |
| `[!NOTE]`, `[!WARNING]` | `.note` | a caveat or aside |
| `[!CAUTION]` | `.stop` | a wrong turn — do not do this |

```html
<div class="key"><b>Key takeaway.</b> The one thing the reader must leave with.</div>
<div class="note"><b>Caveat.</b> A qualification or aside worth surfacing.</div>
<div class="stop">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="9"/><path d="M8 8l8 8M16 8l-8 8"/></svg>
  <div><b>Don't do this.</b> The plausible-looking wrong path and why it fails.</div>
</div>
```

The `.stop` icon uses `stroke="currentColor"` so it inherits the red token. Use callouts sparingly — one `.key` per major section at most.

## Stat cards

A leading list of headline metrics becomes a card grid. Color the number by valence:

```html
<div class="kpis">
  <div class="kpi good"><div class="n">~420 MB/s</div><div class="l">peak throughput</div></div>
  <div class="kpi"><div class="n">2x</div><div class="l">vs baseline</div></div>
  <div class="kpi bad"><div class="n">2.6 GB</div><div class="l">peak memory</div></div>
  <div class="kpi warn"><div class="n">-25%</div><div class="l">latency tradeoff</div></div>
</div>
```

Modifiers: default = accent, `.good` = green, `.bad` = red, `.warn` = amber.

## Tables

```html
<table>
  <thead><tr><th>Profile</th><th>Flags</th><th>Best for</th></tr></thead>
  <tbody>
    <tr><td>balanced <span class="tag">default</span></td><td class="flags">block 8MB · ra 8</td><td>general use</td></tr>
  </tbody>
</table>
```

First column is auto-emphasized. Use `td.flags` for mono/nowrap config cells. Tint verdict cells with word markers and color, never glyphs or emoji: `<span class="ok">yes</span>`, `<span class="x">no</span>`, `<span class="mid">partial</span>`.

## Code blocks

Always dark. Tint by hand — there is no highlighter:

```html
<pre><span class="c"># comment</span>
mytool run <span class="k">--flag</span> value <span class="s">"string"</span> <span class="f">funcName</span>()</pre>
```

`.c` comment (faint), `.k` keyword/flag (amber), `.s` string (green), `.f` function/identifier (accent). Tint enough to read, not a full grammar.

## Bar charts

For comparing magnitudes (throughput, memory, time). Set `width` inline; color the fill by valence:

```html
<div class="bars">
  <div class="bar-row"><span class="name">throughput</span>
    <div class="track"><div class="fill good" style="width:100%"></div></div>
    <span class="val">~420 MB/s</span></div>
  <div class="bar-row"><span class="name">balanced</span>
    <div class="track"><div class="fill" style="width:48%"></div></div>
    <span class="val">~200 MB/s</span></div>
</div>
```

`.fill` modifiers: default accent, `.good` green, `.bad` red, `.warn` amber. Width is the value as a percent of the max bar.

## Diagrams (hand-built SVG)

Mermaid or a described flow is **substrate** — redraw it. Wrap in `figure.diagram`:

```html
<figure>
  <div class="diagram">
    <svg viewBox="0 0 840 300" width="100%" role="img" aria-label="describe the flow for accessibility">
      <!-- boxes: rounded rects filled with a tinted bg, mono labels -->
      <!-- arrows: <line>/<path> with a <marker> arrowhead -->
      <!-- color by meaning: accent = flow, green = good, red = bad/cost -->
    </svg>
  </div>
  <figcaption>One line stating what the diagram shows.</figcaption>
</figure>
```

Keep `width="100%"` and a `viewBox` so it scales. Hardcode hex colors that match the active theme's tokens (SVG can't read CSS vars inline reliably across renderers). Skip the diagram entirely if the content doesn't have a flow worth drawing.

## Footer

```html
<footer>
  Generated from <code>source.md</code> · point-in-time, treat relative tradeoffs as durable not exact ·
  <a href="...">reference</a>
</footer>
```

## Content arc (default, not mandatory)

orient (title + subtitle + chips) -> context/problem -> **key insight** (`.key`) -> evidence (tables, cards, code) -> diagram -> tradeoffs/results -> takeaway (`.key`) -> footer. Follow the source's real structure; this is a starting shape, not a cage.
