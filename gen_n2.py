"""ВНИМАНИЕ: script_n2.json дальше правится вручную (шоты, обводки, стикеры). Этот файл только первичная заготовка."""
"""Генерирует script_n2.json (видео 2 «Мумии в тюбике»). Правки текста делаем здесь или прямо в JSON."""
import json

W = ("Раньше в красках была настоящая мумия! Коричневый пигмент делали из измельчённых египетских мумий. "
     "Этим коричневым писали европейские художники несколько веков. Но однажды Берн-Джонс узнал, из чего его краска. "
     "По рассказам, он похоронил тюбик в саду, как человека. А в тысяча девятьсот шестьдесят четвёртом году "
     "производитель признал: мумии закончились. Как думаете, что в таких тюбиках сегодня?")
ws = W.split()
groups = [(0, 5), (6, 8), (9, 12), (13, 15), (16, 19), (20, 22), (23, 27), (28, 31), (32, 36), None,
          (44, 45), (46, 47), (48, 49), (50, 54)]
caps = []
for g in groups:
    if g is None:  # год в субтитрах цифрами
        caps.append([["А", 37, 37], ["в", 38, 38], ["1964", 39, 42], ["году", 43, 43]])
    else:
        caps.append([[ws[i], i, i] for i in range(g[0], g[1] + 1)])

S = {
    "title": "Мумии в тюбике", "week": 1, "number": 2, "rubric": "Д · Материалы и странности",
    "width": 1080, "height": 1920, "fps": 30, "output": "mummy_brown_n2.mp4",
    "voiceover": "assets/audio/voiceover_n2.mp3", "voiceover_text": W, "tail": 0.8,
    "music_file": "assets/audio/music_v3.mp3", "music_vol": 0.36,
    "sources": [
        "Wikipedia: Mummy brown (пигмент «мумиевый коричневый»), со ссылками на Woodcock и др.",
        "National Geographic, 2016: статья о мумиях в живописи и пигменте (Делакруа)",
        "Рассказ Киплинга о том, как Берн-Джонс похоронил тюбик в саду, передан в Wikipedia; версии различаются, поэтому в тексте «по рассказам»",
        "Time, 1964: C. Roberson & Co. заявила, что настоящие мумии для краски закончились (по пересказу в Wikipedia); проверить по первоисточнику перед публикацией",
    ],
    "images": {
        "tube": {"file": "v2/img/v2_01_tube.jpg", "size": [1920, 916], "license": "CC BY-SA 4.0, Geni (Wikimedia Commons: Tube of mummy brown in a coffin.JPG)"},
        "mummy": {"file": "v2/img/v2_02_mummy.jpg", "size": [1658, 1800], "license": "Public domain (Walters Art Museum: Mummy and Painted Cartonnage of an Unknown Woman, Walters 791, Detail A)"},
        "cophetua": {"file": "v2/img/v2_03_cophetua.jpg", "size": [1054, 2316], "license": "Public domain (Burne-Jones, King Cophetua and the Beggar Maid, Google Art Project)"},
        "bj": {"file": "v2/img/v2_04_burnejones.jpg", "size": [769, 1284], "license": "Public domain (Frederick Hollyer, portrait of Edward Burne-Jones c1882)"},
        "garden": {"file": "v2/img/v2_05_garden.jpg", "size": [1061, 887], "license": "Public domain (Frederick Hollyer, Garden Studio at the Grange 1887)"},
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО · КОРИЧНЕВЫЙ ПИГМЕНТ", "nodes": [
        {"label": "Египет", "sub": "мумии", "at": 6}, {"label": "XIX век", "sub": "художники", "at": 13},
        {"label": "Сад", "sub": "Берн-Джонс", "at": 28}, {"label": "1964", "sub": "конец краски", "at": 37}]},
    "scenes": [
        {"id": 1, "type": "card", "from": 0, "image": "tube", "tilt": -2.5, "focus": [0.5, 0.5], "h": 520, "top": 680,
         "headline": ["Мумия", "в красках"], "chip": "Мумиевый коричневый"},
        {"id": 2, "type": "card", "from": 6, "image": "mummy", "tilt": 2.5, "focus": [0.5, 0.3], "badge": "Улика №1",
         "chip": "Египетская мумия", "stamp": {"text": "ИЗ МУМИЙ", "at": 10, "angle": -8}},
        {"id": 3, "type": "card", "from": 13, "image": "cophetua", "tilt": -2, "focus": [0.5, 0.3], "badge": "Улика №2",
         "chip": "Живопись XIX века"},
        {"id": 4, "type": "card", "from": 20, "image": "bj", "tilt": 2, "focus": [0.5, 0.4], "badge": "Улика №3",
         "chip": "Эдвард Берн-Джонс", "stamp": {"text": "УЗНАЛ!", "at": 23, "angle": 7}},
        {"id": 5, "type": "card", "from": 28, "image": "garden", "tilt": -2.5, "focus": [0.5, 0.5], "badge": "Улика №4",
         "chip": "Мастерская в саду, 1887", "stamp": {"text": "ПОХОРОНИЛ", "at": 31, "angle": -7}},
        {"id": 6, "type": "ended", "from": 37, "tags": [["Английский производитель красок", "признал в 1964 году"],
                                                         ["Мумии закончились", "настоящей краски больше нет"]],
         "stampText": "КОНЕЦ ЭПОХИ"},
        {"id": 7, "type": "question", "from": 48, "text": "Что в таких тюбиках сегодня?"},
    ],
    "sfx": {"swoosh": "assets/audio/sfx_swoosh.mp3", "stamp": "assets/audio/sfx_stamp.mp3",
            "ding": "assets/audio/sfx_ding.mp3", "tick": "assets/audio/sfx_tick.mp3"},
}
json.dump(S, open("script_n2.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
