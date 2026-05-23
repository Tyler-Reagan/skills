---
name: zmk-debug
description: Diagnoses and resolves common ZMK firmware failures across five categories: build errors, flash failures, split pairing issues, display problems, and ZMK Studio connection failures. Use when the user reports a build error, CI failure, "board not found", "KeyError qualifiers", keyboard not pairing, display blank or not compiling, or ZMK Studio not connecting.
license: MIT
metadata:
  author: tylerreagan98@gmail.com
  version: "1.0.0"
  domain: keyboard-firmware
  triggers: zmk build error, zmk ci failure, board not found, KeyError qualifiers, keyboard not pairing, display not working, zmk studio not connecting, settings_reset, bootloader, LVGL compile error, flash failed
  role: diagnostic
  scope: troubleshooting
  output-format: text
  related-skills: zmk-config, zmk-display, zmk-keymap, zmk-new-config
---

# ZMK Debug

Structured diagnostic workflow for ZMK build, flash, pairing, and display failures. Always read the full error message before matching — partial matches diagnose the wrong problem.

## Phase 1: Classify the failure

| Symptom | Go to |
|---------|-------|
| CI job fails with Python/CMake/west error | Phase 2A — Build errors |
| Firmware builds but keyboard won't flash | Phase 2B — Flash failures |
| Keyboard won't pair or halves won't find each other | Phase 2C — Pairing issues |
| Display blank, not compiling, or wrong screen | Phase 2D — Display issues |
| ZMK Studio won't connect, shows locked, or edits don't persist | Phase 2E — Studio issues |

---

## Phase 2A: Build Errors

**Collect before matching:**
- Last 30 lines of the CI log
- `revision:` on the `zmk` project in `config/west.yml`
- `board:` format in `build.yaml` (flat vs. qualified)
- `uses:` ref in `.github/workflows/*.yml`

All three signals must agree. Mismatches between them are the root cause of the three most common build errors.

| Error text | Cause | Fix |
|-----------|-------|-----|
| `KeyError: 'qualifiers'` | CI workflow `@main` running against ZMK v0.3 source | Pin `.github/workflows/*.yml` to `@v0.3` |
| `Invalid BOARD; see above` | Qualified board format used with ZMK v0.3 CMake | Change to flat board name (e.g. `nice_nano_v2`) |
| `<board_name> not found` with flat name | ZMK main expects qualified format | Change to `board/soc/zmk` (e.g. `nice_nano_v2/nrf52840/zmk`) |
| `west update: ... not found` | `revision:` tag or branch doesn't exist on remote | Verify the ref on the remote; fall back to `main` or a known SHA |
| LVGL v8 API in ZMK main build (`lv_canvas_draw_*` undefined) | Display module uses LVGL v8 APIs; ZMK is on main (LVGL v9) | Pin module to its last v8-compatible SHA, or pin ZMK to v0.3 |
| LVGL v9 API in ZMK v0.3 build | Display module migrated to v9; ZMK is still on v0.3 | Pin module to its pre-v9 SHA (nice-view-gem: `3f38221c61ec`) |
| `undefined reference to lv_anim_*` | Animation enabled in code but not in Kconfig | Add `CONFIG_LV_USE_ANIMATION=y` to `.conf` |
| `shield <name> not found` | Shield name typo, or module not declared in `west.yml` | Verify shield name in the module's `boards/shields/` directory |

---

## Phase 2B: Flash Failures

| Symptom | Fix |
|---------|-----|
| Drive never mounts after double-tap | Try holding reset for 5 s; some boards need a single long press instead of double-tap |
| Drive mounts as `NICENANO` but ejects immediately without flashing | Check the cable — charge-only cables don't transfer data; swap for a data cable |
| Wrong artifact flashed (keyboard unresponsive) | Flash `settings_reset.uf2` to clear state, then re-flash the correct side's firmware |
| `NICENANO` mounts but UF2 copy fails on macOS | Known macOS issue — use `cp -X firmware.uf2 /Volumes/NICENANO` instead of drag-and-drop |
| Bootloader entered but drive doesn't appear on Linux | Run `dmesg | tail -20` to confirm USB recognition; try a different USB port or hub |

