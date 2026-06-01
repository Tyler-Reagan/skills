# Keyboard Firmware Skills

Skills covering the full lifecycle of QMK and ZMK keyboard projects — from initial scaffold through keymap authoring, display configuration, and failure diagnosis.

## QMK Skills

| Skill | Role | Use when |
|---|---|---|
| [`qmk-new-config`](qmk-new-config/SKILL.md) | Scaffolding | Starting a new QMK keymap or setting up Vial for the first time |
| [`qmk-keymap`](qmk-keymap/SKILL.md) | Specialist | Editing `keymap.c` — keycodes, MT/LT, tap-dance, combos, macros |
| [`qmk-config`](qmk-config/SKILL.md) | Specialist | Editing `keyboard.json`, `rules.mk`, `config.h`, or Vial config |
| [`qmk-debug`](qmk-debug/SKILL.md) | Diagnostic | Build errors, flash failures, split issues, Vial problems |
| [`pretty-qmk-keymap`](pretty-qmk-keymap/SKILL.md) | Formatting | Generating ASCII art diagrams embedded in `keymap.c` files |

### QMK Load order

**New keymap:** `qmk-new-config` → `qmk-keymap` → `qmk-config` (hardware/Vial changes)

**Existing keymap:** `qmk-keymap` + `qmk-config` as needed

**Something broke:** `qmk-debug`

### QMK Subsystem ownership

- **Hardware definition** → `qmk-config`
- **Keycode/behavior syntax** → `qmk-keymap`
- **Keymap scaffolding** → `qmk-new-config`
- **Failure diagnosis** → `qmk-debug`
- **ASCII diagrams** → `pretty-qmk-keymap`

---

## ZMK Skills

ZMK skills share version awareness across ZMK v0.3 and ZMK main (Zephyr 4.1).

| Skill | Role | Use when |
|---|---|---|
| [`zmk-new-config`](zmk-new-config/SKILL.md) | Scaffolding | Starting a new ZMK keyboard project from scratch |
| [`zmk-keymap`](zmk-keymap/SKILL.md) | Specialist | Editing `.keymap` files — behaviors, layers, combos, macros |
| [`zmk-config`](zmk-config/SKILL.md) | Specialist | Editing `west.yml`, `build.yaml`, or `.conf` Kconfig files |
| [`zmk-display`](zmk-display/SKILL.md) | Specialist | Adding or customizing a display — nice!view, SSD1306, custom status screens |
| [`zmk-debug`](zmk-debug/SKILL.md) | Diagnostic | Build errors, flash failures, split pairing issues, Studio problems |
| [`pretty-zmk-keymap`](pretty-zmk-keymap/SKILL.md) | Formatting | Generating ASCII art diagrams embedded in `.keymap` files |
| [`zmk-lvgl-migrate`](zmk-lvgl-migrate/SKILL.md) | Specialist | Porting a community display module from LVGL v8 (ZMK v0.3) to LVGL v9 (ZMK main) |

### ZMK Load order

**New project:** `zmk-new-config` → `zmk-keymap` → `zmk-config` (if editing config files) → `zmk-display` (if adding a display)

**Existing project:** `zmk-config` (detect version first) → `zmk-keymap` + `zmk-display` as needed

**Something broke:** `zmk-debug`

### ZMK Subsystem ownership

- **Version state detection** → `zmk-config`
- **LVGL compatibility** → `zmk-display`
- **Behavior syntax** → `zmk-keymap`
- **Project scaffolding** → `zmk-new-config`
- **Failure diagnosis** → `zmk-debug`
- **ASCII diagrams** → `pretty-zmk-keymap`
