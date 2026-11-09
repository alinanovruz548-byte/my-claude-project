import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing, staticFile, delayRender, continueRender, Img, Sequence, OffthreadVideo, Freeze} from 'remotion';
import {script, words} from './current';

// Видео 17 «Стены кошмаров» (Гойя): светлый чистый стиль, много переходов (смах лапой), собака без привязки к голосу:
// каждые 2-3 секунды новое действие (машет, удивляется, прыгает, умывается, смеётся), бегает между углами.
const SERIF = 'Cormorant, serif';
const SANS = 'Manrope, sans-serif';
const INK = '#2B2433', ROSE = '#C4607E', SOFT = '#7C7488', GOLD = '#B8924A';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeIO = Easing.bezier(0.65, 0, 0.35, 1);
const img = (n) => staticFile('n24/img/' + n);
const W = (i) => words[i].start;
const lerp = (a, b, q) => a + (b - a) * q;

const useFonts = () => {
  const [h] = React.useState(() => delayRender('fonts17'));
  React.useEffect(() => {
    const fs = [
      new FontFace('Cormorant', `url(${staticFile('fonts/Cormorant-VF.ttf')})`, {weight: '300 700', style: 'normal'}),
      new FontFace('Cormorant', `url(${staticFile('fonts/Cormorant-Italic-VF.ttf')})`, {weight: '300 700', style: 'italic'}),
      new FontFace('Manrope', `url(${staticFile('fonts/Manrope-VF.ttf')})`, {weight: '200 800'}),
    ];
    Promise.all(fs.map((x) => x.load())).then((l) => { l.forEach((x) => document.fonts.add(x)); continueRender(h); });
  }, [h]);
};

// ------------------------------------------------------------------ собака: расписание (время, x, y, масштаб, поза, взгляд)
const SIDE_R = {x: 890, y: 1795, s: 0.72}, SIDE_L = {x: 190, y: 1795, s: 0.72};
const KEYS = [
  {t: 0.0, x: 540, y: 3000, s: 1.0, pose: 'brain', look: 1},
  {t: 3.9, x: 540, y: 3000, s: 1.0, pose: 'brain', look: 1},
  {t: 4.6, ...SIDE_R, pose: 'ruff', look: -1},
  {t: 5.2, ...SIDE_R, pose: 'ruff', look: -1},
  {t: 5.9, ...SIDE_L, pose: 'open', look: 1},
  {t: 8.5, ...SIDE_L, pose: 'open', look: 1},
  {t: 9.2, ...SIDE_R, pose: 'look', look: -1},
  {t: 11.4, ...SIDE_R, pose: 'look', look: -1},
  {t: 12.1, ...SIDE_L, pose: 'reach', look: 1},
  {t: 14.9, ...SIDE_L, pose: 'reach', look: 1},
  {t: 15.6, ...SIDE_R, pose: 'jump', look: -1},
  {t: 17.0, ...SIDE_R, pose: 'jump', look: -1},
  {t: 17.4, ...SIDE_R, pose: 'jump', look: -1},
  {t: 18.0, ...SIDE_L, pose: 'scared', look: 1},
  {t: 21.0, ...SIDE_L, pose: 'scared', look: 1},
  {t: 21.7, x: 540, y: 1790, s: 1.0, pose: 'brain', look: 1},
  {t: 40, x: 540, y: 1790, s: 1.0, pose: 'brain', look: 1},
];
const dogState = (t) => {
  let i = 0;
  for (let k = 0; k < KEYS.length - 1; k++) if (t >= KEYS[k].t) i = k;
  const a = KEYS[i], b = KEYS[i + 1];
  // позиция: движение происходит в последние 0.55 с отрезка к следующему ключу
  const move = Math.min(1, Math.max(0, (t - (b.t - 0.55)) / 0.55));
  const swipe = a.big && b.big;
  let x, y, s;
  if (swipe) { const q = easeIO((t - a.t) / (b.t - a.t)); x = lerp(a.x, b.x, q); y = a.y; s = a.s; }
  else if (b.big) { x = a.x; y = a.y; s = a.s; }
  else { const q = easeIO(move); x = lerp(a.x, b.x, q); y = lerp(a.y, b.y, q); s = lerp(a.s, b.s, q); }
  if (a.big && !b.big) { const q = easeOut(Math.min(1, (t - b.t + 0.05) / 0.01)); x = b.x; y = b.y; s = b.s; }
  const pose = move > 0.5 && !swipe ? b.pose : a.pose;
  const look = move > 0.2 ? b.look : a.look;
  return {x, y, s, pose, look, moving: swipe ? 1 : (move > 0 && move < 1 ? 1 : 0), poseStart: a.t, a};
};

