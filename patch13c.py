base = r'C:\Users\awright\Desktop\Видео Клод'
s = open(base + r'\scripts\main13_part.jsx', encoding='utf-8').read()

R = [
    ("[T(20), T(22) + 6]", "[T(21), T(23) + 6]"),
    ("const endIn = interpolate(f, [T(42) - 6, T(42) + 10], [0, 1], clamp);", "const endIn = interpolate(f, [T(45) - 6, T(45) + 10], [0, 1], clamp);"),
    ("const tapAt = T(46), tap2At = T(48) + 6;", "const tapAt = T(52), tap2At = T(54) + 6;"),
    ("[T(43) + 14, tapAt - 2, tapAt + 8, tap2At - 4]", "[T(46) + 14, tapAt - 2, tapAt + 8, tap2At - 4]"),
    ("(f >= T(30) ? 1 : 0.15)", "(f >= T(31) ? 1 : 0.15)"),
    ("{f >= T(30) && (", "{f >= T(31) && ("),
    ('size={170} at={T(8)}', 'size={170} at={T(9)}'),
    ('size={200} at={T(11)}', 'size={200} at={T(12)}'),
    ('at={T(14)} f={f} fps={fps} z={20}', 'at={T(15)} f={f} fps={fps} z={20}'),
    ('size={64} at={T(16)}', 'size={64} at={T(17)}'),
    ('size={300} at={T(20)}', 'size={300} at={T(21)}'),
    ('size={105} at={T(25)}', 'size={105} at={T(26)}'),
    ('at={T(26)} f={f} fps={fps} z={12}', 'at={T(27)} f={f} fps={fps} z={12}'),
    ('notes={NOTES_A} at={T(27)} step={4}', 'notes={NOTES_A} at={T(28)} step={4}'),
    ('<Tile text="ТРАКТОВКА?" cx={2100} cy={3330} rot={3} bg={BLK} color={YEL} size={190} at={T(32)}', '<Tile text="ПОДВОХ?" cx={2100} cy={3330} rot={3} bg={BLK} color={YEL} size={210} at={T(33)}'),
    ('notes={NOTES_A} at={T(34)} step={2}', 'notes={NOTES_A} at={T(36)} step={2}'),
    ('notes={NOTES_B} at={T(35)} step={2}', 'notes={NOTES_B} at={T(38)} step={2}'),
    ('size={190} at={T(38)} f={f} fps={fps} seed={19}', 'size={190} at={T(40)} f={f} fps={fps} seed={19}'),
    ('<Tile text="ЧТО ЭТО?" cx={540} cy={560} rot={-3} bg={YEL} size={190} at={T(42)}', '<Tile text="ЧТО ЭТО?" cx={540} cy={560} rot={-3} bg={YEL} size={190} at={T(45)}'),
    ("{f >= T(42) - 6 && (", "{f >= T(45) - 6 && ("),
    ("const pr = spring({frame: f - (T(43) + i * 6)", "const pr = spring({frame: f - (T(46) + i * 6)"),
    ("['ПЕСНЯ ИЗ АДА', 800, 0]", "['НАСТОЯЩАЯ ПЕСНЯ', 800, 0]"),
    ('at={T(39)} f={f} fps={fps} />', 'at={T(43)} f={f} fps={fps} />'),
]
for a, b in R:
    assert a in s, a[:60]
    s = s.replace(a, b)
open(base + r'\scripts\main13_part.jsx', 'w', encoding='utf-8').write(s)

g = open(base + r'\scripts\gen_n13.py', encoding='utf-8').read()
a = g.index('caps = [')
b = g.index('CAM = [')
g = g[:a] + '''caps = [cap(0, 2), cap(3, 7), cap(8, 11), [["500", 12, 12], ["лет", 13, 13], ["назад,", 14, 14]], cap(15, 18), [["А", 19, 19], ["в", 20, 20], ["2014", 21, 23]], cap(24, 26), cap(27, 28), cap(29, 32),
        cap(33, 35), cap(36, 39), cap(40, 41), cap(42, 44), cap(45, 46), cap(47, 51), cap(52, 54)]

''' + g[b:]
a = g.index('CAM = [')
b = g.index('S = {')
g = g[:a] + '''CAM = [
    (0, 900, 790, 1.0, 0, None), (3, 900, 1050, 1.0, -1, 10), (8, 2100, 2020, 1.0, 2, 10), (12, 2150, 2120, 1.1, -1, 10), (19, 900, 2770, 1.0, -2, 10), (33, 2100, 3680, 1.0, 2, 10),
]

''' + g[b:]
a = g.index('"events": [')
b = g.index('    ],\n}')
g = g[:a] + '''"events": [
        {"sfx": "pulse", "at": 0, "dt": 0.0, "vol": 0.8}, {"sfx": "slap", "at": 0, "dt": 0.02, "vol": 0.7}, {"sfx": "slap", "at": 0, "dt": 0.3, "vol": 0.7}, {"sfx": "rip", "at": 3, "dt": -0.1, "vol": 0.6},
        {"sfx": "slap", "at": 4, "dt": 0.0, "vol": 0.7}, {"sfx": "rip", "at": 8, "dt": -0.15, "vol": 0.6}, {"sfx": "slap", "at": 9, "dt": 0.0, "vol": 0.6}, {"sfx": "slap", "at": 12, "dt": 0.0, "vol": 0.7},
        {"sfx": "slap", "at": 15, "dt": 0.0, "vol": 0.5}, {"sfx": "slap", "at": 17, "dt": 0.0, "vol": 0.5}, {"sfx": "rip", "at": 19, "dt": -0.15, "vol": 0.6}, {"sfx": "slap", "at": 21, "dt": 0.0, "vol": 0.6},
        {"sfx": "slap", "at": 26, "dt": 0.0, "vol": 0.6}, {"sfx": "ting", "at": 28, "dt": 0.0, "vol": 0.3}, {"sfx": "ting", "at": 28, "dt": 0.25, "vol": 0.3}, {"sfx": "ting", "at": 29, "dt": 0.2, "vol": 0.3},
        {"sfx": "shing", "at": 31, "dt": 0.0, "vol": 0.5}, {"sfx": "rip", "at": 33, "dt": -0.15, "vol": 0.6}, {"sfx": "ting", "at": 36, "dt": 0.0, "vol": 0.3}, {"sfx": "ting", "at": 38, "dt": 0.0, "vol": 0.3},
        {"sfx": "slap", "at": 40, "dt": 0.0, "vol": 0.8}, {"sfx": "inkstamp", "at": 43, "dt": 0.0, "vol": 1.0}, {"sfx": "pulse", "at": 45, "dt": 0.0, "vol": 0.5}, {"sfx": "ting", "at": 52, "dt": 0.0, "vol": 0.4},
        {"sfx": "ting", "at": 54, "dt": 0.1, "vol": 0.5}, {"sfx": "shing", "at": 54, "dt": 0.2, "vol": 0.4},
''' + g[b:]
g = g.replace('"dingAt": 49', '"dingAt": 54').replace('"music_vol": 0.5', '"music_vol": 1.0, "duck_ratio": 1.6')
open(base + r'\scripts\gen_n13.py', 'w', encoding='utf-8').write(g)
print('ok')
