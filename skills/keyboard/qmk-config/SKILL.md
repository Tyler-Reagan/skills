---
name: qmk-config
description: QMK project configuration specialist for keyboard.json, rules.mk, config.h, and Vial setup. Use when editing keyboard hardware definitions, enabling features, configuring split keyboard wiring, setting up Vial/VIA, or working with the user config repo + QMK source tree sync pattern.
license: MIT
metadata:
  author: tylerreagan98@gmail.com
  version: "1.0.0"
  domain: keyboard-firmware
  triggers: keyboard.json, rules.mk, config.h, VIA, Vial, vial.json, EE_HANDS, SPLIT_KEYBOARD, TAPPING_TERM, RP2040, USART, flash, UF2, qmk compile, qmk flash
  role: specialist
  scope: implementation
  output-format: code
  related-skills: qmk-keymap, qmk-debug
---

# QMK Config Engineer

Expert in QMK/Vial-QMK project configuration: `keyboard.json`, `rules.mk`, `config.h`, and Vial.

## Domain Language

- **keyboard.json** — The primary hardware definition file. Declares MCU, matrix, USB IDs, layouts, split config. Supersedes `info.json` in QMK 0.18+. Do not maintain both.
- **rules.mk** — Build-time feature flags. Enables/disables firmware features at compile time.
- **config.h** — C preprocessor defines. Sets timing constants, pin assignments, and behavior options. Keyboard-level applies to all keymaps; keymap-level overrides per-keymap.
- **Vial** — A VIA fork with live tap-dance, combo, and QMK Settings editing. Requires its own `vial.json` and UID in the keymap's `config.h`.
- **UF2** — The firmware format for RP2040. Drag-drop to the bootloader mass storage drive to flash.
- **EE_HANDS** — Handedness detection via EEPROM. Each half is flashed once with `flash-left`/`flash-right` (which writes the handedness). Subsequent firmware updates use the same UF2 on both halves.
- **user config repo** — A separate git repo that holds your keymaps and syncs to the QMK source tree via a Makefile. The keyboard source lives in QMK; your files are the overlay.

## File Hierarchy

```
keyboards/<vendor>/<kb>/
├── keyboard.json          ← hardware definition (MCU, matrix, USB, layouts)
├── config.h               ← keyboard-level C defines (pins, timing, split)
├── rules.mk               ← keyboard-level feature flags (usually minimal)
├── <kb>.h                 ← LAYOUT macro definition
├── <kb>.c                 ← optional keyboard init code
└── keymaps/
    └── <keymap>/
        ├── keymap.c       ← key assignments
        ├── config.h       ← keymap-level overrides (tapping term, Vial UID)
        ├── rules.mk       ← keymap-level feature flags (VIA/Vial goes here)
        └── vial.json      ← Vial UI layout definition (Vial keymaps only)
```

---

## keyboard.json

The full hardware definition. All fields except layouts are optional if using a known `development_board`.

```json
{
    "keyboard_name": "MyBoard",
    "manufacturer": "Author",
    "maintainer": "github_username",
    "url": "https://github.com/author/myboard",
    "usb": {
        "vid": "0x1234",
        "pid": "0x5678",
        "device_version": "0.1.0"
    },
    "processor": "RP2040",
    "bootloader": "rp2040",
    "matrix_pins": {
        "rows": ["GP26", "GP27", "GP28", "GP29"],
        "cols": ["GP6", "GP7", "GP3", "GP4", "GP2"]
    },
    "diode_direction": "COL2ROW",
    "debounce": 5,
    "features": {
        "swap_hands": true
    },
    "split": {
        "enabled": true,
        "serial": {
            "driver": "vendor"
        }
    },
    "layouts": {
        "LAYOUT": {
            "layout": [
                { "label": "K00", "matrix": [0, 0], "x": 0, "y": 0 },
                { "label": "K01", "matrix": [0, 1], "x": 1, "y": 0 }
            ]
        }
    }
}
```

**Key fields:**

| Field | Notes |
|-------|-------|
| `processor` | `"RP2040"`, `"atmega32u4"`, `"STM32F411"`, etc. |
| `bootloader` | `"rp2040"`, `"caterina"`, `"atmel-dfu"`, `"stm32-dfu"` |
| `diode_direction` | `"COL2ROW"` (most common) or `"ROW2COL"` |
| `debounce` | ms; default 5 |
| `split.serial.driver` | `"vendor"` for RP2040 hardware UART; `"bitbang"` for single-wire software serial |

**Layout key position format:**
- `matrix: [row, col]` — required; maps physical position to matrix
- `x`, `y` — required; position in key units (1u = one key width)
- `w`, `h` — optional; key width/height (default 1)
- `label` — optional; display name in VIA/Vial
- `hand` — optional; `"L"`, `"R"`, or `"*"` for Chordal Hold handedness

**`info.json` vs `keyboard.json`:** `info.json` is the legacy name. QMK 0.18+ uses `keyboard.json`. If both exist, they conflict — delete `info.json` and keep `keyboard.json`.

