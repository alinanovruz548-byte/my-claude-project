import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing, staticFile, Img} from 'remotion';
import {script, words} from './current';

// Коллаж «вырезки из газет» для стиля aurora: рваная бумага, полутоновые вырезки, кнопки, красные «!», ленты-наклейки.
export const A = {ultra: '#2B3FA0', lt: '#5A72E8', deep: '#141C55', cream: '#F5EFE6', gold: '#D4A64A', ink: '#1E1E1E'};
export const RED = '#C4271C';
export const TITLE = '"Playfair Display", serif';
export const BODY = 'Manrope, sans-serif';
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
export const ease = Easing.bezier(0.16, 1, 0.3, 1);
const t0 = (i) => words[i].start;
const sec = (s, fps) => Math.round(s * fps);
export const rel = (idx, scene, fps) => sec(t0(idx), fps) - sec(t0(scene.from), fps);
export const rnd = (n) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
export const GTEXT = (a = '#FFF3C4', b = '#D4A64A') => ({background: `linear-gradient(180deg, ${a}, ${b})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent'});
export const asset = (n) => staticFile('n8/img/' + n);

export const useScene = (dur) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inP = spring({frame: f, fps, config: {damping: 16, stiffness: 130}});
  const out = interpolate(f, [dur - 6, dur], [0, 1], clamp);
  return {f, fps, inP, out};
};

export const Shell = ({f, fps, scene, inP, out, children}) => {
  let punch = 0;
  (scene.punches || []).forEach((w) => { const pf = rel(w, scene, fps); if (f >= pf) punch += 0.09 * Math.exp(-(f - pf) / 4.5); });
  const e = 1 - Math.min(inP, 1);
  return (
    <AbsoluteFill style={{opacity: Math.min(1, inP * 2.4) * (1 - out), transform: `translateY(${e * 160}px) scale(${(0.94 + 0.06 * Math.min(inP, 1)) * (1 + punch) * (1 - out * 0.04)})`,
      filter: e > 0.02 ? `blur(${e * 14}px)` : undefined, transformOrigin: '50% 45%'}}>{children}</AbsoluteFill>
  );
};

// --- кирпичики коллажа -------------------------------------------------------------------------
export const Pin = ({x, y, s = 1, rot = 0, p = 1}) => (
  <svg width="120" height="170" viewBox="-60 -150 120 170" style={{position: 'absolute', left: x - 60 * s, top: y - 140 * s, width: 120 * s, height: 170 * s, zIndex: 40, overflow: 'visible',
    transform: `rotate(${rot}deg) scale(${p})`, filter: 'drop-shadow(8px 14px 10px rgba(0,0,0,0.45))'}}>
    <defs><radialGradient id="pinG" cx="35%" cy="30%"><stop offset="0" stopColor="#FF8A7A" /><stop offset="0.45" stopColor="#C4271C" /><stop offset="1" stopColor="#6e0f0a" /></radialGradient></defs>
    <path d="M-5 -10 L0 20 L5 -10 Z" fill="#c9ccd6" />
    <ellipse cx="0" cy="-12" rx="40" ry="16" fill="url(#pinG)" />
    <path d="M-22 -14 L-18 -72 Q0 -86 18 -72 L22 -14 Z" fill="url(#pinG)" />
    <ellipse cx="0" cy="-74" rx="30" ry="12" fill="#E24B3C" />
    <ellipse cx="-10" cy="-50" rx="5" ry="22" fill="rgba(255,255,255,0.35)" />
  </svg>
);

export const Excl = ({x, y, s = 1, rot = 0, f, at, fps}) => {
  const p = spring({frame: f - at, fps, config: {damping: 7, stiffness: 230}});
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, zIndex: 36, fontFamily: TITLE, fontWeight: 900, fontSize: 230 * s, lineHeight: 1, color: RED, WebkitTextStroke: `${14 * s}px #fff`, paintOrder: 'stroke fill',
      transform: `rotate(${rot}deg) scale(${interpolate(p, [0, 1], [2.2, 1])})`, opacity: Math.min(1, p * 2), filter: 'drop-shadow(6px 10px 8px rgba(0,0,0,0.4))'}}>!</div>
  );
};

