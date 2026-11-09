"""Сценарий видео 7 «Рыцарь против улитки» (метка n7), светлый стиль. После запуска JSON правим вручную."""
import json

base = r'C:\Users\awright\Desktop\Видео Клод'
W = open(base + r'\build\n7\text.txt', encoding='utf-8').read().strip()
ws = W.split()


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


caps = [cap(0, 3), cap(4, 7), cap(8, 10), cap(11, 13),
        [["тринадцатого", 14, 14], ["и", 15, 15], ["четырнадцатого", 16, 16], ["веков.", 17, 17]],
        cap(18, 20), cap(21, 23), cap(24, 26), cap(27, 29), cap(30, 33), cap(34, 38),
        cap(39, 40), [["двадцать", 41, 41], ["шесть,", 42, 42]], cap(43, 48), cap(49, 51), cap(52, 54)]
caps[4] = [["XIII", 14, 14], ["и", 15, 15], ["XIV", 16, 16], ["веков.", 17, 17]]
caps[6] = [["семидесяти", 21, 21], ["таких", 22, 22], ["рисунков!", 23, 23]]
caps[12] = [["26", 41, 42]]

IMG = lambda f, w, h, lic: {"file": "n7/img/" + f, "size": [w, h], "license": lic}
BL = "Public domain (рукопись XIII–XIV вв., British Library; изображение из блога BL «Knight v Snail», 2013)"

