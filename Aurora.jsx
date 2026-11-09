import React from 'react';
import {
  AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate,
  Easing, staticFile, delayRender, continueRender, Img,
} from 'remotion';
import {script, words} from './current';
import {HeroC, SentenceC, MontageC, CompareC, Excl, Tape, WordTiles} from './AuroraCollage';
import {Hero9, Court9, Versus9, Press9, Truth9, Power9, Academy9, Question9} from './Extra9';

// Стиль «аврора» (неделя 2): живые градиенты ультрамарин -> золото, стеклянные плашки, карта-маршрут вместо шкалы.
const A = {ultra: '#2B3FA0', lt: '#5A72E8', deep: '#141C55', cream: '#F5EFE6', gold: '#D4A64A', ink: '#1E1E1E'};
const TITLE = '"Playfair Display", serif';
const BODY = 'Manrope, sans-serif';
const MOODS = {
  blue: ['#101850', '#2B3FA0', '#5A72E8'],
  deep: ['#080C2E', '#17236B', '#2B3FA0'],
  gold: ['#3B2A0A', '#8E6420', '#D4A64A'],
  dawn: ['#1B2A78', '#6A5FA8', '#D4A64A'],
};

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

const t0 = (i) => words[i].start;
const sec = (s, fps) => Math.round(s * fps);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const rnd = (n) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
const rel = (idx, scene, fps) => sec(t0(idx), fps) - sec(t0(scene.from), fps);
const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mix = (a, b, t) => { const x = hex(a), y = hex(b); return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join(''); };

const useScene = (dur) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inP = spring({frame: f, fps, config: {damping: 16, stiffness: 130}});
  const out = interpolate(f, [dur - 6, dur], [0, 1], clamp);
  return {f, fps, inP, out};
};

// --- фон: живой градиент, цвет настроения меняется от сцены к сцене --------------------------------
const Background = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sc = script.scenes;
  let idx = 0;
  sc.forEach((s, i) => { if (f >= sec(t0(s.from), fps)) idx = i; });
  const start = sec(t0(sc[idx].from), fps);
  const k = interpolate(f - start, [0, 20], [0, 1], clamp);
  const cur = MOODS[sc[idx].mood || 'blue'], prev = MOODS[sc[Math.max(0, idx - 1)].mood || 'blue'];
  const c = cur.map((col, i) => mix(prev[i], col, k));
  const a = f / 90;
  return (
    <AbsoluteFill style={{background: `linear-gradient(${160 + Math.sin(a) * 12}deg, ${c[0]} 0%, ${c[1]} 55%, ${c[2]} 130%)`}}>
      {idx <= 1 && <Img src={staticFile(script.bg || 'n8/img/bg_grain.jpg')} style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: idx === 0 ? 1 : 1 - k}} />}
      <div style={{position: 'absolute', left: -300 + Math.sin(a * 1.3) * 160, top: 200 + Math.cos(a) * 140, width: 1100, height: 1100, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,166,74,0.42), rgba(212,166,74,0) 65%)'}} />
      <div style={{position: 'absolute', right: -350 + Math.cos(a * 0.9) * 160, top: 900 + Math.sin(a * 1.1) * 160, width: 1200, height: 1200, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(90,114,232,0.55), rgba(90,114,232,0) 65%)'}} />
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, opacity: 0.09, mixBlendMode: 'overlay'}}>
        <filter id="gn"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={f % 6} /></filter>
        <rect width="1080" height="1920" filter="url(#gn)" />
      </svg>
    </AbsoluteFill>
  );
};

const TitleOnly = () => {
  const f = useCurrentFrame();
  return <div style={{position: 'absolute', left: 60, top: 1600, fontFamily: BODY, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: 'rgba(255,255,255,0.7)', opacity: interpolate(f, [0, 14], [0, 1], clamp)}}>{script.diagram.title}</div>;
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
    <div style={{position: 'absolute', left: 80, top: 170, width: 920, textAlign: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 68, lineHeight: 1.16,
      opacity: a, filter: `blur(${(1 - a) * 8}px)`, transform: `translateY(${(1 - a) * 12}px)`, textWrap: 'balance', textShadow: '0 4px 20px rgba(8,12,46,0.55)'}}>
      {chunk.map(([txt, s0], i) => <span key={i} style={{color: now >= words[s0].start ? '#fff' : 'rgba(255,255,255,0.34)'}}>{txt}{' '}</span>)}
    </div>
  );
};

