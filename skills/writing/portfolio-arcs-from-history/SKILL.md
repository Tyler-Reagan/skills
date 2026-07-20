---
name: portfolio-arcs-from-history
description: >
  Mine live repos and git/GitLab history into personal portfolio substrate —
  skill theses, dense case studies, and a skill-map README. Stops before
  interview highlight cards. Personal only.
disable-model-invocation: true
---

# Portfolio Arcs from History

Turn **code + history** into **substrate** for a personal eng portfolio. Teaching
pages and ADRs are optional shelves. Stop when substrate is honest and indexed —
do **not** write interview highlight cards here (`/portfolio-swe-highlights`).

**Personal only** — not a coworker deliverable. Redact tenants, secrets, customer
buckets, and credential material.

If the target suite/collection **already has** cards and case studies, prefer
`/portfolio-arcs-maintain` unless this is a greenfield surface or maintain
cleared the novelty bar.

## Leading words

| Word | Means here |
| --- | --- |
| **Skill thesis** | Transferable SWE capability a stranger recognizes — the arc title, not an epic name |
| **Unbiased search** | Pull merged evidence before proposing themes; no pre-seeded epic list |
| **Substrate** | Dense case studies + skill-map README that back claims; not interview cards |
| **Shelf** | Supporting truth surface (Taught page, ADR, design doc) — evidence, not outline |
| **Agency** | What *you* decided or drove — volume of commits ≠ an arc |

## Compose

| Need | Reach for |
| --- | --- |
| Case-study shape | [case-study.md](case-study.md) |
| Naming / merge / defer prompts | [landscape-skills.md](landscape-skills.md) when theses feel stuck |
| Cross-session continue | [handoff-template.md](handoff-template.md) via `/handoff` |
| Interview cards after substrate | `/portfolio-swe-highlights` (user invokes — this skill cannot fire it) |
| Optional coworker truth surface | Existing Taught pages / `CONTEXT-MAP.md` if present — do not re-run teaching spine |

## Prerequisites

Ask up front if unknown:

1. **Source repo(s)** (absolute paths or remotes) and GitLab/GitHub username for “my” history
2. **Output directory** outside the employer repo (prefer a personal workspace)
3. Themes to force-include / force-exclude
4. Whether sibling repos already have arcs (bridge/consume OK; do not retell their internals)

## Success criteria

Done only when **all** hold:

1. **Unbiased search** ran — evidence pulled before any theme proposal.
2. A **skill map** exists (README table): skill thesis → substrate files → evidence handles (MRs/issues) → optional shelves.
3. One [case-study.md](case-study.md) per keepable thesis (or explicit merge note when clusters share one thesis).
4. Each study shows **judgment** (constraint + decision + trade-off), not a commit laundry list.
5. Outcomes are qualitative unless a real metric exists — never invent numbers.
6. No interview `cards/` authored in this run (unless the user explicitly waived the split).

## Process

### 1. Intake

Confirm source repos, output dir, username, include/exclude. Note optional shelves
(Taught pages, `docs/adr/`) without requiring them.

**Done when:** working agreements are explicit; output path exists or is creatable.

### 2. Unbiased search

Pull the user’s merged MRs, issues, and meaningful commits across the agency window.
Cluster into natural work programs only as a scaffold — then ask of each cluster:
*which skill thesis does this exemplify?*

Drop or `deferred/` what is crafty but not differentiating (pure docs taxonomies,
renames, cleanup) unless the user wants that meta skill on the portfolio.

**Done when:** every keepable cluster has a draft skill thesis sentence; deferred
items are listed, not silently omitted.

### 3. Name and fence

Title each keepable arc by **skill thesis**. Merge clusters that are one
user-visible skill. Fence against sibling repos: this surface’s exemplars only;
bridge/consume links OK.

Load [landscape-skills.md](landscape-skills.md) only if naming stalls.

**Done when:** thesis list is stable and non-overlapping enough to write substrate.

### 4. Write substrate

For each keepable thesis, write a case study using [case-study.md](case-study.md).
Lead with the skill thesis. Prefer exemplar **spines** (MR sequences) over backlog
walks. Record stack and agency in eng language.

**Done when:** every keepable thesis has a case study file; each cites concrete
evidence handles the user can reopen.

### 5. Skill-map README

Write a collection README: intent, skill map table, how to use, source map
(repos + agency window). Point forward to `/portfolio-swe-highlights` for cards.

**Done when:** a stranger could find thesis → study → evidence without this chat.

### 6. Stop

Hand off packaging. If another session will continue mining a sibling repo, fill
[handoff-template.md](handoff-template.md).

**Done when:** user knows substrate is ready for highlights (or deferred work is named).

## Gotchas

- **History supplies agency; shelves supply system truth.** A Taught page without
  your MRs is not your story. Your MRs without a thesis are a changelog.
- **Count follows theses the evidence can honestly support** — not “always N arcs.”
- **Epic names are sediment.** Rename until a hiring manager recognizes the skill.
- **Sibling retell** — if compute isolation (or any deep subsystem) already has
  arcs elsewhere, link the bridge; do not duplicate that repo’s spine here.
- **Employer sensitivity** — redact tenants, thread dumps, customer bucket names,
  and credential paths before writing outside the company repo.
- **Do not package early.** Interview card budget and SWE highlight shape belong
  to `/portfolio-swe-highlights`. Writing cards here recreates 1:1 card↔study sprawl.
