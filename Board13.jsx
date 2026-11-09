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
const img = (n) => staticFile('n13/img/' + n);
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

const ANTON = 'Anton, Impact, sans-serif';
const ARCH = '"Archivo Black", Arial Black, sans-serif';
const YEL = '#F2C230', BLK = '#141414', PAPER = '#F6F0E2';

const useFonts13 = () => {
  const [h] = React.useState(() => delayRender('f13'));
  React.useEffect(() => {
    const fs = [
      new FontFace('Anton', `url(${staticFile('fonts/Anton-Regular.ttf')})`),
      new FontFace('Archivo Black', `url(${staticFile('fonts/ArchivoBlack-Regular.ttf')})`),
    ];
    Promise.all(fs.map((x) => x.load())).then((l) => { l.forEach((x) => document.fonts.add(x)); continueRender(h); });
  }, [h]);
};

const tornPoly = (seed) => {
  const P = [];
  const n = 8;
  for (let i = 0; i <= n; i++) P.push(`${(i * 100) / n}% ${rnd(seed + i) * 6}%`);
  for (let i = 1; i < 4; i++) P.push(`${100 - rnd(seed + 20 + i) * 3}% ${(i * 100) / 4}%`);
  for (let i = n; i >= 0; i--) P.push(`${(i * 100) / n}% ${100 - rnd(seed + 40 + i) * 6}%`);
  for (let i = 3; i > 0; i--) P.push(`${rnd(seed + 60 + i) * 3}% ${(i * 100) / 4}%`);
  return `polygon(${P.join(',')})`;
};

// слово/надпись на клочке бумаги
const Tile = ({text, cx, cy, rot = 0, bg = YEL, color = BLK, font = ANTON, size = 160, at = 0, f, fps, seed = 1, z = 40, pad = '0.08em 0.28em', ls = 2}) => {
  const p = spring({frame: f - at, fps, config: {damping: 9, stiffness: 190}});
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', left: cx, top: cy, zIndex: z, transform: `translate(-50%,-50%) rotate(${rot + (1 - Math.min(p, 1)) * 14}deg) scale(${interpolate(p, [0, 1], [2.2, 1])})`, opacity: Math.min(1, p * 3),
      filter: 'drop-shadow(8px 14px 10px rgba(5,10,30,0.55))'}}>
      <div style={{clipPath: tornPoly(seed), background: bg, color, fontFamily: font, fontSize: size, lineHeight: 1.05, padding: pad, whiteSpace: 'nowrap', letterSpacing: ls, textTransform: 'uppercase'}}>{text}</div>
    </div>
  );
};

