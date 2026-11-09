"""Видео 23 «Большая волна» (Хокусай, метка n23, стиль board23): волнистый вайп, круг, переворот, жалюзи, косой вайп, плитки; собака в лодке, сёрфер, каллиграф."""
import json

base = r'C:\Users\awright\Desktop\Видео Клод'

b17 = open(base + r'\remotion\src\Board17.jsx', encoding='utf-8').read()
head = b17[:b17.index('// наклейка')].replace("staticFile('n17/img/' + n)", "staticFile('n23/img/' + n)")
ka = head.index('const KEYS = [')
kb = head.index('];', ka) + 2
keys = '''const KEYS = [
  {t: 0.0, x: 540, y: 1880, s: 1.0, pose: 'boat', look: 1},
  {t: 0.4, x: 540, y: 1800, s: 1.0, pose: 'boat', look: 1},
  {t: 0.8, x: 540, y: 1880, s: 1.0, pose: 'boat', look: 1},
  {t: 1.2, x: 540, y: 1800, s: 1.0, pose: 'boat', look: 1},
  {t: 1.6, x: 540, y: 1880, s: 1.0, pose: 'boat', look: 1},
  {t: 2.5, ...SIDE_R, pose: 'brush', look: -1},
  {t: 6.3, ...SIDE_R, pose: 'brush', look: -1},
  {t: 7.0, ...SIDE_L, pose: 'surf', look: 1},
  {t: 10.4, ...SIDE_L, pose: 'surf', look: 1},
  {t: 11.1, ...SIDE_R, pose: 'laugh', look: -1},
  {t: 13.9, ...SIDE_R, pose: 'laugh', look: -1},
  {t: 14.7, ...SIDE_L, pose: 'open', look: 1},
  {t: 18.6, ...SIDE_L, pose: 'open', look: 1},
  {t: 19.3, ...SIDE_R, pose: 'brush', look: -1},
  {t: 21.3, ...SIDE_R, pose: 'brush', look: -1},
  {t: 22.0, x: 500, y: 2679, s: 2.1, pose: 'lupa', look: 1},
  {t: 40, x: 500, y: 2679, s: 2.1, pose: 'lupa', look: 1},
];'''
head = head[:ka] + keys + head[kb:]
main = open(base + r'\scripts\main23_main.jsx', encoding='utf-8').read()
open(base + r'\remotion\src\Board23.jsx', 'w', encoding='utf-8').write(head + main)

p = base + r'\remotion\src\Main.jsx'
m = open(p, encoding='utf-8').read()
if 'Board23Main' not in m:
    m = m.replace("import {Board22Main} from './Board22';", "import {Board22Main} from './Board22';\nimport {Board23Main} from './Board23';", 1)
    m = m.replace("script.style === 'board22' ? Board22Main :", "script.style === 'board22' ? Board22Main : script.style === 'board23' ? Board23Main :", 1)
    open(p, 'w', encoding='utf-8').write(m)

W = open(base + r'\build\n23\text.txt', encoding='utf-8').read().strip()
ws = W.split()
assert len(ws) == 64


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


rng = [(0, 4), (5, 10), (11, 16), (17, 22), (23, 27), (28, 31), (32, 36), (37, 40), (41, 48), (49, 52), (53, 55), (56, 63)]
caps = [cap(a, b) for a, b in rng]


def ev(sfx, at, dt=0.0, vol=0.5):
    return {"sfx": sfx, "at": at, "dt": dt, "vol": vol}


