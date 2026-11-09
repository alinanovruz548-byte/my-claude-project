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
const img = (n) => staticFile('n10/img/' + n);
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

export const Board10Main = () => {
  useFonts();
  const f = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const T = (w) => sec(t0(w), fps);
  const cam = camAt(f, fps), prev = camAt(Math.max(0, f - 1), fps);
  const speed = Math.hypot((cam.x - prev.x) * cam.z, (cam.y - prev.y) * cam.z) + Math.abs(Math.log(cam.z / prev.z)) * 700;
  const blur = Math.min(6, speed * 0.07);
  const jx = Math.sin(f / 9) * 5, jy = Math.cos(f / 11) * 5, jr = Math.sin(f / 17) * 0.25;
  const typed = (s, at, spd = 0.9) => s.slice(0, Math.max(0, Math.min(s.length, Math.floor((f - at) * spd))));
  const sig = interpolate(f, [T(3), T(4) + 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const sig2 = interpolate(f, [T(26) - 4, T(27) + 8], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const plaque = pop(f, T(7), fps);
  const yr1917 = Math.round(1900 + 17 * interpolate(f, [T(12), T(15) + 4], [0, 1], {...clamp, easing: ease}));
  const span = Math.round(1917 + 87 * interpolate(f, [T(36), T(39) + 6], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)}));
  const count = Math.round(500 * interpolate(f, [T(40) - 4, T(41) + 10], [0, 1], {...clamp, easing: ease}));
  const endIn = interpolate(f, [T(49) - 6, T(49) + 14], [0, 1], clamp);
  const pins = {A: [760, 640], B: [2250, 840], C: [1500, 1600], D: [650, 1210], E: [760, 1560], F: [2250, 1800], G: [1500, 3760], BM: [900, 2330]};
  const rows = [['1', 'ФОНТАН', 'Дюшан'], ['2', 'АВИНЬОНСКИЕ ДЕВИЦЫ', 'Пикассо'], ['3', 'ДИПТИХ МЭРИЛИН', 'Уорхол']];
  const tapAt = T(52), tap2At = T(54);
  const cur = f < tapAt ? 0 : f < tap2At ? 1 : 2;
  const curX = interpolate(f, [T(49) + 10, tapAt - 2, tapAt + 8, tap2At - 4], [820, 600, 600, 640], clamp);
  const curY = interpolate(f, [T(49) + 10, tapAt - 2, tapAt + 8, tap2At - 4], [1500, 840, 850, 1040], clamp);
  return (
    <AbsoluteFill style={{background: '#070b2a'}}>
      {['n10_01_fountain.jpg', 'n10_02_blindman.jpg', 'n10_03_fiveway.jpg', 'n10_04_replica.jpg', 'n10_05_broadway.jpg', 'paper_old.png', 'hero.jpg', 'brass.jpg', 'd_01.jpg'].map((n) => <Img key={n} src={img(n)} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />)}
      <div style={{position: 'absolute', left: 0, top: 0, width: 3000, height: 4500, transformOrigin: '0 0',
        transform: `translate(${540 + jx}px, ${960 + jy}px) rotate(${cam.r + jr}deg) scale(${cam.z}) translate(${-cam.x}px, ${-cam.y}px)`, filter: blur > 0.4 ? `blur(${blur}px)` : undefined}}>
        <img src={img('board10.jpg')} style={{position: 'absolute', left: -200, top: -250, width: 3400, height: 5400}} />
        <svg width="3000" height="4500" style={{position: 'absolute', left: 0, top: 0, zIndex: 30, overflow: 'visible', pointerEvents: 'none'}}>
          <Thread a={pins.A} b={pins.B} at={T(3)} f={f} fps={fps} sag={110} />
          <Thread a={pins.B} b={pins.C} at={T(7)} f={f} fps={fps} sag={130} />
          <Thread a={pins.C} b={pins.D} at={T(11)} f={f} fps={fps} sag={110} />
          <Thread a={pins.D} b={pins.E} at={T(16)} f={f} fps={fps} sag={90} />
          <Thread a={pins.E} b={pins.F} at={T(21)} f={f} fps={fps} sag={150} />
          <Thread a={pins.F} b={pins.BM} at={T(30)} f={f} fps={fps} sag={170} />
          <Thread a={pins.BM} b={pins.G} at={T(35)} f={f} fps={fps} sag={110} />
        </svg>
        {/* декор */}
        <Sticky x={300} y={700} text="1917" rot={-6} f={f} fps={fps} />
        <Sticky x={2750} y={2800} text="НЬЮ-ЙОРК" rot={5} f={f} fps={fps} size={50} />
        <Polaroid cx={420} cy={3150} w={300} h={380} file="n10_05_broadway.jpg" pos="50% 30%" cap="" rot={-5} at={0} f={f} fps={fps} />
        <Sticky x={2780} y={3500} text="ШУТКА?" rot={-5} f={f} fps={fps} />
        {/* H: музейный кадр (иллюстрация) */}
        <Polaroid cx={1500} cy={830} w={600} h={800} file="hero.jpg" pos="50% 40%" cap="ЭКСПОНАТ" rot={-2} at={0} f={f} fps={fps} />
        {/* A: фото «Фонтана» Стиглица */}
        <Polaroid cx={760} cy={1000} w={440} h={575} file="n10_01_fountain.jpg" pos="50% 40%" cap="ФОНТАН · 1917" rot={4} at={T(2)} f={f} fps={fps} />
        {/* B: подпись */}
        {f >= T(3) && (
          <>
            <div style={{position: 'absolute', left: 2250 - 290, top: 840, width: 580, height: 400, zIndex: 13, background: 'linear-gradient(160deg, #FBF3DE, #E9DCB0)', boxShadow: '0 26px 40px rgba(0,0,0,0.55)',
              transform: `rotate(3deg) scale(${Math.min(pop(f, T(3), fps), 1.04)})`}}>
              <div style={{position: 'absolute', left: 40, top: 30, fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: 'rgba(40,30,16,0.65)'}}>ПОДПИСЬ</div>
              <div style={{position: 'absolute', left: 36, top: 80, fontFamily: HAND, fontWeight: 700, fontSize: 190, lineHeight: 1, color: '#14143a', clipPath: `inset(0 ${(1 - sig) * 100}% 0 0)`, whiteSpace: 'nowrap'}}>R. Mutt</div>
              <div style={{position: 'absolute', left: 40, top: 310, width: 380 * sig, height: 6, background: '#14143a', borderRadius: 3, transform: 'rotate(-2deg)'}} />
            </div>
            <Pin x={2250} y={850} s={0.95} p={1} />
            <Tape text="ЧУЖОЕ ИМЯ" x={2020} y={1180} rot={-3} f={f} at={T(4)} fps={fps} size={34} />
          </>
        )}
        {/* C: музейная табличка из латуни */}
        {f >= T(7) && (() => {
          const e = 1 - Math.min(plaque, 1);
          const screw = (l, t) => (
            <div style={{position: 'absolute', left: l, top: t, width: 30, height: 30, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #FFF3C4, #A57A22 55%, #4a3208)', boxShadow: '0 2px 3px rgba(0,0,0,0.6), inset 0 -2px 3px rgba(0,0,0,0.4)'}}>
              <div style={{position: 'absolute', left: 4, right: 4, top: 13, height: 4, background: '#2a1c05', transform: 'rotate(35deg)', borderRadius: 2}} />
            </div>
          );
          const engr = {color: '#3a2506', textShadow: '1px 2px 0 rgba(255,236,170,0.75), -1px -1px 0 rgba(0,0,0,0.45)'};
          return (
            <>
              <div style={{position: 'absolute', left: 1500 - 440, top: 1590, width: 880, height: 440, zIndex: 14, transform: `translateY(${-e * 500}px) rotate(${-1.5 + e * 6}deg) scale(${1 + e * 0.15})`, opacity: Math.min(1, plaque * 3)}}>
                <div style={{position: 'absolute', inset: 0, borderRadius: 14, backgroundImage: `url(${img('brass.jpg')})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'sepia(0.35) saturate(1.1) brightness(0.9)',
                  boxShadow: '0 40px 60px rgba(0,0,0,0.6), 0 8px 14px rgba(0,0,0,0.5), inset 0 0 0 6px rgba(255,236,170,0.55), inset 0 0 0 10px rgba(90,60,10,0.8), inset 0 0 60px rgba(60,38,6,0.55)'}} />
                <div style={{position: 'absolute', left: 44, right: 44, top: 44, bottom: 44, border: '3px solid rgba(70,45,8,0.75)', boxShadow: '1px 1px 0 rgba(255,236,170,0.6)'}} />
                {screw(22, 22)}{screw(828, 22)}{screw(22, 388)}{screw(828, 388)}
                <div style={{position: 'absolute', left: 0, right: 0, top: 78, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 9, ...engr}}>МАРСЕЛЬ ДЮШАН · 1917</div>
                <div style={{position: 'absolute', left: 0, right: 0, top: 136, textAlign: 'center', fontFamily: HEAD, fontWeight: 900, fontSize: 108, lineHeight: 1, ...engr}}>ОБЪЕКТ ВЕКА</div>
                <div style={{position: 'absolute', left: 90, right: 90, top: 270, height: 3, background: 'rgba(60,38,6,0.7)', boxShadow: '0 1px 0 rgba(255,236,170,0.6)'}} />
                <div style={{position: 'absolute', left: 0, right: 0, top: 295, textAlign: 'center', fontFamily: MONO, fontWeight: 500, fontSize: 26, letterSpacing: 4, ...engr}}>«ФОНТАН» · ФАРФОР, ГОТОВОЕ ИЗДЕЛИЕ</div>
              </div>
              <svg width="120" height="80" viewBox="-60 -40 120 80" style={{position: 'absolute', left: 1500 - 60, top: 1545, zIndex: 20}}><circle cy="14" r="22" fill="none" stroke="#D4A64A" strokeWidth="8" /><circle cy="-8" r="9" fill="#8A6419" /></svg>
            </>
          );
        })()}
        {/* D: Нью-Йорк, 1917 */}
        <OldPaper cx={650} cy={1420} w={520} rot={-4} at={T(11)} f={f} fps={fps}>
          <svg width="400" height="400" viewBox="-330 -330 660 660" style={{position: 'absolute', left: 60, top: 250}}>
            <defs><path id="pmn" d="M0 -250 A250 250 0 1 1 -0.1 -250" /><filter id="roughn"><feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="5" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="7" /></filter></defs>
            <g filter="url(#roughn)" fill="none" stroke="#14143a" opacity="0.88">
              <circle r="305" strokeWidth="12" /><circle r="285" strokeWidth="4" /><circle r="190" strokeWidth="6" />
              <text fill="#14143a" stroke="none" fontFamily="IBM Plex Mono" fontWeight="700" fontSize="42" letterSpacing="7"><textPath href="#pmn">{'НЬЮ-ЙОРК · США · НЬЮ-ЙОРК · США · '}</textPath></text>
              <text fill="#14143a" stroke="none" x="0" y="52" textAnchor="middle" fontFamily="Unbounded" fontWeight="900" fontSize="120">{yr1917}</text>
            </g>
          </svg>
        </OldPaper>
        <Pin x={pins.D[0]} y={pins.D[1]} s={0.95} p={f >= T(11) ? 1 : 0} />
        {/* E: Дюшан */}
        <Polaroid cx={760} cy={2000} w={600} h={830} file="d_01.jpg" pos="30% 30%" cap="МАРСЕЛЬ ДЮШАН" rot={-3} at={T(14)} f={f} fps={fps} tint="contrast(1.05)" />
        <Polaroid cx={1330} cy={2150} w={420} h={250} file="n10_03_fiveway.jpg" pos="50% 50%" cap="НЬЮ-ЙОРК, 1917" rot={5} at={T(16)} f={f} fps={fps} tint="sepia(0.35)" />
        <Tape text="ХУДОЖНИК" x={500} y={2530} rot={-3} f={f} at={T(16)} fps={fps} size={44} />
        {/* F: заявка на выставку */}
        {f >= T(18) && (() => {
          const p = pop(f, T(18), fps), e = 1 - Math.min(p, 1);
          return (
            <>
              <div style={{position: 'absolute', left: 2250 - 330, top: 1800, width: 660, height: 800, zIndex: 13, background: 'linear-gradient(170deg, #FBF3DE, #E9DCB0)', boxShadow: '0 30px 50px rgba(0,0,0,0.55)',
                transform: `translateY(${-e * 500}px) rotate(${-2 + e * 10}deg) scale(${1 + e * 0.2})`, opacity: Math.min(1, p * 3), fontFamily: MONO, color: '#2a2418'}}>
                <div style={{position: 'absolute', left: 40, top: 40, fontWeight: 700, fontSize: 30, letterSpacing: 2}}>SOCIETY OF</div>
                <div style={{position: 'absolute', left: 40, top: 80, fontWeight: 700, fontSize: 30, letterSpacing: 2}}>INDEPENDENT ARTISTS</div>
                <div style={{position: 'absolute', left: 40, top: 134, width: 580, height: 4, background: '#2a2418'}} />
                <div style={{position: 'absolute', left: 40, top: 170, fontWeight: 500, fontSize: 28, whiteSpace: 'pre'}}>{typed('ВЫСТАВКА: НЬЮ-ЙОРК, 1917', T(21), 1.4)}</div>
                <div style={{position: 'absolute', left: 40, top: 230, fontWeight: 500, fontSize: 28, whiteSpace: 'pre'}}>{typed('РАБОТА:   «ФОНТАН»', T(22), 1.4)}</div>
                <div style={{position: 'absolute', left: 40, top: 290, fontWeight: 500, fontSize: 28, whiteSpace: 'pre'}}>{typed('АВТОР:    R. MUTT', T(24), 1.4)}</div>
                <div style={{position: 'absolute', left: 40, top: 400, fontWeight: 500, fontSize: 24, color: 'rgba(42,36,24,0.6)'}}>ПОДПИСЬ ХУДОЖНИКА</div>
                <div style={{position: 'absolute', left: 40, top: 430, width: 540, height: 4, background: 'rgba(42,36,24,0.6)'}} />
                <div style={{position: 'absolute', left: 60, top: 300, fontFamily: HAND, fontWeight: 700, fontSize: 170, lineHeight: 1, color: '#14143a', clipPath: `inset(0 ${(1 - sig2) * 100}% 0 0)`, whiteSpace: 'nowrap', transform: 'rotate(-4deg)'}}>R. Mutt</div>
              </div>
              <Pin x={pins.F[0]} y={pins.F[1]} s={0.95} p={Math.min(1, p * 2)} />
            </>
          );
        })()}
        <Ink text="ОТКЛОНЕНО" x={1915} y={2350} rot={-9} size={90} f={f} at={T(29)} fps={fps} />
        {/* BM: страница журнала, оригинал потерян */}
        <OldPaper cx={900} cy={2820} w={620} rot={-3} at={T(30)} f={f} fps={fps}>
          <div style={{position: 'absolute', left: 90, top: 150, width: 470, height: 640, backgroundImage: `url(${img('n10_02_blindman.jpg')})`, backgroundSize: 'cover', backgroundPosition: '50% 8%', boxShadow: 'inset 0 0 30px rgba(60,40,10,0.45)', filter: 'sepia(0.3)'}} />
        </OldPaper>
        <Pin x={pins.BM[0]} y={pins.BM[1]} s={0.95} p={f >= T(30) ? 1 : 0} />
        <Tape text="ОРИГИНАЛ ПОТЕРЯН" x={560} y={3240} rot={-3} f={f} at={T(31)} fps={fps} size={34} />
        {/* копии */}
        {[0, 1, 2].map((k) => (
          <React.Fragment key={k}>
            <Polaroid cx={900 + k * 650} cy={3560} w={400} h={290} file="n10_04_replica.jpg" pos="50% 55%" cap={`КОПИЯ № ${k + 1}`} rot={(k - 1) * 4} at={T(32) + k * 6} f={f} fps={fps} />
          </React.Fragment>
        ))}
        {/* G: опрос 2004 */}
        {f >= T(35) && (() => {
          const p = pop(f, T(35), fps), e = 1 - Math.min(p, 1);
          return (
            <>
              <div style={{position: 'absolute', left: 1500 - 560, top: 3800, width: 1120, height: 700, zIndex: 13, borderRadius: 28, background: 'linear-gradient(160deg, #1C2A82, #0A0F3A)', border: '8px solid #D4A64A',
                boxShadow: '0 40px 70px rgba(0,0,0,0.6)', transform: `translateY(${-e * 600}px) rotate(${1 + e * 8}deg) scale(${1 + e * 0.2})`, opacity: Math.min(1, p * 3)}}>
                <div style={{position: 'absolute', left: 50, top: 30, fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: 6, color: '#F3D88A'}}>ОПРОС · 2004</div>
                <div style={{position: 'absolute', right: 50, top: 22, fontFamily: HEAD, fontWeight: 900, fontSize: 64, color: '#fff'}}>{span}</div>
                <div style={{position: 'absolute', left: 50, top: 96, width: 1020, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.2)'}}>
                  <div style={{width: `${((span - 1917) / 87) * 100}%`, height: '100%', borderRadius: 5, background: 'linear-gradient(90deg, #5A72E8, #D4A64A)'}} />
                </div>
                <div style={{position: 'absolute', left: 50, top: 130, fontFamily: HEAD, fontWeight: 900, fontSize: 130, lineHeight: 1, color: '#fff'}}>{count}</div>
                <div style={{position: 'absolute', left: 430, top: 175, fontFamily: MONO, fontWeight: 700, fontSize: 34, letterSpacing: 4, color: '#F3D88A'}}>СПЕЦИАЛИСТОВ</div>
                {rows.map((r, i) => {
                  const rp = spring({frame: f - (T(44) + i * 8), fps, config: {damping: 12, stiffness: 140}});
                  const top = r[0] === '1';
                  return f >= T(44) + i * 8 ? (
                    <div key={i} style={{position: 'absolute', left: 50, top: 340 + i * 110, width: 1020, height: 92, borderRadius: 14, display: 'flex', alignItems: 'center', gap: 24, padding: '0 28px', transform: `translateX(${(1 - Math.min(rp, 1)) * 900}px)`,
                      background: top ? 'linear-gradient(90deg, #FFF0B8, #D4A64A)' : 'rgba(255,255,255,0.12)', color: top ? '#2a1a05' : '#fff', boxShadow: top ? '0 0 40px rgba(212,166,74,0.8)' : 'none'}}>
                      <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 54, width: 50}}>{r[0]}</div>
                      <div style={{fontFamily: HEAD, fontWeight: 800, fontSize: top ? 44 : 34, flex: 1}}>{r[1]}</div>
                      <div style={{fontFamily: HAND, fontWeight: 700, fontSize: 52}}>{r[2]}</div>
                    </div>
                  ) : null;
                })}
              </div>
              <Pin x={pins.G[0]} y={pins.G[1] + 60} s={1} p={Math.min(1, p * 2)} />
            </>
          );
        })()}
      </div>
      {/* свет, пыль, зерно */}
      <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 42%, rgba(255,220,150,0.16), rgba(0,0,0,0) 55%), radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(2,4,24,0.72) 100%)', zIndex: 60}} />
      {Array.from({length: 22}).map((_, i) => {
        const x = ((i * 193 + f * (0.5 + (i % 4) * 0.25)) % 1160) - 40, y = ((i * 311 - f * (0.6 + (i % 3) * 0.3)) % 2000 + 2000) % 2000;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 4 + (i % 3) * 2, height: 4 + (i % 3) * 2, borderRadius: '50%', background: '#FBE6A3', opacity: 0.18 + 0.2 * Math.sin(f / 8 + i), zIndex: 61}} />;
      })}
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, opacity: 0.12, mixBlendMode: 'overlay', zIndex: 62, pointerEvents: 'none'}}>
        <filter id="gn10"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 6} /></filter><rect width="1080" height="1920" filter="url(#gn10)" />
      </svg>
      <div style={{position: 'absolute', left: 60, top: 1610, fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: 5, color: 'rgba(255,255,255,0.75)', zIndex: 80}}>{script.diagram.title}</div>
      {/* финал: выбор «шутка или гениальная идея» */}
      <div style={{position: 'absolute', inset: 0, background: 'rgba(4,6,32,0.78)', opacity: endIn, zIndex: 70}} />
      {f >= T(49) - 6 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 75, opacity: endIn}}>
          <div style={{position: 'absolute', left: 0, width: 1080, top: 480, textAlign: 'center', fontFamily: HEAD, fontWeight: 900, fontSize: 96, color: '#fff', textShadow: '0 8px 30px rgba(0,0,0,0.5)'}}>ЧТО ЭТО?</div>
          {[['ШУТКА', 760], ['ГЕНИАЛЬНАЯ ИДЕЯ', 960]].map(([txt, top], i) => {
            const act = cur === i + 1 || (i === 1 && f >= tap2At);
            const pr = spring({frame: f - (T(49) + 4 + i * 6), fps, config: {damping: 11, stiffness: 140}});
            const glow = i === 1 && f >= tap2At;
            return (
              <div key={i} style={{position: 'absolute', left: 140, top, width: 800, height: 150, borderRadius: 75, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontWeight: 900, fontSize: i ? 54 : 64,
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
