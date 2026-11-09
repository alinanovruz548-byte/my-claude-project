"""Видео 16 «Менины», версия 2 (метка n16b, стиль board16b): светлый чистый стиль, вырезанная Шиба с синхронизацией рта, камера по картине."""
import json

base = r'C:\Users\awright\Desktop\Видео Клод'

p = base + r'\remotion\src\Main.jsx'
m = open(p, encoding='utf-8').read()
if 'Board16bMain' not in m:
    m = m.replace("import {Board16Main} from './Board16';", "import {Board16Main} from './Board16';\nimport {Board16bMain} from './Board16b';", 1)
    m = m.replace("script.style === 'board16' ? Board16Main :", "script.style === 'board16' ? Board16Main : script.style === 'board16b' ? Board16bMain :", 1)
    open(p, 'w', encoding='utf-8').write(m)

W = open(base + r'\build\n16\text.txt', encoding='utf-8').read().strip()
ws = W.split()
mouth = json.load(open(base + r'\build\n16\mouth.json'))


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


caps = [cap(0, 4), cap(5, 6), cap(7, 11), cap(12, 14), cap(15, 20), cap(21, 25), cap(26, 29), cap(30, 31), cap(32, 35), cap(36, 39), cap(40, 42), cap(43, 47), cap(48, 49), cap(50, 55)]

S = {
    "title": "Менины: кто здесь главный (v2)", "style": "board16b", "week": 3, "number": 16, "rubric": "В · Тайны и коды",
    "width": 1080, "height": 1920, "fps": 30, "output": "meninas_n16b.mp4",
    "voiceover": "assets/audio/voiceover_n16.mp3", "voiceover_text": W, "tail": 0.9,
    "music_file": "assets/audio/music_n16.mp3", "music_vol": 0.7, "duck_ratio": 1.8,
    "mouth": mouth,
    "sources": [
        "Диего Веласкес, «Менины», 1656, Прадо (Public domain, Wikimedia Commons: Las Meninas 01.jpg); в зеркале отражены Филипп IV и Марианна Австрийская (общепринятое прочтение)",
        "Пикассо в 1957 году написал 58 вариаций «Менин»; его работы защищены правами, в ролике показаны только НАШИ иллюстрации в духе кубизма (Magnific), подписаны как иллюстрации",
        "Собака Шиба: картинка и две правки (открытый рот, поднятая лапка) сделаны нейросетью (Magnific), вырезаны инструментом удаления фона; рот синхронизирован с озвучкой по громкости",
    ],
    "images": {
        "painting": {"file": "n16b/img/meninas.jpg", "size": [1920, 2210], "license": "Public domain (Веласкес, Wikimedia Commons: Las Meninas 01.jpg)"},
        "dog": {"file": "n16b/img/dog_{closed,open,point}.png", "size": [490, 610], "license": "ИЛЛЮСТРАЦИЯ нейросети (Magnific), персонаж-рассказчик"},
        "cubist": {"file": "n16b/img/cub_{0..3}.jpg", "size": [0, 0], "license": "ИЛЛЮСТРАЦИЯ нейросети (Magnific) в духе кубизма; не работы Пикассо"},
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО №16 · МЕНИНЫ", "nodes": []},
    "scenes": [{"id": 1, "type": "board", "from": 0}],
    "cam": [],
    "dingAt": 55,
    "sfx": {"whoosh": "assets/audio/sfx8/t_whoosh.mp3", "ting": "assets/audio/sfx8/t_ting.mp3", "pulse": "assets/audio/sfx8/t_pulse.mp3", "shing": "assets/audio/sfx8/t_shing.mp3",
            "ding": "assets/audio/sfx8/t_ting.mp3", "thud": "assets/audio/sfx15/t_thud.mp3", "tick": "assets/audio/sfx_tick.mp3", "stamp": "assets/audio/sfx10/t_stamp.mp3", "swoosh": "assets/audio/sfx8/t_whoosh.mp3"},
    "events": [
        {"sfx": "pulse", "at": 0, "dt": 0.0, "vol": 0.5}, {"sfx": "whoosh", "at": 3, "dt": 0.2, "vol": 0.55}, {"sfx": "whoosh", "at": 3, "dt": 0.35, "vol": 0.35}, {"sfx": "whoosh", "at": 12, "dt": -0.5, "vol": 0.22},
        {"sfx": "whoosh", "at": 13, "dt": -0.4, "vol": 0.2}, {"sfx": "whoosh", "at": 14, "dt": -0.4, "vol": 0.2}, {"sfx": "whoosh", "at": 16, "dt": -0.4, "vol": 0.22}, {"sfx": "whoosh", "at": 23, "dt": -0.6, "vol": 0.3},
        {"sfx": "ting", "at": 27, "dt": 0.0, "vol": 0.3}, {"sfx": "ting", "at": 31, "dt": 0.0, "vol": 0.3}, {"sfx": "whoosh", "at": 32, "dt": -0.3, "vol": 0.3}, {"sfx": "thud", "at": 39, "dt": -0.08, "vol": 0.9},
        {"sfx": "shing", "at": 39, "dt": 0.15, "vol": 0.45}, {"sfx": "whoosh", "at": 40, "dt": -0.1, "vol": 0.3}, {"sfx": "pulse", "at": 43, "dt": 0.0, "vol": 0.4}, {"sfx": "whoosh", "at": 48, "dt": -0.1, "vol": 0.3},
        {"sfx": "ting", "at": 52, "dt": 0.0, "vol": 0.35}, {"sfx": "ting", "at": 55, "dt": 0.2, "vol": 0.5}, {"sfx": "shing", "at": 55, "dt": 0.3, "vol": 0.35},
    ],
}
json.dump(S, open(base + r'\script_n16b.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
