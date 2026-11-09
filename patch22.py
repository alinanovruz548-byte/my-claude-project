p = r'C:\Users\awright\Desktop\Видео Клод\scripts\main22_main.jsx'
s = open(p, encoding='utf-8').read()


def rep(a, b):
    global s
    assert a in s, a[:70]
    s = s.replace(a, b, 1)


# ---- хук: втягивание, собака показывает череп и часы, лапки вместе, наезд, картина
i = s.index("      {/* A. ХУК */}")
j = s.index("      <div style={{position: 'absolute', inset: 0, transform: `translate(${cam.px}px")
hook = """      {/* A. ХУК */}
      {t < 3.6 && (() => {
        const pull = easeOut(k(0, 0.75));
        const dogIn = easeOut(k(0.45, 1.0));
        const zz = easeIn3(k(1.7, 2.25));
        const pose = t < 1.7 ? 'show' : 'join';
        const bright = 0.4 + 0.6 * k(2.2, 2.6);
        return (
          <div style={{position: 'absolute', inset: 0, zIndex: 15, overflow: 'hidden', background: '#2a2118'}}>
            <div style={{position: 'absolute', inset: 0, transform: `rotate(${(1 - pull) * -40}deg) scale(${0.3 + 0.8 * pull + 0.04 * k(0.75, 3, easeIO)})`, filter: `blur(${(1 - pull) * 16}px) brightness(${bright})`}}>
              <Crop src="claesz.jpg" cx={0.5} cy={0.5} wr={2730} w={1080} h={1920} />
            </div>
            <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 30%, rgba(10,6,2,0.75) 100%)', opacity: (1 - k(2.2, 2.5))}} />
            {t < 2.4 && (
              <div style={{position: 'absolute', left: 195, top: 832 + (1 - dogIn) * 1000 + Math.sin(t * 40) * 6 * k(1.7, 2.2), width: 690, height: 1068, transformOrigin: '50% 46%', transform: `scale(${1 + 9 * zz})`, filter: `blur(${zz * 6}px)`, zIndex: 7, opacity: 1 - k(2.15, 2.3)}}>
                <Img src={img(`p_${pose}.png`)} style={{width: '100%', height: '100%'}} />
              </div>
            )}
            {t >= 0.95 && t < 1.7 && <div style={{position: 'absolute', left: 140, top: 1190, zIndex: 9, opacity: k(0.95, 1.2)}}><span style={{padding: '10px 26px', borderRadius: 30, background: 'rgba(255,255,255,0.95)', fontFamily: SANS, fontWeight: 700, fontSize: 32, letterSpacing: 2, color: INK, boxShadow: '0 10px 24px rgba(0,0,0,0.3)'}}>череп</span></div>}
            {t >= 1.4 && t < 1.7 && <div style={{position: 'absolute', left: 740, top: 1250, zIndex: 9, opacity: k(1.4, 1.6)}}><span style={{padding: '10px 26px', borderRadius: 30, background: 'rgba(255,255,255,0.95)', fontFamily: SANS, fontWeight: 700, fontSize: 32, letterSpacing: 2, color: INK, boxShadow: '0 10px 24px rgba(0,0,0,0.3)'}}>часы</span></div>}
            <Ring x={540 + 0.115 * zoomA} y={960 + (0.37 - 0.5) * zoomA / ASP.claesz} r={215} at={2.3} t={t} label="череп" lx={-190} ly={-270} />
            <Ring x={540 - 0.15 * zoomA} y={960 + (0.753 - 0.5) * zoomA / ASP.claesz} r={140} at={2.55} t={t} label="часы" lx={40} ly={-230} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 330, background: 'linear-gradient(180deg, rgba(252,245,242,0.97) 0%, rgba(252,245,242,0.9) 55%, rgba(252,245,242,0))', zIndex: 5}} />
            <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: t > 2.2 && t < 2.45 ? 1 - (t - 2.2) / 0.25 : 0, zIndex: 10}} />
            <Stamp txt="ПОСЛАНИЕ" at={2.45} t={t} x={190} y={760} rot={-8} size={78} />
          </div>
        );
      })()}

"""
s = s[:i] + hook + s[j:]
rep("const zoomA = 2730 + 520 * k(0, 3.0, easeIO);", "const zoomA = 2730 + 300 * k(2.2, 3.4, easeIO);")
rep("const CAM_STARTS = [3.0,", "const CAM_STARTS = [3.2,")
rep("{t >= 3.0 && t < 7.25 && (", "{t >= 3.2 && t < 7.25 && (")
rep("<Tiles t={t} T={3.0} />", "<Tiles t={t} T={3.2} />")
rep("'p_skull.png', 'p_ruff.png'", "'p_show.png', 'p_join.png', 'p_skull.png', 'p_ruff.png'")

