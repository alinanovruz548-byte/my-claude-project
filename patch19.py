p = r'C:\Users\awright\Desktop\Видео Клод\scripts\main19_main.jsx'
s = open(p, encoding='utf-8').read()


def rep(a, b):
    global s
    assert a in s, a[:60]
    s = s.replace(a, b, 1)


# --- хук: собака выезжает с края и разрастается на весь экран
i = s.index("          <div style={{position: 'absolute', left: 540 - 400, top: 1120")
j = s.index("          {/* день: круг")
new_hook = """          <div style={{position: 'absolute', left: dgx - 400, top: dgy + 150, width: 800, height: 800, background: 'radial-gradient(circle, rgba(255,230,140,0.5), rgba(255,230,140,0) 65%)', opacity: 1 - dgk, transform: `scale(${1 + Math.sin(t * 4) * 0.04})`}} />
          <div style={{position: 'absolute', left: dgx - 575 * 1.2 / 2, top: dgy + Math.sin(t * 3) * 10 * (1 - dgk), width: 575 * 1.2, height: 890 * 1.2, transformOrigin: '50% 30%', transform: `rotate(${(1 - moonRise) * 8 + Math.sin(t * 2) * 2}deg) scale(${dgs})`, filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.5))'}}>
            <Img src={img('p_moon.png')} style={{width: '100%', height: '100%'}} />
          </div>
"""
s = s[:i] + new_hook + s[j:]
rep("  const moonDown = k(2.6, 3.0);\n", """  const dgk = k(1.5, 3.3, (x) => x * x * x);
  const dgx = interpolate(t, [0, 1.3], [1010, 540], {...clamp, easing: easeOut});
  const dgy = interpolate(t, [0, 1.3], [1250, 1120], {...clamp, easing: easeOut}) + (640 - 1120) * dgk;
  const dgs = 1 + 6 * dgk;
""")
rep("const moonRise = easeOut(k(0.25, 1.9));", "const moonRise = easeOut(k(0, 1.3));")
rep("<div style={{position: 'absolute', inset: 0, clipPath: `circle(${dayIris * 2200}px at 540px 1250px)`", "<div style={{position: 'absolute', inset: 0, zIndex: -1, clipPath: `circle(${dayIris * 2200}px at 540px 1250px)`")

# --- B: июнь 1889 + фото больницы
i = s.index("        {t >= 3.4 && t < 8.3 && (")
j = s.index("        {/* C. звёзды")
newB = """        {t >= 3.4 && t < 8.3 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 16, opacity: k(3.3, 3.7) * (1 - k(7.9, 8.3))}}>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 280, textAlign: 'center'}}><Kin txt="июнь" at={3.7} t={t} size={100} italic color={ROSE} /></div>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 370, textAlign: 'center'}}><Kin txt="1889" at={4.3} t={t} size={230} weight={300} /></div>
            <Card x={110} y={720} w={860} h={500} at={6.0} t={t} r={26} pad={12} bg="#fff" from="left" rot={-2}><div style={{width: '100%', height: '100%', overflow: 'hidden', borderRadius: 16}}><Paint src="hosp.jpg" t={t} at={6.0} pos="62% 50%" zoomFrom={1.05} zoomTo={1.3} dur={2.4} /></div></Card>
            <Card x={90} y={1160} w={640} h={140} at={6.5} t={t} r={30} from="left"><div style={{padding: '20px 36px'}}><div style={{fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: 6, color: ROSE}}>БОЛЬНИЦА · ФРАНЦИЯ</div><div style={{fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 58, color: INK, lineHeight: 1.05}}>Сен-Реми-де-Прованс</div></div></Card>
          </div>
        )}

"""
s = s[:i] + newB + s[j:]

# --- C: чипы наверх
rep('<Chip txt="вид из окна" at={8.2} t={t} x={190} y={1410} size={30} />', '<Chip txt="вид из окна" at={8.2} t={t} x={160} y={395} size={30} />')
rep('<Chip txt="перед рассветом" at={9.3} t={t} x={450} y={1410} size={30} bg="rgba(255,225,170,0.97)" />', '<Chip txt="перед рассветом" at={9.3} t={t} x={450} y={395} size={30} bg="rgba(255,225,170,0.97)" />')
rep("<Card x={160} y={470} w={760} h={920}", "<Card x={160} y={480} w={760} h={900}")

