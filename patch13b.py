import re

base = r'C:\Users\awright\Desktop\Видео Клод'
s = open(base + r'\scripts\main13_part.jsx', encoding='utf-8').read()

R = [
    # счётчик и финал
    ("[T(21), T(23) + 6]", "[T(20), T(22) + 6]"),
    ("const endIn = interpolate(f, [T(45) - 6, T(45) + 10], [0, 1], clamp);", "const endIn = interpolate(f, [T(42) - 6, T(42) + 10], [0, 1], clamp);"),
    ("const tapAt = T(52), tap2At = T(54) + 6;", "const tapAt = T(46), tap2At = T(48) + 6;"),
    ("[T(46) + 14, tapAt - 2, tapAt + 8, tap2At - 4]", "[T(43) + 14, tapAt - 2, tapAt + 8, tap2At - 4]"),
    ("(f >= T(31) ? 1 : 0.15)", "(f >= T(30) ? 1 : 0.15)"),
    ("{f >= T(31) && (", "{f >= T(30) && ("),
    # S1
    ('size={170} at={T(9)}', 'size={170} at={T(8)}'),
    ('size={200} at={T(12)}', 'size={200} at={T(11)}'),
    ('at={T(15)} f={f} fps={fps} z={20}', 'at={T(14)} f={f} fps={fps} z={20}'),
    ('size={64} at={T(17)}', 'size={64} at={T(16)}'),
    # S2
    ('size={300} at={T(21)}', 'size={300} at={T(20)}'),
    ('size={105} at={T(26)}', 'size={105} at={T(25)}'),
    ('at={T(27)} f={f} fps={fps} z={12}', 'at={T(26)} f={f} fps={fps} z={12}'),
    ('notes={NOTES_A} at={T(28)} step={4}', 'notes={NOTES_A} at={T(27)} step={4}'),
    # S3
    ('<Tile text="ПОДВОХ?" cx={2100} cy={3330} rot={3} bg={BLK} color={YEL} size={210} at={T(33)}', '<Tile text="ТРАКТОВКА?" cx={2100} cy={3330} rot={3} bg={BLK} color={YEL} size={190} at={T(32)}'),
    ('notes={NOTES_A} at={T(36)} step={2}', 'notes={NOTES_A} at={T(34)} step={2}'),
    ('notes={NOTES_B} at={T(38)} step={2}', 'notes={NOTES_B} at={T(35)} step={2}'),
    ('size={190} at={T(40)} f={f} fps={fps} seed={19}', 'size={190} at={T(38)} f={f} fps={fps} seed={19}'),
    # финал
    ('<Tile text="ЧТО ЭТО?" cx={540} cy={560} rot={-3} bg={YEL} size={190} at={T(45)}', '<Tile text="ЧТО ЭТО?" cx={540} cy={560} rot={-3} bg={YEL} size={190} at={T(42)}'),
    ("{f >= T(45) - 6 && (", "{f >= T(42) - 6 && ("),
    ("const pr = spring({frame: f - (T(46) + i * 6)", "const pr = spring({frame: f - (T(43) + i * 6)"),
    ("['НАСТОЯЩАЯ ПЕСНЯ', 800, 0]", "['ПЕСНЯ ИЗ АДА', 800, 0]"),
]
for a, b in R:
    assert a in s, a[:50]
    s = s.replace(a, b)

# красная печать вместо плитки «НЕ ФАКТ»
i0 = s.index('<Tile text="НЕ ФАКТ"')
i1 = s.index('/>', i0) + 2
s = s[:i0] + '<RedInk text="НЕ ФАКТ" cx={2100} cy={3980} rot={-8} size={190} at={T(39)} f={f} fps={fps} />' + s[i1:]
comp = '''const RedInk = ({text, cx, cy, rot = -8, size = 170, at = 0, f, fps}) => {
  const p = spring({frame: f - at, fps, config: {damping: 7, stiffness: 230}});
  if (f < at) return null;
  const shake = f < at + 10 ? Math.sin(f * 4.5) * 10 * (1 - (f - at) / 10) : 0;
  return (
    <div style={{position: 'absolute', left: cx + shake, top: cy, zIndex: 85, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${interpolate(p, [0, 1], [3, 1])})`, opacity: Math.min(1, p * 1.8),
      padding: '0.04em 0.3em', border: `0.07em solid #C8191E`, borderRadius: 14, color: '#C8191E', background: 'rgba(246,240,226,0.94)', fontFamily: ANTON, fontSize: size, lineHeight: 1.1, letterSpacing: 4, whiteSpace: 'nowrap', boxShadow: '8px 14px 14px rgba(5,10,30,0.55)'}}>{text}</div>
  );
};

'''
j = s.index('const Cut = (')
s = s[:j] + comp + s[j:]
open(base + r'\scripts\main13_part.jsx', 'w', encoding='utf-8').write(s)

