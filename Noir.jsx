import React from 'react';
import {
  AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate,
  Easing, staticFile, delayRender, continueRender, Img,
} from 'remotion';
import {script, words} from './current';

// Стиль «нуар»: тёмная сцена с лучом света, рамы-порталы, плёночная шкала внизу.
const N = {bg: '#0E0C0A', cream: '#F3E9D7', amber: '#E8B04B', ember: '#D9482B', blue: '#2B3FA0', blueLt: '#5A72E8', mute: 'rgba(243,233,215,0.3)'};
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
const rnd = (n) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
const rel = (idx, scene, fps) => sec(t0(idx), fps) - sec(t0(scene.from), fps);

const FX = 70, FW = 920, FTOP = 470;

// --- фон: тёмный зал, луч света, зерно ----------------------------------------
const Background = () => {
  const f = useCurrentFrame();
  const sx = 540 + Math.sin(f / 55) * 260;
  return (
    <AbsoluteFill style={{background: N.bg}}>
      <div style={{position: 'absolute', left: sx - 700, top: 120, width: 1400, height: 1400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,176,75,0.14), rgba(232,176,75,0) 62%)'}} />
      <div style={{position: 'absolute', left: 1080 - sx - 600, top: 900, width: 1300, height: 1300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(43,63,160,0.45), rgba(43,63,160,0) 62%)'}} />
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, opacity: 0.11, mixBlendMode: 'overlay'}}>
        <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 7} /></filter>
        <rect width="1080" height="1920" filter="url(#g)" />
      </svg>
    </AbsoluteFill>
  );
};

const Vignette = () => (
  <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.7) 100%)'}} />
);

// --- субтитры сверху (как раньше: сказанное светлое, будущее приглушено) ---------
const Captions = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const now = f / fps;
  let chunk = null;
  for (const c of script.captions) if (now >= t0(c[0][1]) - 0.06) chunk = c;
  if (!chunk) return null;
  const a = Math.min(1, Math.max(0, (now - (t0(chunk[0][1]) - 0.06)) / 0.2));
  return (
    <div style={{position: 'absolute', left: 80, top: 170, width: 920, textAlign: 'center', fontFamily: BODY, fontWeight: 800,
      fontSize: 68, lineHeight: 1.16, opacity: a, filter: `blur(${(1 - a) * 8}px)`, transform: `translateY(${(1 - a) * 12}px)`,
      textWrap: 'balance', textShadow: '0 3px 18px rgba(0,0,0,0.75)'}}>
      {chunk.map(([txt, s0], i) => (
        <span key={i} style={{color: now >= words[s0].start ? N.cream : 'rgba(243,233,215,0.3)'}}>{txt}{' '}</span>
      ))}
    </div>
  );
};

// --- нижняя шкала: киноплёнка, кадр = шаг расследования -------------------------
const FilmStrip = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const nodes = script.diagram.nodes;
  const times = nodes.map((n) => sec(t0(n.at), fps));
  const done = times.filter((t) => f >= t).length;
  const X0 = 70, W = 940, Y = 1530, H = 150, gap = 10;
  const cw = (W - gap * (nodes.length - 1)) / nodes.length;
  const appear = interpolate(f, [0, 14], [0, 1], clamp);
  const sprocket = (y) => Array.from({length: 40}).map((_, i) => (
    <div key={i} style={{position: 'absolute', left: ((i * 30 - f * 0.9) % 1200 + 1200) % 1200 - 60 + X0 - 0, top: y, width: 14, height: 10, borderRadius: 3,
      background: 'rgba(243,233,215,0.28)', display: ((i * 30 - f * 0.9) % 1200 + 1200) % 1200 < 1000 ? 'block' : 'none'}} />
  ));
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: appear, transform: `translateY(${(1 - appear) * 60}px)`}}>
      <div style={{position: 'absolute', left: X0, top: Y - 56, fontFamily: BODY, fontWeight: 800, fontSize: 25, letterSpacing: 4, color: N.mute}}>{script.diagram.title}</div>
      <div style={{position: 'absolute', left: X0 - 14, top: Y, width: W + 28, height: H, borderRadius: 14, background: '#050403', border: '2px solid rgba(243,233,215,0.15)'}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, overflow: 'hidden', clipPath: `inset(${Y}px 40px ${1920 - Y - H}px 56px)`}}>
        {sprocket(Y + 10)}{sprocket(Y + H - 20)}
      </div>
      {nodes.map((n, i) => {
        const on = f >= times[i];
        const cur = done - 1 === i;
        const last = i === nodes.length - 1;
        const pop = spring({frame: f - times[i], fps, config: {damping: 11, stiffness: 190}});
        const col = last ? N.amber : N.cream;
        return (
          <div key={i} style={{position: 'absolute', left: X0 + i * (cw + gap), top: Y + 34, width: cw, height: H - 68, borderRadius: 8,
            background: on ? (last ? N.amber : N.blue) : 'rgba(243,233,215,0.06)',
            border: `3px solid ${on ? (last ? N.amber : N.blueLt) : 'rgba(243,233,215,0.22)'}`,
            boxShadow: cur ? `0 0 ${24 + 10 * Math.sin(f / 4)}px ${last ? 'rgba(232,176,75,0.8)' : 'rgba(90,114,232,0.9)'}` : 'none',
            transform: `scale(${on ? 0.92 + 0.08 * Math.min(pop, 1.3) : 1})`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{fontFamily: TITLE, fontWeight: 900, fontSize: 31, lineHeight: 1, color: on ? (last ? '#14100C' : '#fff') : 'rgba(243,233,215,0.25)'}}>{n.label}</div>
            <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 18, marginTop: 5, letterSpacing: 1, color: on ? (last ? 'rgba(20,16,12,0.65)' : 'rgba(255,255,255,0.7)') : 'rgba(243,233,215,0.18)'}}>{n.sub}</div>
          </div>
        );
      })}
    </div>
  );
};

