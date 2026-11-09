p = r'C:\Users\awright\Desktop\Видео Клод\scripts\main24_main.jsx'
s = open(p, encoding='utf-8').read()


def rep(a, b):
    global s
    assert a in s, a[:70]
    s = s.replace(a, b, 1)


def cut(a, b, new):
    global s
    i = s.index(a)
    j = s.index(b, i)
    s = s[:i] + new + s[j:]


rep("const CAM_STARTS = [2.4, 4.9, 8.7, 11.7, 15.3, 18.4, 21.2];", "const CAM_STARTS = [2.4, 4.9, 8.7, 11.7, 15.3, 17.9, 21.2];")

# ---- DigitStamp: позиция/ширина
rep("const DigitStamp = ({txt, ats, t, top, size = 260, width = 175, color = INK}) => (\n  <div style={{position: 'absolute', left: 0, width: 1080, top,",
    "const DigitStamp = ({txt, ats, t, top, size = 260, width = 175, color = INK, x = 0, w = 1080}) => (\n  <div style={{position: 'absolute', left: x, width: w, top,")

# ---- BrainOverlay: полупрозрачная картинка мозга вместо полосок
cut('      <g clipPath="url(#brainclip)" opacity={fq}', '      <path d={BRAIN} fill="none" stroke="#FFD0E4"', """      <g clipPath="url(#brainclip)" opacity={fq * 0.72}>
        <image href={img('brain_cut.png')} x="985" y="0" width="1015" height="630" preserveAspectRatio="none" style={{filter: 'drop-shadow(0 0 24px rgba(255,110,185,0.95))'}} />
      </g>
""")

# ---- хук
cut("      {/* A. ХУК */}", "      <div style={{position: 'absolute', inset: 0, transform: `translate(${cam.px}px", """      {/* A. ХУК */}
      {t < 3.0 && (() => {
        const fly = easeOut(k(0.1, 0.55));
        const dogUp = easeOut(k(0.7, 1.4));
        const zz = easeIn3(k(1.9, 2.55));
        return (
          <div style={{position: 'absolute', inset: 0, zIndex: 15, overflow: 'hidden', background: '#6E1F3C'}}>
            <div style={{position: 'absolute', left: 540 - 316, top: 450 + (1 - dogUp) * 620, width: 632, height: 979, zIndex: 7, opacity: 1 - k(2.3, 2.5)}}>
              <Img src={img('p_brain.png')} style={{width: '100%', height: '100%'}} />
            </div>
            <div style={{position: 'absolute', inset: 0, zIndex: 9, transformOrigin: '607px 1126px', transform: `scale(${1 + 19 * zz})`}}>
              <div style={{position: 'absolute', left: 0, top: 900, width: 1080, height: 520, boxShadow: '0 30px 90px rgba(0,0,0,0.6)', transform: `translateX(${(1 - fly) * 1500}px)`, filter: `blur(${(1 - fly) * 16}px)`}}>
                <Crop src="fresco.jpg" cx={0.7} cy={0.5} wr={1500} w={1080} h={520}>
                  <BrainOverlay t={t} a={1.0} b={1.8} fillAt={1.6} />
                </Crop>
              </div>
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 330, background: 'linear-gradient(180deg, rgba(252,245,242,0.97) 0%, rgba(252,245,242,0.9) 55%, rgba(252,245,242,0))', zIndex: 12}} />
            {t >= 1.5 && t < 2.2 && <div style={{position: 'absolute', left: 0, width: 1080, top: 1470, textAlign: 'center', zIndex: 8, opacity: 0.55 + 0.45 * Math.abs(Math.sin(t * 5)), fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, fontSize: 190, color: '#FFB6D4', textShadow: '0 8px 40px rgba(255,80,150,0.8)'}}>мозг?</div>}
            <div style={{position: 'absolute', inset: 0, background: '#FFD9EA', opacity: t > 2.3 && t < 2.75 ? Math.sin(((t - 2.3) / 0.45) * Math.PI) : 0, zIndex: 20}} />
          </div>
        );
      })()}

""")

