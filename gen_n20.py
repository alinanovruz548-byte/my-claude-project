"""Видео 20 «Золотая Адель» (Климт, метка n20, стиль board20): собака-судья, рамка, богач; переходы: косой вайп, плитки Климта, жалюзи, переворот, круг."""
import json

base = r'C:\Users\awright\Desktop\Видео Клод'

b17 = open(base + r'\remotion\src\Board17.jsx', encoding='utf-8').read()
head = b17[:b17.index('// наклейка')].replace("staticFile('n17/img/' + n)", "staticFile('n20/img/' + n)")
ka = head.index('const KEYS = [')
kb = head.index('];', ka) + 2
keys = '''const KEYS = [
  {t: 0.0, x: 540, y: 2250, s: 1.0, pose: 'frame', look: 1},
  {t: 0.6, x: 540, y: 1800, s: 1.0, pose: 'frame', look: 1},
  {t: 2.0, x: 540, y: 1800, s: 1.0, pose: 'frame', look: 1},
  {t: 2.3, x: 540, y: 1800, s: 1.2, pose: 'judge', look: 1},
  {t: 2.9, x: 540, y: 1800, s: 1.2, pose: 'judge', look: 1},
  {t: 3.6, ...SIDE_R, pose: 'frame', look: -1},
  {t: 6.0, ...SIDE_R, pose: 'frame', look: -1},
  {t: 6.7, ...SIDE_L, pose: 'scared', look: 1},
  {t: 9.0, ...SIDE_L, pose: 'scared', look: 1},
  {t: 9.7, ...SIDE_R, pose: 'open', look: -1},
  {t: 11.6, ...SIDE_R, pose: 'open', look: -1},
  {t: 12.3, ...SIDE_L, pose: 'judge', look: 1},
  {t: 16.0, ...SIDE_L, pose: 'judge', look: 1},
  {t: 16.8, ...SIDE_R, pose: 'jump', look: -1},
  {t: 17.7, ...SIDE_R, pose: 'jump', look: -1},
  {t: 18.4, ...SIDE_R, pose: 'rich', look: -1},
  {t: 22.2, ...SIDE_R, pose: 'rich', look: -1},
  {t: 23.0, x: 540, y: 1790, s: 1.0, pose: 'judge', look: 1},
  {t: 40, x: 540, y: 1790, s: 1.0, pose: 'judge', look: 1},
];'''
head = head[:ka] + keys + head[kb:]
main = open(base + r'\scripts\main20_main.jsx', encoding='utf-8').read()
open(base + r'\remotion\src\Board20.jsx', 'w', encoding='utf-8').write(head + main)

p = base + r'\remotion\src\Main.jsx'
m = open(p, encoding='utf-8').read()
if 'Board20Main' not in m:
    m = m.replace("import {Board19Main} from './Board19';", "import {Board19Main} from './Board19';\nimport {Board20Main} from './Board20';", 1)
    m = m.replace("script.style === 'board19' ? Board19Main :", "script.style === 'board19' ? Board19Main : script.style === 'board20' ? Board20Main :", 1)
    open(p, 'w', encoding='utf-8').write(m)

W = open(base + r'\build\n20\text.txt', encoding='utf-8').read().strip()
ws = W.split()
assert len(ws) == 68


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


rng = [(0, 2), (3, 6), (7, 10), (11, 14), (15, 19), (20, 22), (23, 26), (27, 29), (30, 33), (34, 38), (39, 41), (42, 45), (46, 48), (49, 51), (52, 54), (55, 60), (61, 62), (63, 67)]
caps = [cap(a, b) for a, b in rng]


def ev(sfx, at, dt=0.0, vol=0.5):
    return {"sfx": sfx, "at": at, "dt": dt, "vol": vol}


