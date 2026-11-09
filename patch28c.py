from PIL import Image
base = r'C:\Users\awright\Desktop\Видео Клод'
o = Image.open(base + r'\remotion\public\n28\img\liner.png').convert('RGBA')
w, h = o.size
o = o.crop((0, 0, w, int(h * 0.60)))
bb = o.getbbox()
o = o.crop(bb)
o.save(base + r'\remotion\public\n28\img\liner.png')
print('liner', o.size)

p = base + r'\scripts\main28_body.jsx'
s = open(p, encoding='utf-8').read()


def rep(a, b):
    global s
    assert a in s, a[:60]
    s = s.replace(a, b, 1)


sea = r'''const Sea = ({t}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: 'linear-gradient(180deg,#CFE3F6 0%,#EAF3FB 38%,#9CC4E4 40%,#3F78B8 62%,#1B4A86 100%)'}}>
    <div style={{position: 'absolute', left: 80, top: 320, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle,#FFF6D8 0%,rgba(255,246,216,0) 70%)'}} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <svg key={i} width="2160" height="140" viewBox="0 0 2160 140" style={{position: 'absolute', left: -(((t * (30 + i * 14)) % 1080) + (i % 2) * 200), top: 760 + i * 130, opacity: 0.32 + i * 0.07}}>
        <path d={`M0 70 ${Array.from({length: 18}).map((_, j) => `Q${j * 120 + 60} ${70 + (j % 2 ? -34 : 34)} ${j * 120 + 120} 70`).join(' ')}`} fill="none" stroke="#fff" strokeWidth={4 + i} strokeLinecap="round" />
      </svg>
    ))}
  </div>
);

'''
s = sea + s

# D: целиком новая сцена
a = s.index("        {/* D. корабль в Нью-Йорк")
b = s.index("        {/* E. 1981")
newD = r'''        {/* D. картина плывёт на лайнере по морю в Нью-Йорк (кляксы) */}
        {t >= 12.8 && t < 17.8 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 19, background: BG, transform: `translateX(${-pq * 1080}px)`, clipPath: t < 13.6 ? 'url(#inkD)' : 'none'}}>
            <svg width="0" height="0" style={{position: 'absolute'}}><clipPath id="inkD">{[[200, 400], [880, 600], [520, 1000], [160, 1450], [900, 1500], [540, 1900]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={ink * (900 + i * 60)} />)}</clipPath></svg>
            <Sea t={t} />
            {t >= 15.2 && (() => { const q = easeOut(k(15.2, 15.9)); return <div style={{position: 'absolute', left: 60, top: 500, width: 960, height: 280, background: '#fff', padding: 8, borderRadius: 12, boxShadow: '0 20px 40px rgba(20,40,80,0.35)', opacity: q, transform: `translateY(${(1 - q) * 60}px) rotate(1deg)`, zIndex: 25}}><Pic src="nyc.jpg" pos="50% 28%" /></div>; })()}
            <Chip txt="Нью-Йорк" at={15.9} t={t} x={700} y={440} size={40} z={40} />
            <Chip txt="по морю" at={13.4} t={t} x={80} y={420} size={34} bg="rgba(255,236,170,0.98)" rot={-2} z={40} />
            {(() => { const x = interpolate(t, [13.0, 16.9], [-800, 330], {...clamp, easing: easeIO}); const bob = Math.sin(t * 2.4) * 10; const tilt = Math.sin(t * 2.4 + 1) * 1.6;
              return (<>
                <img src={img('liner.png')} style={{position: 'absolute', left: x, top: 930 + bob, width: 760, zIndex: 30, transform: `rotate(${tilt}deg)`, filter: 'drop-shadow(0 18px 18px rgba(10,30,70,0.5))'}} />
                <div style={{position: 'absolute', left: x + 200, top: 700 + bob * 1.4, width: 360, zIndex: 31, transform: `rotate(${tilt * 2 - 2}deg)`, background: '#fff', padding: 6, borderRadius: 8, boxShadow: '0 18px 30px rgba(10,30,70,0.45)', opacity: k(13.1, 13.5)}}><G w={348} h={158} /></div>
              </>); })()}
            <div style={{position: 'absolute', left: 400, top: 1260, width: 620, padding: '18px 26px', borderRadius: 28, background: 'rgba(255,255,255,0.96)', boxShadow: '0 16px 36px rgba(10,30,70,0.3)', opacity: k(14.2, 14.7), transform: `translateY(${(1 - easeOut(k(14.2, 14.7))) * 30}px)`, zIndex: 34}}>
              <div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600, fontSize: 40, color: INK, lineHeight: 1.15}}>«Пока в Испании нет свободы, пусть картина живёт тут»</div>
              <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 28, color: ROSE, marginTop: 10, textAlign: 'right', opacity: k(15.6, 16.1)}}>— Пабло Пикассо</div>
            </div>
          </div>
        )}
'''
s = s[:a] + newD + s[b:]

# самолёт только с 17.9
rep("const planeX = interpolate(t, [17.4, 19.9], [-320, 1180], clamp);", "const planeX = interpolate(t, [17.9, 19.9], [-330, 1180], clamp);")
rep("<Plane x={planeX} y={760 + Math.sin(t * 3) * 14} rot={-4} />", "{t >= 17.9 && <Plane x={planeX} y={760 + Math.sin(t * 3) * 14} rot={-4} />}")
rep("<div style={{position: 'absolute', left: planeX - 420, top: 830, width: 300, height: 140, background: '#fff', padding: 6, borderRadius: 10, boxShadow: '0 14px 28px rgba(60,40,70,0.25)', zIndex: 35, transform: `rotate(${Math.sin(t * 5) * 3}deg)`}}>",
    "<div style={{position: 'absolute', left: planeX - 420, top: 830, width: 300, height: 140, background: '#fff', padding: 6, borderRadius: 10, boxShadow: '0 14px 28px rgba(60,40,70,0.25)', zIndex: 35, opacity: t >= 17.9 ? 1 : 0, transform: `rotate(${Math.sin(t * 5) * 3}deg)`}}>")

# финал: картина «Герника» на весь экран на фоне
rep("""<svg width="0" height="0" style={{position: 'absolute'}}><clipPath id="barsG">""", """<div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}><img src={img('guernica.jpg')} style={{position: 'absolute', maxWidth: 'none', width: 4222, height: 1920, left: -1570, top: 0, transformOrigin: '1570px 50%', transform: `scale(${1 + 0.12 * k(25.4, 27.6, (x) => x)})`, filter: 'blur(2px)'}} /><div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(252,245,242,0.72) 0%, rgba(250,244,246,0.58) 50%, rgba(240,238,248,0.66) 100%)'}} /></div>
          <svg width="0" height="0" style={{position: 'absolute'}}><clipPath id="barsG">""")
open(p, 'w', encoding='utf-8').write(s)
print('ok')
