"""Видео 17 «Стены кошмаров» (Гойя, «Чёрные картины», метка n17, стиль board17): светлый стиль, много переходов, собака-аниматор."""
import json

base = r'C:\Users\awright\Desktop\Видео Клод'

p = base + r'\remotion\src\Main.jsx'
m = open(p, encoding='utf-8').read()
if 'Board17Main' not in m:
    m = m.replace("import {Board16bMain} from './Board16b';", "import {Board16bMain} from './Board16b';\nimport {Board17Main} from './Board17';", 1)
    m = m.replace("script.style === 'board16b' ? Board16bMain :", "script.style === 'board16b' ? Board16bMain : script.style === 'board17' ? Board17Main :", 1)
    open(p, 'w', encoding='utf-8').write(m)

W = open(base + r'\build\n17\text.txt', encoding='utf-8').read().strip()
ws = W.split()


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


caps = [cap(0, 4), cap(5, 8), cap(9, 10), cap(11, 15), cap(16, 19), cap(20, 25), cap(26, 28), cap(29, 32), cap(33, 38), cap(39, 41), cap(42, 45), cap(46, 52), cap(53, 56), cap(57, 62)]

S = {
    "title": "Стены кошмаров", "style": "board17", "week": 3, "number": 17, "rubric": "Г · Художник и его время",
    "width": 1080, "height": 1920, "fps": 30, "output": "goya_n17.mp4",
    "voiceover": "assets/audio/voiceover_n17.mp3", "voiceover_text": W, "tail": 0.9,
    "music_file": "assets/audio/music_n17.mp3", "music_vol": 0.7, "duck_ratio": 1.8,
    "sources": [
        "Франсиско Гойя купил Quinta del Sordo («Дом глухого») в 1819 и расписал стены прямо по штукатурке («Чёрные картины», ок. 1819-1823); Гойя названий не давал, их придали позднее (кто именно, в найденных источниках не установлено)",
        "Росписи перенесли со стен на холст в 1873-1874 (под руководством реставратора Сальвадора Мартинеса Кубельса, владелец барон Эмиль д'Эрлангер; в разных источниках даты 1874-1878), с 1881 переданы испанскому государству, сейчас в Прадо; «через полвека» в озвучке (1819 -> 1874)",
        "Фото «Дома глухого» ок. 1900 (Public domain, Commons: Quinta del Sordo 1900.jpg); Прадо: статуя Веласкеса у входа (CC0, Commons: El pintor Velazquez preside la puerta principal.jpg); автопортрет Гойи 1815 (Public domain). Картины: «Ведьмин шабаш», «Собака», «Паломничество к Сан-Исидро» (Public domain, Wikimedia Commons), портрет Гойи работы Висенте Лопеса (Public domain). «Сатурн, пожирающий своего сына» только упомянут названием, без изображения (бережная подача)",
        "Собака Шиба и клип «рисует» сделаны нейросетью (Magnific: картинки, MiniMax Hailuo 3.0 Turbo 200 кредитов, вырезка фона), подписаны как иллюстрация",
    ],
    "images": {
        "goya": {"file": "n17/img/goya.jpg", "size": [1556, 1920], "license": "Public domain (Висенте Лопес Портанья, «Портрет Франсиско Гойи», 1826, Wikimedia Commons)"},
        "paintings": {"file": "n17/img/{sabbath,dog,pilgrim}.jpg", "size": [0, 0], "license": "Public domain (Гойя, Чёрные картины, Wikimedia Commons: El Aquelarre.jpg, Goya Dog.jpg, La romería de San Isidro.jpg)"},
        "extra": {"file": "n17/img/{house,prado,selfp,saturn}.jpg", "size": [0, 0], "license": "Public domain / CC0 (Wikimedia Commons)"},
        "dog": {"file": "n17/img/p_*.png (в т.ч. p_scared, p_paint)", "size": [575, 890], "license": "ИЛЛЮСТРАЦИИ нейросети (Magnific), персонаж Шиба"},
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО №17 · ЧЁРНЫЕ КАРТИНЫ", "nodes": []},
    "scenes": [{"id": 1, "type": "board", "from": 0}],
    "cam": [],
    "dingAt": 62,
    "sfx": {"whoosh": "assets/audio/sfx8/t_whoosh.mp3", "ting": "assets/audio/sfx8/t_ting.mp3", "pulse": "assets/audio/sfx8/t_pulse.mp3", "shing": "assets/audio/sfx8/t_shing.mp3",
            "ding": "assets/audio/sfx8/t_ting.mp3", "thud": "assets/audio/sfx15/t_thud.mp3", "tick": "assets/audio/sfx_tick.mp3", "stamp": "assets/audio/sfx10/t_stamp.mp3", "swoosh": "assets/audio/sfx8/t_whoosh.mp3",
            "slap": "assets/audio/sfx13/t_slap.mp3", "brush": "assets/audio/sfx12/t_brush.mp3"},
    "events": [
        {"sfx": "brush", "at": 0, "dt": 0.1, "vol": 0.55}, {"sfx": "brush", "at": 1, "dt": -0.35, "vol": 0.5}, {"sfx": "whoosh", "at": 1, "dt": 0.1, "vol": 0.6}, {"sfx": "thud", "at": 2, "dt": 0.0, "vol": 1.0}, {"sfx": "pulse", "at": 2, "dt": 0.0, "vol": 0.6},
        {"sfx": "whoosh", "at": 3, "dt": -0.5, "vol": 0.6}, {"sfx": "whoosh", "at": 3, "dt": -0.35, "vol": 0.35}, {"sfx": "whoosh", "at": 5, "dt": -0.05, "vol": 0.4}, {"sfx": "ting", "at": 12, "dt": 0.0, "vol": 0.3},
        {"sfx": "whoosh", "at": 8, "dt": -0.1, "vol": 0.4}, {"sfx": "thud", "at": 26, "dt": 0.0, "vol": 0.8}, {"sfx": "thud", "at": 27, "dt": 0.1, "vol": 0.8}, {"sfx": "thud", "at": 29, "dt": 0.0, "vol": 1.0}, {"sfx": "pulse", "at": 29, "dt": 0.0, "vol": 0.5},
        {"sfx": "whoosh", "at": 33, "dt": -0.7, "vol": 0.6}, {"sfx": "whoosh", "at": 33, "dt": -0.55, "vol": 0.35}, {"sfx": "ting", "at": 38, "dt": 0.0, "vol": 0.35}, {"sfx": "whoosh", "at": 42, "dt": 0.0, "vol": 0.4}, {"sfx": "whoosh", "at": 53, "dt": -0.3, "vol": 0.5},
        {"sfx": "ting", "at": 53, "dt": 0.1, "vol": 0.4}, {"sfx": "pulse", "at": 57, "dt": 0.0, "vol": 0.4}, {"sfx": "ting", "at": 62, "dt": 0.2, "vol": 0.5}, {"sfx": "shing", "at": 62, "dt": 0.3, "vol": 0.35},
    ],
}
json.dump(S, open(base + r'\script_n17.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
