"""Видео 30 «Чистые листы Дали» (n30, style board30): сквозные клипы Kling с собакой."""
base = r'C:\Users\awright\Desktop\Видео Клод'
m27 = open(base + r'\scripts\main27_main.jsx', encoding='utf-8').read()
helpers = m27[:m27.index('export const Board27Main')]
helpers = helpers.replace('const CAM_STARTS = [2.7, 4.7, 8.4, 14.3, 17.9, 21.7];', 'const CAM_STARTS = [2.4, 6.4, 12.3, 15.4, 19.0, 21.3];')
old = "transformOrigin: '50% 80%'}}>{txt}</span>"
assert old in helpers
helpers = helpers.replace(old, "transformOrigin: '50% 80%', ...(txt.startsWith('Дали') && wt < 1 ? {background: 'linear-gradient(135deg,#F9B7D2,#C4607E)', padding: '0 24px 6px', borderRadius: 30, border: '4px solid #fff', color: '#fff', fontStyle: 'italic', textShadow: '0 3px 10px rgba(120,30,70,0.5)'} : {})}}>{txt}</span>")
part = open(base + r'\scripts\main30_part.jsx', encoding='utf-8').read()
open(base + r'\scripts\main30_main.jsx', 'w', encoding='utf-8').write(helpers + part)

g = open(base + r'\scripts\gen_n27.py', encoding='utf-8').read()
g = g.replace('n27', 'n30').replace('Board27', 'Board30').replace('board27', 'board30')
a = g.index("p = base + r'\\remotion\\src\\Main.jsx'")
b = g.index("W = open(")
g = g[:a] + g[b:]

KEYS = """keys = '''const KEYS = [
  {t: 0.0, x: 540, y: 3000, s: 1.0, pose: 'laugh', look: 1},
  {t: 21.0, x: 540, y: 3000, s: 1.0, pose: 'laugh', look: 1},
  {t: 21.6, x: 540, y: 1790, s: 0.8, pose: 'open', look: 1},
  {t: 40, x: 540, y: 1790, s: 0.8, pose: 'open', look: 1},
];'''"""
a = g.index("keys = '''")
b = g.index("'''", a + 10) + 3
g = g[:a] + KEYS + g[b:]
g = g.replace('assert len(ws) == 57', 'assert len(ws) == 63')
c0 = g.index('rng = [')
c1 = g.index('\n', c0)
g = g[:c0] + 'rng = [(0, 4), (5, 8), (9, 11), (12, 16), (17, 22), (23, 28), (29, 31), (32, 36), (37, 41), (42, 47), (48, 52), (53, 56), (57, 62)]' + g[c1:]
g = g.replace('"title": "Выставка позора"', '"title": "Чистые листы Дали"').replace('"week": 4, "number": 27, "rubric": "Б · Власть и искусство"', '"week": 4, "number": 30, "rubric": "А · Скандалы и тайны"')
g = g.replace('degenerate_art_n30.mp4', 'dali_blank_n30.mp4').replace('ДЕЛО №27 · ВЫСТАВКА ПОЗОРА', 'ДЕЛО №30 · ЛИСТЫ ДАЛИ')

SRC = '''    "sources": [
        "Факты (greg.org / Washington Post, Artsper, Appraiser Workshops, интервью с экспертами, Wikipedia): в 1960–70-х годах Сальвадор Дали, по свидетельствам, подписывал огромное число пустых листов для литографий; оценки числа подписанных листов, дошедших до рынка, расходятся (эксперт Э. Эстебан Сепеда: 40–60 тысяч; в других источниках больше, вплоть до 350 тысяч по словам менеджера); эксперты и покупательские гиды называют рынок литографий Дали одним из самых уязвимых для подделок и изданий сомнительного происхождения. В ролике всё подано как оценка («по оценкам», «эксперты считают»), точных процентов подделок не называем.",
        "Подпись Дали с автографом 1948 (Commons, «Firmas de Salvador Dali y Gala Dali», Public domain). «Постоянство памяти» (1931) показано миниатюрой en.wikipedia (добросовестное использование, права Дали защищены до 2059, риск претензий платформы). Фото Сальвадора Дали 1965 (Roger Higgins, New York World-Telegram, Commons, Public domain). Клипы и сцены нейросетевые иллюстрации (Magnific: стартовые кадры images_generate с reference собаки, видео Kling 2.5). Работы Дали в ролике не показаны (авторские права защищены).",
    ],
    "images": {
        "dali65": {"file": "n30/img/dali65.jpg", "size": [960, 1252], "license": "Public domain (Commons, Roger Higgins 1965)"},
        "dog": {"file": "n30/img/p_open.png", "size": [575, 890], "license": "ИЛЛЮСТРАЦИЯ нейросети (Magnific), персонаж Шиба"},
    },
'''
s0 = g.index('    "sources": [')
s1 = g.index('    "captions": caps,')
g = g[:s0] + SRC + g[s1:]

EV = '''    "events": [
        ev("pulse", 0, 0.0, 0.4), ev("whoosh", 5, 0.0, 0.6), ev("whoosh", 17, -0.5, 0.6),
        ev("stamp", 28, 0.05, 0.6), ev("tick", 38, 0.0, 0.3), ev("tick", 40, 0.0, 0.3), ev("ting", 41, 0.0, 0.35),
        ev("whoosh", 42, -0.45, 0.6), ev("stamp", 45, 0.05, 0.5), ev("stamp", 47, 0.1, 0.5), ev("stamp", 49, 0.0, 0.5),
        ev("whoosh", 53, -0.45, 0.6), ev("stamp", 55, 0.0, 0.6),
        ev("whoosh", 57, -0.2, 0.6), ev("ting", 62, 0.3, 0.5),
    ],
'''
e0 = g.index('    "events": [')
e1 = g.index('    ],\n}', e0) + len('    ],\n')
g = g[:e0] + EV + g[e1:]
g = g.replace('"dingAt": 56', '"dingAt": 62')
open(base + r'\scripts\gen_n30.py', 'w', encoding='utf-8').write(g)
print('ok')
