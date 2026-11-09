import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing, staticFile, delayRender, continueRender, Img} from 'remotion';
import {script, words} from './current';

// «Доска дела» №10 (Дюшан): тот же приём с нитью повествования, но без красного: золотая нить, латунные кнопки, чернильные штампы.
// Шрифты: Unbounded (заголовки), IBM Plex Mono (документы и ленты), Caveat (рукописные записи), Manrope (субтитры).
const HEAD = 'Unbounded, sans-serif';
const MONO = '"IBM Plex Mono", monospace';
const HAND = 'Caveat, cursive';
const BODY = 'Manrope, sans-serif';
const GOLD = '#D4A64A', INK = '#141C55', CREAM = '#F5EFE6', ULTRA = '#2B3FA0';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const sec = (s, fps) => Math.round(s * fps);
const t0 = (i) => words[i].start;
const img = (n) => staticFile('n11/img/' + n);
const inOut = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const rnd = (n) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
const GT = (a = '#FFF3C4', b = '#D4A64A') => ({background: `linear-gradient(180deg, ${a}, ${b})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent'});

const useFonts = () => {
  const [h] = React.useState(() => delayRender('fonts'));
  React.useEffect(() => {
    const fonts = [
      new FontFace('Unbounded', `url(${staticFile('fonts/Unbounded-VF.ttf')})`, {weight: '200 900'}),
      new FontFace('Caveat', `url(${staticFile('fonts/Caveat-VF.ttf')})`, {weight: '400 700'}),
      new FontFace('IBM Plex Mono', `url(${staticFile('fonts/PlexMono-Medium.ttf')})`, {weight: '500'}),
      new FontFace('IBM Plex Mono', `url(${staticFile('fonts/PlexMono-Bold.ttf')})`, {weight: '700'}),
      new FontFace('Manrope', `url(${staticFile('fonts/Manrope-VF.ttf')})`, {weight: '200 800'}),
    ];
    Promise.all(fonts.map((f) => f.load())).then((l) => { l.forEach((f) => document.fonts.add(f)); continueRender(h); });
  }, [h]);
};

const camAt = (f, fps) => {
  const K = script.cam;
  const arr = K.map((k) => sec(t0(k.w), fps));
  let pos = {x: K[0].x, y: K[0].y, z: K[0].z, r: K[0].r};
  for (let i = 1; i < K.length; i++) {
    const dur = K[i].d ? Math.min(K[i].d, arr[i] - arr[i - 1] - 2) : Math.max(10, Math.min(32, arr[i] - arr[i - 1] - 4));
    const start = arr[i] - dur;
    if (f >= arr[i]) { pos = {x: K[i].x, y: K[i].y, z: K[i].z, r: K[i].r}; continue; }
    if (f >= start) {
      const p = inOut((f - start) / dur);
      const a = K[i - 1], b = K[i];
      pos = {x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p, z: Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * p), r: a.r + (b.r - a.r) * p};
    }
    break;
  }
  return pos;
};
const pop = (f, at, fps) => spring({frame: f - at, fps, config: {damping: 11, stiffness: 130}});

// --- предметы -------------------------------------------------------------------------------------------------------------------------------------------
const Pin = ({x, y, s = 1, p = 1}) => (
  <svg width="120" height="170" viewBox="-60 -150 120 170" style={{position: 'absolute', left: x - 60 * s, top: y - 140 * s, width: 120 * s, height: 170 * s, zIndex: 40, overflow: 'visible',
    transform: `scale(${p})`, filter: 'drop-shadow(8px 14px 10px rgba(0,0,0,0.45))'}}>
    <defs><radialGradient id="pinB" cx="35%" cy="30%"><stop offset="0" stopColor="#FFF3C4" /><stop offset="0.45" stopColor="#D4A64A" /><stop offset="1" stopColor="#6e4b0a" /></radialGradient></defs>
    <path d="M-5 -10 L0 20 L5 -10 Z" fill="#c9ccd6" />
    <ellipse cx="0" cy="-12" rx="40" ry="16" fill="url(#pinB)" />
    <path d="M-22 -14 L-18 -72 Q0 -86 18 -72 L22 -14 Z" fill="url(#pinB)" />
    <ellipse cx="0" cy="-74" rx="30" ry="12" fill="#F3D88A" />
    <ellipse cx="-10" cy="-50" rx="5" ry="22" fill="rgba(255,255,255,0.4)" />
  </svg>
);

const Tape = ({text, x, y, rot = -2, f, at, fps, size = 36, bg = '#111', color = '#fff'}) => {
  const p = pop(f, at, fps);
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, zIndex: 34, padding: '10px 28px', background: bg, color, fontFamily: MONO, fontWeight: 700, fontSize: size, letterSpacing: 3, whiteSpace: 'nowrap',
      clipPath: 'polygon(0 8%, 3% 0, 97% 4%, 100% 12%, 99% 92%, 96% 100%, 3% 96%, 0 90%)', transform: `rotate(${rot}deg) scale(${interpolate(p, [0, 1], [1.8, 1])})`, opacity: Math.min(1, p * 2), boxShadow: '0 10px 18px rgba(0,0,0,0.35)'}}>{text}</div>
  );
};

const Polaroid = ({cx, cy, w, h, file, pos = '50% 30%', cap, rot = 0, at, f, fps, children, tint}) => {
  const p = pop(f, at, fps);
  if (f < at) return null;
  const e = 1 - Math.min(p, 1);
  const top = cy - (h + 134) / 2;
  return (
    <>
      <div style={{position: 'absolute', left: cx - w / 2 - 22, top, width: w + 44, height: h + 134, background: '#F7F2E6', zIndex: 14, boxShadow: '0 30px 50px rgba(0,0,0,0.55), 0 6px 14px rgba(0,0,0,0.4)',
        transform: `translateY(${-e * 500}px) rotate(${rot + e * 12}deg) scale(${1 + e * 0.25})`, opacity: Math.min(1, p * 3)}}>
        <div style={{position: 'absolute', left: 22, top: 22, width: w, height: h, overflow: 'hidden', background: '#111', backgroundImage: file ? `url(${img(file)})` : undefined, backgroundSize: 'cover', backgroundPosition: pos,
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)', filter: tint}}>{children}</div>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 24, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 2, color: '#2a2418'}}>{cap}</div>
        <div style={{position: 'absolute', left: -40, top: 10, width: 130, height: 46, background: 'rgba(235,222,180,0.82)', transform: 'rotate(-38deg)'}} />
        <div style={{position: 'absolute', right: -40, top: 10, width: 130, height: 46, background: 'rgba(235,222,180,0.82)', transform: 'rotate(38deg)'}} />
      </div>
      <Pin x={cx} y={top + 16} s={0.95} p={Math.min(1, p * 2)} />
    </>
  );
};

const Thread = ({a, b, at, f, fps, sag = 90}) => {
  const p = interpolate(f, [at, at + 26], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  if (f < at) return null;
  const d = `M${a[0]} ${a[1]} Q${(a[0] + b[0]) / 2} ${(a[1] + b[1]) / 2 + sag} ${b[0]} ${b[1]}`;
  return (
    <>
      <path d={d} fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="9" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} transform="translate(8 12)" />
      <path d={d} fill="none" stroke={GOLD} strokeWidth="7" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} style={{filter: 'drop-shadow(0 0 8px rgba(212,166,74,0.7))'}} />
    </>
  );
};

const OldPaper = ({cx, cy, w, rot = 0, flip = false, at, f, fps, children, z = 12}) => {
  const p = pop(f, at, fps);
  if (f < at) return null;
  const e = 1 - Math.min(p, 1);
  const h = w * 1271 / 900;
  return (
    <div style={{position: 'absolute', left: cx - w / 2, top: cy - h / 2, width: w, height: h, zIndex: z, transform: `translateY(${-e * 500}px) rotate(${rot + e * 10}deg) scale(${1 + e * 0.2})`, opacity: Math.min(1, p * 3),
      filter: 'drop-shadow(14px 24px 22px rgba(0,0,0,0.55))'}}>
      <img src={img('paper_old.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', transform: flip ? 'scaleX(-1)' : undefined}} />
      <div style={{position: 'absolute', inset: 0}}>{children}</div>
    </div>
  );
};

const Ink = ({text, x, y, rot = -8, size = 120, f, at, fps, color = INK}) => {
  const p = spring({frame: f - at, fps, config: {damping: 7, stiffness: 230}});
  if (f < at) return null;
  const shake = f < at + 10 ? Math.sin(f * 4.5) * 10 * (1 - (f - at) / 10) : 0;
  return (
    <div style={{position: 'absolute', left: x + shake, top: y, zIndex: 40, padding: '0 34px', border: `12px solid ${color}`, color, fontFamily: HEAD, fontWeight: 900, fontSize: size, lineHeight: 1.1, letterSpacing: 2,
      background: 'rgba(245,235,215,0.9)', transform: `rotate(${rot}deg) scale(${interpolate(p, [0, 1], [3, 1])})`, opacity: Math.min(1, p * 1.8), boxShadow: '0 24px 40px rgba(0,0,0,0.5)', whiteSpace: 'nowrap'}}>{text}</div>
  );
};

const Sticky = ({x, y, text, rot = 0, at = 0, f, fps, size = 64}) => {
  const p = pop(f, at, fps);
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', left: x - 120, top: y - 120, width: 240, height: 240, zIndex: 13, background: 'linear-gradient(160deg, #F7E9A6, #E9D27A)', boxShadow: '0 20px 30px rgba(0,0,0,0.5)',
      transform: `rotate(${rot}deg) scale(${Math.min(p, 1.05)})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HAND, fontWeight: 700, fontSize: size, color: '#2a2418', textAlign: 'center', padding: 14, lineHeight: 1}}>{text}</div>
  );
};

