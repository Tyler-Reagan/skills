---
name: zmk-config
description: ZMK project configuration specialist for west.yml manifests, build.yaml CI targets, and Kconfig .conf files. Use when the user is setting up or editing a ZMK config repo, asks about module pinning, shield or board identifiers, build targets, ZMK Studio, split keyboard wiring, CONFIG_ZMK_ Kconfig options, or the UF2 flash workflow.
license: MIT
metadata:
  author: uraniborglabs@gmail.com
  version: "1.1.0"
  domain: keyboard-firmware
  triggers: west.yml, build.yaml, .conf, Kconfig, shield, board, snippet, zmk-config, module, revision, flash, UF2, ZMK Studio, CONFIG_ZMK
  role: specialist
  scope: implementation
  output-format: code
  related-skills: zmk-keymap, zmk-display, zmk-debug
---

# ZMK Config Engineer

**Scope: ZMK v0.3 and ZMK main (Zephyr 4.1).** Where they diverge — board identifier format, CI workflow ref, display module compatibility — callouts appear at the point of divergence. Detect the active version before making any changes.

**Version alias recognition.** ZMK main, Zephyr 4.1, and "v0.4" are the same stack.

## Domain Language

- **central** — The half (or dongle MCU) managing USB HID and BLE host connections. ZMK Studio runs on central only. Left half by convention in two-piece splits; the dongle MCU in three-piece setups.
- **peripheral** — A keyboard half connecting to central over BLE. No USB HID role; cannot run ZMK Studio.
- **board** — MCU module identifier. Format is version-dependent: flat (`nice_nano_v2`) for v0.3; qualified (`nice_nano_v2/nrf52840/zmk`) for ZMK main.
- **shield** — A Zephyr abstraction for a hardware add-on. Multiple shields stack in order within a `build.yaml` entry.
- **module** — An external Git repo consumed via `west.yml` that self-registers via `zephyr/module.yml`. Never copy module source into your config repo.
- **v0.3** — Current stable ZMK release (Zephyr 3.5, LVGL v8).
- **ZMK main** — Development branch (Zephyr 4.1, LVGL v9). Community alias: "v0.4".

## Version State — Detect, Surface, Resolve

Read all three signals before making any changes. Mismatches cause the three most common build errors.

| Signal | Where to look | v0.3 value | ZMK main value |
|---|---|---|---|
| ZMK revision | `config/west.yml` — `revision:` on the `zmk` project | `v0.3` or `v0.3.0` | `main` or a SHA |
| Board format | `build.yaml` — `board:` entries | flat (`board_name`) | qualified (`board/soc/zmk`) |
| CI workflow ref | `.github/workflows/*.yml` — `uses:` line | `@v0.3` | `@main` or `@<sha>` |

**Mismatch → error mapping:**

| Mismatch | Error | Fix |
|---|---|---|
| `@main` workflow + ZMK v0.3 source | `KeyError: 'qualifiers'` | Pin workflow to `@v0.3` |
| Qualified board + ZMK v0.3 | `Invalid BOARD; see above` | Use flat board name |
| Flat board + ZMK main | `<board> not found` | Use qualified `board/soc/zmk` |

For full west.yml, build.yaml, .conf templates and Kconfig reference, see [REFERENCE.md](REFERENCE.md).

## Gotchas

**`defaults: revision:` is a hidden float trap.** Any `west.yml` project that omits its own `revision:` silently inherits the `defaults: revision:` value. If that default is `main`, those modules are unpinned. Always set an explicit `revision:` on every project.

**`cmake-args` in `build.yaml` override `.conf` settings.** If you set a Kconfig option in both `cmake-args` and `.conf`, the `.conf` value is silently ignored. Don't duplicate — pick one location per option.

**`CONFIG_ZMK_KEYBOARD_NAME` max 16 characters.** Longer strings are silently truncated at compile time — no warning, no error. The name shows up shortened on the host.

**Never copy module source into your config repo.** Copying bypasses the module's `zephyr/module.yml` self-registration, creating a hidden fork that misses upstream fixes. Always reference via `west.yml` remote + project entry.

**Dongle pairing order matters.** In a three-piece dongle setup, pair left peripheral first, then right. Reversing the order swaps battery widget assignment on the display. Fix requires flashing `settings_reset` to the dongle.

**`CONFIG_ZMK_SETTINGS_RESET_ON_START=y` wipes BT bonds on every boot.** Only use temporarily for debugging. Remove before final flash.

## Constraints

- ZMK Studio snippet and cmake-args go on the **central** only — left half in two-piece splits, dongle in three-piece setups
- `CONFIG_ZMK_DISPLAY_INVERT` is incompatible with custom status screens
- `cmake-args` take precedence over `.conf` — don't set the same option in both
- `CONFIG_ZMK_KEYBOARD_NAME` max 16 characters (silently truncated)
- Module source must never be copied — always reference via `west.yml`

For board identifiers, shield names, and full Kconfig option tables, see [REFERENCE.md](REFERENCE.md).