// --- общие кирпичики -----------------------------------------------------------
const useScene = (dur) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const open = interpolate(f, [0, 16], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const out = interpolate(f, [dur - 6, dur], [0, 1], clamp);
  return {f, fps, open, out};
};

const Curtain = ({open, out, f, fps, scene, children}) => {
  const zoomIn = scene.enter === 'zoom';
  const zp = interpolate(f, [0, 9], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  let punch = 0;
  (scene.punches || []).forEach((w) => { const pf = rel(w, scene, fps); if (f >= pf) punch += 0.11 * Math.exp(-(f - pf) / 4.5); });
  const scale = (zoomIn ? 1 + (1 - zp) * 0.4 : 1) + punch;
  return (
    <AbsoluteFill style={{clipPath: zoomIn ? undefined : `inset(0 ${(1 - open) * 50}% 0 ${(1 - open) * 50}%)`, opacity: 1 - out,
      transform: `scale(${scale})`, filter: zoomIn && zp < 1 ? `blur(${(1 - zp) * 16}px)` : undefined, transformOrigin: '50% 45%'}}>{children}</AbsoluteFill>
  );
};

// кисть (лак), солнце, ножницы и силуэты: иконки вместо наклеек
const Brush = ({tilt = 0}) => (
  <svg width="130" height="130" viewBox="-20 -110 130 130" style={{position: 'absolute', overflow: 'visible', transform: `rotate(${tilt}deg)`, filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.6))'}}>
    <g transform="rotate(35)">
      <rect x="-9" y="-100" width="18" height="70" rx="8" fill="#8a5a2b" />
      <rect x="-12" y="-34" width="24" height="26" rx="3" fill="#c9c2b4" />
      <path d="M-12 -8 L12 -8 L7 26 Q0 40 -7 26 Z" fill="#6b3a0c" />
    </g>
  </svg>
);

const Sun = ({f, at, fps, style}) => {
  const p = spring({frame: f - at, fps, config: {damping: 8, stiffness: 130}});
  if (f < at) return null;
  const pulse = 1 + Math.sin(f / 4) * 0.04;
  return (
    <svg width="300" height="300" viewBox="-150 -150 300 300" style={{position: 'absolute', zIndex: 9, transform: `scale(${Math.min(p, 1.15) * pulse}) rotate(${(1 - Math.min(p, 1)) * -60}deg)`,
      filter: 'drop-shadow(0 0 40px rgba(255,214,120,0.9))', ...style}}>
      <defs><radialGradient id="sunG"><stop offset="0" stopColor="#FFF3C4" /><stop offset="0.7" stopColor="#F5C451" /><stop offset="1" stopColor="#E8A021" /></radialGradient></defs>
      <g transform={`rotate(${f * 1.6})`}>
        {Array.from({length: 14}).map((_, i) => (
          <path key={i} d="M-13 -92 L0 -146 L13 -92 Z" fill="#F5C451" transform={`rotate(${i * (360 / 14)})`} opacity={i % 2 ? 0.75 : 1} />
        ))}
      </g>
      <circle r="84" fill="url(#sunG)" />
      <circle r="84" fill="none" stroke="#fff" strokeWidth="4" opacity="0.6" />
    </svg>
  );
};

const Scissors = ({x, y, rot, f}) => {
  const a = 8 + 16 * (0.5 + 0.5 * Math.sin(f * 1.1));
  const blade = (sgn) => (
    <g transform={`rotate(${sgn * a})`}>
      <path d="M0 0 L78 -5 L78 0 Z" transform={sgn < 0 ? 'scale(1 -1)' : undefined} fill="#e8e2d4" stroke="#8c8678" strokeWidth="1.5" />
      <circle cx="-22" cy={sgn * 15} r="15" fill="none" stroke={N.amber} strokeWidth="7" />
    </g>
  );
  return (
    <svg width="160" height="120" viewBox="-40 -60 160 120" style={{position: 'absolute', left: x - 60, top: y - 60, overflow: 'visible', zIndex: 8,
      transform: `rotate(${rot}deg)`, filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.7))'}}>
      {blade(1)}{blade(-1)}<circle r="5" fill="#8c8678" />
    </svg>
  );
};

const Person = ({x, y, s = 1, color, glow}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} style={{filter: glow ? `drop-shadow(0 0 14px ${color})` : undefined}}>
    <circle cx="0" cy="-34" r="15" fill={color} />
    <path d="M-22 40 L-22 -8 Q0 -22 22 -8 L22 40 Z" fill={color} />
  </g>
);

