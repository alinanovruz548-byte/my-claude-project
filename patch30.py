base = r'C:\Users\awright\Desktop\Видео Клод'
p = base + r'\scripts\main30_part.jsx'
s = open(p, encoding='utf-8').read()


def rep(a, b):
    global s
    assert a in s, a[:80]
    s = s.replace(a, b, 1)


# 1. настоящая подпись Дали вместо плашки «АВТОГРАФ»
rep('<SolidStamp txt="АВТОГРАФ" at={10.75} t={t} x={110} y={1320} rot={-6} size={70} />',
    """{t >= 10.75 && (() => { const q = easeOut(Math.min(1, Math.max(0, (t - 10.75) / 0.5))); const w = easeIO(Math.min(1, Math.max(0, (t - 10.9) / 0.9))); return <div style={{position: 'absolute', left: 150, top: 1250, width: 780, height: 300, background: '#fff', padding: 8, borderRadius: 8, boxShadow: '0 24px 50px rgba(0,0,0,0.55)', transform: `rotate(${-4 + (1 - q) * 10}deg) scale(${0.7 + 0.3 * q})`, opacity: Math.min(1, q * 2), zIndex: 38, overflow: 'hidden'}}><div style={{width: '100%', height: '100%', clipPath: `inset(0 ${(1 - w) * 100}% 0 0)`}}><Img src={img('sign.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div></div>; })()}
            <Chip txt="подлинная подпись Дали, 1948" at={11.2} t={t} x={150} y={1190} size={26} bg={GOLDC} rot={-3} z={40} />""")
rep('<Chip txt="тысячи пустых" at={11.4} t={t} x={560} y={1180} size={34} bg={GOLDC} rot={3} z={40} />', '<Chip txt="тысячи пустых" at={11.4} t={t} x={600} y={1130} size={34} bg={GOLDC} rot={3} z={40} />')

# 2. счётчик ниже
rep('<Chip txt="по оценкам" at={12.6} t={t} x={70} y={460}', '<Chip txt="по оценкам" at={12.6} t={t} x={70} y={560}')
rep("left: 0, width: 1080, top: 520, textAlign: 'center', fontFamily: SERIF, fontWeight: 700, lineHeight: 1}}>", "left: 0, width: 1080, top: 680, textAlign: 'center', fontFamily: SERIF, fontWeight: 700, lineHeight: 1}}>")

# 3. финал: «Постоянство памяти» на весь экран
rep("<Img src={img('bg_a.png')} style={{position: 'absolute', maxWidth: 'none', width: 1080, height: 1920, left: 0, top: 0, transformOrigin: '50% 50%', transform: `scale(${1.05 + 0.12 * k(21.3, 24.0, (x) => x)})`, filter: 'blur(1.5px)'}} />",
    "<Img src={img('pm.jpg')} style={{position: 'absolute', maxWidth: 'none', width: 2659, height: 1920, left: -470 - 90 * k(21.3, 24.1, (x) => x), top: 0, transformOrigin: '1000px 50%', transform: `scale(${1.04 + 0.1 * k(21.3, 24.1, (x) => x)})`, filter: 'blur(0.8px)'}} />")
rep("background: 'linear-gradient(180deg, rgba(14,10,30,0.72) 0%, rgba(14,10,30,0.5) 50%, rgba(14,10,30,0.72) 100%)'", "background: 'linear-gradient(180deg, rgba(14,10,30,0.7) 0%, rgba(14,10,30,0.42) 45%, rgba(14,10,30,0.64) 100%)'")
rep("{['Девятый вал', 'Бал-маскарад', 'Утро в сосновом лесу'].map(", "<div style={{position: 'absolute', left: 70, top: 1545, fontFamily: SANS, fontWeight: 700, fontSize: 22, color: 'rgba(255,255,255,0.85)', opacity: k(22.0, 22.5), textShadow: '0 2px 10px rgba(0,0,0,0.7)'}}>Сальвадор Дали, «Постоянство памяти», 1931 (миниатюра)</div>\n          {['Девятый вал', 'Бал-маскарад', 'Утро в сосновом лесу'].map(")
rep("['dali65.jpg', 'bg_a.png', 'p_open.png']", "['dali65.jpg', 'pm.jpg', 'sign.jpg', 'p_open.png']")
open(p, 'w', encoding='utf-8').write(s)

# mk30: розовая плашка на «Дали» в хуке
m = base + r'\scripts\mk30.py'
t = open(m, encoding='utf-8').read()
if 'wt < 1' not in t:
    t = t.replace("part = open(base + r'\\scripts\\main30_part.jsx', encoding='utf-8').read()",
                  "old = \"transformOrigin: '50% 80%'}}>{txt}</span>\"\nassert old in helpers\nhelpers = helpers.replace(old, \"transformOrigin: '50% 80%', ...(wt < 1 ? {background: 'linear-gradient(135deg,#F9B7D2,#C4607E)', padding: '0 24px 6px', borderRadius: 30, border: '4px solid #fff', color: '#fff', fontStyle: 'italic', textShadow: '0 3px 10px rgba(120,30,70,0.5)'} : {})}}>{txt}</span>\")\npart = open(base + r'\\scripts\\main30_part.jsx', encoding='utf-8').read()", 1)
    t = t.replace('"Фото Сальвадора Дали 1965', '"Подпись Дали с автографом 1948 (Commons, «Firmas de Salvador Dali y Gala Dali», Public domain). «Постоянство памяти» (1931) показано миниатюрой en.wikipedia (добросовестное использование, права Дали защищены до 2059, риск претензий платформы). Фото Сальвадора Дали 1965', 1)
    open(m, 'w', encoding='utf-8').write(t)
print('ok')
