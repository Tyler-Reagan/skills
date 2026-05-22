---
name: zmk-keymap
description: Use when authoring, editing, or reviewing ZMK keymap files (.keymap). Covers the full ZMK behavior library (v0.3 and ZMK main / "v0.4"), hold-tap flavors, combos, layer structure, devicetree syntax, and all required headers. Invoke for any task involving ZMK keymap bindings, behaviors, layers, combos, macros, tap-dance, mod-morph, or sensor bindings.
license: MIT
metadata:
  author: tylerreagan98@gmail.com
  version: "1.0.0"
  domain: keyboard-firmware
  triggers: zmk, keymap, .keymap, behaviors, kp, mt, lt, mo, combos, hold-tap, tap-dance, mod-morph, layers, bindings, ZMK keymap
  role: specialist
  scope: implementation
  output-format: code
  related-skills: pretty-zmk-keymap, zmk-west, zmk-build, zmk-display
---

# ZMK Keymap Engineer

**Scope: ZMK v0.3 and ZMK main (Zephyr 4.1).** This skill covers both release lines. Keymap behavior syntax is stable across both — the only point of divergence is the mouse/pointing header. That callout appears at the point of divergence in the File Structure section.

**Version alias recognition.** ZMK main, Zephyr 4.1, and the community term "v0.4" all refer to the same stack. When any of these appear in user messages or module documentation, treat them as synonymous.

Expert in ZMK firmware keymap authoring. v0.3 syntax validated against https://v0-3-branch.zmk.dev/docs/keymaps; ZMK main behavior API is stable relative to v0.3.

## File Structure

Every `.keymap` file requires:

```c
#include <behaviors.dtsi>
#include <dt-bindings/zmk/keys.h>
```

Additional headers per feature used:
- `#include <dt-bindings/zmk/bt.h>` — Bluetooth behaviors
- `#include <dt-bindings/zmk/outputs.h>` — Output selection
- `#include <dt-bindings/zmk/pointing.h>` — Mouse/pointing emulation (current API, both v0.3 and ZMK main; requires `CONFIG_ZMK_POINTING=y`)
- ~~`#include <dt-bindings/zmk/mouse.h>`~~ — **Legacy, do not use.** Superseded by `pointing.h` in v0.3; may not exist on ZMK main. Remove if present with no corresponding `&mkp`/`&mmv`/`&msc` bindings.

**Header hygiene:** every `#include` must be justified by at least one binding in the file. When reviewing a keymap, audit includes and remove any with no corresponding bindings — they are unused dead weight and will cause confusion or compile errors on ZMK main.

The full keymap nests inside the devicetree root node:

