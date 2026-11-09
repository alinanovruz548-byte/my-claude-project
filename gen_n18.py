"""Видео 18 «Смерть Марата» (Давид, метка n18, стиль board18): картина-пропаганда, собака-аниматор."""
import json
import re

base = r'C:\Users\awright\Desktop\Видео Клод'

b17 = open(base + r'\remotion\src\Board17.jsx', encoding='utf-8').read()
head = b17[:b17.index('// наклейка')].replace("staticFile('n17/img/' + n)", "staticFile('n18/img/' + n)")
# расписание собаки
ka = head.index('const KEYS = [')
kb = head.index('];', ka) + 2
keys = '''const KEYS = [
  {t: 2.9, x: 1500, y: 1760, s: 2.6, pose: 'swipe', look: 1, big: true},
  {t: 3.65, x: -480, y: 1760, s: 2.6, pose: 'swipe', look: 1, big: true},
  {t: 3.7, x: 1250, y: 1895, s: 0.72, pose: 'wave', look: 1},
  {t: 4.3, ...SIDE_R, pose: 'wave', look: 1},
  {t: 6.0, ...SIDE_R, pose: 'open', look: -1},
  {t: 8.3, ...SIDE_L, pose: 'jump', look: 1},
  {t: 9.2, ...SIDE_L, pose: 'open', look: 1},
  {t: 10.8, ...SIDE_R, pose: 'wave', look: -1},
  {t: 12.6, ...SIDE_R, pose: 'laugh', look: -1},
  {t: 13.4, ...SIDE_L, pose: 'wash', look: 1},
  {t: 15.2, ...SIDE_L, pose: 'wash', look: 1},
  {t: 15.9, ...SIDE_R, pose: 'open', look: -1},
  {t: 16.3, ...SIDE_R, pose: 'open', look: -1},
  {t: 16.4, x: 1500, y: 1760, s: 2.6, pose: 'swipe', look: 1, big: true},
  {t: 17.15, x: -480, y: 1760, s: 2.6, pose: 'swipe', look: 1, big: true},
  {t: 17.2, x: 1250, y: 1895, s: 0.72, pose: 'laugh', look: 1},
  {t: 17.8, ...SIDE_R, pose: 'laugh', look: 1},
  {t: 19.4, ...SIDE_R, pose: 'laugh', look: 1},
  {t: 20.0, x: 540, y: 1790, s: 1.12, pose: 'wave', look: 1},
  {t: 21.6, x: 540, y: 1790, s: 1.12, pose: 'laugh', look: 1},
  {t: 40, x: 540, y: 1790, s: 1.12, pose: 'laugh', look: 1},
];'''
head = head[:ka] + keys + head[kb:]
main = open(base + r'\scripts\main18_main.jsx', encoding='utf-8').read()
open(base + r'\remotion\src\Board18.jsx', 'w', encoding='utf-8').write(head + main)

p = base + r'\remotion\src\Main.jsx'
m = open(p, encoding='utf-8').read()
if 'Board18Main' not in m:
    m = m.replace("import {Board17Main} from './Board17';", "import {Board17Main} from './Board17';\nimport {Board18Main} from './Board18';", 1)
    m = m.replace("script.style === 'board17' ? Board17Main :", "script.style === 'board17' ? Board17Main : script.style === 'board18' ? Board18Main :", 1)
    open(p, 'w', encoding='utf-8').write(m)

W = open(base + r'\build\n18\text.txt', encoding='utf-8').read().strip()
ws = W.split()


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


caps = [cap(0, 5), [["13", 6, 6], ["июля", 7, 7], ["1793", 8, 11], ["года:", 12, 12]], cap(13, 19), cap(20, 24), cap(25, 28), cap(29, 32), cap(33, 35), cap(36, 38), cap(39, 40), cap(41, 44)]
caps[1] = [["Тринадцатое", 6, 6], ["июля", 7, 7], ["1793", 8, 11], ["года:", 12, 12]]

