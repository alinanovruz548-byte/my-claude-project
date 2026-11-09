const CAM_STARTS = [2.5, 5.0, 7.8, 10.5, 14.0, 15.8, 19.7];
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
const Stamp = ({txt, at, t, x, y, rot = -8, color = '#8E3556', size = 64}) => {
  if (t < at) return null;
  const q = Math.min(1, (t - at) / 0.28);
  const e = easeOut(q);
  return (
    <div style={{position: 'absolute', left: x, top: y, padding: '8px 30px', border: `7px double ${color}`, borderRadius: 14, color, fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: 6, opacity: 0.92 * Math.min(1, q * 3), transform: `rotate(${rot}deg) scale(${2.3 - 1.3 * e})`, zIndex: 40, mixBlendMode: 'multiply', whiteSpace: 'nowrap'}}>{txt}</div>
  );
};
const diag = (t, s, dur) => {
  const q = easeIO(Math.min(1, Math.max(0, (t - s) / dur)));
  const X = q * 1700;
  if (t < s) return ['polygon(0 0, 0 0, 0 0)', 'polygon(0 0, 0 0, 0 0)'];
  return [`polygon(1080px 0px, ${1080 - X}px 0px, ${1080 - X + 600}px 1920px, 1080px 1920px)`, `polygon(1080px 0px, ${1080 - X - 90}px 0px, ${1080 - X + 510}px 1920px, 1080px 1920px)`];
};
const Tiles = ({t, T}) => {
  if (t < T - 0.6 || t > T + 0.7) return null;
  const out = [];
  for (let r = 0; r < 11; r++) for (let c = 0; c < 6; c++) {
    const d = hash(r * 7 + c) * 0.25;
    const a = Math.min(1, Math.max(0, (t - (T - 0.5 + d)) / 0.25));
    const b = Math.min(1, Math.max(0, (t - (T + 0.05 + d)) / 0.25));
    const s = easeOut(a) * (1 - easeIO(b));
    if (s <= 0.01) continue;
    out.push(<div key={r * 6 + c} style={{position: 'absolute', left: c * 180, top: r * 175 - 2, width: 182, height: 177, background: (r + c) % 2 ? '#1E1B22' : '#F7F2EA', transform: `scale(${s}) rotate(${(1 - s) * 90}deg)`, boxShadow: 'inset 0 0 0 4px rgba(120,120,120,0.35)'}} />);
  }
  return <div style={{position: 'absolute', inset: 0, zIndex: 45, pointerEvents: 'none'}}>{out}</div>;
};
// схематичные «слои» под квадратом (иллюстрации, не реконструкция)
const CuboArt = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 400 400" style={{display: 'block'}}>
    <rect width="400" height="400" fill="#EDE1CC" />
    <g stroke="#1E1B22" strokeWidth="5" strokeLinejoin="round">
      <polygon points="20,60 190,20 230,170 60,200" fill="#D94F3A" />
      <polygon points="190,20 380,70 330,200 230,170" fill="#2E5CA8" />
      <polygon points="60,200 230,170 270,330 90,380" fill="#F2C14E" />
      <polygon points="230,170 330,200 380,360 270,330" fill="#3E8E6C" />
      <polygon points="120,110 200,95 215,160 140,175" fill="#EDE1CC" />
      <circle cx="300" cy="120" r="34" fill="#D94F3A" />
      <path d="M60 260 L140 240 L130 320 Z" fill="#2E5CA8" />
    </g>
  </svg>
);
const SupreArt = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 400 400" style={{display: 'block'}}>
    <rect width="400" height="400" fill="#F4EEE2" />
    <g stroke="#1E1B22" strokeWidth="4">
      <rect x="40" y="60" width="190" height="60" fill="#D94F3A" transform="rotate(-18 135 90)" />
      <rect x="180" y="170" width="150" height="150" fill="#2E5CA8" transform="rotate(12 255 245)" />
      <circle cx="90" cy="270" r="50" fill="#F2C14E" />
      <rect x="250" y="40" width="100" height="30" fill="#1E1B22" transform="rotate(25 300 55)" />
      <polygon points="110,330 190,300 200,360 120,380" fill="#3E8E6C" />
    </g>
  </svg>
);
const Sq = ({x, y, w, at, t, rot = 0, z = 20, children, bg = '#fff', pad = 14, r = 10}) => (
  <Card x={x} y={y} w={w} h={w} at={at} t={t} r={r} pad={pad} bg={bg} rot={rot} z={z}>{children}</Card>
);

