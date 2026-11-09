const MONO_ON = !!script.mono;
const cY = MONO_ON ? '#ECECEC' : YEL;
const cB = MONO_ON ? '#3B3B3B' : '#2B3FA0';
const BLUE = cB;
const VDUR15 = {fish: 151, paint: 151, push: 151};
const Vid15 = ({name, at, f}) => (
  <Sequence from={at}>
    <Freeze frame={Math.min(Math.max(f - at, 0), VDUR15[name] - 3)}>
      <OffthreadVideo src={staticFile('n15/vid/' + name + '.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </Freeze>
  </Sequence>
);
const VidCard15 = ({name, cx, cy, w, rot = 0, at, back = cB, f, fps, z = 14, seed = 90}) => {
  const e = spring({frame: f - at, fps, config: {damping: 14, stiffness: 300}});
  if (f < at) return null;
  const h = w * 4 / 3;
  return (
    <div style={{position: 'absolute', left: cx, top: cy, zIndex: z, transform: `translate(-50%,-50%) rotate(${rot + (1 - Math.min(e, 1)) * 12}deg) scale(${Math.min(e, 1.03) * (1 + (1 - Math.min(e, 1)) * 0.3)})`, opacity: Math.min(1, e * 3),
      filter: `drop-shadow(14px 22px 16px rgba(60,40,5,0.6))${MONO_ON ? ' grayscale(1) contrast(1.12)' : ''}`}}>
      <div style={{position: 'absolute', left: 18, top: 14, right: -18, bottom: -14, clipPath: tornPoly(seed + 3), background: back, transform: 'rotate(2.5deg)'}} />
      <div style={{position: 'relative', clipPath: tornPoly(seed), background: PAPER, padding: 24}}>
        <div style={{position: 'relative', width: w, height: h, overflow: 'hidden', background: '#111'}}><Vid15 name={name} at={at} f={f} /></div>
      </div>
    </div>
  );
};

export const Board15Main = () => {
  useFonts();
  useFonts13();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const T = (w) => sec(t0(w), fps) - 3;
  const cam = camAt(f, fps), prev = camAt(Math.max(0, f - 1), fps);
  const speed = Math.hypot((cam.x - prev.x) * cam.z, (cam.y - prev.y) * cam.z) + Math.abs(Math.log(cam.z / prev.z)) * 700;
  const blur = Math.min(8, speed * 0.08);
  const jx = Math.sin(f / 6) * 4, jy = Math.cos(f / 8) * 4, jr = Math.sin(f / 13) * 0.3;
  const endIn = interpolate(f, [T(54) + 2, T(54) + 16], [0, 1], clamp);
  const tapAt = T(57) + 8, tap2At = T(61) - 2;
  const cur = f < tapAt ? 0 : f < tap2At ? 1 : 2;
  const curX = interpolate(f, [T(54) + 14, tapAt - 2, tapAt + 8, tap2At - 4], [820, 600, 600, 640], clamp);
  const curY = interpolate(f, [T(54) + 14, tapAt - 2, tapAt + 8, tap2At - 4], [1500, 800, 810, 1010], clamp);
  return (
    <AbsoluteFill style={{background: MONO_ON ? '#8c8c8c' : '#b08a2a'}}>
      {['bg_mustard.jpg', 'cut_mirror.png', 'cut_insc.png', 'cut_dog.png', 'cut_chand.png', 'cut_man.png', 'cut_woman.png', 'cut_full.png'].map((n) => <Img key={n} src={img(n)} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />)}
      <div style={{position: 'absolute', left: 0, top: 0, width: 3000, height: 4500, transformOrigin: '0 0',
        transform: `translate(${540 + jx}px, ${960 + jy}px) rotate(${cam.r + jr}deg) scale(${cam.z}) translate(${-cam.x}px, ${-cam.y}px)`, filter: blur > 0.4 ? `blur(${blur}px)` : undefined}}>
        <img src={img('bg_mustard.jpg')} style={{position: 'absolute', left: -200, top: -250, width: 3400, height: 5100, filter: MONO_ON ? 'grayscale(1) brightness(0.92) contrast(1.05)' : undefined}} />
        {/* S0: хук — детали картины шлёпаются одна на другую */}
        <Cut file="cut_chand.png" ratio={753 / 902} cx={720} cy={720} w={600} rot={-5} at={-10} f={f} fps={fps} z={10} gray={MONO_ON} />
        <Cut file="cut_dog.png" ratio={834 / 902} cx={1180} cy={1560} w={500} rot={6} at={-5} f={f} fps={fps} z={11} gray={MONO_ON} />
        <Cut file="cut_man.png" ratio={765 / 902} cx={620} cy={1560} w={480} rot={-4} at={0} f={f} fps={fps} z={12} />
        <Cut file="cut_woman.png" ratio={969 / 902} cx={1180} cy={820} w={460} rot={5} at={6} f={f} fps={fps} z={13} />
        <Cut file="cut_insc.png" ratio={399 / 902} cx={900} cy={1250} w={780} rot={-2} at={12} f={f} fps={fps} z={14} gray={MONO_ON} />
        <Cut file="cut_mirror.png" ratio={898 / 902} cx={900} cy={1110} w={700} rot={3} at={18} f={f} fps={fps} z={15} gray={MONO_ON} />
        <Tile text="1434" cx={680} cy={600} rot={-6} bg={BLK} color={cY} size={200} at={9} f={f} fps={fps} seed={11} z={50} anim="drop" />
        <Tile text="СЕЛФИ" cx={900} cy={1600} rot={3} bg={PAPER} color={BLK} size={220} at={T(8)} f={f} fps={fps} seed={12} z={50} anim="type" />
        {/* S1: картина */}
        <Cut file="cut_full.png" ratio={1517 / 1142} cx={2100} cy={1900} w={620} rot={-2} at={T(9)} f={f} fps={fps} z={12} />
        <Tile text="ПОРТРЕТ ЧЕТЫ" cx={2100} cy={1230} rot={-3} bg={BLK} color={cY} size={110} at={T(11)} f={f} fps={fps} seed={13} anim="slideL" />
        <Tile text="АРНОЛЬФИНИ" cx={2200} cy={2650} rot={3} bg={cB} color="#fff" size={120} at={T(13)} f={f} fps={fps} seed={14} anim="type" z={50} />
        {/* S2: подпись «был здесь» */}
        <Cut file="cut_insc.png" ratio={399 / 902} cx={900} cy={2350} w={880} rot={-2} at={T(14)} f={f} fps={fps} z={12} gray={MONO_ON} />
        <Tile text="JOHANNES DE EYCK FUIT HIC 1434" cx={900} cy={2680} rot={-1} bg={PAPER} color={BLK} font={MONO} size={44} at={T(16)} f={f} fps={fps} seed={15} anim="type" ls={1} z={50} />
        <Tile text="ЯН ВАН ЭЙК БЫЛ ЗДЕСЬ" cx={900} cy={2900} rot={2} bg={BLK} color={cY} size={88} at={T(17)} f={f} fps={fps} seed={16} anim="slideR" z={50} />
        <VidCard15 name="paint" cx={1230} cy={3200} w={330} rot={-3} at={T(18)} back={BLK} f={f} fps={fps} seed={61} />
        <Tile text="ИЛЛЮСТРАЦИЯ" cx={1480} cy={3000} rot={-2} bg={BLK} color={PAPER} font={ARCH} size={30} at={T(18)} f={f} fps={fps} seed={62} z={50} anim="wipe" />
        {/* S3: зеркало */}
        <VidCard15 name="push" cx={1750} cy={3680} w={410} rot={-3} at={T(22)} back={cB} f={f} fps={fps} seed={63} />
        <VidCard15 name="fish" cx={2450} cy={4040} w={320} rot={3} at={T(26)} back={BLK} f={f} fps={fps} seed={64} />
        <Tile text="ВСЯ КОМНАТА" cx={1850} cy={3250} rot={-3} bg={PAPER} color={BLK} size={110} at={T(27)} f={f} fps={fps} seed={17} anim="wipe" z={50} />
        <Tile text="ДВОЕ В ДВЕРЯХ" cx={2250} cy={4200} rot={2} bg={cB} color="#fff" size={96} at={T(30)} f={f} fps={fps} seed={18} anim="type" z={50} />
        <Tile text="ОДИН ИЗ НИХ — САМ ХУДОЖНИК?" cx={2150} cy={4400} rot={2} bg={BLK} color={cY} size={60} at={T(34)} f={f} fps={fps} seed={19} anim="type" z={50} pad="0.12em 0.8em" />
        <Tile text="ИЛЛЮСТРАЦИЯ" cx={2450} cy={4290} rot={-3} bg={BLK} color={PAPER} font={ARCH} size={30} at={T(26)} f={f} fps={fps} seed={65} z={40} anim="wipe" />
        {/* S4: спор */}
        <Tile text="СПОРЯТ" cx={700} cy={3600} rot={-4} bg={BLK} color={cY} size={150} at={T(44)} f={f} fps={fps} seed={20} anim="slideL" z={50} />
        <Tile text="СВАДЬБА?" cx={1100} cy={3830} rot={3} bg={PAPER} color={BLK} size={130} at={T(46)} f={f} fps={fps} seed={21} anim="drop" z={50} />
        <Tile text="ПОМОЛВКА?" cx={720} cy={4030} rot={-3} bg={cB} color="#fff" size={120} at={T(47)} f={f} fps={fps} seed={22} anim="flip" z={50} />
        <Tile text="ПРОСТО ПОРТРЕТ?" cx={1000} cy={4220} rot={2} bg={BLK} color={PAPER} size={100} at={T(48)} f={f} fps={fps} seed={23} anim="wipe" z={50} />
        <Tile text="БРАЧНЫЙ КОНТРАКТ" cx={850} cy={4400} rot={-2} bg={cY} color={BLK} size={100} at={T(51)} f={f} fps={fps} seed={24} anim="type" z={50} />
        <RedInk text="ОСПАРИВАЕТСЯ" cx={900} cy={4580} rot={-6} size={110} at={T(53)} f={f} fps={fps} />
      </div>
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, opacity: 0.2, mixBlendMode: 'multiply', zIndex: 62, pointerEvents: 'none'}}>
        <filter id="gn15"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={f % 5} /></filter><rect width="1080" height="1920" filter="url(#gn15)" />
      </svg>
      <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(70,45,5,0.5) 100%)', zIndex: 60}} />
      <div style={{position: 'absolute', left: 60, top: 1610, fontFamily: ARCH, fontSize: 28, letterSpacing: 5, color: 'rgba(40,25,0,0.75)', zIndex: 80}}>{script.diagram.title}</div>
      {/* финал: свадьба или просто портрет */}
      <div style={{position: 'absolute', inset: 0, background: 'rgba(30,22,6,0.93)', opacity: endIn, zIndex: 70}} />
      {f >= T(54) + 2 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 75, opacity: endIn}}>
          <Tile text="ЧТО ЭТО?" cx={540} cy={560} rot={-3} bg={cY} size={190} at={T(54) + 4} f={f} fps={fps} seed={71} z={76} anim="type" />
          {[['СВАДЬБА', 800, 0], ['ПРОСТО ПОРТРЕТ', 1010, 1]].map(([txt, top, i]) => {
            const pr = spring({frame: f - (T(55) + i * 5), fps, config: {damping: 14, stiffness: 300}});
            const glow = i === 1 && f >= tap2At;
            const act = cur === i + 1 || glow;
            return (
              <div key={i} style={{position: 'absolute', left: 90, top, width: 900, height: 150, transform: `rotate(${i ? 1.5 : -1.5}deg) scale(${Math.min(pr, 1.04) * (glow ? 1.06 : 1) * (act && !glow ? 0.96 : 1)})`, opacity: Math.min(1, pr * 2), filter: 'drop-shadow(8px 14px 10px rgba(0,0,0,0.5))'}}>
                <div style={{width: '100%', height: '100%', clipPath: tornPoly(80 + i), background: glow ? cY : PAPER, color: BLK, fontFamily: ARCH, fontSize: 60, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{txt}</div>
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
