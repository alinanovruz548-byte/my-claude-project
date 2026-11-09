"""Нарезка античных статуй для хука видео 14: фото с Commons (Public domain / CC0) -> вырезки с рваным краем."""
import time
import urllib.parse
import urllib.request

import numpy as np
from PIL import Image, ImageFilter

base = r'C:\Users\awright\Desktop\Видео Клод'
OUT = base + r'\remotion\public\n14\img' + '\\'

FILES = [
    ('Venus de Milo Louvre Ma399 n4.jpg', (242, 194, 48)),
    ('Discobolus front.jpg', (43, 92, 200)),
    ('Victoire de Samothrace - Musee du Louvre - 20190812.jpg', (20, 20, 20)),
    ('Capitoline Venus, Capitoline Museums.jpg', (200, 25, 30)),
    ('Beeld van Hermes in Olympia G 53. De Hermes van Praxiteles (Hermes Bacchophore). Olympia. (titel op object) Griekenland (serietitel), RP-F-1997-31-53.jpg', (46, 139, 87)),
    ('Head of a Doryphoros, Museo Barracco.jpg', (242, 194, 48)),
    ('Capitoline Venus Louvre Ma336 n2.jpg', (91, 43, 160)),
    ('Discobolus face side.jpg', (246, 240, 226)),
]


def get(u):
    r = urllib.request.Request(u, headers={'User-Agent': 'ArtStoriesBot/1.0 (educational)'})
    return urllib.request.urlopen(r).read()


def torn(im, name, width, back, rot, seed, border=22):
    r = np.random.RandomState(seed)
    im = im.convert('RGB')
    im.thumbnail((width, int(width * 1.7)))
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
    return out.size


for i, (title, back) in enumerate(FILES):
    u = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + urllib.parse.quote(title) + '?width=900'
    raw = get(u)
    tmp = base + r'\build\n14' + f'\\st_raw_{i}.jpg'
    open(tmp, 'wb').write(raw)
    print(i, torn(Image.open(tmp), f'st_{i}.png', 520, back, 2.5 + (i % 3) * 1.5 - 2, 100 + i))
    time.sleep(4)
print('done')
