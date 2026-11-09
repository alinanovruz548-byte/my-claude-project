import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing, staticFile} from 'remotion';
import {script, words} from './current';

// Иллюстрирующие сцены светлого стиля (видео 4 и дальше): календарь, вернисаж, опознание, «подхватили», переворот плашки.
export const C = {bg: '#F5EFE6', ink: '#1E1E1E', blue: '#2B3FA0', blueLt: '#5A72E8', gold: '#D4A64A', grey: '#A9A298'};
export const TITLE = '"Playfair Display", serif';
export const BODY = 'Manrope, sans-serif';
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
export const ease = Easing.bezier(0.16, 1, 0.3, 1);
const sec = (s, fps) => Math.round(s * fps);
const t0 = (i) => words[i].start;
export const rel = (idx, scene, fps) => sec(t0(idx), fps) - sec(t0(scene.from), fps);
export const rnd = (n) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };

export const useFx = (dur) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inP = spring({frame: f, fps, config: {damping: 15, stiffness: 140}});
  const out = interpolate(f, [dur - 6, dur], [0, 1], clamp);
  return {f, fps, inP, out};
};

export const Badge = ({text, p}) => !text ? null : (
  <div style={{position: 'absolute', left: -24, top: -44, padding: '16px 34px', borderRadius: 22, background: C.blue, color: '#fff',
    fontFamily: TITLE, fontWeight: 800, fontSize: 52, boxShadow: '0 14px 30px rgba(43,63,160,0.35)',
    transform: `rotate(-4deg) scale(${Math.min(p, 1.1)})`, transformOrigin: 'left bottom', zIndex: 20}}>{text}</div>
);

export const Chip = ({text, p, bottom = -34}) => (
  <div style={{position: 'absolute', left: '50%', bottom, transform: `translateX(-50%) scale(${Math.min(p, 1.1)})`, zIndex: 20,
    padding: '16px 36px', borderRadius: 40, background: '#fff', color: C.ink, fontFamily: BODY, fontWeight: 800,
    fontSize: 36, whiteSpace: 'nowrap', boxShadow: '0 10px 26px rgba(30,30,30,0.18)'}}>{text}</div>
);

export const StampX = ({text, angle = -8, f, at, fps, pos, color = C.blue, size = 62}) => {
  const p = spring({frame: f - at, fps, config: {damping: 8, stiffness: 220}});
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', ...pos, zIndex: 25, transform: `rotate(${angle}deg) scale(${interpolate(p, [0, 1], [2.4, 1])})`,
      opacity: Math.min(1, p * 1.6), padding: '10px 26px', border: `8px solid ${color}`, borderRadius: 14, color, background: 'rgba(245,239,230,0.92)',
      fontFamily: TITLE, fontWeight: 900, fontSize: size, letterSpacing: 2, whiteSpace: 'nowrap'}}>{text}</div>
  );
};

export const Stage = ({inP, out, children, rot = 0}) => (
  <AbsoluteFill style={{opacity: Math.min(1, inP * 2.5) * (1 - out),
    transform: `translateY(${(1 - Math.min(inP, 1)) * 420}px) rotate(${rot * Math.min(inP, 1) + (1 - Math.min(inP, 1)) * -7}deg) scale(${1 - out * 0.05})`}}>{children}</AbsoluteFill>
);