S = {
    "title": "Золотая Адель", "style": "board20", "week": 3, "number": 20, "rubric": "А · Скандалы и тайны",
    "width": 1080, "height": 1920, "fps": 30, "output": "golden_adele_n20.mp4",
    "voiceover": "assets/audio/voiceover_n20.mp3", "voiceover_text": W, "tail": 0.9,
    "music_file": "assets/audio/music_n20.mp3", "music_vol": 0.7, "duck_ratio": 1.8,
    "sources": [
        "Густав Климт, «Портрет Адели Блох-Бауэр I», 1907, Neue Galerie, Нью-Йорк (Public domain, Commons: Gustav Klimt, 1907, Adele Bloch-Bauer I, Neue Galerie New York.jpg)",
        "Нацисты забрали картину у семьи Блох-Бауэр после аншлюса 1938; Мария Альтман (племянница Адели) подала иск против Австрии (дело дошло до Верховного суда США), арбитраж в Австрии в январе 2006 постановил вернуть пять картин наследникам; в июне 2006 Рональд Лаудер купил картину для Neue Galerie, сумма около 135 млн долларов по сообщениям прессы (официально не подтверждена); источники: The Art Newspaper (2006), Wikipedia, Al Jazeera. Формулировка «Австрия отдала после суда» упрощённая: решение принял арбитражный суд.",
        "Фото Марии Альтман (Maria Viktoria Bloch-Bauer, 1935): Commons, Public domain (Maria Viktoria Bloch-Bauer nel 1935 (cropped).jpg)",
        "Собака Шиба: позы (рамка, судья, богач) сгенерированы нейросетью (Magnific), вырезаны; ролик без видео-клипов",
    ],
    "images": {
        "gold": {"file": "n20/img/gold.jpg", "size": [2036, 2035], "license": "Public domain (Commons)"},
        "dog": {"file": "n20/img/p_{frame,judge,rich}.png", "size": [575, 890], "license": "ИЛЛЮСТРАЦИИ нейросети (Magnific), персонаж Шиба"},
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО №20 · ЗОЛОТАЯ АДЕЛЬ", "nodes": []},
    "scenes": [{"id": 1, "type": "board", "from": 0}],
    "cam": [],
    "dingAt": 67,
    "sfx": {"whoosh": "assets/audio/sfx8/t_whoosh.mp3", "ting": "assets/audio/sfx8/t_ting.mp3", "pulse": "assets/audio/sfx8/t_pulse.mp3", "shing": "assets/audio/sfx8/t_shing.mp3",
            "ding": "assets/audio/sfx8/t_ting.mp3", "thud": "assets/audio/sfx15/t_thud.mp3", "tick": "assets/audio/sfx_tick.mp3", "stamp": "assets/audio/sfx10/t_stamp.mp3", "swoosh": "assets/audio/sfx8/t_whoosh.mp3",
            "slap": "assets/audio/sfx13/t_slap.mp3", "brush": "assets/audio/sfx12/t_brush.mp3"},
    "events": [
        ev("pulse", 0, 0.0, 0.5), ev("ting", 2, 0.1, 0.3), ev("thud", 6, 0.05, 0.7), ev("shing", 6, 0.1, 0.4),
        ev("whoosh", 7, -0.35, 0.55), ev("ting", 10, 0.0, 0.3),
        ev("shing", 15, -0.55, 0.5), ev("stamp", 21, 0.2, 0.7),
        ev("whoosh", 23, -0.3, 0.55), ev("tick", 26, 0.0, 0.3),
        ev("whoosh", 30, -0.6, 0.5), ev("slap", 34, 0.0, 0.4), ev("stamp", 41, 0.0, 0.7),
        ev("whoosh", 42, -0.4, 0.5), ev("ting", 46, 0.0, 0.3), ev("ting", 49, 0.0, 0.3),
        ev("tick", 56, 0.0, 0.35), ev("tick", 57, 0.0, 0.35), ev("tick", 58, 0.0, 0.35), ev("ting", 59, 0.1, 0.5),
        ev("whoosh", 61, -0.3, 0.5), ev("ting", 67, 0.2, 0.5),
    ],
}
json.dump(S, open(base + r'\script_n20.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
