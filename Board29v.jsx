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
const img = (n) => staticFile('n29v2/img/' + n);
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
  {t: 0.0, x: 540, y: 3000, s: 1.0, pose: 'laugh', look: 1},
  {t: 22.2, x: 540, y: 3000, s: 1.0, pose: 'laugh', look: 1},
  {t: 22.7, x: 890, y: 1830, s: 0.6, pose: 'laugh', look: -1},
  {t: 24.6, x: 890, y: 1830, s: 0.6, pose: 'laugh', look: -1},
  {t: 25.1, x: 540, y: 1790, s: 0.85, pose: 'open', look: 1},
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

const CAM_STARTS = [2.4, 5.0, 10.3, 13.8, 22.55, 24.3];
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


const Vclip = ({file, from, frames}) => (
  <Sequence from={from} durationInFrames={frames}><OffthreadVideo src={staticFile('n29v2/vid/' + file)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} /></Sequence>
);
const TopVeil = () => <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 700, background: 'linear-gradient(180deg, rgba(10,12,34,0.62) 0%, rgba(10,12,34,0.28) 55%, rgba(10,12,34,0))', zIndex: 4, pointerEvents: 'none'}} />;
const GLASS_BG = 'rgba(20,24,56,0.78)', GOLDC = 'rgba(246,222,151,0.98)';

