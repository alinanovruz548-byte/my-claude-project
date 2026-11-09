"""Видео 27 «Выставка позора» («Дегенеративное искусство» 1937, метка n27, стиль board27): видео-хук 2,6 с, анимированные субтитры по словам, переходы: вспышка, строки, круг из угла, двери, билет, колонны."""
import json

base = r'C:\Users\awright\Desktop\Видео Клод'

b17 = open(base + r'\remotion\src\Board17.jsx', encoding='utf-8').read()
head = b17[:b17.index('// наклейка')].replace("staticFile('n17/img/' + n)", "staticFile('n27/img/' + n)")
ka = head.index('const KEYS = [')
kb = head.index('];', ka) + 2
keys = '''const KEYS = [
  {t: 0.0, x: 540, y: 3000, s: 1.0, pose: 'ticket', look: 1},
  {t: 3.0, x: 540, y: 3000, s: 1.0, pose: 'ticket', look: 1},
  {t: 3.6, ...SIDE_R, pose: 'ticket', look: -1},
  {t: 4.6, ...SIDE_R, pose: 'ticket', look: -1},
  {t: 5.3, ...SIDE_L, pose: 'open', look: 1},
  {t: 8.2, ...SIDE_L, pose: 'open', look: 1},
  {t: 8.9, ...SIDE_R, pose: 'artist', look: -1},
  {t: 14.0, ...SIDE_R, pose: 'artist', look: -1},
  {t: 14.7, ...SIDE_L, pose: 'judge', look: 1},
  {t: 17.6, ...SIDE_L, pose: 'judge', look: 1},
  {t: 18.3, x: 890, y: 1795, s: 0.55, pose: 'laugh', look: -1},
  {t: 21.3, x: 890, y: 1795, s: 0.55, pose: 'laugh', look: -1},
  {t: 22.0, x: 540, y: 1790, s: 0.85, pose: 'think', look: 1},
  {t: 40, x: 540, y: 1790, s: 0.85, pose: 'think', look: 1},
];'''
head = head[:ka] + keys + head[kb:]
main = open(base + r'\scripts\main27_main.jsx', encoding='utf-8').read()
open(base + r'\remotion\src\Board27.jsx', 'w', encoding='utf-8').write(head + main)

p = base + r'\remotion\src\Main.jsx'
m = open(p, encoding='utf-8').read()
if 'Board27Main' not in m:
    m = m.replace("import {Board26Main} from './Board26';", "import {Board26Main} from './Board26';\nimport {Board27Main} from './Board27';", 1)
    m = m.replace("script.style === 'board26' ? Board26Main :", "script.style === 'board26' ? Board26Main : script.style === 'board27' ? Board27Main :", 1)
    open(p, 'w', encoding='utf-8').write(m)

W = open(base + r'\build\n27\text.txt', encoding='utf-8').read().strip()
ws = W.split()
assert len(ws) == 57


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


rng = [(0, 4), (5, 9), (10, 12), (13, 18), (19, 22), (23, 25), (26, 31), (32, 35), (36, 39), (40, 46), (47, 49), (50, 52), (53, 56)]
caps = [cap(a, b) for a, b in rng]


def ev(sfx, at, dt=0.0, vol=0.5):
    return {"sfx": sfx, "at": at, "dt": dt, "vol": vol}


