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
const img = (n) => staticFile('n23/img/' + n);
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
  {t: 0.0, x: 540, y: 1880, s: 1.0, pose: 'boat', look: 1},
  {t: 0.4, x: 540, y: 1800, s: 1.0, pose: 'boat', look: 1},
  {t: 0.8, x: 540, y: 1880, s: 1.0, pose: 'boat', look: 1},
  {t: 1.2, x: 540, y: 1800, s: 1.0, pose: 'boat', look: 1},
  {t: 1.6, x: 540, y: 1880, s: 1.0, pose: 'boat', look: 1},
  {t: 2.5, ...SIDE_R, pose: 'brush', look: -1},
  {t: 6.3, ...SIDE_R, pose: 'brush', look: -1},
  {t: 7.0, ...SIDE_L, pose: 'surf', look: 1},
  {t: 10.4, ...SIDE_L, pose: 'surf', look: 1},
  {t: 11.1, ...SIDE_R, pose: 'laugh', look: -1},
  {t: 13.9, ...SIDE_R, pose: 'laugh', look: -1},
  {t: 14.7, ...SIDE_L, pose: 'open', look: 1},
  {t: 18.6, ...SIDE_L, pose: 'open', look: 1},
  {t: 19.3, ...SIDE_R, pose: 'brush', look: -1},
  {t: 21.3, ...SIDE_R, pose: 'brush', look: -1},
  {t: 22.0, x: 500, y: 2679, s: 2.1, pose: 'lupa', look: 1},
  {t: 40, x: 500, y: 2679, s: 2.1, pose: 'lupa', look: 1},
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