// --- календарь: листки с годами срываются один за другим ---------------------------
export const Calendar = ({dur, scene}) => {
  const {f, fps, inP, out} = useFx(dur);
  const years = [1870, 1871, 1872, 1873, 1874];
  const W = 780, H = 880;
  const flipT = (k) => 5 + k * 7;
  const last = flipT(3) + 8;
  const ring = spring({frame: f - last - 4, fps, config: {damping: 9, stiffness: 160}});
  return (
    <Stage inP={inP} out={out} rot={2}>
      <div style={{position: 'absolute', left: 150, top: 440, width: W, height: H}}>
        {years.map((y, k) => {
          const fp = k < 4 ? interpolate(f, [flipT(k), flipT(k) + 7], [0, 1], {...clamp, easing: Easing.in(Easing.quad)}) : 0;
          if (fp >= 1) return null;
          return (
            <div key={y} style={{position: 'absolute', inset: 0, zIndex: 10 - k, borderRadius: 34, background: '#fff', overflow: 'hidden',
              boxShadow: '0 36px 70px rgba(30,30,30,0.28)', transformOrigin: '50% 0%',
              transform: `perspective(1500px) rotateX(${-fp * 115}deg) translateY(${-fp * 90}px) rotate(${fp * (k % 2 ? 9 : -9)}deg)`, opacity: 1 - fp * 0.6}}>
              <div style={{height: 150, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BODY, fontWeight: 800,
                fontSize: 54, letterSpacing: 14, color: '#fff'}}>ПАРИЖ</div>
              <div style={{textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 300, lineHeight: 1.05, color: C.ink, marginTop: 14}}>{y}</div>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: 14, padding: '10px 60px'}}>
                {Array.from({length: 21}).map((_, d) => (
                  <div key={d} style={{width: 78, height: 34, borderRadius: 8, background: k === 4 && d === 11 ? C.blue : '#EFE9DD'}} />
                ))}
              </div>
            </div>
          );
        })}
        {[400, 530, 660].map((x, i) => (
          <div key={i} style={{position: 'absolute', left: x - 12, top: -26, width: 24, height: 70, borderRadius: 12, background: '#2a2a2a', zIndex: 30, boxShadow: '0 6px 10px rgba(0,0,0,0.3)'}} />
        ))}
        {f > last && (
          <svg width="260" height="130" viewBox="0 0 260 130" style={{position: 'absolute', left: 340, top: 640, zIndex: 31, overflow: 'visible',
            transform: `scale(${Math.min(ring, 1.1)})`, transformOrigin: '130px 65px'}}>
            <ellipse cx="130" cy="65" rx="115" ry="48" fill="none" stroke={C.blue} strokeWidth="9" strokeDasharray="620" strokeDashoffset={620 * (1 - Math.min(1, ring))} transform="rotate(-6 130 65)" />
          </svg>
        )}
      </div>
      <div style={{position: 'absolute', left: 150, top: 440, width: W, height: H}}>
        <div style={{position: 'absolute', left: 0, top: -64, width: 420}}><Badge text="Улика №1" p={inP} /></div>
        <StampX text="ВЫСТАВКА" angle={-8} f={f} at={last + 6} fps={fps} pos={{right: -20, top: H - 150}} />
      </div>
    </Stage>
  );
};