const Dog = ({t, f}) => {
  const d = dogState(t);
  const dp = dogState(t - 1 / 30);
  const speed = Math.hypot(d.x - dp.x, d.y - dp.y) * 30;
  const hop = Math.min(1, speed / 700) * Math.abs(Math.sin(f * 0.55)) * 80;
  const bob = Math.sin(f / 6) * 6;
  const jump = d.pose === 'jump' ? Math.abs(Math.sin(((t - d.poseStart) / 0.7) * Math.PI)) * 150 : 0;
  const sway = Math.sin(f / 17) * 1.8 + (d.pose === 'laugh' ? Math.sin(f / 2.2) * 2 : 0) + (d.pose === 'wash' ? Math.sin(f / 3) * 1.2 : 0);
  const squash = d.pose === 'open' ? 1 + Math.sin(f / 2) * 0.018 : 1 + Math.sin(f / 5) * 0.012;
  // разворот по X, когда меняется направление
  const sx = d.look;
  const W2 = 575 * d.s, H2 = 890 * d.s;
  return (
    <div style={{position: 'absolute', left: d.x - W2 / 2, top: d.y - H2 - bob - jump - hop, width: W2, height: H2, transformOrigin: '50% 100%', transform: `scaleX(${sx}) rotate(${sway}deg) scaleY(${squash})`, filter: 'drop-shadow(0 28px 30px rgba(70,40,60,0.28))', zIndex: 60}}>
      <Img src={img(`p_${d.pose}.png`)} style={{width: '100%', height: '100%'}} />
    </div>
  );
};

// ------------------------------------------------------------------ субтитры
const Captions = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const now = f / fps;
  let chunk = null;
  script.captions.forEach((c) => { if (now >= W(c[0][1]) - 0.04) chunk = c; });
  if (!chunk) return null;
  const a = Math.min(1, (now - (W(chunk[0][1]) - 0.04)) / 0.22);
  return (
    <div style={{position: 'absolute', left: 70, top: 172, width: 940, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontSize: 60, lineHeight: 1.12, color: INK, zIndex: 90, opacity: a, transform: `translateY(${(1 - a) * 18}px)`, letterSpacing: 0.5}}>
      {chunk.map(([txt, s0], i) => {
        const on = now >= W(s0);
        const cur = on && (i === chunk.length - 1 || now < W(chunk[i + 1][1]));
        return <span key={i} style={{opacity: on ? 1 : 0.26, color: cur ? ROSE : INK, fontStyle: cur ? 'italic' : 'normal'}}>{txt}{' '}</span>;
      })}
    </div>
  );
};

