# ZMK Display Hardware Reference

Covers the display types supported in ZMK, their driver characteristics, and the Kconfig/devicetree implications for each. Use alongside `shields.md` (for shield naming) and the main SKILL.md (for Kconfig options and LVGL API guidance).

---

## Sharp Memory LCD (e.g. nice!view)

**Controller:** LS013B7DH05 (or similar Sharp Memory LCD variants)  
**Interface:** SPI  
**Resolution:** 168×144 (nice!view)  
**Color depth:** 1-bit (black and white)

### Characteristics

- Very low power — no backlight, display retains image without constant refresh
- Fast enough for animated widgets
- The dominant display choice in wireless ZMK keyboards
- Requires a display adapter shield to route SPI pins (if the keyboard shield doesn't wire the display directly)
- Works with the built-in ZMK nice!view screen and community modules (nice-view-gem, etc.)

### Kconfig

```conf
CONFIG_ZMK_DISPLAY=y
CONFIG_ZMK_DISPLAY_STATUS_SCREEN_CUSTOM=y        # if using a community module
CONFIG_ZMK_DISPLAY_WORK_QUEUE_DEDICATED=y        # recommended — display updates don't block key scan
CONFIG_ZMK_DISPLAY_BLANK_ON_IDLE=n               # Sharp LCD retains image; blanking not as critical
```

### Shield stacking (in build.yaml)

```yaml
shield: <keyboard_shield> <display_adapter> <display_module>
```

The adapter shield routes SPI signals to the display header. Not all keyboards need a separate adapter — some wire the display directly in the keyboard shield. Check the keyboard's ZMK module to determine whether an adapter shield is provided.

---

## SSD1306 OLED

**Interface:** I2C (most common) or SPI  
**Resolution:** 128×32 or 128×64  
**Color depth:** 1-bit

### Characteristics

- Higher power draw than Sharp Memory — consumes power continuously
- Common in wired builds or QMK-derived keyboards ported to ZMK
- `CONFIG_ZMK_DISPLAY_BLANK_ON_IDLE=y` is the default and strongly recommended to save power
- ZMK includes a native SSD1306 driver; typically no community module required for the built-in screen

### Kconfig

```conf
CONFIG_ZMK_DISPLAY=y
CONFIG_ZMK_DISPLAY_STATUS_SCREEN_BUILT_IN=y      # or custom if you have a module
CONFIG_ZMK_DISPLAY_BLANK_ON_IDLE=y               # default y for SSD1306 — keep it
CONFIG_ZMK_SLEEP=y                               # pair with sleep to fully cut power on idle
```

---

## IL0323 / ePaper

**Interface:** SPI  
**Color depth:** 1-bit (typically black and white, some variants support grey)

### Characteristics

- Extremely low power — consumes near zero power while displaying a static image
- Retains image with no power required
- Refresh is slow (full refresh: several seconds; partial: faster but leaves ghosting)
- Not suitable for frequently-updating widgets (battery %, WPM) — best for static or rarely-changed content
- ZMK includes a native driver

### Kconfig

```conf
CONFIG_ZMK_DISPLAY=y
CONFIG_ZMK_DISPLAY_WORK_QUEUE_DEDICATED=y        # essential — ePaper refresh blocks for seconds
CONFIG_ZMK_DISPLAY_TICK_PERIOD_MS=1000           # no point refreshing faster than the display can update
```

---

## Dongle / External Screen (ST7789V and similar)

A dongle screen is a display driven by a dedicated USB MCU that acts as the BLE central. The display hardware varies by dongle design; a common choice is the ST7789V (used in some XIAO-based dongle designs), but any SPI display with a ZMK-compatible driver can be used.

### ST7789V

**Interface:** SPI  
**Resolution:** varies (common: 240×135, 240×240, 320×240)  
**Color depth:** 16-bit RGB565

#### Characteristics

- Full color, higher resolution than Sharp or OLED
- Higher power — needs power management if battery-powered; fine on USB dongles
- The zmk-dongle-screen module (and similar) provides widget source targeting this driver
- LVGL canvas buffer must use `LV_COLOR_FORMAT_RGB565` (ZMK main / LVGL v9) — match to your ZMK version

#### Kconfig for dongle builds

```conf
CONFIG_ZMK_DISPLAY=y
CONFIG_ZMK_DISPLAY_STATUS_SCREEN_CUSTOM=y
CONFIG_ZMK_DISPLAY_WORK_QUEUE_DEDICATED=y
CONFIG_ZMK_SPLIT_ROLE_CENTRAL=y               # dongle IS the central
CONFIG_ZMK_DONGLE_DISPLAY_DONGLE_BATTERY=y    # if dongle shows its own battery (module-specific option)
```

#### Peripheral half config for dongle setups

The keyboard halves in a dongle setup are pure peripherals — they have no display and no USB HID. Their `.conf` files should NOT include `CONFIG_ZMK_DISPLAY`:

```conf
# keyboard_left.conf / keyboard_right.conf (peripherals in a dongle split)
CONFIG_ZMK_SLEEP=y
CONFIG_ZMK_IDLE_SLEEP_TIMEOUT=1800000
CONFIG_BT_CTLR_TX_PWR_PLUS_8=y
# No CONFIG_ZMK_DISPLAY — display is on the dongle
```

### Pairing order for battery indicators

In dongle setups with multi-peripheral battery widgets (e.g. showing left and right half battery separately), the widget maps battery events to display positions by the order peripherals connect after the dongle boots:

- **First peripheral to connect → slot 0 (typically left indicator)**
- **Second peripheral to connect → slot 1 (typically right indicator)**

If indicators are swapped, flash `settings_reset` to the dongle to clear all BT bonds, then re-pair in the correct order (left half first, then right).

---

## Choosing a work queue

| Display type | Recommended work queue | Reason |
|-------------|----------------------|--------|
| Sharp Memory LCD | `DEDICATED` | Refresh is fast; dedicated thread prevents contention with key scan |
| SSD1306 OLED | `DEDICATED` preferred | Same reasoning; `SYSTEM` works for simple builds |
| ePaper | `DEDICATED` — required | Refresh blocks for seconds; must not block key scan thread |
| ST7789V / color | `DEDICATED` | Higher data volume; SPI transfer time adds up |

```conf
CONFIG_ZMK_DISPLAY_WORK_QUEUE_DEDICATED=y
CONFIG_ZMK_DISPLAY_DEDICATED_THREAD_STACK_SIZE=2048
CONFIG_ZMK_DISPLAY_DEDICATED_THREAD_PRIORITY=5
```

All three Kconfig options are required together — omitting the stack size or priority causes a build error.
