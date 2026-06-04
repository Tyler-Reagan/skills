# QMK Keymap — Behavior Reference

## Shifted Symbol Aliases

Send Shift+key automatically. **Cannot be used in MT()/LT() tap argument.**

`KC_TILD`(`~`), `KC_EXLM`(`!`), `KC_AT`(`@`), `KC_HASH`(`#`), `KC_DLR`(`$`), `KC_PERC`(`%`), `KC_CIRC`(`^`), `KC_AMPR`(`&`), `KC_ASTR`(`*`), `KC_LPRN`(`(`), `KC_RPRN`(`)`), `KC_UNDS`(`_`), `KC_PLUS`(`+`), `KC_LCBR`(`{`), `KC_RCBR`(`}`), `KC_PIPE`(`|`), `KC_COLN`(`:`), `KC_DQUO`(`"`), `KC_LABK`(`<`), `KC_RABK`(`>`), `KC_QUES`(`?`)

---

## Modifier Wrappers

| Macro | Short | Sends |
|---|---|---|
| `LCTL(kc)` | `C(kc)` | Left Ctrl + kc |
| `LSFT(kc)` | `S(kc)` | Left Shift + kc |
| `LALT(kc)` | `A(kc)` | Left Alt + kc |
| `LGUI(kc)` | `G(kc)` | Left GUI/Cmd + kc |
| `MEH(kc)` | — | Left Ctrl+Shift+Alt + kc |
| `HYPR(kc)` | — | All four left mods + kc |

Nesting: `S(G(KC_4))` = Shift+Cmd+4. `HYPR(KC_NO)` = hold all four mods, no keycode.

**macOS:** Cmd = GUI (`G()`). Use `G(KC_C)` for copy, not `C(KC_C)`.

---

## Layer Switching

| Keycode | Behavior |
|---|---|
| `MO(layer)` | Momentary while held |
| `LT(layer, kc)` | Momentary hold / kc tap (basic kc only) |
| `TO(layer)` | Activate exclusively, deactivate all except base |
| `TG(layer)` | Toggle on/off |
| `DF(layer)` | Set default layer (lost on power cycle) |
| `PDF(layer)` | Persistent default layer (EEPROM) |
| `OSL(layer)` | One-shot layer — active for next keypress only |
| `TT(layer)` | Hold = momentary; tap N times = toggle |

---

## Mod-Tap — `MT(mod, kc)`

```c
MT(MOD_LCTL, KC_ESC)              // Ctrl on hold, Escape on tap
MT(MOD_LGUI, KC_S)                // GUI on hold, S on tap
MT(MOD_LSFT | MOD_LCTL, KC_SPC)  // Shift+Ctrl on hold, Space on tap
```

`#define` aliases: `LCTL_T(kc)`, `LSFT_T(kc)`, `LALT_T(kc)`, `LGUI_T(kc)`, `HYPR_T(kc)`, `MEH_T(kc)`.

**Constraint:** `kc` must be basic (≤0xFF). Shifted aliases and modifier wrappers not allowed.

---

## One-Shot Keys

```c
OSM(MOD_LSFT)              // one-shot Shift
OSL(_SYM)                  // one-shot layer
```
Config: `#define ONESHOT_TIMEOUT 5000` / `#define ONESHOT_TAP_TOGGLE 2`

---

## Tap Dance

Enable in `rules.mk`: `TAP_DANCE_ENABLE = yes`

```c
enum tap_dance_codes { TD_ESC_CAPS };

qk_tap_dance_action_t tap_dance_actions[] = {
    [TD_ESC_CAPS] = ACTION_TAP_DANCE_DOUBLE(KC_ESC, KC_CAPS_LOCK),
};
// Use: TD(TD_ESC_CAPS) in LAYOUT()
```

Action macros: `ACTION_TAP_DANCE_DOUBLE`, `ACTION_TAP_DANCE_LAYER_MOVE`, `ACTION_TAP_DANCE_LAYER_TOGGLE`, `ACTION_TAP_DANCE_FN`, `ACTION_TAP_DANCE_FN_ADVANCED`.

---

## Combos

Enable in `rules.mk`: `COMBO_ENABLE = yes`

```c
const uint16_t PROGMEM combo_jk[] = {KC_J, KC_K, COMBO_END};  // PROGMEM required on AVR

combo_t key_combos[] = {
    COMBO(combo_jk, KC_ESC),
};
```

Config: `#define COMBO_TERM 50` / `#define COMBO_TERM_PER_COMBO` + getter function.

Layer restriction:
```c
bool combo_should_trigger(uint16_t index, combo_t *combo, uint16_t keycode, keyrecord_t *record) {
    return layer_state_is(_BASE);
}
```

---

## Macros

```c
enum custom_keycodes { MY_MACRO = SAFE_RANGE };

bool process_record_user(uint16_t keycode, keyrecord_t *record) {
    switch (keycode) {
        case MY_MACRO:
            if (record->event.pressed) { SEND_STRING("hello\n"); }
            return false;
    }
    return true;
}
```

`SEND_STRING` helpers: `SS_LCTL("a")`, `SS_LGUI("c")`, `SS_TAP(X_UP)`, `SS_DOWN(X_LSFT)`, `SS_UP(X_LSFT)`, `SS_DELAY(200)`.

Manual: `register_code(KC_LSFT)`, `unregister_code(KC_LSFT)`, `tap_code(KC_A)`, `clear_keyboard()`.

---

## Tap-Hold Configuration

```c
#define TAPPING_TERM 200       // ms — below = tap, above = hold
#define PERMISSIVE_HOLD        // hold triggers when another key fully tapped while held
// #define HOLD_ON_OTHER_KEY_PRESS  // any other key press triggers hold (aggressive)
#define RETRO_TAPPING          // solo hold-tap release still sends tap action
#define QUICK_TAP_TERM 120     // within this ms of prior tap, always taps again
#define FLOW_TAP_TERM 150      // hold-tap within this ms of any key = force tap (home-row mods)
// #define CHORDAL_HOLD        // same-hand = tap, opposite-hand = eligible for hold
```

Per-key overrides (add `#define TAPPING_TERM_PER_KEY` then implement getter):
```c
uint16_t get_tapping_term(uint16_t keycode, keyrecord_t *record) {
    switch (keycode) {
        case SHT_F: return 150;
        default:    return TAPPING_TERM;
    }
}
```

---

## Special / Quantum Keycodes

| Keycode | Alias | Description |
|---|---|---|
| `KC_NO` | `XXXXXXX` | Swallows keypress |
| `KC_TRANSPARENT` | `_______` | Pass through to lower active layer |
| `QK_BOOTLOADER` | `QK_BOOT` | Enter bootloader |
| `QK_REBOOT` | `QK_RBT` | Soft reboot |
| `QK_CLEAR_EEPROM` | `EE_CLR` | Reinitialize EEPROM |
| `CAPS_WORD` | — | Smart caps; auto-deactivates |
