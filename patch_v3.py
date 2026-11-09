"""Патч Main.jsx под видео 3: разные переходы на каждом стыке, сцены heist/paper, счётчик и секундомер на карточке."""
p = 'remotion/src/Main.jsx'
s = open(p, encoding='utf-8').read()


def r(a, b):
    global s
    assert a in s, a[:70]
    s = s.replace(a, b, 1)


# --- шоты могут менять картинку ---------------------------------------------------
r("  const img = script.images[scene.image];\n  const [iw, ih] = img.size;\n  const base = Math.max(CARD_W / iw, CARD_H / ih);\n  const startF",
  "  const startF")
r("  const shot = shots[si];\n",
  "  const shot = shots[si];\n  const img = script.images[shot.image || scene.image];\n  const [iw, ih] = img.size;\n"
  "  const base = Math.max(CARD_W / iw, CARD_H / ih);\n")

# --- счётчик и секундомер поверх карточки -----------------------------------------
r("        {shot.note && <Note note={shot.note} sf={sf} fps={fps} />}",
  """        {shot.note && <Note note={shot.note} sf={sf} fps={fps} />}
        {scene.counter && <CounterBig c={scene.counter} f={f} startF={startF} fps={fps} />}
        {scene.timer && <Timer tm={scene.timer} f={f} startF={startF} fps={fps} />}""")

r("const PhotoCard = ", """const CounterBig = ({c, f, startF, fps}) => {
  const a = sec(t0(c.at), fps) - startF;
  const p = interpolate(f, [a, a + 26], [0, 1], {...clamp, easing: ease});
  const pop = spring({frame: f - a, fps, config: {damping: 10, stiffness: 170}});
  if (f < a) return null;
  return (
    <div style={{position: 'absolute', left: c.pos[0], top: c.pos[1], zIndex: 7, fontFamily: TITLE, fontWeight: 900, fontSize: 210,
      lineHeight: 1, color: C.blue, WebkitTextStroke: '14px #fff', paintOrder: 'stroke fill',
      textShadow: '0 12px 26px rgba(0,0,0,0.35)', transform: `scale(${Math.min(pop, 1.1)}) rotate(-4deg)`}}>
      {Math.round(c.from + (c.to - c.from) * p)}
    </div>
  );
};

const Timer = ({tm, f, startF, fps}) => {
  const a = sec(t0(tm.at), fps) - startF;
  const p = interpolate(f, [a, a + 45], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const pop = spring({frame: f - a, fps, config: {damping: 10, stiffness: 170}});
  if (f < a) return null;
  const R = 112, L = 2 * Math.PI * R;
  return (
    <div style={{position: 'absolute', right: -20, top: -60, width: 290, height: 290, zIndex: 7, borderRadius: '50%', background: '#fff',
      boxShadow: '0 24px 50px rgba(30,30,30,0.35)', transform: `scale(${Math.min(pop, 1.08)}) rotate(6deg)`}}>
      <svg width="290" height="290" viewBox="0 0 290 290" style={{position: 'absolute', inset: 0}}>
        <circle cx="145" cy="145" r={R} fill="none" stroke="#E4DCCD" strokeWidth="16" />
        <circle cx="145" cy="145" r={R} fill="none" stroke={C.blue} strokeWidth="16" strokeLinecap="round"
          strokeDasharray={L} strokeDashoffset={L * (1 - p)} transform="rotate(-90 145 145)" />
      </svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: TITLE, fontWeight: 900, color: C.blue}}>
        <div style={{fontSize: 110, lineHeight: 1}}>{Math.round(tm.to * p)}</div>
        <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 30, color: C.ink, letterSpacing: 2}}>{tm.label}</div>
      </div>
    </div>
  );
};

const PhotoCard = """)

# --- Ended: произвольные годы ------------------------------------------------------
r("const year = Math.round(1900 + 64 * yearP);",
  "const year = Math.round((scene.yearFrom || 1900) + ((scene.yearTo || 1964) - (scene.yearFrom || 1900)) * yearP);")

