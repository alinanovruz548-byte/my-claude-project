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
const img = (n) => staticFile('n32/img/' + n);
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
  {t: 0.0, x: 540, y: 3000, s: 1.0, pose: 'open', look: 1},
  {t: 21.2, x: 540, y: 3000, s: 1.0, pose: 'open', look: 1},
  {t: 21.75, x: 215, y: 1810, s: 0.62, pose: 'reach', look: 1},
  {t: 40, x: 215, y: 1810, s: 0.62, pose: 'reach', look: 1},
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

const CAM_STARTS = [3.1, 6.3, 9.35, 12.0, 15.65];
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
        return <span key={i} style={{display: 'inline-block', marginRight: 14, opacity: (on ? 1 : dim) * appear, transform: `translateY(${on ? (1 - Math.min(1, sp)) * 26 : 8}px) scale(${on ? 0.7 + 0.3 * q + (cur ? 0.07 : 0) : 0.92})`, color: cur ? (light ? '#FFC2DA' : ROSE) : base, fontStyle: cur ? 'italic' : 'normal', transformOrigin: '50% 80%', ...(txt.startsWith('Дали') && wt < 1 ? {background: 'linear-gradient(135deg,#F9B7D2,#C4607E)', padding: '0 24px 6px', borderRadius: 30, border: '4px solid #fff', color: '#fff', fontStyle: 'italic', textShadow: '0 3px 10px rgba(120,30,70,0.5)'} : {})}}>{txt}</span>;
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

const Vclip = ({file, from, frames}) => (
  <Sequence from={from} durationInFrames={frames}><OffthreadVideo src={staticFile('n32/vid/' + file)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} /></Sequence>
);
const TopVeil = () => <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 700, background: 'linear-gradient(180deg, rgba(30,16,20,0.66) 0%, rgba(30,16,20,0.3) 55%, rgba(30,16,20,0))', zIndex: 4, pointerEvents: 'none'}} />;
const GOLDC = 'rgba(246,222,151,0.98)';
const PINK = '#F28BB0';
const AR = 3784 / 3840;
// кроп картины: центр (cx, cy) в долях, wr = доля ширины картины в кадре
const CropImg = ({cx, cy, wr, w, h, filter, extra}) => {
  const iw = w / wr, ih = iw * AR;
  return <div style={{width: w, height: h, overflow: 'hidden', position: 'relative', filter}}><Img src={img('amb.jpg')} style={{position: 'absolute', maxWidth: 'none', width: iw, height: ih, left: w / 2 - cx * iw, top: h / 2 - cy * ih}} />{extra}</div>;
};
const BEATS = [1.6, 3.36, 4.54, 8.1, 9.46, 13.26, 15.8, 17.1];
const punchAt = (t) => BEATS.reduce((s, b) => s + (t >= b ? 0.055 * Math.exp(-(t - b) * 9) : 0), 0);
const shakeAt = (t) => BEATS.reduce((s, b) => s + (t >= b ? Math.exp(-(t - b) * 10) * Math.sin((t - b) * 95) : 0), 0);

