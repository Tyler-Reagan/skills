# ZMK Keycode Reference

Keycodes are the values passed to `&kp` and used in modifier wrapping. They come from `dt-bindings/zmk/keys.h`, which maps HID usage page values to human-readable names. This document covers the naming conventions, common aliases, and modifier syntax.

---

## Naming Conventions

ZMK keycode names follow HID usage page names with some aliases for convenience:

- Letter keys: `A`–`Z` (uppercase only)
- Number row: `N0`–`N9` (prefix `N` disambiguates from bare integers)
- Function keys: `F1`–`F24`
- Named keys: `BSPC`, `DEL`, `RET`, `TAB`, `ESC`, `SPACE`, `CAPS`
- Punctuation: spelled out or abbreviated — see table below

When in doubt, search `zmk/app/include/dt-bindings/zmk/keys.h` for the exact token.

---

## Common Keycode Aliases

| Physical key | ZMK keycode | Notes |
|-------------|-------------|-------|
| Backspace | `BSPC` | |
| Delete | `DEL` | |
| Enter / Return | `RET` | |
| Tab | `TAB` | |
| Escape | `ESC` | |
| Space | `SPACE` | |
| Caps Lock | `CAPS` | |
| `'` / `"` | `SQT` | Single quote |
| `;` / `:` | `SEMI` | Semicolon |
| `,` / `<` | `COMMA` | |
| `.` / `>` | `DOT` | |
| `/` / `?` | `FSLH` | Forward slash |
| `\` / `\|` | `BSLH` | Backslash |
| `` ` `` / `~` | `GRAVE` | Grave / tilde |
| `[` / `{` | `LBKT` | Left bracket |
| `]` / `}` | `RBKT` | Right bracket |
| `-` / `_` | `MINUS` | |
| `=` / `+` | `EQUAL` | |
| Print Screen | `PSCRN` | |
| Scroll Lock | `SLCK` | |
| Pause / Break | `PAUSE_BREAK` | |
| Insert | `INS` | |
| Home | `HOME` | |
| End | `END` | |
| Page Up | `PG_UP` | |
| Page Down | `PG_DN` | |
| Arrow keys | `LEFT`, `RIGHT`, `UP`, `DOWN` | |
| Num Lock | `KP_NUM` | |
| Keypad keys | `KP_N0`–`KP_N9`, `KP_PLUS`, `KP_MINUS`, `KP_MULTIPLY`, `KP_DIVIDE`, `KP_ENTER`, `KP_DOT` | |
| Application / Menu | `K_APP` | |

### Modifier keys (standalone)

| Key | Left | Right |
|-----|------|-------|
| Shift | `LSHFT` | `RSHFT` |
| Control | `LCTRL` | `RCTRL` |
| Alt / Option | `LALT` | `RALT` |
| GUI / Win / Cmd | `LGUI` | `RGUI` |

### Media / consumer keys

| Action | ZMK keycode |
|--------|-------------|
| Volume up | `C_VOL_UP` |
| Volume down | `C_VOL_DN` |
| Mute | `C_MUTE` |
| Play / Pause | `C_PP` |
| Next track | `C_NEXT` |
| Previous track | `C_PREV` |
| Stop | `C_STOP` |
| Brightness up | `C_BRI_UP` |
| Brightness down | `C_BRI_DN` |
| Eject | `C_EJECT` |
| Sleep | `C_SLEEP` |

---

## Modifier Wrapping

Modifier wrapping sends a key with one or more modifiers held. Syntax: `<MODIFIER>(<KEYCODE>)`.

### Modifier prefix codes

| Modifier | Left prefix | Right prefix |
|----------|------------|--------------|
| Shift | `LS(...)` | `RS(...)` |
| Control | `LC(...)` | `RC(...)` |
| Alt / Option | `LA(...)` | `RA(...)` |
| GUI / Win / Cmd | `LG(...)` | `RG(...)` |

### Single modifier

```c
&kp LS(A)          // Shift+A → types "A" (uppercase)
&kp LC(C)          // Ctrl+C
&kp LG(SPACE)      // GUI+Space (e.g. Spotlight on macOS)
&kp LA(F4)         // Alt+F4
&kp RA(N3)         // Right Alt+3 (AltGr+3 — used for special characters on some layouts)
```

### Chained modifiers

Modifiers nest inside each other:

```c
&kp LC(LS(ESC))    // Ctrl+Shift+Escape (Task Manager on Windows)
&kp LG(LS(N4))     // GUI+Shift+4 (screenshot region on macOS)
&kp LC(LA(DEL))    // Ctrl+Alt+Delete
```

### Modifier wrapping in hold-tap bindings

`&mt` and `&lt` both accept modifier-wrapped keycodes on the tap side:

```c
&mt LCTRL LC(C)    // hold: Ctrl, tap: Ctrl+C  — unusual but valid
&lt 1 LS(TAB)      // hold: layer 1, tap: Shift+Tab
```

---

## Shifted symbols

To send a shifted symbol directly, wrap the base key in `LS(...)`:

| Desired output | Binding |
|---------------|---------|
| `!` | `&kp LS(N1)` |
| `@` | `&kp LS(N2)` |
| `#` | `&kp LS(N3)` |
| `$` | `&kp LS(N4)` |
| `%` | `&kp LS(N5)` |
| `^` | `&kp LS(N6)` |
| `&` | `&kp LS(N7)` |
| `*` | `&kp LS(N8)` |
| `(` | `&kp LS(N9)` |
| `)` | `&kp LS(N0)` |
| `_` | `&kp LS(MINUS)` |
| `+` | `&kp LS(EQUAL)` |
| `{` | `&kp LS(LBKT)` |
| `}` | `&kp LS(RBKT)` |
| `\|` | `&kp LS(BSLH)` |
| `:` | `&kp LS(SEMI)` |
| `"` | `&kp LS(SQT)` |
| `<` | `&kp LS(COMMA)` |
| `>` | `&kp LS(DOT)` |
| `?` | `&kp LS(FSLH)` |
| `~` | `&kp LS(GRAVE)` |

> These mappings assume a US QWERTY layout. On non-US layouts, the shifted characters may differ.

---

## Layout note

All ZMK keycodes target **US QWERTY HID positions**. If the host OS is configured for a different layout, the character the host types may differ from the keycode name. ZMK itself does no layout translation — that happens entirely on the host.
