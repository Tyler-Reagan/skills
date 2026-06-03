---
name: qmk-keymap
description: QMK keymap specialist covering keymap.c authoring — basic/shifted keycodes, modifier wrappers, MT/LT hold-tap, tap-dance, combos, one-shot keys, macros, and tap-hold configuration. Use when editing keymap.c, asking about MT or LT behavior, home-row mods, tap dance, combos, SEND_STRING macros, or which keycodes to use for shifted symbols.
license: MIT
metadata:
  author: tylerreagan98@gmail.com
  version: "1.0.0"
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

- **keycode** — A 16-bit value encoding what a key press sends. Basic keycodes are ≤0x00FF; quantum/advanced keycodes use higher bits.
- **layer** — A numbered overlay (0 = default/base). Higher active layers take priority; transparent keys pass through to the next lower active layer.
- **hold-tap** — A key that performs different actions on hold vs. tap. `MT()` and `LT()` are presets.
- **mod-tap** — Hold = modifier, tap = keycode. `MT(MOD_LCTL, KC_ESC)` = Ctrl on hold, Escape on tap.
- **layer-tap** — Hold = momentary layer, tap = keycode. `LT(1, KC_SPC)` = layer 1 on hold, Space on tap.
- **XXXXXXX** — Alias for `KC_NO`: swallows the key event, no output.
- **_______** — Alias for `KC_TRNS`: transparent, passes through to the next active lower layer.

## File Structure

```c
#include QMK_KEYBOARD_H

enum my_layers { _BASE, _SYM, _NAV };   // optional but recommended

enum custom_keycodes {                   // only needed for custom macros
    MY_KEY = SAFE_RANGE,
};

// #define aliases for hold-tap keys — keeps LAYOUT() readable
#define GUI_S  MT(MOD_LGUI, KC_S)
#define CTL_D  MT(MOD_LCTL, KC_D)
#define SYM_SPC LT(_SYM, KC_SPC)

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [_BASE] = LAYOUT( /* ... */ ),
    [_SYM]  = LAYOUT( /* ... */ ),
};

// only needed for custom keycodes or advanced hold-tap overrides
bool process_record_user(uint16_t keycode, keyrecord_t *record) { ... }
```

`PROGMEM` stores the keymap in flash instead of SRAM — required on AVR, harmless on ARM/RP2040.

---

## Basic Keycodes

Letters: `KC_A`–`KC_Z` | Numbers: `KC_1`–`KC_0` | Function: `KC_F1`–`KC_F24`

**Modifiers:**
| Keycode | Alias | Key |
|---------|-------|-----|
| `KC_LEFT_CTRL` | `KC_LCTL` | Left Control |
| `KC_LEFT_SHIFT` | `KC_LSFT` | Left Shift |
| `KC_LEFT_ALT` | `KC_LALT` | Left Alt |
| `KC_LEFT_GUI` | `KC_LGUI` | Left GUI/Cmd/Win |
| `KC_RIGHT_CTRL` | `KC_RCTL` | Right Control |
| `KC_RIGHT_SHIFT` | `KC_RSFT` | Right Shift |
| `KC_RIGHT_ALT` | `KC_RALT` | Right Alt/AltGr |
| `KC_RIGHT_GUI` | `KC_RGUI` | Right GUI/Cmd/Win |

**Common keys:**
`KC_ESC`, `KC_TAB`, `KC_SPC`, `KC_ENT`, `KC_BSPC`, `KC_DEL`
`KC_UP`, `KC_DOWN`, `KC_LEFT`, `KC_RIGHT`, `KC_HOME`, `KC_END`, `KC_PGUP`, `KC_PGDN`, `KC_INS`
`KC_MINS`, `KC_EQL`, `KC_LBRC`, `KC_RBRC`, `KC_BSLS`, `KC_SCLN`, `KC_QUOT`, `KC_GRV`, `KC_COMM`, `KC_DOT`, `KC_SLSH`

**Media:** `KC_MPLY`, `KC_MNXT`, `KC_MPRV`, `KC_MUTE`, `KC_VOLU`, `KC_VOLD`

