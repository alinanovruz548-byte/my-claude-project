const CAM_STARTS = [3.0, 6.55, 9.4, 11.9, 17.1, 22.4];
const camAt = (t) => {
  let z = 1 + Math.sin(t / 1.7) * 0.012, rot = 0, px = 0, py = 0, blur = 0;
  CAM_STARTS.forEach((s, i) => {
    const dt = t - s;
    if (dt >= 0 && dt < 0.8) {
      const q = 1 - easeOut(dt / 0.8);
      const sg = i % 2 ? 1 : -1;
      z += (i % 3 === 0 ? 0.45 : i % 3 === 1 ? 0.7 : 0.3) * q;
      rot += sg * 6 * q; px += sg * 180 * q; py += (i % 2 ? -130 : 160) * q; blur = Math.max(blur, q * 7);
    }
  });
  return {z, rot, px, py, blur};
};
const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const BG = 'linear-gradient(172deg, #FCF5F2 0%, #F3EAF6 55%, #E8EEF9 100%)';
const GOLDG = 'linear-gradient(135deg,#F6DE97,#D9AE4F 50%,#F2D27C)';
const Star = ({x, y, s = 1, ph = 0, t, c = '#FFE9A0'}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 34 * s, height: 34 * s, background: c, clipPath: 'polygon(50% 0, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0 50%, 40% 40%)', opacity: 0.35 + 0.65 * Math.abs(Math.sin(t * 2.2 + ph)), transform: `scale(${0.7 + 0.5 * Math.abs(Math.sin(t * 2.2 + ph))}) rotate(${t * 20 + ph * 30}deg)`, filter: 'drop-shadow(0 0 8px rgba(255,210,100,0.9))'}} />
);
const Stamp = ({txt, at, t, x, y, rot = -8, color = '#8E3556', size = 64}) => {
  if (t < at) return null;
  const q = Math.min(1, (t - at) / 0.28);
  const e = easeOut(q);
  return (
    <div style={{position: 'absolute', left: x, top: y, padding: '8px 30px', border: `7px double ${color}`, borderRadius: 14, color, fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: 6, opacity: 0.92 * Math.min(1, q * 3), transform: `rotate(${rot}deg) scale(${2.3 - 1.3 * e})`, zIndex: 40, mixBlendMode: 'multiply', whiteSpace: 'nowrap'}}>{txt}</div>
  );
};
// косой вайп: dir 'r' — слева направо, 'l' — справа налево; возвращает [clip сцены, clip золотой полосы]
const diag = (t, s, dur, dir) => {
  const q = easeIO(Math.min(1, Math.max(0, (t - s) / dur)));
  const X = q * 1700;
  if (t < s) return ['polygon(0 0, 0 0, 0 0)', 'polygon(0 0, 0 0, 0 0)'];
  if (dir === 'r') return [`polygon(0px 0px, ${X}px 0px, ${X - 600}px 1920px, 0px 1920px)`, `polygon(0px 0px, ${X + 90}px 0px, ${X - 510}px 1920px, 0px 1920px)`];
  return [`polygon(1080px 0px, ${1080 - X}px 0px, ${1080 - X + 600}px 1920px, 1080px 1920px)`, `polygon(1080px 0px, ${1080 - X - 90}px 0px, ${1080 - X + 510}px 1920px, 1080px 1920px)`];
};
const COL = ['#E8C26A', '#C99A3E', '#F3D98B', '#A9792A', '#D9B04F', '#B88A33'];
const Tiles = ({t, T}) => {
  if (t < T - 0.6 || t > T + 0.7) return null;
  const out = [];
  for (let r = 0; r < 11; r++) for (let c = 0; c < 6; c++) {
    const d = hash(r * 7 + c) * 0.25;
    const a = Math.min(1, Math.max(0, (t - (T - 0.5 + d)) / 0.25));
    const b = Math.min(1, Math.max(0, (t - (T + 0.05 + d)) / 0.25));
    const s = easeOut(a) * (1 - easeIO(b));
    if (s <= 0.01) continue;
    out.push(<div key={r * 6 + c} style={{position: 'absolute', left: c * 180, top: r * 175 - 2, width: 182, height: 177, background: COL[(r * 3 + c * 5) % 6], transform: `scale(${s}) rotate(${(1 - s) * 90}deg)`, boxShadow: 'inset 0 0 0 6px rgba(255,240,190,0.5)'}}>
      <div style={{position: 'absolute', inset: 40, borderRadius: '50%', border: '6px solid rgba(90,60,10,0.45)'}} />
    </div>);
  }
  return <div style={{position: 'absolute', inset: 0, zIndex: 45, pointerEvents: 'none'}}>{out}</div>;
};
const Face = ({x, y, w, h, at, t, z = 20, rot = 0, gray = 0, pos = '50% 50%', zoom = [1, 1.1], dur = 3, scale = 1}) => (
  <Card x={x} y={y} w={w} h={h} at={at} t={t} r={6} pad={0} bg="#D9AE5A" rot={rot} z={z}>
    <div style={{position: 'absolute', inset: 0, background: GOLDG}} />
    <div style={{position: 'absolute', inset: 22, border: '5px solid rgba(120,80,20,0.5)'}} />
    <div style={{position: 'absolute', inset: 40, overflow: 'hidden', boxShadow: 'inset 0 0 0 4px rgba(90,60,10,0.55)', filter: `grayscale(${gray})`}}><Paint src="gold.jpg" t={t} at={at} pos={pos} zoomFrom={zoom[0]} zoomTo={zoom[1]} dur={dur} /></div>
  </Card>
);