// ------------------------------------------------------------------ элементы
const Card = ({x, y, w, h, at, t, children, bg = '#fff', r = 34, rot = 0, z = 20, shadow = true, pad = 0, from = 'up'}) => {
  const q = Math.min(1, Math.max(0, (t - at) / 0.5));
  if (t < at) return null;
  const e = easeOut(q);
  const dx = from === 'left' ? -(1 - e) * 500 : from === 'right' ? (1 - e) * 500 : 0;
  const dy = from === 'up' ? (1 - e) * 120 : 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: r, background: bg, boxShadow: shadow ? '0 30px 70px rgba(80,50,90,0.2), 0 6px 16px rgba(80,50,90,0.1)' : 'none', opacity: e, transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${0.94 + 0.06 * e})`, padding: pad, overflow: 'hidden', zIndex: z}}>{children}</div>
  );
};
const Paint = ({src, w, h, pos = '50% 50%', zoomFrom = 1, zoomTo = 1.12, t, at, dur = 3}) => {
  const z = interpolate(t, [at, at + dur], [zoomFrom, zoomTo], clamp);
  return <div style={{width: '100%', height: '100%', backgroundImage: `url(${img(src)})`, backgroundSize: 'cover', backgroundPosition: pos, transform: `scale(${z})`, transformOrigin: pos}} />;
};
const Kin = ({txt, at, t, size, color = INK, italic = false, weight = 600, ls = 0, style = {}}) => {
  const q = Math.min(1, Math.max(0, (t - at) / 0.5));
  return <span style={{display: 'inline-block', opacity: q, transform: `translateY(${(1 - easeOut(q)) * 40}px)`, filter: `blur(${(1 - q) * 8}px)`, fontFamily: SERIF, fontWeight: weight, fontStyle: italic ? 'italic' : 'normal', fontSize: size, color, letterSpacing: ls, ...style}}>{txt}</span>;
};
const Chip = ({txt, at, t, x, y, bg = 'rgba(255,255,255,0.95)', color = INK, size = 30, z = 30, rot = 0}) => {
  const q = Math.min(1, Math.max(0, (t - at) / 0.4));
  if (t < at) return null;
  return <div style={{position: 'absolute', left: x, top: y, padding: '12px 26px', borderRadius: 40, background: bg, color, fontFamily: SANS, fontWeight: 700, fontSize: size, letterSpacing: 2, boxShadow: '0 12px 28px rgba(80,50,90,0.22)', opacity: easeOut(q), transform: `translateY(${(1 - easeOut(q)) * 20}px) rotate(${rot}deg)`, zIndex: z, whiteSpace: 'nowrap'}}>{txt}</div>;
};
// штукатурка стены
const Plaster = ({x, y, w, h, at, t, z = 10}) => {
  const q = Math.min(1, Math.max(0, (t - at) / 0.5));
  if (t < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 30, overflow: 'hidden', background: 'linear-gradient(160deg,#BDB3A3,#A09584)', boxShadow: '0 30px 60px rgba(60,40,30,0.3)', opacity: easeOut(q), zIndex: z}}>
      <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.45, mixBlendMode: 'multiply'}}><filter id={`pl${x}${y}`}><feTurbulence type="fractalNoise" baseFrequency="0.018 0.03" numOctaves="4" seed="6" /></filter><rect width="100%" height="100%" filter={`url(#pl${x}${y})`} /></svg>
    </div>
  );
};

