"""Ресурсы для коллажа видео 8: зернистый градиент (обложка), стопка старой бумаги, вырезки-полутона с рваным белым краем."""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageOps
import os

root = r'C:\Users\awright\Desktop\Видео Клод\remotion\public\n8\img'
rng = np.random.default_rng(8)


def blur(im, r):
    return im.filter(ImageFilter.GaussianBlur(r))


# --- 1. зернистый градиент как в референсе: синий, мягкие светлые формы, крупное зерно ---------------
def grain_bg(w=1080, h=1920):
    base = Image.new('RGB', (w, h), (6, 14, 110))
    lay = Image.new('RGB', (w, h), (0, 0, 0))
    d = ImageDraw.Draw(lay)
    # светлые мягкие пятна
    for cx, cy, r, col in [(120, 120, 520, (40, 120, 255)), (980, 1640, 560, (40, 110, 250)), (980, 700, 380, (20, 80, 230)), (60, 1500, 420, (30, 100, 240)), (560, 1000, 520, (2, 6, 70))]:
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=col)
    lay = blur(lay, 150)
    # светлые «лучи-кресты» как в референсе
    sh = Image.new('RGB', (w, h), (0, 0, 0))
    sd = ImageDraw.Draw(sh)
    sd.polygon([(190, 330), (520, 210), (560, 300), (260, 470)], fill=(120, 195, 255))
    sd.polygon([(330, 340), (470, 280), (520, 420), (380, 520)], fill=(120, 195, 255))
    sd.polygon([(820, 1540), (930, 1500), (950, 1560), (870, 1600)], fill=(60, 140, 255))
    sd.polygon([(880, 1590), (930, 1560), (950, 1620), (905, 1650)], fill=(60, 140, 255))
    sh = blur(sh, 28)
    comp = ImageChops.add(base, lay)
    comp = ImageChops.screen(comp, sh)
    a = np.asarray(comp).astype(np.float32)
    lum = a.mean(axis=2, keepdims=True) / 255.0
    n = rng.normal(0, 1, (h, w, 1)).astype(np.float32)
    n2 = np.asarray(blur(Image.fromarray(((n[:, :, 0] * 40) + 128).clip(0, 255).astype(np.uint8)), 0.8)).astype(np.float32)[:, :, None] - 128
    grain = n * 32 + n2 * 0.6
    amp = 0.55 + 0.8 * (1 - np.abs(lum - 0.5) * 2)  # сильнее в середине тонов, как плёночное зерно
    out = (a + grain * amp).clip(0, 255).astype(np.uint8)
    Image.fromarray(out).save(os.path.join(root, 'bg_grain.jpg'), quality=92)