// картонная рука: (x, y) — точка касания кончиков пальцев, side 'l' — тянется слева, 'r' — справа, q — выезд 0..1
const Hand = ({x, y, side, q}) => {
  const off = (1 - q) * 800;
  const sk = '#F2C09B', sk2 = '#DDA27C';
  const hand = (
    <g stroke={INK} strokeWidth="5" strokeLinejoin="round">
      <rect x="-1000" y="10" width="880" height="150" fill="#fff" />
      <rect x="-150" y="2" width="46" height="166" fill={ROSE} />
      <rect x="-104" y="28" width="260" height="124" rx="34" fill={sk} />
      {[[130, 112], [128, 126], [130, 120], [132, 100]].map(([fx, fl], i) => <rect key={i} x={fx} y={32 + i * 27} width={fl} height="27" rx="13" fill={sk} />)}
      <path d="M-20 160 Q40 205 130 168 L96 140 Z" fill={sk2} />
      <path d="M-60 50 L110 50 M-60 100 L90 100" stroke={sk2} strokeWidth="4" fill="none" />
    </g>
  );
  const tx = side === 'l' ? x - 240 - off : x + 240 + off;
  return (
    <svg width="1080" height="1920" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 35}}>
      <g transform={`translate(${tx} ${y - 90}) ${side === 'r' ? 'scale(-1 1)' : ''}`}>{hand}</g>
    </svg>
  );
};
// большая картонная лапа сверху (кончик в точке x, y)
const Paw = ({x, y}) => (
  <svg width="1080" height="1920" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 36}}>
    <g stroke={INK} strokeWidth="5" strokeLinejoin="round">
      <polygon points={`${x - 75},${y - 1700} ${x + 75},${y - 1700} ${x + 66},${y - 90} ${x - 66},${y - 90}`} fill="#E8A15A" />
      <polygon points={`${x - 75},${y - 1700} ${x - 10},${y - 1700} ${x - 20},${y - 90} ${x - 66},${y - 90}`} fill="#D88B44" />
      <rect x={x - 70} y={y - 150} width="140" height="70" fill="#fff" />
      <ellipse cx={x} cy={y} rx="100" ry="88" fill="#fff" />
      <ellipse cx={x - 52} cy={y - 18} rx="24" ry="30" fill="#F4B8C8" />
      <ellipse cx={x} cy={y - 40} rx="24" ry="30" fill="#F4B8C8" />
      <ellipse cx={x + 52} cy={y - 18} rx="24" ry="30" fill="#F4B8C8" />
      <ellipse cx={x} cy={y + 24} rx="44" ry="32" fill="#F4B8C8" />
    </g>
  </svg>
);