g = open(base + r'\scripts\gen_n13.py', encoding='utf-8').read()
# текст и подписи
a = g.index('caps = [')
b = g.index('CAM = [')
g = g[:a] + '''caps = [cap(0, 2), cap(3, 7), cap(8, 10), [["500", 11, 11], ["лет", 12, 12], ["назад,", 13, 13]], cap(14, 17), [["А", 18, 18], ["в", 19, 19], ["2014", 20, 22]], cap(23, 25), cap(26, 27), cap(28, 31),
        cap(32, 36), cap(37, 38), cap(39, 41), cap(42, 43), cap(44, 46), cap(47, 49)]

''' + g[b:]
a = g.index('CAM = [')
b = g.index('S = {')
g = g[:a] + '''CAM = [
    (0, 900, 790, 1.0, 0, None), (3, 900, 1050, 1.0, -1, 8), (8, 2100, 2020, 1.0, 2, 8), (11, 2150, 2120, 1.1, -1, 8), (18, 900, 2770, 1.0, -2, 8), (32, 2100, 3680, 1.0, 2, 8),
]

''' + g[b:]
a = g.index('"events": [')
b = g.index('    ],\n}')
g = g[:a] + '''"events": [
        {"sfx": "pulse", "at": 0, "dt": 0.0, "vol": 0.8}, {"sfx": "slap", "at": 0, "dt": 0.02, "vol": 0.7}, {"sfx": "slap", "at": 0, "dt": 0.3, "vol": 0.7}, {"sfx": "rip", "at": 3, "dt": -0.1, "vol": 0.6},
        {"sfx": "slap", "at": 4, "dt": 0.0, "vol": 0.7}, {"sfx": "rip", "at": 8, "dt": -0.15, "vol": 0.6}, {"sfx": "slap", "at": 8, "dt": 0.0, "vol": 0.6}, {"sfx": "slap", "at": 11, "dt": 0.0, "vol": 0.7},
        {"sfx": "slap", "at": 14, "dt": 0.0, "vol": 0.5}, {"sfx": "slap", "at": 16, "dt": 0.0, "vol": 0.5}, {"sfx": "rip", "at": 18, "dt": -0.15, "vol": 0.6}, {"sfx": "slap", "at": 20, "dt": 0.0, "vol": 0.6},
        {"sfx": "slap", "at": 25, "dt": 0.0, "vol": 0.6}, {"sfx": "ting", "at": 27, "dt": 0.0, "vol": 0.3}, {"sfx": "ting", "at": 27, "dt": 0.25, "vol": 0.3}, {"sfx": "ting", "at": 28, "dt": 0.2, "vol": 0.3},
        {"sfx": "shing", "at": 30, "dt": 0.0, "vol": 0.5}, {"sfx": "rip", "at": 32, "dt": -0.15, "vol": 0.6}, {"sfx": "ting", "at": 34, "dt": 0.0, "vol": 0.3}, {"sfx": "ting", "at": 35, "dt": 0.0, "vol": 0.3},
        {"sfx": "slap", "at": 38, "dt": 0.0, "vol": 0.8}, {"sfx": "inkstamp", "at": 39, "dt": 0.0, "vol": 1.0}, {"sfx": "pulse", "at": 42, "dt": 0.0, "vol": 0.5}, {"sfx": "ting", "at": 46, "dt": 0.0, "vol": 0.4},
        {"sfx": "ting", "at": 48, "dt": 0.1, "vol": 0.5}, {"sfx": "shing", "at": 48, "dt": 0.2, "vol": 0.4},
''' + g[b:]
g = g.replace('"dingAt": 54', '"dingAt": 49')
open(base + r'\scripts\gen_n13.py', 'w', encoding='utf-8').write(g)
print('ok')
