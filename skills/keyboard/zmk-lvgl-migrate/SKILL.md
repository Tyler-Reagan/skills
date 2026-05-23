---
name: zmk-lvgl-migrate
description: Migrates ZMK nice!view display modules from LVGL v8 (ZMK v0.3 / Zephyr 3.5) to LVGL v9 (ZMK main / Zephyr 4.1). Use when the user says "port this display to ZMK main", "migrate from v8 to v9", "lv_canvas_draw_rect undeclared", "LV_IMG_CF_TRUE_COLOR undeclared", or wants to use a community display module that only works on ZMK v0.3. Pairs with zmk-display (v8 API reference) and zmk-config (west.yml / build.yaml changes).
license: MIT
metadata:
  author: tylerreagan98@gmail.com
  version: "1.0.0"
  domain: keyboard-firmware
  triggers: lvgl migrate, v8 to v9, port display, lv_canvas_draw undeclared, LV_IMG_CF undeclared, zmk main display
  role: specialist
  scope: implementation
  output-format: code
  related-skills: zmk-display, zmk-config
---

# ZMK LVGL v8 → v9 Migration

Covers only the delta between versions. For v8 API reference, see the **zmk-display** skill.

## Domain Language

| Term | Meaning |
|------|---------|
| **LVGL v8** | Graphics library used by ZMK v0.3 (Zephyr 3.5) |
| **LVGL v9** | Graphics library used by ZMK main (Zephyr 4.1 / "v0.4") |
| **layer context** | The `lv_layer_t` + `lv_canvas_init_layer` / `lv_canvas_finish_layer` pattern that replaces `lv_canvas_draw_*` in v9 |
| **wrapper functions** | Four `canvas_draw_*` helpers added to `util.c` that preserve v8 call signatures over v9 internals |

## Migration Checklist

Work top-down — later steps depend on earlier ones.

- [ ] 1. `west.yml`: advance ZMK pin from `v0.3` to a ZMK main SHA; add date annotation
- [ ] 2. CI workflow: change `@v0.3` to `@<sha>` matching the ZMK pin
- [ ] 3. `build.yaml`: flat board name → qualified format (`board/soc/zmk`) if not already
- [ ] 4. Kconfig: `LV_USE_IMG` → `LV_USE_IMAGE`; raise `LV_Z_MEM_POOL_SIZE` to 8192+
- [ ] 5. Canvas buffers: `lv_color_t cbuf[]` → `uint8_t cbuf[CANVAS_BUF_SIZE]`; define format constant
- [ ] 6. `lv_canvas_set_buffer` calls: `LV_IMG_CF_*` → `LV_COLOR_FORMAT_*`
- [ ] 7. Add wrapper functions to `util.c` / `util.h` (see API_REFERENCE.md)
- [ ] 8. Replace all `lv_canvas_draw_*` calls with wrapper equivalents
- [ ] 9. `fill_background`: rect-draw pattern → `lv_canvas_fill_bg(canvas, color, LV_OPA_COVER)`
- [ ] 10. `rotate_canvas`: remove `cbuf` parameter; use `lv_draw_sw_rotate` (see API_REFERENCE.md)
- [ ] 11. Screen init: add `lv_obj_set_style_bg_color` + `lv_obj_set_style_bg_opa` after `lv_obj_create`
- [ ] 12. Image asset `.c` files: rename type, remove dead fields, rename `cf` constant (see API_REFERENCE.md)
- [ ] 13. `lv_canvas_set_px_color(canvas, x, y, color)` → `lv_canvas_set_px(canvas, x, y, color, LV_OPA_COVER)`
- [ ] 14. Build; fix remaining compile errors

See [API_REFERENCE.md](API_REFERENCE.md) for code for steps 5–12.

## Quick Orientation

The core change: every `lv_canvas_draw_*` call is gone. Replacement is a layer context pattern — wrap each draw in `lv_canvas_init_layer` / `lv_canvas_finish_layer`. The recommended migration strategy (used by nice-view-gem) is to add four wrapper functions to `util.c` that preserve the old call signatures, then do a mechanical rename across all widget files.

## Common Compile Errors → Cause

| Error | Cause |
|-------|-------|
| `lv_canvas_draw_rect` undeclared | v8 draw API removed — add wrappers (steps 7–8) |
| `LV_IMG_CF_TRUE_COLOR` undeclared | Format constant renamed (steps 5–6) |
| `LV_USE_IMG` not found | Kconfig symbol renamed (step 4) |
| `.always_zero` / `.reserved` has no member | Image descriptor struct changed (step 12) |
| `lv_canvas_transform` undeclared | Rotation API changed (step 10) |
| `lv_draw_img_dsc_t` undeclared | Draw image type renamed (steps 7–8) |
| Black screen / no render | Missing bg_color/bg_opa on screen widget (step 11) |

## References

- **nice-view-gem** migration: commit `522bbf49` in `M165437/nice-view-gem` — "Update for zephyr v4.1" (Jan 25 2026)
- **nice-view-elemental** migration: branch `update-to-zmk-0.4` in `kevinpastor/nice-view-elemental` — open PR "feat: update to LVGL 9" (as of 2026-05-22)
