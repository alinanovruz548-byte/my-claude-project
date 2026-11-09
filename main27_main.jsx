const CAM_STARTS = [2.7, 4.7, 8.4, 14.3, 17.9, 21.7];
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
          <span style={{display: 'inline-block', fontFamily: SERIF, fontWeight: 700, fontSize: size, lineHeight: 1, color, opacity: q > 0 ? 1 : 0, transform: `scale(${3.2 - 2.2 * e}) rotate(${(i % 2 ? 1 : -1) * (1 - e) * 14}deg)`, textShadow: '0 10px 0 rgba(196,96,126,0.25)'}}>{d}</span>
          {t >= at && <span style={{position: 'absolute', left: width / 2 - 65, top: size * 0.52 - 65, width: 130, height: 130, borderRadius: '50%', border: '8px solid rgba(196,96,126,0.55)', opacity: 1 - ring, transform: `scale(${0.5 + ring * 2.6})`}} />}
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
// субтитры: каждое слово «выпрыгивает» пружиной, текущее подсвечено и чуть крупнее
const CaptionsAnim = ({light}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const now = f / fps;
  let chunk = null;
  script.captions.forEach((c) => { if (now >= W(c[0][1]) - 0.04) chunk = c; });
  if (!chunk) return null;
  const base = light ? '#fff' : INK;
  const dim = light ? 0.45 : 0.26;
  return (
    <div style={{position: 'absolute', left: 60, top: 172, width: 960, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontSize: 62, lineHeight: 1.14, color: base, zIndex: 90, letterSpacing: 0.5, textShadow: light ? '0 4px 22px rgba(0,0,0,0.75)' : 'none'}}>
      {chunk.map(([txt, s0], i) => {
        const wt = W(s0);
        const on = now >= wt;
        const cur = on && (i === chunk.length - 1 || now < W(chunk[i + 1][1]));
        const sp = spring({frame: f - Math.round((wt - 0.05) * fps), fps, config: {damping: 10, stiffness: 210}});
        const q = on ? Math.min(1.12, sp) : 0;
        const appear = Math.min(1, Math.max(0, (now - (W(chunk[0][1]) - 0.04)) / 0.2));
        return <span key={i} style={{display: 'inline-block', marginRight: 14, opacity: (on ? 1 : dim) * appear, transform: `translateY(${on ? (1 - Math.min(1, sp)) * 26 : 8}px) scale(${on ? 0.7 + 0.3 * q + (cur ? 0.07 : 0) : 0.92})`, color: cur ? (light ? '#FFC2DA' : ROSE) : base, fontStyle: cur ? 'italic' : 'normal', transformOrigin: '50% 80%'}}>{txt}</span>;
      })}
    </div>
  );
};
const Pic = ({src, filter, pos = '50% 50%', fit = 'cover'}) => (
  <div style={{width: '100%', height: '100%', borderRadius: 10, overflow: 'hidden', filter}}><Img src={img(src)} style={{width: '100%', height: '100%', objectFit: fit, objectPosition: pos}} /></div>
);
// бумажный человечек в пальто и шляпе
const Person = ({x, y, s = 1, c = '#8E6A4A', hat = '#4A3A30', bob = 0}) => (
  <svg width="90" height="190" viewBox="0 0 90 190" style={{position: 'absolute', left: x, top: y + bob, transform: `scale(${s})`, transformOrigin: '50% 100%', overflow: 'visible'}}>
    <ellipse cx="45" cy="184" rx="30" ry="6" fill="rgba(60,40,60,0.2)" />
    <path d="M20 180 L26 90 Q45 70 64 90 L70 180 Z" fill={c} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    <circle cx="45" cy="62" r="20" fill="#F0D2C2" stroke={INK} strokeWidth="3" />
    <path d="M18 56 Q45 40 72 56 L66 46 Q45 22 24 46 Z" fill={hat} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    <rect x="14" y="52" width="62" height="7" rx="3" fill={hat} stroke={INK} strokeWidth="3" />
  </svg>
);
const Ticket = ({w = 700, h = 300, txt = 'ВХОД'}) => (
  <div style={{position: 'relative', width: w, height: h, background: 'linear-gradient(135deg,#FFF1C9,#F2D27C)', borderRadius: 26, border: '8px solid #B8892A', boxSizing: 'border-box', boxShadow: '0 30px 60px rgba(60,40,20,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 800, fontSize: h * 0.34, letterSpacing: 14, color: '#6B4A12'}}>
    <div style={{position: 'absolute', left: -22, top: h / 2 - 22, width: 44, height: 44, borderRadius: '50%', background: '#2a1f16'}} />
    <div style={{position: 'absolute', right: -22, top: h / 2 - 22, width: 44, height: 44, borderRadius: '50%', background: '#2a1f16'}} />
    <div style={{position: 'absolute', left: h * 0.5, top: 14, bottom: 14, borderLeft: '6px dashed rgba(107,74,18,0.5)'}} />
    <span style={{marginLeft: h * 0.4}}>{txt}</span>
  </div>
);

export const Board27Main = () => {
  useFonts();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const k = (a, b, ease = easeIO) => interpolate(t, [a, b], [0, 1], {...clamp, easing: ease});
  const cam = camAt(t);
  const tapAt = 24.0, tap2At = 24.55;
  const endIn = k(21.8, 22.4, easeOut);
  const curX = interpolate(t, [23.0, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [880, 560, 560, 600], clamp);
  const curY = interpolate(t, [23.0, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [1500, 770, 780, 910], clamp);

  // переходы
  const flash = Math.max(0, 1 - Math.abs(t - 2.65) / 0.16);           // вспышка фотоаппарата: хук -> B
  const rowQ = (i) => easeIO(Math.min(1, Math.max(0, (t - 4.6 - i * 0.045) / 0.4)));   // B -> C: строки с двух сторон
  const irisD = `circle(${easeOut(k(8.4, 9.1)) * 2000}px at 150px 1500px)`;           // C -> D: круг из угла
  const doorQ = easeIO(k(14.1, 14.7));                                                    // D -> E: две половины сверху/снизу
  const tkQ = easeIO(k(17.8, 18.5));                                                      // E -> F: билет проносится
  const edge = 1250 - 1500 * tkQ;
  const colQ = (i) => easeIO(Math.min(1, Math.max(0, (t - 21.6 - i * 0.05) / 0.4)));     // F -> финал: колонны

  const hook = k(0, 2.6);
  const count650 = Math.round(650 * easeOut(k(8.8, 10.2)));

  return (
    <AbsoluteFill style={{background: BG}}>
      {['cat.jpg', 'crowd.jpg', 'kand.jpg', 'klee.jpg', 'chagall.png', 'marc.jpg', 'corinth.jpg', 'schlemmer.jpg', 'g1.png', 'g2.png', 'g3.jpg', 'p_ticket.png', 'p_artist.png', 'p_think.png', 'p_judge.png', 'p_laugh.png', 'p_open.png', 'p_scared.png'].map((n) => <Img key={n} src={img(n)} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />)}

      {/* A. ХУК: очередь на «выставку позора» (видео Kling, 2,6 с) */}
      {t < 2.9 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 15, overflow: 'hidden', background: '#2a1604'}}>
          <div style={{position: 'absolute', inset: 0, transformOrigin: '30% 75%', transform: `scale(${1.04 + 0.2 * easeIn3(hook)})`}}>
            <Sequence from={0} durationInFrames={78}><OffthreadVideo src={staticFile('n27/vid/hook_q.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} /></Sequence>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 380, background: 'linear-gradient(180deg, rgba(10,6,2,0.6) 0%, rgba(10,6,2,0))', zIndex: 5}} />
        </div>
      )}
      <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash, zIndex: 49, pointerEvents: 'none'}} />

      <div style={{position: 'absolute', inset: 0, transform: `translate(${cam.px}px, ${cam.py}px) rotate(${cam.rot}deg) scale(${cam.z})`, transformOrigin: '50% 50%', filter: cam.blur > 0.4 ? `blur(${cam.blur}px)` : undefined}}>
        {/* B. «очереди»: человечки бегут к двери */}
        {t >= 2.6 && t < 5.4 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 16, background: BG, opacity: k(2.62, 2.85)}}>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 340, textAlign: 'center', whiteSpace: 'nowrap'}}>
              {'ОЧЕРЕДИ'.split('').map((ch, i) => {
                const at = 3.0 + i * 0.07;
                const sp = spring({frame: f - Math.round(at * fps), fps, config: {damping: 8, stiffness: 160}});
                return <span key={i} style={{display: 'inline-block', fontFamily: SANS, fontWeight: 800, fontSize: 150, letterSpacing: 4, color: i % 2 ? INK : ROSE, opacity: t >= at ? 1 : 0, transform: `translateY(${(1 - sp) * -500}px) rotate(${(1 - sp) * (i % 2 ? 25 : -25)}deg)`}}>{ch}</span>;
              })}
            </div>
            <div style={{position: 'absolute', left: 740, top: 700, width: 280, height: 560, borderRadius: '140px 140px 20px 20px', background: 'linear-gradient(180deg,#FFE9A8,#F2B84A)', boxShadow: '0 0 90px 30px rgba(255,200,90,0.55)', border: '10px solid #B8892A', opacity: k(3.0, 3.4)}} />
            {Array.from({length: 9}).map((_, i) => {
              const px = interpolate(t, [3.2, 5.0], [-200 - i * 20, 760 - i * 22 - (i % 3) * 18], {...clamp, easing: easeOut});
              return <Person key={i} x={px} y={1040 + (i % 3) * 22} s={1.5 + (i % 3) * 0.12} c={['#8E6A4A', '#5E6A8A', '#7A4A5A', '#4A6A5A'][i % 4]} bob={Math.abs(Math.sin(t * 9 + i)) * -14} />;
            })}
            <Chip txt="выстроились до конца улицы" at={4.0} t={t} x={110} y={1290} size={28} bg="rgba(255,236,170,0.98)" />
          </div>
        )}

        {/* C. Дегенеративное искусство, Мюнхен, 1937 (строки с двух сторон) */}
        {t >= 4.6 && t < 8.9 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 17, background: BG, clipPath: 'url(#rowsC)'}}>
            <svg width="0" height="0" style={{position: 'absolute'}}><clipPath id="rowsC">{Array.from({length: 12}).map((_, i) => <rect key={i} x={i % 2 ? 1080 - (t < 5.3 ? rowQ(i) * 1080 : 1080) : 0} y={i * 160} width={t < 5.3 ? rowQ(i) * 1080 : 1080} height={161} />)}</clipPath></svg>
            <DigitStamp t={t} txt="1937" ats={[6.55, 6.8, 7.05, 7.3]} top={330} size={210} width={150} />
            <Card x={60} y={640} w={430} h={614} at={5.3} t={t} r={16} rot={-4} pad={8} bg="#fff" from="left"><Pic src="cat.jpg" /></Card>
            <Chip txt="Мюнхен" at={6.0} t={t} x={560} y={700} size={42} />
            <Chip txt="«Дегенеративное искусство»" at={5.5} t={t} x={520} y={800} size={30} bg="rgba(255,236,170,0.98)" />
            <Chip txt="путеводитель выставки" at={7.7} t={t} x={520} y={900} size={24} bg="rgba(230,225,238,0.98)" />
          </div>
        )}

        {/* D. 650 работ: Кандинский, Клее, Шагал (круг из угла) */}
        {t >= 8.4 && t < 14.7 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 18, background: BG, clipPath: irisD}}>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 320, textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 270, lineHeight: 1, color: INK, textShadow: '0 12px 0 rgba(196,96,126,0.22)', transform: `scale(${0.8 + 0.2 * k(8.8, 9.4, easeOut)})`}}>{count650}</div>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 590, textAlign: 'center', opacity: k(9.8, 10.2)}}><Kin txt="работ" at={9.8} t={t} size={90} italic color={ROSE} /></div>
            {t < 12.5 && (
              <div style={{position: 'absolute', inset: 0, opacity: 1 - k(12.1, 12.45), transform: `scale(${1 - 0.25 * k(12.1, 12.45)}) rotate(${-6 * k(12.1, 12.45)}deg)`, transformOrigin: '50% 60%'}}>
                <Card x={50} y={760} w={500} h={338} at={10.3} t={t} r={16} rot={-4} pad={7} bg="#fff" from="left"><Pic src="kand.jpg" /></Card>
                <Card x={600} y={730} w={400} h={543} at={11.0} t={t} r={16} rot={4} pad={7} bg="#fff" from="right"><Pic src="klee.jpg" /></Card>
                <Card x={230} y={1190} w={520} h={420} at={11.55} t={t} r={16} rot={-2} pad={7} bg="#fff" from="left" z={25}><Pic src="chagall.png" /></Card>
                {[['Кандинский', 10.0, 70, 1130], ['Клее', 10.9, 640, 1300], ['Шагал', 11.45, 120, 1560]].map(([txt, at, x, y], i) => <Chip key={txt} txt={txt} at={at} t={t} x={x} y={y} size={32} z={36} bg={i % 2 ? 'rgba(255,236,170,0.98)' : 'rgba(255,255,255,0.97)'} rot={i % 2 ? 3 : -3} />)}
              </div>
            )}
            {t >= 12.1 && (
              <>
                <Chip txt="и другие" at={12.15} t={t} x={690} y={660} size={36} z={38} bg="rgba(255,236,170,0.98)" rot={3} />
                {[['kand.jpg', 'Кандинский', 'left'], ['klee.jpg', 'Клее', 'up'], ['chagall.png', 'Шагал', 'right'], ['marc.jpg', 'Марк', 'left'], ['corinth.jpg', 'Коринт', 'up'], ['schlemmer.jpg', 'Шлеммер', 'right']].map(([src, nm, from], i) => {
                  const cx = 40 + (i % 3) * 345, cy = 725 + Math.floor(i / 3) * 300, at = 12.3 + i * 0.17;
                  return (
                    <React.Fragment key={src}>
                      <Card x={cx} y={cy} w={310} h={285} at={at} t={t} r={14} rot={(i % 2 ? 3 : -3) + (i > 2 ? 1 : 0)} pad={6} bg="#fff" from={from} z={26}><Pic src={src} /></Card>
                      <Chip txt={nm} at={at + 0.2} t={t} x={cx + 40} y={cy + 255} size={24} z={37} bg={i % 2 ? 'rgba(255,236,170,0.98)' : 'rgba(255,255,255,0.97)'} rot={i % 2 ? 2 : -2} />
                    </React.Fragment>
                  );
                })}
                <div style={{position: 'absolute', left: 40, top: 1500, width: 640, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 26, color: '#5A4A66', opacity: k(13.2, 13.6)}}>примеры работ художников выставки</div>
              </>
            )}
          </div>
        )}

        {/* E. рядом: две выставки (две половины сверху и снизу) */}
        {t >= 14.1 && t < 18.6 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 19, overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: 0, top: 0, width: 540, height: 1920, background: 'linear-gradient(180deg,#FBE4EE,#F4D2E4)', transform: `translateY(${(1 - doorQ) * -1920}px)`, overflow: 'hidden'}}>
              <div style={{position: 'absolute', left: 90, top: 560, width: 380, height: 500, borderRadius: 14, overflow: 'hidden', border: '8px solid #fff', boxShadow: '0 24px 50px rgba(120,40,80,0.35)', transform: 'rotate(-2deg)'}}><Img src={img('crowd.jpg')} style={{position: 'absolute', maxWidth: 'none', width: 1190, height: 860, left: -10, top: -105}} /></div>
              <div style={{position: 'absolute', left: 20, top: 1100, width: 500, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 46, letterSpacing: 5, color: '#C4607E', opacity: k(15.0, 15.3)}}>«ПОЗОРНАЯ»</div>
              <div style={{position: 'absolute', left: 20, top: 1165, width: 500, textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 18, color: '#7C5A6A', opacity: k(15.4, 15.7)}}>Фото: Bundesarchiv, CC BY-SA 3.0 de</div>
            </div>
            <div style={{position: 'absolute', left: 540, top: 0, width: 540, height: 1920, background: 'linear-gradient(180deg,#EEF1F8,#DDE3F0)', transform: `translateY(${(1 - doorQ) * 1920}px)`, overflow: 'hidden'}}>
              {[['g1.png', 28, 495, 300, 200, -2, 15.7], ['g3.jpg', 232, 670, 296, 180, 2, 16.0], ['g2.png', 40, 835, 300, 225, -1.5, 16.3]].map(([src, x, y, w, h, rot, at], i) => {
                const q = easeOut(Math.min(1, Math.max(0, (t - at) / 0.45)));
                return <div key={src} style={{position: 'absolute', left: x, top: y, width: w, height: h, border: '9px solid #C9A14A', boxSizing: 'border-box', background: '#F8F6EE', boxShadow: '0 16px 30px rgba(60,60,100,0.28)', opacity: q, transform: `translateY(${(1 - q) * 80}px) rotate(${rot}deg) scale(${0.9 + 0.1 * q})`, overflow: 'hidden'}}><Img src={img(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>;
              })}
              <div style={{position: 'absolute', left: 20, top: 1100, width: 500, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 44, letterSpacing: 3, color: '#4A5580', opacity: k(16.2, 16.5)}}>«ПРАВИЛЬНАЯ»</div>
              <div style={{position: 'absolute', left: 20, top: 1165, width: 500, textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 18, color: '#4A5580', opacity: k(16.6, 16.9)}}>пейзажи с Большой германской выставки, 1938–39</div>
            </div>
            <div style={{position: 'absolute', left: 536, top: 0, width: 8, height: 1920, background: 'linear-gradient(180deg,#F6DE97,#C48A1A)', transform: `scaleY(${doorQ})`, transformOrigin: '50% 0%', zIndex: 5}} />
            <div style={{position: 'absolute', left: 0, width: 1080, top: 380, textAlign: 'center', zIndex: 6}}><Kin txt="две выставки рядом" at={14.8} t={t} size={92} italic color={INK} /></div>
          </div>
        )}

        {/* F. больше двух миллионов (проносится билет) */}
        {t >= 17.8 && t < 22.4 && (
          <>
            <div style={{position: 'absolute', inset: 0, zIndex: 20, background: BG, clipPath: `polygon(${edge}px 0px, 1080px 0px, 1080px 1920px, ${edge + 140}px 1920px)`}}>
              <div style={{position: 'absolute', left: 0, width: 1080, top: 320, textAlign: 'center'}}><Kin txt="больше 2 млн" at={18.8} t={t} size={150} color={ROSE} italic /></div>
              <svg width="1080" height="800" viewBox="0 0 1080 800" style={{position: 'absolute', left: 0, top: 400}}>
                <line x1="100" y1="700" x2="980" y2="700" stroke="#8D8696" strokeWidth="5" />
                {(() => {
                  const h1 = 600 * easeOut(k(19.0, 20.6)), h2 = 120 * easeOut(k(19.6, 20.8));
                  return (
                    <>
                      <rect x="210" y={700 - h1} width="270" height={h1} rx="12" fill="url(#gb27)" />
                      <rect x="610" y={700 - h2} width="270" height={h2} rx="12" fill="#98A2BE" />
                      <defs><linearGradient id="gb27" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F7A8C8" /><stop offset="1" stopColor="#C4607E" /></linearGradient></defs>
                      <text x="345" y="755" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="34" fill="#2B2433">«позорная»</text>
                      <text x="745" y="755" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="34" fill="#2B2433">«правильная»</text>
                      <text x="745" y={700 - h2 - 20} textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="34" fill="#4A5580" opacity={k(20.5, 20.9)}>меньше 0,5 млн</text>
                    </>
                  );
                })()}
              </svg>
              {Array.from({length: 18}).map((_, i) => {
                const at = 19.2 + i * 0.07;
                return <div key={i} style={{position: 'absolute', left: 215 + (i % 6) * 44, top: 590 + 2 * (Math.floor(i / 6)) * 0 + Math.floor(i / 6) * 0, width: 0, height: 0, opacity: 0}} />;
              })}
              <Chip txt="по оценкам историков" at={20.9} t={t} x={560} y={1225} size={26} bg="rgba(255,236,170,0.98)" />
              <SolidStamp txt="РЕКОРД" at={20.6} t={t} x={120} y={1215} rot={-7} size={60} />
            </div>
            {tkQ > 0 && tkQ < 1 && (
              <div style={{position: 'absolute', left: edge - 330, top: 700, width: 700, height: 300, zIndex: 47, transform: 'rotate(-8deg)', pointerEvents: 'none'}}><Ticket txt="ВХОД" /></div>
            )}
          </>
        )}
      </div>

      {/* G. финал: колонны поднимаются */}
      {t >= 21.6 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 50, background: BG, clipPath: 'url(#colsG)'}}>
          <svg width="0" height="0" style={{position: 'absolute'}}><clipPath id="colsG">{Array.from({length: 8}).map((_, i) => <rect key={i} x={i * 136} y={1920 - (t < 22.3 ? colQ(i) * 1920 : 1920)} width={137} height={1920} />)}</clipPath></svg>
          <div style={{position: 'absolute', left: 0, width: 1080, top: 345, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 100, color: INK, lineHeight: 1.05, opacity: endIn, transform: `translateY(${(1 - endIn) * 60}px)`}}>Почему люди<br />шли туда?</div>
          {[['Из любопытства', 640, 0], ['Запретное манит', 780, 1]].map(([txt, top, i]) => {
            const pr = spring({frame: f - Math.round((22.5 + i * 0.15) * fps), fps, config: {damping: 14, stiffness: 160}});
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
      <CaptionsAnim light={t < 2.7} />
    </AbsoluteFill>
  );
};
