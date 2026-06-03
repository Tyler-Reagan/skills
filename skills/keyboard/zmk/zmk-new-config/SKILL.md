---
name: zmk-new-config
description: Scaffolds a new ZMK keyboard config repo by generating west.yml, build.yaml, and per-side .conf files from answers to six questions about hardware and features. Use when the user wants to start a new ZMK keyboard project, asks "how do I set up a ZMK config repo", "create my zmk config", or has a new keyboard and no existing config files.
license: MIT
metadata:
  author: uraniborglabs@gmail.com
  version: "1.0.0"
  domain: keyboard-firmware
  triggers: new zmk config, set up zmk, start zmk project, zmk config repo, new keyboard, scaffold zmk, create zmk config
  role: scaffolding
  scope: implementation
  output-format: code
  related-skills: zmk-config, zmk-keymap, zmk-display
---

# ZMK New Config Scaffolder

Generates the three foundational files for a new ZMK keyboard config repo: `config/west.yml`, `build.yaml`, and per-side `.conf` files. Always pairs with **zmk-config** for editing, **zmk-keymap** for keymap authoring, and **zmk-display** for display configuration.

## Domain Language

- **central** — The half (or dongle MCU) managing USB HID and BLE host connections. ZMK Studio goes on central only.
- **peripheral** — A keyboard half connecting to central over BLE. No USB HID role.
- **board** — The MCU module identifier. Format depends on ZMK version: flat (`nice_nano_v2`) for v0.3; qualified (`nice_nano_v2/nrf52840/zmk`) for ZMK main.
- **shield** — The keyboard PCB abstraction. Stacked with display adapters and modules in `build.yaml` order.

## Quiz — ask one question at a time

Gather answers to all six before generating any files. Each answer constrains the next.

**Q1. What board (MCU module)?**
Most common: `nice_nano_v2`. Others: `pro_micro`, `seeeduino_xiao_ble`, `nrfmicro_13`. For the full list see [`references/boards.md`](../zmk-config/references/boards.md).

**Q2. What keyboard shield?**
The shield name matches the PCB definition (e.g. `corne`, `kyria`, `totem`, `urchin`, `sweep`). For common shields see [`references/shields.md`](../zmk-config/references/shields.md). If the user is building a custom shield, use a placeholder and note it.

**Q3. ZMK version?**

- **v0.3** (recommended) — stable release, compatible with all community display modules
- **ZMK main** — latest features, LVGL v9, requires qualified board format

**Q4. Split topology?**

- `unibody` — single PCB, no wireless split
- `split` — two-piece split (left half = central by convention)
- `dongle` — three-piece split (dedicated USB dongle MCU = central; both keyboard halves are peripherals)

**Q5. Display?**

- `none`
- `nice_view` — nice!view with ZMK built-in screen
- `nice_view_gem` — nice!view with animated gem (requires v0.3; LVGL v8 only)
- `ssd1306` — SSD1306 OLED
- `custom` — other community module (user must supply module name)

**Q6. ZMK Studio?**
Yes or no. Adds `snippet: studio-rpc-usb-uart` and `cmake-args: -DCONFIG_ZMK_STUDIO=y -DCONFIG_ZMK_STUDIO_LOCKING=n` to the central build target only.

## Output files

Generate all files with inline comments. After generating, tell the user what to do next (see After Generating).

### config/west.yml

- Pin ZMK to `v0.3` for stability, or `main` if the user chose ZMK main
- **Prefer SHA pins with date annotations** — never leave ZMK or display modules on a floating branch name
- For nice-view-gem on v0.3: pin to SHA `3f38221c61ec` (last LVGL v8 commit, before Jan 25 2026 migration)
- Add `import: app/west.yml` on the ZMK project entry
- `self: path: config` marks the manifest directory

```yaml
manifest:
  defaults:
    revision: main
  remotes:
    - name: zmkfirmware
      url-base: https://github.com/zmkfirmware
    # add display module remote here if needed
  projects:
    - name: zmk
      remote: zmkfirmware
      revision: v0.3 # or main SHA for ZMK main
      import: app/west.yml
    # add display module project here if needed
  self:
    path: config
```

### build.yaml

- Flat board identifier for v0.3; qualified (`board/soc/zmk`) for ZMK main
- Shield order: keyboard shield → adapter shield → display module
- Always include a `settings_reset` target
- ZMK Studio snippet and cmake-args on central target only

```yaml
include:
  - board: <board>
    shield: <keyboard_shield>_left <adapter_shield> <display_shield>
    snippet: studio-rpc-usb-uart # if Studio selected
    cmake-args: -DCONFIG_ZMK_STUDIO=y -DCONFIG_ZMK_STUDIO_LOCKING=n # if Studio selected
    artifact-name: <keyboard_shield>_left
  - board: <board>
    shield: <keyboard_shield>_right <adapter_shield> <display_shield>
    artifact-name: <keyboard_shield>_right
  - board: <board>
    shield: settings_reset
    artifact-name: settings_reset
```

### config/.conf files

Sensible defaults for each topology. Generate separate `_left.conf` and `_right.conf` for splits; a shared `<shield>.conf` for unibody.

Both sides:

```conf
CONFIG_ZMK_SLEEP=y
CONFIG_ZMK_IDLE_SLEEP_TIMEOUT=1800000
CONFIG_ZMK_IDLE_TIMEOUT=300000
CONFIG_BT_CTLR_TX_PWR_PLUS_8=y
```

Display side (add when display selected):

```conf
CONFIG_ZMK_DISPLAY=y
CONFIG_ZMK_DISPLAY_STATUS_SCREEN_CUSTOM=y   # if using a module like nice_view_gem
CONFIG_ZMK_DISPLAY_WORK_QUEUE_DEDICATED=y
```

For nice-view-gem animation:

```conf
CONFIG_NICE_VIEW_GEM_ANIMATION=y
```

## After generating

Tell the user:

1. **Create a keymap** — use the **zmk-keymap** skill. Add `&studio_unlock` somewhere accessible if ZMK Studio was selected.
2. **Set up CI** — add `.github/workflows/build.yml` referencing `zmkfirmware/zmk/.github/workflows/build-user-config.yml@v0.3` (or `@main` for ZMK main).
3. **Flash** — push to GitHub, wait for CI, download artifacts, double-tap reset on each half, copy `.uf2` to the drive.
4. **Pair** — power on central first, then peripheral. Use the **zmk-debug** skill if pairing fails.

## Anti-Patterns

**DO NOT** generate any files before all six answers are collected — board format and display module SHAs depend on the ZMK version answer.

**DO NOT** use `revision: main` for nice-view-gem on v0.3 — it migrated to LVGL v9 in Jan 2026; always pin to `3f38221c61ec`.

**DO NOT** apply ZMK Studio snippet or cmake-args to peripheral or dongle keyboard halves — central only.

**DO NOT** leave any module on a floating branch name — pin everything to a SHA with a date annotation.
