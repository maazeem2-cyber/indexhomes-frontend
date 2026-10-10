"""Solid navy house + gold 2x2 window + gold index arrow. Full base, no crop."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(r"D:\Tasks\Henry\Project\indexhome-front")
OUT = ROOT / "public" / "images" / "brand"
APP = ROOT / "src" / "app"
PUBLIC = ROOT / "public"

NAVY = (7, 17, 31, 255)
LIGHT = (232, 238, 247, 255)
GOLD = (212, 180, 131, 255)
WHITE = (255, 255, 255, 255)


def load_font(paths, size):
    for p in paths:
        if Path(p).exists():
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


font_title = load_font(
    [r"C:\Windows\Fonts\segoeuib.ttf", r"C:\Windows\Fonts\arialbd.ttf"],
    72,
)
font_tag = load_font(
    [r"C:\Windows\Fonts\segoeui.ttf", r"C:\Windows\Fonts\arial.ttf"],
    26,
)


def draw_mark(draw, ox, oy, scale=1.0, house=NAVY):
    house_pts = [
        (ox + 80 * scale, oy + 22 * scale),
        (ox + 138 * scale, oy + 72 * scale),
        (ox + 126 * scale, oy + 72 * scale),
        (ox + 126 * scale, oy + 132 * scale),
        (ox + 34 * scale, oy + 132 * scale),
        (ox + 34 * scale, oy + 72 * scale),
        (ox + 22 * scale, oy + 72 * scale),
    ]
    draw.polygon(house_pts, fill=house)
    draw.rectangle(
        [ox + 120 * scale, oy + 48 * scale, ox + 138 * scale, oy + 78 * scale],
        fill=house,
    )

    ws = 12 * scale
    gap = 4 * scale
    wx, wy = ox + 68 * scale, oy + 78 * scale
    for dx, dy in ((0, 0), (ws + gap, 0), (0, ws + gap), (ws + gap, ws + gap)):
        draw.rounded_rectangle(
            [wx + dx, wy + dy, wx + dx + ws, wy + dy + ws],
            radius=max(1, int(1.5 * scale)),
            fill=GOLD,
        )

    chart = [
        (ox + 40 * scale, oy + 128 * scale),
        (ox + 58 * scale, oy + 108 * scale),
        (ox + 72 * scale, oy + 120 * scale),
        (ox + 108 * scale, oy + 64 * scale),
        (ox + 136 * scale, oy + 40 * scale),
    ]
    draw.line(chart, fill=GOLD, width=max(8, int(11 * scale)), joint="curve")
    tip = chart[-1]
    draw.polygon(
        [
            tip,
            (tip[0] - 20 * scale, tip[1] + 4 * scale),
            (tip[0] - 14 * scale, tip[1] + 22 * scale),
        ],
        fill=GOLD,
    )


def make_mark(size=512, house=NAVY, bg=(0, 0, 0, 0)):
    img = Image.new("RGBA", (size, size), bg)
    draw = ImageDraw.Draw(img)
    # Extra bottom padding so the house base never looks cropped
    pad_x = size * 0.14
    pad_top = size * 0.12
    pad_bottom = size * 0.18
    usable_h = size - pad_top - pad_bottom
    usable_w = size - pad_x * 2
    scale = min(usable_w / 160, usable_h / 160)
    draw_mark(draw, pad_x, pad_top, scale=scale, house=house)
    return img


def make_lockup(bg, house, text_fill, out_name, pad=56):
    tmp = Image.new("RGBA", (8, 8))
    d = ImageDraw.Draw(tmp)
    title = "IndexHomes"
    tag = "Grow Together"
    tb = d.textbbox((0, 0), title, font=font_title)
    gb = d.textbbox((0, 0), tag, font=font_tag)
    tw, th = tb[2] - tb[0], tb[3] - tb[1]
    gw, gh = gb[2] - gb[0], gb[3] - gb[1]

    icon = 160
    gap = 40
    content_w = icon + gap + max(tw, gw + 120)
    content_h = max(icon, th + 28 + gh)
    W = int(content_w + pad * 2)
    H = int(content_h + pad * 2)

    img = Image.new("RGBA", (W, H), bg)
    draw = ImageDraw.Draw(img)
    mark_x = pad
    mark_y = pad + (content_h - icon) / 2
    draw_mark(draw, mark_x, mark_y, scale=icon / 160, house=house)

    text_x = pad + icon + gap
    title_y = pad + (content_h - (th + 28 + gh)) / 2
    draw.text((text_x, title_y), title, font=font_title, fill=text_fill)

    tag_y = title_y + th + 18
    tag_x = text_x + (tw - gw) / 2
    rule_gap = 14
    rule_y = tag_y + gh / 2
    draw.line([(text_x, rule_y), (tag_x - rule_gap, rule_y)], fill=GOLD, width=2)
    draw.text((tag_x, tag_y), tag, font=font_tag, fill=GOLD)
    draw.line([(tag_x + gw + rule_gap, rule_y), (text_x + tw, rule_y)], fill=GOLD, width=2)

    img.save(OUT / out_name, "PNG")
    print("wrote", out_name, img.size)


def save_favicon(mark: Image.Image):
    """Transparent favicon — house mark only, no white rectangle."""
    sizes = (16, 32, 48, 64)
    frames = [mark.resize((s, s), Image.Resampling.LANCZOS) for s in sizes]
    ico = APP / "favicon.ico"
    frames[-1].save(ico, format="ICO", sizes=[(s, s) for s in sizes])
    (PUBLIC / "favicon.ico").write_bytes(ico.read_bytes())
    mark.resize((256, 256), Image.Resampling.LANCZOS).save(APP / "icon.png")
    mark.resize((180, 180), Image.Resampling.LANCZOS).save(APP / "apple-icon.png")
    mark.resize((256, 256), Image.Resampling.LANCZOS).save(OUT / "favicon-mark.png")
    mark.resize((32, 32), Image.Resampling.LANCZOS).save(PUBLIC / "favicon.png")
    mark.resize((64, 64), Image.Resampling.LANCZOS).save(OUT / "favicon-preview.png")
    print("wrote transparent favicon")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    make_lockup((0, 0, 0, 0), NAVY, NAVY, "indexhomes-logo-transparent.png", pad=48)
    make_lockup(WHITE, NAVY, NAVY, "indexhomes-logo-fullcolour.png", pad=80)
    make_lockup((0, 0, 0, 0), LIGHT, LIGHT, "indexhomes-logo-on-dark.png", pad=48)

    mark = make_mark(512, house=NAVY)
    mark.save(OUT / "indexhomes-mark.png", "PNG")
    make_mark(512, house=LIGHT).save(OUT / "indexhomes-mark-on-dark.png", "PNG")
    print("wrote marks")
    save_favicon(mark)


if __name__ == "__main__":
    main()
