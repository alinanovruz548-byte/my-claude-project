import React from 'react';
import {spring, interpolate, Easing, staticFile} from 'remotion';
import {A, RED, TITLE, BODY, GTEXT, clamp, ease, rel, rnd, useScene, Shell, Pin, Excl, Tape, WordTiles} from './AuroraCollage';

// Сцены видео 9 (Артемизия Джентилески): коллаж из вырезок, почтовый штемпель, «против», манометр, удостоверение академии.
const img9 = (n) => staticFile('n9/img/' + n);

const Cut9 = ({file, x, y, w, rot = 0, f, at, fps, pin = false, from = 'top'}) => {
  const p = spring({frame: f - at, fps, config: {damping: 11, stiffness: 120}});
  if (f < at) return null;
  const e = 1 - Math.min(p, 1);
  return (
    <>
      <img src={img9(file)} style={{position: 'absolute', left: x, top: y, width: w, zIndex: 20, transform: `translateY(${from === 'top' ? -e * 900 : e * 900}px) rotate(${rot + e * 14}deg) scale(${1 + e * 0.2})`,
        opacity: Math.min(1, p * 3), filter: 'drop-shadow(10px 18px 16px rgba(0,0,0,0.45))'}} />
      {pin && <Pin x={x + w / 2} y={y + 8} s={0.9} rot={rot * 0.5} p={Math.min(1, p * 2)} />}
    </>
  );
};

const Sparks = ({f, n = 22, seed = 1, y0 = 1500, speed = 3}) => (
  <>
    {Array.from({length: n}).map((_, i) => {
      const x = rnd(i + seed) * 1000 + 40, sp = speed * (0.6 + rnd(i + seed + 5)), ph = rnd(i + seed + 9) * 1400;
      const y = y0 - ((f * sp + ph) % 1500);
      const sz = 5 + rnd(i + seed + 13) * 9;
      return <div key={i} style={{position: 'absolute', left: x + Math.sin(f / 14 + i) * 18, top: y, width: sz, height: sz, borderRadius: '50%', background: '#FBE6A3', opacity: 0.55 + 0.4 * Math.sin(f / 5 + i),
        boxShadow: '0 0 14px 4px rgba(212,166,74,0.8)', zIndex: 3}} />;
    })}
  </>
);

