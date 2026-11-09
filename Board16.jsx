import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing, staticFile, delayRender, continueRender, Img, Sequence, OffthreadVideo, Freeze} from 'remotion';
import {script, words} from './current';

// «Доска дела» №10 (Дюшан): тот же приём с нитью повествования, но без красного: золотая нить, латунные кнопки, чернильные штампы.
// Шрифты: Unbounded (заголовки), IBM Plex Mono (документы и ленты), Caveat (рукописные записи), Manrope (субтитры).
const HEAD = 'Unbounded, sans-serif';
const MONO = '"IBM Plex Mono", monospace';
const HAND = 'Caveat, cursive';
const BODY = 'Manrope, sans-serif';
const GOLD = '#D4A64A', INK = '#141C55', CREAM = '#F5EFE6', ULTRA = '#2B3FA0';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const sec = (s, fps) => Math.round(s * fps);
const t0 = (i) => words[i].start;
const img = (n) => staticFile('n16/img/' + n);
const inOut = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const rnd = (n) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
const GT = (a = '#FFF3C4', b = '#D4A64A') => ({background: `linear-gradient(180deg, ${a}, ${b})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent'});

const useFonts = () => {
  const [h] = React.useState(() => delayRender('fonts'));
  React.useEffect(() => {
    const fonts = [
      new FontFace('Unbounded', `url(${staticFile('fonts/Unbounded-VF.ttf')})`, {weight: '200 900'}),
      new FontFace('Caveat', `url(${staticFile('fonts/Caveat-VF.ttf')})`, {weight: '400 700'}),
      new FontFace('IBM Plex Mono', `url(${staticFile('fonts/PlexMono-Medium.ttf')})`, {weight: '500'}),
      new FontFace('IBM Plex Mono', `url(${staticFile('fonts/PlexMono-Bold.ttf')})`, {weight: '700'}),
      new FontFace('Manrope', `url(${staticFile('fonts/Manrope-VF.ttf')})`, {weight: '200 800'}),
    ];
    Promise.all(fonts.map((f) => f.load())).then((l) => { l.forEach((f) => document.fonts.add(f)); continueRender(h); });
  }, [h]);
};

const camAt = (f, fps) => {
  const K = script.cam;
  const arr = K.map((k) => sec(t0(k.w), fps));
  let pos = {x: K[0].x, y: K[0].y, z: K[0].z, r: K[0].r};
  for (let i = 1; i < K.length; i++) {
    const dur = K[i].d ? Math.min(K[i].d, arr[i] - arr[i - 1] - 2) : Math.max(10, Math.min(32, arr[i] - arr[i - 1] - 4));
    const start = arr[i] - dur;
    if (f >= arr[i]) { pos = {x: K[i].x, y: K[i].y, z: K[i].z, r: K[i].r}; continue; }
    if (f >= start) {
      const p = inOut((f - start) / dur);
      const a = K[i - 1], b = K[i];
      pos = {x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p, z: Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * p), r: a.r + (b.r - a.r) * p};
    }
    break;
  }
  return pos;
};
const pop = (f, at, fps) => spring({frame: f - at, fps, config: {damping: 11, stiffness: 130}});

// --- предметы -------------------------------------------------------------------------------------------------------------------------------------------
const Pin = ({x, y, s = 1, p = 1}) => (
  <svg width="120" height="170" viewBox="-60 -150 120 170" style={{position: 'absolute', left: x - 60 * s, top: y - 140 * s, width: 120 * s, height: 170 * s, zIndex: 40, overflow: 'visible',
    transform: `scale(${p})`, filter: 'drop-shadow(8px 14px 10px rgba(0,0,0,0.45))'}}>
    <defs><radialGradient id="pinB" cx="35%" cy="30%"><stop offset="0" stopColor="#FFF3C4" /><stop offset="0.45" stopColor="#D4A64A" /><stop offset="1" stopColor="#6e4b0a" /></radialGradient></defs>
    <path d="M-5 -10 L0 20 L5 -10 Z" fill="#c9ccd6" />
    <ellipse cx="0" cy="-12" rx="40" ry="16" fill="url(#pinB)" />
    <path d="M-22 -14 L-18 -72 Q0 -86 18 -72 L22 -14 Z" fill="url(#pinB)" />
    <ellipse cx="0" cy="-74" rx="30" ry="12" fill="#F3D88A" />
    <ellipse cx="-10" cy="-50" rx="5" ry="22" fill="rgba(255,255,255,0.4)" />
  </svg>
);

const Tape = ({text, x, y, rot = -2, f, at, fps, size = 36, bg = '#111', color = '#fff'}) => {
  const p = pop(f, at, fps);
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, zIndex: 34, padding: '10px 28px', background: bg, color, fontFamily: MONO, fontWeight: 700, fontSize: size, letterSpacing: 3, whiteSpace: 'nowrap',
      clipPath: 'polygon(0 8%, 3% 0, 97% 4%, 100% 12%, 99% 92%, 96% 100%, 3% 96%, 0 90%)', transform: `rotate(${rot}deg) scale(${interpolate(p, [0, 1], [1.8, 1])})`, opacity: Math.min(1, p * 2), boxShadow: '0 10px 18px rgba(0,0,0,0.35)'}}>{text}</div>
  );
};

const Polaroid = ({cx, cy, w, h, file, pos = '50% 30%', cap, rot = 0, at, f, fps, children, tint}) => {
  const p = pop(f, at, fps);
  if (f < at) return null;
  const e = 1 - Math.min(p, 1);
  const top = cy - (h + 134) / 2;
  return (
    <>
      <div style={{position: 'absolute', left: cx - w / 2 - 22, top, width: w + 44, height: h + 134, background: '#F7F2E6', zIndex: 14, boxShadow: '0 30px 50px rgba(0,0,0,0.55), 0 6px 14px rgba(0,0,0,0.4)',
        transform: `translateY(${-e * 500}px) rotate(${rot + e * 12}deg) scale(${1 + e * 0.25})`, opacity: Math.min(1, p * 3)}}>
        <div style={{position: 'absolute', left: 22, top: 22, width: w, height: h, overflow: 'hidden', background: '#111', backgroundImage: file ? `url(${img(file)})` : undefined, backgroundSize: 'cover', backgroundPosition: pos,
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)', filter: tint}}>{children}</div>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 24, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 2, color: '#2a2418'}}>{cap}</div>
        <div style={{position: 'absolute', left: -40, top: 10, width: 130, height: 46, background: 'rgba(235,222,180,0.82)', transform: 'rotate(-38deg)'}} />
        <div style={{position: 'absolute', right: -40, top: 10, width: 130, height: 46, background: 'rgba(235,222,180,0.82)', transform: 'rotate(38deg)'}} />
      </div>
      <Pin x={cx} y={top + 16} s={0.95} p={Math.min(1, p * 2)} />
    </>
  );
};

const Thread = ({a, b, at, f, fps, sag = 90}) => {
  const p = interpolate(f, [at, at + 26], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  if (f < at) return null;
  const d = `M${a[0]} ${a[1]} Q${(a[0] + b[0]) / 2} ${(a[1] + b[1]) / 2 + sag} ${b[0]} ${b[1]}`;
  return (
    <>
      <path d={d} fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="9" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} transform="translate(8 12)" />
      <path d={d} fill="none" stroke={GOLD} strokeWidth="7" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} style={{filter: 'drop-shadow(0 0 8px rgba(212,166,74,0.7))'}} />
    </>
  );
};

const OldPaper = ({cx, cy, w, rot = 0, flip = false, at, f, fps, children, z = 12}) => {
  const p = pop(f, at, fps);
  if (f < at) return null;
  const e = 1 - Math.min(p, 1);
  const h = w * 1271 / 900;
  return (
    <div style={{position: 'absolute', left: cx - w / 2, top: cy - h / 2, width: w, height: h, zIndex: z, transform: `translateY(${-e * 500}px) rotate(${rot + e * 10}deg) scale(${1 + e * 0.2})`, opacity: Math.min(1, p * 3),
      filter: 'drop-shadow(14px 24px 22px rgba(0,0,0,0.55))'}}>
      <img src={img('paper_old.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', transform: flip ? 'scaleX(-1)' : undefined}} />
      <div style={{position: 'absolute', inset: 0}}>{children}</div>
    </div>
  );
};

const Ink = ({text, x, y, rot = -8, size = 120, f, at, fps, color = INK}) => {
  const p = spring({frame: f - at, fps, config: {damping: 7, stiffness: 230}});
  if (f < at) return null;
  const shake = f < at + 10 ? Math.sin(f * 4.5) * 10 * (1 - (f - at) / 10) : 0;
  return (
    <div style={{position: 'absolute', left: x + shake, top: y, zIndex: 40, padding: '0 34px', border: `12px solid ${color}`, color, fontFamily: HEAD, fontWeight: 900, fontSize: size, lineHeight: 1.1, letterSpacing: 2,
      background: 'rgba(245,235,215,0.9)', transform: `rotate(${rot}deg) scale(${interpolate(p, [0, 1], [3, 1])})`, opacity: Math.min(1, p * 1.8), boxShadow: '0 24px 40px rgba(0,0,0,0.5)', whiteSpace: 'nowrap'}}>{text}</div>
  );
};

const Sticky = ({x, y, text, rot = 0, at = 0, f, fps, size = 64}) => {
  const p = pop(f, at, fps);
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', left: x - 120, top: y - 120, width: 240, height: 240, zIndex: 13, background: 'linear-gradient(160deg, #F7E9A6, #E9D27A)', boxShadow: '0 20px 30px rgba(0,0,0,0.5)',
      transform: `rotate(${rot}deg) scale(${Math.min(p, 1.05)})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HAND, fontWeight: 700, fontSize: size, color: '#2a2418', textAlign: 'center', padding: 14, lineHeight: 1}}>{text}</div>
  );
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
    <div style={{position: 'absolute', left: 60, top: 170, width: 960, textAlign: 'center', fontFamily: HEAD, fontWeight: 700, fontSize: 48, lineHeight: 1.22, opacity: a, filter: `blur(${(1 - a) * 8}px)`,
      transform: `translateY(${(1 - a) * 12}px)`, textWrap: 'balance', textShadow: '0 4px 24px rgba(0,0,0,0.9)', zIndex: 80}}>
      {chunk.map(([txt, s0], i) => <span key={i} style={{color: now >= words[s0].start ? '#fff' : 'rgba(255,255,255,0.32)'}}>{txt}{' '}</span>)}
    </div>
  );
};

