---
name: doc-taxonomy-cleanup
description: Cleans up a poisoned documentation tree by discovering the repo's actual doc surface, triaging every file into a plans / decisions / archive / delete taxonomy, rewriting promoted docs as code-grounded decision records, and distilling stale content into a single load-bearing troubleshooting.md. Adapts to whatever convention the repo already uses (ADR, MADR, RFC, decisions/) instead of imposing defaults. Use when the user says "clean up stale docs", "audit my docs", "prune docs", "doc cleanup", "stale documentation", "consolidate docs", "establish doc taxonomy", "differentiate plans from decisions", or "docs are poisoning context".
license: MIT
metadata:
  author: uraniborglabs@gmail.com
  version: "1.0.0"
  domain: developer-workflow
  triggers: clean up stale docs, audit my docs, prune docs, doc cleanup, stale documentation, consolidate docs, establish doc taxonomy, differentiate plans from decisions, docs poisoning context
  role: diagnostic
  scope: troubleshooting
  output-format: markdown
  related-skills: audit-memories, write-a-skill
---

# Doc Taxonomy Cleanup

Triage a poisoned documentation tree into a taxonomy that keeps load-bearing docs honest, archives the rest verbatim, and rewrites the survivors against the live code. Adapt to the repo's existing conventions; impose defaults only where nothing exists. Change nothing without per-chunk approval.

## Phases

**0. Discovery.** Survey the repo's actual doc surface — every `.md` outside `node_modules` / `vendor` / `.git` / language dep dirs, including top-level READMEs and per-package READMEs. Detect existing conventions (`docs/adr/`, `docs/decisions/`, `docs/plans/`, `docs/rfc/`, MADR). Propose a taxonomy binding adapted to the repo via [`taxonomy-catalog.md`](taxonomy-catalog.md) — the 8-slot default in [`REFERENCE.md`](REFERENCE.md) is a *default*, not a forced layout. User negotiates the binding before triage.

**1. Survey.** Cheap pass: path, last-touched commit date, originating commit, declared status (regex `Status:` line if present), size. **Do not read full contents.** Defer to Phase 2 on demand.