// --- стекло ------------------------------------------------------------------
const Glass = ({style, children}) => (
  <div style={{background: 'linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.08))', border: '2px solid rgba(255,255,255,0.4)',
    backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)', boxShadow: '0 30px 70px rgba(8,12,46,0.45), inset 0 1px 0 rgba(255,255,255,0.5)', ...style}}>{children}</div>
);

const GTEXT = (a = '#FFF3C4', b = '#D4A64A') => ({background: `linear-gradient(180deg, ${a}, ${b})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent'});

const Seal = ({text, angle = -7, f, at, fps, pos, size = 60}) => {
  const p = spring({frame: f - at, fps, config: {damping: 8, stiffness: 220}});
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', ...pos, zIndex: 30, transform: `rotate(${angle}deg) scale(${interpolate(p, [0, 1], [2.4, 1])})`, opacity: Math.min(1, p * 1.6),
      padding: '10px 28px', borderRadius: 16, border: `7px solid ${A.gold}`, background: 'rgba(20,28,85,0.96)', fontFamily: TITLE, fontWeight: 900, fontSize: size, letterSpacing: 2,
      whiteSpace: 'nowrap', ...GTEXT()}}>{text}</div>
  );
};

const Pill = ({text, style}) => (
  <Glass style={{display: 'inline-block', padding: '14px 34px', borderRadius: 40, fontFamily: BODY, fontWeight: 800, fontSize: 36, color: '#fff', whiteSpace: 'nowrap', ...style}}>{text}</Glass>
);

// --- нижняя шкала: маршрут с кометой --------------------------------------------------------
const RouteStrip = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const nodes = script.diagram.nodes;
  const times = nodes.map((n) => sec(t0(n.at), fps));
  const X0 = 140, X1 = 940, Y = 1600;
  const xs = nodes.map((_, i) => X0 + ((X1 - X0) * i) / (nodes.length - 1));
  const done = times.filter((t) => f >= t).length;
  let head = xs[0];
  if (done > 0) {
    head = xs[done - 1];
    if (done < nodes.length) head += (xs[done] - xs[done - 1]) * 0.85 * interpolate(f, [times[done - 1], times[done]], [0, 1], clamp);
  }
  const appear = interpolate(f, [0, 14], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: appear, transform: `translateY(${(1 - appear) * 50}px)`}}>
      <div style={{position: 'absolute', left: 60, top: Y - 70, fontFamily: BODY, fontWeight: 800, fontSize: 24, letterSpacing: 5, color: 'rgba(255,255,255,0.55)'}}>{script.diagram.title}</div>
      <Glass style={{position: 'absolute', left: 60, top: Y - 36, width: 960, height: 170, borderRadius: 44}}>{null}</Glass>
      <div style={{position: 'absolute', left: X0, top: Y - 3, width: X1 - X0, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.22)'}} />
      <div style={{position: 'absolute', left: X0, top: Y - 3, width: Math.max(0, head - X0), height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${A.lt}, ${A.gold})`}} />
      {done > 0 && <div style={{position: 'absolute', left: head - 16, top: Y - 16, width: 32, height: 32, borderRadius: '50%', background: '#fff', boxShadow: `0 0 30px 12px rgba(212,166,74,0.8)`}} />}
      {nodes.map((n, i) => {
        const on = f >= times[i], last = i === nodes.length - 1;
        const pop = spring({frame: f - times[i], fps, config: {damping: 10, stiffness: 190}});
        return (
          <div key={i}>
            <div style={{position: 'absolute', left: xs[i] - 20, top: Y - 20, width: 40, height: 40, borderRadius: '50%', border: '4px solid ' + (on ? (last ? A.gold : '#fff') : 'rgba(255,255,255,0.4)'),
              background: on ? (last ? A.gold : A.ultra) : 'rgba(20,28,85,0.5)', transform: `scale(${on ? 0.85 + 0.3 * Math.min(pop, 1.2) : 1})`, boxShadow: on ? '0 0 22px rgba(255,255,255,0.5)' : 'none'}} />
            <div style={{position: 'absolute', left: xs[i] - 120, top: Y + 34, width: 240, textAlign: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 30, color: on ? '#fff' : 'rgba(255,255,255,0.4)'}}>{n.label}</div>
            <div style={{position: 'absolute', left: xs[i] - 120, top: Y + 72, width: 240, textAlign: 'center', fontFamily: BODY, fontWeight: 600, fontSize: 23, color: on ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.28)'}}>{n.sub}</div>
          </div>
        );
      })}
    </div>
  );
};

// --- вход сцены: плавное «проявление» + удары зумом ------------------------------------------------------
const Shell = ({f, fps, scene, inP, out, children, dir = 1}) => {
  let punch = 0;
  (scene.punches || []).forEach((w) => { const pf = rel(w, scene, fps); if (f >= pf) punch += 0.09 * Math.exp(-(f - pf) / 4.5); });
  const e = 1 - Math.min(inP, 1);
  return (
    <AbsoluteFill style={{opacity: Math.min(1, inP * 2.4) * (1 - out), transform: `translateY(${e * 160 * dir}px) scale(${(0.94 + 0.06 * Math.min(inP, 1)) * (1 + punch) * (1 - out * 0.04)})`,
      filter: e > 0.02 ? `blur(${e * 14}px)` : undefined, transformOrigin: '50% 45%'}}>{children}</AbsoluteFill>
  );
};

// --- 1. Хук: портрет и «ГЕНИЙ» -> «УБИЛ» --------------------------------------------------------------------------
const Hero = ({dur, scene}) => {
  const {f, fps, inP, out} = useScene(dur);
  const img = script.images[scene.image];
  const killAt = rel(scene.killAt, scene, fps), sealAt = rel(scene.sealAt, scene, fps);
  const gk = interpolate(f, [killAt - 4, killAt + 6], [0, 1], clamp);
  const tilt = Math.sin(f / 22) * 1.2;
  return (
    <Shell {...{f, fps, scene, inP, out}}>
      <div style={{position: 'absolute', left: 0, width: 1080, top: 470, textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 235, lineHeight: 1,
        opacity: (1 - gk) * 0.95, transform: `scale(${1 + gk * 0.3})`, filter: `blur(${gk * 10}px)`, WebkitTextStroke: '3px rgba(255,255,255,0.8)', color: 'transparent'}}>ГЕНИЙ</div>
      <div style={{position: 'absolute', left: 0, width: 1080, top: 420, textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 330, lineHeight: 1,
        opacity: gk, transform: `scale(${0.7 + 0.3 * gk})`, ...GTEXT()}}>УБИЛ</div>
      <Glass style={{position: 'absolute', left: 300, top: 780, width: 480, height: 640, borderRadius: 40, padding: 14, transform: `rotate(${tilt}deg)`}}>
        <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 28, overflow: 'hidden', backgroundImage: `url(${staticFile(img.file)})`, backgroundSize: 'cover',
          backgroundPosition: '50% 20%'}}>
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(43,63,160,0) 55%, rgba(20,28,85,0.75))'}} />
        </div>
      </Glass>
      <div style={{position: 'absolute', left: 300, top: 1360, width: 480, textAlign: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 32, letterSpacing: 5, color: '#fff'}}>КАРАВАДЖО</div>
      <Seal text="ПРИГОВОР" f={f} at={sealAt} fps={fps} angle={-8} size={64} pos={{left: 500, top: 1230}} />
    </Shell>
  );
};

// --- 2. 1606, Рим, скрещённые мечи -----------------------------------------------------------------------------------------
const Sword = ({rot, x, y, flip}) => (
  <svg width="140" height="760" viewBox="-70 -700 140 760" style={{position: 'absolute', left: x - 70, top: y - 700, overflow: 'visible', transformOrigin: '70px 700px', transform: `rotate(${rot}deg) scaleX(${flip})`,
    filter: 'drop-shadow(0 16px 24px rgba(8,12,46,0.5))'}}>
    <defs><linearGradient id="bl" x1="0" x2="1"><stop offset="0" stopColor="#9aa6c4" /><stop offset="0.5" stopColor="#fff" /><stop offset="1" stopColor="#8e9bbb" /></linearGradient></defs>
    <path d="M0 -690 L16 -170 L-16 -170 Z" fill="url(#bl)" />
    <rect x="-70" y="-176" width="140" height="18" rx="9" fill={A.gold} />
    <rect x="-10" y="-158" width="20" height="120" rx="8" fill="#6B3E14" />
    <circle cx="0" cy="-26" r="22" fill={A.gold} />
  </svg>
);