const Placard = ({text, sub, top, p}) => (
  <div style={{position: 'absolute', left: FX + 90, top, width: FW - 180, padding: '12px 24px', background: N.cream, color: '#14100C',
    textAlign: 'center', borderRadius: 4, boxShadow: '0 12px 30px rgba(0,0,0,0.6)', transform: `translateY(${(1 - Math.min(p, 1)) * 40}px)`,
    opacity: Math.min(p, 1)}}>
    <div style={{fontFamily: TITLE, fontWeight: 800, fontStyle: 'italic', fontSize: 34, lineHeight: 1.1}}>{text}</div>
    {sub && <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 20, marginTop: 4, color: 'rgba(20,16,12,0.65)', letterSpacing: 1}}>{sub}</div>}
  </div>
);

const NStamp = ({text, angle = -8, frame, at, fps, pos, color = N.amber}) => {
  const p = spring({frame: frame - at, fps, config: {damping: 8, stiffness: 220}});
  if (frame < at) return null;
  return (
    <div style={{position: 'absolute', ...pos, zIndex: 9, transform: `rotate(${angle}deg) scale(${interpolate(p, [0, 1], [2.6, 1])})`,
      opacity: Math.min(1, p * 1.6), padding: '8px 26px', border: `7px solid ${color}`, color, background: 'rgba(14,12,10,0.86)',
      fontFamily: TITLE, fontWeight: 900, fontSize: 64, letterSpacing: 3, whiteSpace: 'nowrap'}}>{text}</div>
  );
};

