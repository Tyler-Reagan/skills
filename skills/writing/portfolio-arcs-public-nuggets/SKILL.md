---
name: portfolio-arcs-public-nuggets
description: >
  Distill internal portfolio arcs into public-safe nuggets under
  public-portfolio-nuggets/ — compact recruiter-facing product stories, not 1:1
  card mirrors. Explicit create vs update. Personal only.
disable-model-invocation: true
---

# Portfolio Arcs Public Nuggets

Turn **internal** suite/collection arcs into end-goal **nuggets**: public-safe,
highly constrained distillations for later formatting on a personal site.
Does **not** build site components, resume links, or UI.

Personal only. Employer name OK; strip paths, MR ids, tenants, credentials, and
org-only codenames.

## Leading words

| Word | Means here |
| --- | --- |
| **Nugget** | One public product-story file — highlight reel altitude, not an internal card |
| **Create** | No nugget yet for that story → propose → confirm → write new file |
| **Update** | Nugget exists → rewrite that file from current internal source; no sibling mint |
| **Product story** | Coherent interview opening (suite, or a distinct child screen like chat vs compute) |
| **Texture** | `stack:` list only — thesis lives in prose, not Owned/Interfaced tables |

## Compose

| Need | Reach for |
| --- | --- |
| File shape | [nugget-template.md](nugget-template.md) |
| Grain, redact, create vs update | [REFERENCE.md](REFERENCE.md) |
| Internal still thin / unpackaged | Stop — need `/portfolio-swe-highlights` first (user invokes) |
| Routine MR absorb | `/portfolio-arcs-maintain` — this skill does not run as its side effect |

## Prerequisites

- Portfolio repo with `internal/` arcs and (or create) `public-portfolio-nuggets/`
- User names **intake path** (suite or collection under `internal/`)
- User names **op**: **create**, **update**, or **propose** (default: propose then branch)

## Success criteria

Done only when **all** hold:

1. Op is explicit: every written file is labeled **create** or **update**.
2. Nugget count follows **product stories**, not internal card count (not 1:1).
3. Every file matches [nugget-template.md](nugget-template.md) and the hard body budget.
4. Redact bar in [REFERENCE.md](REFERENCE.md) holds — grep-able leftovers named and fixed.
5. `source` in frontmatter points at the internal path used; flat files only under
   `public-portfolio-nuggets/`.
6. No site/component/resume-anchor fields invented.

## Process

### 1. Intake and op

Confirm portfolio root, intake path, and op:

- **create** — minting new nugget(s) for stories with no public file
- **update** — refreshing named existing nugget id(s) (or all whose `source` is under intake)
- **propose** — list product stories + create/update disposition; wait for confirm

**Done when:** op and intake path are explicit.

### 2. Propose product stories

Read suite/collection README + highlight cards (not every case study unless thin).
Propose 1 nugget per coherent product story. Distinct child screens (e.g. agent
chat vs isolated compute) may each earn a nugget; same story does not get a
second for “more detail.”

Map each proposal to **create** or **update** by checking
`public-portfolio-nuggets/*.md` ids / `source` fields.

**Done when:** proposal table exists (id · story · create|update · source); user
confirmed (unless they pre-declared exact ids).

### 3. Write nuggets

For each confirmed row, fill [nugget-template.md](nugget-template.md).

- **Create:** write `public-portfolio-nuggets/{id}.md` only if absent.
- **Update:** overwrite the existing file only; do not add siblings in an update op.

Apply redact rules. Stack = texture list. No Spine, no MR numbers, no resume fields.

**Done when:** every confirmed row has a file; creates did not clobber; updates
did not mint extras.

### 4. Redact check

Grep the written files (and optionally the directory) for forbidden patterns in
[REFERENCE.md](REFERENCE.md). Fix hits.

**Done when:** redact bar clean for files touched this run.

### 5. Stop

Do not start another suite unless asked. Summarize create vs update counts.

## Gotchas

- **Sanitize-mirror reflex** — copying internal card trees into public reintroduces
  1:1 sprawl; nuggets are a reel, not a mirror.
- **Update that creates** — “while we’re here, add a second nugget” is a **create**
  proposal, not part of update; split the op.
- **Changelog in public** — if it needs a Spine, it stays internal.
- **Stack as thesis** — Owned/Interfaced tables belong on internal highlights;
  public thesis prose carries the skill.
- **Maintain bleed** — absorbing MRs must not silently rewrite nuggets; user
  re-invokes this skill to **update**.