const Year = ({dur, scene}) => {
  const {f, fps, inP, out} = useScene(dur);
  const clashAt = rel(scene.clashAt, scene, fps), brawlAt = rel(scene.brawlAt, scene, fps);
  const yp = interpolate(f, [4, 30], [0, 1], {...clamp, easing: ease});
  const yr = Math.round(1600 + 6 * yp);
  const ap = interpolate(f, [clashAt - 14, clashAt], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const shake = f >= clashAt && f < clashAt + 8 ? Math.sin(f * 5) * 10 * (1 - (f - clashAt) / 8) : 0;
  const b = spring({frame: f - brawlAt, fps, config: {damping: 8, stiffness: 200}});
  return (
    <Shell {...{f, fps, scene, inP, out}}>
      <div style={{position: 'absolute', left: 0, width: 1080, top: 400, textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 330, lineHeight: 1, ...GTEXT()}}>{yr}</div>
      <div style={{position: 'absolute', left: 0, width: 1080, top: 720, textAlign: 'center'}}><Pill text="РИМ" style={{fontSize: 44, letterSpacing: 12, padding: '14px 52px'}} /></div>
      <div style={{position: 'absolute', left: shake, top: 0, width: 1080, height: 1920}}>
        <Sword x={430} y={1380} rot={-62 + ap * 40} flip={1} />
        <Sword x={650} y={1380} rot={62 - ap * 40} flip={-1} />
        {f >= clashAt && f < clashAt + 14 && Array.from({length: 14}).map((_, i) => {
          const a = (i / 14) * Math.PI * 2, r = (f - clashAt) * 14;
          return <div key={i} style={{position: 'absolute', left: 540 + Math.cos(a) * r - 4, top: 1000 + Math.sin(a) * r * 0.8 - 4, width: 10, height: 10 + (i % 3) * 6, borderRadius: 5, background: i % 2 ? '#fff' : A.gold,
            opacity: 1 - (f - clashAt) / 14, transform: `rotate(${a}rad)`}} />;
        })}
      </div>
      <WordTiles text="ДРАКА" x={275} y={800} f={f} at={brawlAt} fps={fps} w={96} h={122} size={86} seed={7} />
      <Excl x={110} y={760} s={0.8} rot={-12} f={f} at={brawlAt + 6} fps={fps} />
      <Excl x={850} y={740} s={0.7} rot={11} f={f} at={brawlAt + 10} fps={fps} />
    </Shell>
  );
};

// --- 3. Погибший и приговор -------------------------------------------------------------------------------------------------
const Sentence = ({dur, scene}) => {
  const {f, fps, inP, out} = useScene(dur);
  const nameAt = rel(scene.nameAt, scene, fps), scrollAt = rel(scene.scrollAt, scene, fps), sealAt = rel(scene.sealAt, scene, fps);
  const np = spring({frame: f - nameAt, fps, config: {damping: 12, stiffness: 120}});
  const sp = interpolate(f, [scrollAt, scrollAt + 18], [0, 1], {...clamp, easing: ease});
  const seal = spring({frame: f - sealAt, fps, config: {damping: 7, stiffness: 220}});
  return (
    <Shell {...{f, fps, scene, inP, out}}>
      <Glass style={{position: 'absolute', left: 90, top: 470, width: 900, height: 230, borderRadius: 40, transform: `translateX(${(1 - Math.min(np, 1)) * -900}px)`, display: 'flex', alignItems: 'center', padding: '0 50px', gap: 36}}>
        <svg width="70" height="110" viewBox="-35 -55 70 110"><rect x="-8" y="-52" width="16" height="104" rx="4" fill="#fff" /><rect x="-30" y="-24" width="60" height="16" rx="4" fill="#fff" /></svg>
        <div>
          <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: 'rgba(255,255,255,0.7)'}}>ПОГИБ В ДРАКЕ</div>
          <div style={{fontFamily: TITLE, fontWeight: 900, fontSize: 64, color: '#fff', lineHeight: 1.1, marginTop: 6}}>Ранучо Томассони</div>
        </div>
      </Glass>
      <div style={{position: 'absolute', left: 150, top: 790, width: 780, height: 560 * sp, overflow: 'hidden', borderRadius: 22,
        background: 'linear-gradient(180deg, #FBF3DE, #EAD9B0)', boxShadow: '0 40px 80px rgba(8,12,46,0.5)'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 30, letterSpacing: 8, color: '#8a6a30'}}>ПРИГОВОР</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 130, color: A.ink, lineHeight: 1}}>СМЕРТЬ</div>
        <div style={{position: 'absolute', left: 90, right: 90, top: 330, height: 4, background: 'rgba(30,30,30,0.25)'}} />
        <div style={{position: 'absolute', left: 90, right: 90, top: 370, height: 4, background: 'rgba(30,30,30,0.18)'}} />
        <div style={{position: 'absolute', left: 90, width: 400, top: 410, height: 4, background: 'rgba(30,30,30,0.18)'}} />
      </div>
      {sp > 0.2 && <div style={{position: 'absolute', left: 150, top: 790 + 560 * sp - 20, width: 780, height: 40, borderRadius: 20, background: 'linear-gradient(180deg, #fff, #CBB98C 60%, #8B7A4C)', boxShadow: '0 10px 20px rgba(0,0,0,0.35)'}} />}
      {f >= sealAt && (
        <div style={{position: 'absolute', left: 700, top: 1150, width: 190, height: 190, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #FBE6A3, #D4A64A 55%, #8a6419)',
          border: '6px solid #8a6419', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', transform: `scale(${interpolate(seal, [0, 1], [2.4, 1])}) rotate(-12deg)`, opacity: Math.min(1, seal * 1.6),
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 100, color: '#6B3E14'}}>К</div>
      )}
    </Shell>
  );
};