# --- Question: плавающие картинки --------------------------------------------------
r("      {scene.floatTubes && tubes}",
  """      {scene.floatTubes && tubes}
      {scene.floatImage && Array.from({length: 8}).map((_, i) => {
        const im = script.images[scene.floatImage.image];
        const x = (i * 197 + 60) % 900, sp = 2 + (i % 4) * 0.8, ph = (i * 233) % 1000;
        const y = 1350 - ((f * sp + ph) % 950);
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 130, height: 130, borderRadius: '50%', opacity: 0.8,
          border: `6px solid ${C.blue}`, boxShadow: '0 10px 24px rgba(30,30,30,0.25)',
          backgroundImage: `url(${staticFile(im.file)})`, backgroundSize: '420%',
          backgroundPosition: `${scene.floatImage.focus[0] * 100}% ${scene.floatImage.focus[1] * 100}%`,
          transform: `rotate(${f * (i % 2 ? 1.2 : -1.2)}deg)`}} />;
      })}""")

# --- новые сцены: heist и paper ----------------------------------------------------
r("const Everyone = ", r'''const Heist = ({dur, scene}) => {
  const {f, fps, inP, out} = useSceneFx(dur);
  const lad = interpolate(f, [8, 44], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const crack = interpolate(f, [50, 58], [0, 1], clamp);
  const flick = 0.75 + 0.25 * Math.sin(f / 2.2);
  const W = 918, H = 940;
  const stamp = spring({frame: f - 56, fps, config: {damping: 8, stiffness: 220}});
  const climbY = 780 - lad * 520;
  return (
    <div style={{position: 'absolute', left: 81, top: 400, width: W, height: H, opacity: Math.min(1, inP * 2.5) * (1 - out),
      transform: `translateY(${(1 - inP) * 500 - out * 300}px) rotate(${-2 * Math.min(inP, 1)}deg) scale(${1 - out * 0.05})`}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 38, overflow: 'hidden', background: 'linear-gradient(#10143A, #232A66)',
        boxShadow: '0 40px 80px rgba(30,30,30,0.35)', border: '14px solid #fff'}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          {Array.from({length: 22}).map((_, i) => (
            <circle key={i} cx={(i * 137) % W} cy={(i * 71) % 330} r={2 + (i % 3)} fill="#fff" opacity={0.35 + 0.35 * Math.sin(f / 8 + i)} />
          ))}
          <circle cx="760" cy="150" r="58" fill="#F3E7B8" />
          <circle cx="738" cy="136" r="52" fill="#10143A" opacity="0.18" />
          <rect x="70" y="360" width="780" height="620" fill="#C9BFAE" />
          <rect x="70" y="360" width="780" height="40" fill="#A99F8D" />
          {[130, 330, 560, 700].map((x, i) => <rect key={i} x={x} y="430" width="46" height="520" fill="#B6AB98" />)}
          <rect x="400" y="500" width="150" height="230" rx="10" fill="#3B3A52" />
          <rect x="408" y="508" width="134" height="214" rx="6" fill={`rgba(255,213,110,${0.55 * flick + 0.2})`} />
          <rect x="471" y="508" width="8" height="214" fill="#3B3A52" />
          <rect x="408" y="610" width="134" height="8" fill="#3B3A52" />
          {crack > 0 && (
            <g stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity={crack}>
              <path d="M475 615 L430 540 M475 615 L525 560 M475 615 L450 700 M475 615 L530 690 M475 615 L410 640" fill="none" />
            </g>
          )}
          <g transform={`translate(0 ${(1 - lad) * 0})`}>
            <line x1="330" y1="900" x2={330 + lad * 90} y2={900 - lad * 340} stroke="#6B4A2B" strokeWidth="14" strokeLinecap="round" />
            <line x1="400" y1="900" x2={400 + lad * 90} y2={900 - lad * 340} stroke="#6B4A2B" strokeWidth="14" strokeLinecap="round" />
            {Array.from({length: 9}).map((_, i) => {
              const k = (i + 1) / 10;
              return <line key={i} x1={330 + lad * 90 * k} y1={900 - lad * 340 * k} x2={400 + lad * 90 * k} y2={900 - lad * 340 * k}
                stroke="#8A5A2B" strokeWidth="10" strokeLinecap="round" />;
            })}
          </g>
          {lad > 0.05 && (
            <g transform={`translate(${365 + lad * 90 * 0.8} ${900 - lad * 340 * 0.8 - 30})`}>
              <circle cx="0" cy="-48" r="22" fill="#0B0B12" />
              <rect x="-22" y="-28" width="44" height="64" rx="14" fill="#0B0B12" />
              <rect x="-34" y="-20" width="14" height="46" rx="7" fill="#0B0B12" transform="rotate(25 -27 0)" />
            </g>
          )}
          <rect x="0" y="940" width={W} height="40" fill="#1A1D3E" />
        </svg>
      </div>
      <Badge text={scene.badge} p={Math.min(inP, 1.1)} />
      {f > 56 && <div style={{position: 'absolute', right: 10, top: H - 200, zIndex: 8, transform: `rotate(7deg) scale(${interpolate(stamp, [0, 1], [2.4, 1])})`,
        opacity: Math.min(1, stamp * 1.6), padding: '10px 26px', border: `8px solid ${C.blue}`, borderRadius: 14, color: C.blue,
        background: 'rgba(245,239,230,0.92)', fontFamily: TITLE, fontWeight: 900, fontSize: 62, whiteSpace: 'nowrap'}}>{scene.stampText}</div>}
      <Chip text={scene.chip} p={Math.min(spring({frame: f - 6, fps, config: {damping: 12}}), 1.1)} />
    </div>
  );
};

const Paper = ({dur, scene}) => {
  const {f, fps, inP, out} = useSceneFx(dur);
  const W = 918, H = 940;
  const typeStart = sec(t0(scene.typeAt), fps) - sec(t0(scene.from), fps);
  const full = scene.text;
  const n = Math.max(0, Math.min(full.length, Math.floor((f - typeStart) * 1.0)));
  const shown = full.slice(0, n).split('\n');
  const stamp = spring({frame: f - sec(t0(scene.stamp.at), fps) + sec(t0(scene.from), fps), fps, config: {damping: 8, stiffness: 220}});
  const stampOn = f >= sec(t0(scene.stamp.at), fps) - sec(t0(scene.from), fps);
  return (
    <div style={{position: 'absolute', left: 81, top: 400, width: W, height: H, opacity: Math.min(1, inP * 2.5) * (1 - out),
      transform: `translateX(${(1 - inP) * -1200 + out * 500}px) rotate(${3 * Math.min(inP, 1) + (1 - inP) * -14}deg) scale(${1 - out * 0.05})`}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 38, overflow: 'hidden', background: '#D8CFBF',
        boxShadow: '0 40px 80px rgba(30,30,30,0.3)', border: '14px solid #fff'}}>
        <div style={{position: 'absolute', left: 110, top: 80, width: 640, height: 760, border: '8px dashed rgba(30,30,30,0.28)', borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 34, color: 'rgba(30,30,30,0.3)',
          letterSpacing: 4, textAlign: 'center', paddingBottom: 380}}>ПУСТОЕ МЕСТО</div>
        <div style={{position: 'absolute', left: 90, top: 300, width: 700, height: 420, background: '#FFFDF6', borderRadius: 8, padding: '70px 50px',
          boxShadow: '0 20px 40px rgba(30,30,30,0.3)', transform: 'rotate(-4deg)'}}>
          <div style={{position: 'absolute', left: 250, top: -26, width: 190, height: 52, background: 'rgba(212,166,74,0.75)', transform: 'rotate(3deg)'}} />
          {shown.map((l, i) => (
            <div key={i} style={{fontFamily: TITLE, fontWeight: 800, fontSize: 70, lineHeight: 1.2, color: C.ink}}>{l}{i === shown.length - 1 && n < full.length ? '|' : ''}</div>
          ))}
        </div>
      </div>
      <Badge text={scene.badge} p={Math.min(inP, 1.1)} />
      {stampOn && <div style={{position: 'absolute', right: 20, top: H - 200, zIndex: 8, transform: `rotate(-7deg) scale(${interpolate(stamp, [0, 1], [2.4, 1])})`,
        opacity: Math.min(1, stamp * 1.6), padding: '10px 26px', border: `8px solid ${C.blue}`, borderRadius: 14, color: C.blue,
        background: 'rgba(245,239,230,0.92)', fontFamily: TITLE, fontWeight: 900, fontSize: 62, whiteSpace: 'nowrap'}}>{scene.stamp.text}</div>}
      <Chip text={scene.chip} p={Math.min(spring({frame: f - 6, fps, config: {damping: 12}}), 1.1)} />
    </div>
  );
};

const Everyone = ''')
r("          : s.type === 'ended' ? <Ended dur={dur} scene={s} />",
  "          : s.type === 'ended' ? <Ended dur={dur} scene={s} />\n          : s.type === 'heist' ? <Heist dur={dur} scene={s} />\n          : s.type === 'paper' ? <Paper dur={dur} scene={s} />")

