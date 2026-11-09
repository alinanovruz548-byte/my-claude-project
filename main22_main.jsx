const CAM_STARTS = [3.2, 7.2, 9.8, 12.0, 14.5, 18.0];
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
const ASP = {claesz: 3840 / 2701, steen: 3000 / 2357};
const Crop = ({src, cx, cy, wr, w, h, r = 0}) => (
  <div style={{position: 'relative', width: w, height: h, overflow: 'hidden', borderRadius: r}}>
    <Img src={img(src)} style={{position: 'absolute', maxWidth: 'none', width: wr, height: wr / ASP[src.slice(0, -4)], left: w / 2 - cx * wr, top: h / 2 - cy * wr / ASP[src.slice(0, -4)]}} />
  </div>
);
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
  return [`polygon(0px 0px, ${X}px 0px, ${X - 600}px 1920px, 0px 1920px)`, `polygon(0px 0px, ${X + 90}px 0px, ${X - 510}px 1920px, 0px 1920px)`];
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
    out.push(<div key={r * 6 + c} style={{position: 'absolute', left: c * 180, top: r * 175 - 2, width: 182, height: 177, background: (r + c) % 2 ? '#3A2A1E' : '#E9D9B6', transform: `scale(${s}) rotate(${(1 - s) * 90}deg)`, boxShadow: 'inset 0 0 0 4px rgba(120,90,50,0.35)'}} />);
  }
  return <div style={{position: 'absolute', inset: 0, zIndex: 45, pointerEvents: 'none'}}>{out}</div>;
};
const Ring = ({x, y, r, at, t, label, lx = 0, ly = 0}) => {
  if (t < at) return null;
  const q = Math.min(1, (t - at) / 0.4);
  const pulse = 1 + Math.sin((t - at) * 6) * 0.04;
  return (
    <>
      <svg width="1080" height="1920" style={{position: 'absolute', left: 0, top: 0, zIndex: 8, pointerEvents: 'none', overflow: 'visible'}}>
        <circle cx={x} cy={y} r={r * pulse} fill="none" stroke="#FFE9A0" strokeWidth="9" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - easeOut(q)} style={{filter: 'drop-shadow(0 0 14px rgba(255,220,120,0.95))'}} />
      </svg>
      <div style={{position: 'absolute', left: x + lx, top: y + ly, zIndex: 9, opacity: q}}><span style={{padding: '10px 24px', borderRadius: 30, background: 'rgba(255,255,255,0.95)', fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 2, color: INK, boxShadow: '0 10px 24px rgba(0,0,0,0.3)'}}>{label}</span></div>
    </>
  );
};
const Flame = ({x, y, q}) => (
  <svg width="120" height="160" viewBox="0 0 120 160" style={{position: 'absolute', left: x - 60, top: y - 140, zIndex: 30, opacity: q > 0 ? 1 : 0, transform: `scale(${q}) translateY(${(1 - q) * 20}px)`, transformOrigin: '50% 100%'}}>
    <path d="M60 10 C90 55 108 80 90 120 C80 145 40 145 30 120 C14 82 44 62 60 10Z" fill="#FFB43A" stroke="#E0701A" strokeWidth="5" />
    <path d="M60 60 C76 86 82 100 70 120 C62 134 48 130 46 116 C44 98 54 84 60 60Z" fill="#FFE27A" />
  </svg>
);