// --- 4. Маршрут бегства ----------------------------------------------------------------------------------------------------------
const LAND = [[7.0, 44.1], [8.7, 44.4], [9.9, 44.1], [10.3, 43.0], [11.1, 42.4], [11.9, 41.9], [12.8, 41.4], [13.8, 41.0], [14.3, 40.8], [15.0, 40.2], [15.6, 39.9], [16.1, 39.2], [16.0, 38.6],
  [15.7, 38.0], [16.1, 38.0], [16.5, 38.4], [16.6, 39.0], [17.1, 39.2], [17.1, 39.6], [16.6, 40.0], [16.9, 40.4], [17.5, 40.3], [18.3, 39.9], [18.5, 40.2], [17.9, 40.7], [17.2, 41.0], [16.2, 41.3],
  [16.0, 41.7], [15.9, 41.9], [14.9, 42.1], [14.1, 42.5], [13.6, 43.5], [12.9, 43.9], [12.4, 44.2], [12.3, 44.9], [12.5, 45.3], [7.0, 45.3]];
const SICILY = [[12.4, 37.9], [13.4, 38.2], [14.6, 38.0], [15.6, 38.3], [15.2, 37.3], [15.1, 36.7], [14.3, 36.8], [13.0, 37.5]];
const MX = 90, MY = 430, PX = 75, PY = 100;
const proj = (lon, lat) => [MX + (lon - 7) * PX, MY + (44.5 - lat) * PY];
const CITIES = {rome: [12.5, 41.9], naples: [14.27, 40.85], malta: [14.5, 35.9], syr: [15.29, 37.07]};