const CAM_STARTS = [4.0, 5.3, 8.7, 11.7, 15.3, 17.9, 21.2];
const camAt = (t) => {
  let z = 1 + Math.sin(t / 1.7) * 0.012, rot = 0, px = 0, py = 0, blur = 0;
  CAM_STARTS.forEach((s, i) => {
    const dt = t - s;
    if (dt >= 0 && dt < 0.8) {
      const q = 1 - easeOut(dt / 0.8);
      const sg = i % 2 ? 1 : -1;
      z += (i % 3 === 0 ? 0.45 : i % 3 === 1 ? 0.7 : 0.3) * q;
      rot += sg * 6 * q; px += sg * 170 * q; py += (i % 2 ? -130 : 150) * q; blur = Math.max(blur, q * 7);
    }
  });
  return {z, rot, px, py, blur};
};
const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const BG = 'linear-gradient(172deg, #FCF5F2 0%, #F3EAF6 55%, #E8EEF9 100%)';
const easeIn3 = (x) => x * x * x;
const ASP = {fresco: 3524 / 1599, michel: 960 / 1111};
const Crop = ({src, cx, cy, wr, w, h, r = 0, children}) => {
  const a = ASP[src.slice(0, -4)];
  return (
    <div style={{position: 'relative', width: w, height: h, overflow: 'hidden', borderRadius: r}}>
      <Img src={img(src)} style={{position: 'absolute', maxWidth: 'none', width: wr, height: wr / a, left: w / 2 - cx * wr, top: h / 2 - cy * wr / a}} />
      {children && <div style={{position: 'absolute', width: wr, height: wr / a, left: w / 2 - cx * wr, top: h / 2 - cy * wr / a}}>{children}</div>}
    </div>
  );
};
const Stamp = ({txt, at, t, x, y, rot = -8, color = '#8E3556', size = 64}) => {
  if (t < at) return null;
  const q = Math.min(1, (t - at) / 0.28);
  const e = easeOut(q);
  return (
    <div style={{position: 'absolute', left: x, top: y, padding: '8px 30px', border: `7px double ${color}`, borderRadius: 14, color, fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: 6, opacity: 0.92 * Math.min(1, q * 3), transform: `rotate(${rot}deg) scale(${2.3 - 1.3 * e})`, zIndex: 40, mixBlendMode: 'multiply', whiteSpace: 'nowrap'}}>{txt}</div>
  );
};
// число, цифры которого «штампуются» по одной
const DigitStamp = ({txt, ats, t, top, size = 260, width = 175, color = INK, x = 0, w = 1080}) => (
  <div style={{position: 'absolute', left: x, width: w, top, textAlign: 'center', zIndex: 30, whiteSpace: 'nowrap'}}>
    {txt.split('').map((d, i) => {
      const at = ats[i];
      const q = Math.min(1, Math.max(0, (t - at) / 0.2));
      const e = easeOut(q);
      const ring = Math.min(1, Math.max(0, (t - at) / 0.45));
      return (
        <span key={i} style={{display: 'inline-block', position: 'relative', width, textAlign: 'center'}}>
          <span style={{display: 'inline-block', fontFamily: SERIF, fontWeight: 700, fontSize: size, lineHeight: 1, color, opacity: q > 0 ? 1 : 0, transform: `scale(${3.2 - 2.2 * e}) rotate(${(i % 2 ? 1 : -1) * (1 - e) * 14}deg)`, textShadow: '0 10px 0 rgba(196,96,126,0.25)'}}>{d}</span>
          {t >= at && <span style={{position: 'absolute', left: width / 2 - 65, top: size * 0.52 - 65, width: 130, height: 130, borderRadius: '50%', border: '8px solid rgba(196,96,126,0.55)', opacity: 1 - ring, transform: `scale(${0.5 + ring * 2.6})`}} />}
        </span>
      );
    })}
  </div>
);
const diagR = (t, s, dur) => {
  const q = easeIO(Math.min(1, Math.max(0, (t - s) / dur)));
  const X = q * 1700;
  if (t < s) return ['polygon(0 0, 0 0, 0 0)', 'polygon(0 0, 0 0, 0 0)'];
  return [`polygon(0px 0px, ${X}px 0px, ${X - 600}px 1920px, 0px 1920px)`, `polygon(0px 0px, ${X + 90}px 0px, ${X - 510}px 1920px, 0px 1920px)`];
};
const Tiles = ({t, T}) => {
  if (t < T - 0.6 || t > T + 0.7) return null;
  const out = [];
  for (let r = 0; r < 11; r++) for (let c = 0; c < 6; c++) {
    const d = hash(r * 7 + c) * 0.25;
    const a = Math.min(1, Math.max(0, (t - (T - 0.5 + d)) / 0.25));
    const b = Math.min(1, Math.max(0, (t - (T + 0.05 + d)) / 0.25));
    const s = easeOut(a) * (1 - easeIO(b));
    if (s <= 0.01) continue;
    out.push(<div key={r * 6 + c} style={{position: 'absolute', left: c * 180, top: r * 175 - 2, width: 182, height: 177, background: (r + c) % 2 ? '#7A3B48' : '#F4DCD0', transform: `scale(${s}) rotate(${(1 - s) * 90}deg)`, boxShadow: 'inset 0 0 0 4px rgba(150,90,100,0.3)'}} />);
  }
  return <div style={{position: 'absolute', inset: 0, zIndex: 45, pointerEvents: 'none'}}>{out}</div>;
};
// контур мозга поверх фрески (координаты в пикселях изображения 2000x907)
const BRAIN = 'M985 345 C990 200 1100 80 1300 40 C1500 5 1750 10 1900 70 C1985 110 2000 250 1990 380 C1985 470 1950 540 1860 585 C1790 615 1700 600 1650 580 C1600 600 1500 600 1400 595 C1300 595 1180 570 1110 510 C1050 460 985 420 985 345 Z';
const BrainOverlay = ({t, a, b, fillAt}) => {
  const q = easeOut(Math.min(1, Math.max(0, (t - a) / (b - a))));
  const fq = Math.min(1, Math.max(0, (t - fillAt) / 0.8));
  return (
    <svg width="100%" height="100%" viewBox="0 0 2000 907" style={{position: 'absolute', inset: 0}}>
      <defs><clipPath id="brainclip"><path d={BRAIN} /></clipPath></defs>
      <path d={BRAIN} fill={`rgba(255,140,190,${0.2 * fq})`} />
      <g clipPath="url(#brainclip)" opacity={fq * 0.5}>
        <image href={img('brain_cut.png')} x="985" y="0" width="1015" height="630" preserveAspectRatio="none" style={{filter: 'drop-shadow(0 0 24px rgba(255,110,185,0.95))'}} />
      </g>
      <path d={BRAIN} fill="none" stroke="#FFD0E4" strokeWidth="10" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - q} style={{filter: 'drop-shadow(0 0 14px rgba(255,120,180,0.95))'}} />
    </svg>
  );
};

