---
name: zmk-debug
description: 'Diagnoses and resolves common ZMK firmware failures across five categories: build errors, flash failures, split pairing issues, display problems, and ZMK Studio connection failures. Use when the user reports a build error, CI failure, "board not found", "KeyError qualifiers", keyboard not pairing, display blank or not compiling, or ZMK Studio not connecting.'
license: MIT
metadata:
  author: uraniborglabs@gmail.com
  version: "1.1.0"
  domain: keyboard-firmware
  triggers: zmk build error, zmk ci failure, board not found, KeyError qualifiers, keyboard not pairing, display not working, zmk studio not connecting, settings_reset, bootloader, LVGL compile error, flash failed
  role: diagnostic
  scope: troubleshooting
  output-format: text
  related-skills: zmk-config, zmk-display, zmk-keymap, zmk-new-config
---

# ZMK Debug

Structured diagnostic for ZMK build, flash, pairing, and display failures. Read the full error before matching — partial matches diagnose the wrong problem.

## Phase 1: Classify the failure

| Symptom | Go to |
|---|---|
| CI job fails with Python/CMake/west error | Phase 2A — Build errors |
| Firmware builds but keyboard won't flash | Phase 2B — Flash failures |
| Keyboard won't pair or halves won't find each other | Phase 2C — Pairing issues |
| Display blank, not compiling, or wrong screen | Phase 2D — Display issues |
| ZMK Studio won't connect, shows locked, edits don't persist | Phase 2E — Studio issues |

See [REFERENCE.md](REFERENCE.md) for the full per-phase diagnostic tables.

## Gotchas

**The headline error is almost always a cascade.** The root cause is 5–10 lines above the last error in the CI log. Never start diagnosis at the bottom; always collect the last 30+ lines and look for the first error.

**All three version signals must agree.** `west.yml` revision, `build.yaml` board format, and CI workflow ref must all target the same ZMK era. A single mismatch produces errors that look like auth or network failures. Check all three before prescribing any fix.

**LVGL migration comments in source files lie.** Developer comments written during v8→v9 migrations are frequently backwards about which API existed in which version. Determine LVGL generation from actual API call signatures, not comments. Example: `// lv_canvas_draw_rect doesn't exist in LVGL v8+` — this is wrong; it existed in v8 and was removed in v9.

**Don't flash `settings_reset` as a first resort.** It wipes all BT bonds, requiring re-pairing every host device. Try deleting the keyboard from the host's Bluetooth settings and re-pairing first.

**Flashing the wrong side's UF2 produces no error.** Left and right halves produce separate artifacts. Flashing left firmware to the right half doesn't fail — the keyboard just doesn't work correctly. Verify artifact filenames before flashing.

## Anti-Patterns

**DO NOT** diagnose without the full CI log — the headline error is almost always a cascade.

**DO NOT** assume the ZMK version from board format alone — check all three signals (west.yml, build.yaml, CI workflow ref).

**DO NOT** flash `settings_reset.uf2` as a first resort — try delete+re-pair from the host first.

**DO NOT** apply the Studio snippet to a peripheral — it has no effect and wastes flash and RAM.

**DO NOT** flash the wrong side's artifact — left and right UF2 files are not interchangeable.