export const Tape = ({text, x, y, rot = -2, f, at, fps, size = 40, bg = '#111', color = '#fff'}) => {
  const p = spring({frame: f - at, fps, config: {damping: 11, stiffness: 170}});
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, zIndex: 34, padding: '10px 30px', background: bg, color, fontFamily: BODY, fontWeight: 800, fontSize: size, letterSpacing: 4, whiteSpace: 'nowrap',
      clipPath: 'polygon(0 8%, 3% 0, 97% 4%, 100% 12%, 99% 92%, 96% 100%, 3% 96%, 0 90%)', transform: `rotate(${rot}deg) scale(${interpolate(p, [0, 1], [1.8, 1])})`, opacity: Math.min(1, p * 2),
      boxShadow: '0 10px 18px rgba(0,0,0,0.35)'}}>{text}</div>
  );
};

export const CutImg = ({file, x, y, w, rot = 0, f, at, fps, pin = false, from = 'top'}) => {
  const p = spring({frame: f - at, fps, config: {damping: 11, stiffness: 120}});
  if (f < at) return null;
  const e = 1 - Math.min(p, 1);
  return (
    <>
      <img src={asset(file)} style={{position: 'absolute', left: x, top: y, width: w, zIndex: 20, transform: `translateY(${from === 'top' ? -e * 900 : e * 900}px) rotate(${rot + e * 14}deg) scale(${1 + (1 - Math.min(p, 1)) * 0.2})`,
        opacity: Math.min(1, p * 3), filter: 'drop-shadow(10px 18px 16px rgba(0,0,0,0.45))'}} />
      {pin && <Pin x={x + w / 2} y={y + 24} s={0.9} rot={rot * 0.5} p={Math.min(1, p * 2)} />}
    </>
  );
};

const TILE_BG = ['#fff', '#F1E4C3', '#111', '#2B3FA0', '#fff', '#E9DFC9', '#C4271C'];
export const WordTiles = ({text, x, y, f, at, fps, w = 96, h = 120, size = 84, seed = 1}) => {
  let k = 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, display: 'flex', zIndex: 38}}>
      {text.split('').map((ch, i) => {
        k += 1;
        const bg = TILE_BG[Math.floor(rnd(k + seed + 3) * TILE_BG.length)];
        const dark = bg === '#111' || bg === '#2B3FA0' || bg === '#C4271C';
        const fam = [TITLE, BODY, 'Georgia, serif'][Math.floor(rnd(k + seed + 9) * 3)];
        const a = at + i * 2.2;
        const p = spring({frame: f - a, fps, config: {damping: 10, stiffness: 230}});
        if (f < a) return <div key={i} style={{width: w + 10}} />;
        return (
          <div key={i} style={{width: w, height: h, margin: '0 5px', background: bg, color: dark ? '#fff' : '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fam, fontWeight: 900,
            fontStyle: rnd(k + seed + 5) > 0.75 ? 'italic' : 'normal', fontSize: size, borderRadius: 3, boxShadow: '0 8px 14px rgba(0,0,0,0.4)',
            transform: `rotate(${(rnd(k + seed) - 0.5) * 12}deg) translateY(${(rnd(k + seed + 1) - 0.5) * 16}px) scale(${interpolate(p, [0, 1], [2, 1])})`, opacity: Math.min(1, p * 2)}}>{ch}</div>
        );
      })}
    </div>
  );
};

export const Seal = ({text, angle = -7, f, at, fps, pos, size = 60}) => {
  const p = spring({frame: f - at, fps, config: {damping: 8, stiffness: 220}});
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', ...pos, zIndex: 42, transform: `rotate(${angle}deg) scale(${interpolate(p, [0, 1], [2.4, 1])})`, opacity: Math.min(1, p * 1.6),
      padding: '10px 28px', borderRadius: 16, border: `7px solid ${A.gold}`, background: 'rgba(20,28,85,0.96)', fontFamily: TITLE, fontWeight: 900, fontSize: size, letterSpacing: 2,
      whiteSpace: 'nowrap', ...GTEXT()}}>{text}</div>
  );
};

