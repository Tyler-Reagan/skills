# Layout Reference — 38-key, 6-column (Style B)

## Layout spec

| Property | Value |
|----------|-------|
| Total keys | 38 |
| Keys per half | 19 |
| Main rows | 3 |
| Columns per half | 6 |
| Thumb keys per side | 3 |
| Pinky column | Present on row 2 only — rows 0 and 1 have closed-border blank cells at the outer column |
| Key count formula | (5 cols × 2 rows + 6 cols × 1 row) × 2 halves + 3 thumbs × 2 sides = 38 |

The outer pinky column exists in the box structure on all rows, but only row 2 carries a physical key. Rows 0 and 1 render blank cells with a closed `┃` border — the box never opens. The bottom main row terminates at `┗`/`┛` on the outer edges; `┻` marks the three thumb attachment points on each side.

---

## Keyboards using this layout

### Exact match (38-key, 6×3+3 with row-2-only pinky)

| Keyboard | Notes |
|----------|-------|
| Totem | The reference design for this layout |

### Near-match — 36-key variant (drop the pinky keys)

| Keyboard | Notes |
|----------|-------|
| Zenith | Same 6-column structure and 3 thumb keys; drops the row-2 outer pinky key on each side → 36 keys total |
| Totemist | Same reduction as Zenith — 36-key, no row-2 pinky |

**Important for style identification:** a 36-key keymap with 6 columns + 3 thumbs looks identical to Style B except the row-2 pinky cells are also blank. Do not assume Style B when counting 36 bindings — verify whether the keyboard physically has those outer keys. The box-drawing structure (6 columns, 3 thumbs) is the same; only the row-2 pinky cells change from keyed to blank.

---

## QWERTY base layer example

```
// ┏━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┓   ┏━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┓
// ┃               ┃ Q             ┃ W             ┃ E             ┃ R             ┃ T             ┃   ┃ Y             ┃ U             ┃ I             ┃ O             ┃ P             ┃               ┃
// ┣━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━┫   ┣━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━┫
// ┃               ┃ A             ┃ S             ┃ D             ┃ F             ┃ G             ┃   ┃ H             ┃ J             ┃ K             ┃ L             ┃ ;             ┃               ┃
// ┣━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━┫   ┣━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━┫
// ┃ HYPER         ┃ Z             ┃ X             ┃ C             ┃ V             ┃ B             ┃   ┃ N             ┃ M             ┃ ,             ┃ .             ┃ /             ┃ '             ┃
// ┗━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━┫   ┣━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━┛
//                                                 ┃ ESC           ┃ SYS+TAB       ┃ DEV+SPACE     ┃   ┃ BSPC          ┃ NUM+RET       ┃ FUN+DEL       ┃
//                                                 ┗━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━┛   ┗━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━┛
```

## Rendering notes

- Lead spacing after `//` is one space (`// `) — binding values in this keymap start at column 13
- Pinky column cells on rows 0 and 1 are blank but box is always closed (never use an open edge there)
- Row 2 outer cells carry actual bindings; the box closes normally at `┗`/`┛`
- Thumb row indents to align under columns 3–5 of each half; 3 keys per side
- The 3-space gap (`   `) between halves is consistent across all rows
