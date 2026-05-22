# ZMK Board Identifiers

Boards are the `board:` value in `build.yaml` and the primary key for the ZMK build system. The format changed between ZMK v0.3 and ZMK main.

---

## Format by ZMK version

### ZMK v0.3 — flat name

```
nice_nano_v2
nice_nano
seeeduino_xiao_ble
```

Flat names are simple identifiers with no `/` separators. The version suffix (e.g. `_v2`) is part of the name.

### ZMK main ("v0.4") — qualified name

```
<board>/<soc>/zmk
```

The three-part qualified format separates the board variant, the SoC, and the ZMK compatibility token. All three segments are required.

**Reading qualified names:**
- `<board>` — the board variant identifier (e.g. `nice_nano`, `seeeduino_xiao_ble`)
- `<soc>` — the SoC the board is built around (e.g. `nrf52840`, `nrf52833`)
- `zmk` — literal suffix, always present in ZMK board definitions

---

## Common boards

| Board | v0.3 flat name | ZMK main qualified name | SoC |
|-------|----------------|------------------------|-----|
| nice!nano v2 | `nice_nano_v2` | `nice_nano/nrf52840/zmk` | nRF52840 |
| nice!nano v1 | `nice_nano` | `nice_nano/nrf52833/zmk` | nRF52833 |
| Seeed XIAO BLE | `seeeduino_xiao_ble` | `seeeduino_xiao_ble/nrf52840/zmk` | nRF52840 |
| SparkFun Pro Micro nRF52840 | `sparkfun_pro_micro_nrf52840` | `sparkfun_pro_micro_nrf52840/nrf52840/zmk` | nRF52840 |
| Adafruit Feather nRF52840 | `adafruit_feather_nrf52840` | `adafruit_feather_nrf52840/nrf52840/zmk` | nRF52840 |

> This table lists commonly used boards as of 2026. The authoritative list is ZMK's `app/boards/arm/` directory in the ZMK repo. When in doubt, check there for the exact identifier.

---

## How to find a board's identifier

1. Browse `app/boards/arm/` in the ZMK repository for the board directory name
2. The flat name (v0.3) is the directory name itself
3. The qualified name (main) is `<dir_name>/<soc>/zmk` — the SoC is declared in the board's `<board>.yaml` file under `arch: arm` and `board_runner_args`
4. ZMK's own `build.yaml` examples in `app/` are a reliable reference for the correct format

---

## Special build targets

### `settings_reset`

Not a hardware board — a ZMK-provided shield that builds a minimal firmware to clear all persisted settings (BT bonds, ZMK Studio keymap overrides) from flash. Applied to the same board as your keyboard:

```yaml
- board: <board>/<soc>/zmk
  shield: settings_reset
  artifact-name: settings_reset
```

Flash this first whenever switching BT profiles, recovering from pairing issues, or resetting ZMK Studio overrides. Always include it as a build target.

### `usb_logging`

A snippet (not a shield) that enables USB CDC ACM logging output. Useful for debugging — attach a serial terminal to see ZMK log output over USB:

```yaml
- board: <board>/<soc>/zmk
  shield: my_keyboard_left
  snippet: usb-logging
  artifact-name: keyboard_left_debug
```

---

## Identifying version from board format

If you see a board value with `/` separators, it's ZMK main format. If it's a flat underscore-joined name, it's v0.3. This is one of the three version signals alongside `west.yml` revision and the CI workflow ref.