// рама-портал с картиной внутри; children рисуются поверх картины в координатах внутренней части
const Art = ({img, focus, zoom = 1, drift = 0.08, sf, len, w, h, filter, vig = 0.45, children, style}) => {
  const [iw, ih] = img.size;
  const IW = w - 24, IH = h - 24;
  const base = Math.max(IW / iw, IH / ih);
  const sc = base * zoom * (1 + drift * Math.min(1, sf / Math.max(1, len)));
  const cx = Math.min(0, Math.max(IW - iw * sc, IW / 2 - focus[0] * iw * sc));
  const cy = Math.min(0, Math.max(IH - ih * sc, IH / 2 - focus[1] * ih * sc));
  return (
    <div style={{position: 'absolute', width: w, height: h, padding: 12, borderRadius: 10,
      background: 'linear-gradient(135deg, #8a6a35, #3a2814 45%, #a88540)', boxShadow: '0 40px 90px rgba(0,0,0,0.75), 0 0 0 2px rgba(232,176,75,0.45), 0 0 120px 10px rgba(43,63,160,0.55)', ...style}}>
      <div style={{position: 'relative', width: IW, height: IH, overflow: 'hidden', background: '#000'}}>
        <div style={{position: 'absolute', left: cx, top: cy, width: iw * sc, height: ih * sc, filter,
          backgroundImage: `url(${staticFile(img.file)})`, backgroundSize: '100% 100%'}} />
        <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,${vig}) 100%)`}} />
        {children}
      </div>
    </div>
  );
};

const SunRays = ({f, strength = 1, cy}) => (
  <div style={{position: 'absolute', left: 540 - 900, top: cy - 900, width: 1800, height: 1800, borderRadius: '50%', opacity: 0.34 * strength,
    background: 'repeating-conic-gradient(from 0deg, rgba(232,176,75,0.9) 0deg 7deg, rgba(232,176,75,0) 7deg 22deg)',
    WebkitMaskImage: 'radial-gradient(circle, #000 5%, transparent 62%)', maskImage: 'radial-gradient(circle, #000 5%, transparent 62%)',
    transform: `rotate(${f * 0.7}deg)`}} />
);

// --- сцены ------------------------------------------------------------------
const FullArt = ({img, f, dur, bright, sat = 1, focus = [0.5, 0.45], z0 = 1.05, z1 = 1.22, zStart = 0}) => {
  const [iw, ih] = img.size;
  const sc = Math.max(1080 / iw, 1920 / ih) * (z0 + (z1 - z0) * Math.min(1, (f + zStart) / dur));
  const cx = Math.min(0, Math.max(1080 - iw * sc, 540 - focus[0] * iw * sc));
  const cy = Math.min(0, Math.max(1920 - ih * sc, 960 - focus[1] * ih * sc));
  return <div style={{position: 'absolute', left: cx, top: cy, width: iw * sc, height: ih * sc, filter: `brightness(${bright}) saturate(${sat})`,
    backgroundImage: `url(${staticFile(img.file)})`, backgroundSize: '100% 100%'}} />;
};

const Letters = ({text, f, start = 0, size, color, gap = 3, drop = 220, style}) => (
  <div style={{display: 'flex', justifyContent: 'center', ...style}}>
    {text.split('').map((ch, i) => {
      const p = spring({frame: f - start - i * 2.5, fps: 30, config: {damping: 11, stiffness: 170}});
      return <span key={i} style={{display: 'inline-block', fontFamily: TITLE, fontWeight: 900, fontSize: size, lineHeight: 1, color,
        marginRight: gap, transform: `translateY(${(1 - Math.min(p, 1)) * -drop}px) scale(${0.7 + 0.3 * Math.min(p, 1.15)})`,
        opacity: Math.min(1, p * 2), filter: `blur(${Math.max(0, 1 - p) * 10}px)`, textShadow: '0 8px 40px rgba(0,0,0,0.8)'}}>{ch}</span>;
    })}
  </div>
);

const Hook = ({dur, scene}) => {
  const {f, fps} = useScene(dur);
  const img = script.images[scene.image];
  const strikeAt = rel(scene.strikeAt, scene, fps), smallAt = rel(scene.smallAt, scene, fps);
  const strike = interpolate(f, [strikeAt, strikeAt + 7], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const small = spring({frame: f - smallAt, fps, config: {damping: 12, stiffness: 150}});
  const cone = 0.5 + 0.5 * Math.sin(f / 9);
  return (
    <AbsoluteFill>
      <FullArt img={img} f={f} dur={dur} bright={0.22 + 0.04 * cone} focus={[0.5, 0.5]} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(14,12,10,0.85), rgba(14,12,10,0.25) 45%, rgba(14,12,10,0.9))'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 54, letterSpacing: 12,
        color: N.amber, opacity: Math.min(1, small), transform: `scale(${0.8 + 0.2 * Math.min(small, 1)})`}}>ВОВСЕ НЕ</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 650, transform: `rotate(${-2 * Math.min(1, strike)}deg)`}}>
        <Letters text="НОЧНОЙ" f={f} size={168} color={N.cream} gap={6} />
        <div style={{position: 'absolute', left: 60, top: 100, height: 20, width: 960 * strike, borderRadius: 10, background: N.ember,
          boxShadow: '0 0 40px rgba(217,72,43,0.9)'}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1000, textAlign: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 30, letterSpacing: 8,
        color: N.mute}}>ДЕЛО №5 · РЕМБРАНДТ</div>
    </AbsoluteFill>
  );
};

const Day = ({dur, scene}) => {
  const {f, fps} = useScene(dur);
  const img = script.images[scene.image];
  const flash = interpolate(f, [0, 4, 14], [1, 0.4, 0], clamp);
  const pf = rel(scene.punch, scene, fps);
  const pz = f >= pf ? 0.1 * Math.exp(-(f - pf) / 4.5) : 0;
  const bright = interpolate(f, [0, 14], [0.3, 1.05], {...clamp, easing: ease});
  return (
    <AbsoluteFill style={{transform: `scale(${1 + pz})`}}>
      <FullArt img={img} f={f} dur={dur} bright={bright} sat={1.15} focus={[0.5, 0.5]} z0={1.2} z1={1.32} />
      <SunRays f={f} strength={interpolate(f, [0, 20], [0, 1], clamp)} cy={820} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(14,12,10,0.7), rgba(14,12,10,0) 35%, rgba(14,12,10,0) 60%, rgba(14,12,10,0.85))'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 590, textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 90, color: N.cream,
        opacity: 0.55, transform: 'rotate(-2deg)'}}>
        <span style={{position: 'relative'}}>НОЧНОЙ<span style={{position: 'absolute', left: -10, right: -10, top: '52%', height: 9, background: N.ember}} /></span>
      </div>
      <Letters text="ДНЕВНОЙ" f={f} start={4} size={178} color={N.amber} gap={4} drop={300} style={{position: 'absolute', left: 0, right: 0, top: 690}} />
      <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash}} />
    </AbsoluteFill>
  );
};

const Soot = ({f, p, w, h}) => (
  <>
    {Array.from({length: 26}).map((_, i) => {
      const x = rnd(i + 1) * w, sz = 6 + rnd(i + 40) * 16, sp = 0.6 + rnd(i + 80) * 1.4;
      const y = h - ((f * sp + rnd(i + 120) * h) % (h + 40)) + 20;
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: sz, height: sz, borderRadius: '50%', opacity: 0.55 * p,
        background: i % 3 ? '#0c0805' : '#3a2410', filter: 'blur(2px)'}} />;
    })}
  </>
);

const DARK = (p) => `brightness(${1 - 0.42 * p}) sepia(${0.75 * p}) saturate(${1 - 0.2 * p}) contrast(${1 + 0.1 * p})`;

const Darken = ({dur, scene}) => {
  const {f, fps, open, out} = useScene(dur);
  const img = script.images[scene.image];
  const p = interpolate(f, [rel(scene.darkFrom, scene, fps), rel(scene.darkTo, scene, fps) + 8], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const plaqueAt = rel(scene.plaque.at, scene, fps);
  const plaque = spring({frame: f - plaqueAt, fps, config: {damping: 9, stiffness: 190}});
  const H = 880;
  return (
    <Curtain {...{open, out, f, fps, scene}}>
      <div style={{position: 'absolute', left: FX, top: FTOP, width: FW}}>
        <Art img={img} focus={[0.45, 0.5]} zoom={1.0} sf={f} len={dur} w={FW} h={H} filter={DARK(p)} vig={0.4 + 0.3 * p}>
          {[0, 1, 2, 3].map((k) => {
            const a = rel(scene.darkFrom, scene, fps) + k * 9;
            const pc = interpolate(f, [a, a + 14], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
            const sh = (H - 24) / 4;
            return (
              <React.Fragment key={k}>
                <div style={{position: 'absolute', left: 0, top: k * sh, width: '100%', height: sh + 1, clipPath: `inset(0 ${(1 - pc) * 100}% 0 0)`,
                  background: 'linear-gradient(180deg, rgba(120,66,12,0.42), rgba(70,36,6,0.5))'}} />
                {pc > 0 && pc < 1 && <div style={{position: 'absolute', left: pc * (FW - 24) - 30, top: k * sh + sh / 2 - 30}}><Brush tilt={Math.sin(f) * 4} /></div>}
              </React.Fragment>
            );
          })}
          <Soot f={f} p={p} w={FW - 24} h={H - 24} />
          <div style={{position: 'absolute', right: 22, top: 40, width: 34, height: 560, borderRadius: 17, background: 'rgba(0,0,0,0.55)',
            border: '2px solid rgba(243,233,215,0.4)', overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${p * 100}%`, background: 'linear-gradient(0deg, #3a2410, #b2761f)'}} />
            {[1, 2, 3, 4].map((k) => <div key={k} style={{position: 'absolute', left: 0, right: 0, top: `${k * 20}%`, height: 2, background: 'rgba(243,233,215,0.5)'}} />)}
          </div>
          <div style={{position: 'absolute', right: 12, top: 610, width: 54, textAlign: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 15, letterSpacing: 1,
            color: N.cream}}>ЛАК</div>
        </Art>
        {f >= plaqueAt && (
          <div style={{position: 'absolute', left: 80, right: 80, top: 560, padding: '24px 20px', background: N.cream, color: '#14100C', textAlign: 'center',
            border: `8px double ${N.amber}`, transform: `scale(${interpolate(plaque, [0, 1], [2.2, 1])}) rotate(-2deg)`, opacity: Math.min(1, plaque * 1.5),
            boxShadow: '0 30px 70px rgba(0,0,0,0.8)'}}>
            <div style={{fontFamily: TITLE, fontWeight: 900, fontSize: 74, lineHeight: 1}}>«Ночной дозор»</div>
            <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 24, letterSpacing: 5, marginTop: 8, color: 'rgba(20,16,12,0.7)'}}>ТАК ЕЁ СТАЛИ ЗВАТЬ</div>
          </div>
        )}
      </div>
      <Placard text="Рембрандт, 1642" sub="так картина выглядела под лаком (иллюстрация)" top={FTOP + H + 28} p={interpolate(f, [8, 22], [0, 1], clamp)} />
    </Curtain>
  );
};

