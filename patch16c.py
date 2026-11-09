import re

base = r'C:\Users\awright\Desktop\Видео Клод'
p = base + r'\remotion\src\Board16b.jsx'
s = open(p, encoding='utf-8').read()
a = s.index('export const Board16bMain')
s = s[:a] + open(base + r'\scripts\main16b_main.jsx', encoding='utf-8').read()
R = [
    ("left: 80, top: 1290, width: 570, height: 340,", "left: 80, top: 1255, width: 570, height: 330,"),
    ("transform: `translate(${(1 - enter.p) * enter.dx}px, ${(1 - enter.p) * enter.dy}px) scale(${enter.s})`, transformOrigin: enter.origin, opacity: enter.o, zIndex: 20}}>",
     "transform: `scale(${enter.s})`, transformOrigin: enter.origin, opacity: enter.o, clipPath: enter.clip, zIndex: 20}}>"),
]
for x, y in R:
    assert x in s, x[:50]
    s = s.replace(x, y)
open(p, 'w', encoding='utf-8').write(s)

g = open(base + r'\scripts\gen_n16b.py', encoding='utf-8').read()
ev = re.search(r'"events": \[.*?\n    \],\n\}', g, flags=re.S)
new = '''"events": [
        {"sfx": "pulse", "at": 0, "dt": 0.0, "vol": 0.5}, {"sfx": "whoosh", "at": 3, "dt": 0.2, "vol": 0.55}, {"sfx": "whoosh", "at": 3, "dt": 0.35, "vol": 0.35}, {"sfx": "whoosh", "at": 12, "dt": -0.5, "vol": 0.22},
        {"sfx": "whoosh", "at": 13, "dt": -0.4, "vol": 0.2}, {"sfx": "whoosh", "at": 14, "dt": -0.4, "vol": 0.2}, {"sfx": "whoosh", "at": 16, "dt": -0.4, "vol": 0.22}, {"sfx": "whoosh", "at": 23, "dt": -0.6, "vol": 0.3},
        {"sfx": "ting", "at": 27, "dt": 0.0, "vol": 0.3}, {"sfx": "ting", "at": 31, "dt": 0.0, "vol": 0.3}, {"sfx": "whoosh", "at": 32, "dt": -0.3, "vol": 0.3}, {"sfx": "thud", "at": 39, "dt": -0.08, "vol": 0.9},
        {"sfx": "shing", "at": 39, "dt": 0.15, "vol": 0.45}, {"sfx": "whoosh", "at": 40, "dt": -0.1, "vol": 0.3}, {"sfx": "pulse", "at": 43, "dt": 0.0, "vol": 0.4}, {"sfx": "whoosh", "at": 48, "dt": -0.1, "vol": 0.3},
        {"sfx": "ting", "at": 52, "dt": 0.0, "vol": 0.35}, {"sfx": "ting", "at": 55, "dt": 0.2, "vol": 0.5}, {"sfx": "shing", "at": 55, "dt": 0.3, "vol": 0.35},
    ],
}'''
g = g[:ev.start()] + new + g[ev.end():]
open(base + r'\scripts\gen_n16b.py', 'w', encoding='utf-8').write(g)
print('ok')
