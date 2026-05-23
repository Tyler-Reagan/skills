# Tyler Reagan's Claude Code Skills

A curated collection of [Claude Code skills](https://skills.sh) built around deep domain expertise in ZMK keyboard firmware, infrastructure automation, and engineering workflow tooling.

## Skills

### ZMK Firmware

Skills for authoring, configuring, and documenting ZMK-based keyboard firmware. They share version awareness across ZMK v0.3 and ZMK main (Zephyr 4.1) and cross-reference each other for seamless coverage.

| Skill | Triggers | Description |
|---|---|---|
| [`zmk-new-config`](zmk-new-config/SKILL.md) | `new zmk config`, `set up zmk`, `start zmk project`, `new keyboard` | Scaffolds a new ZMK config repo from scratch — quizzes hardware and feature choices then generates `west.yml`, `build.yaml`, and per-side `.conf` files |
| [`zmk-keymap`](zmk-keymap/SKILL.md) | `.keymap`, `behaviors`, `combos`, `hold-tap`, `tap-dance`, `mod-morph`, `layers` | Full ZMK behavior library — kp, mt, lt, mo, sk, caps_word, macros, combos, Bluetooth, mouse emulation, and sensor bindings across both release lines |
| [`zmk-config`](zmk-config/SKILL.md) | `west.yml`, `build.yaml`, `.conf`, `shield`, `snippet`, `UF2`, `ZMK Studio` | Project configuration: manifest authoring, build targets, Kconfig options, split keyboard topology, and the UF2 flash workflow |
| [`zmk-display`](zmk-display/SKILL.md) | `display`, `LVGL`, `nice!view`, `SSD1306`, `status screen`, `widget`, `dongle screen` | Display subsystem — hardware support, LVGL v8/v9 widget APIs, custom status screen authoring, and nice-view ecosystem modules |
| [`zmk-debug`](zmk-debug/SKILL.md) | `build error`, `board not found`, `KeyError qualifiers`, `not pairing`, `display blank`, `Studio not connecting` | Five-phase diagnostic workflow for build errors, flash failures, split pairing issues, display problems, and ZMK Studio failures |
| [`pretty-zmk-keymap`](pretty-zmk-keymap/SKILL.md) | `ascii art keymap`, `keymap diagram`, `keymap visualization`, `box drawing` | Generates box-drawing ASCII art diagrams embedded above each layer's bindings block, aligned to the `bindings = <` indentation |

> [!NOTE]
> Start with `zmk-new-config` for any new keyboard project. Load `zmk-keymap`, `zmk-config`, and `zmk-display` together when working on an existing ZMK project. Use `zmk-debug` when something breaks.

### Infrastructure & CI/CD

| Skill | Triggers | Description |
|---|---|---|
| [`terraform-plan-summary`](terraform-plan-summary/SKILL.md) | `terraform plan`, `CI plan job`, `what would this plan change` | Strips GitLab runner noise and ANSI escapes from plan logs; extracts per-resource actions, key attribute diffs, grouped repetitive changes, warnings, and errors into a ≤40-line summary |
| [`gitlab-ci-inspector`](gitlab-ci-inspector/SKILL.md) | GitLab job URL, pipeline URL, `why did this pipeline fail` | Resolves job IDs from URLs, fetches logs via `glab` CLI or REST API, and diagnoses failures against a table of common error patterns (Terraform, image pull, IAM, ECR auth, pod scheduling) |

### Developer Workflow

| Skill | Triggers | Description |
|---|---|---|
| [`gitlab-mr-writing`](gitlab-mr-writing/SKILL.md) | `write MR description`, `merge request body`, `technical reviewer guide` | Produces calibrated MR descriptions (Focused / Multi-theme / Architectural) and optional Technical Reviewer Guides with end-state deltas and reviewer focus areas |
| [`gh-cli`](gh-cli/SKILL.md) | `gh`, `GitHub CLI`, `pull request`, `GitHub Actions`, `gh pr`, `gh issue` | Comprehensive reference for the GitHub CLI — repos, issues, PRs, Actions, releases, projects, codespaces, search, and API access |

### Visualization

| Skill | Triggers | Description |
|---|---|---|
| [`pretty-mermaid`](pretty-mermaid/SKILL.md) | `render mermaid`, `flowchart`, `sequence diagram`, `ER diagram`, `apply diagram theme` | Renders Mermaid diagrams to SVG or ASCII art; supports 15 themes (tokyo-night recommended), batch processing, and all standard diagram types |

## Installation

Add this collection via [skills.sh](https://skills.sh):

```sh
# Install the full collection
skills install Tyler-Reagan/skills
```

Or install individual skills by name:

```sh
skills install Tyler-Reagan/skills/zmk-keymap
skills install Tyler-Reagan/skills/zmk-config
skills install Tyler-Reagan/skills/zmk-display
```

## Usage

Skills are invoked by name within a Claude Code session:

```
/zmk-new-config
/zmk-keymap
/zmk-config
/zmk-display
/zmk-debug
/pretty-zmk-keymap
/gitlab-mr-writing
/gitlab-ci-inspector
/terraform-plan-summary
/gh-cli
/pretty-mermaid
```

Alternatively, describe what you need in natural language — Claude Code loads the appropriate skill automatically based on your request.

## References

Several skills include reference files covering hardware specs, keycodes, and API details:

- `zmk-keymap/references/` — keycode tables, supported boards and shields
- `zmk-config/references/` — board and shield listings for build targets
- `zmk-display/references/` — display hardware specs and shield compatibility
- `pretty-zmk-keymap/references/` — layout templates for 34-key and 38-key split keyboards
- `pretty-mermaid/references/` — diagram type guide, theme index, and API reference

## License

MIT
