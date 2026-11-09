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
const img = (n) => staticFile('n25/img/' + n);
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
  {t: 0.0, x: 540, y: 3000, s: 1.0, pose: 'paddle', look: 1},
  {t: 2.6, x: 540, y: 3000, s: 1.0, pose: 'paddle', look: 1},
  {t: 3.1, ...SIDE_R, pose: 'paddle', look: -1},
  {t: 4.1, ...SIDE_R, pose: 'paddle', look: -1},
  {t: 4.8, ...SIDE_L, pose: 'open', look: 1},
  {t: 5.6, ...SIDE_L, pose: 'open', look: 1},
  {t: 6.3, ...SIDE_R, pose: 'auct', look: -1},
  {t: 9.6, ...SIDE_R, pose: 'auct', look: -1},
  {t: 10.4, ...SIDE_L, pose: 'paddle', look: 1},
  {t: 14.2, ...SIDE_L, pose: 'paddle', look: 1},
  {t: 14.9, ...SIDE_R, pose: 'agent', look: -1},
  {t: 18.3, ...SIDE_R, pose: 'agent', look: -1},
  {t: 19.0, ...SIDE_L, pose: 'scared', look: 1},
  {t: 21.4, ...SIDE_L, pose: 'scared', look: 1},
  {t: 22.1, x: 540, y: 1790, s: 1.0, pose: 'agent', look: 1},
  {t: 40, x: 540, y: 1790, s: 1.0, pose: 'agent', look: 1},
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

const CAM_STARTS = [2.2, 4.2, 5.7, 10.0, 14.5, 18.8, 21.8];
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
const Stamp = ({txt, at, t, x, y, rot = -8, color = '#8E3556', size = 64}) => {
  if (t < at) return null;
  const q = Math.min(1, (t - at) / 0.28);
  const e = easeOut(q);
  return (
    <div style={{position: 'absolute', left: x, top: y, padding: '8px 30px', border: `7px double ${color}`, borderRadius: 14, color, fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: 6, opacity: 0.92 * Math.min(1, q * 3), transform: `rotate(${rot}deg) scale(${2.3 - 1.3 * e})`, zIndex: 40, mixBlendMode: 'multiply', whiteSpace: 'nowrap'}}>{txt}</div>
  );
};
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
    out.push(<div key={r * 6 + c} style={{position: 'absolute', left: c * 180, top: r * 175 - 2, width: 182, height: 177, background: (r + c) % 2 ? '#1E2A5E' : '#E9C86A', transform: `scale(${s}) rotate(${(1 - s) * 90}deg)`, boxShadow: 'inset 0 0 0 4px rgba(255,235,170,0.4)'}} />);
  }
  return <div style={{position: 'absolute', inset: 0, zIndex: 45, pointerEvents: 'none'}}>{out}</div>;
};
const Pic = ({src, filter, pos = '50% 50%'}) => (
  <div style={{width: '100%', height: '100%', borderRadius: 10, overflow: 'hidden', filter}}><Img src={img(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos}} /></div>
);

const CaptionsLight = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const now = f / fps;
  let chunk = null;
  script.captions.forEach((c) => { if (now >= W(c[0][1]) - 0.04) chunk = c; });
  if (!chunk) return null;
  const a = Math.min(1, (now - (W(chunk[0][1]) - 0.04)) / 0.22);
  return (
    <div style={{position: 'absolute', left: 70, top: 172, width: 940, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontSize: 60, lineHeight: 1.12, color: '#fff', zIndex: 90, opacity: a, transform: `translateY(${(1 - a) * 18}px)`, letterSpacing: 0.5, textShadow: '0 4px 22px rgba(0,0,0,0.75)'}}>
      {chunk.map(([txt, s0], i) => {
        const on = now >= W(s0);
        const cur = on && (i === chunk.length - 1 || now < W(chunk[i + 1][1]));
        return <span key={i} style={{opacity: on ? 1 : 0.5, color: cur ? '#FFC2DA' : '#fff', fontStyle: cur ? 'italic' : 'normal'}}>{txt}{' '}</span>;
      })}
    </div>
  );
};
const SolidStamp = ({txt, at, t, x, y, rot = -8, size = 80}) => {
  if (t < at) return null;
  const q = Math.min(1, (t - at) / 0.22);
  const e = easeOut(q);
  return <div style={{position: 'absolute', left: x, top: y, padding: '10px 36px', borderRadius: 16, background: '#C4607E', border: '6px solid #fff', boxShadow: '0 20px 40px rgba(120,30,70,0.5)', color: '#fff', fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: 8, opacity: Math.min(1, q * 3), transform: `rotate(${rot}deg) scale(${2.6 - 1.6 * e})`, zIndex: 40, whiteSpace: 'nowrap'}}>{txt}</div>;
};

