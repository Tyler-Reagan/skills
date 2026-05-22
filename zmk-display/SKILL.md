---
name: zmk-display
description: Use when working with ZMK display hardware, custom status screens, LVGL widgets, or display module integration. Covers all supported display types (nice!view Sharp Memory, SSD1306 OLED, IL0323 ePaper, dongle screens), Kconfig options, custom status screen authoring, LVGL v8 widget API (v0.3 branch), nice-view ecosystem modules, and dongle display patterns. Invoke for any task involving ZMK display configuration, widget code, or display module setup.
license: MIT
metadata:
  author: tylerreagan98@gmail.com
  version: "1.0.0"
  domain: keyboard-firmware
  triggers: display, LVGL, nice!view, SSD1306, OLED, status screen, widget, dongle screen, CONFIG_ZMK_DISPLAY, nice-view-gem, custom screen
  role: specialist
  scope: implementation
  output-format: code
  related-skills: zmk-config, zmk-keymap
---

# ZMK Display Engineer

Expert in ZMK v0.3 display subsystem: supported hardware, Kconfig, LVGL v8 widget authoring, and community module integration. All options validated against https://v0-3-branch.zmk.dev/docs/config/displays.

**Critical version constraint:** ZMK v0.3 uses **LVGL v8**. The `main` branch switched to LVGL v9 around Dec 9 2025, breaking all drawing APIs. All widget code in this skill targets the v8 API. Do not use v9 APIs when pinned to v0.3.

---

## Supported Display Types

### nice!view — Sharp Memory Display (168×144)
- Controller: LS013B7DH05 (Sharp)
- Interface: SPI
- The dominant display for wireless ZMK keyboards
- Community ecosystem: nice-view-gem, nice-shield-collection (whoop-t), and others
- Requires `nice_view_adapter` shield + display module shield in `build.yaml`
- White/black only, low power, no backlight needed

### SSD1306 — OLED (128×32 or 128×64)
- Interface: I2C or SPI
- Common in wired/QMK-ported keyboards
- `CONFIG_ZMK_DISPLAY_BLANK_ON_IDLE=y` is the default for SSD1306
- Higher power draw than Sharp Memory — consider `CONFIG_ZMK_SLEEP`

### IL0323 — ePaper
- ZMK includes a native driver
- Very low power, retains image without refresh
- Slow refresh rate — not suitable for frequently-updated widgets

### Dongle Screen
- A dedicated display on a USB dongle that acts as the BLE central
- The dongle receives split data from both keyboard halves over BLE
- Configured as its own shield with its own `build.yaml` entry
- Can show combined status from both halves (useful for wireless split without displays on the halves themselves)
- Pattern used in `zmk-dongle-screen` repo: dongle has display + acts as central, keyboard halves are peripherals only

---

## Kconfig — Display Options

### Core

```conf
CONFIG_ZMK_DISPLAY=y                            # enable display subsystem (required)

# Status screen — choose exactly one:
CONFIG_ZMK_DISPLAY_STATUS_SCREEN_BUILT_IN=y     # ZMK default screen
CONFIG_ZMK_DISPLAY_STATUS_SCREEN_CUSTOM=y       # custom module (nice-view-gem, etc.)

# Work queue — choose exactly one:
CONFIG_ZMK_DISPLAY_WORK_QUEUE_DEDICATED=y       # dedicated thread — isolates display from keyboard responsiveness
CONFIG_ZMK_DISPLAY_WORK_QUEUE_SYSTEM=y          # system thread (default)

CONFIG_ZMK_DISPLAY_TICK_PERIOD_MS=10            # ms between display task executions (default 10)
CONFIG_ZMK_DISPLAY_BLANK_ON_IDLE=y              # blank display on keyboard idle (default y for SSD1306)
CONFIG_ZMK_DISPLAY_INVERT=y                     # invert colors — incompatible with custom status screens
```

### Built-in Widgets (active when using built-in screen)

```conf
CONFIG_ZMK_WIDGET_LAYER_STATUS=y                # show active layer name
CONFIG_ZMK_WIDGET_BATTERY_STATUS=y              # show battery level
CONFIG_ZMK_WIDGET_BATTERY_STATUS_SHOW_PERCENTAGE=y  # percentage vs. icon
CONFIG_ZMK_WIDGET_OUTPUT_STATUS=y               # show USB/BLE output
CONFIG_ZMK_WIDGET_WPM_STATUS=y                  # show WPM (requires CONFIG_ZMK_WPM=y)
```

### Module-Specific Options

nice-view-gem:
```conf
CONFIG_NICE_VIEW_GEM_ANIMATION=y                # enable gem spinning animation (battery impact)
```

---

## Display Shield Integration (build.yaml)

### nice!view on a split keyboard

```yaml
include:
  - board: nice_nano/nrf52840/zmk
    shield: urchin_left nice_view_adapter nice_view_gem
    artifact-name: urchin_left
  - board: nice_nano/nrf52840/zmk
    shield: urchin_right nice_view_adapter nice_view_gem
    artifact-name: urchin_right
```

Shield order matters:
1. Keyboard shield (`urchin_left`) — defines the key matrix
2. Adapter shield (`nice_view_adapter`) — wires the display to the MCU's SPI pins
3. Display module (`nice_view_gem`) — provides the custom status screen implementation

### Dongle with display

