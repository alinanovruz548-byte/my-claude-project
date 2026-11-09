const CAM_STARTS = [2.1, 3.9, 5.3, 8.8, 13.0, 15.3, 19.4];
const camAt = (t) => {
  let z = 1 + Math.sin(t / 1.7) * 0.012, rot = 0, px = 0, py = 0, blur = 0;
  CAM_STARTS.forEach((s, i) => {
    const dt = t - s;
    if (dt >= 0 && dt < 0.8) {
      const q = 1 - easeOut(dt / 0.8);
      const sg = i % 2 ? 1 : -1;
      z += (i % 3 === 0 ? 0.45 : i % 3 === 1 ? 0.7 : 0.3) * q;
      rot += sg * 6 * q; px += sg * 170 * q; py += (i % 2 ? -130 : 150) * q; blur = Math.max(blur, q * 7);
    }
  });
  return {z, rot, px, py, blur};
};
const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const BG = 'linear-gradient(172deg, #FCF5F2 0%, #F3EAF6 55%, #E8EEF9 100%)';
const AMB = '#E59A2C';
const easeIn3 = (x) => x * x * x;
const DigitStamp = ({txt, ats, t, top, size = 260, width = 175, color = INK, x = 0, w = 1080}) => (
  <div style={{position: 'absolute', left: x, width: w, top, textAlign: 'center', zIndex: 30, whiteSpace: 'nowrap'}}>
    {txt.split('').map((d, i) => {
      const at = ats[i];
      const q = Math.min(1, Math.max(0, (t - at) / 0.2));
      const e = easeOut(q);
      const ring = Math.min(1, Math.max(0, (t - at) / 0.45));
      return (
        <span key={i} style={{display: 'inline-block', position: 'relative', width, textAlign: 'center'}}>
          <span style={{display: 'inline-block', fontFamily: SERIF, fontWeight: 700, fontSize: size, lineHeight: 1, color, opacity: q > 0 ? 1 : 0, transform: `scale(${3.2 - 2.2 * e}) rotate(${(i % 2 ? 1 : -1) * (1 - e) * 14}deg)`, textShadow: '0 10px 0 rgba(229,154,44,0.3)'}}>{d}</span>
          {t >= at && <span style={{position: 'absolute', left: width / 2 - 65, top: size * 0.52 - 65, width: 130, height: 130, borderRadius: '50%', border: '8px solid rgba(229,154,44,0.6)', opacity: 1 - ring, transform: `scale(${0.5 + ring * 2.6})`}} />}
        </span>
      );
    })}
  </div>
);
const SolidStamp = ({txt, at, t, x, y, rot = -8, size = 80}) => {
  if (t < at) return null;
  const q = Math.min(1, (t - at) / 0.22);
  const e = easeOut(q);
  return <div style={{position: 'absolute', left: x, top: y, padding: '10px 36px', borderRadius: 16, background: '#C4607E', border: '6px solid #fff', boxShadow: '0 20px 40px rgba(120,30,70,0.5)', color: '#fff', fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: 8, opacity: Math.min(1, q * 3), transform: `rotate(${rot}deg) scale(${2.6 - 1.6 * e})`, zIndex: 40, whiteSpace: 'nowrap'}}>{txt}</div>;
};
const CaptionsLight = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const now = f / fps;
  let chunk = null;
  script.captions.forEach((c) => { if (now >= W(c[0][1]) - 0.04) chunk = c; });
  if (!chunk) return null;
  const a = Math.min(1, (now - (W(chunk[0][1]) - 0.04)) / 0.22);
  return (
    <div style={{position: 'absolute', left: 70, top: 172, width: 940, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontSize: 60, lineHeight: 1.12, color: '#fff', zIndex: 90, opacity: a, transform: `translateY(${(1 - a) * 18}px)`, letterSpacing: 0.5, textShadow: '0 4px 22px rgba(0,0,0,0.75)'}}>
      {chunk.map(([txt, s0], i) => {
        const on = now >= W(s0);
        const cur = on && (i === chunk.length - 1 || now < W(chunk[i + 1][1]));
        return <span key={i} style={{opacity: on ? 1 : 0.5, color: cur ? '#FFC2DA' : '#fff', fontStyle: cur ? 'italic' : 'normal'}}>{txt}{' '}</span>;
      })}
    </div>
  );
};
const Pic = ({src, filter, pos = '50% 50%'}) => (
  <div style={{width: '100%', height: '100%', borderRadius: 10, overflow: 'hidden', filter}}><Img src={img(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos}} /></div>
);
const Sparks = ({t, from, to, n = 24, w = 800, h = 600}) => {
  if (t < from || t > to) return null;
  const q = (t - from) / (to - from);
  return <>{Array.from({length: n}).map((_, i) => <div key={i} style={{position: 'absolute', left: hash(i) * w, top: hash(i + 7) * h - q * (150 + hash(i + 3) * 350), width: 8 + hash(i + 2) * 14, height: 8 + hash(i + 2) * 14, borderRadius: '50%', background: '#FFD76A', boxShadow: '0 0 16px #FFB43A', opacity: Math.min(1, q * 5) * (1 - q)}} />)}</>;
};