```c
/ {
  combos { ... };   // optional
  behaviors { ... }; // optional, for custom behavior instances
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

- Layers are numbered sequentially from 0; layer 0 is the default active layer.
- Higher-numbered active layers take priority over lower ones.
- Every layer must have exactly as many bindings as the board has key positions.
- Use `&trans` to pass through to a lower active layer; use `&none` to swallow with no output.
- `display-name` is optional but recommended — shown in ZMK Studio and on displays.

## Behavior Reference

### Key Press — `&kp`
```
&kp KEYCODE
```
Sends a HID keycode on press/release. Keycodes from `dt-bindings/zmk/keys.h`.

**Modifier wrapping:** `LA(X)` = Left Alt+X, `LC(LS(N4))` = Ctrl+Shift+4.
Modifier prefixes: `L`/`R` + `A` (Alt), `C` (Ctrl), `G` (GUI), `S` (Shift).

Common aliases: `N0`–`N9` (number row), `F1`–`F24`, `LEFT`/`RIGHT`/`UP`/`DOWN`, `BSPC`, `DEL`, `RET`, `TAB`, `ESC`, `SPACE`, `SQT`, `SEMI`, `COMMA`, `DOT`, `FSLH`, `BSLH`, `GRAVE`, `LBKT`, `RBKT`, `MINUS`, `EQUAL`, `C_VOL_UP`, `C_VOL_DN`, `C_MUTE`, `C_PP`, `C_NEXT`, `C_PREV`.

---

### Mod-Tap — `&mt` (hold-tap preset)
```
&mt MODIFIER KEYCODE
```
Hold → modifier, tap → keycode. Default flavor: `hold-preferred`.

---

### Layer-Tap — `&lt` (hold-tap preset)
```
&lt LAYER KEYCODE
```
Hold → momentary layer, tap → keycode. Default flavor: `tap-preferred`.

---

### Hold-Tap (custom) — `zmk,behavior-hold-tap`

Define in `/ { behaviors { ... }; };`:

```c
custom_ht: custom_hold_tap {
  compatible = "zmk,behavior-hold-tap";
  #binding-cells = <2>;
  flavor = "balanced";
  tapping-term-ms = <200>;
  quick-tap-ms = <175>;
  require-prior-idle-ms = <150>;
  hold-trigger-key-positions = <5 6 7 8 9>;
  hold-trigger-on-release;
  retro-tap;
  bindings = <&kp>, <&kp>;
};
```

**Flavor options:**
| Flavor | Hold triggers when... |
|--------|----------------------|
| `hold-preferred` | Timeout OR another key pressed |
| `tap-preferred` | Timeout only |
| `balanced` | Another key pressed AND released while held |
| `tap-unless-interrupted` | Only if another key pressed before timeout |

**Properties:**
- `tapping-term-ms` — ms to distinguish tap from hold (default 200)
- `quick-tap-ms` — within this ms of a prior tap, always taps (0 = disabled)
- `require-prior-idle-ms` — after any non-modifier key, forces tap if pressed within this window
- `hold-trigger-key-positions` — array of positions; pressing any key NOT in list forces tap
- `hold-trigger-on-release` — delays positional evaluation until key release
- `retro-tap` — if released with no other key pressed, sends tap behavior
- `hold-while-undecided` — sends hold immediately, corrects to tap if needed

**Override built-in presets** in the root before the keymap:
```c
&mt {
  flavor = "tap-preferred";
  tapping-term-ms = <200>;
  display-name = "Mod-Tap";
};
&lt {
  flavor = "tap-preferred";
  tapping-term-ms = <200>;
  display-name = "Layer-Tap";
};
```

---

### Momentary Layer — `&mo`
```
&mo LAYER
```
Activates layer while held; deactivates on release.

---

### Layer-Tap — `&lt`
```
&lt LAYER KEYCODE
```
Hold → momentary layer, tap → keycode. (Hold-tap preset — see hold-tap for config.)

---

### To Layer — `&to`
```
&to LAYER
```
Enables the specified layer and disables all others except the default (layer 0).

---

### Toggle Layer — `&tog`
```
&tog LAYER
```
Enables a layer if currently disabled, or disables it if enabled. Persists until toggled again.

---

### Sticky Layer — `&sl`
```
&sl LAYER
```
Activates a layer until the next non-transparent key press.

---

### Sticky Key — `&sk`
```
&sk MODIFIER
```
Modifier stays active until next key press. Useful for one-shot modifiers.

Custom instance properties:
- `release-after-ms` — how long to stay active with no keypress (default ~1000ms)
- `quick-release` — deactivates on next key press rather than release
- `lazy` — activates just before next key press (avoids spurious GUI menu triggers)
- `ignore-modifiers` — allows chaining multiple sticky keys (enabled by default)

---

### Key Toggle — `&kt`
```
&kt KEYCODE
```
Toggles the pressed state of a key. Stays held until toggled off. Modifier wrapping is evaluated on the base keycode only.

---

### Transparent — `&trans`
Passes the key event to the next active lower layer. Use as a placeholder for unassigned positions on non-base layers.

---

### None — `&none`
Swallows the key event entirely. No output, no passthrough.

---

### Grave Escape — `&gresc`
No parameters. Sends `ESC` normally; sends `` ` `` when Shift or GUI is held.

---

### Caps Word — `&caps_word`
No parameters. Activates smart caps that auto-deactivates when non-continue-list key is pressed.

