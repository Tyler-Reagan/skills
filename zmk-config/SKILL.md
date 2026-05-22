---
name: zmk-config
description: Use when authoring or editing ZMK project configuration files: west.yml manifests, build.yaml GitHub Actions targets, and .conf Kconfig files. Covers module management, revision pinning, shield/board/snippet syntax, ZMK Studio setup, power management, Bluetooth, HID, split keyboard config, and the UF2 flash workflow. Invoke for any task touching west.yml, build.yaml, *.conf, or the make/flash workflow.
license: MIT
metadata:
  author: tylerreagan98@gmail.com
  version: "1.0.0"
  domain: keyboard-firmware
  triggers: west.yml, build.yaml, .conf, Kconfig, shield, board, snippet, zmk-config, module, revision, flash, UF2, ZMK Studio, CONFIG_ZMK
  role: specialist
  scope: implementation
  output-format: code
  related-skills: zmk-keymap, zmk-display
---

# ZMK Config Engineer

**Scope: ZMK v0.3 only.** This skill targets the v0.3 release branch. ZMK `main` has significant breaking changes — Zephyr 4.1 (vs 3.5 in v0.3), new board qualifier format (`nice_nano/nrf52840/zmk` vs `nice_nano_v2`), LVGL v9 (vs v8), and an updated CI workflow that checks for explicit ZMK board variants. Community display modules (nice-view-gem, nice-shield-collection) are v0.3 / LVGL v8 only. Do not apply this skill's guidance to ZMK `main` builds without verifying each option.

Expert in ZMK v0.3 project configuration: west manifests, GitHub Actions build targets, and Kconfig. All options validated against https://v0-3-branch.zmk.dev/docs/config and https://v0-3-branch.zmk.dev/docs/customization.

---

## Version State — Detect, Surface, Resolve

Before making any config changes, audit the repo's version state. Read all three signals, identify the version, check consistency, and surface any violations to the user before suggesting fixes.

### Signal 1 — ZMK revision (source of truth)

Read `revision:` on the `zmk` project in `config/west.yml`:

| Revision value | ZMK version | Zephyr | Board identifier style |
|---------------|-------------|--------|----------------------|
| `v0.3` or `v0.3.0` | **v0.3** | 3.5 | flat name (e.g. `board_name_v2`) |
| `main` | **main — unstable** | 4.1 | qualified (`board/soc/zmk`) |
| commit SHA | unknown — inspect against ZMK history | varies | varies |
| absent (no zmk project) | implicit main | 4.1 | qualified |

For a commit SHA, determine whether it predates or postdates the Dec 9 2025 LVGL v9 switch by checking ZMK's git log. When in doubt, treat it as main-era and flag it explicitly.

