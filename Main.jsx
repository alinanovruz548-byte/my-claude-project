import React from 'react';
import {
  AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate,
  Easing, staticFile, delayRender, continueRender,
} from 'remotion';
import {script, words} from './current';
import {NoirMain} from './Noir';
import {AuroraMain} from './Aurora';
import {BoardMain} from './Board';
import {Board10Main} from './Board10';
import {Board11Main} from './Board11';
import {Board12Main} from './Board12';
import {Board13Main} from './Board13';
import {Board14Main} from './Board14';
import {Board15Main} from './Board15';
import {Board16Main} from './Board16';
import {Board16bMain} from './Board16b';
import {Board17Main} from './Board17';
import {Board18Main} from './Board18';
import {Board19Main} from './Board19';
import {Board20Main} from './Board20';
import {Board21Main} from './Board21';
import {Board22Main} from './Board22';
import {Board23Main} from './Board23';
import {Board24Main} from './Board24';
import {Board25Main} from './Board25';
import {Board26Main} from './Board26';
import {Board27Main} from './Board27';
import {Board28Main} from './Board28';
import {Board29Main} from './Board29';
import {Board29vMain} from './Board29v';
import {Board30Main} from './Board30';
import {Board32Main} from './Board32';
import {Board31Main} from './Board31';
import {Calendar, Gallery, Lineup, Smile, Flip} from './Extra';
import {Theft, Ransom, Deathbed} from './Extra6';
import {Sneak, Grave} from './Extra6b';
import {Duel, Ages, Tally, Tiles26} from './Extra7';
import {Hero9, Court9, Doc9, Press9, Truth9, Power9, Academy9} from './Extra9';

const C = {
  bg: '#F5EFE6', ink: '#1E1E1E', blue: '#2B3FA0', gold: '#D4A64A', grey: '#A9A298', card: '#FFFFFF',
};
const TITLE = '"Playfair Display", serif';
const BODY = 'Manrope, sans-serif';

const useFonts = () => {
  const [h] = React.useState(() => delayRender('fonts'));
  React.useEffect(() => {
    const fonts = [
      new FontFace('Playfair Display', `url(${staticFile('fonts/PlayfairDisplay-VF.ttf')})`, {weight: '400 900'}),
      new FontFace('Manrope', `url(${staticFile('fonts/Manrope-VF.ttf')})`, {weight: '200 800'}),
    ];
    Promise.all(fonts.map((f) => f.load())).then((l) => {
      l.forEach((f) => document.fonts.add(f));
      continueRender(h);
    });
  }, [h]);
};

const t0 = (i) => words[i].start;
const sec = (s, fps) => Math.round(s * fps);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
const ease = Easing.bezier(0.16, 1, 0.3, 1);

// --- фон --------------------------------------------------------------------
const Background = () => {
  const f = useCurrentFrame();
  const a = Math.sin(f / 70) * 40;
  const b = Math.cos(f / 90) * 50;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <div style={{position: 'absolute', left: -200 + a, top: 300 + b, width: 900, height: 900, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(43,63,160,0.10), rgba(43,63,160,0) 65%)'}} />
      <div style={{position: 'absolute', right: -250 - a, top: 1000 - b, width: 900, height: 900, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,166,74,0.16), rgba(212,166,74,0) 65%)'}} />
    </AbsoluteFill>
  );
};

// --- субтитры сверху (как в mona_lisa_remotion_v3) ---------------------------
const Captions = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const now = f / fps;
  let chunk = null;
  for (const c of script.captions) {
    if (now >= t0(c[0][1]) - 0.06) chunk = c;
  }
  if (!chunk) return null;
  const a = Math.min(1, Math.max(0, (now - (t0(chunk[0][1]) - 0.06)) / 0.2));
  return (
    <div style={{position: 'absolute', left: 80, top: 170, width: 920, textAlign: 'center', fontFamily: BODY, fontWeight: 800,
      fontSize: 68, lineHeight: 1.16, opacity: a, filter: `blur(${(1 - a) * 8}px)`, transform: `translateY(${(1 - a) * 12}px)`,
      textWrap: 'balance'}}>
      {chunk.map(([txt, s0], i) => (
        <span key={i} style={{color: now >= words[s0].start ? C.ink : 'rgba(30,30,30,0.27)'}}>{txt}{' '}</span>
      ))}
    </div>
  );
};

// --- нижняя схема «дело» ------------------------------------------------------
const Diagram = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const nodes = script.diagram.nodes;
  const X0 = 150, X1 = 930, Y = 1560;
  const xs = nodes.map((_, i) => X0 + ((X1 - X0) * i) / (nodes.length - 1));
  const times = nodes.map((n) => sec(t0(n.at), fps));
  const lastDone = times.filter((t) => f >= t).length - 1;
  let fill = 0;
  if (lastDone >= 0) {
    fill = xs[lastDone];
    if (lastDone < nodes.length - 1) {
      const p = interpolate(f, [times[lastDone], times[lastDone + 1]], [0, 1], clamp);
      fill = xs[lastDone] + (xs[lastDone + 1] - xs[lastDone]) * p * 0.85;
    }
  }
  const appear = interpolate(f, [0, 12], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: appear}}>
      <div style={{position: 'absolute', left: 60, top: Y - 90, fontFamily: BODY, fontWeight: 800, fontSize: 26,
        letterSpacing: 4, color: C.grey}}>{script.diagram.title}</div>
      <div style={{position: 'absolute', left: X0, top: Y - 3, width: X1 - X0, height: 6, borderRadius: 3, background: '#DDD5C8'}} />
      <div style={{position: 'absolute', left: X0, top: Y - 3, width: Math.max(0, fill - X0), height: 6, borderRadius: 3, background: C.blue}} />
      {nodes.map((n, i) => {
        const done = f >= times[i];
        const last = i === nodes.length - 1;
        const pop = spring({frame: f - times[i], fps, config: {damping: 10, stiffness: 180}});
        const col = last ? C.gold : C.blue;
        return (
          <div key={i}>
            <div style={{position: 'absolute', left: xs[i] - 17, top: Y - 17, width: 34, height: 34, borderRadius: '50%',
              background: done ? col : C.bg, border: `5px solid ${done ? col : '#CFC6B8'}`,
              transform: `scale(${done ? 0.8 + 0.4 * Math.min(pop, 1.2) : 1})`}} />
            <div style={{position: 'absolute', left: xs[i] - 120, top: Y + 34, width: 240, textAlign: 'center',
              fontFamily: BODY, fontSize: 28, fontWeight: 800, color: done ? C.ink : '#C2B9AB'}}>{n.label}</div>
            <div style={{position: 'absolute', left: xs[i] - 120, top: Y + 70, width: 240, textAlign: 'center',
              fontFamily: BODY, fontSize: 24, fontWeight: 600, color: done ? C.grey : '#D2C9BB'}}>{n.sub}</div>
          </div>
        );
      })}
    </div>
  );
};

