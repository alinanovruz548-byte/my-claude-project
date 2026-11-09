"""Ресурсы для «доски дела» (видео 9, вариант 2): ткань стола/доски, старая бумага без белого фона."""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageOps

base = r'C:\Users\awright\Desktop\Видео Клод'
out = os.path.join(base, 'remotion', 'public', 'n9b', 'img')
os.makedirs(out, exist_ok=True)
rng = np.random.default_rng(99)


def felt(w=3400, h=4800):
    # тёмно-синее сукно: крупные пятна + мелкие волокна + зерно + золотые «пятна лампы»
    arr = np.zeros((h, w, 3), np.float32)
    base_c = np.array([11, 17, 52], np.float32)
    arr[:] = base_c
    for scale, amp in [(500, 6), (140, 4), (40, 3)]:
        n = rng.normal(0, 1, (h // scale + 2, w // scale + 2)).astype(np.float32)
        big = np.asarray(Image.fromarray(((n * 40) + 128).clip(0, 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)).astype(np.float32) - 128
        arr += (big / 40.0)[:, :, None] * amp * np.array([0.8, 0.9, 1.4], np.float32)
    fine = rng.normal(0, 1, (h, w)).astype(np.float32) * 5
    arr += fine[:, :, None] * np.array([0.9, 0.9, 1.2], np.float32)
    im = Image.fromarray(arr.clip(0, 255).astype(np.uint8))
    # волокна
    d = ImageDraw.Draw(im, 'RGBA')
    for _ in range(9000):
        x, y = rng.integers(0, w), rng.integers(0, h)
        L = rng.integers(10, 38)
        a = rng.uniform(0, np.pi)
        d.line([(x, y), (x + np.cos(a) * L, y + np.sin(a) * L)], fill=(120, 140, 220, int(rng.integers(10, 34))), width=1)
    # пятна света лампы
    glow = Image.new('RGB', (w, h), (0, 0, 0))
    gd = ImageDraw.Draw(glow)
    for cx, cy, r in [(1300, 900, 900), (2300, 2200, 1000), (1500, 3500, 1000), (700, 1800, 700), (2500, 3700, 800)]:
        gd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(34, 26, 8))
    glow = glow.filter(ImageFilter.GaussianBlur(260))
    im = ImageChops.add(im, glow)
    im.save(os.path.join(out, 'board.jpg'), quality=88)


def old_paper():
    p = os.path.join(base, 'build', 'ref2', 'paper.webp')
    im = Image.open(p).convert('RGB')
    a = np.asarray(im).astype(np.float32)
    m = (a.min(axis=2) < 238).astype(np.uint8) * 255
    mask = Image.fromarray(m).filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MinFilter(9)).filter(ImageFilter.GaussianBlur(1.5))
    rgba = im.convert('RGBA')
    rgba.putalpha(mask)
    rgba = rgba.crop(rgba.getbbox())
    w = 900
    rgba = rgba.resize((w, int(w * rgba.height / rgba.width)), Image.LANCZOS)
    rgba.save(os.path.join(out, 'paper_old.png'))
    print(rgba.size)


if __name__ == '__main__':
    felt()
    old_paper()
    print('ok')
