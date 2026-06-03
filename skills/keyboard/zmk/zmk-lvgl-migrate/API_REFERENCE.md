# LVGL v8 → v9 API Reference

## Canvas Buffer (Step 5–6)

```c
// v8
lv_color_t cbuf[BUFFER_SIZE * BUFFER_SIZE];
lv_canvas_set_buffer(canvas, cbuf, W, H, LV_IMG_CF_TRUE_COLOR);

// v9 — buffer is uint8_t, size computed with stride-aware macro
#define CANVAS_COLOR_FORMAT LV_COLOR_FORMAT_L8   // grayscale; use LV_COLOR_FORMAT_I1 for 1-bit
#define CANVAS_BUF_SIZE \
    LV_CANVAS_BUF_SIZE(CANVAS_SIZE, CANVAS_SIZE, \
        LV_COLOR_FORMAT_GET_BPP(CANVAS_COLOR_FORMAT), LV_DRAW_BUF_STRIDE_ALIGN)

uint8_t cbuf[CANVAS_BUF_SIZE];
lv_canvas_set_buffer(canvas, cbuf, W, H, CANVAS_COLOR_FORMAT);
```

In struct definitions, update accordingly:
```c
// v8
lv_color_t cbuf[BUFFER_SIZE * BUFFER_SIZE];

// v9
uint8_t cbuf[CANVAS_BUF_SIZE];
```

---

## Wrapper Functions (Steps 7–8)

Add to `util.h`:

```c
void canvas_draw_rect(lv_obj_t *canvas, int32_t x, int32_t y, int32_t w, int32_t h,
                      lv_draw_rect_dsc_t *rect_dsc);
void canvas_draw_text(lv_obj_t *canvas, int32_t x, int32_t y, int32_t max_w,
                      lv_draw_label_dsc_t *label_dsc, const char *text);
void canvas_draw_line(lv_obj_t *canvas, const lv_point_t *points, uint32_t point_cnt,
                      lv_draw_line_dsc_t *line_dsc);
void canvas_draw_img(lv_obj_t *canvas, int32_t x, int32_t y, const void *src,
                     lv_draw_image_dsc_t *img_dsc);
```

Add to `util.c`:

```c
void canvas_draw_rect(lv_obj_t *canvas, int32_t x, int32_t y, int32_t w, int32_t h,
                      lv_draw_rect_dsc_t *rect_dsc) {
    lv_layer_t layer;
    lv_canvas_init_layer(canvas, &layer);
    lv_area_t coords = {x, y, x + w - 1, y + h - 1};
    lv_draw_rect(&layer, rect_dsc, &coords);
    lv_canvas_finish_layer(canvas, &layer);
}

void canvas_draw_text(lv_obj_t *canvas, int32_t x, int32_t y, int32_t max_w,
                      lv_draw_label_dsc_t *label_dsc, const char *text) {
    lv_layer_t layer;
    lv_canvas_init_layer(canvas, &layer);
    label_dsc->text = text;
    lv_area_t coords = {x, y, x + max_w, y + CANVAS_SIZE};
    lv_draw_label(&layer, label_dsc, &coords);
    lv_canvas_finish_layer(canvas, &layer);
}

void canvas_draw_line(lv_obj_t *canvas, const lv_point_t *points, uint32_t point_cnt,
                      lv_draw_line_dsc_t *line_dsc) {
    lv_layer_t layer;
    lv_canvas_init_layer(canvas, &layer);
    for (uint32_t i = 1; i < point_cnt; i++) {
        line_dsc->p1.x = points[i - 1].x;
        line_dsc->p1.y = points[i - 1].y;
        line_dsc->p2.x = points[i].x;
        line_dsc->p2.y = points[i].y;
        lv_draw_line(&layer, line_dsc);
    }
    lv_canvas_finish_layer(canvas, &layer);
}

void canvas_draw_img(lv_obj_t *canvas, int32_t x, int32_t y, const void *src,
                     lv_draw_image_dsc_t *img_dsc) {
    lv_layer_t layer;
    lv_canvas_init_layer(canvas, &layer);
    const lv_image_dsc_t *img_src = (const lv_image_dsc_t *)src;
    img_dsc->src = img_src;
    lv_area_t coords = {x, y, x + img_src->header.w - 1, y + img_src->header.h - 1};
    lv_draw_image(&layer, img_dsc, &coords);
    lv_canvas_finish_layer(canvas, &layer);
}
```

Then across all widget files, rename call sites:

| v8 | v9 |
|----|-----|
| `lv_canvas_draw_rect(canvas, ...)` | `canvas_draw_rect(canvas, ...)` |
| `lv_canvas_draw_text(canvas, ...)` | `canvas_draw_text(canvas, ...)` |
| `lv_canvas_draw_line(canvas, ...)` | `canvas_draw_line(canvas, ...)` |
| `lv_canvas_draw_img(canvas, ...)` | `canvas_draw_img(canvas, ...)` |
| `lv_draw_img_dsc_t` | `lv_draw_image_dsc_t` |
| `lv_draw_img_dsc_init(...)` | `lv_draw_image_dsc_init(...)` |

**Note:** `lv_canvas_init_layer` / `lv_canvas_finish_layer` pairs can be called multiple times
within a single draw function — each draw call can open and close its own layer cycle.