const ANTON = 'Anton, Impact, sans-serif';
const ARCH = '"Archivo Black", Arial Black, sans-serif';
const YEL = '#F2C230', BLK = '#141414', PAPER = '#F6F0E2';

const useFonts13 = () => {
  const [h] = React.useState(() => delayRender('f13'));
  React.useEffect(() => {
    const fs = [
      new FontFace('Anton', `url(${staticFile('fonts/Anton-Regular.ttf')})`),
      new FontFace('Archivo Black', `url(${staticFile('fonts/ArchivoBlack-Regular.ttf')})`),
    ];
    Promise.all(fs.map((x) => x.load())).then((l) => { l.forEach((x) => document.fonts.add(x)); continueRender(h); });
  }, [h]);
};

const tornPoly = (seed) => {
  const P = [];
  const n = 8;
  for (let i = 0; i <= n; i++) P.push(`${(i * 100) / n}% ${rnd(seed + i) * 6}%`);
  for (let i = 1; i < 4; i++) P.push(`${100 - rnd(seed + 20 + i) * 3}% ${(i * 100) / 4}%`);
  for (let i = n; i >= 0; i--) P.push(`${(i * 100) / n}% ${100 - rnd(seed + 40 + i) * 6}%`);
  for (let i = 3; i > 0; i--) P.push(`${rnd(seed + 60 + i) * 3}% ${(i * 100) / 4}%`);
  return `polygon(${P.join(',')})`;
};