// --- вернисаж: рамы падают на стену, ножницы режут ленту -----------------------------
export const Gallery = ({dur, scene}) => {
  const {f, fps, inP, out} = useFx(dur);
  const img = script.images[scene.image];
  const drop = (d) => spring({frame: f - d, fps, config: {damping: 9, stiffness: 120}});
  const cutAt = rel(scene.cutAt, scene, fps);
  const sc = interpolate(f, [cutAt - 12, cutAt], [1, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const cx = 540 - 140 + sc * 560; // ножницы заезжают к центру ленты
  const cut = f >= cutAt;
  const fall = interpolate(f, [cutAt, cutAt + 16], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
  const snip = f >= cutAt - 2 ? 22 * Math.abs(Math.sin((f - cutAt) * 1.4)) : 16;
  const mini = (x, y, w, h, d, tint) => (
    <div style={{position: 'absolute', left: x, top: y + (1 - Math.min(drop(d), 1)) * -700, width: w, height: h, borderRadius: 8, border: `10px solid ${C.gold}`,
      background: tint, boxShadow: '0 14px 30px rgba(30,30,30,0.3)', overflow: 'hidden'}}>
      <svg width={w} height={h} viewBox="0 0 100 130" preserveAspectRatio="none">
        <circle cx="68" cy="34" r="12" fill="#fff" opacity="0.8" />
        <path d="M0 90 Q30 60 55 85 T100 80 V130 H0 Z" fill="rgba(30,30,30,0.28)" />
      </svg>
    </div>
  );
  return (
    <Stage inP={inP} out={out} rot={-1}>
      <div style={{position: 'absolute', left: 30, top: 390, width: 1020, height: 1030, borderRadius: 30, background: '#E8DDC8',
        boxShadow: 'inset 0 0 90px rgba(120,90,40,0.25), 0 30px 60px rgba(30,30,30,0.2)', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 70, height: 6, background: 'rgba(30,30,30,0.18)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 150, background: '#CDBE9F'}} />
      </div>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920}}>
        {mini(70, 600, 200, 270, 2, 'linear-gradient(#9DB4D8, #E9D6A8)')}
        {mini(810, 650, 200, 250, 5, 'linear-gradient(#E8B7A0, #B7C8A8)')}
        <div style={{position: 'absolute', left: 300, top: 520 + (1 - Math.min(drop(0), 1)) * -700, width: 480, height: 640, borderRadius: 10, border: `14px solid ${C.gold}`,
          background: '#fff', boxShadow: '0 30px 60px rgba(30,30,30,0.35)', overflow: 'hidden'}}>
          <div style={{position: 'absolute', inset: 0, backgroundImage: `url(${staticFile(img.file)})`, backgroundSize: 'cover', backgroundPosition: '50% 30%'}} />
        </div>
        <svg width="1080" height="700" style={{position: 'absolute', left: 0, top: 380, pointerEvents: 'none'}}>
          {[[300, 520, 540, 400], [780, 520, 540, 400]].map((l, i) => <line key={i} x1={l[0] + 30} y1={l[1] - 380 + (1 - Math.min(drop(0), 1)) * -700} x2={l[2]} y2={l[3] - 380} stroke="#6b5a3a" strokeWidth="4" />)}
        </svg>
        {/* лента */}
        <div style={{position: 'absolute', left: 40, top: 1250, width: 500, height: 64, borderRadius: 8, background: C.blue, transformOrigin: '0% 100%',
          transform: cut ? `translate(${-fall * 80}px, ${fall * 260}px) rotate(${-fall * 40}deg)` : 'none', opacity: 1 - fall * 0.4, boxShadow: '0 10px 20px rgba(43,63,160,0.35)'}} />
        <div style={{position: 'absolute', left: 540, top: 1250, width: 500, height: 64, borderRadius: 8, background: C.blue, transformOrigin: '100% 100%',
          transform: cut ? `translate(${fall * 80}px, ${fall * 260}px) rotate(${fall * 40}deg)` : 'none', opacity: 1 - fall * 0.4, boxShadow: '0 10px 20px rgba(43,63,160,0.35)'}} />
        {!cut || fall < 0.6 ? (
          <svg width="170" height="130" viewBox="-30 -60 170 120" style={{position: 'absolute', left: cx - 40, top: 1220, overflow: 'visible', zIndex: 30,
            transform: 'rotate(-90deg)', filter: 'drop-shadow(0 8px 10px rgba(0,0,0,0.4))'}}>
            {[1, -1].map((sg) => (
              <g key={sg} transform={`rotate(${sg * snip})`}>
                <path d="M0 0 L88 -5 L88 0 Z" transform={sg < 0 ? 'scale(1 -1)' : undefined} fill="#e8e2d4" stroke="#7d7767" strokeWidth="1.5" />
                <circle cx="-22" cy={sg * 16} r="16" fill="none" stroke={C.gold} strokeWidth="8" />
              </g>
            ))}
          </svg>
        ) : null}
        {cut && Array.from({length: 22}).map((_, i) => {
          const a = (i / 22) * Math.PI * 2, r = (f - cutAt) * (8 + rnd(i) * 14);
          return <div key={i} style={{position: 'absolute', left: 540 + Math.cos(a) * r, top: 1280 + Math.sin(a) * r * 0.8 + (f - cutAt) * 3, width: 14, height: 14, borderRadius: i % 2 ? 7 : 3,
            background: i % 3 === 0 ? C.gold : i % 3 === 1 ? C.blue : '#fff', opacity: Math.max(0, 1 - (f - cutAt) / 26), transform: `rotate(${(f - cutAt) * 20}deg)`}} />;
        })}
      </div>
      <div style={{position: 'absolute', left: 30, top: 390, width: 1020}}>
        <Badge text="Улика №2" p={inP} />
      </div>
      <div style={{position: 'absolute', left: 0, top: 1390, width: 1080, textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 56, color: C.ink,
        opacity: interpolate(f, [cutAt, cutAt + 8], [0, 1], clamp)}}>выставка открыта!</div>
    </Stage>
  );
};

// --- опознание: художники в ряд на фоне шкалы роста --------------------------------------
export const Lineup = ({dur, scene}) => {
  const {f, fps, inP, out} = useFx(dur);
  const names = scene.names;
  const X0 = 120, GAP = 210;
  const scan = interpolate(f, [6, 30], [0, 1], clamp);
  const stampAt = rel(scene.stampAt, scene, fps);
  const hs = [720, 760, 690, 740, 710];
  return (
    <Stage inP={inP} out={out} rot={1}>
      <div style={{position: 'absolute', left: 50, top: 400, width: 980, height: 1040, borderRadius: 30, background: '#EDE5D6', overflow: 'hidden',
        boxShadow: '0 36px 70px rgba(30,30,30,0.25)'}}>
        {Array.from({length: 11}).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 60 + i * 90, height: 3, background: 'rgba(30,30,30,0.18)'}}>
            <span style={{position: 'absolute', left: 14, top: -26, fontFamily: BODY, fontWeight: 800, fontSize: 22, color: 'rgba(30,30,30,0.4)'}}>{200 - i * 10}</span>
          </div>
        ))}
        <svg width="980" height="1040" style={{position: 'absolute', left: 0, top: 0}}>
          {names.map((n, i) => {
            const p = spring({frame: f - 3 - i * 4, fps, config: {damping: 12, stiffness: 130}});
            const cx = 135 + i * 178, top = hs[i] - 400;
            const dy = (1 - Math.min(p, 1)) * 700;
            return (
              <g key={i} transform={`translate(0 ${dy})`}>
                <circle cx={cx} cy={top} r="52" fill={i % 2 ? C.blue : '#1F2F85'} />
                <path d={`M${cx - 82} 1060 L${cx - 82} ${top + 150} Q${cx - 82} ${top + 78} ${cx} ${top + 78} Q${cx + 82} ${top + 78} ${cx + 82} ${top + 150} L${cx + 82} 1060 Z`} fill={i % 2 ? C.blue : '#1F2F85'} />
                <rect x={cx - 74} y={top + 190} width="148" height="60" rx="8" fill="#fff" />
                <text x={cx} y={top + 232} textAnchor="middle" fontFamily="Manrope" fontWeight="800" fontSize={n.length > 6 ? 23 : 28} fill="#1E1E1E">{n}</text>
              </g>
            );
          })}
        </svg>
        {scan > 0 && scan < 1 && (
          <div style={{position: 'absolute', left: 0, right: 0, top: 60 + scan * 940, height: 8, background: '#fff', boxShadow: '0 0 30px 14px rgba(90,114,232,0.7)'}} />
        )}
      </div>
      <div style={{position: 'absolute', left: 50, top: 400, width: 980}}><Badge text="Улика №3" p={inP} /></div>
      <StampX text="ИМПРЕССИОНИСТЫ" angle={-6} f={f} at={stampAt} fps={fps} size={64} pos={{left: 130, top: 1010}} />
    </Stage>
  );
};

