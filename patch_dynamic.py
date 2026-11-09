"""Заменяет PhotoCard в remotion/src/Main.jsx на динамичную версию (шоты-врезки, обводка, стикеры, «похороны»)."""
import re

p = 'remotion/src/Main.jsx'
s = open(p, encoding='utf-8').read()
a = s.index('const PhotoCard = ')
b = s.index('// --- сцены')

new = r'''const DIRS = ['b', 'r', 'l', 't'];
const DV = {b: [0, 1], r: [1, 0], l: [-1, 0], t: [0, -1]};

// обводка «от руки»: эллипс дорисовывается по кругу
const Ring = ({cx, cy, rx, ry, sf}) => {
  const len = 2 * Math.PI * Math.sqrt((rx * rx + ry * ry) / 2);
  const p = interpolate(sf, [4, 20], [0, 1], {...clamp, easing: ease});
  const pulse = 1 + Math.sin(sf / 6) * 0.015 * Math.min(1, p);
  return (
    <svg width={CARD_W} height={CARD_W * 1.3} style={{position: 'absolute', left: 0, top: 0, zIndex: 4, overflow: 'visible'}}>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={C.blue} strokeWidth="12" strokeLinecap="round"
        strokeDasharray={len} strokeDashoffset={len * (1 - p)} transform={`rotate(-12 ${cx} ${cy}) scale(${pulse})`}
        style={{transformOrigin: `${cx}px ${cy}px`, filter: 'drop-shadow(0 6px 10px rgba(43,63,160,0.35))'}} />
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

const PhotoCard = ({scene, dur}) => {
  const {f, fps, inP, out} = useSceneFx(dur);
  const CARD_H = scene.h || CARD_H0, CARD_TOP = scene.top || CARD_TOP0;
  const img = script.images[scene.image];
  const [iw, ih] = img.size;
  const base = Math.max(CARD_W / iw, CARD_H / ih);
  const startF = sec(t0(scene.from), fps);
  const shots = scene.shots || [{at: scene.from, focus: scene.focus, zoom: 1}];
  const at = (i) => sec(t0(shots[i].at), fps) - startF;
  let si = 0;
  shots.forEach((_, i) => { if (f >= at(i)) si = i; });
  const shot = shots[si];
  const sf = Math.max(0, f - at(si));
  const len = Math.max(1, (shots[si + 1] ? at(si + 1) : dur) - at(si));
  const cut = si > 0 ? 1 : 0;
  const punch = cut * 0.12 * Math.exp(-sf / 4);
  const sc = base * (shot.zoom || 1) * (1.04 + 0.12 * (sf / len)) * (1 + punch);
  const fx = shot.focus || scene.focus;
  const ox = CARD_W / 2 - fx[0] * iw * sc;
  const oy = CARD_H / 2 - fx[1] * ih * sc;
  const cx = Math.min(0, Math.max(CARD_W - iw * sc, ox));
  const cy = Math.min(0, Math.max(CARD_H - ih * sc, oy));
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
      {scene.ghost && (
        <div style={{position: 'absolute', left: ghostX, top: CARD_TOP + CARD_H / 2 - 230, fontFamily: TITLE, fontWeight: 900,
          fontSize: 460, lineHeight: 1, whiteSpace: 'nowrap', color: 'rgba(43,63,160,0.08)', opacity: Math.min(1, inP) * (1 - out)}}>{scene.ghost}</div>
      )}
      <div style={{position: 'absolute', left: (1080 - CARD_W) / 2 + shake, top: CARD_TOP, width: CARD_W, height: CARD_H,
        transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${1 - out * 0.05})`, opacity: Math.min(1, inP * 2.5) * (1 - out)}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 38, overflow: 'hidden', background: '#fff',
          boxShadow: '0 40px 80px rgba(30,30,30,0.28)', border: '14px solid #fff'}}>
          <div style={{position: 'absolute', inset: 0, borderRadius: 26, overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: cx, top: cy, width: iw * sc, height: ih * sc,
              backgroundImage: `url(${staticFile(img.file)})`, backgroundSize: '100% 100%'}} />
            {cut ? <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: 0.55 * Math.exp(-sf / 2.5)}} /> : null}
          </div>
        </div>
        <Badge text={scene.badge} p={Math.min(inP, 1.1)} />
        {scene.headline && (
          <div style={{position: 'absolute', left: -60, width: CARD_W + 120, top: -330, textAlign: 'center', transform: `scale(${Math.min(inP, 1.05)})`}}>
            <div style={{fontFamily: TITLE, fontWeight: 900, fontSize: 200, lineHeight: 1, color: C.blue}}>{scene.headline[0]}</div>
            <div style={{fontFamily: TITLE, fontWeight: 800, fontSize: 92, lineHeight: 1.1, color: C.ink}}>{scene.headline[1]}</div>
          </div>
        )}
        {shot.ring && <Ring key={si} cx={CARD_W / 2 + (shot.ring.dx || 0)} cy={CARD_H / 2 + (shot.ring.dy || 0)}
          rx={shot.ring.rx} ry={shot.ring.ry} sf={sf} />}
        {shot.note && <Note note={shot.note} sf={sf} fps={fps} />}
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

// полоса-«шторка» на стыках сцен
const Wipes = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      {script.scenes.slice(1).map((sc) => {
        const d = f - sec(t0(sc.from), fps) + 4;
        if (d < 0 || d > 11) return null;
        const x = interpolate(d, [0, 11], [-1500, 1500]);
        return <div key={sc.id} style={{position: 'absolute', top: 0, left: 0, width: 760, height: 1920, background: C.blue,
          opacity: 0.92, transform: `translateX(${x}px) skewX(-14deg)`}} />;
      })}
    </>
  );
};

'''
s = s[:a] + new + s[b:]
s = s.replace('      <Diagram />', '      <Wipes />\n      <Diagram />', 1)
open(p, 'w', encoding='utf-8').write(s)
print('ok')