// --- общие кирпичики ---------------------------------------------------------
const Badge = ({text, p}) => !text ? null : (
  <div style={{position: 'absolute', left: -24, top: -44, padding: '16px 34px', borderRadius: 22, background: C.blue,
    color: '#fff', fontFamily: TITLE, fontWeight: 800, fontSize: 52, boxShadow: '0 14px 30px rgba(43,63,160,0.35)',
    transform: `rotate(-4deg) scale(${p})`, transformOrigin: 'left bottom', zIndex: 5}}>{text}</div>
);

const Chip = ({text, p}) => (
  <div style={{position: 'absolute', left: '50%', bottom: -34, transform: `translateX(-50%) scale(${p})`, zIndex: 5,
    padding: '16px 36px', borderRadius: 40, background: '#fff', color: C.ink, fontFamily: BODY, fontWeight: 800,
    fontSize: 36, whiteSpace: 'nowrap', boxShadow: '0 10px 26px rgba(30,30,30,0.18)'}}>{text}</div>
);

const Stamp = ({text, angle, frame, at, fps, pos}) => {
  const p = spring({frame: frame - at, fps, config: {damping: 8, stiffness: 220}});
  if (frame < at) return null;
  const s = interpolate(p, [0, 1], [2.4, 1]);
  return (
    <div style={{position: 'absolute', ...pos, zIndex: 8, transform: `rotate(${angle}deg) scale(${s})`,
      opacity: Math.min(1, p * 1.6), padding: '10px 26px', border: `8px solid ${C.blue}`, borderRadius: 14,
      color: C.blue, background: 'rgba(245,239,230,0.88)', fontFamily: TITLE, fontWeight: 900, fontSize: 62,
      letterSpacing: 2, whiteSpace: 'nowrap'}}>{text}</div>
  );
};

// плавный вход/выход сцены
const useSceneFx = (dur) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inP = spring({frame: f, fps, config: {damping: 15, stiffness: 140}});
  const out = interpolate(f, [dur - 6, dur], [0, 1], clamp);
  return {f, fps, inP, out};
};

const CARD_W = 918, CARD_H0 = 940, CARD_TOP0 = 400;

const DIRS = ['b', 'r', 'l', 't'];
const DV = {b: [0, 1], r: [1, 0], l: [-1, 0], t: [0, -1]};

// обводка «от руки»: эллипс дорисовывается по кругу
const Ring = ({cx, cy, rx, ry, sf}) => {
  const len = 2 * Math.PI * Math.sqrt((rx * rx + ry * ry) / 2);
  const p = interpolate(sf, [4, 20], [0, 1], {...clamp, easing: ease});
  const pulse = 1 + Math.sin(sf / 6) * 0.015 * Math.min(1, p);
  return (
    <svg width={CARD_W} height={CARD_W * 1.3} style={{position: 'absolute', left: 0, top: 0, zIndex: 4, overflow: 'visible'}}>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={C.blue} strokeWidth="12" strokeLinecap="round"
        strokeDasharray={len} strokeDashoffset={len * (1 - p)} transform={`translate(${cx} ${cy}) rotate(-12) scale(${pulse}) translate(${-cx} ${-cy})`}
        style={{filter: 'drop-shadow(0 6px 10px rgba(43,63,160,0.35))'}} />
    </svg>
  );
};

// стикер-подпись, «шлёпается» поверх фото
const Note = ({note, sf, fps}) => {
  const p = spring({frame: sf - 8, fps, config: {damping: 9, stiffness: 200}});
  if (sf < 8) return null;
  return (
    <div style={{position: 'absolute', left: note.pos[0], top: note.pos[1], zIndex: 7, padding: '12px 30px', borderRadius: 18,
      background: '#fff', color: C.blue, border: `6px solid ${C.blue}`, fontFamily: TITLE, fontWeight: 900, fontSize: 58,
      whiteSpace: 'nowrap', boxShadow: '0 14px 30px rgba(30,30,30,0.25)',
      transform: `rotate(${note.angle || -5}deg) scale(${interpolate(p, [0, 1], [2.2, 1])})`, opacity: Math.min(1, p * 1.6)}}>{note.text}</div>
  );
};

// тюбик падает в землю, на могилке вырастает крест
const Burial = ({sf, top}) => {
  const fall = interpolate(sf, [0, 22], [-150, 70], {...clamp, easing: Easing.in(Easing.quad)});
  const cross = spring({frame: sf - 22, fps: 30, config: {damping: 8, stiffness: 200}});
  const pop = spring({frame: sf, fps: 30, config: {damping: 12, stiffness: 160}});
  return (
    <div style={{position: 'absolute', left: 28, top, width: 330, height: 300, zIndex: 6, borderRadius: 32, overflow: 'hidden',
      background: '#F3E9D6', boxShadow: '0 24px 50px rgba(30,30,30,0.35)', border: `8px solid ${C.blue}`,
      transform: `scale(${Math.min(pop, 1.05)})`}}>
      <svg width="330" height="300" viewBox="0 0 330 300">
        <g transform={`translate(165 ${fall}) rotate(${-20 + sf * 0.4})`}>
          <rect x="-28" y="-96" width="56" height="120" rx="10" fill="#8A5A2B" />
          <rect x="-20" y="-120" width="40" height="28" rx="6" fill="#D9D3C7" />
          <rect x="-28" y="18" width="56" height="14" rx="3" fill="#5C3B1E" />
        </g>
        <path d="M0 215 Q 80 185 165 200 T 330 205 V300 H0 Z" fill="#6B4A2B" />
        <path d="M0 250 Q 90 232 165 244 T 330 246 V300 H0 Z" fill="#553920" />
        <g transform={`translate(165 205) scale(${Math.min(cross, 1.1)})`} style={{transformOrigin: '165px 205px'}}>
          <rect x="-8" y="-110" width="16" height="108" rx="3" fill="#F5EFE6" stroke="#1E1E1E" strokeWidth="3" />
          <rect x="-34" y="-86" width="68" height="16" rx="3" fill="#F5EFE6" stroke="#1E1E1E" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
};

const CounterBig = ({c, f, startF, fps}) => {
  const a = sec(t0(c.at), fps) - startF;
  const p = interpolate(f, [a, a + 26], [0, 1], {...clamp, easing: ease});
  const pop = spring({frame: f - a, fps, config: {damping: 10, stiffness: 170}});
  if (f < a) return null;
  return (
    <div style={{position: 'absolute', left: c.pos[0], top: c.pos[1], zIndex: 7, fontFamily: TITLE, fontWeight: 900, fontSize: 210,
      lineHeight: 1, color: C.blue, WebkitTextStroke: '14px #fff', paintOrder: 'stroke fill',
      textShadow: '0 12px 26px rgba(0,0,0,0.35)', transform: `scale(${Math.min(pop, 1.1)}) rotate(-4deg)`}}>
      {Math.round(c.from + (c.to - c.from) * p)}
    </div>
  );
};

const Timer = ({tm, f, startF, fps}) => {
  const a = sec(t0(tm.at), fps) - startF;
  const p = interpolate(f, [a, a + 45], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const pop = spring({frame: f - a, fps, config: {damping: 10, stiffness: 170}});
  if (f < a) return null;
  const R = 112, L = 2 * Math.PI * R;
  return (
    <div style={{position: 'absolute', right: -20, top: -60, width: 290, height: 290, zIndex: 7, borderRadius: '50%', background: '#fff',
      boxShadow: '0 24px 50px rgba(30,30,30,0.35)', transform: `scale(${Math.min(pop, 1.08)}) rotate(6deg)`}}>
      <svg width="290" height="290" viewBox="0 0 290 290" style={{position: 'absolute', inset: 0}}>
        <circle cx="145" cy="145" r={R} fill="none" stroke="#E4DCCD" strokeWidth="16" />
        <circle cx="145" cy="145" r={R} fill="none" stroke={C.blue} strokeWidth="16" strokeLinecap="round"
          strokeDasharray={L} strokeDashoffset={L * (1 - p)} transform="rotate(-90 145 145)" />
      </svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: TITLE, fontWeight: 900, color: C.blue}}>
        <div style={{fontSize: 110, lineHeight: 1}}>{Math.round(tm.to * p)}</div>
        <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 30, color: C.ink, letterSpacing: 2}}>{tm.label}</div>
      </div>
    </div>
  );
};