---

## Phase 2C: Pairing Issues

BLE bonds are stored in flash. Stale bonds are the most common cause of split and host pairing failures. `settings_reset` wipes all bonds — it's the nuclear option; try softer approaches first.

**Step 1 (softer):** Delete the keyboard from the host's Bluetooth settings and re-pair. Power on central first, then peripheral.

**Step 2 (if Step 1 fails):** Flash `settings_reset.uf2` to **both** halves, power-cycle, then re-pair from scratch.

**Step 3 (split halves won't find each other after reset):**
- Confirm both halves run the same firmware artifact from the same CI build
- Central must power on before peripheral — give it 10–15 s to initialize BLE
- For dongle setups: pair left peripheral first, then right; reversing this swaps the battery widget assignment

**Step 4 (multiple BT profiles):**
- Use `&bt BT_SEL N` to explicitly select the profile slot you want to clear
- Use `&bt BT_CLR` on the selected slot, then re-pair on that slot
- `&bt BT_CLR_ALL` clears every profile — equivalent to `settings_reset` for bond state only

---

## Phase 2D: Display Issues

**Won't compile:**
See Phase 2A LVGL rows — a compile error almost always means a version mismatch between the display module and ZMK.

**Compiles but display is blank:**
1. Confirm `CONFIG_ZMK_DISPLAY=y` is in the `.conf` for the side with the display
2. Verify shield order in `build.yaml`: keyboard shield → adapter (`nice_view_adapter`) → display module — wrong order causes silent build with no display
3. Verify the display module is in `west.yml` and the revision is compatible with the active ZMK version
4. If using `CONFIG_ZMK_DISPLAY_BLANK_ON_IDLE=y` (default on SSD1306), press a key — the display may just be blanked

**Screen appears but shows wrong content / built-in screen instead of custom:**
- Confirm `CONFIG_ZMK_DISPLAY_STATUS_SCREEN_CUSTOM=y` — if set to `BUILT_IN`, the module's custom screen is ignored
- Confirm the module's shield is in the `build.yaml` shield stack (not just in `west.yml`)

**Display causes sluggish keys:**
- Add `CONFIG_ZMK_DISPLAY_WORK_QUEUE_DEDICATED=y` — isolates the display refresh from the keyboard scan thread

**`CONFIG_ZMK_DISPLAY_INVERT` has no effect:**
- `INVERT` is incompatible with custom status screens — only works with the built-in screen.

---

## Phase 2E: ZMK Studio Issues

| Symptom | Fix |
|---------|-----|
| ZMK Studio app can't find the keyboard | Verify `snippet: studio-rpc-usb-uart` is on the **central** build target in `build.yaml` — not the peripheral |
| Studio connects but keyboard is locked | Add `&studio_unlock` to an accessible key (boot/system layer) and reflash |
| Studio edits disappear after flashing new firmware | Studio keymap is stored in flash separately from `.keymap`; flashing resets to `.keymap` baseline — use "Restore Stock Settings" in Studio if you want to re-enable live editing |
| `CONFIG_ZMK_STUDIO_LOCKING=n` in `.conf` isn't disabling auto-lock | `cmake-args` in `build.yaml` overrides `.conf` — move Studio options to `cmake-args` and remove from `.conf` |
| Studio connects on USB but not BLE | Studio uses the USB serial transport (`studio-rpc-usb-uart`) — BLE Studio is not currently supported |

---

## Anti-Patterns

**DO NOT** flash `settings_reset.uf2` as a first resort — it wipes all BT bonds, requiring re-pairing every device. Try Step 1 (delete + re-pair from host) first.

**DO NOT** diagnose a build error without the full CI log — the headline error is often a cascading failure; the root cause is 5–10 lines above it.

**DO NOT** assume the ZMK version from the board format alone — check all three signals (west.yml revision, build.yaml board format, CI workflow ref) and confirm they agree before prescribing a fix.

**DO NOT** flash the wrong side's artifact — left and right halves produce separate UF2 files and are not interchangeable even on identical hardware.

**DO NOT** apply the Studio snippet to a peripheral — it has no effect and wastes flash and RAM.