# ---- B: без вайпа, плавное проявление
cut("        {/* B. фреска Микеланджело (косой вайп) */}", "        {/* C. 1508 -> 1512 (круг) */}", """        {/* B. фреска Микеланджело */}
        {t >= 2.4 && t < 5.2 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 16, background: BG, opacity: k(2.5, 2.85)}}>
            <Card x={60} y={440} w={960} h={470} at={2.6} t={t} r={20} pad={8} bg="#fff" rot={-1}><Crop src="fresco.jpg" cx={0.5} cy={0.5} wr={944 + 40 * k(2.5, 5, easeIO)} w={944} h={454} r={10} /></Card>
            <Card x={90} y={940} w={300} h={347} at={3.1} t={t} r={18} rot={-3} pad={7} bg="#fff"><Crop src="michel.jpg" cx={0.5} cy={0.42} wr={286} w={286} h={333} r={10} /></Card>
            <Chip txt="Микеланджело" at={3.3} t={t} x={420} y={980} size={34} />
            <Chip txt="Сикстинская капелла" at={3.9} t={t} x={420} y={1050} size={28} bg="rgba(255,236,170,0.98)" />
            <Chip txt="Ватикан" at={4.2} t={t} x={420} y={1115} size={26} />
          </div>
        )}

""")

# ---- C: цифры в ряд, большая картина с мозгом
cut("        {/* C. 1508 -> 1512 (круг) */}", "        {/* D. 1990", """        {/* C. 1508 -> 1512 (круг) */}
        {t >= 4.9 && t < 9.1 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 17, background: BG, clipPath: irisC}}>
            <DigitStamp t={t} txt="1508" ats={[5.8, 6.05, 6.3, 6.5]} top={330} size={190} width={118} x={10} w={500} />
            <div style={{position: 'absolute', left: 480, width: 120, top: 360, textAlign: 'center', fontFamily: SERIF, fontSize: 110, color: ROSE, opacity: k(6.6, 6.9), lineHeight: 1}}>→</div>
            <DigitStamp t={t} txt="1512" ats={[7.2, 7.45, 7.7, 7.9]} top={330} size={190} width={118} x={580} w={500} />
            <Card x={60} y={620} w={960} h={620} at={5.2} t={t} r={22} pad={8} bg="#fff" rot={0}>
              <Crop src="fresco.jpg" cx={0.745} cy={0.43} wr={1840} w={944} h={604} r={12}>
                <BrainOverlay t={t} a={5.5} b={6.5} fillAt={6.5} />
              </Crop>
            </Card>
          </div>
        )}

""")

# ---- D: врач
cut("        {/* D. 1990", "        {/* E. контур", """        {/* D. 1990, врач из Америки (плитки) */}
        {t >= 8.7 && t < 11.8 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 18, background: BG, transform: `perspective(1600px) rotateY(${flipOut * 90}deg)`, transformOrigin: '0% 50%'}}>
            <DigitStamp t={t} txt="1990" ats={[9.05, 9.3, 9.55, 9.8]} top={330} size={250} width={170} />
            <Card x={90} y={700} w={430} h={520} at={10.1} t={t} r={30} from="left" bg="linear-gradient(160deg,#EAF1FB,#F8E4EE)">
              <Img src={img('doctor.png')} style={{position: 'absolute', left: 15, top: 30, width: 400, height: 'auto'}} />
            </Card>
            <Card x={560} y={720} w={430} h={230} at={10.6} t={t} r={30} from="right">
              <div style={{padding: '26px 34px'}}><div style={{fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: ROSE}}>ВРАЧ ИЗ США</div><div style={{fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 62, color: INK, lineHeight: 1.05}}>Фрэнк<br />Мешбергер</div></div>
            </Card>
            <Chip txt="статья в JAMA" at={11.0} t={t} x={570} y={990} size={28} bg="rgba(255,236,170,0.98)" />
            <Chip txt="иллюстрация" at={10.4} t={t} x={120} y={1245} size={22} bg="rgba(230,225,238,0.98)" />
          </div>
        )}

""")

# ---- E: крупная картина, мозг целиком
cut("        {/* E. контур", "        {/* F. анатомия", """        {/* E. контур Бога = срез мозга (переворот) */}
        {t >= 11.7 && t < 15.6 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 19, background: BG, transform: `perspective(1600px) rotateY(${(1 - flipIn) * -90}deg)`, transformOrigin: '100% 50%'}}>
            <Card x={40} y={390} w={1000} h={770} at={11.9} t={t} r={22} pad={8} bg="#fff" rot={0}>
              <Crop src="fresco.jpg" cx={0.745} cy={0.43} wr={1930 + 40 * k(11.9, 15, easeIO)} w={984} h={754} r={12}>
                <BrainOverlay t={t} a={12.2} b={13.8} fillAt={13.2} />
              </Crop>
            </Card>
            <Chip txt="контур плаща" at={12.4} t={t} x={430} y={1190} size={28} />
            <Chip txt="срез мозга" at={13.9} t={t} x={680} y={1190} size={28} bg="rgba(255,200,225,0.98)" />
            <Chip txt="схематично" at={14.4} t={t} x={430} y={1255} size={24} bg="rgba(230,225,238,0.98)" />
          </div>
        )}

""")

