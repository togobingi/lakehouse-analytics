# Lakehouse Analytics: palette

A cousin of the Databricks look, not a copy: deep teal-navy instead of Navy, a warm
orange Ember instead of Lava red, plus a water-teal Lagoon that Databricks does not use.

| Name | Hex | Role |
|---|---|---|
| Deep Lake | `#0E2A33` | Primary dark. Backgrounds, body text on light, logo tile |
| Ember | `#FF7A45` | Accent. The roof, highlights, "Analytics" on dark backgrounds |
| Ember Dark | `#D9531E` | Ember for text on light backgrounds (large text only) |
| Lagoon | `#22B0A0` | Secondary. Water line, the highlighted bar, links on dark |
| Mist | `#CDEDE8` | Light tint. Secondary text on dark, subtle fills |
| Sand | `#F5EFE6` | Light background. Email banner, light slides |
| Slate | `#5C6E75` | Muted text on light (captions, taglines) |

## Contrast (WCAG)

| Pair | Ratio | Use |
|---|---|---|
| Deep Lake on Sand / White | 13.1 / 15.0 | Any text |
| Sand or Mist on Deep Lake | 13.1 / 12.1 | Any text |
| Ember on Deep Lake | 5.8 | Any text |
| Lagoon on Deep Lake | 5.6 | Any text |
| Slate on Sand / White | 4.7 / 5.3 | Body and captions |
| Ember Dark on Sand / White | 3.5 / 4.0 | Headlines and large text only |
| Ember or Lagoon on Sand / White | 2.3 to 2.7 | Shapes and chart marks only, never text |

## Charts and diagrams

- Series order: Lagoon, Ember, Deep Lake, Slate. Highlight one series in Ember, keep
  the rest Lagoon or Slate.
- Light charts on Sand or White; dark charts on Deep Lake with Mist gridlines at low opacity.
- Demo content keeps the Sunny Bay Roastery palette (`../sunny-bay-roastery/`), not this one.
