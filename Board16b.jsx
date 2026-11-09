import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing, staticFile, delayRender, continueRender, Img} from 'remotion';
import {script, words} from './current';

// Видео 16 «Менины»: светлый чистый стиль (ровные скруглённые карточки, тонкая антиква Cormorant + Manrope),
// собака Шиба вырезана и «говорит» (рот переключается по громкости озвучки), камера ездит по картине.
const SERIF = 'Cormorant, serif';
const SANS = 'Manrope, sans-serif';
const INK = '#2B2433', ROSE = '#C4607E', GOLD = '#B8924A', SOFT = '#7C7488';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeIO = Easing.bezier(0.65, 0, 0.35, 1);
const img = (n) => staticFile('n16b/img/' + n);
const W = (i) => words[i].start;

const useFonts = () => {
  const [h] = React.useState(() => delayRender('fonts16'));
  React.useEffect(() => {
    const fs = [
      new FontFace('Cormorant', `url(${staticFile('fonts/Cormorant-VF.ttf')})`, {weight: '300 700', style: 'normal'}),
      new FontFace('Cormorant', `url(${staticFile('fonts/Cormorant-Italic-VF.ttf')})`, {weight: '300 700', style: 'italic'}),
      new FontFace('Manrope', `url(${staticFile('fonts/Manrope-VF.ttf')})`, {weight: '200 800'}),
    ];
    Promise.all(fs.map((x) => x.load())).then((l) => { l.forEach((x) => document.fonts.add(x)); continueRender(h); });
  }, [h]);
};

const lerpKeys = (t, K, key) => {
  // K: [{t, v}] — плавный переход к ключу за 0.55 с до его времени
  let val = K[0][key];
  for (let i = 1; i < K.length; i++) {
    const d = K[i].d || 0.55;
    const a = K[i].t - d;
    if (t >= K[i].t) { val = K[i][key]; continue; }
    if (t > a) { const p = easeIO((t - a) / d); val = K[i - 1][key] + (K[i][key] - K[i - 1][key]) * p; }
    break;
  }
  return val;
};

// ------------------------------------------------------------------ собака
// расписание поз (время начала, конца, поза); talk = рот по громкости озвучки
const POSES = [
  [0.0, 0.5, 'turn'], [0.5, 1.5, 'talk'], [1.5, 2.3, 'swipe'],
  [2.3, 3.5, 'wave'], [3.5, 4.3, 'laugh'], [4.3, 8.7, 'talk'], [8.7, 9.3, 'jump'], [9.3, 10.7, 'talk'], [10.7, 11.7, 'open'], [11.7, 13.3, 'talk'],
  [13.3, 14.0, 'open'], [14.0, 15.5, 'talk'], [15.5, 16.6, 'laugh'],
  [16.6, 17.7, 'wash'], [17.7, 18.1, 'talk'], [18.1, 18.8, 'jump'], [18.8, 19.4, 'talk'],
  [19.4, 20.0, 'wave'], [20.0, 21.9, 'talk'], [21.9, 30, 'laugh'],
];
// куда смотрит (−1 влево на картину, +1 вправо к зрителю) для «боковых» сцен
const LOOK = [[0, 1], [4.3, -1], [8.0, 1], [9.3, -1], [12.6, 1]];
const poseAt = (t) => { let p = 'talk'; POSES.forEach(([a, b, n]) => { if (t >= a && t < b) p = n; }); return p; };
const lookAt = (t) => { let l = 1; LOOK.forEach(([a, v]) => { if (t >= a) l = v; }); return l; };

