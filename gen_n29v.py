"""Видео 27 «Выставка позора» («Дегенеративное искусство» 1937, метка n29, стиль board29v): видео-хук 2,6 с, анимированные субтитры по словам, переходы: вспышка, строки, круг из угла, двери, билет, колонны."""
import json

base = r'C:\Users\awright\Desktop\Видео Клод'

b17 = open(base + r'\remotion\src\Board17.jsx', encoding='utf-8').read()
head = b17[:b17.index('// наклейка')].replace("staticFile('n17/img/' + n)", "staticFile('n29v2/img/' + n)")
ka = head.index('const KEYS = [')
kb = head.index('];', ka) + 2
keys = '''const KEYS = [
  {t: 0.0, x: 540, y: 3000, s: 1.0, pose: 'laugh', look: 1},
  {t: 22.2, x: 540, y: 3000, s: 1.0, pose: 'laugh', look: 1},
  {t: 22.7, x: 890, y: 1830, s: 0.6, pose: 'laugh', look: -1},
  {t: 24.6, x: 890, y: 1830, s: 0.6, pose: 'laugh', look: -1},
  {t: 25.1, x: 540, y: 1790, s: 0.85, pose: 'open', look: 1},
  {t: 40, x: 540, y: 1790, s: 0.85, pose: 'open', look: 1},
];'''
head = head[:ka] + keys + head[kb:]
main = open(base + r'\scripts\main29v_main.jsx', encoding='utf-8').read()
open(base + r'\remotion\src\Board29v.jsx', 'w', encoding='utf-8').write(head + main)

W = open(base + r'\build\n29\text.txt', encoding='utf-8').read().strip()
ws = W.split()
assert len(ws) == 75


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


rng = [(0, 3), (4, 8), (9, 11), (12, 17), (18, 24), (25, 28), (29, 33), (34, 38), (39, 43), (44, 47), (48, 52), (53, 56), (57, 62), (63, 64), (65, 69), (70, 74)]
caps = [cap(a, b) for a, b in rng]


def ev(sfx, at, dt=0.0, vol=0.5):
    return {"sfx": sfx, "at": at, "dt": dt, "vol": vol}


S = {
    "title": "Зеркало над кроватью (вариант 2)", "style": "board29v", "week": 4, "number": 29, "rubric": "Г · Герои и судьбы",
    "width": 1080, "height": 1920, "fps": 30, "output": "frida_mirror_n29_v2.mp4",
    "voiceover": "assets/audio/voiceover_n29v2.mp3", "voiceover_text": W, "tail": 0.9,
    "music_file": "assets/audio/music_n29.mp3", "music_vol": 0.7, "duck_ratio": 1.8,
    "sources": [
        "Факты (Google Arts & Culture, Biography, History.com, Wikipedia): 17 сентября 1925 года в Мехико автобус, в котором ехала 18-летняя Фрида Кало, столкнулся с трамваем (тяжёлые переломы позвоночника, таза и ноги); месяцы в постели в гипсе; по её словам, мать распорядилась закрепить зеркало под балдахином кровати и сделать особый мольберт, так Фрида начала писать автопортреты (первый, «Автопортрет в бархатном платье», 1926). Счёт «55 автопортретов из 143 картин» приводят вторичные источники (Wikipedia, арт-сайты), возможны расхождения; в ролике «больше трети».",
        "Коллаж «знаменитые картины» (en.wikipedia, миниатюры, добросовестное использование для комментария; риск претензий платформы): Две Фриды, Автобус (1929), Больница Генри Форда, Раненый олень, Автопортрет в бархатном платье, Посвящение Троцкому, Диего и я, Корни, Фрида и Диего Ривера, Время летит. Зеркало: 18th Century Venetian Mirror, Bemberg Foundation (Commons, CC BY-SA 4.0, вырезано Magnific). Фото Фриды в постели за работой свободного нет, в ролике иллюстрация комнаты. Фото Фриды Кало 1932 (Guillermo Kahlo, Commons, PD); «Автопортрет в бархатном платье» (1926) показан миниатюрой en.wikipedia (добросовестное использование для комментария; права на картину могут быть защищены, риск претензий платформы). Комната, зеркало и мольберт, авария автобуса и трамвая, календарь и гипс на экране схематичные иллюстрации (комната сгенерирована нейросетью Magnific, подпись «иллюстрация»).",
        "Хук: стартовый кадр (Magnific images_generate с reference собаки) и видео Kling 2.5 (720p, 5 с) сгенерированы нейросетью, иллюстрация. Позы собаки из прежних роликов.",
    ],
    "images": {
        "frida32": {"file": "n29v2/img/frida32.jpg", "size": [1000, 1500], "license": "Public domain (Guillermo Kahlo, 1932, Commons)"},
        "velvet": {"file": "n29v2/img/velvet.jpg", "size": [800, 1078], "license": "Авторские права возможны; миниатюра en.wikipedia, fair use"},
        "mirror": {"file": "n29v2/img/mirror_fx.png", "size": [1149, 1794], "license": "CC BY-SA 4.0 (Bemberg Foundation, Commons)"},
        "paintings": {"file": "n29v2/img/k0..k9.jpg", "size": [700, 900], "license": "Авторские права возможны; миниатюры en.wikipedia, fair use"},
        "room": {"file": "n29v2/img/room.png", "size": [1024, 1820], "license": "ИЛЛЮСТРАЦИЯ нейросети (Magnific)"},
        "dog": {"file": "n29v2/img/p_{look,open,scared,artist,brush,jump}.png", "size": [575, 890], "license": "ИЛЛЮСТРАЦИИ нейросети (Magnific), персонаж Шиба"},
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО №29 · ЗЕРКАЛО", "nodes": []},
    "scenes": [{"id": 1, "type": "board", "from": 0}],
    "cam": [],
    "dingAt": 74,
    "sfx": {"whoosh": "assets/audio/sfx8/t_whoosh.mp3", "ting": "assets/audio/sfx8/t_ting.mp3", "pulse": "assets/audio/sfx8/t_pulse.mp3", "shing": "assets/audio/sfx8/t_shing.mp3",
            "ding": "assets/audio/sfx8/t_ting.mp3", "thud": "assets/audio/sfx15/t_thud.mp3", "tick": "assets/audio/sfx_tick.mp3", "stamp": "assets/audio/sfx10/t_stamp.mp3", "swoosh": "assets/audio/sfx8/t_whoosh.mp3",
            "slap": "assets/audio/sfx13/t_slap.mp3", "brush": "assets/audio/sfx12/t_brush.mp3", "coin": "assets/audio/sfx11/t_coin.mp3"},
    "events": [
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
}
json.dump(S, open(base + r'\script_n29v2.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
