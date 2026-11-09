"""Видео 15 «Подпись-селфи 1434 года» («Портрет четы Арнольфини», ван Эйк, метка n15): бумажный коллаж на горчичной бумаге."""
import json

base = r'C:\Users\awright\Desktop\Видео Клод'

s = open(base + r'\remotion\src\Board10.jsx', encoding='utf-8').read()
head = s.split('export const Board10Main')[0].replace("staticFile('n10/img/'", "staticFile('n15/img/'").replace("Img} from 'remotion'", "Img, Sequence, OffthreadVideo, Freeze} from 'remotion'")
p13 = open(base + r'\scripts\main13_part.jsx', encoding='utf-8').read()
helpers = p13.split('export const Board13Main')[0]
open(base + r'\remotion\src\Board15.jsx', 'w', encoding='utf-8').write(head + helpers + open(base + r'\scripts\main15_part.jsx', encoding='utf-8').read())

p = base + r'\remotion\src\Main.jsx'
m = open(p, encoding='utf-8').read()
if 'Board15Main' not in m:
    m = m.replace("import {Board14Main} from './Board14';", "import {Board14Main} from './Board14';\nimport {Board15Main} from './Board15';", 1)
    m = m.replace("script.style === 'board14' ? Board14Main :", "script.style === 'board14' ? Board14Main : script.style === 'board15' ? Board15Main :", 1)
    open(p, 'w', encoding='utf-8').write(m)

W = open(base + r'\build\n15\text.txt', encoding='utf-8').read().strip()
ws = W.split()


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


caps = [[["В", 0, 0], ["1434", 1, 4], ["году", 5, 5]], cap(6, 8), cap(9, 10), cap(11, 13), cap(14, 16), cap(17, 21), cap(22, 25), cap(26, 28), cap(29, 33), cap(34, 37), cap(38, 39), cap(40, 44), cap(45, 48),
        cap(49, 53), cap(54, 55), cap(56, 58), cap(59, 61)]

CAM = [
    (0, 900, 960, 1.0, 0, None), (9, 2100, 1800, 0.95, 2, 6), (14, 900, 2780, 1.0, -2, 6), (22, 2100, 3780, 1.0, 2, 6), (40, 900, 4020, 1.0, -2, 6),
]