// слово/надпись на клочке бумаги; anim: pop | type (печатается) | slideL | slideR | drop | wipe | flip
const outE = (x) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);
const Tile = ({text, cx, cy, rot = 0, bg = YEL, color = BLK, font = ANTON, size = 160, at = 0, f, fps, seed = 1, z = 40, pad = '0.08em 0.28em', ls = 2, anim = 'pop'}) => {
  const t = f - at;
  if (t < 0) return null;
  const p = spring({frame: t, fps, config: {damping: anim === 'drop' ? 9 : 14, stiffness: 340}});
  let tf = `translate(-50%,-50%) rotate(${rot}deg)`;
  let op = 1;
  let clip;
  let shown = text;
  if (anim === 'type') {
    const n = Math.min(text.length, Math.floor(t * 0.9));
    tf = `translate(-50%,-50%) rotate(${rot}deg) scale(${interpolate(Math.min(t / 4, 1), [0, 1], [0.88, 1])})`;
    op = Math.min(1, t / 3);
    shown = <><span>{text.slice(0, n)}</span><span style={{opacity: n < text.length ? 0.9 : 0}}>{n < text.length ? '▌' : ''}</span><span style={{opacity: 0}}>{text.slice(n + (n < text.length ? 1 : 0))}</span></>;
  } else if (anim === 'slideL' || anim === 'slideR') {
    tf = `translate(-50%,-50%) translateX(${(1 - outE(t / 9)) * (anim === 'slideL' ? -1400 : 1400)}px) rotate(${rot}deg)`;
  } else if (anim === 'drop') {
    tf = `translate(-50%,-50%) translateY(${-(1 - Math.min(p, 1.2)) * 1300}px) rotate(${rot}deg)`;
  } else if (anim === 'wipe') {
    clip = `inset(0 ${(1 - outE(t / 10)) * 100}% 0 0)`;
  } else if (anim === 'flip') {
    tf = `translate(-50%,-50%) perspective(900px) rotateX(${(1 - outE(t / 10)) * 90}deg) rotate(${rot}deg)`;
    op = Math.min(1, t / 3);
  } else {
    tf = `translate(-50%,-50%) rotate(${rot + (1 - Math.min(p, 1)) * 14}deg) scale(${interpolate(p, [0, 1], [2.2, 1])})`;
    op = Math.min(1, p * 3);
  }
  return (
    <div style={{position: 'absolute', left: cx, top: cy, zIndex: z, transform: tf, opacity: op, clipPath: clip, filter: 'drop-shadow(8px 14px 10px rgba(5,10,30,0.55))'}}>
      <div style={{clipPath: tornPoly(seed), background: bg, color, fontFamily: font, fontSize: size, lineHeight: 1.05, padding: pad, whiteSpace: 'nowrap', letterSpacing: ls, textTransform: 'uppercase'}}>{shown}</div>
    </div>
  );
};

