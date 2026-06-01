---
name: write-a-skill
description: Authors a new Claude Code skill that loads cleanly into whatever skills repo or collection you're working in — discovering that repo's layout, frontmatter, and registration instead of assuming them. Use when the user says "write a skill", "create a skill", "new skill", "add a skill", or wants to author a new agent capability.
license: MIT
metadata:
  author: uraniborglabs@gmail.com
  version: "2.0.0"
  domain: developer-workflow
  triggers: write a skill, create a skill, new skill, add a skill, build a skill
  role: scaffolding
  scope: implementation
  output-format: markdown
  related-skills: find-skills
---

# Write a Skill

Author a new skill that loads cleanly into Claude Code. The craft below is universal; the repo-specific details — where skills live, what frontmatter is required, how skills get registered — you **discover from the target repo**, never assume.

## Step 1 — Gather requirements

- **What it does** — one sentence.
- **Triggers** — the exact phrases a user would type to invoke it.
- **Split?** — will it need reference tables, examples, or scripts in separate files?

If a question can be answered by reading the codebase, read it instead of asking.

## Step 2 — Check for overlap

Search existing skills — and `npx skills find` for the wider ecosystem — before creating. If something close exists, decide deliberately: extend it, or carve a clear scope boundary. Don't ship a near-duplicate.

## Step 3 — Learn THIS repo's conventions

Skills collections differ. Inspect a sibling skill and any `CLAUDE.md` / `README.md` rather than assuming:

- **Layout** — where skills live (`skills/<category>/<name>/`, flat, etc.). Mirror a neighbor.
- **Frontmatter** — `name` and `description` are effectively universal; everything else (a `metadata` block, `version`, `license`) is per-repo. Copy what neighbors carry, exactly.
- **Registration** — most repos declare skills in a manifest (`plugin.json`, `registry-manifest.json`, `index.json`, …). Find how siblings are listed and match it. An unregistered skill never loads.
- **Validation** — note any `validate` / `build` / `lint` step the repo runs on skills; you'll run it in Step 5.

## Step 4 — Write it

**Description first — it is the entire discoverability surface** (the only thing Claude sees when deciding whether to load the skill):

> `<What it does, one sentence>. Use when the user <says/asks/shares> "<exact phrase>", "<exact phrase>", or <describes the scenario>.`

Quote literal phrases; cover adjacent requests; third person; a trigger, not a summary. See [REFERENCE.md](REFERENCE.md) for good/bad examples.

**Body** — keep it lean: a workflow Claude can follow, not a reference dump. Lead with what to do, put the process at the core, include at least one explicit **DO NOT**. Split deep tables / examples / scripts into sibling files once SKILL.md passes ~100 lines; keep cross-references one level deep.

## Step 5 — Register, validate, verify

- Register the skill where this repo registers skills (Step 3).
- Run the repo's validation/build step, if it has one.
- Confirm it loads and the triggers fire.

## Anti-patterns

**DO NOT** assume another repo's conventions — categories, required frontmatter, and the registration mechanism are all per-repo. Inspect a sibling first.

**DO NOT** write a description that states capability without trigger phrases — Claude can't decide when to load it.

**DO NOT** ship a skill that is a pure reference dump — every skill needs a workflow or task at its core.

**DO NOT** skip registration — an unlisted skill never loads.

**DO NOT** leave floating version / URL claims without an "as of <date>" — they rot.
