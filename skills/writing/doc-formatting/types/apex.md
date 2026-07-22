# Type spec: apex (top-level entry doc)

An apex doc is the entry point for a whole concern — the system itself, a workflow (local development), an operational domain (deployment). It is orientation first: a reader lands here to get the shape of the concern and either finds what they need in a table or is routed to depth. State-of-code rules apply (present tense, no chronology, no status lines), but the contract differs from a sub-domain architecture doc in deliberate ways.

## Two shapes

- **Routing apex** — fronts a directory of sub-domain docs (e.g. an `architecture.md` beside an `architecture/` dir). Holds orientation, centerpiece diagrams, and contract-hub tables; depth lives one level down.
- **Standalone apex** — a self-contained topical doc with no sub-directory (most apexes: deployment, local development, testing). Sections carry their own depth — until one outgrows the doc, which is the signal to mint a sub-domain doc and convert toward the routing shape.

## Contract

- **Present tense, no chronology, no status lines** — same bar as architecture docs.
- **Orientation-appropriate opener.** A system apex opens with `## At a glance` (the architecture-type template). A workflow/operational apex may open instead with its natural orientation device — a choose-your-path table, an environments matrix — when that orients faster than At a glance would. Agent discretion; no prose preambles either way.
- **Tables are the primary register** for anything matrix-shaped: environments, accounts, components, endpoints, option sets. An apex that narrates a matrix in prose is hiding a table.
- **Multiple centerpiece diagrams allowed.** A system apex typically pairs topology + canonical flow under `## How it works`. Standalone apexes use diagrams at discretion (many legitimately have none — a deployment matrix doesn't need a flowchart). When diagrams appear, apply the architecture **scan path** bar ([architecture.md](architecture.md#scan-path-diagrams)).
- **Routing table required when a sub-domain dir exists** (`## In depth`: doc | the question it answers). Inline pointers complement it; they don't replace it.
- **Depth discipline.** On a routing apex, per-component sections are bullets + tables + pointers — mechanism prose belongs in the sub-domain doc that owns it. Duplicated substance between apex and sub-domain doc is a defect; the apex keeps the contract-hub tables (the things everything else references), the sub-domain docs keep the mechanisms.
- **`## Boundaries`** on system apexes (what the concern defers to other repos/systems); optional on standalone apexes.
- All-types rules apply: bullets over prose, sub-bullets over comma trains, glosses/jargon, stock mermaid validation.

## Section order (routing apex default; standalone adapts)

1. Title — `# <Concern>`
2. `## At a glance` (or the concern's natural orientation device)
3. `## How it works` — centerpiece diagram(s)
4. `## In depth` — routing table (when a sub-domain dir exists)
5. Contract-hub and per-component sections — tables + bullets + pointers
6. `## Boundaries` (system apexes)
7. Reference tails (directory layout, external links) — keep, keep short

## Review checklist

- [ ] No status lines, no chronology, no prose preamble
- [ ] Matrix-shaped content is in tables
- [ ] Routing table present iff a sub-domain dir exists; every sub-domain doc has a row
- [ ] No mechanism prose duplicated from a sub-domain doc — bullets + pointer instead
- [ ] Contract-hub tables live here exactly once (sub-domain docs reference, don't copy)
- [ ] Diagrams stock-validated; styling source-level only
- [ ] Boundaries present on system apexes
- [ ] Standalone apex sections that have outgrown the doc are flagged for extraction, not left to bloat