// нотный стан с нотами, которые падают по очереди
const NOTES_A = [[0.06, 3], [0.14, 5], [0.22, 4], [0.30, 6], [0.38, 3], [0.46, 2], [0.54, 4], [0.62, 6], [0.70, 5], [0.78, 3], [0.86, 4], [0.94, 2]];
const NOTES_B = [[0.06, 6], [0.14, 4], [0.22, 7], [0.30, 2], [0.38, 5], [0.46, 7], [0.54, 3], [0.62, 1], [0.70, 6], [0.78, 4], [0.86, 7], [0.94, 5]];
const Staff = ({cx, cy, w = 1000, h = 240, notes, at, f, fps, rot = 0, label, seed = 3, step = 4}) => {
  const p = spring({frame: f - at, fps, config: {damping: 11, stiffness: 150}});
  if (f < at) return null;
  const cnt = Math.floor((f - at) / step);
  return (
    <div style={{position: 'absolute', left: cx, top: cy, zIndex: 30, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${Math.min(p, 1.03)})`, opacity: Math.min(1, p * 3), filter: 'drop-shadow(8px 14px 10px rgba(5,10,30,0.5))'}}>
      <div style={{position: 'relative', width: w, height: h, clipPath: tornPoly(seed), background: PAPER}}>
        {label && <div style={{position: 'absolute', left: 30, top: 14, fontFamily: ARCH, fontSize: 26, letterSpacing: 4, color: '#2B3FA0'}}>{label}</div>}
        {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 24, right: 24, top: 70 + i * 30, height: 3, background: '#222'}} />)}
        {notes.map(([x, y], i) => {
          if (i >= cnt) return null;
          const a = Math.min(1, (f - at - i * step) / 5);
          const ny = 70 + 120 - y * 15;
          return (
            <div key={i} style={{position: 'absolute', left: 24 + x * (w - 48), top: ny - 12 - (1 - a) * 40, opacity: a}}>
              <div style={{width: 30, height: 22, borderRadius: '50%', background: BLK, transform: 'rotate(-20deg)'}} />
              <div style={{position: 'absolute', left: 25, top: -52, width: 4, height: 62, background: BLK}} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// слова на экране появляются по мере произнесения, каждое на своём клочке бумаги
const WORD_STYLE = [[PAPER, BLK, ANTON], [YEL, BLK, ARCH], [BLK, YEL, ANTON], ['#fff', '#2B3FA0', ARCH]];
const Captions13 = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const now = f / fps;
  let chunk = null;
  for (const c of script.captions) if (now >= t0(c[0][1]) - 0.02) chunk = c;
  if (!chunk) return null;
  return (
    <div style={{position: 'absolute', left: 40, top: 160, width: 1000, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px 12px', zIndex: 90}}>
      {chunk.map(([txt, s0], k) => {
        const st = t0(s0) * fps;
        if (f < st - 1) return null;
        const p = spring({frame: f - st, fps, config: {damping: 10, stiffness: 260}});
        const [bg, col, font] = WORD_STYLE[(s0 * 7 + k) % 4];
        const rot = (rnd(s0 * 3 + 1) - 0.5) * 7;
        return (
          <div key={k} style={{transform: `rotate(${rot}deg) scale(${interpolate(p, [0, 1], [1.5, 1])})`, opacity: Math.min(1, p * 3), filter: 'drop-shadow(4px 7px 6px rgba(5,10,30,0.5))'}}>
            <div style={{clipPath: tornPoly(s0 + 5), background: bg, color: col, fontFamily: font, fontSize: font === ANTON ? 78 : 62, lineHeight: 1.05, padding: '4px 16px', textTransform: 'uppercase', letterSpacing: 1}}>{txt}</div>
          </div>
        );
      })}
    </div>
  );
};

const RedInk = ({text, cx, cy, rot = -8, size = 170, at = 0, f, fps}) => {
  const p = spring({frame: f - at, fps, config: {damping: 7, stiffness: 230}});
  if (f < at) return null;
  const shake = f < at + 10 ? Math.sin(f * 4.5) * 10 * (1 - (f - at) / 10) : 0;
  return (
    <div style={{position: 'absolute', left: cx + shake, top: cy, zIndex: 85, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${interpolate(p, [0, 1], [3, 1])})`, opacity: Math.min(1, p * 1.8),
      padding: '0.04em 0.3em', border: `0.07em solid #C8191E`, borderRadius: 14, color: '#C8191E', background: 'rgba(246,240,226,0.94)', fontFamily: ANTON, fontSize: size, lineHeight: 1.1, letterSpacing: 4, whiteSpace: 'nowrap', boxShadow: '8px 14px 14px rgba(5,10,30,0.55)'}}>{text}</div>
  );
};

const Cut = ({file, ratio, cx, cy, w, rot = 0, at = 0, f, fps, z = 10, children}) => {
  const p = pop(f, at, fps);
  if (f < at) return null;
  const e = 1 - Math.min(p, 1);
  const h = w * ratio;
  return (
    <div style={{position: 'absolute', left: cx - w / 2, top: cy - h / 2, width: w, height: h, zIndex: z, transform: `translateY(${-e * 500}px) rotate(${rot + e * 14}deg) scale(${Math.min(p, 1.04) * (1 + e * 0.3)})`, opacity: Math.min(1, p * 3),
      filter: 'drop-shadow(14px 22px 16px rgba(5,10,30,0.6))'}}>
      <img src={img(file)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} />
      {children}
    </div>
  );
};

