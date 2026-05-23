# Keyboard Firmware Skills

ZMK firmware skills covering the full lifecycle of a keyboard project — from initial scaffold through keymap authoring, display configuration, and failure diagnosis. All skills share version awareness across ZMK v0.3 and ZMK main (Zephyr 4.1).

## Skills

| Skill | Role | Use when |
|---|---|---|
| [`zmk-new-config`](zmk-new-config/SKILL.md) | Scaffolding | Starting a new ZMK keyboard project from scratch |
| [`zmk-keymap`](zmk-keymap/SKILL.md) | Specialist | Editing `.keymap` files — behaviors, layers, combos, macros |
| [`zmk-config`](zmk-config/SKILL.md) | Specialist | Editing `west.yml`, `build.yaml`, or `.conf` Kconfig files |
| [`zmk-display`](zmk-display/SKILL.md) | Specialist | Adding or customizing a display — nice!view, SSD1306, custom status screens |
| [`zmk-debug`](zmk-debug/SKILL.md) | Diagnostic | Build errors, flash failures, split pairing issues, Studio problems |
| [`pretty-zmk-keymap`](pretty-zmk-keymap/SKILL.md) | Formatting | Generating ASCII art diagrams embedded in `.keymap` files |

## Load order

**New project:** `zmk-new-config` → `zmk-keymap` → `zmk-config` (if editing config files) → `zmk-display` (if adding a display)

**Existing project:** `zmk-config` (detect version first) → `zmk-keymap` + `zmk-display` as needed

**Something broke:** `zmk-debug`

## Subsystem ownership

Each skill owns its domain. Do not duplicate across skills.

- **Version state detection** → `zmk-config`
- **LVGL compatibility** → `zmk-display`
- **Behavior syntax** → `zmk-keymap`
- **Project scaffolding** → `zmk-new-config`
- **Failure diagnosis** → `zmk-debug`
- **ASCII diagrams** → `pretty-zmk-keymap`
