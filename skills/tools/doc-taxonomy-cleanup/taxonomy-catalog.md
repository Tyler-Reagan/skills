# Taxonomy Catalog — convention menu

Map the repo's existing doc conventions to the default 8-slot taxonomy in [REFERENCE.md](REFERENCE.md). **Conventions the repo already uses take precedence over defaults.** Adding a new convention encountered in the wild is a catalog edit, not a new principle in SKILL.md.

## Detection signals (Phase 0)

Run these checks before proposing a binding:

- `ls docs/ docs/decisions docs/adr docs/rfc docs/plans docs/proposals docs/runbooks docs/troubleshooting docs/postmortems 2>/dev/null` — what's already there
- `find . -maxdepth 4 -name 'adr-*.md' -o -name 'ADR-*.md' -o -name '0001-*.md'` — ADR-style numbered filenames
- `find . -maxdepth 4 -name 'rfc-*.md' -o -name 'RFC-*.md'` — RFC-style
- `find . -maxdepth 4 -name 'architecture.md' -o -name 'ARCHITECTURE.md' -o -name 'CONTEXT.md'` — current-state references
- `find . -maxdepth 4 -name 'CHANGELOG.md' -o -name 'HISTORY.md'` — versioned history docs (these are usually load-bearing on their own terms — leave alone)
- The top-level `README.md` — sometimes the de-facto architecture doc

## Convention catalog

### ADR (Architecture Decision Records)

**Detection:** `docs/adr/` directory; filenames like `0001-record-architecture-decisions.md` or `adr-001-*.md`; the canonical Michael Nygard short-form template (Context / Decision / Status / Consequences).

**Maps to:** slot 3 (`decisions/`) and slot 4 (`decisions/archive/`).

**Format used in rewrites:** ADR short form, not the bundled decision-record template. Sections: Title, Status (Proposed/Accepted/Deprecated/Superseded), Context, Decision, Consequences. Add a "References" section for current-tree file paths.

**Status conventions:** ADRs track Status explicitly and that's load-bearing — `Superseded by ADR-NNNN` is the canonical archival marker, not a `git mv`. **In an ADR repo, you do not move superseded ADRs to `archive/`.** Mark them `Superseded` and leave them where they live; their numeric ID continues to be referenced.

### MADR (Markdown Any Decision Records)

**Detection:** `docs/decisions/` or `docs/adr/` with MADR template (Context and Problem Statement / Decision Drivers / Considered Options / Decision Outcome / Pros and Cons of the Options).

**Maps to:** slot 3 and slot 4.

**Format used in rewrites:** MADR template. The "Considered Options" section is where MADR distinguishes itself — preserve it on rewrites; do not collapse alternatives into a single Decision-record table the way the bundled template does.

### RFC (Request for Comments)

**Detection:** `docs/rfc/` or `rfcs/` directory; filenames like `rfc-001-*.md` or numbered drafts.

**Maps to:** slot 1 (`plans/`) when the RFC is in-progress; slot 3 (`decisions/`) when accepted; slot 2 (`plans/archive/`) when rejected.

**Format used in rewrites:** RFC structure (Summary / Motivation / Detailed Design / Drawbacks / Alternatives / Unresolved Questions). RFCs often have explicit lifecycle states — respect them.

### `docs/decisions/` (generic, no enforced template)

**Detection:** `docs/decisions/` with no enforced template; varied document shapes.

**Maps to:** slot 3 directly; the *default* taxonomy slot binds here.

**Format used in rewrites:** [decision-record-template.md](decision-record-template.md) — the bundled decision-record skeleton.

### `docs/plans/`

**Detection:** `docs/plans/` directory with forward-looking design docs.

**Maps to:** slot 1 directly.

**Convention:** the directory listing is the index — no enumerated tracker file. Each plan states its own status near the top. Stale plans move to `plans/archive/`.

### `docs/proposals/`

**Detection:** `docs/proposals/`.

**Maps to:** slot 1 (`plans/`) — same intent, different name. **Do not rename** if `proposals/` is the established convention; bind `plans/` → `proposals/` in the skill's mental model.

### `docs/runbooks/` or `docs/troubleshooting/`

**Detection:** either directory exists with operational content.

**Maps to:** slot 6 (`troubleshooting.md`). **Single-file discipline applies** — if the existing directory has a small number of files, consider collapsing into a single `troubleshooting.md`. If the existing surface is already decomposed by section and load-bearing in that shape (many files, each substantial), leave as-is and bind slot 6 to the directory rather than a single file.

### `docs/postmortems/`

**Detection:** directory with dated incident records (e.g. `2026-06-02-sandbox-kernel-oom.md`).

**Maps to:** does not persist long-term. Distill recurring patterns into slot 6; delete the directory once empty. **Exception:** if the repo has a documented postmortem policy (e.g. compliance, audit trail), respect that — the directory may need to persist for reasons orthogonal to context-poisoning.

### `CONTEXT.md` / `ARCHITECTURE.md` / `docs/architecture.md`

**Detection:** any of these at top level or under `docs/`.

**Maps to:** slot 5. Use the existing filename — do not rename `CONTEXT.md` to `architecture.md` if the repo's convention is `CONTEXT.md`.

### `docs/design/` or `docs/specs/`

**Detection:** directory with design-spec documents that may be either current-state or historical.

**Maps to:** ambiguous — triage individual docs:
- Current-state, load-bearing for understanding code → slot 5 (or PROMOTE to `decisions/` if a decision-record framing fits)
- Historical, shipped → slot 3 or slot 4
- Stale, dropped → slot 2

### No central docs directory

**Detection:** docs scattered across top-level `*.md`, per-package `README.md`, no `docs/`.

**Maps to:** establish `docs/` only if doc volume justifies it. For small repos, a top-level `ARCHITECTURE.md` + `TROUBLESHOOTING.md` + per-package `README.md` may be sufficient and the cleanup may not require establishing the full taxonomy at all.

## Phase 0 output

After detection, present a proposed binding for user negotiation. The shape of the output (synthetic example below):

```
Detected conventions in this repo:
- docs/<existing-dir>/ (N files)
- docs/<another-existing-dir>/ (N files)
- Top-level docs/*.md (N loose files)
- Per-package READMEs: <count>

Proposed binding (default taxonomy adapted):
- Slot 1 (plans/) → docs/plans/ (status: exists / to-be-created)
- Slot 2 (plans/archive/) → docs/plans/archive/ (status)
- Slot 3 (decisions/) → docs/decisions/ (status)
- Slot 4 (decisions/archive/) → docs/decisions/archive/ (deferred until needed)
- Slot 5 (architecture.md) → top-level docs/architecture.md (status)
- Slot 6 (troubleshooting.md) → top-level docs/troubleshooting.md (status)
- Slot 7 (setup) → top-level (no change / to be grouped)
- Slot 8 (READMEs) → docs/, plans/, decisions/ (initial set)

Pre-triaged buckets (e.g. an existing docs/stale/ directory): note pending bulk handling.
```

Negotiate with the user before binding. If the user has reasons to deviate (e.g. an established ADR repo elsewhere shares conventions with this one), follow their direction over the catalog defaults.
