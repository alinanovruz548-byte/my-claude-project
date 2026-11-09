import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate, Easing, staticFile, delayRender, continueRender, Img} from 'remotion';
import {script, words} from './current';
import {Pin, Tape, WordTiles, RED, A, TITLE, BODY, GTEXT} from './AuroraCollage';
import {Question9} from './Extra9';

// «Доска дела»: одна огромная сцена, по которой плавно ездит камера (стиль документального расследования).
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const sec = (s, fps) => Math.round(s * fps);
const t0 = (i) => words[i].start;
const img = (n) => staticFile('n9b/img/' + n);
const inOut = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

const useFonts = () => {
  const [h] = React.useState(() => delayRender('fonts'));
  React.useEffect(() => {
    const fonts = [
      new FontFace('Playfair Display', `url(${staticFile('fonts/PlayfairDisplay-VF.ttf')})`, {weight: '400 900'}),
      new FontFace('Manrope', `url(${staticFile('fonts/Manrope-VF.ttf')})`, {weight: '200 800'}),
    ];
    Promise.all(fonts.map((f) => f.load())).then((l) => { l.forEach((f) => document.fonts.add(f)); continueRender(h); });
  }, [h]);
};

// --- камера: ключи привязаны к словам, переезд заканчивается на слове ------------------------------------------------
const camAt = (f, fps) => {
  const K = script.cam;
  const arr = K.map((k) => sec(t0(k.w), fps));
  let pos = {x: K[0].x, y: K[0].y, z: K[0].z, r: K[0].r};
  for (let i = 1; i < K.length; i++) {
    const dur = Math.max(10, Math.min(32, arr[i] - arr[i - 1] - 4));
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

// --- предметы доски ------------------------------------------------------------------------------------------------------------------------
const Polaroid = ({cx, cy, w, h, file, pos = '50% 30%', cap, rot = 0, at, f, fps, children, tape = true}) => {
  const p = pop(f, at, fps);
  if (f < at) return null;
  const e = 1 - Math.min(p, 1);
  const top = cy - (h + 134) / 2;
  return (
    <>
      <div style={{position: 'absolute', left: cx - w / 2 - 22, top, width: w + 44, height: h + 134, background: '#F7F2E6', zIndex: 14,
        boxShadow: '0 30px 50px rgba(0,0,0,0.55), 0 6px 14px rgba(0,0,0,0.4)', transform: `translateY(${-e * 500}px) rotate(${rot + e * 12}deg) scale(${1 + e * 0.25})`, opacity: Math.min(1, p * 3)}}>
        <div style={{position: 'absolute', left: 22, top: 22, width: w, height: h, overflow: 'hidden', background: '#111',
          backgroundImage: file ? `url(${img(file)})` : undefined, backgroundSize: 'cover', backgroundPosition: pos, boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)'}}>{children}</div>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 24, textAlign: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 34, letterSpacing: 3, color: '#2a2418'}}>{cap}</div>
        {tape && <div style={{position: 'absolute', left: -40, top: 10, width: 130, height: 46, background: 'rgba(235,222,180,0.82)', transform: 'rotate(-38deg)'}} />}
        {tape && <div style={{position: 'absolute', right: -40, top: 10, width: 130, height: 46, background: 'rgba(235,222,180,0.82)', transform: 'rotate(38deg)'}} />}
      </div>
      <Pin x={cx} y={top + 16} s={0.95} p={Math.min(1, p * 2)} />
    </>
  );
};

const String = ({a, b, at, f, fps, sag = 90}) => {
  const p = interpolate(f, [at, at + 26], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  if (f < at) return null;
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 + sag;
  const d = `M${a[0]} ${a[1]} Q${mx} ${my} ${b[0]} ${b[1]}`;
  return (
    <>
      <path d={d} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="9" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} transform="translate(8 12)" />
      <path d={d} fill="none" stroke={RED} strokeWidth="7" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} />
    </>
  );
};

const Sticky = ({x, y, text, rot = 0, at = 0, f, fps}) => {
  const p = pop(f, at, fps);
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', left: x - 120, top: y - 120, width: 240, height: 240, zIndex: 13, background: 'linear-gradient(160deg, #F7E9A6, #E9D27A)', boxShadow: '0 20px 30px rgba(0,0,0,0.5)',
      transform: `rotate(${rot}deg) scale(${Math.min(p, 1.05)})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: text.length > 6 ? 38 : 58, color: '#3a2a14', textAlign: 'center', padding: 10}}>{text}</div>
  );
};

const Silhouette = () => (
  <svg width="100%" height="100%" viewBox="-100 -120 200 220" preserveAspectRatio="xMidYMax meet" style={{background: 'linear-gradient(160deg, #26398F, #0A0F3A)'}}>
    <path d="M-95 100 Q-95 20 -30 8 L-18 -4 L18 -4 L30 8 Q95 20 95 100 Z" fill="#101a60" stroke="#8fa0ff" strokeWidth="2.5" />
    <ellipse cx="0" cy="-48" rx="42" ry="52" fill="#101a60" stroke="#8fa0ff" strokeWidth="2.5" />
    <text x="0" y="-30" textAnchor="middle" fontFamily="Playfair Display" fontWeight="900" fontSize="80" fill="#8fa0ff" opacity="0.7">?</text>
  </svg>
);

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

const Postmark = ({f, at, fps}) => {
  const p = spring({frame: f - at, fps, config: {damping: 8, stiffness: 150}});
  const yr = Math.round(1600 + 12 * interpolate(f, [at, at + 22], [0, 1], {...clamp, easing: ease}));
  if (f < at) return null;
  return (
    <svg width="440" height="440" viewBox="-330 -330 660 660" style={{position: 'absolute', left: 130, top: 330, transform: `rotate(${-12 + 12 * Math.min(p, 1)}deg) scale(${interpolate(p, [0, 1], [2.4, 1])})`, opacity: Math.min(1, p * 1.8)}}>
      <defs><path id="pm2" d="M0 -250 A250 250 0 1 1 -0.1 -250" /><filter id="rough2"><feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="3" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="7" /></filter></defs>
      <g filter="url(#rough2)" fill="none" stroke="#6a2c18" opacity="0.88">
        <circle r="305" strokeWidth="12" /><circle r="285" strokeWidth="4" /><circle r="190" strokeWidth="6" />
        <text fill="#6a2c18" stroke="none" fontFamily="Manrope" fontWeight="800" fontSize="46" letterSpacing="9"><textPath href="#pm2">{'РИМ · ИТАЛИЯ · РИМ · ИТАЛИЯ · '}</textPath></text>
        <text fill="#6a2c18" stroke="none" x="0" y="52" textAnchor="middle" fontFamily="Playfair Display" fontWeight="900" fontSize="150">{yr}</text>
      </g>
    </svg>
  );
};

const Gauge = ({x, y, size, v, f = 0}) => {
  const rad = (an) => (an - 90) * Math.PI / 180;
  const hot = v > 0.72;
  const ang = -120 + 240 * v + (v >= 1 ? Math.sin(f * 2.6) * 2.4 : Math.sin(f * 1.3) * 0.8);
  const arc = (a0, a1, col, r = 128, w = 22) => `M${Math.cos(rad(a0)) * r} ${Math.sin(rad(a0)) * r} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${Math.cos(rad(a1)) * r} ${Math.sin(rad(a1)) * r}`;
  const lamp = hot ? 0.55 + 0.45 * Math.sin(f * 0.8) : 0.15;
  return (
    <svg width={size} height={size} viewBox="-210 -210 420 420" style={{position: 'absolute', left: x, top: y, filter: 'drop-shadow(10px 18px 14px rgba(0,0,0,0.5))'}}>
      <defs>
        <linearGradient id="brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFF0B8" /><stop offset="0.35" stopColor="#B58A2E" /><stop offset="0.65" stopColor="#F3D88A" /><stop offset="1" stopColor="#7a5414" /></linearGradient>
        <radialGradient id="face" cx="40%" cy="35%"><stop offset="0" stopColor="#FFFBEA" /><stop offset="1" stopColor="#E6D6A6" /></radialGradient>
        <linearGradient id="glare" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.55" /><stop offset="0.45" stopColor="#fff" stopOpacity="0" /></linearGradient>
      </defs>
      <circle r="204" fill="url(#brass)" stroke="#6b4a10" strokeWidth="4" />
      <circle r="190" fill="none" stroke="#fff6cf" strokeWidth="3" opacity="0.6" />
      {Array.from({length: 12}).map((_, i) => <circle key={i} cx={Math.cos(i * Math.PI / 6) * 196} cy={Math.sin(i * Math.PI / 6) * 196} r="6" fill="#6b4a10" />)}
      <circle r="178" fill="url(#face)" stroke="#6b4a10" strokeWidth="5" />
      <path d={arc(-120, -20)} stroke="#3F5FD0" strokeWidth="22" fill="none" />
      <path d={arc(-20, 50)} stroke="#D4A64A" strokeWidth="22" fill="none" />
      <path d={arc(50, 120)} stroke={RED} strokeWidth="22" fill="none" />
      {Array.from({length: 49}).map((_, i) => { const an = rad(-120 + i * 5), big = i % 6 === 0; return <line key={i} x1={Math.cos(an) * (big ? 100 : 112)} y1={Math.sin(an) * (big ? 100 : 112)} x2={Math.cos(an) * 118} y2={Math.sin(an) * 118} stroke="#3a2e18" strokeWidth={big ? 5 : 2} />; })}
      {[0, 20, 40, 60, 80, 100].map((n) => { const an = rad(-120 + 240 * (n / 100)); return <text key={n} x={Math.cos(an) * 80} y={Math.sin(an) * 80 + 9} textAnchor="middle" fontFamily="Playfair Display" fontWeight="800" fontSize="26" fill="#3a2e18">{n}</text>; })}
      <text x="0" y="62" textAnchor="middle" fontFamily="Manrope" fontWeight="800" fontSize="17" letterSpacing="5" fill="#6b5326">ДАВЛЕНИЕ</text>
      <circle cx="-70" cy="108" r="30" fill="#F3EAC9" stroke="#8a6a2b" strokeWidth="5" /><circle cx="70" cy="108" r="30" fill="#F3EAC9" stroke="#8a6a2b" strokeWidth="5" />
      <line x1="-70" y1="108" x2={-70 + Math.cos(rad(-60 + v * 200)) * 22} y2={108 + Math.sin(rad(-60 + v * 200)) * 22} stroke="#222" strokeWidth="4" strokeLinecap="round" />
      <line x1="70" y1="108" x2={70 + Math.cos(rad(40 - v * 150)) * 22} y2={108 + Math.sin(rad(40 - v * 150)) * 22} stroke="#222" strokeWidth="4" strokeLinecap="round" />
      <g transform="translate(5 8)" opacity="0.28"><g transform={`rotate(${ang})`}><path d="M-8 30 L0 -150 L8 30 Z" fill="#000" /></g></g>
      <g transform={`rotate(${ang})`}><path d="M-8 30 L0 -150 L8 30 Z" fill={RED} /><path d="M-8 30 L0 -150 L0 30 Z" fill="#8f1b12" /></g>
      <circle r="22" fill="#222" /><circle r="9" fill="#D4A64A" />
      <circle cx="0" cy="-160" r="11" fill={RED} opacity={lamp} style={{filter: 'drop-shadow(0 0 10px rgba(255,60,40,0.95))'}} />
      <path d="M-150 -90 Q-60 -170 90 -140 Q-20 -110 -150 -90 Z" fill="url(#glare)" opacity="0.8" />
    </svg>
  );
};

const Medal = ({x, y, f, at, fps}) => {
  const p = spring({frame: f - at, fps, config: {damping: 8, stiffness: 150}});
  if (f < at) return null;
  return (
    <svg width="300" height="370" viewBox="-170 -170 340 420" style={{position: 'absolute', left: x, top: y, zIndex: 30, overflow: 'visible', transform: `scale(${interpolate(p, [0, 1], [2.2, 1])}) rotate(${-8 + (1 - Math.min(p, 1)) * 30}deg)`,
      opacity: Math.min(1, p * 1.8), filter: 'drop-shadow(0 18px 20px rgba(0,0,0,0.5))', transformOrigin: '50% 40%'}}>
      <defs>
        <linearGradient id="gm2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFF0B8" /><stop offset="0.5" stopColor="#D4A64A" /><stop offset="1" stopColor="#8A6419" /></linearGradient>
        <path id="mtop2" d="M-96 0 A96 96 0 0 1 96 0" /><path id="mbot2" d="M-104 0 A104 104 0 0 0 104 0" />
      </defs>
      <path d="M-70 90 L-110 240 L-60 215 L-30 250 L0 100 Z" fill="#2B3FA0" stroke="#D4A64A" strokeWidth="5" strokeLinejoin="round" />
      <path d="M70 90 L110 240 L60 215 L30 250 L0 100 Z" fill="#1C2A82" stroke="#D4A64A" strokeWidth="5" strokeLinejoin="round" />
      {Array.from({length: 24}).map((_, i) => <circle key={i} cx={Math.cos((i / 24) * Math.PI * 2) * 128} cy={Math.sin((i / 24) * Math.PI * 2) * 128} r="19" fill="url(#gm2)" stroke="#8A6419" strokeWidth="3" />)}
      <circle r="124" fill="url(#gm2)" stroke="#8A6419" strokeWidth="5" /><circle r="112" fill="none" stroke="#fff6cf" strokeWidth="3" opacity="0.8" />
      <circle r="78" fill="#141C55" stroke="#F3D88A" strokeWidth="6" />
      <text x="0" y="40" textAnchor="middle" fontFamily="Playfair Display" fontWeight="900" fontSize="120" fill="url(#gm2)">1</text>
      <text fontFamily="Manrope" fontWeight="800" fontSize="19" letterSpacing="5" fill="#4a2d08"><textPath href="#mtop2" startOffset="50%" textAnchor="middle">ПЕРВАЯ ЖЕНЩИНА</textPath></text>
      <text fontFamily="Manrope" fontWeight="800" fontSize="19" letterSpacing="5" fill="#4a2d08" dy="14"><textPath href="#mbot2" startOffset="50%" textAnchor="middle">АКАДЕМИЯ · 1616</textPath></text>
    </svg>
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
    <div style={{position: 'absolute', left: 80, top: 170, width: 920, textAlign: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 68, lineHeight: 1.16, opacity: a, filter: `blur(${(1 - a) * 8}px)`,
      transform: `translateY(${(1 - a) * 12}px)`, textWrap: 'balance', textShadow: '0 4px 24px rgba(0,0,0,0.85)', zIndex: 80}}>
      {chunk.map(([txt, s0], i) => <span key={i} style={{color: now >= words[s0].start ? '#fff' : 'rgba(255,255,255,0.34)'}}>{txt}{' '}</span>)}
    </div>
  );
};

export const BoardMain = () => {
  useFonts();
  const f = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const T = (w) => sec(t0(w), fps);
  const cam = camAt(f, fps), prev = camAt(Math.max(0, f - 1), fps);
  const speed = Math.hypot((cam.x - prev.x) * cam.z, (cam.y - prev.y) * cam.z) + Math.abs(Math.log(cam.z / prev.z)) * 700;
  const blur = Math.min(6, speed * 0.07);
  const jx = Math.sin(f / 9) * 5, jy = Math.cos(f / 11) * 5, jr = Math.sin(f / 17) * 0.25;
  const gauge = interpolate(f, [T(26), T(26) + 38], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
  const typed = (s, at, spd = 0.9) => s.slice(0, Math.max(0, Math.min(s.length, Math.floor((f - at) * spd))));
  const stampC = spring({frame: f - T(7), fps, config: {damping: 7, stiffness: 230}});
  const stampShake = f >= T(7) && f < T(7) + 10 ? Math.sin(f * 4.5) * 10 * (1 - (f - T(7)) / 10) : 0;
  const vsP = spring({frame: f - T(19), fps, config: {damping: 7, stiffness: 230}});
  const ring = interpolate(f, [T(39) + 6, T(39) + 28], [0, 1], {...clamp, easing: ease});
  const endIn = interpolate(f, [T(58) - 6, T(58) + 14], [0, 1], clamp);
  const pins = {A: [1500, 452], B: [790, 917], C: [2250, 665], D: [2300, 1687], E: [1400, 1860], E2: [1400, 2900], F: [1500, 3010], G: [2450, 3525]};
  return (
    <AbsoluteFill style={{background: '#070b2a'}}>
      <Img src={img('board.jpg')} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />
      {['n9_05_uffizi_clean.jpg', 'n9_03_self.jpg', 'n9_01_naples.jpg', 'paper_old.png'].map((n) => <Img key={n} src={img(n)} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />)}
      <div style={{position: 'absolute', left: 0, top: 0, width: 3000, height: 4300, transformOrigin: '0 0',
        transform: `translate(${540 + jx}px, ${960 + jy}px) rotate(${cam.r + jr}deg) scale(${cam.z}) translate(${-cam.x}px, ${-cam.y}px)`, filter: blur > 0.4 ? `blur(${blur}px)` : undefined}}>
        <img src={img('board.jpg')} style={{position: 'absolute', left: -200, top: -250, width: 3400, height: 4800}} />
        {/* строки */}
        <svg width="3000" height="4300" style={{position: 'absolute', left: 0, top: 0, zIndex: 30, overflow: 'visible', pointerEvents: 'none'}}>
          <String a={pins.A} b={pins.B} at={T(4)} f={f} fps={fps} sag={110} />
          <String a={pins.B} b={pins.C} at={T(8)} f={f} fps={fps} sag={-120} />
          <String a={pins.B} b={pins.D} at={T(19)} f={f} fps={fps} sag={160} />
          <String a={pins.D} b={pins.E} at={T(24)} f={f} fps={fps} sag={110} />
          <String a={pins.E2} b={pins.F} at={T(35)} f={f} fps={fps} sag={60} />
          <String a={pins.F} b={pins.G} at={T(48)} f={f} fps={fps} sag={130} />
          {f >= T(39) + 6 && <ellipse cx="1722" cy="3221" rx="92" ry="108" fill="none" stroke="#D4A64A" strokeWidth="9" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - ring} transform="rotate(-10 1722 3221)"
            style={{filter: 'drop-shadow(0 0 14px rgba(212,166,74,0.9))'}} />}
        </svg>
        {/* декор доски */}
        <Polaroid cx={420} cy={2350} w={330} h={400} file="n9_01_naples.jpg" pos="80% 22%" cap="ЮДИФЬ I" rot={-6} at={0} f={f} fps={fps} />
        <Polaroid cx={640} cy={3350} w={360} h={430} file="n9_05_uffizi_clean.jpg" pos="25% 40%" cap="ЮДИФЬ II" rot={5} at={0} f={f} fps={fps} />
        <Polaroid cx={2750} cy={2750} w={340} h={420} file="n9_03_self.jpg" pos="62% 22%" cap="" rot={-4} at={0} f={f} fps={fps} />
        <Sticky x={2760} y={560} text="РИМ" rot={7} f={f} fps={fps} />
        <Sticky x={330} y={620} text="СУД" rot={-6} f={f} fps={fps} />
        <Sticky x={2760} y={3330} text="ФЛОРЕНЦИЯ" rot={5} f={f} fps={fps} />
        {/* A: Юдифь */}
        <Polaroid cx={1500} cy={800} w={480} h={590} file="n9_05_uffizi_clean.jpg" pos="85% 30%" cap="ЮДИФЬ" rot={-3} at={0} f={f} fps={fps} />
        {/* B: Артемизия */}
        <Polaroid cx={790} cy={1280} w={500} h={620} file="n9_03_self.jpg" pos="50% 25%" cap="" rot={4} at={T(3)} f={f} fps={fps} />
        <Tape text="АРТЕМИЗИЯ ДЖЕНТИЛЕСКИ" x={470} y={1590} rot={-3} f={f} at={T(16)} fps={fps} size={40} />
        {/* штамп СУД */}
        {f >= T(7) && (
          <div style={{position: 'absolute', left: 1030 + stampShake, top: 960, zIndex: 40, padding: '0 40px', border: `14px solid ${RED}`, color: RED, fontFamily: TITLE, fontWeight: 900, fontSize: 210, lineHeight: 1.05, letterSpacing: 6,
            background: 'rgba(245,235,215,0.93)', transform: `rotate(-8deg) scale(${interpolate(stampC, [0, 1], [3, 1])})`, opacity: Math.min(1, stampC * 1.8), boxShadow: '0 30px 50px rgba(0,0,0,0.55)'}}>СУД</div>
        )}
        {/* C: Рим, 1612 */}
        <OldPaper cx={2250} cy={1100} w={640} rot={4} flip at={T(7)} f={f} fps={fps}>
          <Postmark f={f} at={T(9)} fps={fps} />
        </OldPaper>
        <Pin x={pins.C[0]} y={pins.C[1]} s={0.95} p={f >= T(7) ? 1 : 0} />
        {/* D: Тасси */}
        <Polaroid cx={2300} cy={2000} w={460} h={520} cap="АГОСТИНО ТАССИ" rot={3} at={T(19)} f={f} fps={fps}><Silhouette /></Polaroid>
        <Tape text="УЧИТЕЛЬ" x={2430} y={1610} rot={5} f={f} at={T(21)} fps={fps} size={32} bg="#fff" color="#111" />
        {f >= T(19) && (
          <div style={{position: 'absolute', left: 1330, top: 1530, zIndex: 40, padding: '0 36px', border: `12px solid ${RED}`, color: RED, fontFamily: TITLE, fontWeight: 900, fontSize: 120, letterSpacing: 4,
            background: 'rgba(245,235,215,0.94)', transform: `rotate(-10deg) scale(${interpolate(vsP, [0, 1], [2.8, 1])})`, opacity: Math.min(1, vsP * 1.8), boxShadow: '0 20px 36px rgba(0,0,0,0.5)'}}>ПРОТИВ</div>
        )}
        {/* E: протокол и манометр */}
        <OldPaper cx={1400} cy={2380} w={760} rot={-2} at={T(23)} f={f} fps={fps}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 54, color: '#3a2a14', letterSpacing: 4}}>ПРОТОКОЛ СУДА</div>
          <div style={{position: 'absolute', left: 150, right: 150, top: 222, height: 5, background: 'rgba(58,42,20,0.55)'}} />
          <div style={{position: 'absolute', left: 230, top: 255, width: 300, height: 220, border: '6px double #5a3a1a', textAlign: 'center', color: '#4a2d12'}}>
            <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 26, letterSpacing: 12, marginTop: 14}}>РИМ</div>
            <div style={{fontFamily: TITLE, fontWeight: 900, fontSize: 118, lineHeight: 1, marginTop: 4}}>1612</div>
            <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 22, letterSpacing: 10, marginTop: 6}}>ГОД</div>
          </div>
          <div style={{position: 'absolute', left: 150, top: 300, fontFamily: TITLE, fontSize: 70, color: '#5a3a1a', opacity: 0.7}}>❦</div>
          <div style={{position: 'absolute', left: 560, top: 300, fontFamily: TITLE, fontSize: 70, color: '#5a3a1a', opacity: 0.7, transform: 'scaleX(-1)'}}>❦</div>
          <Gauge x={215} y={500} size={330} v={gauge} f={f} />
          <div style={{position: 'absolute', left: 140, top: 875, fontFamily: BODY, fontWeight: 800, fontSize: 26, letterSpacing: 5, color: 'rgba(58,42,20,0.7)'}}>ПОКАЗАНИЯ</div>
          <div style={{position: 'absolute', left: 140, top: 912, fontFamily: TITLE, fontWeight: 800, fontSize: 56, color: '#2a1d0c', whiteSpace: 'pre'}}>{typed('— Это правда!', T(31))}</div>
          {f >= T(33) ? <svg width="70" height="70" viewBox="-40 -40 80 80" style={{position: 'absolute', left: 560, top: 915}}><path d="M-26 2 L-8 22 L28 -22" stroke={RED} strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
        </OldPaper>
        <Pin x={pins.E[0]} y={pins.E[1]} s={0.95} p={f >= T(23) ? 1 : 0} />
        <Pin x={pins.E2[0]} y={pins.E2[1]} s={0.95} p={f >= T(34) ? 1 : 0} />
        {/* F: картина в золотой раме */}
        {f >= T(34) && (() => {
          const p = pop(f, T(34), fps), e = 1 - Math.min(p, 1);
          return (
            <>
              <div style={{position: 'absolute', left: 1500 - 414, top: 3500 - 509, width: 828, height: 1018, zIndex: 14, transform: `translateY(${-e * 600}px) rotate(${e * 8}deg) scale(${1 + e * 0.2})`, opacity: Math.min(1, p * 3)}}>
                <div style={{position: 'absolute', inset: 0, boxShadow: '0 40px 70px rgba(0,0,0,0.6)', borderRadius: 14}} />
                <div style={{position: 'absolute', left: 44, top: 44, width: 740, height: 930, backgroundImage: `url(${img('n9_01_naples.jpg')})`, backgroundSize: 'cover', backgroundPosition: '50% 20%'}} />
                <div style={{position: 'absolute', inset: 0, borderRadius: 14, background: 'linear-gradient(135deg, #FFF0B8, #D4A64A 30%, #8A6419 55%, #F3D88A 80%, #B58A2E)',
                  clipPath: 'polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, 44px 44px, 44px calc(100% - 44px), calc(100% - 44px) calc(100% - 44px), calc(100% - 44px) 44px, 44px 44px)'}} />
                <div style={{position: 'absolute', left: 38, top: 38, width: 752, height: 942, border: '4px solid rgba(255,244,190,0.85)'}} />
              </div>
              <Pin x={pins.F[0]} y={pins.F[1]} s={1} p={Math.min(1, p * 2)} />
              <Tape text="Неаполь · 1612–1613" x={1000} y={2985} rot={-2} f={f} at={T(35)} fps={fps} size={34} />
            </>
          );
        })()}
        <WordTiles text="СИЛА" x={1040} y={4070} f={f} at={T(45)} fps={fps} w={220} h={280} size={200} seed={11} />
        {/* G: Академия */}
        {f >= T(47) && (() => {
          const p = pop(f, T(47), fps), e = 1 - Math.min(p, 1);
          return (
            <>
              <div style={{position: 'absolute', left: 2450 - 380, top: 3510, width: 760, height: 500, zIndex: 14, borderRadius: 24, background: 'linear-gradient(160deg, #FBF3DE, #E7D5A4)', boxShadow: '0 36px 60px rgba(0,0,0,0.55)',
                transform: `translateY(${-e * 700}px) rotate(${3 + e * 14}deg) scale(${1 + e * 0.2})`, overflow: 'hidden', opacity: Math.min(1, p * 3)}}>
                <div style={{height: 96, background: A.ultra, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 32, letterSpacing: 6, color: '#fff'}}>АКАДЕМИЯ РИСУНКА</div>
                <div style={{position: 'absolute', left: 40, top: 130, width: 210, height: 270, backgroundImage: `url(${img('n9_03_self.jpg')})`, backgroundSize: 'cover', backgroundPosition: '55% 22%', border: '6px solid #fff', boxShadow: '0 8px 16px rgba(0,0,0,0.3)'}} />
                <div style={{position: 'absolute', left: 285, top: 130, fontFamily: BODY, fontWeight: 800, fontSize: 24, letterSpacing: 4, color: '#8a6a30'}}>{typed('ФЛОРЕНЦИЯ · 1616', T(56), 1.2)}</div>
                <div style={{position: 'absolute', left: 285, top: 175, width: 440, fontFamily: TITLE, fontWeight: 900, fontSize: 52, lineHeight: 1.1, color: '#111'}}>{typed('Артемизия Джентилески', T(49), 1.1)}</div>
                {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 285, top: 340 + i * 26, width: 430 - i * 80, height: 9, background: 'rgba(40,34,24,0.35)', borderRadius: 3}} />)}
              </div>
              <Pin x={pins.G[0]} y={pins.G[1]} s={1} p={Math.min(1, p * 2)} />
              <Medal x={2575} y={3840} f={f} at={T(51)} fps={fps} />
              <Tape text="ПЕРВАЯ ЖЕНЩИНА" x={2110} y={4040} rot={-3} f={f} at={T(52)} fps={fps} size={44} />
            </>
          );
        })()}
      </div>
      {/* свет и пыль */}
      <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 42%, rgba(255,220,150,0.16), rgba(0,0,0,0) 55%), radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(2,4,24,0.72) 100%)', zIndex: 60}} />
      {Array.from({length: 22}).map((_, i) => {
        const x = ((i * 193 + f * (0.5 + (i % 4) * 0.25)) % 1160) - 40, y = ((i * 311 - f * (0.6 + (i % 3) * 0.3)) % 2000 + 2000) % 2000;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 4 + (i % 3) * 2, height: 4 + (i % 3) * 2, borderRadius: '50%', background: '#FBE6A3', opacity: 0.18 + 0.2 * Math.sin(f / 8 + i), zIndex: 61}} />;
      })}
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, opacity: 0.12, mixBlendMode: 'overlay', zIndex: 62, pointerEvents: 'none'}}>
        <filter id="gn9"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 6} /></filter><rect width="1080" height="1920" filter="url(#gn9)" />
      </svg>
      <div style={{position: 'absolute', left: 60, top: 1610, fontFamily: BODY, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: 'rgba(255,255,255,0.75)', zIndex: 80}}>{script.diagram.title}</div>
      <div style={{position: 'absolute', inset: 0, background: 'rgba(4,6,32,0.72)', opacity: endIn, zIndex: 70}} />
      <Sequence from={T(58)} durationInFrames={Math.max(10, durationInFrames - T(58))} style={{zIndex: 75}}>
        <Question9 dur={Math.max(10, durationInFrames - T(58))} scene={{text: 'Почему эта картина так сильна?'}} />
      </Sequence>
      <Captions />
    </AbsoluteFill>
  );
};