# ---- F + G: наброски, нож, гипотеза
cut("        {/* F. анатомия (жалюзи) */}", "      </div>\n\n      {/* H. финал */}", """        {/* G. гипотеза (под разрезом) */}
        {t >= 17.9 && t < 21.7 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 20, background: BG, overflow: 'hidden'}}>
            {Array.from({length: 13}).map((_, i) => {
              const at = 18.5 + i * 0.09;
              const q = easeOut(Math.min(1, Math.max(0, (t - at) / 0.5)));
              const dir = i % 2 ? 1 : -1;
              return <div key={i} style={{position: 'absolute', left: (i % 3) * -120 - 40, top: 310 + i * 112, whiteSpace: 'nowrap', fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600, fontSize: 118, lineHeight: 1, color: 'rgba(240,150,185,0.32)', opacity: q, transform: `translateY(${(1 - q) * dir * 1100}px)`}}>гипотеза гипотеза гипотеза гипотеза</div>;
            })}
            {t >= 18.95 && (() => {
              const q = spring({frame: f - Math.round(18.95 * fps), fps, config: {damping: 11, stiffness: 170}});
              return <div style={{position: 'absolute', left: 40, width: 1000, top: 700, height: 260, borderRadius: 60, background: 'linear-gradient(135deg,#F7A8C8,#E0709F)', boxShadow: '0 0 0 8px rgba(255,255,255,0.9), 0 0 70px 26px rgba(255,120,185,0.75), 0 30px 70px rgba(150,40,90,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 142, letterSpacing: 6, color: '#fff', textShadow: '0 0 30px rgba(255,255,255,0.8), 0 6px 20px rgba(120,20,70,0.5)', transform: `scale(${Math.min(1.04, q)}) rotate(-3deg)`, zIndex: 30}}>ГИПОТЕЗА</div>;
            })()}
            {[['мозг!', 19.8, 120, 1010, 0], ['совпадение!', 20.3, 480, 1090, 1]].map(([txt, at, x, y, i]) => {
              const q = spring({frame: f - Math.round(at * fps), fps, config: {damping: 9, stiffness: 190}});
              if (t < at) return null;
              return <div key={i} style={{position: 'absolute', left: x, top: y, padding: '14px 36px', borderRadius: 40, background: i ? '#fff' : 'linear-gradient(90deg,#F7C3D2,#E79BB4)', boxShadow: '0 18px 40px rgba(60,50,100,0.25)', fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 62, color: INK, transform: `scale(${Math.min(1.08, q)}) rotate(${i ? 4 : -4}deg)`, zIndex: 31}}>{txt}</div>;
            })}
          </div>
        )}

        {/* F. анатомия: три наброски Микеланджело, потом разрез ножом */}
        {t >= 15.1 && t < 19.05 && (() => {
          const fInner = (
            <div style={{position: 'absolute', inset: 0, background: BG}}>
              {[[60, 430, 470, 610, -4, 15.5, 'sk1.jpg'], [420, 500, 470, 600, 3, 16.2, 'sk2.jpg'], [630, 620, 390, 500, -2, 16.9, 'sk3.jpg']].map(([x, y, w, h, r, at, src], i) => (
                <Card key={i} x={x} y={y} w={w} h={h} at={at} t={t} r={14} rot={r} pad={6} bg="#fff" z={20 + i}><div style={{width: '100%', height: '100%', borderRadius: 8, overflow: 'hidden'}}><Img src={img(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div></Card>
              ))}
              <Chip txt="изучал анатомию" at={15.9} t={t} x={90} y={1085} size={30} z={40} />
              <Chip txt="рисунки Микеланджело" at={16.4} t={t} x={90} y={1150} size={24} bg="rgba(230,225,238,0.98)" z={40} />
              <Chip txt="вскрывал тела" at={17.2} t={t} x={90} y={1215} size={30} bg="rgba(255,236,170,0.98)" z={40} />
            </div>
          );
          const sq = easeIO(k(18.3, 18.95));
          const nx = 0.871 * 1300 * sq, ny = 0.49 * 1300 * sq;
          if (t < 17.9) {
            return (
              <div style={{position: 'absolute', inset: 0, zIndex: 21, clipPath: 'url(#shutH24)'}}>
                <svg width="0" height="0" style={{position: 'absolute'}}><clipPath id="shutH24">{Array.from({length: 8}).map((_, i) => <rect key={i} x={0} y={i * 241} width={t < 15.8 ? shQ(i) * 1080 : 1080} height={242} />)}</clipPath></svg>
                {fInner}
              </div>
            );
          }
          return (
            <>
              <div style={{position: 'absolute', inset: 0, zIndex: 21, clipPath: 'polygon(0px 0px, 1080px 0px, 0px 1920px)', transform: `translate(${-nx}px, ${-ny}px)`}}>{fInner}</div>
              <div style={{position: 'absolute', inset: 0, zIndex: 21, clipPath: 'polygon(1080px 0px, 1080px 1920px, 0px 1920px)', transform: `translate(${nx}px, ${ny}px)`}}>{fInner}</div>
            </>
          );
        })()}
""")

