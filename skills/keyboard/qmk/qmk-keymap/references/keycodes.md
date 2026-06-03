# QMK Keycode Reference

## Letters
`KC_A` `KC_B` `KC_C` `KC_D` `KC_E` `KC_F` `KC_G` `KC_H` `KC_I` `KC_J` `KC_K` `KC_L` `KC_M`
`KC_N` `KC_O` `KC_P` `KC_Q` `KC_R` `KC_S` `KC_T` `KC_U` `KC_V` `KC_W` `KC_X` `KC_Y` `KC_Z`

## Numbers (top row)
`KC_1` `KC_2` `KC_3` `KC_4` `KC_5` `KC_6` `KC_7` `KC_8` `KC_9` `KC_0`

## Function Keys
`KC_F1`–`KC_F12` | Extended: `KC_F13`–`KC_F24`

## Modifiers
| Keycode | Short | Key |
|---------|-------|-----|
| `KC_LEFT_CTRL` | `KC_LCTL` | Left Control |
| `KC_LEFT_SHIFT` | `KC_LSFT` | Left Shift |
| `KC_LEFT_ALT` | `KC_LALT` | Left Alt |
| `KC_LEFT_GUI` | `KC_LGUI` | Left GUI/Cmd/Win |
| `KC_RIGHT_CTRL` | `KC_RCTL` | Right Control |
| `KC_RIGHT_SHIFT` | `KC_RSFT` | Right Shift |
| `KC_RIGHT_ALT` | `KC_RALT` | Right Alt / AltGr |
| `KC_RIGHT_GUI` | `KC_RGUI` | Right GUI/Cmd/Win |

## Editing & Navigation
| Keycode | Short | Key |
|---------|-------|-----|
| `KC_ENTER` | `KC_ENT` | Enter |
| `KC_ESCAPE` | `KC_ESC` | Escape |
| `KC_BACKSPACE` | `KC_BSPC` | Backspace |
| `KC_TAB` | — | Tab |
| `KC_SPACE` | `KC_SPC` | Space |
| `KC_DELETE` | `KC_DEL` | Delete (forward) |
| `KC_INSERT` | `KC_INS` | Insert |
| `KC_HOME` | — | Home |
| `KC_END` | — | End |
| `KC_PAGE_UP` | `KC_PGUP` | Page Up |
| `KC_PAGE_DOWN` | `KC_PGDN` | Page Down |
| `KC_UP` | — | Up Arrow |
| `KC_DOWN` | — | Down Arrow |
| `KC_LEFT` | — | Left Arrow |
| `KC_RIGHT` | — | Right Arrow |
| `KC_CAPS_LOCK` | `KC_CAPS` | Caps Lock |
| `KC_PRINT_SCREEN` | `KC_PSCR` | Print Screen |
| `KC_SCROLL_LOCK` | `KC_SCRL` | Scroll Lock |
| `KC_PAUSE` | `KC_PAUS` | Pause/Break |
| `KC_APPLICATION` | `KC_APP` | Menu/Context |

