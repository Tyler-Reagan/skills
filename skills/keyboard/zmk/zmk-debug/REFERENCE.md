# ZMK Debug — Phase Reference

## Phase 2A: Build Errors

Collect before matching: last 30+ lines of CI log, `west.yml` revision, `build.yaml` board format, CI workflow ref. All three must agree.

| Error text | Cause | Fix |
|---|---|---|
| `KeyError: 'qualifiers'` | CI workflow `@main` running against ZMK v0.3 source | Pin `.github/workflows/*.yml` to `@v0.3` |
| `Invalid BOARD; see above` | Qualified board format with ZMK v0.3 CMake | Change to flat board name (e.g. `nice_nano_v2`) |
| `<board_name> not found` with flat name | ZMK main expects qualified format | Change to `board/soc/zmk` (e.g. `nice_nano_v2/nrf52840/zmk`) |
| `west update: ... not found` | `revision:` tag or branch doesn't exist on remote | Verify the ref on the remote; fall back to `main` or a known SHA |
| LVGL v8 API in ZMK main build (`lv_canvas_draw_*` undefined) | Display module uses LVGL v8; ZMK is on main (LVGL v9) | Pin module to its last v8-compatible SHA, or pin ZMK to v0.3 |
| LVGL v9 API in ZMK v0.3 build | Display module migrated to v9; ZMK is still on v0.3 | Pin module to its pre-v9 SHA (nice-view-gem: `3f38221c61ec`) |
| `undefined reference to lv_anim_*` | Animation enabled but not in Kconfig | Add `CONFIG_LV_USE_ANIMATION=y` to `.conf` |
| `shield <name> not found` | Shield name typo, or module not in `west.yml` | Verify name in the module's `boards/shields/` directory |

---

## Phase 2B: Flash Failures

| Symptom | Fix |
|---|---|
| Drive never mounts after double-tap | Try holding reset for 5s; some boards need long press instead of double-tap |
| Drive mounts but ejects immediately | Charge-only cable — swap for a data cable |
| Wrong artifact flashed | Flash `settings_reset.uf2` to clear state, then re-flash the correct side |
| `NICENANO` mounts but copy fails on macOS | Use `cp -X firmware.uf2 /Volumes/NICENANO` instead of drag-and-drop |
| Drive doesn't appear on Linux | Run `dmesg | tail -20` to confirm USB recognition; try different port |

---

## Phase 2C: Pairing Issues

**Step 1:** Delete keyboard from host Bluetooth settings, re-pair. Power on central first, then peripheral.

**Step 2 (if Step 1 fails):** Flash `settings_reset.uf2` to **both** halves, power-cycle, re-pair from scratch.

**Step 3 (halves won't find each other after reset):**
- Both halves must run the same firmware from the same CI build
- Central must power on before peripheral — give it 10–15s to initialize BLE
- For dongle setups: pair left peripheral first, then right (reversing swaps battery widget assignment)

**Step 4 (multiple BT profiles):** Use `&bt BT_SEL N` to select the slot, then `&bt BT_CLR` to clear it, then re-pair.

---

## Phase 2D: Display Issues

**Won't compile:** See Phase 2A LVGL rows — almost always a version mismatch.

**Compiles but display is blank:**
1. Confirm `CONFIG_ZMK_DISPLAY=y` in the `.conf` for the side with the display
2. Verify shield order in `build.yaml`: keyboard → adapter (`nice_view_adapter`) → display module — wrong order compiles silently but display doesn't work
3. Verify display module is in `west.yml` and revision is compatible with ZMK version
4. Press a key — display may just be blanked by `CONFIG_ZMK_DISPLAY_BLANK_ON_IDLE=y` (default on SSD1306)

**Wrong content (built-in screen instead of custom):**
- Confirm `CONFIG_ZMK_DISPLAY_STATUS_SCREEN_CUSTOM=y`
- Confirm the module's shield is in the `build.yaml` shield stack (not just in `west.yml`)

**Sluggish keys:** Add `CONFIG_ZMK_DISPLAY_WORK_QUEUE_DEDICATED=y`

**`CONFIG_ZMK_DISPLAY_INVERT` has no effect:** Incompatible with custom status screens — only works with the built-in screen.

---

## Phase 2E: ZMK Studio Issues

| Symptom | Fix |
|---|---|
| App can't find keyboard | Verify `snippet: studio-rpc-usb-uart` is on the **central** build target — not the peripheral |
| Keyboard locked | Add `&studio_unlock` to an accessible key and reflash |
| Edits disappear after flashing | Studio keymap is stored in flash separately; flashing resets to `.keymap` baseline — use "Restore Stock Settings" in Studio to re-enable live editing |
| `STUDIO_LOCKING=n` in `.conf` isn't disabling lock | `cmake-args` in `build.yaml` overrides `.conf` — move Studio options to `cmake-args` |
| Studio works on USB but not BLE | Studio uses USB serial transport only — BLE Studio is not currently supported |