const CAM_STARTS = [1.9, 6.4, 10.7, 14.2, 18.9, 21.5];
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
const ASP = {wave: 3840 / 2649, cover: 960 / 1454, hokusai: 673 / 628, monet: 960 / 1280, debussy: 960 / 1293};
const Crop = ({src, cx, cy, wr, w, h, r = 0, filter}) => {
  const a = ASP[src.slice(0, -4)];
  return (
    <div style={{position: 'relative', width: w, height: h, overflow: 'hidden', borderRadius: r, filter}}>
      <Img src={img(src)} style={{position: 'absolute', maxWidth: 'none', width: wr, height: wr / a, left: w / 2 - cx * wr, top: h / 2 - cy * wr / a}} />
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
// волнистый вайп слева направо: [clip сцены, clip пены]
const wavy = (t, s, dur) => {
  if (t < s) return ['polygon(0 0, 0 0, 0 0)', 'polygon(0 0, 0 0, 0 0)'];
  const q = easeIO(Math.min(1, Math.max(0, (t - s) / dur)));
  const X = q * 1380 - 150;
  const mk = (dx) => {
    const pts = ['0px 0px'];
    for (let y = 0; y <= 1920; y += 60) pts.push(`${X + dx + 70 * Math.sin(y / 85 + t * 9)}px ${y}px`);
    pts.push('0px 1920px');
    return `polygon(${pts.join(',')})`;
  };
  return [mk(0), mk(70)];
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
    out.push(<div key={r * 6 + c} style={{position: 'absolute', left: c * 180, top: r * 175 - 2, width: 182, height: 177, background: (r + c) % 2 ? '#1F2F78' : '#F2EAD8', transform: `scale(${s}) rotate(${(1 - s) * 90}deg)`, boxShadow: 'inset 0 0 0 4px rgba(120,140,200,0.35)'}} />);
  }
  return <div style={{position: 'absolute', inset: 0, zIndex: 45, pointerEvents: 'none'}}>{out}</div>;
};

export const Board23Main = () => {
  useFonts();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const k = (a, b, ease = easeIO) => interpolate(t, [a, b], [0, 1], {...clamp, easing: ease});
  const cam = camAt(t);

  const [clipB, foamB] = wavy(t, 1.7, 0.8);
  const irisC = `circle(${easeOut(k(6.4, 7.1)) * 1800}px at 540px 900px)`;
  const flipOut = k(10.2, 10.7, (x) => x * x);
  const flipIn = k(10.7, 11.2, easeOut);
  const shQ = (i) => easeIO(Math.min(1, Math.max(0, (t - 14.0 - i * 0.04) / 0.4)));
  const diagQ = easeIO(k(18.7, 19.35));
  const DX = diagQ * 1700;

  // хук
  const rush = easeOut(k(0, 1.1));
  const hkWr = 5200 - 1900 * rush + 80 * k(1.1, 2.2);
  const shake = t > 0.9 && t < 1.8 ? Math.sin(t * 60) * 8 : 0;
  const names = [['Сюнро', 19.1], ['Сорин', 19.5], ['Тайто', 19.9], ['Иицу', 20.3]];

  return (
    <AbsoluteFill style={{background: BG}}>
      {['wave.jpg', 'cover.png', 'hokusai.png', 'monet.jpg', 'debussy.jpg', 'p_lupa.png', 'p_boat.png', 'p_surf.png', 'p_brush.png', 'p_laugh.png', 'p_open.png'].map((n) => <Img key={n} src={img(n)} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />)}

      {/* A. ХУК */}
      {t < 2.7 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 15, overflow: 'hidden', background: '#1F2F78', transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
          <div style={{position: 'absolute', left: 0, top: 0, filter: `blur(${(1 - rush) * 10}px)`}}><Crop src="wave.jpg" cx={0.42} cy={0.42} wr={hkWr} w={1080} h={1920} /></div>
          {Array.from({length: 26}).map((_, i) => {
            const q = ((t * 0.8 + hash(i) * 1.3) % 1.3);
            return <div key={i} style={{position: 'absolute', left: hash(i + 5) * 1080, top: 1500 - q * 1300, width: 10 + hash(i + 2) * 18, height: 10 + hash(i + 2) * 18, borderRadius: '50%', background: '#fff', opacity: 0.85 * Math.min(1, q * 4) * (1 - Math.max(0, (q - 0.9) / 0.4))}} />;
          })}
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 330, background: 'linear-gradient(180deg, rgba(252,245,242,0.97) 0%, rgba(252,245,242,0.9) 55%, rgba(252,245,242,0))', zIndex: 5}} />
          <div style={{position: 'absolute', left: 0, width: 1080, top: 400, textAlign: 'center', zIndex: 8}}>
            <div style={{position: 'relative', display: 'inline-block', opacity: k(0.3, 0.7), transform: `scale(${0.6 + 0.4 * k(0.3, 0.8, easeOut)})`}}>
              <span style={{fontFamily: SERIF, fontWeight: 700, fontStyle: 'italic', fontSize: 210, color: '#fff', textShadow: '0 8px 30px rgba(10,20,70,0.8)'}}>цунами?</span>
              <svg width="100%" height="60" viewBox="0 0 100 10" preserveAspectRatio="none" style={{position: 'absolute', left: 0, top: '52%'}}><path d="M0 5 H100" stroke="#F27A9A" strokeWidth="2.6" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - easeOut(k(1.05, 1.4))} /></svg>
            </div>
          </div>
          <div style={{position: 'absolute', left: 190, top: 760, padding: '10px 34px', borderRadius: 18, background: '#C4607E', color: '#fff', fontFamily: SANS, fontWeight: 800, fontSize: 72, letterSpacing: 6, zIndex: 8, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', opacity: k(1.5, 1.7), transform: `rotate(-6deg) scale(${1.6 - 0.6 * k(1.5, 1.8, easeOut)})`, whiteSpace: 'nowrap'}}>НЕ ЦУНАМИ</div>
        </div>
      )}

      <div style={{position: 'absolute', inset: 0, transform: `translate(${cam.px}px, ${cam.py}px) rotate(${cam.rot}deg) scale(${cam.z})`, transformOrigin: '50% 50%', filter: cam.blur > 0.4 ? `blur(${cam.blur}px)` : undefined}}>
        {/* B. Большая волна, 1831 (волнистый вайп) */}
        {t >= 1.7 && t < 6.9 && (
          <>
            <div style={{position: 'absolute', inset: 0, zIndex: 15.5, background: '#fff', clipPath: foamB}} />
            <div style={{position: 'absolute', inset: 0, zIndex: 16, background: BG, clipPath: clipB}}>
              <div style={{position: 'absolute', left: 0, width: 1080, top: 285, textAlign: 'center', zIndex: 30, whiteSpace: 'nowrap'}}>
                {['1', '8', '3', '1'].map((d, i) => {
                  const at = [4.3, 4.65, 5.0, 5.4][i];
                  const q = Math.min(1, Math.max(0, (t - at) / 0.2));
                  const e = easeOut(q);
                  const ring = Math.min(1, Math.max(0, (t - at) / 0.45));
                  return (
                    <span key={i} style={{display: 'inline-block', position: 'relative', width: 190, textAlign: 'center'}}>
                      <span style={{display: 'inline-block', fontFamily: SERIF, fontWeight: 700, fontSize: 290, lineHeight: 1, color: INK, opacity: q > 0 ? 1 : 0, transform: `scale(${3.2 - 2.2 * e}) rotate(${(i % 2 ? 1 : -1) * (1 - e) * 14}deg)`, textShadow: '0 10px 0 rgba(196,96,126,0.25)'}}>{d}</span>
                      {t >= at && <span style={{position: 'absolute', left: 95 - 70, top: 150 - 70, width: 140, height: 140, borderRadius: '50%', border: '8px solid rgba(196,96,126,0.55)', opacity: 1 - ring, transform: `scale(${0.5 + ring * 2.6})`}} />}
                    </span>
                  );
                })}
              </div>
              <Card x={90} y={640} w={900} h={560} at={2.1} t={t} r={22} rot={-2} pad={10} bg="#fff"><Crop src="wave.jpg" cx={0.5} cy={0.5} wr={880 + 60 * k(2.1, 6.4, easeIO)} w={880} h={540} r={12} /></Card>
              <Card x={110} y={1230} w={540} h={130} at={2.8} t={t} r={30} from="left"><div style={{padding: '18px 34px'}}><div style={{fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: 6, color: ROSE}}>КАЦУСИКА ХОКУСАЙ</div><div style={{fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 50, color: INK, lineHeight: 1.05}}>Большая волна</div></div></Card>
            </div>
          </>
        )}

        {/* C. Фудзи крошечная (круг) */}
        {t >= 6.4 && t < 11.0 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 17, background: BG, clipPath: irisC, transform: `perspective(1600px) rotateY(${flipOut * 90}deg)`, transformOrigin: '0% 50%'}}>
            <Card x={140} y={400} w={800} h={800} at={6.7} t={t} r={44} pad={10} bg="#fff">
              <Crop src="wave.jpg" cx={0.645 - 0.2 * easeIO(k(8.6, 9.8))} cy={0.68 - 0.3 * easeIO(k(8.6, 9.8))} wr={6000 - 4300 * easeIO(k(8.6, 9.8))} w={780} h={780} r={34} />
              <svg width="800" height="800" viewBox="0 0 800 800" style={{position: 'absolute', inset: 0, opacity: 1 - k(8.5, 8.9)}}>
                <circle cx="400" cy="400" r="120" fill="none" stroke="#FFD25E" strokeWidth="9" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - easeOut(k(7.2, 7.7))} style={{filter: 'drop-shadow(0 0 12px rgba(255,200,80,0.9))'}} />
              </svg>
            </Card>
            <Chip txt="гора Фудзи" at={7.5} t={t} x={560} y={1240} size={30} bg="rgba(255,236,170,0.98)" />
            <Chip txt="а волна..." at={8.9} t={t} x={560} y={1310} size={28} />
          </div>
        )}

        {/* D. сотни оттисков (переворот) */}
        {t >= 10.7 && t < 14.3 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 18, background: BG, transform: `perspective(1600px) rotateY(${(1 - flipIn) * -90}deg)`, transformOrigin: '100% 50%'}}>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 330, textAlign: 'center'}}><Kin txt="сотни оттисков" at={12.9} t={t} size={110} italic color={ROSE} /></div>
            {['none', 'sepia(0.55)', 'hue-rotate(18deg) saturate(0.9)', 'saturate(0.5) brightness(1.05)', 'contrast(1.15) hue-rotate(-18deg)', 'grayscale(0.5)'].map((flt, i) => {
              const col = i % 2, row = Math.floor(i / 2);
              return <Card key={i} x={110 + col * 450 + (row % 2) * 30} y={520 + row * 250} w={420} h={290} at={11.1 + i * 0.28} t={t} r={14} rot={(i % 3 - 1) * 4} pad={6} bg="#fff" from={col ? 'right' : 'left'} z={20 + i}><Crop src="wave.jpg" cx={0.5} cy={0.5} wr={408} w={408} h={278} r={8} filter={flt} /></Card>;
            })}
          </div>
        )}

        {/* E. Моне и Дебюсси (жалюзи) */}
        {t >= 14.0 && t < 19.4 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 19, background: BG, clipPath: 'url(#shutW)'}}>
            <svg width="0" height="0" style={{position: 'absolute'}}><clipPath id="shutW">{Array.from({length: 8}).map((_, i) => <rect key={i} x={0} y={i * 241} width={t < 14.7 ? shQ(i) * 1080 : 1080} height={242} />)}</clipPath></svg>
            <Card x={70} y={450} w={430} h={470} at={14.5} t={t} r={22} rot={-2} pad={8} bg="#fff"><Crop src="monet.jpg" cx={0.5} cy={0.42} wr={414} w={414} h={454} r={14} /></Card>
            <Chip txt="Клод Моне" at={14.9} t={t} x={80} y={390} size={32} />
            <Card x={150} y={800} w={400} h={290} at={15.2} t={t} r={14} rot={-6} pad={7} bg="#fff" z={30} from="left"><Crop src="wave.jpg" cx={0.5} cy={0.5} wr={386} w={386} h={276} r={8} /></Card>
            <Chip txt="собирал гравюры" at={15.6} t={t} x={150} y={1105} size={26} bg="rgba(255,236,170,0.98)" z={32} />
            <Card x={560} y={450} w={430} h={470} at={16.0} t={t} r={22} rot={2} pad={8} bg="#fff" from="right"><Crop src="debussy.jpg" cx={0.55} cy={0.42} wr={414} w={414} h={454} r={14} /></Card>
            <Chip txt="Дебюсси" at={16.4} t={t} x={570} y={390} size={32} />
            <Card x={520} y={950} w={500} h={200} at={16.6} t={t} r={18} rot={-1} pad={0} from="right" z={26}>
              <svg width="500" height="200" viewBox="0 0 500 200" style={{display: 'block'}}>
                {[60, 80, 100, 120, 140].map((y) => <line key={y} x1="24" y1={y} x2="476" y2={y} stroke="#8D8696" strokeWidth="2" />)}
                <text x="30" y="40" fontFamily="Cormorant, serif" fontStyle="italic" fontWeight="600" fontSize="30" fill="#2B2433">La Mer</text>
                {[[60, 120], [100, 100], [140, 140], [180, 80], [220, 110], [260, 130], [300, 90], [340, 120], [380, 100], [420, 140]].map(([x, y], i) => {
                  const q = k(16.9 + i * 0.2, 17.1 + i * 0.2, easeOut);
                  return <g key={i} opacity={q} transform={`translate(0 ${(1 - q) * -20})`}><ellipse cx={x} cy={y} rx="11" ry="8" fill="#2B2433" transform={`rotate(-20 ${x} ${y})`} /><line x1={x + 10} y1={y - 3} x2={x + 10} y2={y - 46} stroke="#2B2433" strokeWidth="3" /></g>;
                })}
              </svg>
            </Card>
            <Chip txt="пишет «Море»" at={17.0} t={t} x={560} y={1175} size={28} />
            <Card x={840} y={760} w={170} h={258} at={17.8} t={t} r={10} rot={7} pad={5} bg="#fff" z={34} from="right"><Crop src="cover.png" cx={0.5} cy={0.5} wr={160} w={160} h={248} r={5} /></Card>
          </div>
        )}

        {/* F. имена Хокусая (косой вайп) */}
        {t >= 18.7 && t < 21.9 && (
          <>
            <div style={{position: 'absolute', inset: 0, zIndex: 19.5, background: '#1F2F78', clipPath: `polygon(0px 0px, ${DX + 90}px 0px, ${DX - 510}px 1920px, 0px 1920px)`}} />
            <div style={{position: 'absolute', inset: 0, zIndex: 20, background: BG, clipPath: `polygon(0px 0px, ${DX}px 0px, ${DX - 600}px 1920px, 0px 1920px)`}}>
              <Card x={110} y={440} w={320} h={300} at={19.0} t={t} r={22} rot={-3} pad={8} bg="#fff"><Crop src="hokusai.png" cx={0.5} cy={0.5} wr={304} w={304} h={284} r={12} /></Card>
              {names.map(([n, at], i) => {
                const q = easeOut(k(at, at + 0.35));
                return <div key={n} style={{position: 'absolute', left: 470 + (i % 2) * 250, top: 450 + Math.floor(i / 2) * 150, padding: '16px 30px', borderRadius: 26, background: '#fff', boxShadow: '0 18px 40px rgba(60,50,100,0.25)', fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 52, color: INK, opacity: q, transform: `translateY(${(1 - q) * 40}px) rotateX(${(1 - q) * 80}deg)`, zIndex: 25}}>{n}</div>;
              })}
              <div style={{position: 'absolute', left: 0, width: 1080, top: 800, textAlign: 'center'}}><Kin txt="~30 имён" at={20.3} t={t} size={170} weight={300} color="#C48A1A" /></div>
            </div>
          </>
        )}

        {/* G. узнали бы без подписи? (плитки) */}
        {t >= 21.4 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 21, background: '#0f1a4a', overflow: 'hidden'}}>
            <svg width="0" height="0" style={{position: 'absolute'}}><filter id="rip"><feTurbulence type="fractalNoise" baseFrequency="0.006 0.016" numOctaves="2" seed="3" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale={26 + 14 * Math.sin(t * 2.4)} /></filter></svg>
            <div style={{position: 'absolute', inset: -40, filter: 'url(#rip)', transform: `scale(${1.04 + 0.06 * k(21.5, 24, easeIO)})`}}>
              <Crop src="wave.jpg" cx={0.46} cy={0.46} wr={3000 + 200 * Math.sin(t * 1.3)} w={1160} h={2000} />
            </div>
            <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 60%, rgba(0,0,0,0) 40%, rgba(8,14,50,0.55) 100%)'}} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 330, background: 'linear-gradient(180deg, rgba(252,245,242,0.97) 0%, rgba(252,245,242,0.9) 55%, rgba(252,245,242,0))', zIndex: 5}} />
            {[['А вы бы узнали', 340, 21.55], ['эту волну', 470, 22.0], ['без подписи?', 600, 22.5]].map(([txt, top, at], i) => {
              const q = spring({frame: f - Math.round(at * fps), fps, config: {damping: 13, stiffness: 170}});
              if (t < at) return null;
              return <div key={i} style={{position: 'absolute', left: 0, width: 1080, top, textAlign: 'center', zIndex: 25}}><span style={{display: 'inline-block', padding: '8px 40px 14px', borderRadius: 40, background: i === 2 ? 'linear-gradient(90deg,#F7C3D2,#E79BB4)' : 'rgba(255,255,255,0.96)', boxShadow: '0 18px 40px rgba(10,20,70,0.45)', fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 84, color: INK, transform: `scale(${Math.min(1.05, q)}) rotate(${(i - 1) * 1.5}deg)`, opacity: Math.min(1, q * 2)}}>{txt}</span></div>;
            })}
            <Chip txt="пишите в комментариях" at={23.0} t={t} x={60} y={740} size={28} bg="rgba(255,255,255,0.97)" z={26} />
          </div>
        )}
      </div>

      <Tiles t={t} T={21.5} />
      <Dog t={t} f={f} />
            {t >= 22.6 && (
              <div style={{position: 'absolute', left: 843 - 165, top: 1395 - 165, width: 330, height: 330, borderRadius: '50%', overflow: 'hidden', zIndex: 75, boxShadow: '0 0 0 8px rgba(255,236,170,0.95), 0 0 60px 20px rgba(255,236,170,0.8)', transform: `scale(${easeOut(k(22.6, 23.0))})`, background: '#fff'}}>
                <Crop src="wave.jpg" cx={0.065} cy={0.22} wr={9400} w={330} h={330} />
                <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.5), rgba(255,255,255,0) 40%)'}} />
              </div>
            )}

      <div style={{position: 'absolute', left: 60, top: 1622, padding: '12px 26px', borderRadius: 30, background: 'rgba(255,255,255,0.94)', boxShadow: '0 10px 26px rgba(80,50,90,0.18)', fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: INK, zIndex: 95}}>{script.diagram.title}</div>
      <Captions />
    </AbsoluteFill>
  );
};
