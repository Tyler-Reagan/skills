# Doc Taxonomy Cleanup — Reference

The default taxonomy, promotion-transition table, verdict vocabulary, and table format spec. Read in Phases 0–2 of [SKILL.md](SKILL.md).

## Default 8-slot taxonomy

These are **defaults**. Phase 0 maps them to the repo's existing conventions via [taxonomy-catalog.md](taxonomy-catalog.md). If the repo already uses `docs/adr/`, bind `decisions/` → `docs/adr/` and don't rename.

| # | Slot | Holds | Poison risk |
|---|---|---|---|
| 1 | `docs/plans/` | In-progress design plans | medium (claims are in-flight) |
| 2 | `docs/plans/archive/` | Stale/dropped/superseded plans, verbatim moves | low (explicitly historical) |
| 3 | `docs/decisions/` | Foundational decisions still reflected in code | **high** (presumed current) |
| 4 | `docs/decisions/archive/` | Abandoned decisions whose *rationale-for-not-doing-it* is itself load-bearing (deliberately small — likely-re-proposed approaches like CRIU/ECS-removal-style) | low |
| 5 | `docs/architecture.md` | Top-level single file, current-state system reference; decompose only when a section warrants | **high** |
| 6 | `docs/troubleshooting.md` | Top-level single file, operational guide; evolves as old issues collapse under fixes | **high** |
| 7 | Top-level setup docs (`cursor-setup.md`, `claude-setup.md`, `deployment.md`) | User-facing setup; only group into `docs/setup/` if volume justifies it | medium |
| 8 | Per-directory `README.md` | Local orientation for `docs/`, `plans/`, `decisions/`, plus any subdir whose substantive content survives cleanup | **high if present** (orientation lies are toxic) |

**Single-file discipline** applies to slots 5 and 6: stay single until decomposition is warranted by section weight, not by anticipated growth.

## Verdict vocabulary

| Verdict | Action |
|---|---|
| `KEEP` | Leave in current location, possibly edit-in-place tightening |
| `MOVE` | Same content, different location (e.g. reorganize to a subdir) |
| `PROMOTE` | Rewrite into `decisions/` in code-grounded form; delete original |
| `ARCHIVE` | `git mv` to `plans/archive/` or `decisions/archive/`, verbatim |
| `DELETE` | One-shot complete; commit history is the artifact |
| `DISTILL` | Extract the generalizable kernel into `troubleshooting.md` or `architecture.md`; delete original |
| `SPLIT` | Doc has both decision content and operational content → split into `decisions/` and `troubleshooting.md` |
| `?` (needs investigation) | Reviewer call required — surface in the "Needs investigation" section |

## Promotion transitions

| Transition | Trigger |
|---|---|
| `plans/` → `decisions/` (PROMOTE) | Shipped + load-bearing for understanding current code |
| `plans/` → `plans/archive/` (ARCHIVE) | Stale/dropped/superseded but worth preserving as historical artifact |
| `plans/` → *(DELETE)* | One-shot complete (deploy checklist, migration runbook); commit history is the artifact |
| `decisions/` → *(DELETE)* | Fully superseded; the replacement decision-record carries forward any continuity needed |
| `decisions/` → `decisions/archive/` (ARCHIVE) | Abandoned approach where the rationale-for-not-doing-it is itself load-bearing (likely re-proposal) |
| postmortem → `troubleshooting.md` (DISTILL) | Recurring pattern still relevant; highly selective; original deleted after distillation |
| anywhere → `architecture.md` (DISTILL) | Current-state high-level content; highly selective; original archived or deleted |
| anywhere → `troubleshooting.md` (DISTILL) | Operational content; highly selective; original archived or deleted |
| both-frames doc → split (SPLIT) | Decision content + operational content in one doc → split into `decisions/` and `troubleshooting.md` |
| any (PROMOTE) | The new decision record is a rewrite, not a preservation — original deleted as part of the promotion |

## Edit-in-place vs delete-+-rewrite default

| Situation | Default action |
|---|---|
| Same-slot iteration (`plans/`, `decisions/`, `architecture.md`, `troubleshooting.md` getting better in place) | **edit in place** |
| Slot transition or frame change (`plans/` → `decisions/`) | **delete + rewrite** |
| Retirement with no successor doc | **delete** |
| Retirement with successor doc already existing | **delete; the successor handles continuity** |
| Move with no content change (anywhere → `archive/`) | **`git mv`** (verbatim, not an edit) |

The honest test: if the old artifact has nothing to *evolve into* — it's being retired or replaced by a structurally different artifact — it's delete + rewrite. If the artifact persists and is just getting better, it's edit in place.

## Table format (Phase 2 output)

Grouped by verdict, with verification flags on HIGH-risk verdicts and a verification summary at the bottom:

```
### DELETE (one-shot complete, commit history is the artifact)
| Path | Age | Why |
|---|---|---|

### ARCHIVE → plans/archive/ (verbatim git mv)
| Path | Age | Why |
|---|---|---|

### PROMOTE → decisions/ (code-grounded rewrite)
| Path | Age | Code anchor | Verified? | Why |
|---|---|---|---|---|

### DISTILL → architecture.md or troubleshooting.md
| Path | Destination | Verified? | Why |
|---|---|---|---|

### KEEP IN PLACE
| Path | Why |
|---|---|

### MOVE / SPLIT
| Path | New location(s) | Why |
|---|---|---|

### NEEDS INVESTIGATION
| Path | Question |
|---|---|

---
Verification summary: M of N HIGH-risk verdicts code-anchored.
Unverified (offer to dig deeper):
- [path] — [why not verified]
```

**HIGH-risk verdicts** that require code-anchor verification: `PROMOTE`, `DISTILL` to `architecture.md` or `troubleshooting.md`.

**LOW-risk verdicts** that do not: `ARCHIVE`, `DELETE`, `KEEP`, `MOVE`.

The verification summary is honesty about coverage, not a quality grade. Some verdicts genuinely don't need verification — the summary tells the reviewer what to focus their cycles on if they want to dig further.
