"""Сборка ролика: python scripts/make_video.py n2   (метка: v1 или n2)
1) пишет remotion/src/current.js (какой ролик рендерим), копирует script_<метка>.json и words в remotion/src;
2) рендерит картинку Remotion в build/<метка>/silent.mp4;
3) микширует звук (озвучка, музыка с ducking, swoosh/stamp/tick/ding как в mona_lisa_remotion_v3) в output/.
Озвучку не обрезаем и не ускоряем. Слова: build/<метка>/words.json (scripts/transcribe.py).
"""
import json
import os
import shutil
import subprocess
import sys

N = sys.argv[1]
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
J = lambda *p: os.path.join(root, *p)
S = json.load(open(J(f'script_{N}.json'), encoding='utf-8'))
W = json.load(open(J(f'build/{N}/words.json'), encoding='utf-8'))
shutil.copy(J(f'script_{N}.json'), J(f'remotion/src/script_{N}.json'))
shutil.copy(J(f'build/{N}/words.json'), J(f'remotion/src/words_{N}.json'))
open(J('remotion/src/current.js'), 'w', encoding='utf-8').write(
    "// Генерируется scripts/make_video.py: какой ролик сейчас рендерим\n"
    f"import script from './script_{N}.json';\nimport words from './words_{N}.json';\nexport {{script, words}};\n")
silent = J(f'build/{N}/silent.mp4')
subprocess.run(f'npx remotion render src/index.jsx Main "{silent}" --codec=h264 --crf=18',
               cwd=J('remotion'), shell=True, check=True)

t = lambda i: W[i]['start']
SR = 44100
fps = S['fps']
ev = []  # (звук, время, громкость, фильтр) - у каждого типа перехода свой звук, чтобы не повторялись
TR = {  # тип перехода -> [(звук, сдвиг сек, громкость, фильтр)]
    'band': [('swoosh', 0, 0.45, '')],
    'circle': [('swoosh', 0, 0.45, 'areverse')],
    'slices': [('swoosh', 0, 0.4, f'asetrate={SR}*1.35,aresample={SR}')],
    'flash': [('swoosh', 0, 0.5, 'highpass=f=1800'), ('ding', 0.05, 0.25, '')],
    'glitch': [('tick', 0, 0.4, ''), ('tick', 0.05, 0.35, ''), ('tick', 0.11, 0.4, '')],
    'diag': [('swoosh', 0, 0.5, f'asetrate={SR}*0.78,aresample={SR}')],
    'ink': [('stamp', 0.02, 0.4, ''), ('swoosh', 0, 0.3, 'lowpass=f=2500')],
    # стиль noir: свои звуки из assets/audio/sfx5
    'curtain': [('curtain', 0, 0.6, '')],
    'iris': [('shutter', 0, 0.6, ''), ('boom', 0.1, 0.35, f'asetrate={SR}*0.7,aresample={SR}')],
    'blinds': [('projector', -0.05, 0.5, '')],
    'burn': [('spot', 0, 0.55, 'highpass=f=1200'), ('boom', 0.05, 0.4, '')],
    'tear': [('quill', 0, 0.6, f'asetrate={SR}*1.5,aresample={SR}'), ('curtain', 0, 0.35, 'highpass=f=2500')],
    'zoom': [('curtain', 0, 0.55, f'areverse,asetrate={SR}*1.25,aresample={SR}'), ('boom', 0.15, 0.55, '')],
    'shatter': [('shutter', 0, 0.5, ''), ('shutter', 0.06, 0.45, ''), ('shutter', 0.13, 0.4, ''), ('quill', 0, 0.4, 'highpass=f=1800')],
    'spin': [('projector', 0, 0.55, f'asetrate={SR}*1.3,aresample={SR}'), ('curtain', 0.05, 0.3, 'lowpass=f=1500')],
    'scan': [('curtain', 0, 0.5, f'areverse,asetrate={SR}*1.4,aresample={SR}'), ('shutter', 0.1, 0.4, '')],
    # стиль aurora: мягкие эффекты из assets/audio/sfx8
    'sweep': [('whoosh', 0, 0.5, '')],
    'bloom': [('pulse', 0, 0.5, ''), ('ting', 0.05, 0.25, '')],
    'shutters': [('whoosh', 0, 0.45, f'asetrate={SR}*1.3,aresample={SR}')],
    'wipeUp': [('riser', -0.15, 0.35, '')],
    'lens': [('whoosh', 0, 0.45, 'areverse')],
    'glassSlide': [('ting', 0, 0.4, ''), ('whoosh', 0, 0.3, 'lowpass=f=2500')],
    'flare': [('shing', 0, 0.4, ''), ('whoosh', 0, 0.3, 'highpass=f=1500')],
    # переходы видео 9
    'tornPaper': [('quill', 0, 0.55, ''), ('whoosh', 0, 0.3, 'lowpass=f=1800')],
    'inkBloom': [('pulse', 0, 0.5, ''), ('whoosh', 0.02, 0.3, 'lowpass=f=1800')],
    'splitBars': [('gavel', 0, 0.35, 'lowpass=f=1500'), ('whoosh', 0, 0.3, '')],
    'stripes': [('whoosh', 0, 0.4, f'asetrate={SR}*1.5,aresample={SR}')],
    'confetti': [('ting', 0, 0.35, ''), ('shing', 0.05, 0.3, 'highpass=f=2000')],
    'ribbon': [('whoosh', 0, 0.45, 'areverse'), ('ting', 0.1, 0.2, '')],
    'pageFlip': [('quill', 0, 0.55, f'asetrate={SR}*0.85,aresample={SR}')],
    'dust': [('ting', 0, 0.35, f'asetrate={SR}*0.8,aresample={SR}'), ('riser', -0.1, 0.25, '')],
}
for sc in S['scenes'][1:]:
    for n, dt, vol, flt in TR[sc.get('trans', 'band')]:
        ev.append((n, t(sc['from']) - 0.1 + dt, vol, flt))