# --- D: картина в золотой рамке + плашка «днём»
i = s.index("        {t >= 10.3 && t < 12.6 && (")
j = s.index("        {/* E. деревня")
newD = """        {t >= 10.3 && t < 12.6 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 18, clipPath: ic(10.3), opacity: 1 - k(12.2, 12.6)}}>
            <div style={{position: 'absolute', left: 700, top: 330, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle,#FFFBE0,#FFD24A 60%,#F7A93A)', boxShadow: '0 0 90px 40px rgba(255,214,90,0.6)', opacity: k(10.5, 11.0), transform: `scale(${1 + Math.sin(t * 5) * 0.04})`}} />
            <Card x={150} y={480} w={780} h={640} at={10.5} t={t} r={8} pad={0} bg="#D9AE5A" rot={-1.5}>
              <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#F3D58A,#B98A36 50%,#F0CF80)', borderRadius: 8}} />
              <div style={{position: 'absolute', inset: 30, border: '6px solid rgba(120,80,20,0.55)', borderRadius: 4}} />
              <div style={{position: 'absolute', inset: 56, overflow: 'hidden', boxShadow: 'inset 0 0 0 4px rgba(90,60,10,0.6)'}}><Paint src="starry.jpg" t={t} at={10.5} pos="50% 50%" zoomFrom={1.0} zoomTo={1.2} dur={2.2} /></div>
            </Card>
            <Card x={140} y={1150} w={560} h={150} at={11.0} t={t} r={34} from="left"><div style={{padding: '16px 40px'}}><div style={{fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: 6, color: ROSE}}>КАРТИНУ ПИСАЛ</div><div style={{fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 84, color: '#D08A1E', lineHeight: 1}}>днём</div></div></Card>
          </div>
        )}

"""
s = s[:i] + newD + s[j:]

# --- E: детство, текст наверх, сепия-воспоминание и домики
i = s.index("        {t >= 12.1 && t < 15.8 && (")
j = s.index("        {/* F. «неудачная» */}")
newE = """        {t >= 12.1 && t < 15.8 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 19, clipPath: ic(12.1), opacity: 1 - k(15.4, 15.8)}}>
            <Chip txt="по одной из версий" at={12.7} t={t} x={300} y={320} size={28} bg="rgba(255,225,170,0.97)" />
            <div style={{position: 'absolute', left: 0, width: 1080, top: 390, textAlign: 'center'}}><Kin txt="из детства" at={13.9} t={t} size={120} italic color={ROSE} /></div>
            <div style={{position: 'absolute', left: 120, top: 600, width: 840, height: 600, borderRadius: 300, background: '#fff', boxShadow: '0 40px 90px rgba(80,50,90,0.25)', opacity: k(12.2, 12.7), transform: `scale(${0.9 + 0.1 * k(12.2, 12.8, easeOut)})`}}>
              <div style={{position: 'absolute', left: 36, top: 36, right: 36, bottom: 36, borderRadius: 270, overflow: 'hidden', filter: `sepia(${1 - k(14.6, 15.4)}) saturate(${0.8 + 0.4 * k(14.6, 15.4)}) blur(${(1 - k(12.4, 13.6)) * 6}px)`}}>
                <Paint src="starry.jpg" t={t} at={12.3} pos="50% 82%" zoomFrom={1.7} zoomTo={2.4} dur={3.2} />
                <div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 0 120px 40px rgba(120,80,40,0.55)'}} />
              </div>
            </div>
            <div style={{position: 'absolute', left: 150, top: 1230, width: 70, height: 70, borderRadius: '50%', background: '#fff', boxShadow: '0 10px 24px rgba(80,50,90,0.22)', opacity: k(12.6, 12.9)}} />
            <svg width="1080" height="200" viewBox="0 0 1080 200" style={{position: 'absolute', left: 0, top: 1210}}>
              {[[330, 0], [470, 1], [610, 2]].map(([x, i]) => {
                const q = easeOut(k(13.0 + i * 0.35, 13.5 + i * 0.35));
                return (
                  <g key={i} transform={`translate(${x} ${150 - 30 * q}) scale(${q})`} opacity={q}>
                    <rect x="-40" y="-60" width="80" height="60" rx="4" fill="#fff" stroke={ROSE} strokeWidth="5" />
                    <path d="M-52 -58 L0 -105 L52 -58 Z" fill="#F7C3D2" stroke={ROSE} strokeWidth="5" strokeLinejoin="round" />
                    <rect x="-12" y="-36" width="24" height="36" rx="4" fill={ROSE} />
                  </g>
                );
              })}
            </svg>
          </div>
        )}

"""
s = s[:i] + newE + s[j:]
open(p, 'w', encoding='utf-8').write(s)