const Route = ({dur, scene}) => {
  const {f, fps, inP, out} = useScene(dur);
  const img = script.images;
  const legs = [['rome', 'naples', rel(scene.naplesAt, scene, fps)], ['naples', 'malta', rel(scene.maltaAt, scene, fps)], ['malta', 'syr', rel(scene.sicilyAt, scene, fps)]];
  const pts = (poly) => poly.map(([lo, la]) => proj(lo, la).join(',')).join(' ');
  const P = (k) => proj(...CITIES[k]);
  const prog = (a) => interpolate(f, [a - 10, a + 14], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const labels = {rome: 'Рим', naples: 'Неаполь', malta: 'Мальта', syr: 'Сицилия'};
  const thumbs = {naples: {img: 'mercy', x: 770, y: 650, w: 160, h: 200}, syr: {img: 'lucy', x: 790, y: 1060, w: 160, h: 190}, malta: {img: 'malta', x: 320, y: 1215, w: 220, h: 150}};
  const pinAt = {rome: 0, naples: legs[0][2] + 12, malta: legs[1][2] + 12, syr: legs[2][2] + 12};
  return (
    <Shell {...{f, fps, scene, inP, out}}>
      <Glass style={{position: 'absolute', left: 60, top: 400, width: 960, height: 960, borderRadius: 50, overflow: 'hidden', background: 'linear-gradient(160deg, rgba(10,16,70,0.7), rgba(43,63,160,0.45))'}}>{null}</Glass>
      <svg width="1080" height="1920" style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <linearGradient id="landG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F5EFE6" stopOpacity="0.9" /><stop offset="1" stopColor="#D4A64A" stopOpacity="0.75" /></linearGradient>
          <clipPath id="mapclip"><rect x="60" y="400" width="960" height="960" rx="50" /></clipPath>
        </defs>
        <g clipPath="url(#mapclip)">
          <polygon points={pts(LAND)} fill="url(#landG)" stroke="#fff" strokeWidth="3" />
          <polygon points={pts(SICILY)} fill="url(#landG)" stroke="#fff" strokeWidth="3" />
          {legs.map(([a, b, at], i) => {
            const [x1, y1] = P(a), [x2, y2] = P(b);
            const p = prog(at);
            const mx = (x1 + x2) / 2 + (i === 1 ? 70 : 0), my = (y1 + y2) / 2;
            const d = `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`;
            return <path key={i} d={d} fill="none" stroke={A.ultra} strokeWidth="9" strokeLinecap="round" strokeDasharray="1" pathLength="1" strokeDashoffset={1 - p} style={{filter: 'drop-shadow(0 0 10px rgba(43,63,160,0.9))'}} />;
          })}
        </g>
        {Object.keys(CITIES).map((k) => {
          const [x, y] = P(k);
          const p = spring({frame: f - pinAt[k], fps, config: {damping: 9, stiffness: 200}});
          if (f < pinAt[k]) return null;
          return (
            <g key={k} transform={`translate(${x} ${y}) scale(${Math.min(p, 1.15)})`}>
              <circle r="26" fill={A.ultra} stroke="#fff" strokeWidth="6" />
              <circle r="10" fill="#fff" />
              <text x={k === 'malta' ? 40 : -40} y="12" textAnchor={k === 'malta' ? 'start' : 'end'} fontFamily="Manrope" fontWeight="800" fontSize="40" fill="#101850" stroke="#fff" strokeWidth="7" paintOrder="stroke">{labels[k]}</text>
            </g>
          );
        })}
      </svg>
      {Object.keys(thumbs).map((k) => {
        const t = thumbs[k];
        const p = spring({frame: f - pinAt[k] - 6, fps, config: {damping: 10, stiffness: 160}});
        if (f < pinAt[k] + 6) return null;
        return (
          <Glass key={k} style={{position: 'absolute', left: t.x, top: t.y, width: t.w, height: t.h, borderRadius: 22, padding: 8, transform: `scale(${Math.min(p, 1.08)}) rotate(${k === 'malta' ? -4 : 4}deg)`}}>
            <div style={{width: '100%', height: '100%', borderRadius: 14, backgroundImage: `url(${staticFile(img[t.img].file)})`, backgroundSize: 'cover', backgroundPosition: 'center'}} />
          </Glass>
        );
      })}
      <div style={{position: 'absolute', left: 90, top: 420}}><Pill text="Бегство" style={{fontSize: 30, padding: '10px 26px'}} /></div>
    </Shell>
  );
};

// --- 5/7. Картина в стеклянной раме со сменой планов ---------------------------------------------------------------------
const Plate = ({dur, scene}) => {
  const {f, fps, inP, out} = useScene(dur);
  const startF = sec(t0(scene.from), fps);
  const shots = scene.shots;
  const at = (i) => sec(t0(shots[i].at), fps) - startF;
  let si = 0;
  shots.forEach((_, i) => { if (f >= at(i)) si = i; });
  const shot = shots[si];
  const img = script.images[scene.image];
  const [iw, ih] = img.size;
  const W = scene.w, H = scene.h;
  const IW = W - 24, IH = H - 24;
  const base = Math.max(IW / iw, IH / ih);
  const sf = Math.max(0, f - at(si));
  const len = Math.max(1, (shots[si + 1] ? at(si + 1) : dur) - at(si));
  const zIn = interpolate(sf, [0, 14], [0, 1], {...clamp, easing: ease});
  const prevZoom = si > 0 ? shots[si - 1].zoom || 1 : shot.zoom || 1;
  const zoom = (prevZoom + ((shot.zoom || 1) - prevZoom) * zIn) * (1 + 0.04 * (sf / len));
  const fx = shot.focus;
  const pfx = si > 0 ? shots[si - 1].focus : fx;
  const fxx = pfx[0] + (fx[0] - pfx[0]) * zIn, fyy = pfx[1] + (fx[1] - pfx[1]) * zIn;
  const sc = base * zoom;
  const cx = Math.min(0, Math.max(IW - iw * sc, IW / 2 - fxx * iw * sc));
  const cy = Math.min(0, Math.max(IH - ih * sc, IH / 2 - fyy * ih * sc));
  const left = (1080 - W) / 2;
  const ring = shot.ring;
  const rp = ring ? interpolate(sf, [10, 26], [0, 1], {...clamp, easing: ease}) : 0;
  const rlen = ring ? 2 * Math.PI * Math.sqrt((ring.rx * ring.rx + ring.ry * ring.ry) / 2) : 1;
  const dim = scene.dims;
  const dp = dim ? interpolate(f, [rel(dim.at, scene, fps), rel(dim.at, scene, fps) + 16], [0, 1], {...clamp, easing: ease}) : 0;
  const tilt = Math.sin(f / 26) * 0.6;
  return (
    <Shell {...{f, fps, scene, inP, out}}>
      <Glass style={{position: 'absolute', left, top: scene.top, width: W, height: H, borderRadius: 38, padding: 12, transform: `rotate(${tilt}deg)`}}>
        <div style={{position: 'relative', width: IW, height: IH, borderRadius: 28, overflow: 'hidden', background: '#000'}}>
          <div style={{position: 'absolute', left: cx, top: cy, width: iw * sc, height: ih * sc, backgroundImage: `url(${staticFile(img.file)})`, backgroundSize: '100% 100%'}} />
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(43,63,160,0.0) 60%, rgba(20,28,85,0.45))'}} />
          {ring && (
            <svg width={IW} height={IH} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
              <ellipse cx={IW / 2 + ring.dx} cy={IH / 2 + ring.dy} rx={ring.rx} ry={ring.ry} fill="none" stroke={A.gold} strokeWidth="9" strokeLinecap="round"
                strokeDasharray={rlen} strokeDashoffset={rlen * (1 - rp)} transform={`rotate(-10 ${IW / 2 + ring.dx} ${IH / 2 + ring.dy})`} style={{filter: 'drop-shadow(0 0 12px rgba(212,166,74,0.9))'}} />
            </svg>
          )}
          {shot.note && (() => {
            const np = spring({frame: sf - 12, fps, config: {damping: 9, stiffness: 200}});
            return sf >= 12 ? (
              <div style={{position: 'absolute', left: shot.note.pos[0], top: shot.note.pos[1], padding: '12px 28px', borderRadius: 18, background: 'rgba(20,28,85,0.85)', border: `4px solid ${A.gold}`,
                fontFamily: TITLE, fontWeight: 900, fontSize: 48, whiteSpace: 'nowrap', transform: `scale(${interpolate(np, [0, 1], [2, 1])}) rotate(${shot.note.angle || -4}deg)`, opacity: Math.min(1, np * 1.6), ...GTEXT()}}>{shot.note.text}</div>
            ) : null;
          })()}
        </div>
      </Glass>
      {scene.frame === 'gold' && (
        <>
          <div style={{position: 'absolute', left: left - 30, top: scene.top - 30, width: W + 60, height: H + 60, zIndex: 24, borderRadius: 18, boxShadow: '0 40px 80px rgba(0,0,0,0.6)', transform: `rotate(${tilt}deg)`}} />
          <div style={{position: 'absolute', left: left - 30, top: scene.top - 30, width: W + 60, height: H + 60, zIndex: 25, pointerEvents: 'none', transform: `rotate(${tilt}deg)`, borderRadius: 18,
            background: 'linear-gradient(135deg, #FFF0B8, #D4A64A 30%, #8A6419 55%, #F3D88A 80%, #B58A2E)',
            clipPath: 'polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, 42px 42px, 42px calc(100% - 42px), calc(100% - 42px) calc(100% - 42px), calc(100% - 42px) 42px, 42px 42px)'}} />
          <div style={{position: 'absolute', left: left - 12, top: scene.top - 12, width: W + 24, height: H + 24, zIndex: 26, pointerEvents: 'none', transform: `rotate(${tilt}deg)`, border: '4px solid rgba(255,244,190,0.85)', borderRadius: 6}} />
          {[[-30, -30], [W + 30, -30], [-30, H + 30], [W + 30, H + 30]].map(([dx, dy], i) => (
            <div key={i} style={{position: 'absolute', left: left + dx - 30, top: scene.top + dy - 30, width: 60, height: 60, zIndex: 27, borderRadius: '50%', transform: `rotate(${tilt}deg)`,
              background: 'radial-gradient(circle at 35% 30%, #FFF6D0, #D4A64A 55%, #7a5414)', border: '4px solid #8A6419', boxShadow: '0 6px 12px rgba(0,0,0,0.4)'}} />
          ))}
        </>
      )}
      {dim && (
        <>
          <div style={{position: 'absolute', left, top: scene.top + H + 30, width: W * dp, height: 6, borderRadius: 3, background: A.gold, boxShadow: '0 0 14px rgba(212,166,74,0.9)'}} />
          <div style={{position: 'absolute', left: left + W + 26, top: scene.top, width: 6, height: H * dp, borderRadius: 3, background: A.gold, boxShadow: '0 0 14px rgba(212,166,74,0.9)'}} />
          <div style={{position: 'absolute', left: left + W / 2 - 110, top: scene.top + H + 50, opacity: dp}}><Pill text={dim.w} style={{fontSize: 34, padding: '8px 26px'}} /></div>
          <div style={{position: 'absolute', left: left + W - 60, top: scene.top + H / 2 - 30, opacity: dp, transform: 'translateX(40px)'}}><Pill text={dim.h} style={{fontSize: 34, padding: '8px 26px'}} /></div>
        </>
      )}
      {scene.badge && <Tape text={scene.badge} x={left - 6} y={scene.top - 70} rot={-3} f={f} at={4} fps={fps} size={32} />}
      {scene.chip && <Tape text={scene.chip} x={Math.max(20, (1080 - (scene.chip.length * 21 + 70)) / 2)} y={scene.top + H + (dim ? 130 : 44)} rot={1.5} f={f} at={10} fps={fps} size={30} />}
    </Shell>
  );
};

