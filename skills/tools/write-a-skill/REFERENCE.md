# Write a Skill — Reference

Deeper craft notes. The specifics of *your* target repo (required frontmatter, categories, registration) come from inspecting a sibling skill — these are general patterns, not mandates.

---

## Nine skill categories

Every skill fits cleanly into one category. Straddling several confuses the agent. Use this to identify what patterns belong in your skill.

| # | Category | Core job | Key patterns |
|---|---|---|---|
| 1 | **Library / API reference** | Correct usage of a lib, CLI, or SDK | Reference snippets, Gotchas section, edge cases |
| 2 | **Product verification** | Test/verify that code works | Scripts + Playwright/tmux drivers, programmatic assertions |
| 3 | **Data fetching / analysis** | Connect to data and monitoring stacks | Credential handling, dashboard IDs, common query patterns |
| 4 | **Business process / automation** | Automate a repetitive workflow | Persistent data (history log), config.json for setup |
| 5 | **Code scaffolding / templates** | Generate framework boilerplate | Template files in `assets/`, composable scripts |
| 6 | **Code quality / review** | Enforce code style and review | Deterministic scripts, hooks for CI integration |
| 7 | **CI/CD and deployment** | Fetch, push, deploy | Reference to other skills, rollback logic, hooks |
| 8 | **Runbook** | Symptom → investigation → structured report | Multi-tool query patterns, symptom-to-tool mapping |
| 9 | **Infrastructure operations** | Routine maintenance with guardrails | On-demand hooks to block destructive commands |

---

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

---

## Frontmatter

`name` (kebab-case, matches directory) and `description` are near-universal. Beyond those, copy whatever the repo's other skills carry exactly. Common optional fields:

- `version` — semver; many tools won't update a skill that lacks one.
- `license`
- a `metadata` block — e.g. `author`, `domain`, `triggers`, `role`, `scope`, `output-format`, `related-skills`.

| Field | Common values |
|---|---|
| `role` | `specialist` · `scaffolding` · `diagnostic` · `formatting` · `reference` |
| `scope` | `implementation` · `troubleshooting` · `formatting` · `documentation` |

---

## Splitting files

Keep SKILL.md the workflow entry point (~100 lines max). Push content to:

- `REFERENCE.md` — deep reference tables, API docs, pattern details
- `EXAMPLES.md` — annotated worked examples
- `references/` — data files (keycodes, boards, schemas)
- `scripts/` — deterministic helper scripts
- `assets/` — templates, fixtures, static files

Keep cross-references one level deep — don't chain `See X → See Y → See Z`.

---

## Setup pattern

For skills that need user configuration (a Slack channel, an environment name, a target path):

1. Check for `config.json` in the skill directory at the start of the skill.
2. If it exists, read the values from it.
3. If it doesn't exist, use `AskUserQuestion` to collect the needed values from the user.
4. Write the collected values to `config.json` for future runs.

```json
// config.json example
{
  "slack_channel": "#deploys",
  "environment": "production",
  "notify_on_success": true
}
```

This gives the skill an initialization path without requiring the user to edit files manually. The skill self-configures on first run and is silent on subsequent runs.

---

## Persistent data

For skills that benefit from memory across runs (standups, triage workflows, deploy logs):

- Use `${CLAUDE_PLUGIN_DATA}` as the stable data directory — it persists across sessions and is skill-scoped.
- Simple state: append-only `history.log` or `results.json`.
- Complex state: SQLite database in `${CLAUDE_PLUGIN_DATA}/state.db`.

On each invocation, Claude reads the history first and can tell what changed since the last run.

```
# Example: standup-post skill
${CLAUDE_PLUGIN_DATA}/standups.log  — one entry per run, append-only
${CLAUDE_PLUGIN_DATA}/last_run.json — timestamp + summary of previous execution
```

---

## Scripts as composable building blocks

Pre-written scripts are one of the most powerful things in a skill. They let Claude spend turns on composition — deciding what to do and how to combine things — rather than reconstructing boilerplate each session.

**Add a script when:**
- The operation is deterministic (same input → same output)
- The same code would be regenerated every session
- The operation requires explicit error handling

**Store in `scripts/`.** In SKILL.md, tell Claude what each script does and when to invoke it:

```
scripts/
  fetch_cohort.py    — fetches a user cohort by ID; call with --cohort-id and --start-date
  diff_retention.py  — compares two cohort CSVs, outputs delta table with significance flags
```

Claude composes these into novel workflows on the fly. A `data-science` skill with 5 helper functions enables arbitrary analysis without reconstructing the fetch/transform logic each time.

---

## On-demand hooks

Skills can register hooks that activate only for the skill's session duration — not as global always-on hooks. Use this for guards you want sometimes but that would be annoying all the time.

**Configuration:** include a `config.json` or `.claude/hooks` fragment in the skill directory that Claude applies at session start.

**Common patterns:**

```
/careful  — blocks rm -rf, DROP TABLE, kubectl delete, force-push via PreToolUse matcher on Bash
            Use for any skill that touches prod
/freeze   — blocks Edit/Write outside a specific directory
            Use for debugging skills where you want logs but not accidental fixes
/audit    — logs every tool call to a file for review
            Use for infra operations skills that require an audit trail
```

**Quarantine hook** (for triage skills reading untrusted input):
- Reader agents: read untrusted content, produce structured summaries only — no writes, no API calls
- Actor agents: receive only the structured summary, never the raw content; execute all high-privilege actions

This prevents prompt injection from untrusted content reaching agents with real-world permissions.