// реплики-«пузыри» с хохотом и фырканьем вокруг картины
const Bubble = ({b, f, startF, fps}) => {
  const a = sec(t0(b.at), fps) - startF;
  const p = spring({frame: f - a, fps, config: {damping: 8, stiffness: 210}});
  if (f < a) return null;
  return (
    <div style={{position: 'absolute', left: b.pos[0], top: b.pos[1] + Math.sin((f - a) / 5) * 5, zIndex: 9, padding: '10px 28px', borderRadius: 34, background: '#fff', color: C.blue,
      border: `6px solid ${C.blue}`, fontFamily: TITLE, fontWeight: 900, fontSize: 54, whiteSpace: 'nowrap', boxShadow: '0 14px 30px rgba(30,30,30,0.25)',
      transform: `rotate(${b.angle || 5}deg) scale(${interpolate(p, [0, 1], [0.2, 1])})`, opacity: Math.min(1, p * 2)}}>
      {b.text}
      <div style={{position: 'absolute', left: 36, bottom: -20, width: 26, height: 26, background: '#fff', borderRight: `6px solid ${C.blue}`, borderBottom: `6px solid ${C.blue}`,
        transform: 'rotate(45deg) skew(10deg, 10deg)'}} />
    </div>
  );
};

const PhotoCard = ({scene, dur}) => {
  const {f, fps, inP, out} = useSceneFx(dur);
  const CARD_H = scene.h || CARD_H0, CARD_TOP = scene.top || CARD_TOP0;
  const im0 = script.images[scene.image];
  const CW = scene.fit ? Math.round((CARD_H - 28) * im0.size[0] / im0.size[1]) + 28 : CARD_W;
  const startF = sec(t0(scene.from), fps);
  let pnch = 0;
  (scene.punches || []).forEach((w) => { const pf = sec(t0(w), fps) - startF; if (f >= pf) pnch += 0.1 * Math.exp(-(f - pf) / 4.5); });
  const zp = interpolate(f, [0, 9], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const zoomE = scene.enter === 'zoom' ? (1 - zp) * 0.45 : 0;
  const shots = scene.shots || [{at: scene.from, focus: scene.focus, zoom: 1}];
  const at = (i) => sec(t0(shots[i].at), fps) - startF;
  let si = 0;
  shots.forEach((_, i) => { if (f >= at(i)) si = i; });
  const shot = shots[si];
  const img = script.images[shot.image || scene.image];
  const [iw, ih] = img.size;
  const base = Math.max((CW - 28) / iw, (CARD_H - 28) / ih);
  const sf = Math.max(0, f - at(si));
  const len = Math.max(1, (shots[si + 1] ? at(si + 1) : dur) - at(si));
  const cut = si > 0 ? 1 : 0;
  const punch = cut * 0.12 * Math.exp(-sf / 4);
  const sc = base * (shot.zoom || 1) * (scene.fit ? 1 + 0.03 * (sf / len) : 1.04 + 0.12 * (sf / len)) * (1 + punch);
  const fx = shot.focus || scene.focus;
  const ox = (CW - 28) / 2 - fx[0] * iw * sc;
  const oy = (CARD_H - 28) / 2 - fx[1] * ih * sc;
  const cx = Math.min(0, Math.max(CW - 28 - iw * sc, ox));
  const cy = Math.min(0, Math.max(CARD_H - 28 - ih * sc, oy));
  // въезд с разных сторон, выезд в обратную
  const dir = DV[scene.enter || DIRS[scene.id % 4]];
  const side = dir[0] !== 0;
  const e = 1 - inP;
  const tx = dir[0] * e * 1300 - dir[0] * out * 500;
  const ty = dir[1] * e * 900 - dir[1] * out * 500;
  const rot = scene.tilt * Math.min(inP, 1) + e * (side ? dir[0] * 16 : 10)
    + (si % 2 ? 1 : -1) * cut * 3.5 * Math.exp(-sf / 5) * Math.cos(sf * 0.9);
  const lo = scene.loupe;
  const loP = lo ? spring({frame: f - sec(t0(lo.at), fps) + startF, fps, config: {damping: 11, stiffness: 150}}) : 0;
  const lz = lo ? sc * lo.zoom : 1;
  const LS = 380;
  const stampAt = scene.stamp ? sec(t0(scene.stamp.at), fps) - startF : 0;
  const shake = scene.stamp && f >= stampAt && f < stampAt + 8 ? Math.sin(f * 4) * 10 * (1 - (f - stampAt) / 8) : 0;
  const ghostX = 90 - f * 3.2;
  return (
    <>
      {scene.bgYear && f >= sec(t0(scene.bgYear.at), fps) - startF && (() => {
        const a = sec(t0(scene.bgYear.at), fps) - startF;
        const k = f - a;
        const yv = Math.round(interpolate(k, [0, 24], [scene.bgYear.from, scene.bgYear.to], {...clamp, easing: ease}));
        return (
          <div style={{position: 'absolute', left: 0, width: 1080, top: CARD_TOP + CARD_H / 2 - 260, textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 430, lineHeight: 1,
            color: C.blue, opacity: interpolate(k, [0, 10], [0, 0.4], clamp) * (1 - out), filter: 'blur(9px)', transform: `scale(${interpolate(k, [0, 90], [0.7, 1.45], clamp)})`}}>{yv}</div>
        );
      })()}
      {scene.ghost && (
        <div style={{position: 'absolute', left: ghostX, top: CARD_TOP + CARD_H / 2 - 230, fontFamily: TITLE, fontWeight: 900,
          fontSize: 460, lineHeight: 1, whiteSpace: 'nowrap', color: 'rgba(43,63,160,0.08)', opacity: Math.min(1, inP) * (1 - out)}}>{scene.ghost}</div>
      )}
      <div style={{position: 'absolute', left: (1080 - CW) / 2 + shake, top: CARD_TOP, width: CW, height: CARD_H,
        transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${(1 - out * 0.05) * (1 + pnch + zoomE)})`, filter: zoomE > 0 ? `blur(${zoomE * 30}px)` : undefined, opacity: Math.min(1, inP * 2.5) * (1 - out)}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 38, overflow: 'hidden', background: '#fff',
          boxShadow: '0 40px 80px rgba(30,30,30,0.28)', border: '14px solid #fff'}}>
          <div style={{position: 'absolute', inset: 0, borderRadius: 26, overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: cx, top: cy, width: iw * sc, height: ih * sc,
              backgroundImage: `url(${staticFile(img.file)})`, backgroundSize: '100% 100%'}} />
            {cut ? <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: 0.55 * Math.exp(-sf / 2.5)}} /> : null}
            {scene.night && (
              <div style={{position: 'absolute', inset: 0}}>
                <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(8,14,60,0.72), rgba(10,18,70,0.45))'}} />
                {Array.from({length: 18}).map((_, i) => (
                  <div key={i} style={{position: 'absolute', left: (i * 211) % 860, top: (i * 97) % 300, width: 5, height: 5, borderRadius: '50%', background: '#fff',
                    opacity: 0.4 + 0.5 * Math.abs(Math.sin(f / 9 + i))}} />
                ))}
                <div style={{position: 'absolute', right: 60, top: 40, width: 150, height: 150, borderRadius: '50%', background: '#F6EBC0', boxShadow: '0 0 80px 30px rgba(246,235,192,0.5)',
                  transform: `translateY(${Math.sin(f / 20) * 6}px)`}}>
                  <div style={{position: 'absolute', left: 38, top: 20, width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.07)'}} />
                </div>
              </div>
            )}
          </div>
        </div>
        <Badge text={scene.badge} p={Math.min(inP, 1.1)} />
        {scene.headline && (
          <div style={{position: 'absolute', left: -60, width: CARD_W + 120, top: -330, textAlign: 'center', transform: `scale(${Math.min(inP, 1.05)})`}}>
            <div style={{fontFamily: TITLE, fontWeight: 900, fontSize: (scene.headlineSize || [200, 92])[0], lineHeight: 1, color: C.blue}}>{scene.headline[0]}</div>
            <div style={{fontFamily: TITLE, fontWeight: 800, fontSize: (scene.headlineSize || [200, 92])[1], lineHeight: 1.1, color: C.ink}}>{scene.headline[1]}</div>
          </div>
        )}
        {shot.ring && <Ring key={si} cx={CARD_W / 2 + (shot.ring.dx || 0)} cy={CARD_H / 2 + (shot.ring.dy || 0)}
          rx={shot.ring.rx} ry={shot.ring.ry} sf={sf} />}
        {shot.note && <Note note={shot.note} sf={sf} fps={fps} />}
        {(scene.bubbles || []).map((b, i) => <Bubble key={i} b={b} f={f} startF={startF} fps={fps} />)}
        {scene.rain && f >= sec(t0(scene.rain.at), fps) - startF && Array.from({length: 18}).map((_, i) => {
          const k = f - (sec(t0(scene.rain.at), fps) - startF);
          const x = ((i * 137) % (CW - 80)) + 10, sp = 9 + (i % 5) * 2.6;
          const y = -80 + k * sp - (i % 6) * 120;
          if (y < -80 || y > CARD_H) return null;
          return (
            <div key={i} style={{position: 'absolute', left: x, top: y, width: 62, height: 62, borderRadius: '50%', zIndex: 8, background: 'radial-gradient(circle at 35% 30%, #FBE6A3, #D4A64A 60%, #A67C27)',
              border: '4px solid #8a6419', boxShadow: '0 8px 14px rgba(0,0,0,0.3)', transform: `rotate(${k * 9 + i * 30}deg) scaleX(${0.5 + 0.5 * Math.abs(Math.cos(k / 5 + i))})`}} />
          );
        })}
        {scene.counter && <CounterBig c={scene.counter} f={f} startF={startF} fps={fps} />}
        {scene.timer && <Timer tm={scene.timer} f={f} startF={startF} fps={fps} />}
        {lo && loP > 0.01 && (
          <div style={{position: 'absolute', left: lo.pos[0], top: lo.pos[1], width: LS, height: LS, borderRadius: '50%',
            border: `12px solid ${C.blue}`, overflow: 'hidden', boxShadow: '0 24px 50px rgba(30,30,30,0.4)', zIndex: 6,
            transform: `scale(${loP})`, background: '#fff'}}>
            <div style={{position: 'absolute', width: iw * lz, height: ih * lz,
              left: LS / 2 - lo.target[0] * iw * lz, top: LS / 2 - lo.target[1] * ih * lz,
              backgroundImage: `url(${staticFile(img.file)})`, backgroundSize: '100% 100%'}} />
          </div>
        )}
        {scene.burial && f >= sec(t0(scene.burial.at), fps) - startF &&
          <Burial sf={f - (sec(t0(scene.burial.at), fps) - startF)} top={CARD_H - 330} />}
        {scene.stamp && <Stamp text={scene.stamp.text} angle={scene.stamp.angle} frame={f} fps={fps}
          at={stampAt} pos={scene.stamp.pos || {right: 10, top: CARD_H - 200}} />}
        <Chip text={scene.chip} p={Math.min(spring({frame: f - 6, fps, config: {damping: 12}}), 1.1)} />
      </div>
    </>
  );
};

// переходы на стыках сцен: у каждого стыка свой (поле trans в сценарии), центр перехода = начало слова
const rnd = (n) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
const TransFx = ({type, d, seed}) => {
  const bandStyle = (color, skew, from, to) => ({position: 'absolute', top: 0, left: 0, width: 760, height: 1920, background: color, opacity: 0.94,
    transform: `translateX(${interpolate(d, [0, 11], [from, to])}px) skewX(${skew}deg)`});
  if (type === 'band') return <div style={bandStyle(C.blue, -14, -1500, 1500)} />;
  if (type === 'diag') return <div style={bandStyle(C.gold, 14, 1500, -1500)} />;
  if (type === 'flash') return <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: interpolate(d, [0, 4, 11], [0, 1, 0])}} />;
  if (type === 'circle') {
    const r = 1500 * Math.sin(Math.PI * d / 11);
    return <div style={{position: 'absolute', left: 540 - r, top: 960 - r, width: r * 2, height: r * 2, borderRadius: '50%', background: C.blue}} />;
  }
  if (type === 'slices') {
    return Array.from({length: 8}).map((_, i) => {
      const x = interpolate(d, [i * 0.4, 5 + i * 0.4, 11], [(i % 2 ? 1 : -1) * 1100, 0, (i % 2 ? -1 : 1) * 1100], clamp);
      return <div key={i} style={{position: 'absolute', left: 0, top: i * 240, width: 1080, height: 241, background: i % 2 ? C.gold : C.blue, transform: `translateX(${x}px)`}} />;
    });
  }
  if (type === 'glitch') {
    if (d % 2) return null;
    return Array.from({length: 5}).map((_, i) => (
      <div key={i} style={{position: 'absolute', left: 0, top: rnd(seed + d + i) * 1700, width: 1080, height: 40 + rnd(seed + i * 3 + d) * 150,
        background: i % 2 ? C.gold : C.blue, opacity: 0.9, transform: `translateX(${(rnd(seed + d * 7 + i) - 0.5) * 220}px)`}} />
    ));
  }
  if (type === 'zoom') {
    const o = interpolate(d, [0, 5, 11], [0, 0.95, 0], clamp);
    return (
      <>
        <div style={{position: 'absolute', inset: -400, opacity: o, transform: `scale(${1 + d * 0.12}) rotate(${d * 2}deg)`,
          background: `repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.95) 0deg 3deg, ${C.blue} 3deg 9deg)`,
          WebkitMaskImage: 'radial-gradient(circle, transparent 8%, #000 70%)', maskImage: 'radial-gradient(circle, transparent 8%, #000 70%)'}} />
        <div style={{position: 'absolute', inset: 0, opacity: interpolate(d, [3, 5, 8], [0, 1, 0], clamp), background: '#fff'}} />
      </>
    );
  }
  if (type === 'shatter') {
    return Array.from({length: 60}).map((_, k) => {
      const i = k % 6, j = Math.floor(k / 6);
      const dl = (i + j) * 0.28 + rnd(seed + k) * 1.2;
      const sc = interpolate(d, [dl, dl + 3.5, dl + 6.5], [0, 1.05, 0], clamp);
      return <div key={k} style={{position: 'absolute', left: i * 180, top: j * 192, width: 181, height: 193, background: (i + j) % 3 === 0 ? C.gold : (i + j) % 3 === 1 ? C.blue : '#fff',
        transform: `scale(${sc}) rotate(${(1 - sc) * 70}deg)`}} />;
    });
  }
  if (type === 'spin') {
    const a = interpolate(d, [0, 5.5], [0, 360], clamp), b = interpolate(d, [5.5, 11], [0, 360], clamp);
    return <div style={{position: 'absolute', inset: 0, background: d < 5.5
      ? `conic-gradient(from 0deg at 50% 50%, ${C.blue} 0deg ${a}deg, transparent ${a}deg)`
      : `conic-gradient(from 0deg at 50% 50%, transparent 0deg ${b}deg, ${C.blue} ${b}deg 360deg)`}} />;
  }
  if (type === 'ink') {
    return Array.from({length: 4}).map((_, i) => {
      const r = 620 * Math.sin(Math.PI * Math.min(1, Math.max(0, (d - i * 0.8) / 9)));
      return <div key={i} style={{position: 'absolute', left: 120 + rnd(seed + i) * 840 - r, top: 300 + rnd(seed + i + 9) * 1300 - r, width: r * 2, height: r * 2,
        borderRadius: '50%', background: i % 2 ? C.gold : C.blue}} />;
    });
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
        return <React.Fragment key={sc.id}><TransFx type={sc.trans || 'band'} d={d} seed={sc.id * 31} /></React.Fragment>;
      })}
    </>
  );
};

// --- сцены ------------------------------------------------------------------
const Hook = ({dur}) => {
  const {f, fps, out} = useSceneFx(dur);
  const a = spring({frame: f, fps, config: {damping: 11, stiffness: 150}});
  const b = spring({frame: f - 14, fps, config: {damping: 11, stiffness: 150}});
  const c = spring({frame: f - 28, fps, config: {damping: 9, stiffness: 140}});
  const goldW = 300, blueW = interpolate(c, [0, 1], [300, 440]);
  return (
    <AbsoluteFill style={{opacity: 1 - out, transform: `scale(${1 - out * 0.05})`}}>
      <div style={{position: 'absolute', top: 400, width: '100%', textAlign: 'center', fontFamily: TITLE,
        fontWeight: 900, fontSize: 250, lineHeight: 1, color: C.blue, transform: `scale(${a})`}}>Синий</div>
      <div style={{position: 'absolute', top: 680, width: '100%', textAlign: 'center', fontFamily: TITLE,
        fontWeight: 800, fontSize: 120, lineHeight: 1, color: C.ink, opacity: Math.min(b, 1),
        transform: `translateY(${(1 - Math.min(b, 1)) * 40}px)`}}>дороже</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 900, height: 380, display: 'flex', justifyContent: 'center',
        alignItems: 'flex-end', gap: 36}}>
        <div style={{width: blueW, height: blueW, borderRadius: 40, background: `linear-gradient(135deg, #4A63D6, ${C.blue} 60%, #1B2A78)`,
          boxShadow: '0 30px 60px rgba(43,63,160,0.4)', transform: `rotate(-5deg) scale(${Math.min(b, 1)})`}} />
        <div style={{width: goldW, height: goldW, borderRadius: 40, background: `linear-gradient(135deg, #F1D48A, ${C.gold} 55%, #A67C27)`,
          boxShadow: '0 30px 60px rgba(212,166,74,0.45)', transform: `rotate(6deg) scale(${Math.min(b, 1)})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TITLE, fontWeight: 900,
          fontSize: 56, color: '#fff'}}>золото</div>
      </div>
    </AbsoluteFill>
  );
};

const Synth = ({dur}) => {
  const {f, fps, out} = useSceneFx(dur);
  const yearP = interpolate(f, [0, 22], [0, 1], {...clamp, easing: ease});
  const year = Math.round(1800 + 20 * yearP);
  const a = spring({frame: f - 16, fps, config: {damping: 12, stiffness: 130}});
  const bP = spring({frame: f - 36, fps, config: {damping: 12, stiffness: 130}});
  const strike = interpolate(f, [58, 70], [0, 1], clamp);
  const stamp = spring({frame: f - 74, fps, config: {damping: 8, stiffness: 220}});
  const tag = (top, p, rot, bg, color, h1, h2, extra) => (
    <div style={{position: 'absolute', left: 80, right: 80, top, height: 250, borderRadius: 36, background: bg, color,
      transform: `rotate(${rot}deg) translateX(${(1 - Math.min(p, 1)) * 1200}px)`, boxShadow: '0 30px 60px rgba(30,30,30,0.25)',
      padding: '34px 50px', fontFamily: BODY}}>
      <div style={{fontSize: 34, fontWeight: 700, opacity: 0.8}}>{h1}</div>
      <div style={{fontSize: 62, fontWeight: 800, lineHeight: 1.1, marginTop: 10, position: 'relative', display: 'inline-block'}}>
        {h2}{extra}
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{opacity: 1 - out, transform: `scale(${1 - out * 0.05})`}}>
      <div style={{position: 'absolute', top: 390, width: '100%', textAlign: 'center', fontFamily: TITLE, fontWeight: 900,
        fontSize: 230, color: C.blue, lineHeight: 1}}>{year}-е</div>
      {tag(700, a, -2, '#fff', C.ink, 'Натуральный ультрамарин', 'из лазурита · дороже золота',
        <div style={{position: 'absolute', left: -10, top: '52%', height: 8, width: `${strike * 108}%`, background: '#C0392B', borderRadius: 4}} />)}
      {tag(990, bP, 2, C.blue, '#fff', 'Синтетический аналог от химиков', 'дёшево и для всех', null)}
      {f > 74 && <div style={{position: 'absolute', right: 70, top: 1150, zIndex: 8, transform: `rotate(-8deg) scale(${interpolate(stamp, [0, 1], [2.4, 1])})`,
        opacity: Math.min(1, stamp * 1.6), padding: '8px 26px', border: `8px solid ${C.gold}`, borderRadius: 14, color: C.gold,
        background: 'rgba(245,239,230,0.92)', fontFamily: TITLE, fontWeight: 900, fontSize: 60}}>ДЕШЁВЫЙ</div>}
    </AbsoluteFill>
  );
};

const Ended = ({dur, scene}) => {
  const {f, fps, out} = useSceneFx(dur);
  const yearP = interpolate(f, [0, 26], [0, 1], {...clamp, easing: ease});
  const year = Math.round((scene.yearFrom || 1900) + ((scene.yearTo || 1964) - (scene.yearFrom || 1900)) * yearP);
  const a = spring({frame: f - 14, fps, config: {damping: 12, stiffness: 130}});
  const bP = spring({frame: f - 34, fps, config: {damping: 12, stiffness: 130}});
  const stamp = spring({frame: f - 62, fps, config: {damping: 8, stiffness: 220}});
  const tag = (top, p, rot, bg, color, h1, h2) => (
    <div style={{position: 'absolute', left: 80, right: 80, top, height: 250, borderRadius: 36, background: bg, color,
      transform: `rotate(${rot}deg) translateX(${(1 - Math.min(p, 1)) * 1200}px)`, boxShadow: '0 30px 60px rgba(30,30,30,0.25)',
      padding: '34px 50px', fontFamily: BODY}}>
      <div style={{fontSize: 34, fontWeight: 700, opacity: 0.8}}>{h1}</div>
      <div style={{fontSize: 62, fontWeight: 800, lineHeight: 1.1, marginTop: 10}}>{h2}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{opacity: 1 - out, transform: `scale(${1 - out * 0.05})`}}>
      <div style={{position: 'absolute', top: 390, width: '100%', textAlign: 'center', fontFamily: TITLE, fontWeight: 900,
        fontSize: 260, color: C.blue, lineHeight: 1}}>{year}</div>
      {scene.barLabel && (
        <div style={{position: 'absolute', left: 120, right: 120, top: 655}}>
          <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 28, letterSpacing: 3, color: C.grey, marginBottom: 10}}>{scene.barLabel}</div>
          <div style={{height: 34, borderRadius: 17, background: '#DDD5C8', overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${100 * (1 - interpolate(f, [18, 70], [0, 1], {...clamp, easing: ease}))}%`, borderRadius: 17,
              background: 'linear-gradient(90deg, #8A5A2B, #B8814A)'}} />
          </div>
        </div>
      )}
      {tag(760, a, -2, '#fff', C.ink, scene.tags[0][0], scene.tags[0][1])}
      {tag(1040, bP, 2, C.blue, '#fff', scene.tags[1][0], scene.tags[1][1])}
      {f > 62 && <div style={{position: 'absolute', right: 70, top: 1315, zIndex: 8, transform: `rotate(-8deg) scale(${interpolate(stamp, [0, 1], [2.4, 1])})`,
        opacity: Math.min(1, stamp * 1.6), padding: '8px 26px', border: `8px solid ${C.gold}`, borderRadius: 14, color: C.gold,
        background: 'rgba(245,239,230,0.92)', fontFamily: TITLE, fontWeight: 900, fontSize: 60}}>{scene.stampText}</div>}
    </AbsoluteFill>
  );
};

