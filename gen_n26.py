"""Видео 26 «Восьмое чудо света» (Янтарная комната, метка n26, стиль board26): 2-секундный видео-хук, переходы: круг, занавес, переворот, часовой вайп, ромб, вайп вверх."""
import json

base = r'C:\Users\awright\Desktop\Видео Клод'

b17 = open(base + r'\remotion\src\Board17.jsx', encoding='utf-8').read()
head = b17[:b17.index('// наклейка')].replace("staticFile('n17/img/' + n)", "staticFile('n26/img/' + n)")
ka = head.index('const KEYS = [')
kb = head.index('];', ka) + 2
keys = '''const KEYS = [
  {t: 0.0, x: 540, y: 3000, s: 1.0, pose: 'shrug', look: 1},
  {t: 2.7, x: 540, y: 3000, s: 1.0, pose: 'shrug', look: 1},
  {t: 3.2, ...SIDE_R, pose: 'shrug', look: -1},
  {t: 4.0, ...SIDE_R, pose: 'shrug', look: -1},
  {t: 4.6, ...SIDE_L, pose: 'amberdog', look: 1},
  {t: 5.0, ...SIDE_L, pose: 'amberdog', look: 1},
  {t: 5.9, ...SIDE_R, pose: 'amberdog', look: -1},
  {t: 8.5, ...SIDE_R, pose: 'amberdog', look: -1},
  {t: 9.2, ...SIDE_L, pose: 'hunter', look: 1},
  {t: 12.6, ...SIDE_L, pose: 'hunter', look: 1},
  {t: 13.3, ...SIDE_R, pose: 'shrug', look: -1},
  {t: 15.0, ...SIDE_R, pose: 'shrug', look: -1},
  {t: 15.7, ...SIDE_L, pose: 'open', look: 1},
  {t: 19.0, ...SIDE_L, pose: 'open', look: 1},
  {t: 19.7, x: 540, y: 1790, s: 1.0, pose: 'hunter', look: 1},
  {t: 40, x: 540, y: 1790, s: 1.0, pose: 'hunter', look: 1},
];'''
head = head[:ka] + keys + head[kb:]
main = open(base + r'\scripts\main26_main.jsx', encoding='utf-8').read()
open(base + r'\remotion\src\Board26.jsx', 'w', encoding='utf-8').write(head + main)

p = base + r'\remotion\src\Main.jsx'
m = open(p, encoding='utf-8').read()
if 'Board26Main' not in m:
    m = m.replace("import {Board25Main} from './Board25';", "import {Board25Main} from './Board25';\nimport {Board26Main} from './Board26';", 1)
    m = m.replace("script.style === 'board25' ? Board25Main :", "script.style === 'board25' ? Board25Main : script.style === 'board26' ? Board26Main :", 1)
    open(p, 'w', encoding='utf-8').write(m)

W = open(base + r'\build\n26\text.txt', encoding='utf-8').read().strip()
ws = W.split()
assert len(ws) == 64


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


rng = [(0, 3), (4, 9), (10, 12), (13, 18), (19, 22), (23, 27), (28, 32), (33, 36), (37, 43), (44, 50), (51, 55), (56, 57), (58, 59), (60, 63)]
caps = [cap(a, b) for a, b in rng]


def ev(sfx, at, dt=0.0, vol=0.5):
    return {"sfx": sfx, "at": at, "dt": dt, "vol": vol}