// --- 6. Монтаж шедевров ----------------------------------------------------------------------------------------------------------------
const Montage = ({dur, scene}) => {
  const {f, fps, inP, out} = useScene(dur);
  const tiles = scene.tiles;
  const textAt = rel(scene.textAt, scene, fps);
  const tp = spring({frame: f - textAt, fps, config: {damping: 9, stiffness: 190}});
  return (
    <Shell {...{f, fps, scene, inP, out}}>
      {tiles.map((t, i) => {
        const a = rel(t.at, scene, fps);
        const p = spring({frame: f - a, fps, config: {damping: 12, stiffness: 110}});
        const im = script.images[t.image];
        const x = 50 + i * 345;
        return (
          <Glass key={i} style={{position: 'absolute', left: x, top: 560 + (i % 2) * 70, width: 310, height: 640, borderRadius: 34, padding: 10,
            transform: `translateY(${(1 - Math.min(p, 1)) * 900}px) rotate(${(i - 1) * 3 + (1 - Math.min(p, 1)) * 12}deg) scale(${1 + Math.sin(f / 24 + i) * 0.01})`}}>
            <div style={{width: '100%', height: '100%', borderRadius: 24, backgroundImage: `url(${staticFile(im.file)})`, backgroundSize: 'cover', backgroundPosition: t.pos || 'center'}} />
          </Glass>
        );
      })}
      {f >= textAt && <div style={{position: 'absolute', left: 0, width: 1080, top: 1180, textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 150, transform: `scale(${Math.min(tp, 1.1)})`,
        opacity: Math.min(1, tp * 2), ...GTEXT(), filter: 'drop-shadow(0 12px 30px rgba(8,12,46,0.6))'}}>ШЕДЕВРЫ</div>}
    </Shell>
  );
};