If a stable ZMK release newer than v0.3 exists (check ZMK's GitHub releases), surface it. This skill's guidance only covers v0.3 — do not silently apply it to a newer version.

### Signal 2 — Board identifier format

Read each `board:` entry in `build.yaml`. The format alone reveals the target ZMK era without needing to know the specific board name:

- **Flat format** (`some_board_v2`, `board_name`) → ZMK v0.3 era. Board definitions live under `zmk/app/boards/arm/<name>/` using Zephyr 3.x YAML format.
- **Qualified format** (`board/soc_variant/zmk`) → ZMK main era. Board definitions use the Zephyr 4.x directory structure with a `zmk` qualifier.

### Signal 3 — CI workflow ref

Read the `uses:` line in `.github/workflows/*.yml`:

- `zmkfirmware/zmk/.github/workflows/build-user-config.yml@v0.3` → correct for v0.3
- `...@main` → correct for ZMK main, but will fail on v0.3 source with `KeyError: 'qualifiers'`

### Consistency check

All three signals must agree. Report every mismatch before proposing a fix:

| Symptom / error | Cause | Fix |
|----------------|-------|-----|
| `KeyError: 'qualifiers'` in CI | Workflow `@main` runs `west boards --format "{qualifiers}"` — a check added for the Zephyr 4.x board variant system that Zephyr 3.5 boards don't expose | Pin workflow to `@v0.3` |
| `Invalid BOARD; see above` in CMake | Qualified board format used with ZMK v0.3; v0.3 CMake board search doesn't resolve the qualifier structure | Change to flat board name |
| `<board_name> not found` with flat format | ZMK main CMake expects qualified format; flat names not resolved | Change to qualified format `board/soc/zmk` |
| west update module not found | A module's `revision:` tag or branch doesn't exist on its remote | Verify on the remote; fall back to `main` or a known-good SHA |

### Display module compatibility

If the repo includes community display modules in `west.yml`, the detected ZMK version determines their LVGL compatibility. Flag this and defer to the **zmk-display** skill — display module version resolution is in its domain, not here.

---

## west.yml — Manifest Format

The manifest file lives at `config/west.yml` in your zmk-config repo. It controls which ZMK version and external modules are fetched.

```yaml
manifest:
  defaults:
    revision: main          # fallback revision for any project that doesn't specify one
  remotes:
    - name: zmkfirmware
      url-base: https://github.com/zmkfirmware
    - name: my-org
      url-base: https://github.com/my-org
  projects:
    - name: zmk
      remote: zmkfirmware
      revision: v0.3        # pin to v0.3 — required to avoid LVGL v9 breaking changes
      import: app/west.yml  # imports ZMK's own module definitions
    - name: my-module
      remote: my-org
      revision: main        # or a commit SHA for exact pinning
  self:
    path: config            # the directory this west.yml lives in
```

### Key Rules

- **Always pin ZMK to `v0.3`** — `main` pulls LVGL v9 which breaks all community display modules and causes `nice_nano_v2 not found` errors (breaking change ~Dec 9 2025)
- `import: app/west.yml` on the ZMK project pulls in all of ZMK's own dependency definitions; this line is required
- `self: path: config` tells west that this manifest file is inside the `config/` subdirectory
- External modules (shields, display modules) use `revision: main` unless pinning is needed
- `revision` accepts branch names, tag names, or full commit SHAs
- `url-base` + project `name` = full clone URL (e.g. `https://github.com/zmkfirmware/zmk`)
- Override a specific project URL with `url:` instead of `remote:` + `name`

### Adding a Module

**Always reference external modules upstream — never copy their code into your config repo.** The correct pattern is a `west.yml` remote + project entry (which fetches the module at build time) combined with a shield reference in `build.yaml`. Copying a module's files into your repo creates a hidden fork: you stop receiving upstream fixes, the module's own `zephyr/module.yml` self-registration is bypassed, and the source of truth becomes ambiguous.

```yaml
remotes:
  - name: author
    url-base: https://github.com/author
projects:
  - name: repo-name
    remote: author
    revision: main
```

Then reference the shield in `build.yaml` — no code from the module lives in your config repo.

No `import:` needed for shield/display modules — they register themselves via `zephyr/module.yml`.

---

## build.yaml — GitHub Actions Build Targets

Controls what firmware artifacts the CI workflow builds. Lives at the repo root.

```yaml
include:
  - board: nice_nano_v2   # board identifier (ZMK v0.3 format)
    shield: urchin_left nice_view_adapter nice_view_gem   # space-separated shields
    snippet: studio-rpc-usb-uart    # optional: enables ZMK Studio transport
    cmake-args: -DCONFIG_ZMK_STUDIO=y -DCONFIG_ZMK_STUDIO_LOCKING=n
    artifact-name: urchin_left      # name of the downloaded .uf2 artifact

  - board: nice_nano/nrf52840/zmk
    shield: urchin_right nice_view_adapter nice_view_gem
    artifact-name: urchin_right

  - board: nice_nano/nrf52840/zmk
    shield: settings_reset          # utility firmware to clear flash settings
    artifact-name: settings_reset
```

### Fields

| Field | Required | Description |
|-------|----------|-------------|
| `board` | Yes | Board identifier string. For nice!nano v2 on ZMK v0.3: `nice_nano_v2`. The `nice_nano/nrf52840/zmk` qualifier format is ZMK `main` only and will fail on v0.3. |
| `shield` | Usually | Space-separated shield names applied to the board. Order matters for multi-shield builds (adapter before display module) |
| `snippet` | No | Applies a named Zephyr snippet. Use `studio-rpc-usb-uart` for ZMK Studio |
| `cmake-args` | No | Space-separated `-DCONFIG_*=value` overrides. Applied at build time only, not written to .conf |
| `artifact-name` | No | Names the downloaded artifact. Defaults to shield name if omitted |

### Rules

- ZMK Studio (`snippet: studio-rpc-usb-uart` + `cmake-args: -DCONFIG_ZMK_STUDIO=y`) belongs on the **central/left half only** — the peripheral doesn't need it
- `settings_reset` is a special ZMK shield for clearing all persisted settings (BT bonds, layer state). Always include it as a build target
- Multiple shields in one entry stack in order — e.g. `urchin_left nice_view_adapter nice_view_gem` applies the keyboard shield, then the display adapter, then the display module
- `cmake-args` overrides take precedence over `.conf` file settings

---

## .conf Files — Kconfig

Per-side configuration files live at `config/<shield_name>.conf`. A shared config for both halves can use `config/<keyboard_name>.conf` (without `_left`/`_right`).

**Syntax:**
```conf
CONFIG_OPTION=y          # boolean enable
CONFIG_OPTION=n          # boolean disable
CONFIG_OPTION=42         # integer
CONFIG_OPTION="text"     # string (max 16 chars for keyboard name)
```

Changes take effect only after building and flashing new firmware.

---

### Power Management

```conf
CONFIG_ZMK_SLEEP=y
CONFIG_ZMK_IDLE_SLEEP_TIMEOUT=1800000   # ms before deep sleep (30 min)
CONFIG_ZMK_IDLE_TIMEOUT=300000          # ms before idle (display blank, etc.)
```

Soft-off (full power down) is configured in the keymap via `&soft_off`, not Kconfig.

---

### Bluetooth

```conf
CONFIG_BT=y
CONFIG_ZMK_BLE=y
CONFIG_BT_CTLR_TX_PWR_PLUS_8=y         # max TX power — improves range/reliability
CONFIG_BT_MAX_CONN=5                    # max simultaneous BT connections (default 5)
CONFIG_BT_MAX_PAIRED=5                  # max paired devices (default 5)

# Experimental — use with caution:
CONFIG_ZMK_BLE_EXPERIMENTAL_CONN=y     # disables 2M PHY, improves some host compat
CONFIG_ZMK_BLE_EXPERIMENTAL_SEC=y      # enables passkey entry, key overwrite
CONFIG_BT_GATT_ENFORCE_SUBSCRIPTION=n  # workaround for Windows battery notification bug
```

---

### Display

```conf
CONFIG_ZMK_DISPLAY=y
CONFIG_ZMK_DISPLAY_STATUS_SCREEN_CUSTOM=y   # use a custom status screen module
# or:
CONFIG_ZMK_DISPLAY_STATUS_SCREEN_BUILT_IN=y # use ZMK's built-in screen

CONFIG_ZMK_DISPLAY_BLANK_ON_IDLE=y          # blank display when idle (default y for SSD1306)
CONFIG_ZMK_DISPLAY_INVERT=y                 # invert colors (not compatible with custom screens)
CONFIG_ZMK_DISPLAY_TICK_PERIOD_MS=10        # display refresh interval in ms (default 10)

# Work queue (choose one):
CONFIG_ZMK_DISPLAY_WORK_QUEUE_DEDICATED=y   # dedicated thread — prevents slow display from blocking keyboard
CONFIG_ZMK_DISPLAY_WORK_QUEUE_SYSTEM=y      # system thread (default)

# Built-in widget toggles:
CONFIG_ZMK_WIDGET_LAYER_STATUS=y
CONFIG_ZMK_WIDGET_BATTERY_STATUS=y
CONFIG_ZMK_WIDGET_BATTERY_STATUS_SHOW_PERCENTAGE=y
CONFIG_ZMK_WIDGET_OUTPUT_STATUS=y
CONFIG_ZMK_WIDGET_WPM_STATUS=n
```

---

### ZMK Studio

Studio config belongs in `cmake-args` in `build.yaml` for the central half, not in `.conf`:

```yaml
cmake-args: -DCONFIG_ZMK_STUDIO=y -DCONFIG_ZMK_STUDIO_LOCKING=n
```

If using `.conf` instead:
```conf
CONFIG_ZMK_STUDIO=y
CONFIG_ZMK_STUDIO_LOCKING=n            # disable auto-lock (convenient for development)
CONFIG_ZMK_STUDIO_LOCK_IDLE_TIMEOUT_SEC=500    # seconds before auto-lock (default 500)
CONFIG_ZMK_STUDIO_LOCK_ON_DISCONNECT=y         # lock when USB disconnects (default y)
CONFIG_ZMK_KEYMAP_LAYER_NAME_MAX_LEN=20        # max layer display name length (default 20)
```

**Important:** Once ZMK Studio manages the keymap, changes to the `.keymap` file are ignored unless you "Restore Stock Settings" in Studio. Add `&studio_unlock` to a key to re-enable Studio modifications.

---

### HID & USB

```conf
CONFIG_ZMK_USB=y
CONFIG_ZMK_USB_BOOT=y                  # enable BIOS/UEFI boot protocol support
CONFIG_ZMK_HID_INDICATORS=y           # allow host to send LED state (caps lock, etc.)
CONFIG_ZMK_HID_REPORT_TYPE_NKRO=y     # N-key rollover (default: HKRO)
CONFIG_ZMK_HID_KEYBOARD_NKRO_EXTENDED_REPORT=y  # enables F13-F24 in NKRO mode
CONFIG_ZMK_USB_LOGGING=y              # debug output via USB CDC (dev only)
```

---

### System

```conf
CONFIG_ZMK_KEYBOARD_NAME="My Board"   # max 16 characters
CONFIG_ZMK_SETTINGS_RESET_ON_START=y  # wipe all persistent settings at boot (use carefully)
CONFIG_ZMK_SETTINGS_SAVE_DEBOUNCE=60000  # ms before writing settings to flash (default 60000)
CONFIG_ZMK_WPM=y                      # enable WPM tracking (required for WPM widget)
CONFIG_HEAP_MEM_POOL_SIZE=8192        # heap size in bytes (default 8192)
```

---

### Behaviors (advanced tuning)

```conf
CONFIG_ZMK_BEHAVIORS_QUEUE_SIZE=64             # macro/complex behavior queue depth (default 64)
CONFIG_ZMK_BEHAVIOR_HOLD_TAP_MAX_HELD=10       # max simultaneous held hold-taps (default 10)
CONFIG_ZMK_BEHAVIOR_HOLD_TAP_MAX_CAPTURED_EVENTS=40  # events captured during hold-tap decision (default 40)
CONFIG_ZMK_MACRO_DEFAULT_WAIT_MS=15            # macro inter-action delay (default 15)
CONFIG_ZMK_MACRO_DEFAULT_TAP_MS=30             # macro tap hold duration (default 30)
CONFIG_ZMK_COMBO_MAX_PRESSED_COMBOS=4          # max simultaneously active combos (default 4)
```

---

### Pointing / Mouse

```conf
CONFIG_ZMK_POINTING=y                          # enable pointing/mouse HID (v0.3+ API)
CONFIG_ZMK_POINTING_SMOOTH_SCROLLING=y         # HID Resolution Multipliers for smooth scroll
```

Requires `#include <dt-bindings/zmk/pointing.h>` in the keymap. Do not use the legacy `CONFIG_ZMK_MOUSE` or `<dt-bindings/zmk/mouse.h>`.

---

## UF2 Flash Workflow

### GitHub Actions (recommended)

```makefile
make build      # triggers gh workflow run build.yml
make status     # gh run list --workflow=build.yml --limit=5
make download   # downloads latest successful run artifacts to ~/Desktop/firmware/YYYYMMDD-HHMMSS/
make flash-left  # copies left .uf2 to /Volumes/NICENANO (double-tap reset first)
make flash-right # copies right .uf2 to /Volumes/NICENANO
```

### Bootloader Entry

Double-tap the reset button on each half. The MCU mounts as a USB mass storage device (`NICENANO` for nice!nano). Copy the `.uf2` file to the drive — it ejects automatically and reboots into new firmware.

### settings_reset

Flash `settings_reset.uf2` to clear all bonded hosts and persisted keymap state. Required when:
- Changing BT profiles causes connection issues
- ZMK Studio keymap conflicts with `.keymap` file
- Unexplained pairing failures after firmware changes

---

## Split Keyboard Patterns

- The **central** (left) half manages BLE host connections and runs ZMK Studio
- The **peripheral** (right) half connects to central over BLE split transport
- ZMK Studio snippet and `CONFIG_ZMK_STUDIO=y` go on central **only**
- `CONFIG_ZMK_SLEEP`, `CONFIG_BT_CTLR_TX_PWR_PLUS_8`, display config apply to **both** halves via per-side `.conf` files
- `reset` and `bootloader` behaviors in keymaps only affect the half they're on
- A `settings_reset` build target should be included for clearing split pairing state

---

## zephyr/module.yml

Every ZMK module repo must include this file to be recognized by west:

```yaml
build:
  cmake: .
  kconfig: Kconfig
```

The `name` field in the module's `zephyr/module.yml` uses the convention `zmk-keyboard-<name>` for keyboard shields.

---

## Constraints

- **Never copy external module code into your config repo** — always reference upstream via `west.yml` remote + project + shield in `build.yaml`. Copying creates a hidden fork that misses upstream fixes and breaks the module's self-registration.
- **Never use `revision: main` for ZMK itself** — always pin to `v0.3` until LVGL v9 compatibility is resolved across the module ecosystem
- `cmake-args` in `build.yaml` override `.conf` settings — don't duplicate the same option in both
- `CONFIG_ZMK_DISPLAY_INVERT` is incompatible with custom status screens
- ZMK Studio only works on the central half; applying its snippet to the peripheral wastes flash and RAM
- `CONFIG_ZMK_KEYBOARD_NAME` max 16 characters — longer strings are silently truncated
- `CONFIG_ZMK_SETTINGS_RESET_ON_START=y` wipes BT bonds on every boot — only use temporarily for debugging
