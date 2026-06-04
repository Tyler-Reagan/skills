---
name: qmk-keymap
description: QMK keymap specialist covering keymap.c authoring — basic/shifted keycodes, modifier wrappers, MT/LT hold-tap, tap-dance, combos, one-shot keys, macros, and tap-hold configuration. Use when editing keymap.c, asking about MT or LT behavior, home-row mods, tap dance, combos, SEND_STRING macros, or which keycodes to use for shifted symbols.
license: MIT
metadata:
  author: tylerreagan98@gmail.com
  version: "1.1.0"
  domain: keyboard-firmware
  triggers: qmk, keymap.c, MT, LT, MO, TG, OSM, OSL, HYPR, tap-dance, combos, home-row mods, TAPPING_TERM, SEND_STRING, KC_, keymap
  role: specialist
  scope: implementation
  output-format: code
  related-skills: qmk-config, qmk-debug, pretty-qmk-keymap
---

# QMK Keymap Engineer

Expert in QMK/Vial-QMK `keymap.c` authoring.

## Domain Language

- **keycode** — 16-bit value encoding a key press. Basic keycodes ≤0x00FF; quantum/advanced use higher bits.
- **layer** — Numbered overlay (0 = default). Higher active layers take priority; transparent keys pass through.
- **hold-tap** — Different action on hold vs. tap. `MT()` and `LT()` are presets.
- **XXXXXXX** — `KC_NO`: swallows the event, no output.
- **_______** — `KC_TRNS`: transparent, passes through to the next active lower layer.

## File Structure

```c
#include QMK_KEYBOARD_H

enum my_layers { _BASE, _SYM, _NAV };
enum custom_keycodes { MY_KEY = SAFE_RANGE };  // only for custom macros

#define GUI_S  MT(MOD_LGUI, KC_S)   // #define aliases keep LAYOUT() readable
#define SYM_SPC LT(_SYM, KC_SPC)

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [_BASE] = LAYOUT( /* ... */ ),
};

bool process_record_user(uint16_t keycode, keyrecord_t *record) { ... }  // for custom keycodes
```

`PROGMEM` stores the keymap in flash — required on AVR, harmless on ARM/RP2040.

## Key Behavior Summary

| Behavior | Hold | Tap |
|---|---|---|
| `&kp KEYCODE` | — | Keycode |
| `MT(mod, kc)` | Modifier | Basic keycode |
| `LT(layer, kc)` | Momentary layer | Basic keycode |
| `MO(layer)` | Momentary layer | — |
| `OSM(mod)` | Normal modifier | One-shot modifier |
| `OSL(layer)` | Normal MO | One-shot layer |
| `TG(layer)` | — | Toggle layer |

**Layer precedence:** QMK scans from highest active layer down. First non-transparent key wins. `_______` passes; `XXXXXXX` blocks.

**`_______` on layer 0 has no effect** — there is no lower active layer to fall through to.

## Gotchas

**MT/LT tap argument must be a basic keycode (≤0xFF).** Shifted aliases (`KC_UNDS`, `KC_LCBR`, `KC_LPRN`), modifier wrappers (`C(KC_A)`), and quantum keycodes (`MO()`) cannot be used as the tap argument. Intercept in `process_record_user()` instead.

**`EXTRAKEY_ENABLE` required for all media keys.** `KC_MPLY`, `KC_MUTE`, `KC_VOLU`, and all other consumer/media keycodes silently no-op without `EXTRAKEY_ENABLE = yes` in `rules.mk`. No compile error — they just don't send anything.

**macOS uses GUI, not Ctrl.** `G(KC_C)` for Cmd+C, not `C(KC_C)`. The modifier letters: `C` = Ctrl, `G` = GUI/Cmd, `S` = Shift, `A` = Alt.

**`SAFE_RANGE` for custom keycodes.** Always start custom keycode enums at `SAFE_RANGE`. Forgetting collides silently with QMK internal keycodes.

**`PROGMEM` combo arrays are required.** On AVR, combo key sequences without `const uint16_t PROGMEM` cause undefined behavior. Always: `const uint16_t PROGMEM combo_name[] = {..., COMBO_END};`

## Constraints

- MT/LT `kc` argument must be basic (≤0xFF) — shifted aliases and modifier wrappers not allowed
- Shifted aliases are fine directly in LAYOUT() — only restricted inside MT()/LT()
- `_______` on layer 0 has no effect
- `COMBO_ENABLE` and `TAP_DANCE_ENABLE` must be in `rules.mk` — not enabled by default
- Always start custom keycode enums at `SAFE_RANGE`

For the full keycode table, modifier wrappers, layer switching, mod-tap, tap-dance, combos, macros, one-shot keys, and tap-hold configuration, see [REFERENCE.md](REFERENCE.md). For the full keycode list, see [`references/keycodes.md`](references/keycodes.md).