S = {
    "title": "Волна, которая не цунами", "style": "board23", "week": 4, "number": 23, "rubric": "В · Тайны картин",
    "width": 1080, "height": 1920, "fps": 30, "output": "great_wave_n23.mp4",
    "voiceover": "assets/audio/voiceover_n23.mp3", "voiceover_text": W, "tail": 0.9,
    "music_file": "assets/audio/music_n23.mp3", "music_vol": 0.7, "duck_ratio": 1.8,
    "sources": [
        "Кацусика Хокусай, «Большая волна в Канагаве» (Kanagawa-oki nami ura), ок. 1831, серия «36 видов Фудзи» (Public domain, Commons: The Great Wave off Kanagawa.jpg)",
        "Не цунами: исследователи (Cartwright & Nakamura, Notes and Records of the Royal Society, 2009; PNAS) считают, что изображена огромная штормовая волна (plunging breaker / «волна-убийца»); Фудзи на гравюре маленькая. Гравюра печаталась тиражом, сохранились сотни оттисков. Дебюсси: обложка первого издания партитуры «Моря» (1905) с волной Хокусая (Commons: Claude Debussy La mer couverture.PNG, PD). Моне коллекционировал японские гравюры (в т.ч. «Волну» по сообщениям). Хокусай менял имя около 30 раз (источники называют от 30 до более 30); имена на экране: Сюнро, Сорин, Тайто, Иицу. Автопортрет в 83 года (Commons, PD).",
        "Собака Шиба: позы (лодка, сёрфинг, кимоно с кистью и веером) сгенерированы нейросетью (Magnific), вырезаны; видео не генерировали",
    ],
    "images": {
        "monet": {"file": "n23/img/monet.jpg", "size": [960, 1280], "license": "Public domain (Commons: Claude Monet 1899 Nadar crop.jpg)"},
        "debussy": {"file": "n23/img/debussy.jpg", "size": [960, 1293], "license": "Public domain (Commons: Claude Debussy ca 1908, foto av Félix Nadar.jpg)"},
        "wave": {"file": "n23/img/wave.jpg", "size": [3840, 2649], "license": "Public domain (Commons)"},
        "cover": {"file": "n23/img/cover.png", "size": [960, 1454], "license": "Public domain (Commons)"},
        "hokusai": {"file": "n23/img/hokusai.png", "size": [673, 628], "license": "Public domain (Commons)"},
        "dog": {"file": "n23/img/p_{boat,surf,brush}.png", "size": [575, 890], "license": "ИЛЛЮСТРАЦИИ нейросети (Magnific), персонаж Шиба"},
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО №23 · БОЛЬШАЯ ВОЛНА", "nodes": []},
    "scenes": [{"id": 1, "type": "board", "from": 0}],
    "cam": [],
    "dingAt": 63,
    "sfx": {"whoosh": "assets/audio/sfx8/t_whoosh.mp3", "ting": "assets/audio/sfx8/t_ting.mp3", "pulse": "assets/audio/sfx8/t_pulse.mp3", "shing": "assets/audio/sfx8/t_shing.mp3",
            "ding": "assets/audio/sfx8/t_ting.mp3", "thud": "assets/audio/sfx15/t_thud.mp3", "tick": "assets/audio/sfx_tick.mp3", "stamp": "assets/audio/sfx10/t_stamp.mp3", "swoosh": "assets/audio/sfx8/t_whoosh.mp3",
            "slap": "assets/audio/sfx13/t_slap.mp3", "brush": "assets/audio/sfx12/t_brush.mp3"},
    "events": [
        ev("whoosh", 0, 0.0, 0.65), ev("brush", 3, 0.2, 0.4), ev("stamp", 4, 0.3, 0.7),
        ev("whoosh", 5, -0.4, 0.6), ev("stamp", 12, -0.1, 0.6), ev("stamp", 13, -0.15, 0.6), ev("stamp", 14, -0.2, 0.6), ev("stamp", 15, -0.1, 0.65),
        ev("whoosh", 17, -0.1, 0.55), ev("ting", 20, 0.0, 0.35), ev("ting", 22, 0.0, 0.3),
        ev("whoosh", 28, -0.4, 0.55), ev("slap", 28, 0.3, 0.4), ev("slap", 30, 0.2, 0.4), ev("slap", 34, 0.1, 0.4),
        ev("whoosh", 37, -0.4, 0.55), ev("ting", 40, 0.0, 0.3), ev("ting", 42, 0.0, 0.3),
        ev("whoosh", 49, -0.3, 0.55), ev("tick", 51, 0.0, 0.3), ev("tick", 52, 0.0, 0.3), ev("ting", 54, 0.0, 0.4),
        ev("whoosh", 56, -0.3, 0.5), ev("stamp", 62, 0.0, 0.5), ev("ting", 63, 0.2, 0.5),
    ],
}
json.dump(S, open(base + r'\script_n23.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
