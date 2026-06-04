# ZMK Display — Reference

## nice-view Ecosystem

### nice-view-gem (M165437)
```yaml
remotes:
  - name: m165437
    url-base: https://github.com/M165437
projects:
  - name: nice-view-gem
    remote: m165437
    revision: 3f38221c61ec   # last LVGL v8 commit — required for ZMK v0.3
    # revision: 522bbf4903e3  # first LVGL v9 commit — use with ZMK main
```
Enable animation: `CONFIG_NICE_VIEW_GEM_ANIMATION=y`

### nice-shield-collection (whoop-t)
```yaml
remotes:
  - name: whoop-t
    url-base: https://github.com/whoop-t
projects:
  - name: nice-shield-collection
    remote: whoop-t
    revision: main
```
Reference the desired shield name in `build.yaml`.

---

## Custom Status Screen — Module Structure

```
my-display-module/
  zephyr/module.yml
  boards/shields/my_screen/
    Kconfig.shield
    Kconfig.defconfig
    my_screen.conf
    my_screen.overlay   # optional
  src/
    status_screen.c
    my_widget.c
    my_widget.h
  CMakeLists.txt
  Kconfig
```

### Entry Point
```c
#include <zmk/display/status_screen.h>

lv_obj_t *zmk_display_status_screen() {
    lv_obj_t *screen = lv_obj_create(NULL);
    my_widget_create(screen);
    return screen;
}
```

---

## LVGL v8 Core Widget APIs

```c
// Object creation
lv_obj_t *obj   = lv_obj_create(parent);
lv_obj_t *label = lv_label_create(parent);
lv_obj_t *canvas = lv_canvas_create(parent);
lv_obj_t *img   = lv_img_create(parent);
lv_obj_t *arc   = lv_arc_create(parent);

// Positioning
lv_obj_set_pos(obj, x, y);
lv_obj_align(obj, LV_ALIGN_CENTER, 0, 0);
lv_obj_set_size(obj, width, height);

// Styling
lv_obj_set_style_bg_color(obj, lv_color_black(), LV_PART_MAIN);
lv_obj_set_style_text_color(label, lv_color_white(), LV_PART_MAIN);
lv_obj_set_style_border_width(obj, 0, LV_PART_MAIN);
lv_obj_set_style_pad_all(obj, 0, LV_PART_MAIN);

// Labels
lv_label_set_text(label, "Hello");
lv_label_set_text_fmt(label, "%d%%", battery_pct);

// Canvas drawing (LVGL v8 — these APIs were removed in v9)
lv_draw_rect_dsc_t rect_dsc;
lv_draw_rect_dsc_init(&rect_dsc);
rect_dsc.bg_color = lv_color_white();
lv_canvas_draw_rect(canvas, x, y, w, h, &rect_dsc);

lv_draw_line_dsc_t line_dsc;
lv_draw_line_dsc_init(&line_dsc);
line_dsc.color = lv_color_white();
line_dsc.width = 1;
lv_point_t points[] = {{x1, y1}, {x2, y2}};
lv_canvas_draw_line(canvas, points, 2, &line_dsc);
```

**v8 vs v9:** In LVGL v9, `lv_canvas_draw_*` was replaced by `lv_draw_*` with layer contexts. Do not use v9 patterns when targeting ZMK v0.3. See zmk-lvgl-migrate for the migration path.

---

## ZMK State Subscription
```c
#include <zmk/event_manager.h>
#include <zmk/events/battery_state_changed.h>
#include <zmk/events/layer_state_changed.h>
#include <zmk/events/ble_active_profile_changed.h>
#include <zmk/events/wpm_state_changed.h>

static int battery_event_handler(const zmk_event_t *eh) {
    const struct zmk_battery_state_changed *ev = as_zmk_battery_state_changed(eh);
    if (ev) {
        // update widget with ev->state_of_charge
    }
    return ZMK_EV_EVENT_BUBBLE;
}

ZMK_LISTENER(my_widget, battery_event_handler);
ZMK_SUBSCRIPTION(my_widget, zmk_battery_state_changed);
```

---

## Image / Animation
```c
LV_IMG_DECLARE(my_image);
lv_obj_t *img = lv_img_create(parent);
lv_img_set_src(img, &my_image);

// Animation
lv_anim_t anim;
lv_anim_init(&anim);
lv_anim_set_exec_cb(&anim, (lv_anim_exec_xcb_t)lv_img_set_angle);
lv_anim_set_var(&anim, img);
lv_anim_set_values(&anim, 0, 3600);
lv_anim_set_time(&anim, 2000);
lv_anim_set_repeat_count(&anim, LV_ANIM_REPEAT_INFINITE);
lv_anim_start(&anim);
```
Requires `CONFIG_LV_USE_ANIMATION=y`.

---

## Dedicated Work Queue
```conf
CONFIG_ZMK_DISPLAY_WORK_QUEUE_DEDICATED=y
CONFIG_ZMK_DISPLAY_DEDICATED_THREAD_STACK_SIZE=2048
CONFIG_ZMK_DISPLAY_DEDICATED_THREAD_PRIORITY=5
```
Required for displays with slow refresh (ePaper, Sharp Memory) to prevent display updates from blocking key scans.

---

## Display Hardware Details

For per-display Kconfig, peripheral role config, and work queue guidance per type, see [`references/display-hardware.md`](references/display-hardware.md).