const Dog = ({f, fps, x, y, s, hopAmt = 0, forceFront = false}) => {
  const t = f / fps;
  const m = script.mouth[Math.min(script.mouth.length - 1, Math.max(0, f))] || 0;
  const mo = script.mouth[Math.min(script.mouth.length - 1, Math.max(0, f - 1))] || 0;
  const open = (m > 0.34) || (m > 0.2 && mo > 0.34);
  let pose = poseAt(t);
  const src = pose === 'talk' ? (open ? 'p_open.png' : 'p_closed.png') : `p_${pose === 'turn' ? 'closed' : pose}.png`;
  // поворот: плавный «разворот» по X при смене взгляда
  const look = forceFront ? 1 : lookAt(t);
  let lookPrev = forceFront ? 1 : lookAt(t - 0.22);
  let sx = look;
  if (look !== lookPrev) { const q = (t - ([...LOOK].reverse().find(([a]) => t >= a)[0])) / 0.22; sx = look * Math.min(1, Math.max(0.12, Math.abs(Math.cos((1 - Math.min(1, q)) * Math.PI / 2)))) ; }
  const bob = Math.sin(f / 6) * 6 + (open ? 7 : 0);
  const jump = pose === 'jump' ? Math.abs(Math.sin(((t - (POSES.find((p) => p[2] === 'jump' && t >= p[0] && t < p[1]) || [0])[0]) / 0.6) * Math.PI)) * 120 : 0;
  const sway = Math.sin(f / 17) * 1.6;
  const squash = pose === 'jump' ? 1 + (jump > 60 ? 0.05 : -0.05) : 1 + Math.sin(f / 5) * 0.012;
  const W2 = 575 * s, H2 = 890 * s;
  return (
    <div style={{position: 'absolute', left: x - W2 / 2, top: y - H2 - bob - jump - hopAmt, width: W2, height: H2, transformOrigin: '50% 100%', transform: `scaleX(${sx}) rotate(${sway}deg) scaleY(${squash})`, filter: 'drop-shadow(0 28px 30px rgba(70,40,60,0.28))', zIndex: 30}}>
      <Img src={img(src)} style={{width: '100%', height: '100%'}} />
    </div>
  );
};

const Crown = ({f, fps, at, x, y, s}) => {
  // x,y: центр основания короны на голове (экранные координаты)
  const t = (f - at) / fps;
  if (t < 0) return null;
  const fall = Math.min(1, t / 0.4);
  const yy = y - (1 - fall * fall) * 1000;
  const bounce = t > 0.4 ? -Math.abs(Math.sin((t - 0.4) * 10)) * 30 * Math.exp(-(t - 0.4) * 5) : 0;
  const tilt = (1 - fall) * -35 + (t > 0.9 ? Math.sin(t * 5) * 1.5 : 0);
  const w = 300 * s, h = w * 892 / 804;
  return <Img src={img('crown.png')} style={{position: 'absolute', left: x - w / 2, top: yy + bounce - h * 0.92, width: w, height: h, zIndex: 40, transform: `rotate(${tilt}deg)`, filter: 'drop-shadow(0 14px 16px rgba(60,40,10,0.4))'}} />;
};

// ------------------------------------------------------------------ субтитры
const Captions = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const now = f / fps;
  let chunk = null;
  let ci = 0;
  script.captions.forEach((c, k) => { if (now >= W(c[0][1]) - 0.04) { chunk = c; ci = k; } });
  if (!chunk) return null;
  const a = Math.min(1, (now - (W(chunk[0][1]) - 0.04)) / 0.22);
  return (
    <div style={{position: 'absolute', left: 70, top: 172, width: 940, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontSize: 60, lineHeight: 1.12, color: INK, zIndex: 90, opacity: a, transform: `translateY(${(1 - a) * 18}px)`, letterSpacing: 0.5}}>
      {chunk.map(([txt, s0], i) => {
        const on = now >= W(s0);
        const cur = on && (i === chunk.length - 1 || now < W(chunk[i + 1][1]));
        return <span key={i} style={{opacity: on ? 1 : 0.26, color: cur ? ROSE : INK, fontStyle: cur ? 'italic' : 'normal', transition: 'none'}}>{txt}{' '}</span>;
      })}
    </div>
  );
};

// ------------------------------------------------------------------ картина с камерой
const PW = 800, PH = Math.round(800 * 2210 / 1920);
const FOCUS = [
  {t: 0, fx: 0.5, fy: 0.5, z: 1.0},
  {t: 5.3, fx: 0.49, fy: 0.76, z: 2.5, d: 0.6},
  {t: 6.0, fx: 0.68, fy: 0.68, z: 2.5, d: 0.5},
  {t: 6.6, fx: 0.85, fy: 0.72, z: 2.7, d: 0.5},
  {t: 7.3, fx: 0.25, fy: 0.58, z: 2.5, d: 0.6},
  {t: 8.6, fx: 0.08, fy: 0.45, z: 2.0, d: 0.5},
  {t: 9.3, fx: 0.42, fy: 0.56, z: 4.6, d: 0.7},
  {t: 13.0, fx: 0.5, fy: 0.5, z: 1.0, d: 0.7},
];
const LABELS = [
  [5.1, 'Инфанта Маргарита'], [5.95, 'Фрейлины'], [6.45, 'Карлики'], [7.15, 'Сам Веласкес'], [8.5, 'Огромный холст'], [9.35, 'Зеркало на стене'], [10.8, 'Король Филипп IV'], [12.2, 'Королева Мариана'],
];

