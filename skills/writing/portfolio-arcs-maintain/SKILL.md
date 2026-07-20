---
name: portfolio-arcs-maintain
description: >
  Keep personal portfolio arcs current as new work lands — absorb into existing
  theses by default; mint novel substrate or highlights only when the novelty bar
  clears. Personal only.
disable-model-invocation: true
---

# Portfolio Arcs Maintain

**Update-in-place** is the default. New MRs extend spines, Shipped, Outcome, and
substrate — they do **not** mint new cards or case studies unless the **novelty
bar** clears.

Personal only. Redact tenants, secrets, customer buckets, credentials.

This skill assumes arcs already exist under the user’s portfolio workspace (see
that repo’s root README). For greenfield surfaces, stop and tell the user to run
`/portfolio-arcs-from-history` then `/portfolio-swe-highlights`.

## Leading words

| Word | Means here |
| --- | --- |
| **Absorb** | Map new evidence onto an existing Skill line (card + linked studies) |
| **Update-in-place** | Edit those files; preserve **budget**, codes, and fences |
| **Novelty bar** | Clears only when no existing thesis can hold the work without drowning altitude or breaking a fence |
| **Budget** | Suite = 1 project card; child collection ≤ 3 highlights — maintain must not inflate |
| **Spine** | Exemplar MR sequence — append/trim proof; do not turn into a backlog |

## Compose

| Need | Reach for |
| --- | --- |
| Absorb vs novel decision table | [REFERENCE.md](REFERENCE.md) |
| Highlight section shape when patching cards | `~/.claude/skills/portfolio-swe-highlights/card-template.md` |
| Ambiguous absorb target | `/grilling` (user invokes) |
| Novelty bar cleared | User runs `/portfolio-arcs-from-history` then `/portfolio-swe-highlights` — this skill cannot fire them |
| Card budget / hierarchy rules | `~/.claude/skills/portfolio-swe-highlights/REFERENCE.md` |

## Prerequisites

- User names the **intake** (MR/issue list, date window, or “what shipped since X”)
- User names the **suite or collection** to maintain (path under the portfolio repo)
- Existing `cards/` + skill-map README for that surface (else redirect to authoring)

## Success criteria

Done only when **all** hold:

1. Every intake item has a disposition: **absorb** / **deferred** / **omit** / **novel**.
2. **Absorb gate** recorded for any new file: which Skill line was tried, why it failed (or N/A if no new files).
3. **Budget** unchanged unless the user explicitly approved a collapse/reshape via highlights.
4. Updated cards/studies keep qualitative outcomes honest; no invented metrics.
5. Arc indexes / cross-links still resolve for paths touched.
6. Novel work was **not** authored here — only routed.

## Process

### 1. Intake

Collect what landed (MRs/issues/commits or user summary). Skim the target suite
and collection READMEs + each card’s **Skill** / **Fence** / **Spine**.

**Done when:** intake list is written; live Skill lines for the target are listed.

### 2. Absorb gate (every item)

For each intake item, answer: *Which existing Skill line absorbs this?*

Apply [REFERENCE.md](REFERENCE.md). Default to **absorb** or **deferred/omit**.
**Novel** only when the novelty bar clears — then stop authoring and route.

If two absorb targets both fit, pause for `/grilling` rather than double-claiming
or splitting a card.

**Done when:** every item has a disposition; any **novel** items are listed with
the failed absorb attempts (Skill lines tried).

### 3. Update-in-place

For **absorb** items only:

1. Patch the owning **highlight** — Spine (append exemplar proof), Shipped,
   Outcome, Stack/Owned if the fence truly moved. Keep altitude; do not grow a
   breakout into a second collection top.
2. Patch linked **substrate** case studies enough that the card’s claims stay backed.
3. If the suite story shifted (new climax, new child surface) but stays one
   project thesis: refresh the suite project card + suite README arc index —
   still one S-card.
4. **Deferred/omit** — note under `deferred/` or in the collection README; no new highlight.

Do not add `cards/` or `case-studies/` files in this step.

**Done when:** every absorb item is reflected in an existing file (or explicitly
skipped with reason); file count for cards/studies unchanged.

### 4. Link bar

Grep stale MR references only if you renumbered spines meaningfully. Resolve
relative links under paths you edited.

**Done when:** touched links resolve; budget still holds.

### 5. Route novelty (if any)

For items that cleared the novelty bar: tell the user to invoke
`/portfolio-arcs-from-history` (substrate) then `/portfolio-swe-highlights`
(package), scoped to that thesis — and to re-check **budget** before adding a
card.

**Done when:** novel items are handed off with suggested collection + why absorb failed.

## Gotchas

- **Changelog seduction** — every merged MR need not appear on a Spine; keep
  exemplar proof, not archival completeness.
- **Budget creep** — “just one more breakout” is how collections return to 1:1
  card↔study sprawl; absorb or deferred first.
- **Wrong altitude** — suite card updates that list features failed the fence;
  push into child tops.
- **Silent novel** — creating a case study “for substrate completeness” during
  maintain bypasses the novelty bar; substrate files are novel artifacts too.
- **Re-mine reflex** — full unbiased history search belongs to
  `/portfolio-arcs-from-history`; maintain starts from named intake + existing theses.
- **Double-claim** — the same win on two cards without an Owned/Interfaced change
  confuses interviewers; pick one absorb target.
- **Public reel** — do not edit `public-portfolio-nuggets/`; user re-invokes
  `/portfolio-arcs-public-nuggets` (**update**) when the reel should refresh.
