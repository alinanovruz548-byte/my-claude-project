"""Видео 10 «Писсуар как шедевр» (Дюшан, метка n10): доска дела без красного, золотая нить, новые шрифты."""
import json
import re

base = r'C:\Users\awright\Desktop\Видео Клод'

p = base + r'\remotion\src\Main.jsx'
s = open(p, encoding='utf-8').read()
if 'Board10Main' not in s:
    s = s.replace("import {BoardMain} from './Board';", "import {BoardMain} from './Board';\nimport {Board10Main} from './Board10';", 1)
    s = s.replace("script.style === 'board' ? BoardMain : ClassicMain;", "script.style === 'board' ? BoardMain : script.style === 'board10' ? Board10Main : ClassicMain;", 1)
    open(p, 'w', encoding='utf-8').write(s)

# курсор и кнопки финала в экранных координатах
p = base + r'\remotion\src\Board10.jsx'
s = open(p, encoding='utf-8').read()
s = s.replace("const curX = interpolate(f, [T(49) + 10, tapAt - 2, tapAt + 8, tap2At - 4], [700, 330, 330, 760], clamp);", "const curX = interpolate(f, [T(49) + 10, tapAt - 2, tapAt + 8, tap2At - 4], [820, 600, 600, 640], clamp);")
s = s.replace("const curY = interpolate(f, [T(49) + 10, tapAt - 2, tapAt + 8, tap2At - 4], [1500, 1080, 1090, 1360], clamp);", "const curY = interpolate(f, [T(49) + 10, tapAt - 2, tapAt + 8, tap2At - 4], [1500, 840, 850, 1040], clamp);")
s = s.replace("top: curY + 330, zIndex: 80", "top: curY, zIndex: 80")
open(p, 'w', encoding='utf-8').write(s)

W = open(base + r'\build\n10\text.txt', encoding='utf-8').read().strip()
ws = W.split()


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


caps = [cap(0, 1), cap(2, 4), cap(5, 8), cap(9, 10), [["В", 11, 11], ["1917", 12, 14], ["году", 15, 15]], cap(16, 17), cap(18, 21), cap(22, 23),
        [["под", 24, 24], ["именем", 25, 25], ["Р.", 26, 26], ["Матт.", 27, 27]], cap(28, 29), cap(30, 31), cap(32, 34),
        [["Но", 35, 35], ["спустя", 36, 36], ["почти", 37, 37], ["90", 38, 38], ["лет", 39, 39]], [["500", 40, 40], ["специалистов", 41, 41]], cap(42, 43), cap(44, 48), cap(49, 50), cap(51, 52), cap(53, 55)]

CAM = [
    (0, 1500, 880, 1.1, 0, None), (4, 2230, 1030, 1.3, 2, 22), (7, 1500, 1800, 1.0, 0, None), (11, 650, 1400, 1.3, -2, None), (14, 780, 2020, 1.45, -2, 26), (16, 1000, 2100, 1.0, 2, None),
    (18, 1550, 1950, 0.7, 0, None), (21, 2250, 2150, 1.2, -2, None), (26, 2250, 2200, 1.6, 1, None), (29, 2250, 2250, 1.1, -1, 14), (32, 900, 2800, 1.05, 2, 20),
    (33, 1500, 3500, 0.62, 0, None), (35, 1500, 4050, 0.95, 0, None), (49, 1500, 2400, 0.4, 0, None),
]