const Clean = ({dur, scene}) => {
  const {f, fps, open, out} = useScene(dur);
  const img = script.images[scene.image];
  const w0 = rel(scene.wipeFrom, scene, fps) - 2, w1 = rel(scene.wipeTo, scene, fps) + 6;
  const wp = interpolate(f, [w0, w1], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const H = 880, IW = FW - 24;
  const label = spring({frame: f - rel(scene.labelAt, scene, fps), fps, config: {damping: 10, stiffness: 190}});
  const sunAt = rel(scene.sun.at, scene, fps);
  return (
    <Curtain {...{open, out, f, fps, scene}}>
      <SunRays f={f} strength={interpolate(f, [sunAt - 4, sunAt + 14], [0, 1], clamp)} cy={FTOP + H / 2} />
      <div style={{position: 'absolute', left: FX, top: FTOP, width: FW}}>
        <Art img={img} focus={[0.45, 0.5]} sf={f} len={dur} w={FW} h={H} filter={DARK(1)} vig={0.7}>
          <div style={{position: 'absolute', inset: 0, clipPath: `inset(0 ${(1 - wp) * 100}% 0 0)`}}>
            <Art img={img} focus={[0.45, 0.5]} sf={f} len={dur} w={FW} h={H} vig={0.3} style={{left: -12, top: -12, padding: 12, boxShadow: 'none', background: 'none'}} />
          </div>
          {wp > 0 && wp < 1 && (
            <div style={{position: 'absolute', left: wp * IW - 6, top: 0, width: 12, height: '100%', background: '#fff',
              boxShadow: '0 0 40px 18px rgba(255,236,190,0.95), 0 0 120px 50px rgba(232,176,75,0.6)'}} />
          )}
        </Art>
        {f >= rel(scene.labelAt, scene, fps) && (
          <div style={{position: 'absolute', left: -14, top: H - 190, fontFamily: TITLE, fontWeight: 900, fontSize: 124, lineHeight: 1, whiteSpace: 'nowrap', color: N.amber,
            WebkitTextStroke: '10px #0E0C0A', paintOrder: 'stroke fill', textShadow: '0 14px 40px rgba(0,0,0,0.9)',
            transform: `scale(${Math.min(label, 1.1)}) rotate(-3deg)`, transformOrigin: 'left bottom'}}>{scene.label}</div>
        )}
        <Sun f={f} at={sunAt} fps={fps} style={{left: FW - 220, top: -150}} />
      </div>
      <Placard text="Rijksmuseum, снятие лака" sub="после реставрации сцена залита дневным светом" top={FTOP + H + 28} p={interpolate(f, [8, 22], [0, 1], clamp)} />
    </Curtain>
  );
};

const RollNum = ({value, f, at, size, color}) => {
  const s = String(value);
  return (
    <div style={{display: 'flex', fontFamily: TITLE, fontWeight: 900, fontSize: size, lineHeight: 1, color, WebkitTextStroke: '10px #0E0C0A', paintOrder: 'stroke fill'}}>
      {s.split('').map((ch, i) => {
        const lock = at + 10 + i * 5;
        const shown = f >= lock ? ch : String(Math.floor((f * 1.3 + i * 3) % 10));
        return <span key={i} style={{display: 'inline-block', width: size * 0.62, textAlign: 'center',
          transform: f >= lock ? `translateY(${-6 * Math.exp(-(f - lock) / 3)}px)` : `translateY(${Math.sin(f * 2 + i) * 6}px)`}}>{shown}</span>;
      })}
    </div>
  );
};

const Hall = ({dur, scene}) => {
  const {f, fps, open, out} = useScene(dur);
  const img = script.images[scene.image];
  const H = 880;
  const a = rel(scene.yearAt, scene, fps) - 6;
  return (
    <Curtain {...{open, out, f, fps, scene}}>
      <div style={{position: 'absolute', left: FX, top: FTOP, width: FW}}>
        <Art img={img} focus={[0.5, 0.5]} zoom={1.0} drift={0.14} sf={f} len={dur} w={FW} h={H} filter="sepia(0.35) brightness(0.85)" vig={0.5}>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 60, display: 'flex', justifyContent: 'center'}}>
            {f >= a && <RollNum value={scene.year} f={f} at={a} size={250} color={N.amber} />}
          </div>
        </Art>
      </div>
      <Placard text="Ратуша на площади Дам" sub="Амстердам · сюда переехала картина" top={FTOP + H + 28} p={interpolate(f, [4, 16], [0, 1], clamp)} />
    </Curtain>
  );
};