// нотный стан с нотами, которые падают по очереди
const NOTES_A = [[0.06, 3], [0.14, 5], [0.22, 4], [0.30, 6], [0.38, 3], [0.46, 2], [0.54, 4], [0.62, 6], [0.70, 5], [0.78, 3], [0.86, 4], [0.94, 2]];
const NOTES_B = [[0.06, 6], [0.14, 4], [0.22, 7], [0.30, 2], [0.38, 5], [0.46, 7], [0.54, 3], [0.62, 1], [0.70, 6], [0.78, 4], [0.86, 7], [0.94, 5]];
const Staff = ({cx, cy, w = 1000, h = 240, notes, at, f, fps, rot = 0, label, seed = 3, step = 4}) => {
  const p = spring({frame: f - at, fps, config: {damping: 11, stiffness: 150}});
  if (f < at) return null;
  const cnt = Math.floor((f - at) / step);
  return (
    <div style={{position: 'absolute', left: cx, top: cy, zIndex: 30, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${Math.min(p, 1.03)})`, opacity: Math.min(1, p * 3), filter: 'drop-shadow(8px 14px 10px rgba(5,10,30,0.5))'}}>
      <div style={{position: 'relative', width: w, height: h, clipPath: tornPoly(seed), background: PAPER}}>
        {label && <div style={{position: 'absolute', left: 30, top: 14, fontFamily: ARCH, fontSize: 26, letterSpacing: 4, color: '#2B3FA0'}}>{label}</div>}
        {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 24, right: 24, top: 70 + i * 30, height: 3, background: '#222'}} />)}
        {notes.map(([x, y], i) => {
          if (i >= cnt) return null;
          const a = Math.min(1, (f - at - i * step) / 5);
          const ny = 70 + 120 - y * 15;
          return (
            <div key={i} style={{position: 'absolute', left: 24 + x * (w - 48), top: ny - 12 - (1 - a) * 40, opacity: a}}>
              <div style={{width: 30, height: 22, borderRadius: '50%', background: BLK, transform: 'rotate(-20deg)'}} />
              <div style={{position: 'absolute', left: 25, top: -52, width: 4, height: 62, background: BLK}} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// слова на экране появляются по мере произнесения, каждое на своём клочке бумаги
const WORD_STYLE = script.mono ? [[PAPER, BLK, ANTON], ['#ECECEC', BLK, ARCH], [BLK, '#ECECEC', ANTON], ['#fff', '#3B3B3B', ARCH]] : [[PAPER, BLK, ANTON], [YEL, BLK, ARCH], [BLK, YEL, ANTON], ['#fff', '#2B3FA0', ARCH]];
const CAP_ANIM = ['pop', 'type', 'slide', 'wipe', 'drop', 'flip'];
const Captions13 = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const now = f / fps;
  let chunk = null;
  let ci = 0;
  script.captions.forEach((c, k) => { if (now >= t0(c[0][1]) - 0.02) { chunk = c; ci = k; } });
  if (!chunk) return null;
  const anim = CAP_ANIM[ci % CAP_ANIM.length];
  return (
    <div style={{position: 'absolute', left: 40, top: 160, width: 1000, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px 12px', zIndex: 90}}>
      {chunk.map(([txt, s0], k) => {
        const st = t0(s0) * fps;
        if (f < st - 1) return null;
        const dt = Math.max(f - st, 0);
        const p = spring({frame: f - st, fps, config: {damping: anim === 'drop' ? 9 : 12, stiffness: 340}});
        const [bg, col, font] = WORD_STYLE[(s0 * 7 + k) % 4];
        const rot = (rnd(s0 * 3 + 1) - 0.5) * 7;
        let tf = `rotate(${rot}deg)`, op = 1, clip, shown = txt;
        if (anim === 'pop') {
          tf = `rotate(${rot}deg) scale(${interpolate(p, [0, 1], [1.5, 1])})`;
          op = Math.min(1, p * 3);
        } else if (anim === 'type') {
          const n = Math.min(txt.length, Math.floor(dt * 1.5) + 1);
          shown = <><span>{txt.slice(0, n)}</span><span style={{opacity: 0}}>{txt.slice(n)}</span></>;
        } else if (anim === 'slide') {
          tf = `translateY(${(1 - outE(dt / 7)) * 90}px) rotate(${rot}deg)`;
          op = Math.min(1, dt / 4);
        } else if (anim === 'wipe') {
          clip = `inset(0 ${(1 - outE(dt / 8)) * 100}% 0 0)`;
        } else if (anim === 'drop') {
          tf = `translateY(${-(1 - Math.min(p, 1.15)) * 220}px) rotate(${rot}deg)`;
        } else {
          tf = `perspective(700px) rotateX(${(1 - outE(dt / 8)) * 90}deg) rotate(${rot}deg)`;
          op = Math.min(1, dt / 3);
        }
        return (
          <div key={k} style={{transform: tf, opacity: op, clipPath: clip, filter: 'drop-shadow(4px 7px 6px rgba(5,10,30,0.5))'}}>
            <div style={{clipPath: tornPoly(s0 + 5), background: bg, color: col, fontFamily: font, fontSize: font === ANTON ? 78 : 62, lineHeight: 1.05, padding: '4px 16px', textTransform: 'uppercase', letterSpacing: 1}}>{shown}</div>
          </div>
        );
      })}
    </div>
  );
};

const RedInk = ({text, cx, cy, rot = -8, size = 170, at = 0, f, fps}) => {
  const p = spring({frame: f - at, fps, config: {damping: 16, stiffness: 420}});
  if (f < at) return null;
  const shake = f < at + 10 ? Math.sin(f * 4.5) * 10 * (1 - (f - at) / 10) : 0;
  return (
    <div style={{position: 'absolute', left: cx + shake, top: cy, zIndex: 85, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${interpolate(p, [0, 1], [3, 1])})`, opacity: Math.min(1, p * 1.8),
      padding: '0.04em 0.3em', border: `0.07em solid #C8191E`, borderRadius: 14, color: '#C8191E', background: 'rgba(246,240,226,0.94)', fontFamily: ANTON, fontSize: size, lineHeight: 1.1, letterSpacing: 4, whiteSpace: 'nowrap', boxShadow: '8px 14px 14px rgba(5,10,30,0.55)'}}>{text}</div>
  );
};

