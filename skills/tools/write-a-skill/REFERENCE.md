# Write a Skill — Reference

Deeper craft notes. The specifics of *your* target repo (required frontmatter, categories, registration) come from inspecting a sibling skill — these are general patterns, not mandates.

## Description craft

The description is the only thing Claude sees when deciding whether to load a skill. It must answer two things: what the skill does, and exactly when to trigger it.

**Pattern:**

```
<What it does, one sentence>. Use when the user <says/asks/shares> "<exact phrase>", "<exact phrase>", or <describes scenario>.
```

**Good** — concrete capability, quoted triggers, edge cases covered:

```
Diagnoses and resolves common CI pipeline failures. Use when the user shares a failing job URL, asks "why did my pipeline fail", "what does this CI error mean", or pastes a red build log.
```

**Bad** — capability with no triggers; Claude can't decide when to load it:

```
Helps with CI problems.
```

Rules: max ~1024 characters, third person, quote phrases a user would actually type, cover adjacent requests, don't restate the body.

## Frontmatter

`name` (kebab-case, matches the directory) and `description` are near-universal. Beyond those, copy whatever the repo's other skills carry — common optional fields include:

- `version` — semver; many tools won't update a skill that lacks one.
- `license`
- a `metadata` block — e.g. `author`, `domain`, `triggers`, `role`, `scope`, `output-format`, `related-skills`.

Match the neighbors exactly; a frontmatter shape the repo's validator rejects won't publish.

## Common role / scope values

If the repo uses a `metadata` block, these are conventional values — adapt to what siblings use:

| Field   | Common values |
| ------- | ------------- |
| `role`  | `specialist` (domain expert) · `scaffolding` (generates starter structure) · `diagnostic` (investigates problems) · `formatting` (transforms/renders output) · `reference` (lookup tables / API docs) |
| `scope` | `implementation` · `troubleshooting` · `formatting` · `documentation` |

## When to add a script

Add a utility script when the operation is deterministic, the same code would be regenerated every session, or errors need explicit handling. Scripts save tokens and improve reliability over re-deriving logic in prose each time.

## Splitting files

Keep SKILL.md the workflow entry point. Push long reference tables to `REFERENCE.md`, annotated examples to `EXAMPLES.md`, data files to `references/`, and deterministic helpers to `scripts/`. Split once SKILL.md passes ~100 lines or when content has distinct audiences (quick workflow vs. deep reference). Keep cross-references one level deep — don't chain `See X → See Y → See Z`.
