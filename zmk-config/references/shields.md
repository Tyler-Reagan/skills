# ZMK Shield Identifiers

Shields are the `shield:` value in `build.yaml`. A build entry can stack multiple shields (space-separated); order matters. This document explains how shield names are formed, how to find them, and how common categories of shields are typically named.

---

## What is a shield?

In ZMK, a shield is a devicetree overlay applied on top of a board definition. It adds the hardware description that the board itself doesn't include — key matrix, display wiring, encoder pins, etc. A build target is always `board + one or more shields`.

Shields live in `boards/shields/<shield_name>/` inside a ZMK module (or in ZMK's own repo). The directory name is the shield identifier used in `build.yaml`.

---

## Shield stacking order

When multiple shields are listed, they are applied left to right. Order matters when one shield depends on definitions from another:

```yaml
shield: my_keyboard_left display_adapter display_module
#        ^                ^               ^
#        1. key matrix    2. SPI wiring   3. status screen
```

General rule: keyboard shield first, hardware adapters second, software display modules last.

---

## Categories

### Keyboard shields

Defined by the keyboard's ZMK module. Named by the keyboard project with a `_left` / `_right` suffix for split halves:

```
<keyboard_name>_left
<keyboard_name>_right
```

For non-split keyboards, no suffix. The exact name is whatever the keyboard's module author chose — check `boards/shields/` in the module repo.

### Display adapter shields

Wire a display's SPI/I2C pins to the MCU's peripheral. Typically provided by the display hardware's ZMK module:

```
nice_view_adapter   # example: routes nice!view SPI lines on nice!nano
```

An adapter is hardware-specific — it matches a particular display to a particular MCU footprint. Not all display setups need an adapter; some keyboards wire the display directly in their keyboard shield overlay.

### Display module shields

Provide the custom status screen implementation (LVGL widgets, layout). Consumed via community modules:

```
nice_view           # built-in ZMK nice!view screen
nice_view_gem       # community module (M165437)
# ... any module's shield name
```

The shield name is declared in the module's `boards/shields/<name>/` directory.

### Dongle shields

A dongle build typically stacks two shields: the dongle's keyboard role shield (defines split central config, USB HID) and its display shield:

```yaml
shield: my_dongle_central my_dongle_display
```

These names are defined by the dongle module author. There is no ZMK-standard naming convention for dongle shields beyond that.

### Utility shields

| Shield | Purpose |
|--------|---------|
| `settings_reset` | Clear all flash settings — see `references/boards.md` |

---

## Finding shield names for a module

1. Clone or browse the module repo
2. Look in `boards/shields/` — each subdirectory is one shield
3. The directory name is the identifier to use in `build.yaml`
4. Some modules have multiple shields in the same repo (e.g. one per keyboard variant, one per display type)

If a module isn't working and the shield name seems right, verify the module is registered: it needs a `zephyr/module.yml` at its repo root, and it must be listed as a `projects:` entry in your `west.yml`. See the main SKILL.md module-as-repo section.

---

## Naming conventions (not rules)

These are common patterns, not enforced by ZMK:

- `<keyboard>_left` / `<keyboard>_right` for split halves
- `<display>_adapter` for SPI/I2C wiring adapters  
- Module maintainers name their display shields after the module itself

When a user provides a keyboard name but not a shield name, ask them to check `boards/shields/` in their keyboard's ZMK module rather than guessing the shield name.