const Painting = ({f, fps, enter}) => {
  const t = f / fps;
  const z = lerpKeys(t, FOCUS, 'z'), fx = lerpKeys(t, FOCUS, 'fx'), fy = lerpKeys(t, FOCUS, 'fy');
  const iw = PW * z, ih = PH * z;
  let lab = null;
  LABELS.forEach(([lt, txt]) => { if (t >= lt) lab = [lt, txt]; });
  const la = lab ? Math.min(1, (t - lab[0]) / 0.25) : 0;
  const glow = interpolate(t, [9.6, 10.2, 12.8, 13.3], [0, 1, 1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: 140, top: 335, width: PW, height: PH, borderRadius: 30, overflow: 'hidden', boxShadow: '0 40px 80px rgba(80,50,90,0.28), 0 8px 20px rgba(80,50,90,0.15)', background: '#222',
      transform: `scale(${enter.s})`, transformOrigin: enter.origin, opacity: enter.o, clipPath: enter.clip, zIndex: 20}}>
      <Img src={img('meninas.jpg')} style={{position: 'absolute', left: PW / 2 - fx * iw, top: PH / 2 - fy * ih, width: iw, height: ih, maxWidth: 'none'}} />
      <div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.35)', borderRadius: 30}} />
      {glow > 0 && <div style={{position: 'absolute', left: '50%', top: '50%', width: 380, height: 380, marginLeft: -190, marginTop: -190, borderRadius: '50%', boxShadow: `0 0 ${60 * glow}px ${20 * glow}px rgba(255,235,170,${0.55 * glow})`, opacity: 0.8}} />}
      {lab && (
        <div style={{position: 'absolute', left: 24, bottom: 24, padding: '14px 28px', borderRadius: 40, background: 'rgba(255,255,255,0.92)', color: INK, fontFamily: SANS, fontWeight: 600, fontSize: 32, letterSpacing: 0.4, opacity: la, transform: `translateY(${(1 - la) * 16}px)`, boxShadow: '0 10px 24px rgba(0,0,0,0.25)'}}>
          <span style={{color: ROSE, marginRight: 10}}>●</span>{lab[1]}
        </div>
      )}
    </div>
  );
};

// карточка «Дело»
const CaseCard = ({f, fps, at}) => {
  const t = (f - at) / fps;
  if (t < 0) return null;
  const e = easeOut(Math.min(1, t / 0.55));
  const ln = (i, txt, style) => {
    const a = Math.min(1, Math.max(0, (t - 0.25 - i * 0.18) / 0.3));
    return <div style={{opacity: a, transform: `translateY(${(1 - a) * 14}px)`, ...style}}>{txt}</div>;
  };
  return (
    <div style={{position: 'absolute', left: 80, top: 1255, width: 570, height: 330, borderRadius: 36, background: 'rgba(255,255,255,0.88)', boxShadow: '0 30px 70px rgba(80,50,90,0.2), 0 6px 16px rgba(80,50,90,0.1)', padding: '36px 44px', transform: `translateY(${(1 - e) * 120}px)`, opacity: e, zIndex: 25}}>
      {ln(0, 'ДЕЛО № 16', {fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 8, color: ROSE})}
      {ln(1, 'Менины', {fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 104, lineHeight: 1.0, color: INK, marginTop: 8})}
      {ln(2, 'Диего Веласкес · 1656', {fontFamily: SANS, fontWeight: 500, fontSize: 34, color: INK, marginTop: 14})}
      {ln(3, 'Музей Прадо, Мадрид', {fontFamily: SANS, fontWeight: 400, fontSize: 28, color: SOFT, marginTop: 8})}
    </div>
  );
};

// лента с кубистическими иллюстрациями
const Ribbon = ({f, fps, y, dir, at, tile = 300, gap = 26}) => {
  const t = (f - at) / fps;
  if (t < 0) return null;
  const e = Math.min(1, t / 0.5);
  const n = 8;
  const total = (tile + gap) * 4;
  const off = (t * 150 * dir) % total;
  return (
    <div style={{position: 'absolute', left: 0, top: y, width: 1080, height: tile, overflow: 'hidden', opacity: e, zIndex: 18}}>
      <div style={{position: 'absolute', left: dir > 0 ? -total + off : -off, top: 0, display: 'flex', gap}}>
        {Array.from({length: n * 2}).map((_, i) => <Img key={i} src={img(`cub_${(i + (dir > 0 ? 0 : 2)) % 4}.jpg`)} style={{width: tile, height: tile, borderRadius: 26, objectFit: 'cover', boxShadow: '0 14px 30px rgba(80,50,90,0.25)'}} />)}
      </div>
    </div>
  );
};

