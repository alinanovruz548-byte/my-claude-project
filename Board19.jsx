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
const img = (n) => staticFile('n19/img/' + n);
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
  {t: 3.3, x: 540, y: 2150, s: 1.0, pose: 'palette', look: 1},
  {t: 3.9, x: 540, y: 1790, s: 1.0, pose: 'palette', look: 1},
  {t: 4.6, ...SIDE_R, pose: 'scope', look: 1},
  {t: 7.8, ...SIDE_R, pose: 'scope', look: 1},
  {t: 8.5, ...SIDE_L, pose: 'scope', look: -1},
  {t: 10.2, ...SIDE_L, pose: 'scope', look: -1},
  {t: 10.8, ...SIDE_R, pose: 'palette', look: -1},
  {t: 12.0, ...SIDE_R, pose: 'palette', look: -1},
  {t: 12.6, ...SIDE_L, pose: 'sleep', look: 1},
  {t: 15.0, ...SIDE_L, pose: 'sleep', look: 1},
  {t: 15.6, ...SIDE_R, pose: 'sleep', look: -1},
  {t: 17.8, ...SIDE_R, pose: 'sleep', look: -1},
  {t: 18.6, x: 540, y: 1790, s: 1.1, pose: 'moon', look: 1},
  {t: 40, x: 540, y: 1790, s: 1.1, pose: 'moon', look: 1},
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

const CAM_STARTS = [3.4, 7.8, 10.3, 12.1, 15.3, 18.5];
const camAt = (t) => {
  let z = 1 + Math.sin(t / 1.7) * 0.012, rot = 0, px = 0, py = 0, blur = 0;
  CAM_STARTS.forEach((s, i) => {
    const dt = t - s;
    if (dt >= 0 && dt < 0.8) {
      const q = 1 - easeOut(dt / 0.8);
      const sg = i % 2 ? 1 : -1;
      z += (i % 3 === 0 ? 0.5 : i % 3 === 1 ? 0.75 : 0.3) * q;
      rot += sg * 7 * q; px += sg * 200 * q; py += (i % 2 ? -140 : 170) * q; blur = Math.max(blur, q * 8);
    }
  });
  return {z, rot, px, py, blur};
};
// «лунный портал»: круг раскрывает сцену от центра (cx, cy)
const irisClip = (t, s, cx, cy, dur = 0.8) => {
  if (t < s) return 'circle(0px at 50% 50%)';
  const q = easeOut(Math.min(1, (t - s) / dur));
  return `circle(${q * 2300}px at ${cx}px ${cy}px)`;
};
const Star = ({x, y, s = 1, ph = 0, t, c = '#FFF3B8'}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 34 * s, height: 34 * s, background: c, clipPath: 'polygon(50% 0, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0 50%, 40% 40%)', opacity: 0.35 + 0.65 * Math.abs(Math.sin(t * 2.2 + ph)), transform: `scale(${0.7 + 0.5 * Math.abs(Math.sin(t * 2.2 + ph))}) rotate(${t * 20 + ph * 30}deg)`, filter: 'drop-shadow(0 0 8px rgba(255,230,140,0.9))'}} />
);

