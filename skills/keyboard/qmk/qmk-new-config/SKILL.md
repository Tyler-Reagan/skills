---
name: qmk-new-config
description: Scaffolds a new QMK keyboard keymap by generating keymap.c, config.h, rules.mk, and (optionally) a Vial setup from answers to five questions about hardware and features. Use when the user wants to start a new QMK keymap, set up Vial for the first time, or create a personal keymap for an existing keyboard.
license: MIT
metadata:
  author: tylerreagan98@gmail.com
  version: "1.1.0"
  domain: keyboard-firmware
  triggers: new qmk keymap, scaffold qmk, create keymap, set up vial, new keyboard layout, qmk starter, keymap template
  role: scaffolding
  scope: implementation
  output-format: code
  related-skills: qmk-keymap, qmk-config, qmk-debug
---

# QMK New Config Scaffolder

Generates `keymap.c`, `config.h`, `rules.mk`, and optionally `vial.json`. Always pairs with **qmk-keymap** for editing and **qmk-config** for hardware-level changes.

## Domain Language

- **keyboard** — Hardware definition in QMK (`keyboards/<vendor>/<kb>/`). Contains the LAYOUT macro. Do not modify for a personal keymap.
- **keymap** — Your personal key assignments. Lives at `keyboards/<vendor>/<kb>/keymaps/<yourname>/`.
- **user config repo** — Personal git repo containing just your keymaps, synced to QMK source at compile time.
- **Vial** — VIA fork with live tap-dance, combo, and QMK Settings editing. Requires `vial.json` and UID.

## Quiz — collect all before generating

**Q1. Keyboard (QMK path)?** Format: `vendor/keyboard_name` (e.g. `geigeigeist/totem`, `crkbd`). Run `qmk list-keyboards` if unsure.

**Q2. MCU / split topology?**
- `rp2040-split` — RP2040, two-piece TRRS split
- `rp2040-unibody` — RP2040, single PCB
- `avr-split` — ATmega32u4 split
- `avr-unibody` — ATmega32u4, single PCB

**Q3. Key count / layout style?** Count LAYOUT macro args in `<kb>.h`. Common: 34 (5-col), 38 (Totem), 42 (Corne), 58 (Kyria).

**Q4. Vial?** Yes adds `VIA_ENABLE` + `VIAL_ENABLE` to `rules.mk` and Vial UID stub to `config.h`.

**Q5. Home-row mods?** Yes generates `#define` aliases for GASC home-row mod-taps and adds tap-hold config.

## Generate the files

See [REFERENCE.md](REFERENCE.md) for full file templates (keymap.c, config.h, rules.mk). Apply these rules:

- Adjust the LAYOUT template to match the keyboard's actual arg count from Q3
- For Vial: replace the placeholder UID (`0x00, ...`) with a generated one before first flash
- `VIA_ENABLE` and `VIAL_ENABLE` go in the **keymap-level** `rules.mk` only

## Gotchas

**`XXXXXXX` vs `_______` confusion is the most common mistake.** `XXXXXXX` (`KC_NO`) swallows the key — no output, no passthrough. `_______` (`KC_TRNS`) passes through to the next active lower layer. On non-base layers, unassigned keys should almost always be `_______` (inherit from base), not `XXXXXXX` (block).

**Vial UID placeholder must be replaced before first flash.** All-zeros UID (`{ 0x00, 0x00, ... }`) conflicts with any other keyboard that left the placeholder. Generate a unique one: `python3 util/vial_generate_keyboard_uid.py` from the `vial-qmk` root.

**LAYOUT arg count must exactly match the keyboard's macro.** The template is for 38-key Totem. For other keyboards, count args in `<kb>.h` and adjust every layer — too many or too few causes a compile error.

**EE_HANDS requires per-half flashing.** For split keyboards, flash each half separately with the handedness bootloader on the first flash (`-bl uf2-split-left` / `-bl uf2-split-right`). Subsequent flashes can use the same UF2 for both.

## After generating

1. **Replace Vial UID** (if Vial selected): `python3 util/vial_generate_keyboard_uid.py`
2. **Adjust LAYOUT args** to match the keyboard's actual LAYOUT macro
3. **Compile**: `qmk compile -kb <kb> -km <km>` or `make compile` (user config repo)
4. **First-time split flash**: `make flash-left` then `make flash-right` for EE_HANDS
5. **Tune tap-hold**: start with `TAPPING_TERM 200` + `PERMISSIVE_HOLD`; add `FLOW_TAP_TERM 150` if accidental modifiers occur

## Anti-Patterns

**DO NOT** generate files before knowing keyboard path and MCU — LAYOUT arg count depends on these.

**DO NOT** use `XXXXXXX` where `_______` is intended on non-base layers.

**DO NOT** put `VIA_ENABLE`/`VIAL_ENABLE` in keyboard-level `rules.mk`.

**DO NOT** leave the placeholder Vial UID as all zeros.
