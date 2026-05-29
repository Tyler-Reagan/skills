---
name: zmk-config
description: ZMK project configuration specialist for west.yml manifests, build.yaml CI targets, and Kconfig .conf files. Use when the user is setting up or editing a ZMK config repo, asks about module pinning, shield or board identifiers, build targets, ZMK Studio, split keyboard wiring, CONFIG_ZMK_ Kconfig options, or the UF2 flash workflow.
license: MIT
metadata:
  author: uraniborglabs@gmail.com
  version: "1.0.0"
  domain: keyboard-firmware
  triggers: west.yml, build.yaml, .conf, Kconfig, shield, board, snippet, zmk-config, module, revision, flash, UF2, ZMK Studio, CONFIG_ZMK
  role: specialist
  scope: implementation
  output-format: code
  related-skills: zmk-keymap, zmk-display
---

# ZMK Config Engineer

**Scope: ZMK v0.3 and ZMK main (Zephyr 4.1).** This skill covers both release lines. Where they diverge — board identifier format, CI workflow ref, display module compatibility — callouts appear at the point of divergence. Always detect the active version from `west.yml` before making any changes; see the Version State section.

**Version alias recognition.** ZMK main, Zephyr 4.1, and the community term "v0.4" all refer to the same stack. When any of these appear in user messages, module READMEs, or GitHub issues, treat them as synonymous.

Expert in ZMK project configuration: west manifests, GitHub Actions build targets, and Kconfig. v0.3 options validated against https://v0-3-branch.zmk.dev/docs/config; ZMK main follows the same Kconfig surface with Zephyr 4.1 underneath.

## Domain Language

- **central** — The keyboard half (or dongle MCU) that manages USB HID and BLE host connections. ZMK Studio runs on the central only. Left half by convention in two-piece splits; the dongle MCU in three-piece setups.
- **peripheral** — A keyboard half that connects to the central over BLE split transport. Has no USB HID role; cannot run ZMK Studio.
- **board** — The MCU module identifier. Format is version-dependent: flat name (`nice_nano_v2`) in v0.3; qualified path (`nice_nano_v2/nrf52840/zmk`) in ZMK main.
- **shield** — A Zephyr abstraction for a hardware add-on: keyboard PCB layout, display module, or adapter. Multiple shields stack in order within a `build.yaml` entry.
- **module** — An external Git repo consumed via `west.yml` that self-registers via `zephyr/module.yml`. Never copy module source into your config repo; always reference upstream.
- **west manifest** — The `config/west.yml` file that declares which ZMK version and modules the build fetches.
- **v0.3** — Current stable ZMK release (Zephyr 3.5, LVGL v8).
- **ZMK main** — Development branch (Zephyr 4.1, LVGL v9). Community aliases: "v0.4", "main". Not formally released as of early 2026.

---

## Version State — Detect, Surface, Resolve

Before making any config changes, audit the repo's version state. Read all three signals, identify the version, check consistency, and surface any violations to the user before suggesting fixes.

### Signal 1 — ZMK revision (source of truth)

Read `revision:` on the `zmk` project in `config/west.yml`:

| Revision value          | ZMK version                                                                            | Zephyr | Board identifier style           |
| ----------------------- | -------------------------------------------------------------------------------------- | ------ | -------------------------------- |
| `v0.3` or `v0.3.0`      | **v0.3**                                                                               | 3.5    | flat name (e.g. `board_name_v2`) |
| `main`                  | **ZMK main** (Zephyr 4.1 / LVGL v9; community alias: "v0.4" — not yet formally tagged) | 4.1    | qualified (`board/soc/zmk`)      |
| commit SHA              | determine era by cross-referencing ZMK git history                                     | varies | varies                           |
| absent (no zmk project) | implicit main                                                                          | 4.1    | qualified                        |