# ---- 8 с: картины крупнее
rep('<Card x={110} y={640} w={440} h={310} at={7.5} t={t} r={16} rot={-5} pad={8} bg="#fff"><Crop src="claesz.jpg" cx={0.5} cy={0.5} wr={424} w={424} h={294} r={8} /></Card>',
    '<Card x={50} y={600} w={580} h={410} at={7.5} t={t} r={18} rot={-5} pad={9} bg="#fff"><Crop src="claesz.jpg" cx={0.5} cy={0.5} wr={562} w={562} h={392} r={8} /></Card>')
rep('<Card x={460} y={720} w={420} h={330} at={7.9} t={t} r={16} rot={4} pad={8} bg="#fff" z={22}><Crop src="steen.jpg" cx={0.5} cy={0.5} wr={404} w={404} h={314} r={8} /></Card>',
    '<Card x={440} y={720} w={600} h={480} at={7.9} t={t} r={18} rot={4} pad={9} bg="#fff" z={22}><Crop src="steen.jpg" cx={0.5} cy={0.5} wr={582} w={582} h={462} r={8} /></Card>')
rep('<Chip txt="Нидерланды" at={7.6} t={t} x={110} y={1000} size={30} />', '<Chip txt="Нидерланды" at={7.6} t={t} x={90} y={1050} size={30} />')
rep('<Chip txt="голландцы" at={8.1} t={t} x={110} y={1070} size={26} bg="rgba(255,236,170,0.98)" />', '<Chip txt="голландцы" at={8.1} t={t} x={90} y={1120} size={26} bg="rgba(255,236,170,0.98)" />')

# ---- 21 с: плашки в правый край
rep('<Chip txt="Хармен Стенвейк" at={18.6} t={t} x={110} y={1180} size={26} />', '<Chip txt="Хармен Стенвейк" at={18.6} t={t} x={650} y={1170} size={26} />')
rep('<Chip txt="пишите в комментариях" at={21.4} t={t} x={110} y={1250} size={28} bg="rgba(255,236,170,0.98)" />', '<Chip txt="пишите в комментариях" at={21.0} t={t} x={560} y={1240} size={28} bg="rgba(255,236,170,0.98)" z={60} />')
open(p, 'w', encoding='utf-8').write(s)

g = r'C:\Users\awright\Desktop\Видео Клод\scripts\gen_n22.py'
t = open(g, encoding='utf-8').read()
a = t.index("  {t: 0.0, x: 540, y: 2300"); b = t.index("  {t: 3.4, ...SIDE_R")
t = t[:a] + "  {t: 0.0, x: 540, y: 2300, s: 0.9, pose: 'skull', look: 1},\n  {t: 3.0, x: 540, y: 2300, s: 0.9, pose: 'skull', look: 1},\n" + t[b:]
t = t.replace("{t: 3.4, ...SIDE_R, pose: 'ruff', look: -1}", "{t: 3.7, ...SIDE_R, pose: 'ruff', look: -1}")
t = t.replace("ev(\"pulse\", 0, 0.0, 0.5), ev(\"ting\", 3, 0.0, 0.35), ev(\"ting\", 5, 0.0, 0.35), ev(\"stamp\", 7, 0.1, 0.7),", "ev(\"whoosh\", 0, 0.0, 0.6), ev(\"ting\", 3, 0.0, 0.35), ev(\"ting\", 5, 0.0, 0.35), ev(\"thud\", 6, -0.1, 0.6), ev(\"stamp\", 7, 0.15, 0.7),")
open(g, 'w', encoding='utf-8').write(t)
print('ok')
