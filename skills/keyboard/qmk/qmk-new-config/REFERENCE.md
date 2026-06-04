# QMK New Config — File Templates

The template below is for a 38-key Totem-style layout. Adjust LAYOUT arg count and layer content for your keyboard.

## keymap.c

```c
#include QMK_KEYBOARD_H

enum my_layers { _BASE, _SYM, _NAV, _NUM, _FUN, _BOOT };

// ── Home-row mods (include only if Q5 = yes) ─────────────────────────────────
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

## config.h (keymap level)

```c
#pragma once

// ── Vial (if Q4 = yes) ───────────────────────────────────────────────────────
// Generate UID: python3 util/vial_generate_keyboard_uid.py (in vial-qmk root)
#define VIAL_KEYBOARD_UID { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 }
#define VIAL_UNLOCK_COMBO_ROWS { 0, 4 }   // adjust to two accessible matrix positions
#define VIAL_UNLOCK_COMBO_COLS { 0, 0 }
#define DYNAMIC_KEYMAP_LAYER_COUNT 16

// ── Tap-hold (if Q5 = yes) ───────────────────────────────────────────────────
#define TAPPING_TERM 200
#define PERMISSIVE_HOLD
#define RETRO_TAPPING
#define QUICK_TAP_TERM 120
// #define FLOW_TAP_TERM 150   // uncomment if accidental modifier triggers occur

// ── Lock keys ────────────────────────────────────────────────────────────────
#undef LOCKING_SUPPORT_ENABLE
#undef LOCKING_RESYNC_ENABLE
```

## rules.mk (keymap level)

```makefile
# Vial (if Q4 = yes)
VIA_ENABLE = yes
VIAL_ENABLE = yes

EXTRAKEY_ENABLE = yes   # required for all media keys (KC_MPLY, KC_MUTE, KC_VOLU, etc.)

# Add only features you use:
# TAP_DANCE_ENABLE = yes
# COMBO_ENABLE = yes
# CAPS_WORD_ENABLE = yes
```