const Captions = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const now = f / fps;
  let chunk = null;
  for (const c of script.captions) if (now >= t0(c[0][1]) - 0.06) chunk = c;
  if (!chunk) return null;
  const a = Math.min(1, Math.max(0, (now - (t0(chunk[0][1]) - 0.06)) / 0.2));
  return (
    <div style={{position: 'absolute', left: 60, top: 170, width: 960, textAlign: 'center', fontFamily: HEAD, fontWeight: 700, fontSize: 48, lineHeight: 1.22, opacity: a, filter: `blur(${(1 - a) * 8}px)`,
      transform: `translateY(${(1 - a) * 12}px)`, textWrap: 'balance', textShadow: '0 4px 24px rgba(0,0,0,0.9)', zIndex: 80}}>
      {chunk.map(([txt, s0], i) => <span key={i} style={{color: now >= words[s0].start ? '#fff' : 'rgba(255,255,255,0.32)'}}>{txt}{' '}</span>)}
    </div>
  );
};

const Cut = ({file, ratio, cx, cy, w, rot = 0, at = 0, f, fps, z = 10, shadow = true, children, dy = 0, origin}) => {
  const p = pop(f, at, fps);
  if (f < at) return null;
  const e = 1 - Math.min(p, 1);
  const h = w * ratio;
  return (
    <div style={{position: 'absolute', left: cx - w / 2, top: cy - h / 2 + dy, width: w, height: h, zIndex: z, transform: `translateY(${-e * 400}px) rotate(${rot + e * 12}deg) scale(${Math.min(p, 1.04)})`, opacity: Math.min(1, p * 3),
      transformOrigin: origin, filter: shadow ? 'drop-shadow(14px 24px 18px rgba(0,0,0,0.55))' : undefined}}>
      <img src={img(file)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} />
      {children}
    </div>
  );
};