## Punctuation & Symbols (unshifted)
| Keycode | Short | Key (unshifted → shifted) |
|---------|-------|--------------------------|
| `KC_MINUS` | `KC_MINS` | `-` → `_` |
| `KC_EQUAL` | `KC_EQL` | `=` → `+` |
| `KC_LEFT_BRACKET` | `KC_LBRC` | `[` → `{` |
| `KC_RIGHT_BRACKET` | `KC_RBRC` | `]` → `}` |
| `KC_BACKSLASH` | `KC_BSLS` | `\` → `\|` |
| `KC_SEMICOLON` | `KC_SCLN` | `;` → `:` |
| `KC_QUOTE` | `KC_QUOT` | `'` → `"` |
| `KC_GRAVE` | `KC_GRV` | `` ` `` → `~` |
| `KC_COMMA` | `KC_COMM` | `,` → `<` |
| `KC_DOT` | — | `.` → `>` |
| `KC_SLASH` | `KC_SLSH` | `/` → `?` |

## Shifted Symbol Aliases (cannot be used in MT/LT kc argument)
| Keycode | Short | Output |
|---------|-------|--------|
| `KC_TILDE` | `KC_TILD` | `~` |
| `KC_EXCLAIM` | `KC_EXLM` | `!` |
| `KC_AT` | — | `@` |
| `KC_HASH` | — | `#` |
| `KC_DOLLAR` | `KC_DLR` | `$` |
| `KC_PERCENT` | `KC_PERC` | `%` |
| `KC_CIRCUMFLEX` | `KC_CIRC` | `^` |
| `KC_AMPERSAND` | `KC_AMPR` | `&` |
| `KC_ASTERISK` | `KC_ASTR` | `*` |
| `KC_LEFT_PAREN` | `KC_LPRN` | `(` |
| `KC_RIGHT_PAREN` | `KC_RPRN` | `)` |
| `KC_UNDERSCORE` | `KC_UNDS` | `_` |
| `KC_PLUS` | — | `+` |
| `KC_LEFT_CURLY_BRACE` | `KC_LCBR` | `{` |
| `KC_RIGHT_CURLY_BRACE` | `KC_RCBR` | `}` |
| `KC_PIPE` | — | `\|` |
| `KC_COLON` | `KC_COLN` | `:` |
| `KC_DOUBLE_QUOTE` | `KC_DQUO`/`KC_DQT` | `"` |
| `KC_LEFT_ANGLE_BRACKET` | `KC_LABK`/`KC_LT` | `<` |
| `KC_RIGHT_ANGLE_BRACKET` | `KC_RABK`/`KC_GT` | `>` |
| `KC_QUESTION` | `KC_QUES` | `?` |

## Media & System
| Keycode | Short | Action |
|---------|-------|--------|
| `KC_AUDIO_MUTE` | `KC_MUTE` | Mute |
| `KC_AUDIO_VOL_UP` | `KC_VOLU` | Volume Up |
| `KC_AUDIO_VOL_DOWN` | `KC_VOLD` | Volume Down |
| `KC_MEDIA_PLAY_PAUSE` | `KC_MPLY` | Play/Pause |
| `KC_MEDIA_NEXT_TRACK` | `KC_MNXT` | Next Track |
| `KC_MEDIA_PREV_TRACK` | `KC_MPRV` | Previous Track |
| `KC_MEDIA_STOP` | `KC_MSTP` | Stop |
| `KC_BRIGHTNESS_UP` | `KC_BRIU` | Screen Brightness Up |
| `KC_BRIGHTNESS_DOWN` | `KC_BRID` | Screen Brightness Down |

## Numpad
`KC_NUM_LOCK`/`KC_NUM` | `KC_KP_SLASH` | `KC_KP_ASTERISK`/`KC_KP_ASTR`
`KC_KP_MINUS` | `KC_KP_PLUS` | `KC_KP_ENTER` | `KC_KP_DOT`
`KC_KP_0`–`KC_KP_9` | `KC_KP_EQUAL`

## Special / Quantum
| Keycode | Alias | Description |
|---------|-------|-------------|
| `KC_NO` | `XXXXXXX` | No-op, swallows key event |
| `KC_TRANSPARENT` | `KC_TRNS`, `_______` | Pass through to lower active layer |
| `QK_BOOTLOADER` | `QK_BOOT` | Enter bootloader for flashing |
| `QK_REBOOT` | `QK_RBT` | Soft reboot, no bootloader |
| `QK_CLEAR_EEPROM` | `EE_CLR` | Reinitialize EEPROM |
| `QK_DEBUG_TOGGLE` | `DB_TOGG` | Toggle QMK debug output |
| `CAPS_WORD` | — | Smart caps, auto-disables on non-alpha |

## macOS Common Shortcuts
```c
S(G(KC_4))      // Shift+Cmd+4 — screenshot area to file
S(G(KC_5))      // Shift+Cmd+5 — screenshot options
S(C(G(KC_4)))   // Shift+Ctrl+Cmd+4 — screenshot area to clipboard
C(G(KC_Q))      // Ctrl+Cmd+Q — lock screen
G(KC_SPC)       // Cmd+Space — Spotlight
G(KC_TAB)       // Cmd+Tab — app switcher
G(KC_C)         // Cmd+C — copy
G(KC_V)         // Cmd+V — paste
G(KC_X)         // Cmd+X — cut
G(KC_Z)         // Cmd+Z — undo
```