const Heist = ({dur, scene}) => {
  const {f, fps, inP, out} = useSceneFx(dur);
  const lad = interpolate(f, [8, 44], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const crack = interpolate(f, [50, 58], [0, 1], clamp);
  const flick = 0.75 + 0.25 * Math.sin(f / 2.2);
  const W = 918, H = 940;
  const stamp = spring({frame: f - 56, fps, config: {damping: 8, stiffness: 220}});
  const climbY = 780 - lad * 520;
  return (
    <div style={{position: 'absolute', left: 81, top: 400, width: W, height: H, opacity: Math.min(1, inP * 2.5) * (1 - out),
      transform: `translateY(${(1 - inP) * 500 - out * 300}px) rotate(${-2 * Math.min(inP, 1)}deg) scale(${1 - out * 0.05})`}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 38, overflow: 'hidden', background: 'linear-gradient(#10143A, #232A66)',
        boxShadow: '0 40px 80px rgba(30,30,30,0.35)', border: '14px solid #fff'}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          {Array.from({length: 22}).map((_, i) => (
            <circle key={i} cx={(i * 137) % W} cy={(i * 71) % 330} r={2 + (i % 3)} fill="#fff" opacity={0.35 + 0.35 * Math.sin(f / 8 + i)} />
          ))}
          <circle cx="760" cy="150" r="58" fill="#F3E7B8" />
          <circle cx="738" cy="136" r="52" fill="#10143A" opacity="0.18" />
          <rect x="70" y="360" width="780" height="620" fill="#C9BFAE" />
          <rect x="70" y="360" width="780" height="40" fill="#A99F8D" />
          {[130, 330, 560, 700].map((x, i) => <rect key={i} x={x} y="430" width="46" height="520" fill="#B6AB98" />)}
          <rect x="400" y="500" width="150" height="230" rx="10" fill="#3B3A52" />
          <rect x="408" y="508" width="134" height="214" rx="6" fill={`rgba(255,213,110,${0.55 * flick + 0.2})`} />
          <rect x="471" y="508" width="8" height="214" fill="#3B3A52" />
          <rect x="408" y="610" width="134" height="8" fill="#3B3A52" />
          {crack > 0 && (
            <g stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity={crack}>
              <path d="M475 615 L430 540 M475 615 L525 560 M475 615 L450 700 M475 615 L530 690 M475 615 L410 640" fill="none" />
            </g>
          )}
          <g transform={`translate(0 ${(1 - lad) * 0})`}>
            <line x1="330" y1="900" x2={330 + lad * 90} y2={900 - lad * 340} stroke="#6B4A2B" strokeWidth="14" strokeLinecap="round" />
            <line x1="400" y1="900" x2={400 + lad * 90} y2={900 - lad * 340} stroke="#6B4A2B" strokeWidth="14" strokeLinecap="round" />
            {Array.from({length: 9}).map((_, i) => {
              const k = (i + 1) / 10;
              return <line key={i} x1={330 + lad * 90 * k} y1={900 - lad * 340 * k} x2={400 + lad * 90 * k} y2={900 - lad * 340 * k}
                stroke="#8A5A2B" strokeWidth="10" strokeLinecap="round" />;
            })}
          </g>
          {lad > 0.05 && (
            <g transform={`translate(${365 + lad * 90 * 0.8} ${900 - lad * 340 * 0.8 - 30})`}>
              <circle cx="0" cy="-48" r="22" fill="#0B0B12" />
              <rect x="-22" y="-28" width="44" height="64" rx="14" fill="#0B0B12" />
              <rect x="-34" y="-20" width="14" height="46" rx="7" fill="#0B0B12" transform="rotate(25 -27 0)" />
            </g>
          )}
          <rect x="0" y="940" width={W} height="40" fill="#1A1D3E" />
        </svg>
      </div>
      <Badge text={scene.badge} p={Math.min(inP, 1.1)} />
      {f > 56 && <div style={{position: 'absolute', right: 10, top: H - 200, zIndex: 8, transform: `rotate(7deg) scale(${interpolate(stamp, [0, 1], [2.4, 1])})`,
        opacity: Math.min(1, stamp * 1.6), padding: '10px 26px', border: `8px solid ${C.blue}`, borderRadius: 14, color: C.blue,
        background: 'rgba(245,239,230,0.92)', fontFamily: TITLE, fontWeight: 900, fontSize: 62, whiteSpace: 'nowrap'}}>{scene.stampText}</div>}
      <Chip text={scene.chip} p={Math.min(spring({frame: f - 6, fps, config: {damping: 12}}), 1.1)} />
    </div>
  );
};

const Wallpaper = ({f, w, h}) => {
  const p = interpolate(f, [2, 30], [0, 1], {...clamp, easing: ease});
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h * p, overflow: 'hidden',
        backgroundColor: '#EFE6D2',
        backgroundImage: `radial-gradient(circle at 25% 25%, ${C.blue} 0 9px, transparent 10px), radial-gradient(circle at 75% 75%, ${C.gold} 0 9px, transparent 10px), repeating-linear-gradient(45deg, rgba(43,63,160,0.14) 0 5px, transparent 5px 40px), repeating-linear-gradient(-45deg, rgba(43,63,160,0.08) 0 5px, transparent 5px 40px)`,
        backgroundSize: '84px 84px, 84px 84px, auto, auto'}} />
      {p < 1 && <div style={{position: 'absolute', left: -10, top: h * p - 6, width: w + 20, height: 54, borderRadius: 27,
        background: 'linear-gradient(180deg, #fff, #CFC4AE 55%, #8B7F68)', boxShadow: '0 14px 24px rgba(0,0,0,0.35)'}} />}
    </div>
  );
};

