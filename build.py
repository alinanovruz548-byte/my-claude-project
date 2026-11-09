"""Сборка ролика по script.json: покадровая отрисовка (Pillow) + кодирование (ffmpeg).

Монтаж в стиле второго референса: бегущая строка-«выделение» сверху, номер главы, карточки-«интерфейсы»
(досье, счётчик, карта), штампы, мини-таймлайн внизу, разные переходы на каждом стыке.

python scripts/build.py              собрать ролик (слова берутся из build/words.json)
python scripts/build.py --transcribe распознать озвучку (faster-whisper), сохранить build/words.json
python scripts/build.py --stills [t…] сохранить контрольные кадры в build/stills/
Запускать из корня проекта; нужны ffmpeg/ffprobe в PATH.
"""
import difflib
import json
import math
import re
import subprocess
import sys
import time
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
BUILD = ROOT / "build"
W, H = 1080, 1920
SAFE_TOP, SAFE_BOTTOM = 150, 250  # зона интерфейса TikTok: ничего важного выше 150 px и ниже 1670 px

NEON = (255, 46, 147)  # неоново-розовый акцент
INK = (22, 14, 20)  # тёмный текст на белых карточках
GREY = (150, 140, 150)
BG = {"bg": (12, 9, 12), "glow": (210, 30, 125), "glow_a": 0.34}
CX, CY, CW, CH = 100, 650, 880, 740  # карточка
CAPTION_Y = 200
HEADER_Y = 505
TL_Y = 1480  # мини-таймлайн (низ <= 1670)


# ---------- утилиты ----------
def run(cmd):
    r = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, encoding="utf-8")
    if r.returncode:
        sys.exit("ffmpeg error:\n" + r.stderr[-3000:])
    return r.stdout


def probe(path, entries="format=duration"):
    return run(["ffprobe", "-v", "error", "-show_entries", entries, "-of", "csv=p=0", str(path)]).strip()


def load():
    return json.loads((ROOT / "script.json").read_text(encoding="utf-8"))


def clamp01(x):
    return max(0.0, min(1.0, x))


def ease_out(t):
    return 1 - (1 - clamp01(t)) ** 3


def ease_in_out(t):
    t = clamp01(t)
    return t * t * (3 - 2 * t)


def ease_back(t, c=1.7):
    t = clamp01(t)
    return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2


def bounce(t):
    t = clamp01(t)
    if t < 1 / 2.75:
        return 7.5625 * t * t
    if t < 2 / 2.75:
        t -= 1.5 / 2.75
        return 7.5625 * t * t + 0.75
    if t < 2.5 / 2.75:
        t -= 2.25 / 2.75
        return 7.5625 * t * t + 0.9375
    t -= 2.625 / 2.75
    return 7.5625 * t * t + 0.984375


def fade(layer, a):
    if a < 1:
        layer.putalpha(layer.getchannel("A").point(lambda v: int(v * a)))
    return layer


_fonts = {}
_cfg = {}


def font(kind, size, weight):
    key = (kind, size, weight)
    if key not in _fonts:
        f = ImageFont.truetype(str(ROOT / _cfg["fonts"][kind]), size)
        f.set_variation_by_axes([weight])
        _fonts[key] = f
    return _fonts[key]


def rounded_mask(size, r):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), r, fill=255)
    return m


# ---------- фон ----------
_bg = {}


def background():
    if "img" not in _bg:
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
        d = np.sqrt((xx - (CX + CW / 2)) ** 2 + ((yy - (CY + CH / 2)) / 1.15) ** 2)
        a = (BG["glow_a"] * np.exp(-((d / 560) ** 2)))[..., None]
        img = np.array(BG["bg"], np.float32) * (1 - a) + np.array(BG["glow"], np.float32) * a
        out = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8), "RGB").convert("RGBA")
        sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ImageDraw.Draw(sh).rounded_rectangle((CX - 6, CY + 14, CX + CW + 6, CY + CH + 30), 60, fill=NEON + (80,))
        _bg["img"] = Image.alpha_composite(out, sh.filter(ImageFilter.GaussianBlur(40))).convert("RGB")
        o = Image.new("RGBA", (900, 900), (0, 0, 0, 0))
        ImageDraw.Draw(o).ellipse((250, 250, 650, 650), fill=(255, 60, 160, 70))
        _bg["orb"] = o.filter(ImageFilter.GaussianBlur(90))
    return _bg["img"]


def animated_background(T):
    base = background().copy().convert("RGBA")
    for k, (ax, ay, sp, ph) in enumerate([(300, 220, 0.55, 0.0), (260, 300, 0.40, 2.1)]):
        x = W / 2 + ax * math.sin(T * sp + ph) - 450
        y = (360 if k == 0 else 1500) + ay * math.cos(T * sp * 1.3 + ph) - 450
        base.alpha_composite(_bg["orb"], (int(x), int(y)))
    return base.convert("RGB")


# ---------- изображения ----------
_imgs = {}
missing = []


def get_img(name):
    if name not in _imgs:
        p = ROOT / "assets" / "images" / name
        if not p.exists():
            missing.append(name)
            img = Image.new("RGB", (1200, 1000), (128, 128, 128))
            ImageDraw.Draw(img).text((600, 500), name, fill="white", anchor="mm",
                                     font=ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 70))
        else:
            img = Image.open(p).convert("RGB")
            if max(img.size) > 1800:
                img.thumbnail((1800, 1800), Image.LANCZOS)
        _imgs[name] = img
    return _imgs[name]


