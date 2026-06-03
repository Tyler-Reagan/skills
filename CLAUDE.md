# Skills Repo — Authorship Conventions

This is a [Claude Code skills](https://skills.sh) collection. Skills are loaded into Claude's context when the user invokes them by name or when Claude matches the user's request against a skill's `description` field.

**The `description` field is the only thing Claude sees when deciding whether to load a skill.** Everything else in SKILL.md is only visible after the skill is loaded. Write descriptions accordingly.

**Skills are folders, not just markdown files.** The entire directory — scripts, data, assets, config, hooks — is context engineering. A skill that is only a SKILL.md is leaving most of its potential on the table.

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
├── config.json           # User setup state — written on first run, read on subsequent runs
├── supporting/           # Deep-dive docs (philosophy, test patterns, etc.)
│   └── topic.md
├── references/           # Data files (keycodes, boards, shields, themes)
│   └── table.md
├── assets/               # Templates, fixtures, and static files Claude copies/fills in
│   └── template.md
└── scripts/              # Deterministic helper scripts — let Claude compose, not reconstruct
    └── helper.py
```

Split into separate files when SKILL.md exceeds 100 lines or when content has distinct audiences (quick workflow vs. deep reference). Keep cross-references one level deep — don't chain `See X → See Y → See Z`.

**Progressive disclosure:** Tell Claude what files exist in the skill directory and when each is relevant. Claude will read them at the right moment rather than loading everything upfront. A `stuck-jobs.md` that SKILL.md references is only read when handling a stuck job.

---

## Frontmatter Schema

Every SKILL.md must open with this frontmatter block:

```yaml
---
name: skill-name # kebab-case, matches directory name
description: <see below> # critical — the skill's entire discoverability
license: MIT
metadata:
  author: uraniborglabs@gmail.com
  version: "1.0.0" # semver string; increment on meaningful changes
  domain: <domain> # e.g. keyboard-firmware, infrastructure, developer-workflow
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

## Content Principles

These apply to every skill in this repo. They are the difference between a skill that adds value and one that adds context without adding value.

### Non-obvious content only

Claude already knows how to code and can read the codebase. **Do not restate what Claude would do by default.** Every line of a skill should push Claude out of its normal way of thinking — internal conventions, counterintuitive constraints, things you'd only know from real experience with this domain.

Ask: *"Would Claude get this right without the skill?"* If yes, cut it.

### Gotchas section — the highest-signal content

The Gotchas section is the most valuable part of any skill. Build it from real failure points. Be specific — name the field, the table, the behavior, the exception. Vague gotchas are noise.

**Good:** *"The `subscriptions` table is append-only. The row you want has the highest `version`, not the most recent `created_at`."*

**Bad:** *"Be careful with database queries."*

Start with at least one concrete gotcha. Return to update it every time Claude hits a new edge case.

### Give Claude flexibility — don't railroad

Instructions that are too specific remove Claude's judgment and fail on variations the author didn't anticipate. Provide the knowledge and constraints Claude needs; let it decide the approach. A skill that prescribes every sub-step is brittle.

---

## Skill Categories

Every skill fits cleanly into one of nine categories. Skills that straddle several confuse the agent. Identify the category first — it determines which folder patterns apply.

| # | Category | Core job | Key patterns |
|---|---|---|---|
| 1 | **Library / API reference** | Correct usage of a lib, CLI, or SDK | Reference snippets, Gotchas, edge cases |
| 2 | **Product verification** | Test/verify that code works | Scripts + Playwright/tmux drivers, programmatic assertions |
| 3 | **Data fetching / analysis** | Connect to data and monitoring stacks | Credential handling, dashboard IDs, query patterns |
| 4 | **Business process / automation** | Automate a repetitive workflow | Persistent data, `config.json` for setup |
| 5 | **Code scaffolding / templates** | Generate framework boilerplate | Template files in `assets/`, composable scripts |
| 6 | **Code quality / review** | Enforce code style and review | Deterministic scripts, hooks for CI integration |
| 7 | **CI/CD and deployment** | Fetch, push, deploy | Cross-skill references, rollback logic, hooks |
| 8 | **Runbook** | Symptom → investigation → structured report | Symptom-to-tool mapping, multi-tool query patterns |
| 9 | **Infrastructure operations** | Routine maintenance with guardrails | On-demand hooks to block destructive commands |

---

## Folder Patterns

Use these patterns when the skill warrants them. They are not required in every skill — pick what fits the category.

### Setup pattern (for skills needing user configuration)

Store setup state in `config.json` in the skill directory. On first run: if `config.json` is absent, use `AskUserQuestion` to collect values, then write them. On subsequent runs: read silently. This gives the skill a self-configuring initialization path.

### Persistent data (for skills that benefit from memory across runs)

Store state in `${CLAUDE_PLUGIN_DATA}` — a stable, skill-scoped directory. Simple state: append-only `history.log` or `results.json`. Complex state: SQLite. On each invocation, Claude reads history first and can tell what changed since the last run.

### Scripts as composable building blocks

Pre-written scripts let Claude spend turns on composition rather than reconstructing boilerplate. Add a script when the operation is deterministic, the same code would be regenerated every session, or the operation needs explicit error handling. Tell Claude what each script does and when to invoke it.

### On-demand hooks (for sensitive or opinionated operations)

Skills can register hooks that activate only for the skill's session — not as always-on global hooks. Use for guards you want sometimes but not always:

- Block `rm -rf`, `DROP TABLE`, force-push for prod-touching skills
- Restrict writes to a specific directory during a debugging skill
- Log every tool call for skills requiring an audit trail

For triage skills that read untrusted content: reader agents produce structured summaries only (no writes, no API calls); actor agents receive only the summary, never the raw content.

---

## Domain Language — Cross-Skill Terms

These terms are used consistently across all ZMK skills. Never substitute synonyms.

| Term           | Meaning                                                                                  | Avoid                              |
| -------------- | ---------------------------------------------------------------------------------------- | ---------------------------------- |
| **central**    | The keyboard half (or dongle MCU) managing USB HID and BLE host connections              | "master", "left half" (ambiguous)  |
| **peripheral** | A keyboard half connecting to central over BLE split transport                           | "slave", "right half" (ambiguous)  |
| **board**      | The MCU module identifier (e.g. `nice_nano_v2`)                                          | "controller", "microcontroller"    |
| **shield**     | A Zephyr abstraction for a hardware add-on (keyboard PCB, display module, adapter)       | "overlay", "add-on", "hardware"    |
| **module**     | An external Git repo consumed via `west.yml` that self-registers via `zephyr/module.yml` | "plugin", "library", "package"     |
| **v0.3**       | Current stable ZMK release (Zephyr 3.5, LVGL v8)                                         | "old ZMK", "stable", "the release" |
| **ZMK main**   | Development branch (Zephyr 4.1, LVGL v9) — community alias "v0.4"                        | "latest", "new ZMK", "v0.4 only"   |

When writing a new ZMK skill, include a `## Domain Language` section at the top with the terms relevant to that skill's scope.

---

## Skill Quality Checklist

Before committing a new or updated skill:

**Content**
- [ ] Skill category identified; folder patterns appropriate to that category applied
- [ ] Every line pushes Claude out of its default behavior — no obvious content
- [ ] Gotchas section present with at least one concrete, specific gotcha (named field/table/behavior)
- [ ] Instructions give Claude flexibility — no railroaded step-by-step scripts
- [ ] No duplicate content — if something is in zmk-config, don't repeat it in zmk-keymap

**Discoverability**
- [ ] `description` includes specific quoted trigger phrases ("Use when user says...")
- [ ] `description` is under 1024 characters
- [ ] `version` field present and correct semver
- [ ] `related-skills` metadata lists all skills the user should consider loading alongside

**Structure**
- [ ] SKILL.md is under 100 lines (or split into supporting files)
- [ ] Progressive disclosure: SKILL.md tells Claude what other files exist and when to read them
- [ ] `config.json` pattern used if skill needs user configuration
- [ ] Persistent data pattern used if skill runs repeatedly and benefits from memory
- [ ] Scripts present for any deterministic boilerplate Claude would otherwise reconstruct
- [ ] On-demand hook considered for any skill involving sensitive or destructive operations

**Domain**
- [ ] `## Domain Language` present for any ZMK skill
- [ ] `## Anti-Patterns` / DO NOT section present for any workflow or process skill
- [ ] Per-phase checklists present for any multi-step workflow skill
- [ ] No time-sensitive content (URLs, version numbers) without explicit "as of <date>" callouts

---

## Anti-Patterns for Skill Authorship

**DO NOT** write a description that describes capability without triggers — Claude cannot use it to decide when to load the skill.

**DO NOT** restate what Claude already knows — if Claude would get it right without the skill, cut it.

**DO NOT** omit a Gotchas section — it is the highest-signal content in any skill.

**DO NOT** railroad Claude with overly specific step-by-step instructions — give knowledge and constraints, let Claude decide the approach.

**DO NOT** write all reference content into SKILL.md — keep SKILL.md as the workflow/process entry point and push deep tables to `references/` or `REFERENCE.md`.

**DO NOT** store user setup config in the skill instructions — use `config.json` with an AskUserQuestion initialization flow.

**DO NOT** duplicate domain language between skills — define a term once in the skill that owns it, reference the owning skill in `related-skills`.

**DO NOT** use floating version references ("the latest version", "current main") without a date — version state changes; pin claims to dates.

**DO NOT** write a skill that is purely a reference dump — every skill should have a workflow, a process, or a generation task at its core. Reference material supports that core; it is not the core itself.

**DO NOT** let a skill's agents read untrusted public content and take high-privilege actions in the same context — use the quarantine pattern (reader agents produce summaries; actor agents receive only summaries).

---

## ZMK Skill Conventions

The ZMK skills form a cohesive subsystem. When editing any of them:

- **Version state** is owned by `zmk-config` — do not re-derive it in `zmk-keymap` or `zmk-display`. Reference the zmk-config skill's Version State section instead.
- **LVGL compatibility** is owned by `zmk-display` — do not add LVGL version tables to `zmk-config`.
- **Keymap behavior syntax** is owned by `zmk-keymap` — do not document behavior bindings in `zmk-config`.
- **Scaffold workflow** is owned by `zmk-new-config` — it is the entry point for new projects.
- **Failure diagnosis** is owned by `zmk-debug` — do not add troubleshooting flows inside the other skills; add cross-references instead.

The canonical load order for an existing project: `zmk-config` (version detection) → `zmk-keymap` + `zmk-display` (edit). For a new project: `zmk-new-config` → the rest. For failures: `zmk-debug`.
