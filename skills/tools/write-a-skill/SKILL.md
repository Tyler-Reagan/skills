---
name: write-a-skill
description: Creates a new skill for this repo following project conventions — full metadata schema, category layout, plugin.json registration, Anti-Patterns section. Use when the user says "write a skill", "create a skill", "new skill", "add a skill", or wants to author a new capability in this skills repo.
license: MIT
metadata:
  author: tylerreagan98@gmail.com
  version: "1.0.0"
  domain: developer-workflow
  triggers: write a skill, create a skill, new skill, add a skill, build a skill
  role: scaffolding
  scope: implementation
  output-format: markdown
  related-skills:
---

# Write a Skill

## Quick start

Describe the capability you want to add. This skill walks through requirements, drafts the full SKILL.md using project conventions, registers it in `plugin.json`, and runs the quality checklist before handing off.

## Step 1: Gather requirements

Ask the user — or explore the codebase to answer — before drafting:

- **What does it do?** One sentence.
- **What exact phrases trigger it?** What would a user naturally type?
- **Category?** `keyboard`, `infrastructure`, or `tools`
- **Role?** `specialist | scaffolding | diagnostic | formatting | reference`
- **Related skills?** Any existing skills that overlap or should be cross-referenced?
- **Split needed?** Scripts, reference tables, or examples that belong in separate files?
- **ZMK skill?** Which domain terms does it own vs. defer to sibling skills?

## Step 2: Check for overlap

Search existing skills for similar capabilities before creating. If overlap exists, decide: extend the existing skill or create a new one with a clear scope boundary. For ZMK skills, consult the ownership rules in `CLAUDE.md` before adding any behavior that might duplicate a sibling skill.

## Step 3: Draft

Create `skills/<category>/<skill-name>/SKILL.md`. See [REFERENCE.md](REFERENCE.md) for the full frontmatter schema and description format.

Every SKILL.md must include:
- **Quick start** — one concrete example of what using the skill looks like
- **Workflow or process** — the core of the skill; what it instructs Claude to do
- **Anti-Patterns / DO NOT** — at least one explicit DO NOT
- **Domain Language** — ZMK skills only; list owned terms, defer the rest to sibling skills

Split to `REFERENCE.md` when SKILL.md exceeds 100 lines. Keep cross-references one level deep.

## Step 4: Register in plugin.json

Add the new path to `.claude-plugin/plugin.json` in alphabetical order within its category group. Unregistered skills are not loaded.

## Step 5: Quality checklist

- [ ] `description` has specific quoted trigger phrases ("Use when user says...")
- [ ] `description` is under 1024 characters
- [ ] All metadata fields present: `author`, `version`, `domain`, `triggers`, `role`, `scope`, `output-format`, `related-skills`
- [ ] SKILL.md under 100 lines, or split into supporting files
- [ ] `Domain Language` section present (ZMK skills only)
- [ ] `Anti-Patterns` / DO NOT section present
- [ ] Per-phase checklists included (multi-step workflow skills only)
- [ ] `related-skills` populated with any skills the user should consider loading alongside this one
- [ ] No time-sensitive content without an explicit "as of <date>" callout
- [ ] No content duplicated from an existing skill — define terms once, reference the owning skill

## Anti-Patterns

**DO NOT** use the two-field frontmatter from the upstream write-a-skill — this repo requires the full metadata block.

**DO NOT** skip plugin.json registration — a skill that isn't listed is never loaded.

**DO NOT** write a skill that is a reference dump — every skill needs a workflow or process at its core. Reference material supports the core; it is not the core.

**DO NOT** duplicate domain language between skills — define a term once in the skill that owns it.

**DO NOT** produce the skill without running the quality checklist in Step 5.
