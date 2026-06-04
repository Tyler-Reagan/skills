# QMK Config — Reference

## keyboard.json

```json
{
    "keyboard_name": "MyBoard",
    "manufacturer": "Author",
    "usb": { "vid": "0x1234", "pid": "0x5678", "device_version": "0.1.0" },
    "processor": "RP2040",
    "bootloader": "rp2040",
    "matrix_pins": {
        "rows": ["GP26", "GP27", "GP28", "GP29"],
        "cols": ["GP6", "GP7", "GP3", "GP4", "GP2"]
    },
    "diode_direction": "COL2ROW",
    "debounce": 5,
    "split": {
        "enabled": true,
        "serial": { "driver": "vendor" }
    },
    "layouts": {
        "LAYOUT": {
            "layout": [
                { "label": "K00", "matrix": [0, 0], "x": 0, "y": 0 }
            ]
        }
    }
}
```

**Key fields:**
| Field | Notes |
|---|---|
| `processor` | `"RP2040"`, `"atmega32u4"`, `"STM32F411"` |
| `bootloader` | `"rp2040"`, `"caterina"`, `"atmel-dfu"`, `"stm32-dfu"` |
| `diode_direction` | `"COL2ROW"` (most common) or `"ROW2COL"` |
| `split.serial.driver` | `"vendor"` for RP2040 hardware UART; `"bitbang"` for single-wire |

**`info.json` vs `keyboard.json`:** QMK 0.18+ uses `keyboard.json`. If both exist, delete `info.json`.

---

## config.h — Keyboard Level

```c
// RP2040 hardware UART split
#define SERIAL_USART_FULL_DUPLEX
#define SERIAL_USART_TX_PIN GP0
#define SERIAL_USART_RX_PIN GP1
#define SERIAL_USART_PIN_SWAP      // swap TX/RX when this half is master — required

// Handedness
#define EE_HANDS

// RP2040 bootloader double-tap
#define RP2040_BOOTLOADER_DOUBLE_TAP_RESET
#define RP2040_BOOTLOADER_DOUBLE_TAP_RESET_TIMEOUT 200U
```

## config.h — Keymap Level

```c
#pragma once

// Vial credentials
#define VIAL_KEYBOARD_UID { 0xCB, 0x37, 0x36, 0xFE, 0xEE, 0xED, 0xEE, 0x77 }
#define VIAL_UNLOCK_COMBO_ROWS { 0, 4 }
#define VIAL_UNLOCK_COMBO_COLS { 0, 0 }
#define DYNAMIC_KEYMAP_LAYER_COUNT 16   // must match vial.json

// Tap-hold
#define TAPPING_TERM 200
// #define PERMISSIVE_HOLD
// #define RETRO_TAPPING
// #define QUICK_TAP_TERM 120

// Lock keys
#undef LOCKING_SUPPORT_ENABLE
#undef LOCKING_RESYNC_ENABLE
```

## rules.mk — Keymap Level

```makefile
# Vial (includes VIA) — keymap level only
VIA_ENABLE = yes
VIAL_ENABLE = yes

EXTRAKEY_ENABLE = yes    # required for all media/consumer keys

# Optional features:
# TAP_DANCE_ENABLE = yes
# COMBO_ENABLE = yes
# CAPS_WORD_ENABLE = yes
# MOUSEKEY_ENABLE = yes
# NKRO_ENABLE = yes
# BOOTMAGIC_ENABLE = yes
```

---

## Vial — vial.json

Defines the visual layout for the Vial/VIA app. Not the same as `keyboard.json`. Place at `keymaps/<keymap>/vial.json`.

**Generating UID:**
```bash
python3 util/vial_generate_keyboard_uid.py
# copy the 8-byte hex array into keymap's config.h
```

**Unlock combo:** Two matrix positions pressed simultaneously to unlock Vial. Must match `keyboard.json`'s matrix_pins indices.

---

## Split Keyboard Patterns

### EE_HANDS (recommended for RP2040 TRRS splits)
```bash
qmk flash -kb <kb> -km <km> -bl uf2-split-left   # left half only
qmk flash -kb <kb> -km <km> -bl uf2-split-right  # right half only
# subsequent flashes: same UF2 for both
```

### MASTER_LEFT / MASTER_RIGHT
```c
#define MASTER_LEFT    // USB always plugged into left half
```
No per-half flashing needed — both use identical firmware.

### Split Data Sync
```c
#define SPLIT_LAYER_STATE_ENABLE
#define SPLIT_LED_STATE_ENABLE
#define SPLIT_MODS_ENABLE
#define SPLIT_WPM_ENABLE
```

---

## User Config Repo Pattern

```makefile
QMK_DIR  := $(HOME)/vial-qmk
KB       := vendor/keyboard_name
KM       ?= mymap

sync-to-fw:
	cp totem/keymaps/$(KM)/keymap.c  $(QMK_DIR)/keyboards/$(KB)/keymaps/$(KM)/keymap.c
	# ... other files

compile: sync-to-fw
	cd $(QMK_DIR) && qmk compile -kb $(KB) -km $(KM)

flash-left: sync-to-fw
	cd $(QMK_DIR) && qmk flash -kb $(KB) -km $(KM) -bl uf2-split-left

flash-right: sync-to-fw
	cd $(QMK_DIR) && qmk flash -kb $(KB) -km $(KM) -bl uf2-split-right
```

---

## RP2040 Flash Workflow

- **Double-tap reset**: within `RP2040_BOOTLOADER_DOUBLE_TAP_RESET_TIMEOUT` window
- **Hold BOOT + press reset**: for brand-new or bricked controllers
- **QK_BOOT keycode**: if accessible from current layer

After entering bootloader: MCU mounts as `RPI-RP2`. Copy `.uf2` to the drive.

```bash
# macOS — if Finder drag fails:
cp -X firmware/mykeyboard.uf2 /Volumes/RPI-RP2
```