// --- 1. Хук: слова ставятся одно за другим ---------------------------------------------------------------------------------------------
export const Hero9 = ({dur, scene}) => {
  const {f, fps, inP, out} = useScene(dur);
  const T = (w) => rel(w, scene, fps);
  const a = T(scene.judithAt), b = T(scene.womanAt), c = T(scene.courtAt);
  const reveal = interpolate(f, [a - 2, a + 14], [0, 1], {...clamp, easing: ease});
  const sk = spring({frame: f - c, fps, config: {damping: 7, stiffness: 230}});
  const shake = f >= c && f < c + 10 ? Math.sin(f * 4.5) * 12 * (1 - (f - c) / 10) : 0;
  return (
    <Shell {...{f, fps, scene, inP, out}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(5,8,40,0.15), rgba(5,8,40,0.78) 85%)', zIndex: 1}} />
      <Sparks f={f} n={16} seed={4} />
      {f >= a - 2 && (
        <div style={{position: 'absolute', left: 0, width: 1080, top: 420, textAlign: 'center', zIndex: 10}}>
          <div style={{display: 'inline-block', fontFamily: TITLE, fontWeight: 900, fontSize: 230, lineHeight: 1.1, ...GTEXT(), clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`,
            filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.6))'}}>ЮДИФЬ</div>
          <div style={{margin: '0 auto', width: 700 * reveal, height: 8, borderRadius: 4, background: 'linear-gradient(90deg, rgba(212,166,74,0), #D4A64A, rgba(212,166,74,0))'}} />
        </div>
      )}
      <WordTiles text="ЖЕНЩИНА" x={150} y={740} f={f} at={b} fps={fps} w={100} h={132} size={92} seed={5} />
      {f >= c && (
        <div style={{position: 'absolute', left: 250 + shake, top: 900, zIndex: 40, padding: '0 50px', border: `16px solid ${RED}`, color: RED, fontFamily: TITLE, fontWeight: 900, fontSize: 250, lineHeight: 1.05,
          letterSpacing: 6, background: 'rgba(245,235,215,0.92)', transform: `rotate(-7deg) scale(${interpolate(sk, [0, 1], [3, 1])})`, opacity: Math.min(1, sk * 1.8), boxShadow: '0 30px 60px rgba(0,0,0,0.5)'}}>СУД</div>
      )}
      <Cut9 file="cut_judith_art.png" x={20} y={1150} w={470} rot={-6} f={f} at={a + 6} fps={fps} pin />
      <Cut9 file="cut_self.png" x={580} y={1130} w={440} rot={5} f={f} at={b + 6} fps={fps} pin from="bottom" />
    </Shell>
  );
};

// --- 2. Рим, 1612: почтовый штемпель на фоне арок Колизея ----------------------------------------------------------------------------------
const Scales = ({x, y, w, tilt}) => (
  <svg width={w} height={w * 0.95} viewBox="-200 -190 400 380" style={{position: 'absolute', left: x, top: y, zIndex: 18, overflow: 'visible', filter: 'drop-shadow(8px 14px 12px rgba(0,0,0,0.4))'}}>
    <rect x="-8" y="-150" width="16" height="320" rx="6" fill="#E9D6A1" /><ellipse cx="0" cy="170" rx="90" ry="16" fill="#E9D6A1" />
    <g transform={`rotate(${tilt} 0 -150)`}>
      <rect x="-170" y="-158" width="340" height="14" rx="7" fill="#F3E3B5" />
      {[-1, 1].map((sg) => (
        <g key={sg} transform={`translate(${sg * 160} -150) rotate(${-tilt})`}>
          <line x1="0" y1="0" x2="-60" y2="150" stroke="#F3E3B5" strokeWidth="5" /><line x1="0" y1="0" x2="60" y2="150" stroke="#F3E3B5" strokeWidth="5" />
          <path d="M-80 150 Q0 215 80 150 Z" fill="#D4A64A" />
        </g>
      ))}
    </g>
    <circle cx="0" cy="-156" r="14" fill="#D4A64A" />
  </svg>
);

export const Court9 = ({dur, scene}) => {
  const {f, fps, inP, out} = useScene(dur);
  const T = (w) => rel(w, scene, fps);
  const ya = T(scene.yearAt);
  const sp = spring({frame: f - ya, fps, config: {damping: 8, stiffness: 150}});
  const yr = Math.round(1600 + 12 * interpolate(f, [ya, ya + 22], [0, 1], {...clamp, easing: ease}));
  const draw = interpolate(f, [2, 36], [0, 1], clamp);
  const tilt = 14 * Math.exp(-f / 40) * Math.cos(f / 5) + 5;
  const arch = (cx, cy, r) => `M${cx - r} ${cy} V${cy - r * 0.9} A${r} ${r} 0 0 1 ${cx + r} ${cy - r * 0.9} V${cy}`;
  const ring = 'РИМ · ИТАЛИЯ · РИМ · ИТАЛИЯ · ';
  return (
    <Shell {...{f, fps, scene, inP, out}}>
      <svg width="1080" height="1000" viewBox="0 0 1080 1000" style={{position: 'absolute', left: 0, top: 420, zIndex: 2, opacity: 0.55}}>
        {[0, 1].map((tier) => Array.from({length: 7}).map((_, i) => (
          <path key={`${tier}-${i}`} d={arch(90 + i * 150, 330 + tier * 230, 56)} fill="none" stroke="#D4A64A" strokeWidth="6" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - draw} />
        )))}
        <line x1="20" y1="330" x2="1060" y2="330" stroke="#D4A64A" strokeWidth="6" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - draw} />
        <line x1="20" y1="560" x2="1060" y2="560" stroke="#D4A64A" strokeWidth="6" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - draw} />
      </svg>
      {f >= ya && (
        <svg width="660" height="660" viewBox="-330 -330 660 660" style={{position: 'absolute', left: 210, top: 410, zIndex: 20, transform: `rotate(${-14 + 14 * Math.min(sp, 1)}deg) scale(${interpolate(sp, [0, 1], [2.6, 1])})`, opacity: Math.min(1, sp * 1.8),
          filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))'}}>
          <defs>
            <path id="pm" d="M0 -250 A250 250 0 1 1 -0.1 -250" />
            <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="3" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="7" /></filter>
          </defs>
          <g filter="url(#rough)" fill="none" stroke="#F3E3B5">
            <circle r="305" strokeWidth="12" /><circle r="285" strokeWidth="4" /><circle r="190" strokeWidth="6" />
            <text fill="#F3E3B5" stroke="none" fontFamily="Manrope" fontWeight="800" fontSize="46" letterSpacing="9"><textPath href="#pm" startOffset="0">{ring}</textPath></text>
            <text fill="#F3E3B5" stroke="none" x="0" y="52" textAnchor="middle" fontFamily="Playfair Display" fontWeight="900" fontSize="150">{yr}</text>
            <path d="M-150 90 H150" strokeWidth="5" /><path d="M-150 -90 H150" strokeWidth="5" opacity="0" />
          </g>
        </svg>
      )}
      <Cut9 file="cut_self.png" x={60} y={1050} w={420} rot={-4} f={f} at={T(scene.portAt)} fps={fps} pin from="bottom" />
      <Scales x={640} y={1060} w={340} tilt={tilt} />
      <Tape text="АРТЕМИЗИЯ ДЖЕНТИЛЕСКИ" x={50} y={1495} rot={-2} f={f} at={T(scene.nameAt)} fps={fps} size={36} />
    </Shell>
  );
};

// --- 3. Она против учителя: экран «против» ------------------------------------------------------------------------------------------------
const Silhouette = ({x, y, w, p}) => (
  <svg width={w} height={w * 1.1} viewBox="-100 -120 200 220" style={{position: 'absolute', left: x, top: y, zIndex: 20, transform: `translateY(${(1 - Math.min(p, 1)) * 500}px) scale(${0.85 + 0.15 * Math.min(p, 1)})`, opacity: Math.min(1, p * 2),
    filter: 'drop-shadow(10px 16px 14px rgba(0,0,0,0.55))'}}>
    <defs><linearGradient id="silG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3A4DB0" /><stop offset="1" stopColor="#0E1650" /></linearGradient></defs>
    <path d="M-95 100 Q-95 20 -30 8 L-18 -4 L18 -4 L30 8 Q95 20 95 100 Z" fill="url(#silG)" stroke="#fff" strokeWidth="5" strokeLinejoin="round" />
    <ellipse cx="0" cy="-48" rx="42" ry="52" fill="url(#silG)" stroke="#fff" strokeWidth="5" />
    <path d="M-44 -62 Q0 -118 44 -62 Q20 -92 -44 -62" fill="#0B1145" />
  </svg>
);

export const Versus9 = ({dur, scene}) => {
  const {f, fps, inP, out} = useScene(dur);
  const T = (w) => rel(w, scene, fps);
  const vs = T(scene.vsAt);
  const sp = spring({frame: f - vs, fps, config: {damping: 7, stiffness: 230}});
  const crack = interpolate(f, [vs, vs + 8], [0, 1], clamp);
  const sil = spring({frame: f - T(scene.teacherAt), fps, config: {damping: 12, stiffness: 120}});
  const pts = '610,0 570,170 640,300 560,450 630,590 540,760 610,880 520,1000';
  return (
    <Shell {...{f, fps, scene, inP, out}}>
      <div style={{position: 'absolute', left: 40, top: 430, width: 1000, height: 1000, borderRadius: 40, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.5)', zIndex: 4}}>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #F7E9BC, #D4A64A 60%, #9A6B1D)', clipPath: 'polygon(0 0, 61% 0, 52% 100%, 0 100%)'}} />
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1C2A82, #0A0F3A)', clipPath: 'polygon(61% 0, 100% 0, 100% 100%, 52% 100%)'}} />
        <svg width="1000" height="1000" style={{position: 'absolute', left: 0, top: 0}}>
          <polyline points={pts} fill="none" stroke="#fff" strokeWidth="9" strokeLinejoin="miter" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - crack}
            style={{filter: 'drop-shadow(0 0 14px rgba(255,255,255,0.9))'}} />
        </svg>
      </div>
      <Cut9 file="cut_self.png" x={70} y={520} w={390} rot={-4} f={f} at={T(scene.herAt) + 2} fps={fps} pin />
      <Silhouette x={600} y={560} w={360} p={sil} />
      <Tape text="АРТЕМИЗИЯ" x={80} y={1130} rot={-3} f={f} at={T(scene.herAt) + 8} fps={fps} size={48} />
      <Tape text="АГОСТИНО ТАССИ" x={560} y={1160} rot={3} f={f} at={T(scene.tassiAt)} fps={fps} size={42} />
      <Tape text="УЧИТЕЛЬ" x={700} y={470} rot={4} f={f} at={T(scene.teacherAt) + 4} fps={fps} size={34} bg="#fff" color="#111" />
      {f >= vs && (
        <div style={{position: 'absolute', left: 300, top: 840, zIndex: 40, padding: '0 40px', border: `12px solid ${RED}`, color: RED, fontFamily: TITLE, fontWeight: 900, fontSize: 130, letterSpacing: 4,
          background: 'rgba(245,235,215,0.94)', transform: `rotate(-8deg) scale(${interpolate(sp, [0, 1], [2.8, 1])})`, opacity: Math.min(1, sp * 1.8), boxShadow: '0 24px 40px rgba(0,0,0,0.5)'}}>ПРОТИВ</div>
      )}
    </Shell>
  );
};

// --- 4. Давление: подробный манометр -----------------------------------------------------------------------------------------------------------------
export const Press9 = ({dur, scene}) => {
  const {f, fps, inP, out} = useScene(dur);
  const T = (w) => rel(w, scene, fps);
  const a = T(scene.rampAt);
  const v = interpolate(f, [a, a + 30], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
  const hot = v > 0.72;
  const wob = v >= 1 ? Math.sin(f * 2.6) * 2.4 : Math.sin(f * 1.3) * 0.8;
  const ang = -120 + 240 * v + wob;
  const R = 262;
  const rad = (an) => (an - 90) * Math.PI / 180;
  const arc = (a0, a1, col, w = 34) => {
    const p = (an) => [Math.cos(rad(an)) * R, Math.sin(rad(an)) * R];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return <path d={`M${x0} ${y0} A${R} ${R} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`} stroke={col} strokeWidth={w} fill="none" />;
  };
  const shake = v >= 1 ? Math.sin(f * 6) * 3 : 0;
  const lamp = hot ? 0.6 + 0.4 * Math.sin(f * 0.8) : 0.15;
  return (
    <Shell {...{f, fps, scene, inP, out}}>
      <Tape text="ПОКАЗАНИЯ" x={330} y={470} rot={-3} f={f} at={T(scene.tapeAt)} fps={fps} size={56} />
      {/* труба и вентиль */}
      <div style={{position: 'absolute', left: 0, top: 1400, width: 1080, height: 60, background: 'linear-gradient(180deg, #8a6a2b, #E9C979 40%, #7a5a20)', zIndex: 8, boxShadow: '0 12px 20px rgba(0,0,0,0.4)'}} />
      <div style={{position: 'absolute', left: 500, top: 1330, width: 80, height: 90, background: 'linear-gradient(90deg, #7a5a20, #E9C979, #7a5a20)', zIndex: 9}} />
      <svg width="180" height="180" viewBox="-90 -90 180 180" style={{position: 'absolute', left: 120, top: 1230, zIndex: 10, transform: `rotate(${f * 4}deg)`, filter: 'drop-shadow(6px 10px 8px rgba(0,0,0,0.45))'}}>
        <circle r="70" fill="none" stroke="#C4271C" strokeWidth="14" />
        {[0, 60, 120].map((r) => <line key={r} x1="-70" y1="0" x2="70" y2="0" stroke="#C4271C" strokeWidth="12" transform={`rotate(${r})`} />)}
        <circle r="16" fill="#8a1a12" />
      </svg>
      {hot && Array.from({length: 8}).map((_, i) => {
        const k = (f * 3 + i * 40) % 220;
        return <div key={i} style={{position: 'absolute', left: 160 + (i % 3) * 26 + Math.sin(k / 18 + i) * 16, top: 1230 - k, width: 40 + k * 0.3, height: 40 + k * 0.3, borderRadius: '50%',
          background: 'rgba(255,255,255,0.5)', opacity: (1 - k / 220) * 0.7, filter: 'blur(8px)', zIndex: 9}} />;
      })}
      {/* корпус */}
      <div style={{position: 'absolute', left: 130 + shake, top: 620, width: 820, height: 820, borderRadius: '50%', zIndex: 12,
        background: 'conic-gradient(from 30deg, #8a6a2b, #F3E0A0, #8a6a2b, #F3E0A0, #8a6a2b)', boxShadow: '0 40px 70px rgba(0,0,0,0.55)'}} />
      <div style={{position: 'absolute', left: 160 + shake, top: 650, width: 760, height: 760, borderRadius: '50%', zIndex: 13, background: 'radial-gradient(circle at 40% 35%, #FDF7E3, #E6D6A6)', boxShadow: 'inset 0 0 40px rgba(60,40,10,0.45)'}} />
      <svg width="760" height="760" viewBox="-380 -380 760 760" style={{position: 'absolute', left: 160 + shake, top: 650, zIndex: 14}}>
        {arc(-120, -20, '#3F5FD0')}{arc(-20, 50, '#D4A64A')}{arc(50, 120, RED)}
        {Array.from({length: 49}).map((_, i) => {
          const an = rad(-120 + i * 5), big = i % 6 === 0;
          const r1 = big ? 188 : 205, r2 = 230;
          return <line key={i} x1={Math.cos(an) * r1} y1={Math.sin(an) * r1} x2={Math.cos(an) * r2} y2={Math.sin(an) * r2} stroke="#3a2e18" strokeWidth={big ? 7 : 3} />;
        })}
        {[0, 20, 40, 60, 80, 100].map((n, i) => {
          const an = rad(-120 + 240 * (n / 100));
          return <text key={n} x={Math.cos(an) * 152} y={Math.sin(an) * 152 + 12} textAnchor="middle" fontFamily="Playfair Display" fontWeight="800" fontSize="40" fill="#3a2e18">{n}</text>;
        })}
        <text x="0" y="118" textAnchor="middle" fontFamily="Manrope" fontWeight="800" fontSize="26" letterSpacing="8" fill="#6b5326">PRESSIONE</text>
        <circle cx="-95" cy="60" r="38" fill="#F3EAC9" stroke="#8a6a2b" strokeWidth="6" /><circle cx="95" cy="60" r="38" fill="#F3EAC9" stroke="#8a6a2b" strokeWidth="6" />
        <line x1="-95" y1="60" x2={-95 + Math.cos(rad(-60 + v * 200)) * 26} y2={60 + Math.sin(rad(-60 + v * 200)) * 26} stroke="#222" strokeWidth="5" strokeLinecap="round" />
        <line x1="95" y1="60" x2={95 + Math.cos(rad(40 - v * 150)) * 26} y2={60 + Math.sin(rad(40 - v * 150)) * 26} stroke="#222" strokeWidth="5" strokeLinecap="round" />
        <g transform="translate(6 10)" opacity="0.28"><g transform={`rotate(${ang})`}><path d="M-12 40 L0 -240 L12 40 Z" fill="#000" /></g></g>
        <g transform={`rotate(${ang})`}><path d="M-12 40 L0 -240 L12 40 Z" fill="#C4271C" /><path d="M-12 40 L0 -240 L0 40 Z" fill="#8f1b12" /></g>
        <circle r="30" fill="#222" /><circle r="12" fill="#D4A64A" />
        <circle cx="0" cy="-300" r="16" fill={RED} opacity={lamp} style={{filter: 'drop-shadow(0 0 14px rgba(255,60,40,0.9))'}} />
      </svg>
      <div style={{position: 'absolute', left: 160 + shake, top: 650, width: 760, height: 760, borderRadius: '50%', zIndex: 15, pointerEvents: 'none',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.45), rgba(255,255,255,0) 38%)', clipPath: 'ellipse(50% 50% at 50% 50%)'}} />
      {[[165, 700], [880, 700], [165, 1360], [880, 1360]].map(([x, y], i) => <div key={i} style={{position: 'absolute', left: x - 12 + shake, top: y - 12, width: 26, height: 26, borderRadius: '50%', zIndex: 16, background: 'radial-gradient(circle at 35% 30%, #fff, #8a6a2b)'}} />)}
      <div style={{position: 'absolute', left: 130, top: 1470, width: 820, textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 70, color: hot ? '#FF6A57' : '#fff', zIndex: 16, letterSpacing: 8, textShadow: '0 6px 20px rgba(0,0,0,0.5)'}}>ДАВЛЕНИЕ</div>
      <Excl x={800} y={560} s={0.8} rot={12} f={f} at={a + 26} fps={fps} />
    </Shell>
  );
};

// --- 5. «Это правда»: ни слова не изменила --------------------------------------------------------------------------------------------------------------
export const Truth9 = ({dur, scene}) => {
  const {f, fps, inP, out} = useScene(dur);
  const T = (w) => rel(w, scene, fps);
  const say = 'Это правда!\nЭто правда!';
  const sa = T(scene.sayAt);
  const n = Math.max(0, Math.min(say.length, Math.floor((f - sa) * 0.9)));
  const bubble = spring({frame: f - sa + 4, fps, config: {damping: 10, stiffness: 160}});
  return (
    <Shell {...{f, fps, scene, inP, out}}>
      <Cut9 file="cut_self.png" x={30} y={640} w={450} rot={-4} f={f} at={2} fps={fps} pin />
      {f >= sa - 4 && (
        <div style={{position: 'absolute', left: 440, top: 700, width: 600, height: 400, zIndex: 30, transform: `scale(${Math.min(bubble, 1.06)}) rotate(2deg)`, transformOrigin: '0 100%'}}>
          <svg width="600" height="420" viewBox="0 0 600 420" style={{position: 'absolute', left: 0, top: 0, filter: 'drop-shadow(0 20px 26px rgba(0,0,0,0.35))'}}>
            <path d="M50 0 H550 Q600 0 600 50 V290 Q600 340 550 340 H170 L60 420 L90 340 H50 Q0 340 0 290 V50 Q0 0 50 0 Z" fill="#fff" />
          </svg>
          <div style={{position: 'absolute', left: 40, top: 50, fontFamily: TITLE, fontWeight: 900, fontSize: 82, lineHeight: 1.2, color: '#111', whiteSpace: 'pre'}}>
            {say.slice(0, n)}<span style={{opacity: n < say.length ? 1 : 0}}>|</span>
          </div>
        </div>
      )}
      {[0, 1, 2].map((k) => {
        const at = T(scene.checkAt) + k * 6;
        const p = spring({frame: f - at, fps, config: {damping: 7, stiffness: 230}});
        return f >= at ? (
          <svg key={k} width="120" height="120" viewBox="-60 -60 120 120" style={{position: 'absolute', left: 560 + k * 140, top: 1210 + (k % 2) * 30, zIndex: 32, transform: `scale(${Math.min(p, 1.15)}) rotate(${(k - 1) * 8}deg)`,
            filter: 'drop-shadow(6px 10px 8px rgba(0,0,0,0.4))'}}>
            <circle r="52" fill={A.gold} stroke="#fff" strokeWidth="8" /><path d="M-26 2 L-8 22 L28 -22" stroke="#141C55" strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null;
      })}
      <Tape text="НИ СЛОВА НЕ ИЗМЕНИЛА" x={110} y={1470} rot={-2} f={f} at={T(scene.tapeAt)} fps={fps} size={44} />
    </Shell>
  );
};

// --- 7. Сила: буквы, залитые картиной ---------------------------------------------------------------------------------------------------------------------
export const Power9 = ({dur, scene}) => {
  const {f, fps, inP, out} = useScene(dur);
  const T = (w) => rel(w, scene, fps);
  const pa = T(scene.powerAt);
  const p = spring({frame: f - pa, fps, config: {damping: 9, stiffness: 150}});
  const shine = interpolate(f, [pa, pa + 40], [-30, 130], clamp);
  return (
    <Shell {...{f, fps, scene, inP, out}}>
      <div style={{position: 'absolute', left: 540 - 900, top: 960 - 900, width: 1800, height: 1800, borderRadius: '50%', opacity: 0.3, zIndex: 2,
        background: 'repeating-conic-gradient(from 0deg, rgba(212,166,74,0.95) 0deg 7deg, rgba(212,166,74,0) 7deg 22deg)',
        WebkitMaskImage: 'radial-gradient(circle, #000 5%, transparent 62%)', maskImage: 'radial-gradient(circle, #000 5%, transparent 62%)', transform: `rotate(${f * 0.8}deg)`}} />
      <Sparks f={f} n={26} seed={21} speed={4} />
      <div style={{position: 'absolute', left: 0, width: 1080, top: 560, textAlign: 'center', zIndex: 10, transform: `scale(${interpolate(Math.min(p, 1.1), [0, 1], [0.4, 1])})`, opacity: Math.min(1, p * 2)}}>
        <div style={{display: 'inline-block', fontFamily: TITLE, fontWeight: 900, fontSize: 285, lineHeight: 1.1, letterSpacing: 4, backgroundImage: `linear-gradient(rgba(255,226,160,0.4), rgba(255,226,160,0.4)), url(${img9('n9_05_uffizi_clean.jpg')})`, backgroundSize: '240%',
          backgroundPosition: '88% 22%', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent', WebkitTextStroke: '7px #F3D88A',
          filter: 'drop-shadow(0 16px 30px rgba(0,0,0,0.6))'}}>СИЛА</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, background: `linear-gradient(110deg, rgba(255,255,255,0) ${shine - 12}%, rgba(255,255,255,0.65) ${shine}%, rgba(255,255,255,0) ${shine + 12}%)`,
          mixBlendMode: 'overlay', pointerEvents: 'none'}} />
      </div>
      <Cut9 file="cut_judith_face.png" x={150} y={1010} w={780} rot={-2} f={f} at={3} fps={fps} pin from="bottom" />
    </Shell>
  );
};

// --- 8. Удостоверение академии ----------------------------------------------------------------------------------------------------------------------------------
const Medal = ({f, at, fps}) => {
  const p = spring({frame: f - at, fps, config: {damping: 8, stiffness: 150}});
  if (f < at) return null;
  return (
    <svg width="340" height="420" viewBox="-170 -170 340 420" style={{position: 'absolute', left: 600, top: 940, zIndex: 30, overflow: 'visible', transform: `scale(${interpolate(p, [0, 1], [2.2, 1])}) rotate(${-8 + (1 - Math.min(p, 1)) * 30}deg)`,
      opacity: Math.min(1, p * 1.8), filter: 'drop-shadow(0 22px 24px rgba(0,0,0,0.5))', transformOrigin: '50% 40%'}}>
      <defs>
        <linearGradient id="gm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFF0B8" /><stop offset="0.5" stopColor="#D4A64A" /><stop offset="1" stopColor="#8A6419" /></linearGradient>
        <path id="mtop" d="M-96 0 A96 96 0 0 1 96 0" /><path id="mbot" d="M-104 0 A104 104 0 0 0 104 0" />
      </defs>
      <path d="M-70 90 L-110 240 L-60 215 L-30 250 L0 100 Z" fill="#2B3FA0" stroke="#D4A64A" strokeWidth="5" strokeLinejoin="round" />
      <path d="M70 90 L110 240 L60 215 L30 250 L0 100 Z" fill="#1C2A82" stroke="#D4A64A" strokeWidth="5" strokeLinejoin="round" />
      {Array.from({length: 24}).map((_, i) => <circle key={i} cx={Math.cos((i / 24) * Math.PI * 2) * 128} cy={Math.sin((i / 24) * Math.PI * 2) * 128} r="19" fill="url(#gm)" stroke="#8A6419" strokeWidth="3" />)}
      <circle r="124" fill="url(#gm)" stroke="#8A6419" strokeWidth="5" />
      <circle r="112" fill="none" stroke="#fff6cf" strokeWidth="3" opacity="0.8" />
      <circle r="78" fill="#141C55" stroke="#F3D88A" strokeWidth="6" />
      <text x="0" y="40" textAnchor="middle" fontFamily="Playfair Display" fontWeight="900" fontSize="120" fill="url(#gm)">1</text>
      <text fontFamily="Manrope" fontWeight="800" fontSize="19" letterSpacing="5" fill="#4a2d08"><textPath href="#mtop" startOffset="50%" textAnchor="middle">ПЕРВАЯ ЖЕНЩИНА</textPath></text>
      <text fontFamily="Manrope" fontWeight="800" fontSize="19" letterSpacing="5" fill="#4a2d08" dy="14"><textPath href="#mbot" startOffset="50%" textAnchor="middle">АКАДЕМИЯ · 1616</textPath></text>
    </svg>
  );
};

export const Academy9 = ({dur, scene}) => {
  const {f, fps, inP, out} = useScene(dur);
  const T = (w) => rel(w, scene, fps);
  const card = spring({frame: f, fps, config: {damping: 12, stiffness: 100}});
  const typed = (s, at, spd = 1) => s.slice(0, Math.max(0, Math.min(s.length, Math.floor((f - at) * spd))));
  return (
    <Shell {...{f, fps, scene, inP, out}}>
      <div style={{position: 'absolute', left: 100, top: 540, width: 880, height: 600, borderRadius: 30, background: 'linear-gradient(160deg, #FBF3DE, #E7D5A4)', zIndex: 14,
        boxShadow: '0 40px 70px rgba(0,0,0,0.5)', transform: `translateY(${(1 - Math.min(card, 1)) * 900}px) rotate(${-3 + (1 - Math.min(card, 1)) * -12}deg)`, overflow: 'hidden'}}>
        <div style={{height: 110, background: A.ultra, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 36, letterSpacing: 7, color: '#fff'}}>АКАДЕМИЯ РИСУНКА</div>
        <div style={{position: 'absolute', left: 50, top: 150, width: 260, height: 330, borderRadius: 8, backgroundImage: `url(${img9('cut_self.png')})`, backgroundSize: 'cover', backgroundPosition: '50% 20%', boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
          border: '6px solid #fff'}} />
        <div style={{position: 'absolute', left: 350, top: 150, fontFamily: BODY, fontWeight: 800, fontSize: 28, letterSpacing: 5, color: '#8a6a30'}}>{typed('ФЛОРЕНЦИЯ · 1616', T(scene.cityAt), 1.2)}</div>
        <div style={{position: 'absolute', left: 350, top: 210, width: 500, fontFamily: TITLE, fontWeight: 900, fontSize: 64, lineHeight: 1.1, color: '#111'}}>{typed('Артемизия Джентилески', T(scene.nameAt), 1.1)}</div>
        <div style={{position: 'absolute', left: 350, top: 410, width: 480}}>
          {[0, 1, 2].map((i) => <div key={i} style={{width: 480 - i * 90, height: 10, marginBottom: 16, background: 'rgba(40,34,24,0.35)', borderRadius: 3}} />)}
        </div>
      </div>
      <Pin x={540} y={490} s={1.05} rot={0} p={Math.min(1, card * 2)} />
      <Medal f={f} at={T(scene.sealAt)} fps={fps} />
      <Tape text="ПЕРВАЯ ЖЕНЩИНА" x={90} y={1230} rot={-3} f={f} at={T(scene.womanAt)} fps={fps} size={56} />
    </Shell>
  );
};

// --- 9. Финальный вопрос: знак рисуется, точка падает и подпрыгивает --------------------------------------------------------------------------------------
export const Question9 = ({dur, scene}) => {
  const {f, fps} = useScene(dur);
  const draw = interpolate(f, [2, 30], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const dotY = interpolate(f, [30, 42, 50, 56, 60], [-500, 0, -50, 0, -10], clamp);
  const dotS = f >= 41 && f < 46 ? 1 + 0.35 * (1 - (f - 41) / 5) : 1;
  const b = spring({frame: f - 14, fps, config: {damping: 12, stiffness: 120}});
  const bob = Math.sin(f / 14) * 10;
  const shine = ((f * 2.2) % 220) - 60;
  const bloom = interpolate(f, [0, 30], [0, 1], {...clamp, easing: ease});
  return (
    <>
      <div style={{position: 'absolute', left: 540 - 800 * bloom, top: 760 - 800 * bloom, width: 1600 * bloom, height: 1600 * bloom, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,166,74,0.55), rgba(212,166,74,0) 70%)'}} />
      <Sparks f={f} n={24} seed={31} speed={2.5} />
      <svg width="700" height="880" viewBox="-350 -420 700 880" style={{position: 'absolute', left: 190, top: 380 + bob, overflow: 'visible', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.45))'}}>
        <defs>
          <linearGradient id="qg" x1="0" y1="-1" x2="0" y2="1"><stop offset="0" stopColor="#FFF3C4" /><stop offset="1" stopColor="#D4A64A" /></linearGradient>
          <linearGradient id="qshine" gradientUnits="userSpaceOnUse" x1={shine * 5 - 400} y1="-420" x2={shine * 5 - 200} y2="440"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="0.5" stopColor="#fff" stopOpacity="0.9" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
        </defs>
        <path d="M-150 -170 C-150 -330 160 -330 160 -160 C160 -50 20 -30 20 90" fill="none" stroke="url(#qg)" strokeWidth="96" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - draw} />
        <path d="M-150 -170 C-150 -330 160 -330 160 -160 C160 -50 20 -30 20 90" fill="none" stroke="url(#qshine)" strokeWidth="96" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - draw} style={{mixBlendMode: 'overlay'}} />
        <ellipse cx="20" cy={300 + dotY} rx={54 * dotS} ry={54 / dotS} fill="url(#qg)" />
        <ellipse cx="20" cy="372" rx={48 + (dotY < -20 ? -dotY / 14 : 0)} ry="9" fill="rgba(0,0,0,0.25)" opacity={f > 28 ? 1 : 0} />
      </svg>
      <div style={{position: 'absolute', top: 1180, left: 70, right: 70, textAlign: 'center', fontFamily: TITLE, fontWeight: 800, fontSize: 88, lineHeight: 1.12, color: '#fff',
        opacity: Math.min(b, 1), transform: `translateY(${(1 - Math.min(b, 1)) * 50}px)`, textShadow: '0 8px 30px rgba(8,12,46,0.5)'}}>{scene.text}</div>
    </>
  );
};
