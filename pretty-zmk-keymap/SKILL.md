---
name: pretty-zmk-keymap
description: Use when creating or updating the ASCII art comment diagrams embedded in ZMK .keymap files. Generates the box-drawing character tables that document physical key layout above each layer's bindings block. Works with any key count and split layout configuration. Always pairs with zmk-keymap for behavior correctness.
license: MIT
metadata:
  author: tylerreagan98@gmail.com
  version: "1.0.0"
  domain: keyboard-firmware
  triggers: ascii art keymap, keymap diagram, pretty keymap, box drawing, keymap layout, keymap visualization, zmk diagram
  role: specialist
  scope: formatting
  output-format: code
  related-skills: zmk-keymap
---

# ZMK Pretty Keymap Formatter

Generates the ASCII box-drawing comment diagrams embedded above `bindings = <` blocks in ZMK `.keymap` files. These diagrams are documentation — they have no effect on firmware and must stay in sync with the actual bindings manually.

All patterns are derived from real-world keymaps validated against ZMK v0.3 conventions.

---

## Box-Drawing Character Set

```
━  U+2501  BOX DRAWINGS HEAVY HORIZONTAL
┃  U+2503  BOX DRAWINGS HEAVY VERTICAL
┏  U+250F  BOX DRAWINGS HEAVY DOWN AND RIGHT
┓  U+2513  BOX DRAWINGS HEAVY DOWN AND LEFT
┗  U+2517  BOX DRAWINGS HEAVY UP AND RIGHT
┛  U+251B  BOX DRAWINGS HEAVY UP AND LEFT
┣  U+2523  BOX DRAWINGS HEAVY VERTICAL AND RIGHT
┫  U+252B  BOX DRAWINGS HEAVY VERTICAL AND LEFT
┳  U+2533  BOX DRAWINGS HEAVY DOWN AND HORIZONTAL
┻  U+253B  BOX DRAWINGS HEAVY UP AND HORIZONTAL
╋  U+254B  BOX DRAWINGS HEAVY VERTICAL AND HORIZONTAL
╷  U+2577  BOX DRAWINGS LIGHT DOWN (column separator, used in binding alignment rows)
╵  U+2575  BOX DRAWINGS LIGHT UP
```

---

## Two Layout Styles

### Style A — 5-column (34-key, 5×3+2 per side)

No extra pinky column. Thumb clusters have 2 keys per side. The outer main-row edges use `┗`/`┛` corners; the interior connections where the thumb row breaks away use `┻`.

- Each key cell is exactly 15 characters wide (including the leading `┃` and 1 trailing space before next `┃`)
- 5 columns per half, separated by 3-space gap (`   `)
- Thumb row: 2 keys each side, indented to align with columns 4–5 on each half
- Combo annotations go on a separate `//` line below the thumb row

See [`references/layout-34key-5col.md`](references/layout-34key-5col.md) for a fully-rendered QWERTY example.

### Style B — 6-column (38-key, 6×3+3 per side)

Adds one extra column on each outer edge (pinky stagger key) and 3 thumb keys per side. All rows use fully closed boxes — the pinky column cells are blank on rows 0 and 1 where those physical keys don't exist, but the border is always closed.

- All 3 main rows span the full 6-column width with closed `┃` borders on both sides
- Pinky column cells on rows 0 and 1 are blank (no physical key there) but the box is closed
- Row 2 (bottom) fills the pinky cells with their actual bindings
- 3 thumb keys per side vs. 2; thumb row indented to align under columns 4–6

See [`references/layout-38key-6col.md`](references/layout-38key-6col.md) for a fully-rendered QWERTY example.

### Binding Alignment Row (optional)

Some layers include a column-separator comment row using `╷` above the bindings:

```
        // ╷               ╷               ╷               ╷               ╷               ╷               ╷   ╷               ╷               ╷               ╷               ╷               ╷               ╷
```