For the full keycode table see [`references/keycodes.md`](references/keycodes.md).

---

## Shifted Symbol Aliases

These send Shift+key automatically. **Cannot be used as the `kc` argument in `MT()` or `LT()`.**

| Keycode | Short | Output |
|---------|-------|--------|
| `KC_TILDE` | `KC_TILD` | `~` |
| `KC_EXCLAIM` | `KC_EXLM` | `!` |
| `KC_AT` | — | `@` |
| `KC_HASH` | — | `#` |
| `KC_DOLLAR` | `KC_DLR` | `$` |
| `KC_PERCENT` | `KC_PERC` | `%` |
| `KC_CIRCUMFLEX` | `KC_CIRC` | `^` |
| `KC_AMPERSAND` | `KC_AMPR` | `&` |
| `KC_ASTERISK` | `KC_ASTR` | `*` |
| `KC_LEFT_PAREN` | `KC_LPRN` | `(` |
| `KC_RIGHT_PAREN` | `KC_RPRN` | `)` |
| `KC_UNDERSCORE` | `KC_UNDS` | `_` |
| `KC_PLUS` | — | `+` |
| `KC_LEFT_CURLY_BRACE` | `KC_LCBR` | `{` |
| `KC_RIGHT_CURLY_BRACE` | `KC_RCBR` | `}` |
| `KC_PIPE` | — | `\|` |
| `KC_COLON` | `KC_COLN` | `:` |
| `KC_DOUBLE_QUOTE` | `KC_DQUO`/`KC_DQT` | `"` |
| `KC_LEFT_ANGLE_BRACKET` | `KC_LABK`/`KC_LT` | `<` |
| `KC_RIGHT_ANGLE_BRACKET` | `KC_RABK`/`KC_GT` | `>` |
| `KC_QUESTION` | `KC_QUES` | `?` |

---

## Modifier Wrappers

Combine a modifier with a keycode as a single key press. These work anywhere in LAYOUT().

| Macro | Short | Sends |
|-------|-------|-------|
| `LCTL(kc)` | `C(kc)` | Left Ctrl + kc |
| `LSFT(kc)` | `S(kc)` | Left Shift + kc |
| `LALT(kc)` | `A(kc)` | Left Alt + kc |
| `LGUI(kc)` | `G(kc)` | Left GUI/Cmd + kc |
| `RCTL(kc)` | — | Right Ctrl + kc |
| `RSFT(kc)` | — | Right Shift + kc |
| `RALT(kc)` | — | Right Alt + kc |
| `RGUI(kc)` | — | Right GUI + kc |
| `LCS(kc)` | — | Left Ctrl+Shift + kc |
| `LCA(kc)` | — | Left Ctrl+Alt + kc |
| `MEH(kc)` | — | Left Ctrl+Shift+Alt + kc |
| `HYPR(kc)` | — | All four left mods + kc |

**Nesting:** `S(G(KC_4))` = Shift+Cmd+4 (macOS screenshot to file). `C(G(KC_Q))` = Ctrl+Cmd+Q (macOS lock).

`HYPR(KC_NO)` sends all four modifiers with no keycode — acts as a pure "Hyper" modifier.

**macOS shortcut mapping:** On macOS, Cmd = GUI (`G()`). Use `G(KC_C)` for Cmd+C, not `C(KC_C)` (which is Ctrl+C and does nothing in most macOS apps).

---

## Layer Switching

| Keycode | Behavior |
|---------|----------|
| `MO(layer)` | Momentary — active while held, off on release |
| `LT(layer, kc)` | Momentary layer on hold, `kc` on tap (basic keycodes only) |
| `TO(layer)` | Switch to layer exclusively, deactivating all others except the base |
| `TG(layer)` | Toggle layer on/off |
| `DF(layer)` | Set default layer (lost on power cycle) |
| `PDF(layer)` | Set persistent default layer (survives reboot, stored in EEPROM) |
| `OSL(layer)` | One-shot layer — active for the next keypress only |
| `LM(layer, mod)` | Momentary layer + modifier held simultaneously (layers 0–15 only) |
| `TT(layer)` | Hold = momentary, tap N times = toggle (`TAPPING_TOGGLE` times, default 5) |