export const Board26Main = () => {
  useFonts();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const k = (a, b, ease = easeIO) => interpolate(t, [a, b], [0, 1], {...clamp, easing: ease});
  const cam = camAt(t);
  const tapAt = 21.6, tap2At = 22.2;
  const endIn = k(19.4, 20.0, easeOut);
  const curX = interpolate(t, [20.6, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [880, 560, 560, 600], clamp);
  const curY = interpolate(t, [20.6, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [1500, 770, 780, 910], clamp);

  const irisC = `circle(${easeOut(k(3.9, 4.6)) * 1800}px at 540px 1500px)`;
  const curtainClose = easeIO(k(4.95, 5.3));
  const curtainOpen = easeIO(k(5.45, 6.0));
  const curtain = t < 5.4 ? curtainClose : 1 - curtainOpen;
  const flipOut = k(8.3, 8.8, (x) => x * x);
  const flipIn = k(8.8, 9.3, easeOut);
  const clockDeg = easeIO(k(12.95, 13.65)) * 360;
  const R = easeIO(k(15.3, 15.95)) * 2200;
  const wipeH = easeIO(k(19.3, 19.95));

  const vanishB = easeIO(k(3.2, 3.9));
  const giftX = interpolate(t, [6.2, 7.0], [130, 520], {...clamp, easing: easeIO});
  const routeQ = easeIO(k(10.0, 12.0));
  const crateGone = easeIO(k(12.1, 12.6));

  return (
    <AbsoluteFill style={{background: BG}}>
      {['zeest.jpg', 'recon.jpg', 'peter.jpg', 'fw.jpg', 'p_amberdog.png', 'p_hunter.png', 'p_shrug.png', 'p_open.png'].map((n) => <Img key={n} src={img(n)} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />)}

      {/* A. ХУК: янтарная комната растворяется (видео Kling, 2,2 с) */}
      {t < 2.5 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 15, overflow: 'hidden', background: '#2a1604'}}>
          <div style={{position: 'absolute', inset: 0, transformOrigin: '50% 75%', transform: `scale(${1.08 + 0.15 * k(0, 2.2)})`}}>
            <Sequence from={0} durationInFrames={66}><OffthreadVideo src={staticFile('n26/vid/hook_amber.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} /></Sequence>
          </div>
          <div style={{position: 'absolute', inset: 0, background: '#0d0703', opacity: 0.8 * k(1.1, 2.1)}} />
          <Sparks t={t} from={1.0} to={2.4} n={40} w={1080} h={1920} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 380, background: 'linear-gradient(180deg, rgba(10,6,2,0.55) 0%, rgba(10,6,2,0))', zIndex: 5}} />
        </div>
      )}
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 60%, #FFF3C4, #F6D56A 60%, #E2A93A)', opacity: Math.min(k(1.95, 2.2), 1 - k(2.3, 2.6)), zIndex: 48, pointerEvents: 'none'}} />

      <div style={{position: 'absolute', inset: 0, transform: `translate(${cam.px}px, ${cam.py}px) rotate(${cam.rot}deg) scale(${cam.z})`, transformOrigin: '50% 50%', filter: cam.blur > 0.4 ? `blur(${cam.blur}px)` : undefined}}>
        {/* B. 1945: комната пропала */}
        {t >= 2.1 && t < 4.5 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 16, background: BG, opacity: k(2.2, 2.5)}}>
            <DigitStamp t={t} txt="1945" ats={[2.5, 2.8, 3.05, 3.3]} top={330} size={230} width={150} />
            <Card x={130} y={660} w={820} h={605} at={2.4} t={t} r={16} pad={8} bg="#fff" rot={-1}>
              <div style={{width: '100%', height: '100%', opacity: 1 - 0.9 * vanishB, filter: `blur(${vanishB * 10}px) brightness(${1 + vanishB * 0.5})`}}><Pic src="zeest.jpg" /></div>
              <Sparks t={t} from={3.2} to={4.2} n={26} w={800} h={600} />
            </Card>
            <SolidStamp txt="ПРОПАЛА" at={3.5} t={t} x={230} y={880} rot={-8} size={84} />
          </div>
        )}

        {/* C. Янтарная комната (круг от низа) */}
        {t >= 3.9 && t < 5.8 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 17, background: BG, clipPath: irisC}}>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 340, textAlign: 'center'}}><Kin txt="Янтарная комната" at={4.1} t={t} size={120} italic color="#C48A1A" /></div>
            <Card x={90} y={560} w={900} h={665} at={4.3} t={t} r={16} pad={8} bg="#fff" rot={1}><Pic src="zeest.jpg" /></Card>
            <Chip txt="цветное фото начала XX века" at={4.7} t={t} x={430} y={1260} size={26} bg="rgba(255,236,170,0.98)" />
          </div>
        )}

        {/* D. 1716: подарок Петру (занавес) */}
        {t >= 5.25 && t < 9.2 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 18, background: BG, transform: `perspective(1600px) rotateY(${flipOut * 90}deg)`, transformOrigin: '0% 50%'}}>
            <DigitStamp t={t} txt="1716" ats={[7.2, 7.45, 7.7, 7.95]} top={330} size={200} width={150} />
            <Card x={70} y={560} w={400} h={547} at={5.9} t={t} r={16} rot={-3} pad={7} bg="#fff" from="left"><Pic src="fw.jpg" /></Card>
            <Card x={610} y={560} w={400} h={667} at={6.4} t={t} r={16} rot={3} pad={7} bg="#fff" from="right"><Pic src="peter.jpg" /></Card>
            <Chip txt="король Пруссии" at={6.3} t={t} x={70} y={1130} size={26} />
            <Chip txt="царь Пётр I" at={6.9} t={t} x={650} y={1260} size={26} bg="rgba(255,236,170,0.98)" />
            {t >= 6.1 && t < 7.4 && (
              <div style={{position: 'absolute', left: giftX, top: 780 + Math.sin(t * 14) * 12, width: 220, height: 220, zIndex: 35, transform: `rotate(${Math.sin(t * 10) * 8}deg) scale(${1 - 0.25 * k(6.9, 7.4)})`, opacity: 1 - k(7.1, 7.4)}}>
                <svg width="220" height="220" viewBox="0 0 220 220"><rect x="20" y="80" width="180" height="120" rx="12" fill="#F4C25B" stroke={INK} strokeWidth="6" /><rect x="95" y="80" width="30" height="120" fill="#C4607E" /><rect x="20" y="110" width="180" height="26" fill="#C4607E" /><path d="M110 80 C70 20 30 50 110 80 C190 50 150 20 110 80Z" fill="#C4607E" stroke={INK} strokeWidth="5" /></svg>
              </div>
            )}
          </div>
        )}

        {/* E. 1941: вывезли в Кёнигсберг (переворот) */}
        {t >= 8.7 && t < 13.5 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 19, background: BG, transform: `perspective(1600px) rotateY(${(1 - flipIn) * -90}deg)`, transformOrigin: '100% 50%'}}>
            <DigitStamp t={t} txt="1941" ats={[8.95, 9.2, 9.45, 9.7]} top={330} size={200} width={150} />
            <Card x={60} y={600} w={960} h={620} at={9.4} t={t} r={30} pad={0} bg="#EAF2FB" rot={0}>
              <svg width="960" height="620" viewBox="0 0 960 620" style={{display: 'block'}}>
                <path d="M0 0 H960 V620 H0 Z" fill="#CFE3F5" />
                <path d="M0 260 C120 230 180 300 320 270 C470 240 540 150 700 130 C820 115 900 60 960 70 V620 H0 Z" fill="#F0E6D0" />
                <path d="M0 260 C120 230 180 300 320 270 C470 240 540 150 700 130 C820 115 900 60 960 70" fill="none" stroke="#B9A98F" strokeWidth="5" />
                <path d="M780 135 L760 125 L740 135" fill="none" stroke="none" />
                <path d="M780 140 C690 230 520 330 300 430" fill="none" stroke={AMB} strokeWidth="9" strokeLinecap="round" strokeDasharray="20 16" pathLength="1" style={{strokeDashoffset: 0, opacity: k(9.8, 10.1)}} />
                <circle cx="780" cy="140" r="16" fill="#C4607E" stroke="#fff" strokeWidth="5" />
                <circle cx="300" cy="430" r="16" fill="#2B2433" stroke="#fff" strokeWidth="5" />
                <text x="780" y="112" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="30" fill="#2B2433">Царское Село</text>
                <text x="290" y="478" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="30" fill="#2B2433">Кёнигсберг</text>
              </svg>
              {t >= 10.0 && (() => {
                const px = 780 + (300 - 780) * routeQ, py = 140 + (430 - 140) * routeQ + Math.sin(routeQ * Math.PI) * -40;
                return <div style={{position: 'absolute', left: px - 40, top: py - 50, width: 80, height: 70, borderRadius: 8, background: 'linear-gradient(135deg,#C99A5B,#8E6A3A)', border: '5px solid #5A3F2B', opacity: 1 - crateGone, transform: `rotate(${Math.sin(t * 9) * 6}deg) scale(${1 + crateGone * 0.4})`}}><div style={{position: 'absolute', inset: 6, border: '3px solid rgba(255,236,190,0.7)'}} /></div>;
              })()}
              <Sparks t={t} from={12.1} to={13.0} n={20} w={400} h={500} />
            </Card>
            <Chip txt="в ящиках, на поезде" at={10.2} t={t} x={480} y={1250} size={24} bg="rgba(230,225,238,0.98)" />
            <SolidStamp txt="ИСЧЕЗЛА" at={12.4} t={t} x={330} y={1110} rot={-7} size={66} />
          </div>
        )}

        {/* F. куда делась (часовой вайп) */}
        {t >= 12.95 && t < 15.7 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 20, background: BG, WebkitMaskImage: `conic-gradient(from 0deg at 50% 50%, #000 ${clockDeg}deg, transparent ${clockDeg}deg)`, maskImage: `conic-gradient(from 0deg at 50% 50%, #000 ${clockDeg}deg, transparent ${clockDeg}deg)`}}>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 340, textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, fontSize: 440, lineHeight: 1, color: '#E59A2C', textShadow: '0 12px 50px rgba(229,154,44,0.45)', transform: `rotate(${Math.sin(t * 5) * 4}deg) scale(${0.85 + 0.15 * k(13.3, 13.8, easeOut)})`, opacity: k(13.2, 13.6)}}>?</div>
            {[['сгорела?', 13.9, 90, 900, -4], ['спрятана?', 14.3, 560, 960, 3], ['увезена?', 14.7, 250, 1060, -2]].map(([txt, at, x, y, r]) => {
              const q = spring({frame: f - Math.round(at * fps), fps, config: {damping: 9, stiffness: 190}});
              if (t < at) return null;
              return <div key={txt} style={{position: 'absolute', left: x, top: y, padding: '14px 36px', borderRadius: 40, background: '#fff', boxShadow: '0 18px 40px rgba(60,50,100,0.25)', fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 62, color: INK, transform: `scale(${Math.min(1.08, q)}) rotate(${r}deg)`, zIndex: 31}}>{txt}</div>;
            })}
          </div>
        )}

        {/* G. 2003: реконструкция (ромб) */}
        {t >= 15.3 && t < 19.9 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 21, background: BG, clipPath: `polygon(540px ${960 - R}px, ${540 + R * 0.56}px 960px, 540px ${960 + R}px, ${540 - R * 0.56}px 960px)`}}>
            <DigitStamp t={t} txt="2003" ats={[17.35, 17.6, 17.85, 18.1]} top={330} size={200} width={150} />
            <div style={{position: 'absolute', left: 70, top: 580, fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 5, color: ROSE, opacity: k(16.2, 16.5)}}>БЫЛО</div>
            <Card x={70} y={620} w={440} h={325} at={16.0} t={t} r={14} rot={-3} pad={6} bg="#fff" from="left"><Pic src="zeest.jpg" /></Card>
            <div style={{position: 'absolute', left: 570, top: 620, fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 5, color: ROSE, opacity: k(16.6, 16.9)}}>СЕГОДНЯ</div>
            <Card x={570} y={660} w={440} h={331} at={16.4} t={t} r={14} rot={3} pad={6} bg="#fff" from="right"><Pic src="recon.jpg" /></Card>
            <Chip txt="Царское Село" at={16.8} t={t} x={570} y={1030} size={28} bg="rgba(255,236,170,0.98)" z={45} />
            <SolidStamp txt="РЕКОНСТРУКЦИЯ" at={18.4} t={t} x={330} y={1260} rot={-5} size={56} />
            <div style={{position: 'absolute', left: 570, top: 1105, fontFamily: SANS, fontWeight: 700, fontSize: 22, color: INK, opacity: 0.9, background: 'rgba(255,255,255,0.9)', padding: '4px 12px', borderRadius: 12}}>фото: G. Alexandrova, CC BY-SA 4.0</div>
          </div>
        )}
      </div>

      {/* занавес: C -> D */}
      {t >= 4.9 && t < 6.05 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 47, pointerEvents: 'none', overflow: 'hidden'}}>
          {[0, 1].map((i) => (
            <div key={i} style={{position: 'absolute', top: 0, height: 1920, width: 560, left: i ? 'auto' : 0, right: i ? 0 : 'auto', transform: `translateX(${(i ? 1 : -1) * (1 - curtain) * 580}px)`, background: 'repeating-linear-gradient(90deg, #5E1530 0 36px, #8A2347 36px 72px, #5E1530 72px 108px)', boxShadow: i ? '-20px 0 40px rgba(0,0,0,0.45)' : '20px 0 40px rgba(0,0,0,0.45)'}}>
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 60, background: 'repeating-linear-gradient(90deg, #E8B545 0 10px, #B98622 10px 20px)'}} />
              <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 80, background: 'linear-gradient(180deg,#E8B545,#B98622)'}} />
            </div>
          ))}
        </div>
      )}

      {/* H. финал */}
      {t >= 19.3 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 50, background: BG, clipPath: `inset(${(1 - wipeH) * 100}% 0 0 0)`}}>
          <div style={{position: 'absolute', left: 0, width: 1080, top: 345, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 100, color: INK, lineHeight: 1.05, opacity: endIn}}>Найдётся ли<br />настоящая?</div>
          {[['Найдётся', 640, 0], ['Потеряна навсегда', 780, 1]].map(([txt, top, i]) => {
            const pr = spring({frame: f - Math.round((20.0 + i * 0.15) * fps), fps, config: {damping: 14, stiffness: 160}});
            const g = (i === 0 && t >= tapAt && t < tap2At) || (i === 1 && t >= tap2At);
            return (
              <div key={i} style={{position: 'absolute', left: 170, top, width: 740, height: 110, borderRadius: 55, background: g ? 'linear-gradient(90deg,#F7C3D2,#E79BB4)' : 'rgba(255,255,255,0.92)', color: INK, fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: g ? '0 20px 50px rgba(196,96,126,0.45)' : '0 16px 36px rgba(80,50,90,0.18)', transform: `scale(${Math.min(pr, 1.03) * (g ? 1.05 : 1)})`, opacity: Math.min(1, pr * 2)}}>{txt}</div>
            );
          })}
          <svg width="120" height="140" viewBox="-10 -10 120 140" style={{position: 'absolute', left: curX, top: curY, zIndex: 80, filter: 'drop-shadow(8px 12px 10px rgba(0,0,0,0.3))', transform: `scale(${(t >= tapAt && t < tapAt + 0.2) || (t >= tap2At && t < tap2At + 0.2) ? 0.85 : 1})`}}>
            <path d="M5 5 L5 95 L30 72 L48 112 L66 104 L48 66 L82 66 Z" fill="#fff" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      <Dog t={t} f={f} />
      <div style={{position: 'absolute', left: 60, top: 1622, padding: '12px 26px', borderRadius: 30, background: 'rgba(255,255,255,0.94)', boxShadow: '0 10px 26px rgba(80,50,90,0.18)', fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: INK, zIndex: 95}}>{script.diagram.title}</div>
      {t < 2.3 ? <CaptionsLight /> : <Captions />}
    </AbsoluteFill>
  );
};
