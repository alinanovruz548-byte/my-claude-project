"""Собирает main29_main.jsx и gen_n29.py (видео 29 «Зеркало над кроватью», Фрида Кало)."""
base = r'C:\Users\awright\Desktop\Видео Клод'
m27 = open(base + r'\scripts\main27_main.jsx', encoding='utf-8').read()
helpers = m27[:m27.index('export const Board27Main')]
helpers = helpers.replace('const CAM_STARTS = [2.7, 4.7, 8.4, 14.3, 17.9, 21.7];', 'const CAM_STARTS = [2.4, 4.0, 5.2, 10.3, 15.8, 18.4, 22.55, 24.3];')
part = open(base + r'\scripts\main29_part.jsx', encoding='utf-8').read()
part = part.replace("""y={i % 2 ? 2300 - q * 3000 : -700 + q * 3000 - 2300 + 700 - 700 + 0} width={191} height={2400} style={{}} transform""", """y={-700} width={191} height={2400} transform""")
open(base + r'\scripts\main29_main.jsx', 'w', encoding='utf-8').write(helpers + part)

g = open(base + r'\scripts\gen_n27.py', encoding='utf-8').read()
g = g.replace('n27', 'n29').replace('Board27', 'Board29').replace('board27', 'board29')
# не трогаем Main.jsx из gen (подключено вручную)
a = g.index("p = base + r'\\remotion\\src\\Main.jsx'")
b = g.index("W = open(")
g = g[:a] + g[b:]

KEYS = """keys = '''const KEYS = [
  {t: 0.0, x: 540, y: 3000, s: 1.0, pose: 'look', look: 1},
  {t: 2.9, x: 540, y: 3000, s: 1.0, pose: 'look', look: 1},
  {t: 3.3, ...SIDE_R, pose: 'look', look: -1},
  {t: 3.9, ...SIDE_R, pose: 'look', look: -1},
  {t: 4.3, ...SIDE_R, pose: 'open', look: -1},
  {t: 5.0, ...SIDE_R, pose: 'open', look: -1},
  {t: 6.3, ...SIDE_L, pose: 'scared', look: 1},
  {t: 10.0, ...SIDE_L, pose: 'scared', look: 1},
  {t: 10.8, ...SIDE_R, pose: 'artist', look: -1},
  {t: 15.5, ...SIDE_R, pose: 'artist', look: -1},
  {t: 16.2, ...SIDE_L, pose: 'brush', look: 1},
  {t: 18.1, ...SIDE_L, pose: 'brush', look: 1},
  {t: 18.7, x: 890, y: 1830, s: 0.6, pose: 'jump', look: -1},
  {t: 21.6, x: 890, y: 1830, s: 0.6, pose: 'jump', look: -1},
  {t: 22.4, x: 890, y: 1830, s: 0.6, pose: 'laugh', look: -1},
  {t: 24.6, x: 890, y: 1830, s: 0.6, pose: 'laugh', look: -1},
  {t: 25.1, x: 540, y: 1790, s: 0.85, pose: 'open', look: 1},
  {t: 40, x: 540, y: 1790, s: 0.85, pose: 'open', look: 1},
];'''"""
a = g.index("keys = '''")
b = g.index("'''", a + 10) + 3
g = g[:a] + KEYS + g[b:]
g = g.replace('assert len(ws) == 57', 'assert len(ws) == 75')
c0 = g.index('rng = [')
c1 = g.index('\n', c0)
g = g[:c0] + 'rng = [(0, 3), (4, 8), (9, 11), (12, 17), (18, 24), (25, 28), (29, 33), (34, 38), (39, 43), (44, 47), (48, 52), (53, 56), (57, 62), (63, 64), (65, 69), (70, 74)]' + g[c1:]
g = g.replace('"title": "Выставка позора"', '"title": "Зеркало над кроватью"').replace('"week": 4, "number": 27, "rubric": "Б · Власть и искусство"', '"week": 4, "number": 29, "rubric": "Г · Герои и судьбы"')
g = g.replace('degenerate_art_n29.mp4', 'frida_mirror_n29.mp4').replace('ДЕЛО №27 · ВЫСТАВКА ПОЗОРА', 'ДЕЛО №29 · ЗЕРКАЛО')