S = {
    "title": "Выставка позора", "style": "board27", "week": 4, "number": 27, "rubric": "Б · Власть и искусство",
    "width": 1080, "height": 1920, "fps": 30, "output": "degenerate_art_n27.mp4",
    "voiceover": "assets/audio/voiceover_n27.mp3", "voiceover_text": W, "tail": 0.9,
    "music_file": "assets/audio/music_n27.mp3", "music_vol": 0.7, "duck_ratio": 1.8,
    "sources": [
        "Выставка «Дегенеративное искусство» (Entartete Kunst), Мюнхен, 19 июля – ноябрь 1937: около 650 работ (MoMA называет 740 работ около 120 художников; источники расходятся), экспонаты изъяты из музеев; среди художников Кандинский, Клее, Шагал, Нольде. Посетителей, по оценкам (EBSCO, USHMM), более двух миллионов (Wikipedia: ~3 млн за время показа в Мюнхене); «Большую германскую художественную выставку» рядом посетили меньше (Wikipedia ~600 тыс., USHMM менее 500 тыс.). На экране «больше двух миллионов» и «меньше 0,5 млн», график схематичен.",
        "Путеводитель выставки (Commons: 65483-Kaiser ENTARTETE KUNST Ausstellungsführer ... Cover, No known copyright restrictions); фото выставки (Commons: Ausstellung entartete kunst 1937.jpg, Bundesarchiv, CC BY-SA 3.0 de: подпись на экране; показан только фрагмент с картинами); Кандинский «Композиция VII», 1913 (PD) и Клее «Поющая машина», 1922 (PD) показаны как примеры работ этих художников. Свастики и символы не использованы.",
        "Хук: очередь у «выставки позора», стартовый кадр (Magnific images_generate с reference собаки) и видео Kling 2.5 (720p, 5 с, ускорено в 1,9 раза, 2,6 с) сгенерированы нейросетью, иллюстрации (баннер в кадре не читаем). Позы собаки (билет, художник, раздумье) сгенерированы в Magnific. Человечки и график на экране схематичны.",
    ],
    "images": {
        "cat": {"file": "n27/img/cat.jpg", "size": [960, 1371], "license": "No known copyright restrictions (Commons)"},
        "crowd": {"file": "n27/img/crowd.jpg", "size": [776, 561], "license": "CC BY-SA 3.0 de (Bundesarchiv, Commons)"},
        "kand": {"file": "n27/img/kand.jpg", "size": [1800, 1218], "license": "Public domain (Commons)"},
        "klee": {"file": "n27/img/klee.jpg", "size": [960, 1304], "license": "Public domain (Commons)"},
        "chagall": {"file": "n27/img/chagall.png", "size": [760, 609], "license": "Public domain (Commons), Шагал «День рождения», 1915"},
        "marc": {"file": "n27/img/marc.jpg", "size": [960, 1526], "license": "Public domain (Commons), Ф. Марк «Башня голубых лошадей», 1913 (была на выставке)"},
        "corinth": {"file": "n27/img/corinth.jpg", "size": [960, 1222], "license": "Public domain (Commons), Коринт «Се человек»"},
        "schlemmer": {"file": "n27/img/schlemmer.jpg", "size": [700, 1062], "license": "Public domain (Commons), Шлеммер «Четыре фигуры в пространстве»"},
        "g1": {"file": "n27/img/g1.png", "size": [960, 737], "license": "Public domain (Commons), Ф. Бурман «Вид на море», Большая германская выставка"},
        "g2": {"file": "n27/img/g2.png", "size": [960, 720], "license": "Public domain (Commons), А. Гриль «Старая липа у Штарнбергского озера», БГВ 1939"},
        "g3": {"file": "n27/img/g3.jpg", "size": [960, 606], "license": "Public domain (Commons), П. Шольц «Кимзее у Брайтбрунна», БГВ"},
        "dog": {"file": "n27/img/p_{ticket,artist,think}.png", "size": [575, 890], "license": "ИЛЛЮСТРАЦИИ нейросети (Magnific), персонаж Шиба"},
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО №27 · ВЫСТАВКА ПОЗОРА", "nodes": []},
    "scenes": [{"id": 1, "type": "board", "from": 0}],
    "cam": [],
    "dingAt": 56,
    "sfx": {"whoosh": "assets/audio/sfx8/t_whoosh.mp3", "ting": "assets/audio/sfx8/t_ting.mp3", "pulse": "assets/audio/sfx8/t_pulse.mp3", "shing": "assets/audio/sfx8/t_shing.mp3",
            "ding": "assets/audio/sfx8/t_ting.mp3", "thud": "assets/audio/sfx15/t_thud.mp3", "tick": "assets/audio/sfx_tick.mp3", "stamp": "assets/audio/sfx10/t_stamp.mp3", "swoosh": "assets/audio/sfx8/t_whoosh.mp3",
            "slap": "assets/audio/sfx13/t_slap.mp3", "brush": "assets/audio/sfx12/t_brush.mp3", "coin": "assets/audio/sfx11/t_coin.mp3"},
    "events": [
        ev("pulse", 0, 0.0, 0.4), ev("shing", 3, -0.1, 0.55), ev("thud", 3, 0.05, 0.5),
        ev("whoosh", 9, -0.1, 0.6), ev("stamp", 11, 0.1, 0.5),
        ev("stamp", 14, 0.0, 0.6), ev("stamp", 15, 0.05, 0.6), ev("stamp", 16, 0.05, 0.6), ev("stamp", 17, 0.05, 0.6),
        ev("whoosh", 19, -0.5, 0.55), ev("ting", 22, 0.0, 0.3),
        ev("tick", 23, 0.0, 0.3), ev("tick", 24, 0.0, 0.3), ev("ting", 25, 0.0, 0.35), ev("stamp", 29, 0.1, 0.65),
        ev("whoosh", 32, -0.4, 0.55), ev("ting", 33, 0.0, 0.3),
        ev("whoosh", 40, -0.6, 0.7), ev("coin", 44, 0.0, 0.4), ev("stamp", 47, 0.1, 0.7),
        ev("whoosh", 50, -0.3, 0.55), ev("ting", 56, 0.2, 0.5),
    ],
}
json.dump(S, open(base + r'\script_n27.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