const Paper = ({dur, scene}) => {
  const {f, fps, inP, out} = useSceneFx(dur);
  const W = 918, H = 940;
  const typeStart = sec(t0(scene.typeAt), fps) - sec(t0(scene.from), fps);
  const full = scene.text;
  const n = Math.max(0, Math.min(full.length, Math.floor((f - typeStart) * 1.0)));
  const shown = full.slice(0, n).split('\n');
  const stamp = spring({frame: f - sec(t0(scene.stamp.at), fps) + sec(t0(scene.from), fps), fps, config: {damping: 8, stiffness: 220}});
  const stampOn = f >= sec(t0(scene.stamp.at), fps) - sec(t0(scene.from), fps);
  return (
    <div style={{position: 'absolute', left: 81, top: 400, width: W, height: H, opacity: Math.min(1, inP * 2.5) * (1 - out),
      transform: `translateX(${(1 - inP) * -1200 + out * 500}px) rotate(${3 * Math.min(inP, 1) + (1 - inP) * -14}deg) scale(${1 - out * 0.05})`}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 38, overflow: 'hidden', background: '#D8CFBF',
        boxShadow: '0 40px 80px rgba(30,30,30,0.3)', border: '14px solid #fff'}}>
        {scene.wallpaper && <Wallpaper f={f} w={890} h={912} />}
        <div style={{position: 'absolute', left: 110, top: 80, width: 640, height: 760, border: '8px dashed rgba(30,30,30,0.28)', borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 34, color: 'rgba(30,30,30,0.3)',
          letterSpacing: 4, textAlign: 'center', paddingBottom: 380}}>{scene.emptyLabel === undefined ? 'ПУСТОЕ МЕСТО' : scene.emptyLabel}</div>
        <div style={{position: 'absolute', left: 90, top: 300, width: 700, height: 420, background: '#FFFDF6', borderRadius: 8, padding: '70px 50px',
          boxShadow: '0 20px 40px rgba(30,30,30,0.3)', transform: 'rotate(-4deg)'}}>
          <div style={{position: 'absolute', left: 250, top: -26, width: 190, height: 52, background: 'rgba(212,166,74,0.75)', transform: 'rotate(3deg)'}} />
          {shown.map((l, i) => (
            <div key={i} style={{fontFamily: TITLE, fontWeight: 800, fontSize: scene.fontSize || 70, lineHeight: 1.2, color: C.ink}}>{l}{i === shown.length - 1 && n < full.length ? '|' : ''}</div>
          ))}
        </div>
      </div>
      <Badge text={scene.badge} p={Math.min(inP, 1.1)} />
      {stampOn && <div style={{position: 'absolute', right: 20, top: H - 200, zIndex: 8, transform: `rotate(-7deg) scale(${interpolate(stamp, [0, 1], [2.4, 1])})`,
        opacity: Math.min(1, stamp * 1.6), padding: '10px 26px', border: `8px solid ${C.blue}`, borderRadius: 14, color: C.blue,
        background: 'rgba(245,239,230,0.92)', fontFamily: TITLE, fontWeight: 900, fontSize: 62, whiteSpace: 'nowrap'}}>{scene.stamp.text}</div>}
      <Chip text={scene.chip} p={Math.min(spring({frame: f - 6, fps, config: {damping: 12}}), 1.1)} />
    </div>
  );
};