```yaml
include:
  - board: nice_nano/nrf52840/zmk
    shield: my_dongle my_dongle_display
    artifact-name: dongle
  - board: nice_nano/nrf52840/zmk
    shield: my_keyboard_left
    artifact-name: keyboard_left
  - board: nice_nano/nrf52840/zmk
    shield: my_keyboard_right
    artifact-name: keyboard_right
```

The dongle acts as central and renders display; keyboard halves are peripherals with no display shield.

---

## nice-view Ecosystem

### Official modules (whoop-t / nice-shield-collection)
Repo: `https://github.com/whoop-t/nice-shield-collection`

A curated collection of alternative status screens for the nice!view. Add to `west.yml`:

```yaml
remotes:
  - name: whoop-t
    url-base: https://github.com/whoop-t
projects:
  - name: nice-shield-collection
    remote: whoop-t
    revision: main
```

Then reference the desired shield in `build.yaml`:
```yaml
shield: urchin_left nice_view_adapter <shield-name-from-collection>
```

### nice-view-gem (M165437)
The animated gem status screen. Add to `west.yml`:

```yaml
remotes:
  - name: m165437
    url-base: https://github.com/M165437
projects:
  - name: nice-view-gem
    remote: m165437
    revision: main
```

Enable animation in `.conf`:
```conf
CONFIG_NICE_VIEW_GEM_ANIMATION=y
```

**Note:** All nice-view community modules require ZMK pinned to `v0.3`. They are not compatible with ZMK `main` (LVGL v9).

---

## Custom Status Screen — LVGL v8 API

Custom status screens implement `zmk_display_status_screen()` and register LVGL widgets.

### Module Structure

```
my-display-module/
  zephyr/
    module.yml
  boards/
    shields/
      my_screen/
        Kconfig.shield
        Kconfig.defconfig
        my_screen.conf
        my_screen.overlay   # optional devicetree additions
  src/
    status_screen.c
    my_widget.c
    my_widget.h
  CMakeLists.txt
  Kconfig
```

### Status Screen Entry Point

```c
#include <zephyr/kernel.h>
#include <zmk/display/status_screen.h>

lv_obj_t *zmk_display_status_screen() {
    lv_obj_t *screen = lv_obj_create(NULL);

    // create and position widgets on the screen object
    my_widget_create(screen);

    return screen;
}
```

### LVGL v8 Core Widget APIs

```c
// Object creation
lv_obj_t *obj = lv_obj_create(parent);
lv_obj_t *label = lv_label_create(parent);
lv_obj_t *canvas = lv_canvas_create(parent);
lv_obj_t *img = lv_img_create(parent);
lv_obj_t *arc = lv_arc_create(parent);

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

// Canvas drawing (LVGL v8)
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

**v8 vs v9:** In LVGL v9 the canvas drawing API changed significantly (`lv_canvas_draw_*` → `lv_draw_*` with layer contexts). Do not use v9 patterns when targeting ZMK v0.3.

### ZMK State Subscription

Widgets subscribe to ZMK events via the subscription system:

```c
#include <zmk/event_manager.h>
#include <zmk/events/battery_state_changed.h>
#include <zmk/events/layer_state_changed.h>
#include <zmk/events/ble_active_profile_changed.h>
#include <zmk/events/usb_conn_state_changed.h>
#include <zmk/events/wpm_state_changed.h>

// Define a listener
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

### Image / Animation

```c
// Declare image asset (generated from PNG via lvgl image converter)
LV_IMG_DECLARE(my_image);

lv_obj_t *img = lv_img_create(parent);
lv_img_set_src(img, &my_image);

// Animation
lv_anim_t anim;
lv_anim_init(&anim);
lv_anim_set_exec_cb(&anim, (lv_anim_exec_xcb_t)lv_img_set_angle);
lv_anim_set_var(&anim, img);
lv_anim_set_values(&anim, 0, 3600);         // 0–360° in tenths of degrees
lv_anim_set_time(&anim, 2000);              // 2 second period
lv_anim_set_repeat_count(&anim, LV_ANIM_REPEAT_INFINITE);
lv_anim_start(&anim);
```

Enable animation in Kconfig:
```conf
CONFIG_LV_USE_ANIMATION=y
```

---

## Dedicated Work Queue

For displays with slow refresh (ePaper, Sharp Memory), a dedicated thread prevents the display update from blocking key scan:

```conf
CONFIG_ZMK_DISPLAY_WORK_QUEUE_DEDICATED=y
CONFIG_ZMK_DISPLAY_DEDICATED_THREAD_STACK_SIZE=2048
CONFIG_ZMK_DISPLAY_DEDICATED_THREAD_PRIORITY=5
```

---

## Constraints

- **LVGL v8 only** when ZMK is pinned to v0.3. All community display modules (nice-view-gem, nice-shield-collection) depend on this. Using v9 APIs will cause compile errors.
- `CONFIG_ZMK_DISPLAY_INVERT=y` is **incompatible** with custom status screens — only use with the built-in screen.
- Display modules must be listed **after** the keyboard shield and adapter in `build.yaml` shield order.
- The dongle display pattern requires the dongle to act as BLE central — keyboard halves become peripherals only and cannot have their own display shields in the same build.
- `CONFIG_ZMK_DISPLAY_WORK_QUEUE_DEDICATED=y` requires explicit stack size and priority Kconfig; omitting them causes build errors.
- Images used in LVGL must be converted via the LVGL image converter tool targeting v8 format — v9 format images are incompatible.
- Animation (`lv_anim_*`) requires `CONFIG_LV_USE_ANIMATION=y` in Kconfig.
