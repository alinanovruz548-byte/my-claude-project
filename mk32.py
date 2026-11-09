"""Видео 32 «Пятно у ног послов» (n32, style board32): сборка main32_main.jsx из хелперов main30_main + main32_part.jsx, затем gen_n32.py."""
import json
import re

base = r'C:\Users\awright\Desktop\Видео Клод'
m30 = open(base + r'\scripts\main30_main.jsx', encoding='utf-8').read()
helpers = m30[:m30.index('\n\nconst Vclip')]
helpers = helpers.replace('const CAM_STARTS = [2.4, 6.4, 12.3, 15.4, 19.0, 21.3];', 'const CAM_STARTS = [3.1, 6.3, 9.35, 12.0, 15.65];')
assert 'CAM_STARTS = [3.1' in helpers
part = open(base + r'\scripts\main32_part.jsx', encoding='utf-8').read()
open(base + r'\scripts\main32_main.jsx', 'w', encoding='utf-8').write(helpers + part)

# --- Board32.jsx: голова Board17 + main32_main
b17 = open(base + r'\remotion\src\Board17.jsx', encoding='utf-8').read()
head = b17[:b17.index('// наклейка')].replace("staticFile('n17/img/' + n)", "staticFile('n32/img/' + n)")
ka = head.index('const KEYS = [')
kb = head.index('];', ka) + 2
keys = '''const KEYS = [
  {t: 0.0, x: 540, y: 3000, s: 1.0, pose: 'open', look: 1},
  {t: 21.2, x: 540, y: 3000, s: 1.0, pose: 'open', look: 1},
  {t: 21.75, x: 215, y: 1810, s: 0.62, pose: 'reach', look: 1},
  {t: 40, x: 215, y: 1810, s: 0.62, pose: 'reach', look: 1},
];'''
head = head[:ka] + keys + head[kb:]
open(base + r'\remotion\src\Board32.jsx', 'w', encoding='utf-8').write(head + open(base + r'\scripts\main32_main.jsx', encoding='utf-8').read())

# --- Main.jsx
p = base + r'\remotion\src\Main.jsx'
m = open(p, encoding='utf-8').read()
if 'Board32Main' not in m:
    m = m.replace("import {Board30Main} from './Board30';", "import {Board30Main} from './Board30';\nimport {Board32Main} from './Board32';", 1)
    m = m.replace("script.style === 'board30' ? Board30Main :", "script.style === 'board30' ? Board30Main : script.style === 'board32' ? Board32Main :", 1)
    open(p, 'w', encoding='utf-8').write(m)

# --- script_n32.json: к существующим полям добавляем данные рендера
sp = base + r'\script_n32.json'
S = json.load(open(sp, encoding='utf-8'))
W = open(base + r'\build\n32\text.txt', encoding='utf-8').read().strip()
ws = W.split()
assert len(ws) == 57, len(ws)
rng = [(0, 3), (4, 7), (8, 10), (11, 15), (16, 18), (19, 23), (24, 27), (28, 31), (32, 36), (37, 40), (41, 44), (45, 46), (47, 48), (49, 50), (51, 52), (53, 56)]
caps = [[[ws[i], i, i] for i in range(a, b + 1)] for a, b in rng]


def ev(sfx, at, dt=0.0, vol=0.5):
    return {"sfx": sfx, "at": at, "dt": dt, "vol": vol}


S.update({
    "status": "СОБРАНО (рендер: python scripts/make_video.py n32)",
    "width": 1080, "height": 1920, "fps": 30, "output": "ambassadors_n32.mp4",
    "voiceover": "assets/audio/voiceover_n32.mp3", "tail": 0.9,
    "music_file": "assets/audio/music_n32.mp3", "music_vol": 0.7, "duck_ratio": 1.8,
    "captions": caps,
    "diagram": {"title": "ДЕЛО №32 · ПОСЛЫ ГОЛЬБЕЙНА", "nodes": []},
    "scenes": [{"id": 1, "type": "board", "from": 0}],
    "cam": [],
    "dingAt": 56,
    "sfx": {"whoosh": "assets/audio/sfx8/t_whoosh.mp3", "ting": "assets/audio/sfx8/t_ting.mp3", "pulse": "assets/audio/sfx8/t_pulse.mp3", "shing": "assets/audio/sfx8/t_shing.mp3",
            "ding": "assets/audio/sfx8/t_ting.mp3", "thud": "assets/audio/sfx15/t_thud.mp3", "tick": "assets/audio/sfx_tick.mp3", "stamp": "assets/audio/sfx10/t_stamp.mp3", "swoosh": "assets/audio/sfx8/t_whoosh.mp3",
            "slap": "assets/audio/sfx13/t_slap.mp3", "brush": "assets/audio/sfx12/t_brush.mp3", "coin": "assets/audio/sfx11/t_coin.mp3"},
    "events": [
        ev("pulse", 0, 0.0, 0.4), ev("whoosh", 8, -0.1, 0.6),
        ev("tick", 11, 0.0, 0.3), ev("tick", 12, 0.0, 0.3), ev("tick", 13, 0.0, 0.3), ev("tick", 14, 0.0, 0.3),
        ev("whoosh", 16, -0.15, 0.6), ev("thud", 22, 0.0, 0.5), ev("whoosh", 24, -0.15, 0.6),
        ev("whoosh", 31, 0.0, 0.6), ev("thud", 36, 0.0, 0.5), ev("whoosh", 41, -0.2, 0.6),
        ev("ting", 45, 0.0, 0.35), ev("ting", 47, 0.0, 0.35), ev("ting", 49, 0.0, 0.35),
        ev("ting", 56, 0.3, 0.5),
    ],
})
S['images'] = {"dog": {"file": "n32/img/p_reach.png", "size": [575, 890], "license": "ИЛЛЮСТРАЦИЯ нейросети (Magnific), персонаж Шиба"}}
S['videos'] = {"file": "n32/vid/{h,m,c}.mp4", "size": [716, 1284], "license": "ВИДЕО-ИЛЛЮСТРАЦИИ, созданы нейросетью (Magnific: стартовые кадры images_generate с reference собаки, видео Kling 2.5); не архивные кадры"}
json.dump(S, open(sp, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