S = {
    "title": "Восьмое чудо света", "style": "board26", "week": 4, "number": 26, "rubric": "А · Скандалы и тайны",
    "width": 1080, "height": 1920, "fps": 30, "output": "amber_room_n26.mp4",
    "voiceover": "assets/audio/voiceover_n26.mp3", "voiceover_text": W, "tail": 0.9,
    "music_file": "assets/audio/music_n26.mp3", "music_vol": 0.7, "duck_ratio": 1.8,
    "sources": [
        "Янтарная комната: Андрей Зеест, автохром Янтарной комнаты (Commons: Andrey Zeest - Amber Room 2 (autochrome).jpg, Public domain); реконструкция в Екатерининском дворце, Царское Село (Commons: 8454. Amber room of the Catherine Palace.jpg, автор G. Alexandrova, CC BY-SA 4.0: указывать авторство); Пётр I работы Кнеллера (Commons, PD); Фридрих Вильгельм I работы Пена (Commons, PD)",
        "Факты (Britannica, Wikipedia): 1716, прусский король Фридрих Вильгельм I передал Петру I недостроенную комнату (в обмен на солдат против Швеции; источники расходятся, кто заказчик, Фридрих I или сын); 1941, немцы демонтировали комнату в Царском Селе и вывезли в Кёнигсберг (ныне Калининград); судьба после 1944/1945 неизвестна (многие историки считают, что погибла в последние месяцы войны, версии спорят: сгорела, увезена, спрятана); реконструкция (с 1979) открыта 31 мая 2003 в Екатерининском дворце. Фраза в ролике «около 1945» осторожная, «никто точно не знает».",
        "Хук: собака в Янтарной комнате, стартовый кадр (Magnific images_generate с reference собаки) и видео Kling 2.5 (720p, 5 с, ускорено в 1,6 раза, 2,2 с) сгенерированы нейросетью, иллюстрации. Позы собаки (янтарь в лапах, кладоискатель, недоумение) сгенерированы в Magnific. Карта и ящик на экране схематичны (иллюстрации).",
    ],
    "images": {
        "zeest": {"file": "n26/img/zeest.jpg", "size": [902, 666], "license": "Public domain (Commons)"},
        "recon": {"file": "n26/img/recon.jpg", "size": [1920, 1440], "license": "CC BY-SA 4.0 (G. Alexandrova, Commons)"},
        "peter": {"file": "n26/img/peter.jpg", "size": [960, 1600], "license": "Public domain (Commons)"},
        "fw": {"file": "n26/img/fw.jpg", "size": [960, 1312], "license": "Public domain (Commons)"},
        "dog": {"file": "n26/img/p_{amberdog,hunter,shrug}.png", "size": [575, 890], "license": "ИЛЛЮСТРАЦИИ нейросети (Magnific), персонаж Шиба"},
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО №26 · ЯНТАРНАЯ КОМНАТА", "nodes": []},
    "scenes": [{"id": 1, "type": "board", "from": 0}],
    "cam": [],
    "dingAt": 63,
    "sfx": {"whoosh": "assets/audio/sfx8/t_whoosh.mp3", "ting": "assets/audio/sfx8/t_ting.mp3", "pulse": "assets/audio/sfx8/t_pulse.mp3", "shing": "assets/audio/sfx8/t_shing.mp3",
            "ding": "assets/audio/sfx8/t_ting.mp3", "thud": "assets/audio/sfx15/t_thud.mp3", "tick": "assets/audio/sfx_tick.mp3", "stamp": "assets/audio/sfx10/t_stamp.mp3", "swoosh": "assets/audio/sfx8/t_whoosh.mp3",
            "slap": "assets/audio/sfx13/t_slap.mp3", "brush": "assets/audio/sfx12/t_brush.mp3", "coin": "assets/audio/sfx11/t_coin.mp3"},
    "events": [
        ev("pulse", 0, 0.0, 0.4), ev("shing", 5, 0.0, 0.5), ev("whoosh", 8, 0.1, 0.6),
        ev("stamp", 6, 0.3, 0.6), ev("stamp", 7, 0.3, 0.6), ev("stamp", 9, 0.0, 0.6), ev("stamp", 9, 0.25, 0.6), ev("thud", 9, 0.4, 0.6),
        ev("whoosh", 10, -0.3, 0.55), ev("ting", 11, 0.0, 0.3),
        ev("whoosh", 13, -0.5, 0.6), ev("ting", 15, 0.5, 0.35),
        ev("stamp", 20, 0.0, 0.6), ev("stamp", 21, -0.05, 0.6), ev("stamp", 21, 0.2, 0.6), ev("stamp", 22, 0.15, 0.6),
        ev("whoosh", 23, -0.2, 0.55),
        ev("stamp", 24, 0.05, 0.6), ev("stamp", 25, 0.1, 0.6), ev("stamp", 26, 0.05, 0.6), ev("stamp", 27, 0.0, 0.6),
        ev("coin", 30, 0.0, 0.4), ev("ting", 36, 0.0, 0.4), ev("thud", 36, 0.2, 0.5),
        ev("whoosh", 37, -0.4, 0.55), ev("ting", 40, -0.1, 0.3), ev("ting", 41, 0.1, 0.3), ev("ting", 43, 0.0, 0.3),
        ev("whoosh", 44, -0.2, 0.55),
        ev("stamp", 53, 0.05, 0.6), ev("stamp", 54, 0.3, 0.6), ev("stamp", 55, 0.15, 0.6), ev("stamp", 55, 0.4, 0.6),
        ev("stamp", 57, 0.1, 0.7), ev("whoosh", 58, -0.2, 0.5), ev("ting", 63, 0.2, 0.5),
    ],
}
json.dump(S, open(base + r'\script_n26.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
