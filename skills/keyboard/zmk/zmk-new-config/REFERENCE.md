# ZMK New Config — File Templates

## config/west.yml

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
      revision: v0.3          # or ZMK main SHA — never leave floating
      import: app/west.yml
    # add display module project here if needed
  self:
    path: config
```

**Adding a display module** (example: nice-view-gem on v0.3):
```yaml
remotes:
  - name: m165437
    url-base: https://github.com/M165437
projects:
  - name: nice-view-gem
    remote: m165437
    revision: 3f38221c61ec   # last LVGL v8 commit — required for ZMK v0.3
```

## build.yaml

### v0.3 — flat board identifier, split with nice!view

```yaml
include:
  - board: nice_nano_v2
    shield: corne_left nice_view_adapter nice_view_gem
    snippet: studio-rpc-usb-uart       # omit if no Studio
    cmake-args: -DCONFIG_ZMK_STUDIO=y -DCONFIG_ZMK_STUDIO_LOCKING=n
    artifact-name: corne_left
  - board: nice_nano_v2
    shield: corne_right nice_view_adapter nice_view_gem
    artifact-name: corne_right
  - board: nice_nano_v2
    shield: settings_reset
    artifact-name: settings_reset
```

### ZMK main — qualified board identifier

```yaml
include:
  - board: nice_nano_v2/nrf52840/zmk
    shield: corne_left nice_view_adapter nice_view_gem
    snippet: studio-rpc-usb-uart
    cmake-args: -DCONFIG_ZMK_STUDIO=y -DCONFIG_ZMK_STUDIO_LOCKING=n
    artifact-name: corne_left
  - board: nice_nano_v2/nrf52840/zmk
    shield: corne_right nice_view_adapter nice_view_gem
    artifact-name: corne_right
  - board: nice_nano_v2/nrf52840/zmk
    shield: settings_reset
    artifact-name: settings_reset
```

## config/.conf files

### Both sides (sensible defaults)

```conf
CONFIG_ZMK_SLEEP=y
CONFIG_ZMK_IDLE_SLEEP_TIMEOUT=1800000
CONFIG_ZMK_IDLE_TIMEOUT=300000
CONFIG_BT_CTLR_TX_PWR_PLUS_8=y
```

### Display side (add when display selected)

```conf
CONFIG_ZMK_DISPLAY=y
CONFIG_ZMK_DISPLAY_STATUS_SCREEN_CUSTOM=y   # if using a community module
CONFIG_ZMK_DISPLAY_WORK_QUEUE_DEDICATED=y
```

### nice-view-gem animation

```conf
CONFIG_NICE_VIEW_GEM_ANIMATION=y
```
