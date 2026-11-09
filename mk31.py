"""Видео 31 «Индийский жёлтый» (n31, style board31): сборка main31_main.jsx из хелперов main30_main + main31_part.jsx, затем gen_n31.py."""
import json
import re

base = r'C:\Users\awright\Desktop\Видео Клод'
m30 = open(base + r'\scripts\main30_main.jsx', encoding='utf-8').read()
helpers = m30[:m30.index('\n\nconst Vclip')]
helpers = helpers.replace('const CAM_STARTS = [2.4, 6.4, 12.3, 15.4, 19.0, 21.3];', 'const CAM_STARTS = [2.62, 6.12, 12.42, 15.95, 19.55];')
assert 'CAM_STARTS = [2.62' in helpers
part = open(base + r'\scripts\main31_part.jsx', encoding='utf-8').read()
open(base + r'\scripts\main31_main.jsx', 'w', encoding='utf-8').write(helpers + part)

# --- Board31.jsx: голова Board17 + main31_main
b17 = open(base + r'\remotion\src\Board17.jsx', encoding='utf-8').read()
head = b17[:b17.index('// наклейка')].replace("staticFile('n17/img/' + n)", "staticFile('n31/img/' + n)")
ka = head.index('const KEYS = [')
kb = head.index('];', ka) + 2
keys = '''const KEYS = [
  {t: 0.0, x: 540, y: 3000, s: 1.0, pose: 'open', look: 1},
  {t: 23.2, x: 540, y: 3000, s: 1.0, pose: 'open', look: 1},
  {t: 23.75, x: 215, y: 1810, s: 0.62, pose: 'reach', look: 1},
  {t: 40, x: 215, y: 1810, s: 0.62, pose: 'reach', look: 1},
];'''
head = head[:ka] + keys + head[kb:]
open(base + r'\remotion\src\Board31.jsx', 'w', encoding='utf-8').write(head + open(base + r'\scripts\main31_main.jsx', encoding='utf-8').read())

# --- Main.jsx
p = base + r'\remotion\src\Main.jsx'
m = open(p, encoding='utf-8').read()
if 'Board31Main' not in m:
    m = m.replace("import {Board30Main} from './Board30';", "import {Board30Main} from './Board30';\nimport {Board31Main} from './Board31';", 1)
    m = m.replace("script.style === 'board30' ? Board30Main :", "script.style === 'board30' ? Board30Main : script.style === 'board31' ? Board31Main :", 1)
    open(p, 'w', encoding='utf-8').write(m)

# --- script_n31.json: к существующим полям добавляем данные рендера
sp = base + r'\script_n31.json'
S = json.load(open(sp, encoding='utf-8'))
W = open(base + r'\build\n31\text.txt', encoding='utf-8').read().strip()
ws = W.split()
assert len(ws) == 59, len(ws)
rng = [(0, 2), (3, 5), (6, 8), (9, 11), (12, 14), (15, 19), (20, 22), (23, 26), (27, 27), (28, 32), (33, 37), (38, 41), (42, 44), (45, 46), (47, 49), (50, 52), (53, 54), (55, 56), (57, 58)]
caps = [[[ws[i], i, i] for i in range(a, b + 1)] for a, b in rng]


def ev(sfx, at, dt=0.0, vol=0.5):
    return {"sfx": sfx, "at": at, "dt": dt, "vol": vol}


S.update({
    "status": "СОБРАНО (рендер: python scripts/make_video.py n31)",
    "width": 1080, "height": 1920, "fps": 30, "output": "indian_yellow_n31.mp4",
    "voiceover": "assets/audio/voiceover_n31.mp3", "tail": 0.9,
    "music_file": "assets/audio/music_n31.mp3", "music_vol": 0.7, "duck_ratio": 1.8,
    "captions": caps,
    "diagram": {"title": "ДЕЛО №31 · ИНДИЙСКИЙ ЖЁЛТЫЙ", "nodes": []},
    "scenes": [{"id": 1, "type": "board", "from": 0}],
    "cam": [],
    "dingAt": 58,
    "sfx": {"whoosh": "assets/audio/sfx8/t_whoosh.mp3", "ting": "assets/audio/sfx8/t_ting.mp3", "pulse": "assets/audio/sfx8/t_pulse.mp3", "shing": "assets/audio/sfx8/t_shing.mp3",
            "ding": "assets/audio/sfx8/t_ting.mp3", "thud": "assets/audio/sfx15/t_thud.mp3", "tick": "assets/audio/sfx_tick.mp3", "stamp": "assets/audio/sfx10/t_stamp.mp3", "swoosh": "assets/audio/sfx8/t_whoosh.mp3",
            "slap": "assets/audio/sfx13/t_slap.mp3", "brush": "assets/audio/sfx12/t_brush.mp3", "coin": "assets/audio/sfx11/t_coin.mp3"},
    "events": [
        ev("pulse", 0, 0.0, 0.4), ev("whoosh", 6, -0.2, 0.6), ev("whoosh", 15, -0.25, 0.6),
        ev("ting", 9, 0.0, 0.4), ev("ting", 12, 0.0, 0.4),
        ev("tick", 16, 0.0, 0.3), ev("tick", 17, 0.0, 0.3), ev("tick", 18, 0.0, 0.3), ev("tick", 19, 0.0, 0.3),
        ev("swoosh", 22, 0.0, 0.5), ev("tick", 23, 0.0, 0.3), ev("tick", 24, 0.0, 0.3), ev("tick", 25, 0.0, 0.3), ev("brush", 26, 0.3, 0.4),
        ev("whoosh", 28, -0.3, 0.6),
        ev("thud", 36, 0.0, 0.6), ev("whoosh", 38, -0.25, 0.6),
        ev("stamp", 46, 0.0, 0.6), ev("whoosh", 47, -0.35, 0.6),
        ev("ting", 50, 0.0, 0.35), ev("ting", 53, 0.0, 0.35), ev("ting", 55, 0.0, 0.35),
        ev("ting", 58, 0.3, 0.5),
    ],
})
S['images'] = {"dog": {"file": "n31/img/p_reach.png", "size": [575, 890], "license": "ИЛЛЮСТРАЦИЯ нейросети (Magnific), персонаж Шиба"}}
S['videos'] = {"file": "n31/vid/{h,a2,b,c,d2}.mp4", "size": [716, 1284], "license": "ВИДЕО-ИЛЛЮСТРАЦИИ, созданы нейросетью (Magnific: стартовые кадры images_generate с reference собаки, видео Kling 2.5); не архивные кадры"}
json.dump(S, open(sp, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
