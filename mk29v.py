"""Видео 29, вариант 2 (n29v2, style board29v): сквозные клипы Kling с собакой, без светлого фона."""
import re
base = r'C:\Users\awright\Desktop\Видео Клод'
m27 = open(base + r'\scripts\main27_main.jsx', encoding='utf-8').read()
helpers = m27[:m27.index('export const Board27Main')]
helpers = helpers.replace('const CAM_STARTS = [2.7, 4.7, 8.4, 14.3, 17.9, 21.7];', 'const CAM_STARTS = [2.4, 5.0, 10.3, 13.8, 22.55, 24.3];')
part = open(base + r'\scripts\main29v_part.jsx', encoding='utf-8').read()
open(base + r'\scripts\main29v_main.jsx', 'w', encoding='utf-8').write(helpers + part)

g = open(base + r'\scripts\gen_n29.py', encoding='utf-8').read()
g = g.replace('voiceover_n29.mp3', 'voiceover_n29v2.mp3')
g = g.replace('main29_main.jsx', 'main29v_main.jsx').replace('Board29', 'Board29v').replace('board29', 'board29v')
g = g.replace('script_n29.json', 'script_n29v2.json').replace('frida_mirror_n29.mp4', 'frida_mirror_n29_v2.mp4')
g = g.replace("n29/img/' + n", "n29v2/img/' + n").replace('staticFile(\'n29/img/\'', "staticFile('n29v2/img/'")
g = g.replace('"file": "n29/img/', '"file": "n29v2/img/')
g = g.replace('Зеркало над кроватью"', 'Зеркало над кроватью (вариант 2)"', 1)
# собака только в коллаже и финале
a = g.index("keys = '''")
b = g.index("'''", a + 10) + 3
KEYS = """keys = '''const KEYS = [
  {t: 0.0, x: 540, y: 3000, s: 1.0, pose: 'laugh', look: 1},
  {t: 22.2, x: 540, y: 3000, s: 1.0, pose: 'laugh', look: 1},
  {t: 22.7, x: 890, y: 1830, s: 0.6, pose: 'laugh', look: -1},
  {t: 24.6, x: 890, y: 1830, s: 0.6, pose: 'laugh', look: -1},
  {t: 25.1, x: 540, y: 1790, s: 0.85, pose: 'open', look: 1},
  {t: 40, x: 540, y: 1790, s: 0.85, pose: 'open', look: 1},
];'''"""
g = g[:a] + KEYS + g[b:]
open(base + r'\scripts\gen_n29v.py', 'w', encoding='utf-8').write(g)
print('ok')