// --- 1. Хук: полутоновая вырезка-портрет с кнопкой ------------------------------------------------------------------
export const HeroC = ({dur, scene}) => {
  const {f, fps, inP, out} = useScene(dur);
  const killAt = rel(scene.killAt, scene, fps), sealAt = rel(scene.sealAt, scene, fps);
  const gk = interpolate(f, [killAt - 4, killAt + 6], [0, 1], clamp);
  return (
    <Shell {...{f, fps, scene, inP, out}}>
      <div style={{position: 'absolute', left: 0, width: 1080, top: 470, textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 235, lineHeight: 1,
        opacity: (1 - gk) * 0.95, transform: `scale(${1 + gk * 0.3})`, filter: `blur(${gk * 10}px)`, WebkitTextStroke: '3px rgba(255,255,255,0.85)', color: 'transparent'}}>ГЕНИЙ</div>
      <div style={{position: 'absolute', left: 0, width: 1080, top: 420, textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 330, lineHeight: 1,
        opacity: gk, transform: `scale(${0.7 + 0.3 * gk})`, ...GTEXT()}}>УБИЛ</div>
      <CutImg file="cut_leoni.png" x={250} y={800} w={580} rot={-3} f={f} at={4} fps={fps} pin />
      <Excl x={110} y={1000} s={1} rot={-14} f={f} at={killAt + 2} fps={fps} />
      <Excl x={800} y={760} s={0.8} rot={12} f={f} at={killAt + 8} fps={fps} />
      <Tape text="КАРАВАДЖО" x={90} y={1490} rot={-2} f={f} at={14} fps={fps} />
      <Seal text="ПРИГОВОР" f={f} at={sealAt} fps={fps} angle={-8} size={64} pos={{left: 520, top: 1480}} />
    </Shell>
  );
};

// --- 3. Приговор: газетная стопка, лента с именем, вырезка и красный штамп ----------------------------------------------------------------
export const SentenceC = ({dur, scene}) => {
  const {f, fps, inP, out} = useScene(dur);
  const nameAt = rel(scene.nameAt, scene, fps), headAt = rel(scene.scrollAt, scene, fps), sealAt = rel(scene.sealAt, scene, fps), portAt = nameAt + 14;
  const PX = 90, PY = 440;
  const paper = spring({frame: f, fps, config: {damping: 14, stiffness: 110}});
  const hp = spring({frame: f - headAt, fps, config: {damping: 9, stiffness: 200}});
  const sp = spring({frame: f - sealAt, fps, config: {damping: 7, stiffness: 220}});
  const word = 'ПРИГОВОР';
  const shown = Math.max(0, Math.min(word.length, Math.floor((f - headAt) * 0.9)));
  return (
    <Shell {...{f, fps, scene, inP, out}}>
      <img src={asset('paper_stack.png')} style={{position: 'absolute', left: PX, top: PY, width: 900, zIndex: 10, transform: `translateY(${(1 - Math.min(paper, 1)) * 700}px) rotate(${(1 - Math.min(paper, 1)) * -10}deg)`,
        filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.45))'}} />
      <div style={{position: 'absolute', left: PX + 170, top: PY + 190, width: 560, textAlign: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 26, letterSpacing: 8, color: '#5a4a30', zIndex: 14}}>ХРОНИКА · РИМ · 1606</div>
      <div style={{position: 'absolute', left: PX + 170, top: PY + 232, width: 560, height: 4, background: '#5a4a30', zIndex: 14, opacity: 0.6}} />
      <Tape text="† РАНУЧО ТОМАССОНИ" x={PX + 160} y={PY + 280} rot={-2.5} f={f} at={nameAt} fps={fps} size={42} />
      <CutImg file="cut_leoni.png" x={PX + 510} y={PY + 365} w={220} rot={5} f={f} at={portAt} fps={fps} pin />
      <div style={{position: 'absolute', left: PX + 160, top: PY + 440, zIndex: 16}}>
        {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{width: 260 - (i % 2) * 40, height: 10, marginBottom: 16, background: 'rgba(40,34,24,0.45)', borderRadius: 3}} />)}
      </div>
      <div style={{position: 'absolute', left: PX + 120, top: PY + 690, width: 680, textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 132, lineHeight: 1, color: '#111', zIndex: 18,
        letterSpacing: 2, transform: `scale(${interpolate(hp, [0, 1], [1.3, 1])})`, opacity: Math.min(1, hp * 2)}}>{word.slice(0, shown)}</div>
      {f >= sealAt - 8 && (
        <div style={{position: 'absolute', left: PX + 240, top: PY + 840, zIndex: 30, padding: '8px 38px', border: `10px solid ${RED}`, color: RED, fontFamily: TITLE, fontWeight: 900, fontSize: 100,
          letterSpacing: 4, background: 'rgba(245,235,215,0.55)', transform: `rotate(-7deg) scale(${interpolate(sp, [0, 1], [2.5, 1])})`, opacity: Math.min(1, sp * 1.8), whiteSpace: 'nowrap'}}>К СМЕРТИ</div>
      )}
      <Excl x={PX + 700} y={PY + 560} s={0.7} rot={10} f={f} at={sealAt} fps={fps} />
    </Shell>
  );
};

