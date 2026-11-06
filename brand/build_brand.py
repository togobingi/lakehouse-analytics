"""Build the Lakehouse Analytics brand assets (SVG sources + PNG exports).

Usage: python3 brand/build_brand.py
Needs: rsvg-convert (brew install librsvg), Pillow, and Avenir Next (ships with macOS).
"""

import subprocess
from pathlib import Path

from PIL import ImageFont

OUT = Path(__file__).parent / "identity"
FONT_PATH = "/System/Library/Fonts/Avenir Next.ttc"
FONT = "Avenir Next"

# Palette (see identity/palette.md)
DEEP_LAKE = "#0E2A33"
EMBER = "#FF7A45"
EMBER_DARK = "#D9531E"  # Ember for text on light backgrounds
LAGOON = "#22B0A0"
MIST = "#CDEDE8"
SAND = "#F5EFE6"
SLATE = "#5C6E75"

TAGLINE = "Genie, Dashboards and Semantics on the Lakehouse"


def text_width(text, size, weight):
    index = {"600": 2, "500": 5, "400": 7}[weight]
    return ImageFont.truetype(FONT_PATH, size, index=index).getlength(text)


def mark(roof=EMBER, bars=(SAND, SAND, LAGOON), wave=LAGOON, tile=None):
    """The house-over-lake mark on a 256x256 grid: roof, rising bars, water line."""
    tile_svg = f'<rect width="256" height="256" rx="56" fill="{tile}"/>' if tile else ""
    b1, b2, b3 = bars
    return f"""{tile_svg}
  <polyline points="56,118 128,60 200,118" fill="none" stroke="{roof}" stroke-width="20"
            stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="86" y="152" width="24" height="26" rx="4" fill="{b1}"/>
  <rect x="116" y="132" width="24" height="46" rx="4" fill="{b2}"/>
  <rect x="146" y="112" width="24" height="66" rx="4" fill="{b3}"/>
  <path d="M60 200 q17 -12 34 0 t34 0 t34 0 t34 0" fill="none" stroke="{wave}"
        stroke-width="10" stroke-linecap="round"/>"""


def svg(w, h, body, bg=None):
    bg_svg = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" '
            f'viewBox="0 0 {w} {h}">{bg_svg}{body}</svg>\n')


def placed_mark(x, y, size, **kw):
    return f'<g transform="translate({x},{y}) scale({size / 256})">{mark(**kw)}</g>'


def wordmark_text(x, baseline, size, first, second):
    gap = size * 0.28
    w1 = text_width("Lakehouse", size, "600")
    return (f'<text x="{x}" y="{baseline}" font-family="{FONT}" font-size="{size}" '
            f'font-weight="600" fill="{first}">Lakehouse</text>'
            f'<text x="{x + w1 + gap}" y="{baseline}" font-family="{FONT}" '
            f'font-size="{size}" font-weight="500" fill="{second}">Analytics</text>'), \
        w1 + gap + text_width("Analytics", size, "500")


def write(name, content, png_width):
    path = OUT / f"{name}.svg"
    path.write_text(content)
    subprocess.run(["rsvg-convert", "-w", str(png_width), "-o",
                    str(OUT / f"{name}.png"), str(path)], check=True)


def build():
    OUT.mkdir(exist_ok=True)

    # Logo: tile version for the Substack avatar, transparent versions for overlays.
    write("logo", svg(256, 256, mark(tile=DEEP_LAKE)), 1024)
    write("logo-transparent-dark", svg(256, 256, mark(bars=(DEEP_LAKE, DEEP_LAKE, LAGOON))), 1024)
    write("logo-transparent-light", svg(256, 256, mark()), 1024)

    # Wordmark: mark + name, transparent, for the Substack header.
    # Substack caps wordmarks at 21:4, so the canvas is padded to 5:1.
    size, pad, mark_size = 120, 24, 200
    for variant, first, second, kw in [
        ("wordmark", DEEP_LAKE, EMBER_DARK, {"bars": (DEEP_LAKE, DEEP_LAKE, LAGOON)}),
        ("wordmark-light", SAND, EMBER, {}),
    ]:
        text, tw = wordmark_text(pad + mark_size + 28, 140, size, first, second)
        w = int(pad + mark_size + 28 + tw + pad)
        h = round(w / 5)
        body = f'<g transform="translate(0,{(h - 200) / 2})">{placed_mark(pad, 0, mark_size, **kw)}{text}</g>'
        write(variant, svg(w, h, body), w * 2)

    # Cover image: square, dark, mark + stacked name + tagline over a faint chart grid.
    s = 1200
    grid = "".join(f'<line x1="0" y1="{y}" x2="{s}" y2="{y}" stroke="{MIST}" '
                   f'stroke-opacity="0.06" stroke-width="2"/>' for y in range(100, s, 100))
    ghost_bars = "".join(
        f'<rect x="{x}" y="{s - h}" width="70" height="{h}" rx="10" fill="{LAGOON}" '
        f'fill-opacity="0.08"/>'
        for x, h in zip(range(40, s, 100), [120, 180, 150, 240, 210, 300, 260, 340, 310, 400, 370, 460]))
    cover = (grid + ghost_bars + placed_mark(410, 150, 380)
             + f'<text x="600" y="690" text-anchor="middle" font-family="{FONT}" '
               f'font-size="132" font-weight="600" fill="{SAND}">Lakehouse</text>'
             + f'<text x="600" y="830" text-anchor="middle" font-family="{FONT}" '
               f'font-size="132" font-weight="500" fill="{EMBER}">Analytics</text>'
             + f'<text x="600" y="930" text-anchor="middle" font-family="{FONT}" '
               f'font-size="40" font-weight="400" fill="{MIST}">{TAGLINE}</text>')
    write("cover", svg(s, s, cover, bg=DEEP_LAKE), s)

    # Email banner: 1100x220 per Substack, exported at 2x.
    text, tw = wordmark_text(220, 118, 72, DEEP_LAKE, EMBER_DARK)
    banner = (placed_mark(50, 20, 180, bars=(DEEP_LAKE, DEEP_LAKE, LAGOON)) + text
              + f'<text x="222" y="170" font-family="{FONT}" font-size="30" '
                f'font-weight="400" fill="{SLATE}">{TAGLINE}</text>')
    write("email-banner", svg(1100, 220, banner, bg=SAND), 2200)


if __name__ == "__main__":
    build()
