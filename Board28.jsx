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
const img = (n) => staticFile('n28/img/' + n);
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
  {t: 0.0, x: 540, y: 3000, s: 1.0, pose: 'artist', look: 1},
  {t: 2.9, x: 540, y: 3000, s: 1.0, pose: 'artist', look: 1},
  {t: 3.4, ...SIDE_R, pose: 'artist', look: -1},
  {t: 5.3, ...SIDE_R, pose: 'artist', look: -1},
  {t: 5.8, ...SIDE_L, pose: 'open', look: 1},
  {t: 9.0, ...SIDE_L, pose: 'open', look: 1},
  {t: 9.5, ...SIDE_R, pose: 'scared', look: -1},
  {t: 12.6, ...SIDE_R, pose: 'scared', look: -1},
  {t: 13.1, ...SIDE_L, pose: 'think', look: 1},
  {t: 16.9, ...SIDE_L, pose: 'think', look: 1},
  {t: 17.6, ...SIDE_R, pose: 'jump', look: -1},
  {t: 20.1, ...SIDE_R, pose: 'jump', look: -1},
  {t: 20.8, ...SIDE_L, pose: 'judge', look: 1},
  {t: 25.3, ...SIDE_L, pose: 'judge', look: 1},
  {t: 25.9, x: 540, y: 1790, s: 0.85, pose: 'open', look: 1},
  {t: 40, x: 540, y: 1790, s: 0.85, pose: 'open', look: 1},
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

