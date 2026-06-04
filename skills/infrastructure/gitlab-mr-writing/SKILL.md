---
name: gitlab-mr-writing
description: Writes calibrated GitLab merge request descriptions and optional technical reviewer guides. Use when the user says "write my MR description", "draft the merge request body", "help me document this change", or asks for a technical reviewer summary — especially for architecture changes, cross-package refactors, or MRs that are too large to read linearly.
license: MIT
metadata:
  author: uraniborglabs@gmail.com
  version: "1.1.0"
  domain: developer-workflow
  triggers: MR description, merge request body, PR description, reviewer guide, technical summary, document this change
  role: specialist
  scope: documentation
  output-format: markdown
  related-skills: gitlab-ci-inspector, terraform-plan-summary
---

# GitLab MR Writing

## Calibrate scope before drafting

**Default to brief.** Most MRs are focused changes — they deserve a description that fits on one screen, not a reviewer guide. Reach for the verbose form only when the change is genuinely architectural.

| Class | Examples | Description target |
|---|---|---|
| **Focused** | Bug fix, single helper, one-component change, doc-only | ~20–30 lines. Motivation + headline changes + 1–2 references. No theme groups, no reviewer guide. |
| **Multi-theme** | New feature touching 2–3 packages, refactor with cleanup | ~50–80 lines. Theme groups useful here. No reviewer guide unless requested. |
| **Architectural** | Cross-package convergence, new service, multi-week deep change | Full structure — opening framing, theme groups, optional Technical Reviewer Guide. |

When the user gives an explicit constraint ("keep under 25 lines", "brief"), that override is authoritative. Do not pad to fill structure.

For Focused MRs: drop the full structure below — a one-paragraph motivation, 3–5 bullet headline changes, and 1–2 references is sufficient.

## Step 1 — Establish the delta baseline

Before drafting, determine the diff scope:

```
merge-base(origin/main, HEAD)..HEAD
```

Run the diff summary script from the repo root. Locate the script in the `scripts/` directory of this skill's install path:

```bash
# Discover the skill path, then run from the repo root
find ~/.claude ~/.cursor -name "extract-diff-summary.py" 2>/dev/null | head -1 | xargs python

# With options
python <path>/scripts/extract-diff-summary.py --base origin/main
python <path>/scripts/extract-diff-summary.py --scope packages/viewer-shared
```

The script outputs: merge-base and HEAD SHAs, files grouped by directory sorted by change volume, and a pre-formatted reviewer header block. For multi-package repos, run once per package with `--scope`.

## MR Description

### Title rules

- Noun phrases only, no verbs.
- **Focused:** 4–10 words, one topic. Optional `[TICKET-ID]` prefix.
- **Architectural:** 8–15 words, comma-separated themes in priority order.

Do not invent comma-separated themes to make a Focused MR look bigger than it is.

### Body structure

```
[Opening framing — 1–2 sentences, subject first, end-state not process]

**[Theme group label]:**
- [Bullet referencing real files, functions, or modules]
- [Bullet]

**[Next theme group]:**
- ...
```

See [REFERENCE.md](REFERENCE.md) for theme group label conventions, bullet rules, and multi-package MR structure. For the Technical Reviewer Guide structure, see [REFERENCE.md](REFERENCE.md#technical-reviewer-guide).

## Workflow

1. Run diff summary script (Step 1 above)
2. Classify the change per the calibration table — ≤2 files → Focused; 3–5 files one package → Multi-theme; ≥6 files or cross-package → Architectural
3. Draft MR description at the appropriate class
4. If Architectural-class AND user requested it: draft Technical Reviewer Guide using script's `Suggested Reviewer Header` block verbatim
5. Verify every bullet is traceable to a real file or function visible in the script output

**Pre-delivery checklist:**
- [ ] Class matches the change
- [ ] Every bullet traceable to a real file, function, or module in the diff
- [ ] No "we", "our", passive voice, or "This MR..." opener
- [ ] Title uses noun phrases only — no verbs
- [ ] Technical Reviewer Guide produced only if Architectural-class AND requested
- [ ] Length within class target; no padding

## Gotchas

**Script path is `~/.cursor/skills/` in older versions — this is wrong.** The script lives in `scripts/` relative to wherever this skill is installed. Use `find` to locate it (see Step 1). Don't hardcode `~/.cursor`.

**Misclassifying a large-but-uniform refactor as Architectural.** If the diff spans many files but they all do the same thing (e.g., a variable rename across a package), it's Multi-theme at most. File count alone doesn't determine class — cross-cutting architectural *intent* does.

**Opening sentence describing process, not outcome.** "This MR refactors X to use Y" is process. "X now uses Y across all call sites" is the end-state. The description should state what is true after the merge, not what the PR did.

**Reviewer Guide bullets in future tense.** The guide describes the end-state after merge, not what the PR will do. Write "X is now explicit" not "X will be made explicit."

**Generating a Reviewer Guide for a Focused MR.** Only Architectural-class changes warrant a Reviewer Guide, and only when the user asks for it. Don't produce one by default.

## Anti-Patterns

**DO NOT** pad a Focused MR into Architectural shape — no theme-group headers or reviewer guide for ≤2-file changes.

**DO NOT** describe intermediate commit history — only the end-state delta from main matters.

**DO NOT** open with "This MR...", use "we"/"our", or use passive voice.

**DO NOT** generate a Technical Reviewer Guide unless Architectural-class and explicitly requested.

**DO NOT** invent theme group labels — if the change doesn't have meaningful groupings, write a flat bullet list.

**DO NOT** restate what the diff already shows file-by-file — bullets should say what is NOT obvious from reading the diff directly.

See [examples.md](examples.md) for annotated examples of both artifacts.