export const Board13Main = () => {
  useFonts();
  useFonts13();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const T = (w) => sec(t0(w), fps);
  const cam = camAt(f, fps), prev = camAt(Math.max(0, f - 1), fps);
  const speed = Math.hypot((cam.x - prev.x) * cam.z, (cam.y - prev.y) * cam.z) + Math.abs(Math.log(cam.z / prev.z)) * 700;
  const blur = Math.min(8, speed * 0.08);
  const jx = Math.sin(f / 6) * 4, jy = Math.cos(f / 8) * 4, jr = Math.sin(f / 13) * 0.3;
  const yr = Math.round(2000 + 14 * interpolate(f, [T(21), T(23) + 6], [0, 1], {...clamp, easing: ease}));
  const endIn = interpolate(f, [T(45) + 2, T(45) + 16], [0, 1], clamp);
  const tapAt = T(52), tap2At = T(54) + 6;
  const cur = f < tapAt ? 0 : f < tap2At ? 1 : 2;
  const curX = interpolate(f, [T(46) + 14, tapAt - 2, tapAt + 8, tap2At - 4], [820, 600, 600, 640], clamp);
  const curY = interpolate(f, [T(46) + 14, tapAt - 2, tapAt + 8, tap2At - 4], [1500, 800, 810, 1010], clamp);
  const eq = (i) => 30 + 70 * Math.abs(Math.sin(f / 4 + i * 1.7)) * (f >= T(31) ? 1 : 0.15);
  return (
    <AbsoluteFill style={{background: '#4a5870'}}>
      {['bg_slate.jpg', 'cut_notes.png', 'cut_close.png', 'cut_book.png', 'cut_instr.png', 'cut_tri.png'].map((n) => <Img key={n} src={img(n)} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />)}
      <div style={{position: 'absolute', left: 0, top: 0, width: 3000, height: 4500, transformOrigin: '0 0',
        transform: `translate(${540 + jx}px, ${960 + jy}px) rotate(${cam.r + jr}deg) scale(${cam.z}) translate(${-cam.x}px, ${-cam.y}px)`, filter: blur > 0.4 ? `blur(${blur}px)` : undefined}}>
        <img src={img('bg_slate.jpg')} style={{position: 'absolute', left: -200, top: -250, width: 3400, height: 5100}} />
        {/* S0: хук */}
        <Cut file="cut_notes.png" ratio={894 / 1648} cx={900} cy={1060} w={1050} rot={2} at={-8} f={f} fps={fps} z={10} />
        <Tile text="ПЕСНЯ" cx={700} cy={560} rot={-5} bg={YEL} size={230} at={-8} f={f} fps={fps} seed={11} />
        <Tile text="ИЗ АДА" cx={1010} cy={800} rot={4} bg={BLK} color={YEL} size={215} at={-2} f={f} fps={fps} seed={12} />
        <Cut file="cut_close.png" ratio={824 / 1028} cx={900} cy={1420} w={920} rot={-3} at={T(3)} f={f} fps={fps} z={16} />
        <Tile text="НОТЫ!" cx={1210} cy={1140} rot={-8} bg={YEL} size={150} at={T(4)} f={f} fps={fps} seed={13} z={50} />
        {/* S1: Босх, 500 лет */}
        <Cut file="cut_tri.png" ratio={990 / 1648} cx={2100} cy={2200} w={1150} rot={-2} at={T(8)} f={f} fps={fps} z={10} />
        <Tile text="БОСХ" cx={1900} cy={1790} rot={-4} bg={PAPER} font={ARCH} size={170} at={T(9)} f={f} fps={fps} seed={14} />
        <Tile text="500 ЛЕТ" cx={2150} cy={2650} rot={5} bg={YEL} size={200} at={T(12)} f={f} fps={fps} seed={15} />
        <Cut file="cut_instr.png" ratio={1702 / 1248} cx={2650} cy={2150} w={420} rot={5} at={T(15)} f={f} fps={fps} z={20} />
        <Tile text="МУЗЫКАЛЬНЫЙ АД" cx={2150} cy={2820} rot={-2} bg={BLK} color={PAPER} font={ARCH} size={64} at={T(17)} f={f} fps={fps} seed={16} />
        {/* S2: студентка, 2014 */}
        <Tile text={yr} cx={900} cy={2480} rot={-4} bg={BLK} color={YEL} size={300} at={T(21)} f={f} fps={fps} seed={17} />
        <Tile text="ОКЛАХОМА" cx={1000} cy={2800} rot={4} bg={PAPER} size={105} at={T(26)} f={f} fps={fps} seed={18} />
        <Cut file="cut_book.png" ratio={544 / 688} cx={620} cy={3150} w={600} rot={-5} at={T(27)} f={f} fps={fps} z={12} />
        <Staff cx={1050} cy={3500} w={1000} h={240} notes={NOTES_A} at={T(28)} step={4} f={f} fps={fps} rot={-1} label="РАСШИФРОВКА" seed={21} />
        {f >= T(31) && (
          <div style={{position: 'absolute', left: 1450, top: 2980, zIndex: 40, display: 'flex', alignItems: 'flex-end', gap: 8, transform: 'rotate(3deg)'}}>
            <div style={{width: 130, height: 130, borderRadius: '50%', background: '#2B3FA0', border: '8px solid #F6F0E2', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '8px 14px 10px rgba(5,10,30,0.5)', marginRight: 14}}>
              <div style={{width: 0, height: 0, borderTop: '30px solid transparent', borderBottom: '30px solid transparent', borderLeft: '48px solid #fff', marginLeft: 12}} />
            </div>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => <div key={i} style={{width: 22, height: eq(i), background: i % 2 ? YEL : PAPER, borderRadius: 4}} />)}
          </div>
        )}
        {/* S3: гипотеза */}
        <Tile text="ПОДВОХ?" cx={2100} cy={3330} rot={3} bg={BLK} color={YEL} size={210} at={T(33)} f={f} fps={fps} seed={25} z={50} />
        <Tile text="ГИПОТЕЗА" cx={2100} cy={3560} rot={-3} bg={YEL} size={190} at={T(40)} f={f} fps={fps} seed={19} z={50} />
        <Staff cx={2100} cy={3830} w={900} h={220} notes={NOTES_A} at={T(36)} step={2} f={f} fps={fps} rot={2} label="ТРАКТОВКА 1" seed={22} />
        <Staff cx={2100} cy={4110} w={900} h={220} notes={NOTES_B} at={T(38)} step={2} f={f} fps={fps} rot={-2} label="ТРАКТОВКА 2" seed={23} />
        <RedInk text="НЕ ФАКТ" cx={2100} cy={3980} rot={-8} size={190} at={T(43)} f={f} fps={fps} />
      </div>
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, opacity: 0.2, mixBlendMode: 'multiply', zIndex: 62, pointerEvents: 'none'}}>
        <filter id="gn13"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={f % 5} /></filter><rect width="1080" height="1920" filter="url(#gn13)" />
      </svg>
      <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(10,16,34,0.55) 100%)', zIndex: 60}} />
      <div style={{position: 'absolute', left: 60, top: 1610, fontFamily: ARCH, fontSize: 28, letterSpacing: 5, color: 'rgba(255,255,255,0.75)', zIndex: 80}}>{script.diagram.title}</div>
      {/* финал: настоящая песня или шутка */}
      <div style={{position: 'absolute', inset: 0, background: 'rgba(22,30,50,0.92)', opacity: endIn, zIndex: 70}} />
      {f >= T(45) + 2 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 75, opacity: endIn}}>
          <RedInk text="НЕ ФАКТ" cx={540} cy={1440} rot={-6} size={120} at={T(45) + 10} f={f} fps={fps} />
          <Tile text="ЧТО ЭТО?" cx={540} cy={560} rot={-3} bg={YEL} size={190} at={T(45) + 4} f={f} fps={fps} seed={31} z={76} />
          {[['НАСТОЯЩАЯ ПЕСНЯ', 800, 0], ['ШУТКА БОСХА', 1010, 1]].map(([txt, top, i]) => {
            const pr = spring({frame: f - (T(46) + i * 6), fps, config: {damping: 11, stiffness: 150}});
            const glow = i === 1 && f >= tap2At;
            const act = cur === i + 1 || glow;
            return (
              <div key={i} style={{position: 'absolute', left: 90, top, width: 900, height: 150, transform: `rotate(${i ? 1.5 : -1.5}deg) scale(${Math.min(pr, 1.04) * (glow ? 1.06 : 1) * (act && !glow ? 0.96 : 1)})`, opacity: Math.min(1, pr * 2), filter: 'drop-shadow(8px 14px 10px rgba(0,0,0,0.5))'}}>
                <div style={{width: '100%', height: '100%', clipPath: tornPoly(40 + i), background: glow ? YEL : PAPER, color: BLK, fontFamily: ARCH, fontSize: i ? 62 : 56, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{txt}</div>
              </div>
            );
          })}
          <svg width="130" height="150" viewBox="-10 -10 120 140" style={{position: 'absolute', left: curX, top: curY, zIndex: 80, filter: 'drop-shadow(8px 12px 10px rgba(0,0,0,0.5))', transform: `scale(${f >= tapAt && f < tapAt + 6 || f >= tap2At && f < tap2At + 6 ? 0.85 : 1})`}}>
            <path d="M5 5 L5 95 L30 72 L48 112 L66 104 L48 66 L82 66 Z" fill="#fff" stroke="#14143a" strokeWidth="6" strokeLinejoin="round" />
          </svg>
          {f >= tap2At + 4 && <div style={{position: 'absolute', left: 0, width: 1080, top: 1260, textAlign: 'center', fontFamily: HAND, fontWeight: 700, fontSize: 90, color: '#F3D88A', opacity: interpolate(f, [tap2At + 4, tap2At + 16], [0, 1], clamp)}}>решайте сами</div>}
        </div>
      )}
      <Captions13 />
    </AbsoluteFill>
  );
};
