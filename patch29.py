base = r'C:\Users\awright\Desktop\Видео Клод'
p = base + r'\scripts\main29_part.jsx'
s = open(p, encoding='utf-8').read()


def rep(a, b):
    global s
    assert a in s, a[:70]
    s = s.replace(a, b, 1)


rep("{t >= 4.0 && t < 5.45 && (", "{t >= 4.0 && t < 6.05 && (")
rep('<SolidStamp txt="АВАРИЯ" at={9.8} t={t} x={110} y={1290}', '<SolidStamp txt="АВАРИЯ" at={9.8} t={t} x={470} y={1290}')
rep('<Chip txt="первый автопортрет, 1926" at={17.3} t={t} x={70} y={1150}', '<Chip txt="первый автопортрет, 1926" at={17.3} t={t} x={430} y={1250}')
rep("left: 300, top: 1130, fontFamily: SANS, fontWeight: 700, fontSize: 18", "left: 300, top: 1190, fontFamily: SANS, fontWeight: 700, fontSize: 18")
# автобус-переход
rep("      {/* повязки гипса: D -> E */}", """      {t >= 5.05 && t < 6.1 && <div style={{position: 'absolute', left: busX, top: 640, zIndex: 60, filter: 'drop-shadow(0 30px 30px rgba(40,30,60,0.35))', transform: 'scaleX(-1)'}}><BusSVG w={1500} /></div>}

      {/* повязки гипса: D -> E */}""")
open(p, 'w', encoding='utf-8').write(s)
print('ok')
