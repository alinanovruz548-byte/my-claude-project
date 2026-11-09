"""Видео 14 «Белые статуи были цветными» (метка n14): бумажный коллаж на терракотовой бумаге, слайдер «было / стало», УФ, осыпающаяся краска."""
import json

base = r'C:\Users\awright\Desktop\Видео Клод'

s = open(base + r'\remotion\src\Board10.jsx', encoding='utf-8').read()
head = s.split('export const Board10Main')[0].replace("staticFile('n10/img/'", "staticFile('n14/img/'").replace("Img} from 'remotion'", "Img, Sequence, OffthreadVideo, Freeze} from 'remotion'")
p13 = open(base + r'\scripts\main13_part.jsx', encoding='utf-8').read()
helpers = p13.split('export const Board13Main')[0]
open(base + r'\remotion\src\Board14.jsx', 'w', encoding='utf-8').write(head + helpers + open(base + r'\scripts\main14_part.jsx', encoding='utf-8').read())

p = base + r'\remotion\src\Main.jsx'
m = open(p, encoding='utf-8').read()
if 'Board14Main' not in m:
    m = m.replace("import {Board13Main} from './Board13';", "import {Board13Main} from './Board13';\nimport {Board14Main} from './Board14';", 1)
    m = m.replace("script.style === 'board13' ? Board13Main :", "script.style === 'board13' ? Board13Main : script.style === 'board14' ? Board14Main :", 1)
    open(p, 'w', encoding='utf-8').write(m)

W = open(base + r'\build\n14\text.txt', encoding='utf-8').read().strip()
ws = W.split()


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


caps = [cap(0, 2), cap(3, 6), cap(7, 8), cap(9, 13), cap(14, 18), cap(19, 23), cap(24, 28), cap(29, 33), cap(34, 38), cap(39, 42), cap(43, 44), cap(45, 48), cap(49, 51)]

CAM = [
    (0, 900, 1010, 1.0, 0, None), (9, 2040, 1760, 0.94, 2, 6), (19, 900, 2660, 1.0, -2, 6), (29, 2100, 3560, 1.0, 2, 6),
]