const Coin = ({x, y, s = 100, f, at, fps, part = 1}) => {
  const p = spring({frame: f - at, fps, config: {damping: 9, stiffness: 190}});
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: s * part, height: s, overflow: 'hidden', transform: `scale(${Math.min(p, 1.1)}) translateY(${(1 - Math.min(p, 1)) * -160}px)`, opacity: Math.min(1, p * 3)}}>
      <div style={{width: s, height: s, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #FFF3C4, #D4A64A 55%, #8A6419)', border: '5px solid #F3D88A', boxShadow: '0 8px 12px rgba(0,0,0,0.45), inset 0 0 0 7px rgba(138,100,25,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontWeight: 900, fontSize: s * 0.5, color: '#6e4b0a', textShadow: '1px 2px 0 rgba(255,236,170,0.8)'}}>£</div>
    </div>
  );
};

const Bubble = ({text, x, y, w, mine, f, at, fps, size = 34}) => {
  const p = pop(f, at, fps);
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, padding: '20px 26px', borderRadius: mine ? '30px 30px 6px 30px' : '30px 30px 30px 6px', fontFamily: HEAD, fontWeight: 700, fontSize: size, lineHeight: 1.2,
      background: mine ? 'linear-gradient(90deg, #FFF0B8, #D4A64A)' : 'rgba(255,255,255,0.14)', color: mine ? '#2a1a05' : '#fff', transformOrigin: mine ? '100% 100%' : '0 100%',
      transform: `scale(${Math.min(p, 1.04)})`, opacity: Math.min(1, p * 3), boxShadow: '0 12px 20px rgba(0,0,0,0.35)'}}>{text}</div>
  );
};