Each `╷` aligns with a key column. Use when the layer has unusual indentation or the binding block is visually ambiguous.

---

## Label Formatting Rules

- Each label cell is 15 characters: 1 space + label text + spaces to pad = 14 chars + trailing `┃`
- Label text is left-aligned, padded with spaces to fill 14 chars before the next `┃`
- Use short, readable names — not raw ZMK keycodes:
  - `&kp LGUI` → `GUI`
  - `&mt LCTRL D` → `CTRL` (or `D` if tap is primary)
  - `&lt SYS TAB` → `SYS+TAB`
  - `&bt BT_CLR` → `BT_CLR`
  - `&bt BT_SEL 0` → `BT_SEL 0`
  - `&kp LC(LS(N4))` → `SCREENSHOT`
  - `&kp C_VOL_UP` → `VOL+`
  - `&kp LS(MINUS)` → `_`
  - `&none` → leave cell blank (spaces only)
  - `&trans` → leave cell blank (spaces only)
  - `&sys_reset` → `SYS RESET`
  - `&bootloader` → `BOOTLOAD`
  - `&kp LC(LG(Q))` → `LOCK SCREEN`
- For hold-tap keys, show the hold+tap in one label: `SYS+TAB`, `NUM+RET`, `DEV+SPACE`

---

## Overlay Alignment — The Core Rule

The diagram is not decoration. Its purpose is to visually overlay the `bindings = <` block so a reader can scan vertically from a diagram cell to its binding value without shifting their eyes. This means:

- The `//` comment lines must sit at the **same indentation level** as the `bindings = <` keyword in that file
- The spacing after `//` must be chosen so each box column aligns with the corresponding binding value column directly below
- **Do not choose lead spacing arbitrarily** — measure the file's actual binding indentation and derive the correct lead from it

Example of correct overlay (Urchin — bindings start at column 14 after `//  `):
```
        //  ┃ Q             ┃ W             ┃
              &kp Q           &kp W
```

Example of correct overlay (Totem — bindings start at column 13 after `// `):
```
        // ┃               ┃ Q             ┃
                             &kp Q
```

When editing an existing file, always check the current binding indentation and match it. When creating a new keymap file, establish the binding column positions first, then derive the diagram lead spacing to match.

### LCD Spacing Convention

Binding values across layers of the same map are often padded to a consistent column width — the lowest common denominator that accommodates the longest binding in any layer. The diagram cell width must match this established column width, not a fixed 15-character default.

To find the LCD width for a map:
1. Scan all layers and find the longest binding token (e.g. `&bt BT_CLR_ALL`, `&kp LC(LS(N4))`)
2. The column width is: length of longest token + minimum 1 space of padding
3. All binding values are right-padded with spaces to this width; all diagram cells use the same width
4. Once established for a map, this width is **fixed for all layers** — never vary it per-layer

The diagram cell width and binding column width must be equal. If extra spacing is needed to achieve alignment, add it consistently to every cell in every layer of that map. A diagram that aligns in one layer must align in all layers.

---

## Generation Process

When asked to diagram a layer:

1. **Identify the layout style** — count key positions in `bindings = <` to determine layout (34 = Style A / 5-column, 38 = Style B / 6-column, etc.)
2. **Measure binding indentation** — find the actual column where binding values start; the diagram lead must produce matching column alignment
3. **Map positions to labels** — translate each binding to a human-readable label per the rules above; blanks for `&none` / `&trans`
4. **Render main rows** — 3 rows of 5+5 (or 6+6) cells with box-drawing separators
5. **Render thumb row** — 2+2 (Style A) or 3+3 (Style B) cells, indented to align with their columns
6. **Add combo annotations** if combos are defined for this layer (e.g. `//  combo [30+31]=ESC`)
7. **Verify overlay** — each `┃ LABEL` column must sit directly above its corresponding binding; adjust lead spacing if not

---

## Empty / Transparent Cell Rendering

