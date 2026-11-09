// статуя: белое фото и раскрашенная версия в той же позе; p = доля раскраски (wipe: слева направо, peel: сверху вниз)
const AugCard = ({cx, cy, w, rot = 0, p = 1, mode = 'wipe', divider = false, at = 0, f, fps, z = 12, seed = 41}) => {
  const e = spring({frame: f - at, fps, config: {damping: 14, stiffness: 300}});
  if (f < at) return null;
  const h = w * 1.5;
  const clip = mode === 'wipe' ? `inset(0 ${(1 - p) * 100}% 0 0)` : `inset(${(1 - p) * 100}% 0 0 0)`;
  return (
    <div style={{position: 'absolute', left: cx, top: cy, zIndex: z, transform: `translate(-50%,-50%) rotate(${rot + (1 - Math.min(e, 1)) * 12}deg) scale(${Math.min(e, 1.03) * (1 + (1 - Math.min(e, 1)) * 0.3)})`, opacity: Math.min(1, e * 3),
      filter: 'drop-shadow(14px 22px 16px rgba(60,20,10,0.6))'}}>
      <div style={{position: 'absolute', left: 18, top: 14, right: -18, bottom: -14, clipPath: tornPoly(seed + 3), background: '#2B5CC8', transform: 'rotate(2.5deg)'}} />
      <div style={{position: 'relative', clipPath: tornPoly(seed), background: PAPER, padding: 26}}>
        <div style={{position: 'relative', width: w, height: h, overflow: 'hidden'}}>
          <img src={img('aug_src.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} />
          <img src={img('aug_color.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', clipPath: clip}} />
          {divider && (
            <div style={{position: 'absolute', left: `${p * 100}%`, top: 0, bottom: 0, width: 8, marginLeft: -4, background: '#fff', boxShadow: '0 0 14px rgba(0,0,0,0.5)'}}>
              <div style={{position: 'absolute', top: '50%', left: -30, width: 68, height: 68, marginTop: -34, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: ARCH, fontSize: 30, color: BLK}}>◀▶</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// осыпающиеся чешуйки краски
const FLAKE_COL = ['#C8191E', '#2B5CC8', '#D4A64A', '#F2C230', '#2E8B57', '#F6F0E2'];
const Flakes = ({at, dur = 50, cx, cy, w, h, f}) => {
  if (f < at) return null;
  return (
    <>
      {Array.from({length: 44}).map((_, i) => {
        const t = (f - at - rnd(i * 3 + 1) * 14) / dur;
        if (t < 0 || t > 1.2) return null;
        const x = cx - w / 2 + rnd(i * 5 + 2) * w + Math.sin(t * 6 + i) * 30;
        const y = cy - h / 2 + rnd(i * 7 + 3) * h * 0.7 + t * t * 900 + t * 160;
        const s = 20 + rnd(i * 11 + 4) * 28;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s * 0.7, zIndex: 46, background: FLAKE_COL[i % 6], clipPath: tornPoly(i * 3), transform: `rotate(${t * 420 * (rnd(i) - 0.5) * 3}deg)`, opacity: Math.max(0, 1 - t * t * 0.9)}} />;
      })}
    </>
  );
};

// видео-карточки на бумаге
const VDUR = {work: 151, uvv: 151, hall: 121};
const Vid = ({name, at, f}) => (
  <Sequence from={at}>
    <Freeze frame={Math.min(Math.max(f - at, 0), VDUR[name] - 3)}>
      <OffthreadVideo src={staticFile('n14/vid/' + name + '.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </Freeze>
  </Sequence>
);
const VidCard = ({name, cx, cy, w, rot = 0, at, back = '#2B5CC8', f, fps, z = 14, seed = 90}) => {
  const e = spring({frame: f - at, fps, config: {damping: 14, stiffness: 300}});
  if (f < at) return null;
  const h = w * 4 / 3;
  return (
    <div style={{position: 'absolute', left: cx, top: cy, zIndex: z, transform: `translate(-50%,-50%) rotate(${rot + (1 - Math.min(e, 1)) * 12}deg) scale(${Math.min(e, 1.03) * (1 + (1 - Math.min(e, 1)) * 0.3)})`, opacity: Math.min(1, e * 3),
      filter: 'drop-shadow(14px 22px 16px rgba(60,20,10,0.6))'}}>
      <div style={{position: 'absolute', left: 18, top: 14, right: -18, bottom: -14, clipPath: tornPoly(seed + 3), background: back, transform: 'rotate(2.5deg)'}} />
      <div style={{position: 'relative', clipPath: tornPoly(seed), background: PAPER, padding: 24}}>
        <div style={{position: 'relative', width: w, height: h, overflow: 'hidden', background: '#111'}}><Vid name={name} at={at} f={f} /></div>
      </div>
    </div>
  );
};

// хук: фото античных статуй падают как листья
const LEAVES = [0, 1, 2, 3, 4, 5, 6, 0, 2, 4, 1, 6];
const Leaves = ({f}) => (
  <>
    {LEAVES.map((k, i) => {
      const t = f - (i * 5 - 22);
      if (t < 0 || t > 52) return null;
      const w = 430 + (i % 3) * 50;
      const x = 460 + ((i * 263) % 800) + 90 * Math.sin(t / 6.5 + i * 1.7);
      const y = -480 + t * 66;
      const rot = (i % 2 ? 1 : -1) * (10 + (i % 4) * 3) + 28 * Math.sin(t / 8 + i);
      return <img key={i} src={img(`st_${k}.png`)} style={{position: 'absolute', left: x - w / 2, top: y, width: w, zIndex: 8, transform: `rotate(${rot}deg)`, filter: 'drop-shadow(10px 18px 14px rgba(60,20,10,0.55))'}} />;
    })}
  </>
);

export const Board14Main = () => {
  useFonts();
  useFonts13();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const T = (w) => sec(t0(w), fps) - 3;
  const cam = camAt(f, fps), prev = camAt(Math.max(0, f - 1), fps);
  const speed = Math.hypot((cam.x - prev.x) * cam.z, (cam.y - prev.y) * cam.z) + Math.abs(Math.log(cam.z / prev.z)) * 700;
  const blur = Math.min(8, speed * 0.08);
  const jx = Math.sin(f / 6) * 4, jy = Math.cos(f / 8) * 4, jr = Math.sin(f / 13) * 0.3;
  // хук: бегунок «было / стало» качается, на слове «ярко» закрашивает всё
  const wipeEnd = interpolate(f, [T(7) - 3, T(7) + 14], [0, 1], {...clamp, easing: ease});
  const osc = 0.5 + 0.42 * Math.sin(f * 0.16 + 1.2);
  const p0 = f < T(7) - 3 ? osc : osc + (1 - osc) * wipeEnd;
  const p3 = interpolate(f, [T(34), T(38)], [1, 0], {...clamp, easing: Easing.inOut(Easing.quad)});
  const endIn = interpolate(f, [T(43) + 2, T(43) + 16], [0, 1], clamp);
  const tapAt = T(48), tap2At = T(50) + 4;
  const cur = f < tapAt ? 0 : f < tap2At ? 1 : 2;
  const curX = interpolate(f, [T(43) + 14, tapAt - 2, tapAt + 8, tap2At - 4], [820, 600, 600, 640], clamp);
  const curY = interpolate(f, [T(43) + 14, tapAt - 2, tapAt + 8, tap2At - 4], [1500, 800, 810, 1010], clamp);
  return (
    <AbsoluteFill style={{background: '#a8765c'}}>
      {['st_0.png', 'st_1.png', 'st_2.png', 'st_3.png', 'st_4.png', 'st_5.png', 'st_6.png', 'bg_terra.jpg', 'aug_src.jpg', 'aug_color.jpg', 'cut_chest.png', 'cut_chest_w.png', 'cut_cloak.png', 'cut_uv.png'].map((n) => <Img key={n} src={img(n)} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />)}
      <div style={{position: 'absolute', left: 0, top: 0, width: 3000, height: 4500, transformOrigin: '0 0',
        transform: `translate(${540 + jx}px, ${960 + jy}px) rotate(${cam.r + jr}deg) scale(${cam.z}) translate(${-cam.x}px, ${-cam.y}px)`, filter: blur > 0.4 ? `blur(${blur}px)` : undefined}}>
        <img src={img('bg_terra.jpg')} style={{position: 'absolute', left: -200, top: -250, width: 3400, height: 5100}} />
        {/* S0: хук, было / стало */}
        <Leaves f={f} />
        <AugCard cx={900} cy={1140} w={700} rot={-2} p={p0} divider={f < T(7) + 8} at={T(4)} f={f} fps={fps} seed={41} z={20} />
        {f < T(7) + 4 && <Tile text="БЕЛЫЕ?" cx={700} cy={600} rot={-6} bg={PAPER} size={150} at={T(4)} f={f} fps={fps} seed={51} z={50} anim="type" />}
        <Tile text="ЦВЕТНЫЕ!" cx={1090} cy={650} rot={5} bg={YEL} size={150} at={T(7)} f={f} fps={fps} seed={52} z={50} anim="pop" />
        {/* S1: красили мрамор */}
        <Tile text="ГРЕКИ" cx={1950} cy={1130} rot={-4} bg={PAPER} size={170} at={T(9)} f={f} fps={fps} seed={53} anim="slideL" />
        <Tile text="РИМЛЯНЕ" cx={2250} cy={1360} rot={3} bg={BLK} color={PAPER} size={150} at={T(11)} f={f} fps={fps} seed={63} anim="slideR" />
        <VidCard name="work" cx={2300} cy={1960} w={420} rot={3} at={T(12)} back="#C8191E" f={f} fps={fps} seed={65} />
        <Tile text="ИЛЛЮСТРАЦИЯ" cx={2330} cy={2400} rot={-3} bg={BLK} color={PAPER} font={ARCH} size={32} at={T(12)} f={f} fps={fps} seed={66} z={50} anim="wipe" />
        <Tile text="КРАСИЛИ МРАМОР" cx={1950} cy={1570} rot={-2} bg={YEL} color={BLK} font={ARCH} size={50} at={T(12)} f={f} fps={fps} seed={64} z={50} anim="type" />
        <Cut file="cut_chest_w.png" ratio={790 / 754} cx={1790} cy={1900} w={340} rot={-4} at={T(13)} f={f} fps={fps} z={12} />
        <Cut file="cut_chest.png" ratio={790 / 754} cx={1790} cy={1900} w={340} rot={-4} at={T(16)} f={f} fps={fps} z={13} />
        <Tile text="КРАСНЫЙ" cx={1880} cy={2230} rot={-5} bg="#C8191E" color="#fff" size={110} at={T(15)} f={f} fps={fps} seed={54} z={50} anim="type" />
        <Tile text="СИНИЙ" cx={1980} cy={2400} rot={4} bg="#2B5CC8" color="#fff" size={110} at={T(16)} f={f} fps={fps} seed={55} z={50} anim="wipe" />
        <Tile text="ЗОЛОТОЙ" cx={2100} cy={2580} rot={-2} bg="#D4A64A" color={BLK} size={130} at={T(18)} f={f} fps={fps} seed={56} z={50} anim="drop" />
        {/* S2: ультрафиолет, реконструкции */}
        <VidCard name="uvv" cx={800} cy={2650} w={520} rot={-3} at={T(19)} back="#5B2BA0" f={f} fps={fps} seed={67} />
        <Tile text="УЛЬТРАФИОЛЕТ" cx={1000} cy={2180} rot={4} bg="#5B2BA0" color="#fff" size={100} at={T(23)} f={f} fps={fps} seed={57} anim="type" />
        <Tile text="ИЛЛЮСТРАЦИЯ" cx={720} cy={3190} rot={-3} bg={BLK} color={PAPER} font={ARCH} size={36} at={T(20)} f={f} fps={fps} seed={58} anim="wipe" />
        <Tile text="РЕКОНСТРУКЦИЯ" cx={1000} cy={3300} rot={-3} bg={YEL} color={BLK} size={90} at={T(28)} f={f} fps={fps} seed={59} z={50} anim="wipe" />
        {/* S3: краска осыпалась, эпохи */}
        <AugCard cx={2100} cy={3560} w={560} rot={2} p={p3} mode="peel" at={T(29)} f={f} fps={fps} seed={43} />
        <Flakes at={T(34)} dur={55} cx={2100} cy={3560} w={560} h={840} f={f} />
        <VidCard name="hall" cx={2100} cy={3600} w={500} rot={-2} at={T(39)} back="#F2C230" f={f} fps={fps} seed={68} z={16} />
        <Tile text="ВРЕМЯ" cx={1900} cy={3100} rot={-4} bg={BLK} color={YEL} size={170} at={T(33)} f={f} fps={fps} seed={60} z={50} anim="drop" />
        <Tile text="ПОЗДНЕЙШИЕ ЭПОХИ" cx={2200} cy={4180} rot={3} bg={PAPER} font={ARCH} size={64} at={T(37)} f={f} fps={fps} seed={61} z={50} anim="type" />
        <Tile text="ИДЕАЛ?" cx={2150} cy={4400} rot={-4} bg={YEL} size={170} at={T(42)} f={f} fps={fps} seed={62} z={50} anim="flip" />
      </div>
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, opacity: 0.2, mixBlendMode: 'multiply', zIndex: 62, pointerEvents: 'none'}}>
        <filter id="gn14"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={f % 5} /></filter><rect width="1080" height="1920" filter="url(#gn14)" />
      </svg>
      <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(60,24,12,0.5) 100%)', zIndex: 60}} />
      <div style={{position: 'absolute', left: 60, top: 1610, fontFamily: ARCH, fontSize: 28, letterSpacing: 5, color: 'rgba(40,14,6,0.75)', zIndex: 80}}>{script.diagram.title}</div>
      {/* финал: белая или пёстрая */}
      <div style={{position: 'absolute', inset: 0, background: 'rgba(52,22,14,0.93)', opacity: endIn, zIndex: 70}} />
      {f >= T(43) + 2 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 75, opacity: endIn}}>
          <Tile text="ЧТО ВЫБЕРЕТЕ?" cx={540} cy={560} rot={-3} bg={YEL} size={130} at={T(43) + 4} f={f} fps={fps} seed={71} z={76} anim="type" />
          {[['БЕЛАЯ СТАТУЯ', 800, 0], ['ПЁСТРАЯ СТАТУЯ', 1010, 1]].map(([txt, top, i]) => {
            const pr = spring({frame: f - (T(44) + i * 6), fps, config: {damping: 14, stiffness: 300}});
            const glow = i === 1 && f >= tap2At;
            const act = cur === i + 1 || glow;
            return (
              <div key={i} style={{position: 'absolute', left: 90, top, width: 900, height: 150, transform: `rotate(${i ? 1.5 : -1.5}deg) scale(${Math.min(pr, 1.04) * (glow ? 1.06 : 1) * (act && !glow ? 0.96 : 1)})`, opacity: Math.min(1, pr * 2), filter: 'drop-shadow(8px 14px 10px rgba(0,0,0,0.5))'}}>
                <div style={{width: '100%', height: '100%', clipPath: tornPoly(80 + i), background: glow ? YEL : PAPER, color: BLK, fontFamily: ARCH, fontSize: 60, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{txt}</div>
              </div>
            );
          })}
          <svg width="130" height="150" viewBox="-10 -10 120 140" style={{position: 'absolute', left: curX, top: curY, zIndex: 80, filter: 'drop-shadow(8px 12px 10px rgba(0,0,0,0.5))', transform: `scale(${f >= tapAt && f < tapAt + 6 || f >= tap2At && f < tap2At + 6 ? 0.85 : 1})`}}>
            <path d="M5 5 L5 95 L30 72 L48 112 L66 104 L48 66 L82 66 Z" fill="#fff" stroke="#14143a" strokeWidth="6" strokeLinejoin="round" />
          </svg>
          {f >= tap2At + 4 && <div style={{position: 'absolute', left: 0, width: 1080, top: 1230, textAlign: 'center', fontFamily: HAND, fontWeight: 700, fontSize: 90, color: '#F3D88A', opacity: interpolate(f, [tap2At + 4, tap2At + 16], [0, 1], clamp)}}>решайте сами</div>}
        </div>
      )}
      <Captions13 />
    </AbsoluteFill>
  );
};