export const Board21Main = () => {
  useFonts();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const k = (a, b, ease = easeIO) => interpolate(t, [a, b], [0, 1], {...clamp, easing: ease});
  const cam = camAt(t);
  const tapAt = 21.9, tap2At = 22.5;
  const endIn = k(19.7, 20.3, easeOut);
  const cur = t < tapAt ? 0 : t < tap2At ? 1 : 2;
  const curX = interpolate(t, [20.9, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [880, 560, 560, 600], clamp);
  const curY = interpolate(t, [20.9, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [1500, 770, 780, 910], clamp);

  // переходы
  const wipeQ = easeIO(k(2.3, 2.95));
  const flipOut = k(4.55, 5.0, (x) => x * x);
  const flipIn = k(5.0, 5.5, easeOut);
  const irisD = `circle(${easeOut(k(7.8, 8.5)) * 1800}px at 540px 900px)`;
  const [clipE, bandE] = diag(t, 10.3, 0.65);
  const shQ = (i) => easeIO(Math.min(1, Math.max(0, (t - 15.6 - i * 0.04) / 0.4)));
  const irisH = `circle(${easeOut(k(19.7, 20.4)) * 2300}px at 540px 1500px)`;

  // хук: чёрный квадрат рассыпается на осколки и открывает слой под ним
  const shardP = k(1.6, 2.5, easeIn3);
  const scanY = interpolate(t, [5.4, 6.9], [0, 640], clamp);
  const peel = easeIO(k(8.5, 9.1));

  return (
    <AbsoluteFill style={{background: BG}}>
      {['square.jpg', 'p_shh.png', 'p_lab.png', 'p_black.png', 'p_judge.png', 'p_scared.png', 'p_open.png'].map((n) => <Img key={n} src={img(n)} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />)}

      {/* A. ХУК */}
      {t < 3.4 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 15, overflow: 'hidden', background: '#F4EEE2'}}>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1.1 + shardP * 0.1})`}}><CuboArt size={1400} /></div>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: k(1.9, 2.4) * 0.8, transform: `rotate(${shardP * 10}deg) scale(1.15)`}}><SupreArt size={1000} /></div>
          {t < 2.6 && Array.from({length: 11}).map((_, r) => Array.from({length: 6}).map((__, c) => {
            const d = hash(r * 6 + c) * 0.6;
            const q = Math.min(1, Math.max(0, (shardP * 1.6 - d) / 0.9));
            return <div key={r * 6 + c} style={{position: 'absolute', left: c * 180, top: r * 175, width: 182, height: 177, background: '#14121A', opacity: 1 - q, transform: `translate(${(hash(r + c * 3) - 0.5) * 240 * q}px, ${q * q * 1400}px) rotate(${(hash(c + r * 2) - 0.5) * 240 * q}deg)`, boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.05)'}} />;
          }))}
          {t < 2.0 && (() => {
            const pb = easeIO(k(1.15, 1.7));
            return <div style={{position: 'absolute', inset: 0, zIndex: 6, opacity: 1 - k(1.65, 1.95), transformOrigin: '540px 960px', transform: `translate(${350 * pb}px, ${390 * pb}px) scale(${1 - 0.64 * pb})`, filter: `blur(${Math.sin(pb * Math.PI) * 5}px)`}}><Img src={staticFile('n21/hook/f_' + String(Math.min(35, Math.floor(t * 30) + 1)).padStart(4, '0') + '.png')} style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920}} /></div>;
          })()}
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 330, background: 'linear-gradient(180deg, rgba(252,245,242,0.97) 0%, rgba(252,245,242,0.9) 55%, rgba(252,245,242,0))', zIndex: 5}} />
          <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: t > 1.7 && t < 1.85 ? 0.6 : 0}} />
        </div>
      )}

      <div style={{position: 'absolute', inset: 0, transform: `translate(${cam.px}px, ${cam.py}px) rotate(${cam.rot}deg) scale(${cam.z})`, transformOrigin: '50% 50%', filter: cam.blur > 0.4 ? `blur(${cam.blur}px)` : undefined}}>
        {/* B. 1915 (вайп вверх) */}
        {t >= 2.3 && t < 5.05 && (
          <>
            <div style={{position: 'absolute', inset: 0, zIndex: 15.5, background: '#1E1B22', clipPath: `inset(${(1 - Math.min(1, wipeQ + 0.07)) * 100}% 0 0 0)`}} />
            <div style={{position: 'absolute', inset: 0, zIndex: 16, background: BG, clipPath: `inset(${(1 - wipeQ) * 100}% 0 0 0)`, transform: `perspective(1600px) rotateY(${flipOut * 90}deg)`, transformOrigin: '0% 50%'}}>
              <div style={{position: 'absolute', left: 0, width: 1080, top: 320, textAlign: 'center'}}><Kin txt="1915" at={3.5} t={t} size={170} weight={300} /></div>
              <Sq x={220} y={520} w={640} at={2.9} t={t} rot={-3}><div style={{width: '100%', height: '100%', overflow: 'hidden'}}><Paint src="square.jpg" t={t} at={2.9} pos="50% 50%" zoomFrom={1.0} zoomTo={1.1} dur={2.5} /></div></Sq>
              <Chip txt="Казимир Малевич" at={3.6} t={t} x={110} y={1200} size={30} />
            </div>
          </>
        )}

        {/* C. 2015, рентген (переворот) */}
        {t >= 5.0 && t < 8.0 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 17, background: BG, transform: `perspective(1600px) rotateY(${(1 - flipIn) * -90}deg)`, transformOrigin: '100% 50%'}}>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 320, textAlign: 'center'}}><Kin txt="2015" at={5.2} t={t} size={170} weight={300} /></div>
            <Sq x={220} y={520} w={640} at={5.2} t={t} rot={2}>
              <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden'}}>
                <Paint src="square.jpg" t={t} at={5.2} pos="50% 50%" zoomFrom={1.0} zoomTo={1.0} dur={1} />
                <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: scanY, overflow: 'hidden'}}>
                  <div style={{position: 'absolute', left: 0, top: 0, width: 612, height: 612, filter: 'brightness(0.45) saturate(0.4) hue-rotate(190deg) contrast(1.2)'}}><Paint src="square.jpg" t={t} at={5.2} pos="50% 50%" zoomFrom={1.0} zoomTo={1.0} dur={1} /></div>
                  <div style={{position: 'absolute', left: 85, top: 86, width: 442, height: 447, opacity: 0.92}}><CuboArt size={442} /></div>
                  <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(120,220,255,0.18) 0 3px, rgba(0,0,0,0) 3px 8px)'}} />
                </div>
                <div style={{position: 'absolute', left: 0, right: 0, top: scanY - 5, height: 10, background: '#6FE3FF', boxShadow: '0 0 28px 10px rgba(111,227,255,0.85)', opacity: t > 5.4 && t < 7.0 ? 1 : 0}} />
              </div>
            </Sq>
            {t > 5.2 && t < 7.7 && (() => {
              const yl = 534 + scanY;
              const inn = easeOut(k(5.2, 5.6)) * (1 - easeIn3(k(7.0, 7.5)));
              const dx = (1 - inn) * 420;
              return (
                <svg width="1080" height="1920" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', zIndex: 30, pointerEvents: 'none'}}>
                  <polygon points={`${815 + dx},${yl} 232,${yl - 7} 232,${yl + 7}`} fill="rgba(111,227,255,0.35)" opacity={t > 5.4 && t < 7.0 ? 1 : 0} />
                  <g transform={`translate(${dx} ${yl - 70})`} stroke={INK} strokeWidth="5" strokeLinejoin="round">
                    <rect x="1000" y="10" width="300" height="110" fill="#fff" />
                    <rect x="1000" y="2" width="36" height="126" fill={ROSE} />
                    <rect x="820" y="30" width="190" height="72" rx="30" fill="#F2C09B" />
                    <rect x="770" y="26" width="120" height="84" rx="16" fill="#C9CDD6" />
                    <rect x="770" y="40" width="26" height="56" rx="8" fill="#6FE3FF" />
                    <circle cx="783" cy="68" r="7" fill="#fff" />
                    <rect x="830" y="104" width="70" height="40" rx="14" fill="#F2C09B" />
                  </g>
                </svg>
              );
            })()}
            <Chip txt="Третьяковка · рентген" at={5.7} t={t} x={520} y={1200} size={28} bg="rgba(200,245,255,0.98)" />
          </div>
        )}

        {/* D. два более ранних рисунка (круг) */}
        {t >= 7.8 && t < 10.8 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 18, background: BG, clipPath: irisD}}>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 320, textAlign: 'center'}}><Kin txt="×2" at={8.9} t={t} size={190} weight={300} color={ROSE} /></div>
            <Sq x={110} y={640} w={440} at={8.2} t={t} rot={-6} z={21} pad={10}><CuboArt size={420} /></Sq>
            <Sq x={500} y={700} w={440} at={8.4} t={t} rot={5} z={22} pad={10}><SupreArt size={420} /></Sq>
            <div style={{position: 'absolute', left: 190, top: 560, width: 560, height: 560, transform: `translate(${-420 * peel}px, ${-980 * peel}px) rotate(${-24 * peel}deg)`, zIndex: 25}}>
              <Card x={0} y={0} w={560} h={560} at={7.9} t={t} r={10} pad={14} bg="#fff"><div style={{width: '100%', height: '100%', overflow: 'hidden'}}><Paint src="square.jpg" t={t} at={7.9} pos="50% 50%" zoomFrom={1.0} zoomTo={1.0} dur={1} /></div></Card>
            </div>
            <Chip txt="кубофутуризм" at={9.3} t={t} x={110} y={1130} size={26} />
            <Chip txt="протосупрематизм" at={9.7} t={t} x={110} y={1190} size={26} bg="rgba(255,236,170,0.98)" />
            <Chip txt="схематично" at={9.9} t={t} x={110} y={1250} size={22} bg="rgba(230,225,238,0.98)" />
          </div>
        )}

        {/* E. карандашная надпись (косой вайп) */}
        {t >= 10.3 && t < 14.4 && (
          <>
            <div style={{position: 'absolute', inset: 0, zIndex: 18.5, background: '#1E1B22', clipPath: bandE}} />
            <div style={{position: 'absolute', inset: 0, zIndex: 19, background: BG, clipPath: clipE, transform: `perspective(1600px) rotateY(${0}deg)`}}>
              <Sq x={90} y={440} w={520} at={10.6} t={t} rot={-3}><div style={{width: '100%', height: '100%', overflow: 'hidden'}}><Paint src="square.jpg" t={t} at={10.6} pos="50% 50%" zoomFrom={1.0} zoomTo={1.06} dur={3} /></div></Sq>
              <Card x={450} y={620} w={540} h={390} at={11.5} t={t} r={22} rot={3} from="right" pad={0}>
                <div style={{padding: '30px 38px'}}>
                  <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 22, letterSpacing: 6, color: ROSE}}>КАРАНДАШОМ</div>
                  <div style={{marginTop: 22, fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 62, lineHeight: 1.12, color: '#5B5662', clipPath: `inset(0 ${(1 - k(11.8, 13.4, easeOut)) * 100}% 0 0)`}}>«Битва негров в тёмной пещере»</div>
                </div>
              </Card>
              <Chip txt="так Алле назвал чёрный прямоугольник, 1882" at={12.9} t={t} x={90} y={1100} size={26} bg="rgba(255,236,170,0.98)" />
              <Chip txt="надпись под краской" at={12.0} t={t} x={560} y={1040} size={26} />
            </div>
          </>
        )}

        {/* F. спорят (плитки) */}
        {t >= 14.0 && t < 16.1 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 20, background: BG}}>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 330, textAlign: 'center'}}><Kin txt="?" at={14.2} t={t} size={400} weight={300} color={ROSE} /></div>
            <Chip txt="Малевич?" at={14.5} t={t} x={100} y={880} size={42} />
            <Chip txt="шутник?" at={14.9} t={t} x={560} y={880} size={42} bg="rgba(255,236,170,0.98)" />
            <Stamp txt="СПОРНО" at={15.0} t={t} x={300} y={1010} rot={-8} size={74} />
          </div>
        )}

        {/* G. не идеальный квадрат (жалюзи) */}
        {t >= 15.6 && t < 20.2 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 21, background: BG, clipPath: 'url(#shutH)', opacity: 1 - k(19.7, 20.2)}}>
            <svg width="0" height="0" style={{position: 'absolute'}}><clipPath id="shutH">{Array.from({length: 8}).map((_, i) => <rect key={i} x={0} y={i * 241} width={t < 16.3 ? shQ(i) * 1080 : 1080} height={242} />)}</clipPath></svg>
            <Sq x={170} y={420} w={740} at={16.0} t={t} rot={0}>
              <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden'}}>
                <div style={{position: 'absolute', inset: 0, transformOrigin: '86% 15%', transform: `scale(${1 + 2.8 * easeIO(k(16.9, 17.4)) * (1 - easeIO(k(18.0, 18.4)))})`}}>
                  <Paint src="square.jpg" t={t} at={16.0} pos="50% 50%" zoomFrom={1.0} zoomTo={1.0} dur={1} />
                  <svg width="100%" height="100%" viewBox="0 0 712 712" style={{position: 'absolute', inset: 0}}>
                    <g style={{opacity: k(16.4, 16.9)}}>
                      <path d="M0 101.5 H712 M611.7 0 V712 M100.7 0 V712 M0 616.2 H712" stroke={ROSE} strokeWidth="2.2" strokeDasharray="12 9" fill="none" />
                    </g>
                    <polygon points="100.7,101.5 611.7,104.8 609.6,616.2 102.8,618.4" fill="none" stroke="#F2C14E" strokeWidth="1.6" style={{opacity: k(17.0, 17.4)}} />
                    {[[100.7, 101.5], [611.7, 104.8], [609.6, 616.2], [102.8, 618.4]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill="#F2C14E" stroke={INK} strokeWidth="1" style={{opacity: k(17.1, 17.4)}} />)}
                  </svg>
                </div>
              </div>
            </Sq>
            <Chip txt="линейка" at={16.5} t={t} x={110} y={1160} size={26} bg="rgba(255,225,235,0.98)" />
            <Chip txt="сторона «гуляет»" at={17.3} t={t} x={110} y={1220} size={26} />
            {t >= 18.4 && (
              <div style={{position: 'absolute', left: 560, top: 780, width: 420, height: 420, borderRadius: '50%', border: '14px solid #3A3542', overflow: 'hidden', boxShadow: '0 30px 60px rgba(40,30,50,0.4)', transform: `scale(${easeOut(k(18.4, 18.9))}) rotate(${(1 - k(18.4, 18.9)) * 40}deg)`, zIndex: 30, background: '#fff'}}>
                <Paint src="square.jpg" t={t} at={18.1} pos="22% 24%" zoomFrom={3.2} zoomTo={4.0} dur={2} />
                {Array.from({length: 26}).map((_, i) => <div key={i} style={{position: 'absolute', left: 20 + hash(i) * 380, top: 20 + hash(i + 9) * 380, width: 12 + hash(i + 4) * 12, height: 6, borderRadius: 4, background: ['#D94F3A', '#2E5CA8', '#F2C14E', '#3E8E6C'][i % 4], opacity: k(18.7 + hash(i) * 0.5, 19.0 + hash(i) * 0.5) * (0.7 + 0.3 * Math.sin(t * 6 + i)), transform: `rotate(${hash(i + 2) * 180}deg)`}} />)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* H. финал */}
      {t >= 19.7 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 50, background: BG, clipPath: irisH}}>
          <div style={{position: 'absolute', left: 0, width: 1080, top: 345, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 100, color: INK, lineHeight: 1.05, opacity: endIn}}>Простота<br />или шутка?</div>
          {[['Великая простота', 640, 0], ['Хитрая шутка', 780, 1]].map(([txt, top, i]) => {
            const pr = spring({frame: f - Math.round((20.5 + i * 0.15) * fps), fps, config: {damping: 14, stiffness: 160}});
            const glow = i === 1 && t >= tap2At;
            const act = cur === i + 1 || glow;
            return (
              <div key={i} style={{position: 'absolute', left: 170, top, width: 740, height: 110, borderRadius: 55, background: glow ? 'linear-gradient(90deg,#F7C3D2,#E79BB4)' : 'rgba(255,255,255,0.92)', color: INK, fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: glow ? '0 20px 50px rgba(196,96,126,0.45)' : '0 16px 36px rgba(80,50,90,0.18)', transform: `scale(${Math.min(pr, 1.03) * (glow ? 1.05 : 1) * (act && !glow ? 0.97 : 1)})`, opacity: Math.min(1, pr * 2)}}>{txt}</div>
            );
          })}
          <svg width="120" height="140" viewBox="-10 -10 120 140" style={{position: 'absolute', left: curX, top: curY, zIndex: 80, filter: 'drop-shadow(8px 12px 10px rgba(0,0,0,0.3))', transform: `scale(${(t >= tapAt && t < tapAt + 0.2) || (t >= tap2At && t < tap2At + 0.2) ? 0.85 : 1})`}}>
            <path d="M5 5 L5 95 L30 72 L48 112 L66 104 L48 66 L82 66 Z" fill="#fff" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      <Tiles t={t} T={14.0} />
      <div style={{position: 'absolute', inset: 0, zIndex: 60, pointerEvents: 'none', opacity: k(1.6, 1.9)}}><Dog t={t} f={f} /></div>
      <div style={{position: 'absolute', left: 60, top: 1622, padding: '12px 26px', borderRadius: 30, background: 'rgba(255,255,255,0.94)', boxShadow: '0 10px 26px rgba(80,50,90,0.18)', fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: INK, zIndex: 95}}>{script.diagram.title}</div>
      <Captions />
    </AbsoluteFill>
  );
};
