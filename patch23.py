p = r'C:\Users\awright\Desktop\Видео Клод\scripts\main23_main.jsx'
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


rep("const ASP = {wave: 3840 / 2649, cover: 960 / 1454, hokusai: 673 / 628};", "const ASP = {wave: 3840 / 2649, cover: 960 / 1454, hokusai: 673 / 628, monet: 960 / 1280, debussy: 960 / 1293};")

# ---- B: «1831» крупно, цифры штампуются по одной
rep("""              <div style={{position: 'absolute', left: 0, width: 1080, top: 340, textAlign: 'center'}}><Kin txt="1831" at={4.3} t={t} size={150} weight={300} /></div>""",
    """              <div style={{position: 'absolute', left: 0, width: 1080, top: 285, textAlign: 'center', zIndex: 30, whiteSpace: 'nowrap'}}>
                {['1', '8', '3', '1'].map((d, i) => {
                  const at = [4.3, 4.65, 5.0, 5.4][i];
                  const q = Math.min(1, Math.max(0, (t - at) / 0.2));
                  const e = easeOut(q);
                  const ring = Math.min(1, Math.max(0, (t - at) / 0.45));
                  return (
                    <span key={i} style={{display: 'inline-block', position: 'relative', width: 190, textAlign: 'center'}}>
                      <span style={{display: 'inline-block', fontFamily: SERIF, fontWeight: 700, fontSize: 290, lineHeight: 1, color: INK, opacity: q > 0 ? 1 : 0, transform: `scale(${3.2 - 2.2 * e}) rotate(${(i % 2 ? 1 : -1) * (1 - e) * 14}deg)`, textShadow: '0 10px 0 rgba(196,96,126,0.25)'}}>{d}</span>
                      {t >= at && <span style={{position: 'absolute', left: 95 - 70, top: 150 - 70, width: 140, height: 140, borderRadius: '50%', border: '8px solid rgba(196,96,126,0.55)', opacity: 1 - ring, transform: `scale(${0.5 + ring * 2.6})`}} />}
                    </span>
                  );
                })}
              </div>""")
rep('<Card x={90} y={540} w={900} h={640} at={2.1}', '<Card x={90} y={640} w={900} h={560} at={2.1}')
rep('<Crop src="wave.jpg" cx={0.5} cy={0.5} wr={880 + 60 * k(2.1, 6.4, easeIO)} w={880} h={620} r={12} />', '<Crop src="wave.jpg" cx={0.5} cy={0.5} wr={880 + 60 * k(2.1, 6.4, easeIO)} w={880} h={540} r={12} />')
rep('<Card x={110} y={1210} w={560} h={130} at={2.8}', '<Card x={110} y={1230} w={540} h={130} at={2.8}')

# ---- E: Моне с гравюрой, Дебюсси пишет «Море»
cut('            <Card x={70} y={440} w={470} h={340} at={14.6}', '          </div>\n        )}\n\n        {/* F.', """            <Card x={70} y={450} w={430} h={470} at={14.5} t={t} r={22} rot={-2} pad={8} bg="#fff"><Crop src="monet.jpg" cx={0.5} cy={0.42} wr={414} w={414} h={454} r={14} /></Card>
            <Chip txt="Клод Моне" at={14.9} t={t} x={80} y={390} size={32} />
            <Card x={150} y={800} w={400} h={290} at={15.2} t={t} r={14} rot={-6} pad={7} bg="#fff" z={30} from="left"><Crop src="wave.jpg" cx={0.5} cy={0.5} wr={386} w={386} h={276} r={8} /></Card>
            <Chip txt="собирал гравюры" at={15.6} t={t} x={150} y={1105} size={26} bg="rgba(255,236,170,0.98)" z={32} />
            <Card x={560} y={450} w={430} h={470} at={16.0} t={t} r={22} rot={2} pad={8} bg="#fff" from="right"><Crop src="debussy.jpg" cx={0.55} cy={0.42} wr={414} w={414} h={454} r={14} /></Card>
            <Chip txt="Дебюсси" at={16.4} t={t} x={570} y={390} size={32} />
            <Card x={520} y={950} w={500} h={200} at={16.6} t={t} r={18} rot={-1} pad={0} from="right" z={26}>
              <svg width="500" height="200" viewBox="0 0 500 200" style={{display: 'block'}}>
                {[60, 80, 100, 120, 140].map((y) => <line key={y} x1="24" y1={y} x2="476" y2={y} stroke="#8D8696" strokeWidth="2" />)}
                <text x="30" y="40" fontFamily="Cormorant, serif" fontStyle="italic" fontWeight="600" fontSize="30" fill="#2B2433">La Mer</text>
                {[[60, 120], [100, 100], [140, 140], [180, 80], [220, 110], [260, 130], [300, 90], [340, 120], [380, 100], [420, 140]].map(([x, y], i) => {
                  const q = k(16.9 + i * 0.2, 17.1 + i * 0.2, easeOut);
                  return <g key={i} opacity={q} transform={`translate(0 ${(1 - q) * -20})`}><ellipse cx={x} cy={y} rx="11" ry="8" fill="#2B2433" transform={`rotate(-20 ${x} ${y})`} /><line x1={x + 10} y1={y - 3} x2={x + 10} y2={y - 46} stroke="#2B2433" strokeWidth="3" /></g>;
                })}
              </svg>
            </Card>
            <Chip txt="пишет «Море»" at={17.0} t={t} x={560} y={1175} size={28} />
            <Card x={840} y={760} w={170} h={258} at={17.8} t={t} r={10} rot={7} pad={5} bg="#fff" z={34} from="right"><Crop src="cover.png" cx={0.5} cy={0.5} wr={160} w={160} h={248} r={5} /></Card>
""")

