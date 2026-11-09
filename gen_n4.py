"""Заготовка script_n4.json (видео 4 «Оскорбление, ставшее названием»). Дальше правим JSON вручную."""
import json

W = open("build/n4/text.txt", encoding="utf-8").read().split()
cap = lambda a, b: [[W[i], i, i] for i in range(a, b + 1)]
caps = [cap(0, 3), cap(4, 6), [["В", 7, 7], ["1874", 8, 11], ["году", 12, 12], ["в", 13, 13], ["Париже", 14, 14]],
        cap(15, 16), cap(17, 20), cap(21, 25), cap(26, 28), cap(29, 30), cap(31, 36), cap(37, 40), cap(41, 44),
        cap(45, 48), cap(49, 52), cap(53, 56), cap(57, 60)]
S = {
    "title": "Оскорбление, ставшее названием", "week": 1, "number": 4, "rubric": "Б · Скандал",
    "width": 1080, "height": 1920, "fps": 30, "output": "impression_n4.mp4",
    "voiceover": "assets/audio/voiceover_n4.mp3", "voiceover_text": " ".join(W), "tail": 0.6,
    "music_file": "assets/audio/music_n4.mp3", "music_vol": 0.5,
    "sources": [
        "Wikipedia и Art and Context: рецензия Луи Леруа «Выставка импрессионистов» в газете Le Charivari, 25 апреля 1874; выставка в мастерской фотографа Надара",
        "Цитата про обои: «обои в зародыше законченнее этой марины»; перевод в источниках различается, в ролике пересказ",
        "Название «импрессионисты» группа приняла для выставки 1877 года (третья выставка); проверить по второму источнику перед публикацией",
        "Дата картины «Впечатление. Восход солнца» в источниках: 1872 или 1873, в ролике дата картины не называется",
    ],
    "images": {
        "imp": {"file": "n4/img/n4_01_impression.jpg", "size": [1920, 1489], "license": "Public domain (Monet, Impression, Sunrise, Musée Marmottan, Wikimedia Commons)"},
        "monet": {"file": "n4/img/n4_02_monet.jpg", "size": [1920, 2559], "license": "Public domain (Nadar, Claude Monet 1899, Wikimedia Commons)"},
        "loge": {"file": "n4/img/n4_03_loge.jpg", "size": [1920, 2400], "license": "Public domain (Renoir, La Loge, 1874, Wikimedia Commons)"},
        "charivari": {"file": "n4/img/n4_04_charivari.jpg", "size": [1920, 2683], "license": "CC0 (Le Charivari, выпуск 21 января 1869, Wikimedia Commons); иллюстрация газеты, не выпуск 1874"},
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО · НАЗВАНИЕ", "nodes": [
        {"label": "1874", "sub": "выставка", "at": 7}, {"label": "Леруа", "sub": "насмешка", "at": 17},
        {"label": "Моне", "sub": "картина", "at": 21}, {"label": "1877", "sub": "бренд", "at": 45}]},
    "scenes": [
        {"id": 1, "type": "card", "from": 0, "image": "imp", "tilt": -2.5, "focus": [0.5, 0.5], "fit": True, "h": 700, "top": 700,
         "headline": ["Насмешка", "стала названием"], "headlineSize": [150, 80], "chip": "Моне · «Впечатление. Восход солнца»",
         "shots": [{"at": 0, "focus": [0.5, 0.5], "zoom": 1}, {"at": 4, "focus": [0.62, 0.45], "zoom": 1.7}],
         "stamp": {"text": "УНИЗИТЬ", "at": 5, "angle": -8}, "ghost": "ЛОЖЬ"},
        {"id": 2, "type": "card", "from": 7, "trans": "ink", "image": "loge", "tilt": 2, "focus": [0.5, 0.4], "fit": True, "h": 1000, "top": 390,
         "badge": "Улика №1", "chip": "Париж · выставка 1874", "counter": {"from": 1870, "to": 1874, "at": 11, "pos": [30, 300]},
         "shots": [{"at": 7, "focus": [0.5, 0.5], "zoom": 1}], "ghost": "ПАРИЖ"},
        {"id": 3, "type": "card", "from": 17, "trans": "diag", "image": "charivari", "tilt": -2, "focus": [0.5, 0.3], "fit": True, "h": 1000, "top": 390,
         "badge": "Улика №2", "chip": "Критик Луи Леруа · Le Charivari",
         "shots": [{"at": 17, "focus": [0.5, 0.5], "zoom": 1, "note": {"text": "КРИТИК", "pos": [120, 60], "angle": -6}}],
         "stamp": {"text": "ЯЗВИТЕЛЬНО", "at": 20, "angle": 7}},
        {"id": 4, "type": "card", "from": 21, "trans": "circle", "image": "imp", "tilt": 2.5, "focus": [0.5, 0.5], "fit": True, "h": 700, "top": 560,
         "badge": "Улика №3", "chip": "«Впечатление. Восход солнца»",
         "shots": [{"at": 21, "focus": [0.5, 0.5], "zoom": 1}, {"at": 26, "focus": [0.62, 0.45], "zoom": 1.8, "ring": {"rx": 170, "ry": 150}}],
         "stamp": {"text": "ВЫСМЕЯЛ", "at": 27, "angle": -7}},
        {"id": 5, "type": "paper", "from": 29, "trans": "glitch", "badge": "Улика №4", "chip": "Из рецензии Леруа", "emptyLabel": "",
         "typeAt": 31, "text": "«Обои в зародыше\nзаконченнее\nэтой картины!»", "stamp": {"text": "ПЕРЕСКАЗ", "at": 36}},
        {"id": 6, "type": "card", "from": 37, "trans": "slices", "image": "monet", "tilt": -2, "focus": [0.5, 0.4], "fit": True, "h": 1000, "top": 390,
         "badge": "Улика №5", "chip": "Клод Моне",
         "shots": [{"at": 37, "focus": [0.5, 0.5], "zoom": 1}], "stamp": {"text": "ИМПРЕССИОНИСТ", "at": 40, "angle": -7, "pos": {"right": -10, "top": 780}}},
        {"id": 7, "type": "ended", "from": 41, "trans": "flash", "yearFrom": 1874, "yearTo": 1877,
         "tags": [["Группа сама приняла это слово", "выставка 1877 года"], ["Насмешка стала названием", "его знает весь мир"]], "stampText": "БРЕНД"},
        {"id": 8, "type": "question", "from": 53, "trans": "band", "text": "Какое прозвище прилипло бы к вам?"},
    ],
    "sfx": {"swoosh": "assets/audio/sfx_swoosh.mp3", "stamp": "assets/audio/sfx_stamp.mp3",
            "ding": "assets/audio/sfx_ding.mp3", "tick": "assets/audio/sfx_tick.mp3"},
}
json.dump(S, open("script_n4.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
