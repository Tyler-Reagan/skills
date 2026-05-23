# Skills Repo — Authorship Conventions

This is a [Claude Code skills](https://skills.sh) collection. Skills are loaded into Claude's context when the user invokes them by name or when Claude matches the user's request against a skill's `description` field.

**The `description` field is the only thing Claude sees when deciding whether to load a skill.** Everything else in SKILL.md is only visible after the skill is loaded. Write descriptions accordingly.

---

## Repository Layout

```
skills/
├── .claude-plugin/
│   └── plugin.json           # Explicit skill manifest (all paths declared here)
├── CLAUDE.md                 # This file
├── README.md                 # Root index with category tables
└── skills/
    ├── keyboard/
    │   ├── README.md         # Category overview and load-order guidance
    │   └── <skill-name>/
    ├── infrastructure/
    │   ├── README.md
    │   └── <skill-name>/
    └── tools/
        ├── README.md
        └── <skill-name>/
```

Every new skill goes into the appropriate category subdirectory under `skills/`. Update `plugin.json` when adding a skill — it is the authoritative list of published skills.

## Skill Directory Layout

```
skill-name/
├── SKILL.md              # Main instructions (required)
├── REFERENCE.md          # Long reference tables or API docs (if SKILL.md > 100 lines)
├── EXAMPLES.md           # Annotated examples (if needed)
├── supporting/           # Deep-dive docs (philosophy, test patterns, etc.)
│   └── topic.md
├── references/           # Data files (keycodes, boards, shields, themes)
│   └── table.md
└── scripts/              # Utility scripts for deterministic operations
    └── helper.py
```

Split into separate files when SKILL.md exceeds 100 lines or when content has distinct audiences (quick workflow vs. deep reference). Keep cross-references one level deep — don't chain `See X → See Y → See Z`.

---

## Frontmatter Schema

Every SKILL.md must open with this frontmatter block:

```yaml
---
name: skill-name               # kebab-case, matches directory name
description: <see below>       # critical — the skill's entire discoverability
license: MIT
metadata:
  author: tylerreagan98@gmail.com
  version: "1.0.0"             # semver string; increment on meaningful changes
  domain: <domain>             # e.g. keyboard-firmware, infrastructure, developer-workflow
  triggers: comma, separated, trigger, phrases
  role: specialist | scaffolding | diagnostic | formatting | reference
  scope: implementation | troubleshooting | formatting | documentation
  output-format: code | text | markdown
  related-skills: other-skill, another-skill
---
```

Fields `version`, `domain`, `triggers`, `role`, `scope`, `output-format`, and `related-skills` are all required for personal skills. Skills without `version` will not be updated deliberately — add it.

---

## Description Format

The description is **the entire discoverability surface**. It must tell Claude:
1. What capability the skill provides (one sentence)
2. Exactly when to trigger it — specific natural language patterns in quotes

**Pattern:**
```
<What it does, one sentence>. Use when the user <says/asks/shares> "<exact phrase>", "<exact phrase>", or <describes scenario>.
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
- Write in third person
- Quote exact natural language phrases the user would actually type
- Cover the edge cases: what adjacent requests should also load this skill?
- Do not duplicate the skill body — the description is a trigger, not a summary

---

## Domain Language — Cross-Skill Terms

These terms are used consistently across all ZMK skills. Never substitute synonyms.

| Term | Meaning | Avoid |
|------|---------|-------|
| **central** | The keyboard half (or dongle MCU) managing USB HID and BLE host connections | "master", "left half" (ambiguous) |
| **peripheral** | A keyboard half connecting to central over BLE split transport | "slave", "right half" (ambiguous) |
| **board** | The MCU module identifier (e.g. `nice_nano_v2`) | "controller", "microcontroller" |
| **shield** | A Zephyr abstraction for a hardware add-on (keyboard PCB, display module, adapter) | "overlay", "add-on", "hardware" |
| **module** | An external Git repo consumed via `west.yml` that self-registers via `zephyr/module.yml` | "plugin", "library", "package" |
| **v0.3** | Current stable ZMK release (Zephyr 3.5, LVGL v8) | "old ZMK", "stable", "the release" |
| **ZMK main** | Development branch (Zephyr 4.1, LVGL v9) — community alias "v0.4" | "latest", "new ZMK", "v0.4 only" |

When writing a new ZMK skill, include a `## Domain Language` section at the top with the terms relevant to that skill's scope.

---

## Skill Quality Checklist

Before committing a new or updated skill:

- [ ] `description` includes specific quoted trigger phrases ("Use when user says...")
- [ ] `description` is under 1024 characters
- [ ] `version` field present and correct semver
- [ ] SKILL.md is under 100 lines (or split into supporting files)
- [ ] `## Domain Language` present for any ZMK skill
- [ ] `## Anti-Patterns` / DO NOT section present for any workflow or process skill
- [ ] Per-phase checklists present for any multi-step workflow skill
- [ ] `related-skills` metadata lists all skills the user should consider loading alongside this one
- [ ] No time-sensitive content (URLs, version numbers) without explicit "as of <date>" callouts
- [ ] No duplicate content — if something is in zmk-config, don't repeat it in zmk-keymap

---

## Anti-Patterns for Skill Authorship

**DO NOT** write a description that describes capability without triggers — Claude cannot use it to decide when to load the skill.

**DO NOT** write all reference content into SKILL.md — keep SKILL.md as the workflow/process entry point and push deep tables to `references/` or `REFERENCE.md`.

**DO NOT** duplicate domain language between skills — define a term once in the skill that owns it, reference the owning skill in `related-skills`.

**DO NOT** use floating version references ("the latest version", "current main") without a date — version state changes; pin claims to dates.

**DO NOT** write a skill that is purely a reference dump — every skill should have a workflow, a process, or a generation task at its core. Reference material supports that core; it is not the core itself.

---

## ZMK Skill Conventions

The ZMK skills form a cohesive subsystem. When editing any of them:

- **Version state** is owned by `zmk-config` — do not re-derive it in `zmk-keymap` or `zmk-display`. Reference the zmk-config skill's Version State section instead.
- **LVGL compatibility** is owned by `zmk-display` — do not add LVGL version tables to `zmk-config`.
- **Keymap behavior syntax** is owned by `zmk-keymap` — do not document behavior bindings in `zmk-config`.
- **Scaffold workflow** is owned by `zmk-new-config` — it is the entry point for new projects.
- **Failure diagnosis** is owned by `zmk-debug` — do not add troubleshooting flows inside the other skills; add cross-references instead.

The canonical load order for an existing project: `zmk-config` (version detection) → `zmk-keymap` + `zmk-display` (edit). For a new project: `zmk-new-config` → the rest. For failures: `zmk-debug`.
