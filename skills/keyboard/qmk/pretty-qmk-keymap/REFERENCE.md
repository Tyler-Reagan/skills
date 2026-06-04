# QMK Pretty Keymap — Reference

## Style A Box-Drawing Characters

```
╷  U+2577  BOX DRAWINGS LIGHT DOWN (column separator)
╵  U+2575  BOX DRAWINGS LIGHT UP
```

## Style B Box-Drawing Characters

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
╨  U+2568  UP LIGHT AND HORIZONTAL HEAVY (TRRS connector notch, top)
╤  U+2564  DOWN LIGHT AND HORIZONTAL HEAVY (TRRS connector notch, bottom)
```

---

## Style B — Totem Template (38-key, 5+1 col per side)

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

`╨`/`╤` characters mark the TRRS cable connector notch between halves. `╌┄┈┈───═╡` is a decorative cable trace — use on row 0 only, on the left half's connection side.

### Style B rendered example (BASE layer)

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

---

## Style A Template — 10-char column width, 5+5 per row

```c
   [_BASE] = LAYOUT(
//╷         ╷         ╷         ╷         ╷         ╷         ╷╷         ╷         ╷         ╷         ╷         ╷         ╷
              KC_Q,     KC_W,     KC_E,     KC_R,     KC_T,      KC_Y,     KC_U,     KC_I,     KC_O,     KC_P,
```

Each `╷` is 10 characters wide (the LCD column width). `╷╷` marks the center gap.
