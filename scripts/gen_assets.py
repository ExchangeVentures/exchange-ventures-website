"""Generate the raster brand assets for Exchange Ventures.

Run from anywhere:  python3 scripts/gen_assets.py
Needs Pillow, and macOS system fonts (Helvetica Neue and Menlo).

Black and white only, matching src/styles/tokens.css. The mark is the nav's
solid square plus an outlined one on the diagonal: one shape becoming another.

Every shape is an axis-aligned rectangle, so each size is drawn natively at
integer pixels. Downsampling a large render instead leaves ringing at 16px.
"""
import os

from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public")

BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREY40 = (156, 156, 156)   # --grey-40
LINE = (40, 40, 40)        # --line-dark on black
GRID = (20, 20, 20)

HN = "/System/Library/Fonts/HelveticaNeue.ttc"
MENLO = "/System/Library/Fonts/Menlo.ttc"
BOLD, MEDIUM, REG = 1, 10, 0


def hn(size, idx=BOLD):
    return ImageFont.truetype(HN, size, index=idx)


def mono(size, idx=0):
    return ImageFont.truetype(MENLO, size, index=idx)


# Per-size geometry: (solid xy, square side, outline xy, outline stroke).
# Hand-set for the small sizes so the outlined square keeps a clean hole.
ICON_SPECS = {
    16: (3, 5, 8, 1),
    32: (5, 10, 17, 2),
    48: (8, 14, 25, 3),
}


def icon(size):
    if size in ICON_SPECS:
        s_xy, side, o_xy, sw = ICON_SPECS[size]
    else:
        u = size / 64.0
        s_xy, side = round(11 * u), round(19 * u)
        o_xy, sw = round(34 * u), max(1, round(4.5 / 64 * size))
    im = Image.new("RGB", (size, size), BLACK)
    d = ImageDraw.Draw(im)
    d.rectangle([s_xy, s_xy, s_xy + side - 1, s_xy + side - 1], fill=WHITE)
    d.rectangle([o_xy, o_xy, o_xy + side - 1, o_xy + side - 1], outline=WHITE, width=sw)
    return im


def draw_mark(d, x, y, s):
    u = s / 64.0
    d.rectangle([x + 11 * u, y + 11 * u, x + 30 * u - 1, y + 30 * u - 1], fill=WHITE)
    d.rectangle([x + 34 * u, y + 34 * u, x + 53 * u - 1, y + 53 * u - 1],
                outline=WHITE, width=max(1, round(4.5 / 64 * s)))


def tracked(d, xy, text, font, fill, tracking):
    """PIL has no letter-spacing, so place each glyph by hand."""
    x, y = xy
    for ch in text:
        d.text((x, y), ch, font=font, fill=fill)
        x += d.textlength(ch, font=font) + tracking
    return x - tracking


def tracked_width(d, text, font, tracking):
    return sum(d.textlength(c, font=font) for c in text) + tracking * (len(text) - 1)


# ---- icons -----------------------------------------------------------------
icon(180).save(f"{OUT}/apple-touch-icon.png")
icon(512).save(f"{OUT}/icon-512.png")
icon(48).save(f"{OUT}/favicon.ico",
              sizes=[(16, 16), (32, 32), (48, 48)],
              append_images=[icon(16), icon(32)])

# ---- og-v2.png ----------------------------------------------------------------
W, H, M = 1200, 630, 80
im = Image.new("RGB", (W, H), BLACK)
d = ImageDraw.Draw(im)

for gx in range(0, W, 100):
    d.line([(gx, 0), (gx, H)], fill=GRID, width=1)
for gy in range(0, H, 90):
    d.line([(0, gy), (W, gy)], fill=GRID, width=1)

# Wordmark row, mirroring the nav: solid square then the name.
d.rectangle([M, 78, M + 14, 92], fill=WHITE)
d.text((M + 27, 68), "Exchange Ventures", font=hn(31, MEDIUM), fill=WHITE)

# Headline: the company name, as the site now leads with it.
f_head = hn(78, BOLD)
d.text((M, 214), "Exchange", font=f_head, fill=WHITE)
d.text((M, 308), "Ventures", font=f_head, fill=WHITE)

# The positioning line, under the name.
f_sub = hn(30, MEDIUM)
d.text((M, 418), "An intelligence company for energy operations.", font=f_sub, fill=GREY40)

# Footer rule and the mono strip.
d.line([(M, 502), (W - M, 502)], fill=LINE, width=1)
f_mono = mono(19)
TR = 2.6
end = tracked(d, (M, 542), "DATUM", f_mono, GREY40, TR)
# A divider, or the two words read as one phrase.
d.line([(end + 26, 545), (end + 26, 561)], fill=LINE, width=1)
tracked(d, (end + 52, 542), "PHASE ONE", f_mono, GREY40, TR)
dom = "EXCHANGEVENTURES.CA"
tracked(d, (W - M - tracked_width(d, dom, f_mono, TR), 542), dom, f_mono, WHITE, TR)

im.save(f"{OUT}/og-v2.png", optimize=True)
print("wrote favicon.ico, apple-touch-icon.png, icon-512.png, og-v2.png")