**Alias recognition — ZMK main / Zephyr 4.1 / "v0.4" are all the same thing.** ZMK has not cut a formal v0.4 release tag, but the community, module maintainers, and contributors use these terms interchangeably for the current `main` branch. "ZMK main" is the only formally correct term (it's the branch name); "Zephyr 4.1" is the precise underlying RTOS version; "v0.4" is community shorthand for the anticipated next release. When any of these appear — in user messages, module READMEs, GitHub issues, or PR titles — treat them as referring to the same stack: ZMK main, Zephyr 4.1, LVGL v9, qualified board format.

**Preferred pattern: SHA pin.** A branch name (`main`, `v0.3`) floats — upstream pushes silently change what your build fetches. Use a full commit SHA instead and annotate with the date: `revision: abc123...  # main @ YYYY-MM-DD`. Advance the pin deliberately when you want upstream changes.

**`defaults: revision:` is a hidden float trap.** Any project entry in `west.yml` that omits its own `revision:` silently inherits the value from `defaults: revision:`. If that default is `main`, those modules are unpinned even if you didn't intend it. Always set an explicit `revision:` on every project, and keep `defaults: revision:` only as a last-resort fallback.

For a commit SHA, determine whether it predates or postdates the Dec 9 2025 LVGL v9 switch by checking ZMK's git log. When in doubt, treat it as main-era and flag it explicitly.

If a stable ZMK release newer than v0.3 exists (check ZMK's GitHub releases), surface it to the user.

### Signal 2 — Board identifier format

Read each `board:` entry in `build.yaml`. The format alone reveals the target ZMK era without needing to know the specific board name. For a list of common boards and how to find any board's exact identifier, see [`references/boards.md`](references/boards.md).

- **Flat format** (`some_board_v2`, `board_name`) → ZMK v0.3 era. Board definitions live under `zmk/app/boards/arm/<name>/` using Zephyr 3.x YAML format.
- **Qualified format** (`board/soc_variant/zmk`) → ZMK main era. Board definitions use the Zephyr 4.x directory structure with a `zmk` qualifier.

### Signal 3 — CI workflow ref

Read the `uses:` line in `.github/workflows/*.yml`:

- `zmkfirmware/zmk/.github/workflows/build-user-config.yml@v0.3` → correct for v0.3
- `...@main` → correct for ZMK main, but will fail on v0.3 source with `KeyError: 'qualifiers'`
- `...@<full-SHA>` → preferred for reproducibility; GitHub Actions reusable workflows support SHA refs the same way `west.yml` does. Use the same SHA as the ZMK firmware pin so the build tooling and firmware source are locked to the same commit.

### Consistency check

All three signals must agree. Report every mismatch before proposing a fix:

| Symptom / error                           | Cause                                                                                                                                                   | Fix                                                           |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `KeyError: 'qualifiers'` in CI            | Workflow `@main` runs `west boards --format "{qualifiers}"` — a check added for the Zephyr 4.x board variant system that Zephyr 3.5 boards don't expose | Pin workflow to `@v0.3`                                       |
| `Invalid BOARD; see above` in CMake       | Qualified board format used with ZMK v0.3; v0.3 CMake board search doesn't resolve the qualifier structure                                              | Change to flat board name                                     |
| `<board_name> not found` with flat format | ZMK main CMake expects qualified format; flat names not resolved                                                                                        | Change to qualified format `board/soc/zmk`                    |
| west update module not found              | A module's `revision:` tag or branch doesn't exist on its remote                                                                                        | Verify on the remote; fall back to `main` or a known-good SHA |

### Display module compatibility

If the repo includes community display modules in `west.yml`, the detected ZMK version determines their LVGL compatibility. Flag this and defer to the **zmk-display** skill — display module version resolution is in its domain, not here.

---

## west.yml — Manifest Format

The manifest file lives at `config/west.yml` in your zmk-config repo. It controls which ZMK version and external modules are fetched.

```yaml
manifest:
  defaults:
    revision: main # fallback revision for any project that doesn't specify one
  remotes:
    - name: zmkfirmware
      url-base: https://github.com/zmkfirmware
    - name: my-org
      url-base: https://github.com/my-org
  projects:
    - name: zmk
      remote: zmkfirmware
      revision: v0.3 # pin to v0.3 — required to avoid LVGL v9 breaking changes
      import: app/west.yml # imports ZMK's own module definitions
    - name: my-module
      remote: my-org
      revision: main # or a commit SHA for exact pinning
  self:
    path: config # the directory this west.yml lives in
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
# ZMK v0.3 (Zephyr 3.5) — flat board identifier
include:
  - board: <board_name>
    shield: <keyboard_shield>_left nice_view_adapter nice_view_gem
    snippet: studio-rpc-usb-uart
    cmake-args: -DCONFIG_ZMK_STUDIO=y -DCONFIG_ZMK_STUDIO_LOCKING=n
    artifact-name: <keyboard_shield>_left
  - board: <board_name>
    shield: <keyboard_shield>_right nice_view_adapter nice_view_gem
    artifact-name: <keyboard_shield>_right
  - board: <board_name>
    shield: settings_reset
    artifact-name: settings_reset

# ZMK main / "v0.4" (Zephyr 4.1) — qualified board identifier
include:
  - board: <board>/<soc>/zmk
    shield: <keyboard_shield>_left nice_view_adapter nice_view_gem
    snippet: studio-rpc-usb-uart
    cmake-args: -DCONFIG_ZMK_STUDIO=y -DCONFIG_ZMK_STUDIO_LOCKING=n
    artifact-name: <keyboard_shield>_left
  - board: <board>/<soc>/zmk
    shield: <keyboard_shield>_right nice_view_adapter nice_view_gem
    artifact-name: <keyboard_shield>_right
  - board: <board>/<soc>/zmk
    shield: settings_reset
    artifact-name: settings_reset
```

### Fields

| Field           | Required | Description                                                                                                                                                                          |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `board`         | Yes      | Board identifier string. Format depends on ZMK version — flat (`board_name`) for v0.3, qualified (`board/soc/zmk`) for ZMK main. See [`references/boards.md`](references/boards.md). |
| `shield`        | Usually  | Space-separated shield names applied to the board. Order matters for multi-shield builds (adapter before display module). See [`references/shields.md`](references/shields.md).      |
| `snippet`       | No       | Applies a named Zephyr snippet. Use `studio-rpc-usb-uart` for ZMK Studio                                                                                                             |
| `cmake-args`    | No       | Space-separated `-DCONFIG_*=value` overrides. Applied at build time only, not written to .conf                                                                                       |
| `artifact-name` | No       | Names the downloaded artifact. Defaults to shield name if omitted                                                                                                                    |

### Rules

- ZMK Studio (`snippet: studio-rpc-usb-uart` + `cmake-args: -DCONFIG_ZMK_STUDIO=y`) belongs on the **central** only — the central is whichever half (or dongle) manages the USB HID and BLE host connection. The peripheral doesn't need it.
- `settings_reset` is a special ZMK shield for clearing all persisted settings (BT bonds, layer state). Always include it as a build target
- Multiple shields in one entry stack in order — keyboard shield first, then hardware adapters, then display modules
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

### Standard two-piece split

- The **central** half (often the left by convention, but configurable) manages BLE host connections and runs ZMK Studio
- The **peripheral** half connects to central over BLE split transport
- ZMK Studio snippet and `CONFIG_ZMK_STUDIO=y` go on central **only**
- `CONFIG_ZMK_SLEEP`, `CONFIG_BT_CTLR_TX_PWR_PLUS_8`, display config apply to **both** halves via per-side `.conf` files
- `reset` and `bootloader` behaviors in keymaps only affect the half they're on
- A `settings_reset` build target should be included for clearing split pairing state

### Dongle setup (three-piece split)

In a dongle setup a dedicated USB MCU acts as the BLE central. Both keyboard halves become pure peripherals — they have no USB HID role and cannot run ZMK Studio.

```yaml
include:
  - board: <dongle_board>/<soc>/zmk
    shield: my_dongle my_dongle_screen # dongle is central + display
    snippet: studio-rpc-usb-uart
    cmake-args: -DCONFIG_ZMK_STUDIO=y -DCONFIG_ZMK_STUDIO_LOCKING=n
    artifact-name: dongle
  - board: <keyboard_board>/<soc>/zmk
    shield: my_keyboard_left # peripheral only — no studio snippet
    artifact-name: keyboard_left
  - board: <keyboard_board>/<soc>/zmk
    shield: my_keyboard_right # peripheral only
    artifact-name: keyboard_right
  - board: <keyboard_board>/<soc>/zmk
    shield: settings_reset
    artifact-name: settings_reset
```

Key differences from a standard split:

- **ZMK Studio goes on the dongle**, not the left half — the dongle is the central
- Keyboard halves need no `snippet:` or `cmake-args:` for Studio
- The dongle's display shield is stacked after the keyboard dongle shield, same order rule as nice!view adapters
- Pairing order matters for multi-peripheral battery widgets: pair left half first, then right, after flashing the dongle — otherwise battery indicators may be swapped. A full `settings_reset` on the dongle is required to fix a swapped pairing.

---

## zephyr/module.yml — Module-as-Repo vs Config-Consuming-Module

There are two distinct patterns. Confusing them leads to broken builds or invisible forks.

### Pattern A — Repo IS the module (upstream)

A repo like `zmk-dongle-screen` (main branch) or `nice-view-gem` is itself a ZMK module. It contains:

- `zephyr/module.yml` — the self-registration file that tells west's build system this is a module
- `boards/shields/` — shield overlay files
- `src/` — widget C source and headers
- `CMakeLists.txt`, `Kconfig` — build integration

Other repos consume this module by adding it to their `west.yml` as a `projects:` entry. The module's `zephyr/module.yml` fires during west's module scan and registers the shield/source automatically — no extra steps in the consuming repo.

```yaml
# zephyr/module.yml (inside the module repo itself)
build:
  cmake: .
  kconfig: Kconfig
```

The `name` field convention for keyboard shields: `zmk-keyboard-<name>`.

**Never copy a module repo's files into your config repo.** The module's `zephyr/module.yml` must be present at its original repo root for self-registration to work. A copy without this context breaks the registration silently.

### Pattern B — Repo CONSUMES modules (user config)

A user config repo contains no `zephyr/module.yml`. It references external modules via `west.yml`:

```yaml
projects:
  - name: some-display-module # e.g. nice-view-gem, or any other community module
    remote: module-author
    revision: abc123... # main @ YYYY-MM-DD
```

And uses them in `build.yaml` by shield name:

```yaml
shield: my_keyboard_left my_display_module # shield names from whatever modules you consume
```

The consuming repo itself is NOT a ZMK module — it is a west workspace config. `self: path: config` in west.yml marks the directory, not a module.

### Distinguishing them in the wild

| Signal                                          | IS a module | CONSUMES modules |
| ----------------------------------------------- | ----------- | ---------------- |
| Has `zephyr/module.yml`                         | Yes         | No               |
| Has `src/` with widget `.c` files               | Often       | No               |
| Has `build.yaml` referencing its own shields    | Sometimes   | Yes              |
| Has `config/west.yml` with `self: path: config` | No          | Yes              |
| Other repos list it as a `projects:` entry      | Yes         | No               |

---

## Constraints

- **Never copy external module code into your config repo** — always reference upstream via `west.yml` remote + project + shield in `build.yaml`. Copying creates a hidden fork that misses upstream fixes and breaks the module's self-registration.
- **Always pin ZMK and all modules to a SHA** — branch names (`main`, `v0.3`) float silently. Annotate with date: `revision: abc123  # main @ YYYY-MM-DD`. See Version State section.
- `cmake-args` in `build.yaml` override `.conf` settings — don't duplicate the same option in both
- `CONFIG_ZMK_DISPLAY_INVERT` is incompatible with custom status screens
- **ZMK Studio belongs on the central — which in a dongle setup is the dongle, not the left keyboard half.** In a standard two-piece split the left half is central; in a three-piece dongle split the dongle MCU is central. Apply `snippet: studio-rpc-usb-uart` and `CONFIG_ZMK_STUDIO=y` to whichever build target is the central. Applying it to a peripheral wastes flash and RAM without effect.
- `CONFIG_ZMK_KEYBOARD_NAME` max 16 characters — longer strings are silently truncated
- `CONFIG_ZMK_SETTINGS_RESET_ON_START=y` wipes BT bonds on every boot — only use temporarily for debugging