const Everyone = ({dur}) => {
  const {f, fps, out} = useSceneFx(dur);
  const cols = 4, rows = 3, S = 190, G = 24;
  const gridW = cols * S + (cols - 1) * G;
  const shades = ['#2B3FA0', '#3A50BC', '#1F2F85', '#4A63D6', '#2B3FA0'];
  const head = spring({frame: f, fps, config: {damping: 12, stiffness: 140}});
  return (
    <AbsoluteFill style={{opacity: 1 - out, transform: `scale(${1 - out * 0.05})`}}>
      <div style={{position: 'absolute', top: 400, width: '100%', textAlign: 'center', fontFamily: TITLE, fontWeight: 900,
        fontSize: 140, color: C.ink, lineHeight: 1, transform: `scale(${Math.min(head, 1.05)})`}}>доступен</div>
      <div style={{position: 'absolute', top: 540, width: '100%', textAlign: 'center', fontFamily: TITLE, fontWeight: 900,
        fontSize: 200, color: C.blue, lineHeight: 1, transform: `scale(${Math.min(head, 1.05)})`}}>всем</div>
      <div style={{position: 'absolute', left: (1080 - gridW) / 2, top: 830}}>
        {Array.from({length: cols * rows}).map((_, i) => {
          const r = Math.floor(i / cols), c = i % cols;
          const p = spring({frame: f - 8 - (r + c) * 3, fps, config: {damping: 10, stiffness: 200}});
          return <div key={i} style={{position: 'absolute', left: c * (S + G), top: r * (S + G), width: S, height: S, borderRadius: 30,
            background: shades[(r * 2 + c * 3) % shades.length], transform: `scale(${Math.min(p, 1.1)}) rotate(${(1 - Math.min(p, 1)) * 40}deg)`,
            boxShadow: '0 14px 30px rgba(43,63,160,0.3)'}} />;
        })}
      </div>
    </AbsoluteFill>
  );
};

