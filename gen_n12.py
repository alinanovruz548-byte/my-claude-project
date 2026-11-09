"""Видео 12 «Подделка, спасшая от петли» (Хан ван Мегерен, метка n12): доска дела на крафте, картина закрыта плашками, суд присяжных."""
import json

base = r'C:\Users\awright\Desktop\Видео Клод'

s = open(base + r'\remotion\src\Board10.jsx', encoding='utf-8').read()
head = s.split('export const Board10Main')[0].replace("staticFile('n10/img/'", "staticFile('n12/img/'").replace("Img} from 'remotion'", "Img, Sequence, OffthreadVideo, Freeze} from 'remotion'")
open(base + r'\remotion\src\Board12.jsx', 'w', encoding='utf-8').write(head + open(base + r'\scripts\main12_part.jsx', encoding='utf-8').read())

p = base + r'\remotion\src\Main.jsx'
m = open(p, encoding='utf-8').read()
if 'Board12Main' not in m:
    m = m.replace("import {Board11Main} from './Board11';", "import {Board11Main} from './Board11';\nimport {Board12Main} from './Board12';", 1)
    m = m.replace("script.style === 'board11' ? Board11Main :", "script.style === 'board11' ? Board11Main : script.style === 'board12' ? Board12Main :", 1)
    open(p, 'w', encoding='utf-8').write(m)

W = open(base + r'\build\n12\text.txt', encoding='utf-8').read().strip()
ws = W.split()


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


caps = [cap(0, 3), cap(4, 7), cap(8, 9), cap(10, 14), cap(15, 18), cap(19, 22), cap(23, 25), cap(26, 30), cap(31, 34), cap(35, 39), cap(40, 42), cap(43, 45), cap(46, 48), cap(49, 51), cap(52, 54),
        [["а", 55, 55], ["в", 56, 56], ["1947", 57, 60], ["он", 61, 61], ["умер.", 62, 62]], cap(63, 64), cap(65, 67)]

CAM = [
    (0, 1500, 1130, 1.1, 0, None), (8, 1500, 2250, 1.1, 0, 12), (14, 1500, 1100, 1.15, 0, 14), (19, 640, 1980, 1.1, -2, 18), (26, 2300, 1900, 1.0, 2, 22),
    (40, 1050, 3450, 1.3, 1, 20), (49, 1750, 3500, 1.1, 0, 22), (52, 1000, 4650, 1.1, 0, 14), (57, 1850, 4900, 0.95, 0, 16),
]