def photo_window(img, focus, effect, size, ts, tn):
    """Окно кадрирования исходника под карточку size с учётом эффекта; tn = 0..1 по сцене."""
    cw, ch = size
    sw, sh = img.size
    fx, fy = focus
    dx = dy = 0.0
    if effect == "zoom_in_fast":
        z = 1 + 0.30 * tn
    elif effect == "zoom_in_slow":
        z = 1 + 0.14 * tn
    elif effect == "shake":
        z = 1.10
        k = ts * 22
        dx, dy = 0.010 * (math.sin(k * 2.3) + 0.5 * math.sin(k * 5.1)), 0.010 * (math.cos(k * 2.9) + 0.5 * math.sin(k * 4.3))
    elif effect == "pan_left_to_right":
        z = 1.25
    elif effect == "zoom_out":
        z = 1.30 - 0.30 * ease_out(tn)
    else:
        sys.exit(f"неизвестный эффект: {effect}")
    z *= 1 + 0.07 * (1 - ease_out(ts / 0.3))  # «удар» зумом в начале кадра
    cover = max(cw / sw, ch / sh)
    ww, wh = cw / cover / z, ch / cover / z
    if effect == "pan_left_to_right":
        cx, cy = ww / 2 + (sw - ww) * ease_in_out(tn), fy * sh
    else:
        cx, cy = fx * sw, fy * sh
    cx = min(max(cx + dx * sw, ww / 2), sw - ww / 2)
    cy = min(max(cy + dy * sh, wh / 2), sh - wh / 2)
    return (max(cx - ww / 2, 0.0), max(cy - wh / 2, 0.0), min(cx + ww / 2, sw), min(cy + wh / 2, sh))


def photo_rgba(img, focus, effect, size, ts, tn, radius=56, border=True):
    w, h = size
    win = photo_window(img, focus, effect, size, ts, tn)
    p = img.resize((w, h), Image.LANCZOS, box=win).convert("RGBA")
    p.putalpha(rounded_mask(size, radius))
    if border:
        ImageDraw.Draw(p).rounded_rectangle((1, 1, w - 2, h - 2), radius, outline=NEON + (170,), width=3)
    return p, win


def white_card():
    c = Image.new("RGBA", (CW, CH), (0, 0, 0, 0))
    d = ImageDraw.Draw(c)
    d.rounded_rectangle((0, 0, CW - 1, CH - 1), 56, fill=(252, 249, 252, 255), outline=NEON + (150,), width=3)
    return c


# ---------- оверлеи карточек ----------
_scrim = {}


def scrim():
    if "a" not in _scrim:
        hh = 280
        a = np.zeros((hh, CW, 4), np.uint8)
        a[..., 3] = (np.linspace(0, 1, hh) ** 1.6 * 190).astype(np.uint8)[:, None]
        _scrim["a"] = Image.fromarray(a, "RGBA")
    return _scrim["a"]


def ov_chip(card, o, T):
    a = ease_out((T - o["at"]) / 0.25)
    if a <= 0:
        return
    f = font("body", 32, 700)
    cw_, chh = int(f.getlength(o["text"]) + 78), 62
    c = Image.new("RGBA", (cw_, chh), (0, 0, 0, 0))
    cd = ImageDraw.Draw(c)
    cd.rounded_rectangle((0, 0, cw_ - 1, chh - 1), 31, fill=(14, 10, 13, 215), outline=(255, 255, 255, 40), width=2)
    cd.ellipse((24, 23, 40, 39), fill=NEON)
    cd.text((54, chh / 2), o["text"], font=f, fill=(255, 255, 255), anchor="lm")
    card.alpha_composite(fade(c, a), (int(28 - (1 - a) * 40), 28))


