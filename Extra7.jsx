import React from 'react';
import {spring, interpolate, Easing} from 'remotion';
import {C, TITLE, BODY, clamp, ease, rel, rnd, useFx, Badge, StampX, Stage} from './Extra';

// Сцены видео 7 («Рыцарь против улитки»): дуэль, шкала веков, подсчёт, 26 объяснений.
const STEEL = '#B8C0D0', STEEL_D = '#8F98AB', INK = '#1E1E1E';

// pathLength=1: линия «рисуется» от 0 до 1 (draw), потом заливка (fill)
const D = (p, extra = {}) => ({pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p, ...extra});

export const KnightArt = ({draw = 1, fill = 1, swing = 0}) => {
  const f = (c) => ({fill: c, fillOpacity: fill});
  const st = {stroke: INK, strokeWidth: 5, strokeLinejoin: 'round', strokeLinecap: 'round'};
  return (
    <g>
      <rect x="-32" y="-112" width="24" height="112" rx="8" {...st} {...D(draw)} {...f(STEEL_D)} />
      <rect x="8" y="-112" width="24" height="112" rx="8" {...st} {...D(draw)} {...f(STEEL_D)} />
      <rect x="-40" y="-232" width="80" height="130" rx="16" {...st} {...D(draw)} {...f(STEEL)} />
      <rect x="-28" y="-222" width="56" height="108" rx="8" {...st} {...D(draw)} {...f(C.blue)} />
      <path d="M0 -220 V-116 M-26 -180 H26" {...st} stroke={C.gold} {...D(draw)} fill="none" />
      <rect x="-32" y="-304" width="64" height="76" rx="26" {...st} {...D(draw)} {...f(STEEL)} />
      <rect x="-22" y="-272" width="52" height="9" rx="4" fill={INK} opacity={draw} />
      <path d="M-4 -304 Q10 -350 40 -330 Q20 -320 18 -304 Z" {...st} {...D(draw)} {...f(C.blue)} />
      <g transform={`rotate(${swing} 34 -190)`}>
        <path d="M34 -190 L98 -250" {...st} strokeWidth="12" {...D(draw)} fill="none" />
        <path d="M98 -250 L178 -352" {...st} stroke={INK} strokeWidth="14" {...D(draw)} fill="none" />
        <path d="M98 -250 L178 -352" strokeWidth="7" stroke="#E6EBF5" strokeLinecap="round" {...D(draw)} fill="none" />
        <path d="M80 -262 L112 -232" {...st} strokeWidth="9" {...D(draw)} fill="none" />
      </g>
      <path d="M-84 -222 H-30 V-150 Q-30 -118 -57 -108 Q-84 -118 -84 -150 Z" {...st} {...D(draw)} {...f(C.blue)} />
      <path d="M-57 -222 V-110 M-84 -180 H-30" stroke={C.gold} strokeWidth="6" fill="none" opacity={draw} />
    </g>
  );
};

export const SnailArt = ({neck = 0, blink = 1, shell = '#C98A4B'}) => (
  <g>
    <path d={`M-130 0 Q-136 -34 -100 -40 L30 -40 Q92 -40 ${92 + neck * 0.3} -${96 + neck * 0.2} Q ${96 + neck * 0.4} -${136 + neck * 0.3} ${88 + neck} -${142 + neck * 0.4} L${104 + neck} -142 Q116 -128 110 -90 Q110 -4 40 0 Z`}
      fill="#E9CFAE" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
    <circle cx="-30" cy="-100" r="78" fill={shell} stroke={INK} strokeWidth="5" />
    <path d="M-30 -100 m0 0 a14 14 0 1 1 14 14 a28 28 0 1 1 -28 -28 a44 44 0 1 1 44 44 a60 60 0 1 1 -60 -60" fill="none" stroke="#6B3E14" strokeWidth="6" strokeLinecap="round" />
    <line x1={92 + neck} y1="-146" x2={78 + neck} y2="-196" stroke={INK} strokeWidth="5" strokeLinecap="round" />
    <line x1={104 + neck} y1="-146" x2={122 + neck} y2="-196" stroke={INK} strokeWidth="5" strokeLinecap="round" />
    <circle cx={78 + neck} cy="-198" r="9" fill={INK} /><circle cx={122 + neck} cy="-198" r="9" fill={INK} />
    <circle cx={104 + neck} cy="-112" r="8" fill={INK} opacity={blink} />
    <path d={`M${96 + neck} -92 Q${106 + neck} -84 ${116 + neck} -94`} stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
  </g>
);