S = {
    "title": "Смерть Марата: правда или пропаганда", "style": "board18", "week": 3, "number": 18, "rubric": "Г · Художник и его время",
    "width": 1080, "height": 1920, "fps": 30, "output": "marat_n18.mp4",
    "voiceover": "assets/audio/voiceover_n18.mp3", "voiceover_text": W, "tail": 0.9,
    "music_file": "assets/audio/music_n18.mp3", "music_vol": 0.7, "duck_ratio": 1.8,
    "sources": [
        "Жак-Луи Давид, «Смерть Марата» (Marat assassiné), 1793, Королевские музеи изящных искусств Бельгии, Брюссель (Public domain, Commons: Death of Marat by David.jpg); Жан-Поль Марат убит Шарлоттой Корде 13 июля 1793 в ванне (лечебные ванны из-за кожной болезни)",
        "Давид — депутат Конвента и друг Марата; картина идеализирует Марата (гладкая кожа, поза как у Христа в «Пьете» Микеланджело, надпись «À Marat, David» на ящике), задумана как памятник мученику революции; часть источников приводит слова Давида, что он показал Марата «как нашёл его»",
        "Портрет Марата кисти Жозефа Бозе (Public domain), «Шарлотта Корде» Поля Бодри (Public domain, Commons: Charlotte Corday.jpg), автопортрет Давида (Public domain)",
        "Собака Шиба: позы сгенерированы нейросетью (Magnific), вырезаны",
    ],
    "images": {
        "paintings": {"file": "n18/img/{marat,face,boze,david,corday}.jpg", "size": [0, 0], "license": "Public domain (Commons)"},
        "dog": {"file": "n18/img/p_*.png", "size": [575, 890], "license": "ИЛЛЮСТРАЦИИ нейросети (Magnific), персонаж Шиба"},
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО №18 · СМЕРТЬ МАРАТА", "nodes": []},
    "scenes": [{"id": 1, "type": "board", "from": 0}],
    "cam": [],
    "dingAt": 44,
    "sfx": {"whoosh": "assets/audio/sfx8/t_whoosh.mp3", "ting": "assets/audio/sfx8/t_ting.mp3", "pulse": "assets/audio/sfx8/t_pulse.mp3", "shing": "assets/audio/sfx8/t_shing.mp3",
            "ding": "assets/audio/sfx8/t_ting.mp3", "thud": "assets/audio/sfx15/t_thud.mp3", "tick": "assets/audio/sfx_tick.mp3", "stamp": "assets/audio/sfx10/t_stamp.mp3", "swoosh": "assets/audio/sfx8/t_whoosh.mp3",
            "slap": "assets/audio/sfx13/t_slap.mp3"},
    "events": [
        {"sfx": "pulse", "at": 0, "dt": 0.0, "vol": 0.5}, {"sfx": "whoosh", "at": 1, "dt": 0.0, "vol": 0.6}, {"sfx": "thud", "at": 2, "dt": -0.2, "vol": 1.0}, {"sfx": "whoosh", "at": 6, "dt": -0.5, "vol": 0.6},
        {"sfx": "whoosh", "at": 6, "dt": -0.35, "vol": 0.35}, {"sfx": "ting", "at": 8, "dt": 0.0, "vol": 0.3}, {"sfx": "slap", "at": 13, "dt": 0.0, "vol": 0.5}, {"sfx": "whoosh", "at": 20, "dt": -0.3, "vol": 0.4},
        {"sfx": "ting", "at": 22, "dt": 0.0, "vol": 0.3}, {"sfx": "whoosh", "at": 25, "dt": -0.3, "vol": 0.4}, {"sfx": "ting", "at": 28, "dt": 0.1, "vol": 0.5}, {"sfx": "shing", "at": 28, "dt": 0.2, "vol": 0.4},
        {"sfx": "whoosh", "at": 29, "dt": -0.2, "vol": 0.35}, {"sfx": "whoosh", "at": 33, "dt": -0.7, "vol": 0.6}, {"sfx": "whoosh", "at": 33, "dt": -0.55, "vol": 0.35}, {"sfx": "thud", "at": 38, "dt": -0.1, "vol": 1.0},
        {"sfx": "stamp", "at": 38, "dt": -0.1, "vol": 0.7}, {"sfx": "pulse", "at": 39, "dt": -0.2, "vol": 0.5}, {"sfx": "ting", "at": 44, "dt": 0.2, "vol": 0.5}, {"sfx": "shing", "at": 44, "dt": 0.3, "vol": 0.35},
    ],
}
json.dump(S, open(base + r'\script_n18.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