export const Board20Main = () => {
  useFonts();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const k = (a, b, ease = easeIO) => interpolate(t, [a, b], [0, 1], {...clamp, easing: ease});
  const dd = dogState(t);
  const cam = camAt(t);
  const tapAt = 25.6, tap2At = 26.2;
  const endIn = k(22.4, 23.0, easeOut);
  const cur = t < tapAt ? 0 : t < tap2At ? 1 : 2;
  const curX = interpolate(t, [24.6, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [880, 560, 560, 600], clamp);
  const curY = interpolate(t, [24.6, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [1500, 770, 780, 910], clamp);

  // переходы
  const [clipB, goldB] = diag(t, 2.75, 0.7, 'r');
  const [clipD, goldD] = diag(t, 9.15, 0.65, 'l');
  const shQ = (i) => easeIO(Math.min(1, Math.max(0, (t - 11.7 - i * 0.045) / 0.45)));
  const flipOut = k(16.1, 16.6, (x) => x * x);
  const flipIn = k(16.6, 17.1, easeOut);
  const irisG = `circle(${easeOut(k(22.4, 23.1)) * 2300}px at 540px 1500px)`;

  // хук
  const hit = t >= 2.25 && t < 2.8 ? 1 - (t - 2.25) / 0.55 : 0;
  const shake = hit > 0 ? Math.sin(t * 90) * 14 * hit : 0;
  const sweep = (t * 0.9) % 1.6;

  // счётчики
  const dec = 1940 + 10 * Math.min(6, Math.floor(Math.max(0, t - 9.95) / 0.27));
  const price = Math.round(135 * easeOut(k(20.6, 21.9)));

  return (
    <AbsoluteFill style={{background: BG}}>
      {['gold.jpg', 'p_frame.png', 'p_judge.png', 'p_rich.png', 'p_scared.png', 'p_laugh.png', 'p_jump.png', 'p_open.png'].map((n) => <Img key={n} src={img(n)} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />)}

      {/* A. ХУК */}
      {t < 3.8 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 15, overflow: 'hidden', background: '#3b2a10', transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
          <div style={{position: 'absolute', inset: 0, backgroundImage: `url(${img('gold.jpg')})`, backgroundColor: '#B8903A', backgroundRepeat: 'no-repeat', backgroundSize: 'auto 1700px', backgroundPosition: '48% 330px', transform: `scale(${1.05 + t * 0.045})`, filter: `brightness(${1 + hit * 0.5})`}} />
          <div style={{position: 'absolute', inset: 0, background: `linear-gradient(105deg, rgba(255,245,200,0) ${sweep * 100 - 30}%, rgba(255,245,200,0.55) ${sweep * 100 - 18}%, rgba(255,245,200,0) ${sweep * 100 - 5}%)`, mixBlendMode: 'screen'}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 330, background: 'linear-gradient(180deg, rgba(252,245,242,0.97) 0%, rgba(252,245,242,0.9) 55%, rgba(252,245,242,0))', zIndex: 5}} />
          {[[120, 520, 1.2, 0], [880, 640, 1.6, 1], [300, 900, 0.9, 2], [760, 1000, 1.1, 3], [520, 760, 0.8, 4], [170, 1230, 1.0, 5], [900, 1300, 1.3, 6]].map(([x, y, s, p], i) => <Star key={i} x={x} y={y} s={s} ph={p} t={t} />)}
          {t >= 2.25 && <div style={{position: 'absolute', left: 540 - 60, top: 1250 - 60, width: 120, height: 120, borderRadius: '50%', border: '14px solid rgba(255,236,160,0.9)', transform: `scale(${1 + (t - 2.25) * 16})`, opacity: Math.max(0, 1 - (t - 2.25) * 2.2)}} />}
          <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: hit > 0.85 ? (hit - 0.85) * 6 : 0}} />
        </div>
      )}

      <div style={{position: 'absolute', inset: 0, transform: `translate(${cam.px}px, ${cam.py}px) rotate(${cam.rot}deg) scale(${cam.z})`, transformOrigin: '50% 50%', filter: cam.blur > 0.4 ? `blur(${cam.blur}px)` : undefined}}>
        {/* B. Адель, Климт, 1907 (косой золотой вайп) */}
        {t >= 2.75 && t < 6.6 && (
          <>
            <div style={{position: 'absolute', inset: 0, zIndex: 15.5, background: GOLDG, clipPath: goldB}} />
            <div style={{position: 'absolute', inset: 0, zIndex: 16, background: BG, clipPath: clipB}}>
              <Face x={150} y={390} w={780} h={780} at={3.0} t={t} rot={-2} pos="50% 30%" zoom={[1.0, 1.12]} dur={3.5} />
              <Chip txt="1907" at={5.0} t={t} x={740} y={350} size={44} bg="rgba(255,236,170,0.98)" rot={6} />
              <Card x={90} y={1200} w={560} h={140} at={3.6} t={t} r={30} from="left"><div style={{padding: '20px 34px'}}><div style={{fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: 6, color: ROSE}}>ГУСТАВ КЛИМТ</div><div style={{fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 50, color: INK, lineHeight: 1.05}}>Адель Блох-Бауэр I</div></div></Card>
              {[[110, 420, 1.2, 0], [900, 560, 1.5, 2], [880, 1100, 1.0, 4]].map(([x, y, s, p], i) => <Star key={i} x={x} y={y} s={s} ph={p} t={t} />)}
            </div>
          </>
        )}

        {/* C. 1938: картину забрали (плитки Климта) */}
        {t >= 6.55 && t < 9.8 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 17, background: BG}}>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 340, textAlign: 'center'}}><Kin txt="1938" at={6.75} t={t} size={250} weight={300} /></div>
            <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translateY(${-1700 * easeIn3(k(8.95, 9.5))}px)`}}>
              {t >= 8.35 && <Hand x={262} y={950} side="l" q={easeOut(k(8.35, 8.8))} />}
              {t >= 8.35 && <Hand x={818} y={950} side="r" q={easeOut(k(8.35, 8.8))} />}
              <Face x={250} y={650} w={580} h={580} at={7.0} t={t} rot={-3} gray={k(7.9, 8.6)} pos="50% 30%" zoom={[1.0, 1.08]} dur={2.5} />
              <Stamp txt="ИЗЪЯТО" at={8.3} t={t} x={270} y={870} rot={-12} size={70} />
            </div>
            <Chip txt="Вена, 1938" at={7.4} t={t} x={110} y={585} size={30} />
          </div>
        )}

        {/* D. музей, десятилетия (косой вайп справа) */}
        {t >= 9.15 && t < 12.3 && (
          <>
            <div style={{position: 'absolute', inset: 0, zIndex: 17.5, background: GOLDG, clipPath: goldD}} />
            <div style={{position: 'absolute', inset: 0, zIndex: 18, background: BG, clipPath: clipD}}>
              <div style={{position: 'absolute', left: 100, top: 380, width: 880, height: 780, borderRadius: 34, background: 'linear-gradient(180deg,#EFE4D6,#DCCDB8)', boxShadow: '0 30px 70px rgba(80,50,40,0.25)', overflow: 'hidden'}}>
                <div style={{position: 'absolute', left: 140, top: 0, width: 600, height: 780, background: 'linear-gradient(180deg, rgba(255,246,210,0.85), rgba(255,246,210,0))', clipPath: 'polygon(40% 0, 60% 0, 100% 100%, 0 100%)', opacity: k(9.5, 10.2)}} />
                <svg width="880" height="140" style={{position: 'absolute', left: 0, top: 0}}><path d="M440 0 L440 120" stroke="#8A6A3A" strokeWidth="5" /><path d="M300 150 L440 20 L580 150" fill="none" stroke="#8A6A3A" strokeWidth="5" /></svg>
              </div>
              <Face x={280} y={520} w={520} h={520} at={9.4} t={t} z={22} rot={0} pos="50% 30%" zoom={[1.0, 1.1]} dur={3} />
              <Card x={330} y={1085} w={420} h={64} at={10.6} t={t} r={14} z={24}><div style={{padding: '12px 24px', textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 5, color: INK}}>ВЕНА · МУЗЕЙ</div></Card>
              <div style={{position: 'absolute', left: 60, top: 1190, width: 560, textAlign: 'left', opacity: k(9.9, 10.3), zIndex: 30}}><Kin txt={`${dec}-е`} at={9.9} t={t} size={150} weight={300} color={GOLD} /></div>
            </div>
          </>
        )}

        {/* E. Мария Альтман и иск (жалюзи) */}
        {t >= 11.7 && t < 16.65 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 19, background: BG, clipPath: 'url(#shut)', transform: `perspective(1600px) rotateY(${flipOut * 90}deg)`, transformOrigin: '0% 50%'}}>
            <svg width="0" height="0" style={{position: 'absolute'}}><clipPath id="shut">{Array.from({length: 8}).map((_, i) => <rect key={i} x={i * 135} y={0} width={136} height={t < 16.0 ? shQ(i) * 1920 : 1920} />)}</clipPath></svg>
            <Card x={110} y={380} w={860} h={200} at={12.0} t={t} r={36} from="left">
              <div style={{padding: '34px 44px'}}><div style={{fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: ROSE}}>ПЛЕМЯННИЦА АДЕЛИ</div><div style={{fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 86, color: INK, lineHeight: 1.05}}>Мария Альтман</div></div>
            </Card>
            <Card x={90} y={640} w={380} h={490} at={12.9} t={t} r={22} rot={-3} from="left" pad={12} bg="#fff">
              <div style={{width: '100%', height: '100%', overflow: 'hidden', borderRadius: 14}}><Paint src="maria.jpg" t={t} at={12.9} pos="50% 40%" zoomFrom={1.0} zoomTo={1.12} dur={3.5} /></div>
            </Card>
            <Chip txt="Мария, 1935" at={13.4} t={t} x={110} y={1080} size={26} z={32} />
            <Card x={500} y={690} w={480} h={460} at={14.0} t={t} r={22} rot={2} from="right" pad={0}>
              <div style={{padding: '26px 30px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                  <svg width="56" height="56" viewBox="0 0 70 70"><path d="M35 8 V58 M14 58 H56 M10 22 H60" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" /><path d="M10 22 L2 40 H18Z M60 22 L52 40 H68Z" fill="#F3D98B" stroke={INK} strokeWidth="3" /></svg>
                  <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: INK}}>ИСК</div>
                </div>
                <div style={{fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 44, color: INK, marginTop: 18, lineHeight: 1.1}}>Альтман против Австрии</div>
                {[0, 1, 2, 3].map((i) => <div key={i} style={{height: 13, borderRadius: 7, background: '#E3DCE8', marginTop: 20, width: `${(i === 3 ? 0.55 : 1) * 100 * k(14.3 + i * 0.15, 14.8 + i * 0.15)}%`}} />)}
              </div>
            </Card>
            <Stamp txt="ВОЗВРАТ" at={15.5} t={t} x={500} y={900} rot={-10} size={62} />
          </div>
        )}

        {/* F. 2006: семья и 135 млн (переворот) */}
        {t >= 16.6 && t < 22.8 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 20, background: BG, opacity: 1 - k(22.4, 22.8), transform: `perspective(1600px) rotateY(${(1 - flipIn) * -90}deg)`, transformOrigin: '100% 50%'}}>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 340, textAlign: 'center'}}><Kin txt="2006" at={16.9} t={t} size={190} weight={300} /></div>
            <Chip txt="Австрия" at={17.2} t={t} x={110} y={640} size={34} />
            <Chip txt="Семья" at={17.9} t={t} x={780} y={640} size={34} bg="rgba(255,236,170,0.98)" />
            <svg width="1080" height="120" style={{position: 'absolute', left: 0, top: 740, opacity: k(17.6, 18.0)}}><path d="M270 60 H800" stroke={ROSE} strokeWidth="6" strokeLinecap="round" strokeDasharray="14 14" /><path d="M780 30 L815 60 L780 90" fill="none" stroke={ROSE} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translate(${interpolate(t, [17.6, 18.45], [0, 560], {...clamp, easing: easeIO})}px, ${-1700 * easeIn3(k(19.2, 19.75))}px)`}}>
              <Face x={110} y={810} w={300} h={300} at={17.2} t={t} rot={-3} pos="50% 30%" zoom={[1.0, 1.08]} dur={4} />
              {t >= 18.75 && <Hand x={122} y={960} side="l" q={easeOut(k(18.75, 19.15))} />}
              {t >= 18.75 && <Hand x={398} y={960} side="r" q={easeOut(k(18.75, 19.15))} />}
            </div>
            {t >= 17.2 && t < 19.0 && <Paw x={260 + interpolate(t, [17.6, 18.45], [0, 560], {...clamp, easing: easeIO})} y={960 - 900 * (1 - easeOut(k(17.2, 17.55))) - 900 * easeIn3(k(18.55, 18.95))} />}
            <Chip txt="по сообщениям прессы" at={19.5} t={t} x={300} y={1130} size={28} bg="rgba(255,225,170,0.97)" />
            <div style={{position: 'absolute', left: 40, width: 700, top: 1190, opacity: k(20.4, 20.8), zIndex: 30}}><Kin txt={`${price} млн $`} at={20.6} t={t} size={150} weight={600} color="#C48A1A" /></div>
            {t > 20.6 && Array.from({length: 12}).map((_, i) => {
              const q = ((t - 20.6) * 0.9 + hash(i) * 1.5) % 1.6;
              return <div key={i} style={{position: 'absolute', left: 60 + hash(i + 3) * 900, top: 300 + q * 900, width: 46, height: 46, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #FFF2B8, #E0A93A)', border: '4px solid #B8801E', opacity: Math.min(1, q * 4) * (1 - Math.max(0, (q - 1.2) / 0.4)), transform: `rotate(${q * 400}deg) scaleX(${Math.abs(Math.cos(q * 9))})`}} />;
            })}
          </div>
        )}
      </div>

      {/* G. финал */}
      {t >= 22.4 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 50, background: BG, clipPath: irisG}}>
          <div style={{position: 'absolute', left: 0, width: 1080, top: 345, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 100, color: INK, lineHeight: 1.05, opacity: endIn}}>Музею<br />или семье?</div>
          {[['Музею', 640, 0], ['Семье', 780, 1]].map(([txt, top, i]) => {
            const pr = spring({frame: f - Math.round((23.2 + i * 0.15) * fps), fps, config: {damping: 14, stiffness: 160}});
            const glow = i === 1 && t >= tap2At;
            const act = cur === i + 1 || glow;
            return (
              <div key={i} style={{position: 'absolute', left: 170, top, width: 740, height: 110, borderRadius: 55, background: glow ? 'linear-gradient(90deg,#F6DE97,#E0AE4A)' : 'rgba(255,255,255,0.92)', color: INK, fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: glow ? '0 20px 50px rgba(200,150,50,0.5)' : '0 16px 36px rgba(80,50,90,0.18)', transform: `scale(${Math.min(pr, 1.03) * (glow ? 1.05 : 1) * (act && !glow ? 0.97 : 1)})`, opacity: Math.min(1, pr * 2)}}>{txt}</div>
            );
          })}
          <svg width="120" height="140" viewBox="-10 -10 120 140" style={{position: 'absolute', left: curX, top: curY, zIndex: 80, filter: 'drop-shadow(8px 12px 10px rgba(0,0,0,0.3))', transform: `scale(${(t >= tapAt && t < tapAt + 0.2) || (t >= tap2At && t < tap2At + 0.2) ? 0.85 : 1})`}}>
            <path d="M5 5 L5 95 L30 72 L48 112 L66 104 L48 66 L82 66 Z" fill="#fff" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      <Tiles t={t} T={6.55} />
      <Dog t={t} f={f} />
      <div style={{position: 'absolute', left: 60, top: 1622, padding: '12px 26px', borderRadius: 30, background: 'rgba(255,255,255,0.94)', boxShadow: '0 10px 26px rgba(80,50,90,0.18)', fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: INK, zIndex: 95}}>{script.diagram.title}</div>
      <Captions />
    </AbsoluteFill>
  );
};
const easeIn3 = (x) => x * x * x;
