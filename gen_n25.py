"""Видео 25 «450 миллионов и тишина» («Спаситель мира», метка n25, стиль board25): 2-секундный видео-хук с собакой-Спасителем, переходы: вайп, плитки, переворот, круг, жалюзи, вайп вверх."""
import json

base = r'C:\Users\awright\Desktop\Видео Клод'

b17 = open(base + r'\remotion\src\Board17.jsx', encoding='utf-8').read()
head = b17[:b17.index('// наклейка')].replace("staticFile('n17/img/' + n)", "staticFile('n25/img/' + n)")
ka = head.index('const KEYS = [')
kb = head.index('];', ka) + 2
keys = '''const KEYS = [
  {t: 0.0, x: 540, y: 3000, s: 1.0, pose: 'paddle', look: 1},
  {t: 2.6, x: 540, y: 3000, s: 1.0, pose: 'paddle', look: 1},
  {t: 3.1, ...SIDE_R, pose: 'paddle', look: -1},
  {t: 4.1, ...SIDE_R, pose: 'paddle', look: -1},
  {t: 4.8, ...SIDE_L, pose: 'open', look: 1},
  {t: 5.6, ...SIDE_L, pose: 'open', look: 1},
  {t: 6.3, ...SIDE_R, pose: 'auct', look: -1},
  {t: 9.6, ...SIDE_R, pose: 'auct', look: -1},
  {t: 10.4, ...SIDE_L, pose: 'paddle', look: 1},
  {t: 14.2, ...SIDE_L, pose: 'paddle', look: 1},
  {t: 14.9, ...SIDE_R, pose: 'agent', look: -1},
  {t: 18.3, ...SIDE_R, pose: 'agent', look: -1},
  {t: 19.0, ...SIDE_L, pose: 'scared', look: 1},
  {t: 21.4, ...SIDE_L, pose: 'scared', look: 1},
  {t: 22.1, x: 540, y: 1790, s: 1.0, pose: 'agent', look: 1},
  {t: 40, x: 540, y: 1790, s: 1.0, pose: 'agent', look: 1},
];'''
head = head[:ka] + keys + head[kb:]
main = open(base + r'\scripts\main25_main.jsx', encoding='utf-8').read()
open(base + r'\remotion\src\Board25.jsx', 'w', encoding='utf-8').write(head + main)

p = base + r'\remotion\src\Main.jsx'
m = open(p, encoding='utf-8').read()
if 'Board25Main' not in m:
    m = m.replace("import {Board24Main} from './Board24';", "import {Board24Main} from './Board24';\nimport {Board25Main} from './Board25';", 1)
    m = m.replace("script.style === 'board24' ? Board24Main :", "script.style === 'board24' ? Board24Main : script.style === 'board25' ? Board25Main :", 1)
    open(p, 'w', encoding='utf-8').write(m)

W = open(base + r'\build\n25\text.txt', encoding='utf-8').read().strip()
ws = W.split()
assert len(ws) == 72


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


rng = [(0, 3), (4, 7), (8, 10), (11, 13), (14, 19), (20, 26), (27, 28), (29, 33), (34, 36), (37, 43), (44, 50), (51, 53), (54, 57), (58, 61), (62, 66), (67, 68), (69, 71)]
caps = [cap(a, b) for a, b in rng]


def ev(sfx, at, dt=0.0, vol=0.5):
    return {"sfx": sfx, "at": at, "dt": dt, "vol": vol}


