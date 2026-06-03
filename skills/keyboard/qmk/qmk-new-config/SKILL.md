---
name: qmk-new-config
description: Scaffolds a new QMK keyboard keymap by generating keymap.c, config.h, rules.mk, and (optionally) a Vial setup from answers to five questions about hardware and features. Use when the user wants to start a new QMK keymap, set up Vial for the first time, or create a personal keymap for an existing keyboard.
license: MIT
metadata:
  author: tylerreagan98@gmail.com
  version: "1.0.0"
  domain: keyboard-firmware
  triggers: new qmk keymap, scaffold qmk, create keymap, set up vial, new keyboard layout, qmk starter, keymap template
  role: scaffolding
  scope: implementation
  output-format: code
  related-skills: qmk-keymap, qmk-config, qmk-debug
---

# QMK New Config Scaffolder

Generates a working keymap directory: `keymap.c`, `config.h`, `rules.mk`, and optionally `vial.json` configuration. Always pairs with **qmk-keymap** for editing and **qmk-config** for hardware-level changes.

## Domain Language

- **keyboard** — The hardware definition in QMK (`keyboards/<vendor>/<kb>/`). Contains the LAYOUT macro, matrix, USB config. You do not modify this for a personal keymap.
- **keymap** — Your personal key assignments. Lives at `keyboards/<vendor>/<kb>/keymaps/<yourname>/`. This is what the scaffolder generates.
- **user config repo** — A personal git repo containing just your keymaps, synced to the QMK source tree at compile time. Lets you track your layout without forking QMK.
- **Vial** — A VIA fork with live tap-dance, combo, and QMK Settings editing. Requires a `vial.json` and UID.

---

## Quiz — collect all answers before generating

**Q1. What keyboard (QMK path)?**
Format: `vendor/keyboard_name` (e.g. `geigeigeist/totem`, `splitkb/kyria_rev3`, `crkbd`). Check `qmk list-keyboards` if unsure.

**Q2. What MCU / split topology?**
- `rp2040-split` — RP2040, two-piece TRRS split (e.g. Totem, Urchin)
- `rp2040-unibody` — RP2040, single PCB
- `avr-split` — ATmega32u4 split (e.g. Corne, Kyria)
- `avr-unibody` — ATmega32u4, single PCB

**Q3. How many keys? Layout style?**
Count the LAYOUT macro arguments in `<kb>.h`. Common: 34 (5-col), 38 (Totem/5+1-col), 42 (Corne), 58 (Kyria).

**Q4. Vial?**
Yes or no. Adds `VIA_ENABLE` + `VIAL_ENABLE` to `rules.mk`, adds Vial UID stub and `DYNAMIC_KEYMAP_LAYER_COUNT` to `config.h`.

**Q5. Home-row mods?**
Yes or no. If yes, generates `#define` aliases for GASC home-row mod-taps and adds recommended tap-hold config.

---

## Output Files

Generate all files with inline comments. After generating, tell the user what to do next (see After Generating).

### keymap.c

```c
#include QMK_KEYBOARD_H

enum my_layers {
    _BASE,
    _SYM,
    _NAV,
    _NUM,
    _FUN,
    _BOOT,
};

// ── Home-row mods ─────────────────────────────────────────────────────────────
// (include only if Q5 = yes)
#define GUI_S  MT(MOD_LGUI, KC_S)
#define CTL_D  MT(MOD_LCTL, KC_D)
#define SHT_F  MT(MOD_LSFT, KC_F)
#define SHT_J  MT(MOD_RSFT, KC_J)
#define CTL_K  MT(MOD_RCTL, KC_K)
#define GUI_L  MT(MOD_RGUI, KC_L)

// ── Thumb layer-taps ──────────────────────────────────────────────────────────
#define SYM_SPC LT(_SYM, KC_SPC)
#define NAV_TAB LT(_NAV, KC_TAB)
#define NUM_ENT LT(_NUM, KC_ENT)
#define FUN_DEL LT(_FUN, KC_DEL)

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {

   [_BASE] = LAYOUT(
//╷         ╷         ╷         ╷         ╷         ╷
              KC_Q,     KC_W,     KC_E,     KC_R,     KC_T,        KC_Y,     KC_U,     KC_I,     KC_O,     KC_P,
              KC_A,     GUI_S,    CTL_D,    SHT_F,    KC_G,        KC_H,     SHT_J,    CTL_K,    GUI_L,    KC_SCLN,
   XXXXXXX,   KC_Z,     KC_X,     KC_C,     KC_V,     KC_B,        KC_N,     KC_M,     KC_COMM,  KC_DOT,   KC_SLSH,  XXXXXXX,
                                  KC_ESC,   NAV_TAB,  SYM_SPC,     KC_BSPC,  NUM_ENT,  FUN_DEL
   ),

   [_SYM] = LAYOUT(
//╷         ╷         ╷         ╷         ╷         ╷
              XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,     KC_MINS,  KC_LCBR,  KC_RCBR,  KC_GRV,   KC_EQL,
              KC_LGUI,  KC_LALT,  KC_LCTL,  KC_LSFT,  XXXXXXX,     KC_UNDS,  KC_LBRC,  KC_RBRC,  KC_QUOT,  KC_DLR,
   XXXXXXX,   XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,     XXXXXXX,  KC_AMPR,  KC_BSLS,  KC_ASTR,  XXXXXXX,  XXXXXXX,
                                  XXXXXXX,  XXXXXXX,  _______,     KC_AT,    KC_LPRN,  KC_RPRN
   ),

   [_NAV] = LAYOUT(
//╷         ╷         ╷         ╷         ╷         ╷
              XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,     XXXXXXX,  KC_MPRV,  KC_VOLD,  KC_VOLU,  KC_MNXT,
              KC_LGUI,  KC_LALT,  KC_LCTL,  KC_LSFT,  XXXXXXX,     XXXXXXX,  KC_LEFT,  KC_DOWN,  KC_UP,    KC_RGHT,
   XXXXXXX,   XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,     XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,
                                  XXXXXXX,  _______,  XXXXXXX,     KC_MPLY,  XXXXXXX,  KC_MUTE
   ),

   [_NUM] = LAYOUT(
//╷         ╷         ╷         ╷         ╷         ╷
              KC_MINS,  KC_7,     KC_8,     KC_9,     XXXXXXX,     XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,
              KC_EQL,   KC_4,     KC_5,     KC_6,     XXXXXXX,     XXXXXXX,  KC_RSFT,  KC_RCTL,  KC_RALT,  KC_RGUI,
   XXXXXXX,   XXXXXXX,  KC_1,     KC_2,     KC_3,     XXXXXXX,     XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,
                                  KC_DOT,   KC_0,     XXXXXXX,     XXXXXXX,  _______,  XXXXXXX
   ),

   [_FUN] = LAYOUT(
//╷         ╷         ╷         ╷         ╷         ╷
              KC_F12,   KC_F7,    KC_F8,    KC_F9,    XXXXXXX,     XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,
              KC_F11,   KC_F4,    KC_F5,    KC_F6,    XXXXXXX,     XXXXXXX,  KC_RSFT,  KC_RCTL,  KC_RALT,  KC_RGUI,
   XXXXXXX,   KC_F10,   KC_F1,    KC_F2,    KC_F3,    XXXXXXX,     XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,
                                  XXXXXXX,  KC_SPC,   KC_TAB,      XXXXXXX,  XXXXXXX,  _______
   ),

   [_BOOT] = LAYOUT(
//╷         ╷         ╷         ╷         ╷         ╷
              QK_RBT,   XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,     XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,  QK_RBT,
              XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,     XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,
   QK_BOOT,   XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,     XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,  XXXXXXX,  QK_BOOT,
                                  XXXXXXX,  XXXXXXX,  XXXXXXX,     XXXXXXX,  XXXXXXX,  XXXXXXX
   ),
};
```

