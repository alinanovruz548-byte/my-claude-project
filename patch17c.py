import re

base = r'C:\Users\awright\Desktop\Видео Клод'
p = base + r'\remotion\src\Board17.jsx'
s = open(p, encoding='utf-8').read()
a = s.index('export const Board17Main')
s = s[:a] + open(base + r'\scripts\main17_main.jsx', encoding='utf-8').read()

# новое расписание собаки
ka = s.index('const KEYS = [')
kb = s.index('];', ka) + 2
keys = '''const KEYS = [
  {t: 3.2, x: 1500, y: 1760, s: 2.6, pose: 'swipe', look: 1, big: true},
  {t: 3.95, x: -480, y: 1760, s: 2.6, pose: 'swipe', look: 1, big: true},
  {t: 4.0, x: 1250, y: 1895, s: 0.72, pose: 'wave', look: 1},
  {t: 4.6, ...SIDE_R, pose: 'wave', look: 1},
  {t: 6.0, ...SIDE_R, pose: 'open', look: -1},
  {t: 7.4, ...SIDE_R, pose: 'open', look: -1},
  {t: 8.2, ...SIDE_L, pose: 'jump', look: 1},
  {t: 9.1, ...SIDE_L, pose: 'open', look: 1},
  {t: 10.9, ...SIDE_L, pose: 'open', look: 1},
  {t: 11.6, x: 890, y: 1795, s: 0.9, pose: 'scared', look: -1},
  {t: 13.3, x: 890, y: 1795, s: 0.9, pose: 'scared', look: -1},
  {t: 13.4, x: 1500, y: 1760, s: 2.6, pose: 'swipe', look: 1, big: true},
  {t: 14.15, x: -480, y: 1760, s: 2.6, pose: 'swipe', look: 1, big: true},
  {t: 14.2, x: 1250, y: 1895, s: 0.72, pose: 'laugh', look: 1},
  {t: 14.8, ...SIDE_R, pose: 'laugh', look: 1},
  {t: 16.4, ...SIDE_R, pose: 'wave', look: -1},
  {t: 17.2, ...SIDE_L, pose: 'jump', look: 1},
  {t: 18.1, ...SIDE_L, pose: 'wash', look: 1},
  {t: 19.8, ...SIDE_L, pose: 'wash', look: 1},
  {t: 20.6, x: 540, y: 1800, s: 1.05, pose: 'wave', look: 1},
  {t: 21.5, x: 540, y: 1800, s: 1.05, pose: 'wave', look: 1},
  {t: 22.0, x: 540, y: 1790, s: 1.12, pose: 'laugh', look: 1},
  {t: 23.0, x: 540, y: 1790, s: 1.12, pose: 'laugh', look: 1},
  {t: 40, x: 540, y: 1790, s: 1.12, pose: 'laugh', look: 1},
];'''
s = s[:ka] + keys + s[kb:]
# сцена Прадо: собака в центре выше фона (z выше)
open(p, 'w', encoding='utf-8').write(s)

g = open(base + r'\scripts\gen_n17.py', encoding='utf-8').read()
ev = re.search(r'"events": \[.*?\n    \],\n\}', g, flags=re.S)
new = '''"events": [
        {"sfx": "brush", "at": 0, "dt": 0.1, "vol": 0.55}, {"sfx": "brush", "at": 1, "dt": -0.35, "vol": 0.5}, {"sfx": "whoosh", "at": 1, "dt": 0.1, "vol": 0.6}, {"sfx": "thud", "at": 2, "dt": 0.0, "vol": 1.0}, {"sfx": "pulse", "at": 2, "dt": 0.0, "vol": 0.6},
        {"sfx": "whoosh", "at": 3, "dt": -0.5, "vol": 0.6}, {"sfx": "whoosh", "at": 3, "dt": -0.35, "vol": 0.35}, {"sfx": "whoosh", "at": 5, "dt": -0.05, "vol": 0.4}, {"sfx": "ting", "at": 12, "dt": 0.0, "vol": 0.3},
        {"sfx": "whoosh", "at": 8, "dt": -0.1, "vol": 0.4}, {"sfx": "thud", "at": 26, "dt": 0.0, "vol": 0.8}, {"sfx": "thud", "at": 27, "dt": 0.1, "vol": 0.8}, {"sfx": "thud", "at": 29, "dt": 0.0, "vol": 1.0}, {"sfx": "pulse", "at": 29, "dt": 0.0, "vol": 0.5},
        {"sfx": "whoosh", "at": 33, "dt": -0.7, "vol": 0.6}, {"sfx": "whoosh", "at": 33, "dt": -0.55, "vol": 0.35}, {"sfx": "ting", "at": 38, "dt": 0.0, "vol": 0.35}, {"sfx": "whoosh", "at": 42, "dt": 0.0, "vol": 0.4}, {"sfx": "whoosh", "at": 53, "dt": -0.3, "vol": 0.5},
        {"sfx": "ting", "at": 53, "dt": 0.1, "vol": 0.4}, {"sfx": "pulse", "at": 57, "dt": 0.0, "vol": 0.4}, {"sfx": "ting", "at": 62, "dt": 0.2, "vol": 0.5}, {"sfx": "shing", "at": 62, "dt": 0.3, "vol": 0.35},
    ],
}'''
g = g[:ev.start()] + new + g[ev.end():]
g = g.replace('"Картины: «Ведьмин шабаш»', '"Фото «Дома глухого» ок. 1900 (Public domain, Commons: Quinta del Sordo 1900.jpg); Прадо: статуя Веласкеса у входа (CC0, Commons: El pintor Velazquez preside la puerta principal.jpg); автопортрет Гойи 1815 (Public domain). Картины: «Ведьмин шабаш»')
g = g.replace('"dog": {"file": "n17/img/p_*.png, n17/vid/paint.mp4"', '"extra": {"file": "n17/img/{house,prado,selfp,saturn}.jpg", "size": [0, 0], "license": "Public domain / CC0 (Wikimedia Commons)"},\n        "dog": {"file": "n17/img/p_*.png (в т.ч. p_scared, p_paint)"')
open(base + r'\scripts\gen_n17.py', 'w', encoding='utf-8').write(g)
print('ok')
