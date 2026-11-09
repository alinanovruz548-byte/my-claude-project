base = r'C:\Users\awright\Desktop\Видео Клод'
p = base + r'\remotion\src\Board16b.jsx'
s = open(p, encoding='utf-8').read()
R = [
    ("  if (pose === 'turn') { const q = t / 0.5; sx = q < 0.5 ? 1 - q * 1.6 : (q - 0.5) * 2; sx = Math.max(0.1, sx); }\n", ""),
    ("    if (tt < 1.5) return {x: 540, y: 1790, s: 1.55};\n    if (tt < 2.3)", "    if (tt < 1.5) return {x: 540, y: 1790 + Math.max(0, 1 - easeOut(tt / 0.5)) * 420, s: 1.62};\n    if (tt < 2.3)"),
    ("    if (tt < 13.5) { const q = easeIO((tt - 12.7) / 0.8); return {x: lerp(SIDE.x, 540, q), y: lerp(SIDE.y, 1790, q), s: lerp(SIDE.s, 1.55, q)}; }\n    if (tt < 16.4) return {x: 540, y: 1790, s: 1.55};",
     "    if (tt < 13.5) { const q = easeIO((tt - 12.7) / 0.8); return {x: lerp(SIDE.x, 540, q), y: lerp(SIDE.y, 1790, q), s: lerp(SIDE.s, 1.6, q)}; }\n    if (tt < 16.4) return {x: 540, y: 1790, s: 1.6};"),
    ("{x: lerp(540, SIDE.x, q), y: lerp(1790, SIDE.y, q), s: lerp(1.55, SIDE.s, q)}", "{x: lerp(540, SIDE.x, q), y: lerp(1790, SIDE.y, q), s: lerp(1.6, SIDE.s, q)}"),
    ("s: lerp(SIDE.s, 1.4, q)}; }\n    return {x: 540, y: 1790, s: 1.4};", "s: lerp(SIDE.s, 1.15, q)}; }\n    return {x: 540, y: 1790, s: 1.15};"),
    ("const hy = d.y - 890 * d.s + 190 * d.s;", "const hy = d.y - 890 * d.s + 215 * d.s;"),
    ("top: 400, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 112, color: INK}}>Кто здесь главный?", "top: 345, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 112, color: INK}}>Кто здесь главный?"),
    ("[['Инфанта', 560, 0], ['Художник', 710, 1]]", "[['Инфанта', 500, 0], ['Художник', 640, 1]]"),
    ("left: 170, top, width: 740, height: 120, borderRadius: 60", "left: 170, top, width: 740, height: 110, borderRadius: 55"),
    ("[1500, 640, 650, 790], clamp)", "[1500, 540, 550, 690], clamp)"),
]
for x, y in R:
    assert x in s, x[:60]
    s = s.replace(x, y)
open(p, 'w', encoding='utf-8').write(s)
print('ok')
