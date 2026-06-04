# ZMK Keymap — Behavior Reference

## Key Press — `&kp`
```
&kp KEYCODE
```
Modifier wrapping: `LA(X)` = Left Alt+X, `LC(LS(N4))` = Ctrl+Shift+4.
Prefixes: `L`/`R` + `A` (Alt), `C` (Ctrl), `G` (GUI), `S` (Shift).

Common aliases: `N0`–`N9`, `F1`–`F24`, `LEFT`/`RIGHT`/`UP`/`DOWN`, `BSPC`, `DEL`, `RET`, `TAB`, `ESC`, `SPACE`, `SQT`, `SEMI`, `COMMA`, `DOT`, `FSLH`, `BSLH`, `GRAVE`, `LBKT`, `RBKT`, `MINUS`, `EQUAL`, `C_VOL_UP`, `C_VOL_DN`, `C_MUTE`, `C_PP`, `C_NEXT`, `C_PREV`.

Full keycode table: [`references/keycodes.md`](references/keycodes.md).

---

## Mod-Tap — `&mt`
```
&mt MODIFIER KEYCODE
```
Hold → modifier, tap → keycode. Default flavor: `hold-preferred`.

## Layer-Tap — `&lt`
```
&lt LAYER KEYCODE
```
Hold → momentary layer, tap → keycode. Default flavor: `tap-preferred`.

## Hold-Tap (custom) — `zmk,behavior-hold-tap`
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

**Flavors:**
| Flavor | Hold triggers when... |
|---|---|
| `hold-preferred` | Timeout OR another key pressed |
| `tap-preferred` | Timeout only |
| `balanced` | Another key pressed AND released while held |
| `tap-unless-interrupted` | Only if another key pressed before timeout |

**Override built-in presets:**
```c
&mt { flavor = "tap-preferred"; tapping-term-ms = <200>; };
&lt { flavor = "tap-preferred"; tapping-term-ms = <200>; };
```

---

## Layer Behaviors

| Behavior | Action |
|---|---|
| `&mo LAYER` | Momentary — active while held |
| `&to LAYER` | Enables layer, disables all others except layer 0 |
| `&tog LAYER` | Toggle layer on/off |
| `&sl LAYER` | Sticky layer — active until next non-transparent key |
| `&sk MODIFIER` | Sticky key — modifier active until next keypress |
| `&kt KEYCODE` | Key toggle — press/hold state toggled |
| `&trans` | Pass through to next active lower layer |
| `&none` | Swallow event; no output |

`&sk` custom properties: `release-after-ms`, `quick-release`, `lazy`, `ignore-modifiers`.

---

## Utility Behaviors

- `&gresc` — ESC normally; `` ` `` when Shift or GUI held
- `&caps_word` — Smart caps; auto-deactivates on non-continue-list key. Custom: `continue-list`, `mods`.
- `&key_repeat` — Re-sends the last HID keycode

---

## Macros — `zmk,behavior-macro`
```c
my_macro: my_macro {
  compatible = "zmk,behavior-macro";
  #binding-cells = <0>;
  wait-ms = <40>;
  tap-ms = <40>;
  bindings = <&macro_tap &kp Z &kp M &kp K>;
};
```
Macro control: `&macro_tap`, `&macro_press`, `&macro_release`, `&macro_pause_for_release`, `&macro_wait_time N`, `&macro_tap_time N`.

Parameterized variants: `zmk,behavior-macro-one-param` / `two-param` with `#binding-cells = <1>`/`<2>`. Use `&macro_param_1to1` etc. to forward params. Max 256 bindings; queue depth configurable via `CONFIG_ZMK_BEHAVIORS_QUEUE_SIZE`.

Convenience:
```c
ZMK_MACRO(name, wait-ms = <30>; tap-ms = <40>; bindings = <&kp Z &kp M &kp K>;)
```

---

## Tap-Dance — `zmk,behavior-tap-dance`
```c
td0: tap_dance_0 {
  compatible = "zmk,behavior-tap-dance";
  #binding-cells = <0>;
  tapping-term-ms = <200>;
  bindings = <&kp A>, <&kp B>, <&kp C>;
};
```
First binding = single tap, second = double tap, etc. Interrupted by another keypress → resolves at current tap count.

---

## Mod-Morph — `zmk,behavior-mod-morph`
```c
bspc_del: backspace_delete {
  compatible = "zmk,behavior-mod-morph";
  #binding-cells = <0>;
  bindings = <&kp BSPC>, <&kp DEL>;
  mods = <(MOD_LSFT|MOD_RSFT)>;
  keep-mods = <(MOD_RSFT)>;
};
```
Modifier masks: `MOD_LSFT`, `MOD_RSFT`, `MOD_LCTL`, `MOD_RCTL`, `MOD_LALT`, `MOD_RALT`, `MOD_LGUI`, `MOD_RGUI`.

---

## Combos
```c
combos {
  compatible = "zmk,combos";
  combo_esc {
    timeout-ms = <50>;
    key-positions = <0 1>;
    bindings = <&kp ESC>;
    layers = <0 1>;              // optional
    require-prior-idle-ms = <125>; // optional
    slow-release;                // optional
  };
};
```
- `key-positions` — 0-indexed matching board's key numbering
- On split keyboards, combo bindings execute on the central side

---

## Bluetooth — `&bt`
Requires `#include <dt-bindings/zmk/bt.h>`

| Binding | Action |
|---|---|
| `&bt BT_CLR` | Clear bond for current profile |
| `&bt BT_CLR_ALL` | Clear all bonds |
| `&bt BT_NXT` / `BT_PRV` | Next/previous profile |
| `&bt BT_SEL N` | Select profile N (0-indexed) |
| `&bt BT_DISC N` | Disconnect inactive profile N |

---

## Output Selection — `&out`
Requires `#include <dt-bindings/zmk/outputs.h>`

`&out OUT_USB` / `&out OUT_BLE` / `&out OUT_TOG`

---

## Reset Behaviors
```
&sys_reset    // soft reset — re-runs current firmware
&bootloader   // enter bootloader for flashing
```
On split keyboards, each binding only resets the half it's on.

---

## Soft Off — `&soft_off`
```c
&soft_off { hold-time-ms = <5000>; };
```

---

## Mouse Emulation (requires `CONFIG_ZMK_POINTING=y`)
Requires `#include <dt-bindings/zmk/pointing.h>`
```
&mkp MB1/MB2/MB3/MB4/MB5
&mmv MOVE_UP/MOVE_DOWN/MOVE_LEFT/MOVE_RIGHT
&msc SCRL_UP/SCRL_DOWN/SCRL_LEFT/SCRL_RIGHT
```

---

## Sensor Rotation (Encoders)
```c
vol_enc: volume_encoder {
  compatible = "zmk,behavior-sensor-rotate";
  #sensor-binding-cells = <0>;
  bindings = <&kp C_VOL_UP>, <&kp C_VOL_DN>;
};
// Variable binding:
rot_kp: sensor_rotate_kp {
  compatible = "zmk,behavior-sensor-rotate-var";
  #sensor-binding-cells = <2>;
  bindings = <&kp>, <&kp>;
};
// In layer: sensor-bindings = <&rot_kp PG_UP PG_DN>;
```

---

## ZMK Studio Unlock — `&studio_unlock`
Enables live keymap editing via ZMK Studio. Must be reachable — once Studio takes control, this is the only way back without flashing `settings_reset.uf2`. Place on a boot/system layer.