// --- «не обиделись»: грустное лицо улыбается, обзывалка перекрашивается ---------------------------
const Spark = ({x, y, r, color, k}) => (
  <svg width={r * 2} height={r * 2} viewBox="-10 -10 20 20" style={{position: 'absolute', left: x - r, top: y - r, transform: `rotate(${k * 30}deg)`, overflow: 'visible'}}>
    <path d="M0 -10 L2.4 -2.4 L10 0 L2.4 2.4 L0 10 L-2.4 2.4 L-10 0 L-2.4 -2.4 Z" fill={color} />
  </svg>
);

export const Smile = ({dur, scene}) => {
  const {f, fps, inP, out} = useFx(dur);
  const noAt = rel(scene.noAt, scene, fps), catchAt = rel(scene.catchAt, scene, fps);
  const happy = interpolate(f, [noAt, noAt + 10], [0, 1], {...clamp, easing: ease});
  const caught = spring({frame: f - catchAt, fps, config: {damping: 7, stiffness: 190}});
  const col = f >= catchAt ? C.blue : '#D9D2C4';
  const mouthY = 10 + happy * 90; // изгиб улыбки: от грусти к улыбке
  const brow = (1 - happy) * 14;
  const shake = f < catchAt ? Math.sin(f * 1.6) * 3 : 0;
  return (
    <Stage inP={inP} out={out} rot={0}>
      <div style={{position: 'absolute', left: 340, top: 410, width: 400, height: 400}}>
        <svg width="400" height="400" viewBox="-200 -200 400 400" style={{overflow: 'visible', transform: `scale(${1 + Math.max(0, caught - 1) * 0.1})`}}>
          <circle r="170" fill="#fff" stroke={C.blue} strokeWidth="14" style={{filter: 'drop-shadow(0 20px 30px rgba(30,30,30,0.25))'}} />
          <circle cx="-60" cy="-30" r="16" fill={C.ink} /><circle cx="60" cy="-30" r="16" fill={C.ink} />
          <path d={`M-90 ${-68 - brow * 0.6} L-34 ${-68 + brow}`} stroke={C.ink} strokeWidth="9" strokeLinecap="round" />
          <path d={`M90 ${-68 - brow * 0.6} L34 ${-68 + brow}`} stroke={C.ink} strokeWidth="9" strokeLinecap="round" />
          <path d={`M-70 ${60 - happy * 20} Q0 ${60 - 40 + mouthY} 70 ${60 - happy * 20}`} fill="none" stroke={C.ink} strokeWidth="12" strokeLinecap="round" />
          {happy > 0.6 && <><circle cx="-100" cy="30" r="22" fill="#F4B6A8" opacity="0.7" /><circle cx="100" cy="30" r="22" fill="#F4B6A8" opacity="0.7" /></>}
        </svg>
      </div>
      <StampX text="НЕ ОБИДЕЛИСЬ" angle={7} f={f} at={noAt + 4} fps={fps} size={56} pos={{right: 30, top: 750}} />
      <div style={{position: 'absolute', left: 90, top: 960, width: 900, height: 290, transform: `translateX(${shake}px) rotate(${f < catchAt ? -3 : 0}deg) scale(${f >= catchAt ? Math.min(caught, 1.12) : 1})`}}>
        <svg width="900" height="330" viewBox="0 0 900 330" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', filter: 'drop-shadow(0 24px 30px rgba(30,30,30,0.25))'}}>
          <path d="M60 0 H840 Q900 0 900 60 V230 Q900 290 840 290 H520 L420 330 L440 290 H60 Q0 290 0 230 V60 Q0 0 60 0 Z" fill={col} />
        </svg>
        <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 66, letterSpacing: 0,
          color: f >= catchAt ? '#fff' : C.ink, fontStyle: f >= catchAt ? 'normal' : 'italic'}}>ИМПРЕССИОНИСТЫ!</div>
        {f < catchAt && ['ха-ха', 'фу', 'бред'].map((t, i) => (
          <div key={i} style={{position: 'absolute', left: 40 + i * 300, top: -34 - (i % 2) * 14, fontFamily: BODY, fontWeight: 800, fontSize: 30, color: C.grey,
            transform: `rotate(${i % 2 ? 6 : -8}deg)`}}>{t}</div>
        ))}
      </div>
      {f >= catchAt && Array.from({length: 9}).map((_, i) => {
        const a = (i / 9) * Math.PI * 2, r = Math.min(1, (f - catchAt) / 14) * (220 + rnd(i) * 120);
        return <Spark key={i} x={540 + Math.cos(a) * r * 1.5} y={1100 + Math.sin(a) * r * 0.6} r={14 + rnd(i + 5) * 14} k={i}
          color={i % 3 === 0 ? C.gold : C.blue} />;
      })}
    </Stage>
  );
};