export const Board25Main = () => {
  useFonts();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const k = (a, b, ease = easeIO) => interpolate(t, [a, b], [0, 1], {...clamp, easing: ease});
  const cam = camAt(t);
  const tapAt = 23.8, tap2At = 24.4;
  const endIn = k(21.8, 22.4, easeOut);
  const curX = interpolate(t, [22.8, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [880, 560, 560, 600], clamp);
  const curY = interpolate(t, [22.8, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [1500, 770, 780, 910], clamp);

  const [clipC, bandC] = diagR(t, 4.0, 0.65);
  const flipOut = k(9.5, 10.0, (x) => x * x);
  const flipIn = k(10.0, 10.5, easeOut);
  const irisF = `circle(${easeOut(k(14.5, 15.2)) * 1800}px at 540px 900px)`;
  const shQ = (i) => easeIO(Math.min(1, Math.max(0, (t - 18.6 - i * 0.04) / 0.4)));
  const wipeH = easeIO(k(21.6, 22.25));

  const padQ = easeIO(k(5.5, 6.3));
  const padCx = 1880 - 2680 * padQ;
  const price = (450.3 * easeOut(k(2.3, 3.0))).toFixed(1).replace('.', ',');
  const vanish = easeIO(k(3.3, 4.0));
  const barQ = easeOut(k(12.4, 13.9));
  const safeIn = easeIO(k(15.2, 16.4));
  const door = easeOut(k(16.4, 16.9));

  return (
    <AbsoluteFill style={{background: BG}}>
      {['sm.jpg', 'sm_old.jpg', 'leo.jpg', 'p_paddle.png', 'p_agent.png', 'p_auct.png', 'p_scared.png', 'p_open.png', 'p_jump.png', 'p_judge.png'].map((n) => <Img key={n} src={img(n)} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />)}

      {/* A. ХУК: собака-Спаситель с хрустальным шаром (видео Kling, 2,2 с) */}
      {t < 2.5 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 15, overflow: 'hidden', background: '#1b120a'}}>
          <div style={{position: 'absolute', inset: 0, transformOrigin: '50% 72%', transform: `scale(${1.1 + 0.2 * easeIn3(k(1.4, 2.2))})`, filter: `blur(${easeIn3(k(1.8, 2.3)) * 6}px)`}}>
            <Sequence from={0} durationInFrames={66}><OffthreadVideo src={staticFile('n25/vid/hook_orb.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} /></Sequence>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 380, background: 'linear-gradient(180deg, rgba(10,6,2,0.55) 0%, rgba(10,6,2,0))', zIndex: 5}} />
        </div>
      )}
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 70%, #FFF3C4, #F6D56A 60%, #E2A93A)', opacity: Math.min(k(1.95, 2.2), 1 - k(2.3, 2.6)), zIndex: 48, pointerEvents: 'none'}} />

      <div style={{position: 'absolute', inset: 0, transform: `translate(${cam.px}px, ${cam.py}px) rotate(${cam.rot}deg) scale(${cam.z})`, transformOrigin: '50% 50%', filter: cam.blur > 0.4 ? `blur(${cam.blur}px)` : undefined}}>
        {/* B. 450 млн, картина исчезает */}
        {t >= 2.15 && t < 4.5 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 16, background: BG, opacity: k(2.2, 2.5)}}>
            <Card x={220} y={410} w={640} h={940} at={2.3} t={t} r={18} pad={8} bg="#fff" rot={-1}>
              <div style={{width: '100%', height: '100%', opacity: 1 - 0.88 * vanish, filter: `blur(${vanish * 12}px) brightness(${1 + vanish * 0.6})`}}><Pic src="sm.jpg" /></div>
              {Array.from({length: 22}).map((_, i) => <div key={i} style={{position: 'absolute', left: 40 + hash(i) * 540, top: 700 - vanish * (300 + hash(i + 3) * 500) * (t > 3.3 ? 1 : 0) - hash(i + 5) * 300, width: 10 + hash(i + 2) * 14, height: 10 + hash(i + 2) * 14, borderRadius: '50%', background: '#FFD76A', opacity: t > 3.3 ? (1 - vanish) * 0.9 : 0, boxShadow: '0 0 14px #FFD76A'}} />)}
            </Card>
            <div style={{position: 'absolute', left: 40, top: 1250, padding: '14px 40px', borderRadius: 40, background: 'linear-gradient(135deg,#F6DE97,#D9AE4F 55%,#F2D27C)', boxShadow: '0 20px 50px rgba(150,110,30,0.5)', fontFamily: SERIF, fontWeight: 700, fontSize: 104, color: INK, transform: `rotate(-3deg) scale(${0.9 + 0.1 * k(2.3, 2.6, easeOut)})`, zIndex: 35, whiteSpace: 'nowrap'}}>${price} млн</div>
            <Stamp txt="ИСЧЕЗЛА" at={3.55} t={t} x={260} y={760} rot={-8} size={80} />
          </div>
        )}

        {/* C. «Спаситель мира» (косой вайп) */}
        {t >= 4.0 && t < 6.45 && (
          <>
            <div style={{position: 'absolute', inset: 0, zIndex: 16.5, background: '#E9C86A', clipPath: bandC}} />
            <div style={{position: 'absolute', inset: 0, zIndex: 17, background: BG, clipPath: clipC}}>
              <div style={{position: 'absolute', left: 0, width: 1080, top: 340, textAlign: 'center'}}><Kin txt="Спаситель мира" at={4.4} t={t} size={120} italic color={ROSE} /></div>
              <Card x={70} y={570} w={330} h={514} at={4.5} t={t} r={16} rot={-4} pad={7} bg="#fff" from="left"><Pic src="leo.jpg" /></Card>
              <Card x={430} y={520} w={560} h={728} at={4.8} t={t} r={16} rot={3} pad={7} bg="#fff" from="right"><Pic src="sm_old.jpg" /></Card>
              <Chip txt="Леонардо да Винчи" at={5.0} t={t} x={70} y={1110} size={28} />
              <Chip txt="около 1500 года" at={5.3} t={t} x={70} y={1175} size={26} bg="rgba(255,236,170,0.98)" />
            </div>
          </>
        )}

        {/* D. 1958, 45 фунтов как копия (плитки) */}
        {t >= 5.45 && t < 10.3 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 18, background: BG, clipPath: `polygon(${padCx}px 0px, 1100px 0px, 1100px 1920px, ${padCx}px 1920px)`, transform: `perspective(1600px) rotateY(${flipOut * 90}deg)`, transformOrigin: '0% 50%'}}>
            <DigitStamp t={t} txt="1958" ats={[5.9, 6.2, 6.45, 6.7]} top={330} size={230} width={150} />
            <Card x={80} y={700} w={440} h={648} at={7.0} t={t} r={16} rot={-3} pad={7} bg="#fff" from="left">
              <div style={{position: 'relative', width: '100%', height: '100%'}}>
                <Pic src="sm.jpg" filter="sepia(0.55) contrast(0.8) brightness(1.0) saturate(0.6)" />
                <div style={{position: 'absolute', inset: 0, overflow: 'hidden', opacity: k(8.0, 8.5), pointerEvents: 'none'}}>
                  {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{position: 'absolute', left: -60, top: 30 + i * 125, width: 640, textAlign: 'center', transform: 'rotate(-28deg)', whiteSpace: 'nowrap', fontFamily: SANS, fontWeight: 800, fontSize: 56, letterSpacing: 8, color: 'rgba(255,255,255,0.55)', textShadow: '0 2px 8px rgba(60,30,40,0.4)'}}>КОПИЯ · КОПИЯ · КОПИЯ</div>)}
                </div>
              </div>
            </Card>
            <div style={{position: 'absolute', left: 560, top: 640, width: 420, height: 380, zIndex: 25, opacity: t >= 7.6 ? 1 : 0, transformOrigin: '50% 0%', transform: `rotate(${Math.sin(t * 4) * 6 * k(7.7, 8.3)}deg) translateY(${(1 - easeOut(k(7.6, 8.2))) * -500}px)`}}>
              <svg width="420" height="380" viewBox="0 0 420 380">
                <line x1="210" y1="0" x2="210" y2="60" stroke="#8D8696" strokeWidth="6" />
                <path d="M70 110 L350 110 L390 260 L350 370 L70 370 L30 260 Z" fill="#fff" stroke={INK} strokeWidth="6" strokeLinejoin="round" transform="translate(0 -40)" />
                <circle cx="210" cy="90" r="16" fill="#E8EEF9" stroke={INK} strokeWidth="5" />
                <text x="210" y="290" textAnchor="middle" fontFamily="Cormorant, serif" fontWeight="700" fontSize="150" fill="#2B2433">£45</text>
              </svg>
            </div>
            <SolidStamp txt="КОПИЯ" at={9.0} t={t} x={110} y={1000} rot={-10} size={96} />
            <Chip txt="школа Больтраффио" at={8.6} t={t} x={560} y={1060} size={26} bg="rgba(255,236,170,0.98)" z={40} />
          </div>
        )}

        {/* E. 2017, Кристис, 450 млн (переворот) */}
        {t >= 9.9 && t < 14.8 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 19, background: BG, transform: `perspective(1600px) rotateY(${(1 - flipIn) * -90}deg)`, transformOrigin: '100% 50%'}}>
            <DigitStamp t={t} txt="2017" ats={[10.3, 10.55, 10.8, 11.05]} top={330} size={230} width={150} />
            <Chip txt="аукцион «Кристис»" at={11.3} t={t} x={110} y={640} size={32} bg="rgba(255,236,170,0.98)" />
            <svg width="1080" height="700" viewBox="0 0 1080 700" style={{position: 'absolute', left: 0, top: 640}}>
              <line x1="100" y1="620" x2="980" y2="620" stroke="#8D8696" strokeWidth="5" />
              <rect x="220" y={620 - 14} width="120" height="14" fill="#C4607E" />
              <text x="280" y="665" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="40" fill="#2B2433" opacity={k(12.0, 12.4)}>£45</text>
              <rect x="600" y={620 - 520 * barQ} width="260" height={520 * barQ} rx="10" fill="url(#gbar)" />
              <defs><linearGradient id="gbar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F6DE97" /><stop offset="1" stopColor="#D9AE4F" /></linearGradient></defs>
              <text x="730" y="665" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="40" fill="#2B2433" opacity={k(12.4, 12.8)}>$450 млн</text>
            </svg>
          </div>
        )}

        {/* F. сейф (круг) */}
        {t >= 14.5 && t < 19.2 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 20, background: BG, clipPath: irisF}}>
            <svg width="1080" height="1100" viewBox="0 0 1080 1100" style={{position: 'absolute', left: 0, top: 420}}>
              <rect x="150" y="60" width="780" height="860" rx="50" fill="#9AA6C0" stroke="#2B2433" strokeWidth="10" />
              <rect x="220" y="130" width="640" height="720" rx="30" fill="#2A3150" />
            </svg>
            <div style={{position: 'absolute', left: 300, top: 600, width: 480, height: 700, zIndex: 22, transformOrigin: '50% 0%', transform: `scale(${1 - 0.2 * safeIn})`, opacity: 1 - 0.0 * safeIn}}>
              <Card x={0} y={0} w={480} h={700} at={14.6} t={t} r={12} pad={6} bg="#fff" rot={0}><Pic src="sm.jpg" /></Card>
            </div>
            <div style={{position: 'absolute', left: 220, top: 550, width: 640, height: 720, borderRadius: 30, background: 'linear-gradient(135deg,#B4BFD8,#8794B4)', border: '10px solid #2B2433', zIndex: 24, transformOrigin: '0% 50%', transform: `perspective(1400px) rotateY(${(1 - door) * -88}deg)`, opacity: t > 16.3 ? 1 : 0}}>
              <div style={{position: 'absolute', left: 280, top: 270, width: 160, height: 160, borderRadius: '50%', background: '#E9D58A', border: '10px solid #2B2433'}} />
              <div style={{position: 'absolute', left: 340, top: 330, width: 40, height: 40, borderRadius: '50%', background: '#2B2433'}} />
            </div>
            <Chip txt="не показывают публично" at={15.6} t={t} x={110} y={330 + 0} size={30} z={40} />
            <Chip txt="по сообщениям СМИ" at={16.8} t={t} x={110} y={1330} size={28} bg="rgba(255,236,170,0.98)" z={40} />
            <Chip txt="частный владелец" at={17.9} t={t} x={110} y={1400} size={28} z={40} />
          </div>
        )}

        {/* G. спор: Леонардо или нет (жалюзи) */}
        {t >= 18.6 && t < 22.2 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 21, background: BG, clipPath: 'url(#shutG25)'}}>
            <svg width="0" height="0" style={{position: 'absolute'}}><clipPath id="shutG25">{Array.from({length: 8}).map((_, i) => <rect key={i} x={0} y={i * 241} width={t < 19.3 ? shQ(i) * 1080 : 1080} height={242} />)}</clipPath></svg>
            <Card x={80} y={480} w={380} h={592} at={19.0} t={t} r={16} rot={-4} pad={7} bg="#fff" from="left"><Pic src="leo.jpg" /></Card>
            <Card x={560} y={520} w={380} h={520} at={19.3} t={t} r={16} rot={3} pad={7} bg="#fff" from="right"><Pic src="sm.jpg" /></Card>
            <div style={{position: 'absolute', left: 440, top: 560, width: 200, textAlign: 'center', zIndex: 30, fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, fontSize: 280, color: ROSE, textShadow: '0 12px 40px rgba(196,96,126,0.5)', opacity: k(19.8, 20.2), transform: `scale(${0.6 + 0.4 * k(19.8, 20.3, easeOut)})`}}>?</div>
            {[['сам Леонардо?', 20.2, 100, 1085, 0], ['мастерская?', 20.8, 560, 1085, 1]].map(([txt, at, x, y, i]) => {
              const q = spring({frame: f - Math.round(at * fps), fps, config: {damping: 9, stiffness: 190}});
              if (t < at) return null;
              return <div key={i} style={{position: 'absolute', left: x, top: y, padding: '14px 36px', borderRadius: 40, background: i ? '#fff' : 'linear-gradient(90deg,#F7C3D2,#E79BB4)', boxShadow: '0 18px 40px rgba(60,50,100,0.25)', fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 56, color: INK, transform: `scale(${Math.min(1.08, q)}) rotate(${i ? 4 : -4}deg)`, zIndex: 31}}>{txt}</div>;
            })}
            <Stamp txt="СПОРНО" at={21.0} t={t} x={600} y={1200} rot={-8} size={70} />
          </div>
        )}
      </div>

      {/* H. финал */}
      {t >= 21.6 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 50, background: BG, clipPath: `inset(${(1 - wipeH) * 100}% 0 0 0)`}}>
          <div style={{position: 'absolute', left: 0, width: 1080, top: 345, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 100, color: INK, lineHeight: 1.05, opacity: endIn}}>Настоящий<br />Леонардо?</div>
          {[['Настоящий', 640, 0], ['Не он', 780, 1]].map(([txt, top, i]) => {
            const pr = spring({frame: f - Math.round((22.3 + i * 0.15) * fps), fps, config: {damping: 14, stiffness: 160}});
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

      {t >= 5.45 && t < 6.45 && (
        <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, zIndex: 46, pointerEvents: 'none', overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: padCx - 800, top: 960 - 800, width: 1600, height: 1600, transform: `rotate(${-6 + padQ * 10}deg)`, filter: 'drop-shadow(30px 30px 50px rgba(30,20,40,0.45))'}}>
            <div style={{position: 'absolute', left: 1500, top: 755, width: 700, height: 90, borderRadius: 45, background: 'linear-gradient(180deg,#E6DCCB,#B9A98F)'}} />
            <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: '#fff', border: '18px solid #2B2433', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
              <div style={{position: 'absolute', inset: 50, borderRadius: '50%', border: '6px solid #C4607E'}} />
              <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 70, letterSpacing: 20, color: '#8D8696'}}>ЛОТ</div>
              <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 360, lineHeight: 1, color: '#2B2433'}}>1958</div>
            </div>
          </div>
        </div>
      )}
      <Dog t={t} f={f} />
      <div style={{position: 'absolute', left: 60, top: 1622, padding: '12px 26px', borderRadius: 30, background: 'rgba(255,255,255,0.94)', boxShadow: '0 10px 26px rgba(80,50,90,0.18)', fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: INK, zIndex: 95}}>{script.diagram.title}</div>
      {t < 2.3 ? <CaptionsLight /> : <Captions />}
    </AbsoluteFill>
  );
};
