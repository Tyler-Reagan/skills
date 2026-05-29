# Tyler Reagan's Claude Code Skills

A curated collection of [Claude Code skills](https://skills.sh) built around deep domain expertise in ZMK keyboard firmware, infrastructure automation, and engineering workflow tooling.

## Categories

| Category | Skills | Focus |
|---|---|---|
| [`keyboard/`](skills/keyboard/README.md) | 7 | ZMK firmware — scaffold, keymap, config, display, debug, diagrams, LVGL migration |
| [`infrastructure/`](skills/infrastructure/README.md) | 3 | GitLab CI/CD, MR writing, Terraform plan analysis |
| [`tools/`](skills/tools/README.md) | 5 | GitHub CLI, Mermaid diagrams, idea development, focus recovery, skill authoring |

---

### keyboard

Skills for the full lifecycle of a ZMK keyboard project.

| Skill | Triggers | Description |
|---|---|---|
| [`zmk-new-config`](skills/keyboard/zmk-new-config/SKILL.md) | `new zmk config`, `set up zmk`, `start zmk project`, `new keyboard` | Scaffolds a new ZMK config repo — quizzes hardware and feature choices then generates `west.yml`, `build.yaml`, and per-side `.conf` files |
| [`zmk-keymap`](skills/keyboard/zmk-keymap/SKILL.md) | `.keymap`, `behaviors`, `combos`, `hold-tap`, `tap-dance`, `mod-morph`, `layers` | Full ZMK behavior library across v0.3 and ZMK main — kp, mt, lt, mo, sk, caps_word, macros, combos, Bluetooth, mouse emulation, sensor bindings |
| [`zmk-config`](skills/keyboard/zmk-config/SKILL.md) | `west.yml`, `build.yaml`, `.conf`, `shield`, `snippet`, `UF2`, `ZMK Studio` | Project configuration: manifest authoring, build targets, Kconfig options, split keyboard topology, and the UF2 flash workflow |
| [`zmk-display`](skills/keyboard/zmk-display/SKILL.md) | `display`, `LVGL`, `nice!view`, `SSD1306`, `status screen`, `widget`, `dongle screen` | Display subsystem — hardware support, LVGL v8/v9 widget APIs, custom status screen authoring, nice-view ecosystem modules |
| [`zmk-debug`](skills/keyboard/zmk-debug/SKILL.md) | `build error`, `board not found`, `KeyError qualifiers`, `not pairing`, `display blank`, `Studio not connecting` | Five-phase diagnostic for build errors, flash failures, split pairing issues, display problems, and ZMK Studio failures |
| [`zmk-lvgl-migrate`](skills/keyboard/zmk-lvgl-migrate/SKILL.md) | `lvgl migrate`, `v8 to v9`, `port display`, `lv_canvas_draw undeclared`, `LV_IMG_CF undeclared`, `zmk main display` | Migrates ZMK nice!view display modules from LVGL v8 (ZMK v0.3) to LVGL v9 (ZMK main / Zephyr 4.1) — step-by-step checklist with wrapper function strategy |
| [`pretty-zmk-keymap`](skills/keyboard/pretty-zmk-keymap/SKILL.md) | `ascii art keymap`, `keymap diagram`, `keymap visualization`, `box drawing` | Generates box-drawing ASCII art diagrams embedded above each layer's bindings block |

> [!NOTE]
> Start with `zmk-new-config` for any new keyboard project. Load `zmk-keymap`, `zmk-config`, and `zmk-display` together on an existing project. Use `zmk-debug` when something breaks.

---

### infrastructure

| Skill | Triggers | Description |
|---|---|---|
| [`gitlab-ci-inspector`](skills/infrastructure/gitlab-ci-inspector/SKILL.md) | GitLab job URL, pipeline URL, `why did this pipeline fail` | Fetches and diagnoses GitLab CI/CD job logs via `glab` CLI or REST API |
| [`gitlab-mr-writing`](skills/infrastructure/gitlab-mr-writing/SKILL.md) | `write MR description`, `merge request body`, `technical reviewer guide` | Produces calibrated MR descriptions (Focused / Multi-theme / Architectural) and optional Technical Reviewer Guides |
| [`homebrew-cli-release`](skills/infrastructure/homebrew-cli-release/SKILL.md) | `distribute on homebrew`, `brew install my CLI`, `homebrew tap`, `goreleaser`, `invoke via command not go run` | Ships a compiled CLI as a `brew install`-able command via GoReleaser + a personal tap — version injection, cask, cross-repo token, quarantine, license gate, first release |
| [`terraform-plan-summary`](skills/infrastructure/terraform-plan-summary/SKILL.md) | `terraform plan`, `CI plan job`, `what would this plan change` | Parses noisy CI plan logs into a ≤40-line impact summary with grouped resource actions and attribute diffs |

---

### tools

| Skill | Triggers | Description |
|---|---|---|
| [`gh-cli`](skills/tools/gh-cli/SKILL.md) | `gh`, `GitHub CLI`, `gh pr`, `gh issue`, `gh run`, `gh api` | Comprehensive GitHub CLI reference — repos, issues, PRs, Actions, releases, projects, codespaces, API access |
| [`pretty-mermaid`](skills/tools/pretty-mermaid/SKILL.md) | `render mermaid`, `flowchart`, `sequence diagram`, `ER diagram`, `apply diagram theme` | Renders Mermaid diagrams to SVG or ASCII art with 15 themes and batch support |
| [`eureka`](skills/tools/eureka/SKILL.md) | `shower thought`, `pivot idea`, `brainstorm`, `what if we`, `I'm thinking about`, `eureka` | Turns a raw idea into a structured outline — interviews you one question at a time, challenges assumptions, and surfaces a risk annotation |
| [`scatterbrain`](skills/tools/scatterbrain/SKILL.md) | `scatterbrain`, `lost the thread`, `drifted`, `what was I doing`, `set anchor`, `focus recovery` | Focus-recovery skill — anchors the current thread or recovers it after a tangent, classifying the drift as productive or derailing |
| [`write-a-skill`](skills/tools/write-a-skill/SKILL.md) | `write a skill`, `create a skill`, `new skill`, `add a skill`, `build a skill` | Scaffolds a new skill for this repo — gathers requirements, drafts full SKILL.md with metadata, registers in `plugin.json`, runs quality checklist |

---

## Installation

```sh
skills install Tyler-Reagan/skills
```

## Usage

Invoke by name in a Claude Code session, or describe what you need in natural language — Claude loads the matching skill automatically.

```
/zmk-new-config       /zmk-keymap         /zmk-config
/zmk-display          /zmk-debug          /zmk-lvgl-migrate
/pretty-zmk-keymap
/gitlab-ci-inspector  /gitlab-mr-writing  /homebrew-cli-release
/terraform-plan-summary
/gh-cli               /pretty-mermaid     /eureka
/scatterbrain         /write-a-skill
```

## License

MIT
