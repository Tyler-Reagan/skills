---
name: zmk-new-config
description: Scaffolds a new ZMK keyboard config repo by generating west.yml, build.yaml, and per-side .conf files from answers to six questions about hardware and features. Use when the user wants to start a new ZMK keyboard project, asks "how do I set up a ZMK config repo", "create my zmk config", or has a new keyboard and no existing config files.
license: MIT
metadata:
  author: uraniborglabs@gmail.com
  version: "1.1.0"
  domain: keyboard-firmware
  triggers: new zmk config, set up zmk, start zmk project, zmk config repo, new keyboard, scaffold zmk, create zmk config
  role: scaffolding
  scope: implementation
  output-format: code
  related-skills: zmk-config, zmk-keymap, zmk-display
---

# ZMK New Config Scaffolder

Generates `config/west.yml`, `build.yaml`, and per-side `.conf` files. Always pairs with **zmk-config** (editing), **zmk-keymap** (keymap authoring), and **zmk-display** (display config).

## Domain Language

- **central** — The half (or dongle MCU) managing USB HID and BLE host connections. ZMK Studio goes on central only.
- **peripheral** — A keyboard half connecting to central over BLE. No USB HID role.
- **board** — MCU module identifier. Format is version-dependent: flat (`nice_nano_v2`) for v0.3; qualified (`nice_nano_v2/nrf52840/zmk`) for ZMK main.
- **shield** — The keyboard PCB abstraction. Stacked with adapters and display modules in `build.yaml` order.

## Quiz — ask one at a time, collect all before generating

**Q1. Board?** Most common: `nice_nano_v2`. See [`references/boards.md`](../zmk-config/references/boards.md).

**Q2. Shield?** PCB definition name (e.g. `corne`, `kyria`, `totem`, `sweep`). See [`references/shields.md`](../zmk-config/references/shields.md). Use a placeholder for custom shields.

**Q3. ZMK version?**
- `v0.3` (recommended) — stable, compatible with all community display modules
- `ZMK main` — latest features, LVGL v9, requires qualified board format

**Q4. Split topology?** `unibody` / `split` (left = central) / `dongle` (dedicated USB dongle = central)

**Q5. Display?** `none` / `nice_view` / `nice_view_gem` / `ssd1306` / `custom`

**Q6. ZMK Studio?** Yes adds `snippet: studio-rpc-usb-uart` and cmake-args on the **central** target only.

## Generate the files

See [REFERENCE.md](REFERENCE.md) for the full file templates (west.yml, build.yaml, .conf). Apply these rules when filling them in:

- Pin ZMK to `v0.3` tag or a ZMK main SHA with a date annotation — never leave on a floating branch
- For nice-view-gem on v0.3: pin to SHA `3f38221c61ec` (last LVGL v8 commit, before Jan 25 2026 migration)
- Board identifier format depends on Q3: flat for v0.3, qualified for ZMK main
- ZMK Studio snippet and cmake-args go on the **central** target only — not peripheral, not dongle keyboard halves
- Always include a `settings_reset` build target

## Gotchas

**nice-view-gem on v0.3 requires a specific SHA.** `revision: main` pulls LVGL v9 as of Jan 25 2026 and causes compile errors. Always pin to `3f38221c61ec` when using ZMK v0.3.

**Board format must match the ZMK version.** Flat name with ZMK main → "board not found". Qualified format with v0.3 → "Invalid BOARD". Decide Q3 first — everything else depends on it.

**ZMK Studio on peripheral does nothing and wastes flash.** The snippet and cmake-args only function on the central. In a dongle setup, central is the dongle — not the left keyboard half.

**Floating module revisions break silently.** `revision: main` on any module means the next upstream push can silently break your build. Pin everything to a SHA with a date annotation; see zmk-config for the pattern.

## After generating

1. **Create a keymap** via **zmk-keymap**. Add `&studio_unlock` somewhere accessible if Studio was selected.
2. **Set up CI** — add `.github/workflows/build.yml` using `zmkfirmware/zmk/.github/workflows/build-user-config.yml@v0.3` (or `@<sha>` for ZMK main).
3. **Flash** — push to GitHub, wait for CI, download artifacts, double-tap reset on each half, copy `.uf2` to the drive.
4. **Pair** — power on central first, then peripheral. Use **zmk-debug** if pairing fails.

## Anti-Patterns

**DO NOT** generate files before all six answers are collected — board format and display SHA depend on Q3.

**DO NOT** use `revision: main` for nice-view-gem on v0.3 — pin to `3f38221c61ec`.

**DO NOT** apply ZMK Studio snippet or cmake-args to peripheral halves — central only.

**DO NOT** leave any module on a floating branch name — pin to SHA with a date annotation.