S = {
    "title": "Подпись-селфи 1434 года", "style": "board15", "week": 3, "number": 15, "rubric": "В · Тайны и коды",
    "width": 1080, "height": 1920, "fps": 30, "output": "arnolfini_n15.mp4",
    "voiceover": "assets/audio/voiceover_n15.mp3", "voiceover_text": W, "tail": 0.8,
    "music_file": "assets/audio/music_n15.mp3", "music_vol": 0.8, "duck_ratio": 1.6,
    "sources": [
        "Ян ван Эйк, «Портрет четы Арнольфини», 1434, Национальная галерея, Лондон; надпись над зеркалом «Johannes de eyck fuit hic 1434» («Ян ван Эйк был здесь, 1434»); в выпуклом зеркале отражены комната и двое людей в дверях (одна из версий: один из них художник; общепринятое, но не доказанное прочтение)",
        "Версия Панофского (1934): картина как свидетельство брака с подписью-свидетельством; позднее оспорена (Hall: помолвка; Koster: памятный портрет; Campbell (Nat. Gallery): просто двойной портрет); в озвучке «версия о брачном контракте оспаривается»",
        "ВАЖНО: «селфи» метафора; видео-иллюстрации (художник пишет подпись, отражение в зеркале, наезд на зеркало) созданы нейросетью (Magnific), не историческая реконструкция",
    ],
    "images": {
        "painting": {"file": "n15/img/cut_full.png", "size": [1142, 1517], "license": "Public domain (Van Eyck, Arnolfini Portrait, Wikimedia Commons: Eyck, Jan van - Arnolfini Portrait - NG.jpg); детали вырезаны скриптом make_n15_assets.py"},
        "videos": {"file": "n15/vid/{fish,paint,push}.mp4", "size": [720, 960], "license": "ВИДЕО-ИЛЛЮСТРАЦИИ, созданы нейросетью (Magnific, Seedance 2.0 Fast); наезд на зеркало сделан из картины (Public domain) как стартовый кадр"},
        "bg": {"file": "n15/img/bg_mustard.jpg", "size": [3400, 5100], "license": "Процедурный фон, создан скриптом"},
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО №15 · АРНОЛЬФИНИ", "nodes": []},
    "scenes": [{"id": 1, "type": "board", "from": 0}],
    "cam": [dict({"w": w, "x": x, "y": y, "z": z, "r": r}, **({"d": d} if d else {})) for (w, x, y, z, r, d) in CAM],
    "dingAt": 61,
    "sfx": {"swoosh": "assets/audio/sfx8/t_whoosh.mp3", "stamp": "assets/audio/sfx10/t_stamp.mp3", "ding": "assets/audio/sfx8/t_ting.mp3", "tick": "assets/audio/sfx_tick.mp3",
            "whoosh": "assets/audio/sfx8/t_whoosh.mp3", "ting": "assets/audio/sfx8/t_ting.mp3", "pulse": "assets/audio/sfx8/t_pulse.mp3", "riser": "assets/audio/sfx8/t_riser.mp3",
            "shing": "assets/audio/sfx8/t_shing.mp3", "rip": "assets/audio/sfx13/t_rip.mp3", "slap": "assets/audio/sfx13/t_slap.mp3", "brush": "assets/audio/sfx12/t_brush.mp3", "inkstamp": "assets/audio/sfx10/t_stamp.mp3", "thud": "assets/audio/sfx15/t_thud.mp3"},
    "events": [
        {"sfx": "pulse", "at": 0, "dt": 0.0, "vol": 0.8},
    ] + [{"sfx": "slap", "at": 0, "dt": d, "vol": 0.6} for d in (0.0, 0.1, 0.25, 0.4, 0.55, 0.75)] + [
        {"sfx": "slap", "at": 8, "dt": 0.0, "vol": 0.7}, {"sfx": "whoosh", "at": 9, "dt": -0.15, "vol": 0.22}, {"sfx": "slap", "at": 11, "dt": 0.0, "vol": 0.6}, {"sfx": "slap", "at": 13, "dt": 0.0, "vol": 0.6},
        {"sfx": "whoosh", "at": 14, "dt": -0.15, "vol": 0.22}, {"sfx": "slap", "at": 14, "dt": 0.0, "vol": 0.6}, {"sfx": "brush", "at": 16, "dt": 0.0, "vol": 0.6}, {"sfx": "slap", "at": 17, "dt": 0.0, "vol": 0.7},
        {"sfx": "ting", "at": 21, "dt": 0.0, "vol": 0.5}, {"sfx": "whoosh", "at": 22, "dt": -0.15, "vol": 0.22}, {"sfx": "slap", "at": 27, "dt": 0.0, "vol": 0.6}, {"sfx": "slap", "at": 30, "dt": 0.0, "vol": 0.6},
        {"sfx": "pulse", "at": 34, "dt": 0.0, "vol": 0.5}, {"sfx": "ting", "at": 39, "dt": 0.0, "vol": 0.5}, {"sfx": "whoosh", "at": 40, "dt": -0.15, "vol": 0.22}, {"sfx": "slap", "at": 44, "dt": 0.0, "vol": 0.7},
        {"sfx": "slap", "at": 46, "dt": 0.0, "vol": 0.7}, {"sfx": "slap", "at": 47, "dt": 0.0, "vol": 0.6}, {"sfx": "slap", "at": 48, "dt": 0.0, "vol": 0.6}, {"sfx": "ting", "at": 51, "dt": 0.0, "vol": 0.4},
        {"sfx": "thud", "at": 53, "dt": 0.12, "vol": 1.0}, {"sfx": "inkstamp", "at": 53, "dt": 0.12, "vol": 0.3}, {"sfx": "pulse", "at": 54, "dt": 0.0, "vol": 0.5}, {"sfx": "ting", "at": 57, "dt": 0.1, "vol": 0.4}, {"sfx": "ting", "at": 61, "dt": 0.0, "vol": 0.5},
        {"sfx": "shing", "at": 61, "dt": 0.1, "vol": 0.4},
    ],
}
json.dump(S, open(base + r'\script_n15.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