**Adjust for actual key count:** The template above is for 38-key Totem-style. For different layouts (34-key = no pinky col, 42-key Corne = no pinky + 3 thumbs, etc.), expand or trim rows to match the keyboard's LAYOUT macro.

### config.h (keymap level)

```c
#pragma once

// ── Vial (include section only if Q4 = yes) ───────────────────────────────────
// Generate UID: python3 util/vial_generate_keyboard_uid.py (in vial-qmk root)
#define VIAL_KEYBOARD_UID { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 }
#define VIAL_UNLOCK_COMBO_ROWS { 0, 4 }   // adjust to two accessible matrix positions
#define VIAL_UNLOCK_COMBO_COLS { 0, 0 }
#define DYNAMIC_KEYMAP_LAYER_COUNT 16

// ── Tap-hold (include if Q5 = yes) ───────────────────────────────────────────
#define TAPPING_TERM 200
#define PERMISSIVE_HOLD
#define RETRO_TAPPING
#define QUICK_TAP_TERM 120
// #define FLOW_TAP_TERM 150   // uncomment if accidental modifier triggers occur

// ── Lock keys ─────────────────────────────────────────────────────────────────
#undef LOCKING_SUPPORT_ENABLE
#undef LOCKING_RESYNC_ENABLE
```

Replace the placeholder UID with the generated value before first flash.

### rules.mk (keymap level)

```makefile
# Vial (if Q4 = yes)
VIA_ENABLE = yes
VIAL_ENABLE = yes

# Add only features you use
# TAP_DANCE_ENABLE = yes
# COMBO_ENABLE = yes
# CAPS_WORD_ENABLE = yes
```

---

## After Generating

Tell the user:

1. **Replace the Vial UID** (if Vial selected): run `python3 util/vial_generate_keyboard_uid.py` from the `vial-qmk` root and paste the result into `config.h`.

2. **Adjust LAYOUT args** to match the actual keyboard's LAYOUT macro. Count args in `<kb>.h` and verify the generated layer count matches.

3. **Sync and compile**: If using the user config repo pattern:
   ```bash
   make sync-to-fw && make compile
   ```
   Or directly: `qmk compile -kb <kb> -km <km>`

4. **First-time flash on a split**: Flash each half separately with `flash-left` / `flash-right` to set EE_HANDS handedness. Subsequent flashes can use the same UF2.

5. **Tune tap-hold timing**: Start with `TAPPING_TERM 200` + `PERMISSIVE_HOLD`. If accidental modifier triggers occur during fast typing, add `FLOW_TAP_TERM 150`. Use **qmk-debug** Phase 2E if problems persist.

---

## Anti-Patterns

**DO NOT** generate files before knowing the keyboard path and MCU type — the LAYOUT arg count and split config depend on these.

**DO NOT** use `XXXXXXX` where `_______` is intended. `XXXXXXX` blocks the key entirely; `_______` passes to the next active layer. On all non-base layers, unassigned keys should typically be `XXXXXXX` (intentionally blocked) or `_______` (intentionally transparent).

**DO NOT** put `VIA_ENABLE` or `VIAL_ENABLE` in the keyboard-level `rules.mk`. They belong only in the keymap-level `rules.mk`.

**DO NOT** leave the placeholder `VIAL_KEYBOARD_UID` as all zeros — it must be unique or Vial will conflict with other keyboards using the same UID.
