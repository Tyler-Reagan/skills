---
name: audit-memories
description: Audits a project's Claude Code memory files — classifies each entry keep/prune/merge/fix, verifies project and reference claims against the live repo, finds redundancy and dangling [[links]], and proposes a review-first consolidation plan before changing anything. Use when the user says "audit my memories", "clean up memory", "prune stale memories", "consolidate memories", "are my memories stale", or wants memory hygiene over the ~/.claude memory files.
license: MIT
metadata:
  author: uraniborglabs@gmail.com
  version: "1.1.0"
  domain: developer-workflow
  triggers: audit memories, audit my memories, clean up memory, prune memories, prune stale memories, consolidate memories, memory hygiene, are my memories stale
  role: diagnostic
  scope: troubleshooting
  output-format: markdown
  related-skills: write-a-skill
---

# Audit Memories

Judge a project's memory files — keep, prune, merge, or fix each — backed by evidence from the live code, not vibes. Propose a plan; change nothing until the user approves.

## Scope

`/audit-memories` audits the current project (the cwd). Override with an argument:

- a project path → that project
- `all` → every project under `~/.claude/projects/*/memory/`

A project's memories live in `~/.claude/projects/<encoded-path>/memory/*.md` with a `MEMORY.md` index (encoded path = the repo's absolute path with `/` and `.` turned into `-`). For the current project the repo to verify against is just the cwd; for others, decode it or read the path from the memories themselves.

## What a memory is

Each `*.md` (except `MEMORY.md`) has frontmatter — `name:` (kebab slug), `description:`, `metadata.type:` ∈ `user | feedback | project | reference` — and a body. Entries cross-link with `[[name-slug]]`. Files are often snake_case while slugs are kebab, so links resolve by `name:`, not by filename.

## Step 1 — Classify

Read every entry fully. Assign exactly one verdict, each with evidence:

- **KEEP** — accurate, still worth holding.
- **PRUNE** — stale, wrong, or repo-derivable. Cite the missing file/symbol/flag, the shipped/abandoned status, or what duplicates it. Default to KEEP when evidence is thin.
- **MERGE** — combine with named siblings (give the cluster).
- **FIX** — fact is fine, metadata is wrong: wrong `type`, weak `description`, dangling `[[links]]`, relative dates that should be absolute.

## Step 2 — Verify against the repo (type-aware)

- **feedback / user** — durable preferences and identity. Do NOT prune for age alone.
- **project** — ongoing work. Grep the repo for the files/symbols it names; check `git log` for whether the work shipped or was abandoned. Cite what you checked.
- **reference** — pointers. Confirm the target (doc, dashboard, ticket) still exists and still says what's claimed.

## Step 3 — Cross-checks

- **Merge clusters** — group entries covering one topic; name the consolidated entry and the facts that must survive (lossless).
- **Links** — collect every `name:` slug; flag `[[links]]` with no matching slug (allow snake/kebab drift). Links don't cross projects.
- **Index** — flag `MEMORY.md` lines pointing at missing files, and entry files absent from the index.

## Step 4 — Report, then apply on approval

Present the plan: one row per entry (`file — type — verdict — confidence — reason/evidence`), the merge clusters, and the link/index fixes. Then **STOP for explicit approval.**

On approval, apply:

- **Prune** → move the file to the macOS Trash (`~/.Trash`), never `rm`; then delete its `MEMORY.md` index line.
- **Merge** → write the consolidated entry with zero fact loss, Trash the merged-away files, update the index and any inbound `[[links]]`.
- **Fix** → edit in place.

## Gotchas

**Filename is snake_case but the `name:` slug is kebab-case.** Links resolve by `name:` field, not by filename. `user_role.md` with `name: user-role` is correct. Don't flag a link as dangling just because the filename doesn't match — check the `name:` field first.

**`MEMORY.md` index points to files deleted with `rm` rather than Trashed.** The index will have orphaned lines with no corresponding file. These are FIX verdicts on the index, not PRUNE verdicts — the memory may not actually exist anymore.

**Reference memory points to an auth-gated target (dashboard, internal ticket, Slack thread).** Can't verify externally. Default to KEEP with a note: "target requires auth — could not verify, treating as intact."

**`all` scope includes encoded paths that don't resolve to directories.** Some projects may have been deleted or moved. Skip unresolvable paths silently and report which ones were skipped at the end of the audit.

**Merging loses a nuance that appeared trivial.** Consolidation must be lossless. If two entries cover the same topic but with different `type:` values (e.g., one is `feedback`, one is `project`), either keep them separate or surface the conflict rather than silently picking one type.

## Anti-patterns

**DO NOT** delete or overwrite a memory before the user approves the plan — this is review-first.

**DO NOT** `rm` a memory — move it to the Trash so it stays recoverable.

**DO NOT** prune a feedback or user memory for being old — those don't decay with time.

**DO NOT** flag a memory stale on a hunch — cite the missing symbol, the shipping commit, or the duplicate. Thin evidence → KEEP.

**DO NOT** drop facts when merging — consolidation is lossless or it isn't done.
