export const Board16bMain = () => {
  useFonts();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const k = (a, b, ease = easeIO) => interpolate(t, [a, b], [0, 1], {...clamp, easing: ease});

  // --- траектория собаки (x, y — низ по центру, s — масштаб)
  const SIDE = {x: 880, y: 1795, s: 0.95};
  const lerp = (a, b, q) => a + (b - a) * q;
  const traj = (tt) => {
    if (tt < 1.5) return {x: 540, y: 1790, s: 1.55};
    if (tt < 2.3) { const q = easeIO((tt - 1.5) / 0.8); return {x: lerp(1500, -480, q), y: 1760, s: 2.6}; }
    if (tt < 3.0) { const q = easeOut((tt - 2.3) / 0.7); return {x: lerp(1250, SIDE.x, q), y: lerp(1895, SIDE.y, q), s: SIDE.s}; }
    if (tt < 12.7) return SIDE;
    if (tt < 13.5) { const q = easeIO((tt - 12.7) / 0.8); return {x: lerp(SIDE.x, 540, q), y: lerp(SIDE.y, 1790, q), s: lerp(SIDE.s, 1.55, q)}; }
    if (tt < 16.4) return {x: 540, y: 1790, s: 1.55};
    if (tt < 17.1) { const q = easeIO((tt - 16.4) / 0.7); return {x: lerp(540, SIDE.x, q), y: lerp(1790, SIDE.y, q), s: lerp(1.55, SIDE.s, q)}; }
    if (tt < 19.0) return SIDE;
    if (tt < 19.8) { const q = easeIO((tt - 19.0) / 0.8); return {x: lerp(SIDE.x, 540, q), y: lerp(SIDE.y, 1790, q), s: lerp(SIDE.s, 1.4, q)}; }
    return {x: 540, y: 1790, s: 1.4};
  };
  const d = traj(t), dp = traj(t - 1 / fps);
  const speed = Math.hypot(d.x - dp.x, d.y - dp.y) * fps;
  const hopAmt = Math.min(1, speed / 900) * Math.abs(Math.sin(f * 0.55)) * 70;
  const front = (t >= 13.3 && t < 16.5) || t < 2.3 || t >= 19.0;

  // --- картина: открывается за смахивающей лапой (1.5–2.3)
  const boundX = t >= 1.5 && t < 2.3 ? traj(t).x - 650 : (t < 1.5 ? 3000 : -3000);
  const clipL = Math.max(0, Math.min(PW, boundX - 140)) / PW * 100;
  const pOut = k(12.9, 13.6);
  const enter = {s: 1 - 0.08 * pOut, origin: '50% 50%', o: (t < 1.6 ? 0 : 1) * (1 - pOut), clip: `inset(0 0 0 ${clipL}%)`};

  // --- корона: центр основания короны на голове (анфас)
  const hx = d.x - (575 * d.s) / 2 + 312 * d.s;
  const hy = d.y - 890 * d.s + 190 * d.s;

  const pic = Math.round(58 * interpolate(t, [17.1, 18.6], [0, 1], {...clamp, easing: easeOut}));
  const picIn = k(16.4, 17.1, easeOut);
  const picOut = k(18.9, 19.4);
  const endIn = k(19.4, 20.0, easeOut);
  const tapAt = 21.1, tap2At = 21.7;
  const cur = t < tapAt ? 0 : t < tap2At ? 1 : 2;
  const curX = interpolate(t, [20.2, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [880, 560, 560, 600], clamp);
  const curY = interpolate(t, [20.2, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [1500, 640, 650, 790], clamp);

  const kinetic = (txt, at, size, color, italic = false, weight = 600, ls = 0) => {
    const q = Math.min(1, Math.max(0, (t - at) / 0.5));
    return <span style={{display: 'inline-block', opacity: q, transform: `translateY(${(1 - easeOut(q)) * 40}px)`, filter: `blur(${(1 - q) * 8}px)`, fontFamily: SERIF, fontWeight: weight, fontStyle: italic ? 'italic' : 'normal', fontSize: size, color, letterSpacing: ls}}>{txt}</span>;
  };

  return (
    <AbsoluteFill style={{background: 'linear-gradient(172deg, #FCF5F2 0%, #F3EAF6 55%, #E8EEF9 100%)'}}>
      {['p_closed.png', 'p_open.png', 'p_wave.png', 'p_laugh.png', 'p_wash.png', 'p_jump.png', 'p_swipe.png', 'crown.png', 'meninas.jpg', 'cub_0.jpg', 'cub_1.jpg', 'cub_2.jpg', 'cub_3.jpg'].map((n) => <Img key={n} src={img(n)} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />)}
      <div style={{position: 'absolute', left: -150 + Math.sin(t / 2.2) * 40, top: 420, width: 620, height: 620, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,176,196,0.5), rgba(244,176,196,0))', zIndex: 1}} />
      <div style={{position: 'absolute', left: 560 + Math.cos(t / 2.7) * 50, top: 1060, width: 640, height: 640, borderRadius: '50%', background: 'radial-gradient(circle, rgba(170,190,250,0.5), rgba(170,190,250,0))', zIndex: 1}} />
      <div style={{position: 'absolute', left: 300, top: 0, width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,226,190,0.45), rgba(255,226,190,0))', zIndex: 1}} />

      {t >= 1.5 && <Painting f={f} fps={fps} enter={enter} />}
      {t >= 4.0 && t < 13.7 && <div style={{opacity: 1 - pOut}}><CaseCard f={f} fps={fps} at={Math.round(4.0 * fps)} /></div>}

      {t >= 16.4 && t < 19.5 && (
        <div style={{opacity: picIn * (1 - picOut)}}>
          <Ribbon f={f} fps={fps} y={410} dir={1} at={Math.round(16.4 * fps)} />
          <Ribbon f={f} fps={fps} y={720} dir={-1} at={Math.round(16.6 * fps)} />
          <div style={{position: 'absolute', left: 0, width: 700, top: 1000, textAlign: 'center', zIndex: 22}}>
            <div style={{fontFamily: SERIF, fontWeight: 300, fontSize: 260, lineHeight: 1, color: INK}}>{pic}</div>
          </div>
          <div style={{position: 'absolute', left: 0, width: 700, top: 1290, textAlign: 'center', zIndex: 22}}>
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: ROSE}}>ВАРИАЦИЙ ПИКАССО</div>
            <div style={{fontFamily: SANS, fontWeight: 400, fontSize: 20, color: SOFT, marginTop: 14, padding: '0 40px'}}>иллюстрации в духе кубизма, не работы Пикассо</div>
          </div>
        </div>
      )}

      {t >= 13.0 && t < 16.5 && (
        <div style={{position: 'absolute', left: 0, width: 1080, top: 390, textAlign: 'center', zIndex: 22, lineHeight: 1.04}}>
          <div>{kinetic('ты стоишь там,', 13.1, 96, INK, false, 500)}</div>
          <div>{kinetic('где должен', 14.4, 96, INK, false, 500)}</div>
          <div>{kinetic('стоять король', 14.9, 130, ROSE, true, 600)}</div>
        </div>
      )}

      <Dog f={f} fps={fps} x={d.x} y={d.y} s={d.s} hopAmt={hopAmt} forceFront={front} />
      {t >= 15.35 && t < 16.5 && <Crown f={f} fps={fps} at={Math.round(15.35 * fps)} x={hx} y={hy} s={d.s * 0.9} />}

      {t >= 19.4 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 50, opacity: endIn}}>
          <div style={{position: 'absolute', left: 0, width: 1080, top: 400, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 112, color: INK}}>Кто здесь главный?</div>
          {[['Инфанта', 560, 0], ['Художник', 710, 1]].map(([txt, top, i]) => {
            const pr = spring({frame: f - Math.round((19.9 + i * 0.15) * fps), fps, config: {damping: 14, stiffness: 160}});
            const glow = i === 1 && t >= tap2At;
            const act = cur === i + 1 || glow;
            return (
              <div key={i} style={{position: 'absolute', left: 170, top, width: 740, height: 120, borderRadius: 60, background: glow ? 'linear-gradient(90deg,#F7C3D2,#E79BB4)' : 'rgba(255,255,255,0.92)', color: INK, fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: glow ? '0 20px 50px rgba(196,96,126,0.45)' : '0 16px 36px rgba(80,50,90,0.18)', transform: `scale(${Math.min(pr, 1.03) * (glow ? 1.05 : 1) * (act && !glow ? 0.97 : 1)})`, opacity: Math.min(1, pr * 2)}}>{txt}</div>
            );
          })}
          <svg width="120" height="140" viewBox="-10 -10 120 140" style={{position: 'absolute', left: curX, top: curY, zIndex: 80, filter: 'drop-shadow(8px 12px 10px rgba(0,0,0,0.3))', transform: `scale(${(t >= tapAt && t < tapAt + 0.2) || (t >= tap2At && t < tap2At + 0.2) ? 0.85 : 1})`}}>
            <path d="M5 5 L5 95 L30 72 L48 112 L66 104 L48 66 L82 66 Z" fill="#fff" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          </svg>
        </div>
      )}
      <div style={{position: 'absolute', left: 60, top: 1622, padding: '12px 26px', borderRadius: 30, background: 'rgba(255,255,255,0.94)', boxShadow: '0 10px 26px rgba(80,50,90,0.18)', fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: INK, zIndex: 85}}>{script.diagram.title}</div>
      <Captions />
    </AbsoluteFill>
  );
};
