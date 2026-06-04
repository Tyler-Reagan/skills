---
name: qmk-config
description: QMK project configuration specialist for keyboard.json, rules.mk, config.h, and Vial setup. Use when editing keyboard hardware definitions, enabling features, configuring split keyboard wiring, setting up Vial/VIA, or working with the user config repo + QMK source tree sync pattern.
license: MIT
metadata:
  author: tylerreagan98@gmail.com
  version: "1.1.0"
  domain: keyboard-firmware
  triggers: keyboard.json, rules.mk, config.h, VIA, Vial, vial.json, EE_HANDS, SPLIT_KEYBOARD, TAPPING_TERM, RP2040, USART, flash, UF2, qmk compile, qmk flash
  role: specialist
  scope: implementation
  output-format: code
  related-skills: qmk-keymap, qmk-debug
---

# QMK Config Engineer

Expert in QMK/Vial-QMK project configuration: `keyboard.json`, `rules.mk`, `config.h`, and Vial.

## Domain Language

- **keyboard.json** — Primary hardware definition. Declares MCU, matrix, USB IDs, layouts, split config. Supersedes `info.json` in QMK 0.18+. Do not maintain both.
- **rules.mk** — Build-time feature flags. Keyboard-level applies to all keymaps; keymap-level applies to one.
- **config.h** — C preprocessor defines. Timing, pin assignments, behavior options. Same keyboard/keymap hierarchy.
- **Vial** — VIA fork with live tap-dance, combo, QMK Settings editing. Needs `vial.json` and UID in keymap `config.h`.
- **EE_HANDS** — Handedness via EEPROM. Each half flashed once with `flash-left`/`flash-right`; subsequent updates use same UF2.
- **user config repo** — Separate git repo holding your keymaps; syncs to QMK source tree via Makefile.

## File Hierarchy

```
keyboards/<vendor>/<kb>/
├── keyboard.json       ← hardware definition (MCU, matrix, USB, layouts)
├── config.h            ← keyboard-level C defines (pins, split, timing)
├── rules.mk            ← keyboard-level feature flags (usually minimal)
└── keymaps/<keymap>/
    ├── keymap.c
    ├── config.h        ← keymap-level overrides (tapping term, Vial UID)
    ├── rules.mk        ← keymap-level flags (VIA/Vial goes HERE)
    └── vial.json
```

## Gotchas

**`info.json` and `keyboard.json` must not coexist.** QMK silently uses one and ignores the other, causing unpredictable behavior. Delete `info.json` once `keyboard.json` exists.

**`VIA_ENABLE` and `VIAL_ENABLE` belong in keymap `rules.mk`, not keyboard-level.** Setting them at keyboard level breaks non-Vial keymaps for the same board — they can't build without Vial sources.

**`DYNAMIC_KEYMAP_LAYER_COUNT` must match `vial.json`.** Mismatch corrupts Vial's layer display. Set both to the same value and rebuild.

**`SERIAL_USART_PIN_SWAP` is critical for RP2040 splits.** Without it, the non-master half sends on the wrong pin. Required when using `SERIAL_USART_FULL_DUPLEX`. Missing it causes all slave-half keys to be dead.

**`RP2040_BOOTLOADER_DOUBLE_TAP_RESET_TIMEOUT` units are ambiguous.** Milliseconds on some QMK versions, microseconds on others. If double-tap isn't working, try `200U` (200ms) vs `1000U` (1000µs). Check the QMK version's behavior.

**`EXTRAKEY_ENABLE` is required for all media keys.** `KC_MPLY`, `KC_MUTE`, `KC_VOLU`, etc. silently no-op without it — no error, they just don't send anything.

## Constraints

- `info.json` and `keyboard.json` must not coexist
- `VIA_ENABLE`/`VIAL_ENABLE` at keymap level only
- `DYNAMIC_KEYMAP_LAYER_COUNT` must match `vial.json`
- `AUTO_SHIFT_ENABLE = yes` in `rules.mk` required before any `AUTO_SHIFT_*` config.h defines
- `EXTRAKEY_ENABLE = yes` required for all media/consumer keys

For full `keyboard.json` format, `config.h` options, `rules.mk` flags, Vial `vial.json`, split patterns, and UF2 flash workflow, see [REFERENCE.md](REFERENCE.md).