---

## config.h — Keyboard Level

Applies to all keymaps for this keyboard. Keyboard-specific hardware defines live here.

```c
// Split communication (RP2040 hardware UART)
#define SERIAL_USART_FULL_DUPLEX       // enable full duplex (TX + RX pins)
#define SERIAL_USART_TX_PIN GP0        // TX pin on left half
#define SERIAL_USART_RX_PIN GP1        // RX pin on left half
#define SERIAL_USART_PIN_SWAP          // swap TX/RX when this half is master

// Handedness
#define EE_HANDS                       // read handedness from EEPROM

// RP2040 bootloader
#define RP2040_BOOTLOADER_DOUBLE_TAP_RESET
#define RP2040_BOOTLOADER_DOUBLE_TAP_RESET_TIMEOUT 200U  // ms window for double-tap
```

**RP2040 double-tap note:** `200U` is a 200ms window — tight enough to avoid accidental triggers but wide enough to catch intentional double-taps. Values 150–500 are typical.

---

## config.h — Keymap Level

Overrides keyboard defaults. Tapping behavior, Vial credentials, and layer count go here.

```c
#pragma once

// Vial credentials (unique per keyboard)
#define VIAL_KEYBOARD_UID { 0xCB, 0x37, 0x36, 0xFE, 0xEE, 0xED, 0xEE, 0x77 }
#define VIAL_UNLOCK_COMBO_ROWS { 0, 4 }   // matrix rows of the two unlock keys
#define VIAL_UNLOCK_COMBO_COLS { 0, 0 }   // matrix cols of the two unlock keys

// VIA/Vial layer count
#define DYNAMIC_KEYMAP_LAYER_COUNT 16     // default 4; max for Vial is 16

// Tap-hold behavior
#define TAPPING_TERM 200
// #define PERMISSIVE_HOLD
// #define RETRO_TAPPING
// #define QUICK_TAP_TERM 120

// Lock key behavior
#undef LOCKING_SUPPORT_ENABLE    // disable lock key resync (most users don't need it)
#undef LOCKING_RESYNC_ENABLE
```

**`DYNAMIC_KEYMAP_LAYER_COUNT`:** Must match the layer count declared in `vial.json`. Mismatches cause Vial to display wrong layers or crash.

---

## rules.mk — Keyboard Level

Usually minimal — most features are declared in `keyboard.json`. Avoid putting VIA/Vial here.

```makefile
# This file intentionally left blank
# All keyboard settings are defined in keyboard.json
```

---

## rules.mk — Keymap Level

Feature flags for this keymap. VIA/Vial must be set **only** at keymap level for backward compatibility.

```makefile
# Vial (includes VIA)
VIA_ENABLE = yes
VIAL_ENABLE = yes

# Optional features — add only what you use
EXTRAKEY_ENABLE = yes    # required for all media/consumer keys (KC_MPLY, KC_MUTE, KC_VOLU, etc.)
                          # without this the consumer HID descriptor is absent and they silently no-op
# TAP_DANCE_ENABLE = yes
# COMBO_ENABLE = yes
# CAPS_WORD_ENABLE = yes
# MOUSEKEY_ENABLE = yes
# NKRO_ENABLE = yes
# BOOTMAGIC_ENABLE = yes   # hold top-left key on boot to enter bootloader

# NOT here: SPLIT_KEYBOARD (goes in keyboard.json), AUTO_SHIFT_ENABLE, etc.
```

**`VIAL_ENABLE` requires `VIA_ENABLE`** — always set both. Setting at keyboard level rather than keymap level may break non-Vial keymaps in the same keyboard definition.

---

## Vial — vial.json

The `vial.json` defines the visual layout for the Vial/VIA app. It is NOT the same as `keyboard.json` or `info.json`. Place it at `keymaps/<keymap>/vial.json`.

The file is typically generated in the VIA configurator or downloaded from the VIA keyboards repository. Its content mirrors `keyboard.json`'s `layouts` section but in VIA's format — a JSON object with a `"layouts"` key containing a `"keymap"` array of key position objects.

**Generating the UID:**
```bash
# From vial-qmk root:
python3 util/vial_generate_keyboard_uid.py
# → copy the 8-byte hex array into keymap's config.h
```

**Unlock combo:** Two matrix positions that must be pressed simultaneously to unlock Vial for editing. Choose a pair that won't be accidentally triggered (e.g., top-left key on each half). The matrix row/col indices must match `keyboard.json`'s matrix_pins layout.

---

## Split Keyboard Patterns

### EE_HANDS (EEPROM handedness) — recommended for RP2040 TRRS splits

1. Define `EE_HANDS` in keyboard-level `config.h`
2. First-time flash: flash each half separately with handedness bootloader:
   ```bash
   qmk flash -kb <kb> -km <km> -bl uf2-split-left   # plug in left half only
   qmk flash -kb <kb> -km <km> -bl uf2-split-right  # plug in right half only
   ```
