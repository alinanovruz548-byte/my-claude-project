"""Видео 27 «Выставка позора» («Дегенеративное искусство» 1937, метка n28, стиль board28): видео-хук 2,6 с, анимированные субтитры по словам, переходы: вспышка, строки, круг из угла, двери, билет, колонны."""
import json

base = r'C:\Users\awright\Desktop\Видео Клод'

b17 = open(base + r'\remotion\src\Board17.jsx', encoding='utf-8').read()
head = b17[:b17.index('// наклейка')].replace("staticFile('n17/img/' + n)", "staticFile('n28/img/' + n)")
ka = head.index('const KEYS = [')
kb = head.index('];', ka) + 2
keys = '''const KEYS = [
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
];'''
head = head[:ka] + keys + head[kb:]
main = open(base + r'\scripts\main28_main.jsx', encoding='utf-8').read()
open(base + r'\remotion\src\Board28.jsx', 'w', encoding='utf-8').write(head + main)

p = base + r'\remotion\src\Main.jsx'
m = open(p, encoding='utf-8').read()
if 'Board28Main' not in m:
    m = m.replace("import {Board27Main} from './Board26';", "import {Board27Main} from './Board26';\nimport {Board28Main} from './Board28';", 1)
    m = m.replace("script.style === 'board27' ? Board27Main :", "script.style === 'board27' ? Board27Main : script.style === 'board28' ? Board28Main :", 1)
    open(p, 'w', encoding='utf-8').write(m)

W = open(base + r'\build\n28\text.txt', encoding='utf-8').read().strip()
ws = W.split()
assert len(ws) == 79


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


rng = [(0, 3), (4, 10), (11, 15), (16, 24), (25, 30), (31, 34), (35, 41), (42, 46), (47, 50), (51, 55), (56, 63), (64, 69), (70, 75), (76, 78)]
caps = [cap(a, b) for a, b in rng]


def ev(sfx, at, dt=0.0, vol=0.5):
    return {"sfx": sfx, "at": at, "dt": dt, "vol": vol}


S = {
    "title": "Герника под занавесом", "style": "board28", "week": 4, "number": 28, "rubric": "Б · Власть и искусство",
    "width": 1080, "height": 1920, "fps": 30, "output": "guernica_n28.mp4",
    "voiceover": "assets/audio/voiceover_n28.mp3", "voiceover_text": W, "tail": 0.9,
    "music_file": "assets/audio/music_n28.mp3", "music_vol": 0.7, "duck_ratio": 1.8,
    "sources": [
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
    "captions": caps,
    "diagram": {"title": "ДЕЛО №28 · ГЕРНИКА", "nodes": []},
    "scenes": [{"id": 1, "type": "board", "from": 0}],
    "cam": [],
    "dingAt": 78,
    "sfx": {"whoosh": "assets/audio/sfx8/t_whoosh.mp3", "ting": "assets/audio/sfx8/t_ting.mp3", "pulse": "assets/audio/sfx8/t_pulse.mp3", "shing": "assets/audio/sfx8/t_shing.mp3",
            "ding": "assets/audio/sfx8/t_ting.mp3", "thud": "assets/audio/sfx15/t_thud.mp3", "tick": "assets/audio/sfx_tick.mp3", "stamp": "assets/audio/sfx10/t_stamp.mp3", "swoosh": "assets/audio/sfx8/t_whoosh.mp3",
            "slap": "assets/audio/sfx13/t_slap.mp3", "brush": "assets/audio/sfx12/t_brush.mp3", "coin": "assets/audio/sfx11/t_coin.mp3"},
    "events": [
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
}
json.dump(S, open(base + r'\script_n28.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
