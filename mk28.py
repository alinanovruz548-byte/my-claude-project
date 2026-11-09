"""Собирает main28_main.jsx и gen_n28.py (видео 28 «Герника под занавесом»)."""
base = r'C:\Users\awright\Desktop\Видео Клод'
m27 = open(base + r'\scripts\main27_main.jsx', encoding='utf-8').read()
helpers = m27[:m27.index('export const Board27Main')]
helpers = helpers.replace('const CAM_STARTS = [2.7, 4.7, 8.4, 14.3, 17.9, 21.7];', 'const CAM_STARTS = [2.4, 5.5, 9.2, 12.8, 17.1, 20.4, 25.4];')
part = open(base + r'\scripts\main28_part.jsx', encoding='utf-8').read()
open(base + r'\scripts\main28_main.jsx', 'w', encoding='utf-8').write(helpers + part)

g = open(base + r'\scripts\gen_n27.py', encoding='utf-8').read()
g = g.replace('n27', 'n28').replace('Board27', 'Board28').replace('board27', 'board28').replace('Board26Main', 'Board27Main').replace('board26', 'board27')

KEYS = """keys = '''const KEYS = [
  {t: 0.0, x: 540, y: 3000, s: 1.0, pose: 'artist', look: 1},
  {t: 2.9, x: 540, y: 3000, s: 1.0, pose: 'artist', look: 1},
  {t: 3.4, ...SIDE_R, pose: 'artist', look: -1},
  {t: 5.3, ...SIDE_R, pose: 'artist', look: -1},
  {t: 5.8, ...SIDE_L, pose: 'open', look: 1},
  {t: 9.0, ...SIDE_L, pose: 'open', look: 1},
  {t: 9.5, ...SIDE_R, pose: 'scared', look: -1},
  {t: 12.6, ...SIDE_R, pose: 'scared', look: -1},
  {t: 13.1, ...SIDE_L, pose: 'think', look: 1},
  {t: 16.9, ...SIDE_L, pose: 'think', look: 1},
  {t: 17.6, ...SIDE_R, pose: 'jump', look: -1},
  {t: 20.1, ...SIDE_R, pose: 'jump', look: -1},
  {t: 20.8, ...SIDE_L, pose: 'judge', look: 1},
  {t: 25.3, ...SIDE_L, pose: 'judge', look: 1},
  {t: 25.9, x: 540, y: 1790, s: 0.85, pose: 'open', look: 1},
  {t: 40, x: 540, y: 1790, s: 0.85, pose: 'open', look: 1},
];'''"""
a = g.index("keys = '''")
b = g.index("'''", a + 10) + 3
g = g[:a] + KEYS + g[b:]
g = g.replace('assert len(ws) == 57', 'assert len(ws) == 79')
c0 = g.index('rng = [')
c1 = g.index('\n', c0)
g = g[:c0] + 'rng = [(0, 3), (4, 10), (11, 15), (16, 24), (25, 30), (31, 34), (35, 41), (42, 46), (47, 50), (51, 55), (56, 63), (64, 69), (70, 75), (76, 78)]' + g[c1:]
g = g.replace('"title": "Выставка позора"', '"title": "Герника под занавесом"').replace('"week": 4, "number": 27, "rubric": "Б · Власть и искусство"', '"week": 4, "number": 28, "rubric": "Б · Власть и искусство"')
g = g.replace('degenerate_art_n28.mp4', 'guernica_n28.mp4').replace('ДЕЛО №27 · ВЫСТАВКА ПОЗОРА', 'ДЕЛО №28 · ГЕРНИКА')