export const Board22Main = () => {
  useFonts();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const k = (a, b, ease = easeIO) => interpolate(t, [a, b], [0, 1], {...clamp, easing: ease});
  const cam = camAt(t);

  const flipOut = k(6.75, 7.2, (x) => x * x);
  const flipIn = k(7.2, 7.7, easeOut);
  const irisD = `circle(${easeOut(k(9.8, 10.5)) * 1800}px at 540px 800px)`;
  const wipeE = easeIO(k(11.8, 12.45));
  const shQ = (i) => easeIO(Math.min(1, Math.max(0, (t - 14.3 - i * 0.04) / 0.4)));
  const [clipG, bandG] = diag(t, 17.8, 0.65);

  const zoomA = 2730 + 300 * k(2.2, 3.4, easeIO);
  const lifeLeft = 1 - 0.95 * k(10.8, 12.0);
  const clockQ = k(12.3, 14.4, (x) => x * x);

  return (
    <AbsoluteFill style={{background: BG}}>
      {['claesz.jpg', 'steen.jpg', 'p_show.png', 'p_join.png', 'p_skull.png', 'p_ruff.png', 'p_hour.png', 'p_scared.png', 'p_open.png'].map((n) => <Img key={n} src={img(n)} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />)}

      {/* A. ХУК */}
      {t < 3.6 && (() => {
        const pull = easeOut(k(0, 0.75));
        const dogIn = easeOut(k(0.45, 1.0));
        const zz = easeIn3(k(1.7, 2.25));
        const pose = t < 1.7 ? 'show' : 'join';
        const bright = 0.4 + 0.6 * k(2.2, 2.6);
        return (
          <div style={{position: 'absolute', inset: 0, zIndex: 15, overflow: 'hidden', background: '#2a2118'}}>
            <div style={{position: 'absolute', inset: 0, transform: `rotate(${(1 - pull) * -40}deg) scale(${0.3 + 0.8 * pull + 0.04 * k(0.75, 3, easeIO)})`, filter: `blur(${(1 - pull) * 16}px) brightness(${bright})`}}>
              <Crop src="claesz.jpg" cx={0.5} cy={0.5} wr={2730} w={1080} h={1920} />
            </div>
            <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 30%, rgba(10,6,2,0.75) 100%)', opacity: (1 - k(2.2, 2.5))}} />
            {t < 2.4 && (
              <div style={{position: 'absolute', left: 195, top: 832 + (1 - dogIn) * 1000 + Math.sin(t * 40) * 6 * k(1.7, 2.2), width: 690, height: 1068, transformOrigin: '50% 46%', transform: `scale(${1 + 9 * zz})`, filter: `blur(${zz * 6}px)`, zIndex: 7, opacity: 1 - k(2.15, 2.3)}}>
                <Img src={img(`p_${pose}.png`)} style={{width: '100%', height: '100%'}} />
              </div>
            )}
            {t >= 0.95 && t < 1.7 && <div style={{position: 'absolute', left: 140, top: 1190, zIndex: 9, opacity: k(0.95, 1.2)}}><span style={{padding: '10px 26px', borderRadius: 30, background: 'rgba(255,255,255,0.95)', fontFamily: SANS, fontWeight: 700, fontSize: 32, letterSpacing: 2, color: INK, boxShadow: '0 10px 24px rgba(0,0,0,0.3)'}}>череп</span></div>}
            {t >= 1.4 && t < 1.7 && <div style={{position: 'absolute', left: 740, top: 1250, zIndex: 9, opacity: k(1.4, 1.6)}}><span style={{padding: '10px 26px', borderRadius: 30, background: 'rgba(255,255,255,0.95)', fontFamily: SANS, fontWeight: 700, fontSize: 32, letterSpacing: 2, color: INK, boxShadow: '0 10px 24px rgba(0,0,0,0.3)'}}>часы</span></div>}
            <Ring x={540 + 0.115 * zoomA} y={960 + (0.37 - 0.5) * zoomA / ASP.claesz} r={215} at={2.3} t={t} label="череп" lx={-190} ly={-270} />
            <Ring x={540 - 0.15 * zoomA} y={960 + (0.753 - 0.5) * zoomA / ASP.claesz} r={140} at={2.55} t={t} label="часы" lx={40} ly={-230} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 330, background: 'linear-gradient(180deg, rgba(252,245,242,0.97) 0%, rgba(252,245,242,0.9) 55%, rgba(252,245,242,0))', zIndex: 5}} />
            <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: t > 2.2 && t < 2.45 ? 1 - (t - 2.2) / 0.25 : 0, zIndex: 10}} />
            <Stamp txt="ПОСЛАНИЕ" at={2.45} t={t} x={190} y={760} rot={-8} size={78} />
          </div>
        );
      })()}

      <div style={{position: 'absolute', inset: 0, transform: `translate(${cam.px}px, ${cam.py}px) rotate(${cam.rot}deg) scale(${cam.z})`, transformOrigin: '50% 50%', filter: cam.blur > 0.4 ? `blur(${cam.blur}px)` : undefined}}>
        {/* B. ванитас */}
        {t >= 3.2 && t < 7.25 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 16, background: BG, transform: `perspective(1600px) rotateY(${flipOut * 90}deg)`, transformOrigin: '0% 50%'}}>
            <Card x={140} y={380} w={800} h={500} at={4.3} t={t} r={36} from="up">
              <div style={{padding: '28px 44px'}}>
                <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 6, color: ROSE}}>ПО-ЛАТЫНИ</div>
                <div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600, fontSize: 150, color: INK, lineHeight: 1.05, opacity: k(4.6, 5.0), transform: `translateY(${(1 - k(4.6, 5.0, easeOut)) * 30}px)`}}>vanitas</div>
                <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 120, color: '#C48A1A', lineHeight: 1.1, opacity: k(6.2, 6.6), transform: `translateY(${(1 - k(6.2, 6.6, easeOut)) * 30}px)`}}>= суета</div>
              </div>
            </Card>
            <Chip txt="из Екклесиаста" at={5.6} t={t} x={160} y={940} size={26} bg="rgba(255,236,170,0.98)" />
            <Card x={150} y={1010} w={480} h={310} at={3.6} t={t} r={18} rot={-3} pad={8} bg="#fff"><Crop src="claesz.jpg" cx={0.5} cy={0.5} wr={480} w={464} h={294} r={10} /></Card>
          </div>
        )}

        {/* C. XVII век (переворот) */}
        {t >= 7.2 && t < 10.1 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 17, background: BG, transform: `perspective(1600px) rotateY(${(1 - flipIn) * -90}deg)`, transformOrigin: '100% 50%'}}>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 330, textAlign: 'center'}}><Kin txt="XVII век" at={8.7} t={t} size={190} weight={300} /></div>
            <Card x={50} y={600} w={580} h={410} at={7.5} t={t} r={18} rot={-5} pad={9} bg="#fff"><Crop src="claesz.jpg" cx={0.5} cy={0.5} wr={562} w={562} h={392} r={8} /></Card>
            <Card x={440} y={720} w={600} h={480} at={7.9} t={t} r={18} rot={4} pad={9} bg="#fff" z={22}><Crop src="steen.jpg" cx={0.5} cy={0.5} wr={582} w={582} h={462} r={8} /></Card>
            <Chip txt="Нидерланды" at={7.6} t={t} x={90} y={1050} size={30} />
            <Chip txt="голландцы" at={8.1} t={t} x={90} y={1120} size={26} bg="rgba(255,236,170,0.98)" />
          </div>
        )}

        {/* D. череп (круг) */}
        {t >= 9.8 && t < 12.3 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 18, background: BG, clipPath: irisD}}>
            <div style={{position: 'absolute', left: 190, top: 430, width: 700, height: 700, borderRadius: '50%', overflow: 'hidden', boxShadow: '0 0 0 14px #fff, 0 30px 70px rgba(80,50,90,0.3)', opacity: k(9.9, 10.4)}}>
              <Crop src="claesz.jpg" cx={0.6} cy={0.37} wr={1900 + 250 * k(9.9, 12, easeIO)} w={700} h={700} />
            </div>
            <Card x={90} y={1210} w={620} h={120} at={10.5} t={t} r={30} from="left">
              <div style={{padding: '18px 34px'}}><div style={{fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: 6, color: ROSE}}>ЖИЗНЬ</div>
                <div style={{height: 22, borderRadius: 11, background: '#EEE6F0', marginTop: 10, overflow: 'hidden'}}><div style={{height: '100%', width: `${lifeLeft * 100}%`, borderRadius: 11, background: 'linear-gradient(90deg,#F6DE97,#C4607E)'}} /></div></div>
            </Card>
          </div>
        )}

        {/* E. часы (вайп вверх) */}
        {t >= 11.8 && t < 14.6 && (
          <>
            <div style={{position: 'absolute', inset: 0, zIndex: 18.5, background: '#3A2A1E', clipPath: `inset(${(1 - Math.min(1, wipeE + 0.07)) * 100}% 0 0 0)`}} />
            <div style={{position: 'absolute', inset: 0, zIndex: 19, background: BG, clipPath: `inset(${(1 - wipeE) * 100}% 0 0 0)`}}>
              <div style={{position: 'absolute', left: 70, top: 440, width: 520, height: 520, borderRadius: '50%', overflow: 'hidden', boxShadow: '0 0 0 12px #fff, 0 30px 70px rgba(80,50,90,0.3)'}}>
                <Crop src="claesz.jpg" cx={0.35} cy={0.745} wr={2500} w={520} h={520} />
              </div>
              <svg width="400" height="400" viewBox="-200 -200 400 400" style={{position: 'absolute', left: 620, top: 560, filter: 'drop-shadow(0 20px 30px rgba(80,50,90,0.3))'}}>
                <circle r="190" fill="#fff" stroke={INK} strokeWidth="8" />
                {Array.from({length: 12}).map((_, i) => <line key={i} x1="0" y1="-165" x2="0" y2="-180" stroke={INK} strokeWidth="6" transform={`rotate(${i * 30})`} />)}
                <line x1="0" y1="12" x2="0" y2="-150" stroke={ROSE} strokeWidth="8" strokeLinecap="round" transform={`rotate(${clockQ * 1800})`} />
                <line x1="0" y1="8" x2="0" y2="-100" stroke={INK} strokeWidth="12" strokeLinecap="round" transform={`rotate(${clockQ * 150 + 40})`} />
                <circle r="12" fill={INK} />
              </svg>
              <Chip txt="время уходит" at={13.1} t={t} x={640} y={1020} size={28} bg="rgba(255,236,170,0.98)" />
            </div>
          </>
        )}

        {/* F. лампа и бокал (жалюзи) */}
        {t >= 14.3 && t < 18.2 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 20, background: BG, clipPath: 'url(#shutH22)'}}>
            <svg width="0" height="0" style={{position: 'absolute'}}><clipPath id="shutH22">{Array.from({length: 8}).map((_, i) => <rect key={i} x={0} y={i * 241} width={t < 15.0 ? shQ(i) * 1080 : 1080} height={242} />)}</clipPath></svg>
            <div style={{position: 'absolute', left: 80, top: 480, width: 420, height: 520, borderRadius: 60, overflow: 'hidden', boxShadow: '0 0 0 10px #fff, 0 30px 70px rgba(80,50,90,0.3)'}}>
              <Crop src="claesz.jpg" cx={0.168} cy={0.59} wr={2400} w={420} h={520} />
            </div>
            <Flame x={290} y={500} q={t < 15.0 ? 1 - 0 : Math.max(0, 1 - (t - 15.0) / 0.5)} />
            {t > 15.0 && <div style={{position: 'absolute', left: 250, top: 380 - (t - 15.0) * 90, width: 80, height: 80, borderRadius: '50%', background: 'rgba(150,150,160,0.5)', filter: 'blur(14px)', opacity: Math.max(0, 1 - (t - 15.0) / 1.4)}} />}
            <div style={{position: 'absolute', left: 580, top: 480, width: 420, height: 520, borderRadius: 60, overflow: 'hidden', boxShadow: '0 0 0 10px #fff, 0 30px 70px rgba(80,50,90,0.3)'}}>
              <Crop src="claesz.jpg" cx={0.31} cy={0.57} wr={1700 + 120 * k(15.4, 17, easeIO)} w={420} h={520} />
            </div>
            <Chip txt="лампа погасла" at={14.9} t={t} x={90} y={1040} size={26} />
            <Chip txt="бокал опрокинут" at={15.9} t={t} x={600} y={1040} size={26} bg="rgba(255,236,170,0.98)" />
            <Stamp txt="КОНЕЦ" at={17.2} t={t} x={330} y={1120} rot={-8} size={80} />
          </div>
        )}

        {/* G. вторая картина (косой вайп) */}
        {t >= 17.8 && (
          <>
            <div style={{position: 'absolute', inset: 0, zIndex: 20.5, background: '#3A2A1E', clipPath: bandG}} />
            <div style={{position: 'absolute', inset: 0, zIndex: 21, background: BG, clipPath: clipG}}>
              <Card x={90} y={430} w={900} h={707} at={18.2} t={t} r={14} pad={10} bg="#fff" rot={-1}>
                <Crop src="steen.jpg" cx={0.5} cy={0.5} wr={880 + 40 * k(18.2, 22, easeIO)} w={880} h={687} r={6} />
              </Card>
              {[[0.62, 0.68, 19.6], [0.17, 0.76, 20.0], [0.58, 0.42, 20.4], [0.83, 0.38, 20.8], [0.38, 0.72, 21.2]].map(([fx, fy, at], i) => {
                const q = spring({frame: f - Math.round(at * fps), fps, config: {damping: 9, stiffness: 180}});
                if (t < at) return null;
                return <div key={i} style={{position: 'absolute', left: 90 + fx * 900 - 38, top: 430 + fy * 707 - 38, width: 76, height: 76, borderRadius: '50%', background: 'linear-gradient(135deg,#F6DE97,#E0AE4A)', border: '5px solid #fff', boxShadow: '0 12px 26px rgba(40,30,20,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 52, color: INK, transform: `scale(${Math.min(1.1, q)})`, zIndex: 30}}>?</div>;
              })}
              <Chip txt="Хармен Стенвейк" at={18.6} t={t} x={650} y={1170} size={26} />
              <Chip txt="пишите в комментариях" at={21.0} t={t} x={560} y={1240} size={28} bg="rgba(255,236,170,0.98)" z={60} />
            </div>
          </>
        )}
      </div>

      <Tiles t={t} T={3.2} />
      <Dog t={t} f={f} />
      <div style={{position: 'absolute', left: 60, top: 1622, padding: '12px 26px', borderRadius: 30, background: 'rgba(255,255,255,0.94)', boxShadow: '0 10px 26px rgba(80,50,90,0.18)', fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: INK, zIndex: 95}}>{script.diagram.title}</div>
      <Captions />
    </AbsoluteFill>
  );
};
