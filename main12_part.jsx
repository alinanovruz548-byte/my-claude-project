const VDUR = {hook2: 151, noose: 121, wit: 151, cell: 121, candle: 121};
const Vid = ({name, at, f}) => (
  <Sequence from={at}>
    <Freeze frame={Math.min(Math.max(f - at, 0), VDUR[name] - 3)}>
      <OffthreadVideo src={staticFile('n12/vid/' + name + '.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </Freeze>
  </Sequence>
);

const Cut = ({file, ratio, cx, cy, w, rot = 0, at = 0, f, fps, z = 10, shadow = true, children, dy = 0, origin}) => {
  const p = pop(f, at, fps);
  if (f < at) return null;
  const e = 1 - Math.min(p, 1);
  const h = w * ratio;
  return (
    <div style={{position: 'absolute', left: cx - w / 2, top: cy - h / 2 + dy, width: w, height: h, zIndex: z, transform: `translateY(${-e * 400}px) rotate(${rot + e * 12}deg) scale(${Math.min(p, 1.04)})`, opacity: Math.min(1, p * 3),
      transformOrigin: origin, filter: shadow ? 'drop-shadow(12px 20px 14px rgba(40,24,6,0.5))' : undefined}}>
      <img src={img(file)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} />
      {children}
    </div>
  );
};

const TORN = 'polygon(0 6%, 2% 0, 25% 3%, 50% 0, 75% 4%, 98% 0, 100% 8%, 99% 50%, 100% 94%, 97% 100%, 70% 96%, 40% 100%, 12% 97%, 1% 100%, 0 60%)';
// картина, закрытая тремя жёлтыми плашками: каждая отклеивается по своей улике
const Covered = ({w, h, peel, f, fps, s = 1}) => (
  <div style={{position: 'relative', width: w, height: h, border: `${14 * s}px solid #5b3d1a`, boxShadow: `0 ${24 * s}px ${40 * s}px rgba(40,24,6,0.55), inset 0 0 0 ${3 * s}px #D4A64A`, background: '#222'}}>
    <div style={{position: 'absolute', inset: 0, backgroundImage: `url(${img('emmaus.jpg')})`, backgroundSize: 'cover', backgroundPosition: '50% 40%'}} />
    {[0, 1, 2].map((k) => {
      const t = f - peel[k];
      if (t > 18) return null;
      const p = t < 0 ? 0 : Math.min(1, t / 16);
      const q = p * p;
      return (
        <div key={k} style={{position: 'absolute', left: -w * 0.04, top: (h / 3) * k + (h / 3) * 0.14, width: w * 1.08, height: (h / 3) * 0.72, zIndex: 3 - k, clipPath: TORN, background: 'linear-gradient(180deg, #F1C24A, #DDA528)',
        transform: `translateX(${q * w * 1.3}px) rotate(${q * 14}deg)`, opacity: 1 - q * 0.6, boxShadow: '0 6px 10px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${28 * s}px`,
          fontFamily: MONO, fontWeight: 700, fontSize: 40 * s, letterSpacing: 4 * s, color: '#1E1E1E'}}>
          <span>УЛИКА №{k + 1}</span><span style={{fontFamily: HEAD, fontWeight: 900, fontSize: 90 * s}}>?</span>
        </div>
      );
    })}
  </div>
);

const Card = ({cx, cy, w, h, rot = 0, at, f, fps, children, z = 14, bg = 'linear-gradient(160deg, #FBF3DE, #EADDB2)'}) => {
  const p = pop(f, at, fps);
  if (f < at) return null;
  const e = 1 - Math.min(p, 1);
  return (
    <>
      <div style={{position: 'absolute', left: cx - w / 2, top: cy - h / 2, width: w, height: h, zIndex: z, background: bg, boxShadow: '0 26px 40px rgba(40,24,6,0.5)', transform: `translateY(${-e * 500}px) rotate(${rot + e * 10}deg) scale(${1 + e * 0.2})`, opacity: Math.min(1, p * 3),
        clipPath: TORN}}>{children}</div>
    </>
  );
};

const Captions12 = ({light}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const now = f / fps;
  let chunk = null;
  for (const c of script.captions) if (now >= t0(c[0][1]) - 0.06) chunk = c;
  if (!chunk) return null;
  const a = Math.min(1, Math.max(0, (now - (t0(chunk[0][1]) - 0.06)) / 0.2));
  const on = light ? '#fff' : '#1E1E1E', off = light ? 'rgba(255,255,255,0.32)' : 'rgba(30,30,30,0.4)';
  return (
    <div style={{position: 'absolute', left: 40, top: 165, width: 1000, display: 'flex', justifyContent: 'center', opacity: a, transform: `translateY(${(1 - a) * 12}px)`, zIndex: 90}}>
      <div style={{padding: light ? '0' : '12px 30px', borderRadius: 30, background: light ? 'none' : 'rgba(247,240,225,0.9)', boxShadow: light ? 'none' : '0 10px 24px rgba(40,24,6,0.35)', textAlign: 'center', fontFamily: HEAD, fontWeight: 700, fontSize: 46, lineHeight: 1.22,
        textWrap: 'balance', textShadow: light ? '0 4px 24px rgba(0,0,0,0.9)' : 'none'}}>
        {chunk.map(([txt, s0], k) => <span key={k} style={{color: now >= words[s0].start ? on : off}}>{txt}{' '}</span>)}
      </div>
    </div>
  );
};

export const Board12Main = () => {
  useFonts();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const T = (w) => sec(t0(w), fps);
  const cam = camAt(f, fps), prev = camAt(Math.max(0, f - 1), fps);
  const speed = Math.hypot((cam.x - prev.x) * cam.z, (cam.y - prev.y) * cam.z) + Math.abs(Math.log(cam.z / prev.z)) * 700;
  const blur = Math.min(6, speed * 0.07);
  const jx = Math.sin(f / 9) * 5, jy = Math.cos(f / 11) * 5, jr = Math.sin(f / 17) * 0.25;
    const endIn = interpolate(f, [T(63) - 6, T(63) + 14], [0, 1], clamp);
  const barP = interpolate(f, [T(20), T(20) + 10], [0, 1], {...clamp, easing: ease});
  const pins = {A: [1500, 583], D: [1500, 1903], B: [600, 1620], C: [2300, 1578], E1: [1050, 3199], E2: [1750, 3116], F1: [1000, 4266], F2: [1850, 4200]};
  const vote = Math.floor((f - T(65)) / 14) % 2;
  const sw = Math.sin(f / 7) * 7 * endIn;
  return (
    <AbsoluteFill style={{background: '#CDB28A'}}>
      {['suspect.png', 'prison.jpg', 'supper.jpg', 'd1947.jpg', 'bg_kraft.jpg', 'easel_c.png', 'cuffs_c.png', 'scales_c.png', 'lens_c.png'].map((n) => <Img key={n} src={img(n)} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />)}
      <div style={{position: 'absolute', left: 0, top: 0, width: 3000, height: 4500, transformOrigin: '0 0',
        transform: `translate(${540 + jx}px, ${960 + jy}px) rotate(${cam.r + jr}deg) scale(${cam.z}) translate(${-cam.x}px, ${-cam.y}px)`, filter: blur > 0.4 ? `blur(${blur}px)` : undefined}}>
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <img key={k} src={img('bg_kraft.jpg')} style={{position: 'absolute', left: -200 + (k % 2) * 1700, top: -250 + Math.floor(k / 2) * 2550, width: 1700, height: 2550, transform: `rotate(${[0, 1, 2, 4].includes(k) ? 180 : 0}deg)`}} />
        ))}
        <svg width="3000" height="4500" style={{position: 'absolute', left: 0, top: 0, zIndex: 30, overflow: 'visible', pointerEvents: 'none'}}>
          <Thread a={[1500, 1650]} b={pins.D} at={T(8)} f={f} fps={fps} sag={110} />
          <Thread a={[1280, 1650]} b={pins.B} at={T(19)} f={f} fps={fps} sag={150} />
          <Thread a={pins.B} b={pins.C} at={T(26)} f={f} fps={fps} sag={150} />
          <Thread a={pins.C} b={pins.E1} at={T(40)} f={f} fps={fps} sag={150} />
          <Thread a={pins.E1} b={pins.E2} at={T(49)} f={f} fps={fps} sag={110} />
          <Thread a={pins.E2} b={pins.F1} at={T(52)} f={f} fps={fps} sag={150} />
          <Thread a={pins.F1} b={pins.F2} at={T(57)} f={f} fps={fps} sag={110} />
        </svg>
        <Cut file="lens_c.png" ratio={1291 / 1286} cx={2650} cy={650} w={360} rot={-20} f={f} fps={fps} z={5} />
        <Cut file="easel_c.png" ratio={1482 / 685} cx={400} cy={3000} w={300} rot={-8} f={f} fps={fps} z={5} />
        {/* A: хук, настоящий «Эммаус» ван Мегерена, оживший */}
        <Polaroid cx={1500} cy={1100} w={700} h={933} cap="ИЛЛЮСТРАЦИЯ ПО КАРТИНЕ ВАН МЕГЕРЕНА" rot={-2} at={0} f={f} fps={fps}>
          <Vid name="hook2" at={0} f={f} />
        </Polaroid>
        <Tape text="«ВЕРМЕЕР»?" x={1090} y={1500} rot={-4} f={f} at={T(3)} fps={fps} size={44} />
        <Ink text="ПОДДЕЛКА" x={1130} y={1240} rot={-8} size={78} f={f} at={T(18)} fps={fps} />
        {/* петля: угроза казни */}
        <Polaroid cx={1500} cy={2300} w={520} h={693} cap="ИЛЛЮСТРАЦИЯ · КАЗНЬ" rot={3} at={T(8)} f={f} fps={fps}>
          <Vid name="noose" at={T(8)} f={f} />
        </Polaroid>
        <Ink text="КАЗНЬ?" x={1290} y={2480} rot={-6} size={76} f={f} at={T(9)} fps={fps} />
        <Cut file="cuffs_c.png" ratio={688 / 1403} cx={1180} cy={2680} w={360} rot={-10} at={T(9)} f={f} fps={fps} z={16} />
        {/* B: подозреваемый */}
        <Cut file="suspect.png" ratio={1000 / 940} cx={600} cy={1950} w={540} rot={-3} at={T(19)} f={f} fps={fps} z={14}>
          <div style={{position: 'absolute', left: '17%', top: '31%', width: `${30 * barP}%`, height: '6.5%', background: '#111', boxShadow: '0 4px 8px rgba(0,0,0,0.5)'}} />
        </Cut>
        <Pin x={pins.B[0]} y={pins.B[1]} s={0.95} p={f >= T(19) ? 1 : 0} />
        <Tape text="ХАН ВАН МЕГЕРЕН" x={290} y={2215} rot={-3} f={f} at={T(20)} fps={fps} size={40} />
        <Card cx={1000} cy={1780} w={250} h={330} rot={5} at={T(23)} f={f} fps={fps}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 24, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: '#2a2418'}}>ПОСЛЕ ВОЙНЫ</div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 100, textAlign: 'center', fontFamily: HEAD, fontWeight: 900, fontSize: 80, color: '#1C2A82'}}>1945</div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 240, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: '#2a2418'}}>НИДЕРЛАНДЫ</div>
        </Card>
        <Ink text="ИЗМЕНА?" x={150} y={2340} rot={-6} size={84} f={f} at={T(25)} fps={fps} />
        {/* C: Геринг и картина */}
        <Polaroid cx={2300} cy={1900} w={780} h={523} file="supper.jpg" pos="50% 50%" cap="ДРУГАЯ ПОДДЕЛКА ВАН МЕГЕРЕНА" rot={3} at={T(27)} f={f} fps={fps} />
        <Tape text="ГЕРИНГ" x={1880} y={1560} rot={-4} f={f} at={T(26)} fps={fps} size={52} />
        <Tape text="«ХРИСТОС И ГРЕШНИЦА»" x={1960} y={2300} rot={-3} f={f} at={T(31)} fps={fps} size={34} />
        <Sticky x={2230} y={1350} text="национальное достояние" rot={-5} at={T(29)} f={f} fps={fps} size={44} />
        <Sticky x={2650} y={2450} text="НО!" rot={6} at={T(35)} f={f} fps={fps} size={130} />
        {/* E: пишет при свидетелях */}
        <Polaroid cx={1050} cy={3450} w={560} h={400} file="prison.jpg" pos="70% 40%" cap="1945 · ПИШЕТ «ВЕРМЕЕРА»" rot={-3} at={T(40)} f={f} fps={fps} />
        <Polaroid cx={1750} cy={3500} w={500} h={667} cap="ИЛЛЮСТРАЦИЯ · СВИДЕТЕЛИ" rot={3} at={T(49)} f={f} fps={fps}>
          <Vid name="wit" at={T(49)} f={f} />
        </Polaroid>
        <Tape text="ПРИ СВИДЕТЕЛЯХ" x={1480} y={3890} rot={3} f={f} at={T(51)} fps={fps} size={36} />
        {/* F: приговор и смерть */}
        <Polaroid cx={1000} cy={4650} w={500} h={667} cap="ИЛЛЮСТРАЦИЯ · ТЮРЬМА" rot={-3} at={T(52)} f={f} fps={fps}>
          <Vid name="cell" at={T(52)} f={f} />
        </Polaroid>
        <Ink text="1 ГОД" x={820} y={4780} rot={-7} size={110} f={f} at={T(53)} fps={fps} />
        <Polaroid cx={1850} cy={4600} w={500} h={667} cap="ИЛЛЮСТРАЦИЯ · 1947" rot={3} at={T(57)} f={f} fps={fps}>
          <Vid name="candle" at={T(57)} f={f} />
        </Polaroid>
        <Polaroid cx={1850} cy={5360} w={460} h={377} file="d1947.jpg" pos="50% 30%" cap="ВАН МЕГЕРЕН 1889—1947" rot={-3} at={T(59)} f={f} fps={fps} tint="grayscale(1)" />
      </div>
      {/* свет, пыль, зерно */}
      <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 42%, rgba(255,240,200,0.18), rgba(0,0,0,0) 55%), radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 50%, rgba(70,42,12,0.45) 100%)', zIndex: 60}} />
      {Array.from({length: 22}).map((_, i) => {
        const x = ((i * 193 + f * (0.5 + (i % 4) * 0.25)) % 1160) - 40, y = ((i * 311 - f * (0.6 + (i % 3) * 0.3)) % 2000 + 2000) % 2000;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 4 + (i % 3) * 2, height: 4 + (i % 3) * 2, borderRadius: '50%', background: '#FFF3C4', opacity: 0.2 + 0.2 * Math.sin(f / 8 + i), zIndex: 61}} />;
      })}
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, opacity: 0.14, mixBlendMode: 'multiply', zIndex: 62, pointerEvents: 'none'}}>
        <filter id="gn12"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 6} /></filter><rect width="1080" height="1920" filter="url(#gn12)" />
      </svg>
      <div style={{position: 'absolute', left: 60, top: 1610, fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: 5, color: 'rgba(30,30,30,0.75)', zIndex: 80}}>{script.diagram.title}</div>
      {/* финал: суд присяжных, голос в комментариях */}
      <div style={{position: 'absolute', inset: 0, background: 'rgba(32,22,10,0.9)', opacity: endIn, zIndex: 70}} />
      {f >= T(63) - 6 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 75, opacity: endIn}}>
          <div style={{position: 'absolute', left: 0, width: 1080, top: 400, textAlign: 'center', fontFamily: HEAD, fontWeight: 900, fontSize: 70, color: '#F3D88A', letterSpacing: 3}}>СУД ПРИСЯЖНЫХ</div>
          <img src={img('scales_c.png')} style={{position: 'absolute', left: 340, top: 520, width: 400, height: 400 * 1334 / 1403, transform: `rotate(${sw}deg)`, transformOrigin: '50% 90%', filter: 'drop-shadow(10px 18px 14px rgba(0,0,0,0.6))'}} />
          {[['ВИНОВЕН', 60], ['НЕ ВИНОВЕН', 560]].map(([txt, left], i) => {
            const pr = spring({frame: f - (T(65) + i * 6), fps, config: {damping: 11, stiffness: 140}});
            const act = f >= T(65) && vote === i;
            return (
              <div key={i} style={{position: 'absolute', left, top: 1000, width: 460, height: 150, borderRadius: 75, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontWeight: 900, fontSize: i ? 40 : 48,
                color: act ? '#2a1a05' : '#fff', background: act ? 'linear-gradient(90deg, #FFF0B8, #D4A64A)' : 'rgba(255,255,255,0.14)', border: `4px solid ${act ? '#fff' : 'rgba(255,255,255,0.5)'}`,
                transform: `scale(${Math.min(pr, 1.04) * (act ? 1.06 : 1)})`, boxShadow: act ? '0 0 60px rgba(212,166,74,0.9)' : '0 16px 30px rgba(0,0,0,0.35)', opacity: Math.min(1, pr * 2)}}>{txt}</div>
            );
          })}
          <div style={{position: 'absolute', left: 0, width: 1080, top: 1210, textAlign: 'center', fontFamily: HAND, fontWeight: 700, fontSize: 84, color: '#F3D88A', opacity: interpolate(f, [T(65), T(65) + 14], [0, 1], clamp)}}>голосуйте в комментариях</div>
        </div>
      )}
      <Captions12 light={f >= T(63) - 6} />
    </AbsoluteFill>
  );
};
