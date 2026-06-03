# Layout Reference — 34-key, 5-column (Style A)

## Layout spec

| Property | Value |
|----------|-------|
| Total keys | 34 |
| Keys per half | 17 |
| Main rows | 3 |
| Columns per half | 5 |
| Thumb keys per side | 2 |
| Pinky column | None — column 0 (left) / column 4 (right) are standard stagger keys, no extra outer column |
| Key count formula | 5 cols × 3 rows × 2 halves + 2 thumbs × 2 sides = 34 |

The bottom main row has no outer break-away — it terminates normally with `┗`/`┛` corners. The thumb row indents inward and connects to the main grid at columns 3–4 on each half using `┻` transitions.

---

## Keyboards using this layout

### Exact match (34-key, 5×3+2)

| Keyboard | Notes |
|----------|-------|
| Urchin | Modeled directly on the Ferris Sweep shape |
| Ferris Sweep / Sweep v2 | The reference design for this class of layout |
| Cradio | Near-identical shape; also 34-key 5×3+2 |
| Hypergolic | Same column/thumb structure |

Any 34-key split with 5 columns and 2 thumb keys per side will render identically with this template.

---

## QWERTY base layer example

```
//  ┏━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┓   ┏━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┓
//  ┃ Q             ┃ W             ┃ E             ┃ R             ┃ T             ┃   ┃ Y             ┃ U             ┃ I             ┃ O             ┃ P             ┃
//  ┣━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━┫   ┣━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━┫
//  ┃ A             ┃ S             ┃ D             ┃ F             ┃ G             ┃   ┃ H             ┃ J             ┃ K             ┃ L             ┃ ;             ┃
//  ┣━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━┫   ┣━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━┫
//  ┃ Z             ┃ X             ┃ C             ┃ V             ┃ B             ┃   ┃ N             ┃ M             ┃ ,             ┃ .             ┃ /             ┃
//  ┗━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━┫   ┣━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━┛
//                                                  ┃ SYS+TAB       ┃ DEV+SPACE     ┃   ┃ BSPC          ┃ NUM+RET       ┃
//                                                  ┗━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━┛   ┗━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━┛
```

## Rendering notes

- Lead spacing after `//` is two spaces (`//  `) — binding values in this keymap start at column 14
- Thumb row indents to align with columns 3–4 of each half
- Bottom main row outer corners: `┗` (far left) / `┛` (far right); `┻` at the two thumb attachment points
- The 3-space gap (`   `) between halves is consistent across all rows including the thumb row
