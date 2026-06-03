---
name: qmk-debug
description: Diagnoses and resolves common QMK/Vial firmware failures across four categories — build errors, flash failures, split keyboard issues, and Vial problems. Use when the user reports a compile error, a key not working after flashing, split halves not communicating, Vial not connecting, or wrong keys firing.
license: MIT
metadata:
  author: tylerreagan98@gmail.com
  version: "1.0.0"
  domain: keyboard-firmware
  triggers: qmk build error, qmk compile failed, flash failed, split not working, EE_HANDS, vial not connecting, wrong keys, LAYOUT arg count, undefined keycode, bootloader, RP2040
  role: diagnostic
  scope: troubleshooting
  output-format: text
  related-skills: qmk-config, qmk-keymap
---

# QMK Debug

Structured diagnostic workflow for QMK/Vial build, flash, split, and Vial failures. Classify the failure first — the right phase has the right fix.

## Phase 1: Classify

| Symptom | Go to |
|---------|-------|
| Compile error / `make` fails | Phase 2A — Build errors |
| Firmware builds but won't flash | Phase 2B — Flash failures |
| Keys on one half don't work / halves don't communicate | Phase 2C — Split issues |
| Vial app can't find keyboard / wrong layout / editing doesn't stick | Phase 2D — Vial issues |
| Wrong key fires, modifier stuck, layer not activating | Phase 2E — Keymap logic |
| Media keys do nothing (play, mute, vol, prev/next) | Phase 2E — `EXTRAKEY_ENABLE` missing |

---

## Phase 2A: Build Errors

**Collect before matching:**
- Full compiler error (not just the last line — the root cause is often 5–10 lines above)
- `rules.mk` at keymap level and keyboard level
- `keyboard.json` processor field
- Whether `COMBO_ENABLE`, `TAP_DANCE_ENABLE`, etc. are set

| Error text | Cause | Fix |
|-----------|-------|-----|
| `error: 'KC_XXX' undeclared` | Keycode typo or wrong short alias | Check [`references/keycodes.md`](../qmk-keymap/references/keycodes.md); common mistakes: `KC_CTRL` instead of `KC_LCTL`, `KC_CMD` instead of `KC_LGUI` |
| `error: too many arguments to function 'LAYOUT'` | Keymap has more entries than LAYOUT macro expects | Count entries in your layer vs. the LAYOUT macro in `<kb>.h` |
| `error: too few arguments to function 'LAYOUT'` | Keymap has fewer entries than LAYOUT expects | Same — count mismatch, usually a missing key in a layer |
| `error: 'TD' undeclared` | `TAP_DANCE_ENABLE = yes` missing from `rules.mk` | Add to keymap `rules.mk` |
| `error: 'combo_t' undeclared` | `COMBO_ENABLE = yes` missing from `rules.mk` | Add to keymap `rules.mk` |
| `error: initializer element is not constant` | Shifted alias (`KC_LCBR` etc.) used in `MT()` or `LT()` | Shifted aliases are not basic keycodes — intercept in `process_record_user()` |
| `warning: implicit declaration of 'SEND_STRING'` / link error | Missing `#include QMK_KEYBOARD_H` at top of `keymap.c` | Add the include |
| `error: 'SAFE_RANGE' undeclared` | Same missing include | Add `#include QMK_KEYBOARD_H` |
| `note: each undeclared identifier is reported only once` | Cascade from one root error | Fix the first error only; cascades resolve automatically |
| `error: 'VIAL_KEYBOARD_UID' undeclared` | Vial UID missing from keymap `config.h` | Generate and add `#define VIAL_KEYBOARD_UID {...}` |
| `error: unknown type name 'tap_dance_state_t'` | `TAP_DANCE_ENABLE` not set, or wrong QMK version | Enable in `rules.mk`; check vial-qmk is up to date |
| `size of array 'key_combos' is negative` | Old-style `#define COMBO_COUNT N` present in newer QMK | Remove `COMBO_COUNT` — it is now auto-computed |

