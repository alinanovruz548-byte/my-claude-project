"""Видео 9, вариант 2 (метка n9b): «доска дела», камера ездит по одной большой сцене. Озвучка, музыка и субтитры те же, что в n9."""
import json
import shutil
import os

base = r'C:\Users\awright\Desktop\Видео Клод'
os.makedirs(base + r'\build\n9b', exist_ok=True)
shutil.copy(base + r'\build\n9\words.json', base + r'\build\n9b\words.json')

# Main.jsx: стиль board
p = base + r'\remotion\src\Main.jsx'
s = open(p, encoding='utf-8').read()
if 'BoardMain' not in s:
    s = s.replace("import {AuroraMain} from './Aurora';", "import {AuroraMain} from './Aurora';\nimport {BoardMain} from './Board';", 1)
    s = s.replace("script.style === 'aurora' ? AuroraMain : ClassicMain;", "script.style === 'aurora' ? AuroraMain : script.style === 'board' ? BoardMain : ClassicMain;", 1)
    open(p, 'w', encoding='utf-8').write(s)

# make_video.py: финальный «динь» по слову dingAt
p = base + r'\scripts\make_video.py'
s = open(p, encoding='utf-8').read()
a = "ev.append(('ding', t(S['scenes'][-1]['from']) + 0.25, 0.8, ''))"
if a in s and 'dingAt' not in s:
    s = s.replace(a, "ev.append(('ding', t(S.get('dingAt', S['scenes'][-1]['from'])) + 0.25, 0.8, ''))", 1)
    open(p, 'w', encoding='utf-8').write(s)

S = json.load(open(base + r'\script_n9.json', encoding='utf-8'))
S['style'] = 'board'
S['title'] = 'Юдифь Артемизии (дело)'
S['output'] = 'artemisia_n9b.mp4'
S['diagram'] = {'title': 'ДЕЛО №9 · ДЖЕНТИЛЕСКИ', 'nodes': []}
S['scenes'] = [{'id': 1, 'type': 'board', 'from': 0}]
S.pop('bg', None)
# ключи камеры: слово прихода, центр в мире, масштаб, наклон
S['cam'] = [
    {'w': 0, 'x': 1500, 'y': 1350, 'z': 0.55, 'r': 0},
    {'w': 2, 'x': 1500, 'y': 850, 'z': 1.2, 'r': -2},
    {'w': 4, 'x': 800, 'y': 1300, 'z': 1.25, 'r': 2},
    {'w': 7, 'x': 1150, 'y': 1130, 'z': 0.95, 'r': 0},
    {'w': 8, 'x': 2250, 'y': 1130, 'z': 1.3, 'r': -2},
    {'w': 16, 'x': 800, 'y': 1450, 'z': 1.3, 'r': 2},
    {'w': 18, 'x': 1500, 'y': 1650, 'z': 0.62, 'r': 0},
    {'w': 21, 'x': 2300, 'y': 2020, 'z': 1.4, 'r': 3},
    {'w': 24, 'x': 1400, 'y': 2380, 'z': 0.95, 'r': -2},
    {'w': 26, 'x': 1400, 'y': 2530, 'z': 2.3, 'r': 1},
    {'w': 29, 'x': 1400, 'y': 2720, 'z': 1.8, 'r': 0},
    {'w': 35, 'x': 1500, 'y': 3050, 'z': 0.62, 'r': 0},
    {'w': 39, 'x': 1700, 'y': 3300, 'z': 1.8, 'r': 2},
    {'w': 41, 'x': 1500, 'y': 3560, 'z': 0.85, 'r': -2},
    {'w': 44, 'x': 1500, 'y': 4000, 'z': 1.0, 'r': 1},
    {'w': 48, 'x': 2450, 'y': 3780, 'z': 1.25, 'r': 2},
    {'w': 58, 'x': 1500, 'y': 2350, 'z': 0.38, 'r': 0},
]
S['dingAt'] = 58
ev = [e for e in S['events'] if e['sfx'] != 'quill' or True]
fps = 30
words = json.load(open(base + r'\build\n9\words.json', encoding='utf-8'))
for i in range(1, len(S['cam'])):
    w = S['cam'][i]['w']
    S['events'].append({'sfx': 'whoosh', 'at': w, 'dt': -0.8, 'vol': 0.3})
json.dump(S, open(base + r'\script_n9b.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
