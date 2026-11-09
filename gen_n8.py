"""Сценарий видео 8 «Художник-беглец» (Караваджо, метка n8), стиль aurora. После запуска JSON правим вручную."""
import json

base = r'C:\Users\awright\Desktop\Видео Клод'

# Main.jsx: выбор стиля aurora
p = base + r'\remotion\src\Main.jsx'
s = open(p, encoding='utf-8').read()
if 'AuroraMain' not in s:
    s = s.replace("import {NoirMain} from './Noir';", "import {NoirMain} from './Noir';\nimport {AuroraMain} from './Aurora';", 1)
    s = s.replace("export const Main = script.style === 'noir' ? NoirMain : ClassicMain;",
                  "export const Main = script.style === 'noir' ? NoirMain : script.style === 'aurora' ? AuroraMain : ClassicMain;", 1)
    open(p, 'w', encoding='utf-8').write(s)

W = open(base + r'\build\n8\text.txt', encoding='utf-8').read().strip()
ws = W.split()


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


caps = [cap(0, 3), cap(4, 7), [["В", 8, 8], ["1606", 9, 11], ["году", 12, 12]], cap(13, 16), cap(17, 19), cap(20, 24), cap(25, 28), cap(29, 32), cap(33, 37), cap(38, 41),
        cap(42, 47), cap(48, 51), cap(52, 57), cap(58, 63), cap(64, 66), cap(67, 70)]

IM = lambda f, w, h, lic: {"file": "n8/img/" + f, "size": [w, h], "license": lic}

