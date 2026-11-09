p = r'C:\Users\awright\Desktop\Видео Клод\scripts\main25_main.jsx'
s = open(p, encoding='utf-8').read()


def rep(a, b):
    global s
    assert a in s, a[:70]
    s = s.replace(a, b, 1)


def cut(a, b, new):
    global s
    i = s.index(a)
    j = s.index(b, i)
    s = s[:i] + new + s[j:]


# ---- белые субтитры в хуке, без белой подложки
rep("export const Board25Main = () => {", """const CaptionsLight = () => {
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
const SolidStamp = ({txt, at, t, x, y, rot = -8, size = 80}) => {
  if (t < at) return null;
  const q = Math.min(1, (t - at) / 0.22);
  const e = easeOut(q);
  return <div style={{position: 'absolute', left: x, top: y, padding: '10px 36px', borderRadius: 16, background: '#C4607E', border: '6px solid #fff', boxShadow: '0 20px 40px rgba(120,30,70,0.5)', color: '#fff', fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: 8, opacity: Math.min(1, q * 3), transform: `rotate(${rot}deg) scale(${2.6 - 1.6 * e})`, zIndex: 40, whiteSpace: 'nowrap'}}>{txt}</div>;
};

export const Board25Main = () => {""")
rep("          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 330, background: 'linear-gradient(180deg, rgba(252,245,242,0.96) 0%, rgba(252,245,242,0.88) 55%, rgba(252,245,242,0))', zIndex: 5}} />\n", "          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 380, background: 'linear-gradient(180deg, rgba(10,6,2,0.55) 0%, rgba(10,6,2,0))', zIndex: 5}} />\n")
rep("      <Captions />", "      {t < 2.3 ? <CaptionsLight /> : <Captions />}")

# ---- переход C -> D: гигантская табличка торгов «1958» проносится справа налево
rep("{t >= 4.0 && t < 6.2 && (", "{t >= 4.0 && t < 6.45 && (")
rep("{t >= 5.7 && t < 10.3 && (\n          <div style={{position: 'absolute', inset: 0, zIndex: 18, background: BG, transform:", "{t >= 5.45 && t < 10.3 && (\n          <div style={{position: 'absolute', inset: 0, zIndex: 18, background: BG, clipPath: `polygon(${padCx}px 0px, 1100px 0px, 1100px 1920px, ${padCx}px 1920px)`, transform:")
rep("  const price = (450.3", "  const padQ = easeIO(k(5.5, 6.3));\n  const padCx = 1880 - 2680 * padQ;\n  const price = (450.3")
rep("      <Tiles t={t} T={5.7} />", """      {t >= 5.45 && t < 6.45 && (
        <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, zIndex: 46, pointerEvents: 'none', overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: padCx - 800, top: 960 - 800, width: 1600, height: 1600, transform: `rotate(${-6 + padQ * 10}deg)`, filter: 'drop-shadow(30px 30px 50px rgba(30,20,40,0.45))'}}>
            <div style={{position: 'absolute', left: 1500, top: 755, width: 700, height: 90, borderRadius: 45, background: 'linear-gradient(180deg,#E6DCCB,#B9A98F)'}} />
            <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: '#fff', border: '18px solid #2B2433', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
              <div style={{position: 'absolute', inset: 50, borderRadius: '50%', border: '6px solid #C4607E'}} />
              <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 70, letterSpacing: 20, color: '#8D8696'}}>ЛОТ</div>
              <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 360, lineHeight: 1, color: '#2B2433'}}>1958</div>
            </div>
          </div>
        </div>
      )}""")

# ---- D: копия видно
cut("            <Card x={80} y={700} w={440} h={648} at={7.0}", "            <div style={{position: 'absolute', left: 560, top: 640", """            <Card x={80} y={700} w={440} h={648} at={7.0} t={t} r={16} rot={-3} pad={7} bg="#fff" from="left">
              <div style={{position: 'relative', width: '100%', height: '100%'}}>
                <Pic src="sm.jpg" filter="sepia(0.55) contrast(0.8) brightness(1.0) saturate(0.6)" />
                <div style={{position: 'absolute', inset: 0, overflow: 'hidden', opacity: k(8.0, 8.5), pointerEvents: 'none'}}>
                  {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{position: 'absolute', left: -60, top: 30 + i * 125, width: 640, textAlign: 'center', transform: 'rotate(-28deg)', whiteSpace: 'nowrap', fontFamily: SANS, fontWeight: 800, fontSize: 56, letterSpacing: 8, color: 'rgba(255,255,255,0.55)', textShadow: '0 2px 8px rgba(60,30,40,0.4)'}}>КОПИЯ · КОПИЯ · КОПИЯ</div>)}
                </div>
              </div>
            </Card>
""")
rep('<Stamp txt="КОПИЯ" at={9.1} t={t} x={150} y={940} rot={-10} size={84} />', '<SolidStamp txt="КОПИЯ" at={9.0} t={t} x={110} y={1000} rot={-10} size={96} />\n            <Chip txt="школа Больтраффио" at={8.6} t={t} x={560} y={1060} size={26} bg="rgba(255,236,170,0.98)" z={40} />')
open(p, 'w', encoding='utf-8').write(s)
print('ok')