// --- плашка переворачивается: НАСМЕШКА -> НАЗВАНИЕ -------------------------------------------------
export const Flip = ({dur, scene}) => {
  const {f, fps, inP, out} = useFx(dur);
  const flipAt = rel(scene.flipAt, scene, fps), stampAt = rel(scene.stampAt, scene, fps);
  const fp = interpolate(f, [flipAt, flipAt + 12], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const wob = f < flipAt ? Math.sin(f * 1.5) * 2.5 : 0;
  const yearP = interpolate(f, [flipAt, flipAt + 24], [0, 1], {...clamp, easing: ease});
  const year = Math.round(scene.yearFrom + (scene.yearTo - scene.yearFrom) * yearP);
  const face = (txt, bg, color, extra) => (
    <div style={{position: 'absolute', inset: 0, borderRadius: 40, background: bg, color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      backfaceVisibility: 'hidden', boxShadow: '0 36px 70px rgba(30,30,30,0.3)', ...extra}}>
      <div style={{fontFamily: TITLE, fontWeight: 900, fontSize: 118, lineHeight: 1}}>{txt}</div>
    </div>
  );
  return (
    <Stage inP={inP} out={out} rot={0}>
      <div style={{position: 'absolute', left: 100, top: 480, width: 880, height: 360, perspective: 1600}}>
        <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateX(${fp * 180}deg) rotate(${wob}deg)`}}>
          {face('НАСМЕШКА', '#fff', '#8E877B', {border: '10px solid #D9D2C4', backgroundImage: 'repeating-linear-gradient(45deg, rgba(30,30,30,0.04) 0 14px, transparent 14px 28px)'})}
          {face('НАЗВАНИЕ', C.blue, '#fff', {transform: 'rotateX(180deg)'})}
        </div>
        <Badge text="Улика №4" p={inP} />
      </div>
      <div style={{position: 'absolute', left: 0, top: 930, width: 1080, textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 250, lineHeight: 1, color: C.blue,
        opacity: interpolate(f, [flipAt - 2, flipAt + 6], [0, 1], clamp)}}>{year}</div>
      <StampX text="БРЕНД" angle={-8} color={C.gold} f={f} at={stampAt} fps={fps} pos={{right: 70, top: 1240}} />
    </Stage>
  );
};
