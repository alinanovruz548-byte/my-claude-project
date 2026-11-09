import React from 'react';
import {spring, interpolate, Easing, staticFile} from 'remotion';
import {script} from './current';
import {C, TITLE, BODY, clamp, ease, rel, useFx, Badge, Chip, StampX, Stage} from './Extra';

// Человечки: вор уносит картину и прячет её, сыщик ищет; подозреваемый идёт и падает в могилу.
// Локальные координаты: ноги в (0,0), вверх = минус.
const SKIN = '#F2D9BE';

export const Man = ({x, y, s = 1, dir = 1, color = '#1E1E1E', phase = 0, a1 = 0, a2 = 0, hat = null, mask = false, qface = false, rot = 0, sq = 1, z = 5}) => {
  const leg = (sg) => {
    const a = Math.sin(phase + (sg > 0 ? 0 : Math.PI)) * 0.5;
    return <line x1={sg * 9} y1={-112} x2={sg * 9 + Math.sin(a) * 112} y2={-112 + Math.cos(a) * 112} stroke={color} strokeWidth="22" strokeLinecap="round" />;
  };
  const arm = (a, k) => (
    <line x1="0" y1={-196} x2={Math.sin(a) * 84} y2={-196 + Math.cos(a) * 84} stroke={k ? color : color} strokeWidth="19" strokeLinecap="round" />
  );
  return (
    <svg width="360" height="440" viewBox="-180 -400 360 440" style={{position: 'absolute', left: x - 180 * s, top: y - 400 * s, width: 360 * s, height: 440 * s, overflow: 'visible', zIndex: z,
      transform: `rotate(${rot}deg) scale(${dir}, ${sq})`, transformOrigin: `${180 * s}px ${400 * s}px`}}>
      {leg(1)}{leg(-1)}
      {arm(a2, 0)}
      <rect x="-34" y="-210" width="68" height="108" rx="26" fill={color} />
      <circle cx="0" cy="-244" r="33" fill={qface ? '#fff' : SKIN} stroke={qface ? C.blue : 'none'} strokeWidth="6" />
      {qface && <text x="0" y="-222" textAnchor="middle" fontFamily="Playfair Display" fontWeight="900" fontSize="64" fill={C.blue}>?</text>}
      {!qface && !mask && <><circle cx="11" cy="-248" r="4.5" fill="#1E1E1E" /><circle cx="-6" cy="-248" r="4.5" fill="#1E1E1E" /></>}
      {mask && <><rect x="-34" y="-262" width="68" height="26" rx="10" fill="#111" /><circle cx="11" cy="-249" r="5" fill="#fff" /><circle cx="-6" cy="-249" r="5" fill="#fff" /></>}
      {hat === 'beanie' && <path d="M-35 -256 Q-30 -296 0 -298 Q30 -296 35 -256 Z" fill={C.blue} />}
      {hat === 'fedora' && <><ellipse cx="0" cy="-268" rx="52" ry="10" fill="#1E1E1E" /><path d="M-30 -268 Q-28 -306 0 -306 Q28 -306 30 -268 Z" fill="#1E1E1E" /><rect x="-30" y="-276" width="60" height="8" fill={C.blue} /></>}
      {arm(a1, 1)}
    </svg>
  );
};

const handOf = (x, y, s, dir, a) => [x + dir * Math.sin(a) * 84 * s, y - 196 * s + Math.cos(a) * 84 * s];

