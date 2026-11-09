"""Видео 24 «Мозг на потолке» («Сотворение Адама», метка n24, стиль board24): мозг-контур на фреске, цифры-штампы, переходы: вайп, круг, плитки, переворот, жалюзи, вайп вверх."""
import json

base = r'C:\Users\awright\Desktop\Видео Клод'

b17 = open(base + r'\remotion\src\Board17.jsx', encoding='utf-8').read()
head = b17[:b17.index('// наклейка')].replace("staticFile('n17/img/' + n)", "staticFile('n24/img/' + n)")
ka = head.index('const KEYS = [')
kb = head.index('];', ka) + 2
keys = '''const KEYS = [
  {t: 0.0, x: 540, y: 3000, s: 1.0, pose: 'brain', look: 1},
  {t: 3.9, x: 540, y: 3000, s: 1.0, pose: 'brain', look: 1},
  {t: 4.6, ...SIDE_R, pose: 'ruff', look: -1},
  {t: 5.2, ...SIDE_R, pose: 'ruff', look: -1},
  {t: 5.9, ...SIDE_L, pose: 'open', look: 1},
  {t: 8.5, ...SIDE_L, pose: 'open', look: 1},
  {t: 9.2, ...SIDE_R, pose: 'look', look: -1},
  {t: 11.4, ...SIDE_R, pose: 'look', look: -1},
  {t: 12.1, ...SIDE_L, pose: 'reach', look: 1},
  {t: 14.9, ...SIDE_L, pose: 'reach', look: 1},
  {t: 15.6, ...SIDE_R, pose: 'jump', look: -1},
  {t: 17.0, ...SIDE_R, pose: 'jump', look: -1},
  {t: 17.4, ...SIDE_R, pose: 'jump', look: -1},
  {t: 18.0, ...SIDE_L, pose: 'scared', look: 1},
  {t: 21.0, ...SIDE_L, pose: 'scared', look: 1},
  {t: 21.7, x: 540, y: 1790, s: 1.0, pose: 'brain', look: 1},
  {t: 40, x: 540, y: 1790, s: 1.0, pose: 'brain', look: 1},
];'''
head = head[:ka] + keys + head[kb:]
main = open(base + r'\scripts\main24_main.jsx', encoding='utf-8').read()
open(base + r'\remotion\src\Board24.jsx', 'w', encoding='utf-8').write(head + main)

p = base + r'\remotion\src\Main.jsx'
m = open(p, encoding='utf-8').read()
if 'Board24Main' not in m:
    m = m.replace("import {Board23Main} from './Board23';", "import {Board23Main} from './Board23';\nimport {Board24Main} from './Board24';", 1)
    m = m.replace("script.style === 'board23' ? Board23Main :", "script.style === 'board23' ? Board23Main : script.style === 'board24' ? Board24Main :", 1)
    open(p, 'w', encoding='utf-8').write(m)

W = open(base + r'\build\n24\text.txt', encoding='utf-8').read().strip()
ws = W.split()
assert len(ws) == 61


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


rng = [(0, 4), (5, 10), (11, 17), (18, 22), (23, 27), (28, 31), (32, 36), (37, 41), (42, 44), (45, 47), (48, 51), (52, 56), (57, 60)]
caps = [cap(a, b) for a, b in rng]


def ev(sfx, at, dt=0.0, vol=0.5):
    return {"sfx": sfx, "at": at, "dt": dt, "vol": vol}


