# Tyler Reagan's Claude Code Skills

A curated collection of [Claude Code skills](https://skills.sh) built around deep domain expertise in ZMK keyboard firmware, infrastructure automation, and engineering workflow tooling.

## Categories

| Category | Skills | Focus |
|---|---|---|
| [`keyboard/`](skills/keyboard/README.md) | 12 | ZMK and QMK firmware — scaffold, keymap, config, display, debug, diagrams, LVGL migration |
| [`infrastructure/`](skills/infrastructure/README.md) | 4 | GitLab CI/CD, MR writing, Terraform plan analysis, Homebrew CLI release |
| [`tools/`](skills/tools/README.md) | 5 | Mermaid diagrams, idea development, focus recovery, skill authoring, memory auditing |

---

### keyboard

Skills for the full lifecycle of ZMK and QMK keyboard projects, organized under [`keyboard/zmk/`](skills/keyboard/zmk/) and [`keyboard/qmk/`](skills/keyboard/qmk/).

**ZMK**

| Skill | Triggers | Description |
|---|---|---|
| [`zmk-new-config`](skills/keyboard/zmk/zmk-new-config/SKILL.md) | `new zmk config`, `set up zmk`, `start zmk project`, `new keyboard` | Scaffolds a new ZMK config repo — quizzes hardware and feature choices then generates `west.yml`, `build.yaml`, and per-side `.conf` files |
| [`zmk-keymap`](skills/keyboard/zmk/zmk-keymap/SKILL.md) | `.keymap`, `behaviors`, `combos`, `hold-tap`, `tap-dance`, `mod-morph`, `layers` | Full ZMK behavior library across v0.3 and ZMK main — kp, mt, lt, mo, sk, caps_word, macros, combos, Bluetooth, mouse emulation, sensor bindings |
| [`zmk-config`](skills/keyboard/zmk/zmk-config/SKILL.md) | `west.yml`, `build.yaml`, `.conf`, `shield`, `snippet`, `UF2`, `ZMK Studio` | Project configuration: manifest authoring, build targets, Kconfig options, split keyboard topology, and the UF2 flash workflow |
| [`zmk-display`](skills/keyboard/zmk/zmk-display/SKILL.md) | `display`, `LVGL`, `nice!view`, `SSD1306`, `status screen`, `widget`, `dongle screen` | Display subsystem — hardware support, LVGL v8/v9 widget APIs, custom status screen authoring, nice-view ecosystem modules |
| [`zmk-debug`](skills/keyboard/zmk/zmk-debug/SKILL.md) | `build error`, `board not found`, `KeyError qualifiers`, `not pairing`, `display blank`, `Studio not connecting` | Five-phase diagnostic for build errors, flash failures, split pairing issues, display problems, and ZMK Studio failures |
| [`zmk-lvgl-migrate`](skills/keyboard/zmk/zmk-lvgl-migrate/SKILL.md) | `lvgl migrate`, `v8 to v9`, `port display`, `lv_canvas_draw undeclared`, `LV_IMG_CF undeclared`, `zmk main display` | Migrates ZMK nice!view display modules from LVGL v8 (ZMK v0.3) to LVGL v9 (ZMK main / Zephyr 4.1) — step-by-step checklist with wrapper function strategy |
| [`pretty-zmk-keymap`](skills/keyboard/zmk/pretty-zmk-keymap/SKILL.md) | `ascii art keymap`, `keymap diagram`, `keymap visualization`, `box drawing` | Generates box-drawing ASCII art diagrams embedded above each layer's bindings block |

**QMK**

| Skill | Triggers | Description |
|---|---|---|
| [`qmk-new-config`](skills/keyboard/qmk/qmk-new-config/SKILL.md) | `new qmk config`, `set up qmk`, `new qmk keymap`, `set up Vial` | Scaffolds a new QMK keymap or sets up Vial for the first time |
| [`qmk-keymap`](skills/keyboard/qmk/qmk-keymap/SKILL.md) | `keymap.c`, `MT`, `LT`, `tap-dance`, `combos`, `macros` | Editing `keymap.c` — keycodes, MT/LT, tap-dance, combos, macros |
| [`qmk-config`](skills/keyboard/qmk/qmk-config/SKILL.md) | `keyboard.json`, `rules.mk`, `config.h`, `Vial config` | Editing `keyboard.json`, `rules.mk`, `config.h`, or Vial config |
| [`qmk-debug`](skills/keyboard/qmk/qmk-debug/SKILL.md) | `qmk build error`, `flash failed`, `split not working`, `Vial not showing` | Build errors, flash failures, split issues, Vial problems |
| [`pretty-qmk-keymap`](skills/keyboard/qmk/pretty-qmk-keymap/SKILL.md) | `ascii art keymap`, `keymap diagram in qmk`, `box drawing keymap.c` | Generates box-drawing ASCII art diagrams embedded in `keymap.c` files |

> [!NOTE]
> ZMK: start with `zmk-new-config` for new projects; load `zmk-keymap` + `zmk-config` + `zmk-display` on existing ones; use `zmk-debug` when something breaks.
> QMK: start with `qmk-new-config`; load `qmk-keymap` + `qmk-config` as needed; use `qmk-debug` when something breaks.

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
| [`pretty-mermaid`](skills/tools/pretty-mermaid/SKILL.md) | `render mermaid`, `flowchart`, `sequence diagram`, `ER diagram`, `apply diagram theme` | Renders Mermaid diagrams to SVG or ASCII art with 15 themes and batch support |
| [`eureka`](skills/tools/eureka/SKILL.md) | `shower thought`, `pivot idea`, `brainstorm`, `what if we`, `I'm thinking about`, `eureka` | Turns a raw idea into a structured outline — interviews you one question at a time, challenges assumptions, and surfaces a risk annotation |
| [`scatterbrain`](skills/tools/scatterbrain/SKILL.md) | `scatterbrain`, `lost the thread`, `drifted`, `what was I doing`, `set anchor`, `focus recovery` | Focus-recovery skill — anchors the current thread or recovers it after a tangent, classifying the drift as productive or derailing |
| [`write-a-skill`](skills/tools/write-a-skill/SKILL.md) | `write a skill`, `create a skill`, `new skill`, `add a skill`, `build a skill` | Authors a new skill in any skills repo — discovers the repo's layout, frontmatter, and registration rather than assuming them; description-first, lean workflow |
| [`audit-memories`](skills/tools/audit-memories/SKILL.md) | `audit my memories`, `clean up memory`, `prune stale memories`, `consolidate memories`, `memory hygiene` | Audits a project's `~/.claude` memory files — classifies each keep/prune/merge/fix, verifies claims against the live repo, proposes a review-first consolidation plan before changing anything |

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
/qmk-new-config       /qmk-keymap         /qmk-config
/qmk-debug            /pretty-qmk-keymap
/gitlab-ci-inspector  /gitlab-mr-writing  /homebrew-cli-release
/terraform-plan-summary
/pretty-mermaid       /eureka             /scatterbrain
/write-a-skill        /audit-memories
```

## License

MIT