S = {
    "title": "450 миллионов и тишина", "style": "board25", "week": 4, "number": 25, "rubric": "А · Скандалы и тайны",
    "width": 1080, "height": 1920, "fps": 30, "output": "salvator_mundi_n25.mp4",
    "voiceover": "assets/audio/voiceover_n25.mp3", "voiceover_text": W, "tail": 0.9,
    "music_file": "assets/audio/music_n25.mp3", "music_vol": 0.7, "duck_ratio": 1.8,
    "sources": [
        "Леонардо да Винчи (атрибуция оспаривается), «Спаситель мира» (Salvator Mundi), ок. 1500 (Public domain, Commons: Leonardo da Vinci, Salvator Mundi, c.1500...jpg и «Leonardo da Vinci or Boltraffio (attrib) Salvator Mundi circa 1500.jpg»); портрет Леонардо — предполагаемый автопортрет (Commons, PD)",
        "1958: продана на Sotheby's в Лондоне за 45 фунтов как работа Больтраффио (Artnet); 15 ноября 2017: Christie's, Нью-Йорк, 450,3 млн долларов, самая дорогая картина на аукционе (Wikipedia, Britannica). С тех пор публично не показывалась (Study.com, СМИ), по сообщениям СМИ у частного владельца; часть специалистов оспаривает авторство Леонардо, Christie's указывал, что большинство учёных считают её подлинной (Britannica). Рисунок сейфа и цены схематичны (иллюстрации).",
        "Хук: собака в образе «Спасителя мира» с хрустальным шаром: стартовый кадр (Magnific images_generate с reference собаки) и видео Kling 2.5 (720p, 5 с, ускорено в 2,2 раза, 2,2 с) сгенерированы нейросетью, иллюстрации. Позы собаки (табличка торгов, агент в плаще, аукционист с молотком) сгенерированы в Magnific.",
    ],
    "images": {
        "sm": {"file": "n25/img/sm.jpg", "size": [1920, 2825], "license": "Public domain (Commons)"},
        "sm_old": {"file": "n25/img/sm_old.jpg", "size": [1920, 2498], "license": "Public domain (Commons)"},
        "leo": {"file": "n25/img/leo.jpg", "size": [740, 1153], "license": "Public domain (Commons)"},
        "dog": {"file": "n25/img/p_{paddle,agent,auct}.png", "size": [575, 890], "license": "ИЛЛЮСТРАЦИИ нейросети (Magnific), персонаж Шиба"},
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО №25 · СПАСИТЕЛЬ МИРА", "nodes": []},
    "scenes": [{"id": 1, "type": "board", "from": 0}],
    "cam": [],
    "dingAt": 71,
    "sfx": {"whoosh": "assets/audio/sfx8/t_whoosh.mp3", "ting": "assets/audio/sfx8/t_ting.mp3", "pulse": "assets/audio/sfx8/t_pulse.mp3", "shing": "assets/audio/sfx8/t_shing.mp3",
            "ding": "assets/audio/sfx8/t_ting.mp3", "thud": "assets/audio/sfx15/t_thud.mp3", "tick": "assets/audio/sfx_tick.mp3", "stamp": "assets/audio/sfx10/t_stamp.mp3", "swoosh": "assets/audio/sfx8/t_whoosh.mp3",
            "slap": "assets/audio/sfx13/t_slap.mp3", "brush": "assets/audio/sfx12/t_brush.mp3", "coin": "assets/audio/sfx11/t_coin.mp3"},
    "events": [
        ev("pulse", 0, 0.0, 0.4), ev("shing", 5, 0.1, 0.55), ev("whoosh", 6, 0.0, 0.6), ev("coin", 6, 0.3, 0.45), ev("stamp", 10, 0.15, 0.7),
        ev("whoosh", 11, -0.3, 0.55), ev("ting", 12, 0.1, 0.3),
        ev("whoosh", 14, -0.4, 0.55), ev("stamp", 15, 0.1, 0.6), ev("stamp", 16, 0.2, 0.6), ev("stamp", 17, 0.15, 0.6), ev("stamp", 18, 0.1, 0.6),
        ev("thud", 25, 0.0, 0.5), ev("stamp", 27, 0.0, 0.7),
        ev("whoosh", 29, -0.5, 0.55), ev("stamp", 32, 0.1, 0.6), ev("stamp", 33, 0.05, 0.6), ev("stamp", 33, 0.3, 0.6), ev("stamp", 34, 0.05, 0.6),
        ev("coin", 40, 0.0, 0.5), ev("ting", 42, 0.0, 0.4),
        ev("whoosh", 44, -0.4, 0.55), ev("thud", 51, -0.1, 0.65),
        ev("whoosh", 58, -0.4, 0.55), ev("stamp", 66, 0.2, 0.7),
        ev("whoosh", 67, -0.2, 0.5), ev("ting", 71, 0.2, 0.5),
    ],
}
json.dump(S, open(base + r'\script_n25.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
