"""Заготовка script_n3.json (видео 3 «Крик, украденный дважды»). Дальше правим JSON вручную."""
import json

W = ("Самую известную картину Норвегии украли меньше чем за минуту! Это случилось в день открытия Олимпиады в "
     "тысяча девятьсот девяносто четвёртом году. Воры залезли в окно музея по лестнице. На стене они оставили записку: "
     "«Спасибо за плохую охрану». Через три месяца картину нашли целой! А в две тысячи четвёртом вооружённые грабители "
     "унесли другую версию «Крика». Её вернули только через два года. Как думаете, почему воры так любят «Крик»?")
ws = W.split()


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


caps = [
    cap(0, 4), cap(5, 8), cap(9, 14),
    [["в", 15, 15], ["1994", 16, 19], ["году.", 20, 20]],
    cap(21, 24), cap(25, 27), cap(28, 32), cap(33, 36), cap(37, 39), cap(40, 42),
    [["А", 43, 43], ["в", 44, 44], ["2004", 45, 47]], cap(48, 49), cap(50, 53),
    cap(54, 56), cap(57, 59), cap(60, 61), cap(62, 66),
]

S = {
    "title": "Крик, украденный дважды", "week": 1, "number": 3, "rubric": "А · Арт-детектив",
    "width": 1080, "height": 1920, "fps": 30, "output": "scream_n3.mp4",
    "voiceover": "assets/audio/voiceover_n3.mp3", "voiceover_text": W, "tail": 0.8,
    "music_file": "assets/audio/music_v3.mp3", "music_vol": 0.36,
    "sources": [
        "History.com, «The Scream recovered» (7 мая 1994): кража 12 февраля 1994 в день открытия Олимпиады в Лиллехаммере, около 50 секунд, картина найдена в Осгорстранне",
        "Wikipedia: The Scream; текст записки в источниках различается («Thanks for the poor security» у Wikipedia и NYT, «Thousand thanks for the bad security» у History.com), в ролике перевод по Wikipedia",
        "Reuters и др.: август 2004, кража версии 1910 года (темпера) и «Мадонны» из музея Мунка, возвращены через два года и девять дней",
        "ВАЖНО: в 2004 году украли другую версию «Крика» (1910, музей Мунка), а не ту же картину; в тексте это сказано прямо, в плане было «её украли снова»",
    ],
    "images": {
        "s93": {"file": "n3/img/n3_01_scream93.jpg", "size": [1920, 2383], "license": "Public domain (Munch, The Scream 1893, Национальная галерея Норвегии, Wikimedia Commons)"},
        "s10": {"file": "n3/img/n3_02_scream1910.jpg", "size": [1920, 2432], "license": "Public domain (Munch, The Scream 1910, музей Мунка, Wikimedia Commons)"},
        "museum": {"file": "n3/img/n3_03_museum.jpg", "size": [1920, 1242], "license": "CC BY-SA 4.0 (Wikimedia Commons: Nasjonalgalleriet, Streifzug durch die Stadt Oslo 01), указать автора фото"},
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО · КРИК", "nodes": [
        {"label": "1994", "sub": "кража", "at": 9}, {"label": "3 месяца", "sub": "нашли", "at": 37},
        {"label": "2004", "sub": "вторая кража", "at": 43}, {"label": "2006", "sub": "вернули", "at": 54}]},
    "scenes": [
        {"id": 1, "type": "card", "from": 0, "image": "s93", "tilt": -2.5, "focus": [0.5, 0.4], "h": 760, "top": 560,
         "headline": ["Крик", "украли"], "chip": "Национальная галерея, Осло",
         "timer": {"at": 5, "to": 50, "label": "СЕК"},
         "shots": [{"at": 0, "focus": [0.5, 0.4], "zoom": 1}, {"at": 4, "focus": [0.45, 0.4], "zoom": 1.5}], "ghost": "КРИК"},
        {"id": 2, "type": "card", "from": 9, "trans": "flash", "image": "museum", "tilt": 2, "focus": [0.5, 0.5],
         "badge": "Улика №1", "chip": "Национальная галерея, Осло",
         "counter": {"from": 1990, "to": 1994, "at": 15, "pos": [40, 330]},
         "shots": [{"at": 9, "focus": [0.5, 0.5], "zoom": 1}, {"at": 13, "focus": [0.4, 0.55], "zoom": 1.4}],
         "stamp": {"text": "ОЛИМПИАДА", "at": 13, "angle": -8}, "ghost": "ОСЛО"},
        {"id": 3, "type": "heist", "from": 21, "trans": "slices", "badge": "Улика №2", "chip": "Через окно", "stampText": "ПО ЛЕСТНИЦЕ"},
        {"id": 4, "type": "paper", "from": 28, "trans": "glitch", "badge": "Улика №3", "chip": "Записка воров",
         "typeAt": 33, "text": "«Спасибо за\nплохую охрану»", "stamp": {"text": "ЗАПИСКА", "at": 36}},
        {"id": 5, "type": "card", "from": 37, "trans": "circle", "image": "s93", "tilt": -2, "focus": [0.5, 0.4], "badge": "Улика №4",
         "chip": "Версия 1893 · Национальная галерея",
         "shots": [{"at": 37, "focus": [0.5, 0.4], "zoom": 1, "note": {"text": "через 3 месяца", "pos": [150, 30], "angle": -5}},
                   {"at": 40, "focus": [0.45, 0.45], "zoom": 1.5, "ring": {"rx": 190, "ry": 230}}],
         "stamp": {"text": "НАЙДЕНА", "at": 41, "angle": 7}},
        {"id": 6, "type": "card", "from": 43, "trans": "diag", "image": "s10", "tilt": 2.5, "focus": [0.5, 0.45], "badge": "Улика №5",
         "chip": "Версия 1910 · музей Мунка",
         "shots": [{"at": 43, "focus": [0.5, 0.45], "zoom": 1}, {"at": 48, "focus": [0.5, 0.4], "zoom": 1.25},
                   {"at": 51, "focus": [0.45, 0.45], "zoom": 1.6, "ring": {"rx": 190, "ry": 230}}],
         "counter": {"from": 2000, "to": 2004, "at": 44, "pos": [40, 330]},
         "stamp": {"text": "ДРУГАЯ ВЕРСИЯ", "at": 51, "angle": -7}, "ghost": "2004"},
        {"id": 7, "type": "ended", "from": 54, "trans": "ink", "yearFrom": 2004, "yearTo": 2006,
         "tags": [["Музей Мунка · Осло", "вооружённые грабители, 2004"], ["Вернули через два года", "картина найдена в 2006"]],
         "stampText": "ВЕРНУЛИ"},
        {"id": 8, "type": "question", "from": 60, "trans": "band", "text": "Почему воры так любят «Крик»?",
         "floatImage": {"image": "s93", "focus": [0.46, 0.34]}},
    ],
    "sfx": {"swoosh": "assets/audio/sfx_swoosh.mp3", "stamp": "assets/audio/sfx_stamp.mp3",
            "ding": "assets/audio/sfx_ding.mp3", "tick": "assets/audio/sfx_tick.mp3"},
}
json.dump(S, open("script_n3.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
