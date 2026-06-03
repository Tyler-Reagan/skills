---
name: pretty-qmk-keymap
description: Generates visual keymap diagrams embedded as comments in QMK keymap.c files. Two styles are supported — the overlay style (//╷ alignment markers, binding columns align with diagram cells) and the decorative block-comment style (human-readable, Totem/hand-drawn aesthetic). Use when asked to "add a keymap diagram", "draw the layout", "make the keymap readable", or "add ascii art above the layers".
license: MIT
metadata:
  author: tylerreagan98@gmail.com
  version: "1.0.0"
  domain: keyboard-firmware
  triggers: ascii art keymap, keymap diagram, pretty keymap, layout diagram, box drawing, keymap visualization, qmk diagram, totem diagram
  role: specialist
  scope: formatting
  output-format: code
  related-skills: qmk-keymap
---

# QMK Pretty Keymap Formatter

Generates visual layer diagrams embedded as comments in QMK `keymap.c` files. Two complementary styles exist; both can appear in the same file.

---

## Style A — Overlay (`//╷` alignment)

A `//╷` line placed **inside** the `LAYOUT()` call, directly above the bindings. Each `╷` marks the start of a binding column. The diagram above the LAYOUT block provides visual reference; the `//╷` line confirms column positions for reading the binding values.

**Use when:** you want to scan vertically from a key label to its binding without shifting your eyes.

### The Core Rule

The `//╷` separators must sit at the same indentation as the binding values they label. Derive the lead spacing from the file's actual binding indentation — do not guess.

```c
   [_BASE] = LAYOUT(
//╷         ╷         ╷         ╷         ╷         ╷         ╷╷         ╷         ╷         ╷         ╷         ╷         ╷
              KC_Q,     KC_W,     KC_E,     KC_R,     KC_T,      KC_Y,     KC_U,     KC_I,     KC_O,     KC_P,
```

Each `╷` column is 10 characters wide (the LCD column width: longest binding token + padding). The `╷╷` double-separator marks the center gap between left and right halves of a split keyboard.

**Finding the column width:**
1. Find the longest binding token across all layers (e.g. `HYPR(KC_NO),` = 13 chars, or `SYS_TAB,  ` = 10 chars)
2. Column width = length of longest token + minimum 1 space of padding, rounded to a consistent unit
3. All columns in all layers use this same width — never vary per-layer

---

## Style B — Decorative Block Comment

A `/* ... */` block comment placed above the `[LAYER] = LAYOUT(` line. Uses light box-drawing characters to draw a visual keyboard shape. Purely decorative — does not need to align with binding values.

**Use when:** you want a human-readable legend above each layer, especially for sharing or reviewing keymaps.

### Box-Drawing Character Set (Style B)

```
─  U+2500  BOX DRAWINGS LIGHT HORIZONTAL
│  U+2502  BOX DRAWINGS LIGHT VERTICAL
┌  U+250C  BOX DRAWINGS LIGHT DOWN AND RIGHT
┐  U+2510  BOX DRAWINGS LIGHT DOWN AND LEFT
└  U+2514  BOX DRAWINGS LIGHT UP AND RIGHT
┘  U+2518  BOX DRAWINGS LIGHT UP AND LEFT
├  U+251C  BOX DRAWINGS LIGHT VERTICAL AND RIGHT
┤  U+2524  BOX DRAWINGS LIGHT VERTICAL AND LEFT
┬  U+252C  BOX DRAWINGS LIGHT DOWN AND HORIZONTAL
┴  U+2534  BOX DRAWINGS LIGHT UP AND HORIZONTAL
┼  U+253C  BOX DRAWINGS LIGHT VERTICAL AND HORIZONTAL
╨  U+2568  BOX DRAWINGS UP LIGHT AND HORIZONTAL HEAVY  (TRRS connector notch, top)
╤  U+2564  BOX DRAWINGS DOWN LIGHT AND HORIZONTAL HEAVY (TRRS connector notch, bottom)
```

### Totem-Style Block Comment Layout (38-key, 5+1 col per side)

The Totem has 5 columns per half on rows 0–1, 6 columns on row 2 (one extra pinky key each side), and 3 thumb keys per side.

```c
/*
   ┌─────────────────────────────────────────────────┐
   │ l a y e r   n a m e                             │
   └─────────────────────────────────────────────────┘
             ┌─────────┬─────────┬─────────┬─────────┬──────╨──┐┌──╤──────┬─────────┬─────────┬─────────┬─────────┐
     ╌┄┈┈───═╡ [R0C0]  │ [R0C1]  │ [R0C2]  │ [R0C3]  │ [R0C4]  ││ [R0C5] │ [R0C6]  │ [R0C7]  │ [R0C8]  │ [R0C9]  │
             ├─────────┼─────────┼─────────┼─────────┼─────────┤├─────────┼─────────┼─────────┼─────────┼─────────┤
             │ [R1C0]  │ [R1C1]  │ [R1C2]  │ [R1C3]  │ [R1C4]  ││ [R1C5] │ [R1C6]  │ [R1C7]  │ [R1C8]  │ [R1C9]  │
   ┌─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┐
   │ [LPIN]  │ [R2C0]  │ [R2C1]  │ [R2C2]  │ [R2C3]  │ [R2C4]  ││ [R2C5] │ [R2C6]  │ [R2C7]  │ [R2C8]  │ [R2C9]  │ [RPIN]  │
   └─────────┴─────────┴─────────┼─────────┼─────────┼─────────┤├─────────┼─────────┼─────────┼─────────┴─────────┴─────────┘
                                 │ [THL2]  │ [THL1]  │ [THL0]  ││ [THR0] │ [THR1]  │ [THR2]  │
                                 └─────────┴─────────┴─────────┘└─────────┴─────────┴─────────┘ */
```

The `╨` / `╤` characters mark where the TRRS cable connector notch appears on the PCB top edge between the two halves. The `╌┄┈┈───═╡` motif on the left is a decorative cable trace — use it on row 0 only, on the left half's connection side.

**Key cell width in Style B:** 9 characters of content (8 for label + 1 leading space), bounded by `│` on each side. Pad shorter labels with trailing spaces.

---

## Label Formatting Rules (both styles)

- Labels are human-readable, not raw keycodes
- Keep to ≤8 characters for Style B cells; ≤9 for Style A (10-char columns minus the `╷`)
- Mod-tap: show hold/tap with `/` separator — `GUI/S`, `CTRL/D`, `SHFT/F`
- Layer-tap: show layer+key — `SYS/TAB`, `DEV/SPC`, `NUM/ENT`, `FUN/DEL`
- Modifier wrappers: show the shortcut intent — `SCRNSHT` not `S(C(KC_4))`, `LOCK` not `C(G(KC_Q))`
- `XXXXXXX` / `KC_NO` → blank cell (spaces)
- `_______` / `KC_TRNS` → blank cell (spaces)
- `QK_BOOT` → `BOOTLDR`
- `QK_RBT` → `RESET`
- Modifiers on non-base layers: `GUI`, `ALT`, `CTRL`, `SHIFT`
- Media: `VOL+`, `VOL-`, `MUTE`, `PLAY`, `PREV`, `NEXT`

---

## Style B Generation Process

1. **Identify layout shape** — count key positions per row in the LAYOUT macro or `<kb>.h`
2. **Map positions to labels** — translate each binding; blank for `XXXXXXX`/`_______`
3. **Render rows 0–1** — 5+5 columns with center gap (no pinky column)
4. **Render row 2** — 6+6 columns including pinky extension (extend the outer `┌`/`┐` border leftward/rightward)
5. **Render thumb row** — 3+3 keys, indented to align under columns 3–5 on each half
6. **Wrap in `/* ... */`** — the block comment sits above `[LAYER] = LAYOUT(`

---

## Style A Generation Process

1. **Measure binding column width** — find the longest binding token in any layer of this file; column width = that length + enough padding to align
2. **Place `//╷` line** — inside the `LAYOUT()` call, one line above the first row of bindings, indented to match binding position
3. **Verify overlay** — each `╷` should sit directly above the start of its binding token

---

## Full Style B Template — Totem (38-key)

```c
/*
   ┌─────────────────────────────────────────────────┐
   │ b a s e                                         │      ╭╮╭╮╭╮╭╮
   └─────────────────────────────────────────────────┘      │╰╯╰╯╰╯│
             ┌─────────┬─────────┬─────────┬─────────┬──────╨──┐┌──╨──────┬─────────┬─────────┬─────────┬─────────┐
     ╌┄┈┈───═╡    Q    │    W    │    E    │    R    │    T    ││    Y    │    U    │    I    │    O    │    P    │
             ├─────────┼─────────┼─────────┼─────────┼─────────┤├─────────┼─────────┼─────────┼─────────┼─────────┤
             │    A    │  GUI/S  │ CTRL/D  │ SHFT/F  │    G    ││    H    │ SHFT/J  │ CTRL/K  │  GUI/L  │    ;    │
   ┌─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┐
   │  HYPER  │    Z    │    X    │    C    │    V    │    B    ││    N    │    M    │    ,    │    .    │    /    │    '    │
   └─────────┴─────────┴─────────┼─────────┼─────────┼─────────┤├─────────┼─────────┼─────────┼─────────┴─────────┴─────────┘
                                 │   ESC   │ SYS/TAB │ DEV/SPC ││  BSPC   │ NUM/ENT │ FUN/DEL │
                                 └─────────┴─────────┴─────────┘└─────────┴─────────┴─────────┘ */
```

The `╭╮╭╮╭╮╭╮` / `│╰╯╰╯╰╯│` motif above row 0 represents the TRRS cable connection between the halves (optional, decorative).

---

## Style A Template — 10-char column width, 5+5 per row

```c
   [_BASE] = LAYOUT(
//╷         ╷         ╷         ╷         ╷         ╷         ╷╷         ╷         ╷         ╷         ╷         ╷         ╷
              KC_Q,     KC_W,     KC_E,     KC_R,     KC_T,      KC_Y,     KC_U,     KC_I,     KC_O,     KC_P,
```

Row 2 and thumb row use the same column width; the pinky column (`L30`/`R34`) appears at the start/end of row 2, before the regular columns.

---

## Constraints

- **Never modify bindings** when only asked to add/fix diagrams — diagrams are documentation only.
- **Style B is purely decorative** — it has no alignment requirement with binding values.
- **Style A must align** — each `╷` must sit directly above the start of its corresponding binding token.
- **Use `/* */` for Style B block comments** — multi-line. Use `//` for Style A alignment markers — they appear inside the LAYOUT() call body.
- **Blank = blank** — do not write `TRANS` or `----` for `_______`/`XXXXXXX`. Empty cells should be spaces only.
- **Each line is one line** — do not let the terminal or editor word-wrap box-drawing art. Each `/* ... */` row is one unbroken line.
- **Combo annotations** go on their own line below the diagram, not inside box cells.
