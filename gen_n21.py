"""Видео 21 «Что под Чёрным квадратом» (Малевич, метка n21, стиль board21): осколки квадрата, рентген, слои, переходы: вайп, переворот, круг, косой вайп, плитки, жалюзи."""
import json

base = r'C:\Users\awright\Desktop\Видео Клод'

b17 = open(base + r'\remotion\src\Board17.jsx', encoding='utf-8').read()
head = b17[:b17.index('// наклейка')].replace("staticFile('n17/img/' + n)", "staticFile('n21/img/' + n)")
ka = head.index('const KEYS = [')
kb = head.index('];', ka) + 2
keys = '''const KEYS = [
  {t: 0.0, ...SIDE_R, pose: 'black', look: -1},
  {t: 2.6, ...SIDE_R, pose: 'black', look: -1},
  {t: 3.2, ...SIDE_R, pose: 'black', look: -1},
  {t: 4.8, ...SIDE_R, pose: 'black', look: -1},
  {t: 5.5, ...SIDE_L, pose: 'lab', look: 1},
  {t: 7.6, ...SIDE_L, pose: 'lab', look: 1},
  {t: 8.3, ...SIDE_R, pose: 'open', look: -1},
  {t: 10.2, ...SIDE_R, pose: 'open', look: -1},
  {t: 10.9, ...SIDE_L, pose: 'shh', look: 1},
  {t: 13.8, ...SIDE_L, pose: 'shh', look: 1},
  {t: 14.4, ...SIDE_R, pose: 'scared', look: -1},
  {t: 15.6, ...SIDE_R, pose: 'scared', look: -1},
  {t: 16.3, ...SIDE_L, pose: 'lab', look: 1},
  {t: 19.4, ...SIDE_L, pose: 'lab', look: 1},
  {t: 20.2, x: 540, y: 1790, s: 1.0, pose: 'black', look: 1},
  {t: 40, x: 540, y: 1790, s: 1.0, pose: 'black', look: 1},
];'''
head = head[:ka] + keys + head[kb:]
main = open(base + r'\scripts\main21_main.jsx', encoding='utf-8').read()
open(base + r'\remotion\src\Board21.jsx', 'w', encoding='utf-8').write(head + main)

p = base + r'\remotion\src\Main.jsx'
m = open(p, encoding='utf-8').read()
if 'Board21Main' not in m:
    m = m.replace("import {Board20Main} from './Board20';", "import {Board20Main} from './Board20';\nimport {Board21Main} from './Board21';", 1)
    m = m.replace("script.style === 'board20' ? Board20Main :", "script.style === 'board20' ? Board20Main : script.style === 'board21' ? Board21Main :", 1)
    open(p, 'w', encoding='utf-8').write(m)

W = open(base + r'\build\n21\text.txt', encoding='utf-8').read().strip()
ws = W.split()
assert len(ws) == 64


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


rng = [(0, 2), (3, 5), (6, 8), (9, 12), (13, 17), (18, 21), (22, 26), (27, 30), (31, 34), (35, 39), (40, 43), (44, 48), (49, 50), (51, 55), (56, 57), (58, 63)]
caps = [cap(a, b) for a, b in rng]


def ev(sfx, at, dt=0.0, vol=0.5):
    return {"sfx": sfx, "at": at, "dt": dt, "vol": vol}


S = {
    "title": "Что под «Чёрным квадратом»", "style": "board21", "week": 3, "number": 21, "rubric": "В · Тайны картин",
    "width": 1080, "height": 1920, "fps": 30, "output": "black_square_n21.mp4",
    "voiceover": "assets/audio/voiceover_n21.mp3", "voiceover_text": W, "tail": 0.9,
    "music_file": "assets/audio/music_n21.mp3", "music_vol": 0.7, "duck_ratio": 1.8,
    "sources": [
        "Казимир Малевич, «Чёрный супрематический квадрат», 1915, Третьяковская галерея (Public domain, Commons: Kazimir Malevich, 1915, Black Suprematic Square, oil on linen canvas, 79.5 x 79.5 cm, Tretyakov Gallery, Moscow.jpg)",
        "Исследование ГТГ 2015: под чёрным слоем два более ранних красочных изображения (кубофутуристическое и протосупрематическое), карандашная надпись, которую сопоставили с шуткой Альфонса Алле 1882 года; кто автор надписи, спорно (часть экспертов считает её чужой шуткой). Сам текст надписи в ролике не цитируется. Квадрат не идеален, трещины краски (кракелюр), сквозь которые видны нижние слои. Источники: Meduza (12 и 19 ноября 2015), Ведомости, The Art Newspaper Russia, AiF. «Слои» в ролике нарисованы схематично, это иллюстрации, не реконструкция.",
        "Надпись под краской по сообщениям СМИ (Meduza, 12.11.2015, Ведомости): «Битва негров в тёмной пещере»; отсылка к работе Альфонса Алле 1882 года. Цитата исторического названия, в ролике показана как цитата в кавычках. Возможна модерация TikTok по слову.",
        "Хук: короткое видео собаки (Kling 2.5, 720p, 5 с, зелёный фон, кеинг ffmpeg в PNG-кадры remotion/public/n21/hook); собака Шиба: позы (лаборант, чёрный холст, «тсс») сгенерированы нейросетью (Magnific), вырезаны; ролик без видео-клипов",
    ],
    "images": {
        "square": {"file": "n21/img/square.jpg", "size": [1718, 1718], "license": "Public domain (Commons)"},
        "dog": {"file": "n21/img/p_{lab,black,shh}.png", "size": [575, 890], "license": "ИЛЛЮСТРАЦИИ нейросети (Magnific), персонаж Шиба"},
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО №21 · ЧЁРНЫЙ КВАДРАТ", "nodes": []},
    "scenes": [{"id": 1, "type": "board", "from": 0}],
    "cam": [],
    "dingAt": 63,
    "sfx": {"whoosh": "assets/audio/sfx8/t_whoosh.mp3", "ting": "assets/audio/sfx8/t_ting.mp3", "pulse": "assets/audio/sfx8/t_pulse.mp3", "shing": "assets/audio/sfx8/t_shing.mp3",
            "ding": "assets/audio/sfx8/t_ting.mp3", "thud": "assets/audio/sfx15/t_thud.mp3", "tick": "assets/audio/sfx_tick.mp3", "stamp": "assets/audio/sfx10/t_stamp.mp3", "swoosh": "assets/audio/sfx8/t_whoosh.mp3",
            "slap": "assets/audio/sfx13/t_slap.mp3", "brush": "assets/audio/sfx12/t_brush.mp3"},
    "events": [
        ev("pulse", 0, 0.0, 0.5), ev("shing", 5, -0.15, 0.5), ev("thud", 5, 0.1, 0.5),
        ev("whoosh", 6, -0.3, 0.55), ev("ting", 9, 0.4, 0.3),
        ev("whoosh", 13, -0.4, 0.55), ev("tick", 15, 0.0, 0.3), ev("tick", 16, 0.0, 0.3),
        ev("whoosh", 22, 0.0, 0.55), ev("shing", 25, 0.3, 0.45),
        ev("whoosh", 31, -0.3, 0.55), ev("brush", 33, 0.2, 0.4),
        ev("whoosh", 40, -0.4, 0.55), ev("stamp", 43, 0.15, 0.7),
        ev("whoosh", 44, -0.3, 0.55), ev("ting", 51, 0.0, 0.3),
        ev("whoosh", 56, -0.3, 0.5), ev("ting", 63, 0.2, 0.5),
    ],
}
json.dump(S, open(base + r'\script_n21.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
