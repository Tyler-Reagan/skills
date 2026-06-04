---
name: pretty-zmk-keymap
description: Generates box-drawing ASCII art keymap diagrams embedded as comments in ZMK .keymap files, aligned to each layer's bindings block. Use when the user asks to "add a keymap diagram", "draw the layout", "make the keymap readable", "add ascii art above the layers", or wants a visual representation of their key layout in the .keymap file itself.
license: MIT
metadata:
  author: uraniborglabs@gmail.com
  version: "1.1.0"
  domain: keyboard-firmware
  triggers: ascii art keymap, keymap diagram, pretty keymap, box drawing, keymap layout, keymap visualization, zmk diagram
  role: specialist
  scope: formatting
  output-format: code
  related-skills: zmk-keymap
---

# ZMK Pretty Keymap Formatter

Generates ASCII box-drawing comment diagrams embedded above `bindings = <` blocks in ZMK `.keymap` files. Diagrams are documentation only — no firmware effect, no auto-sync with bindings.

## Two Layout Styles

**Style A — 5-column (34-key, 5×3+2 per side)**
No extra pinky column. 2 thumb keys per side. Each key cell exactly 15 chars wide.
See [`references/layout-34key-5col.md`](references/layout-34key-5col.md) for a rendered QWERTY example.

**Style B — 6-column (38-key, 6×3+3 per side)**
Extra pinky column each side, 3 thumb keys per side. All rows span full 6-column width with closed borders.
See [`references/layout-38key-6col.md`](references/layout-38key-6col.md) for a rendered QWERTY example.

## The Core Rule — Overlay Alignment

The diagram must overlay the `bindings = <` block so a reader can scan vertically from a diagram cell to its binding value. This means:
- `//` comment lines at the **same indentation** as the `bindings = <` keyword
- Lead spacing chosen so each box column aligns with the corresponding binding value column directly below
- **Measure the file's actual binding indentation** — do not guess or use a fixed value

## LCD Spacing Convention

1. Scan all layers for the longest binding token
2. Column width = longest token length + minimum 1 space padding
3. All cells in all layers use this same width — **never vary per-layer**
4. Once established, this width is fixed for the entire map

## Generation Process

1. Count key positions in `bindings = <` to identify layout (34 = Style A, 38 = Style B)
2. Measure the file's binding indentation to derive correct lead spacing
3. Translate each binding to a human-readable label (see Label Rules below)
4. Render 3 main rows + thumb row with box-drawing characters
5. Add combo annotations if combos are defined (below the thumb row on their own `//` line)
6. Verify: each `┃ LABEL` column sits directly above its binding; adjust lead if not

## Label Rules

- `&kp LGUI` → `GUI` | `&mt LCTRL D` → `CTRL` | `&lt SYS TAB` → `SYS+TAB`
- `&bt BT_SEL 0` → `BT_SEL 0` | `&kp LC(LS(N4))` → `SCREENSHOT`
- `&kp C_VOL_UP` → `VOL+` | `&kp LS(MINUS)` → `_`
- `&none` → blank cell | `&trans` → blank cell
- `&sys_reset` → `SYS RESET` | `&bootloader` → `BOOTLOAD`
- Hold-tap: `SYS+TAB`, `NUM+RET`, `DEV+SPACE`

## Gotchas

**Cell width must be consistent across ALL layers.** Establish the LCD width from the longest binding in any layer of the entire map. Varying it per-layer breaks the vertical overlay alignment in every other layer.

**Diagram lines cannot wrap.** Each `//` row is one unbroken line — no exceptions. Word wrap from any editor, terminal, or tool destroys the box art entirely. If the environment word-wraps, that is an environment problem.

**`&trans` and `&none` must be blank cells.** Do not write "TRANS", "____", or any placeholder — blank (spaces only) is the convention. Derived from the reference keymaps in `references/`.

## Constraints

- **Never modify bindings** when only asked to add/fix diagrams — diagrams are documentation only
- **Always count bindings** before rendering — mismatch means wrong layout or wrong style
- Combo annotations belong below the thumb row on their own `//` line, not inside box cells
- Indentation must match the surrounding file's style (spaces at the `//` level)

For the full box-drawing character set, complete layer templates, and binding alignment row convention, see [REFERENCE.md](REFERENCE.md).
