"""Правки видео 28: обновляет part (тело сцен), KEYS, события, источники."""
base = r'C:\Users\awright\Desktop\Видео Клод'
p = base + r'\scripts\main28_part.jsx'
s = open(p, encoding='utf-8').read()
s = s[:s.index('export const Board28Main')] + open(base + r'\scripts\main28_body.jsx', encoding='utf-8').read()
open(p, 'w', encoding='utf-8').write(s)

m = base + r'\scripts\mk28.py'
t = open(m, encoding='utf-8').read()
t = t.replace("[5.5, 9.0, 12.7, 17.3, 21.0, 26.1]", "[2.4, 5.5, 9.2, 12.8, 17.1, 20.4, 25.4]")
for a, b in [("{t: 5.9, ...SIDE_L", "{t: 5.8, ...SIDE_L"), ("{t: 8.9, ...SIDE_L", "{t: 9.0, ...SIDE_L"), ("{t: 9.4, ...SIDE_R", "{t: 9.5, ...SIDE_R"),
             ("{t: 12.5, ...SIDE_R", "{t: 12.6, ...SIDE_R"), ("{t: 13.0, ...SIDE_L", "{t: 13.1, ...SIDE_L"), ("{t: 17.1, ...SIDE_L", "{t: 16.9, ...SIDE_L"),
             ("{t: 17.8, ...SIDE_R", "{t: 17.6, ...SIDE_R"), ("{t: 20.4, ...SIDE_R", "{t: 20.1, ...SIDE_R"), ("{t: 21.2, ...SIDE_L", "{t: 20.8, ...SIDE_L"),
             ("{t: 25.9, ...SIDE_L", "{t: 25.3, ...SIDE_L"), ("{t: 26.6, x: 540", "{t: 25.9, x: 540")]:
    t = t.replace(a, b)
e0 = t.index('    "events": [')
e1 = t.index("    ],\n'''", e0) + len("    ],\n")
ev = '''    "events": [
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
t = t[:e0] + ev + t[e1:]
t = t.replace('"Фото руин Герники: Bundesarchiv', '"Картина «Герника» (Пикассо, 1937) показана миниатюрой из en.wikipedia (File:PicassoGuernica.jpg, добросовестное использование для комментария; права на картину защищены, риск претензий). Эйфелева башня 1937 (Fortepan 4776, PD), лайнер (NYPL, PD), панорама Нью-Йорка 1930 (Irving Underhill, LOC, PD), замок (Commons, CC BY-SA 4.0), зал Совбеза ООН (Commons, CC BY 4.0, подпись на экране). Фото руин Герники: Bundesarchiv', 1)
t = t.replace('"ruins": {"file": "n28/img/ruins.jpg", "size": [1000, 732], "license": "CC BY-SA 3.0 de (Bundesarchiv, Commons)"},',
              '"ruins": {"file": "n28/img/ruins.jpg", "size": [1000, 732], "license": "CC BY-SA 3.0 de (Bundesarchiv, Commons)"},\n        "guernica": {"file": "n28/img/guernica.jpg", "size": [1392, 633], "license": "Авторские права защищены (Пикассо); миниатюра en.wikipedia, fair use"},\n        "eiffel": {"file": "n28/img/eiffel.jpg", "size": [900, 1035], "license": "Public domain (Fortepan 4776)"},\n        "ship": {"file": "n28/img/ship.jpg", "size": [1000, 744], "license": "Public domain (NYPL)"},\n        "nyc": {"file": "n28/img/nyc.jpg", "size": [1000, 679], "license": "Public domain (LOC)"},\n        "un": {"file": "n28/img/un.jpg", "size": [1000, 800], "license": "CC BY 4.0 (Commons)"},\n        "padlock": {"file": "n28/img/padlock.png", "size": [917, 616], "license": "CC BY-SA 4.0 (Commons)"},', 1)
open(m, 'w', encoding='utf-8').write(t)
print('ok')
