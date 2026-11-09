"""Ресурсы видео 13: сине-серый картон и бумажные вырезки Босха с рваным краем."""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

Image.MAX_IMAGE_PIXELS = None
base = r'C:\Users\awright\Desktop\Видео Клод'
OUT = base + r'\remotion\public\n13\img' + '\\'
B = base + r'\build\n13' + '\\'
rs = np.random.RandomState(13)


def noise(w, h, cell):
    n = rs.rand(h // cell + 3, w // cell + 3)
    return np.asarray(Image.fromarray((n * 255).astype('uint8')).resize((w, h), Image.BICUBIC), dtype=np.float32) / 255


# --- фон: сине-серый картон с волокнами
W, H = 3400, 5100
base_col = np.array([84, 100, 124], dtype=np.float32)
n = noise(W, H, 400) * 0.5 + noise(W, H, 90) * 0.3 + noise(W, H, 8) * 0.2
img = base_col[None, None, :] * (0.82 + 0.36 * n[..., None])
# мелкие волокна
fib = Image.new('L', (W, H), 128)
d = ImageDraw.Draw(fib)
for _ in range(9000):
    x, y = rs.randint(0, W), rs.randint(0, H)
    L = rs.randint(10, 40)
    a = rs.rand() * 6.28
    d.line((x, y, x + np.cos(a) * L, y + np.sin(a) * L), fill=int(rs.choice([90, 170])), width=1)
fib = np.asarray(fib, dtype=np.float32) / 255 - 0.5
img = np.clip(img + fib[..., None] * 26, 0, 255)
Image.fromarray(img.astype('uint8')).save(OUT + 'bg_slate.jpg', quality=86)


def torn(src, name, width, border=26, back=(242, 194, 48), rot=3.0, off=(16, 12), seed=1):
    r = np.random.RandomState(seed)
    im = Image.open(src).convert('RGB')
    im.thumbnail((width, width * 4))
    w, h = im.size
    pad = border + 40
    Wc, Hc = w + pad * 2, h + pad * 2
    # рваная маска (бумага с краем)
    yy, xx = np.mgrid[0:Hc, 0:Wc]
    dist = np.minimum(np.minimum(xx, Wc - 1 - xx), np.minimum(yy, Hc - 1 - yy)).astype(np.float32)
    nz = np.asarray(Image.fromarray((r.rand(Hc // 14 + 3, Wc // 14 + 3) * 255).astype('uint8')).resize((Wc, Hc), Image.BICUBIC), dtype=np.float32)
    alpha = np.clip((dist - (14 + (nz - 128) * 0.22)) / 3, 0, 1)
    paper = np.zeros((Hc, Wc, 4), dtype=np.float32)
    paper[..., :3] = np.array([246, 240, 226])
    paper[border + 40:border + 40 + h, border + 40:border + 40 + w, :3] = np.asarray(im, dtype=np.float32)
    paper[..., 3] = alpha * 255
    top = Image.fromarray(paper.astype('uint8'), 'RGBA')
    # цветная подложка: чуть больше, повёрнута и сдвинута
    m = Image.fromarray((alpha * 255).astype('uint8')).filter(ImageFilter.MaxFilter(21))
    bk = Image.new('RGBA', (Wc, Hc), back + (255,))
    bk.putalpha(m)
    bk = bk.rotate(rot, resample=Image.BICUBIC, expand=False, center=(Wc / 2, Hc / 2))
    out = Image.new('RGBA', (Wc + 60, Hc + 60), (0, 0, 0, 0))
    out.alpha_composite(bk, (30 + off[0], 30 + off[1]))
    out.alpha_composite(top, (30, 30))
    bb = out.getbbox()
    out = out.crop(bb)
    out.save(OUT + name, optimize=True)
    print(name, out.size)


torn(B + 'r3_full.jpg', 'cut_notes.png', 1500, seed=2)
c = Image.open(B + 'r3_full.jpg')
c.crop((480, 140, 920, 480)).resize((880, 680), Image.LANCZOS).save(B + 'notes_close.jpg', quality=92)
torn(B + 'notes_close.jpg', 'cut_close.png', 900, back=(20, 20, 20), rot=-3, seed=3)
c.crop((0, 300, 540, 700)).save(B + 'book.jpg', quality=92)
torn(B + 'book.jpg', 'cut_book.png', 800, back=(43, 63, 160), rot=2.5, seed=4)
torn(B + 'r4_full.jpg', 'cut_instr.png', 1100, back=(20, 20, 20), rot=-2.5, seed=5)
im = Image.open(B + 'bosch_hi.jpg')
w, h = im.size
hell = im.crop((int(w * 0.745) + 330, 0, w - 300, h))
hell.thumbnail((1300, 3000))
hell.save(B + 'hell_panel.jpg', quality=90)
torn(B + 'hell_panel.jpg', 'cut_panel.png', 1000, back=(242, 194, 48), rot=2, seed=6)
tri = Image.open(OUT + 'bosch_full.jpg')
tri.save(B + 'tri.jpg', quality=90)
torn(B + 'tri.jpg', 'cut_tri.png', 1500, back=(255, 255, 255), rot=-2.5, seed=7)
print('done')
