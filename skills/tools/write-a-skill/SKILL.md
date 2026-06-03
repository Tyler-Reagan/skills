---
name: write-a-skill
description: Authors or updates a Claude Code skill that loads cleanly into whatever skills repo or collection you're working in — discovering that repo's layout, frontmatter, and registration instead of assuming them. Use when the user says "write a skill", "create a skill", "new skill", "add a skill", "update a skill", or wants to author a new agent capability.
license: MIT
metadata:
  author: uraniborglabs@gmail.com
  version: "3.0.0"
  domain: developer-workflow
  triggers: write a skill, create a skill, new skill, add a skill, build a skill, update a skill
  role: scaffolding
  scope: implementation
  output-format: markdown
  related-skills: find-skills, workflow-fit
---

# Write a Skill

**Skills are folders, not just markdown files.** The entire directory — scripts, data, assets, hooks, config — is context engineering. SKILL.md is the entry point; everything else is what makes the skill powerful. A skill that is only a markdown file is leaving most of its potential on the table.

Discover the target repo's conventions rather than assuming them.

## Step 1 — Gather requirements

- **What it does** — one sentence.
- **Category** — which of the [nine skill types](REFERENCE.md#nine-skill-categories) is this? The category determines which folder patterns apply.
- **Triggers** — exact phrases a user would type to invoke it.
- **Stateful?** — does this skill need memory across runs? → plan for [persistent data](REFERENCE.md#persistent-data).
- **Sensitive ops?** — does it touch prod, delete data, or force-push? → plan for an [on-demand hook](REFERENCE.md#on-demand-hooks).
- **Repeated boilerplate?** — code Claude would reconstruct every session? → write a [script](REFERENCE.md#scripts-as-composable-building-blocks).
- **Needs user config?** — Slack channel, target env, output path? → plan for a [setup pattern](REFERENCE.md#setup-pattern).

If a question can be answered by reading the codebase, read it instead of asking.

## Step 2 — Check for overlap

Search existing skills — and `npx skills find` for the wider ecosystem — before creating. If something close exists, decide deliberately: extend it, or carve a clear scope boundary. Don't ship a near-duplicate.

## Step 3 — Learn THIS repo's conventions

Inspect a sibling skill and any `CLAUDE.md` / `README.md`:

- **Layout** — where skills live. Mirror a neighbor exactly.
- **Frontmatter** — copy what neighbors carry, exactly. See [REFERENCE.md](REFERENCE.md#frontmatter).
- **Registration** — find how siblings are listed in the manifest and match it. An unregistered skill never loads.
- **Validation** — note any `validate` / `build` / `lint` step; run it in Step 5.

## Step 4 — Write it

### Description first

The description is the **only** thing Claude sees when deciding whether to load the skill — write it for the model, not for humans. It is a trigger, not a summary.

> `<What it does, one sentence>. Use when the user <says/asks/shares> "<exact phrase>", "<exact phrase>", or <describes scenario>.`

Quote literal phrases, cover adjacent requests, write in third person. See [REFERENCE.md](REFERENCE.md#description-craft) for good/bad examples.

### Non-obvious content only

Claude already knows how to code and can read the codebase. **Don't restate what Claude would do by default.** Every line of a skill should push Claude out of its normal way of thinking: internal conventions, counterintuitive constraints, things you'd only know from real experience with this domain.

Ask yourself: *"Would Claude get this right without the skill?"* If yes, cut it.

### Gotchas section — the highest-signal content

A Gotchas section is the most valuable part of any skill. Build it from real failure points, name the specific field/table/behavior/exception. Vague gotchas are noise.

**Good:** *"The `subscriptions` table is append-only. The row you want has the highest `version`, not the most recent `created_at`."*

**Bad:** *"Be careful with database queries."*

Start with at least one concrete gotcha. Return to update it every time Claude hits a new edge case.

### Give Claude flexibility — don't railroad

Instructions that are too specific remove Claude's judgment and fail on variations the author didn't anticipate. Provide the knowledge and constraints Claude needs; let it decide the approach. A skill that prescribes every sub-step is brittle.

### Folder structure: progressive disclosure

Tell Claude what other files exist in the skill directory — it will read them when the situation calls for it. Use the file system as context engineering: a `stuck-jobs.md` that SKILL.md points to is only loaded when handling a stuck job, not on every invocation.

See [REFERENCE.md](REFERENCE.md#splitting-files) for splitting conventions.

### Folder patterns to include (from Step 1 answers)

Based on Step 1, add the appropriate patterns. Details and syntax in [REFERENCE.md](REFERENCE.md):

- **Setup** → `config.json` + AskUserQuestion initialization flow
- **Persistent data** → `history.log` / `results.json` in `${CLAUDE_PLUGIN_DATA}`
- **Scripts** → deterministic helpers in `scripts/`; tell Claude what each does and when to use it
- **On-demand hook** → a hook that activates only for this skill's session, not globally

## Step 5 — Register, validate, verify

- Register the skill where this repo registers skills (Step 3).
- Run the repo's validation/build step if it has one.
- Confirm it loads and the triggers fire.

## Anti-patterns

**DO NOT** assume another repo's conventions — inspect a sibling first.

**DO NOT** write a description without trigger phrases — Claude can't decide when to load it.

**DO NOT** restate what Claude already knows — every line should push Claude out of its defaults.

**DO NOT** omit a Gotchas section — it is the highest-signal part of the skill.

**DO NOT** railroad Claude with overly rigid step-by-step instructions — give knowledge and constraints, not a script.

**DO NOT** skip registration — an unlisted skill never loads.

**DO NOT** leave floating version/URL claims without an "as of <date>" callout — they rot.

**DO NOT** ship a skill that is a pure reference dump — every skill needs a workflow or task at its core.

**DO NOT** let agents reading untrusted content take high-privilege actions — use a hook or the quarantine pattern.
