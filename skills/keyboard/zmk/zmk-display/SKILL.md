---
name: zmk-display
description: ZMK display subsystem specialist covering nice!view, SSD1306 OLED, IL0323 ePaper, and dongle screens. Use when the user asks about adding a display to a ZMK keyboard, writing a custom status screen, using LVGL widgets, integrating nice-view-gem or other display modules, or configuring CONFIG_ZMK_DISPLAY options.
license: MIT
metadata:
  author: uraniborglabs@gmail.com
  version: "1.1.0"
  domain: keyboard-firmware
  triggers: display, LVGL, nice!view, SSD1306, OLED, status screen, widget, dongle screen, CONFIG_ZMK_DISPLAY, nice-view-gem, custom screen
  role: specialist
  scope: implementation
  output-format: code
  related-skills: zmk-config, zmk-keymap, zmk-lvgl-migrate
---

# ZMK Display Engineer

**The critical divergence:** v0.3 uses LVGL v8; ZMK main uses LVGL v9. The switch occurred around Dec 9 2025. Widget drawing APIs changed incompatibly — cross-generation combinations produce compile errors.

Detect the active ZMK version via `west.yml` (zmk-config skill) before advising on display modules or widget code.

## Domain Language

- **central** — The half (or dongle MCU) driving the display and managing BLE connections.
- **LVGL v8** — Graphics library for ZMK v0.3. Canvas draw API: `lv_canvas_draw_rect`, `lv_canvas_draw_line`.
- **LVGL v9** — Graphics library for ZMK main ("v0.4"). Canvas draw API uses layer contexts (`lv_layer_t`). Incompatible with v8 widget code.
- **v0.3** — Stable release (Zephyr 3.5, LVGL v8).
- **ZMK main** — Development branch (Zephyr 4.1, LVGL v9). Community alias: "v0.4".

## Version Detection

| ZMK version | LVGL | v8 API signal | v9 API signal |
|---|---|---|---|
| v0.3 (Zephyr 3.5) | v8 | `lv_canvas_draw_rect(canvas, ...)` | — |
| main (Zephyr 4.1) | v9 | — | `lv_draw_*` with `lv_layer_t *` parameter |

**Compatibility matrix:**

| ZMK | Module LVGL | Result |
|---|---|---|
| v0.3 (v8) | v8 APIs | ✅ Compatible |
| v0.3 (v8) | v9 APIs | ❌ Compile errors — pin module to pre-v9 SHA |
| main (v9) | v8 APIs | ❌ Compile errors — migrate or pin ZMK to v0.3 |
| main (v9) | v9 APIs | ✅ Compatible |

## Supported Display Types

- **nice!view** — Sharp Memory 168×144, SPI, low power. Requires `nice_view_adapter` + display shield.
- **SSD1306** — OLED 128×32 or 128×64, I2C or SPI. `BLANK_ON_IDLE` defaults to on.
- **IL0323** — ePaper, very low power but slow refresh.
- **Dongle screen** — Display on a USB dongle (BLE central). Keyboard halves are peripherals with no display shields.

## Core Kconfig
```conf
CONFIG_ZMK_DISPLAY=y
CONFIG_ZMK_DISPLAY_STATUS_SCREEN_CUSTOM=y    # or CONFIG_ZMK_DISPLAY_STATUS_SCREEN_BUILT_IN=y
CONFIG_ZMK_DISPLAY_WORK_QUEUE_DEDICATED=y    # isolates display from key scan thread
CONFIG_ZMK_DISPLAY_BLANK_ON_IDLE=y
CONFIG_ZMK_DISPLAY_TICK_PERIOD_MS=10
```
`CONFIG_ZMK_DISPLAY_INVERT=y` is **incompatible** with custom status screens.

## Shield Order in build.yaml
```yaml
shield: <keyboard_shield>_left nice_view_adapter nice_view_gem
```
Order: keyboard shield → adapter → display module. **Wrong order compiles successfully but display doesn't work.**

## Gotchas

**Shield order silently breaks the display.** Keyboard → adapter → display module is mandatory. Swapping the adapter and display module produces a working build that shows nothing. No error, no warning.

**`CONFIG_ZMK_DISPLAY_INVERT` silently does nothing with custom screens.** It only affects the built-in screen. Combined with a custom module, it compiles and appears to apply but has no effect.

**LVGL migration comments in source are unreliable.** Developer comments written during v8→v9 migrations are frequently wrong about which version removed which API. Always determine LVGL generation from actual API call signatures, not comments.

**nice-view-gem `main` migrated to LVGL v9 on Jan 25 2026.** The last v8-compatible commit is `3f38221c61ec`. Using `revision: main` with ZMK v0.3 will pull v9 APIs and cause compile errors. Pin to the SHA.

**`CONFIG_ZMK_DISPLAY_WORK_QUEUE_DEDICATED=y` requires explicit stack/priority Kconfig.** Omitting them causes build errors:
```conf
CONFIG_ZMK_DISPLAY_DEDICATED_THREAD_STACK_SIZE=2048
CONFIG_ZMK_DISPLAY_DEDICATED_THREAD_PRIORITY=5
```

## Constraints

- Never copy community module source into your config repo — reference upstream via `west.yml` + shield in `build.yaml`
- LVGL v8 only when ZMK is pinned to v0.3 — using v9 APIs causes compile errors
- Display modules must be listed after keyboard shield and adapter in `build.yaml` shield order
- Dongle display pattern: dongle is BLE central and drives display; keyboard halves are peripherals with no display shields
- Animation (`lv_anim_*`) requires `CONFIG_LV_USE_ANIMATION=y`
- Images must be converted via the LVGL image converter targeting the correct version format

For custom status screen LVGL v8 API (widget creation, event subscription, canvas drawing, image/animation), see [REFERENCE.md](REFERENCE.md). For nice-view ecosystem modules, see [REFERENCE.md](REFERENCE.md#nice-view-ecosystem).