const CAM_STARTS = [2.4, 5.5, 9.2, 12.8, 17.1, 20.4, 25.4];
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
const SolidStamp = ({txt, at, t, x, y, rot = -8, size = 80}) => {
  if (t < at) return null;
  const q = Math.min(1, (t - at) / 0.22);
  const e = easeOut(q);
  return <div style={{position: 'absolute', left: x, top: y, padding: '10px 36px', borderRadius: 16, background: '#C4607E', border: '6px solid #fff', boxShadow: '0 20px 40px rgba(120,30,70,0.5)', color: '#fff', fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: 8, opacity: Math.min(1, q * 3), transform: `rotate(${rot}deg) scale(${2.6 - 1.6 * e})`, zIndex: 40, whiteSpace: 'nowrap'}}>{txt}</div>;
};
// субтитры: каждое слово «выпрыгивает» пружиной, текущее подсвечено и чуть крупнее
const CaptionsAnim = ({light}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const now = f / fps;
  let chunk = null;
  script.captions.forEach((c) => { if (now >= W(c[0][1]) - 0.04) chunk = c; });
  if (!chunk) return null;
  const base = light ? '#fff' : INK;
  const dim = light ? 0.45 : 0.26;
  return (
    <div style={{position: 'absolute', left: 60, top: 172, width: 960, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontSize: 62, lineHeight: 1.14, color: base, zIndex: 90, letterSpacing: 0.5, textShadow: light ? '0 4px 22px rgba(0,0,0,0.75)' : 'none'}}>
      {chunk.map(([txt, s0], i) => {
        const wt = W(s0);
        const on = now >= wt;
        const cur = on && (i === chunk.length - 1 || now < W(chunk[i + 1][1]));
        const sp = spring({frame: f - Math.round((wt - 0.05) * fps), fps, config: {damping: 10, stiffness: 210}});
        const q = on ? Math.min(1.12, sp) : 0;
        const appear = Math.min(1, Math.max(0, (now - (W(chunk[0][1]) - 0.04)) / 0.2));
        return <span key={i} style={{display: 'inline-block', marginRight: 14, opacity: (on ? 1 : dim) * appear, transform: `translateY(${on ? (1 - Math.min(1, sp)) * 26 : 8}px) scale(${on ? 0.7 + 0.3 * q + (cur ? 0.07 : 0) : 0.92})`, color: cur ? (light ? '#FFC2DA' : ROSE) : base, fontStyle: cur ? 'italic' : 'normal', transformOrigin: '50% 80%'}}>{txt}</span>;
      })}
    </div>
  );
};
const Pic = ({src, filter, pos = '50% 50%', fit = 'cover'}) => (
  <div style={{width: '100%', height: '100%', borderRadius: 10, overflow: 'hidden', filter}}><Img src={img(src)} style={{width: '100%', height: '100%', objectFit: fit, objectPosition: pos}} /></div>
);
// бумажный человечек в пальто и шляпе
const Person = ({x, y, s = 1, c = '#8E6A4A', hat = '#4A3A30', bob = 0}) => (
  <svg width="90" height="190" viewBox="0 0 90 190" style={{position: 'absolute', left: x, top: y + bob, transform: `scale(${s})`, transformOrigin: '50% 100%', overflow: 'visible'}}>
    <ellipse cx="45" cy="184" rx="30" ry="6" fill="rgba(60,40,60,0.2)" />
    <path d="M20 180 L26 90 Q45 70 64 90 L70 180 Z" fill={c} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    <circle cx="45" cy="62" r="20" fill="#F0D2C2" stroke={INK} strokeWidth="3" />
    <path d="M18 56 Q45 40 72 56 L66 46 Q45 22 24 46 Z" fill={hat} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    <rect x="14" y="52" width="62" height="7" rx="3" fill={hat} stroke={INK} strokeWidth="3" />
  </svg>
);
const Ticket = ({w = 700, h = 300, txt = 'ВХОД'}) => (
  <div style={{position: 'relative', width: w, height: h, background: 'linear-gradient(135deg,#FFF1C9,#F2D27C)', borderRadius: 26, border: '8px solid #B8892A', boxSizing: 'border-box', boxShadow: '0 30px 60px rgba(60,40,20,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 800, fontSize: h * 0.34, letterSpacing: 14, color: '#6B4A12'}}>
    <div style={{position: 'absolute', left: -22, top: h / 2 - 22, width: 44, height: 44, borderRadius: '50%', background: '#2a1f16'}} />
    <div style={{position: 'absolute', right: -22, top: h / 2 - 22, width: 44, height: 44, borderRadius: '50%', background: '#2a1f16'}} />
    <div style={{position: 'absolute', left: h * 0.5, top: 14, bottom: 14, borderLeft: '6px dashed rgba(107,74,18,0.5)'}} />
    <span style={{marginLeft: h * 0.4}}>{txt}</span>
  </div>
);


// схематичная «фреска» (не оригинал)
const Mural = ({w, h, seed = 3}) => {
  const P = ['#1E1E1E', '#6E6E6E', '#F2F2F2', '#A0A0A0', '#3A3A3A'];
  return (
    <svg width={w} height={h} viewBox="0 0 780 350" style={{display: 'block', borderRadius: 8, background: '#C9C9C9'}}>
      <rect width="780" height="350" fill="#C4C4C4" />
      {Array.from({length: 22}).map((_, i) => {
        const x = hash(i + seed) * 700, y = hash(i * 3 + seed) * 250, s = 50 + hash(i * 7 + seed) * 110;
        return <polygon key={i} points={`${x},${y + s} ${x + s * 0.6},${y} ${x + s * 1.2},${y + s * 0.9}`} fill={P[i % 5]} opacity={0.85} />;
      })}
      {Array.from({length: 7}).map((_, i) => <line key={i} x1={hash(i + 40) * 780} y1={0} x2={hash(i + 50) * 780} y2={350} stroke="#1E1E1E" strokeWidth="3" opacity="0.55" />)}
    </svg>
  );
};
const Curtain = ({w, h, style = {}}) => (
  <div style={{width: w, height: h, background: 'repeating-linear-gradient(90deg,#2C5AA0 0px,#3B72C0 38px,#244B86 76px,#2C5AA0 110px)', boxShadow: 'inset 0 -40px 80px rgba(10,20,50,0.45), inset 0 30px 60px rgba(255,255,255,0.12)', ...style}} />
);
const Lock = ({x, y, s = 1, rot = 0}) => (
  <svg width="140" height="170" viewBox="0 0 140 170" style={{position: 'absolute', left: x, top: y, transform: `scale(${s}) rotate(${rot}deg)`, zIndex: 38, filter: 'drop-shadow(0 10px 14px rgba(40,30,20,0.4))'}}>
    <path d="M32 80 V54 a38 38 0 0 1 76 0 V80" fill="none" stroke="#7B7B86" strokeWidth="14" />
    <rect x="14" y="76" width="112" height="86" rx="14" fill="#E3B64C" stroke="#8A6A1E" strokeWidth="6" />
    <circle cx="70" cy="114" r="11" fill="#6B4A12" /><rect x="65" y="116" width="10" height="28" rx="4" fill="#6B4A12" />
  </svg>
);
const Plane = ({x, y, rot = 0}) => (
  <svg width="260" height="110" viewBox="0 0 260 110" style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`, zIndex: 36, filter: 'drop-shadow(0 14px 14px rgba(40,30,60,0.3))'}}>
    <path d="M10 56 Q18 38 60 38 L190 40 Q244 44 252 58 Q244 72 190 74 L60 74 Q18 74 10 56 Z" fill="#fff" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
    <path d="M110 40 L150 2 L176 2 L152 42 Z" fill="#E9B8CE" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
    <path d="M110 72 L150 108 L176 108 L152 72 Z" fill="#E9B8CE" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
    <path d="M14 52 L6 26 L34 28 L44 42 Z" fill="#C4607E" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
    {[80, 112, 144, 176].map((cx) => <circle key={cx} cx={cx + 20} cy="54" r="7" fill="#9CC4E4" stroke={INK} strokeWidth="3" />)}
  </svg>
);
const Podium = ({x, y}) => (
  <svg width="260" height="340" viewBox="0 0 260 340" style={{position: 'absolute', left: x, top: y, zIndex: 34, filter: 'drop-shadow(0 18px 20px rgba(40,30,60,0.3))'}}>
    <path d="M40 120 H220 L236 330 H24 Z" fill="#8A93B8" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
    <rect x="34" y="104" width="192" height="26" rx="8" fill="#B7BEDB" stroke={INK} strokeWidth="6" />
    <line x1="130" y1="104" x2="130" y2="40" stroke={INK} strokeWidth="7" strokeLinecap="round" />
    <ellipse cx="130" cy="30" rx="22" ry="16" fill="#3A3A46" stroke={INK} strokeWidth="5" />
    <text x="130" y="240" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="46" fill="#fff">ООН</text>
  </svg>
);
const Eiffel = ({x, y, s = 1}) => (
  <svg width="260" height="520" viewBox="0 0 260 520" style={{position: 'absolute', left: x, top: y, transform: `scale(${s})`, transformOrigin: '50% 100%', zIndex: 12}}>
    <path d="M130 10 L150 160 L190 300 L240 510 L200 510 L170 400 L90 400 L60 510 L20 510 L70 300 L110 160 Z" fill="#B9A58A" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
    <path d="M100 250 H160 M80 330 H180 M90 400 H170" stroke={INK} strokeWidth="5" />
  </svg>
);

const Sea = ({t}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: 'linear-gradient(180deg,#CFE3F6 0%,#EAF3FB 38%,#9CC4E4 40%,#3F78B8 62%,#1B4A86 100%)'}}>
    <div style={{position: 'absolute', left: 80, top: 320, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle,#FFF6D8 0%,rgba(255,246,216,0) 70%)'}} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <svg key={i} width="2160" height="140" viewBox="0 0 2160 140" style={{position: 'absolute', left: -(((t * (30 + i * 14)) % 1080) + (i % 2) * 200), top: 760 + i * 130, opacity: 0.32 + i * 0.07}}>
        <path d={`M0 70 ${Array.from({length: 18}).map((_, j) => `Q${j * 120 + 60} ${70 + (j % 2 ? -34 : 34)} ${j * 120 + 120} 70`).join(' ')}`} fill="none" stroke="#fff" strokeWidth={4 + i} strokeLinecap="round" />
      </svg>
    ))}
  </div>
);

export const Board28Main = () => {
  useFonts();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const k = (a, b, ease = easeIO) => interpolate(t, [a, b], [0, 1], {...clamp, easing: ease});
  const cam = camAt(t);
  const tapAt = 26.3, tap2At = 26.9;
  const endIn = k(25.5, 26.0, easeOut);
  const curX = interpolate(t, [25.9, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [880, 560, 560, 600], clamp);
  const curY = interpolate(t, [25.9, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [1500, 780, 790, 920], clamp);

  const hookZoom = easeIn3(k(1.2, 2.4, easeIO));
  const zq = easeIO(k(5.5, 6.1));
  const zig = (() => { const X = -200 + 1500 * zq; const pts = ['0px 0px']; for (let y = 0; y <= 1920; y += 120) pts.push(`${X + ((y / 120) % 2 ? 90 : 0)}px ${y}px`); pts.push('0px 1920px'); return `polygon(${pts.join(',')})`; })();
  const chk = (r, c) => easeOut(Math.min(1, Math.max(0, (t - 9.2 - (r + c) * 0.045) / 0.3)));
  const ink = easeOut(k(12.8, 13.5));
  const pq = easeIO(k(17.1, 17.7));
  const cl = easeIO(k(19.9, 20.4)), op = easeIO(k(20.5, 21.0));
  const barQ = (i) => easeIO(Math.min(1, Math.max(0, (t - 25.4 - i * 0.05) / 0.4)));
  const count = Math.round(40 * easeOut(k(2.5, 3.3)));
  const planeX = interpolate(t, [17.9, 19.9], [-330, 1180], clamp);
  const G = ({w, h, style = {}}) => <img src={img('guernica.jpg')} style={{width: w, height: h, objectFit: 'cover', display: 'block', borderRadius: 6, ...style}} />;

  return (
    <AbsoluteFill style={{background: BG}}>
      {['ruins.jpg', 'guernica.jpg', 'padlock.png', 'eiffel.jpg', 'ship.jpg', 'nyc.jpg', 'un.jpg', 'p_artist.png', 'p_think.png', 'p_judge.png', 'p_scared.png', 'p_open.png', 'p_jump.png', 'p_laugh.png'].map((n) => <Img key={n} src={img(n)} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />)}

      {/* ХУК: собака закрывает картину синей шторой, зум в ткань (Kling) */}
      {t < 2.4 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 15, overflow: 'hidden', background: '#16294a'}}>
          <div style={{position: 'absolute', inset: 0, transformOrigin: '72% 40%', transform: `scale(${1 + 2.4 * hookZoom})`, filter: hookZoom > 0.05 ? `blur(${hookZoom * 3}px)` : undefined}}>
            <Sequence from={0} durationInFrames={102}><OffthreadVideo src={staticFile('n28/vid/hook_curtain.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} /></Sequence>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 380, background: 'linear-gradient(180deg, rgba(8,10,20,0.6) 0%, rgba(8,10,20,0))', zIndex: 5}} />
        </div>
      )}

      <div style={{position: 'absolute', inset: 0, transform: `translate(${cam.px}px, ${cam.py}px) rotate(${cam.rot}deg) scale(${cam.z})`, transformOrigin: '50% 50%', filter: cam.blur > 0.4 ? `blur(${cam.blur}px)` : undefined}}>
        {/* A. больше 40 лет не пускали в Испанию */}
        {t >= 2.4 && t < 6.0 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 16, background: BG}}>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 340, textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 330, lineHeight: 1, color: INK, textShadow: '0 14px 0 rgba(196,96,126,0.22)', transform: `scale(${0.8 + 0.2 * k(2.5, 3.0, easeOut)})`}}>{count}{t > 3.3 ? '+' : ''}</div>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 700, textAlign: 'center'}}><Kin txt="лет не пускали" at={2.9} t={t} size={88} italic color={ROSE} /></div>
            <Card x={90} y={860} w={820} h={380} at={3.0} t={t} r={12} rot={-2.5} pad={8} bg="#fff" from="left"><G w="100%" h="100%" /></Card>
            {t >= 3.5 && (() => { const q = easeOut(k(3.5, 3.9)); return <img src={img('padlock.png')} style={{position: 'absolute', left: 640, top: 920, width: 170, zIndex: 38, transform: `rotate(${-8 + (1 - q) * 25}deg) scale(${0.6 + 0.4 * q})`, opacity: q, filter: 'drop-shadow(0 0 2px rgba(40,30,50,0.9)) drop-shadow(0 16px 18px rgba(40,30,20,0.45))'}} />; })()}
            <SolidStamp txt="ВЪЕЗД ЗАКРЫТ" at={3.7} t={t} x={140} y={1150} rot={-5} size={54} />
            <Chip txt="«Герника», Пикассо" at={3.2} t={t} x={110} y={790} size={28} bg="rgba(255,255,255,0.97)" rot={-2} z={36} />
            <Chip txt="решил сам автор" at={4.4} t={t} x={70} y={1310} size={34} bg="rgba(255,236,170,0.98)" rot={-2} />
          </div>
        )}

        {/* B. «Герника» Пикассо, Париж, 1937 (зигзаг) */}
        {t >= 5.5 && t < 9.6 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 17, background: BG, clipPath: t < 6.15 ? zig : 'none'}}>
            <DigitStamp t={t} txt="1937" ats={[7.9, 8.15, 8.45, 8.7]} top={330} size={210} width={150} />
            <Card x={90} y={640} w={900} h={409} at={6.1} t={t} r={12} rot={-1.5} pad={8} bg="#fff" from="left"><G w="100%" h="100%" /></Card>
            <Chip txt="«Герника»" at={6.3} t={t} x={90} y={560} size={44} />
            <Chip txt="Пикассо" at={6.85} t={t} x={430} y={575} size={34} bg="rgba(255,236,170,0.98)" rot={2} />
            <Card x={590} y={1090} w={400} h={460} at={7.3} t={t} r={12} rot={3} pad={7} bg="#fff" from="right"><Pic src="eiffel.jpg" pos="50% 30%" /></Card>
            <Chip txt="Париж, всемирная выставка" at={7.48} t={t} x={70} y={1075} size={32} bg="rgba(255,236,170,0.98)" rot={-1} />
          </div>
        )}

        {/* C. бомбардировка баскского города (шахматка) */}
        {t >= 9.2 && t < 13.3 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 18, background: BG, clipPath: t < 9.8 ? 'url(#chkC)' : 'none'}}>
            <svg width="0" height="0" style={{position: 'absolute'}}><clipPath id="chkC">{Array.from({length: 11}).flatMap((_, r) => Array.from({length: 6}).map((__, c) => { const s = chk(r, c) * 190; return <rect key={r * 10 + c} x={c * 180 + 90 - s / 2} y={r * 180 + 90 - s / 2} width={s} height={s} />; }))}</clipPath></svg>
            <Chip txt="26 апреля 1937" at={9.5} t={t} x={70} y={400} size={40} />
            <Card x={110} y={560} w={860} h={630} at={9.9} t={t} r={14} rot={2} pad={8} bg="#fff" from="right"><Pic src="ruins.jpg" /></Card>
            <div style={{position: 'absolute', left: 90, top: 1215, fontFamily: SANS, fontWeight: 700, fontSize: 20, color: '#5A4A66', opacity: k(10.3, 10.7)}}>Фото: Bundesarchiv, CC BY-SA 3.0 de</div>
            <Chip txt="баскский город Герника" at={12.0} t={t} x={60} y={1280} size={30} bg="rgba(255,236,170,0.98)" rot={-2} />
            <div style={{position: 'absolute', left: 60, top: 1380, width: 520, height: 24, borderRadius: 12, background: 'rgba(120,100,140,0.2)', opacity: k(9.6, 10.0)}}><div style={{width: `${100 * easeOut(k(10.0, 11.2))}%`, height: '100%', borderRadius: 12, background: 'linear-gradient(90deg,#F7A8C8,#C4607E)'}} /></div>
            <Chip txt="несколько недель" at={10.4} t={t} x={60} y={1430} size={26} bg="rgba(230,225,238,0.98)" />
          </div>
        )}

        {/* D. картина плывёт на лайнере по морю в Нью-Йорк (кляксы) */}
        {t >= 12.8 && t < 17.8 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 19, background: BG, transform: `translateX(${-pq * 1080}px)`, clipPath: t < 13.6 ? 'url(#inkD)' : 'none'}}>
            <svg width="0" height="0" style={{position: 'absolute'}}><clipPath id="inkD">{[[200, 400], [880, 600], [520, 1000], [160, 1450], [900, 1500], [540, 1900]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={ink * (900 + i * 60)} />)}</clipPath></svg>
            <Sea t={t} />
            {t >= 15.2 && (() => { const q = easeOut(k(15.2, 15.9)); return <div style={{position: 'absolute', left: 60, top: 500, width: 960, height: 280, background: '#fff', padding: 8, borderRadius: 12, boxShadow: '0 20px 40px rgba(20,40,80,0.35)', opacity: q, transform: `translateY(${(1 - q) * 60}px) rotate(1deg)`, zIndex: 25}}><Pic src="nyc.jpg" pos="50% 28%" /></div>; })()}
            <Chip txt="Нью-Йорк" at={15.9} t={t} x={700} y={440} size={40} z={40} />
            <Chip txt="по морю" at={13.4} t={t} x={80} y={420} size={34} bg="rgba(255,236,170,0.98)" rot={-2} z={40} />
            {(() => { const x = interpolate(t, [13.0, 16.9], [-800, 330], {...clamp, easing: easeIO}); const bob = Math.sin(t * 2.4) * 10; const tilt = Math.sin(t * 2.4 + 1) * 1.6;
              return (<>
                <img src={img('liner.png')} style={{position: 'absolute', left: x, top: 930 + bob, width: 760, zIndex: 30, transform: `rotate(${tilt}deg)`, filter: 'drop-shadow(0 18px 18px rgba(10,30,70,0.5))'}} />
                <div style={{position: 'absolute', left: x + 200, top: 700 + bob * 1.4, width: 360, zIndex: 31, transform: `rotate(${tilt * 2 - 2}deg)`, background: '#fff', padding: 6, borderRadius: 8, boxShadow: '0 18px 30px rgba(10,30,70,0.45)', opacity: k(13.1, 13.5)}}><G w={348} h={158} /></div>
              </>); })()}
            <div style={{position: 'absolute', left: 400, top: 1260, width: 620, padding: '18px 26px', borderRadius: 28, background: 'rgba(255,255,255,0.96)', boxShadow: '0 16px 36px rgba(10,30,70,0.3)', opacity: k(14.2, 14.7), transform: `translateY(${(1 - easeOut(k(14.2, 14.7))) * 30}px)`, zIndex: 34}}>
              <div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600, fontSize: 40, color: INK, lineHeight: 1.15}}>«Пока в Испании нет свободы, пусть картина живёт тут»</div>
              <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 28, color: ROSE, marginTop: 10, textAlign: 'right', opacity: k(15.6, 16.1)}}>— Пабло Пикассо</div>
            </div>
          </div>
        )}
        {/* E. 1981: возвращение (толчок вбок) */}
        {t >= 17.1 && t < 20.9 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 20, background: BG, transform: `translateX(${(1 - pq) * 1080}px)`}}>
            <DigitStamp t={t} txt="1981" ats={[18.5, 18.8, 19.1, 19.55]} top={330} size={230} width={165} />
            {t >= 17.9 && <Plane x={planeX} y={760 + Math.sin(t * 3) * 14} rot={-4} />}
            <div style={{position: 'absolute', left: planeX - 420, top: 830, width: 300, height: 140, background: '#fff', padding: 6, borderRadius: 10, boxShadow: '0 14px 28px rgba(60,40,70,0.25)', zIndex: 35, opacity: t >= 17.9 ? 1 : 0, transform: `rotate(${Math.sin(t * 5) * 3}deg)`}}><G w={288} h={128} /></div>
            <Chip txt="домой, в Испанию" at={17.6} t={t} x={70} y={640} size={34} bg="rgba(255,236,170,0.98)" rot={-2} />
            <Chip txt="10 сентября" at={19.4} t={t} x={110} y={1110} size={34} rot={2} />
            <Chip txt="Мадрид" at={19.8} t={t} x={110} y={1210} size={40} bg="rgba(230,225,238,0.98)" />
            {Array.from({length: 16}).map((_, i) => { const at = 19.7 + (i % 4) * 0.06; const q = Math.max(0, t - at); return t >= at ? <div key={i} style={{position: 'absolute', left: 80 + i * 60, top: 520 + q * 380 + (i % 3) * 30, width: 16, height: 26, background: ['#F7A8C8', '#E9B64C', '#9CC4E4', '#fff'][i % 4], transform: `rotate(${q * 300 + i * 40}deg)`, borderRadius: 3, zIndex: 31, opacity: Math.max(0, 1 - q * 0.7)}} /> : null; })}
          </div>
        )}

        {/* F. 2003: ООН, гобелен закрывают синей шторой */}
        {t >= 20.4 && t < 25.8 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 21, background: BG}}>
            <DigitStamp t={t} txt="2003" ats={[20.6, 20.85, 21.1, 21.3]} top={330} size={230} width={165} />
            <Card x={90} y={640} w={900} h={470} at={21.4} t={t} r={12} rot={-1} pad={8} bg="#fff" from="up"><Pic src="un.jpg" pos="50% 35%" /></Card>
            <Chip txt="Совет Безопасности ООН" at={21.6} t={t} x={110} y={600} size={30} z={40} />
            <div style={{position: 'absolute', left: 600, top: 1125, fontFamily: SANS, fontWeight: 700, fontSize: 18, color: '#5A4A66', opacity: k(22.0, 22.4)}}>Фото: Commons, CC BY 4.0</div>
            <Card x={300} y={940} w={620} h={282} at={22.0} t={t} r={10} rot={2} pad={7} bg="#fff" from="right" z={35}><G w="100%" h="100%" /></Card>
            {(() => { const q = easeIO(k(22.3, 23.1)); return (<>
              <div style={{position: 'absolute', left: 307, top: 947, width: 303, height: 268, overflow: 'hidden', zIndex: 39, transform: 'rotate(2deg)'}}><Curtain w={303} h={268} style={{transform: `translateX(${(q - 1) * 303}px)`}} /></div>
              <div style={{position: 'absolute', left: 610, top: 947, width: 303, height: 268, overflow: 'hidden', zIndex: 39, transform: 'rotate(2deg)'}}><Curtain w={303} h={268} style={{transform: `translateX(${(1 - q) * 303}px)`}} /></div>
            </>); })()}
            <Chip txt="гобелен-копия" at={23.2} t={t} x={420} y={1250} size={30} bg="rgba(230,225,238,0.98)" rot={2} />
            <Chip txt="5 февраля" at={22.4} t={t} x={80} y={540} size={32} bg="rgba(255,236,170,0.98)" rot={-2} />
            <Chip txt="речь о войне в Ираке" at={24.3} t={t} x={400} y={1330} size={32} bg="rgba(255,236,170,0.98)" />
          </div>
        )}
      </div>

      {/* шторы смыкаются: E -> F */}
      {t >= 19.85 && t < 21.1 && (
        <>
          <Curtain w={560} h={1920} style={{position: 'absolute', left: 0, top: 0, zIndex: 60, transform: `translateX(${-560 + 560 * cl - 560 * op}px)`}} />
          <Curtain w={560} h={1920} style={{position: 'absolute', left: 520, top: 0, zIndex: 60, transform: `translateX(${560 - 560 * cl + 560 * op}px)`}} />
        </>
      )}

      {/* G. финал: полосы падают сверху */}
      {t >= 25.4 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 50, background: BG, clipPath: 'url(#barsG)'}}>
          <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}><img src={img('guernica.jpg')} style={{position: 'absolute', maxWidth: 'none', width: 4222, height: 1920, left: -1570, top: 0, transformOrigin: '1570px 50%', transform: `scale(${1 + 0.12 * k(25.4, 27.6, (x) => x)})`, filter: 'blur(2px)'}} /><div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(252,245,242,0.72) 0%, rgba(250,244,246,0.58) 50%, rgba(240,238,248,0.66) 100%)'}} /></div>
          <svg width="0" height="0" style={{position: 'absolute'}}><clipPath id="barsG">{Array.from({length: 8}).map((_, i) => <rect key={i} x={i * 136} y={-1920 + (t < 26.1 ? barQ(i) * 1920 : 1920)} width={137} height={1920} />)}</clipPath></svg>
          <div style={{position: 'absolute', left: 0, width: 1080, top: 345, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 100, color: INK, lineHeight: 1.05, opacity: endIn, transform: `translateY(${(1 - endIn) * 60}px)`}}>Почему закрыли<br />«Гернику»?</div>
          {[['Случайность', 640, 0], ['Не случайно', 780, 1]].map(([txt, top, i]) => {
            const pr = spring({frame: f - Math.round((25.9 + i * 0.15) * fps), fps, config: {damping: 14, stiffness: 160}});
            const g = (i === 0 && t >= tapAt && t < tap2At) || (i === 1 && t >= tap2At);
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

      <Dog t={t} f={f} />
      <div style={{position: 'absolute', left: 60, top: 1622, padding: '12px 26px', borderRadius: 30, background: 'rgba(255,255,255,0.94)', boxShadow: '0 10px 26px rgba(80,50,90,0.18)', fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: INK, zIndex: 95}}>{script.diagram.title}</div>
      <CaptionsAnim light={t < 2.4} />
    </AbsoluteFill>
  );
};
