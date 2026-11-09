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
const img = (n) => staticFile('n17/img/' + n);
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
  {t: 3.2, x: 1500, y: 1760, s: 2.6, pose: 'swipe', look: 1, big: true},
  {t: 3.95, x: -480, y: 1760, s: 2.6, pose: 'swipe', look: 1, big: true},
  {t: 4.0, x: 1250, y: 1895, s: 0.72, pose: 'wave', look: 1},
  {t: 4.6, ...SIDE_R, pose: 'wave', look: 1},
  {t: 6.0, ...SIDE_R, pose: 'open', look: -1},
  {t: 7.4, ...SIDE_R, pose: 'open', look: -1},
  {t: 8.2, ...SIDE_L, pose: 'jump', look: 1},
  {t: 9.1, ...SIDE_L, pose: 'open', look: 1},
  {t: 10.9, ...SIDE_L, pose: 'open', look: 1},
  {t: 11.6, x: 890, y: 1795, s: 0.9, pose: 'scared', look: -1},
  {t: 13.3, x: 890, y: 1795, s: 0.9, pose: 'scared', look: -1},
  {t: 13.4, x: 1500, y: 1760, s: 2.6, pose: 'swipe', look: 1, big: true},
  {t: 14.15, x: -480, y: 1760, s: 2.6, pose: 'swipe', look: 1, big: true},
  {t: 14.2, x: 1250, y: 1895, s: 0.72, pose: 'laugh', look: 1},
  {t: 14.8, ...SIDE_R, pose: 'laugh', look: 1},
  {t: 16.4, ...SIDE_R, pose: 'wave', look: -1},
  {t: 17.2, ...SIDE_L, pose: 'jump', look: 1},
  {t: 18.1, ...SIDE_L, pose: 'wash', look: 1},
  {t: 19.8, ...SIDE_L, pose: 'wash', look: 1},
  {t: 20.6, x: 540, y: 1800, s: 1.05, pose: 'wave', look: 1},
  {t: 21.5, x: 540, y: 1800, s: 1.05, pose: 'wave', look: 1},
  {t: 22.0, x: 540, y: 1790, s: 1.12, pose: 'laugh', look: 1},
  {t: 23.0, x: 540, y: 1790, s: 1.12, pose: 'laugh', look: 1},
  {t: 40, x: 540, y: 1790, s: 1.12, pose: 'laugh', look: 1},
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

// наклейка, «шлёпается» на стену: прилетает крупной и с поворотом, оседает с отскоком
const Sticker = ({src, x, y, w, h, at, t, rot = 0, pos = '50% 50%', z = 22}) => {
  if (t < at) return null;
  const dt = t - at;
  const q = Math.min(1, dt / 0.32);
  const s = 1 + (1 - easeOut(q)) * 1.1 + (dt > 0.32 ? Math.sin((dt - 0.32) * 22) * 0.04 * Math.exp(-(dt - 0.32) * 7) : 0);
  const r = rot + (1 - easeOut(q)) * 22;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, zIndex: z, opacity: Math.min(1, dt / 0.08), transform: `scale(${s}) rotate(${r}deg)`, boxShadow: q < 1 ? '0 50px 80px rgba(30,20,20,0.45)' : '0 14px 30px rgba(30,20,20,0.4)', borderRadius: 10, overflow: 'hidden', border: '9px solid #F7F2EA', background: '#F7F2EA'}}>
      <div style={{width: '100%', height: '100%', backgroundImage: `url(${img(src)})`, backgroundSize: 'cover', backgroundPosition: pos}} />
    </div>
  );
};

// камера: «подлёты» и «пролёты» на стыках сцен
const CAM_STARTS = [3.95, 5.8, 8.6, 10.0, 11.4, 14.2, 16.9, 20.1, 21.5];
const camAt = (t) => {
  let z = 1 + Math.sin(t / 1.7) * 0.012, rot = 0, px = 0, py = 0, blur = 0;
  CAM_STARTS.forEach((s, i) => {
    const dt = t - s;
    if (dt >= 0 && dt < 0.75) {
      const q = 1 - easeOut(dt / 0.75);
      const sg = i % 2 ? 1 : -1;
      z += (i % 3 === 0 ? 0.55 : i % 3 === 1 ? -0.0 : 0.35) * q;
      if (i % 3 === 1) z += 0.7 * q;
      rot += sg * 6 * q; px += sg * 220 * q; py += (i % 2 ? -120 : 160) * q; blur = Math.max(blur, q * 7);
    }
  });
  return {z, rot, px, py, blur};
};