for sc in S['scenes']:
    if 'stamp' in sc:
        ev.append(('stamp', t(sc['stamp']['at']), 0.9, ''))
    if sc['type'] in ('synth', 'ended'):
        n = 74 if sc['type'] == 'synth' else 62
        ev.append(('stamp', t(sc['from']) + n / fps, 0.9, ''))
        for i in range(6):
            ev.append(('tick', t(sc['from']) + i * 0.15, 0.3, ''))
    if sc.get('counter'):
        for i in range(5):
            ev.append(('tick', t(sc['counter']['at']) + i * 0.12, 0.3, ''))
    if sc.get('timer'):
        for i in range(8):
            ev.append(('tick', t(sc['timer']['at']) + i * 0.18, 0.25, ''))
    if sc['type'] == 'heist':
        ev.append(('stamp', t(sc['from']) + 56 / fps, 0.9, ''))
    if sc['type'] == 'paper':
        for i in range(10):
            ev.append(('tick', t(sc['typeAt']) + i * 0.2, 0.2, ''))
for e in S.get('events', []):
    ev.append((e['sfx'], t(e['at']) + e.get('dt', 0), e.get('vol', 0.5), e.get('filter', '')))
ev.append(('ding', t(S.get('dingAt', S['scenes'][-1]['from'])) + 0.25, 0.8, ''))
dur = W[-1]['end'] + S['tail']
inputs = ['-i', J(S['voiceover']), '-i', J(S['music_file'])]
chains = ['[1:a]volume=2.5dB,apad,asplit=2[v][vs]',
          f'[2:a]volume={S["music_vol"]},atrim=0:{dur:.3f},afade=t=in:d=0.5,afade=t=out:st={dur-1:.3f}:d=1[m0]',
          f'[m0][vs]sidechaincompress=threshold=0.08:ratio={S.get("duck_ratio", 3)}:attack=20:release=350[m]']
labels = ['[v]', '[m]']
for k, (n, at, vol, flt) in enumerate(ev, 3):
    inputs += ['-i', J(S['sfx'][n])]
    ms = max(0, int(at * 1000))
    chains.append(f'[{k}:a]{flt + "," if flt else ""}volume={vol},adelay={ms}|{ms}[s{k}]')
    labels.append(f'[s{k}]')
chains.append(''.join(labels) + f'amix=inputs={len(labels)}:duration=first:normalize=0,atrim=0:{dur:.3f},alimiter=limit=0.89[a]')
out = J('output', S['output'])
os.makedirs(os.path.dirname(out), exist_ok=True)
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', silent, *inputs, '-filter_complex', ';'.join(chains),
                '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', out], check=True)
print(out)
