"""Ресурсы видео 14: терракотовая бумага и вырезки (детали статуи, УФ-кадр) с рваным краем."""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

base = r'C:\Users\awright\Desktop\Видео Клод'
OUT = base + r'\remotion\public\n14\img' + '\\'
rs = np.random.RandomState(14)


def noise(w, h, cell):
    n = rs.rand(h // cell + 3, w // cell + 3)
    return np.asarray(Image.fromarray((n * 255).astype('uint8')).resize((w, h), Image.BICUBIC), dtype=np.float32) / 255


W, H = 3400, 5100
base_col = np.array([200, 146, 116], dtype=np.float32)
n = noise(W, H, 400) * 0.5 + noise(W, H, 90) * 0.3 + noise(W, H, 8) * 0.2
img = base_col[None, None, :] * (0.84 + 0.32 * n[..., None])
fib = Image.new('L', (W, H), 128)
d = ImageDraw.Draw(fib)
for _ in range(9000):
    x, y = rs.randint(0, W), rs.randint(0, H)
    L = rs.randint(10, 40)
    a = rs.rand() * 6.28
    d.line((x, y, x + np.cos(a) * L, y + np.sin(a) * L), fill=int(rs.choice([90, 170])), width=1)
fib = np.asarray(fib, dtype=np.float32) / 255 - 0.5
img = np.clip(img + fib[..., None] * 24, 0, 255)
Image.fromarray(img.astype('uint8')).save(OUT + 'bg_terra.jpg', quality=86)


def torn(im, name, width, border=24, back=(242, 194, 48), rot=3.0, off=(16, 12), seed=1):
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
    out.alpha_composite(bk, (30 + off[0], 30 + off[1]))
    out.alpha_composite(top, (30, 30))
    out = out.crop(out.getbbox())
    out.save(OUT + name, optimize=True)
    print(name, out.size)


col = Image.open(OUT + 'aug_color.jpg')
src = Image.open(OUT + 'aug_src.jpg')
torn(col.crop((680, 360, 1290, 1010)), 'cut_chest.png', 700, back=(43, 92, 200), rot=3, seed=2)
torn(col.crop((640, 900, 1420, 1650)), 'cut_cloak.png', 700, back=(200, 25, 30), rot=-3, seed=3)
torn(src.crop((680, 360, 1290, 1010)), 'cut_chest_w.png', 700, back=(246, 240, 226), rot=-2, seed=4)
torn(Image.open(OUT + 'uv.jpg'), 'cut_uv.png', 900, back=(91, 43, 160), rot=2.5, seed=5)
print('done')
