"""Видео 11 «Картина, которая уничтожила себя» (Бэнкси, метка n11): доска дела без красного, шредер в раме."""
import json

base = r'C:\Users\awright\Desktop\Видео Клод'

# Board11.jsx = хелперы Board10.jsx (n10 -> n11) + новая сцена
s = open(base + r'\remotion\src\Board10.jsx', encoding='utf-8').read()
head = s.split('export const Board10Main')[0].replace("staticFile('n10/img/'", "staticFile('n11/img/'")
open(base + r'\remotion\src\Board11.jsx', 'w', encoding='utf-8').write(head + open(base + r'\scripts\main11_part.jsx', encoding='utf-8').read())

p = base + r'\remotion\src\Main.jsx'
m = open(p, encoding='utf-8').read()
if 'Board11Main' not in m:
    m = m.replace("import {Board10Main} from './Board10';", "import {Board10Main} from './Board10';\nimport {Board11Main} from './Board11';", 1)
    m = m.replace("script.style === 'board10' ? Board10Main :", "script.style === 'board10' ? Board10Main : script.style === 'board11' ? Board11Main :", 1)
    open(p, 'w', encoding='utf-8').write(m)

W = open(base + r'\build\n11\text.txt', encoding='utf-8').read().strip()
ws = W.split()


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


caps = [cap(0, 1), cap(2, 3), cap(4, 7), cap(8, 12), [["Лондон,", 13, 13], ["2018", 14, 16], ["год,", 17, 17]], cap(18, 19), cap(20, 21), cap(22, 26), cap(27, 28), cap(29, 32), cap(33, 36), cap(37, 40),
        [["А", 41, 41], ["в", 42, 42], ["2021", 43, 46]], cap(47, 49), cap(50, 53), [["продали", 54, 54], ["за", 55, 55], ["18,6", 56, 56], ["млн", 57, 59], ["фунтов.", 60, 60]],
        [["В", 61, 61], ["18", 62, 62], ["раз", 63, 63], ["дороже!", 64, 64]], cap(65, 68), cap(69, 72)]

CAM = [
    (0, 1500, 880, 1.2, 0, None), (10, 1500, 1000, 1.35, 0, None), (13, 700, 1800, 1.1, -2, 20), (20, 2250, 1550, 1.0, 2, None), (26, 1500, 2850, 1.1, -1, None),
    (33, 1500, 2900, 1.1, 1, 14), (37, 2350, 3050, 1.2, -2, 14), (41, 1500, 4300, 0.95, 0, 14), (61, 1500, 4300, 0.95, 0, 16),
]