S = {
    "title": "Художник-беглец", "style": "aurora", "week": 2, "number": 8, "rubric": "Г · Судьбы художников",
    "width": 1080, "height": 1920, "fps": 30, "output": "caravaggio_n8.mp4",
    "voiceover": "assets/audio/voiceover_n8.mp3", "voiceover_text": W, "tail": 0.8,
    "music_file": "assets/audio/music_n8.mp3", "music_vol": 0.5,
    "sources": [
        "Wikipedia: Caravaggio (убийство Ранучо Томассони в Риме 28 мая 1606, смертный приговор («bando capitale»), бегство в Неаполь, на Мальту (1607-1608), на Сицилию)",
        "Wikipedia: The Beheading of Saint John the Baptist (Караваджо, 1608, собор св. Иоанна, Валлетта; единственная подписанная картина, подпись «f. Michelang.» в крови; размер 361 × 520 см)",
        "Wikipedia: David with the Head of Goliath (Галерея Боргезе, ок. 1609-1610): голова Голиафа традиционно считается автопортретом Караваджо",
        "ВАЖНО: в ролике в озвучке «убил»; в источниках пишется, что Томассони погиб в схватке, и Караваджо признан убийцей. Автопортретность головы Голиафа общепринятая версия, но не доказанный факт; портрет Леони 1621 года использован как узнаваемое лицо художника",
        "Дата убийства (28 мая 1606) в ролике не называется; в озвучке только год",
    ],
    "images": {
        "leoni": IM("n8_02_leoni.jpg", 1500, 2126, "Public domain (Ottavio Leoni, портрет Караваджо, около 1621, Wikimedia Commons)"),
        "david": IM("n8_01_david.jpg", 1920, 2376, "Public domain (Караваджо, Давид с головой Голиафа, Галерея Боргезе, Wikimedia Commons)"),
        "malta": IM("n8_03_malta.jpg", 1920, 1329, "Public domain (Караваджо, Усекновение главы Иоанна Крестителя, 1608, Wikimedia Commons)"),
        "lucy": IM("n8_04_lucy.jpg", 1920, 2604, "Public domain (Караваджо, Погребение св. Люции, 1608, Wikimedia Commons)"),
        "mercy": IM("n8_05_mercy.jpg", 1920, 2946, "Public domain (Караваджо, Семь деяний милосердия, 1607, Wikimedia Commons)"),
        "judith": IM("n8_06_judith.jpg", 1920, 1424, "Public domain (Караваджо, Юдифь и Олоферн, около 1599, Wikimedia Commons)"),
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО · КАРАВАДЖО", "nodes": [
        {"label": "1606", "sub": "драка", "at": 8}, {"label": "Приговор", "sub": "смерть", "at": 22},
        {"label": "Побег", "sub": "3 города", "at": 25}, {"label": "Мальта", "sub": "подпись", "at": 33}, {"label": "Голиаф", "sub": "лицо", "at": 52}]},
    "scenes": [
        {"id": 1, "type": "hero", "from": 0, "mood": "blue", "image": "leoni", "killAt": 2, "sealAt": 7},
        {"id": 2, "type": "year", "from": 8, "mood": "deep", "trans": "sweep", "clashAt": 15, "brawlAt": 16},
        {"id": 3, "type": "sentence", "from": 17, "mood": "deep", "trans": "bloom", "nameAt": 17, "scrollAt": 22, "sealAt": 24},
        {"id": 4, "type": "route", "from": 25, "mood": "blue", "trans": "shutters", "naplesAt": 28, "maltaAt": 30, "sicilyAt": 32},
        {"id": 5, "type": "plate", "from": 33, "mood": "dawn", "trans": "wipeUp", "image": "malta", "w": 860, "h": 595, "top": 560, "badge": "Мальта · 1608",
         "chip": "Собор св. Иоанна · Валлетта", "dims": {"at": 37, "w": "5,2 м", "h": "3,6 м"}, "punches": [37, 43],
         "shots": [{"at": 33, "focus": [0.5, 0.5], "zoom": 1},
                   {"at": 43, "focus": [0.48, 0.972], "zoom": 4.0, "ring": {"rx": 135, "ry": 58, "dx": 0, "dy": 232}, "note": {"text": "ПОДПИСЬ В КРОВИ", "pos": [90, 60], "angle": -4}}]},
        {"id": 6, "type": "montage", "from": 48, "mood": "gold", "trans": "lens", "textAt": 51,
         "tiles": [{"image": "judith", "at": 48, "pos": "30% 40%"}, {"image": "mercy", "at": 49, "pos": "50% 45%"}, {"image": "lucy", "at": 50, "pos": "50% 50%"}]},
        {"id": 7, "type": "plate", "from": 52, "mood": "deep", "trans": "glassSlide", "image": "david", "w": 700, "h": 860, "top": 500, "badge": "Давид · около 1610",
         "chip": "Галерея Боргезе · Рим", "punches": [58],
         "shots": [{"at": 52, "focus": [0.5, 0.5], "zoom": 1}, {"at": 58, "focus": [0.81, 0.76], "zoom": 2.6, "ring": {"rx": 170, "ry": 150, "dx": 0, "dy": 0}}]},
        {"id": 8, "type": "compare", "from": 60, "mood": "dawn", "trans": "flare", "eqAt": 62, "stampAt": 63,
         "left": {"image": "david", "size": 380, "pos": "-1124px -1260px"}, "right": {"image": "leoni", "size": 300, "pos": "-436px -388px"}},
        {"id": 9, "type": "question", "from": 64, "mood": "gold", "trans": "spin", "text": "Что он хотел этим сказать?"},
    ],
    "sfx": {"swoosh": "assets/audio/sfx8/t_whoosh.mp3", "stamp": "assets/audio/sfx8/t_pulse.mp3", "ding": "assets/audio/sfx8/t_ting.mp3", "tick": "assets/audio/sfx_tick.mp3",
            "whoosh": "assets/audio/sfx8/t_whoosh.mp3", "ting": "assets/audio/sfx8/t_ting.mp3", "pulse": "assets/audio/sfx8/t_pulse.mp3", "riser": "assets/audio/sfx8/t_riser.mp3",
            "shing": "assets/audio/sfx8/t_shing.mp3", "ship": "assets/audio/sfx8/t_ship.mp3", "projector": "assets/audio/sfx8/t_whoosh.mp3", "curtain": "assets/audio/sfx8/t_ting.mp3"},
    "events": [
        {"sfx": "riser", "at": 0, "dt": 0.0, "vol": 0.25}, {"sfx": "pulse", "at": 2, "dt": 0.0, "vol": 0.6}, {"sfx": "shing", "at": 7, "dt": 0.0, "vol": 0.45}, {"sfx": "pulse", "at": 7, "dt": 0.1, "vol": 0.6},
        {"sfx": "shing", "at": 15, "dt": -0.05, "vol": 0.6}, {"sfx": "pulse", "at": 15, "dt": 0.0, "vol": 0.5}, {"sfx": "pulse", "at": 16, "dt": 0.05, "vol": 0.5},
        {"sfx": "ting", "at": 17, "dt": 0.1, "vol": 0.3}, {"sfx": "riser", "at": 22, "dt": 0.0, "vol": 0.3}, {"sfx": "pulse", "at": 24, "dt": 0.0, "vol": 0.7},
        {"sfx": "ship", "at": 25, "dt": 0.0, "vol": 0.3}, {"sfx": "ting", "at": 28, "dt": 0.2, "vol": 0.35}, {"sfx": "ting", "at": 30, "dt": 0.2, "vol": 0.35}, {"sfx": "ting", "at": 32, "dt": 0.2, "vol": 0.35},
        {"sfx": "pulse", "at": 37, "dt": 0.1, "vol": 0.3}, {"sfx": "ting", "at": 43, "dt": 0.2, "vol": 0.4},
        {"sfx": "whoosh", "at": 48, "dt": 0.0, "vol": 0.3}, {"sfx": "whoosh", "at": 49, "dt": 0.0, "vol": 0.3}, {"sfx": "whoosh", "at": 50, "dt": 0.0, "vol": 0.3}, {"sfx": "pulse", "at": 51, "dt": 0.0, "vol": 0.6},
        {"sfx": "riser", "at": 56, "dt": 0.0, "vol": 0.3}, {"sfx": "pulse", "at": 58, "dt": 0.0, "vol": 0.5},
        {"sfx": "ting", "at": 62, "dt": 0.0, "vol": 0.5}, {"sfx": "pulse", "at": 63, "dt": 0.0, "vol": 0.6},
    ],
}
json.dump(S, open(base + r'\script_n8.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
