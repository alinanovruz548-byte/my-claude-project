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