// --- 8. Сравнение лиц ----------------------------------------------------------------------------------------------------------------------
const Compare = ({dur, scene}) => {
  const {f, fps, inP, out} = useScene(dur);
  const a = script.images[scene.left.image], b = script.images[scene.right.image];
  const eqAt = rel(scene.eqAt, scene, fps), stampAt = rel(scene.stampAt, scene, fps);
  const wipe = interpolate(f, [4, 26], [0, 1], {...clamp, easing: ease});
  const eq = spring({frame: f - eqAt, fps, config: {damping: 7, stiffness: 220}});
  const panel = (im, spec, x, label) => (
    <Glass style={{position: 'absolute', left: x, top: 540, width: 460, height: 620, borderRadius: 40, padding: 12}}>
      <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 30, overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, backgroundImage: `url(${staticFile(im.file)})`, backgroundSize: `${spec.size}%`, backgroundPosition: spec.pos}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '44px 0 18px', textAlign: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 34, letterSpacing: 4, color: '#fff',
          background: 'linear-gradient(180deg, rgba(20,28,85,0), rgba(20,28,85,0.85))'}}>{label}</div>
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(90deg, rgba(43,63,160,0) ${wipe * 100}%, ${A.lt} ${wipe * 100}%)`, opacity: wipe < 1 ? 1 : 0}} />
      </div>
    </Glass>
  );
  return (
    <Shell {...{f, fps, scene, inP, out}}>
      {panel(a, scene.left, 50, 'ГОЛОВА ГОЛИАФА')}
      {panel(b, scene.right, 570, 'КАРАВАДЖО')}
      <div style={{position: 'absolute', left: 440, top: 780, width: 200, height: 200, borderRadius: '50%', background: A.gold, boxShadow: '0 0 60px 20px rgba(212,166,74,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 150, color: A.deep, transform: `scale(${Math.min(eq, 1.15)})`, opacity: Math.min(1, eq * 2)}}>=</div>
      <Seal text="САМОПОРТРЕТ" f={f} at={stampAt} fps={fps} angle={-6} size={60} pos={{left: 250, top: 1230}} />
    </Shell>
  );
};

// --- 9. Вопрос ----------------------------------------------------------------------------------------------------------------------------------------
const Question = ({dur, scene}) => {
  const {f, fps} = useScene(dur);
  const a = spring({frame: f, fps, config: {damping: 12, stiffness: 120}});
  const b = spring({frame: f - 10, fps, config: {damping: 12, stiffness: 120}});
  const bloom = interpolate(f, [0, 30], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 540 - 800 * bloom, top: 900 - 800 * bloom, width: 1600 * bloom, height: 1600 * bloom, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,166,74,0.55), rgba(212,166,74,0) 70%)'}} />
      <div style={{position: 'absolute', top: 430, width: '100%', textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 560, lineHeight: 0.9, opacity: Math.min(a, 1),
        transform: `scale(${Math.min(a, 1.05) * (1 + Math.sin(f / 5) * 0.012)})`, ...GTEXT()}}>?</div>
      <div style={{position: 'absolute', top: 1070, left: 70, right: 70, textAlign: 'center', fontFamily: TITLE, fontWeight: 800, fontSize: 88, lineHeight: 1.12, color: '#fff',
        opacity: Math.min(b, 1), transform: `translateY(${(1 - Math.min(b, 1)) * 50}px)`, textShadow: '0 8px 30px rgba(8,12,46,0.5)'}}>{scene.text}</div>
    </AbsoluteFill>
  );
};

// --- переходы: градиентные --------------------------------------------------------------------------------------------------------------------------
const Trans = ({type, d, seed}) => {
  const g = `linear-gradient(135deg, ${A.deep}, ${A.ultra} 45%, ${A.gold})`;
  if (type === 'sweep') {
    const x = interpolate(d, [0, 11], [-1500, 1300]);
    return <div style={{position: 'absolute', left: x, top: -200, width: 1100, height: 2400, transform: 'skewX(-16deg)', background: `linear-gradient(90deg, rgba(212,166,74,0), ${A.gold} 30%, #fff 50%, ${A.ultra} 75%, rgba(43,63,160,0))`}} />;
  }
  if (type === 'bloom') {
    const r = interpolate(d, [0, 6, 11], [0, 1300, 1500], clamp);
    return <div style={{position: 'absolute', left: 540 - r, top: 960 - r, width: r * 2, height: r * 2, borderRadius: '50%', opacity: interpolate(d, [0, 6, 11], [1, 1, 0], clamp),
      background: `radial-gradient(circle, #fff, ${A.gold} 40%, ${A.ultra} 100%)`}} />;
  }
  if (type === 'shutters') {
    return Array.from({length: 8}).map((_, i) => {
      const s = interpolate(d, [i * 0.35, 4 + i * 0.35, 7 + i * 0.35, 11], [0, 1, 1, 0], clamp);
      return <div key={i} style={{position: 'absolute', left: 0, top: i * 240, width: 1080, height: 241, transformOrigin: i % 2 ? '100% 50%' : '0% 50%', transform: `scaleX(${s})`, background: g}} />;
    });
  }
  if (type === 'wipeUp') {
    const y = interpolate(d, [0, 5.5, 11], [1920, 0, -1920]);
    return <div style={{position: 'absolute', left: 0, top: y, width: 1080, height: 1920, background: `linear-gradient(0deg, ${A.gold}, ${A.ultra} 55%, ${A.deep})`}} />;
  }
  if (type === 'lens') {
    return (
      <>
        {Array.from({length: 5}).map((_, i) => {
          const r = interpolate(d, [0, 11], [1500 - i * 130, 40]);
          return <div key={i} style={{position: 'absolute', left: 540 - r, top: 960 - r, width: r * 2, height: r * 2, borderRadius: '50%', border: `${26 - i * 4}px solid ${i % 2 ? A.gold : A.lt}`, opacity: 0.85}} />;
        })}
        <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: interpolate(d, [4, 7, 11], [0, 0.9, 0], clamp)}} />
      </>
    );
  }
  if (type === 'glassSlide') {
    const x = interpolate(d, [0, 11], [-1100, 1100]);
    return <div style={{position: 'absolute', left: x, top: 0, width: 1100, height: 1920, background: 'rgba(255,255,255,0.35)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', borderRight: '4px solid #fff', borderLeft: '4px solid #fff'}} />;
  }
  if (type === 'flare') {
    const o = interpolate(d, [0, 5, 11], [0, 1, 0], clamp);
    const w = interpolate(d, [0, 5, 11], [0, 1500, 300], clamp);
    return (
      <>
        <div style={{position: 'absolute', left: 540 - w / 2, top: 900, width: w, height: 40, background: 'linear-gradient(90deg, rgba(255,255,255,0), #fff, rgba(255,255,255,0))', opacity: o, filter: 'blur(6px)'}} />
        <div style={{position: 'absolute', inset: 0, opacity: o * 0.7, background: `radial-gradient(circle at 50% 47%, #fff, ${A.gold} 35%, rgba(43,63,160,0) 75%)`}} />
      </>
    );
  }
  if (type === 'tornPaper') {
    const y = interpolate(d, [0, 11], [1950, -2150]);
    const pts = Array.from({length: 28}).map((_, i) => `${i * 40}px ${rnd(seed + i) * 70}px`).join(',');
    return <div style={{position: 'absolute', left: 0, top: y, width: 1080, height: 2200, background: 'linear-gradient(180deg, #F3E3B5, #E2CC96)', filter: 'drop-shadow(0 -14px 20px rgba(0,0,0,0.45))',
      clipPath: `polygon(${pts}, 1080px 2200px, 0 2200px)`}} />;
  }
  if (type === 'inkBloom') {
    return (
      <div style={{position: 'absolute', inset: 0, filter: 'blur(26px)'}}>
        {Array.from({length: 6}).map((_, i) => {
          const r = 760 * Math.sin(Math.PI * Math.min(1, Math.max(0, (d - i * 0.6) / 10)));
          return <div key={i} style={{position: 'absolute', left: 120 + rnd(seed + i) * 840 - r, top: 260 + rnd(seed + i + 7) * 1400 - r, width: r * 2, height: r * 2, borderRadius: '50%', background: i % 3 === 0 ? A.gold : '#0A1040'}} />;
        })}
      </div>
    );
  }
  if (type === 'splitBars') {
    const t = interpolate(d, [0, 5, 6, 11], [0, 1, 1, 0], clamp);
    const bar = (top, dir) => <div style={{position: 'absolute', left: 0, top, width: 1080, height: 960, transform: `translateY(${(1 - t) * dir * 960}px)`, background: `linear-gradient(${dir > 0 ? 0 : 180}deg, ${A.deep}, ${A.ultra})`,
      borderTop: dir > 0 ? `10px solid ${A.gold}` : undefined, borderBottom: dir < 0 ? `10px solid ${A.gold}` : undefined}} />;
    return <>{bar(0, -1)}{bar(960, 1)}</>;
  }
  if (type === 'stripes') {
    return (
      <div style={{position: 'absolute', inset: -300, transform: 'rotate(-30deg)'}}>
        {Array.from({length: 9}).map((_, i) => {
          const x = interpolate(d, [i * 0.3, 5 + i * 0.3, 7 + i * 0.3, 11], [(i % 2 ? 1 : -1) * 1500, 0, 0, (i % 2 ? -1 : 1) * 1500], clamp);
          return <div key={i} style={{position: 'absolute', left: 0, top: i * 250, width: 1700, height: 252, transform: `translateX(${x}px)`, background: i % 3 === 0 ? A.gold : i % 3 === 1 ? A.ultra : '#F3E3B5'}} />;
        })}
      </div>
    );
  }
  if (type === 'confetti') {
    const o = interpolate(d, [0, 5, 11], [0, 1, 0], clamp);
    return (
      <>
        <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: interpolate(d, [3, 5, 8], [0, 0.8, 0], clamp)}} />
        {Array.from({length: 46}).map((_, i) => {
          const a = rnd(seed + i) * Math.PI * 2, r = d * (60 + rnd(seed + i + 3) * 120);
          return <div key={i} style={{position: 'absolute', left: 540 + Math.cos(a) * r, top: 960 + Math.sin(a) * r * 1.4, width: 34, height: 18 + rnd(i) * 22, background: ['#D4A64A', '#F3E3B5', '#2B3FA0', '#fff'][i % 4], opacity: o,
            transform: `rotate(${d * 40 + i * 20}deg)`, borderRadius: 3}} />;
        })}
      </>
    );
  }
  if (type === 'ribbon') {
    const x = interpolate(d, [0, 11], [-1600, 1500]);
    return (
      <svg width="1080" height="1920" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <defs><linearGradient id="rg" x1="0" x2="1"><stop offset="0" stopColor="#8A6419" /><stop offset="0.5" stopColor="#FFF0B8" /><stop offset="1" stopColor="#D4A64A" /></linearGradient></defs>
        <path d={`M${x} 1700 C ${x + 400} 1500, ${x + 600} 400, ${x + 1200} 200`} fill="none" stroke="url(#rg)" strokeWidth="520" strokeLinecap="butt" />
        <path d={`M${x + 120} 1700 C ${x + 520} 1500, ${x + 720} 400, ${x + 1320} 200`} fill="none" stroke={A.ultra} strokeWidth="60" opacity="0.8" />
      </svg>
    );
  }
  if (type === 'pageFlip') {
    const x = interpolate(d, [0, 11], [-1200, 1250]);
    return (
      <div style={{position: 'absolute', left: x, top: 0, width: 1200, height: 1920, background: 'linear-gradient(90deg, #E2CC96, #F7EBC8 70%, #fff7dc)', boxShadow: '40px 0 60px rgba(0,0,0,0.5)',
        borderRight: '10px solid rgba(120,90,40,0.35)'}} />
    );
  }
  if (type === 'dust') {
    const o = interpolate(d, [0, 4, 11], [0, 1, 0], clamp);
    return (
      <>
        <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 50%, rgba(255,243,196,${0.9 * o}), rgba(212,166,74,${0.7 * o}) 45%, rgba(20,28,85,${0.8 * o}) 100%)`}} />
        {Array.from({length: 60}).map((_, i) => {
          const a = rnd(seed + i) * Math.PI * 2, r = d * (40 + rnd(seed + i + 4) * 110);
          return <div key={i} style={{position: 'absolute', left: 540 + Math.cos(a) * r, top: 960 + Math.sin(a) * r * 1.5, width: 9, height: 9, borderRadius: '50%', background: '#FBE6A3', opacity: o, boxShadow: '0 0 12px 3px rgba(212,166,74,0.9)'}} />;
        })}
      </>
    );
  }
  if (type === 'spin') {
    const a = interpolate(d, [0, 5.5], [0, 360], clamp), b = interpolate(d, [5.5, 11], [0, 360], clamp);
    return <div style={{position: 'absolute', inset: 0, background: d < 5.5 ? `conic-gradient(from 0deg at 50% 50%, ${A.ultra} 0deg ${a}deg, transparent ${a}deg)` : `conic-gradient(from 0deg at 50% 50%, transparent 0deg ${b}deg, ${A.ultra} ${b}deg 360deg)`}} />;
  }
  return null;
};

const Wipes = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      {script.scenes.slice(1).map((sc) => {
        const d = f - sec(t0(sc.from), fps) + 5;
        if (d < 0 || d > 11) return null;
        return <React.Fragment key={sc.id}><Trans type={sc.trans || 'sweep'} d={d} seed={sc.id * 13} /></React.Fragment>;
      })}
    </>
  );
};

export const AuroraMain = () => {
  useFonts();
  const {fps, durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill>
      <Background />
      {Object.values(script.images).map((im) => <Img key={im.file} src={staticFile(im.file)} style={{position: 'absolute', width: 2, height: 2, opacity: 0.01}} />)}
      {script.scenes.map((s) => {
        const from = sec(t0(s.from), fps);
        const next = script.scenes.find((x) => x.id === s.id + 1);
        const end = next ? sec(t0(next.from), fps) : durationInFrames;
        const dur = end - from + 6;
        const body =
          s.type === 'hero' ? <HeroC dur={dur} scene={s} />
          : s.type === 'year' ? <Year dur={dur} scene={s} />
          : s.type === 'sentence' ? <SentenceC dur={dur} scene={s} />
          : s.type === 'route' ? <Route dur={dur} scene={s} />
          : s.type === 'plate' ? <Plate dur={dur} scene={s} />
          : s.type === 'montage' ? <MontageC dur={dur} scene={s} />
          : s.type === 'compare' ? <CompareC dur={dur} scene={s} />
          : s.type === 'plate9' ? <Plate dur={dur} scene={s} />
          : s.type === 'hero9' ? <Hero9 dur={dur} scene={s} />
          : s.type === 'court9' ? <Court9 dur={dur} scene={s} />
          : s.type === 'versus9' ? <Versus9 dur={dur} scene={s} />
          : s.type === 'question9' ? <Question9 dur={dur} scene={s} />
          : s.type === 'press9' ? <Press9 dur={dur} scene={s} />
          : s.type === 'truth9' ? <Truth9 dur={dur} scene={s} />
          : s.type === 'power9' ? <Power9 dur={dur} scene={s} />
          : s.type === 'academy9' ? <Academy9 dur={dur} scene={s} />
          : <Question dur={dur} scene={s} />;
        return <Sequence key={s.id} from={from} durationInFrames={dur}>{body}</Sequence>;
      })}
      <Wipes />
      <TitleOnly />
      <Captions />
    </AbsoluteFill>
  );
};
