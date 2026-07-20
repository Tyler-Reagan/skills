---
name: portfolio-swe-highlights
description: >
  Package portfolio substrate into SWE interview highlight cards — suite project
  card, collection tops, optional breakouts under a hard budget. Case studies stay
  substrate. Personal only.
disable-model-invocation: true
---

# Portfolio SWE Highlights

Turn **substrate** (case studies + skill-map README) into **highlight** cards a
senior SWE interview can walk. Personal only.

This skill does **not** mine git. If substrate is thin, stop and tell the user to
run `/portfolio-arcs-from-history` first.

For routine “new MRs landed” updates to an already-packaged collection, prefer
`/portfolio-arcs-maintain` (update-in-place). Use this skill for first package,
collapse waves, or post-novelty packaging.

## Leading words

| Word | Means here |
| --- | --- |
| **Highlight** | Interview-facing card — skill thesis at altitude, not a feature dump |
| **Budget** | Suite = exactly one project card; each child collection ≤ 3 cards total |
| **Collapse** | Fold many substrate theses into the budget without losing the screen |
| **Fence** | What this card Owns vs siblings / suite — stop double-claiming |
| **Spine** | Exemplar MR sequence proving the thesis — not a backlog walk |
| **Owned / Interfaced** | Stack claim: you drove it vs you consumed a sibling’s surface |

## Compose

| Need | Reach for |
| --- | --- |
| Card sections | [card-template.md](card-template.md) |
| Hierarchy, collapse, suite layout, link bar | [REFERENCE.md](REFERENCE.md) when packaging or collapsing |
| Ambiguous fold vs breakout | `/grilling` (user invokes) — one question at a time |
| Missing substrate | `/portfolio-arcs-from-history` — do not invent spines |

Generic PM/UX case-study spines are the wrong shape for these cards. Prefer this
template over `/portfolio-case-study-writer` for eng highlights.

## Prerequisites

- Substrate present: `case-studies/` (or equivalent dense studies) + a skill map
- User names the **collection** (and suite, if multi-repo) to package this run
- Prefer one collection per session unless the user asks for a wider wave

## Success criteria

Done only when **all** hold:

1. Hierarchy matches [REFERENCE.md](REFERENCE.md): suite project (if in scope) →
   collection top → optional breakouts.
2. **Budget** held: suite ≤ 1 project card; child collection ≤ 3 cards.
3. Every card follows [card-template.md](card-template.md) (Skill → Stack → … → Substrate).
4. Case studies remain substrate — linked, not 1:1 rewritten into cards.
5. READMEs (suite + collection) arc index / skill map point at the new cards.
6. Relative markdown links under the packaged tree resolve; stale card paths gone.

## Process

### 1. Confirm substrate

Read the collection skill map and case studies. List candidate theses. If a thesis
lacks a spine or decisions in substrate, flag it — do not silent-pad from memory.

**Done when:** candidate thesis list is written; thin spots named to the user.

### 2. Lock shape

Propose: one **collection top** + which theses need **breakouts** vs stay
substrate-only. Hold the **budget**. If fold vs breakout is ambiguous, pause for
`/grilling` rather than guessing.

For multi-repo products, ensure the suite has exactly one **project** highlight
(create or refresh) at project altitude — child tops carry surface specificity.
Details: [REFERENCE.md](REFERENCE.md).

**Done when:** user-visible shape is locked (codes + filenames + absorb map).

### 3. Write highlights

Author/rewrite cards from [card-template.md](card-template.md). **Collapse**
superseded cards. Set **fences** and **Owned / Interfaced** so siblings don't
double-claim. Link **Substrate** to the studies that back each claim.

**Done when:** every card in the locked shape exists; deleted cards are gone;
each card's Substrate links resolve.

### 4. Indexes and links

Update suite and collection READMEs (arc index, skill map, cheat sheets). Grep
stale paths. Resolve-check relative links under the tree you touched.

**Done when:** success criteria #5–#6 hold.

### 5. Stop

Do not start the next collection unless asked. Offer a handoff only if another
wave is planned.

## Gotchas

- **Altitude leak** — suite cards that read like feature lists failed the fence;
  push specificity to child tops.
- **1:1 reflex** — matching card count to case-study count blows the **budget**;
  studies can outnumber cards.
- **Stack optionalism** — if removing Stack leaves a generic product story, the
  card is under-specified for an SWE screen.
- **Double-claim** — the same kill-switch or durability win on two cards without
  an Owned/Interfaced fence confuses interviewers; pick one owner.
- **Thin substrate** — packaging cannot invent MR spines; send the user back to
  history mining.
- **Collapse without grill** — when two breakouts both feel load-bearing, grill
  before deleting; silent merges hide the wrong screen.