# ---- G: большая собака с лупой и волна на весь экран
cut('        {/* G. узнали бы без подписи? (плитки) */}', '      </div>\n\n      <Tiles', """        {/* G. узнали бы без подписи? (плитки) */}
        {t >= 21.4 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 21, background: '#0f1a4a', overflow: 'hidden'}}>
            <svg width="0" height="0" style={{position: 'absolute'}}><filter id="rip"><feTurbulence type="fractalNoise" baseFrequency="0.006 0.016" numOctaves="2" seed="3" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale={26 + 14 * Math.sin(t * 2.4)} /></filter></svg>
            <div style={{position: 'absolute', inset: -40, filter: 'url(#rip)', transform: `scale(${1.04 + 0.06 * k(21.5, 24, easeIO)})`}}>
              <Crop src="wave.jpg" cx={0.46} cy={0.46} wr={3000 + 200 * Math.sin(t * 1.3)} w={1160} h={2000} />
            </div>
            <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 60%, rgba(0,0,0,0) 40%, rgba(8,14,50,0.55) 100%)'}} />
            {[['А вы бы узнали', 340, 21.55], ['эту волну', 470, 22.0], ['без подписи?', 600, 22.5]].map(([txt, top, at], i) => {
              const q = spring({frame: f - Math.round(at * fps), fps, config: {damping: 13, stiffness: 170}});
              if (t < at) return null;
              return <div key={i} style={{position: 'absolute', left: 0, width: 1080, top, textAlign: 'center', zIndex: 25}}><span style={{display: 'inline-block', padding: '8px 40px 14px', borderRadius: 40, background: i === 2 ? 'linear-gradient(90deg,#F6DE97,#E8B94F)' : 'rgba(255,255,255,0.96)', boxShadow: '0 18px 40px rgba(10,20,70,0.45)', fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 84, color: INK, transform: `scale(${Math.min(1.05, q)}) rotate(${(i - 1) * 1.5}deg)`, opacity: Math.min(1, q * 2)}}>{txt}</span></div>;
            })}
            <Chip txt="пишите в комментариях" at={23.0} t={t} x={60} y={740} size={28} bg="rgba(255,255,255,0.97)" z={26} />
            {t >= 22.6 && (
              <div style={{position: 'absolute', left: 804 - 112, top: 1362 - 112, width: 224, height: 224, borderRadius: '50%', overflow: 'hidden', zIndex: 70, boxShadow: '0 0 0 8px rgba(255,236,170,0.95), 0 0 60px 20px rgba(255,236,170,0.8)', transform: `scale(${easeOut(k(22.6, 23.0))})`, background: '#fff'}}>
                <Crop src="wave.jpg" cx={0.065} cy={0.22} wr={6400} w={224} h={224} />
                <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.5), rgba(255,255,255,0) 40%)'}} />
              </div>
            )}
          </div>
        )}
""")
rep("'p_boat.png', 'p_surf.png', 'p_brush.png', 'p_laugh.png', 'p_open.png'", "'monet.jpg', 'debussy.jpg', 'p_lab.png', 'p_boat.png', 'p_surf.png', 'p_brush.png', 'p_laugh.png', 'p_open.png'")
open(p, 'w', encoding='utf-8').write(s)

g = r'C:\Users\awright\Desktop\Видео Клод\scripts\gen_n23.py'
t = open(g, encoding='utf-8').read()
t = t.replace("{t: 22.0, ...SIDE_L, pose: 'surf', look: 1},\n  {t: 40, ...SIDE_L, pose: 'surf', look: 1},", "{t: 22.0, x: 540, y: 1950, s: 1.35, pose: 'lab', look: 1},\n  {t: 40, x: 540, y: 1950, s: 1.35, pose: 'lab', look: 1},")
t = t.replace('ev("whoosh", 5, -0.4, 0.6), ev("ting", 12, 0.0, 0.3),', 'ev("whoosh", 5, -0.4, 0.6), ev("stamp", 12, -0.1, 0.6), ev("stamp", 13, -0.15, 0.6), ev("stamp", 14, -0.2, 0.6), ev("stamp", 15, -0.1, 0.65),')
t = t.replace('"images": {', '"images": {\n        "monet": {"file": "n23/img/monet.jpg", "size": [960, 1280], "license": "Public domain (Commons: Claude Monet 1899 Nadar crop.jpg)"},\n        "debussy": {"file": "n23/img/debussy.jpg", "size": [960, 1293], "license": "Public domain (Commons: Claude Debussy ca 1908, foto av Félix Nadar.jpg)"},', 1)
open(g, 'w', encoding='utf-8').write(t)
print('ok')
