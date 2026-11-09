"""Видео 13 «Песня из ада» (Босх, метка n13): бумажный коллаж на сине-сером картоне, гротескные шрифты (Anton, Archivo Black), слова-плитки."""
import json

base = r'C:\Users\awright\Desktop\Видео Клод'

s = open(base + r'\remotion\src\Board10.jsx', encoding='utf-8').read()
head = s.split('export const Board10Main')[0].replace("staticFile('n10/img/'", "staticFile('n13/img/'")
open(base + r'\remotion\src\Board13.jsx', 'w', encoding='utf-8').write(head + open(base + r'\scripts\main13_part.jsx', encoding='utf-8').read())

p = base + r'\remotion\src\Main.jsx'
m = open(p, encoding='utf-8').read()
if 'Board13Main' not in m:
    m = m.replace("import {Board12Main} from './Board12';", "import {Board12Main} from './Board12';\nimport {Board13Main} from './Board13';", 1)
    m = m.replace("script.style === 'board12' ? Board12Main :", "script.style === 'board12' ? Board12Main : script.style === 'board13' ? Board13Main :", 1)
    open(p, 'w', encoding='utf-8').write(m)

W = open(base + r'\build\n13\text.txt', encoding='utf-8').read().strip()
ws = W.split()


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


caps = [cap(0, 2), cap(3, 7), cap(8, 11), [["500", 12, 12], ["лет", 13, 13], ["назад,", 14, 14]], cap(15, 18), [["А", 19, 19], ["в", 20, 20], ["2014", 21, 23]], cap(24, 26), cap(27, 28), cap(29, 32),
        cap(33, 35), cap(36, 39), cap(40, 41), cap(42, 44), cap(45, 46), cap(47, 51), cap(52, 54)]

CAM = [
    (0, 900, 790, 1.0, 0, None), (3, 900, 1050, 1.0, -1, 10), (8, 2100, 2020, 1.0, 2, 10), (12, 2150, 2120, 1.1, -1, 10), (19, 900, 2770, 1.0, -2, 10), (33, 2100, 3680, 1.0, 2, 10),
]

S = {
    "title": "Песня из ада", "style": "board13", "week": 3, "number": 13, "rubric": "В · Тайны и коды",
    "width": 1080, "height": 1920, "fps": 30, "output": "hell_song_n13.mp4",
    "voiceover": "assets/audio/voiceover_n13.mp3", "voiceover_text": W, "tail": 0.8,
    "music_file": "assets/audio/music_n13.mp3", "music_vol": 0.8, "duck_ratio": 1.6,
    "sources": [
        "Hieronymus Bosch, «Сад земных наслаждений» (ок. 1490-1510, музей Прадо), правая створка «Музыкальный ад»; на ягодицах одного из грешников нотная запись",
        "2014: Amelia Hamrick, студентка Oklahoma Christian University, расшифровала ноты (григорианская нотация, вторая линия стана принята за до) и выложила запись; позднее сама признала ошибки в расшифровке и работала над исправленной версией",
        "ВАЖНО: часть учёных (например, Early Music Muse) считает, что знаки не настоящая музыка (нет ключа, высота нот не определена), поэтому в ролике это подано как гипотеза; в озвучке «песню можно послушать» условно: на экране нет самой записи расшифровки",
        "Картины: «Сад земных наслаждений» (Public domain, Wikimedia Commons: The Garden of Earthly Delights by Bosch High Resolution 2.jpg), вырезки детали сделаны нами",
    ],
    "images": {
        "bosch": {"file": "n13/img/bosch_full.jpg", "size": [3840, 2165], "license": "Public domain (Босх, «Сад земных наслаждений», Wikimedia Commons: The Garden of Earthly Delights by Bosch High Resolution 2.jpg)"},
        "cuts": {"file": "n13/img/cut_{notes,close,book,instr,tri}.png", "size": [0, 0], "license": "Детали той же картины (Public domain), вырезки с рваным краем: make_n13_assets.py"},
        "bg": {"file": "n13/img/bg_slate.jpg", "size": [3400, 5100], "license": "Процедурный фон (картон), создан скриптом"},
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО №13 · ПЕСНЯ ИЗ АДА", "nodes": []},
    "scenes": [{"id": 1, "type": "board", "from": 0}],
    "cam": [dict({"w": w, "x": x, "y": y, "z": z, "r": r}, **({"d": d} if d else {})) for (w, x, y, z, r, d) in CAM],
    "dingAt": 54,
    "sfx": {"swoosh": "assets/audio/sfx8/t_whoosh.mp3", "stamp": "assets/audio/sfx10/t_stamp.mp3", "ding": "assets/audio/sfx8/t_ting.mp3", "tick": "assets/audio/sfx_tick.mp3",
            "whoosh": "assets/audio/sfx8/t_whoosh.mp3", "ting": "assets/audio/sfx8/t_ting.mp3", "pulse": "assets/audio/sfx8/t_pulse.mp3", "riser": "assets/audio/sfx8/t_riser.mp3",
            "shing": "assets/audio/sfx8/t_shing.mp3", "inkstamp": "assets/audio/sfx10/t_stamp.mp3", "rip": "assets/audio/sfx13/t_rip.mp3", "slap": "assets/audio/sfx13/t_slap.mp3"},
    "events": [
        {"sfx": "pulse", "at": 0, "dt": 0.0, "vol": 0.8}, {"sfx": "slap", "at": 0, "dt": 0.02, "vol": 0.7}, {"sfx": "slap", "at": 0, "dt": 0.3, "vol": 0.7}, {"sfx": "rip", "at": 3, "dt": -0.1, "vol": 0.6},
        {"sfx": "slap", "at": 4, "dt": 0.0, "vol": 0.7}, {"sfx": "rip", "at": 8, "dt": -0.15, "vol": 0.6}, {"sfx": "slap", "at": 9, "dt": 0.0, "vol": 0.6}, {"sfx": "slap", "at": 12, "dt": 0.0, "vol": 0.7},
        {"sfx": "slap", "at": 15, "dt": 0.0, "vol": 0.5}, {"sfx": "slap", "at": 17, "dt": 0.0, "vol": 0.5}, {"sfx": "rip", "at": 19, "dt": -0.15, "vol": 0.6}, {"sfx": "slap", "at": 21, "dt": 0.0, "vol": 0.6},
        {"sfx": "slap", "at": 26, "dt": 0.0, "vol": 0.6}, {"sfx": "ting", "at": 28, "dt": 0.0, "vol": 0.3}, {"sfx": "ting", "at": 28, "dt": 0.25, "vol": 0.3}, {"sfx": "ting", "at": 29, "dt": 0.2, "vol": 0.3},
        {"sfx": "shing", "at": 31, "dt": 0.0, "vol": 0.5}, {"sfx": "rip", "at": 33, "dt": -0.15, "vol": 0.6}, {"sfx": "ting", "at": 36, "dt": 0.0, "vol": 0.3}, {"sfx": "ting", "at": 38, "dt": 0.0, "vol": 0.3},
        {"sfx": "slap", "at": 40, "dt": 0.0, "vol": 0.8}, {"sfx": "inkstamp", "at": 43, "dt": 0.0, "vol": 1.0}, {"sfx": "pulse", "at": 45, "dt": 0.0, "vol": 0.5}, {"sfx": "ting", "at": 52, "dt": 0.0, "vol": 0.4},
        {"sfx": "ting", "at": 54, "dt": 0.1, "vol": 0.5}, {"sfx": "shing", "at": 54, "dt": 0.2, "vol": 0.4},
    ],
}
json.dump(S, open(base + r'\script_n13.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
