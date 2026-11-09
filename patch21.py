p = r'C:\Users\awright\Desktop\Видео Клод\scripts\main21_main.jsx'
s = open(p, encoding='utf-8').read()


def cut(a, b, new):
    global s
    i = s.index(a)
    j = s.index(b, i)
    s = s[:i] + new + s[j:]


# ---- C: настоящий сканер в руке
cut('            <Sq x={220} y={520} w={640} at={5.2} t={t} rot={2}>', '            <Chip txt="Третьяковка', """            <Sq x={220} y={520} w={640} at={5.2} t={t} rot={2}>
              <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden'}}>
                <Paint src="square.jpg" t={t} at={5.2} pos="50% 50%" zoomFrom={1.0} zoomTo={1.0} dur={1} />
                <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: scanY, overflow: 'hidden'}}>
                  <div style={{position: 'absolute', left: 0, top: 0, width: 612, height: 612, filter: 'brightness(0.45) saturate(0.4) hue-rotate(190deg) contrast(1.2)'}}><Paint src="square.jpg" t={t} at={5.2} pos="50% 50%" zoomFrom={1.0} zoomTo={1.0} dur={1} /></div>
                  <div style={{position: 'absolute', left: 85, top: 86, width: 442, height: 447, opacity: 0.92}}><CuboArt size={442} /></div>
                  <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(120,220,255,0.18) 0 3px, rgba(0,0,0,0) 3px 8px)'}} />
                </div>
                <div style={{position: 'absolute', left: 0, right: 0, top: scanY - 5, height: 10, background: '#6FE3FF', boxShadow: '0 0 28px 10px rgba(111,227,255,0.85)', opacity: t > 5.4 && t < 7.0 ? 1 : 0}} />
              </div>
            </Sq>
            {t > 5.2 && t < 7.7 && (() => {
              const yl = 534 + scanY;
              const inn = easeOut(k(5.2, 5.6)) * (1 - easeIn3(k(7.0, 7.5)));
              const dx = (1 - inn) * 420;
              return (
                <svg width="1080" height="1920" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', zIndex: 30, pointerEvents: 'none'}}>
                  <polygon points={`${815 + dx},${yl} 232,${yl - 7} 232,${yl + 7}`} fill="rgba(111,227,255,0.35)" opacity={t > 5.4 && t < 7.0 ? 1 : 0} />
                  <g transform={`translate(${dx} ${yl - 70})`} stroke={INK} strokeWidth="5" strokeLinejoin="round">
                    <rect x="1000" y="10" width="300" height="110" fill="#fff" />
                    <rect x="1000" y="2" width="36" height="126" fill={ROSE} />
                    <rect x="820" y="30" width="190" height="72" rx="30" fill="#F2C09B" />
                    <rect x="770" y="26" width="120" height="84" rx="16" fill="#C9CDD6" />
                    <rect x="770" y="40" width="26" height="56" rx="8" fill="#6FE3FF" />
                    <circle cx="783" cy="68" r="7" fill="#fff" />
                    <rect x="830" y="104" width="70" height="40" rx="14" fill="#F2C09B" />
                  </g>
                </svg>
              );
            })()}
""")

# ---- E: что написано
cut('              <Card x={560} y={640} w={430} h={330} at={11.5}', '              <Chip txt="шутка Альфонса Алле, 1882"', """              <Card x={450} y={620} w={540} h={390} at={11.5} t={t} r={22} rot={3} from="right" pad={0}>
                <div style={{padding: '30px 38px'}}>
                  <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 22, letterSpacing: 6, color: ROSE}}>КАРАНДАШОМ</div>
                  <div style={{marginTop: 22, fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 62, lineHeight: 1.12, color: '#5B5662', clipPath: `inset(0 ${(1 - k(11.8, 13.4, easeOut)) * 100}% 0 0)`}}>«Битва негров в тёмной пещере»</div>
                </div>
              </Card>
""")
s = s.replace('<Chip txt="шутка Альфонса Алле, 1882" at={12.6} t={t} x={110} y={1030} size={28} bg="rgba(255,236,170,0.98)" />', '<Chip txt="так Алле назвал чёрный прямоугольник, 1882" at={12.9} t={t} x={90} y={1050} size={26} bg="rgba(255,236,170,0.98)" />')
s = s.replace('<Chip txt="отсылка" at={12.0} t={t} x={650} y={1010} size={28} />', '<Chip txt="надпись под краской" at={12.0} t={t} x={560} y={1010} size={26} />')

# ---- G: зум в угол квадрата
cut('            <Sq x={170} y={420} w={740} at={16.0} t={t} rot={0}>', '            <Chip txt="идеальный квадрат"', """            <Sq x={170} y={420} w={740} at={16.0} t={t} rot={0}>
              <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden'}}>
                <div style={{position: 'absolute', inset: 0, transformOrigin: '86% 15%', transform: `scale(${1 + 2.8 * easeIO(k(16.9, 17.4)) * (1 - easeIO(k(18.0, 18.4)))})`}}>
                  <Paint src="square.jpg" t={t} at={16.0} pos="50% 50%" zoomFrom={1.0} zoomTo={1.0} dur={1} />
                  <svg width="100%" height="100%" viewBox="0 0 712 712" style={{position: 'absolute', inset: 0}}>
                    <g style={{opacity: k(16.4, 16.9)}}>
                      <path d="M0 101.5 H712 M611.7 0 V712 M100.7 0 V712 M0 616.2 H712" stroke={ROSE} strokeWidth="2.2" strokeDasharray="12 9" fill="none" />
                    </g>
                    <polygon points="100.7,101.5 611.7,104.8 609.6,616.2 102.8,618.4" fill="none" stroke="#F2C14E" strokeWidth="1.6" style={{opacity: k(17.0, 17.4)}} />
                    {[[100.7, 101.5], [611.7, 104.8], [609.6, 616.2], [102.8, 618.4]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill="#F2C14E" stroke={INK} strokeWidth="1" style={{opacity: k(17.1, 17.4)}} />)}
                  </svg>
                </div>
              </div>
            </Sq>
""")
s = s.replace('{t >= 18.1 && (\n              <div style={{position: \'absolute\', left: 560, top: 780', '{t >= 18.4 && (\n              <div style={{position: \'absolute\', left: 560, top: 780')
s = s.replace('scale(${easeOut(k(18.1, 18.6))}) rotate(${(1 - k(18.1, 18.6)) * 40}deg)', 'scale(${easeOut(k(18.4, 18.9))}) rotate(${(1 - k(18.4, 18.9)) * 40}deg)')
s = s.replace('<Chip txt="идеальный квадрат" at={16.5} t={t} x={110} y={1160} size={26} bg="rgba(255,225,235,0.98)" />', '<Chip txt="линейка" at={16.5} t={t} x={110} y={1160} size={26} bg="rgba(255,225,235,0.98)" />')
s = s.replace('<Chip txt="углы не прямые" at={17.4} t={t} x={110} y={1220} size={26} />', '<Chip txt="сторона «гуляет»" at={17.3} t={t} x={110} y={1220} size={26} />')
open(p, 'w', encoding='utf-8').write(s)
print('patched')