S = {
    "title": "Рыцарь против улитки", "week": 1, "number": 7, "rubric": "Д · Материалы и странности",
    "width": 1080, "height": 1920, "fps": 30, "output": "knight_snail_n7.mp4",
    "voiceover": "assets/audio/voiceover_n7.mp3", "voiceover_text": W, "tail": 0.7,
    "music_file": "assets/audio/music_n7.mp3", "music_vol": 0.5,
    "sources": [
        "British Library, блог Medieval Manuscripts, «Knight v Snail» (25 сентября 2013): примеры из Royal MS 2 B VII, Add MS 49622 (Псалтирь Горлстона, 1310-1324), Yates Thompson MS 19, Royal MS 14 B V, Royal MS 10 E IV, Harley MS 6563",
        "Lilian Randall, «The Snail in Gothic Marginal Warfare», Speculum, 1962: около 70 примеров в 29 рукописях, в основном 1290-1310; версия про ломбардцев (ростовщики); версия графа де Бастара (1850): символ воскресения",
        "Julián Monge-Nájera и др., Revista de Biología Tropical (2019): обзор 26 гипотез; вероятный вывод: рисунки часто просто юмор",
        "ВАЖНО: «сатира на трусость» из плана в озвучку не вошла (в найденных источниках устойчиво названы ломбардцы, воскресение и юмор); кролики-палачи и обезьяны не показаны. Дуэль с «шкалой здоровья» в начале это игровая иллюстрация, не рукопись",
    ],
    "images": {
        "p5": IMG("bl_5.jpg", 1920, 1486, "Public domain (Harley MS 6563, ff. 62v-63r, British Library; блог BL «Knight v Snail»)"),
        "k6": IMG("bl_6.jpg", 1920, 1183, "Public domain (Псалтирь Горлстона, Add MS 49622, f. 162v, British Library)"),
        "k2": IMG("bl_2.jpg", 1920, 1125, "Public domain (Yates Thompson MS 19, f. 65r, British Library)"),
        "k1": IMG("bl_1.jpg", 1920, 795, "Public domain (Псалтирь Горлстона, Add MS 49622, f. 210v, British Library)"),
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО · РЫЦАРЬ И УЛИТКА", "nodes": [
        {"label": "XIII–XIV", "sub": "века", "at": 14}, {"label": "~70", "sub": "рисунков", "at": 18},
        {"label": "26", "sub": "версий", "at": 39}, {"label": "?", "sub": "ответа нет", "at": 49}]},
    "scenes": [
        {"id": 1, "type": "duel", "from": 0, "knightAt": 3, "snailAt": 4, "vsAt": 5, "koAt": 7},
        {"id": 2, "type": "card", "from": 8, "trans": "circle", "image": "p5", "tilt": 2, "focus": [0.5, 0.5], "h": 740, "top": 540, "badge": "Улика №1",
         "chip": "Harley MS 6563 · Британская библиотека", "punches": [12],
         "shots": [{"at": 8, "focus": [0.5, 0.5], "zoom": 1}, {"at": 12, "focus": [0.27, 0.88], "zoom": 2.6, "ring": {"rx": 140, "ry": 110, "dx": 0, "dy": 12}}],
         "stamp": {"text": "НА ПОЛЯХ", "at": 12, "angle": -8}},
        {"id": 3, "type": "ages", "from": 14, "trans": "slices", "at13": 14, "at14": 16},
        {"id": 4, "type": "tally", "from": 18, "trans": "zoom", "countAt": 20},
        {"id": 5, "type": "card", "from": 24, "trans": "diag", "image": "k6", "tilt": -2, "focus": [0.5, 0.5], "h": 580, "top": 640, "badge": "Версия 1",
         "chip": "Псалтирь Горлстона · 1310–1324", "punches": [29],
         "shots": [{"at": 24, "focus": [0.5, 0.5], "zoom": 1}, {"at": 28, "focus": [0.2, 0.55], "zoom": 2.1, "ring": {"rx": 130, "ry": 105, "dx": 172, "dy": -205}}],
         "stamp": {"text": "ВОСКРЕСЕНИЕ", "at": 29, "angle": 7}},
        {"id": 6, "type": "card", "from": 30, "trans": "ink", "image": "k2", "tilt": 2.5, "focus": [0.5, 0.5], "h": 560, "top": 640, "badge": "Версия 2",
         "chip": "Yates Thompson MS 19 · около 1320", "rain": {"at": 31}, "punches": [33],
         "shots": [{"at": 30, "focus": [0.5, 0.5], "zoom": 1}], "stamp": {"text": "РОСТОВЩИКИ", "at": 33, "angle": -7}},
        {"id": 7, "type": "card", "from": 34, "trans": "glitch", "image": "k1", "tilt": -2.5, "focus": [0.5, 0.5], "h": 420, "top": 700, "badge": "Версия 3",
         "chip": "Псалтирь Горлстона · кролик с мечом", "punches": [36, 38],
         "bubbles": [{"at": 36, "text": "ХА-ХА!", "pos": [600, -70], "angle": 6}, {"at": 38, "text": "ШУТКА!", "pos": [20, 330], "angle": -7}],
         "shots": [{"at": 34, "focus": [0.5, 0.5], "zoom": 1}, {"at": 38, "focus": [0.8, 0.5], "zoom": 1.5}]},
        {"id": 8, "type": "tiles26", "from": 39, "trans": "spin", "numAt": 41, "noAt": 44, "stampAt": 48},
        {"id": 9, "type": "question", "from": 49, "trans": "flash", "text": "Что хотел сказать художник?"},
    ],
    "sfx": {"swoosh": "assets/audio/sfx_swoosh.mp3", "stamp": "assets/audio/sfx_stamp.mp3", "ding": "assets/audio/sfx_ding.mp3", "tick": "assets/audio/sfx_tick.mp3",
            "curtain": "assets/audio/sfx_swoosh.mp3", "boom": "assets/audio/sfx_stamp.mp3", "shutter": "assets/audio/sfx_tick.mp3", "quill": "assets/audio/sfx_tick.mp3",
            "projector": "assets/audio/sfx_swoosh.mp3", "clash": "assets/audio/sfx7/t_clash.mp3", "squelch": "assets/audio/sfx7/t_squelch.mp3",
            "page": "assets/audio/sfx7/t_page.mp3", "coins": "assets/audio/sfx7/t_coins.mp3", "chime": "assets/audio/sfx7/t_chime.mp3", "boing": "assets/audio/sfx7/t_boing.mp3"},
    "events": [
        {"sfx": "tick", "at": 1, "dt": 0.0, "vol": 0.3}, {"sfx": "tick", "at": 1, "dt": 0.12, "vol": 0.3}, {"sfx": "tick", "at": 2, "dt": 0.0, "vol": 0.3},
        {"sfx": "swoosh", "at": 3, "dt": 0.0, "vol": 0.4},
        {"sfx": "clash", "at": 5, "dt": 0.13, "vol": 0.6}, {"sfx": "clash", "at": 5, "dt": 0.47, "vol": 0.6}, {"sfx": "clash", "at": 5, "dt": 0.8, "vol": 0.6},
        {"sfx": "squelch", "at": 7, "dt": 0.0, "vol": 0.6},
        {"sfx": "page", "at": 8, "dt": 0.0, "vol": 0.5},
        {"sfx": "chime", "at": 16, "dt": 0.0, "vol": 0.3},
        {"sfx": "chime", "at": 29, "dt": 0.0, "vol": 0.45},
        {"sfx": "coins", "at": 31, "dt": 0.0, "vol": 0.5}, {"sfx": "coins", "at": 32, "dt": 0.3, "vol": 0.4},
        {"sfx": "boing", "at": 36, "dt": 0.0, "vol": 0.5}, {"sfx": "boing", "at": 38, "dt": 0.0, "vol": 0.5},
        {"sfx": "stamp", "at": 48, "dt": 0.05, "vol": 0.7},
    ] + [{"sfx": "tick", "at": 20, "dt": 0.9 + i * 0.1, "vol": 0.22} for i in range(12)]
      + [{"sfx": "tick", "at": 41, "dt": 0.05 + i * 0.05, "vol": 0.22} for i in range(10)],
}
json.dump(S, open(base + r'\script_n7.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