**Layer precedence:** QMK scans from highest active layer downward. First non-transparent key wins. `_______` passes through; `XXXXXXX` blocks without output.

**Layer 0 is always active** — it is the fallback. `_______` on layer 0 has no effect (no lower layer to pass to).

**Programming:** `layer_on(layer)`, `layer_off(layer)`, `layer_clear()`, `layer_move(layer)`, `layer_state_is(layer)` available in `process_record_user`.

---

## Mod-Tap — `MT(mod, kc)`

Hold → modifier, tap → basic keycode.

```c
MT(MOD_LCTL, KC_ESC)              // Ctrl on hold, Escape on tap
MT(MOD_LGUI, KC_S)                // GUI on hold, S on tap
MT(MOD_LSFT | MOD_LCTL, KC_SPC)  // Shift+Ctrl on hold, Space on tap
```

**MOD_ constants:** `MOD_LCTL`, `MOD_LSFT`, `MOD_LALT`, `MOD_LGUI`, `MOD_RCTL`, `MOD_RSFT`, `MOD_RALT`, `MOD_RGUI`, `MOD_HYPR`, `MOD_MEH`

**Convenience aliases:** `LCTL_T(kc)`, `LSFT_T(kc)`, `LALT_T(kc)`, `LGUI_T(kc)`, `RCTL_T(kc)`, `RSFT_T(kc)`, `RALT_T(kc)`, `RGUI_T(kc)`, `HYPR_T(kc)`, `MEH_T(kc)`

**`#define` alias pattern** — keeps LAYOUT() readable, strongly recommended for home-row mods:
```c
#define GUI_S  MT(MOD_LGUI, KC_S)
#define CTL_D  MT(MOD_LCTL, KC_D)
#define SHT_F  MT(MOD_LSFT, KC_F)
#define SHT_J  MT(MOD_RSFT, KC_J)
#define CTL_K  MT(MOD_RCTL, KC_K)
#define GUI_L  MT(MOD_RGUI, KC_L)
// Then in LAYOUT: KC_A, GUI_S, CTL_D, SHT_F, KC_G, ...
```

**Constraint:** `kc` must be a basic keycode (≤0xFF). Shifted aliases (`KC_UNDS`, `KC_LCBR`, `KC_LPRN`, etc.) and modifier wrappers (`C(KC_A)`) cannot be used. Intercept in `process_record_user()` to send non-basic tap values.

---

## One-Shot Keys

Modifier or layer stays active until the next keypress.

| Keycode | Behavior |
|---------|----------|
| `OSM(mod)` | One-shot modifier |
| `OSL(layer)` | One-shot layer |

```c
OSM(MOD_LSFT)              // one-shot Shift
OSM(MOD_LCTL | MOD_LSFT)  // one-shot Ctrl+Shift
```

Short aliases: `OS_LSFT`, `OS_LCTL`, `OS_LALT`, `OS_LGUI`, `OS_RSFT`, `OS_RCTL`, `OS_RALT`, `OS_RGUI`, `OS_MEH`, `OS_HYPR`

When held while typing, OSM/OSL behave as normal modifier/MO — one-shot only applies on quick tap+release.

**Config:**
```c
#define ONESHOT_TIMEOUT 5000    // ms before one-shot expires (default 5000)
#define ONESHOT_TAP_TOGGLE 2   // taps to lock one-shot on (default 5)
```

---

## Tap Dance

Enable in `rules.mk`: `TAP_DANCE_ENABLE = yes`

**Declare an enum and define actions array:**
```c
enum tap_dance_codes { TD_ESC_CAPS, TD_SLSH_BSLS };

qk_tap_dance_action_t tap_dance_actions[] = {
    [TD_ESC_CAPS]  = ACTION_TAP_DANCE_DOUBLE(KC_ESC, KC_CAPS_LOCK),
    [TD_SLSH_BSLS] = ACTION_TAP_DANCE_DOUBLE(KC_SLSH, KC_BSLS),
};
```

**Use:** `TD(TD_ESC_CAPS)` in LAYOUT().

