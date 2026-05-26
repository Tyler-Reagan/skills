# Write a Skill — Reference

## Full frontmatter schema

Every SKILL.md must open with this block:

```yaml
---
name: skill-name               # kebab-case, matches directory name
description: <see below>       # critical — the skill's entire discoverability
license: MIT
metadata:
  author: tylerreagan98@gmail.com
  version: "1.0.0"             # semver; increment on meaningful changes
  domain: <domain>             # e.g. keyboard-firmware, infrastructure, developer-workflow
  triggers: comma, separated, trigger, phrases
  role: specialist | scaffolding | diagnostic | formatting | reference
  scope: implementation | troubleshooting | formatting | documentation
  output-format: code | text | markdown
  related-skills: other-skill, another-skill
---
```

All eight `metadata` fields are required. A skill without `version` will not be updated deliberately.

## Description format

The description is the only thing Claude sees when deciding whether to load a skill. It must answer:
1. What capability does this skill provide? (one sentence)
2. When should it trigger? (specific natural language phrases in quotes)

**Pattern:**
```
<What it does>. Use when the user <says/asks/shares> "<exact phrase>", "<exact phrase>", or <describes scenario>.
```

**Good:**
```
Diagnoses and resolves common ZMK firmware failures across five categories. Use when the user reports a build error, "board not found", "KeyError qualifiers", keyboard not pairing, or ZMK Studio not connecting.
```

**Bad:**
```
Helps with ZMK keyboard problems.
```

Rules:
- Max 1024 characters
- Third person
- Quote exact natural language phrases the user would actually type
- Cover edge cases — what adjacent requests should also load this skill?
- Do not summarize the skill body — the description is a trigger, not a synopsis

## Skill directory layout

```
skill-name/
├── SKILL.md              # Main instructions (required)
├── REFERENCE.md          # Long reference tables or API docs (if SKILL.md > 100 lines)
├── EXAMPLES.md           # Annotated examples (if needed)
├── supporting/           # Deep-dive docs
│   └── topic.md
├── references/           # Data files (keycodes, boards, themes)
│   └── table.md
└── scripts/              # Utility scripts for deterministic operations
    └── helper.py
```

Split into separate files when SKILL.md exceeds 100 lines or when content has distinct audiences. Keep cross-references one level deep — don't chain `See X → See Y → See Z`.

## When to add scripts

Add a utility script when the operation is deterministic, the same code would be generated repeatedly across sessions, or errors need explicit handling. Scripts save tokens and improve reliability.

## Role and scope values

| Field | Allowed values |
|---|---|
| `role` | `specialist` — domain expert; `scaffolding` — generates starter code or structure; `diagnostic` — investigates and identifies problems; `formatting` — transforms or renders output; `reference` — provides lookup tables or API docs |
| `scope` | `implementation` — writes or modifies code; `troubleshooting` — diagnoses and fixes; `formatting` — stylistic transformation; `documentation` — writes prose or docs |