3. Subsequent updates: same UF2 for both halves (handedness persists in EEPROM)

### MASTER_LEFT / MASTER_RIGHT — simpler, USB always on same side

```c
// config.h — choose one:
#define MASTER_LEFT    // USB always plugged into left half
// #define MASTER_RIGHT
```

No per-half flashing needed — both halves use identical firmware.

### Split Data Sync

```c
// config.h — enable per need:
#define SPLIT_LAYER_STATE_ENABLE   // sync active layer to slave (for RGB etc.)
#define SPLIT_LED_STATE_ENABLE     // sync host LED state (caps lock indicator)
#define SPLIT_MODS_ENABLE          // sync modifier state
#define SPLIT_WPM_ENABLE           // sync WPM to slave
```

---

## User Config Repo Pattern

Keep your keymaps in a personal git repo; sync to the QMK source tree for compilation.

```makefile
QMK_DIR  := $(HOME)/vial-qmk
KB       := vendor/keyboard_name
KM       ?= mymap
TARGET   := vendor_keyboard_name_$(KM)

# Sync your files INTO the QMK tree before compiling
sync-to-fw:
	cp totem/config.h           $(QMK_DIR)/keyboards/$(KB)/config.h
	cp totem/keymaps/$(KM)/keymap.c  $(QMK_DIR)/keyboards/$(KB)/keymaps/$(KM)/keymap.c
	cp totem/keymaps/$(KM)/config.h  $(QMK_DIR)/keyboards/$(KB)/keymaps/$(KM)/config.h
	cp totem/keymaps/$(KM)/rules.mk  $(QMK_DIR)/keyboards/$(KB)/keymaps/$(KM)/rules.mk
	cp totem/keymaps/$(KM)/vial.json $(QMK_DIR)/keyboards/$(KB)/keymaps/$(KM)/vial.json

compile: sync-to-fw
	cd $(QMK_DIR) && qmk compile -kb $(KB) -km $(KM)
	mkdir -p firmware
	cp $(QMK_DIR)/$(TARGET).uf2 firmware/$(TARGET).uf2

# Pull compiled output back into your repo
sync-from-fw:
	cp $(QMK_DIR)/$(TARGET).uf2 firmware/$(TARGET).uf2
	cp $(QMK_DIR)/keyboards/$(KB)/keyboard.json totem/keyboard.json
	# ... other board files

flash-left: sync-to-fw
	cd $(QMK_DIR) && qmk flash -kb $(KB) -km $(KM) -bl uf2-split-left

flash-right: sync-to-fw
	cd $(QMK_DIR) && qmk flash -kb $(KB) -km $(KM) -bl uf2-split-right
```

**What lives in your repo:** All keymap files, `vial.json`, and the compiled `.uf2`.
**What stays in QMK:** Board hardware files, matrix defines, LAYOUT macro.

---

## RP2040 Flash Workflow

### Entering bootloader
- **Double-tap reset**: tap the reset button twice rapidly (within the `RP2040_BOOTLOADER_DOUBLE_TAP_RESET_TIMEOUT` window)
- **Hold BOOT + reset**: hold the BOOT button on the MCU, press reset, release BOOT. Required on brand-new or bricked controllers.
- **QK_BOOT keycode**: if accessible in your keymap, enters bootloader from firmware

### Flashing
After entering bootloader, the MCU mounts as a USB mass storage drive (usually `RPI-RP2`). Copy the `.uf2` file to the drive — it auto-ejects and reboots into new firmware.

```bash
# macOS — drag/drop often works, but if it fails:
cp -X firmware/mykeyboard.uf2 /Volumes/RPI-RP2

# Makefile shortcut (compiles + flashes, handles handedness EEPROM):
make flash-left    # plug in left half first
make flash-right   # then right half
```

---

## Constraints

- **`info.json` and `keyboard.json` must not coexist.** QMK may silently use one and ignore the other. Delete `info.json` once `keyboard.json` exists.
- **`VIA_ENABLE` and `VIAL_ENABLE` belong in keymap `rules.mk`**, not keyboard-level. Setting them at keyboard level prevents non-Vial keymaps from building correctly.
- **`DYNAMIC_KEYMAP_LAYER_COUNT` must match `vial.json`.** Mismatches corrupt Vial's layer display.
- **`SERIAL_USART_PIN_SWAP` is critical for RP2040 splits**: the firmware swaps TX/RX based on which half is master. Without it, the non-master half sends on the wrong pin.
- **`AUTO_SHIFT_ENABLE = yes` in `rules.mk` is required** before any `AUTO_SHIFT_*` config.h defines have effect — without it they are dead code.
- **`RP2040_BOOTLOADER_DOUBLE_TAP_RESET_TIMEOUT`** is in microseconds on some QMK versions, milliseconds on others. If double-tap isn't working, try `200U` (200ms), `500U`, or `1000U`.
