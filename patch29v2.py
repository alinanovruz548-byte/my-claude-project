base = r'C:\Users\awright\Desktop\Видео Клод'
p = base + r'\scripts\main29v_part.jsx'
s = open(p, encoding='utf-8').read()


def rep(a, b):
    global s
    assert a in s, a[:80]
    s = s.replace(a, b, 1)


# удержание 1 с
rep("const inHold = tr >= 5.0 && tr < 7.0;", "const inHold = tr >= 5.0 && tr < 6.0;")
rep("const t = tr < 5.0 ? tr : (inHold ? 5.0 : tr - 2.0);", "const t = tr < 5.0 ? tr : (inHold ? 5.0 : tr - 1.0);")
rep("const hq = easeOut(Math.min(1, Math.max(0, (tr - 5.0) / 0.7)));", "const hq = easeOut(Math.min(1, Math.max(0, (tr - 4.6) / 0.6)));")
rep('<Vclip file="b.mp4" from={210} frames={198} />', '<Vclip file="b.mp4" from={180} frames={198} />')
rep('<Vclip file="c1.mp4" from={372} frames={129} />', '<Vclip file="c1.mp4" from={342} frames={129} />')
rep('<Vclip file="tail.mp4" from={477} frames={84} />', '<Vclip file="tail.mp4" from={447} frames={84} />')
rep('<Vclip file="d.mp4" from={537} frames={249} />', '<Vclip file="d.mp4" from={507} frames={249} />')

# затемнение: на счётчике тот же оттенок, что на портрете (без дополнительного затемнения)
rep("<div style={{position: 'absolute', inset: 0, background: 'rgba(18,12,40,0.78)', opacity: darkD, zIndex: 10}} />", "")
rep("'#F28BB0' : 'rgba(255,255,255,0.35)'", "'#F28BB0' : 'rgba(255,255,255,0.5)'")

# авария: наезд камеры, удар, вспышка, лучи, «БАМ!»
rep("""            <Vclip file="b.mp4" from={180} frames={198} />
            <TopVeil />""", """            <div style={{position: 'absolute', inset: 0, transformOrigin: '56% 66%', transform: `translate(${bShake}px, ${bShake * 0.6}px) scale(${bScale})`}}>
              <Vclip file="b.mp4" from={180} frames={198} />
            </div>
            <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 56% 66%, rgba(0,0,0,0) 35%, rgba(10,6,24,' + (0.15 + 0.5 * k(5.4, 9.0, (x) => x)) + ') 100%)', zIndex: 3}} />
            {t >= 9.0 && t < 9.7 && (
              <>
                <div style={{position: 'absolute', inset: 0, background: 'rgba(255,226,160,0.55)', opacity: Math.max(0, 1 - (t - 9.0) * 7), zIndex: 28}} />
                <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, zIndex: 27, opacity: Math.max(0, 1 - (t - 9.0) * 2.2)}}>
                  {Array.from({length: 28}).map((_, i) => { const a = (i / 28) * Math.PI * 2; const r0 = 120 + (t - 9.0) * 900, r1 = r0 + 260 + (i % 3) * 120; return <line key={i} x1={605 + Math.cos(a) * r0} y1={1270 + Math.sin(a) * r0} x2={605 + Math.cos(a) * r1} y2={1270 + Math.sin(a) * r1} stroke="#fff" strokeWidth={6 + (i % 4) * 3} strokeLinecap="round" opacity="0.85" />; })}
                  <circle cx="605" cy="1270" r={80 + (t - 9.0) * 1500} fill="none" stroke="#FFE08A" strokeWidth="16" opacity="0.8" />
                </svg>
              </>
            )}
            {t >= 9.0 && (() => { const q = spring({frame: fv - Math.round(9.0 * fps), fps, config: {damping: 9, stiffness: 200}}); return <div style={{position: 'absolute', left: 330, top: 760, zIndex: 36, transform: `scale(${q * 1.25}) rotate(-8deg)`, opacity: Math.min(1, q * 2) * (1 - k(10.2, 10.5))}}><svg width="460" height="400" viewBox="-230 -200 460 400"><polygon points={Array.from({length: 24}).map((_, i) => { const a = (i / 24) * Math.PI * 2; const r = i % 2 ? 120 : 200; return `${Math.cos(a) * r * 1.1},${Math.sin(a) * r}`; }).join(' ')} fill="#F7C34A" stroke="#fff" strokeWidth="10" strokeLinejoin="round" /><text x="0" y="40" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="110" fill="#C4607E" stroke="#fff" strokeWidth="6" paintOrder="stroke">БАМ!</text></svg></div>; })()}
            <TopVeil />""")
rep("  const darkD = k(18.2, 18.9);\n", "  const darkD = k(18.2, 18.9);\n  const bImp = t >= 9.0 ? Math.exp(-(t - 9.0) * 5) : 0;\n  const bScale = 1 + 0.26 * k(5.4, 9.0, (x) => x * x) + 0.22 * bImp;\n  const bShake = t >= 9.0 && t < 10.0 ? Math.sin(t * 95) * 34 * bImp : 0;\n")
rep('<SolidStamp txt="АВАРИЯ" at={9.2} t={t} x={110} y={1330} rot={-6} size={64} />', '<SolidStamp txt="АВАРИЯ" at={9.5} t={t} x={110} y={1330} rot={-6} size={64} />')
open(p, 'w', encoding='utf-8').write(s)
print('ok')