export const Board16bMain = () => {
  useFonts();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const k = (a, b, ease = easeIO) => interpolate(t, [a, b], [0, 1], {...clamp, easing: ease});

  // --- траектория собаки (x, y — низ по центру, s — масштаб)
  const SIDE = {x: 880, y: 1795, s: 0.95};
  const lerp = (a, b, q) => a + (b - a) * q;
  const traj = (tt) => {
    if (tt < 1.5) return {x: 540, y: 1790 + Math.max(0, 1 - easeOut(tt / 0.5)) * 420, s: 1.62};
    if (tt < 2.3) { const q = easeIO((tt - 1.5) / 0.8); return {x: lerp(1500, -480, q), y: 1760, s: 2.6}; }
    if (tt < 3.0) { const q = easeOut((tt - 2.3) / 0.7); return {x: lerp(1250, SIDE.x, q), y: lerp(1895, SIDE.y, q), s: SIDE.s}; }
    if (tt < 12.7) return SIDE;
    if (tt < 13.5) { const q = easeIO((tt - 12.7) / 0.8); return {x: lerp(SIDE.x, 540, q), y: lerp(SIDE.y, 1790, q), s: lerp(SIDE.s, 1.6, q)}; }
    if (tt < 16.4) return {x: 540, y: 1790, s: 1.6};
    if (tt < 17.1) { const q = easeIO((tt - 16.4) / 0.7); return {x: lerp(540, SIDE.x, q), y: lerp(1790, SIDE.y, q), s: lerp(1.6, SIDE.s, q)}; }
    if (tt < 19.0) return SIDE;
    if (tt < 19.8) { const q = easeIO((tt - 19.0) / 0.8); return {x: lerp(SIDE.x, 540, q), y: lerp(SIDE.y, 1790, q), s: lerp(SIDE.s, 1.15, q)}; }
    return {x: 540, y: 1790, s: 1.15};
  };
  const d = traj(t), dp = traj(t - 1 / fps);
  const speed = Math.hypot(d.x - dp.x, d.y - dp.y) * fps;
  const hopAmt = Math.min(1, speed / 900) * Math.abs(Math.sin(f * 0.55)) * 70;
  const front = (t >= 13.3 && t < 16.5) || t < 2.3 || t >= 19.0;

  // --- картина: открывается за смахивающей лапой (1.5–2.3)
  const boundX = t >= 1.5 && t < 2.3 ? traj(t).x - 650 : (t < 1.5 ? 3000 : -3000);
  const clipL = Math.max(0, Math.min(PW, boundX - 140)) / PW * 100;
  const pOut = k(12.9, 13.6);
  const enter = {s: 1 - 0.08 * pOut, origin: '50% 50%', o: (t < 1.6 ? 0 : 1) * (1 - pOut), clip: `inset(0 0 0 ${clipL}%)`};

  // --- корона: центр основания короны на голове (анфас)
  const hx = d.x - (575 * d.s) / 2 + 312 * d.s;
  const hy = d.y - 890 * d.s + 196 * d.s;

  const pic = Math.round(58 * interpolate(t, [17.1, 18.6], [0, 1], {...clamp, easing: easeOut}));
  const picIn = k(16.4, 17.1, easeOut);
  const picOut = k(18.9, 19.4);
  const endIn = k(19.4, 20.0, easeOut);
  const tapAt = 21.1, tap2At = 21.7;
  const cur = t < tapAt ? 0 : t < tap2At ? 1 : 2;
  const curX = interpolate(t, [20.2, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [880, 560, 560, 600], clamp);
  const curY = interpolate(t, [20.2, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [1500, 540, 550, 690], clamp);

  const kinetic = (txt, at, size, color, italic = false, weight = 600, ls = 0) => {
    const q = Math.min(1, Math.max(0, (t - at) / 0.5));
    return <span style={{display: 'inline-block', opacity: q, transform: `translateY(${(1 - easeOut(q)) * 40}px)`, filter: `blur(${(1 - q) * 8}px)`, fontFamily: SERIF, fontWeight: weight, fontStyle: italic ? 'italic' : 'normal', fontSize: size, color, letterSpacing: ls}}>{txt}</span>;
  };

  return (
    <AbsoluteFill style={{background: 'linear-gradient(172deg, #FCF5F2 0%, #F3EAF6 55%, #E8EEF9 100%)'}}>
      {['p_closed.png', 'p_open.png', 'p_wave.png', 'p_laugh.png', 'p_wash.png', 'p_jump.png', 'p_swipe.png', 'crown.png', 'meninas.jpg', 'cub_0.jpg', 'cub_1.jpg', 'cub_2.jpg', 'cub_3.jpg'].map((n) => <Img key={n} src={img(n)} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />)}
      <div style={{position: 'absolute', left: -150 + Math.sin(t / 2.2) * 40, top: 420, width: 620, height: 620, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,176,196,0.5), rgba(244,176,196,0))', zIndex: 1}} />
      <div style={{position: 'absolute', left: 560 + Math.cos(t / 2.7) * 50, top: 1060, width: 640, height: 640, borderRadius: '50%', background: 'radial-gradient(circle, rgba(170,190,250,0.5), rgba(170,190,250,0))', zIndex: 1}} />
      <div style={{position: 'absolute', left: 300, top: 0, width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,226,190,0.45), rgba(255,226,190,0))', zIndex: 1}} />

      {t >= 1.5 && <Painting f={f} fps={fps} enter={enter} />}
      {t >= 4.0 && t < 13.7 && <div style={{opacity: 1 - pOut}}><CaseCard f={f} fps={fps} at={Math.round(4.0 * fps)} /></div>}

      {t >= 16.4 && t < 19.5 && (
        <div style={{opacity: picIn * (1 - picOut)}}>
          <Ribbon f={f} fps={fps} y={410} dir={1} at={Math.round(16.4 * fps)} />
          <Ribbon f={f} fps={fps} y={720} dir={-1} at={Math.round(16.6 * fps)} />
          <div style={{position: 'absolute', left: 0, width: 700, top: 1000, textAlign: 'center', zIndex: 22}}>
            <div style={{fontFamily: SERIF, fontWeight: 300, fontSize: 260, lineHeight: 1, color: INK}}>{pic}</div>
          </div>
          <div style={{position: 'absolute', left: 0, width: 700, top: 1290, textAlign: 'center', zIndex: 22}}>
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: ROSE}}>ВАРИАЦИЙ ПИКАССО</div>
            <div style={{fontFamily: SANS, fontWeight: 400, fontSize: 20, color: SOFT, marginTop: 14, padding: '0 40px'}}>иллюстрации в духе кубизма, не работы Пикассо</div>
          </div>
        </div>
      )}

      {t >= 13.0 && t < 16.5 && (
        <div style={{position: 'absolute', left: 0, width: 1080, top: 390, textAlign: 'center', zIndex: 22, lineHeight: 1.04}}>
          <div>{kinetic('ты стоишь там,', 13.1, 96, INK, false, 500)}</div>
          <div>{kinetic('где должен', 14.4, 96, INK, false, 500)}</div>
          <div>{kinetic('стоять король', 14.9, 130, ROSE, true, 600)}</div>
        </div>
      )}

      <Dog f={f} fps={fps} x={d.x} y={d.y} s={d.s} hopAmt={hopAmt} forceFront={front} />
      {t >= 15.35 && t < 16.5 && <Crown f={f} fps={fps} at={Math.round(15.35 * fps)} x={hx} y={hy} s={d.s * 0.78} />}

      {t >= 19.4 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 50, opacity: endIn}}>
          <div style={{position: 'absolute', left: 0, width: 1080, top: 345, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 112, color: INK}}>Кто здесь главный?</div>
          {[['Инфанта', 500, 0], ['Художник', 640, 1]].map(([txt, top, i]) => {
            const pr = spring({frame: f - Math.round((19.9 + i * 0.15) * fps), fps, config: {damping: 14, stiffness: 160}});
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
      <div style={{position: 'absolute', left: 60, top: 1622, padding: '12px 26px', borderRadius: 30, background: 'rgba(255,255,255,0.94)', boxShadow: '0 10px 26px rgba(80,50,90,0.18)', fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: INK, zIndex: 85}}>{script.diagram.title}</div>
      <Captions />
    </AbsoluteFill>
  );
};