const Bar = ({x, label, v, color, right}) => (
  <div style={{position: 'absolute', left: x, top: 690, width: 440}}>
    <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 28, letterSpacing: 4, color: C.ink, textAlign: right ? 'right' : 'left'}}>{label}</div>
    <div style={{marginTop: 6, height: 34, borderRadius: 17, background: '#DDD5C8', overflow: 'hidden', border: '4px solid #fff', boxSizing: 'content-box', boxShadow: '0 8px 16px rgba(30,30,30,0.15)'}}>
      <div style={{height: '100%', width: `${v}%`, background: color, borderRadius: 17, marginLeft: right ? `${100 - v}%` : 0}} />
    </div>
  </div>
);

// --- хук: монах рисует рыцаря, рыцарь дерётся с улиткой, улитка побеждает -------------------------------
export const Duel = ({dur, scene}) => {
  const {f, fps, inP, out} = useFx(dur);
  const T = (w) => rel(w, scene, fps);
  const knightAt = T(scene.knightAt), snailAt = T(scene.snailAt), vsAt = T(scene.vsAt), koAt = T(scene.koAt);
  const draw = interpolate(f, [8, knightAt], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const fill = interpolate(f, [knightAt - 6, knightAt + 6], [0, 1], clamp);
  const FLOOR = 1230;
  const sIn = spring({frame: f - snailAt, fps, config: {damping: 12, stiffness: 120}});
  const hits = [vsAt + 4, vsAt + 14, vsAt + 24];
  const hitK = (h) => (f >= h ? Math.exp(-(f - h) / 4) : 0);
  const hitSum = hits.reduce((a, h) => a + hitK(h), 0);
  const lunge = hits.reduce((a, h) => a + (f >= h - 6 && f < h ? Math.sin(((f - (h - 6)) / 6) * Math.PI) * 70 : 0), 0);
  const bump = hits.reduce((a, h) => a + (f >= h ? -hitK(h) * 90 : 0), 0);
  const knightHP = f < hits[0] ? 100 : f < hits[1] ? 66 : f < hits[2] ? 40 : 18;
  const snailHP = f < hits[0] ? 100 : f < hits[1] ? 96 : f < hits[2] ? 92 : 90;
  const kEnter = interpolate(f, [knightAt, knightAt + 14], [-300, 0], {...clamp, easing: ease});
  const ko = spring({frame: f - koAt, fps, config: {damping: 8, stiffness: 200}});
  const vs = spring({frame: f - vsAt, fps, config: {damping: 7, stiffness: 220}});
  const quill = f < knightAt + 4;
  const qa = interpolate(f, [8, knightAt], [0, 1], clamp);
  return (
    <Stage inP={inP} out={out} rot={0}>
      <div style={{position: 'absolute', left: 0, top: 380, width: 1080, textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 110, lineHeight: 1, color: C.blue}}>Рыцарь</div>
      <div style={{position: 'absolute', left: 0, top: 490, width: 1080, textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 70, lineHeight: 1, color: C.ink}}>против улитки</div>
      <div style={{position: 'absolute', left: 40, top: 800, width: 1000, height: 480, borderRadius: 26, background: '#EFE4CC', boxShadow: 'inset 0 0 70px rgba(120,90,40,0.25)'}} />
      <div style={{position: 'absolute', left: 40, top: FLOOR, width: 1000, height: 50, background: '#CDBE9F', borderRadius: '0 0 26px 26px'}} />
      {f >= vsAt - 6 && <Bar x={70} label="РЫЦАРЬ" v={knightHP} color={C.blue} right={false} />}
      {f >= vsAt - 6 && <Bar x={570} label="УЛИТКА" v={snailHP} color="#C98A4B" right />}
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <g transform={`translate(${250 + kEnter + lunge + bump} ${FLOOR + 6}) scale(1.35) rotate(${hitSum * -7})`} style={{transformOrigin: '0 0'}}>
          <KnightArt draw={draw} fill={fill} swing={lunge > 0 ? -30 : 0} />
        </g>
        {f >= snailAt && (
          <g transform={`translate(${790 + (1 - Math.min(sIn, 1)) * 400 - hitSum * 18} ${FLOOR + 6}) scale(-1.2 1.2)`}>
            <SnailArt neck={lunge > 0 ? 40 : hitSum * 10} blink={f % 40 > 36 ? 0 : 1} />
          </g>
        )}
        {quill && (
          <g transform={`translate(${250 + Math.sin(f / 3) * 30} ${FLOOR - 260 + Math.cos(f / 2.2) * 50 - qa * 30}) rotate(25)`}>
            <path d="M0 0 Q30 -60 90 -120 Q70 -50 20 -4 Z" fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <path d="M0 0 L-12 24" stroke={INK} strokeWidth="5" strokeLinecap="round" />
          </g>
        )}
        {hits.map((h, i) => f >= h && f < h + 10 && (
          <g key={i} transform={`translate(${520 + i * 12} ${FLOOR - 250 - i * 20}) scale(${0.7 + (f - h) * 0.16})`} opacity={1 - (f - h) / 10}>
            <path d="M0 -44 L11 -14 L44 -14 L17 6 L27 38 L0 18 L-27 38 L-17 6 L-44 -14 L-11 -14 Z" fill="#fff" stroke={C.blue} strokeWidth="6" />
          </g>
        ))}
      </svg>
      {f >= vsAt && (
        <div style={{position: 'absolute', left: 0, top: 790, width: 1080, textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 120, color: C.gold,
          WebkitTextStroke: '8px #fff', paintOrder: 'stroke fill', transform: `scale(${Math.min(vs, 1.2)}) rotate(-6deg)`, opacity: f > vsAt + 24 ? 0.0 : 1}}>VS</div>
      )}
      {f >= koAt && (
        <div style={{position: 'absolute', left: 80, top: 1290, width: 920, textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 70, color: '#fff', background: C.blue, borderRadius: 18,
          padding: '12px 0', transform: `scale(${interpolate(ko, [0, 1], [2, 1])}) rotate(-2deg)`, opacity: Math.min(1, ko * 1.6), boxShadow: '0 16px 30px rgba(43,63,160,0.4)'}}>УЛИТКА ПОБЕЖДАЕТ!</div>
      )}
    </Stage>
  );
};

// --- шкала веков: пик улиток на рубеже XIII–XIV веков -------------------------------------------------------
const Snail = ({size = 80}) => (
  <svg width={size} height={size * 0.7} viewBox="-140 -210 280 220" style={{overflow: 'visible'}}>
    <g transform="translate(0 0)"><SnailArt /></g>
  </svg>
);

export const Ages = ({dur, scene}) => {
  const {f, fps, inP, out} = useFx(dur);
  const T = (w) => rel(w, scene, fps);
  const a13 = T(scene.at13), a14 = T(scene.at14);
  const X0 = 90, W = 900, Y = 1000, ppy = W / 200;
  const p13 = interpolate(f, [a13, a13 + 12], [0, 1], {...clamp, easing: ease});
  const p14 = interpolate(f, [a14, a14 + 12], [0, 1], {...clamp, easing: ease});
  const pk = spring({frame: f - a14 - 18, fps, config: {damping: 10, stiffness: 160}});
  return (
    <Stage inP={inP} out={out} rot={0}>
      <div style={{position: 'absolute', left: 0, top: 440, width: 1080, textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 190, lineHeight: 1, color: C.blue}}>XIII–XIV</div>
      <div style={{position: 'absolute', left: 0, top: 650, width: 1080, textAlign: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 40, letterSpacing: 10, color: C.grey}}>ВЕКА</div>
      <div style={{position: 'absolute', left: X0, top: Y - 14, width: W, height: 28, borderRadius: 14, background: '#DDD5C8'}} />
      <div style={{position: 'absolute', left: X0, top: Y - 14, width: (W / 2) * p13, height: 28, borderRadius: '14px 0 0 14px', background: C.blue}} />
      <div style={{position: 'absolute', left: X0 + W / 2, top: Y - 14, width: (W / 2) * p14, height: 28, borderRadius: '0 14px 14px 0', background: C.blueLt || '#5A72E8'}} />
      {[1200, 1250, 1300, 1350, 1400].map((y, i) => (
        <div key={y} style={{position: 'absolute', left: X0 + (y - 1200) * ppy - 60, top: Y + 30, width: 120, textAlign: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 30, color: C.ink}}>{y}</div>
      ))}
      <div style={{position: 'absolute', left: X0, top: Y - 120, width: W / 2, textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 56, color: C.blue, opacity: p13}}>XIII век</div>
      <div style={{position: 'absolute', left: X0 + W / 2, top: Y - 120, width: W / 2, textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 56, color: '#5A72E8', opacity: p14}}>XIV век</div>
      {Array.from({length: 14}).map((_, i) => {
        const yr = 1230 + rnd(i + 2) * 150;
        const peak = Math.abs(yr - 1300) < 30;
        const at = a13 + 8 + i * 4;
        const p = spring({frame: f - at, fps, config: {damping: 9, stiffness: 190}});
        if (f < at) return null;
        return (
          <div key={i} style={{position: 'absolute', left: X0 + (yr - 1200) * ppy - 40, top: Y - 200 - (peak ? 24 : 0) - (i % 3) * 26, transform: `scale(${Math.min(p, 1.1)})`}}>
            <Snail size={peak ? 100 : 76} />
          </div>
        );
      })}
      <div style={{position: 'absolute', left: X0 + 100 * ppy - 200, top: Y + 100, width: 400, textAlign: 'center', opacity: Math.min(1, pk),
        transform: `scale(${Math.min(pk, 1.05)})`}}>
        <div style={{display: 'inline-block', padding: '10px 28px', borderRadius: 30, background: '#fff', color: C.ink, fontFamily: BODY, fontWeight: 800, fontSize: 30, boxShadow: '0 10px 24px rgba(30,30,30,0.2)'}}>пик: 1290–1310</div>
      </div>
      <div style={{position: 'absolute', left: 90, top: 380, width: 420}}><Badge text="Улика №2" p={inP} /></div>
    </Stage>
  );
};

// --- подсчёт: около 70 рисунков --------------------------------------------------------------------------------------
export const Tally = ({dur, scene}) => {
  const {f, fps, inP, out} = useFx(dur);
  const T = (w) => rel(w, scene, fps);
  const a0 = T(scene.countAt);
  const n = Math.round(interpolate(f, [a0, a0 + 38], [0, 70], {...clamp, easing: Easing.out(Easing.quad)}));
  const cols = 10, S = 92;
  return (
    <Stage inP={inP} out={out} rot={-1}>
      <div style={{position: 'absolute', left: 0, top: 410, width: 1080, textAlign: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 44, letterSpacing: 8, color: C.grey}}>ОКОЛО</div>
      <div style={{position: 'absolute', left: 0, top: 440, width: 1080, textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 250, lineHeight: 1.1, color: C.blue}}>{n}</div>
      <div style={{position: 'absolute', left: 80, top: 750, width: 920}}>
        {Array.from({length: 70}).map((_, i) => {
          if (i >= n) return null;
          const r = Math.floor(i / cols), c = i % cols;
          const p = spring({frame: f - (a0 + i * 0.55), fps, config: {damping: 10, stiffness: 240}});
          return (
            <div key={i} style={{position: 'absolute', left: c * S, top: r * 80, transform: `scale(${Math.min(p, 1.15)})`, opacity: Math.min(1, p * 2)}}>
              <svg width="90" height="70" viewBox="-140 -210 280 220" style={{overflow: 'visible'}}>
                <g style={{filter: 'none'}}><SnailArt shell={i % 5 === 0 ? C.blue : '#C98A4B'} /></g>
              </svg>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 90, top: 380, width: 420}}><Badge text="Улика №3" p={inP} /></div>
    </Stage>
  );
};

// --- 26 объяснений, но главной версии нет -------------------------------------------------------------------------------
export const Tiles26 = ({dur, scene}) => {
  const {f, fps, inP, out} = useFx(dur);
  const T = (w) => rel(w, scene, fps);
  const a0 = T(scene.numAt), noAt = T(scene.noAt), stAt = T(scene.stampAt);
  const num = Math.round(interpolate(f, [a0, a0 + 20], [0, 26], {...clamp, easing: ease}));
  const dim = interpolate(f, [noAt, noAt + 12], [0, 1], clamp);
  const shake = f >= noAt && f < noAt + 14 ? Math.sin(f * 3) * 6 * (1 - (f - noAt) / 14) : 0;
  const cols = 7, TS = 122, G = 12;
  return (
    <Stage inP={inP} out={out} rot={1}>
      <div style={{position: 'absolute', left: 0, top: 400, width: 1080, textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 250, lineHeight: 1, color: C.blue}}>{num}</div>
      <div style={{position: 'absolute', left: 0, top: 650, width: 1080, textAlign: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 42, letterSpacing: 8, color: C.grey}}>ОБЪЯСНЕНИЙ</div>
      <div style={{position: 'absolute', left: (1080 - (cols * (TS + G) - G)) / 2 + shake, top: 740, width: cols * (TS + G) - G, height: 4 * (TS + G)}}>
        {Array.from({length: 26}).map((_, i) => {
          const r = Math.floor(i / cols), c = i % cols;
          const at = a0 - 6 + i * 1.3;
          const p = spring({frame: f - at, fps, config: {damping: 10, stiffness: 230}});
          if (f < at) return null;
          const col = i % 2 ? '#2B3FA0' : '#4A63D6';
          return (
            <div key={i} style={{position: 'absolute', left: c * (TS + G), top: r * (TS + G), width: TS, height: TS, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: dim > 0.5 ? '#CFC6B8' : col, color: '#fff', fontFamily: TITLE, fontWeight: 900, fontSize: 52, transform: `scale(${Math.min(p, 1.1)}) rotate(${(1 - Math.min(p, 1)) * 30}deg)`,
              boxShadow: dim > 0.5 ? 'none' : '0 12px 22px rgba(43,63,160,0.28)', transition: 'none'}}>
              {dim > 0.5 ? '?' : i + 1}
            </div>
          );
        })}
      </div>
      <StampX text="ГЛАВНОЙ НЕТ" angle={-7} color={C.gold} f={f} at={stAt} fps={fps} pos={{left: 190, top: 1180}} size={66} />
    </Stage>
  );
};
