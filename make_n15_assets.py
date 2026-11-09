"""Ресурсы видео 15: горчичная бумага и бумажные вырезки деталей «Портрета четы Арнольфини» (Public domain)."""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

Image.MAX_IMAGE_PIXELS = None
base = r'C:\Users\awright\Desktop\Видео Клод'
OUT = base + r'\remotion\public\n15\img' + '\\'
B = base + r'\build\n15' + '\\'
rs = np.random.RandomState(15)


def noise(w, h, cell):
    n = rs.rand(h // cell + 3, w // cell + 3)
    return np.asarray(Image.fromarray((n * 255).astype('uint8')).resize((w, h), Image.BICUBIC), dtype=np.float32) / 255


W, H = 3400, 5100
col = np.array([226, 178, 62], dtype=np.float32)
n = noise(W, H, 400) * 0.5 + noise(W, H, 90) * 0.3 + noise(W, H, 8) * 0.2
img = col[None, None, :] * (0.84 + 0.30 * n[..., None])
fib = Image.new('L', (W, H), 128)
d = ImageDraw.Draw(fib)
for _ in range(9000):
    x, y = rs.randint(0, W), rs.randint(0, H)
    L = rs.randint(10, 40)
    a = rs.rand() * 6.28
    d.line((x, y, x + np.cos(a) * L, y + np.sin(a) * L), fill=int(rs.choice([90, 170])), width=1)
fib = np.asarray(fib, dtype=np.float32) / 255 - 0.5
img = np.clip(img + fib[..., None] * 24, 0, 255)
Image.fromarray(img.astype('uint8')).save(OUT + 'bg_mustard.jpg', quality=86)


def torn(im, name, width, border=24, back=(20, 20, 20), rot=3.0, seed=1):
    r = np.random.RandomState(seed)
    im = im.convert('RGB')
    im.thumbnail((width, width * 4))
    w, h = im.size
    pad = border + 40
    Wc, Hc = w + pad * 2, h + pad * 2
    yy, xx = np.mgrid[0:Hc, 0:Wc]
    dist = np.minimum(np.minimum(xx, Wc - 1 - xx), np.minimum(yy, Hc - 1 - yy)).astype(np.float32)
    nz = np.asarray(Image.fromarray((r.rand(Hc // 14 + 3, Wc // 14 + 3) * 255).astype('uint8')).resize((Wc, Hc), Image.BICUBIC), dtype=np.float32)
    alpha = np.clip((dist - (14 + (nz - 128) * 0.22)) / 3, 0, 1)
    paper = np.zeros((Hc, Wc, 4), dtype=np.float32)
    paper[..., :3] = np.array([246, 240, 226])
    paper[border + 40:border + 40 + h, border + 40:border + 40 + w, :3] = np.asarray(im, dtype=np.float32)
    paper[..., 3] = alpha * 255
    top = Image.fromarray(paper.astype('uint8'), 'RGBA')
    m = Image.fromarray((alpha * 255).astype('uint8')).filter(ImageFilter.MaxFilter(21))
    bk = Image.new('RGBA', (Wc, Hc), back + (255,))
    bk.putalpha(m)
    bk = bk.rotate(rot, resample=Image.BICUBIC, expand=False, center=(Wc / 2, Hc / 2))
    out = Image.new('RGBA', (Wc + 60, Hc + 60), (0, 0, 0, 0))
    out.alpha_composite(bk, (30 + 14, 30 + 10))
    out.alpha_composite(top, (30, 30))
    out = out.crop(out.getbbox())
    out.save(OUT + name, optimize=True)
    print(name, out.size)


im = Image.open(B + 'arn_full.jpg')
# координаты в долях полной картинки 4353x6000 (малая версия 700x965 => k=6.22)
k = 6.22
crops = {
    'mirror': ((270, 205, 435, 370), (43, 63, 160)),
    'insc': ((265, 180, 425, 235), (20, 20, 20)),
    'dog': ((245, 780, 425, 945), (200, 25, 30)),
    'chand': ((245, 25, 455, 195), (246, 240, 226)),
    'man': ((100, 100, 300, 265), (20, 20, 20)),
    'woman': ((470, 160, 630, 335), (43, 63, 160)),
}
for i, (nm, (box, back)) in enumerate(crops.items()):
    c = im.crop(tuple(int(v * k) for v in box))
    c = ImageEnhance.Contrast(ImageEnhance.Brightness(c).enhance(1.7)).enhance(1.08)
    c.save(B + f'crop_{nm}.jpg', quality=92)
    torn(c, f'cut_{nm}.png', 760, back=back, rot=2.5 + i % 3 - 2, seed=20 + i)
full = im.copy()
full.thumbnail((1500, 2100))
full = ImageEnhance.Brightness(full).enhance(1.3)
torn(full, 'cut_full.png', 1000, back=(43, 63, 160), rot=-2, seed=40)
print('done')