When writing new v9 code directly (no wrapper):

```c
lv_layer_t layer;
lv_canvas_init_layer(canvas, &layer);
lv_area_t coords = {x, y, x + w - 1, y + h - 1};
lv_draw_rect(&layer, &rect_dsc, &coords);
lv_canvas_finish_layer(canvas, &layer);
```

---

## Fill Background (Step 9)

```c
// v8
lv_draw_rect_dsc_t rect_black_dsc;
init_rect_dsc(&rect_black_dsc, LVGL_BACKGROUND);
lv_canvas_draw_rect(canvas, 0, 0, BUFFER_SIZE, BUFFER_SIZE, &rect_black_dsc);

// v9
lv_canvas_fill_bg(canvas, LVGL_BACKGROUND, LV_OPA_COVER);
```

---

## Canvas Rotation (Step 10)

```c
// v8
void rotate_canvas(lv_obj_t *canvas, lv_color_t cbuf[]) {
    static lv_color_t cbuf_tmp[BUFFER_SIZE * BUFFER_SIZE];
    memcpy(cbuf_tmp, cbuf, sizeof(cbuf_tmp));
    lv_img_dsc_t img;
    img.data = (void *)cbuf_tmp;
    img.header.cf = LV_IMG_CF_TRUE_COLOR;
    img.header.w = BUFFER_SIZE;
    img.header.h = BUFFER_SIZE;
    lv_canvas_fill_bg(canvas, LVGL_BACKGROUND, LV_OPA_COVER);
    lv_canvas_transform(canvas, &img, 900, LV_IMG_ZOOM_NONE, -1, 0,
                        BUFFER_SIZE / 2, BUFFER_SIZE / 2, false);
}

// v9 — cbuf retrieved from canvas; lv_draw_sw_rotate replaces lv_canvas_transform
void rotate_canvas(lv_obj_t *canvas) {
    static uint8_t cbuf_tmp[CANVAS_BUF_SIZE];
    uint8_t *cbuf = lv_canvas_get_draw_buf(canvas)->data;
    memcpy(cbuf_tmp, cbuf, CANVAS_BUF_SIZE);
    lv_canvas_fill_bg(canvas, LVGL_BACKGROUND, LV_OPA_COVER);
    const int32_t stride = lv_draw_buf_width_to_stride(CANVAS_SIZE, CANVAS_COLOR_FORMAT);
    lv_draw_sw_rotate(cbuf_tmp, cbuf, CANVAS_SIZE, CANVAS_SIZE, stride, stride,
                      LV_DISPLAY_ROTATION_270, CANVAS_COLOR_FORMAT);
}
```

Update all callers to drop the `cbuf` argument: `rotate_canvas(canvas)`.

---

## Screen Widget Background (Step 11)

```c
// v9 addition — without this the screen renders black
lv_obj_set_style_bg_color(widget->obj, LVGL_BACKGROUND, LV_PART_MAIN);
lv_obj_set_style_bg_opa(widget->obj, LV_OPA_COVER, LV_PART_MAIN);
```

Add immediately after `lv_obj_create` in `zmk_widget_screen_init`.

---

## Image Asset Files (Step 12)

All compiled image `.c` files need two mechanical changes per `lv_img_dsc_t` declaration.

```c
// v8
const lv_img_dsc_t my_image = {
    .header.cf = LV_IMG_CF_INDEXED_1BIT,
    .header.always_zero = 0,
    .header.reserved = 0,
    .header.w = 69,
    .header.h = 68,
    .data_size = 620,
    .data = my_image_map,
};

// v9 — type renamed, always_zero and reserved removed, cf value renamed
const lv_image_dsc_t my_image = {
    .header.cf = LV_COLOR_FORMAT_I1,
    .header.w = 69,
    .header.h = 68,
    .data_size = 620,
    .data = my_image_map,
};
```

`LV_IMG_DECLARE(my_image)` is unchanged — still works in v9.

**Format constant mapping:**

| v8 | v9 |
|----|-----|
| `LV_IMG_CF_INDEXED_1BIT` | `LV_COLOR_FORMAT_I1` |
| `LV_IMG_CF_TRUE_COLOR` | `LV_COLOR_FORMAT_RGB565` or `LV_COLOR_FORMAT_L8` (context-dependent) |
| `LV_IMG_CF_ALPHA_8BIT` | `LV_COLOR_FORMAT_A8` |

For animation-heavy modules with many frame files, this is the bulk of the work — the changes are
mechanical but must be applied to every frame. Use sed or find-and-replace across the image
directory.

---

## Kconfig Changes (Step 4)

```kconfig
# v8
select LV_USE_IMG
config LV_Z_MEM_POOL_SIZE
    default 4096 if ZMK_DISPLAY_STATUS_SCREEN_CUSTOM

# v9
select LV_USE_IMAGE
config LV_Z_MEM_POOL_SIZE
    default 8192 if ZMK_DISPLAY_STATUS_SCREEN_CUSTOM
```

---

## Single-Pixel Draw (Step 13)

```c
// v8
lv_canvas_set_px_color(canvas, x, y, color);

// v9
lv_canvas_set_px(canvas, x, y, color, LV_OPA_COVER);
```