const Cut = ({dur, scene}) => {
  const {f, fps, open, out} = useScene(dur);
  const img = script.images[scene.image];
  const W = FW, H = Math.round((FW - 24) * img.size[1] / img.size[0]) + 24;
  const IW = W - 24, IH = H - 24;
  const top = 520;
  const cutAt = rel(scene.cutAt, scene, fps), lostAt = rel(scene.lostAt, scene, fps);
  const cp = interpolate(f, [cutAt, cutAt + 22], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const [l, t, r, b] = scene.crop;
  const L = l * IW * cp, T = t * IH * cp, R = IW - (1 - r) * IW * cp, B = IH - (1 - b) * IH * cp;
  const dim = 'rgba(8,6,4,0.78)';
  const lost = spring({frame: f - lostAt, fps, config: {damping: 9, stiffness: 190}});
  const pulse = 0.5 + 0.5 * Math.sin(f / 3);
  return (
    <Curtain {...{open, out, f, fps, scene}}>
      <div style={{position: 'absolute', left: FX, top, width: W}}>
        <Art img={img} focus={[0.5, 0.5]} drift={0} sf={f} len={dur} w={W} h={H} vig={0.35}>
          <div style={{position: 'absolute', left: 0, top: 0, width: IW, height: T, background: dim}} />
          <div style={{position: 'absolute', left: 0, top: B, width: IW, height: IH - B, background: dim}} />
          <div style={{position: 'absolute', left: 0, top: T, width: L, height: B - T, background: dim}} />
          <div style={{position: 'absolute', left: R, top: T, width: IW - R, height: B - T, background: dim}} />
          {cp > 0 && (
            <svg width={IW} height={IH} style={{position: 'absolute', left: 0, top: 0}}>
              <rect x={L} y={T} width={R - L} height={B - T} fill="none" stroke={N.amber} strokeWidth="6" strokeDasharray="22 14" strokeDashoffset={-f * 3} />
            </svg>
          )}
          {cp > 0 && cp < 1 && (() => {
            const per = 2 * ((R - L) + (B - T)), u = cp * per;
            const wd = R - L, ht = B - T;
            let x, y, rot;
            if (u < wd) { x = L + u; y = T; rot = 0; }
            else if (u < wd + ht) { x = R; y = T + (u - wd); rot = 90; }
            else if (u < 2 * wd + ht) { x = R - (u - wd - ht); y = B; rot = 180; }
            else { x = L; y = B - (u - 2 * wd - ht); rot = 270; }
            return <Scissors x={x} y={y} rot={rot} f={f} />;
          })()}
          {f >= lostAt && (
            <svg width={Math.max(L, 1)} height={IH} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
              <g opacity={0.75 + 0.25 * pulse} transform={`translate(0 ${(1 - Math.min(lost, 1)) * -60})`}>
                <Person x={L / 2} y={IH / 2 - 90} s={1.3 * Math.min(lost, 1.1)} color={N.ember} glow />
                <Person x={L / 2} y={IH / 2 + 30} s={1.3 * Math.min(lost, 1.1)} color={N.ember} glow />
                <text x={L / 2} y={IH / 2 + 140} textAnchor="middle" fontFamily={TITLE} fontWeight="900" fontSize="72" fill="#fff" stroke="#0E0C0A" strokeWidth="8" paintOrder="stroke">−2</text>
              </g>
            </svg>
          )}
        </Art>
      </div>
      <Placard text="Копия Лундена, ок. 1655" sub="так картина выглядела до обрезки (границы приблизительные)" top={top + H + 120} p={interpolate(f, [10, 24], [0, 1], clamp)} />
    </Curtain>
  );
};

const Question = ({dur, scene}) => {
  const {f, fps} = useScene(dur);
  const a = spring({frame: f, fps, config: {damping: 12, stiffness: 120}});
  const b = spring({frame: f - 10, fps, config: {damping: 12, stiffness: 120}});
  const beam = (k, x, phase) => (
    <div key={k} style={{position: 'absolute', left: x - 90, top: 120, width: 180, height: 1700, transformOrigin: '50% 0%',
      transform: `rotate(${Math.sin(f / 22 + phase) * 22}deg)`, opacity: 0.22,
      background: 'linear-gradient(180deg, rgba(90,114,232,0.95), rgba(90,114,232,0))', clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0 100%)'}} />
  );
  return (
    <AbsoluteFill>
      {beam(0, 240, 0)}{beam(1, 840, 2)}
      <div style={{position: 'absolute', top: 440, width: '100%', textAlign: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 560, color: N.amber, lineHeight: 0.9,
        opacity: Math.min(a, 1), transform: `scale(${Math.min(a, 1.05) * (1 + Math.sin(f / 5) * 0.012)})`, textShadow: '0 0 90px rgba(232,176,75,0.55)'}}>?</div>
      <div style={{position: 'absolute', top: 1080, left: 70, right: 70, textAlign: 'center', fontFamily: TITLE, fontWeight: 800, fontSize: 84, lineHeight: 1.12,
        color: N.cream, opacity: Math.min(b, 1), transform: `translateY(${(1 - Math.min(b, 1)) * 50}px)`}}>{scene.text}</div>
    </AbsoluteFill>
  );
};

// --- переходы: у каждого стыка свой ---------------------------------------------
const Trans = ({type, d, seed}) => {
  if (type === 'curtain') {
    const x = interpolate(d, [0, 5, 7, 11], [-540, 0, 0, -540], clamp);
    const pn = (side) => ({position: 'absolute', top: 0, [side]: 0, width: 545, height: 1920, background: 'linear-gradient(90deg, #3b0d0d, #6b1a14 60%, #3b0d0d)',
      boxShadow: 'inset 0 0 80px rgba(0,0,0,0.7)', transform: `translateX(${side === 'left' ? x : -x}px)`, borderRight: side === 'left' ? `6px solid ${N.amber}` : undefined,
      borderLeft: side === 'right' ? `6px solid ${N.amber}` : undefined});
    return <><div style={pn('left')} /><div style={pn('right')} /></>;
  }
  if (type === 'iris') {
    const r = interpolate(d, [0, 5, 6, 11], [1500, 0, 0, 1500], clamp);
    return <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 50%, transparent ${r}px, ${N.blue} ${r + 2}px)`}} />;
  }
  if (type === 'blinds') {
    return Array.from({length: 8}).map((_, i) => {
      const s = interpolate(d, [i * 0.3, 4 + i * 0.3, 7 + i * 0.3, 11], [0, 1, 1, 0], clamp);
      return <div key={i} style={{position: 'absolute', left: i * 135, top: 0, width: 136, height: 1920, background: i % 2 ? N.blue : N.blueLt, transform: `scaleX(${s})`}} />;
    });
  }
  if (type === 'burn') {
    const o = interpolate(d, [0, 4, 11], [0, 1, 0], clamp);
    return <div style={{position: 'absolute', inset: 0, opacity: o, background: 'radial-gradient(circle at 60% 40%, #fff3d0, #ff9a2e 40%, #a3300f 100%)'}} />;
  }
  if (type === 'tear') {
    const y = interpolate(d, [0, 6, 11], [-2100, 0, 2100], clamp);
    const pts = Array.from({length: 13}).map((_, i) => `${i * 90}px ${(i % 2 ? 60 : 0) + rnd(seed + i) * 50}px`).join(',');
    return <div style={{position: 'absolute', left: 0, top: y, width: 1080, height: 2100, background: N.ember,
      clipPath: `polygon(0 0, ${pts}, 1080px 2100px, 0 2100px)`}} />;
  }
  if (type === 'zoom') {
    const o = interpolate(d, [0, 5, 11], [0, 0.95, 0], clamp);
    return (
      <>
        <div style={{position: 'absolute', inset: -400, opacity: o, transform: `scale(${1 + d * 0.12}) rotate(${d * 2}deg)`,
          background: 'repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.95) 0deg 3deg, rgba(43,63,160,0.9) 3deg 9deg)',
          WebkitMaskImage: 'radial-gradient(circle, transparent 8%, #000 70%)', maskImage: 'radial-gradient(circle, transparent 8%, #000 70%)'}} />
        <div style={{position: 'absolute', inset: 0, opacity: interpolate(d, [3, 5, 8], [0, 1, 0], clamp), background: '#fff'}} />
      </>
    );
  }
  if (type === 'shatter') {
    const cols = 6, rows = 10;
    return Array.from({length: cols * rows}).map((_, k) => {
      const i = k % cols, j = Math.floor(k / cols);
      const dl = (i + j) * 0.28 + rnd(seed + k) * 1.2;
      const sc = interpolate(d, [dl, dl + 3.5, dl + 6.5], [0, 1.05, 0], clamp);
      return <div key={k} style={{position: 'absolute', left: i * 180, top: j * 192, width: 181, height: 193, background: (i + j) % 3 === 0 ? N.cream : (i + j) % 3 === 1 ? N.blue : N.blueLt,
        transform: `scale(${sc}) rotate(${(1 - sc) * 70}deg)`}} />;
    });
  }
  if (type === 'spin') {
    const a = interpolate(d, [0, 5.5], [0, 360], clamp), b = interpolate(d, [5.5, 11], [0, 360], clamp);
    return <div style={{position: 'absolute', inset: 0, background: d < 5.5
      ? `conic-gradient(from 0deg at 50% 50%, ${N.blue} 0deg ${a}deg, transparent ${a}deg)`
      : `conic-gradient(from 0deg at 50% 50%, transparent 0deg ${b}deg, ${N.blue} ${b}deg 360deg)`}} />;
  }
  if (type === 'scan') {
    const x = interpolate(d, [0, 11], [-700, 1200], clamp);
    return <div style={{position: 'absolute', left: x, top: 0, width: 640, height: 1920,
      background: 'linear-gradient(90deg, rgba(43,63,160,0), rgba(43,63,160,0.97) 70%, #fff 96%, rgba(255,255,255,0))'}} />;
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
        return <React.Fragment key={sc.id}><Trans type={sc.trans || 'scan'} d={d} seed={sc.id * 17} /></React.Fragment>;
      })}
    </>
  );
};

export const NoirMain = () => {
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
          s.type === 'hook' ? <Hook dur={dur} scene={s} />
          : s.type === 'day' ? <Day dur={dur} scene={s} />
          : s.type === 'darken' ? <Darken dur={dur} scene={s} />
          : s.type === 'clean' ? <Clean dur={dur} scene={s} />
          : s.type === 'hall' ? <Hall dur={dur} scene={s} />
          : s.type === 'cut' ? <Cut dur={dur} scene={s} />
          : <Question dur={dur} scene={s} />;
        return <Sequence key={s.id} from={from} durationInFrames={dur}>{body}</Sequence>;
      })}
      <Vignette />
      <Wipes />
      <FilmStrip />
      <Captions />
    </AbsoluteFill>
  );
};