// --- хук: вор крадёт картину, прячет в бочку, сыщик ничего не находит -------------------------
export const Sneak = ({dur, scene}) => {
  const {f, fps, inP, out} = useFx(dur);
  const img = script.images[scene.image];
  const T = (w) => rel(w, scene, fps);
  const stealAt = T(scene.stealAt), hideAt = T(scene.hideAt), seekAt = T(scene.seekAt), stampAt = T(scene.stampAt);
  const FLOOR = 1300, PW = 470, PH = Math.round(PW * img.size[1] / img.size[0]);
  const wallX = 300, wallY = 690;
  // вор
  const tl = (a, b, v0, v1, e = Easing.inOut(Easing.quad)) => interpolate(f, [a, b], [v0, v1], {...clamp, easing: e});
  const grabEnd = stealAt + 12, carryEnd = hideAt + 14, dropEnd = carryEnd + 20, exitEnd = seekAt - 4;
  let tx;
  if (f < stealAt) tx = tl(0, stealAt, -150, 215, Easing.linear);
  else if (f < grabEnd) tx = 215;
  else if (f < carryEnd) tx = tl(grabEnd, carryEnd, 215, 640);
  else if (f < dropEnd) tx = 640;
  else tx = tl(dropEnd, exitEnd + 30, 640, 1300, Easing.in(Easing.quad));
  const walking = (f < stealAt) || (f >= grabEnd && f < carryEnd) || f >= dropEnd;
  const phase = walking ? f * (f >= grabEnd && f < carryEnd ? 0.75 : 0.5) : 0;
  const thiefS = 1.1;
  const holding = f >= grabEnd && f < dropEnd;
  const aT = holding ? 2.6 : f >= stealAt && f < grabEnd ? tl(stealAt, grabEnd, 0.2, 2.7) : 0.15;
  // картина
  const dropP = tl(carryEnd, dropEnd - 4, 0, 1);
  let px = wallX, py = wallY, ps = 1, pr = 0;
  if (f >= stealAt && f < grabEnd) { py = wallY + tl(stealAt, grabEnd, 0, 60); }
  if (f >= grabEnd && f < carryEnd) { px = tx + 30; py = FLOOR - 560 * thiefS + 60; ps = 0.62; pr = -4; }
  if (f >= carryEnd) { px = tx + 30 + (800 - 100 - tx - 30) * dropP; py = FLOOR - 560 * thiefS + 60 + (FLOOR - 330 - (FLOOR - 560 * thiefS + 60)) * dropP; ps = 0.62 - 0.28 * dropP; pr = -4 + 4 * dropP; }
  const showPaint = f < dropEnd - 2;
  const lid = tl(dropEnd - 8, dropEnd, 0, 1);
  const hush = spring({frame: f - hideAt - 12, fps, config: {damping: 9, stiffness: 200}});
  // сыщик
  const dx0 = seekAt - 2;
  const dTx = tl(dx0, dx0 + 32, -170, 330, Easing.out(Easing.quad));
  const dPhase = f >= dx0 && f < dx0 + 32 ? f * 0.55 : 0;
  const look = Math.sin((f - dx0 - 32) / 5) * 0.35;
  const stamp = stampAt;
  return (
    <Stage inP={inP} out={out} rot={0}>
      <div style={{position: 'absolute', left: 0, top: 380, width: 1080, textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 86, lineHeight: 1.0, color: C.blue}}>Самый украденный</div>
      <div style={{position: 'absolute', left: 0, top: 480, width: 1080, textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 130, lineHeight: 1.0, color: C.ink}}>шедевр</div>
      <div style={{position: 'absolute', left: 40, top: 650, width: 1000, height: 650, borderRadius: 26, background: '#EADFCB', boxShadow: 'inset 0 0 70px rgba(120,90,40,0.22)'}} />
      <div style={{position: 'absolute', left: 40, top: FLOOR, width: 1000, height: 70, borderRadius: '0 0 26px 26px', background: '#CDBE9F'}} />
      {/* место картины */}
      <div style={{position: 'absolute', left: wallX - 6, top: wallY - 6, width: PW + 12, height: PH + 12, background: '#E0D3BB', border: '3px dashed rgba(30,30,30,0.18)'}} />
      {/* бочка */}
      <div style={{position: 'absolute', left: 710, top: FLOOR - 250, width: 200, height: 250, zIndex: 4}}>
        <svg width="200" height="260" viewBox="0 0 200 260" style={{overflow: 'visible'}}>
          <path d="M20 20 Q-4 130 20 240 H180 Q204 130 180 20 Z" fill="#8A5A2B" />
          {[60, 130, 200].map((yy) => <rect key={yy} x="6" y={yy} width="188" height="14" rx="5" fill="#5C3B1E" />)}
          <ellipse cx="100" cy="20" rx="80" ry="16" fill="#3a2410" />
          <ellipse cx="100" cy="20" rx="80" ry="16" fill="#A0703B" style={{transformOrigin: '100px 20px', transform: `scaleY(${lid})`, opacity: lid}} />
        </svg>
      </div>
      {showPaint && (
        <div style={{position: 'absolute', left: px, top: py, width: PW, height: PH, zIndex: 6, transform: `scale(${ps}) rotate(${pr}deg)`, transformOrigin: '0 0',
          border: '8px solid #fff', boxSizing: 'border-box', boxShadow: '0 20px 36px rgba(30,30,30,0.4)', backgroundImage: `url(${staticFile(img.file)})`, backgroundSize: 'cover'}} />
      )}
      {f >= stealAt - 30 && f < exitEnd + 40 && (
        <Man x={tx} y={FLOOR} s={thiefS} dir={1} color="#1E1E1E" mask hat="beanie" phase={phase} a1={aT} a2={aT} z={7} />
      )}
      {f >= hideAt + 12 && f < seekAt + 20 && (
        <div style={{position: 'absolute', left: 560, top: 800, zIndex: 9, padding: '8px 26px', borderRadius: 30, background: '#fff', color: C.blue, fontFamily: TITLE, fontWeight: 900, fontSize: 56,
          border: `6px solid ${C.blue}`, transform: `scale(${Math.min(hush, 1.1)}) rotate(5deg)`, opacity: Math.min(1, hush * 2) * (f > seekAt + 6 ? 0 : 1)}}>Тсс…</div>
      )}
      {f >= dx0 && (
        <>
          <Man x={dTx} y={FLOOR} s={1.1} dir={1} color={C.blue} hat="fedora" phase={dPhase} a1={1.1 + look} a2={0.1} z={7} />
          {(() => {
            const [hx, hy] = handOf(dTx, FLOOR, 1.1, 1, 1.1 + look);
            return (
              <svg width="150" height="170" viewBox="-30 -30 150 170" style={{position: 'absolute', left: hx - 40, top: hy - 70, zIndex: 8, overflow: 'visible', transform: `rotate(${look * 20}deg)`}}>
                <circle cx="50" cy="40" r="44" fill="rgba(180,210,255,0.35)" stroke="#2a2a2a" strokeWidth="9" />
                <line x1="80" y1="74" x2="115" y2="120" stroke="#2a2a2a" strokeWidth="12" strokeLinecap="round" />
              </svg>
            );
          })()}
        </>
      )}
      {[0, 1, 2].map((k) => {
        const a = dx0 + 20 + k * 8;
        const p = spring({frame: f - a, fps, config: {damping: 8, stiffness: 220}});
        return f >= a ? <div key={k} style={{position: 'absolute', left: 430 + k * 90, top: 800 - (k % 2) * 50, zIndex: 9, fontFamily: TITLE, fontWeight: 900, fontSize: 90, color: C.blue,
          transform: `scale(${Math.min(p, 1.15)}) rotate(${(k - 1) * 12}deg)`, opacity: Math.min(1, p * 2)}}>?</div> : null;
      })}
      <StampX text="НЕ НАШЛИ" angle={-8} f={f} at={stamp} fps={fps} pos={{left: 560, top: 1090}} />
      <div style={{position: 'absolute', left: 0, top: 1368, width: 1080, height: 0}}><Chip text="Гентский алтарь · ван Эйки, 1432" p={interpolate(f, [4, 16], [0, 1], clamp)} bottom={0} /></div>
    </Stage>
  );
};

