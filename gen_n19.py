"""Видео 19 «Звёздная ночь» (Ван Гог, метка n19, стиль board19): без смаха лапой, круговые «лунные порталы», новые позы собаки."""
import json

base = r'C:\Users\awright\Desktop\Видео Клод'

b17 = open(base + r'\remotion\src\Board17.jsx', encoding='utf-8').read()
head = b17[:b17.index('// наклейка')].replace("staticFile('n17/img/' + n)", "staticFile('n19/img/' + n)")
ka = head.index('const KEYS = [')
kb = head.index('];', ka) + 2
keys = '''const KEYS = [
  {t: 3.3, x: 540, y: 2150, s: 1.0, pose: 'palette', look: 1},
  {t: 3.9, x: 540, y: 1790, s: 1.0, pose: 'palette', look: 1},
  {t: 4.6, ...SIDE_R, pose: 'scope', look: 1},
  {t: 7.8, ...SIDE_R, pose: 'scope', look: 1},
  {t: 8.5, ...SIDE_L, pose: 'scope', look: -1},
  {t: 10.2, ...SIDE_L, pose: 'scope', look: -1},
  {t: 10.8, ...SIDE_R, pose: 'palette', look: -1},
  {t: 12.0, ...SIDE_R, pose: 'palette', look: -1},
  {t: 12.6, ...SIDE_L, pose: 'sleep', look: 1},
  {t: 15.0, ...SIDE_L, pose: 'sleep', look: 1},
  {t: 15.6, ...SIDE_R, pose: 'sleep', look: -1},
  {t: 17.8, ...SIDE_R, pose: 'sleep', look: -1},
  {t: 18.6, x: 540, y: 1790, s: 1.1, pose: 'moon', look: 1},
  {t: 40, x: 540, y: 1790, s: 1.1, pose: 'moon', look: 1},
];'''
head = head[:ka] + keys + head[kb:]
main = open(base + r'\scripts\main19_main.jsx', encoding='utf-8').read()
open(base + r'\remotion\src\Board19.jsx', 'w', encoding='utf-8').write(head + main)

p = base + r'\remotion\src\Main.jsx'
m = open(p, encoding='utf-8').read()
if 'Board19Main' not in m:
    m = m.replace("import {Board18Main} from './Board18';", "import {Board18Main} from './Board18';\nimport {Board19Main} from './Board19';", 1)
    m = m.replace("script.style === 'board18' ? Board18Main :", "script.style === 'board18' ? Board18Main : script.style === 'board19' ? Board19Main :", 1)
    open(p, 'w', encoding='utf-8').write(m)

W = open(base + r'\build\n19\text.txt', encoding='utf-8').read().strip()
ws = W.split()


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


caps = [cap(0, 2), cap(3, 6), [["Июнь", 7, 7], ["1889", 8, 11]], cap(12, 14), cap(15, 21), cap(22, 25), cap(26, 30), cap(31, 34), cap(35, 38), cap(39, 42), cap(43, 44), cap(45, 48)]

S = {
    "title": "Звёздная ночь, написанная днём", "style": "board19", "week": 3, "number": 19, "rubric": "Г · Художник и его время",
    "width": 1080, "height": 1920, "fps": 30, "output": "starry_night_n19.mp4",
    "voiceover": "assets/audio/voiceover_n19.mp3", "voiceover_text": W, "tail": 0.9,
    "music_file": "assets/audio/music_n19.mp3", "music_vol": 0.7, "duck_ratio": 1.8,
    "sources": [
        "Винсент Ван Гог, «Звёздная ночь» (The Starry Night), июнь 1889, MoMA, Нью-Йорк (Public domain, Commons: Vincent van Gogh - Starry Night - Google Art Project.jpg); вид из окна восточной комнаты больницы Сен-Поль-де-Мозоль в Сен-Реми-де-Прованс перед рассветом, картина писана днём (источники: Wikipedia, Britannica)",
        "ВАЖНО: источники расходятся, насколько картина «по памяти» и реальна ли деревня: по одной версии деревня воображаемая, напоминающая нидерландские деревни детства, по другой основана на этюде; в озвучке «по одной из версий, вспомнил из детства». Ван Гог считал картину неудачной (Britannica). Утверждение про «одну проданную картину» не подтверждено в найденных источниках и не использовано",
        "Собака Шиба: позы (луна, телескоп, ночной колпак, палитра) сгенерированы нейросетью (Magnific), вырезаны; ролик без видео-клипов",
    ],
    "images": {
        "starry": {"file": "n19/img/starry.jpg", "size": [2400, 1854], "license": "Public domain (Commons)"},
        "dog": {"file": "n19/img/p_{moon,scope,sleep,palette}.png", "size": [575, 890], "license": "ИЛЛЮСТРАЦИИ нейросети (Magnific), персонаж Шиба"},
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО №19 · ЗВЁЗДНАЯ НОЧЬ", "nodes": []},
    "scenes": [{"id": 1, "type": "board", "from": 0}],
    "cam": [],
    "dingAt": 48,
    "sfx": {"whoosh": "assets/audio/sfx8/t_whoosh.mp3", "ting": "assets/audio/sfx8/t_ting.mp3", "pulse": "assets/audio/sfx8/t_pulse.mp3", "shing": "assets/audio/sfx8/t_shing.mp3",
            "ding": "assets/audio/sfx8/t_ting.mp3", "thud": "assets/audio/sfx15/t_thud.mp3", "tick": "assets/audio/sfx_tick.mp3", "stamp": "assets/audio/sfx10/t_stamp.mp3", "swoosh": "assets/audio/sfx8/t_whoosh.mp3",
            "slap": "assets/audio/sfx13/t_slap.mp3", "brush": "assets/audio/sfx12/t_brush.mp3"},
    "events": [
        {"sfx": "pulse", "at": 0, "dt": 0.0, "vol": 0.5}, {"sfx": "ting", "at": 1, "dt": 0.0, "vol": 0.3}, {"sfx": "whoosh", "at": 6, "dt": -0.3, "vol": 0.55}, {"sfx": "shing", "at": 6, "dt": 0.0, "vol": 0.5},
        {"sfx": "whoosh", "at": 7, "dt": -0.4, "vol": 0.5}, {"sfx": "ting", "at": 8, "dt": 0.0, "vol": 0.3}, {"sfx": "whoosh", "at": 12, "dt": -0.4, "vol": 0.5}, {"sfx": "ting", "at": 15, "dt": 0.0, "vol": 0.3},
        {"sfx": "whoosh", "at": 22, "dt": -0.3, "vol": 0.5}, {"sfx": "brush", "at": 24, "dt": 0.0, "vol": 0.4}, {"sfx": "whoosh", "at": 26, "dt": -0.4, "vol": 0.5}, {"sfx": "ting", "at": 28, "dt": 0.0, "vol": 0.3},
        {"sfx": "whoosh", "at": 35, "dt": -0.4, "vol": 0.5}, {"sfx": "thud", "at": 42, "dt": -0.1, "vol": 0.6}, {"sfx": "whoosh", "at": 43, "dt": -0.3, "vol": 0.4}, {"sfx": "ting", "at": 48, "dt": 0.2, "vol": 0.5},
        {"sfx": "shing", "at": 48, "dt": 0.3, "vol": 0.35},
    ],
}
json.dump(S, open(base + r'\script_n19.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