def ov_counter(card, o, T):
    a = ease_out((T - o["at"]) / 0.15)
    if a <= 0:
        return
    card.alpha_composite(scrim(), (0, CH - scrim().height))
    v = o["from"] + (o["to"] - o["from"]) * ease_out((T - o["at"]) / o["dur"])
    f = font("title", o.get("size", 170), 900)
    layer = Image.new("RGBA", (CW, 260), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    txt = str(int(round(v))) + o.get("suffix", "")
    d.text((o["pos"][0] + 5, 14), txt, font=f, fill=NEON + (255,), stroke_width=0)
    d.text((o["pos"][0], 8), txt, font=f, fill=(255, 255, 255, 255), stroke_width=7, stroke_fill=(14, 10, 13, 255))
    card.alpha_composite(fade(layer, a), (0, o["pos"][1] - 8))


def ov_stamp(card, o, T):
    t0 = T - o["at"]
    if t0 < 0:
        return
    ss = 2
    f = font("title", o.get("size", 70) * ss, 900)
    tw = f.getlength(o["text"])
    pad = 30 * ss
    sw_, sh_ = int(tw + 2 * pad), int(o.get("size", 70) * ss * 1.25 + 2 * pad * 0.6)
    s = Image.new("RGBA", (sw_, sh_), (0, 0, 0, 0))
    d = ImageDraw.Draw(s)
    d.rounded_rectangle((0, 0, sw_ - 1, sh_ - 1), 26 * ss, fill=(255, 255, 255, 240), outline=NEON + (255,), width=9 * ss)
    d.text((sw_ / 2, sh_ / 2), o["text"], font=f, fill=NEON + (255,), anchor="mm")
    s = s.resize((sw_ // ss, sh_ // ss), Image.LANCZOS)
    k = 1 + 1.3 * (1 - ease_out(t0 / 0.16))  # «шлёп»: сверху вниз с увеличения
    s = s.resize((int(s.width * k), int(s.height * k)), Image.LANCZOS).rotate(o.get("angle", -8), resample=Image.BICUBIC,
                                                                            expand=True)
    shake = 7 * max(0, 1 - t0 / 0.3) * math.sin(t0 * 70)
    fade(s, clamp01(t0 / 0.06))
    card.alpha_composite(s, (int(o["pos"][0] - s.width / 2 + shake), int(o["pos"][1] - s.height / 2)))


_conf = {}


def ov_confetti(card, o, T):
    age = T - o["at"]
    if age < 0 or age > 2.2:
        return
    if "p" not in _conf:
        rs = np.random.RandomState(7)
        _conf["p"] = [(rs.uniform(-1, 1) * 420, -rs.uniform(500, 1000), rs.uniform(10, 22), rs.uniform(-8, 8),
                       [NEON, (255, 255, 255), (255, 150, 205), (255, 214, 235)][rs.randint(0, 4)]) for _ in range(90)]
    d = ImageDraw.Draw(card)
    for vx, vy, sz, rot, col in _conf["p"]:
        x = CW / 2 + vx * age
        y = CH * 0.78 + vy * age + 900 * age * age
        a = clamp01(1.9 - age) if age > 1.3 else 1
        if 0 <= x < CW and 0 <= y < CH:
            ang = rot * age
            c, s_ = math.cos(ang) * sz, math.sin(ang) * sz
            d.polygon([(x - c, y - s_), (x + s_ * 0.5, y - c * 0.5), (x + c, y + s_), (x - s_ * 0.5, y + c * 0.5)],
                      fill=col + (int(255 * a),))


def draw_glasses(card, scene, win, ts):
    """Смешные очки на Моне Лизе: падают сверху, отскакивают и блестят (координаты глаз — в пикселях исходника)."""
    g = scene["glasses"]
    t0 = ts - g.get("delay", 0.35)
    if t0 <= 0:
        return
    w, h = card.size
    k = w / (win[2] - win[0])
    (lx, ly), (rx, ry) = g["left"], g["right"]
    L = ((lx - win[0]) * k, (ly - win[1]) * k)
    R = ((rx - win[0]) * k, (ry - win[1]) * k)
    d = R[0] - L[0]
    rad, fw = 0.66 * d, 0.13 * d
    ss = 3
    pad = int(rad * 2.2)
    bw, bh = int(d + 2 * pad), int(2 * pad)
    spr = Image.new("RGBA", (bw * ss, bh * ss), (0, 0, 0, 0))
    sd = ImageDraw.Draw(spr)
    cy = pad * ss
    cxl, cxr = pad * ss, (pad + d) * ss
    R_, FW = rad * ss, fw * ss
    sd.line((cxl - R_, cy, cxl - R_ - 0.9 * d * ss, cy - 0.05 * d * ss), fill=(25, 16, 24, 255), width=int(FW * 0.8))
    sd.line((cxr + R_, cy, cxr + R_ + 0.9 * d * ss, cy - 0.05 * d * ss), fill=(25, 16, 24, 255), width=int(FW * 0.8))
    sd.line((cxl + R_ * 0.8, cy - R_ * 0.25, cxr - R_ * 0.8, cy - R_ * 0.25), fill=NEON + (255,), width=int(FW * 0.9))
    for cx in (cxl, cxr):
        sd.ellipse((cx - R_, cy - R_, cx + R_, cy + R_), fill=(14, 10, 16, 235), outline=NEON + (255,), width=int(FW))
        sd.ellipse((cx - R_ * 0.62, cy - R_ * 0.7, cx - R_ * 0.12, cy - R_ * 0.28), fill=(255, 255, 255, 120))
    spr = spr.resize((bw, bh), Image.LANCZOS)
    drop = (1 - bounce(t0 / 0.6)) * (L[1] + pad + 40)
    card.paste(spr, (int(L[0] - pad), int(L[1] - pad - drop)), spr)
    if t0 > 0.7:  # искорка на очках
        a = abs(math.sin((t0 - 0.7) * 5))
        sx, sy = L[0] + rad * 0.55, L[1] - rad * 0.55
        s = rad * 0.45 * a
        sp = Image.new("RGBA", (int(s * 4) + 2, int(s * 4) + 2), (0, 0, 0, 0))
        c = sp.width / 2
        ImageDraw.Draw(sp).polygon([(c, c - s * 1.6), (c + s * 0.3, c - s * 0.3), (c + s * 1.6, c), (c + s * 0.3, c + s * 0.3),
                                    (c, c + s * 1.6), (c - s * 0.3, c + s * 0.3), (c - s * 1.6, c), (c - s * 0.3, c - s * 0.3)],
                                   fill=(255, 255, 255, 255))
        card.paste(sp, (int(sx - c), int(sy - c)), sp)


OVERLAYS = {"chip": ov_chip, "counter": ov_counter, "stamp": ov_stamp, "confetti": ov_confetti}


def apply_overlays(card, scene, T):
    for o in scene.get("overlays", []):
        OVERLAYS[o["kind"]](card, o, T)


# ---------- типы карточек ----------
def card_photo(scene, T, ts):
    entries = scene.get("sequence") or [{"at": scene["start"], "image": scene["image"], "focus": scene["focus"],
                                        "effect": scene["effect"]}]
    idx = max(i for i, e in enumerate(entries) if T >= e["at"] or i == 0)

    def frame(i, tt):
        e = entries[i]
        end = entries[i + 1]["at"] if i + 1 < len(entries) else scene["end"]
        ets = max(tt - e["at"], 0.0)
        return photo_rgba(get_img(e["image"]), e["focus"], e["effect"], (CW, CH), ets, clamp01(ets / (end - e["at"])))

    card, win = frame(idx, T)
    if idx > 0 and T - entries[idx]["at"] < 0.18:  # быстрая смена кадра внутри сцены: кроссфейд со вспышкой
        prev, _ = frame(idx - 1, T)
        k = (T - entries[idx]["at"]) / 0.18
        card = Image.blend(prev, card, k)
    if scene.get("glasses"):
        draw_glasses(card, scene, win, ts)
    apply_overlays(card, scene, T)
    return card


def typed(text, t0, T, cps=22):
    n = int(max(T - t0, 0) * cps)
    s = text[:n]
    if 0 < n < len(text) and int(T * 4) % 2 == 0:
        s += "|"
    return s


def card_dossier(scene, T, ts):
    c = white_card()
    d = ImageDraw.Draw(c)
    for i, col in enumerate([(255, 120, 170), (255, 190, 215), (230, 220, 228)]):
        d.ellipse((44 + i * 26, 32, 60 + i * 26, 48), fill=col)
    d.text((176, 40), "ДОСЬЕ", font=font("body", 26, 800), fill=GREY, anchor="lm")
    d.line((30, 78, CW - 30, 78), fill=(235, 228, 234), width=2)
    # фото из полиции
    k = ease_back((ts - 0.15) / 0.4)
    mp, _ = photo_rgba(get_img("07_peruggia_mugshot.jpg"), [0.5, 0.4], "zoom_in_slow", (280, 330), ts, clamp01(ts / 4), 28)
    mp = mp.resize((max(int(280 * k), 1), max(int(330 * k), 1)), Image.LANCZOS)
    c.alpha_composite(fade(mp, clamp01((ts - 0.15) / 0.2)), (44 + (280 - mp.width) // 2, 108 + (330 - mp.height) // 2))
    tm = scene["t"]
    rows = [("ИМЯ", "Винченцо Перуджа", tm["name"], INK), ("РАБОТАЛ", "В Лувре", tm["work"], INK),
            ("СПОСОБ", "Под рабочим халатом", tm["method"], NEON)]
    for i, (lab, val, t0, col) in enumerate(rows):
        y = 112 + i * 108
        d.text((360, y), lab, font=font("body", 22, 800), fill=GREY)
        d.text((360, y + 34), typed(val, t0, T), font=font("title", 28, 800), fill=col)
    # рисунок 1911 выезжает снизу; до этого — серые «скелетоны»
    t_s = tm["strip"]
    if T < t_s + 0.1:
        for i, wd in enumerate([700, 560, 640]):
            d.rounded_rectangle((44, 480 + i * 56, 44 + wd, 504 + i * 56), 12, fill=(238, 232, 237))
    if T >= t_s:
        p = ease_back((T - t_s) / 0.45)
        ip, _ = photo_rgba(get_img("08_stealing_1911.jpg"), [0.5, 0.42], "zoom_in_slow", (792, 250), T - t_s,
                           clamp01((T - t_s) / 2), 28)
        f = font("body", 24, 700)
        d2 = ImageDraw.Draw(ip)
        tw = f.getlength("Рисунок, 1911") + 40
        d2.rounded_rectangle((18, 18, 18 + tw, 60), 21, fill=(14, 10, 13, 215))
        d2.text((38, 39), "Рисунок, 1911", font=f, fill=(255, 255, 255), anchor="lm")
        c.alpha_composite(fade(ip, clamp01((T - t_s) / 0.15)), (44, int(460 + (1 - p) * 300)))
    return c


def card_news(scene, T, ts):
    c = white_card()
    d = ImageDraw.Draw(c)
    t0, t1 = scene["t"]["count0"], scene["t"]["count1"]
    prog = ease_in_out((T - t0) / (t1 - t0))
    year = int(round(1911 + 2 * prog))
    d.text((CW / 2, 120), str(year), font=font("title", 190, 900), fill=NEON, anchor="mm")
    d.text((CW / 2, 232), "поиски шли два года", font=font("body", 34, 800), fill=GREY, anchor="mm")
    x0, x1, y = 44, CW - 44, 292
    d.rounded_rectangle((x0, y, x1, y + 20), 10, fill=(238, 232, 237))
    if prog > 0:
        d.rounded_rectangle((x0, y, x0 + max((x1 - x0) * prog, 20), y + 20), 10, fill=NEON)
    d.text((x0, y + 44), "1911", font=font("body", 24, 800), fill=GREY, anchor="lm")
    d.text((x1, y + 44), "1913", font=font("body", 24, 800), fill=GREY, anchor="rm")
    # газета, слегка наклонённая
    pw, ph = 792, 330
    k = ease_back((ts - 0.1) / 0.45)
    np_, _ = photo_rgba(get_img("05_newspapers.jpg"), [0.5, 0.5], "zoom_in_slow", (pw, ph), ts, clamp01(ts / 3.2), 28)
    np_ = np_.resize((max(int(pw * k), 1), max(int(ph * k), 1)), Image.LANCZOS).rotate(-2.5, resample=Image.BICUBIC, expand=True)
    c.alpha_composite(fade(np_, clamp01(ts / 0.2)), ((CW - np_.width) // 2, 380 + (ph - np_.height) // 2 + 10))
    return c


def bezier(p0, p1, p2, t):
    return ((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0],
            (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1])


def pin(c, xy, T, t0, label):
    a = ease_back((T - t0) / 0.35)
    if a <= 0:
        return
    x, y = xy
    r = 24 * a
    d = ImageDraw.Draw(c)
    d.ellipse((x - r - 10, y - r - 10, x + r + 10, y + r + 10), fill=(255, 214, 235, 255))
    d.ellipse((x - r, y - r, x + r, y + r), fill=NEON + (255,))
    d.ellipse((x - r * 0.38, y - r * 0.38, x + r * 0.38, y + r * 0.38), fill=(255, 255, 255, 255))
    if a > 0.6:
        d.text((x, y + 58), label, font=font("title", 34, 800), fill=INK, anchor="mm")


def card_map(scene, T, ts):
    c = white_card()
    d = ImageDraw.Draw(c)
    for gx in range(50, CW, 44):  # точечная сетка карты
        for gy in range(40, CH, 44):
            d.ellipse((gx - 2, gy - 2, gx + 2, gy + 2), fill=(236, 228, 235))
    tm = scene["t"]
    P, F, C = (220, 190), (640, 420), (500, 130)
    prog = ease_in_out((T - tm["route0"]) / (tm["route1"] - tm["route0"]))
    pin(c, P, T, tm["pin_paris"], "Париж")
    n = int(70 * prog)
    for i in range(70):  # бледный маршрут целиком, чтобы карта читалась с первого кадра
        if i % 3 != 2:
            x, y = bezier(P, C, F, i / 70)
            d.ellipse((x - 4, y - 4, x + 4, y + 4), fill=(250, 214, 233, 255))
    for i in range(n):  # пунктирный маршрут
        if i % 3 == 2:
            continue
        x, y = bezier(P, C, F, i / 70)
        d.ellipse((x - 5, y - 5, x + 5, y + 5), fill=NEON + (255,))
    if prog > 0:
        x, y = bezier(P, C, F, prog)
        r = 14 + 4 * math.sin(T * 9)
        d.ellipse((x - r - 8, y - r - 8, x + r + 8, y + r + 8), fill=(255, 46, 147, 70))
        d.ellipse((x - 11, y - 11, x + 11, y + 11), fill=(255, 255, 255, 255), outline=NEON + (255,), width=5)
    pin(c, F, T, tm["pin_flo"], "Флоренция")
    if T > tm["offer"]:  # плашка с предложением продать
        a = ease_out((T - tm["offer"]) / 0.3)
        f = font("body", 30, 800)
        txt = "Продаёт картину"
        bw = int(f.getlength(txt) + 70)
        b = Image.new("RGBA", (bw, 58), (0, 0, 0, 0))
        ImageDraw.Draw(b).rounded_rectangle((0, 0, bw - 1, 57), 29, fill=(22, 14, 20, 235))
        ImageDraw.Draw(b).text((bw / 2, 29), txt, font=f, fill=(255, 255, 255), anchor="mm")
        c.alpha_composite(fade(b, a), (330, 300))
    if T > tm["antikvar"]:
        a = ease_back((T - tm["antikvar"]) / 0.35)
        f = font("body", 30, 800)
        bw = 210
        b = Image.new("RGBA", (bw, 58), (0, 0, 0, 0))
        ImageDraw.Draw(b).rounded_rectangle((0, 0, bw - 1, 57), 29, fill=NEON + (255,))
        ImageDraw.Draw(b).text((bw / 2, 29), "антиквар", font=f, fill=(255, 255, 255), anchor="mm")
        b = b.resize((max(int(bw * a), 1), max(int(58 * a), 1)), Image.LANCZOS)
        c.alpha_composite(b, (700 - b.width // 2, 478 - b.height // 2))
    # первая полоса Excelsior выезжает справа, как «улика»
    t_n = tm["paper"]
    if T >= t_n:
        p = ease_back((T - t_n) / 0.5)
        pw, ph = 440, 280
        ep, _ = photo_rgba(get_img("09_excelsior_1913.jpg"), [0.5, 0.1], "zoom_in_slow", (pw, ph), T - t_n, clamp01((T - t_n) / 3), 24)
        f = font("body", 22, 700)
        ImageDraw.Draw(ep).rounded_rectangle((14, ph - 54, 14 + f.getlength("L'Excelsior · 1913") + 30, ph - 14), 18, fill=(14, 10, 13, 215))
        ImageDraw.Draw(ep).text((29, ph - 34), "L'Excelsior · 1913", font=f, fill=(255, 255, 255), anchor="lm")
        ep = ep.rotate(5, resample=Image.BICUBIC, expand=True)
        c.alpha_composite(ep, (int(CW - 40 - ep.width + (1 - p) * 520), CH - 40 - ep.height))
    return c


CARD_TYPES = {"photo": card_photo, "dossier": card_dossier, "news": card_news, "map": card_map}


# ---------- привязка сцен к словам озвучки ----------
def word_time(words, spec):
    """spec: {"w": индекс слова, "d": сдвиг, "end": брать конец слова}."""
    w = words[spec["w"]]
    return (w["end"] if spec.get("end") else w["start"]) + spec.get("d", 0.0)


def resolve_cfg(cfg, words):
    """Тайминги в script.json заданы номерами слов озвучки: «from» у сцены, «w» у оверлеев и меток.
    Здесь они превращаются в секунды, поэтому при любой озвучке монтаж сам подстраивается под речь."""
    sc = cfg["scenes"]
    for i, s in enumerate(sc):
        s["start"] = 0.0 if i == 0 else max(words[s["from"]]["start"] - 0.12, 0.0)
    for i, s in enumerate(sc):
        s["end"] = sc[i + 1]["start"] if i + 1 < len(sc) else cfg["duration"]
        s["t"] = {k: word_time(words, v) if isinstance(v, dict) else s["start"] + v for k, v in s.get("marks", {}).items()}
        for o in s.get("overlays", []) + s.get("sequence", []):
            a = o["at"]
            o["at"] = word_time(words, a) if isinstance(a, dict) else s["start"] + a
    tl = cfg["timeline"]
    tl["anchors"] = [[words[w]["start"], p] for w, p in tl["anchors"]] + [[cfg["duration"], tl["anchors"][-1][1]]]


# ---------- сцена ----------
def draw_chapter(base, scene, prev, ts):
    n, name = scene["chapter"]
    first = prev is None or prev["chapter"][0] != n
    p = ease_back(ts / 0.45) if first else 1.0
    fb = font("title", 54, 800)
    total = 100 + 26 + fb.getlength(name)
    x0 = (W - total) / 2
    layer = Image.new("RGBA", (int(total) + 60, 130), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.rounded_rectangle((30, 15, 130, 115), 30, fill=NEON + (255,))
    d.text((80, 66), str(n) if n else "!", font=font("title", 62, 900), fill=(255, 255, 255), anchor="mm")
    d.text((156, 66), name, font=fb, fill=(255, 255, 255), anchor="lm")
    if p != 1.0:
        s = max(p, 0.01)
        layer = layer.resize((max(int(layer.width * s), 1), max(int(layer.height * s), 1)), Image.LANCZOS)
    fade(layer, clamp01(ts / 0.15) if first else 1)
    base.paste(layer, (int(x0 - 30 + (total + 60 - layer.width) / 2), HEADER_Y + (130 - layer.height) // 2), layer)


def place_card(base, card, scene, T, ts):
    p = ease_back(ts / 0.5)
    s = 0.86 + 0.14 * p
    sign = 1 if scene["id"] % 2 else -1
    angle = sign * (1 - p) * 7 + 0.9 * math.sin(T * 1.6)
    card = card.resize((int(CW * s), int(CH * s)), Image.LANCZOS).rotate(angle, resample=Image.BICUBIC, expand=True)
    fade(card, clamp01(ts / 0.2))
    cx = CX + CW / 2 + 6 * math.sin(T * 1.1)
    cy = CY + CH / 2 + 8 * math.sin(T * 1.5 + 1)
    base.paste(card, (int(cx - card.width / 2), int(cy - card.height / 2)), card)


def render_scene(cfg, i, T):
    sc = cfg["scenes"]
    scene, prev = sc[i], (sc[i - 1] if i else None)
    ts = max(T - scene["start"], 0.0)
    base = animated_background(T)
    draw_chapter(base, scene, prev, ts)
    place_card(base, CARD_TYPES[scene["type"]](scene, T, ts), scene, T, ts)
    return base


# ---------- глобальный слой: бегущая строка и таймлайн ----------
def make_chunks(words):
    chunks, cur, chars = [], [], 0
    for i, w in enumerate(words):
        cur.append(i)
        chars += len(w["word"]) + 1
        if re.search(r"[.,!?:]$", w["word"]) or chars > 30:
            chunks.append(cur)
            cur, chars = [], 0
    if cur:
        chunks.append(cur)
    return chunks


def layout_chunks(words, chunks):
    f = font("body", 68, 800)
    sp = f.getlength(" ")
    out = []
    for ch in chunks:
        lines, line, lw = [], [], 0
        for i in ch:
            wl = f.getlength(words[i]["word"])
            if line and lw + sp + wl > 920:
                lines.append(line)
                line, lw = [], 0
            lw += (sp if line else 0) + wl
            line.append((i, wl))
        lines.append(line)
        placed = []
        for ln in lines:
            tot = sum(wl for _, wl in ln) + sp * (len(ln) - 1)
            x = (W - tot) / 2
            row = []
            for i, wl in ln:
                row.append((i, x, wl))
                x += wl + sp
            placed.append(row)
        out.append(placed)
    return out


def draw_caption(base, T, words, chunks, layouts):
    cur = None
    for k, ch in enumerate(chunks):
        s = words[ch[0]]["start"] - 0.05
        nxt = words[chunks[k + 1][0]]["start"] - 0.05 if k + 1 < len(chunks) else 1e9
        if s <= T < min(words[ch[-1]]["end"] + 0.45, nxt):
            cur = (k, s)
            break
    if not cur:
        return
    k, s = cur
    f = font("body", 68, 800)
    lh = 88
    layer = Image.new("RGBA", (W, lh * len(layouts[k]) + 30), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for li, row in enumerate(layouts[k]):
        y = li * lh + 10
        for i, x, wl in row:
            w = words[i]
            # как в прошлой версии: сказанные слова белые, текущее розовое, будущие серые (без рамки-выделения)
            col = (255, 92, 175, 255) if w["start"] <= T < w["end"] else \
                (255, 255, 255, 255) if T >= w["start"] else (128, 118, 128, 255)
            d.text((x, y), w["word"], font=f, fill=col)
    t0 = T - s
    fade(layer, ease_out(t0 / 0.12))
    base.paste(layer, (0, int(CAPTION_Y + (1 - ease_out(t0 / 0.12)) * 18)), layer)


def tl_pos(cfg, T):
    a = cfg["timeline"]["anchors"]
    for (t0, p0), (t1, p1) in zip(a, a[1:]):
        if t0 <= T <= t1:
            return p0 + (p1 - p0) * ease_in_out((T - t0) / (t1 - t0)) if t1 > t0 else p1
    return a[-1][1]


def draw_timeline(cfg, base, T):
    nodes = cfg["timeline"]["nodes"]
    pos = tl_pos(cfg, T)
    layer = Image.new("RGBA", (W, 190), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x0, step, ly = 190, 350, 92
    xn = lambda i: x0 + step * i
    d.rounded_rectangle((x0, ly - 4, xn(len(nodes) - 1), ly + 4), 4, fill=(110, 100, 110, 150))
    if pos > 0:
        d.rounded_rectangle((x0, ly - 4, x0 + step * pos, ly + 4), 4, fill=NEON + (255,))
    for i, n in enumerate(nodes):
        act = pos >= i - 0.01
        near = max(0.0, 1 - abs(pos - i) * 3)
        r = 17 + 5 * near
        x = xn(i)
        if act:
            d.ellipse((x - r - 8, ly - r - 8, x + r + 8, ly + r + 8), fill=NEON + (int(60 + 60 * near),))
            d.ellipse((x - r, ly - r, x + r, ly + r), fill=NEON + (255,))
            d.ellipse((x - 6, ly - 6, x + 6, ly + 6), fill=(255, 255, 255, 255))
        else:
            d.ellipse((x - r, ly - r, x + r, ly + r), fill=(30, 22, 28, 255), outline=(130, 120, 130, 255), width=4)
        col = (255, 255, 255, 255) if act else (130, 120, 130, 255)
        d.text((x, 38), n["year"], font=font("title", 40, 800), fill=col, anchor="mm")
        d.text((x, 150), n["label"], font=font("body", 28, 700), fill=col, anchor="mm")
    if 0 < pos < len(nodes) - 1 + 0.001:  # бегущая точка «сейчас»
        x = x0 + step * pos
        r = 9 + 3 * math.sin(T * 8)
        d.ellipse((x - r, ly - r, x + r, ly + r), fill=(255, 255, 255, 255))
    base.paste(layer, (0, TL_Y), layer)


# ---------- Whisper ----------
def transcribe(cfg):
    from faster_whisper import WhisperModel
    model = WhisperModel("small", device="cpu", compute_type="int8")
    # декодируем через ffmpeg: декодер PyAV в faster-whisper несовместим с установленной версией av
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(ROOT / cfg["voiceover"]), "-f", "f32le", "-ac", "1",
                          "-ar", "16000", "-"], capture_output=True, check=True).stdout
    audio = np.frombuffer(raw, dtype=np.float32)
    segs, _ = model.transcribe(audio, language="ru", word_timestamps=True,
                               initial_prompt=cfg["voiceover_text"].replace("\u0301", ""))
    words = [{"word": w.word.strip(), "start": w.start, "end": w.end} for s in segs for w in s.words]
    (BUILD / "words.json").write_text(json.dumps(words, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{len(words)} слов -> build/words.json")


def norm(s):
    return re.sub(r"[^\w]", "", s.lower().replace("\u0301", "").replace("ё", "е"))


def load_words(cfg):
    p = BUILD / "words.json"
    if not p.exists():
        return None
    words = json.loads(p.read_text(encoding="utf-8"))
    script_words = [w.replace("\u0301", "") for w in cfg["voiceover_text"].split()]  # знак ударения только для озвучки
    sm = difflib.SequenceMatcher(None, [norm(w) for w in script_words], [norm(w["word"]) for w in words], autojunk=False)
    out = [None] * len(script_words)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n):
            out[a + k] = {"word": script_words[a + k], "start": words[b + k]["start"], "end": words[b + k]["end"]}
    for i, w in enumerate(out):  # слова сценария без пары: время берём между соседями
        if w is None:
            prev = next((out[j] for j in range(i - 1, -1, -1) if out[j]), None)
            nxt = next((out[j] for j in range(i + 1, len(out)) if out[j]), None)
            s = prev["end"] if prev else 0.0
            out[i] = {"word": script_words[i], "start": s, "end": max(nxt["start"] if nxt else s + 0.3, s + 0.1)}
    # слово подсвечено до начала следующего (без дыр между словами)
    for i in range(len(out) - 1):
        out[i]["end"] = max(out[i]["end"], min(out[i + 1]["start"], out[i]["end"] + 0.25))
    print(f"слова: {len(out)}, Whisper нашёл {len(words)}, совпало {sum(n for _, _, n in sm.get_matching_blocks())}")
    return out


# ---------- переходы ----------
_grid = {}


def grid():
    if not _grid:
        _grid["y"], _grid["x"] = np.mgrid[0:H, 0:W].astype(np.float32)
    return _grid["x"], _grid["y"]


def transition(kind, a, b, p):
    """a -> b, p = 0..1."""
    e = ease_in_out(p)
    if kind == "push":
        out = Image.new("RGB", (W, H))
        off = int(W * e)
        out.paste(a, (-off, 0))
        out.paste(b, (W - off, 0))
        return out
    if kind == "push_up":
        out = Image.new("RGB", (W, H))
        off = int(H * e)
        out.paste(a, (0, -off))
        out.paste(b, (0, H - off))
        return out
    if kind == "iris":
        r = e * 1250
        m = Image.new("L", (W, H), 0)
        ImageDraw.Draw(m).ellipse((W / 2 - r, H / 2 - r, W / 2 + r, H / 2 + r), fill=255)
        out = Image.composite(b, a, m)
        if 0 < e < 1:
            ImageDraw.Draw(out).ellipse((W / 2 - r, H / 2 - r, W / 2 + r, H / 2 + r), outline=NEON, width=16)
        return out
    if kind == "wipe":
        x, y = grid()
        d = x + 0.5 * y
        thr = e * (W + 0.5 * H + 80) - 40
        an, bn = np.asarray(a, np.float32), np.asarray(b, np.float32)
        out = np.where((d < thr)[..., None], bn, an)
        out = np.where((np.abs(d - thr) < 14)[..., None], np.array(NEON, np.float32), out)
        return Image.fromarray(out.astype(np.uint8))
    if kind == "blinds":
        n = 6
        bw = W // n + 1
        m = np.zeros((H, W), np.uint8)
        for i in range(n):
            hh = int(H * clamp01((p * 1.5 - 0.09 * i) / 0.55))
            x0 = i * (W // n)
            if i % 2 == 0:
                m[:hh, x0:x0 + bw] = 255
            else:
                m[H - hh:, x0:x0 + bw] = 255
        return Image.composite(b, a, Image.fromarray(m))
    if kind == "glitch":
        base = np.asarray(a if p < 0.5 else b).copy()
        k = math.sin(math.pi * p)
        rs = np.random.RandomState(int(p * 40))
        for _ in range(9):
            y0 = rs.randint(0, H - 80)
            hh = rs.randint(20, 160)
            base[y0:y0 + hh] = np.roll(base[y0:y0 + hh], int(rs.randint(-140, 140) * k), axis=1)
        s = int(48 * k)
        base[..., 0] = np.roll(base[..., 0], s, axis=1)
        base[..., 2] = np.roll(base[..., 2], -s, axis=1)
        return Image.fromarray(base)
    if kind == "spin":
        sc = 1 + 0.6 * e
        big = a.resize((int(W * sc), int(H * sc)), Image.BILINEAR).rotate(-22 * e, resample=Image.BILINEAR)
        left, top = (big.width - W) // 2, (big.height - H) // 2
        return Image.blend(big.crop((left, top, left + W, top + H)), b, e)
    if kind == "zoom":
        s = 1 + 0.18 * e
        big = a.resize((int(W * s), int(H * s)), Image.BILINEAR)
        left, top = (big.width - W) // 2, (big.height - H) // 2
        a2 = big.crop((left, top, left + W, top + H))
        s2 = 0.90 + 0.10 * e
        sm = b.resize((int(W * s2), int(H * s2)), Image.BILINEAR)
        b2 = a2.copy()
        b2.paste(sm, ((W - sm.width) // 2, (H - sm.height) // 2))
        return Image.blend(a2, b2, e)
    base = a if p < 0.5 else b  # flash
    return Image.blend(base, Image.new("RGB", (W, H), (255, 190, 225)), 0.85 * (1 - abs(p - 0.5) * 2))


# ---------- сборка ----------
def frame_at(cfg, T, words, chunks, layouts):
    sc, tr = cfg["scenes"], cfg["transition"]
    kinds = cfg["transitions"]
    idx = next((i for i, s in enumerate(sc) if T < s["end"]), len(sc) - 1)
    b = sc[idx]["end"]
    if idx + 1 < len(sc) and T >= b - tr / 2:
        frame = transition(kinds[idx % len(kinds)], render_scene(cfg, idx, T), render_scene(cfg, idx + 1, T),
                           clamp01((T - (b - tr / 2)) / tr))
    elif idx > 0 and T < sc[idx]["start"] + tr / 2:
        frame = transition(kinds[(idx - 1) % len(kinds)], render_scene(cfg, idx - 1, T), render_scene(cfg, idx, T),
                           clamp01((T - (sc[idx]["start"] - tr / 2)) / tr))
    else:
        frame = render_scene(cfg, idx, T)
    draw_timeline(cfg, frame, T)
    if words:
        draw_caption(frame, T, words, chunks, layouts)
    return frame


def main():
    cfg = load()
    _cfg.update(cfg)
    BUILD.mkdir(exist_ok=True)
    (ROOT / "output").mkdir(exist_ok=True)
    if "--transcribe" in sys.argv:
        return transcribe(cfg)

    vo = ROOT / cfg["voiceover"]
    if not vo.exists():
        sys.exit("Нет озвучки: монтаж привязан к словам озвучки.")
    vo_dur = float(probe(vo))
    if cfg["duration"] == "auto":  # ролик = озвучка + короткий хвост под fade-out музыки
        cfg["duration"] = round(vo_dur + 0.5, 2)
    total, fps = cfg["duration"], cfg["fps"]
    if vo_dur > total:
        sys.exit(f"Озвучка {vo_dur:.2f} с длиннее ролика {total} с: обрезать нельзя.")
    words = load_words(cfg)
    resolve_cfg(cfg, words)
    chunks = make_chunks(words) if words else None
    layouts = layout_chunks(words, chunks) if words else None
    background()

    if "--stills" in sys.argv:
        out = BUILD / "stills"
        out.mkdir(exist_ok=True)
        times = [float(a) for a in sys.argv if re.fullmatch(r"\d+(\.\d+)?", a)] or [1.0, 5.8, 9.5, 14.5, 18.5, 26.0, 31.0]
        for t in times:
            frame_at(cfg, t, words, chunks, layouts).save(out / f"t{t:05.2f}.png")
        print("отсутствуют:", sorted(set(missing)) or "нет")
        return print("кадры в build/stills/")

    out = ROOT / "output" / cfg.get("output", "mona_lisa_v1.mp4")
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(fps),
           "-i", "-"]
    if vo.exists():
        cmd += ["-i", str(vo)]
        music = ROOT / cfg.get("music", "")
        has_music = music.is_file()
        if has_music:
            cmd += ["-i", str(music)]
        vg = f"volume={cfg.get('voice_db', 2.5)}dB"  # голос новой озвучки тише прежней: подтягиваем
        af = [f"[1:a]apad=whole_dur={total},{vg},asplit=2[voice][vsc]" if has_music else f"[1:a]apad=whole_dur={total},{vg}[voice]"]
        mix = ["[voice]"]
        if has_music:
            # музыка под голосом тише примерно на 18-20 дБ: -12 дБ базово + ducking по голосу; в конце fade-out 1 с
            af.append(f"[2:a]atrim=0:{total},asetpts=PTS-STARTPTS,volume={cfg.get('music_db', -12)}dB,"
                      f"afade=t=in:d=0.4,afade=t=out:st={total - 1.0}:d=1.0[m]")
            af.append("[m][vsc]sidechaincompress=threshold=0.03:ratio=8:attack=15:release=350[md]")
            mix.append("[md]")
        af.append("".join(mix) + f"amix=inputs={len(mix)}:duration=first:normalize=0,alimiter=limit=0.95[a]")
        cmd += ["-filter_complex", ";".join(af), "-map", "0:v", "-map", "[a]", "-c:a", "aac", "-b:a", "192k", "-ar",
                "48000", "-ac", "2"]
    cmd += ["-t", str(total), "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-r", str(fps),
            "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(out)]
    errlog = BUILD / "ffmpeg_err.log"  # в файл, а не в PIPE: переполненный pipe вешает ffmpeg
    with open(errlog, "wb") as ef:
        p = subprocess.Popen(cmd, cwd=ROOT, stdin=subprocess.PIPE, stderr=ef)
        n = round(total * fps)
        t0 = time.time()
        for i in range(n):
            p.stdin.write(frame_at(cfg, i / fps, words, chunks, layouts).tobytes())
            if i % 15 == 0:
                print(f"кадр {i}/{n} ({100 * i // n}%), {time.time() - t0:.0f} с", flush=True)
        p.stdin.close()
        rc = p.wait()
    if rc:
        sys.exit("ffmpeg error:\n" + errlog.read_text(encoding="utf-8", errors="replace")[-3000:])

    wh = probe(out, "stream=width,height").replace("\n", " ")
    print(f"длительность: {float(probe(out)):.2f} с | разрешение: {wh} | размер: {out.stat().st_size / 1e6:.1f} МБ")
    print("озвучка:", f"{vo_dur:.2f} с" if vo_dur else "нет")
    print("субтитры:", "вшиты" if words else "пропущены")
    print("отсутствующие картинки:", sorted(set(missing)) or "нет")


if __name__ == "__main__":
    main()