export const Board19Main = () => {
  useFonts();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const k = (a, b, ease = easeIO) => interpolate(t, [a, b], [0, 1], {...clamp, easing: ease});
  const dd = dogState(t);
  const cam = camAt(t);
  const tapAt = 21.1, tap2At = 21.7;
  const endIn = k(18.5, 19.1, easeOut);
  const cur = t < tapAt ? 0 : t < tap2At ? 1 : 2;
  const curX = interpolate(t, [20.2, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [880, 560, 560, 600], clamp);
  const curY = interpolate(t, [20.2, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [1500, 770, 780, 910], clamp);
  const ic = (s) => irisClip(t, s, dd.x, dd.y - 260);
  const swirlF = 0.011 + Math.sin(t * 1.3) * 0.0025;

  // хук: звёздная ночь крутится, собака на луне; на «днём» ночь превращается в день
  const moonRise = easeOut(k(0, 1.3));
  const dayIris = k(2.55, 3.4, easeOut);
  const dgk = k(1.2, 3.2, (x) => x * x);
  const dgmv = k(1.2, 2.4, easeOut);
  const dgx = interpolate(t, [0, 1.3], [1010, 540], {...clamp, easing: easeOut});
  const dgy = interpolate(t, [0, 1.3], [1250, 1120], {...clamp, easing: easeOut}) + (300 - 1120) * dgmv;
  const dgs = 1 + 7 * dgk;

  return (
    <AbsoluteFill style={{background: 'linear-gradient(172deg, #FCF5F2 0%, #F3EAF6 55%, #E8EEF9 100%)'}}>
      {['starry.jpg', 'p_moon.png', 'p_scope.png', 'p_sleep.png', 'p_palette.png'].map((n) => <Img key={n} src={img(n)} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />)}
      <div style={{position: 'absolute', left: -150 + Math.sin(t / 2.2) * 40, top: 420, width: 620, height: 620, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,176,196,0.5), rgba(244,176,196,0))', zIndex: 1}} />
      <div style={{position: 'absolute', left: 560 + Math.cos(t / 2.7) * 50, top: 1060, width: 640, height: 640, borderRadius: '50%', background: 'radial-gradient(circle, rgba(170,190,250,0.5), rgba(170,190,250,0))', zIndex: 1}} />

      {/* A. ХУК */}
      {t < 3.5 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 15, overflow: 'hidden', background: '#0e1a3d'}}>
          <svg width="0" height="0" style={{position: 'absolute'}}><filter id="swirl"><feTurbulence type="turbulence" baseFrequency={`${swirlF} ${swirlF * 1.6}`} numOctaves="2" seed="4" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="46" /></filter></svg>
          <div style={{position: 'absolute', inset: -60, backgroundImage: `url(${img('starry.jpg')})`, backgroundSize: 'cover', backgroundPosition: '40% 40%', filter: 'url(#swirl) saturate(1.2)', transform: `scale(${1.08 + t * 0.03})`}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 330, background: 'linear-gradient(180deg, rgba(252,245,242,0.97) 0%, rgba(252,245,242,0.9) 55%, rgba(252,245,242,0))', zIndex: 5}} />
          {[[120, 520, 1.2, 0], [880, 640, 1.6, 1], [300, 900, 0.9, 2], [760, 1000, 1.1, 3], [520, 760, 0.8, 4], [170, 1230, 1.0, 5], [900, 1300, 1.3, 6]].map(([x, y, s, p], i) => <Star key={i} x={x} y={y} s={s} ph={p} t={t} />)}
          <div style={{position: 'absolute', left: dgx - 400, top: dgy + 150, width: 800, height: 800, background: 'radial-gradient(circle, rgba(255,230,140,0.5), rgba(255,230,140,0) 65%)', opacity: 1 - dgk, transform: `scale(${1 + Math.sin(t * 4) * 0.04})`}} />
          <div style={{position: 'absolute', left: dgx - 575 * 1.2 / 2, top: dgy + Math.sin(t * 3) * 10 * (1 - dgk), width: 575 * 1.2, height: 890 * 1.2, transformOrigin: '50% 62%', transform: `rotate(${(1 - moonRise) * 8 + Math.sin(t * 2) * 2}deg) scale(${dgs})`, filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.5))'}}>
            <Img src={img('p_moon.png')} style={{width: '100%', height: '100%'}} />
          </div>
          {/* день: круг раскрывает светлое небо и солнце */}
          <div style={{position: 'absolute', inset: 0, zIndex: -1, clipPath: `circle(${dayIris * 2200}px at 540px 1250px)`, background: 'linear-gradient(180deg,#FFF3C7 0%,#FFD98A 55%,#F6B77A 100%)'}}>
            <div style={{position: 'absolute', left: 620, top: 300, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,#FFFBE0,#FFD24A 60%,#F7A93A)', boxShadow: '0 0 120px 60px rgba(255,214,90,0.7)', transform: `scale(${1 + Math.sin(t * 5) * 0.03})`}} />
            {Array.from({length: 14}).map((_, i) => <div key={i} style={{position: 'absolute', left: 770, top: 450, width: 8, height: 300, marginLeft: -4, background: 'linear-gradient(180deg, rgba(255,230,120,0.8), rgba(255,230,120,0))', transformOrigin: '50% 0', transform: `rotate(${i * 25.7 + t * 14}deg) translateY(150px)`, opacity: 0.6}} />)}
          </div>
        </div>
      )}

      <div style={{position: 'absolute', inset: 0, transform: `translate(${cam.px}px, ${cam.py}px) rotate(${cam.rot}deg) scale(${cam.z})`, transformOrigin: '50% 50%', filter: cam.blur > 0.4 ? `blur(${cam.blur}px)` : undefined}}>
        {/* B. июнь 1889, Сен-Реми */}
        {t >= 3.4 && t < 8.3 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 16, opacity: k(3.3, 3.7) * (1 - k(7.9, 8.3))}}>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 280, textAlign: 'center'}}><Kin txt="июнь" at={3.7} t={t} size={100} italic color={ROSE} /></div>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 370, textAlign: 'center'}}><Kin txt="1889" at={4.3} t={t} size={230} weight={300} /></div>
            <Card x={110} y={720} w={860} h={500} at={6.0} t={t} r={26} pad={12} bg="#fff" from="left" rot={-2}><div style={{width: '100%', height: '100%', overflow: 'hidden', borderRadius: 16}}><Paint src="hosp.jpg" t={t} at={6.0} pos="62% 50%" zoomFrom={1.05} zoomTo={1.3} dur={2.4} /></div></Card>
            <Card x={90} y={1160} w={640} h={140} at={6.5} t={t} r={30} from="left"><div style={{padding: '20px 36px'}}><div style={{fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: 6, color: ROSE}}>БОЛЬНИЦА · ФРАНЦИЯ</div><div style={{fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 58, color: INK, lineHeight: 1.05}}>Сен-Реми-де-Прованс</div></div></Card>
          </div>
        )}

        {/* C. звёзды из окна перед рассветом */}
        {t >= 7.8 && t < 10.8 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 17, clipPath: ic(7.8), opacity: 1 - k(10.4, 10.8)}}>
            <Card x={160} y={480} w={760} h={900} at={7.8} t={t} r={26} pad={0} bg="#fff">
              <div style={{position: 'absolute', inset: 0, backgroundImage: `url(${img('starry.jpg')})`, backgroundSize: '260% auto', backgroundPosition: `${50 + Math.sin(t * 1.2) * 4}% 6%`, transform: `scale(${1 + (t - 7.8) * 0.05})`}} />
              <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(255,190,130,0.55) 0%, rgba(255,190,130,0) 40%)', opacity: k(9.0, 10.2)}} />
              <svg width="760" height="920" style={{position: 'absolute', inset: 0}}><rect x="14" y="14" width="732" height="892" fill="none" stroke="#F7F2EA" strokeWidth="28" rx="10" /><path d="M380 14 V906 M14 460 H746" stroke="#F7F2EA" strokeWidth="22" /></svg>
            </Card>
            <Chip txt="вид из окна" at={8.2} t={t} x={160} y={395} size={30} />
            <Chip txt="перед рассветом" at={9.3} t={t} x={450} y={395} size={30} bg="rgba(255,225,170,0.97)" />
            {[[180, 520, 1.1, 0], [830, 600, 1.4, 2], [700, 460, 0.8, 4]].map(([x, y, s, p], i) => <Star key={i} x={x} y={y} s={s} ph={p} t={t} />)}
          </div>
        )}

        {/* D. а картину писал днём */}
        {t >= 10.3 && t < 12.6 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 18, clipPath: ic(10.3), opacity: 1 - k(12.2, 12.6)}}>
            <div style={{position: 'absolute', left: 700, top: 330, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle,#FFFBE0,#FFD24A 60%,#F7A93A)', boxShadow: '0 0 90px 40px rgba(255,214,90,0.6)', opacity: k(10.5, 11.0), transform: `scale(${1 + Math.sin(t * 5) * 0.04})`}} />
            <Card x={150} y={480} w={780} h={640} at={10.5} t={t} r={8} pad={0} bg="#D9AE5A" rot={-1.5}>
              <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#F3D58A,#B98A36 50%,#F0CF80)', borderRadius: 8}} />
              <div style={{position: 'absolute', inset: 30, border: '6px solid rgba(120,80,20,0.55)', borderRadius: 4}} />
              <div style={{position: 'absolute', inset: 56, overflow: 'hidden', boxShadow: 'inset 0 0 0 4px rgba(90,60,10,0.6)'}}><Paint src="starry.jpg" t={t} at={10.5} pos="50% 50%" zoomFrom={1.0} zoomTo={1.2} dur={2.2} /></div>
            </Card>
            <Card x={140} y={1150} w={560} h={150} at={11.0} t={t} r={34} from="left"><div style={{padding: '16px 40px'}}><div style={{fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: 6, color: ROSE}}>КАРТИНУ ПИСАЛ</div><div style={{fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 84, color: '#D08A1E', lineHeight: 1}}>днём</div></div></Card>
          </div>
        )}

        {/* E. деревня из детства */}
        {t >= 12.1 && t < 15.8 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 19, clipPath: ic(12.1), opacity: 1 - k(15.4, 15.8)}}>
            <Chip txt="по одной из версий" at={12.7} t={t} x={300} y={320} size={28} bg="rgba(255,225,170,0.97)" />
            <div style={{position: 'absolute', left: 0, width: 1080, top: 390, textAlign: 'center'}}><Kin txt="из детства" at={13.9} t={t} size={120} italic color={ROSE} /></div>
            <div style={{position: 'absolute', left: 120, top: 600, width: 840, height: 600, borderRadius: 300, background: '#fff', boxShadow: '0 40px 90px rgba(80,50,90,0.25)', opacity: k(12.2, 12.7), transform: `scale(${0.9 + 0.1 * k(12.2, 12.8, easeOut)})`}}>
              <div style={{position: 'absolute', left: 36, top: 36, right: 36, bottom: 36, borderRadius: 270, overflow: 'hidden', filter: `sepia(${1 - k(14.6, 15.4)}) saturate(${0.8 + 0.4 * k(14.6, 15.4)}) blur(${(1 - k(12.4, 13.6)) * 6}px)`}}>
                <Paint src="starry.jpg" t={t} at={12.3} pos="50% 82%" zoomFrom={1.7} zoomTo={2.4} dur={3.2} />
                <div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 0 120px 40px rgba(120,80,40,0.55)'}} />
              </div>
            </div>
            <div style={{position: 'absolute', left: 150, top: 1230, width: 70, height: 70, borderRadius: '50%', background: '#fff', boxShadow: '0 10px 24px rgba(80,50,90,0.22)', opacity: k(12.6, 12.9)}} />
            <svg width="1080" height="200" viewBox="0 0 1080 200" style={{position: 'absolute', left: 0, top: 1210}}>
              {[[330, 0], [470, 1], [610, 2]].map(([x, i]) => {
                const q = easeOut(k(13.0 + i * 0.35, 13.5 + i * 0.35));
                return (
                  <g key={i} transform={`translate(${x} ${150 - 30 * q}) scale(${q})`} opacity={q}>
                    <rect x="-40" y="-60" width="80" height="60" rx="4" fill="#fff" stroke={ROSE} strokeWidth="5" />
                    <path d="M-52 -58 L0 -105 L52 -58 Z" fill="#F7C3D2" stroke={ROSE} strokeWidth="5" strokeLinejoin="round" />
                    <rect x="-12" y="-36" width="24" height="36" rx="4" fill={ROSE} />
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* F. «неудачная» */}
        {t >= 15.3 && t < 18.9 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 20, clipPath: ic(15.3), opacity: 1 - k(18.4, 18.9)}}>
            <div style={{position: 'absolute', left: 190, top: 470 + k(16.4, 17.6) * 40, width: 700, height: 560, borderRadius: 12, overflow: 'hidden', border: '14px solid #F7F2EA', boxShadow: '0 40px 90px rgba(60,50,80,0.35)', transform: `rotate(${-3 + k(16.4, 17.6) * 10}deg)`, filter: `grayscale(${k(16.5, 17.5) * 0.9}) brightness(${1 - k(16.5, 17.5) * 0.2})`}}>
              <Paint src="starry.jpg" t={t} at={15.3} pos="50% 50%" zoomFrom={1.0} zoomTo={1.12} dur={3} />
            </div>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 1090, textAlign: 'center'}}>
              <div><Kin txt="Ван Гог считал её" at={16.3} t={t} size={66} weight={500} /></div>
              <div style={{display: 'inline-block', transform: `rotate(${Math.sin(t * 9) * 1.5}deg)`}}><Kin txt="неудачной" at={17.2} t={t} size={150} italic color={ROSE} /></div>
            </div>
            {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 150 + i * 190, top: 500 + ((t * 120 + i * 140) % 500), fontFamily: SERIF, fontSize: 60, color: SOFT, opacity: k(17.2, 17.6) * 0.5}}>×</div>)}
          </div>
        )}
      </div>

      {/* G. финал */}
      {t >= 18.5 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 50, opacity: endIn}}>
          <div style={{position: 'absolute', left: 0, width: 1080, top: 345, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 100, color: INK, lineHeight: 1.05}}>Реальность<br />или фантазия?</div>
          {[['Реальность', 640, 0], ['Фантазия', 780, 1]].map(([txt, top, i]) => {
            const pr = spring({frame: f - Math.round((19.1 + i * 0.15) * fps), fps, config: {damping: 14, stiffness: 160}});
            const glow = i === 1 && t >= tap2At;
            const act = cur === i + 1 || glow;
            return (
              <div key={i} style={{position: 'absolute', left: 170, top, width: 740, height: 110, borderRadius: 55, background: glow ? 'linear-gradient(90deg,#F7C3D2,#E79BB4)' : 'rgba(255,255,255,0.92)', color: INK, fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: glow ? '0 20px 50px rgba(196,96,126,0.45)' : '0 16px 36px rgba(80,50,90,0.18)', transform: `scale(${Math.min(pr, 1.03) * (glow ? 1.05 : 1) * (act && !glow ? 0.97 : 1)})`, opacity: Math.min(1, pr * 2)}}>{txt}</div>
            );
          })}
          <svg width="120" height="140" viewBox="-10 -10 120 140" style={{position: 'absolute', left: curX, top: curY, zIndex: 80, filter: 'drop-shadow(8px 12px 10px rgba(0,0,0,0.3))', transform: `scale(${(t >= tapAt && t < tapAt + 0.2) || (t >= tap2At && t < tap2At + 0.2) ? 0.85 : 1})`}}>
            <path d="M5 5 L5 95 L30 72 L48 112 L66 104 L48 66 L82 66 Z" fill="#fff" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {t >= 3.4 && <Dog t={t} f={f} />}
      <div style={{position: 'absolute', left: 60, top: 1622, padding: '12px 26px', borderRadius: 30, background: 'rgba(255,255,255,0.94)', boxShadow: '0 10px 26px rgba(80,50,90,0.18)', fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: INK, zIndex: 95}}>{script.diagram.title}</div>
      <Captions />
    </AbsoluteFill>
  );
};