export const Board32Main = () => {
  useFonts();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const k = (a, b, ease = easeIO) => interpolate(t, [a, b], [0, 1], {...clamp, easing: ease});
  const cam = camAt(t);
  const pulse = 1 + 0.035 * Math.sin(t * 7);
  const punch = 1 + punchAt(t);
  const shk = shakeAt(t) * 7;

  const hookZoom = easeIn3(k(1.7, 3.0, easeIO));
  const wipeB = easeIO(k(6.3, 6.9));
  const blindQ = (i) => easeIO(Math.min(1, Math.max(0, (t - 9.35 - i * 0.03) / 0.35)));
  const flipOutC1 = easeIO(k(11.95, 12.2)), flipInC2 = easeIO(k(12.0, 12.25));
  const irisE = easeOut(k(15.65, 16.3));
  const endIn = k(16.0, 16.5, easeOut);
  const driftA = 1 + 0.08 * k(3.1, 6.4, (x) => x);
  const driftC = 1 + 0.12 * k(9.35, 12.2, (x) => x);
  const driftC2 = 1 + 0.12 * k(12.0, 15.7, (x) => x);

  const opts = [['А', 'череп', 17.1], ['Б', 'рыба', 18.1], ['В', 'меч', 19.14]];

  return (
    <AbsoluteFill style={{background: '#1d1216'}}>
      {['p_reach.png', 'amb.jpg', 'bg_end.jpg'].map((n) => <Img key={n} src={img(n)} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />)}

      {/* ХУК: «ЧТО ЗА ПЯТНО?», наезд на пятно на полу */}
      {t < 3.2 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 15, overflow: 'hidden', background: '#2b2016'}}>
          <div style={{position: 'absolute', inset: 0, transformOrigin: '56% 90%', transform: `scale(${1 + 4.5 * hookZoom}) translate(${Math.sin(t * 40) * 3}px, ${Math.cos(t * 33) * 3}px)`, filter: hookZoom > 0.05 ? `blur(${hookZoom * 4}px)` : undefined}}>
            <Vclip file="h.mp4" from={0} frames={96} />
            {(() => { const q = spring({frame: f - 2, fps, config: {damping: 9, stiffness: 190}}); return <div style={{position: 'absolute', left: 40, top: 420, width: 650, zIndex: 30, transform: `scale(${Math.min(1.06, q)}) rotate(-4deg)`, opacity: Math.min(1, q * 2)}}><div style={{padding: '8px 36px 20px', borderRadius: 30, background: '#FFF8EC', border: `16px solid ${PINK}`, textAlign: 'center', boxShadow: '0 28px 60px rgba(80,30,40,0.5)'}}><div style={{fontFamily: SERIF, fontWeight: 700, fontStyle: 'italic', fontSize: 130, lineHeight: 1.0, color: '#C4607E'}}>ЧТО ЗА</div><div style={{fontFamily: SERIF, fontWeight: 700, fontStyle: 'italic', fontSize: 130, lineHeight: 1.0, color: '#C4607E'}}>ПЯТНО?</div></div></div>; })()}
          </div>
          <TopVeil />
          {t >= 0.1 && t < 2.3 && (() => { const q = easeOut(k(0.1, 0.45)); const o = 1 - k(1.9, 2.3); return <div style={{position: 'absolute', left: 0, width: 1080, top: 1330, textAlign: 'center', zIndex: 40, opacity: q * o, transform: `translateY(${(1 - q) * 50}px) scale(${pulse})`}}><span style={{display: 'inline-block', padding: '14px 34px', borderRadius: 40, background: 'rgba(255,255,255,0.96)', fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 2, color: INK, boxShadow: '0 12px 30px rgba(0,0,0,0.35)'}}>ОТВЕТ НА ВЧЕРА: <span style={{color: '#6C8F3A'}}>листья манго</span></span></div>; })()}
          <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: k(2.85, 3.1), zIndex: 90, pointerEvents: 'none'}} />
        </div>
      )}

      <div style={{position: 'absolute', inset: 0, transform: `translate(${cam.px + shk}px, ${cam.py + shk * 0.6}px) rotate(${cam.rot}deg) scale(${cam.z * punch})`, transformOrigin: '50% 50%', filter: cam.blur > 0.4 ? `blur(${cam.blur}px)` : undefined}}>
        {/* A. «Послы» Гольбейна, 1533 */}
        {t >= 3.1 && t < 6.95 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 16, overflow: 'hidden', background: '#1d1216'}}>
            <Img src={img('amb.jpg')} style={{position: 'absolute', left: -300, top: -100, width: 1700, height: 1700 * AR, maxWidth: 'none', filter: 'blur(26px) brightness(0.55)', transform: `scale(${driftA})`}} />
            {(() => { const q = spring({frame: f - Math.round(3.2 * fps), fps, config: {damping: 12, stiffness: 150}}); return <div style={{position: 'absolute', left: 60, top: 520, width: 960, height: 960 * AR, zIndex: 20, borderRadius: 8, overflow: 'hidden', boxShadow: '0 40px 90px rgba(0,0,0,0.7)', border: '14px solid #E9D9B0', boxSizing: 'content-box', transform: `scale(${(0.6 + 0.4 * Math.min(1.05, q)) * driftA}) rotate(${(1 - Math.min(1, q)) * -8 + 1}deg)`, opacity: Math.min(1, q * 2)}}><Img src={img('amb.jpg')} style={{width: '100%', height: '100%'}} /></div>; })()}
            <TopVeil />
            <DigitStamp txt="1533" ats={[4.54, 4.88, 5.12, 5.38]} t={t} top={360} size={150} width={110} color="#fff" />
            <Chip txt="Ганс Гольбейн Младший" at={3.8} t={t} x={70} y={1510} size={32} bg={GOLDC} rot={-2} z={40} />
            <Chip txt="Национальная галерея, Лондон" at={5.7} t={t} x={560} y={1516} size={22} bg="rgba(255,255,255,0.92)" z={40} />
          </div>
        )}

        {/* B. двое и пятно у ног */}
        {t >= 6.3 && t < 9.85 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 17, overflow: 'hidden', background: '#1d1216', clipPath: t < 6.95 ? `polygon(0 0, ${wipeB * 170}% 0, ${wipeB * 170 - 45}% 100%, 0 100%)` : 'none'}}>
            <Img src={img('amb.jpg')} style={{position: 'absolute', left: -300, top: -100, width: 1700, height: 1700 * AR, maxWidth: 'none', filter: 'blur(26px) brightness(0.5)'}} />
            <TopVeil />
            {[['Жан де Дентевиль', 'посол Франции', 0.24, 0.27, 6.84, 30, -4], ['Жорж де Сельв', 'епископ Лавура', 0.83, 0.27, 7.24, 560, 4]].map(([nm, role, cx, cy, at, x, r], i) => {
              const q = spring({frame: f - Math.round(at * fps), fps, config: {damping: 11, stiffness: 170}});
              const out = easeIO(k(8.0, 8.45));
              if (t < at - 0.05 || out >= 1) return null;
              return <div key={i} style={{position: 'absolute', left: x, top: 470 + i * 40, width: 490, zIndex: 24, transform: `translate(${(i ? 1 : -1) * out * 900}px, 0) rotate(${r + (1 - Math.min(1, q)) * (i ? 20 : -20)}deg) scale(${Math.min(1.04, q)})`, opacity: Math.min(1, q * 2)}}><div style={{background: '#fff', padding: 14, borderRadius: 12, boxShadow: '0 28px 60px rgba(0,0,0,0.55)'}}><CropImg cx={cx} cy={cy} wr={0.3} w={462} h={560} /><div style={{fontFamily: SERIF, fontWeight: 700, fontStyle: 'italic', fontSize: 40, color: INK, textAlign: 'center', marginTop: 8}}>{nm}</div><div style={{fontFamily: SANS, fontWeight: 700, fontSize: 24, color: SOFT, textAlign: 'center'}}>{role}</div></div></div>;
            })}
            {t >= 8.1 && (() => { const q = spring({frame: f - Math.round(8.1 * fps), fps, config: {damping: 11, stiffness: 160}}); return <div style={{position: 'absolute', left: 50, top: 650, width: 980, zIndex: 26, transform: `scale(${Math.min(1.04, q)}) rotate(-2deg)`, opacity: Math.min(1, q * 2)}}><div style={{background: '#fff', padding: 14, borderRadius: 12, boxShadow: '0 28px 60px rgba(0,0,0,0.55)', position: 'relative'}}><CropImg cx={0.47} cy={0.895} wr={0.62} w={952} h={360} extra={<div style={{position: 'absolute', left: 140, top: 60, width: 640, height: 250, borderRadius: '50%', border: `10px solid ${PINK}`, transform: `rotate(-14deg) scale(${pulse})`, boxShadow: '0 0 30px rgba(242,139,176,0.8)'}} />} /></div></div>; })()}
            <Chip txt="размазанная полоса" at={8.66} t={t} x={300} y={1100} size={36} bg={GOLDC} rot={-3} z={40} />
          </div>
        )}

        {/* C1. не случайный мазок (жалюзи) */}
        {t >= 9.35 && t < 12.3 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 18, overflow: 'hidden', background: '#2b2016', clipPath: t < 9.9 ? 'url(#blindC)' : 'none', transform: t >= 11.95 ? `perspective(1800px) rotateY(${-90 * flipOutC1}deg)` : undefined}}>
            <svg width="0" height="0" style={{position: 'absolute'}}><clipPath id="blindC">{Array.from({length: 12}).map((_, i) => <rect key={i} x="0" y={i * 160} width="1080" height={blindQ(i) * 161} />)}</clipPath></svg>
            <div style={{position: 'absolute', inset: 0, transformOrigin: '60% 55%', transform: `scale(${driftC})`}}><Vclip file="m.mp4" from={281} frames={110} /></div>
            <TopVeil />
            <div style={{position: 'absolute', left: 0, width: 1080, top: 430, textAlign: 'center', zIndex: 30, whiteSpace: 'nowrap'}}>
              <Kin txt="не случайный " at={9.5} t={t} size={96} italic color="#fff" style={{textShadow: '0 6px 24px rgba(40,20,0,0.7)', marginRight: 20}} />
            </div>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 550, textAlign: 'center', zIndex: 30}}><Kin txt="мазок!" at={10.1} t={t} size={190} italic color="#F9D251" style={{textShadow: '0 8px 30px rgba(40,20,0,0.75)'}} /></div>
          </div>
        )}

        {/* C2. смотреть только сбоку (переворот) */}
        {t >= 12.0 && t < 16.0 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 19, overflow: 'hidden', background: '#2b2016', transform: `perspective(1800px) rotateY(${90 * (1 - flipInC2)}deg)`}}>
            <div style={{position: 'absolute', inset: 0, transformOrigin: '75% 55%', transform: `scale(${driftC2})`}}><Vclip file="c.mp4" from={360} frames={120} /></div>
            <TopVeil />
            <Chip txt="видно только сбоку" at={12.7} t={t} x={70} y={480} size={40} bg={GOLDC} rot={-3} z={40} />
            {t >= 13.26 && <div style={{position: 'absolute', left: 80, top: 600, zIndex: 30, fontFamily: SERIF, fontWeight: 700, fontStyle: 'italic', fontSize: 210, color: '#fff', textShadow: '0 8px 40px rgba(40,10,10,0.8)', transform: `scale(${easeOut(k(13.26, 13.7)) * pulse}) rotate(-6deg)`, opacity: easeOut(k(13.26, 13.6)), transformOrigin: '0% 50%'}}>сбоку</div>}
            {t >= 14.06 && <div style={{position: 'absolute', left: 120, top: 900, zIndex: 30, fontSize: 150, color: '#F9D251', transform: `translateX(${Math.sin(t * 10) * 30}px)`, opacity: k(14.06, 14.4), textShadow: '0 6px 30px rgba(0,0,0,0.6)'}}>➜</div>}
            <Chip txt="к краю картины" at={14.3} t={t} x={70} y={1100} size={34} bg="rgba(255,255,255,0.95)" rot={-2} z={40} />
          </div>
        )}
      </div>

      {/* E. финал: загадка А / Б / В, тизер, подписка */}
      {t >= 15.65 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 50, background: '#241810', clipPath: `circle(${irisE * 2100}px at 540px 960px)`}}>
          <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
            <Img src={img('bg_end.jpg')} style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, objectFit: 'cover', transformOrigin: '50% 50%', transform: `scale(${1.08 + 0.1 * k(15.65, 24.6, (x) => x)})`, filter: 'blur(5px)'}} />
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(30,16,20,0.8) 0%, rgba(30,16,20,0.55) 45%, rgba(30,16,20,0.8) 100%)'}} />
          </div>
          <div style={{position: 'absolute', left: 0, width: 1080, top: 400, textAlign: 'center', opacity: endIn, transform: `translateY(${(1 - endIn) * 50}px)`}}>
            <div style={{fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 104, color: '#fff', lineHeight: 1.05, textShadow: '0 6px 30px rgba(0,0,0,0.6)'}}>Что это</div>
            <div style={{fontFamily: SERIF, fontWeight: 700, fontStyle: 'italic', fontSize: 150, color: '#F9D251', lineHeight: 1.05, textShadow: '0 6px 30px rgba(0,0,0,0.6)'}}>за предмет?</div>
          </div>
          {opts.map(([L, txt, at], i) => {
            const pr = spring({frame: f - Math.round(at * fps), fps, config: {damping: 12, stiffness: 180}});
            return t >= at - 0.05 ? (
              <div key={i} style={{position: 'absolute', left: 110, top: 760 + i * 150, width: 860, height: 124, borderRadius: 62, background: 'rgba(255,255,255,0.18)', border: '3px solid rgba(255,255,255,0.6)', boxShadow: '0 16px 36px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', transform: `translateX(${(1 - Math.min(1, pr)) * -300}px) scale(${Math.min(1.04, pr)})`, opacity: Math.min(1, pr * 2), zIndex: 5}}>
                <div style={{width: 100, height: 100, borderRadius: 50, background: 'linear-gradient(135deg,#F9D251,#E09A1F)', marginLeft: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 70, color: '#fff'}}>{L}</div>
                <div style={{marginLeft: 36, fontFamily: SANS, fontWeight: 800, fontSize: 56, color: '#fff', letterSpacing: 1}}>{txt}</div>
              </div>
            ) : null;
          })}
          {t >= 20.26 && <div style={{position: 'absolute', left: 0, width: 1080, top: 1235, textAlign: 'center', zIndex: 6, opacity: k(20.26, 20.6), transform: `scale(${pulse})`}}><span style={{display: 'inline-block', padding: '12px 36px', borderRadius: 44, background: 'rgba(255,255,255,0.96)', fontFamily: SANS, fontWeight: 800, fontSize: 34, letterSpacing: 2, color: INK}}>ПИШИТЕ БУКВУ В КОММЕНТАРИЯХ</span></div>}
          {t >= 21.9 && (() => { const q = easeOut(k(21.9, 22.4)); return (
            <div style={{position: 'absolute', left: 330, width: 690, top: 1340, zIndex: 7, opacity: q, transform: `translateY(${(1 - q) * 60}px) scale(${pulse})`, transformOrigin: '50% 50%'}}>
              <div style={{padding: '16px 30px', borderRadius: 40, background: 'linear-gradient(135deg,#F9B7D2,#C4607E)', border: '4px solid #fff', boxShadow: '0 18px 40px rgba(0,0,0,0.4)', textAlign: 'center'}}>
                <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 28, letterSpacing: 3, color: '#fff'}}>ЗАВТРА</div>
                <div style={{fontFamily: SERIF, fontWeight: 700, fontStyle: 'italic', fontSize: 52, color: '#fff', lineHeight: 1.05}}>краска с мышьяком</div>
              </div>
              <div style={{marginTop: 18, marginLeft: 120, width: 450, padding: '12px 0', borderRadius: 36, background: '#fff', textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 34, letterSpacing: 3, color: '#C4607E', boxShadow: '0 12px 28px rgba(0,0,0,0.35)'}}>ПОДПИШИСЬ ▶</div>
            </div>
          ); })()}
        </div>
      )}
      {t >= 15.65 && t < 16.4 && <div style={{position: 'absolute', left: 540 - irisE * 2100, top: 960 - irisE * 2100, width: irisE * 4200, height: irisE * 4200, borderRadius: '50%', border: '26px solid #F0C75E', zIndex: 55, boxSizing: 'border-box', opacity: 1 - k(16.0, 16.4), boxShadow: '0 0 60px rgba(240,199,94,0.8)'}} />}

      {[3.1, 6.3, 9.35, 12.0].map((s, i) => t >= s - 0.02 && t < s + 0.22 ? <div key={i} style={{position: 'absolute', inset: 0, background: i === 0 ? '#fff' : PINK, opacity: 0.55 * (1 - (t - s) / 0.22), zIndex: 85, pointerEvents: 'none'}} /> : null)}

      <Dog t={t} f={f} />
      <div style={{position: 'absolute', left: 60, top: 1622, padding: '12px 26px', borderRadius: 30, background: 'rgba(40,24,10,0.6)', border: '1px solid rgba(255,255,255,0.35)', fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: '#fff', zIndex: 95}}>{script.diagram.title}</div>
      <CaptionsAnim light={true} />
    </AbsoluteFill>
  );
};