const Cut = ({file, ratio, cx, cy, w, rot = 0, at = 0, f, fps, z = 10, children, gray = false}) => {
  const p = spring({frame: f - at, fps, config: {damping: 14, stiffness: 300}});
  if (f < at) return null;
  const e = 1 - Math.min(p, 1);
  const h = w * ratio;
  return (
    <div style={{position: 'absolute', left: cx - w / 2, top: cy - h / 2, width: w, height: h, zIndex: z, transform: `translateY(${-e * 500}px) rotate(${rot + e * 14}deg) scale(${Math.min(p, 1.04) * (1 + e * 0.3)})`, opacity: Math.min(1, p * 3),
      filter: `drop-shadow(14px 22px 16px rgba(5,10,30,0.6))${gray ? ' grayscale(1) contrast(1.12)' : ''}`}}>
      <img src={img(file)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} />
      {children}
    </div>
  );
};

const cB = '#2B3FA0';
const cY = YEL;
const VDUR16 = {dog1: 90, dog2: 90, dog3: 90};
const Vid16 = ({name, at, f}) => (
  <Sequence from={at}>
    <Freeze frame={Math.min(Math.max(f - at, 0), VDUR16[name] - 3)}>
      <OffthreadVideo src={staticFile('n16/vid/' + name + '.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </Freeze>
  </Sequence>
);
const VidCard16 = ({name, cx, cy, w, rot = 0, at, back = '#2B3FA0', f, fps, z = 14, seed = 90}) => {
  const e = spring({frame: f - at, fps, config: {damping: 14, stiffness: 300}});
  if (f < at) return null;
  const h = w * 16 / 9;
  return (
    <div style={{position: 'absolute', left: cx, top: cy, zIndex: z, transform: `translate(-50%,-50%) rotate(${rot + (1 - Math.min(e, 1)) * 12}deg) scale(${Math.min(e, 1.03) * (1 + (1 - Math.min(e, 1)) * 0.3)})`, opacity: Math.min(1, e * 3),
      filter: 'drop-shadow(14px 22px 16px rgba(60,40,5,0.6))'}}>
      <div style={{position: 'absolute', left: 18, top: 14, right: -18, bottom: -14, clipPath: tornPoly(seed + 3), background: back, transform: 'rotate(2.5deg)'}} />
      <div style={{position: 'relative', clipPath: tornPoly(seed), background: PAPER, padding: 22}}>
        <div style={{position: 'relative', width: w, height: h, overflow: 'hidden', background: '#111'}}><Vid16 name={name} at={at} f={f} /></div>
      </div>
    </div>
  );
};

export const Board16Main = () => {
  useFonts();
  useFonts13();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const T = (w) => sec(t0(w), fps) - 3;
  const cam = camAt(f, fps), prev = camAt(Math.max(0, f - 1), fps);
  const speed = Math.hypot((cam.x - prev.x) * cam.z, (cam.y - prev.y) * cam.z) + Math.abs(Math.log(cam.z / prev.z)) * 700;
  const blur = Math.min(8, speed * 0.08);
  const jx = Math.sin(f / 6) * 4, jy = Math.cos(f / 8) * 4, jr = Math.sin(f / 13) * 0.3;
  const picasso = Math.round(58 * interpolate(f, [T(43), T(44) + 6], [0, 1], {...clamp, easing: ease}));
  const endIn = interpolate(f, [T(50) + 2, T(50) + 14], [0, 1], clamp);
  const tapAt = T(54), tap2At = T(55) + 6;
  const cur = f < tapAt ? 0 : f < tap2At ? 1 : 2;
  const curX = interpolate(f, [T(50) + 14, tapAt - 2, tapAt + 8, tap2At - 4], [820, 600, 600, 640], clamp);
  const curY = interpolate(f, [T(50) + 14, tapAt - 2, tapAt + 8, tap2At - 4], [1500, 1380, 1390, 1500], clamp);
  return (
    <AbsoluteFill style={{background: '#8c6a45'}}>
      {['bg_card.jpg', 'cut_full.png', 'cut_infanta.png', 'cut_mirror.png', 'cut_artist.png', 'cut_dog.png', 'cut_dwarf.png'].map((n) => <Img key={n} src={img(n)} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />)}
      <div style={{position: 'absolute', left: 0, top: 0, width: 3000, height: 4500, transformOrigin: '0 0',
        transform: `translate(${540 + jx}px, ${960 + jy}px) rotate(${cam.r + jr}deg) scale(${cam.z}) translate(${-cam.x}px, ${-cam.y}px)`, filter: blur > 0.4 ? `blur(${blur}px)` : undefined}}>
        <img src={img('bg_card.jpg')} style={{position: 'absolute', left: -200, top: -250, width: 3400, height: 5100}} />
        {/* S0: хук — собака и картина */}
        <VidCard16 name="dog1" cx={680} cy={1040} w={460} rot={-3} at={-6} back="#E57A1C" f={f} fps={fps} seed={11} />
        <Cut file="cut_full.png" ratio={1289 / 1142} cx={1190} cy={880} w={470} rot={4} at={T(1)} f={f} fps={fps} z={20} />
        <Tile text="ЭТА КАРТИНА" cx={780} cy={470} rot={-5} bg={BLK} color={YEL} size={120} at={-4} f={f} fps={fps} seed={12} anim="type" z={50} />
        <Tile text="СМОТРИТ НА ТЕБЯ!" cx={900} cy={1510} rot={3} bg={YEL} color={BLK} size={110} at={T(3)} f={f} fps={fps} seed={13} anim="drop" z={50} />
        {/* S1: Менины, 1656, герои */}
        <Tile text="«МЕНИНЫ»" cx={1900} cy={1760} rot={-3} bg={PAPER} color={BLK} size={170} at={T(5)} f={f} fps={fps} seed={14} anim="slideL" z={50} />
        <Tile text="ВЕЛАСКЕС" cx={2220} cy={1960} rot={3} bg={BLK} color={PAPER} font={ARCH} size={66} at={T(6)} f={f} fps={fps} seed={15} anim="slideR" z={50} />
        <Tile text="1656" cx={1720} cy={2060} rot={-2} bg={YEL} color={BLK} size={190} at={T(7)} f={f} fps={fps} seed={16} anim="type" z={50} />
        <Cut file="cut_infanta.png" ratio={815 / 612} cx={1660} cy={2560} w={330} rot={-4} at={T(12)} f={f} fps={fps} z={12} />
        <Tile text="ИНФАНТА" cx={1660} cy={2840} rot={-3} bg={BLK} color={YEL} size={75} at={T(12)} f={f} fps={fps} seed={17} anim="wipe" z={50} />
        <Cut file="cut_dwarf.png" ratio={842 / 565} cx={2360} cy={2560} w={310} rot={4} at={T(14)} f={f} fps={fps} z={12} />
        <Tile text="КАРЛИКИ" cx={2360} cy={2860} rot={3} bg={PAPER} color={BLK} size={75} at={T(14)} f={f} fps={fps} seed={18} anim="wipe" z={50} />
        <Cut file="cut_artist.png" ratio={793 / 484} cx={2000} cy={2540} w={300} rot={-3} at={T(17)} f={f} fps={fps} z={12} />
        <Tile text="ХУДОЖНИК" cx={2000} cy={2900} rot={3} bg={cB} color="#fff" size={75} at={T(17)} f={f} fps={fps} seed={19} anim="type" z={50} />
        {/* S2: зеркало и король */}
        <VidCard16 name="dog2" cx={640} cy={3300} w={400} rot={-3} at={T(21)} back="#E57A1C" f={f} fps={fps} seed={21} />
        <Cut file="cut_mirror.png" ratio={442 / 390} cx={1180} cy={2900} w={360} rot={3} at={T(23)} f={f} fps={fps} z={14} />
        <Tile text="ЗЕРКАЛО" cx={1180} cy={3160} rot={-4} bg={YEL} color={BLK} size={110} at={T(23)} f={f} fps={fps} seed={22} anim="flip" z={50} />
        <Tile text="КОРОЛЬ ФИЛИПП IV" cx={900} cy={2720} rot={-3} bg={BLK} color={YEL} size={80} at={T(27)} f={f} fps={fps} seed={23} anim="type" z={50} />
        <Tile text="И КОРОЛЕВА" cx={1040} cy={3560} rot={3} bg={PAPER} color={BLK} size={110} at={T(30)} f={f} fps={fps} seed={24} anim="slideR" z={50} />
        {/* S3: ты на месте короля */}
        <Tile text="ТЫ" cx={1950} cy={3470} rot={-4} bg={YEL} color={BLK} size={280} at={T(33)} f={f} fps={fps} seed={25} anim="drop" z={50} />
        <Tile text="СТОИШЬ ТАМ," cx={2250} cy={3720} rot={3} bg={BLK} color={PAPER} size={110} at={T(34)} f={f} fps={fps} seed={26} anim="slideR" z={50} />
        <Tile text="ГДЕ ДОЛЖЕН" cx={2000} cy={3900} rot={-2} bg={PAPER} color={BLK} size={110} at={T(36)} f={f} fps={fps} seed={27} anim="slideL" z={50} />
        <Tile text="СТОЯТЬ КОРОЛЬ!" cx={2150} cy={4090} rot={2} bg={cB} color="#fff" size={110} at={T(38)} f={f} fps={fps} seed={28} anim="type" z={50} />
        {/* S4: Пикассо */}
        <Tile text="ПИКАССО" cx={650} cy={3950} rot={-4} bg={BLK} color={YEL} size={150} at={T(41)} f={f} fps={fps} seed={29} anim="slideL" z={50} />
        <Tile text={picasso} cx={950} cy={4220} rot={3} bg={YEL} color={BLK} size={300} at={T(43)} f={f} fps={fps} seed={30} anim="pop" z={50} />
        <Tile text="ВАРИАЦИЙ" cx={650} cy={4430} rot={-2} bg={PAPER} color={BLK} size={100} at={T(45)} f={f} fps={fps} seed={31} anim="wipe" z={50} />
      </div>
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, opacity: 0.2, mixBlendMode: 'multiply', zIndex: 62, pointerEvents: 'none'}}>
        <filter id="gn16"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={f % 5} /></filter><rect width="1080" height="1920" filter="url(#gn16)" />
      </svg>
      <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(60,35,10,0.5) 100%)', zIndex: 60}} />
      <div style={{position: 'absolute', left: 60, top: 1610, fontFamily: ARCH, fontSize: 28, letterSpacing: 5, color: 'rgba(40,25,0,0.75)', zIndex: 80}}>{script.diagram.title}</div>
      {/* финал: Шиба спрашивает, кто главный */}
      <div style={{position: 'absolute', inset: 0, background: 'rgba(30,20,8,0.9)', opacity: endIn, zIndex: 70}} />
      {f >= T(50) + 2 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 75, opacity: endIn}}>
          <Tile text="КТО ГЛАВНЫЙ?" cx={540} cy={470} rot={-3} bg={YEL} size={150} at={T(50) + 4} f={f} fps={fps} seed={71} z={76} anim="type" />
          <div style={{position: 'absolute', left: 540 - 175, top: 640, zIndex: 76}}>
            <VidCard16 name="dog3" cx={175} cy={310} w={310} rot={2} at={T(50) + 4} back="#E57A1C" f={f} fps={fps} seed={72} z={76} />
          </div>
          {[['ИНФАНТА', 1320, 0], ['ХУДОЖНИК', 1460, 1]].map(([txt, top, i]) => {
            const pr = spring({frame: f - (T(51) + i * 5), fps, config: {damping: 14, stiffness: 300}});
            const glow = i === 1 && f >= tap2At;
            const act = cur === i + 1 || glow;
            return (
              <div key={i} style={{position: 'absolute', left: 140, top, width: 800, height: 120, transform: `rotate(${i ? 1.5 : -1.5}deg) scale(${Math.min(pr, 1.04) * (glow ? 1.06 : 1) * (act && !glow ? 0.96 : 1)})`, opacity: Math.min(1, pr * 2), filter: 'drop-shadow(8px 14px 10px rgba(0,0,0,0.5))'}}>
                <div style={{width: '100%', height: '100%', clipPath: tornPoly(80 + i), background: glow ? YEL : PAPER, color: BLK, fontFamily: ARCH, fontSize: 52, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{txt}</div>
              </div>
            );
          })}
          <svg width="130" height="150" viewBox="-10 -10 120 140" style={{position: 'absolute', left: curX, top: curY, zIndex: 80, filter: 'drop-shadow(8px 12px 10px rgba(0,0,0,0.5))', transform: `scale(${f >= tapAt && f < tapAt + 6 || f >= tap2At && f < tap2At + 6 ? 0.85 : 1})`}}>
            <path d="M5 5 L5 95 L30 72 L48 112 L66 104 L48 66 L82 66 Z" fill="#fff" stroke="#14143a" strokeWidth="6" strokeLinejoin="round" />
          </svg>
        </div>
      )}
      <Captions13 />
    </AbsoluteFill>
  );
};
