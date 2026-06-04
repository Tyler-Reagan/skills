---
name: pretty-qmk-keymap
description: Generates visual keymap diagrams embedded as comments in QMK keymap.c files. Two styles are supported — the overlay style (//╷ alignment markers, binding columns align with diagram cells) and the decorative block-comment style (human-readable, Totem/hand-drawn aesthetic). Use when asked to "add a keymap diagram", "draw the layout", "make the keymap readable", or "add ascii art above the layers".
license: MIT
metadata:
  author: tylerreagan98@gmail.com
  version: "1.1.0"
  domain: keyboard-firmware
  triggers: ascii art keymap, keymap diagram, pretty keymap, layout diagram, box drawing, keymap visualization, qmk diagram, totem diagram
  role: specialist
  scope: formatting
  output-format: code
  related-skills: qmk-keymap
---

# QMK Pretty Keymap Formatter

Generates visual layer diagrams embedded as comments in QMK `keymap.c` files. Two complementary styles — both can appear in the same file.

## Two Styles

**Style A — Overlay (`//╷` alignment)**
A `//╷` line inside the `LAYOUT()` call, directly above the bindings. Each `╷` marks a binding column. Use when you want vertical scan alignment from key label to binding value.

**Style B — Decorative Block Comment**
A `/* ... */` block above `[LAYER] = LAYOUT(`. Light box-drawing characters draw a keyboard shape. Purely decorative — no alignment requirement with binding values.

Use both: Style B provides a human-readable legend; Style A confirms column positions inside the LAYOUT call.

## The Core Rule — Style A Alignment

`//╷` separators must sit at the same indentation as the binding values. Derive lead spacing from the file's actual binding position — do not guess.

```c
   [_BASE] = LAYOUT(
//╷         ╷         ╷         ╷         ╷         ╷╷         ╷         ╷         ╷         ╷         ╷
              KC_Q,     KC_W, ...
```

`╷╷` double-separator marks the center gap between left and right halves.

## Column Width (LCD)

1. Find the longest binding token across all layers
2. Column width = longest token + minimum 1 space padding
3. All columns in all layers use this same width — **never vary per-layer**

## Label Rules (both styles)

- Keep to ≤9 characters for Style A, ≤8 for Style B
- Mod-tap: `GUI/S`, `CTRL/D`, `SHFT/F`
- Layer-tap: `SYS/TAB`, `DEV/SPC`, `NUM/ENT`
- Modifier wrappers: `SCRNSHT` not `S(C(KC_4))`, `LOCK` not `C(G(KC_Q))`
- `XXXXXXX`/`_______` → blank cell (spaces only)
- `QK_BOOT` → `BOOTLDR` | `QK_RBT` → `RESET`

## Gotchas

**Column width must be consistent across ALL layers.** Establish the LCD width from the longest binding token in any layer of the file. Varying per-layer breaks the vertical overlay in every other layer.

**Style A must align — measure the file, don't guess.** Arbitrary lead spacing produces a diagram that looks right but doesn't actually align with binding values. Read the file's indentation first.

**Each line is one unbroken line.** Editor word wrap destroys box art. Each `/* ... */` and `//` row must be a single line — no exceptions.

**Style B is purely decorative.** It has no alignment requirement with binding values. Use Style A when alignment matters.

## Constraints

- Never modify bindings when only asked to add/fix diagrams
- Blank = blank — do not write "TRANS" or "----" for `_______`/`XXXXXXX`
- Combo annotations go on their own line below the diagram, not inside box cells
- `/* */` for Style B (multi-line block); `//` for Style A (inside LAYOUT body)

For the full box-drawing character set, Style B Totem template, and Style A/B full templates, see [REFERENCE.md](REFERENCE.md).
