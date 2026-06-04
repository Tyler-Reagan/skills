---
name: qmk-debug
description: Diagnoses and resolves common QMK/Vial firmware failures across four categories — build errors, flash failures, split keyboard issues, and Vial problems. Use when the user reports a compile error, a key not working after flashing, split halves not communicating, Vial not connecting, or wrong keys firing.
license: MIT
metadata:
  author: tylerreagan98@gmail.com
  version: "1.1.0"
  domain: keyboard-firmware
  triggers: qmk build error, qmk compile failed, flash failed, split not working, EE_HANDS, vial not connecting, wrong keys, LAYOUT arg count, undefined keycode, bootloader, RP2040
  role: diagnostic
  scope: troubleshooting
  output-format: text
  related-skills: qmk-config, qmk-keymap
---

# QMK Debug

Structured diagnostic for QMK/Vial build, flash, split, and keymap failures. Classify first — the right phase has the right fix.

## Phase 1: Classify

| Symptom | Go to |
|---|---|
| Compile error / `make` fails | Phase 2A — Build errors |
| Firmware builds but won't flash | Phase 2B — Flash failures |
| Keys on one half dead / halves don't communicate | Phase 2C — Split issues |
| Vial app can't find keyboard / wrong layout / edits don't persist | Phase 2D — Vial issues |
| Wrong key fires, modifier stuck, layer not activating | Phase 2E — Keymap logic |
| Media keys do nothing (play, mute, vol, prev/next) | Phase 2E — `EXTRAKEY_ENABLE` missing |

See [REFERENCE.md](REFERENCE.md) for the full per-phase diagnostic tables.

## Gotchas

**The first compiler error is the root cause.** Every error after it is a cascade from that first failure. Fix the first error only and re-compile — the rest resolve automatically. Never start diagnosis at the bottom of the output.

**EE_HANDS requires per-half flashing on setup.** Both halves need separate flashing with the handedness bootloader (`-bl uf2-split-left`/`uf2-split-right`) on the first flash. Most split confusion comes from both halves being flashed identically the first time.

**TRRS must be connected before USB power.** Hot-plugging the TRRS cable after USB is live can corrupt split communication. Always connect the TRRS cable first, then plug in USB.

**Vial edits disappear on reflash — this is expected.** Vial stores changes in EEPROM; flashing new firmware resets the keymap to `keymap.c` baseline. Either re-enter Vial changes after each flash, or update `keymap.c` to make them permanent.

**Media keys silently no-op without `EXTRAKEY_ENABLE`.** `KC_MPLY`, `KC_MUTE`, `KC_VOLU`, etc. do absolutely nothing unless `EXTRAKEY_ENABLE = yes` is in `rules.mk`. No compile error, no warning — they just don't work.

## Anti-Patterns

**DO NOT** look only at the last compiler error — it is almost always a cascade from the first.

**DO NOT** put `VIA_ENABLE` or `VIAL_ENABLE` in keyboard-level `rules.mk` — breaks non-Vial keymaps.

**DO NOT** diagnose split issues with both halves powered via USB simultaneously during EE_HANDS setup.

**DO NOT** flash `EE_CLR` as a first resort for Vial issues — it wipes saved customizations; try reflashing firmware first.

**DO NOT** assume `TAPPING_TERM_TIMEOUT` is in microseconds — it is milliseconds.