S = {
    "title": "Картина, которая уничтожила себя", "style": "board11", "week": 2, "number": 11, "rubric": "Б · Арт-рынок и скандалы",
    "width": 1080, "height": 1920, "fps": 30, "output": "shredder_n11.mp4",
    "voiceover": "assets/audio/voiceover_n11.mp3", "voiceover_text": W, "tail": 0.8,
    "music_file": "assets/audio/music_n11.mp3", "music_vol": 0.5,
    "sources": [
        "Sotheby's, Лондон, 5 октября 2018: «Девочка с шариком» (Girl with Balloon) Бэнкси продана примерно за 1 млн фунтов (по разным источникам молоток 1 млн, с комиссией около 1,04 млн); сразу после удара молотка встроенный в раму шредер разрезал примерно половину полотна",
        "Работа получила название «Любовь в мусорке» (Love is in the Bin); покупательница (европейская коллекционерка) от сделки не отказалась, Pest Control (орган подтверждения подлинности Бэнкси) выдал новый сертификат",
        "Sotheby's, Лондон, 14 октября 2021: продана за 18 582 000 фунтов с комиссией (молоток 16 млн), торги около 10 минут, оценка 4-6 млн; рекорд Бэнкси; около 18 раз дороже цены 2018 (по 1 млн молотку)",
        "ВАЖНО: в озвучке «за миллион» и «восемнадцать с половиной миллионов» (точнее 18,6), «в восемнадцать раз» считано от суммы около 1 млн; в титрах 18,6",
        "Картинка на экране: ИЛЛЮСТРАЦИЯ, созданная нейросетью (Magnific); настоящие работы Бэнкси защищены авторским правом и не использованы",
    ],
    "images": {
        "hero": {"file": "n11/img/hero.jpg", "size": [1536, 2036], "license": "ИЛЛЮСТРАЦИЯ, создана нейросетью (Magnific), не работа Бэнкси"},
        "hall": {"file": "n11/img/hall.jpg", "size": [1200, 1590], "license": "ИЛЛЮСТРАЦИЯ, создана нейросетью (Magnific): аукционный зал, не реальный зал"},
        "bg": {"file": "n11/img/bg_teal.jpg", "size": [1248, 1872], "license": "Текстура сукна, создана нейросетью (Magnific)"},
        "props": {"file": "n11/img/{coins,gavel,paddle}_c.png", "size": [0, 0], "license": "Предметы (монеты, молоток, паддл), созданы нейросетью (Magnific), фон удалён"},
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО №11 · ШРЕДЕР", "nodes": []},
    "scenes": [{"id": 1, "type": "board", "from": 0}],
    "cam": [dict({"w": w, "x": x, "y": y, "z": z, "r": r}, **({"d": d} if d else {})) for (w, x, y, z, r, d) in CAM],
    "dingAt": 72,
    "sfx": {"swoosh": "assets/audio/sfx8/t_whoosh.mp3", "stamp": "assets/audio/sfx10/t_stamp.mp3", "ding": "assets/audio/sfx8/t_ting.mp3", "tick": "assets/audio/sfx_tick.mp3",
            "whoosh": "assets/audio/sfx8/t_whoosh.mp3", "ting": "assets/audio/sfx8/t_ting.mp3", "pulse": "assets/audio/sfx8/t_pulse.mp3", "riser": "assets/audio/sfx8/t_riser.mp3",
            "shing": "assets/audio/sfx8/t_shing.mp3", "quill": "assets/audio/sfx9/t_quill.mp3", "gavel": "assets/audio/sfx9/t_gavel.mp3",
            "inkstamp": "assets/audio/sfx10/t_stamp.mp3", "shred": "assets/audio/sfx11/t_shred.mp3", "coin": "assets/audio/sfx11/t_coin.mp3"},
    "events": [
        {"sfx": "inkstamp", "at": 3, "dt": 0.0, "vol": 0.8}, {"sfx": "shred", "at": 10, "dt": -0.1, "vol": 0.5}, {"sfx": "pulse", "at": 13, "dt": 0.0, "vol": 0.4},
        {"sfx": "ting", "at": 16, "dt": 0.0, "vol": 0.3}, {"sfx": "gavel", "at": 21, "dt": -0.05, "vol": 0.8}, {"sfx": "inkstamp", "at": 21, "dt": 0.12, "vol": 0.8},
        {"sfx": "ting", "at": 23, "dt": 0.0, "vol": 0.3}, {"sfx": "pulse", "at": 26, "dt": 0.0, "vol": 0.4}, {"sfx": "riser", "at": 28, "dt": 0.0, "vol": 0.3},
        {"sfx": "shred", "at": 31, "dt": 0.0, "vol": 0.7}, {"sfx": "quill", "at": 38, "dt": 0.0, "vol": 0.4},
        {"sfx": "inkstamp", "at": 40, "dt": 0.0, "vol": 0.85}, {"sfx": "pulse", "at": 41, "dt": 0.0, "vol": 0.4}, {"sfx": "riser", "at": 54, "dt": -0.1, "vol": 0.4},
        {"sfx": "ting", "at": 60, "dt": 0.0, "vol": 0.45}, {"sfx": "inkstamp", "at": 62, "dt": 0.0, "vol": 0.95}, {"sfx": "shing", "at": 62, "dt": 0.1, "vol": 0.4},
        {"sfx": "ting", "at": 69, "dt": 0.0, "vol": 0.4}, {"sfx": "ting", "at": 72, "dt": 0.0, "vol": 0.5}, {"sfx": "shing", "at": 72, "dt": 0.1, "vol": 0.4},
    ] + [{"sfx": "coin", "at": w, "dt": d, "vol": 0.3} for w in range(54, 61) for d in (0.0, 0.25)] + [{"sfx": "whoosh", "at": w, "dt": -0.8, "vol": 0.3} for (w, *_rest) in CAM[1:]],
}
json.dump(S, open(base + r'\script_n11.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