export const Board17Main = () => {
  useFonts();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const k = (a, b, ease = easeIO) => interpolate(t, [a, b], [0, 1], {...clamp, easing: ease});

  const swipeA = t >= 3.2 && t < 3.95, swipeB = t >= 13.4 && t < 14.15;
  const dd = dogState(t);
  const edge = dd.x - 650;
  const clipFrom = (on, passed) => on ? `inset(0 0 0 ${Math.max(0, Math.min(1080, edge))}px)` : passed ? 'none' : 'inset(0 0 0 1080px)';
  const sceneB = {clip: clipFrom(swipeA, t >= 3.95)};
  const sceneE = {clip: clipFrom(swipeB, t >= 14.15)};
  const cam = camAt(t);

  const tapAt = 23.5, tap2At = 24.1;
  const endIn = k(21.5, 22.2, easeOut);
  const cur = t < tapAt ? 0 : t < tap2At ? 1 : 2;
  const curX = interpolate(t, [22.6, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [880, 560, 560, 600], clamp);
  const curY = interpolate(t, [22.6, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [1500, 770, 780, 910], clamp);
  const moveCanvas = k(18.2, 19.2);

  // хук: автопортрет рисуется, камера влетает в глаз, резкий переход на испуганную морду
  const reveal = k(0.1, 1.5, easeOut);
  const fly = k(1.45, 2.05, Bezier => Easing.bezier(0.7, 0, 0.9, 0.3)(Bezier));
  const hookZoom = 1 + fly * 1.9;
  const flash = interpolate(t, [2.0, 2.06, 2.22], [0, 1, 0], clamp);
  const shake = t >= 2.06 && t < 3.2 ? Math.sin(f * 2.3) * 9 : 0;
  const shakeY = t >= 2.06 && t < 3.2 ? Math.cos(f * 2.9) * 7 : 0;
  const brushArc = Math.sin(t * 9) * 10;

  return (
    <AbsoluteFill style={{background: 'linear-gradient(172deg, #FCF5F2 0%, #F3EAF6 55%, #E8EEF9 100%)'}}>
      {['goya.jpg', 'dog.jpg', 'sabbath.jpg', 'pilgrim.jpg', 'saturn.jpg', 'house.jpg', 'prado.jpg', 'selfp.jpg', 'p_closed.png', 'p_wave.png', 'p_laugh.png', 'p_wash.png', 'p_jump.png', 'p_swipe.png', 'p_open.png', 'p_scared.png', 'p_paint.png'].map((n) => <Img key={n} src={img(n)} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />)}
      <div style={{position: 'absolute', left: -150 + Math.sin(t / 2.2) * 40, top: 420, width: 620, height: 620, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,176,196,0.5), rgba(244,176,196,0))', zIndex: 1}} />
      <div style={{position: 'absolute', left: 560 + Math.cos(t / 2.7) * 50, top: 1060, width: 640, height: 640, borderRadius: '50%', background: 'radial-gradient(circle, rgba(170,190,250,0.5), rgba(170,190,250,0))', zIndex: 1}} />

      {/* A. ХУК */}
      {t < 3.2 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 15, overflow: 'hidden', background: '#2a1f1c'}}>
          {t < 2.04 && (
            <div style={{position: 'absolute', inset: 0, transformOrigin: '52% 36%', transform: `scale(${hookZoom})`, filter: `blur(${fly * 10}px)`}}>
              <div style={{position: 'absolute', inset: 0, backgroundImage: `url(${img('selfp.jpg')})`, backgroundSize: 'cover', backgroundPosition: '50% 25%', clipPath: `inset(0 0 ${(1 - reveal) * 100}% 0)`, filter: `saturate(1.25) contrast(1.15) hue-rotate(-6deg) ${reveal < 1 ? 'sepia(0.35)' : ''}`}} />
              <div style={{position: 'absolute', left: 0, right: 0, top: `${reveal * 100}%`, height: 14, background: 'linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0))', opacity: reveal < 1 ? 1 : 0}} />
            </div>
          )}
          {t < 2.04 && <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 440, background: 'linear-gradient(180deg, rgba(252,245,242,0.95), rgba(252,245,242,0))'}} />}
          {t < 2.04 && <div style={{position: 'absolute', left: 90 + brushArc, top: 1180 + Math.sin(t * 9) * 16, width: 300, height: 14, borderRadius: 7, background: 'rgba(60,30,20,0.0)'}} />}
          {t < 1.9 && (
            <div style={{position: 'absolute', left: 90, bottom: 125, width: 575 * 0.95, height: 890 * 0.95, transformOrigin: '50% 100%', transform: `rotate(${Math.sin(t * 9) * 2.4}deg) scale(${1 - fly * 0.2})`, opacity: 1 - fly, zIndex: 20, filter: 'drop-shadow(0 28px 30px rgba(0,0,0,0.5))'}}>
              <Img src={img('p_paint.png')} style={{width: '100%', height: '100%'}} />
            </div>
          )}
          {t >= 2.04 && (
            <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 45%, #FFE7EF, #F6C7D7 70%, #E9A6BE)', zIndex: 16}}>
              <div style={{position: 'absolute', left: 540 - 575 * 1.95 / 2 + shake, top: 2050 - 890 * 1.95 + shakeY, width: 575 * 1.95, height: 890 * 1.95}}>
                <Img src={img('p_scared.png')} style={{width: '100%', height: '100%', filter: 'drop-shadow(0 30px 40px rgba(60,20,40,0.35))'}} />
              </div>
              <div style={{position: 'absolute', left: 0, right: 0, top: 1560, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 120, color: '#fff', textShadow: '0 8px 30px rgba(120,30,70,0.5)', opacity: k(2.25, 2.5)}}>кошмары!</div>
            </div>
          )}
          <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash, zIndex: 40}} />
        </div>
      )}

      {/* камера: все сцены после хука */}
      <div style={{position: 'absolute', inset: 0, transform: `translate(${cam.px}px, ${cam.py}px) rotate(${cam.rot}deg) scale(${cam.z})`, transformOrigin: '50% 50%', filter: cam.blur > 0.4 ? `blur(${cam.blur}px)` : undefined}}>
        {/* B. Гойя (открывается за лапой) */}
        {t >= 3.2 && t < 6.1 && (
          <div style={{position: 'absolute', inset: 0, clipPath: sceneB.clip, zIndex: 16}}>
            <Card x={140} y={360} w={800} h={980} at={3.2} t={t} r={34} pad={14}><div style={{width: '100%', height: '100%', borderRadius: 24, overflow: 'hidden'}}><Paint src="goya.jpg" t={t} at={3.9} pos="55% 30%" zoomFrom={1.0} zoomTo={1.14} dur={2.4} /></div></Card>
            <Card x={140} y={1360} w={470} h={200} at={4.1} t={t} r={30} z={25} from="left">
              <div style={{padding: '30px 38px'}}>
                <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 6, color: ROSE}}>ХУДОЖНИК</div>
                <div style={{fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 70, lineHeight: 1.05, color: INK, marginTop: 6}}>Гойя</div>
                <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 24, color: SOFT, marginTop: 2}}>1746 — 1828</div>
              </div>
            </Card>
          </div>
        )}

        {/* C. 1819, Дом глухого (фото 1900 года) */}
        {t >= 5.7 && t < 9.2 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 17, opacity: 1 - k(8.9, 9.3)}}>
            <Card x={60} y={360} w={960} h={770} at={5.8} t={t} r={30} pad={12}>
              <div style={{width: '100%', height: '100%', borderRadius: 20, overflow: 'hidden', position: 'relative'}}>
                <Paint src="house.jpg" t={t} at={5.8} pos="40% 50%" zoomFrom={1.0} zoomTo={1.22} dur={3.4} />
                <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(40,30,30,0.0), rgba(40,30,30,0.45))'}} />
              </div>
            </Card>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 400, textAlign: 'center', zIndex: 20}}>
              <Kin txt="1819" at={5.9} t={t} size={250} color="#fff" weight={300} style={{textShadow: '0 10px 40px rgba(40,30,30,0.55)'}} />
            </div>
            <Card x={150} y={1100} w={780} h={200} at={6.5} t={t} r={30} z={25}>
              <div style={{padding: '26px 44px'}}>
                <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 6, color: ROSE}}>ВИЛЛА НА ОКРАИНЕ МАДРИДА · ФОТО ОК. 1900</div>
                <div style={{fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 84, lineHeight: 1.05, color: INK, marginTop: 8}}>Дом глухого</div>
              </div>
            </Card>
          </div>
        )}

        {/* D. Чёрные картины: наклейки «хоп», потом большой Сатурн */}
        {t >= 8.6 && t < 13.9 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 18, opacity: Math.min(1, k(8.6, 9.0)) * (1 - k(13.4, 13.9))}}>
            <Plaster x={60} y={350} w={960} h={900} at={8.6} t={t} />
            <div style={{position: 'absolute', left: 60, width: 960, top: 372, textAlign: 'center', zIndex: 20, opacity: 1 - k(11.3, 11.5)}}><Kin txt="Чёрные картины" at={8.9} t={t} size={96} italic color="#fff" style={{textShadow: '0 8px 30px rgba(40,30,30,0.4)'}} /></div>
            <div style={{opacity: 1 - k(11.3, 11.55)}}>
              <Sticker src="dog.jpg" x={100} y={520} w={300} h={470} at={9.3} t={t} rot={-3} pos="40% 72%" />
              <Sticker src="sabbath.jpg" x={440} y={520} w={540} h={210} at={10.0} t={t} rot={2} pos="35% 50%" />
              <Sticker src="pilgrim.jpg" x={430} y={790} w={560} h={210} at={10.6} t={t} rot={-2} pos="30% 50%" />
              <Chip txt="ведьмы" at={10.15} t={t} x={620} y={668} size={26} z={30} rot={2} />
              <Chip txt="чудовища" at={10.75} t={t} x={600} y={938} size={26} z={30} rot={-2} />
            </div>
            {t >= 11.4 && (() => {
              const dt = t - 11.4;
              const q = Math.min(1, dt / 0.3);
              const s = 1 + (1 - easeOut(q)) * 1.3 + (dt > 0.3 ? Math.sin((dt - 0.3) * 20) * 0.03 * Math.exp(-(dt - 0.3) * 6) : 0);
              return (
                <>
                  <div style={{position: 'absolute', left: 190, top: 330, width: 640, height: 1176, borderRadius: 16, overflow: 'hidden', border: '12px solid #F7F2EA', background: '#111', zIndex: 26, transform: `scale(${s}) rotate(${(1 - easeOut(q)) * -8}deg)`, boxShadow: '0 40px 90px rgba(20,10,10,0.55)', opacity: Math.min(1, dt / 0.08)}}>
                    <div style={{width: '100%', height: '100%', backgroundImage: `url(${img('saturn.jpg')})`, backgroundSize: 'cover', backgroundPosition: '50% 30%', transform: `scale(${1 + dt * 0.03})`}} />
                  </div>
                  <div style={{position: 'absolute', left: 100, top: 1530, width: 520, zIndex: 27, opacity: k(11.6, 11.9), transform: `translateY(${(1 - k(11.6, 11.9, easeOut)) * 30}px)`}}>
                    <div style={{display: 'inline-block', padding: '14px 30px', borderRadius: 34, background: '#2B2433', color: '#fff', fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 40, lineHeight: 1.08, boxShadow: '0 14px 30px rgba(20,10,20,0.4)'}}>Сатурн, пожирающий своего сына</div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* E. названия дали другие (за лапой) */}
        {t >= 13.4 && t < 17.2 && (
          <div style={{position: 'absolute', inset: 0, clipPath: sceneE.clip, zIndex: 19}}>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 470, textAlign: 'center', lineHeight: 1.06}}>
              <div><Kin txt="Названия дал" at={13.8} t={t} size={92} weight={500} /></div>
              <div style={{position: 'relative', display: 'inline-block'}}>
                <Kin txt="не Гойя" at={14.9} t={t} size={150} italic color={ROSE} />
                <div style={{position: 'absolute', left: 0, top: '56%', height: 8, borderRadius: 4, background: INK, width: `${k(15.4, 15.8, easeOut) * 100}%`}} />
              </div>
              <div><Kin txt="а другие люди" at={15.8} t={t} size={100} weight={500} /></div>
            </div>
            {[['«Собака»', 14.6, 120, 1010, -2], ['«Ведьмин шабаш»', 15.0, 420, 1100, 2], ['«Паломничество»', 15.4, 160, 1190, -1.5]].map(([txt, at, x, y, rot], i) => (
              <Chip key={i} txt={txt} at={at} t={t} x={x} y={y} size={30} rot={rot} bg={i === 1 ? 'rgba(244,176,196,0.95)' : 'rgba(255,255,255,0.95)'} />
            ))}
            <div style={{position: 'absolute', left: 70, top: 1290, fontFamily: SANS, fontWeight: 600, fontSize: 26, color: SOFT, opacity: k(15.8, 16.3)}}>названия появились уже после смерти художника</div>
          </div>
        )}

        {/* F. сняли со стен и перенесли на холст */}
        {t >= 16.8 && t < 20.4 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 20, opacity: Math.min(1, k(16.8, 17.2)) * (1 - k(20.1, 20.5))}}>
            <Plaster x={50} y={520} w={440} h={600} at={16.9} t={t} />
            <div style={{position: 'absolute', left: 60, width: 420, top: 550, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 5, color: '#fff', zIndex: 15}}>СТЕНА</div>
            <div style={{position: 'absolute', left: 590, top: 520, width: 440, height: 600, borderRadius: 14, border: '14px solid #C9A56B', background: '#F2E8D6', boxShadow: '0 30px 60px rgba(80,50,20,0.3)', zIndex: 12, opacity: k(17.4, 17.9)}}>
              <div style={{position: 'absolute', left: 0, right: 0, top: 10, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 5, color: GOLD}}>ХОЛСТ</div>
            </div>
            <div style={{position: 'absolute', left: lerp(80, 620, easeIO(moveCanvas)), top: 560 - Math.sin(moveCanvas * Math.PI) * 80, width: 380, height: 520, borderRadius: 12, overflow: 'hidden', zIndex: 22, boxShadow: `0 ${20 + Math.sin(moveCanvas * Math.PI) * 40}px 60px rgba(60,40,30,0.4)`, transform: `rotate(${Math.sin(moveCanvas * Math.PI) * -6}deg) scale(${1 + Math.sin(moveCanvas * Math.PI) * 0.06})`}}>
              <Paint src="dog.jpg" t={t} at={16.9} pos="40% 70%" zoomFrom={1} zoomTo={1.1} dur={3} />
            </div>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 1150, textAlign: 'center', zIndex: 25}}>
              <Kin txt="через полвека" at={17.0} t={t} size={80} italic color={ROSE} />
            </div>
            <Chip txt="сняли со стен" at={18.3} t={t} x={560} y={1290} size={30} />
            <Chip txt="перенесли на холст" at={19.4} t={t} x={470} y={1380} size={30} bg="rgba(244,176,196,0.95)" />
          </div>
        )}

        {/* G. Прадо: собака посередине, за ней музей */}
        {t >= 20.1 && t < 22.0 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 21, opacity: Math.min(1, k(20.1, 20.5)) * (1 - k(21.6, 22.0))}}>
            <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, overflow: 'hidden'}}>
              <div style={{width: '100%', height: '100%', backgroundImage: `url(${img('prado.jpg')})`, backgroundSize: 'cover', backgroundPosition: '50% 40%', transform: `scale(${1.05 + (t - 20.1) * 0.05})`, filter: 'saturate(1.1)'}} />
              <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(252,245,242,0.88) 0%, rgba(252,245,242,0.2) 25%, rgba(30,20,40,0.05) 60%, rgba(30,20,40,0.35) 100%)'}} />
            </div>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 420, textAlign: 'center'}}>
              <Kin txt="Музей Прадо" at={20.25} t={t} size={140} italic color="#fff" style={{textShadow: '0 10px 40px rgba(30,20,40,0.65)'}} />
            </div>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 620, textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 38, letterSpacing: 8, color: '#fff', textShadow: '0 6px 24px rgba(30,20,40,0.6)', opacity: k(20.6, 21.0)}}>МАДРИД</div>
          </div>
        )}
      </div>

      {/* H. финал */}
      {t >= 21.5 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 50, opacity: endIn}}>
          <div style={{position: 'absolute', left: 0, width: 1080, top: 345, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 100, color: INK, lineHeight: 1.05}}>Кошмары или<br />гениальность?</div>
          {[['Кошмары', 640, 0], ['Гениальность', 780, 1]].map(([txt, top, i]) => {
            const pr = spring({frame: f - Math.round((22.4 + i * 0.15) * fps), fps, config: {damping: 14, stiffness: 160}});
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

      {t >= 3.2 && <Dog t={t} f={f} />}
      <div style={{position: 'absolute', left: 60, top: 1622, padding: '12px 26px', borderRadius: 30, background: 'rgba(255,255,255,0.94)', boxShadow: '0 10px 26px rgba(80,50,90,0.18)', fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: INK, zIndex: 95}}>{script.diagram.title}</div>
      <Captions />
    </AbsoluteFill>
  );
};