**LAYOUT arg count debugging:**
```bash
# Count entries in a layer by counting commas + 1
grep -o ',' keymap.c | wc -l   # rough check across file
# Or just count the LAYOUT definition args in <kb>.h vs your layer manually
```

---

## Phase 2B: Flash Failures

| Symptom | Fix |
|---------|-----|
| Drive never mounts after double-tap | Try the BOOT button method: hold BOOT on MCU, press+release reset, release BOOT. Required on brand-new or wiped controllers. |
| Drive mounts but ejecting immediately without flashing | Charge-only USB cable — swap for a data cable. |
| `cp` to drive works but keyboard doesn't respond after reboot | Wrong `.uf2` file (wrong keyboard, wrong keymap). Re-flash with correct artifact. |
| macOS "drag to drive" fails silently | Use `cp -X firmware.uf2 /Volumes/RPI-RP2` instead of Finder drag. |
| Drive appears as `RPI-RP2` not `NICENANO` | Normal for RP2040 (nice!nano would show `NICENANO`). Different drive name, same procedure. |
| `QK_BOOT` doesn't enter bootloader | The key might not be accessible from current layer state. Use physical reset instead. |
| EE_HANDS: both halves behave as left (or right) | Flashed with wrong `-bl` target. Reflash: plug in just the right half → `make flash-right`. |
| Keyboard loops into bootloader on every power cycle | `RP2040_BOOTLOADER_DOUBLE_TAP_RESET_TIMEOUT` too long — accidental second tap. Try shorter timeout (200U). |

---

## Phase 2C: Split Issues

**EE_HANDS first-time setup checklist:**
1. Plug in **left half only** (right half disconnected) → `make flash-left`
2. Unplug, plug in **right half only** → `make flash-right`
3. Now connect both halves via TRRS — TRRS must be connected **before** USB power

**Symptom → Fix table:**

| Symptom | Cause | Fix |
|---------|-------|-----|
| All keys on one half dead, other half works normally | TRRS cable bad, or TRRS plugged in after USB power | Try a different cable; always connect TRRS first |
| Keys on both halves work individually but wrong when both connected | `SERIAL_USART_PIN_SWAP` missing — TX/RX confused when not master | Add `#define SERIAL_USART_PIN_SWAP` to keyboard `config.h` |
| Slave half keys all fire the wrong keys | Matrix row/col mapping wrong in `keyboard.json` for the right half | Check `matrix_pins.right` in `keyboard.json` if defined separately |
| Halves work but layer state out of sync (e.g. RGB only updates on one side) | `SPLIT_LAYER_STATE_ENABLE` not set | Add to keyboard `config.h` |
| Right half shows wrong handedness after firmware update | EE_HANDS EEPROM persists — no need to reflash. If somehow reset, reflash with `-bl uf2-split-right` |
| `MASTER_LEFT`/`MASTER_RIGHT` not working | `EE_HANDS` is also defined — EE_HANDS takes precedence | Remove `EE_HANDS` if using `MASTER_*` |

**SERIAL_USART_FULL_DUPLEX setup requires all three:**
```c
#define SERIAL_USART_FULL_DUPLEX
#define SERIAL_USART_TX_PIN GP0   // verify against your PCB schematic
#define SERIAL_USART_RX_PIN GP1
#define SERIAL_USART_PIN_SWAP     // swaps TX/RX on the master half
```

---