# нож поверх всего
rep("      <Tiles t={t} T={8.7} />", """      <Tiles t={t} T={8.7} />
      {t >= 17.9 && t < 19.1 && (() => {
        const kq = easeIO(k(17.9, 18.5));
        const kp = -0.15 + 1.3 * kq;
        const kx = 1080 - 1080 * kp, ky = 1920 * kp;
        return (
          <>
            <svg width="1080" height="1920" style={{position: 'absolute', left: 0, top: 0, zIndex: 61, pointerEvents: 'none', opacity: 1 - k(18.7, 19.0)}}>
              <line x1="1080" y1="0" x2={kx} y2={ky} stroke="#FFD0E4" strokeWidth="9" strokeLinecap="round" style={{filter: 'drop-shadow(0 0 18px rgba(255,110,185,0.95))'}} />
            </svg>
            <div style={{position: 'absolute', left: kx - 350, top: ky - 36, width: 700, height: 72, zIndex: 62, transform: 'rotate(-60.6deg)', filter: 'drop-shadow(0 18px 18px rgba(0,0,0,0.4))', opacity: 1 - k(18.6, 18.9)}}>
              <Img src={img('scalpel_cut.png')} style={{width: '100%', height: '100%'}} />
            </div>
          </>
        );
      })()}""")
rep("'fresco.jpg', 'michel.jpg', 'p_brain.png'", "'fresco.jpg', 'michel.jpg', 'doctor.png', 'brain_cut.png', 'sk1.jpg', 'sk2.jpg', 'sk3.jpg', 'scalpel_cut.png', 'p_brain.png'")
open(p, 'w', encoding='utf-8').write(s)

g = r'C:\Users\awright\Desktop\Видео Клод\scripts\gen_n24.py'
t = open(g, encoding='utf-8').read()
t = t.replace("{t: 2.9, x: 540, y: 3000, s: 1.0, pose: 'brain', look: 1},", "{t: 2.9, x: 540, y: 3000, s: 1.0, pose: 'brain', look: 1},")
t = t.replace("{t: 17.7, ...SIDE_R, pose: 'ruff', look: -1},\n  {t: 18.2, ...SIDE_R, pose: 'ruff', look: -1},\n  {t: 18.9, ...SIDE_L, pose: 'scared', look: 1},", "{t: 17.4, ...SIDE_R, pose: 'jump', look: -1},\n  {t: 18.0, ...SIDE_L, pose: 'scared', look: 1},")
t = t.replace('ev("whoosh", 42, -0.4, 0.55), ev("tick", 44, 0.0, 0.3), ev("tick", 46, 0.0, 0.3),', 'ev("whoosh", 42, -0.4, 0.55), ev("tick", 44, 0.0, 0.3), ev("tick", 45, 0.0, 0.3),')
t = t.replace('ev("whoosh", 48, -0.3, 0.55), ev("stamp", 51, 0.05, 0.7),', 'ev("shing", 47, 0.2, 0.6), ev("whoosh", 47, 0.35, 0.6), ev("stamp", 51, 0.05, 0.7),')
t = t.replace('"Портрет Микеланджело', '"Наброски: Микеланджело, анатомические этюды (The Met 21.15.1 recto/verso и 21.15.2, CC0; Commons). Скальпель: Commons «Scalpel (PSF).png» (Public domain). Врач на экране — сгенерированная нейросетью иллюстрация (портрет Мешбергера не найден), подписана «иллюстрация».",\n        "Портрет Микеланджело', 1)
open(g, 'w', encoding='utf-8').write(t)
print('ok')