IM = lambda f, w, h, lic: {"file": "n10/img/" + f, "size": [w, h], "license": lic}
S = {
    "title": "Писсуар как шедевр", "style": "board10", "week": 2, "number": 10, "rubric": "Б · Арт-рынок и скандалы",
    "width": 1080, "height": 1920, "fps": 30, "output": "fountain_n10.mp4",
    "voiceover": "assets/audio/voiceover_n10.mp3", "voiceover_text": W, "tail": 0.8,
    "music_file": "assets/audio/music_n10.mp3", "music_vol": 0.5,
    "sources": [
        "Wikipedia: Fountain (Duchamp) (1917, подпись R. Mutt, выставка Общества независимых художников в Нью-Йорке, работа не была показана; оригинал утерян, известна по фото Альфреда Стиглица; позднейшие копии)",
        "BBC News, 2004: опрос около 500 специалистов мира искусства (по заказу Gordon's, спонсора премии Тёрнера): «Фонтан» назван самой влиятельной работой современного искусства; на 2 и 3 местах «Авиньонские девицы» Пикассо и «Диптих Мэрилин» Уорхола (названия на экране взяты из памяти, перед публикацией стоит сверить)",
        "ВАЖНО: в плане сказано «XX века», в источниках «современного искусства»; в озвучке «современного искусства». Копии: фото на экране реплика в Tate Modern (автор фото David Shankbone), проверить лицензию снимка (на Commons отмечен как общественное достояние для работы Дюшана)",
        "Аллюзия «подпиши чужим именем»: R. Mutt это псевдоним самого Дюшана (по утверждению искусствоведов, под влиянием Ричарда Матта, владельца компании сантехники); в ролике просто «чужое имя»",
    ],
    "images": {
        "hero": {"file": "n10/img/hero.jpg", "size": [1536, 2048], "license": "ИЛЛЮСТРАЦИЯ, создана нейросетью (Magnific), не историческое фото"},
        "fountain": IM("n10_01_fountain.jpg", 1416, 1849, "Public domain (Альфред Стиглиц, «Фонтан» Дюшана, 1917, Wikimedia Commons)"),
        "blindman": IM("n10_02_blindman.jpg", 1115, 1560, "Public domain (The Blind Man No. 2, Нью-Йорк, 1917, статья The Richard Mutt Case, Wikimedia Commons)"),
        "fiveway": IM("n10_03_fiveway.jpg", 1417, 847, "Public domain (Пятерной портрет Марселя Дюшана, 21 июня 1917, Нью-Йорк, Wikimedia Commons)"),
        "replica": IM("n10_04_replica.jpg", 1188, 830, "Реплика «Фонтана» в Tate Modern, фото David Shankbone (Wikimedia Commons); проверить лицензию снимка"),
        "portrait": IM("d_01.jpg", 519, 764, "Public domain (Марсель Дюшан, автор неизвестен, Wikimedia Commons: Marcel Duchamp 01.jpg)"),
        "brass": {"file": "n10/img/brass.jpg", "size": [1536, 1024], "license": "Текстура латуни, создана нейросетью (Magnific), не историческое фото"},
        "broadway": IM("n10_05_broadway.jpg", 848, 1280, "Public domain (Дюшан, Пикабия и Беатриса Вуд, 1917, Wikimedia Commons)"),
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО №10 · ФОНТАН", "nodes": []},
    "scenes": [{"id": 1, "type": "board", "from": 0}],
    "cam": [dict({"w": w, "x": x, "y": y, "z": z, "r": r}, **({"d": d} if d else {})) for (w, x, y, z, r, d) in CAM],
    "dingAt": 55,
    "sfx": {"swoosh": "assets/audio/sfx8/t_whoosh.mp3", "stamp": "assets/audio/sfx10/t_stamp.mp3", "ding": "assets/audio/sfx8/t_ting.mp3", "tick": "assets/audio/sfx_tick.mp3",
            "whoosh": "assets/audio/sfx8/t_whoosh.mp3", "ting": "assets/audio/sfx8/t_ting.mp3", "pulse": "assets/audio/sfx8/t_pulse.mp3", "riser": "assets/audio/sfx8/t_riser.mp3",
            "shing": "assets/audio/sfx8/t_shing.mp3", "quill": "assets/audio/sfx9/t_quill.mp3", "gavel": "assets/audio/sfx9/t_gavel.mp3",
            "flush": "assets/audio/sfx10/t_flush.mp3", "crowd": "assets/audio/sfx10/t_crowd.mp3", "inkstamp": "assets/audio/sfx10/t_stamp.mp3"},
    "events": [
        {"sfx": "flush", "at": 1, "dt": 0.4, "vol": 0.35}, {"sfx": "quill", "at": 2, "dt": 0.0, "vol": 0.5}, {"sfx": "ting", "at": 3, "dt": 0.0, "vol": 0.3},
        {"sfx": "pulse", "at": 7, "dt": 0.05, "vol": 0.55}, {"sfx": "ting", "at": 7, "dt": 0.1, "vol": 0.35},
        {"sfx": "ting", "at": 12, "dt": 0.0, "vol": 0.3}, {"sfx": "pulse", "at": 16, "dt": 0.0, "vol": 0.35},
        {"sfx": "quill", "at": 21, "dt": 0.0, "vol": 0.4}, {"sfx": "quill", "at": 22, "dt": 0.1, "vol": 0.35}, {"sfx": "quill", "at": 24, "dt": 0.0, "vol": 0.35},
        {"sfx": "quill", "at": 26, "dt": -0.1, "vol": 0.55}, {"sfx": "inkstamp", "at": 29, "dt": 0.0, "vol": 0.9},
        {"sfx": "quill", "at": 31, "dt": 0.0, "vol": 0.3}, {"sfx": "ting", "at": 32, "dt": 0.0, "vol": 0.3}, {"sfx": "ting", "at": 33, "dt": 0.1, "vol": 0.3}, {"sfx": "ting", "at": 34, "dt": 0.0, "vol": 0.3},
        {"sfx": "crowd", "at": 40, "dt": -0.1, "vol": 0.4}, {"sfx": "pulse", "at": 44, "dt": 0.0, "vol": 0.5}, {"sfx": "shing", "at": 45, "dt": 0.0, "vol": 0.4},
        {"sfx": "ting", "at": 52, "dt": 0.0, "vol": 0.4}, {"sfx": "ting", "at": 54, "dt": 0.0, "vol": 0.5}, {"sfx": "shing", "at": 54, "dt": 0.1, "vol": 0.4},
    ] + [{"sfx": "whoosh", "at": w, "dt": -0.8, "vol": 0.3} for (w, *_rest) in CAM[1:]],
}
json.dump(S, open(base + r'\script_n10.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