export const Board11Main = () => {
  useFonts();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const T = (w) => sec(t0(w), fps);
  const cam = camAt(f, fps), prev = camAt(Math.max(0, f - 1), fps);
  const speed = Math.hypot((cam.x - prev.x) * cam.z, (cam.y - prev.y) * cam.z) + Math.abs(Math.log(cam.z / prev.z)) * 700;
  const blur = Math.min(6, speed * 0.07);
  const jx = Math.sin(f / 9) * 5, jy = Math.cos(f / 11) * 5, jr = Math.sin(f / 17) * 0.25;
  const typed = (s, at, spd = 1.2) => s.slice(0, Math.max(0, Math.min(s.length, Math.floor((f - at) * spd))));
  const yr = Math.round(2000 + 18 * interpolate(f, [T(14), T(16) + 4], [0, 1], {...clamp, easing: ease}));
  const frameP = pop(f, T(26), fps);
  const shred = interpolate(f, [T(31), T(36)], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
  const shake = f >= T(31) && f < T(33) + 6 ? Math.sin(f * 3.1) * 6 : 0;
  const c0 = T(54), c1 = T(60) + 6;
  const price = interpolate(f, [c0, c1], [1, 18.6], {...clamp, easing: Easing.linear});
  const endIn = interpolate(f, [T(65) - 6, T(65) + 14], [0, 1], clamp);
  const tapAt = T(68) + 8, tap2At = T(72) + 6;
  const cur = f < tapAt ? 0 : f < tap2At ? 1 : 2;
  const curX = interpolate(f, [T(65) + 10, tapAt - 2, tapAt + 8, tap2At - 4], [820, 600, 600, 640], clamp);
  const curY = interpolate(f, [T(65) + 10, tapAt - 2, tapAt + 8, tap2At - 4], [1500, 840, 850, 1040], clamp);
  const pins = {A: [1500, 380], B: [700, 1309], C: [2480, 969], D: [1500, 2300], F: [2350, 2685], G: [1500, 4060]};
  const N = 20, SW = 28;
  const hit = T(21);
  const gp = interpolate(f, [hit - 16, hit], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const gRot = f < hit ? 42 * (1 - gp) : -5 * Math.exp(-(f - hit) / 5) * Math.cos((f - hit) / 2);
  const paddleUp = pop(f, T(19), fps);
  return (
    <AbsoluteFill style={{background: '#05201f'}}>
      {['hero.jpg', 'hall.jpg', 'bg_teal.jpg', 'coins_c.png', 'gavel_c.png', 'paddle_c.png'].map((n) => <Img key={n} src={img(n)} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />)}
      <div style={{position: 'absolute', left: 0, top: 0, width: 3000, height: 4500, transformOrigin: '0 0',
        transform: `translate(${540 + jx}px, ${960 + jy}px) rotate(${cam.r + jr}deg) scale(${cam.z}) translate(${-cam.x}px, ${-cam.y}px)`, filter: blur > 0.4 ? `blur(${blur}px)` : undefined}}>
        <img src={img('bg_teal.jpg')} style={{position: 'absolute', left: -200, top: -250, width: 3400, height: 5900}} />
        <svg width="3000" height="4500" style={{position: 'absolute', left: 0, top: 0, zIndex: 30, overflow: 'visible', pointerEvents: 'none'}}>
          <Thread a={pins.A} b={pins.B} at={T(13)} f={f} fps={fps} sag={130} />
          <Thread a={pins.B} b={pins.C} at={T(20)} f={f} fps={fps} sag={120} />
          <Thread a={pins.C} b={pins.D} at={T(26)} f={f} fps={fps} sag={150} />
          <Thread a={pins.D} b={pins.F} at={T(37)} f={f} fps={fps} sag={120} />
          <Thread a={pins.F} b={pins.G} at={T(41)} f={f} fps={fps} sag={150} />
        </svg>
        {/* декор: сгенерированные предметы */}
        <Cut file="coins_c.png" ratio={1086 / 1360} cx={380} cy={650} w={480} rot={-6} f={f} fps={fps} z={5} />
        <Cut file="paddle_c.png" ratio={1247 / 732} cx={2650} cy={2300} w={230} rot={14} f={f} fps={fps} z={5} />
        <Cut file="gavel_c.png" ratio={877 / 1033} cx={380} cy={3150} w={420} rot={-18} f={f} fps={fps} z={5} />
        <Cut file="coins_c.png" ratio={1086 / 1360} cx={2400} cy={4300} w={520} rot={5} at={T(54)} f={f} fps={fps} z={5} />
        {/* A: хук, иллюстрация рамы со шредером */}
        <Polaroid cx={1500} cy={830} w={600} h={800} file="hero.jpg" pos="50% 50%" cap="ИЛЛЮСТРАЦИЯ" rot={-2} at={0} f={f} fps={fps} />
        <Ink text="£1 000 000" x={1200} y={1100} rot={-8} size={60} f={f} at={T(3)} fps={fps} />
        <Tape text="РЕЖЕТ САМА СЕБЯ" x={1180} y={1340} rot={-3} f={f} at={T(10)} fps={fps} size={40} />
        {/* B: аукционный зал и билет */}
        <Polaroid cx={700} cy={1650} w={440} h={580} file="hall.jpg" pos="50% 50%" cap="ЛОНДОН · ТОРГИ" rot={-4} at={T(13)} f={f} fps={fps} />
        {f >= T(14) && (() => {
          const p = pop(f, T(14), fps);
          return (
            <div style={{position: 'absolute', left: 420, top: 2030, width: 560, height: 230, zIndex: 16, transform: `rotate(5deg) scale(${Math.min(p, 1.04)})`, opacity: Math.min(1, p * 3), filter: 'drop-shadow(10px 18px 14px rgba(0,0,0,0.5))'}}>
              <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #FBF3DE, #E9DCB0)', clipPath: 'polygon(0 0, 100% 0, 100% 36%, 97% 40%, 97% 60%, 100% 64%, 100% 100%, 0 100%, 0 64%, 3% 60%, 3% 40%, 0 36%)'}} />
              <div style={{position: 'absolute', left: 40, top: 22, fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 5, color: 'rgba(42,36,24,0.7)'}}>СОТБИС · ЛОНДОН</div>
              <div style={{position: 'absolute', left: 40, top: 60, fontFamily: HEAD, fontWeight: 900, fontSize: 110, lineHeight: 1.1, color: '#1C2A82'}}>{yr}</div>
              <div style={{position: 'absolute', right: 30, top: 28, bottom: 28, width: 0, borderLeft: '5px dashed rgba(42,36,24,0.45)'}} />
              <div style={{position: 'absolute', right: 52, top: 80, fontFamily: HAND, fontWeight: 700, fontSize: 56, color: '#2a2418', transform: 'rotate(90deg)', transformOrigin: '100% 0', whiteSpace: 'nowrap'}}>вход</div>
            </div>
          );
        })()}
        {/* C: паддл, молоток, «Девочка с шариком» */}
        <Cut file="paddle_c.png" ratio={1247 / 732} cx={2020} cy={1300} w={320} rot={-9} at={T(19)} f={f} fps={fps} z={12} dy={-(1 - Math.min(paddleUp, 1)) * 80}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontFamily: HEAD, fontWeight: 900, fontSize: 190, color: '#1C2A82', lineHeight: 1}}>£</div>
        </Cut>
        <Polaroid cx={2480} cy={1280} w={340} h={460} file="hero.jpg" pos="50% 22%" cap="ДЕВОЧКА С ШАРИКОМ" rot={3} at={T(23)} f={f} fps={fps} />
        <Cut file="gavel_c.png" ratio={877 / 1033} cx={2250} cy={1750} w={560} rot={gRot} at={T(20) - 10} f={f} fps={fps} z={16} origin="90% 88%" />
        <Ink text="ПРОДАНО" x={1900} y={1900} rot={-8} size={96} f={f} at={hit + 3} fps={fps} />
        {/* D: шредер в раме */}
        {f >= T(26) && (() => {
          const e = 1 - Math.min(frameP, 1);
          const L = 1500 - 304, TP = 2310;
          const bg = {backgroundImage: `url(${img('hero.jpg')})`, backgroundSize: '1204px 1597px'};
          return (
            <>
              <div style={{position: 'absolute', left: L + shake, top: TP, width: 608, height: 773, zIndex: 14, transform: `translateY(${-e * 600}px) rotate(${-1 + e * 8}deg) scale(${1 + e * 0.2})`, opacity: Math.min(1, frameP * 3)}}>
                <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #FFF3C4, #D4A64A 40%, #8A6419 70%, #E7C26B)', boxShadow: '0 40px 60px rgba(0,0,0,0.6), inset 0 0 0 6px rgba(255,243,196,0.6), inset 0 0 20px rgba(60,38,6,0.7)'}} />
                <div style={{position: 'absolute', left: 24, top: 24, width: 560, height: 725, background: '#E6D9B0', boxShadow: 'inset 0 0 30px rgba(60,40,10,0.45)'}}>
                  <div style={{position: 'absolute', left: 0, top: 0, width: 560, height: 362, ...bg, backgroundPosition: '-346px -449px'}} />
                  <div style={{position: 'absolute', left: 0, bottom: 0, width: 560, height: 10, background: '#111', zIndex: 1}} />
                  {Array.from({length: N}).map((_, i) => {
                    const d = shred * (20 + (i % 5) * 35 + 100) + (i % 3) * 6 * shred;
                    return <div key={i} style={{position: 'absolute', left: i * SW, top: 362 + d, width: SW - 1, height: 363, ...bg, backgroundPosition: `${-346 - i * SW}px -811px`, zIndex: 2,
                      transform: `rotate(${(i % 2 ? 1 : -1) * shred * (1 + (i % 3))}deg)`, boxShadow: '2px 4px 6px rgba(0,0,0,0.25)'}} />;
                  })}
                </div>
              </div>
              <Pin x={pins.D[0]} y={pins.D[1]} s={0.95} p={Math.min(1, frameP * 2)} />
            </>
          );
        })()}
        {f < T(41) && <Tape text="ПОЛОВИНА ПОЛОТНА" x={1230} y={3380} rot={2} f={f} at={T(35)} fps={fps} size={34} />}
        {/* F: переписка с аукционистом */}
        {f >= T(37) && (() => {
          const p = pop(f, T(37), fps), e = 1 - Math.min(p, 1);
          return (
            <>
              <div style={{position: 'absolute', left: 2070, top: 2670, width: 560, height: 760, zIndex: 13, borderRadius: 44, background: 'linear-gradient(170deg, #1C2A82, #0A0F3A)', border: '6px solid #F3D88A',
                transform: `translateY(${-e * 500}px) rotate(${2 + e * 8}deg) scale(${1 + e * 0.2})`, opacity: Math.min(1, p * 3), boxShadow: '0 36px 60px rgba(0,0,0,0.6)'}}>
                <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 120, borderRadius: '38px 38px 0 0', background: 'rgba(255,255,255,0.08)'}} />
                <div style={{position: 'absolute', left: 34, top: 40, width: 60, height: 60, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #FFF3C4, #D4A64A 60%, #8A6419)'}} />
                <div style={{position: 'absolute', left: 112, top: 54, fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: '#F3D88A'}}>АУКЦИОНИСТ</div>
                <Bubble text="Покупательница, вы откажетесь от сделки?" x={34} y={160} w={400} f={f} at={T(38)} fps={fps} size={32} />
                <Bubble text="Нет!" x={300} y={400} w={226} mine f={f} at={T(40)} fps={fps} size={64} />
                {f >= T(40) + 10 && <div style={{position: 'absolute', left: 34, top: 600, fontFamily: HAND, fontWeight: 700, fontSize: 76, color: '#F3D88A', opacity: interpolate(f, [T(40) + 10, T(40) + 22], [0, 1], clamp)}}>✓ беру!</div>}
              </div>
              <Pin x={pins.F[0]} y={pins.F[1]} s={0.95} p={Math.min(1, p * 2)} />
            </>
          );
        })()}
        {/* G: цена, монеты */}
        {f >= T(41) && (() => {
          const p = pop(f, T(41), fps), e = 1 - Math.min(p, 1);
          const coins = Array.from({length: 19});
          return (
            <>
              <div style={{position: 'absolute', left: 940, top: 4050, width: 1120, height: 760, zIndex: 13, borderRadius: 28, background: 'linear-gradient(160deg, #1C2A82, #0A0F3A)', border: '8px solid #D4A64A',
                boxShadow: '0 40px 70px rgba(0,0,0,0.6)', transform: `translateY(${-e * 600}px) rotate(${1 + e * 8}deg) scale(${1 + e * 0.2})`, opacity: Math.min(1, p * 3)}}>
                <div style={{position: 'absolute', left: 50, top: 34, fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: 6, color: '#F3D88A'}}>ЦЕНА ПРИ ПРОДАЖЕ</div>
                {/* 2018: одна монета */}
                <div style={{position: 'absolute', left: 60, top: 160, width: 280, textAlign: 'center', fontFamily: HEAD, fontWeight: 900, fontSize: 40, color: '#fff'}}>2018</div>
                <Coin x={115} y={250} s={170} f={f} at={T(41) + 6} fps={fps} />
                <div style={{position: 'absolute', left: 60, top: 450, width: 280, textAlign: 'center', fontFamily: HEAD, fontWeight: 900, fontSize: 44, color: '#fff'}}>≈ £1 МЛН</div>
                <div style={{position: 'absolute', left: 380, top: 150, width: 6, height: 520, background: 'rgba(255,255,255,0.25)'}} />
                {/* 2021: 18,6 монет */}
                {f >= T(44) && <div style={{position: 'absolute', left: 430, top: 160, fontFamily: HEAD, fontWeight: 900, fontSize: 40, color: '#F3D88A'}}>2021</div>}
                {f >= c0 - 4 && <div style={{position: 'absolute', left: 430, top: 540, fontFamily: HEAD, fontWeight: 900, fontSize: 84, color: '#fff', textShadow: '0 0 30px rgba(212,166,74,0.8)'}}>£{price.toFixed(1).replace('.', ',')} МЛН</div>}
                {coins.map((_, i) => {
                  const col = i % 7, row = Math.floor(i / 7);
                  const at = Math.round(c0 + (i / 19) * (c1 - c0));
                  return <Coin key={i} x={430 + col * 92} y={230 + row * 92} s={84} f={f} at={at} fps={fps} part={i === 18 ? 0.6 : 1} />;
                })}
              </div>
              <Pin x={pins.G[0]} y={pins.G[1]} s={1} p={Math.min(1, p * 2)} />
            </>
          );
        })()}
        <Tape text="«ЛЮБОВЬ В МУСОРКЕ»" x={900} y={3930} rot={-2} f={f} at={T(50)} fps={fps} size={34} />
        <Ink text="×18" x={1560} y={3940} rot={-9} size={130} f={f} at={T(62)} fps={fps} />
      </div>
      {/* свет, пыль, зерно */}
      <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 42%, rgba(255,230,170,0.14), rgba(0,0,0,0) 55%), radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(1,18,18,0.72) 100%)', zIndex: 60}} />
      {Array.from({length: 22}).map((_, i) => {
        const x = ((i * 193 + f * (0.5 + (i % 4) * 0.25)) % 1160) - 40, y = ((i * 311 - f * (0.6 + (i % 3) * 0.3)) % 2000 + 2000) % 2000;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 4 + (i % 3) * 2, height: 4 + (i % 3) * 2, borderRadius: '50%', background: '#FBE6A3', opacity: 0.18 + 0.2 * Math.sin(f / 8 + i), zIndex: 61}} />;
      })}
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, opacity: 0.12, mixBlendMode: 'overlay', zIndex: 62, pointerEvents: 'none'}}>
        <filter id="gn11"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 6} /></filter><rect width="1080" height="1920" filter="url(#gn11)" />
      </svg>
      <div style={{position: 'absolute', left: 60, top: 1610, fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: 5, color: 'rgba(255,255,255,0.75)', zIndex: 80}}>{script.diagram.title}</div>
      {/* финал: выбор «вандализм или шутка» */}
      <div style={{position: 'absolute', inset: 0, background: 'rgba(2,22,24,0.9)', opacity: endIn, zIndex: 70}} />
      {f >= T(65) - 6 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 75, opacity: endIn}}>
          <div style={{position: 'absolute', left: 0, width: 1080, top: 480, textAlign: 'center', fontFamily: HEAD, fontWeight: 900, fontSize: 96, color: '#fff', textShadow: '0 8px 30px rgba(0,0,0,0.5)'}}>ЧТО ЭТО?</div>
          {[['ВАНДАЛИЗМ', 760], ['САМАЯ ДОРОГАЯ ШУТКА', 960]].map(([txt, top], i) => {
            const act = cur === i + 1 || (i === 1 && f >= tap2At);
            const pr = spring({frame: f - (T(65) + 4 + i * 6), fps, config: {damping: 11, stiffness: 140}});
            const glow = i === 1 && f >= tap2At;
            return (
              <div key={i} style={{position: 'absolute', left: 90, top, width: 900, height: 150, borderRadius: 75, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontWeight: 900, fontSize: i ? 42 : 60,
                color: glow ? '#2a1a05' : '#fff', background: glow ? 'linear-gradient(90deg, #FFF0B8, #D4A64A)' : 'rgba(255,255,255,0.14)', border: `4px solid ${glow ? '#fff' : 'rgba(255,255,255,0.5)'}`,
                transform: `scale(${Math.min(pr, 1.04) * (act && !glow ? 0.96 : 1) * (glow ? 1.06 + 0.02 * Math.sin(f / 4) : 1)})`, boxShadow: glow ? '0 0 70px rgba(212,166,74,0.9)' : '0 16px 30px rgba(0,0,0,0.35)', opacity: Math.min(1, pr * 2)}}>{txt}</div>
            );
          })}
          <svg width="130" height="150" viewBox="-10 -10 120 140" style={{position: 'absolute', left: curX, top: curY, zIndex: 80, filter: 'drop-shadow(8px 12px 10px rgba(0,0,0,0.5))', transform: `scale(${f >= tapAt && f < tapAt + 6 || f >= tap2At && f < tap2At + 6 ? 0.85 : 1})`}}>
            <path d="M5 5 L5 95 L30 72 L48 112 L66 104 L48 66 L82 66 Z" fill="#fff" stroke="#14143a" strokeWidth="6" strokeLinejoin="round" />
          </svg>
          {f >= tap2At + 4 && <div style={{position: 'absolute', left: 0, width: 1080, top: 1230, textAlign: 'center', fontFamily: HAND, fontWeight: 700, fontSize: 90, color: '#F3D88A', opacity: interpolate(f, [tap2At + 4, tap2At + 16], [0, 1], clamp)}}>решайте сами</div>}
        </div>
      )}
      <Captions />
    </AbsoluteFill>
  );
};