# --- переходы: разные на каждом стыке ------------------------------------------------
a = s.index('// полоса-«шторка»')
b = s.index('// --- сцены')
trans = r'''// переходы на стыках сцен: у каждого стыка свой (поле trans в сценарии), центр перехода = начало слова
const rnd = (n) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
const TransFx = ({type, d, seed}) => {
  const bandStyle = (color, skew, from, to) => ({position: 'absolute', top: 0, left: 0, width: 760, height: 1920, background: color, opacity: 0.94,
    transform: `translateX(${interpolate(d, [0, 11], [from, to])}px) skewX(${skew}deg)`});
  if (type === 'band') return <div style={bandStyle(C.blue, -14, -1500, 1500)} />;
  if (type === 'diag') return <div style={bandStyle(C.gold, 14, 1500, -1500)} />;
  if (type === 'flash') return <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: interpolate(d, [0, 4, 11], [0, 1, 0])}} />;
  if (type === 'circle') {
    const r = 1500 * Math.sin(Math.PI * d / 11);
    return <div style={{position: 'absolute', left: 540 - r, top: 960 - r, width: r * 2, height: r * 2, borderRadius: '50%', background: C.blue}} />;
  }
  if (type === 'slices') {
    return Array.from({length: 8}).map((_, i) => {
      const x = interpolate(d, [i * 0.4, 5 + i * 0.4, 11], [(i % 2 ? 1 : -1) * 1100, 0, (i % 2 ? -1 : 1) * 1100], clamp);
      return <div key={i} style={{position: 'absolute', left: 0, top: i * 240, width: 1080, height: 241, background: i % 2 ? C.gold : C.blue, transform: `translateX(${x}px)`}} />;
    });
  }
  if (type === 'glitch') {
    if (d % 2) return null;
    return Array.from({length: 5}).map((_, i) => (
      <div key={i} style={{position: 'absolute', left: 0, top: rnd(seed + d + i) * 1700, width: 1080, height: 40 + rnd(seed + i * 3 + d) * 150,
        background: i % 2 ? C.gold : C.blue, opacity: 0.9, transform: `translateX(${(rnd(seed + d * 7 + i) - 0.5) * 220}px)`}} />
    ));
  }
  if (type === 'ink') {
    return Array.from({length: 4}).map((_, i) => {
      const r = 620 * Math.sin(Math.PI * Math.min(1, Math.max(0, (d - i * 0.8) / 9)));
      return <div key={i} style={{position: 'absolute', left: 120 + rnd(seed + i) * 840 - r, top: 300 + rnd(seed + i + 9) * 1300 - r, width: r * 2, height: r * 2,
        borderRadius: '50%', background: i % 2 ? C.gold : C.blue}} />;
    });
  }
  return null;
};

const Wipes = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      {script.scenes.slice(1).map((sc) => {
        const d = f - sec(t0(sc.from), fps) + 5;
        if (d < 0 || d > 11) return null;
        return <React.Fragment key={sc.id}><TransFx type={sc.trans || 'band'} d={d} seed={sc.id * 31} /></React.Fragment>;
      })}
    </>
  );
};

'''
s = s[:a] + trans + s[b:]
open(p, 'w', encoding='utf-8').write(s)
print('ok')
