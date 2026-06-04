# ZMK Config — Reference

## west.yml format

```yaml
manifest:
  defaults:
    revision: main    # CAUTION: any project without its own revision: inherits this
  remotes:
    - name: zmkfirmware
      url-base: https://github.com/zmkfirmware
    - name: my-org
      url-base: https://github.com/my-org
  projects:
    - name: zmk
      remote: zmkfirmware
      revision: v0.3        # or a ZMK main SHA — pin explicitly; never leave floating
      import: app/west.yml  # required: imports ZMK's own module definitions
    - name: nice-view-gem
      remote: m165437        # example display module
      revision: 3f38221c61ec # last LVGL v8 commit (before Jan 25 2026); pin to SHA
  self:
    path: config            # the directory this west.yml lives in
```

**Rules:**
- `import: app/west.yml` on the ZMK project is required — pulls in all ZMK dependency definitions
- `self: path: config` marks the manifest directory
- `revision` accepts branch names, tags, or full commit SHAs — prefer SHAs with date annotations
- `url-base` + project `name` = full clone URL

**Adding a module:** always add a `remotes:` entry + `projects:` entry; reference the shield in `build.yaml`. No `import:` needed — modules self-register via `zephyr/module.yml`.

---

## build.yaml format

```yaml
# ZMK v0.3 — flat board identifier
include:
  - board: nice_nano_v2
    shield: corne_left nice_view_adapter nice_view_gem
    snippet: studio-rpc-usb-uart
    cmake-args: -DCONFIG_ZMK_STUDIO=y -DCONFIG_ZMK_STUDIO_LOCKING=n
    artifact-name: corne_left
  - board: nice_nano_v2
    shield: corne_right nice_view_adapter nice_view_gem
    artifact-name: corne_right
  - board: nice_nano_v2
    shield: settings_reset
    artifact-name: settings_reset

# ZMK main — qualified board identifier
include:
  - board: nice_nano_v2/nrf52840/zmk
    shield: corne_left nice_view_adapter nice_view_gem
    snippet: studio-rpc-usb-uart
    cmake-args: -DCONFIG_ZMK_STUDIO=y -DCONFIG_ZMK_STUDIO_LOCKING=n
    artifact-name: corne_left
```

**Field reference:**

| Field | Required | Notes |
|---|---|---|
| `board` | Yes | Version-dependent format — see boards.md |
| `shield` | Usually | Space-separated; order: keyboard → adapter → display module |
| `snippet` | No | `studio-rpc-usb-uart` for ZMK Studio; central only |
| `cmake-args` | No | Overrides `.conf` settings; space-separated `-DCONFIG_*=value` |
| `artifact-name` | No | Names the downloaded artifact; defaults to shield name |

---

## .conf Kconfig options

### Power management
```conf
CONFIG_ZMK_SLEEP=y
CONFIG_ZMK_IDLE_SLEEP_TIMEOUT=1800000   # ms before deep sleep (30 min)
CONFIG_ZMK_IDLE_TIMEOUT=300000          # ms before idle
```

### Bluetooth
```conf
CONFIG_BT_CTLR_TX_PWR_PLUS_8=y         # max TX power
CONFIG_BT_MAX_CONN=5
CONFIG_BT_MAX_PAIRED=5
CONFIG_ZMK_BLE_EXPERIMENTAL_CONN=y     # disables 2M PHY, improves some host compat
CONFIG_ZMK_BLE_EXPERIMENTAL_SEC=y      # passkey entry, key overwrite
CONFIG_BT_GATT_ENFORCE_SUBSCRIPTION=n  # Windows battery notification workaround
```

### Display
```conf
CONFIG_ZMK_DISPLAY=y
CONFIG_ZMK_DISPLAY_STATUS_SCREEN_CUSTOM=y   # use a community module
CONFIG_ZMK_DISPLAY_WORK_QUEUE_DEDICATED=y   # isolate display from key scan thread
CONFIG_ZMK_DISPLAY_BLANK_ON_IDLE=y
CONFIG_ZMK_DISPLAY_TICK_PERIOD_MS=10
```
`CONFIG_ZMK_DISPLAY_INVERT=y` is incompatible with custom status screens.

### ZMK Studio (prefer cmake-args over .conf)
```yaml
cmake-args: -DCONFIG_ZMK_STUDIO=y -DCONFIG_ZMK_STUDIO_LOCKING=n
```
If using `.conf`:
```conf
CONFIG_ZMK_STUDIO=y
CONFIG_ZMK_STUDIO_LOCKING=n
CONFIG_ZMK_STUDIO_LOCK_IDLE_TIMEOUT_SEC=500
```

### HID & USB
```conf
CONFIG_ZMK_USB_BOOT=y
CONFIG_ZMK_HID_REPORT_TYPE_NKRO=y
CONFIG_ZMK_HID_INDICATORS=y
```

### System
```conf
CONFIG_ZMK_KEYBOARD_NAME="My Board"    # max 16 characters — silently truncated if longer
CONFIG_ZMK_WPM=y                       # enable WPM tracking
CONFIG_ZMK_SETTINGS_RESET_ON_START=y   # DANGER: wipes BT bonds on every boot
CONFIG_ZMK_SETTINGS_SAVE_DEBOUNCE=60000
```

### Behaviors (advanced tuning)
```conf
CONFIG_ZMK_BEHAVIORS_QUEUE_SIZE=64
CONFIG_ZMK_MACRO_DEFAULT_WAIT_MS=15
CONFIG_ZMK_MACRO_DEFAULT_TAP_MS=30
CONFIG_ZMK_COMBO_MAX_PRESSED_COMBOS=4
```

### Pointing / Mouse
```conf
CONFIG_ZMK_POINTING=y
CONFIG_ZMK_POINTING_SMOOTH_SCROLLING=y
```
Requires `#include <dt-bindings/zmk/pointing.h>` in the keymap. Do **not** use legacy `CONFIG_ZMK_MOUSE`.

---

## UF2 Flash Workflow

Double-tap the reset button on each half. MCU mounts as a USB mass storage drive (`NICENANO` for nice!nano). Copy the `.uf2` file to the drive — it ejects automatically and reboots.

**macOS drag-and-drop fails:** use `cp -X firmware.uf2 /Volumes/NICENANO` instead.

Flash `settings_reset.uf2` when: changing BT profiles causes issues, ZMK Studio conflicts with `.keymap`, or unexplained pairing failures after firmware changes.

---

## Split keyboard patterns

### Standard two-piece split
- Central (usually left) manages USB HID and BLE host; Studio snippet goes here only
- Both halves: `CONFIG_ZMK_SLEEP`, `CONFIG_BT_CTLR_TX_PWR_PLUS_8`, display config
- `reset` and `bootloader` behaviors only affect the half they're on

### Dongle (three-piece) setup
The dongle MCU is the central. Both keyboard halves are pure peripherals.
- ZMK Studio snippet goes on the **dongle** target, not the left keyboard half
- Keyboard halves need no `snippet:` or `cmake-args:`
- Pairing order: pair left peripheral first, then right — reversing swaps battery widget assignment
- Full `settings_reset` on dongle required to fix swapped pairing

---

## Module patterns

### Module repo (IS a module)
Contains `zephyr/module.yml` at root, `src/` widget C source, `boards/shields/`.
Other repos reference it via `west.yml` projects entry.

### User config repo (CONSUMES modules)
Contains no `zephyr/module.yml`. References modules via `west.yml`, uses them by shield name in `build.yaml`.

**Never copy a module repo's source into your config repo.** The module's `zephyr/module.yml` must be at its original repo root for self-registration to work.