## Phase 2D: Vial Issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| Vial app can't find keyboard | `VIA_ENABLE = yes` missing, or `VIAL_ENABLE = yes` missing from keymap `rules.mk` | Ensure both are present in keymap `rules.mk` (not keyboard-level) |
| Vial finds keyboard but shows "unrecognized keyboard" | `vial.json` not present in keymap directory, or wrong UID | Verify `vial.json` is in the keymap folder and UID matches `config.h` |
| Vial shows layout but wrong key positions | `vial.json` layout doesn't match `keyboard.json` matrix positions | Regenerate or edit `vial.json` key matrix positions to match |
| Unlock combo doesn't work | `VIAL_UNLOCK_COMBO_ROWS/COLS` points to wrong keys | Trace matrix positions from `keyboard.json` → find correct row/col values |
| Layer count wrong in Vial (too few / too many layers) | `DYNAMIC_KEYMAP_LAYER_COUNT` in `config.h` doesn't match `vial.json` | Set both to the same value; rebuild and reflash |
| Edits made in Vial disappear after firmware update | Expected behavior — Vial stores changes in EEPROM; flashing new firmware resets the keymap to `keymap.c` | Either re-enter Vial changes after each flash, or permanently update `keymap.c` |
| Vial connects but tap-dance/combo editing not available | `TAP_DANCE_ENABLE` or `COMBO_ENABLE` missing from `rules.mk` | Add missing enables, rebuild |
| `VIAL_INSECURE = yes` warning | Accepted to avoid unlock combo requirement — Vial won't accept this keyboard into its official repo | Only use for local development; set a real unlock combo for any shared firmware |

---

## Phase 2E: Keymap Logic

| Symptom | Cause | Fix |
|---------|-------|-----|
| Hold-tap fires as tap even when clearly held | `TAPPING_TERM` too short, or PERMISSIVE_HOLD not set | Increase `TAPPING_TERM`; add `#define PERMISSIVE_HOLD` |
| Hold-tap fires as hold during fast typing (accidental modifier) | `TAPPING_TERM` too long, or `HOLD_ON_OTHER_KEY_PRESS` too aggressive | Add `#define FLOW_TAP_TERM 150`; reduce TAPPING_TERM |
| Hold-tap press with no other key produces nothing | `RETRO_TAPPING` not set | Add `#define RETRO_TAPPING` |
| Layer key held but tapping another key activates wrong layer key's hold | `PERMISSIVE_HOLD` treating rolling presses as holds | Add `#define FLOW_TAP_TERM` or reduce `TAPPING_TERM_PER_KEY` for that key |
| `_______` on layer doesn't pass through to expected key | Wrong layer is active, or the target layer's key is also `_______` | Use `DB_TOGG` + HID console or QMK debugging to trace active layers |
| Combo fires when not intended | `COMBO_TERM` too long — slow typists accidentally hit keys in window | Reduce `COMBO_TERM` or use `COMBO_TERM_PER_COMBO` |
| `MO()` layer not activating | `XXXXXXX` on the target layer's other keys instead of `_______` | `XXXXXXX` blocks; `_______` passes — change to `_______` for keys that should use the base layer |
| Media keys do nothing (`KC_MPLY`, `KC_MUTE`, `KC_VOLU`, etc.) | `EXTRAKEY_ENABLE = yes` missing from keymap `rules.mk` | Add it; without it the consumer HID descriptor is absent and all media keycodes silently no-op |
| macOS shortcuts not working (copy/paste/undo) | Using `C()` (Ctrl) instead of `G()` (GUI/Cmd) | On macOS, Cmd = `G()`. Use `G(KC_C)` for Cmd+C, not `C(KC_C)` |

---

## Anti-Patterns

**DO NOT** look only at the last compiler error line — it is almost always a cascade. The root cause is the first error in the output.

**DO NOT** diagnose split issues with both halves plugged in simultaneously via USB — power one half at a time through TRRS during EE_HANDS setup.

**DO NOT** put `VIA_ENABLE` or `VIAL_ENABLE` at keyboard level (`keyboards/<kb>/rules.mk`) — it breaks non-Vial keymaps for the same board.

**DO NOT** assume the `TAPPING_TERM_TIMEOUT` is in microseconds — it is milliseconds in QMK. `200` = 200ms, not 200µs.

**DO NOT** flash `EE_CLR` (EEPROM clear) as a first resort for Vial issues — it wipes saved Vial customizations. Try re-flashing the firmware first.
