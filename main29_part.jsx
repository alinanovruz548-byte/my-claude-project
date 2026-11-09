
const BusSVG = ({w = 700}) => (
  <svg width={w} height={w * 0.5} viewBox="0 0 700 350" style={{display: 'block', overflow: 'visible'}}>
    <rect x="20" y="40" width="640" height="220" rx="36" fill="#F2B63C" stroke={INK} strokeWidth="8" />
    {[60, 180, 300, 420, 540].map((x) => <rect key={x} x={x} y="76" width="90" height="80" rx="10" fill="#CFE6F5" stroke={INK} strokeWidth="6" />)}
    <rect x="30" y="180" width="620" height="14" fill="#C4607E" />
    <circle cx="150" cy="268" r="46" fill="#2A2A33" stroke={INK} strokeWidth="6" /><circle cx="520" cy="268" r="46" fill="#2A2A33" stroke={INK} strokeWidth="6" />
    <circle cx="150" cy="268" r="18" fill="#BDBDC9" /><circle cx="520" cy="268" r="18" fill="#BDBDC9" />
    <rect x="620" y="150" width="46" height="50" rx="8" fill="#FFF3B0" stroke={INK} strokeWidth="5" />
  </svg>
);
const TramSVG = ({w = 700}) => (
  <svg width={w} height={w * 0.55} viewBox="0 0 700 385" style={{display: 'block', overflow: 'visible'}}>
    <rect x="30" y="70" width="640" height="220" rx="24" fill="#3C9B6E" stroke={INK} strokeWidth="8" />
    {[70, 190, 310, 430, 550].map((x) => <rect key={x} x={x} y="104" width="86" height="82" rx="8" fill="#E4F2E9" stroke={INK} strokeWidth="6" />)}
    <rect x="40" y="214" width="620" height="14" fill="#fff" />
    <line x1="350" y1="70" x2="410" y2="8" stroke={INK} strokeWidth="8" strokeLinecap="round" /><line x1="360" y1="8" x2="470" y2="8" stroke={INK} strokeWidth="8" strokeLinecap="round" />
    <circle cx="150" cy="300" r="38" fill="#2A2A33" stroke={INK} strokeWidth="6" /><circle cx="550" cy="300" r="38" fill="#2A2A33" stroke={INK} strokeWidth="6" />
    <rect x="30" y="140" width="42" height="50" rx="8" fill="#FFF3B0" stroke={INK} strokeWidth="5" />
  </svg>
);
const MirrorFrame = ({size, children, spin = 0}) => (
  <div style={{width: size, height: size, borderRadius: '50%', background: 'conic-gradient(from ' + spin + 'deg, #E9C86A, #FFF6CF, #C79A38, #FFF6CF, #E9C86A)', boxShadow: '0 30px 70px rgba(80,50,30,0.4)', padding: 30, boxSizing: 'border-box'}}>
    <div style={{width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', border: '8px solid #8A6A1E', boxSizing: 'border-box', position: 'relative', background: '#EEE'}}>{children}</div>
  </div>
);

export const Board29Main = () => {
  useFonts();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const k = (a, b, ease = easeIO) => interpolate(t, [a, b], [0, 1], {...clamp, easing: ease});
  const cam = camAt(t);
  const tapAt = 26.0, tap2At = 26.55;
  const endIn = k(24.7, 25.25, easeOut);
  const curX = interpolate(t, [25.1, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [880, 560, 560, 600], clamp);
  const curY = interpolate(t, [25.1, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [1500, 790, 800, 930], clamp);

  const hookZoom = easeIn3(k(1.1, 2.4, easeIO));
  const shq = easeIn3(k(4.0, 4.75, (x) => x));
  const busX = interpolate(t, [5.1, 5.95], [1200, -1700], {...clamp, easing: easeIO});
  const hitQ = k(8.5, 9.7, easeIn3);
  const shake = t > 9.7 && t < 10.2 ? Math.sin(t * 90) * (10.2 - t) * 40 : 0;
  const bandQ = (i) => easeIO(Math.min(1, Math.max(0, (t - 10.3 - i * 0.06) / 0.45)));
  const wrapIn = (i) => easeIO(Math.min(1, Math.max(0, (t - 15.7 - i * 0.07) / 0.35)));
  const wrapOut = (i) => easeIO(Math.min(1, Math.max(0, (t - 16.3 - i * 0.07) / 0.4)));
  const irisF = easeOut(k(24.3, 24.95));
  const paintRev = k(16.3, 17.4, easeOut);
  const cnt55 = Math.round(55 * easeOut(k(19.8, 21.2)));
  const age = Math.round(18 * easeOut(k(6.9, 7.4)));
  const mirrorIn = easeOut(k(2.4, 3.0));

  const renderA = () => (
    <div style={{position: 'absolute', inset: 0, background: BG}}>
      <div style={{position: 'absolute', left: 220, top: 400, width: 640, height: 1000, transform: `scale(${1.5 - 0.5 * mirrorIn}) rotate(${(1 - mirrorIn) * -16}deg)`, opacity: Math.min(1, mirrorIn * 2), filter: mirrorIn < 0.9 ? `blur(${(1 - mirrorIn) * 8}px)` : undefined}}>
        <div style={{position: 'absolute', inset: 0, clipPath: 'polygon(23% 38.9%, 27.2% 31.7%, 44.6% 29.4%, 59.8% 31.7%, 66.5% 36.9%, 68.8% 47.4%, 64.3% 62.9%, 57.6% 71.9%, 42.4% 74.6%, 29.5% 71.1%, 22.8% 60%, 20.5% 47.1%)', overflow: 'hidden', background: '#D8D4CC'}}>
          <Img src={img('frida32.jpg')} style={{position: 'absolute', maxWidth: 'none', left: 100, top: 300, width: 380, height: 570, objectFit: 'cover'}} />
        </div>
        <Img src={img('mirror_fx.png')} style={{position: 'absolute', inset: 0, width: 640, height: 1000, filter: 'drop-shadow(0 30px 40px rgba(60,40,20,0.35))'}} />
        <div style={{position: 'absolute', inset: 0, clipPath: 'polygon(23% 38.9%, 27.2% 31.7%, 44.6% 29.4%, 59.8% 31.7%, 66.5% 36.9%, 68.8% 47.4%, 64.3% 62.9%, 57.6% 71.9%, 42.4% 74.6%, 29.5% 71.1%, 22.8% 60%, 20.5% 47.1%)', background: `linear-gradient(115deg, rgba(255,255,255,0) ${30 + (t * 120) % 140 - 40}%, rgba(255,255,255,0.5) ${30 + (t * 120) % 140}%, rgba(255,255,255,0) ${30 + (t * 120) % 140 + 12}%)`}} />
      </div>
      <div style={{position: 'absolute', left: 90, top: 1410, fontFamily: SANS, fontWeight: 700, fontSize: 18, color: '#5A4A66', opacity: k(3.4, 3.8)}}>Зеркало: Bemberg Foundation, CC BY-SA 4.0</div>
      <Chip txt="зеркало" at={3.2} t={t} x={110} y={470} size={50} bg="rgba(255,236,170,0.98)" rot={-4} z={40} />
      <Chip txt="великая художница" at={2.2} t={t} x={540} y={1470} size={30} rot={3} z={40} />
      {Array.from({length: 8}).map((_, i) => { const at = 3.2 + i * 0.03; const q = Math.max(0, t - at); return t >= at ? <div key={i} style={{position: 'absolute', left: 540 + Math.cos(i * 0.785) * (200 + q * 700), top: 1050 + Math.sin(i * 0.785) * (200 + q * 700), width: 26, height: 26, background: '#FFE08A', transform: `rotate(${45 + q * 200}deg) scale(${Math.max(0, 1 - q * 1.6)})`, zIndex: 41}} /> : null; })}
    </div>
  );

  return (
    <AbsoluteFill style={{background: BG}}>
      {['velvet.jpg', 'frida32.jpg', 'room.png', 'p_artist.png', 'p_brush.png', 'p_look.png', 'p_think.png', 'p_scared.png', 'p_open.png', 'p_jump.png', 'p_laugh.png'].map((n) => <Img key={n} src={img(n)} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />)}

      {/* ХУК: собака в постели смотрит в зеркало, зум в зеркало (Kling) */}
      {t < 2.4 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 15, overflow: 'hidden', background: '#16294a'}}>
          <div style={{position: 'absolute', inset: 0, transformOrigin: '51% 30%', transform: `scale(${1 + 3.2 * hookZoom})`, filter: hookZoom > 0.05 ? `blur(${hookZoom * 3}px)` : undefined}}>
            <Sequence from={0} durationInFrames={90}><OffthreadVideo src={staticFile('n29/vid/hook_mirror.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} /></Sequence>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 380, background: 'linear-gradient(180deg, rgba(8,10,20,0.6) 0%, rgba(8,10,20,0))', zIndex: 5}} />
        </div>
      )}

      <div style={{position: 'absolute', inset: 0, transform: `translate(${cam.px}px, ${cam.py}px) rotate(${cam.rot}deg) scale(${cam.z})`, transformOrigin: '50% 50%', filter: cam.blur > 0.4 ? `blur(${cam.blur}px)` : undefined}}>
        {/* A. зеркало с Фридой; разлетается осколками */}
        {t >= 2.4 && t < 4.0 && <div style={{position: 'absolute', inset: 0, zIndex: 16}}>{renderA()}</div>}
        {t >= 4.0 && t < 4.8 && Array.from({length: 6}).map((_, i) => {
          const a0 = (i * 60) * Math.PI / 180, a1 = ((i + 1) * 60) * Math.PI / 180, am = (i * 60 + 30) * Math.PI / 180, R = 2400;
          const pts = `540px 960px, ${540 + R * Math.cos(a0)}px ${960 + R * Math.sin(a0)}px, ${540 + R * Math.cos(a1)}px ${960 + R * Math.sin(a1)}px`;
          return <div key={i} style={{position: 'absolute', inset: 0, zIndex: 16, clipPath: `polygon(${pts})`, transform: `translate(${Math.cos(am) * shq * 1100}px, ${Math.sin(am) * shq * 1100}px) rotate(${(i % 2 ? 1 : -1) * shq * 30}deg)`, opacity: 1 - shq * 0.6, transformOrigin: '540px 960px'}}>{renderA()}</div>;
        })}

        {/* B. имя: Фрида Кало */}
        {t >= 4.0 && t < 6.05 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 15, background: BG}}>
            {['ФРИДА', 'КАЛО'].map((w, li) => (
              <div key={li} style={{position: 'absolute', left: 0, width: 1080, top: 340 + li * 210, textAlign: 'center', whiteSpace: 'nowrap'}}>
                {w.split('').map((ch, i) => { const at = 4.1 + li * 0.5 + i * 0.07; const sp = spring({frame: f - Math.round(at * fps), fps, config: {damping: 8, stiffness: 170}}); return <span key={i} style={{display: 'inline-block', fontFamily: SERIF, fontWeight: 700, fontSize: 210, color: li ? ROSE : INK, opacity: t >= at ? 1 : 0, transform: `translateY(${(1 - sp) * -600}px) rotate(${(1 - sp) * (i % 2 ? 30 : -30)}deg)`, textShadow: '0 12px 0 rgba(196,96,126,0.2)'}}>{ch}</span>; })}
              </div>
            ))}
            <Card x={250} y={830} w={560} h={760} at={4.4} t={t} r={14} rot={-3} pad={8} bg="#fff" from="up"><Pic src="frida32.jpg" pos="50% 30%" /></Card>
            <Chip txt="1932, фото отца" at={4.9} t={t} x={70} y={1480} size={26} bg="rgba(255,255,255,0.97)" rot={-3} />
          </div>
        )}

        {/* C. 1925, 18 лет, автобус и трамвай (автобус-переход) */}
        {t >= 5.1 && t < 10.7 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 17, background: BG, clipPath: t < 6.0 ? `polygon(${busX + 1500}px 0px, 1080px 0px, 1080px 1920px, ${busX + 1500}px 1920px)` : 'none'}}>
            <DigitStamp t={t} txt="1925" ats={[5.35, 5.6, 5.9, 6.2]} top={330} size={220} width={160} />
            <div style={{position: 'absolute', left: 0, width: 1080, top: 640, textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 120, color: ROSE, opacity: k(6.85, 7.1), transform: `scale(${0.8 + 0.2 * k(6.85, 7.3, easeOut)})`}}>{age} <span style={{fontSize: 70, fontStyle: 'italic', color: INK}}>лет</span></div>
            <div style={{position: 'absolute', left: 60, top: 840, width: 960, height: 420, borderRadius: 30, background: '#fff', boxShadow: '0 24px 60px rgba(80,50,90,0.2)', overflow: 'hidden', transform: `translate(${shake}px, ${shake * 0.4}px)`, opacity: k(7.8, 8.2)}}>
              <div style={{position: 'absolute', left: 0, right: 0, top: 300, height: 8, background: '#B9B2C4'}} />
              <div style={{position: 'absolute', left: -380 + hitQ * 540, top: 60}}><BusSVG w={420} /></div>
              <div style={{position: 'absolute', left: 980 - hitQ * 540 - 400, top: 36}}><TramSVG w={420} /></div>
              {t > 9.65 && t < 10.5 && <svg width="400" height="400" viewBox="-200 -200 400 400" style={{position: 'absolute', left: 280, top: 10, opacity: Math.max(0, 1 - (t - 9.65) * 1.4), transform: `scale(${0.4 + (t - 9.65) * 2.2})`}}>
                {Array.from({length: 12}).map((_, i) => <polygon key={i} points="0,-40 16,-120 -16,-120" fill={i % 2 ? '#FFD36A' : '#fff'} stroke={INK} strokeWidth="4" transform={`rotate(${i * 30})`} />)}
              </svg>}
            </div>
            <Chip txt="17 сентября" at={7.9} t={t} x={70} y={780} size={30} bg="rgba(255,236,170,0.98)" rot={-3} z={40} />
            <SolidStamp txt="АВАРИЯ" at={9.8} t={t} x={470} y={1290} rot={-6} size={64} />
          </div>
        )}

        {/* D. месяцы в гипсе (диагональные полосы) + мольберт и зеркало */}
        {t >= 10.3 && t < 16.4 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 18, background: BG, clipPath: t < 11.0 ? 'url(#bandD)' : 'none'}}>
            <svg width="0" height="0" style={{position: 'absolute'}}><clipPath id="bandD"><g transform="rotate(-14 540 960)">{Array.from({length: 9}).map((_, i) => { const q = bandQ(i); return <rect key={i} x={-300 + i * 190} y={i % 2 ? 2300 - q * 3000 : -700 + q * 3000 - 2300 + 700 - 700 + 0} width={191} height={2400} style={{}} transform={`translate(0 ${(i % 2 ? 1 : -1) * (1 - q) * 2400})`} />; })}</g></clipPath></svg>
            {t < 12.2 && (
              <div style={{position: 'absolute', inset: 0}}>
                <div style={{position: 'absolute', left: 0, width: 1080, top: 360, textAlign: 'center'}}><Kin txt="месяцы" at={10.5} t={t} size={150} italic color={ROSE} /></div>
                {['октябрь', 'ноябрь', 'декабрь', 'январь', 'февраль', 'март'].map((m, i) => { const at = 10.7 + i * 0.22; const q = easeOut(Math.min(1, Math.max(0, (t - at) / 0.3))); return t >= at ? <div key={i} style={{position: 'absolute', left: 150 + (i % 3) * 270 + (i > 2 ? 40 : 0), top: 640 + Math.floor(i / 3) * 250, width: 240, height: 210, borderRadius: 20, background: '#fff', boxShadow: '0 18px 36px rgba(80,50,90,0.22)', transform: `rotate(${(i % 2 ? 4 : -4)}deg) scale(${0.6 + 0.4 * q})`, opacity: q, overflow: 'hidden', zIndex: 20}}><div style={{height: 56, background: '#C4607E', color: '#fff', fontFamily: SANS, fontWeight: 800, fontSize: 28, letterSpacing: 2, textAlign: 'center', lineHeight: '56px'}}>{m}</div><div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 90, textAlign: 'center', color: INK, lineHeight: '130px'}}>{i + 1}</div></div> : null; })}
                <SolidStamp txt="ГИПС" at={11.55} t={t} x={330} y={1240} rot={-6} size={90} />
              </div>
            )}
            {t >= 12.0 && (
              <div style={{position: 'absolute', left: 190, top: 330, width: 560, height: 996, borderRadius: 24, overflow: 'hidden', background: '#fff', border: '8px solid #fff', boxShadow: '0 30px 70px rgba(40,50,110,0.35)', transform: `rotate(-2deg) scale(${0.8 + 0.2 * k(12.0, 12.5, easeOut)})`, opacity: k(12.0, 12.3), zIndex: 25}}>
                {(() => { const zz1 = k(12.4, 13.0), zz2 = k(14.1, 14.7); const sc = 1 + 0.8 * zz1 - 0.1 * zz2 + 0.15 * zz2; const ox = 30 + 25 * zz2, oy = 78 - 46 * zz2; return <img src={img('room.png')} style={{width: '100%', height: '100%', objectFit: 'cover', transformOrigin: `${ox}% ${oy}%`, transform: `scale(${sc})`}} />; })()}
              </div>
            )}
            <Chip txt="особый мольберт" at={13.0} t={t} x={640} y={720} size={34} bg="rgba(255,236,170,0.98)" rot={3} z={40} />
            <Chip txt="зеркало над кроватью" at={14.7} t={t} x={560} y={500} size={34} z={40} rot={-3} />
            <div style={{position: 'absolute', left: 190, top: 1340, fontFamily: SANS, fontWeight: 700, fontSize: 20, color: '#5A4A66', opacity: k(12.6, 13.0)}}>иллюстрация</div>
          </div>
        )}

        {/* E. первый автопортрет, 55 из 143 */}
        {t >= 15.9 && t < 22.9 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 19, background: BG}}>
            {t < 18.6 && (
              <div style={{position: 'absolute', inset: 0, opacity: 1 - k(18.3, 18.6)}}>
                <div style={{position: 'absolute', left: 300, top: 400, width: 520, height: 700, background: '#C79A38', padding: 16, borderRadius: 8, boxShadow: '0 30px 70px rgba(80,50,30,0.4)', transform: 'rotate(2deg)', overflow: 'hidden'}}>
                  <div style={{position: 'absolute', inset: 16, overflow: 'hidden', clipPath: `inset(0 0 ${(1 - paintRev) * 100}% 0)`}}><Img src={img('velvet.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
                  <div style={{position: 'absolute', left: 16, right: 16, top: 16 + paintRev * 668, height: 6, background: '#fff', opacity: paintRev < 1 ? 0.9 : 0}} />
                </div>
                <Chip txt="первый автопортрет, 1926" at={17.3} t={t} x={430} y={1250} size={30} bg="rgba(255,236,170,0.98)" rot={-3} z={40} />
                <div style={{position: 'absolute', left: 300, top: 1190, fontFamily: SANS, fontWeight: 700, fontSize: 18, color: '#5A4A66', opacity: k(17.4, 17.8)}}>«Автопортрет в бархатном платье», миниатюра en.wikipedia</div>
              </div>
            )}
            {t >= 18.3 && (
              <div style={{position: 'absolute', inset: 0, opacity: k(18.3, 18.6)}}>
                <div style={{position: 'absolute', left: 0, width: 1080, top: 330, textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 260, lineHeight: 1, color: ROSE, textShadow: '0 12px 0 rgba(196,96,126,0.22)', transform: `scale(${0.85 + 0.15 * k(19.8, 20.3, easeOut)})`}}>{cnt55}</div>
                <div style={{position: 'absolute', left: 0, width: 1080, top: 600, textAlign: 'center'}}><Kin txt="из 143 картин" at={20.5} t={t} size={70} italic color={INK} /></div>
                {Array.from({length: 143}).map((_, i) => {
                  const at = 18.5 + i * 0.012; const col = i % 13, row = Math.floor(i / 13);
                  const hi = i < 55; const hAt = 19.9 + i * 0.026;
                  const q = easeOut(Math.min(1, Math.max(0, (t - at) / 0.25)));
                  const hq = hi ? easeOut(Math.min(1, Math.max(0, (t - hAt) / 0.2))) : 0;
                  return t >= at ? <div key={i} style={{position: 'absolute', left: 78 + col * 72, top: 740 + row * 46, width: 30, height: 30, borderRadius: '50%', background: hq > 0 ? '#E17AA0' : '#CFC8DA', transform: `scale(${(0.3 + 0.7 * q) * (1 + hq * 0.35)})`, opacity: q, boxShadow: hq > 0 ? '0 0 14px rgba(225,122,160,0.8)' : 'none'}} /> : null;
                })}
                <SolidStamp txt="БОЛЬШЕ ТРЕТИ" at={21.5} t={t} x={200} y={1300} rot={-5} size={58} />
              </div>
            )}
          </div>
        )}
      </div>

      {t >= 5.05 && t < 6.1 && <div style={{position: 'absolute', left: busX, top: 640, zIndex: 60, filter: 'drop-shadow(0 30px 30px rgba(40,30,60,0.35))', transform: 'scaleX(-1)'}}><BusSVG w={1500} /></div>}

      {/* КОЛЛАЖ: самые знаменитые картины на весь экран */}
      {t >= 22.5 && t < 24.9 && (() => {
        const items = [['k1', 'Две Фриды', 1938], ['k2', 'Автобус', 1929], ['k3', 'Больница Генри Форда', 1932], ['k4', 'Раненый олень', 1946], ['k0', 'В бархатном платье', 1926], ['k6', 'Посвящение Троцкому', 1937], ['k7', 'Диего и я', 1949], ['k8', 'Корни', 1943], ['k5', 'Фрида и Диего Ривера', 1931], ['k9', 'Время летит', 1929]];
        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1], [0, 1], [0, -1]];
        const zoomOut = 1.0 + 0.05 * k(22.5, 24.9, (x) => x);
        return (
          <div style={{position: 'absolute', inset: 0, zIndex: 52, background: '#2A2433', overflow: 'hidden', opacity: 1 - k(24.6, 24.9)}}>
            <div style={{position: 'absolute', inset: 0, transform: `scale(${zoomOut})`, transformOrigin: '50% 50%'}}>
              {items.map(([key, name, yr], i) => {
                const col = i % 2, row = Math.floor(i / 2);
                const at = 22.55 + i * 0.1;
                const q = easeOut(Math.min(1, Math.max(0, (t - at) / 0.35)));
                const [dx, dy] = dirs[i];
                return (
                  <div key={key} style={{position: 'absolute', left: col * 540 + 3, top: row * 384 + 3, width: 534, height: 378, overflow: 'hidden', transform: `translate(${dx * (1 - q) * 700}px, ${dy * (1 - q) * 700}px) scale(${0.7 + 0.3 * q})`, opacity: Math.min(1, q * 2.5), boxShadow: '0 0 30px rgba(0,0,0,0.5)'}}>
                    <Img src={img(key + '.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%', transform: `scale(${1.04 + 0.1 * Math.min(1, (t - at) / 2)})`}} />
                    <div style={{position: 'absolute', left: 14, bottom: 14, padding: '6px 16px', borderRadius: 20, background: 'rgba(255,255,255,0.93)', fontFamily: SANS, fontWeight: 700, fontSize: 22, color: INK, opacity: Math.min(1, Math.max(0, (t - at - 0.3) / 0.25))}}>{name}, {yr}</div>
                  </div>
                );
              })}
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 380, background: 'linear-gradient(180deg, rgba(20,14,30,0.8) 0%, rgba(20,14,30,0))', zIndex: 5}} />
          </div>
        );
      })()}

      {/* повязки гипса: D -> E */}
      {t >= 15.65 && t < 17.0 && Array.from({length: 6}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: -200, top: i * 340 - 120, width: 1500, height: 360, zIndex: 60, transform: `rotate(-8deg) translateX(${-1500 + wrapIn(i) * 1500 + wrapOut(i) * 1600}px)`, background: 'repeating-linear-gradient(90deg,#FBFAF6 0px,#F1EEE6 30px,#FBFAF6 60px)', boxShadow: '0 10px 30px rgba(60,50,40,0.35)', borderTop: '6px solid #E4DFD2', borderBottom: '6px solid #E4DFD2'}} />
      ))}

      {/* F. финал: зеркало-портал с автопортретом на весь экран */}
      {t >= 24.3 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 50, background: BG, clipPath: `circle(${irisF * 2100}px at 540px 960px)`}}>
          <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
            <Img src={img('velvet.jpg')} style={{position: 'absolute', maxWidth: 'none', width: 1080, height: 1456, left: 0, top: -90, transformOrigin: '50% 40%', transform: `scale(${1.15 + 0.12 * k(24.3, 27.2, (x) => x)})`, filter: 'blur(1.5px)'}} />
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(252,245,242,0.74) 0%, rgba(250,244,246,0.5) 50%, rgba(240,238,248,0.66) 100%)'}} />
          </div>
          <div style={{position: 'absolute', left: 0, width: 1080, top: 345, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 110, color: INK, lineHeight: 1.05, opacity: endIn, transform: `translateY(${(1 - endIn) * 60}px)`}}>Зеркало<br />её спасло?</div>
          {[['Да, спасло', 640, 0], ['Не только оно', 780, 1]].map(([txt, top, i]) => {
            const pr = spring({frame: f - Math.round((25.1 + i * 0.15) * fps), fps, config: {damping: 14, stiffness: 160}});
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
      {t >= 24.3 && t < 25.2 && <div style={{position: 'absolute', left: 540 - irisF * 2100, top: 960 - irisF * 2100, width: irisF * 4200, height: irisF * 4200, borderRadius: '50%', border: '26px solid #E9C86A', zIndex: 55, boxSizing: 'border-box', opacity: 1 - k(24.8, 25.2), boxShadow: '0 0 60px rgba(233,200,106,0.8)'}} />}

      <Dog t={t} f={f} />
      <div style={{position: 'absolute', left: 60, top: 1622, padding: '12px 26px', borderRadius: 30, background: 'rgba(255,255,255,0.94)', boxShadow: '0 10px 26px rgba(80,50,90,0.18)', fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: INK, zIndex: 95}}>{script.diagram.title}</div>
      <CaptionsAnim light={t < 2.4 || (t >= 22.5 && t < 24.9)} />
    </AbsoluteFill>
  );
};