**2. Per-file draft (table).** Propose a verdict per file. HIGH-poison-risk verdicts (`PROMOTE`, `UPSERT`) get a code-anchor check — grep/read every cited path in the current tree. LOW-risk verdicts (`ARCHIVE` verbatim, `DELETE` one-shot) do not require verification. Present in the grouped Shape B format from [`REFERENCE.md`](REFERENCE.md#table-format). Surface verified-vs-unverified honestly; offer to dig deeper on the unverified.

**3. Iteration.** User flips verdicts, asks for clarification, marks rows for investigation. Loop until user says "locked".

**4. Plan in repo + plan mode.** Write the plan to `docs/plans/docs-cleanup.md` (adapted via Phase 0 binding). Include: taxonomy decisions, per-file actions, chunk breakdown, existing-vs-proposed mermaid diagram. Plan-mode refinement is the standard plan-mode behavior — not a separate phase.

**5. Execute per chunk.** Five-chunk default ordering, adjust if a chunk is empty:
1. Discovery outcomes — directories created, READMEs written (just `docs/`, `plans/`, `decisions/`)
2. Deletes + archives + `git mv`s — mechanical, verbatim moves
3. `decisions/` rewrites — code-grounded, one substantial rewrite per chunk if multiple
4. `architecture.md` + `troubleshooting.md` upserts — highly selective; apply the dilution test
5. Code-reference repointing across the repo

Each chunk pauses for user approval. Each completion gets a "what this enables" blurb (deploy-testable now vs. unlocked-by-later).

## Stop rules

- **No DELETE without explicit user sign-off** in the table-iteration phase. The skill never deletes unilaterally.
- **No `decisions/` rewrite without code grep.** Every path the rewrite cites is grepped/read in the current tree first. Sub-agent characterizations are not trusted as ground truth.
- **Archives are verbatim.** Moves into `archive/` are `git mv` only — no content changes. The archive is a faithful graveyard, not a curated one.
- **Dilution test before upsert.** Before appending to `architecture.md` or `troubleshooting.md`, ask "is this tight enough to live in a load-bearing doc, or does it dilute it?" If dilutive, archive the source instead.
- **Same-slot evolution → edit in place. Slot transition or frame change → delete + rewrite.** A plan promoted to a decision record is a rewrite, not an edit; editing in place tempts preservation of stale plan-form scaffolding.
- **Verification status disclosed.** Phase 2 output names which HIGH-risk rows got code-anchored and which did not.

## Companion files

- [`REFERENCE.md`](REFERENCE.md) — default 8-slot taxonomy, promotion-transition table, table format spec, verdict vocabulary. Read in Phases 0–2.
- [`taxonomy-catalog.md`](taxonomy-catalog.md) — menu of doc-taxonomy conventions seen in the wild (ADR, MADR, RFC, decisions/, plans/, proposals/, runbooks/) with mapping guidance. Read in Phase 0 to detect/respect existing conventions.
- [`decision-record-template.md`](decision-record-template.md) — the bundled decision-record skeleton as a copy-paste fallback. Used in Chunk 3 when the repo has no existing decision-record convention.
- [`worked-example.md`](worked-example.md) — synthetic anatomy of a successful cleanup. Reference for compression-ratio expectations, drift-fix categories, and what success looks like.

## Gotchas

**Status lines lie.** A `Status: Proposed` header from 8 months ago with no MR open is almost certainly shipped or dropped, not proposed. Triage by **origin commit + last-touched age + code presence**, not by what the doc says about itself. The doc's self-description is the *least* reliable signal in a stale tree.

**The "still in code" check is grepped, not characterized.** Read the actual file (or grep for the actual symbol) before encoding behavior in a decision-record rewrite. A sub-agent's summary of what a doc claims is not ground truth for whether those claims hold.

**Compression ratio is severe and that's correct.** Real cleanups commonly hit 80–95% reduction on `PROMOTE` rewrites — a 1,000-line plan compressing to a 50–100 line decision record is the norm, not the exception. If your rewrite isn't dramatically shorter than the plan it replaces, you're preserving plan-form scaffolding (phase plans, alternatives-considered, open-questions-from-planning) that doesn't belong in a decision record.

**Archives are graveyards, not curated content.** Resist the urge to tidy up archived docs as you move them. `git mv` verbatim. Editing archived content destroys the historical signal — the whole point of the archive is "this is what we said *then*."

**Postmortems are explicitly historical, not stale.** A dated incident record (`2026-06-02-sandbox-kernel-oom.md`) is load-bearing in a different way than a current-state doc. Don't treat them as candidates for `ARCHIVE` reflexively. Only `DISTILL` when a pattern recurs and a generalizable kernel can move into `troubleshooting.md`; otherwise leave alone, or delete clean if entirely subsumed.

**Don't impose the default taxonomy on repos with established conventions.** If the repo already uses `docs/adr/` for decisions, Phase 0 binds `decisions/` → `docs/adr/` via the catalog, and Chunk 3 rewrites use ADR/MADR format instead of the bundled template. The 8-slot default is a *default*, not a forced layout.

**Single-file discipline for `architecture.md` and `troubleshooting.md`.** These stay single files until a section grows heavy enough to warrant decomposition. The discipline is what keeps them load-bearing — splitting prematurely creates orientation problems and dilutes the "go here for current state" signal.

## Anti-patterns

**DO NOT** delete any doc before the user has explicitly approved that row in the Phase 2 table. Review-first applies to every destructive action.

**DO NOT** trust a doc's `Status:` line. Triage uses origin + age + code presence.

**DO NOT** rewrite a `decisions/` doc without first grepping every path it cites in the current tree.

**DO NOT** edit content as you move it to `archive/`. `git mv` verbatim.

**DO NOT** upsert into `architecture.md` or `troubleshooting.md` without applying the dilution test. Dilution kills load-bearing docs faster than absence does.

**DO NOT** assume the target repo has the default taxonomy. Discovery runs first.

**DO NOT** spawn sub-agents to read docs and then write rewrites from their summaries. Read the docs directly.

**DO NOT** introduce parallel structures (a new `notes/` alongside an existing `plans/`) when the existing slot can hold the content. Reuse what's already working.

**DO NOT** embed specific work-content (real project names, internal MR/PR/ticket IDs, real filenames from any specific repo, internal domain terminology) into this skill or its companion files when updating them. Skill content must remain repo-agnostic. Specific examples are over-fitting at best and policy violations at worst — keep examples synthetic and generic.
