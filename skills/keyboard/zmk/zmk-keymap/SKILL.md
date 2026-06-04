---
name: zmk-keymap
description: ZMK keymap specialist covering the full behavior library across v0.3 and ZMK main. Use when the user is editing a .keymap file, asks about hold-tap flavors, tap-dance, mod-morph, combos, or macros, references &mt, &lt, &mo, &sk, &caps_word, or sensor bindings, or wants to know which header to include for mouse or Bluetooth behaviors.
license: MIT
metadata:
  author: uraniborglabs@gmail.com
  version: "1.1.0"
  domain: keyboard-firmware
  triggers: zmk, keymap, .keymap, behaviors, kp, mt, lt, mo, combos, hold-tap, tap-dance, mod-morph, layers, bindings, ZMK keymap
  role: specialist
  scope: implementation
  output-format: code
  related-skills: pretty-zmk-keymap, zmk-config, zmk-display
---

# ZMK Keymap Engineer

**Scope: ZMK v0.3 and ZMK main.** Behavior syntax is stable across both. The only divergence is the mouse/pointing header — callout appears in the File Structure section.

## Domain Language

- **central** — The half (or dongle MCU) managing USB HID and BLE connections. ZMK Studio runs on central only.
- **peripheral** — A keyboard half connecting to central over BLE. No USB HID role.
- **board** — MCU module identifier. Flat (`nice_nano_v2`) for v0.3; qualified (`nice_nano_v2/nrf52840/zmk`) for ZMK main.
- **shield** — Hardware add-on abstraction (PCB, display, adapter).
- **v0.3** — Stable release (Zephyr 3.5, LVGL v8).
- **ZMK main** — Development branch (Zephyr 4.1, LVGL v9). Community alias: "v0.4".

## File Structure

Required headers:
```c
#include <behaviors.dtsi>
#include <dt-bindings/zmk/keys.h>
```

Additional headers per feature:
- `#include <dt-bindings/zmk/bt.h>` — Bluetooth
- `#include <dt-bindings/zmk/outputs.h>` — Output selection
- `#include <dt-bindings/zmk/pointing.h>` — Mouse emulation (current API; requires `CONFIG_ZMK_POINTING=y`)
- ~~`#include <dt-bindings/zmk/mouse.h>`~~ — **Legacy, do not use.** May not exist on ZMK main.

**Header hygiene:** every `#include` must be justified by at least one binding in the file. Remove unused includes — they add confusion and may cause errors on ZMK main.

The full keymap nests inside the devicetree root:
```c
/ {
  combos { ... };      // optional
  behaviors { ... };  // optional, for custom instances
  keymap {
    compatible = "zmk,keymap";
    layer_name {
      display-name = "Label";
      bindings = < ... >;
      sensor-bindings = < ... >; // optional, for encoders
    };
  };
};
```

## Layer Rules

- Layers numbered from 0; layer 0 is the default.
- Higher active layers take priority over lower ones.
- Every layer must have exactly as many bindings as the board has key positions.
- `&trans` — passes through to the next active lower layer.
- `&none` — swallows the event; no output, no passthrough.
- `display-name` is optional but shown in ZMK Studio and on displays.

## Gotchas

**`&trans` on layer 0 has no effect.** There is no lower layer to pass through to. If you want a dead key on layer 0, use `&none` — `&trans` there is a no-op.

**`mouse.h` is dead — use `pointing.h`.** The legacy `<dt-bindings/zmk/mouse.h>` header may not exist on ZMK main. The current API is `pointing.h` with `CONFIG_ZMK_POINTING=y`. Remove any `#include <dt-bindings/zmk/mouse.h>` that lacks corresponding `&mkp`/`&mmv`/`&msc` bindings.

**Combos always execute on the central.** Combo bindings that reference central-specific behaviors (reset, bootloader) work fine, but they always fire on the central side regardless of which half the combo keys are on.

**Hold-tap bindings can't use multi-parameter behaviors directly.** You can't put `&bt BT_SEL 0` inside a hold-tap. Wrap it in a zero-param macro first.

**`&studio_unlock` must be reachable.** Once ZMK Studio takes control of the keymap, the `.keymap` file is ignored. The only way to re-enable file-based editing without losing BT bonds is pressing `&studio_unlock`. Place it on a boot/system layer. Omitting it means re-enabling file control requires flashing `settings_reset.uf2`.

## Constraints

- `require-prior-idle-ms` checks non-modifier keys only — modifiers don't reset the idle timer
- `hold-trigger-key-positions` uses 0-based key positions from the full board layout
- `&trans` on the default layer (layer 0) has no effect
- Hold-tap bindings cannot use behaviors that take multiple parameters — wrap in a zero-param macro

For the full behavior reference (kp, mt, lt, hold-tap, mo, tap-dance, mod-morph, combos, BT, output, macros, mouse, sensors, studio_unlock), see [REFERENCE.md](REFERENCE.md). For keycodes, see [`references/keycodes.md`](references/keycodes.md).
