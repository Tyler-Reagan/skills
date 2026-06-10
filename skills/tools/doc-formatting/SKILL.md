---
name: doc-formatting
description: Formats a documentation file to its type's contract — architecture (state-of-code, present-tense, diagram-led, code-verified citations), decision (transcript-of-truth record, dated, append-mostly), or plan (active work doc, status-dated, verification-anchored). Use when the user says "format this doc", "apply doc conventions", "make this read like an architecture doc", "harden this decision record", "normalize this plan", "doc-level hardening", or has just placed docs via a taxonomy cleanup and wants their contents brought up to standard.
license: MIT
metadata:
  author: uraniborglabs@gmail.com
  version: "1.0.0"
  domain: developer-workflow
  triggers: format this doc, apply doc conventions, architecture doc style, decision record format, normalize this plan, doc-level hardening
  role: formatting
  scope: documentation
  output-format: markdown
  related-skills: doc-taxonomy-cleanup, pretty-mermaid, mermaid-diagrams
---

# Doc Formatting

Format an existing documentation file to the contract of its **type**. v1 supports three types: **architecture**, **decision**, **plan**. Sister skill to `doc-taxonomy-cleanup` — that skill decides *where* a doc lives; this one decides *what it looks like* once it's there. Neither requires the other.

## Workflow

1. **Identify the type.** From the user's words, the doc's directory slot, or its shape — in that order. If genuinely ambiguous, ask; a doc formatted to the wrong contract is worse than unformatted.
2. **Load the type spec** from `types/<type>.md` — the contract, section order, style rules, and a review checklist. Read only the spec for the type at hand.
3. **Reformat, don't re-decide.** Formatting changes structure, register, and presentation — it does not change verdicts, move files, or alter substance. If the content reveals the doc is in the wrong slot or telling lies, surface that and stop; re-triage is the sister skill's job.
4. **Verify what the contract demands.** Architecture docs: grep every cited path/symbol in the current tree. Decision/plan docs: verify only what the edit touches.
5. **Validate and finish.** Render every mermaid block through a strict renderer (the `pretty-mermaid` skill if available, else `mermaid.live`-grade strictness by hand-check); run the repo's markdown formatter (prettier or equivalent) as the **last** step.

## Type contracts at a glance

| Type | Kind of truth | Tense | Status line | Diagrams | Full spec |
|---|---|---|---|---|---|
| architecture | state of code | present, no chronology | **forbidden** (a status line on a state doc is a smell) | `## How it works` centerpiece; elsewhere discretionary | [types/architecture.md](types/architecture.md) |
| decision | transcript of truth | past + dated | required (`✅/🟡` + date) | optional; only for the decided shape | [types/decision.md](types/decision.md) |
| plan | active work | future/imperative | required, refreshed per commit | encouraged for proposed flows | [types/plan.md](types/plan.md) |

Skeletons to copy from: [assets/](assets/) (one template per type).

## Gotchas

**Stock mermaid is stricter than your renderer.** Semicolons inside message text act as statement terminators; `{}` and `[]` inside participant aliases break parsing. A diagram that renders in a lenient tool can still break on the doc host. Validate every block through a strict renderer before committing.

**The formatter fights you mid-edit.** Prettier (and kin) rewrites table alignment and emphasis markers (`*` → `_`). Run it once at the end, not between edits — otherwise your Edit old_strings stop matching.

**Bullets are the house register; prose paragraphs are the exception.** If a paragraph exceeds ~2 sentences, it is either a diagram's clarifying note (move it under the diagram), a list (break it), or padding (cut it). A sentence left hanging after a table is a bullet that hasn't been marked yet.

**Sub-bullets over comma trains — taller beats wider.** Grammatical signals that a bullet is carrying a list: an itemized series, two-or-more semicolon-joined phrases, a colon-introduced enumeration, an em-dash whose appendage itself contains a list, or a parenthetical pile-up (each item dragging its own pointer/gloss/qualifier). Split into sub-bullets when the fragments are separable **and** at least one holds: ≥3 fragments, any fragment carries its own pointer/parenthetical/qualifier, or the line wraps past ~1.5 rendered lines. Below the threshold, stay inline — a single em-dash clarifier or one semicolon joining two short clauses is healthy rhythm, not a list. Agent discretion stands throughout.

**Abbreviations get glossed; jargon gets replaced.** Any acronym/initialism/code gets a parenthetical definition at first prose use — definitions compound in value — *unless* it is instantly recognizable or a definition adds nothing (agent discretion; don't treat any example list as authoritative). Jargon words are different: prefer replacing them with a familiar word; only when the jargon is load-bearing for the doc — or is the system's own established vocabulary across code and sibling docs — keep it (and define it if imported, not if native). Diagram labels stay tight: when a term first appears inside a diagram, the gloss lands at its first prose use, not in the label.

**Type is determined by content shape, not filename.** A file in `plans/` whose every phase is checked off is a decision record or architecture doc wearing a plan's clothes — surface it, don't silently reformat it to a contract it no longer matches.

**Cross-doc pointer blocks are one level deep.** An architecture doc points to its decision record and archived source plan; it does not chain through them to further docs.

## Anti-patterns

**DO NOT** change substance while formatting — no new claims, no dropped constraints, no verdict changes.

**DO NOT** add a Status line to an architecture doc, or chronology ("previously", "as of phase 2") to its body.

**DO NOT** leave a cited file/symbol unverified in an architecture doc — every pointer is grepped in the current tree.

**DO NOT** move files between directories — that is `doc-taxonomy-cleanup`'s job.

**DO NOT** embed repo-specific examples into this skill when updating it — keep examples synthetic.