- `&none` → `               ` (14 spaces) — cell visually blank
- `&trans` → `               ` (14 spaces) — cell visually blank
- Do NOT write `TRANS` or `____` — blank is the convention in both reference keymaps

---

## Full Layer Template — Style A (5-column, 34-key)

```
//  ┏━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┓   ┏━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┓
//  ┃ [R0C0]        ┃ [R0C1]        ┃ [R0C2]        ┃ [R0C3]        ┃ [R0C4]        ┃   ┃ [R0C5]        ┃ [R0C6]        ┃ [R0C7]        ┃ [R0C8]        ┃ [R0C9]        ┃
//  ┣━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━┫   ┣━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━┫
//  ┃ [R1C0]        ┃ [R1C1]        ┃ [R1C2]        ┃ [R1C3]        ┃ [R1C4]        ┃   ┃ [R1C5]        ┃ [R1C6]        ┃ [R1C7]        ┃ [R1C8]        ┃ [R1C9]        ┃
//  ┣━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━┫   ┣━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━┫
//  ┃ [R2C0]        ┃ [R2C1]        ┃ [R2C2]        ┃ [R2C3]        ┃ [R2C4]        ┃   ┃ [R2C5]        ┃ [R2C6]        ┃ [R2C7]        ┃ [R2C8]        ┃ [R2C9]        ┃
//  ┗━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━┫   ┣━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━┛
//                                                  ┃ [THL]         ┃ [THR-inner]   ┃   ┃ [THL-inner]   ┃ [THR]         ┃
//                                                  ┗━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━┛   ┗━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━┛
```

## Full Layer Template — Style B (6-column, 38-key)

```
// ┏━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┓   ┏━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┓
// ┃               ┃ [R0C1]        ┃ [R0C2]        ┃ [R0C3]        ┃ [R0C4]        ┃ [R0C5]        ┃   ┃ [R0C6]        ┃ [R0C7]        ┃ [R0C8]        ┃ [R0C9]        ┃ [R0C10]       ┃               ┃
// ┣━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━┫   ┣━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━┫
// ┃               ┃ [R1C1]        ┃ [R1C2]        ┃ [R1C3]        ┃ [R1C4]        ┃ [R1C5]        ┃   ┃ [R1C6]        ┃ [R1C7]        ┃ [R1C8]        ┃ [R1C9]        ┃ [R1C10]       ┃               ┃
// ┣━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━┫   ┣━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━┫
// ┃ [R2C0]        ┃ [R2C1]        ┃ [R2C2]        ┃ [R2C3]        ┃ [R2C4]        ┃ [R2C5]        ┃   ┃ [R2C6]        ┃ [R2C7]        ┃ [R2C8]        ┃ [R2C9]        ┃ [R2C10]       ┃ [R2C11]       ┃
// ┗━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━┫   ┣━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━┛
//                                                 ┃ [TH0]         ┃ [TH1]         ┃ [TH2]         ┃   ┃ [TH3]         ┃ [TH4]         ┃ [TH5]         ┃
//                                                 ┗━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━┛   ┗━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━┛
```

---

## Constraints

- **ASCII art integrity is paramount.** Every diagram line must be output as a single, unbroken line. Line wrapping — whether from editor word wrap, terminal width, or any other cause — destroys the image entirely. Each `//` row is one line, no exceptions. If the environment cannot render a line at full width, that is an environment problem, not a reason to break the line.
- **Never modify bindings** when only asked to add/fix diagrams — the art is documentation only.
- **Always count bindings** in the target layer before rendering — mismatch means wrong layout or wrong style.
- **Blank = blank** — do not invent labels for `&none` or `&trans`.
- **Combo annotations** belong below the thumb row on their own `//` line, not inside the box art.
- **Indentation must match** the surrounding file's style (spaces, not tabs, at the `//` level).
- When in doubt about a label, prefer the shorter/more descriptive name. `VOL+` beats `C_VOL_UP`. `SCREENSHOT` beats `LC(LS(N4))`.
