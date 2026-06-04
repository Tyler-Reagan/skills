# QMK Debug — Phase Reference

## Phase 2A: Build Errors

Collect before matching: full compiler output (not just last line), keymap and keyboard `rules.mk`, `keyboard.json` processor field.

| Error text | Cause | Fix |
|---|---|---|
| `error: 'KC_XXX' undeclared` | Keycode typo or wrong alias | Check [`references/keycodes.md`](../qmk-keymap/references/keycodes.md); common: `KC_CTRL` → `KC_LCTL`, `KC_CMD` → `KC_LGUI` |
| `error: too many/few arguments to function 'LAYOUT'` | Keymap entry count doesn't match LAYOUT macro | Count entries vs. LAYOUT macro in `<kb>.h` |
| `error: 'TD' undeclared` | `TAP_DANCE_ENABLE = yes` missing from `rules.mk` | Add to keymap `rules.mk` |
| `error: 'combo_t' undeclared` | `COMBO_ENABLE = yes` missing from `rules.mk` | Add to keymap `rules.mk` |
| `error: initializer element is not constant` | Shifted alias used in `MT()` or `LT()` tap argument | Shifted aliases are not basic keycodes — intercept in `process_record_user()` |
| `warning: implicit declaration of 'SEND_STRING'` | Missing `#include QMK_KEYBOARD_H` | Add the include at the top of `keymap.c` |
| `error: 'SAFE_RANGE' undeclared` | Same missing include | Add `#include QMK_KEYBOARD_H` |
| `error: 'VIAL_KEYBOARD_UID' undeclared` | Vial UID missing from keymap `config.h` | Generate and add `#define VIAL_KEYBOARD_UID {...}` |
| `size of array 'key_combos' is negative` | Old `#define COMBO_COUNT N` present in newer QMK | Remove `COMBO_COUNT` — now auto-computed |

**LAYOUT arg count check:**
```bash
# Count entries in a layer by commas
grep -o ',' keymap.c | wc -l
```

---

## Phase 2B: Flash Failures

| Symptom | Fix |
|---|---|
| Drive never mounts after double-tap | Use BOOT button: hold BOOT on MCU, press+release reset, release BOOT |
| Drive mounts but ejects immediately | Charge-only cable — swap for a data cable |
| Keyboard unresponsive after flash | Wrong `.uf2` file — re-flash with correct artifact |
| macOS drag-to-drive fails silently | Use `cp -X firmware.uf2 /Volumes/RPI-RP2` instead of Finder drag |
| Drive appears as `RPI-RP2` | Normal for RP2040 — different name, same procedure |
| `QK_BOOT` doesn't enter bootloader | Key may not be accessible from current layer — use physical reset |
| EE_HANDS: both halves same side | Wrong `-bl` target — plug in just the right half → `make flash-right` |
| Loops into bootloader on every power cycle | `RP2040_BOOTLOADER_DOUBLE_TAP_RESET_TIMEOUT` too long — try shorter (200U) |

---

## Phase 2C: Split Issues

**EE_HANDS first-time setup:**
1. Plug in left half only → `make flash-left`
2. Unplug, plug in right half only → `make flash-right`
3. Connect both halves via TRRS — **TRRS must be connected before USB power**

| Symptom | Cause | Fix |
|---|---|---|
| One half entirely dead | TRRS bad, or TRRS plugged in after USB | Try different cable; always TRRS first |
| Keys work individually but wrong when both connected | `SERIAL_USART_PIN_SWAP` missing | Add `#define SERIAL_USART_PIN_SWAP` to keyboard `config.h` |
| Layer state not syncing (e.g. RGB only one side) | `SPLIT_LAYER_STATE_ENABLE` not set | Add to keyboard `config.h` |
| `MASTER_LEFT`/`MASTER_RIGHT` ignored | `EE_HANDS` defined and takes precedence | Remove `EE_HANDS` if using `MASTER_*` |

`SERIAL_USART_FULL_DUPLEX` requires all three defines:
```c
#define SERIAL_USART_FULL_DUPLEX
#define SERIAL_USART_TX_PIN GP0
#define SERIAL_USART_RX_PIN GP1
#define SERIAL_USART_PIN_SWAP
```

---

## Phase 2D: Vial Issues

| Symptom | Cause | Fix |
|---|---|---|
| Vial can't find keyboard | `VIA_ENABLE` or `VIAL_ENABLE` missing from keymap `rules.mk` | Add both to keymap-level `rules.mk` |
| "Unrecognized keyboard" | `vial.json` missing or UID mismatch | Verify `vial.json` in keymap folder and UID matches `config.h` |
| Wrong key positions in Vial | `vial.json` layout doesn't match `keyboard.json` matrix | Edit `vial.json` key positions to match |
| Unlock combo doesn't work | Wrong matrix positions in `VIAL_UNLOCK_COMBO_*` | Trace from `keyboard.json` matrix_pins |
| Layer count wrong | `DYNAMIC_KEYMAP_LAYER_COUNT` doesn't match `vial.json` | Set both to same value; rebuild and reflash |
| Tap-dance/combo not available in Vial | `TAP_DANCE_ENABLE` or `COMBO_ENABLE` missing | Add to `rules.mk`, rebuild |

---

## Phase 2E: Keymap Logic

| Symptom | Cause | Fix |
|---|---|---|
| Hold-tap fires as tap even when held | `TAPPING_TERM` too short, or `PERMISSIVE_HOLD` not set | Increase term; add `#define PERMISSIVE_HOLD` |
| Accidental modifier during fast typing | `HOLD_ON_OTHER_KEY_PRESS` too aggressive | Add `#define FLOW_TAP_TERM 150`; reduce `TAPPING_TERM` |
| Solo hold-tap produces nothing | `RETRO_TAPPING` not set | Add `#define RETRO_TAPPING` |
| `_______` doesn't pass through as expected | Wrong layer active, or target layer key is also `_______` | Use `DB_TOGG` to trace active layers |
| Media keys do nothing | `EXTRAKEY_ENABLE = yes` missing from keymap `rules.mk` | Add it — consumer HID descriptor is absent without it |
| macOS shortcuts not working | Using `C()` (Ctrl) instead of `G()` (GUI/Cmd) | Use `G(KC_C)` for Cmd+C on macOS |