export const Board29vMain = () => {
  useFonts();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tr = f / fps;
  const inHold = tr >= 5.0 && tr < 6.0;
  const t = tr < 5.0 ? tr : (inHold ? 5.0 : tr - 1.0);
  const fv = Math.round(t * fps);
  const hq = easeOut(Math.min(1, Math.max(0, (tr - 4.6) / 0.6)));
  const k = (a, b, ease = easeIO) => interpolate(t, [a, b], [0, 1], {...clamp, easing: ease});
  const cam = camAt(inHold ? 4.9 : t);
  const tapAt = 26.0, tap2At = 26.55;
  const endIn = k(24.7, 25.25, easeOut);
  const curX = interpolate(t, [25.1, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [880, 560, 560, 600], clamp);
  const curY = interpolate(t, [25.1, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [1500, 790, 800, 930], clamp);

  const hookZoom = easeIn3(k(1.1, 2.4, easeIO));
  const zq = easeIO(k(5.0, 5.4));
  const irisC = easeOut(k(10.3, 10.95));
  const spinQ = easeIO(k(13.8, 14.3));
  const wrapIn = (i) => easeIO(Math.min(1, Math.max(0, (t - 15.7 - i * 0.07) / 0.35)));
  const wrapOut = (i) => easeIO(Math.min(1, Math.max(0, (t - 16.3 - i * 0.07) / 0.4)));
  const irisF = easeOut(k(24.3, 24.95));
  const age = Math.round(18 * easeOut(k(6.9, 7.4)));
  const cnt55 = Math.round(55 * easeOut(k(19.8, 21.2)));
  const darkD = k(18.2, 18.9);
  const bImp = t >= 9.0 ? Math.exp(-(t - 9.0) * 5) : 0;
  const bScale = 1 + 0.26 * k(5.4, 9.0, (x) => x * x) + 0.22 * bImp;
  const bShake = t >= 9.0 && t < 10.0 ? Math.sin(t * 95) * 34 * bImp : 0;
  const paintRev = k(16.3, 17.4, easeOut);

  return (
    <AbsoluteFill style={{background: '#16294a'}}>
      {['velvet.jpg', 'frida32.jpg', 'k1.jpg', 'p_open.png', 'p_laugh.png'].map((n) => <Img key={n} src={img(n)} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />)}

      {/* ХУК: собака смотрит в зеркало над кроватью, зум в зеркало */}
      {t < 2.4 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 15, overflow: 'hidden', background: '#16294a'}}>
          <div style={{position: 'absolute', inset: 0, transformOrigin: '51% 30%', transform: `scale(${1 + 3.2 * hookZoom})`, filter: hookZoom > 0.05 ? `blur(${hookZoom * 3}px)` : undefined}}>
            <Vclip file="hook.mp4" from={0} frames={90} />
          </div>
          <TopVeil />
        </div>
      )}

      <div style={{position: 'absolute', inset: 0, transform: `translate(${cam.px}px, ${cam.py}px) rotate(${cam.rot}deg) scale(${cam.z})`, transformOrigin: '50% 50%', filter: cam.blur > 0.4 ? `blur(${cam.blur}px)` : undefined}}>
        {/* A. собака у зеркала, Фрида Кало */}
        {t >= 2.4 && t < 5.5 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 16, overflow: 'hidden', background: '#16294a', transform: `translateX(${-zq * 1080}px)`, filter: zq > 0.02 ? `blur(${zq * 12}px)` : undefined}}>
            <Vclip file="a.mp4" from={72} frames={154} />
            <TopVeil />
            <Chip txt="зеркало" at={3.2} t={t} x={110} y={480} size={50} bg={GOLDC} rot={-4} z={40} />
            {['ФРИДА', 'КАЛО'].map((w, li) => (
              <div key={li} style={{position: 'absolute', left: 0, width: 1080, top: 560 + li * 210, textAlign: 'center', whiteSpace: 'nowrap', zIndex: 30}}>
                {w.split('').map((ch, i) => { const at = 4.1 + li * 0.5 + i * 0.07; const sp = spring({frame: f - Math.round(at * fps), fps, config: {damping: 8, stiffness: 170}}); return <span key={i} style={{display: 'inline-block', fontFamily: SERIF, fontWeight: 700, fontSize: 200, color: li ? '#F6DE97' : '#fff', opacity: t >= at ? 1 : 0, transform: `translateY(${(1 - sp) * -600}px) rotate(${(1 - sp) * (i % 2 ? 30 : -30)}deg)`, textShadow: '0 8px 30px rgba(10,12,40,0.8)'}}>{ch}</span>; })}
              </div>
            ))}
            <div style={{position: 'absolute', inset: 0, background: 'rgba(10,10,34,0.55)', opacity: hq, zIndex: 31}} />
            {t >= 4.4 && (() => { const pop = easeOut(Math.min(1, Math.max(0, (t - 4.4) / 0.5))); const x = 560 - 370 * hq, y = 1090 - 590 * hq, w = 380 + 320 * hq, h = 510 + 430 * hq, rot = 5 - 7 * hq; return <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 12, background: '#fff', padding: 8 + 4 * hq, boxSizing: 'border-box', boxShadow: `0 ${30 + 40 * hq}px ${60 + 40 * hq}px rgba(0,0,0,0.55)`, transform: `rotate(${rot}deg) scale(${0.6 + 0.4 * pop})`, opacity: Math.min(1, pop * 2), zIndex: 35, overflow: 'hidden'}}><Pic src="frida32.jpg" pos="50% 30%" /></div>; })()}
          </div>
        )}

        {/* B. 1925: автобус и трамвай */}
        {t >= 5.0 && t < 10.95 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 17, overflow: 'hidden', background: '#16294a', transform: `translateX(${(1 - zq) * 1080}px)`, filter: zq < 0.98 ? `blur(${(1 - zq) * 12}px)` : undefined}}>
            <div style={{position: 'absolute', inset: 0, transformOrigin: '56% 66%', transform: `translate(${bShake}px, ${bShake * 0.6}px) scale(${bScale})`}}>
              <Vclip file="b.mp4" from={180} frames={198} />
            </div>
            <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 56% 66%, rgba(0,0,0,0) 35%, rgba(10,6,24,' + (0.15 + 0.5 * k(5.4, 9.0, (x) => x)) + ') 100%)', zIndex: 3}} />
            {t >= 9.0 && t < 9.7 && (
              <>
                <div style={{position: 'absolute', inset: 0, background: 'rgba(255,226,160,0.55)', opacity: Math.max(0, 1 - (t - 9.0) * 7), zIndex: 28}} />
                <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, zIndex: 27, opacity: Math.max(0, 1 - (t - 9.0) * 2.2)}}>
                  {Array.from({length: 28}).map((_, i) => { const a = (i / 28) * Math.PI * 2; const r0 = 120 + (t - 9.0) * 900, r1 = r0 + 260 + (i % 3) * 120; return <line key={i} x1={605 + Math.cos(a) * r0} y1={1270 + Math.sin(a) * r0} x2={605 + Math.cos(a) * r1} y2={1270 + Math.sin(a) * r1} stroke="#fff" strokeWidth={6 + (i % 4) * 3} strokeLinecap="round" opacity="0.85" />; })}
                  <circle cx="605" cy="1270" r={80 + (t - 9.0) * 1500} fill="none" stroke="#FFE08A" strokeWidth="16" opacity="0.8" />
                </svg>
              </>
            )}
            {t >= 9.0 && (() => { const q = spring({frame: fv - Math.round(9.0 * fps), fps, config: {damping: 9, stiffness: 200}}); return <div style={{position: 'absolute', left: 330, top: 760, zIndex: 36, transform: `scale(${q * 1.25}) rotate(-8deg)`, opacity: Math.min(1, q * 2) * (1 - k(10.2, 10.5))}}><svg width="460" height="400" viewBox="-230 -200 460 400"><polygon points={Array.from({length: 24}).map((_, i) => { const a = (i / 24) * Math.PI * 2; const r = i % 2 ? 120 : 200; return `${Math.cos(a) * r * 1.1},${Math.sin(a) * r}`; }).join(' ')} fill="#F7C34A" stroke="#fff" strokeWidth="10" strokeLinejoin="round" /><text x="0" y="40" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="110" fill="#C4607E" stroke="#fff" strokeWidth="6" paintOrder="stroke">БАМ!</text></svg></div>; })()}
            <TopVeil />
            <DigitStamp t={t} txt="1925" ats={[5.35, 5.6, 5.9, 6.2]} top={330} size={220} width={160} color="#fff" />
            <div style={{position: 'absolute', left: 0, width: 1080, top: 640, textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 120, color: '#FFC2DA', opacity: k(6.85, 7.1), transform: `scale(${0.8 + 0.2 * k(6.85, 7.3, easeOut)})`, textShadow: '0 6px 24px rgba(10,12,40,0.8)'}}>{age} <span style={{fontSize: 70, fontStyle: 'italic', color: '#fff'}}>лет</span></div>
            <Chip txt="17 сентября" at={7.9} t={t} x={70} y={800} size={30} bg={GOLDC} rot={-3} z={40} />
            <SolidStamp txt="АВАРИЯ" at={9.5} t={t} x={110} y={1330} rot={-6} size={64} />
          </div>
        )}

        {/* C1. месяцы в гипсе, мольберт (круг из центра) */}
        {t >= 10.3 && t < 14.4 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 20, overflow: 'hidden', background: '#16294a', clipPath: `circle(${irisC * 2100}px at 540px 900px)`, transform: `scale(${1 + 1.2 * spinQ}) rotate(${spinQ * 14}deg)`, opacity: 1 - spinQ, transformOrigin: '50% 50%'}}>
            <Vclip file="c1.mp4" from={342} frames={129} />
            <TopVeil />
            <div style={{position: 'absolute', left: 0, width: 1080, top: 360, textAlign: 'center', zIndex: 30}}><Kin txt="месяцы" at={10.55} t={t} size={150} italic color="#FFD27A" /></div>
            <SolidStamp txt="ГИПС" at={11.6} t={t} x={330} y={1250} rot={-6} size={90} />
            <Chip txt="особый мольберт" at={13.1} t={t} x={560} y={900} size={34} bg={GOLDC} rot={3} z={40} />
          </div>
        )}

        {/* зеркало над кроватью */}
        {t >= 13.8 && t < 16.8 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 19, overflow: 'hidden', background: '#16294a'}}>
            <Vclip file="tail.mp4" from={447} frames={84} />
            <TopVeil />
            <Chip txt="зеркало над кроватью" at={14.7} t={t} x={90} y={520} size={36} bg={GOLDC} rot={-3} z={40} />
          </div>
        )}

        {/* D. автопортрет: 55 из 143 */}
        {t >= 15.9 && t < 23.6 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 21, overflow: 'hidden', background: '#16294a', opacity: 1 - k(23.1, 23.5)}}>
            <Vclip file="d.mp4" from={507} frames={249} />
            <TopVeil />
            
            <div style={{position: 'absolute', inset: 0, background: 'rgba(18,12,40,0.55)', opacity: k(16.3, 16.8), zIndex: 11}} />
            {t < 18.6 && (
              <div style={{position: 'absolute', inset: 0, opacity: 1 - k(18.2, 18.6), zIndex: 20}}>
                {(() => { const pop = easeOut(Math.min(1, Math.max(0, (t - 16.4) / 0.6))); return <div style={{position: 'absolute', left: 230, top: 520, width: 620, height: 836, background: '#C79A38', padding: 16, borderRadius: 10, boxSizing: 'border-box', boxShadow: '0 40px 90px rgba(0,0,0,0.6), 0 0 80px rgba(233,200,106,0.35)', transform: `rotate(${-2 + (1 - pop) * 8}deg) scale(${0.55 + 0.45 * pop})`, opacity: Math.min(1, pop * 2), overflow: 'hidden'}}>
                  <div style={{position: 'absolute', inset: 16, overflow: 'hidden', clipPath: `inset(0 0 ${(1 - paintRev) * 100}% 0)`}}><Img src={img('velvet.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
                </div>; })()}
                <Chip txt="первый автопортрет, 1926" at={17.3} t={t} x={270} y={1400} size={30} bg={GOLDC} rot={-2} z={40} />
              </div>
            )}
            {t >= 18.3 && (
              <div style={{position: 'absolute', inset: 0, opacity: k(18.3, 18.7), zIndex: 20}}>
                <div style={{position: 'absolute', left: 0, width: 1080, top: 330, textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 260, lineHeight: 1, color: '#FFC2DA', textShadow: '0 0 40px rgba(247,168,200,0.6)', transform: `scale(${0.85 + 0.15 * k(19.8, 20.3, easeOut)})`}}>{cnt55}</div>
                <div style={{position: 'absolute', left: 0, width: 1080, top: 600, textAlign: 'center'}}><Kin txt="из 143 картин" at={20.5} t={t} size={70} italic color="#fff" /></div>
                {Array.from({length: 143}).map((_, i) => {
                  const at = 18.5 + i * 0.012; const col = i % 13, row = Math.floor(i / 13);
                  const hi = i < 55; const hAt = 19.9 + i * 0.026;
                  const q = easeOut(Math.min(1, Math.max(0, (t - at) / 0.25)));
                  const hq = hi ? easeOut(Math.min(1, Math.max(0, (t - hAt) / 0.2))) : 0;
                  return t >= at ? <div key={i} style={{position: 'absolute', left: 78 + col * 72, top: 740 + row * 46, width: 30, height: 30, borderRadius: '50%', background: hq > 0 ? '#F28BB0' : 'rgba(255,255,255,0.5)', transform: `scale(${(0.3 + 0.7 * q) * (1 + hq * 0.35)})`, opacity: q, boxShadow: hq > 0 ? '0 0 16px rgba(242,139,176,0.9)' : 'none'}} /> : null;
                })}
                <SolidStamp txt="БОЛЬШЕ ТРЕТИ" at={21.5} t={t} x={200} y={1300} rot={-5} size={58} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* КОЛЛАЖ: самые знаменитые картины */}
      {t >= 22.5 && t < 24.9 && (() => {
        const items = [['k1', 'Две Фриды', 1938], ['k2', 'Автобус', 1929], ['k3', 'Больница Генри Форда', 1932], ['k4', 'Раненый олень', 1946], ['k0', 'В бархатном платье', 1926], ['k6', 'Посвящение Троцкому', 1937], ['k7', 'Диего и я', 1949], ['k8', 'Корни', 1943], ['k5', 'Фрида и Диего Ривера', 1931], ['k9', 'Время летит', 1929]];
        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1], [0, 1], [0, -1]];
        const zoomOut = 1.0 + 0.05 * k(22.5, 24.9, (x) => x);
        return (
          <div style={{position: 'absolute', inset: 0, zIndex: 52, background: '#2A2433', overflow: 'hidden', opacity: 1 - k(24.6, 24.9)}}>
            <div style={{position: 'absolute', inset: 0, transform: `scale(${zoomOut})`, transformOrigin: '50% 50%'}}>
              {items.map(([key, name, yr], i) => {
                const col = i % 2, row = Math.floor(i / 2);
                const at = 22.55 + i * 0.1;
                const q = easeOut(Math.min(1, Math.max(0, (t - at) / 0.35)));
                const [dx, dy] = dirs[i];
                return (
                  <div key={key} style={{position: 'absolute', left: col * 540 + 3, top: row * 384 + 3, width: 534, height: 378, overflow: 'hidden', transform: `translate(${dx * (1 - q) * 700}px, ${dy * (1 - q) * 700}px) scale(${0.7 + 0.3 * q})`, opacity: Math.min(1, q * 2.5), boxShadow: '0 0 30px rgba(0,0,0,0.5)'}}>
                    <Img src={img(key + '.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%', transform: `scale(${1.04 + 0.1 * Math.min(1, (t - at) / 2)})`}} />
                    <div style={{position: 'absolute', left: 14, bottom: 14, padding: '6px 16px', borderRadius: 20, background: 'rgba(255,255,255,0.93)', fontFamily: SANS, fontWeight: 700, fontSize: 22, color: INK, opacity: Math.min(1, Math.max(0, (t - at - 0.3) / 0.25))}}>{name}, {yr}</div>
                  </div>
                );
              })}
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 380, background: 'linear-gradient(180deg, rgba(20,14,30,0.8) 0%, rgba(20,14,30,0))', zIndex: 5}} />
          </div>
        );
      })()}

      {/* ленты-повязки (кремовые): D */}
      {t >= 15.65 && t < 17.0 && Array.from({length: 6}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: -200, top: i * 340 - 120, width: 1500, height: 360, zIndex: 60, transform: `rotate(-8deg) translateX(${-1500 + wrapIn(i) * 1500 + wrapOut(i) * 1600}px)`, background: 'repeating-linear-gradient(90deg,#E9D8B4 0px,#DCC799 30px,#E9D8B4 60px)', boxShadow: '0 10px 30px rgba(20,16,10,0.5)', borderTop: '6px solid #C9B27C', borderBottom: '6px solid #C9B27C'}} />
      ))}

      {/* F. финал: зеркало-портал, автопортрет на весь экран */}
      {t >= 24.3 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 50, background: '#1B1530', clipPath: `circle(${irisF * 2100}px at 540px 960px)`}}>
          <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
            <Img src={img('velvet.jpg')} style={{position: 'absolute', maxWidth: 'none', width: 1080, height: 1456, left: 0, top: -90, transformOrigin: '50% 40%', transform: `scale(${1.15 + 0.12 * k(24.3, 27.2, (x) => x)})`, filter: 'blur(1.5px)'}} />
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(14,10,30,0.7) 0%, rgba(14,10,30,0.5) 50%, rgba(14,10,30,0.72) 100%)'}} />
          </div>
          <div style={{position: 'absolute', left: 0, width: 1080, top: 345, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 110, color: '#fff', lineHeight: 1.05, opacity: endIn, transform: `translateY(${(1 - endIn) * 60}px)`, textShadow: '0 6px 30px rgba(0,0,0,0.6)'}}>Зеркало<br />её спасло?</div>
          {[['Да, спасло', 640, 0], ['Не только оно', 780, 1]].map(([txt, top, i]) => {
            const pr = spring({frame: fv - Math.round((25.1 + i * 0.15) * fps), fps, config: {damping: 14, stiffness: 160}});
            const g = (i === 0 && t >= tapAt && t < tap2At) || (i === 1 && t >= tap2At);
            return (
              <div key={i} style={{position: 'absolute', left: 170, top, width: 740, height: 110, borderRadius: 55, background: g ? 'linear-gradient(90deg,#F7C3D2,#E79BB4)' : 'rgba(255,255,255,0.16)', border: g ? 'none' : '2px solid rgba(255,255,255,0.55)', color: g ? INK : '#fff', fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: g ? '0 20px 50px rgba(196,96,126,0.55)' : '0 16px 36px rgba(0,0,0,0.3)', transform: `scale(${Math.min(pr, 1.03) * (g ? 1.05 : 1)})`, opacity: Math.min(1, pr * 2)}}>{txt}</div>
            );
          })}
          <svg width="120" height="140" viewBox="-10 -10 120 140" style={{position: 'absolute', left: curX, top: curY, zIndex: 80, filter: 'drop-shadow(8px 12px 10px rgba(0,0,0,0.4))', transform: `scale(${(t >= tapAt && t < tapAt + 0.2) || (t >= tap2At && t < tap2At + 0.2) ? 0.85 : 1})`}}>
            <path d="M5 5 L5 95 L30 72 L48 112 L66 104 L48 66 L82 66 Z" fill="#fff" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          </svg>
        </div>
      )}
      {t >= 24.3 && t < 25.2 && <div style={{position: 'absolute', left: 540 - irisF * 2100, top: 960 - irisF * 2100, width: irisF * 4200, height: irisF * 4200, borderRadius: '50%', border: '26px solid #E9C86A', zIndex: 55, boxSizing: 'border-box', opacity: 1 - k(24.8, 25.2), boxShadow: '0 0 60px rgba(233,200,106,0.8)'}} />}

      <Dog t={t} f={fv} />
      <div style={{position: 'absolute', left: 60, top: 1622, padding: '12px 26px', borderRadius: 30, background: 'rgba(20,24,56,0.6)', border: '1px solid rgba(255,255,255,0.35)', fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: '#fff', zIndex: 95}}>{script.diagram.title}</div>
      <CaptionsAnim light={true} />
    </AbsoluteFill>
  );
};