SRC = '''    "sources": [
        "Факты (Google Arts & Culture, Biography, History.com, Wikipedia): 17 сентября 1925 года в Мехико автобус, в котором ехала 18-летняя Фрида Кало, столкнулся с трамваем (тяжёлые переломы позвоночника, таза и ноги); месяцы в постели в гипсе; по её словам, мать распорядилась закрепить зеркало под балдахином кровати и сделать особый мольберт, так Фрида начала писать автопортреты (первый, «Автопортрет в бархатном платье», 1926). Счёт «55 автопортретов из 143 картин» приводят вторичные источники (Wikipedia, арт-сайты), возможны расхождения; в ролике «больше трети».",
        "Коллаж «знаменитые картины» (en.wikipedia, миниатюры, добросовестное использование для комментария; риск претензий платформы): Две Фриды, Автобус (1929), Больница Генри Форда, Раненый олень, Автопортрет в бархатном платье, Посвящение Троцкому, Диего и я, Корни, Фрида и Диего Ривера, Время летит. Зеркало: 18th Century Venetian Mirror, Bemberg Foundation (Commons, CC BY-SA 4.0, вырезано Magnific). Фото Фриды в постели за работой свободного нет, в ролике иллюстрация комнаты. Фото Фриды Кало 1932 (Guillermo Kahlo, Commons, PD); «Автопортрет в бархатном платье» (1926) показан миниатюрой en.wikipedia (добросовестное использование для комментария; права на картину могут быть защищены, риск претензий платформы). Комната, зеркало и мольберт, авария автобуса и трамвая, календарь и гипс на экране схематичные иллюстрации (комната сгенерирована нейросетью Magnific, подпись «иллюстрация»).",
        "Хук: стартовый кадр (Magnific images_generate с reference собаки) и видео Kling 2.5 (720p, 5 с) сгенерированы нейросетью, иллюстрация. Позы собаки из прежних роликов.",
    ],
    "images": {
        "frida32": {"file": "n29/img/frida32.jpg", "size": [1000, 1500], "license": "Public domain (Guillermo Kahlo, 1932, Commons)"},
        "velvet": {"file": "n29/img/velvet.jpg", "size": [800, 1078], "license": "Авторские права возможны; миниатюра en.wikipedia, fair use"},
        "mirror": {"file": "n29/img/mirror_fx.png", "size": [1149, 1794], "license": "CC BY-SA 4.0 (Bemberg Foundation, Commons)"},
        "paintings": {"file": "n29/img/k0..k9.jpg", "size": [700, 900], "license": "Авторские права возможны; миниатюры en.wikipedia, fair use"},
        "room": {"file": "n29/img/room.png", "size": [1024, 1820], "license": "ИЛЛЮСТРАЦИЯ нейросети (Magnific)"},
        "dog": {"file": "n29/img/p_{look,open,scared,artist,brush,jump}.png", "size": [575, 890], "license": "ИЛЛЮСТРАЦИИ нейросети (Magnific), персонаж Шиба"},
    },
'''
s0 = g.index('    "sources": [')
s1 = g.index('    "captions": caps,')
g = g[:s0] + SRC + g[s1:]

EV = '''    "events": [
        ev("pulse", 0, 0.0, 0.4), ev("whoosh", 6, 0.2, 0.6), ev("shing", 8, 0.0, 0.5), ev("whoosh", 9, -0.2, 0.55),
        ev("stamp", 13, 0.03, 0.55), ev("stamp", 14, 0.03, 0.55), ev("stamp", 15, 0.03, 0.55), ev("stamp", 16, 0.03, 0.55),
        ev("whoosh", 12, -0.2, 0.6), ev("ting", 19, 0.0, 0.3),
        ev("thud", 28, 0.0, 0.7), ev("stamp", 28, 0.15, 0.6),
        ev("whoosh", 29, -0.25, 0.6), ev("tick", 29, 0.1, 0.3), ev("tick", 30, 0.1, 0.3), ev("tick", 31, 0.0, 0.3), ev("tick", 32, 0.0, 0.3),
        ev("stamp", 33, 0.0, 0.6),
        ev("whoosh", 37, -0.3, 0.55), ev("whoosh", 41, 0.0, 0.55),
        ev("whoosh", 44, -0.3, 0.6), ev("brush", 47, 0.0, 0.5),
        ev("whoosh", 53, -0.1, 0.55), ev("tick", 57, 0.0, 0.3), ev("tick", 58, 0.0, 0.3), ev("tick", 60, 0.0, 0.3),
        ev("stamp", 63, 0.0, 0.65),
        ev("whoosh", 65, -0.2, 0.6), ev("tick", 66, 0.0, 0.3), ev("tick", 67, 0.0, 0.3), ev("tick", 68, 0.0, 0.3), ev("tick", 69, 0.0, 0.3),
        ev("whoosh", 70, -0.3, 0.6), ev("ting", 74, 0.2, 0.5),
    ],
'''
e0 = g.index('    "events": [')
e1 = g.index('    ],\n}', e0) + len('    ],\n')
g = g[:e0] + EV + g[e1:]
g = g.replace('"dingAt": 56', '"dingAt": 74')
open(base + r'\scripts\gen_n29.py', 'w', encoding='utf-8').write(g)
print('ok')