S = {
    "title": "Белые статуи были цветными", "style": "board14", "week": 3, "number": 14, "rubric": "Д · Наука и искусство",
    "width": 1080, "height": 1920, "fps": 30, "output": "colored_statues_n14.mp4",
    "voiceover": "assets/audio/voiceover_n14.mp3", "voiceover_text": W, "tail": 0.8,
    "music_file": "assets/audio/music_n14.mp3", "music_vol": 0.8, "duck_ratio": 1.6,
    "sources": [
        "Полихромия античной скульптуры: следы краски находят с помощью УФ-флуоресценции, люминесценции в видимом свете (египетский голубой), XRF и спектроскопии (Brinkmann, Gods in Color; Met, Chroma 2022); найдены египетский голубой, киноварь, красная охра, марена, жёлтая охра, позолота",
        "Белыми статуи стали из-за потери краски (века под землёй, выветривание, чистка при находке) и позднейшего идеала белого мрамора (Возрождение, классицизм); формулировка в озвучке упрощена: «краска осыпалась, а позднейшие эпохи приняли белизну за идеал»",
        "ВАЖНО: цветная статуя на экране — ИЛЛЮСТРАЦИЯ (Magnific, редактирование фото), не научная реконструкция; УФ-кадр тоже иллюстрация",
    ],
    "images": {
        "statues": {"file": "n14/img/st_{0..6}.png", "size": [0, 0], "license": "Public domain / CC0 (Commons): Венера Милосская, Дискобол, Нике Самофракийская, Капитолийская Венера, Гермес Праксителя (Rijksmuseum), голова Дорифора, Венера Анцио; вырезки make_n14_statues.py"},
        "videos": {"file": "n14/vid/{work,uvv,hall}.mp4", "size": [720, 960], "license": "ВИДЕО-ИЛЛЮСТРАЦИИ, созданы нейросетью (Magnific, Seedance 2.0 Fast): мастерская, УФ-лампа, зал белых статуй; не архивные кадры"},
        "aug_src": {"file": "n14/img/aug_src.jpg", "size": [1500, 2250], "license": "Public domain (Август из Прима-Порта, Ватикан, Wikimedia Commons: Statue-Augustus.jpg)"},
        "aug_color": {"file": "n14/img/aug_color.jpg", "size": [1500, 2250], "license": "ИЛЛЮСТРАЦИЯ, создана нейросетью (Magnific, ideogram, точное редактирование фото выше), не научная реконструкция"},
        "uv": {"file": "n14/img/uv.jpg", "size": [1328, 1760], "license": "ИЛЛЮСТРАЦИЯ, создана нейросетью (Magnific), не реальная фотография лаборатории"},
        "bg": {"file": "n14/img/bg_terra.jpg", "size": [3400, 5100], "license": "Процедурный фон, создан скриптом make_n14_assets.py"},
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО №14 · БЕЛЫЕ СТАТУИ", "nodes": []},
    "scenes": [{"id": 1, "type": "board", "from": 0}],
    "cam": [dict({"w": w, "x": x, "y": y, "z": z, "r": r}, **({"d": d} if d else {})) for (w, x, y, z, r, d) in CAM],
    "dingAt": 50,
    "sfx": {"swoosh": "assets/audio/sfx8/t_whoosh.mp3", "stamp": "assets/audio/sfx10/t_stamp.mp3", "ding": "assets/audio/sfx8/t_ting.mp3", "tick": "assets/audio/sfx_tick.mp3",
            "whoosh": "assets/audio/sfx8/t_whoosh.mp3", "ting": "assets/audio/sfx8/t_ting.mp3", "pulse": "assets/audio/sfx8/t_pulse.mp3", "riser": "assets/audio/sfx8/t_riser.mp3",
            "shing": "assets/audio/sfx8/t_shing.mp3", "rip": "assets/audio/sfx13/t_rip.mp3", "slap": "assets/audio/sfx13/t_slap.mp3", "brush": "assets/audio/sfx12/t_brush.mp3"},
    "events": [
        {"sfx": "pulse", "at": 0, "dt": 0.0, "vol": 0.8}, {"sfx": "slap", "at": 0, "dt": 0.02, "vol": 0.6},
        {"sfx": "whoosh", "at": 0, "dt": 0.12, "vol": 0.3}, {"sfx": "whoosh", "at": 0, "dt": 0.24, "vol": 0.3}, {"sfx": "whoosh", "at": 0, "dt": 0.36, "vol": 0.3}, {"sfx": "whoosh", "at": 0, "dt": 0.48, "vol": 0.3}, {"sfx": "whoosh", "at": 0, "dt": 0.60, "vol": 0.3}, {"sfx": "whoosh", "at": 0, "dt": 0.72, "vol": 0.3}, {"sfx": "whoosh", "at": 0, "dt": 0.84, "vol": 0.3}, {"sfx": "whoosh", "at": 0, "dt": 0.96, "vol": 0.3}, {"sfx": "whoosh", "at": 0, "dt": 1.08, "vol": 0.3}, {"sfx": "whoosh", "at": 0, "dt": 1.20, "vol": 0.3}, {"sfx": "whoosh", "at": 0, "dt": 1.32, "vol": 0.3}, {"sfx": "whoosh", "at": 0, "dt": 1.44, "vol": 0.3}, {"sfx": "whoosh", "at": 0, "dt": 1.56, "vol": 0.3}, {"sfx": "whoosh", "at": 0, "dt": 1.68, "vol": 0.3}, {"sfx": "shing", "at": 7, "dt": -0.1, "vol": 0.7}, {"sfx": "brush", "at": 7, "dt": 0.0, "vol": 0.7},
        {"sfx": "slap", "at": 7, "dt": 0.1, "vol": 0.7}, {"sfx": "rip", "at": 9, "dt": -0.15, "vol": 0.6}, {"sfx": "slap", "at": 12, "dt": 0.0, "vol": 0.5}, {"sfx": "slap", "at": 15, "dt": 0.0, "vol": 0.7},
        {"sfx": "slap", "at": 16, "dt": 0.0, "vol": 0.7}, {"sfx": "slap", "at": 18, "dt": 0.0, "vol": 0.7}, {"sfx": "rip", "at": 19, "dt": -0.15, "vol": 0.6}, {"sfx": "ting", "at": 23, "dt": 0.0, "vol": 0.4},
        {"sfx": "slap", "at": 23, "dt": 0.05, "vol": 0.6}, {"sfx": "shing", "at": 28, "dt": 0.0, "vol": 0.5}, {"sfx": "slap", "at": 28, "dt": 0.0, "vol": 0.6}, {"sfx": "rip", "at": 29, "dt": -0.15, "vol": 0.6},
        {"sfx": "slap", "at": 33, "dt": 0.0, "vol": 0.8}, {"sfx": "rip", "at": 34, "dt": 0.0, "vol": 0.7}, {"sfx": "slap", "at": 37, "dt": 0.0, "vol": 0.6}, {"sfx": "slap", "at": 42, "dt": 0.0, "vol": 0.7},
        {"sfx": "pulse", "at": 43, "dt": 0.0, "vol": 0.5}, {"sfx": "ting", "at": 48, "dt": 0.0, "vol": 0.4}, {"sfx": "ting", "at": 50, "dt": 0.1, "vol": 0.5}, {"sfx": "shing", "at": 50, "dt": 0.2, "vol": 0.4},
    ],
}
json.dump(S, open(base + r'\script_n14.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
