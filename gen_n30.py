"""Видео 27 «Выставка позора» («Дегенеративное искусство» 1937, метка n30, стиль board30): видео-хук 2,6 с, анимированные субтитры по словам, переходы: вспышка, строки, круг из угла, двери, билет, колонны."""
import json

base = r'C:\Users\awright\Desktop\Видео Клод'

b17 = open(base + r'\remotion\src\Board17.jsx', encoding='utf-8').read()
head = b17[:b17.index('// наклейка')].replace("staticFile('n17/img/' + n)", "staticFile('n30/img/' + n)")
ka = head.index('const KEYS = [')
kb = head.index('];', ka) + 2
keys = '''const KEYS = [
  {t: 0.0, x: 540, y: 3000, s: 1.0, pose: 'laugh', look: 1},
  {t: 21.0, x: 540, y: 3000, s: 1.0, pose: 'laugh', look: 1},
  {t: 21.6, x: 540, y: 1790, s: 0.8, pose: 'open', look: 1},
  {t: 40, x: 540, y: 1790, s: 0.8, pose: 'open', look: 1},
];'''
head = head[:ka] + keys + head[kb:]
main = open(base + r'\scripts\main30_main.jsx', encoding='utf-8').read()
open(base + r'\remotion\src\Board30.jsx', 'w', encoding='utf-8').write(head + main)

W = open(base + r'\build\n30\text.txt', encoding='utf-8').read().strip()
ws = W.split()
assert len(ws) == 63


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


rng = [(0, 4), (5, 8), (9, 11), (12, 16), (17, 22), (23, 28), (29, 31), (32, 36), (37, 41), (42, 47), (48, 52), (53, 56), (57, 62)]
caps = [cap(a, b) for a, b in rng]


def ev(sfx, at, dt=0.0, vol=0.5):
    return {"sfx": sfx, "at": at, "dt": dt, "vol": vol}


S = {
    "title": "Чистые листы Дали", "style": "board30", "week": 4, "number": 30, "rubric": "А · Скандалы и тайны",
    "width": 1080, "height": 1920, "fps": 30, "output": "dali_blank_n30.mp4",
    "voiceover": "assets/audio/voiceover_n30.mp3", "voiceover_text": W, "tail": 0.9,
    "music_file": "assets/audio/music_n30.mp3", "music_vol": 0.7, "duck_ratio": 1.8,
    "sources": [
        "Факты (greg.org / Washington Post, Artsper, Appraiser Workshops, интервью с экспертами, Wikipedia): в 1960–70-х годах Сальвадор Дали, по свидетельствам, подписывал огромное число пустых листов для литографий; оценки числа подписанных листов, дошедших до рынка, расходятся (эксперт Э. Эстебан Сепеда: 40–60 тысяч; в других источниках больше, вплоть до 350 тысяч по словам менеджера); эксперты и покупательские гиды называют рынок литографий Дали одним из самых уязвимых для подделок и изданий сомнительного происхождения. В ролике всё подано как оценка («по оценкам», «эксперты считают»), точных процентов подделок не называем.",
        "Подпись Дали с автографом 1948 (Commons, «Firmas de Salvador Dali y Gala Dali», Public domain). «Постоянство памяти» (1931) показано миниатюрой en.wikipedia (добросовестное использование, права Дали защищены до 2059, риск претензий платформы). Фото Сальвадора Дали 1965 (Roger Higgins, New York World-Telegram, Commons, Public domain). Клипы и сцены нейросетевые иллюстрации (Magnific: стартовые кадры images_generate с reference собаки, видео Kling 2.5). Работы Дали в ролике не показаны (авторские права защищены).",
    ],
    "images": {
        "dali65": {"file": "n30/img/dali65.jpg", "size": [960, 1252], "license": "Public domain (Commons, Roger Higgins 1965)"},
        "dog": {"file": "n30/img/p_open.png", "size": [575, 890], "license": "ИЛЛЮСТРАЦИЯ нейросети (Magnific), персонаж Шиба"},
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО №30 · ЛИСТЫ ДАЛИ", "nodes": []},
    "scenes": [{"id": 1, "type": "board", "from": 0}],
    "cam": [],
    "dingAt": 62,
    "sfx": {"whoosh": "assets/audio/sfx8/t_whoosh.mp3", "ting": "assets/audio/sfx8/t_ting.mp3", "pulse": "assets/audio/sfx8/t_pulse.mp3", "shing": "assets/audio/sfx8/t_shing.mp3",
            "ding": "assets/audio/sfx8/t_ting.mp3", "thud": "assets/audio/sfx15/t_thud.mp3", "tick": "assets/audio/sfx_tick.mp3", "stamp": "assets/audio/sfx10/t_stamp.mp3", "swoosh": "assets/audio/sfx8/t_whoosh.mp3",
            "slap": "assets/audio/sfx13/t_slap.mp3", "brush": "assets/audio/sfx12/t_brush.mp3", "coin": "assets/audio/sfx11/t_coin.mp3"},
    "events": [
        ev("pulse", 0, 0.0, 0.4), ev("whoosh", 5, 0.0, 0.6), ev("whoosh", 17, -0.5, 0.6),
        ev("stamp", 28, 0.05, 0.6), ev("tick", 38, 0.0, 0.3), ev("tick", 40, 0.0, 0.3), ev("ting", 41, 0.0, 0.35),
        ev("whoosh", 42, -0.45, 0.6), ev("stamp", 45, 0.05, 0.5), ev("stamp", 47, 0.1, 0.5), ev("stamp", 49, 0.0, 0.5),
        ev("whoosh", 53, -0.45, 0.6), ev("stamp", 55, 0.0, 0.6),
        ev("whoosh", 57, -0.2, 0.6), ev("ting", 62, 0.3, 0.5),
    ],
}
json.dump(S, open(base + r'\script_n30.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