// --- 6. Монтаж шедевров в виде вырезок -------------------------------------------------------------------------------------------------
export const MontageC = ({dur, scene}) => {
  const {f, fps, inP, out} = useScene(dur);
  const textAt = rel(scene.textAt, scene, fps);
  const T = scene.tiles;
  return (
    <Shell {...{f, fps, scene, inP, out}}>
      <CutImg file="cut_judith.png" x={30} y={520} w={500} rot={-7} f={f} at={rel(T[0].at, scene, fps)} fps={fps} pin />
      <CutImg file="cut_mercy.png" x={520} y={600} w={470} rot={6} f={f} at={rel(T[1].at, scene, fps)} fps={fps} from="bottom" pin />
      <CutImg file="cut_lucy.png" x={200} y={930} w={520} rot={-3} f={f} at={rel(T[2].at, scene, fps)} fps={fps} pin />
      <WordTiles text="ШЕДЕВРЫ" x={90} y={1380} f={f} at={textAt} fps={fps} w={104} h={130} size={90} seed={3} />
      <Excl x={850} y={1000} s={0.8} rot={14} f={f} at={textAt + 4} fps={fps} />
    </Shell>
  );
};

// --- 8. Лицо Голиафа и лицо автора ----------------------------------------------------------------------------------------------------------------
export const CompareC = ({dur, scene}) => {
  const {f, fps, inP, out} = useScene(dur);
  const eqAt = rel(scene.eqAt, scene, fps), stampAt = rel(scene.stampAt, scene, fps);
  const eq = spring({frame: f - eqAt, fps, config: {damping: 7, stiffness: 220}});
  return (
    <Shell {...{f, fps, scene, inP, out}}>
      <CutImg file="cut_goliath.png" x={20} y={560} w={500} rot={-5} f={f} at={2} fps={fps} pin />
      <CutImg file="cut_leoni.png" x={560} y={540} w={480} rot={5} f={f} at={8} fps={fps} pin />
      <Tape text="ГОЛОВА ГОЛИАФА" x={70} y={1210} rot={-3} f={f} at={14} fps={fps} size={34} />
      <Tape text="КАРАВАДЖО" x={640} y={1230} rot={3} f={f} at={18} fps={fps} size={34} />
      {f >= eqAt && (
        <div style={{position: 'absolute', left: 420, top: 800, width: 240, height: 240, borderRadius: '50%', background: A.gold, boxShadow: '0 0 60px 20px rgba(212,166,74,0.6)', zIndex: 44,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 190, color: A.deep, transform: `scale(${Math.min(eq, 1.15)})`, opacity: Math.min(1, eq * 2)}}>=</div>
      )}
      <Seal text="САМОПОРТРЕТ" f={f} at={stampAt} fps={fps} angle={-6} size={62} pos={{left: 250, top: 1340}} />
    </Shell>
  );
};