const Question = ({dur, scene}) => {
  const {f, fps} = useSceneFx(dur);
  const a = spring({frame: f, fps, config: {damping: 12, stiffness: 120}});
  const b = spring({frame: f - 10, fps, config: {damping: 12, stiffness: 120}});
  const pulse = 1 + Math.sin(f / 5) * 0.015;
  const tubes = Array.from({length: 9}).map((_, i) => {
    const x = (i * 173 + 90) % 960, sp = 2.2 + (i % 4) * 0.9, ph = (i * 211) % 1500;
    const y = 1350 - ((f * sp + ph) % 950);
    return (
      <svg key={i} width="90" height="150" viewBox="-30 -125 60 165" style={{position: 'absolute', left: x, top: y, opacity: 0.55,
        transform: `rotate(${f * (i % 2 ? 1.4 : -1.4) + i * 40}deg)`}}>
        <rect x="-26" y="-96" width="52" height="116" rx="10" fill="#8A5A2B" />
        <rect x="-18" y="-120" width="36" height="26" rx="6" fill="#D9D3C7" />
        <rect x="-26" y="16" width="52" height="14" rx="3" fill="#5C3B1E" />
      </svg>
    );
  });
  return (
    <AbsoluteFill>
      {scene.floatTubes && tubes}
      {scene.floatImage && Array.from({length: 8}).map((_, i) => {
        const im = script.images[scene.floatImage.image];
        const x = (i * 197 + 60) % 900, sp = 2 + (i % 4) * 0.8, ph = (i * 233) % 1000;
        const y = 1350 - ((f * sp + ph) % 950);
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 130, height: 130, borderRadius: '50%', opacity: 0.45,
          border: `6px solid ${C.blue}`, boxShadow: '0 10px 24px rgba(30,30,30,0.25)',
          backgroundImage: `url(${staticFile(im.file)})`, backgroundSize: '420%',
          backgroundPosition: `${scene.floatImage.focus[0] * 100}% ${scene.floatImage.focus[1] * 100}%`,
          transform: `rotate(${f * (i % 2 ? 1.2 : -1.2)}deg)`}} />;
      })}
      <div style={{position: 'absolute', top: 430, width: '100%', textAlign: 'center', fontFamily: TITLE, fontWeight: 900,
        fontSize: 560, color: C.gold, lineHeight: 0.9, opacity: Math.min(a, 1), transform: `scale(${Math.min(a, 1.05) * pulse})`,
        textShadow: '0 20px 40px rgba(212,166,74,0.4)'}}>?</div>
      <div style={{position: 'absolute', top: 1060, left: 70, right: 70, textAlign: 'center', fontFamily: TITLE, fontWeight: 800,
        fontSize: 92, lineHeight: 1.12, color: C.gold, opacity: Math.min(b, 1), transform: `translateY(${(1 - Math.min(b, 1)) * 50}px)`}}>
        {scene.text}
      </div>
    </AbsoluteFill>
  );
};