# --- 2. стопка старой бумаги ------------------------------------------------------------------------------------------------
def paper_sheet(w, h, base=(226, 206, 166), seed=0):
    r = np.random.default_rng(seed)
    n = r.normal(0, 1, (h // 8 + 1, w // 8 + 1)).astype(np.float32)
    big = np.asarray(Image.fromarray(((n * 30) + 128).clip(0, 255).astype(np.uint8)).resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(14))).astype(np.float32) - 128
    fine = r.normal(0, 1, (h, w)).astype(np.float32) * 5
    arr = np.zeros((h, w, 3), np.float32)
    for c in range(3):
        arr[:, :, c] = base[c] + big * 0.35 + fine
    # пятна-разводы по краям
    yy, xx = np.mgrid[0:h, 0:w]
    edge = np.minimum(np.minimum(xx, w - xx), np.minimum(yy, h - yy)) / 60.0
    arr *= (0.86 + 0.14 * np.clip(edge, 0, 1))[:, :, None]
    return Image.fromarray(arr.clip(0, 255).astype(np.uint8))


def torn_mask(w, h, amp=7, step=14, seed=1):
    r = np.random.default_rng(seed)
    pts = []
    for x in range(0, w, step): pts.append((x, r.uniform(0, amp)))
    for y in range(0, h, step): pts.append((w - r.uniform(0, amp), y))
    for x in range(w, 0, -step): pts.append((x, h - r.uniform(0, amp)))
    for y in range(h, 0, -step): pts.append((r.uniform(0, amp), y))
    m = Image.new('L', (w, h), 0)
    ImageDraw.Draw(m).polygon(pts, fill=255)
    return m


def paper_stack(W=780, H=980):
    canvas = Image.new('RGBA', (W + 120, H + 120), (0, 0, 0, 0))
    specs = [(-5, (214, 192, 150), 5, (-30, 10)), (3, (222, 202, 160), 6, (26, 18)), (-1, (232, 214, 176), 7, (0, 0))]
    for i, (ang, col, seed, off) in enumerate(specs):
        sw, sh = W - 40 - (i == 2) * 0, H - 40
        sheet = paper_sheet(sw, sh, col, seed).convert('RGBA')
        if i < 2:  # газетные строки у видимых краёв
            d = ImageDraw.Draw(sheet)
            r = np.random.default_rng(seed + 40)
            for yy in range(40, sh - 20, 22):
                d.rectangle([r.integers(10, 40), yy, r.integers(60, 150), yy + 8], fill=(60, 52, 40, 170))
                d.rectangle([sw - r.integers(60, 150), yy, sw - r.integers(10, 40), yy + 8], fill=(60, 52, 40, 170))
            d.rectangle([sw // 2 - 90, 20, sw // 2 + 90, 70], fill=(40, 36, 30, 200))
        m = torn_mask(sw, sh, amp=9, seed=seed)
        sheet.putalpha(m)
        # тень
        shadow = Image.new('RGBA', sheet.size, (0, 0, 0, 0))
        shadow.putalpha(blur(m.point(lambda v: int(v * 0.55)), 14))
        sheet_r = sheet.rotate(ang, expand=True, resample=Image.BICUBIC)
        shadow_r = shadow.rotate(ang, expand=True, resample=Image.BICUBIC)
        px, py = (canvas.width - sheet_r.width) // 2 + off[0], (canvas.height - sheet_r.height) // 2 + off[1]
        canvas.alpha_composite(shadow_r, (px + 8, py + 14))
        canvas.alpha_composite(sheet_r, (px, py))
    # складка и загнутый уголок на верхнем листе
    d = ImageDraw.Draw(canvas)
    d.line([(canvas.width // 2 - 4, 70), (canvas.width // 2 - 8, canvas.height - 70)], fill=(120, 96, 60, 70), width=3)
    canvas.save(os.path.join(root, 'paper_stack.png'))


# --- 3. полутоновая вырезка с рваным белым краем -----------------------------------------------------------------------------------
def halftone(gray, s=6, ang=45, gain=0.82):
    w, h = gray.size
    g = np.asarray(blur(gray, 1.2)).astype(np.float32) / 255.0
    D = 1.0 - g
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    ca, sa = np.cos(np.radians(ang)), np.sin(np.radians(ang))
    u = (xx * ca + yy * sa) / s
    v = (-xx * sa + yy * ca) / s
    du = u - (np.floor(u) + 0.5)
    dv = v - (np.floor(v) + 0.5)
    dist = np.hypot(du, dv)
    ink = dist < np.sqrt(np.clip(D, 0, 1)) * gain
    out = np.where(ink[:, :, None], np.array([22, 20, 24], np.float32), np.array([246, 242, 232], np.float32))
    return Image.fromarray(out.astype(np.uint8))


def cutout(src, box, width, name, s=6, border=16, tint=None, lift=1.0, color=False):
    im = Image.open(os.path.join(root, src)).convert('RGB')
    iw, ih = im.size
    c = im.crop((int(box[0] * iw), int(box[1] * ih), int(box[2] * iw), int(box[3] * ih)))
    h = int(width * c.height / c.width)
    c = c.resize((width, h), Image.LANCZOS)
    g = c.convert('L')
    colimg = c
    g = ImageOps.autocontrast(g, cutoff=1)
    g = Image.eval(g, lambda v: min(255, int(255 * (v / 255.0) ** lift * 1.05 + 4)))
    ht = colimg if color else halftone(g, s=s)
    if tint:
        ht = ImageChops.multiply(ht, Image.new('RGB', ht.size, tint))
    pad = border + 8
    W2, H2 = width + pad * 2, h + pad * 2
    base = Image.new('RGBA', (W2, H2), (0, 0, 0, 0))
    m = torn_mask(width, h, amp=5, step=10, seed=len(name))
    inner = ht.convert('RGBA'); inner.putalpha(m)
    mfull = Image.new('L', (W2, H2), 0); mfull.paste(m, (pad, pad))
    outer = mfull.filter(ImageFilter.MaxFilter(border * 2 + 1))
    # неровный белый край
    nz = np.random.default_rng(len(name) + 3).normal(0, 1, (H2, W2)).astype(np.float32)
    nzi = Image.fromarray(((nz * 60) + 128).clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3))
    outer = ImageChops.multiply(outer, Image.eval(nzi, lambda v: 255 if v > 90 else 0).filter(ImageFilter.MaxFilter(3))).filter(ImageFilter.GaussianBlur(1))
    outer = outer.point(lambda v: 255 if v > 90 else 0)
    white = Image.new('RGBA', (W2, H2), (250, 247, 238, 255)); white.putalpha(outer)
    base.alpha_composite(white)
    base.alpha_composite(inner, (pad, pad))
    base.save(os.path.join(root, name))


if __name__ == '__main__':
    grain_bg()
    paper_stack()
    cutout('n8_02_leoni.jpg', (0.12, 0.08, 0.92, 0.82), 540, 'cut_leoni.png')
    cutout('n8_01_david.jpg', (0.58, 0.56, 1.0, 0.92), 500, 'cut_goliath.png', lift=0.5)
    cutout('n8_06_judith.jpg', (0.0, 0.0, 1.0, 1.0), 560, 'cut_judith.png', lift=0.55)
    cutout('n8_05_mercy.jpg', (0.05, 0.0, 0.95, 0.62), 440, 'cut_mercy.png', lift=0.5)
    cutout('n8_04_lucy.jpg', (0.0, 0.25, 1.0, 0.85), 440, 'cut_lucy.png', lift=0.5)
    print('ok')
