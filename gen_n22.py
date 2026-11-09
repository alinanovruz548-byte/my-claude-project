"""Видео 22 «Натюрморт как ребус» (ванитас, метка n22, стиль board22): круги-подсветки, кропы деталей картины, часы, лампа; переходы: плитки, переворот, круг, вайп вверх, жалюзи, косой вайп."""
import json

base = r'C:\Users\awright\Desktop\Видео Клод'

b17 = open(base + r'\remotion\src\Board17.jsx', encoding='utf-8').read()
head = b17[:b17.index('// наклейка')].replace("staticFile('n17/img/' + n)", "staticFile('n22/img/' + n)")
ka = head.index('const KEYS = [')
kb = head.index('];', ka) + 2
keys = '''const KEYS = [
  {t: 0.0, x: 540, y: 2900, s: 0.9, pose: 'skull', look: 1},
  {t: 3.0, x: 540, y: 2900, s: 0.9, pose: 'skull', look: 1},
  {t: 3.7, ...SIDE_R, pose: 'ruff', look: -1},
  {t: 6.8, ...SIDE_R, pose: 'ruff', look: -1},
  {t: 7.5, ...SIDE_L, pose: 'open', look: 1},
  {t: 9.5, ...SIDE_L, pose: 'open', look: 1},
  {t: 10.2, ...SIDE_R, pose: 'skull', look: -1},
  {t: 11.8, ...SIDE_R, pose: 'skull', look: -1},
  {t: 12.5, ...SIDE_L, pose: 'hour', look: 1},
  {t: 14.2, ...SIDE_L, pose: 'hour', look: 1},
  {t: 14.9, ...SIDE_R, pose: 'scared', look: -1},
  {t: 17.7, ...SIDE_R, pose: 'scared', look: -1},
  {t: 18.4, ...SIDE_L, pose: 'ruff', look: 1},
  {t: 40, ...SIDE_L, pose: 'ruff', look: 1},
];'''
head = head[:ka] + keys + head[kb:]
main = open(base + r'\scripts\main22_main.jsx', encoding='utf-8').read()
open(base + r'\remotion\src\Board22.jsx', 'w', encoding='utf-8').write(head + main)

p = base + r'\remotion\src\Main.jsx'
m = open(p, encoding='utf-8').read()
if 'Board22Main' not in m:
    m = m.replace("import {Board21Main} from './Board21';", "import {Board21Main} from './Board21';\nimport {Board22Main} from './Board22';", 1)
    m = m.replace("script.style === 'board21' ? Board21Main :", "script.style === 'board21' ? Board21Main : script.style === 'board22' ? Board22Main :", 1)
    open(p, 'w', encoding='utf-8').write(m)

W = open(base + r'\build\n22\text.txt', encoding='utf-8').read().strip()
ws = W.split()
assert len(ws) == 48


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


rng = [(0, 2), (3, 7), (8, 10), (11, 13), (14, 17), (18, 20), (21, 24), (25, 28), (29, 33), (34, 36), (37, 42), (43, 47)]
caps = [cap(a, b) for a, b in rng]


def ev(sfx, at, dt=0.0, vol=0.5):
    return {"sfx": sfx, "at": at, "dt": dt, "vol": vol}


S = {
    "title": "Натюрморт как ребус", "style": "board22", "week": 3, "number": 22, "rubric": "В · Тайны картин",
    "width": 1080, "height": 1920, "fps": 30, "output": "vanitas_n22.mp4",
    "voiceover": "assets/audio/voiceover_n22.mp3", "voiceover_text": W, "tail": 0.9,
    "music_file": "assets/audio/music_n22.mp3", "music_vol": 0.7, "duck_ratio": 1.8,
    "sources": [
        "Питер Клас, «Ванитас» (Vanitas Still Life), 1630, Маурицхёйс, Гаага (Public domain, Commons: Pieter Claesz - Vanitas Still Life - 943 - Mauritshuis.jpg): череп, карманные часы, погасшая масляная лампа, опрокинутый бокал, перо, книги",
        "Хармен Стенвейк, «Аллегория бренности человеческой жизни» (Vanitas Still-Life), ок. 1640, National Gallery, Лондон (Public domain, Commons: Harmen Steenwijck - Vanitas Still-Life - WGA21768.jpg)",
        "Термин «ванитас» (лат. vanitas, «суета») от Екклесиаста (vanitas vanitatum). Жанр особенно развит в голландской живописи XVII века (Лейден, Харлем).",
        "Собака Шиба: позы (песочные часы, воротник и шляпа, череп) сгенерированы нейросетью (Magnific), вырезаны; ролик без видео-клипов",
    ],
    "images": {
        "claesz": {"file": "n22/img/claesz.jpg", "size": [3840, 2701], "license": "Public domain (Commons)"},
        "steen": {"file": "n22/img/steen.jpg", "size": [3000, 2357], "license": "Public domain (Commons)"},
        "dog": {"file": "n22/img/p_{hour,ruff,skull}.png", "size": [575, 890], "license": "ИЛЛЮСТРАЦИИ нейросети (Magnific), персонаж Шиба"},
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО №22 · ВАНИТАС", "nodes": []},
    "scenes": [{"id": 1, "type": "board", "from": 0}],
    "cam": [],
    "dingAt": 47,
    "sfx": {"whoosh": "assets/audio/sfx8/t_whoosh.mp3", "ting": "assets/audio/sfx8/t_ting.mp3", "pulse": "assets/audio/sfx8/t_pulse.mp3", "shing": "assets/audio/sfx8/t_shing.mp3",
            "ding": "assets/audio/sfx8/t_ting.mp3", "thud": "assets/audio/sfx15/t_thud.mp3", "tick": "assets/audio/sfx_tick.mp3", "stamp": "assets/audio/sfx10/t_stamp.mp3", "swoosh": "assets/audio/sfx8/t_whoosh.mp3",
            "slap": "assets/audio/sfx13/t_slap.mp3", "brush": "assets/audio/sfx12/t_brush.mp3"},
    "events": [
        ev("whoosh", 0, 0.0, 0.6), ev("ting", 3, 0.0, 0.35), ev("ting", 5, 0.0, 0.35), ev("thud", 6, -0.1, 0.6), ev("stamp", 7, 0.15, 0.7),
        ev("whoosh", 8, -0.4, 0.55), ev("ting", 11, 0.0, 0.3), ev("shing", 13, 0.0, 0.4),
        ev("whoosh", 14, -0.5, 0.55), ev("ting", 19, 0.0, 0.3),
        ev("whoosh", 21, -0.3, 0.55), ev("tick", 23, 0.0, 0.3), ev("tick", 24, 0.0, 0.3),
        ev("whoosh", 25, -0.3, 0.55), ev("tick", 26, 0.0, 0.35), ev("tick", 27, 0.0, 0.35), ev("tick", 28, 0.0, 0.35),
        ev("whoosh", 29, -0.3, 0.55), ev("swoosh", 29, 0.5, 0.3), ev("stamp", 36, 0.1, 0.7),
        ev("whoosh", 37, -0.3, 0.55), ev("ting", 43, 0.0, 0.3), ev("ting", 44, 0.0, 0.3), ev("ting", 45, 0.0, 0.3), ev("ting", 46, 0.0, 0.3), ev("ting", 47, 0.2, 0.5),
    ],
}
json.dump(S, open(base + r'\script_n22.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