S = {
    "title": "Подделка, спасшая от петли", "style": "board12", "week": 2, "number": 12, "rubric": "А · Подделки и загадки",
    "width": 1080, "height": 1920, "fps": 30, "output": "forger_n12.mp4",
    "voiceover": "assets/audio/voiceover_n12.mp3", "voiceover_text": W, "tail": 0.8,
    "music_file": "assets/audio/music_n12.mp3", "music_vol": 0.5,
    "sources": [
        "Han van Meegeren (1889-1947): голландский художник-фальсификатор; «Христос и грешница» продана Герингу (через дилера Алоиса Мидля, 1943; в источниках встречается и 1942), после войны найдена союзниками (Австрия, 1945)",
        "После войны обвинён в сотрудничестве с врагом (продажа нацистам национального достояния), что грозило смертной казнью; в тюрьме признал подделку и в 1945 написал «Христа среди учителей» при свидетелях (в источниках название варьируется: «Юный Христос в храме»)",
        "Суд: обвинение в измене заменено на подделку и мошенничество, приговор 1 год (12 ноября 1947); умер от сердечного приступа в 1947 (даты разнятся: 26 ноября или 30 декабря 1947); в озвучке только «в 1947 году»",
        "ВАЖНО: на экране картина «Эммаус» (1937, другая подделка ван Мегерена «под Вермеера», Public domain); изображения «Христос и грешница» с свободной лицензией не найдено",
        "Идея подачи из документа «Арт-детектив»: картина открывается по мере улик, суд присяжных с голосованием в комментариях",
    ],
    "images": {
        "hook_src": {"file": "n12/vid/hook2.mp4", "size": [960, 960], "license": "ВИДЕО-ИЛЛЮСТРАЦИЯ, анимация (Magnific, Seedance 2.0 Fast) по картине «Эммаус» (Han van Meegeren, 1937, Public domain, Wikimedia Commons: EmmausgangersVanMeegeren1937.jpg)"},
        "emmaus": {"file": "n12/img/emmaus.jpg", "size": [1920, 1745], "license": "Public domain (Han van Meegeren, «Эммаусские ученики», 1937, подделка под Вермеера, Wikimedia Commons: EmmausgangersVanMeegeren1937.jpg)"},
        "prison": {"file": "n12/img/prison.jpg", "size": [1920, 1374], "license": "CC BY 4.0 (Han van Meegeren пишет «Христа среди учителей», октябрь 1945, Wikimedia Commons: HanVanMeegerenOct1945.jpg); указать авторство при публикации"},
        "atelier": {"file": "n12/img/atelier.jpg", "size": [1920, 1411], "license": "CC0 (Nationaal Archief, В ателье Хана ван Мегерена, Wikimedia Commons)"},
        "suspect": {"file": "n12/img/suspect.png", "size": [940, 1000], "license": "Производное фото prison.jpg (CC BY 4.0, Wikimedia Commons: HanVanMeegerenOct1945.jpg): кадр, обработка"},
        "supper": {"file": "n12/img/supper.jpg", "size": [1600, 1063], "license": "CC0 (Han van Meegeren, «Тайная вечеря», 1939, подделка, Wikimedia Commons); в ролике подписана как другая работа, «Христос и грешница» свободной картинки не имеет"},
        "d1947": {"file": "n12/img/d1947.jpg", "size": [1600, 1313], "license": "CC0 (Han van Meegeren, 1947, Wikimedia Commons: HanVanMeegeren1947.jpg)"},
        "videos": {"file": "n12/vid/{hook,noose,wit,cell,candle}.mp4", "size": [720, 960], "license": "ИЛЛЮСТРАЦИИ, видео созданы нейросетью (Magnific, Seedance 2.0 Fast), не архивные кадры"},
        "props": {"file": "n12/img/{easel,cuffs,scales,lens}_c.png", "size": [0, 0], "license": "Предметы (мольберт, наручники, весы, лупа) и фон-крафт созданы нейросетью (Magnific), фон удалён"},
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО №12 · ПОДДЕЛКА", "nodes": []},
    "scenes": [{"id": 1, "type": "board", "from": 0}],
    "cam": [dict({"w": w, "x": x, "y": y, "z": z, "r": r}, **({"d": d} if d else {})) for (w, x, y, z, r, d) in CAM],
    "dingAt": 67,
    "sfx": {"swoosh": "assets/audio/sfx8/t_whoosh.mp3", "stamp": "assets/audio/sfx10/t_stamp.mp3", "ding": "assets/audio/sfx8/t_ting.mp3", "tick": "assets/audio/sfx_tick.mp3",
            "whoosh": "assets/audio/sfx8/t_whoosh.mp3", "ting": "assets/audio/sfx8/t_ting.mp3", "pulse": "assets/audio/sfx8/t_pulse.mp3", "riser": "assets/audio/sfx8/t_riser.mp3",
            "shing": "assets/audio/sfx8/t_shing.mp3", "quill": "assets/audio/sfx9/t_quill.mp3", "gavel": "assets/audio/sfx9/t_gavel.mp3",
            "inkstamp": "assets/audio/sfx10/t_stamp.mp3", "peel": "assets/audio/sfx12/t_peel.mp3", "brush": "assets/audio/sfx12/t_brush.mp3", "cuffs": "assets/audio/sfx12/t_cuffs.mp3"},
    "events": [
        {"sfx": "ting", "at": 3, "dt": 0.0, "vol": 0.4}, {"sfx": "pulse", "at": 8, "dt": 0.0, "vol": 0.45}, {"sfx": "cuffs", "at": 9, "dt": 0.0, "vol": 0.8}, {"sfx": "inkstamp", "at": 9, "dt": 0.1, "vol": 0.8},
        {"sfx": "pulse", "at": 14, "dt": 0.0, "vol": 0.4}, {"sfx": "inkstamp", "at": 18, "dt": 0.05, "vol": 0.95}, {"sfx": "shing", "at": 18, "dt": 0.1, "vol": 0.4},
        {"sfx": "pulse", "at": 19, "dt": 0.0, "vol": 0.4}, {"sfx": "ting", "at": 23, "dt": 0.0, "vol": 0.3}, {"sfx": "inkstamp", "at": 25, "dt": 0.0, "vol": 0.8},
        {"sfx": "pulse", "at": 26, "dt": 0.0, "vol": 0.4}, {"sfx": "ting", "at": 29, "dt": 0.0, "vol": 0.3}, {"sfx": "shing", "at": 35, "dt": 0.0, "vol": 0.4},
        {"sfx": "pulse", "at": 40, "dt": 0.0, "vol": 0.4}, {"sfx": "brush", "at": 45, "dt": 0.0, "vol": 0.6}, {"sfx": "brush", "at": 47, "dt": 0.1, "vol": 0.5},
        {"sfx": "ting", "at": 51, "dt": 0.0, "vol": 0.35}, {"sfx": "inkstamp", "at": 53, "dt": 0.0, "vol": 0.9}, {"sfx": "ting", "at": 57, "dt": 0.0, "vol": 0.35}, {"sfx": "pulse", "at": 62, "dt": 0.0, "vol": 0.4},
        {"sfx": "gavel", "at": 63, "dt": 0.0, "vol": 0.7}, {"sfx": "ting", "at": 65, "dt": 0.0, "vol": 0.4}, {"sfx": "ting", "at": 67, "dt": 0.0, "vol": 0.5}, {"sfx": "shing", "at": 67, "dt": 0.1, "vol": 0.4},
    ] + [{"sfx": "whoosh", "at": w, "dt": -0.8, "vol": 0.3} for (w, *_rest) in CAM[2:]],
}
json.dump(S, open(base + r'\script_n12.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
