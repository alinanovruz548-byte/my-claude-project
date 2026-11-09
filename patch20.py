p = r'C:\Users\awright\Desktop\Видео Клод\scripts\main20_main.jsx'
s = open(p, encoding='utf-8').read()


def rep(a, b):
    global s
    assert a in s, a[:70]
    s = s.replace(a, b, 1)


# ---- руки и лапа
helpers = """
// картонная рука: (x, y) — точка касания кончиков пальцев, side 'l' — тянется слева, 'r' — справа, q — выезд 0..1
const Hand = ({x, y, side, q}) => {
  const off = (1 - q) * 800;
  const sk = '#F2C09B', sk2 = '#DDA27C';
  const hand = (
    <g stroke={INK} strokeWidth="5" strokeLinejoin="round">
      <rect x="-1000" y="10" width="880" height="150" fill="#fff" />
      <rect x="-150" y="2" width="46" height="166" fill={ROSE} />
      <rect x="-104" y="28" width="260" height="124" rx="34" fill={sk} />
      {[[130, 112], [128, 126], [130, 120], [132, 100]].map(([fx, fl], i) => <rect key={i} x={fx} y={32 + i * 27} width={fl} height="27" rx="13" fill={sk} />)}
      <path d="M-20 160 Q40 205 130 168 L96 140 Z" fill={sk2} />
      <path d="M-60 50 L110 50 M-60 100 L90 100" stroke={sk2} strokeWidth="4" fill="none" />
    </g>
  );
  const tx = side === 'l' ? x - 240 - off : x + 240 + off;
  return (
    <svg width="1080" height="1920" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 35}}>
      <g transform={`translate(${tx} ${y - 90}) ${side === 'r' ? 'scale(-1 1)' : ''}`}>{hand}</g>
    </svg>
  );
};
// большая картонная лапа сверху (кончик в точке x, y)
const Paw = ({x, y}) => (
  <svg width="1080" height="1920" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 36}}>
    <g stroke={INK} strokeWidth="5" strokeLinejoin="round">
      <polygon points={`${x - 75},${y - 1700} ${x + 75},${y - 1700} ${x + 66},${y - 90} ${x - 66},${y - 90}`} fill="#E8A15A" />
      <polygon points={`${x - 75},${y - 1700} ${x - 10},${y - 1700} ${x - 20},${y - 90} ${x - 66},${y - 90}`} fill="#D88B44" />
      <rect x={x - 70} y={y - 150} width="140" height="70" fill="#fff" />
      <ellipse cx={x} cy={y} rx="100" ry="88" fill="#fff" />
      <ellipse cx={x - 52} cy={y - 18} rx="24" ry="30" fill="#F4B8C8" />
      <ellipse cx={x} cy={y - 40} rx="24" ry="30" fill="#F4B8C8" />
      <ellipse cx={x + 52} cy={y - 18} rx="24" ry="30" fill="#F4B8C8" />
      <ellipse cx={x} cy={y + 24} rx="44" ry="32" fill="#F4B8C8" />
    </g>
  </svg>
);
"""
rep("export const Board20Main", helpers + "\nexport const Board20Main")

# ---- C: руки забирают картину наверх
rep("""            <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translateX(${-1100 * easeIn3(k(8.9, 9.4))}px) rotate(${-8 * k(8.9, 9.4)}deg)`}}>""",
    """            <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translateY(${-1700 * easeIn3(k(8.95, 9.5))}px)`}}>
              {t >= 8.35 && <Hand x={262} y={950} side="l" q={easeOut(k(8.35, 8.8))} />}
              {t >= 8.35 && <Hand x={818} y={950} side="r" q={easeOut(k(8.35, 8.8))} />}""")

# ---- E: фото Марии ниже
i = s.index("            <Card x={110} y={380} w={860} h={230} at={12.0}")
j = s.index("            <Stamp txt=\"ВОЗВРАТ\"")
newE = """            <Card x={110} y={380} w={860} h={200} at={12.0} t={t} r={36} from="left">
              <div style={{padding: '34px 44px'}}><div style={{fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: ROSE}}>ПЛЕМЯННИЦА АДЕЛИ</div><div style={{fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 86, color: INK, lineHeight: 1.05}}>Мария Альтман</div></div>
            </Card>
            <Card x={90} y={640} w={380} h={490} at={12.9} t={t} r={22} rot={-3} from="left" pad={12} bg="#fff">
              <div style={{width: '100%', height: '100%', overflow: 'hidden', borderRadius: 14}}><Paint src="maria.jpg" t={t} at={12.9} pos="50% 40%" zoomFrom={1.0} zoomTo={1.12} dur={3.5} /></div>
            </Card>
            <Chip txt="Мария, 1935" at={13.4} t={t} x={110} y={1080} size={26} z={32} />
            <Card x={500} y={690} w={480} h={460} at={14.0} t={t} r={22} rot={2} from="right" pad={0}>
              <div style={{padding: '26px 30px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                  <svg width="56" height="56" viewBox="0 0 70 70"><path d="M35 8 V58 M14 58 H56 M10 22 H60" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" /><path d="M10 22 L2 40 H18Z M60 22 L52 40 H68Z" fill="#F3D98B" stroke={INK} strokeWidth="3" /></svg>
                  <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: INK}}>ИСК</div>
                </div>
                <div style={{fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 44, color: INK, marginTop: 18, lineHeight: 1.1}}>Альтман против Австрии</div>
                {[0, 1, 2, 3].map((i) => <div key={i} style={{height: 13, borderRadius: 7, background: '#E3DCE8', marginTop: 20, width: `${(i === 3 ? 0.55 : 1) * 100 * k(14.3 + i * 0.15, 14.8 + i * 0.15)}%`}} />)}
              </div>
            </Card>
"""
s = s[:i] + newE + s[j:]
rep('<Stamp txt="ВОЗВРАТ" at={15.5} t={t} x={330} y={900} rot={-10} size={76} />', '<Stamp txt="ВОЗВРАТ" at={15.5} t={t} x={500} y={900} rot={-10} size={62} />')

# ---- F: лапа переносит картину, руки забирают
rep("""            <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translateX(${interpolate(t, [17.5, 18.4], [0, 560], {...clamp, easing: easeIO})}px)`}}>
              <Face x={110} y={810} w={300} h={300} at={17.2} t={t} rot={-3} pos="50% 30%" zoom={[1.0, 1.08]} dur={4} />
            </div>""",
    """            <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translate(${interpolate(t, [17.6, 18.45], [0, 560], {...clamp, easing: easeIO})}px, ${-1700 * easeIn3(k(19.2, 19.75))}px)`}}>
              <Face x={110} y={810} w={300} h={300} at={17.2} t={t} rot={-3} pos="50% 30%" zoom={[1.0, 1.08]} dur={4} />
              {t >= 18.75 && <Hand x={122} y={960} side="l" q={easeOut(k(18.75, 19.15))} />}
              {t >= 18.75 && <Hand x={398} y={960} side="r" q={easeOut(k(18.75, 19.15))} />}
            </div>
            {t >= 17.2 && t < 19.0 && <Paw x={260 + interpolate(t, [17.6, 18.45], [0, 560], {...clamp, easing: easeIO})} y={960 - 900 * (1 - easeOut(k(17.2, 17.55))) - 900 * easeIn3(k(18.55, 18.95))} />}""")
open(p, 'w', encoding='utf-8').write(s)