export const Board24Main = () => {
  useFonts();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const k = (a, b, ease = easeIO) => interpolate(t, [a, b], [0, 1], {...clamp, easing: ease});
  const cam = camAt(t);
  const tapAt = 23.2, tap2At = 23.8;
  const endIn = k(21.2, 21.8, easeOut);
  const cur = t < tapAt ? 0 : t < tap2At ? 1 : 2;
  const curX = interpolate(t, [22.2, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [880, 560, 560, 600], clamp);
  const curY = interpolate(t, [22.2, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [1500, 770, 780, 910], clamp);

  const [clipB, bandB] = diagR(t, 2.2, 0.65);
  const irisC = `circle(${easeOut(k(5.3, 6.0)) * 1800}px at 540px 900px)`;
  const flipOut = k(11.2, 11.7, (x) => x * x);
  const flipIn = k(11.7, 12.2, easeOut);
  const shQ = (i) => easeIO(Math.min(1, Math.max(0, (t - 15.1 - i * 0.04) / 0.4)));
  const wipeG = easeIO(k(18.2, 18.85));
  const irisH = `circle(${easeOut(k(21.2, 21.9)) * 2300}px at 540px 1500px)`;

  const hkWr = 1080 + 460 * easeIO(k(0, 2.3));
  const hkCx = 0.5 + 0.2 * easeIO(k(0, 2.3));
  const pulse = 0.55 + 0.45 * Math.abs(Math.sin(t * 5));

  return (
    <AbsoluteFill style={{background: BG}}>
      {['fresco.jpg', 'michel.jpg', 'doctor.png', 'brain_cut.png', 'sk1.jpg', 'sk2.jpg', 'sk3.jpg', 'scalpel_cut.png', 'p_brain.png', 'p_look.png', 'p_reach.png', 'p_ruff.png', 'p_scared.png', 'p_open.png', 'p_jump.png'].map((n) => <Img key={n} src={img(n)} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />)}

      {/* A. ХУК: собака-Адам на облаке (видео Kling), пальчик, вжух (светлая вспышка) */}
      {t < 4.1 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 15, overflow: 'hidden', background: '#E9C9E6'}}>
          <div style={{position: 'absolute', inset: 0, transformOrigin: '50% 62%', transform: `scale(${1.12 + 0.12 * easeIn3(k(3.2, 4.0))})`, filter: `blur(${easeIn3(k(3.5, 4.0)) * 7}px)`}}>
            <Sequence from={0} durationInFrames={120}><OffthreadVideo src={staticFile('n24/vid/hook_adam.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} /></Sequence>
          </div>
        </div>
      )}
      <div style={{position: 'absolute', inset: 0, background: '#FFE3F0', opacity: Math.min(k(3.85, 4.0), 1 - k(4.05, 4.3)), zIndex: 48, pointerEvents: 'none'}} />

      <div style={{position: 'absolute', inset: 0, transform: `translate(${cam.px}px, ${cam.py}px) rotate(${cam.rot}deg) scale(${cam.z})`, transformOrigin: '50% 50%', filter: cam.blur > 0.4 ? `blur(${cam.blur}px)` : undefined}}>
        {/* B. фреска Микеланджело */}
        {t >= 3.95 && t < 5.6 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 16, background: BG, opacity: k(4.0, 4.25)}}>
            <Card x={60} y={440} w={960} h={470} at={4.1} t={t} r={20} pad={8} bg="#fff" rot={-1}><Crop src="fresco.jpg" cx={0.5} cy={0.5} wr={944 + 40 * k(4.1, 5.6, easeIO)} w={944} h={454} r={10} /></Card>
            <Card x={90} y={940} w={300} h={347} at={4.3} t={t} r={18} rot={-3} pad={7} bg="#fff"><Crop src="michel.jpg" cx={0.5} cy={0.42} wr={286} w={286} h={333} r={10} /></Card>
            <Chip txt="Микеланджело" at={4.4} t={t} x={420} y={980} size={34} />
            <Chip txt="Сикстинская капелла" at={4.7} t={t} x={420} y={1050} size={28} bg="rgba(255,236,170,0.98)" />
            <Chip txt="Ватикан" at={5.0} t={t} x={420} y={1115} size={26} />
          </div>
        )}

        {/* C. 1508 -> 1512 (круг) */}
        {t >= 5.3 && t < 9.1 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 17, background: BG, clipPath: irisC}}>
            <DigitStamp t={t} txt="1508" ats={[5.8, 6.05, 6.3, 6.5]} top={330} size={190} width={118} x={10} w={500} />
            <div style={{position: 'absolute', left: 480, width: 120, top: 360, textAlign: 'center', fontFamily: SERIF, fontSize: 110, color: ROSE, opacity: k(6.6, 6.9), lineHeight: 1}}>→</div>
            <DigitStamp t={t} txt="1512" ats={[7.2, 7.45, 7.7, 7.9]} top={330} size={190} width={118} x={580} w={500} />
            <Card x={60} y={620} w={960} h={620} at={5.6} t={t} r={22} pad={8} bg="#fff" rot={0}>
              <Crop src="fresco.jpg" cx={0.745} cy={0.43} wr={1840} w={944} h={604} r={12}>
                <BrainOverlay t={t} a={5.5} b={6.5} fillAt={6.5} />
              </Crop>
            </Card>
          </div>
        )}

        {/* D. 1990, врач из Америки (плитки) */}
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

        {/* E. контур Бога = срез мозга (переворот) */}
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

        {/* G. гипотеза (под разрезом) */}
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
      </div>

      {/* H. финал */}
      {t >= 21.2 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 50, background: BG, clipPath: irisH}}>
          <div style={{position: 'absolute', left: 0, width: 1080, top: 345, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 100, color: INK, lineHeight: 1.05, opacity: endIn}}>Вы видите<br />мозг?</div>
          {[['Вижу мозг', 640, 0], ['Не вижу', 780, 1]].map(([txt, top, i]) => {
            const pr = spring({frame: f - Math.round((21.8 + i * 0.15) * fps), fps, config: {damping: 14, stiffness: 160}});
            const glow = i === 0 && t >= tapAt && t < tap2At;
            const glow2 = i === 1 && t >= tap2At;
            const g = glow || glow2;
            return (
              <div key={i} style={{position: 'absolute', left: 170, top, width: 740, height: 110, borderRadius: 55, background: g ? 'linear-gradient(90deg,#F7C3D2,#E79BB4)' : 'rgba(255,255,255,0.92)', color: INK, fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: g ? '0 20px 50px rgba(196,96,126,0.45)' : '0 16px 36px rgba(80,50,90,0.18)', transform: `scale(${Math.min(pr, 1.03) * (g ? 1.05 : 1)})`, opacity: Math.min(1, pr * 2)}}>{txt}</div>
            );
          })}
          <svg width="120" height="140" viewBox="-10 -10 120 140" style={{position: 'absolute', left: curX, top: curY, zIndex: 80, filter: 'drop-shadow(8px 12px 10px rgba(0,0,0,0.3))', transform: `scale(${(t >= tapAt && t < tapAt + 0.2) || (t >= tap2At && t < tap2At + 0.2) ? 0.85 : 1})`}}>
            <path d="M5 5 L5 95 L30 72 L48 112 L66 104 L48 66 L82 66 Z" fill="#fff" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      <Tiles t={t} T={8.7} />
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
      })()}
      <Dog t={t} f={f} />
      <div style={{position: 'absolute', left: 60, top: 1622, padding: '12px 26px', borderRadius: 30, background: 'rgba(255,255,255,0.94)', boxShadow: '0 10px 26px rgba(80,50,90,0.18)', fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: INK, zIndex: 95}}>{script.diagram.title}</div>
      <Captions />
    </AbsoluteFill>
  );
};
