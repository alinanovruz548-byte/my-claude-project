"""Видео 16 «На этой картине главные герои спрятаны в зеркале» («Менины», Веласкес, метка n16): рассказывает Шиба (гранёная бумажная собака)."""
import json

base = r'C:\Users\awright\Desktop\Видео Клод'

s = open(base + r'\remotion\src\Board10.jsx', encoding='utf-8').read()
head = s.split('export const Board10Main')[0].replace("staticFile('n10/img/'", "staticFile('n16/img/'").replace("Img} from 'remotion'", "Img, Sequence, OffthreadVideo, Freeze} from 'remotion'")
p13 = open(base + r'\scripts\main13_part.jsx', encoding='utf-8').read()
helpers = p13.split('export const Board13Main')[0]
p15 = open(base + r'\scripts\main15_part.jsx', encoding='utf-8').read()
cB = "const cB = '#2B3FA0';\nconst cY = YEL;\n"
open(base + r'\remotion\src\Board16.jsx', 'w', encoding='utf-8').write(head + helpers + cB + open(base + r'\scripts\main16_part.jsx', encoding='utf-8').read())

p = base + r'\remotion\src\Main.jsx'
m = open(p, encoding='utf-8').read()
if 'Board16Main' not in m:
    m = m.replace("import {Board15Main} from './Board15';", "import {Board15Main} from './Board15';\nimport {Board16Main} from './Board16';", 1)
    m = m.replace("script.style === 'board15' ? Board15Main :", "script.style === 'board15' ? Board15Main : script.style === 'board16' ? Board16Main :", 1)
    open(p, 'w', encoding='utf-8').write(m)

W = open(base + r'\build\n16\text.txt', encoding='utf-8').read().strip()
ws = W.split()


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


caps = [cap(0, 4), cap(5, 6), [["1656", 7, 10], ["год:", 11, 11]], cap(12, 14), cap(15, 17), cap(18, 20), cap(21, 25), cap(26, 29), cap(30, 31), cap(32, 35), cap(36, 39), cap(40, 42), [["50", 43, 43], ["8", 44, 44], ["вариаций", 45, 45]], cap(46, 47), cap(48, 49), cap(50, 55)]
caps[12] = [["58", 43, 44], ["вариаций", 45, 45]]

CAM = [
    (0, 900, 1010, 1.0, 0, None), (6, 2000, 2250, 0.95, 2, 6), (21, 900, 3150, 1.0, -2, 6), (33, 2100, 3780, 0.95, 2, 6), (40, 800, 4120, 0.95, -2, 6),
]

S = {
    "title": "Менины: кто здесь главный", "style": "board16", "week": 3, "number": 16, "rubric": "В · Тайны и коды",
    "width": 1080, "height": 1920, "fps": 30, "output": "meninas_n16.mp4",
    "voiceover": "assets/audio/voiceover_n16.mp3", "voiceover_text": W, "tail": 0.8,
    "music_file": "assets/audio/music_n16.mp3", "music_vol": 0.8, "duck_ratio": 1.6,
    "sources": [
        "Диего Веласкес, «Менины» (Las Meninas), 1656, Прадо; в зеркале на заднем плане отражаются Филипп IV и королева Марианна (общепринятое прочтение); зритель оказывается на месте короля",
        "Пикассо в 1957 году написал 58 вариаций «Менин» (музей Пикассо, Барселона); работы Пикассо защищены правами и в ролике не показаны, упомянуты только словами",
        "ВАЖНО: собака Шиба и её клипы сделаны нейросетью (Magnific: картинка, Seedance 2.0 Fast 1 клип, Kling 2.5 два клипа), это вымышленный рассказчик, не историческое изображение",
    ],
    "images": {
        "painting": {"file": "n16/img/cut_full.png", "size": [1142, 1289], "license": "Public domain (Веласкес, «Менины», Wikimedia Commons: Las Meninas 01.jpg); детали: make_n16_assets.py"},
        "videos": {"file": "n16/vid/{dog1,dog2,dog3}.mp4", "size": [720, 1280], "license": "ВИДЕО нейросети (Magnific), персонаж-рассказчик Шиба"},
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО №16 · МЕНИНЫ", "nodes": []},
    "scenes": [{"id": 1, "type": "board", "from": 0}],
    "cam": [dict({"w": w, "x": x, "y": y, "z": z, "r": r}, **({"d": d} if d else {})) for (w, x, y, z, r, d) in CAM],
    "dingAt": 55,
    "sfx": {"swoosh": "assets/audio/sfx8/t_whoosh.mp3", "stamp": "assets/audio/sfx10/t_stamp.mp3", "ding": "assets/audio/sfx8/t_ting.mp3", "tick": "assets/audio/sfx_tick.mp3",
            "whoosh": "assets/audio/sfx8/t_whoosh.mp3", "ting": "assets/audio/sfx8/t_ting.mp3", "pulse": "assets/audio/sfx8/t_pulse.mp3", "shing": "assets/audio/sfx8/t_shing.mp3",
            "slap": "assets/audio/sfx13/t_slap.mp3", "thud": "assets/audio/sfx15/t_thud.mp3"},
    "events": [
        {"sfx": "pulse", "at": 0, "dt": 0.0, "vol": 0.7}, {"sfx": "slap", "at": 1, "dt": -0.1, "vol": 0.7}, {"sfx": "thud", "at": 3, "dt": -0.1, "vol": 0.6}, {"sfx": "whoosh", "at": 5, "dt": -0.35, "vol": 0.22}, {"sfx": "slap", "at": 5, "dt": -0.1, "vol": 0.6},
        {"sfx": "slap", "at": 7, "dt": -0.1, "vol": 0.6}, {"sfx": "slap", "at": 12, "dt": -0.1, "vol": 0.5}, {"sfx": "slap", "at": 14, "dt": -0.1, "vol": 0.5}, {"sfx": "slap", "at": 17, "dt": -0.1, "vol": 0.5},
        {"sfx": "whoosh", "at": 21, "dt": -0.35, "vol": 0.22}, {"sfx": "slap", "at": 23, "dt": -0.1, "vol": 0.6}, {"sfx": "ting", "at": 27, "dt": 0.0, "vol": 0.4}, {"sfx": "ting", "at": 30, "dt": 0.0, "vol": 0.4},
        {"sfx": "whoosh", "at": 33, "dt": -0.35, "vol": 0.22}, {"sfx": "thud", "at": 33, "dt": -0.05, "vol": 0.9}, {"sfx": "slap", "at": 39, "dt": -0.1, "vol": 0.6}, {"sfx": "whoosh", "at": 40, "dt": -0.35, "vol": 0.22},
        {"sfx": "slap", "at": 41, "dt": -0.1, "vol": 0.6}, {"sfx": "slap", "at": 43, "dt": -0.1, "vol": 0.6}, {"sfx": "pulse", "at": 50, "dt": 0.0, "vol": 0.5}, {"sfx": "ting", "at": 54, "dt": 0.1, "vol": 0.4},
        {"sfx": "ting", "at": 55, "dt": 0.1, "vol": 0.5}, {"sfx": "shing", "at": 55, "dt": 0.2, "vol": 0.4},
    ],
}
json.dump(S, open(base + r'\script_n16.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
