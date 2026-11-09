
const Vclip = ({file, from, frames}) => (
  <Sequence from={from} durationInFrames={frames}><OffthreadVideo src={staticFile('n30/vid/' + file)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} /></Sequence>
);
const TopVeil = () => <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 700, background: 'linear-gradient(180deg, rgba(10,12,34,0.62) 0%, rgba(10,12,34,0.28) 55%, rgba(10,12,34,0))', zIndex: 4, pointerEvents: 'none'}} />;
const GOLDC = 'rgba(246,222,151,0.98)';
const Sheet = ({w = 1300, h = 640}) => (
  <div style={{width: w, height: h, background: 'repeating-linear-gradient(0deg,#FBF6EA 0px,#FBF6EA 38px,#EAE2CE 40px)', boxShadow: '0 20px 50px rgba(30,20,10,0.5)', position: 'relative'}}>
    <svg width={w} height={h} viewBox="0 0 400 200" preserveAspectRatio="none" style={{position: 'absolute', inset: 0}}><path d="M280 150 q10 -50 25 -10 t25 -5 q8 -30 25 0" fill="none" stroke="#2A2A5A" strokeWidth="2.5" strokeLinecap="round" /></svg>
  </div>
);

export const Board30Main = () => {
  useFonts();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const k = (a, b, ease = easeIO) => interpolate(t, [a, b], [0, 1], {...clamp, easing: ease});
  const cam = camAt(t);
  const endIn = k(21.7, 22.2, easeOut);

  const hookZoom = easeIn3(k(1.1, 2.4, easeIO));
  const sheetQ = (i) => easeIO(Math.min(1, Math.max(0, (t - 6.3 - i * 0.07) / 0.55)));
  const darkB = k(12.3, 12.9) * 0.6;
  const zoomB = 1 + 0.14 * k(12.3, 15.9, (x) => x);
  const blindQ = (i) => easeIO(Math.min(1, Math.max(0, (t - 15.4 - i * 0.03) / 0.35)));
  const flipOutC = easeIO(k(19.0, 19.25)), flipInD = easeIO(k(19.2, 19.45));
  const irisF = easeOut(k(21.3, 21.95));
  const n40 = Math.round(40000 * easeOut(k(13.7, 14.6)));
  const n60 = Math.round(60000 * easeOut(k(14.5, 15.4)));
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return (
    <AbsoluteFill style={{background: '#1b1530'}}>
      {['dali65.jpg', 'pm.jpg', 'sign.jpg', 'p_open.png'].map((n) => <Img key={n} src={img(n)} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />)}

      {/* ХУК: собака подписывает пустой лист, зум в подпись */}
      {t < 2.4 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 15, overflow: 'hidden', background: '#2b2036'}}>
          <div style={{position: 'absolute', inset: 0, transformOrigin: '52% 58%', transform: `scale(${1 + 3.0 * hookZoom})`, filter: hookZoom > 0.05 ? `blur(${hookZoom * 3}px)` : undefined}}>
            <Vclip file="h.mp4" from={0} frames={73} />
          </div>
          <TopVeil />
        </div>
      )}

      <div style={{position: 'absolute', inset: 0, transform: `translate(${cam.px}px, ${cam.py}px) rotate(${cam.rot}deg) scale(${cam.z})`, transformOrigin: '50% 50%', filter: cam.blur > 0.4 ? `blur(${cam.blur}px)` : undefined}}>
        {/* A. Сальвадор Дали, 60-е и 70-е */}
        {t >= 2.4 && t < 7.0 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 16, overflow: 'hidden', background: '#2b2036'}}>
            <Vclip file="a.mp4" from={72} frames={166} />
            <TopVeil />
            {['САЛЬВАДОР', 'ДАЛИ'].map((w, li) => (
              <div key={li} style={{position: 'absolute', left: 0, width: 1080, top: 360 + li * 190, textAlign: 'center', whiteSpace: 'nowrap', zIndex: 30}}>
                {w.split('').map((ch, i) => { const at = 4.1 + li * 0.5 + i * 0.06; const sp = spring({frame: f - Math.round(at * fps), fps, config: {damping: 8, stiffness: 170}}); return <span key={i} style={{display: 'inline-block', fontFamily: SERIF, fontWeight: 700, fontSize: li ? 210 : 150, color: li ? '#F6DE97' : '#fff', opacity: t >= at ? 1 : 0, transform: `translateY(${(1 - sp) * -600}px) rotate(${(1 - sp) * (i % 2 ? 30 : -30)}deg)`, textShadow: '0 8px 30px rgba(10,12,40,0.8)'}}>{ch}</span>; })}
              </div>
            ))}
            <Card x={590} y={1010} w={400} h={520} at={4.6} t={t} r={10} rot={5} pad={7} bg="#fff" from="right" z={35}><Pic src="dali65.jpg" pos="50% 25%" /></Card>
            <Chip txt="1960-е · 1970-е" at={5.4} t={t} x={70} y={880} size={36} bg={GOLDC} rot={-3} z={40} />
          </div>
        )}

        {/* B. тысячи подписанных пустых листов */}
        {t >= 6.4 && t < 16.0 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 17, overflow: 'hidden', background: '#2b2036', opacity: t >= 6.75 ? 1 : 0}}>
            <div style={{position: 'absolute', inset: 0, transformOrigin: '50% 60%', transform: `scale(${zoomB})`}}>
              <Vclip file="b.mp4" from={192} frames={285} />
            </div>
            <TopVeil />
            <div style={{position: 'absolute', inset: 0, background: `rgba(18,12,40,${darkB})`, zIndex: 10}} />
            <Chip txt="литографии" at={6.95} t={t} x={70} y={480} size={36} bg={GOLDC} rot={-3} z={40} />
            <Chip txt="подписанные листы" at={7.9} t={t} x={70} y={580} size={34} z={40} bg="rgba(20,24,56,0.78)" color="#fff" />
            {t >= 10.75 && (() => { const q = easeOut(Math.min(1, Math.max(0, (t - 10.75) / 0.5))); const w = easeIO(Math.min(1, Math.max(0, (t - 10.9) / 0.9))); return <div style={{position: 'absolute', left: 150, top: 1250, width: 780, height: 300, background: '#fff', padding: 8, borderRadius: 8, boxShadow: '0 24px 50px rgba(0,0,0,0.55)', transform: `rotate(${-4 + (1 - q) * 10}deg) scale(${0.7 + 0.3 * q})`, opacity: Math.min(1, q * 2), zIndex: 38, overflow: 'hidden', clipPath: `inset(0 ${(1 - w) * 100}% 0 0)`}}><Img src={img('sign.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>; })()}
            <Chip txt="подлинная подпись Дали, 1948" at={11.2} t={t} x={150} y={1190} size={26} bg={GOLDC} rot={-3} z={40} />
            <Chip txt="тысячи пустых" at={11.4} t={t} x={600} y={1130} size={34} bg={GOLDC} rot={3} z={40} />
            {t >= 12.4 && (
              <div style={{position: 'absolute', inset: 0, zIndex: 20, opacity: k(12.5, 13.0)}}>
                <Chip txt="по оценкам" at={12.6} t={t} x={70} y={560} size={34} bg={GOLDC} rot={-3} z={40} />
                <div style={{position: 'absolute', left: 0, width: 1080, top: 680, textAlign: 'center', fontFamily: SERIF, fontWeight: 700, lineHeight: 1}}>
                  <div style={{fontSize: 54, color: '#fff', fontStyle: 'italic', opacity: k(13.6, 13.9)}}>от</div>
                  <div style={{fontSize: 190, color: '#fff', textShadow: '0 0 40px rgba(255,255,255,0.35)'}}>{fmt(n40)}</div>
                  <div style={{fontSize: 54, color: '#F6DE97', fontStyle: 'italic', marginTop: 10, opacity: k(14.4, 14.7)}}>до</div>
                  <div style={{fontSize: 190, color: '#F6DE97', textShadow: '0 0 40px rgba(246,222,151,0.5)'}}>{fmt(n60)}</div>
                  <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 36, color: '#fff', letterSpacing: 2, marginTop: 26, opacity: k(15.0, 15.4)}}>листов дошли до рынка</div>
                </div>
                {Array.from({length: 16}).map((_, i) => { const at = 12.7 + i * 0.12; const q = Math.max(0, t - at); return t >= at ? <div key={i} style={{position: 'absolute', left: 40 + (i * 137) % 940, top: -120 + q * 520, width: 90, height: 120, background: '#FBF6EA', opacity: 0.65, transform: `rotate(${(i * 53) % 60 - 30 + q * 80}deg)`, boxShadow: '0 8px 16px rgba(0,0,0,0.35)', zIndex: 6}} /> : null; })}
              </div>
            )}
          </div>
        )}

        {/* C. печать: кто угодно мог напечатать (жалюзи) */}
        {t >= 15.4 && t < 19.3 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 18, overflow: 'hidden', background: '#2b2036', clipPath: t < 15.95 ? 'url(#blindC)' : 'none', transform: t >= 19.0 ? `perspective(1800px) rotateY(${-90 * flipOutC}deg)` : undefined}}>
            <svg width="0" height="0" style={{position: 'absolute'}}><clipPath id="blindC">{Array.from({length: 12}).map((_, i) => <rect key={i} x="0" y={i * 160} width="1080" height={blindQ(i) * 161} />)}</clipPath></svg>
            <Vclip file="c.mp4" from={462} frames={154} />
            <TopVeil />
            <Chip txt="печатай что угодно" at={16.7} t={t} x={70} y={480} size={36} bg={GOLDC} rot={-3} z={40} />
            {[[17.2, 600, 900, -8], [17.5, 140, 1180, 6], [17.8, 560, 1300, -4]].map(([at, x, y, r], i) => <SolidStamp key={i} txt="КОПИЯ" at={at} t={t} x={x} y={y} rot={r} size={50} />)}
            <Chip txt="оценка экспертов" at={18.5} t={t} x={560} y={560} size={30} bg="rgba(20,24,56,0.78)" color="#fff" z={40} rot={3} />
          </div>
        )}

        {/* D. сомнительные «Дали» (переворот) */}
        {t >= 19.15 && t < 22.0 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 19, overflow: 'hidden', background: '#2b2036', transform: `perspective(1800px) rotateY(${90 * (1 - flipInD)}deg)`}}>
            <Vclip file="d.mp4" from={570} frames={133} />
            <TopVeil />
            <div style={{position: 'absolute', left: 0, width: 1080, top: 380, textAlign: 'center', zIndex: 30}}><Kin txt="сомнительных" at={19.4} t={t} size={100} italic color="#fff" /></div>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 520, textAlign: 'center', zIndex: 30}}><Kin txt="«Дали»?" at={19.96} t={t} size={170} italic color="#F6DE97" /></div>
            <SolidStamp txt="ОЧЕНЬ МНОГО" at={20.5} t={t} x={90} y={1320} rot={-5} size={64} />
          </div>
        )}
      </div>

      {/* листы-переход A -> B */}
      {t >= 6.25 && t < 7.4 && Array.from({length: 9}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: 1300 - sheetQ(i) * 2800, top: (i * 233) % 1400 - 60, zIndex: 60, transform: `rotate(${((i * 37) % 24) - 12}deg)`}}><Sheet /></div>
      ))}

      {/* F. финал: портал, вопрос и комментарии */}
      {t >= 21.3 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 50, background: '#1B1530', clipPath: `circle(${irisF * 2100}px at 540px 960px)`}}>
          <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
            <Img src={img('pm.jpg')} style={{position: 'absolute', maxWidth: 'none', width: 2659, height: 1920, left: -470 - 90 * k(21.3, 24.1, (x) => x), top: 0, transformOrigin: '1000px 50%', transform: `scale(${1.04 + 0.1 * k(21.3, 24.1, (x) => x)})`, filter: 'blur(0.8px)'}} />
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(14,10,30,0.7) 0%, rgba(14,10,30,0.42) 45%, rgba(14,10,30,0.64) 100%)'}} />
          </div>
          <div style={{position: 'absolute', left: 40, width: 1000, top: 345, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 96, color: '#fff', lineHeight: 1.08, opacity: endIn, transform: `translateY(${(1 - endIn) * 60}px)`, textShadow: '0 6px 30px rgba(0,0,0,0.6)'}}>Какую картину<br />разобрать<br />в следующем месяце?</div>
          <div style={{position: 'absolute', left: 0, width: 1080, top: 760, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 36, letterSpacing: 3, color: '#F6DE97', opacity: k(22.0, 22.4)}}>ПИШИТЕ В КОММЕНТАРИЯХ</div>
          <div style={{position: 'absolute', left: 0, width: 1080, textAlign: 'center', top: 700, fontFamily: SANS, fontWeight: 700, fontSize: 22, color: 'rgba(255,255,255,0.85)', opacity: k(22.0, 22.5), textShadow: '0 2px 10px rgba(0,0,0,0.7)'}}>Сальвадор Дали, «Постоянство памяти», 1931 (миниатюра)</div>
          {['Девятый вал', 'Бал-маскарад', 'Утро в сосновом лесу'].map((txt, i) => {
            const at = 22.2 + i * 0.4; const pr = spring({frame: f - Math.round(at * fps), fps, config: {damping: 13, stiffness: 170}});
            return <div key={i} style={{position: 'absolute', left: 120 + (i % 2) * 90, top: 880 + i * 105, padding: '14px 30px', borderRadius: 40, background: 'rgba(255,255,255,0.16)', border: '2px solid rgba(255,255,255,0.5)', color: '#fff', fontFamily: SANS, fontWeight: 600, fontSize: 36, boxShadow: '0 14px 30px rgba(0,0,0,0.3)', transform: `scale(${Math.min(1.04, pr)})`, opacity: Math.min(1, pr * 2), display: 'flex', alignItems: 'center', gap: 14}}><span style={{color: '#F28BB0', fontSize: 34}}>♥</span>{txt}</div>;
          })}
        </div>
      )}
      {t >= 21.3 && t < 22.2 && <div style={{position: 'absolute', left: 540 - irisF * 2100, top: 960 - irisF * 2100, width: irisF * 4200, height: irisF * 4200, borderRadius: '50%', border: '26px solid #E9C86A', zIndex: 55, boxSizing: 'border-box', opacity: 1 - k(21.8, 22.2), boxShadow: '0 0 60px rgba(233,200,106,0.8)'}} />}

      <Dog t={t} f={f} />
      <div style={{position: 'absolute', left: 60, top: 1622, padding: '12px 26px', borderRadius: 30, background: 'rgba(20,24,56,0.6)', border: '1px solid rgba(255,255,255,0.35)', fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: '#fff', zIndex: 95}}>{script.diagram.title}</div>
      <CaptionsAnim light={true} />
    </AbsoluteFill>
  );
};