S = {
    "title": "Мозг на потолке", "style": "board24", "week": 4, "number": 24, "rubric": "В · Тайны картин",
    "width": 1080, "height": 1920, "fps": 30, "output": "brain_ceiling_n24.mp4",
    "voiceover": "assets/audio/voiceover_n24.mp3", "voiceover_text": W, "tail": 0.9,
    "music_file": "assets/audio/music_n24.mp3", "music_vol": 0.7, "duck_ratio": 1.8,
    "sources": [
        "Микеланджело, «Сотворение Адама», фреска потолка Сикстинской капеллы, 1508–1512, Ватикан (Public domain, Commons: Michelangelo - Creation of Adam (cropped).jpg)",
        "Гипотеза: Frank Lynn Meshberger (врач-акушер-гинеколог из США), «An interpretation of Michelangelo's Creation of Adam based on neuroanatomy», JAMA 1990;264(14):1837-1841: контур Бога и плаща напоминает срез мозга (сильвиева борозда, перекрёст зрительных нервов, ствол мозга и т.д.). Микеланджело изучал анатомию и вскрывал тела (по свидетельствам современников); это довод правдоподобия, не прямое доказательство. Версия остаётся гипотезой, спорят до сих пор (в т.ч. обзор Ashford & Tatem, Neurocase 2020). Контур мозга на экране нарисован схематично, это иллюстрация, а не точное наложение.",
        "Наброски: Микеланджело, анатомические этюды (The Met 21.15.1 recto/verso и 21.15.2, CC0; Commons). Скальпель: Commons «Scalpel (PSF).png» (Public domain). Врач на экране — сгенерированная нейросетью иллюстрация (портрет Мешбергера не найден), подписана «иллюстрация».",
        "Хук: видео собаки-Адама на облаке с небесными телами: стартовый кадр и видео сгенерированы в Magnific (images_generate + Kling 2.5, 720p, 5 с, ускорено до 3,1 с), иллюстрация.",
        "Портрет Микеланджело работы Даниэле да Вольтерра (Public domain, Commons: Michelangelo Daniele da Volterra (dettaglio).jpg)",
        "Собака Шиба: позы (с мозгом, смотрит вверх, тянется лапой) сгенерированы нейросетью (Magnific), вырезаны; видео не генерировали",
    ],
    "images": {
        "fresco": {"file": "n24/img/fresco.jpg", "size": [3524, 1599], "license": "Public domain (Commons)"},
        "michel": {"file": "n24/img/michel.jpg", "size": [960, 1111], "license": "Public domain (Commons)"},
        "dog": {"file": "n24/img/p_{brain,look,reach}.png", "size": [575, 890], "license": "ИЛЛЮСТРАЦИИ нейросети (Magnific), персонаж Шиба"},
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО №24 · МОЗГ НА ПОТОЛКЕ", "nodes": []},
    "scenes": [{"id": 1, "type": "board", "from": 0}],
    "cam": [],
    "dingAt": 60,
    "sfx": {"whoosh": "assets/audio/sfx8/t_whoosh.mp3", "ting": "assets/audio/sfx8/t_ting.mp3", "pulse": "assets/audio/sfx8/t_pulse.mp3", "shing": "assets/audio/sfx8/t_shing.mp3",
            "ding": "assets/audio/sfx8/t_ting.mp3", "thud": "assets/audio/sfx15/t_thud.mp3", "tick": "assets/audio/sfx_tick.mp3", "stamp": "assets/audio/sfx10/t_stamp.mp3", "swoosh": "assets/audio/sfx8/t_whoosh.mp3",
            "slap": "assets/audio/sfx13/t_slap.mp3", "brush": "assets/audio/sfx12/t_brush.mp3"},
    "events": [
        ev("pulse", 0, 0.0, 0.4), ev("ting", 3, 0.0, 0.35), ev("whoosh", 10, -0.05, 0.7),
        ev("whoosh", 11, -0.3, 0.55),
        ev("stamp", 16, -0.1, 0.6), ev("stamp", 16, 0.15, 0.6), ev("stamp", 17, 0.1, 0.6), ev("stamp", 17, 0.3, 0.6),
        ev("stamp", 20, 0.0, 0.6), ev("stamp", 20, 0.25, 0.6), ev("stamp", 21, 0.2, 0.6), ev("stamp", 21, 0.4, 0.6),
        ev("whoosh", 23, -0.5, 0.55),
        ev("stamp", 25, -0.05, 0.6), ev("stamp", 25, 0.2, 0.6), ev("stamp", 26, 0.15, 0.6), ev("stamp", 27, 0.0, 0.6),
        ev("whoosh", 32, -0.5, 0.55), ev("shing", 33, 0.0, 0.4), ev("ting", 39, 0.0, 0.35),
        ev("whoosh", 42, -0.4, 0.55), ev("tick", 44, 0.0, 0.3), ev("tick", 45, 0.0, 0.3),
        ev("shing", 47, 0.2, 0.6), ev("whoosh", 47, 0.35, 0.6), ev("stamp", 51, 0.05, 0.7), ev("ting", 52, 0.0, 0.3), ev("ting", 53, 0.4, 0.3),
        ev("whoosh", 57, -0.2, 0.5), ev("ting", 60, 0.2, 0.5),
    ],
}
json.dump(S, open(base + r'\script_n24.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