**All action macros:**
| Macro | Single tap | Double tap / hold |
|-------|-----------|-------------------|
| `ACTION_TAP_DANCE_DOUBLE(kc1, kc2)` | kc1 | kc2 |
| `ACTION_TAP_DANCE_LAYER_MOVE(kc, layer)` | kc | `TO(layer)` |
| `ACTION_TAP_DANCE_LAYER_TOGGLE(kc, layer)` | kc | `TG(layer)` |
| `ACTION_TAP_DANCE_FN(fn)` | calls fn | calls fn |
| `ACTION_TAP_DANCE_FN_ADVANCED(on_each, on_finish, on_reset)` | full custom | full custom |

**Advanced state machine** (hold/single-tap/double-tap differentiation):
```c
typedef enum { TD_NONE, TD_UNKNOWN, TD_SINGLE_TAP, TD_SINGLE_HOLD, TD_DOUBLE_TAP } td_state_t;

td_state_t cur_dance(tap_dance_state_t *state) {
    if (state->count == 1)
        return state->pressed ? TD_SINGLE_HOLD : TD_SINGLE_TAP;
    if (state->count == 2)
        return TD_DOUBLE_TAP;
    return TD_UNKNOWN;
}
```

**Config:**
```c
#define TAP_DANCE_MAX_SIMULTANEOUS 5  // max simultaneous tap dances (default 3)
```

---

## Combos

Enable in `rules.mk`: `COMBO_ENABLE = yes`

```c
// Declare key sequences (PROGMEM, terminated with COMBO_END)
const uint16_t PROGMEM combo_jk[] = {KC_J, KC_K, COMBO_END};
const uint16_t PROGMEM combo_esc[] = {KC_Q, KC_W, COMBO_END};

// Register combos — array size is automatic, no COMBO_COUNT needed
combo_t key_combos[] = {
    COMBO(combo_jk,  KC_ESC),
    COMBO(combo_esc, QK_BOOT),
};
```

**Config:**
```c
#define COMBO_TERM 50    // all keys must be pressed within this window (ms, default 50)
```

**Per-combo timing:**
```c
// config.h: #define COMBO_TERM_PER_COMBO
uint16_t get_combo_term(uint16_t combo_index, combo_t *combo) {
    switch (combo_index) {
        case 0: return 35;
        default: return COMBO_TERM;
    }
}
```

**Layer-restricted combos:**
```c
bool combo_should_trigger(uint16_t combo_index, combo_t *combo, uint16_t keycode, keyrecord_t *record) {
    return layer_state_is(_BASE);
}
```

**Timer modes** (in `config.h`): `COMBO_STRICT_TIMER` (timer starts on first press), `COMBO_NO_TIMER` (activate on first release).

---

## Macros

```c
enum custom_keycodes { MY_MACRO = SAFE_RANGE, ANOTHER };

bool process_record_user(uint16_t keycode, keyrecord_t *record) {
    switch (keycode) {
        case MY_MACRO:
            if (record->event.pressed) {
                SEND_STRING("hello world\n");
            }
            return false;
    }
    return true;  // let QMK handle all other keycodes
}
```

**`SEND_STRING` helpers:**
```c
SEND_STRING(SS_LCTL("a"));                      // Ctrl+A
SEND_STRING(SS_LGUI("c"));                      // Cmd+C (macOS copy)
SEND_STRING(SS_LCTL(SS_LSFT("t")));             // Ctrl+Shift+T
SEND_STRING(SS_TAP(X_UP));                      // tap Up arrow (X_ prefix, not KC_)
SEND_STRING(SS_DOWN(X_LSFT) "HELLO" SS_UP(X_LSFT));  // type shifted string
SEND_STRING(SS_DELAY(200) "after delay");       // 200ms pause
```

**Manual key control:**
```c
register_code(KC_LSFT);    // press and hold
unregister_code(KC_LSFT);  // release
tap_code(KC_A);            // press + release
clear_keyboard();          // release all keys and modifiers
```

---

## Special / Quantum Keycodes