// --- подозреваемый идёт и падает в могилу ----------------------------------------------------------------
export const Grave = ({dur, scene}) => {
  const {f, fps, inP, out} = useFx(dur);
  const months = ['АПР', 'МАЙ', 'ИЮН', 'ИЮЛ', 'АВГ', 'СЕН', 'ОКТ', 'НОЯ'];
  const T = (w) => rel(w, scene, fps);
  const m0 = T(scene.monthsAt), walkAt = T(scene.walkAt), fallAt = T(scene.fallAt), sayAt = T(scene.sayAt);
  const cross = spring({frame: f - fallAt, fps, config: {damping: 8, stiffness: 200}});
  const GY = 1330, PITX = 600;
  const walkX = interpolate(f, [walkAt, fallAt], [-120, PITX - 10], {...clamp, easing: Easing.linear});
  const falling = f >= fallAt;
  const fp = interpolate(f, [fallAt, fallAt + 16], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
  const stone = spring({frame: f - fallAt - 14, fps, config: {damping: 9, stiffness: 190}});
  const say = 'Только я знаю,\nгде она.';
  const n = Math.max(0, Math.min(say.length, Math.floor((f - sayAt) * 0.8)));
  const bubble = spring({frame: f - sayAt + 4, fps, config: {damping: 10, stiffness: 160}});
  return (
    <Stage inP={inP} out={out} rot={0}>
      <div style={{position: 'absolute', left: 54, top: 580, width: 972}}>
        <div style={{display: 'flex', gap: 6}}>
          {months.map((mn, i) => {
            const on = f >= m0 + i * 5;
            const last = i === months.length - 1;
            return (
              <div key={mn} style={{width: 115, height: 110, borderRadius: 14, background: on ? (last ? C.ink : C.blue) : '#E7DFD0', color: on ? '#fff' : '#B5AC9C',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 34, transform: `scale(${on ? 1 : 0.94})`,
                boxShadow: on ? '0 10px 20px rgba(43,63,160,0.3)' : 'none'}}>{mn}</div>
            );
          })}
        </div>
        <div style={{marginTop: 14, fontFamily: BODY, fontWeight: 800, fontSize: 28, letterSpacing: 6, color: C.grey}}>1934</div>
      </div>
      <div style={{position: 'absolute', left: 54, top: 490, width: 420}}><Badge text="Улика №5" p={inP} /></div>
      {/* кладбище */}
      <div style={{position: 'absolute', left: 40, top: 760, width: 1000, height: 600, borderRadius: 26, background: '#E7EBF3', boxShadow: 'inset 0 0 70px rgba(43,63,160,0.12)'}} />
      {f < fallAt + 40 && (
        <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: GY + 6, overflow: 'hidden', zIndex: 5}}>
        <Man x={falling ? PITX - 10 + fp * 40 : walkX} y={GY + fp * 330} s={1.0} dir={1} color={C.blue} qface phase={falling ? 0 : f * 0.5}
          a1={falling ? 2.6 : 0.25} a2={falling ? 2.4 : 0.15} rot={falling ? fp * 75 : 0} z={5} />
        </div>
      )}
      {f >= walkAt && f < fallAt && (
        <div style={{position: 'absolute', left: walkX - 140, top: GY - 480, zIndex: 9, padding: '8px 20px', background: '#fff', borderRadius: 12, fontFamily: BODY, fontWeight: 800, fontSize: 26, color: C.ink,
          boxShadow: '0 10px 20px rgba(30,30,30,0.25)', whiteSpace: 'nowrap'}}>ПОДОЗРЕВАЕМЫЙ</div>
      )}
      {/* земля закрывает упавшего */}
      <div style={{position: 'absolute', left: 40, top: GY, width: 1000, height: 60, background: '#6B4A2B', zIndex: 8, borderRadius: '0 0 26px 26px'}} />
      <div style={{position: 'absolute', left: PITX - 120, top: GY - 6, width: 240, height: 56, borderRadius: '50%', background: '#1a0f06', zIndex: 9}} />
      {falling && Array.from({length: 10}).map((_, i) => {
        const k = f - fallAt - 14;
        if (k < 0) return null;
        const a = (i / 10) * Math.PI;
        return <div key={i} style={{position: 'absolute', left: PITX - Math.cos(a) * (30 + k * 6), top: GY - Math.sin(a) * (20 + k * 5), width: 20, height: 20, borderRadius: '50%', zIndex: 10,
          background: i % 2 ? '#8A6A45' : '#B79C74', opacity: Math.max(0, 1 - k / 18)}} />;
      })}
      {f >= fallAt + 14 && (
        <svg width="190" height="270" viewBox="0 0 190 270" style={{position: 'absolute', left: PITX + 150, top: GY - 250, zIndex: 9, overflow: 'visible', transform: `scale(${Math.min(stone, 1.1)})`, transformOrigin: '95px 270px'}}>
          <path d="M20 270 V90 Q20 10 95 10 Q170 10 170 90 V270 Z" fill="#CFC8BA" stroke="#8c8678" strokeWidth="5" />
          <rect x="87" y="60" width="16" height="96" rx="3" fill="#8c8678" /><rect x="58" y="86" width="74" height="16" rx="3" fill="#8c8678" />
        </svg>
      )}
      {f >= sayAt - 4 && (
        <div style={{position: 'absolute', left: 330, top: 830, width: 570, height: 380, zIndex: 11, transform: `scale(${Math.min(bubble, 1.06)}) rotate(-1deg)`, transformOrigin: '60% 100%'}}>
          <svg width="570" height="380" viewBox="0 0 570 380" style={{position: 'absolute', left: 0, top: 0, filter: 'drop-shadow(0 20px 26px rgba(30,30,30,0.25))'}}>
            <path d="M50 0 H520 Q570 0 570 50 V260 Q570 310 520 310 H350 L290 380 L260 310 H50 Q0 310 0 260 V50 Q0 0 50 0 Z" fill="#fff" />
          </svg>
          <div style={{position: 'absolute', left: 36, top: 54, fontFamily: TITLE, fontWeight: 800, fontSize: 64, lineHeight: 1.18, color: C.ink, whiteSpace: 'pre'}}>
            {say.slice(0, n)}<span style={{opacity: n < say.length ? 1 : 0}}>|</span>
          </div>
        </div>
      )}
    </Stage>
  );
};
