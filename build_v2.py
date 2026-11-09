"""Сборка ролика по script.json: покадровая отрисовка (Pillow) + кодирование (ffmpeg).

python scripts/build.py              собрать ролик (субтитры берутся из build/words.json)
python scripts/build.py --transcribe распознать озвучку (faster-whisper), сохранить build/words.json
python scripts/build.py --stills     сохранить контрольные кадры в build/stills/
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
SAFE_TOP, SAFE_BOTTOM = 150, 250  # зона интерфейса TikTok

NEON = (255, 46, 147)  # неоново-розовый акцент
NEON_HOT = (255, 92, 175)  # подсветка текущего слова в субтитрах
THEMES = {
    "dark": {"bg": (12, 9, 12), "glow": (210, 30, 125), "glow_a": 0.34, "text": (255, 255, 255), "accent": NEON},
    "light": {"bg": (246, 240, 243), "glow": (255, 130, 195), "glow_a": 0.50, "text": (20, 14, 18),
              "accent": (214, 0, 104)},
}
CARD = (100, 580, 880, 760)  # x, y, w, h
TITLE_Y = 310
SUB_BOTTOM = 1625  # низ плашки субтитров (нижняя треть, выше зоны интерфейса)
# переход на каждом стыке сцен (по кругу): все разные подряд
TRANSITIONS = ["glitch", "push", "iris", "blinds", "zoom", "wipe", "flash", "push_up", "spin", "iris", "glitch",
               "wipe", "zoom"]


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


def fade(layer, a):
    if a < 1:
        layer.putalpha(layer.getchannel("A").point(lambda v: int(v * a)))
    return layer


_fonts = {}


def font(cfg, kind, size, weight):
    key = (kind, size, weight)
    if key not in _fonts:
        f = ImageFont.truetype(str(ROOT / cfg["fonts"][kind]), size)
        f.set_variation_by_axes([weight])
        _fonts[key] = f
    return _fonts[key]


def rounded_mask(size, r):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), r, fill=255)
    return m


# ---------- фон ----------
_bg_cache, _orb_cache = {}, {}


def background(theme):
    if theme in _bg_cache:
        return _bg_cache[theme]
    t = THEMES[theme]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    cx, cy = CARD[0] + CARD[2] / 2, CARD[1] + CARD[3] / 2
    d = np.sqrt((xx - cx) ** 2 + ((yy - cy) / 1.15) ** 2)
    a = (t["glow_a"] * np.exp(-((d / 560) ** 2)))[..., None]
    img = np.array(t["bg"], np.float32) * (1 - a) + np.array(t["glow"], np.float32) * a
    out = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8), "RGB")
    x, y, w, h = CARD
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    col = (0, 0, 0, 110) if theme == "light" else NEON + (80,)
    ImageDraw.Draw(sh).rounded_rectangle((x - 6, y + 14, x + w + 6, y + h + 30), 60, fill=col)
    out = Image.alpha_composite(out.convert("RGBA"), sh.filter(ImageFilter.GaussianBlur(40))).convert("RGB")
    _bg_cache[theme] = out
    return out


def orb(theme):
    if theme not in _orb_cache:
        s = Image.new("RGBA", (900, 900), (0, 0, 0, 0))
        col = (255, 60, 160, 70) if theme == "dark" else (255, 90, 180, 70)
        ImageDraw.Draw(s).ellipse((250, 250, 650, 650), fill=col)
        _orb_cache[theme] = s.filter(ImageFilter.GaussianBlur(90))
    return _orb_cache[theme]


def animated_background(theme, T):
    """Статичный фон + два плывущих световых пятна: фон не стоит на месте."""
    base = background(theme).copy().convert("RGBA")
    o = orb(theme)
    for k, (ax, ay, sp, ph) in enumerate([(300, 220, 0.55, 0.0), (260, 300, 0.40, 2.1)]):
        x = W / 2 + ax * math.sin(T * sp + ph) - 450
        y = (380 if k == 0 else 1500) + ay * math.cos(T * sp * 1.3 + ph) - 450
        base.alpha_composite(o, (int(x), int(y)))
    return base.convert("RGB")


# ---------- сцена ----------
def placeholder(scene):
    img = Image.new("RGB", (1200, 1000), (128, 128, 128))
    f = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 70)
    ImageDraw.Draw(img).multiline_text((600, 500), f"Сцена {scene['id']}\n{scene['image']}", fill="white", font=f,
                                       anchor="mm", align="center")
    return img


def load_image(scene, missing):
    p = ROOT / "assets" / "images" / scene["image"]
    if not p.exists():
        if scene["image"] not in missing:
            missing.append(scene["image"])
        return placeholder(scene)
    img = Image.open(p).convert("RGB")
    if max(img.size) > 1800:
        img.thumbnail((1800, 1800), Image.LANCZOS)
    return img


def photo_window(img, scene, ts, tn):
    """Окно кадрирования исходника под карточку с учётом эффекта; tn = 0..1 по сцене."""
    effect = scene["effect"]
    cw, ch = CARD[2], CARD[3]
    sw, sh = img.size
    fx, fy = scene.get("focus", [0.5, 0.5])
    dx = dy = 0.0
    if effect == "zoom_in_fast_fade_dark":
        z = 1 + 0.30 * ease_out(tn * 1.6)
    elif effect == "zoom_in_slow":
        z = 1 + 0.14 * tn
    elif effect == "zoom_in_fast":
        z = 1 + 0.30 * tn
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
    z *= 1 + 0.07 * (1 - ease_out(ts / 0.3))  # «удар» зумом в начале каждой сцены
    cover = max(cw / sw, ch / sh)
    ww, wh = cw / cover / z, ch / cover / z
    if effect == "pan_left_to_right":
        cx, cy = ww / 2 + (sw - ww) * ease_in_out(tn), fy * sh
    else:
        cx, cy = fx * sw, fy * sh
    cx = min(max(cx + dx * sw, ww / 2), sw - ww / 2)
    cy = min(max(cy + dy * sh, wh / 2), sh - wh / 2)
    return (max(cx - ww / 2, 0.0), max(cy - wh / 2, 0.0), min(cx + ww / 2, sw), min(cy + wh / 2, sh))


def layout_title(cfg, scene, size=80, max_w=930):
    f = font(cfg, "title", size, 800)
    text, acc = scene["on_screen_text"], scene.get("accent", "")
    words = text.split()
    start = text.find(acc) if acc else -1
    flags, pos = [], 0
    for w in words:
        i = text.index(w, pos)
        pos = i + len(w)
        flags.append(start >= 0 and i >= start and pos <= start + len(acc))
    lines, cur, cw_ = [], [], 0
    for w, fl in zip(words, flags):
        if cur and cw_ + f.getlength(w) > max_w:
            lines.append(cur)
            cur, cw_ = [], 0
        cur.append((w, fl))
        cw_ += f.getlength(w + " ")
    lines.append(cur)
    return f, lines


def draw_title(cfg, scene, base, ts):
    """Заголовок: слова вылетают по одному с отскоком."""
    th = THEMES[scene["theme"]]
    f, lines = layout_title(cfg, scene)
    lh, k = 100, 0
    for li, line in enumerate(lines):
        total = sum(f.getlength(w + " ") for w, _ in line) - f.getlength(" ")
        x = (W - total) / 2
        for w, fl in line:
            t0 = ts - 0.07 * k
            k += 1
            wl = f.getlength(w)
            if t0 > 0:
                layer = Image.new("RGBA", (int(wl) + 40, lh + 20), (0, 0, 0, 0))
                ImageDraw.Draw(layer).text((20, 0), w, font=f, fill=th["accent"] if fl else th["text"])
                fade(layer, clamp01(t0 / 0.15))
                y = TITLE_Y + li * lh + (1 - ease_back(t0 / 0.4)) * 60
                base.paste(layer, (int(x) - 20, int(y)), layer)
            x += f.getlength(w + " ")


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


def draw_glasses(card, scene, win, ts):
    """Смешные очки на Моне Лизе: падают сверху, отскакивают и блестят. Координаты глаз заданы в пикселях исходника."""
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
    R_ = rad * ss
    FW = fw * ss
    sd.line((cxl - R_, cy, cxl - R_ - 0.9 * d * ss, cy - 0.05 * d * ss), fill=(25, 16, 24, 255), width=int(FW * 0.8))  # дужки
    sd.line((cxr + R_, cy, cxr + R_ + 0.9 * d * ss, cy - 0.05 * d * ss), fill=(25, 16, 24, 255), width=int(FW * 0.8))
    sd.line((cxl + R_ * 0.8, cy - R_ * 0.25, cxr - R_ * 0.8, cy - R_ * 0.25), fill=NEON + (255,), width=int(FW * 0.9))  # мостик
    for cx in (cxl, cxr):
        sd.ellipse((cx - R_, cy - R_, cx + R_, cy + R_), fill=(14, 10, 16, 235), outline=NEON + (255,), width=int(FW))
        sd.ellipse((cx - R_ * 0.62, cy - R_ * 0.7, cx - R_ * 0.12, cy - R_ * 0.28), fill=(255, 255, 255, 120))  # блик
    spr = spr.resize((bw, bh), Image.LANCZOS)
    # падение сверху с отскоком; затем мелкое «подмигивание» блика
    drop = (1 - bounce(t0 / 0.6)) * (L[1] + pad + 40)
    pos = (int(L[0] - pad), int(L[1] - pad - drop))
    card.paste(spr, pos, spr)
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


def draw_card(cfg, scene, img, base, T, ts, tn, fade_dark):
    x, y, w, h = CARD
    win = photo_window(img, scene, ts, tn)
    photo = img.resize((w, h), Image.LANCZOS, box=win)
    if fade_dark < 1:
        photo = ImageEnhance.Brightness(photo).enhance(fade_dark)
    card = photo.convert("RGBA")
    if scene.get("glasses"):
        draw_glasses(card, scene, win, ts)
    card.putalpha(rounded_mask((w, h), 56))
    ImageDraw.Draw(card).rounded_rectangle((1, 1, w - 2, h - 2), 56, outline=NEON + (170,), width=3)
    credit = scene.get("credit")
    if credit:  # подпись автора мелким текстом у фото (лицензия CC BY)
        f = font(cfg, "body", 24, 600)
        cw_, chh = int(f.getlength(credit) + 36), 44
        c = Image.new("RGBA", (cw_, chh), (0, 0, 0, 0))
        ImageDraw.Draw(c).rounded_rectangle((0, 0, cw_ - 1, chh - 1), 22, fill=(14, 10, 13, 190))
        ImageDraw.Draw(c).text((18, chh / 2), credit, font=f, fill=(255, 255, 255, 235), anchor="lm")
        card.alpha_composite(c, (24, h - chh - 24))
    chip = scene.get("chip")
    if chip and ts > 0.45:
        a = ease_out((ts - 0.45) / 0.25)
        f = font(cfg, "body", 32, 700)
        cw_, chh = int(f.getlength(chip) + 78), 62
        c = Image.new("RGBA", (cw_, chh), (0, 0, 0, 0))
        cd = ImageDraw.Draw(c)
        cd.rounded_rectangle((0, 0, cw_ - 1, chh - 1), 31, fill=(14, 10, 13, 210), outline=(255, 255, 255, 40), width=2)
        cd.ellipse((24, 23, 40, 39), fill=NEON)
        cd.text((54, chh / 2), chip, font=f, fill=(255, 255, 255), anchor="lm")
        card.alpha_composite(fade(c, a), (int(28 - (1 - a) * 40), 28))
    # появление: масштаб с отскоком, лёгкий поворот; затем плавание и покачивание
    p = ease_back(ts / 0.5)
    s = 0.86 + 0.14 * p
    sign = 1 if scene["id"] % 2 else -1
    angle = sign * (1 - p) * 7 + 0.9 * math.sin(T * 1.6)
    card = card.resize((int(w * s), int(h * s)), Image.LANCZOS)
    card = card.rotate(angle, resample=Image.BICUBIC, expand=True)
    fade(card, clamp01(ts / 0.2))
    cx = x + w / 2 + 6 * math.sin(T * 1.1)
    cy = y + h / 2 + 8 * math.sin(T * 1.5 + 1)
    base.paste(card, (int(cx - card.width / 2), int(cy - card.height / 2)), card)


def render_scene(cfg, scene, img, T):
    ts = max(T - scene["start"], 0.0)
    dur = scene["end"] - scene["start"]
    tn = clamp01(ts / dur)
    base = animated_background(scene["theme"], T)
    draw_title(cfg, scene, base, ts)
    fd = 1.0
    if scene["effect"].endswith("fade_dark"):
        fd = 1 - 0.85 * ease_in_out((ts - (dur - 0.6)) / 0.6)
    draw_card(cfg, scene, img, base, T, ts, tn, fd)
    return base


# ---------- глобальный слой: логотип, прогресс, субтитры ----------
def chapters(scenes):
    spans = {}
    for s in scenes:
        c = s.get("chapter", s["id"])
        a, b = spans.get(c, (s["start"], s["end"]))
        spans[c] = (min(a, s["start"]), max(b, s["end"]))
    return [spans[c] for c in sorted(spans)]


def draw_badge_progress(cfg, base, T, scenes):
    layer = Image.new("RGBA", (W, 110), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.rounded_rectangle((60, 0, 132, 72), 20, fill=NEON)
    d.text((96, 36), "М", font=font(cfg, "title", 40, 900), fill=(14, 10, 13), anchor="mm")
    spans = chapters(scenes)
    n = len(spans)
    x0, x1, gap = 164, 1020, 10
    sw = (x1 - x0 - gap * (n - 1)) / n
    for i, (s, e) in enumerate(spans):
        a = x0 + i * (sw + gap)
        d.rounded_rectangle((a, 32, a + sw, 40), 4, fill=(128, 128, 128, 90))
        frac = clamp01((T - s) / (e - s))
        if frac > 0:
            d.rounded_rectangle((a, 32, a + max(sw * frac, 8), 40), 4, fill=NEON)
    base.paste(layer, (0, SAFE_TOP), layer)


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


def draw_subtitles(cfg, base, T, words, chunks):
    cur = None
    for k, ch in enumerate(chunks):
        s = words[ch[0]]["start"] - 0.05
        nxt = words[chunks[k + 1][0]]["start"] - 0.05 if k + 1 < len(chunks) else 1e9
        e = min(words[ch[-1]]["end"] + 0.35, nxt)
        if s <= T < e:
            cur = (ch, s)
            break
    if not cur:
        return
    ch, s = cur
    f = font(cfg, "body", 62, 800)
    sp = f.getlength(" ")
    lines, line, lw = [], [], 0
    for i in ch:
        wl = f.getlength(words[i]["word"])
        if line and lw + sp + wl > 820:
            lines.append(line)
            line, lw = [], 0
        lw += (sp if line else 0) + wl
        line.append(i)
    lines.append(line)
    widths = [sum(f.getlength(words[i]["word"]) for i in ln) + sp * (len(ln) - 1) for ln in lines]
    lh = 82
    pw, ph = int(max(widths) + 110), len(lines) * lh + 60
    plate = Image.new("RGBA", (pw, ph), (0, 0, 0, 0))
    d = ImageDraw.Draw(plate)
    d.rounded_rectangle((0, 0, pw - 1, ph - 1), 46, fill=(16, 11, 15, 228), outline=(255, 255, 255, 45), width=2)
    for li, ln in enumerate(lines):
        x = (pw - widths[li]) / 2
        for i in ln:
            w = words[i]
            col = (255, 255, 255) if T >= w["end"] else NEON_HOT if T >= w["start"] else (150, 140, 146)
            d.text((x, 30 + li * lh), w["word"], font=f, fill=col)
            x += f.getlength(w["word"]) + sp
    t0 = T - s
    sc = 0.88 + 0.12 * ease_back(t0 / 0.2)  # плашка «подпрыгивает» на каждой новой фразе
    plate = fade(plate, ease_out(t0 / 0.1)).resize((int(pw * sc), int(ph * sc)), Image.LANCZOS)
    base.paste(plate, ((W - plate.width) // 2, SUB_BOTTOM - plate.height), plate)


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
    # выравниваем слова Whisper по словам сценария: лишние слова Whisper отбрасываем
    sm = difflib.SequenceMatcher(None, [norm(w) for w in script_words], [norm(w["word"]) for w in words],
                                 autojunk=False)
    out = [None] * len(script_words)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n):
            out[a + k] = {"word": script_words[a + k], "start": words[b + k]["start"], "end": words[b + k]["end"]}
    for i, w in enumerate(out):  # слова сценария без пары: время берём между соседями
        if w is None:
            prev = next((out[j] for j in range(i - 1, -1, -1) if out[j]), None)
            nxt = next((out[j] for j in range(i + 1, len(out)) if out[j]), None)
            s = prev["end"] if prev else 0.0
            e = nxt["start"] if nxt else s + 0.3
            out[i] = {"word": script_words[i], "start": s, "end": max(e, s + 0.1)}
    print(f"субтитры: слов {len(out)}, Whisper нашёл {len(words)}, совпало {sum(n for _, _, n in sm.get_matching_blocks())}")
    return out


# ---------- сборка ----------
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
    if kind == "iris":  # круглое раскрытие из центра с розовым кольцом
        r = e * 1250
        m = Image.new("L", (W, H), 0)
        ImageDraw.Draw(m).ellipse((W / 2 - r, H / 2 - r, W / 2 + r, H / 2 + r), fill=255)
        out = Image.composite(b, a, m)
        if 0 < e < 1:
            ImageDraw.Draw(out).ellipse((W / 2 - r, H / 2 - r, W / 2 + r, H / 2 + r), outline=NEON, width=16)
        return out
    if kind == "wipe":  # диагональная шторка с розовой кромкой
        x, y = grid()
        d = x + 0.5 * y
        thr = e * (W + 0.5 * H + 80) - 40
        an, bn = np.asarray(a, np.float32), np.asarray(b, np.float32)
        out = np.where((d < thr)[..., None], bn, an)
        edge = (np.abs(d - thr) < 14)[..., None]
        out = np.where(edge, np.array(NEON, np.float32), out)
        return Image.fromarray(out.astype(np.uint8))
    if kind == "blinds":  # вертикальные жалюзи, полосы раскрываются каскадом
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
    if kind == "glitch":  # цифровой сбой: RGB-расслоение и сдвиги полос
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
    if kind == "spin":  # закрутка с приближением
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
        return Image.blend(a2, b2 if s2 >= 1 else Image.blend(a2, b, e), e)
    # flash: резкая смена кадра со вспышкой
    base = a if p < 0.5 else b
    k = 1 - abs(p - 0.5) * 2
    return Image.blend(base, Image.new("RGB", (W, H), (255, 190, 225)), 0.85 * k)


def frame_at(cfg, T, imgs, words, chunks):
    sc, tr = cfg["scenes"], cfg["transition"]
    idx = next((i for i, s in enumerate(sc) if T < s["end"]), len(sc) - 1)
    frame = None
    b = sc[idx]["end"]
    if idx + 1 < len(sc) and T >= b - tr / 2:
        a, nb = render_scene(cfg, sc[idx], imgs[idx], T), render_scene(cfg, sc[idx + 1], imgs[idx + 1], T)
        frame = transition(TRANSITIONS[idx % len(TRANSITIONS)], a, nb, clamp01((T - (b - tr / 2)) / tr))
    elif idx > 0 and T < sc[idx]["start"] + tr / 2:
        a, nb = render_scene(cfg, sc[idx - 1], imgs[idx - 1], T), render_scene(cfg, sc[idx], imgs[idx], T)
        frame = transition(TRANSITIONS[(idx - 1) % len(TRANSITIONS)], a, nb,
                           clamp01((T - (sc[idx]["start"] - tr / 2)) / tr))
    else:
        frame = render_scene(cfg, sc[idx], imgs[idx], T)
    draw_badge_progress(cfg, frame, T, sc)
    if words:
        draw_subtitles(cfg, frame, T, words, chunks)
    return frame


def main():
    cfg = load()
    BUILD.mkdir(exist_ok=True)
    (ROOT / "output").mkdir(exist_ok=True)
    if "--transcribe" in sys.argv:
        return transcribe(cfg)

    vo = ROOT / cfg["voiceover"]
    total, fps = cfg["duration"], cfg["fps"]
    if vo.exists():
        vo_dur = float(probe(vo))
        if vo_dur > total:
            sys.exit(f"Озвучка {vo_dur:.2f} с длиннее ролика {total} с: обрезать нельзя.")
    else:
        vo_dur = None
        print("озвучки нет: собираю без звука и субтитров")
    missing = []
    imgs = [load_image(s, missing) for s in cfg["scenes"]]
    words = load_words(cfg) if vo.exists() else None
    chunks = make_chunks(words) if words else None

    if "--stills" in sys.argv:
        out = BUILD / "stills"
        out.mkdir(exist_ok=True)
        times = [float(a) for a in sys.argv if re.fullmatch(r"\d+(\.\d+)?", a)] or [1.0, 3.0, 7.5, 12.0, 16.5, 25.0]
        for t in times:
            frame_at(cfg, t, imgs, words, chunks).save(out / f"t{t:05.2f}.png")
        print("отсутствуют:", missing or "нет")
        return print("кадры в build/stills/")

    out = ROOT / "output" / cfg.get("output", "mona_lisa_v1.mp4")
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(fps),
           "-i", "-"]
    if vo.exists():
        cmd += ["-i", str(vo)]
        music, whoosh = ROOT / cfg.get("music", ""), ROOT / cfg.get("whoosh", "")
        has_music, has_whoosh = music.is_file(), whoosh.is_file()
        if has_music:
            cmd += ["-i", str(music)]
        if has_whoosh:
            cmd += ["-i", str(whoosh)]
        af = [f"[1:a]apad=whole_dur={total},asplit=2[voice][vsc]"]
        mix = ["[voice]"]
        if has_music:
            # музыка под голосом тише примерно на 18-20 дБ: -12 дБ базово + ducking по голосу; в конце fade-out 1 с
            af.append(f"[2:a]atrim=0:{total},asetpts=PTS-STARTPTS,volume={cfg.get('music_db', -12)}dB,"
                      f"afade=t=in:d=0.4,afade=t=out:st={total - 1.0}:d=1.0[m]")
            af.append("[m][vsc]sidechaincompress=threshold=0.03:ratio=8:attack=15:release=350[md]")
            mix.append("[md]")
        else:
            af[0] = af[0].replace("asplit=2[voice][vsc]", "anull[voice]")
        if has_whoosh:
            ws = cfg["scenes"][:-1]
            wi = 3 if has_music else 2
            af.append(f"[{wi}:a]volume={cfg.get('whoosh_db', -9)}dB,asplit={len(ws)}" + "".join(f"[w{i}]" for i in range(len(ws))))
            for i, s in enumerate(ws):
                af.append(f"[w{i}]adelay={int(max(s['end'] - 0.85, 0) * 1000)}:all=1[wd{i}]")
                mix.append(f"[wd{i}]")
        af.append("".join(mix) + f"amix=inputs={len(mix)}:duration=first:normalize=0,alimiter=limit=0.95[a]")
        cmd += ["-filter_complex", ";".join(af), "-map", "0:v", "-map", "[a]",
                "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2"]
    cmd += ["-t", str(total), "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-r", str(fps),
            "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(out)]
    errlog = BUILD / "ffmpeg_err.log"  # в файл, а не в PIPE: переполненный pipe вешает ffmpeg
    with open(errlog, "wb") as ef:
        p = subprocess.Popen(cmd, cwd=ROOT, stdin=subprocess.PIPE, stderr=ef)
        n = round(total * fps)
        t0 = time.time()
        for i in range(n):
            p.stdin.write(frame_at(cfg, i / fps, imgs, words, chunks).tobytes())
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
    print("отсутствующие картинки:", missing or "нет")


if __name__ == "__main__":
    main()