| Keycode | Alias | Description |
|---------|-------|-------------|
| `KC_NO` | `XXXXXXX` | No-op — swallows keypress, no output |
| `KC_TRANSPARENT` | `KC_TRNS`, `_______` | Pass through to next lower active layer |
| `QK_BOOTLOADER` | `QK_BOOT` | Enter bootloader mode for flashing |
| `QK_REBOOT` | `QK_RBT` | Soft reboot — no bootloader |
| `QK_CLEAR_EEPROM` | `EE_CLR` | Reinitialize EEPROM (clears all persistent settings) |
| `QK_DEBUG_TOGGLE` | `DB_TOGG` | Toggle debug output via USB HID |
| `CAPS_WORD` | — | Smart caps — auto-deactivates on non-alphanumeric/`-`/`_` |
| `HYPR(KC_NO)` | — | Hold all four modifiers, no keycode — pure Hyper modifier |

---

## Tap-Hold Configuration

Place in `config.h`. These affect every `MT()` and `LT()`.

### TAPPING_TERM
```c
#define TAPPING_TERM 200   // ms — below this = tap, above = hold (default 200)
```

### Hold Decision Mode

| Option | Hold triggers when... |
|--------|----------------------|
| *(default)* | Tapping term expires, regardless of other keys |
| `PERMISSIVE_HOLD` | Another key is **fully** tapped (press+release) while held |
| `HOLD_ON_OTHER_KEY_PRESS` | Any other key is pressed while held (most aggressive) |

When both are set, `HOLD_ON_OTHER_KEY_PRESS` takes precedence.

```c
#define PERMISSIVE_HOLD          // recommended for home-row mods — handles rolls cleanly
// #define HOLD_ON_OTHER_KEY_PRESS  // use if PERMISSIVE_HOLD still misses holds
```

### RETRO_TAPPING
```c
#define RETRO_TAPPING  // if released with no other key pressed, still sends tap action
```

Prevents the "dead hold-tap" effect where a slow, solo hold-tap press produces nothing.

### QUICK_TAP_TERM
```c
#define QUICK_TAP_TERM 120  // within this ms of a prior tap, always taps again
                             // set 0 to disable hold-tap auto-repeat entirely
```

### FLOW_TAP_TERM
```c
#define FLOW_TAP_TERM 150  // if hold-tap pressed within this ms of any prior key, force tap
```

Best for home-row mods — prevents accidental modifier triggers during fast rolling input.

### CHORDAL_HOLD
```c
#define CHORDAL_HOLD  // same-hand combos = tap; opposite-hand = eligible for hold
```

Requires `PERMISSIVE_HOLD` or `HOLD_ON_OTHER_KEY_PRESS`. Define handedness in a `PROGMEM` layout array — `'L'`, `'R'`, or `'*'` (thumb/ambiguous) per key position.

### Per-Key Overrides

Add `#define TAPPING_TERM_PER_KEY` (or `PERMISSIVE_HOLD_PER_KEY`, etc.) then implement the getter:
```c
uint16_t get_tapping_term(uint16_t keycode, keyrecord_t *record) {
    switch (keycode) {
        case SHT_F: return 150;   // index finger can be shorter
        default:    return TAPPING_TERM;
    }
}
```

---

## Constraints

- **MT/LT kc argument must be basic** (≤0xFF). `KC_UNDS`, `KC_LCBR`, `KC_LPRN`, modifier wrappers (`C(KC_A)`), or quantum keycodes (`MO()`) cannot be used. Intercept in `process_record_user()` instead.
- **Shifted aliases are fine in LAYOUT()** directly — they are only restricted inside `MT()`/`LT()`.
- **Right modifier mixing**: Specifying any right modifier in `MT()` converts all mods to their right-hand variants.
- **`_______` on layer 0**: No effect — there is no lower active layer to pass through to.
- **`COMBO_ENABLE` and `TAP_DANCE_ENABLE`** must be set in `rules.mk`; not enabled by default.
- **`PROGMEM` combo arrays**: Combo key sequences must be `const uint16_t PROGMEM` — missing this causes undefined behavior on AVR.
- **`SAFE_RANGE`**: Always start custom keycode enums at `SAFE_RANGE` to avoid collisions with QMK internals.
