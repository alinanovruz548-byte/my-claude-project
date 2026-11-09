base = r'C:\Users\awright\Desktop\Видео Клод'
p = base + r'\scripts\main29v_part.jsx'
s = open(p, encoding='utf-8').read()


def rep(a, b):
    global s
    assert a in s, a[:80]
    s = s.replace(a, b, 1)


# 1. паузa-удержание 2 с (5.0-7.0 реального времени) на портрете Фриды
rep("  const t = f / fps;\n", "  const tr = f / fps;\n  const inHold = tr >= 5.0 && tr < 7.0;\n  const t = tr < 5.0 ? tr : (inHold ? 5.0 : tr - 2.0);\n  const fv = Math.round(t * fps);\n  const hq = easeOut(Math.min(1, Math.max(0, (tr - 5.0) / 0.7)));\n", )
rep("const cam = camAt(t);", "const cam = camAt(inHold ? 4.9 : t);")
rep("<Dog t={t} f={f} />", "<Dog t={t} f={fv} />")
rep("spring({frame: f - Math.round((25.1 + i * 0.15) * fps)", "spring({frame: fv - Math.round((25.1 + i * 0.15) * fps)")
rep('<Vclip file="a.mp4" from={72} frames={111} />', '<Vclip file="a.mp4" from={72} frames={154} />')
rep('<Vclip file="b.mp4" from={150} frames={198} />', '<Vclip file="b.mp4" from={210} frames={198} />')
rep('<Vclip file="c1.mp4" from={312} frames={129} />', '<Vclip file="c1.mp4" from={372} frames={129} />')
rep('<Vclip file="tail.mp4" from={417} frames={84} />', '<Vclip file="tail.mp4" from={477} frames={84} />')
rep('<Vclip file="d.mp4" from={477} frames={249} />', '<Vclip file="d.mp4" from={537} frames={249} />')

# 2. портрет Фриды: выходит вперёд, увеличивается по центру
rep('<Card x={560} y={1090} w={380} h={510} at={4.4} t={t} r={10} rot={5} pad={7} bg="#fff" from="right" z={35}><Pic src="frida32.jpg" pos="50% 30%" /></Card>',
    """<div style={{position: 'absolute', inset: 0, background: 'rgba(10,10,34,0.55)', opacity: hq, zIndex: 31}} />
            {t >= 4.4 && (() => { const pop = easeOut(Math.min(1, Math.max(0, (t - 4.4) / 0.5))); const x = 560 - 370 * hq, y = 1090 - 590 * hq, w = 380 + 320 * hq, h = 510 + 430 * hq, rot = 5 - 7 * hq; return <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 12, background: '#fff', padding: 8 + 4 * hq, boxSizing: 'border-box', boxShadow: `0 ${30 + 40 * hq}px ${60 + 40 * hq}px rgba(0,0,0,0.55)`, transform: `rotate(${rot}deg) scale(${0.6 + 0.4 * pop})`, opacity: Math.min(1, pop * 2), zIndex: 35, overflow: 'hidden'}}><Pic src="frida32.jpg" pos="50% 30%" /></div>; })()}""")

# 3. 17 с: затемнение и большая картина Фриды Кало по центру
a = s.index("            {t < 18.6 && (")
b = s.index("            {t >= 18.3 && (")
newD = """            <div style={{position: 'absolute', inset: 0, background: 'rgba(18,12,40,0.55)', opacity: k(16.3, 16.8), zIndex: 11}} />
            {t < 18.6 && (
              <div style={{position: 'absolute', inset: 0, opacity: 1 - k(18.2, 18.6), zIndex: 20}}>
                {(() => { const pop = easeOut(Math.min(1, Math.max(0, (t - 16.4) / 0.6))); return <div style={{position: 'absolute', left: 230, top: 520, width: 620, height: 836, background: '#C79A38', padding: 16, borderRadius: 10, boxSizing: 'border-box', boxShadow: '0 40px 90px rgba(0,0,0,0.6), 0 0 80px rgba(233,200,106,0.35)', transform: `rotate(${-2 + (1 - pop) * 8}deg) scale(${0.55 + 0.45 * pop})`, opacity: Math.min(1, pop * 2), overflow: 'hidden'}}>
                  <div style={{position: 'absolute', inset: 16, overflow: 'hidden', clipPath: `inset(0 0 ${(1 - paintRev) * 100}% 0)`}}><Img src={img('velvet.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
                </div>; })()}
                <Chip txt="первый автопортрет, 1926" at={17.3} t={t} x={270} y={1400} size={30} bg={GOLDC} rot={-2} z={40} />
              </div>
            )}
"""
s = s[:a] + newD + s[b:]
open(p, 'w', encoding='utf-8').write(s)

# mk29v: путь к озвучке
m = base + r'\scripts\mk29v.py'
t = open(m, encoding='utf-8').read()
if 'voiceover_n29v2' not in t:
    t = t.replace("g = g.replace('main29_main.jsx', 'main29v_main.jsx')", "g = g.replace('voiceover_n29.mp3', 'voiceover_n29v2.mp3')\ng = g.replace('main29_main.jsx', 'main29v_main.jsx')", 1)
    open(m, 'w', encoding='utf-8').write(t)
print('ok')