SRC = '''    "sources": [
        "Факты (BIE Paris, History.com, Britannica, Wikipedia): «Герника» заказана правительством Испанской республики для павильона на Всемирной выставке в Париже (показана с 12 июля 1937); бомбардировка баскского города Герника 26 апреля 1937; по просьбе Пикассо картина хранилась в Нью-Йорке до «восстановления общественных свобод» в Испании и вернулась 10 сентября 1981; 5 февраля 2003 синей шторой закрыли гобелен-копию «Герники» в ООН перед выступлением Колина Пауэлла об Ираке (по словам дипломатов, под давлением США; официально не подтверждено, причина в ролике не названа).",
        "Картина «Герника» (Пикассо, 1937) показана миниатюрой из en.wikipedia (File:PicassoGuernica.jpg, добросовестное использование для комментария; права на картину защищены, риск претензий платформы). Эйфелева башня 1937 (Fortepan 4776, PD), лайнер (NYPL, PD), панорама Нью-Йорка 1930 (Irving Underhill, LOC, PD), замок (Commons, CC BY-SA 4.0), зал Совбеза ООН (Commons, CC BY 4.0, подпись на экране), руины Герники (Bundesarchiv 183-H25224, CC BY-SA 3.0 de, подпись на экране).",
        "Хук: стартовый кадр (Magnific images_generate с reference собаки) и видео Kling 2.5 (720p, 5 с, ускорено в 1,4 раза) сгенерированы нейросетью, иллюстрация. Позы собаки из прежних роликов.",
    ],
    "images": {
        "ruins": {"file": "n28/img/ruins.jpg", "size": [1000, 732], "license": "CC BY-SA 3.0 de (Bundesarchiv, Commons)"},
        "guernica": {"file": "n28/img/guernica.jpg", "size": [1392, 633], "license": "Авторские права защищены (Пикассо); миниатюра en.wikipedia, fair use"},
        "eiffel": {"file": "n28/img/eiffel.jpg", "size": [900, 1035], "license": "Public domain (Fortepan 4776)"},
        "ship": {"file": "n28/img/ship.jpg", "size": [1000, 744], "license": "Public domain (NYPL)"},
        "nyc": {"file": "n28/img/nyc.jpg", "size": [1000, 679], "license": "Public domain (LOC)"},
        "un": {"file": "n28/img/un.jpg", "size": [1000, 800], "license": "CC BY 4.0 (Commons)"},
        "padlock": {"file": "n28/img/padlock.png", "size": [917, 616], "license": "CC BY-SA 4.0 (Commons)"},
        "guernica": {"file": "n28/img/guernica.jpg", "size": [1392, 633], "license": "Авторские права защищены (Пикассо); миниатюра en.wikipedia, fair use"},
        "eiffel": {"file": "n28/img/eiffel.jpg", "size": [900, 1035], "license": "Public domain (Fortepan 4776)"},
        "ship": {"file": "n28/img/ship.jpg", "size": [1000, 744], "license": "Public domain (NYPL)"},
        "nyc": {"file": "n28/img/nyc.jpg", "size": [1000, 679], "license": "Public domain (LOC)"},
        "un": {"file": "n28/img/un.jpg", "size": [1000, 800], "license": "CC BY 4.0 (Commons)"},
        "padlock": {"file": "n28/img/padlock.png", "size": [917, 616], "license": "CC BY-SA 4.0 (Commons)"},
        "dog": {"file": "n28/img/p_{artist,open,scared,think,jump,judge}.png", "size": [575, 890], "license": "ИЛЛЮСТРАЦИИ нейросети (Magnific), персонаж Шиба"},
    },
'''
s0 = g.index('    "sources": [')
s1 = g.index('    "captions": caps,')
g = g[:s0] + SRC + g[s1:]

EV = '''    "events": [
        ev("pulse", 0, 0.0, 0.4), ev("whoosh", 4, 0.0, 0.6), ev("stamp", 9, 0.25, 0.6), ev("thud", 9, 0.4, 0.5),
        ev("whoosh", 15, 0.35, 0.55),
        ev("stamp", 20, 0.04, 0.55), ev("stamp", 21, 0.05, 0.55), ev("stamp", 22, 0.03, 0.55), ev("stamp", 23, 0.02, 0.55),
        ev("whoosh", 25, -0.45, 0.55), ev("ting", 33, 0.0, 0.3),
        ev("whoosh", 35, -0.45, 0.55),
        ev("whoosh", 47, -0.2, 0.55),
        ev("stamp", 52, 0.1, 0.5), ev("stamp", 53, 0.1, 0.5), ev("stamp", 54, 0.05, 0.5), ev("stamp", 55, 0.03, 0.5),
        ev("whoosh", 56, -0.4, 0.6),
        ev("stamp", 58, 0.14, 0.5), ev("stamp", 59, 0.3, 0.5), ev("stamp", 60, 0.26, 0.5), ev("stamp", 61, 0.2, 0.5),
        ev("whoosh", 64, 0.15, 0.55), ev("ting", 69, 0.0, 0.3),
        ev("whoosh", 76, -0.32, 0.55), ev("ting", 78, 0.2, 0.5),
    ],
'''
e0 = g.index('    "events": [')
e1 = g.index('    ],\n}', e0) + len('    ],\n')
g = g[:e0] + EV + g[e1:]
g = g.replace('"dingAt": 56', '"dingAt": 78')
open(base + r'\scripts\gen_n28.py', 'w', encoding='utf-8').write(g)
print('ok')