Custom instance properties:
- `continue-list` — keycodes that keep caps word active (default: alphanumeric, `UNDERSCORE`, `BSPC`, `DEL`)
- `mods` — modifiers applied to alpha keys (default: `MOD_LSFT`)

---

### Key Repeat — `&key_repeat`
No parameters. Re-sends the last HID keycode.

---

### Macros — `zmk,behavior-macro`

```c
/ {
  behaviors {
    my_macro: my_macro {
      compatible = "zmk,behavior-macro";
      #binding-cells = <0>;
      wait-ms = <40>;
      tap-ms = <40>;
      bindings = <&macro_tap &kp Z &kp M &kp K>;
    };
  };
};
```

Macro control behaviors:
- `&macro_tap` — press+release each behavior (default)
- `&macro_press` — press only
- `&macro_release` — release only
- `&macro_pause_for_release` — pause until the macro key is released
- `&macro_wait_time N` — set inter-behavior delay to N ms
- `&macro_tap_time N` — set tap hold duration to N ms

Parameterized variants:
- `zmk,behavior-macro-one-param` with `#binding-cells = <1>`
- `zmk,behavior-macro-two-param` with `#binding-cells = <2>`

Use `&macro_param_1to1`, `&macro_param_1to2`, `&macro_param_2to1`, `&macro_param_2to2` to forward parameters to bindings. Use `MACRO_PLACEHOLDER` (= `0`) as the placeholder value.

Convenience helper (zero-param only):
```c
ZMK_MACRO(macro_name,
  wait-ms = <30>;
  tap-ms = <40>;
  bindings = <&kp Z &kp M &kp K>;
)
```

Limits: 256 bindings max per macro; behavior queue default 64 (configurable via `CONFIG_ZMK_BEHAVIORS_QUEUE_SIZE`).

---

### Tap-Dance — `zmk,behavior-tap-dance`

```c
/ {
  behaviors {
    td0: tap_dance_0 {
      compatible = "zmk,behavior-tap-dance";
      #binding-cells = <0>;
      tapping-term-ms = <200>;
      bindings = <&kp A>, <&kp B>, <&kp C>;
    };
  };
};
```

- First binding = single tap, second = double tap, etc.
- Once the array length is reached, the final binding fires immediately.
- Interrupted by another keypress → resolves at current tap count.
- Letter/number bindings release on interruption; modifiers stay held until tap-dance key releases.

---

### Mod-Morph — `zmk,behavior-mod-morph`

```c
/ {
  behaviors {
    bspc_del: backspace_delete {
      compatible = "zmk,behavior-mod-morph";
      #binding-cells = <0>;
      bindings = <&kp BSPC>, <&kp DEL>;
      mods = <(MOD_LSFT|MOD_RSFT)>;
      keep-mods = <(MOD_RSFT)>;
    };
  };
};
```

- `bindings` — two behaviors: [without mod, with mod]
- `mods` — modifier mask that triggers the morph
- `keep-mods` — which mods from the mask to pass through with the morphed behavior (default: none)

Modifier masks: `MOD_LSFT`, `MOD_RSFT`, `MOD_LCTL`, `MOD_RCTL`, `MOD_LALT`, `MOD_RALT`, `MOD_LGUI`, `MOD_RGUI`. Combine with `|`.

---

### Combos

```c
/ {
  combos {
    compatible = "zmk,combos";
    combo_esc {
      timeout-ms = <50>;
      key-positions = <0 1>;
      bindings = <&kp ESC>;
      layers = <0 1>;             // optional: restrict to specific layers
      require-prior-idle-ms = <125>; // optional
      slow-release;               // optional: release when all keys release
    };
  };
};
```

- `key-positions` — 0-indexed positions matching the board's key numbering
- `timeout-ms` — all combo keys must be pressed within this window
- `layers` — if omitted, combo is active on all layers
- `slow-release` — combo releases when all keys release (default: any key release)
- `require-prior-idle-ms` — won't trigger if a non-modifier key was pressed within this window
- Partially and fully overlapping combos are supported
- On split keyboards, combo bindings execute on the central side