const ClassicMain = () => {
  useFonts();
  const {fps, durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill>
      <Background />
      {script.scenes.map((s) => {
        const from = sec(t0(s.from), fps);
        const next = script.scenes.find((x) => x.id === s.id + 1);
        const end = next ? sec(t0(next.from), fps) : durationInFrames;
        const dur = end - from + 6;
        const body =
          s.type === 'hook' ? <Hook dur={dur} />
          : s.type === 'card' ? <PhotoCard scene={s} dur={dur} />
          : s.type === 'synth' ? <Synth dur={dur} />
          : s.type === 'ended' ? <Ended dur={dur} scene={s} />
          : s.type === 'heist' ? <Heist dur={dur} scene={s} />
          : s.type === 'paper' ? <Paper dur={dur} scene={s} />
          : s.type === 'everyone' ? <Everyone dur={dur} />
          : s.type === 'calendar' ? <Calendar dur={dur} scene={s} />
          : s.type === 'gallery' ? <Gallery dur={dur} scene={s} />
          : s.type === 'lineup' ? <Lineup dur={dur} scene={s} />
          : s.type === 'smile' ? <Smile dur={dur} scene={s} />
          : s.type === 'flip' ? <Flip dur={dur} scene={s} />
          : s.type === 'theft' ? <Theft dur={dur} scene={s} />
          : s.type === 'ransom' ? <Ransom dur={dur} scene={s} />
          : s.type === 'deathbed' ? <Deathbed dur={dur} scene={s} />
          : s.type === 'hero9' ? <Hero9 dur={dur} scene={s} />
          : s.type === 'court9' ? <Court9 dur={dur} scene={s} />
          : s.type === 'doc9' ? <Doc9 dur={dur} scene={s} />
          : s.type === 'press9' ? <Press9 dur={dur} scene={s} />
          : s.type === 'truth9' ? <Truth9 dur={dur} scene={s} />
          : s.type === 'power9' ? <Power9 dur={dur} scene={s} />
          : s.type === 'academy9' ? <Academy9 dur={dur} scene={s} />
          : s.type === 'duel' ? <Duel dur={dur} scene={s} />
          : s.type === 'ages' ? <Ages dur={dur} scene={s} />
          : s.type === 'tally' ? <Tally dur={dur} scene={s} />
          : s.type === 'tiles26' ? <Tiles26 dur={dur} scene={s} />
          : s.type === 'sneak' ? <Sneak dur={dur} scene={s} />
          : s.type === 'grave' ? <Grave dur={dur} scene={s} />
          : <Question dur={dur} scene={s} />;
        return <Sequence key={s.id} from={from} durationInFrames={dur}>{body}</Sequence>;
      })}
      <Wipes />
      <Diagram />
      <Captions />
    </AbsoluteFill>
  );
};

// стиль ролика выбирается в сценарии: script.style === 'noir' - тёмный вариант (Noir.jsx)
export const Main = script.style === 'noir' ? NoirMain : script.style === 'aurora' ? AuroraMain : script.style === 'board' ? BoardMain : script.style === 'board10' ? Board10Main : script.style === 'board11' ? Board11Main : script.style === 'board12' ? Board12Main : script.style === 'board13' ? Board13Main : script.style === 'board14' ? Board14Main : script.style === 'board15' ? Board15Main : script.style === 'board16' ? Board16Main : script.style === 'board16b' ? Board16bMain : script.style === 'board17' ? Board17Main : script.style === 'board18' ? Board18Main : script.style === 'board19' ? Board19Main : script.style === 'board20' ? Board20Main : script.style === 'board21' ? Board21Main : script.style === 'board22' ? Board22Main : script.style === 'board23' ? Board23Main : script.style === 'board24' ? Board24Main : script.style === 'board25' ? Board25Main : script.style === 'board26' ? Board26Main : script.style === 'board27' ? Board27Main : script.style === 'board28' ? Board28Main : script.style === 'board29' ? Board29Main : script.style === 'board29v' ? Board29vMain : script.style === 'board30' ? Board30Main : script.style === 'board32' ? Board32Main : script.style === 'board31' ? Board31Main : ClassicMain;