---

### Bluetooth — `&bt`
Requires `#include <dt-bindings/zmk/bt.h>`

| Binding | Action |
|---------|--------|
| `&bt BT_CLR` | Clear bond for current profile |
| `&bt BT_CLR_ALL` | Clear bonds for all profiles |
| `&bt BT_NXT` | Next profile (wraps) |
| `&bt BT_PRV` | Previous profile (wraps) |
| `&bt BT_SEL N` | Select profile N (0-indexed) |
| `&bt BT_DISC N` | Disconnect profile N if inactive |

Default: 5 profiles. Adjust with `CONFIG_BT_MAX_CONN` and `CONFIG_BT_MAX_PAIRED`.

---

### Output Selection — `&out`
Requires `#include <dt-bindings/zmk/outputs.h>`

| Binding | Action |
|---------|--------|
| `&out OUT_USB` | Prefer USB |
| `&out OUT_BLE` | Prefer BLE |
| `&out OUT_TOG` | Toggle USB/BLE |

Selection persists to flash (debounced to minimize write cycles).

---

### Reset Behaviors
```
&sys_reset    // soft reset — re-runs current firmware
&bootloader   // enter bootloader mode for flashing
```
No parameters. On split keyboards, each binding only resets the half it's on. Combo resets always execute on the central side.

---

### Soft Off — `&soft_off`
```
&soft_off
```
Optional configuration:
```c
&soft_off {
  hold-time-ms = <5000>; // require 5s hold before power off
};
```
Peripheral half ignores `hold-time-ms` by default; remove `split-peripheral-off-on-press` property to apply hold to both halves.

---

### Mouse Emulation (v0.3 / `CONFIG_ZMK_POINTING=y`)
Requires `#include <dt-bindings/zmk/pointing.h>`

```
&mkp MB1           // left click (also LCLK)
&mkp MB2           // right click (also RCLK)
&mkp MB3           // middle click (also MCLK)
&mkp MB4 / MB5     // back / forward
&mmv MOVE_UP / MOVE_DOWN / MOVE_LEFT / MOVE_RIGHT
&msc SCRL_UP / SCRL_DOWN / SCRL_LEFT / SCRL_RIGHT
```

---

### Sensor Rotation (Encoders)

Standard (fixed bindings):
```c
behaviors {
  vol_enc: volume_encoder {
    compatible = "zmk,behavior-sensor-rotate";
    #sensor-binding-cells = <0>;
    bindings = <&kp C_VOL_UP>, <&kp C_VOL_DN>;
  };
};
// In layer:
sensor-bindings = <&vol_enc>;
```

Variable (parameters at bind time):
```c
behaviors {
  rot_kp: sensor_rotate_kp {
    compatible = "zmk,behavior-sensor-rotate-var";
    #sensor-binding-cells = <2>;
    bindings = <&kp>, <&kp>;
  };
};
// In layer:
sensor-bindings = <&rot_kp PG_UP PG_DN>;
```

---

### ZMK Studio Unlock — `&studio_unlock`
No parameters. Enables live keymap editing via ZMK Studio when `CONFIG_ZMK_STUDIO=y`.

**This binding must be reachable in your keymap.** Once ZMK Studio takes control of the keymap, the `.keymap` file is ignored — the only way to re-enable file-based editing is either flashing `settings_reset.uf2` (which wipes all BT bonds and persisted state) or pressing `&studio_unlock`. Place it somewhere accessible — a boot/system layer is the natural home. Omitting it means losing ZMK Studio access requires a full settings reset.

---

## Constraints

- Hold-tap bindings cannot use behaviors that take multiple parameters (e.g. `&bt BT_SEL`). Wrap them in a zero-param macro first.
- `require-prior-idle-ms` checks non-modifier keys only — modifiers do not reset the idle timer.
- `hold-trigger-key-positions` uses 0-based key positions from the full board layout.
- Combos referencing behaviors that are source-specific (reset, bootloader) always execute on central.
- `&trans` on the default layer (layer 0) has no effect — there is no lower layer to pass through to.
