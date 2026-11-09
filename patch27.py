p = r'C:\Users\awright\Desktop\Видео Клод\scripts\main27_main.jsx'
s = open(p, encoding='utf-8').read()

# 1. плашка хука: наверх, розовая
a = s.index("          {t > 0.2 && (")
b = s.index("        </div>\n      )}\n      <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash")
new_hook = """          {t > 0.1 && (
            <div style={{position: 'absolute', left: 0, width: 1080, top: 430, textAlign: 'center', zIndex: 8}}>
              <span style={{display: 'inline-block', padding: '6px 46px 14px', borderRadius: 60, background: 'linear-gradient(135deg,#F9B7D2,#C4607E)', border: '7px solid #fff', fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, fontSize: 104, color: '#fff', textShadow: '0 4px 14px rgba(120,30,70,0.45)', boxShadow: '0 18px 44px rgba(120,30,70,0.45)', transform: `scale(${0.5 + 0.5 * k(0.1, 0.55, easeOut)}) rotate(-3deg)`, opacity: Math.min(k(0.1, 0.3), 1 - k(2.3, 2.55))}}>очередь!</span>
            </div>
          )}
"""
s = s[:a] + new_hook + s[b:]

# 2. сцена D
a = s.index("            <Card x={50} y={760} w={500} h={338}")
b = s.index("          </div>\n        )}\n\n        {/* E.")
new_d = """            {t < 12.5 && (
              <div style={{position: 'absolute', inset: 0, opacity: 1 - k(12.1, 12.45), transform: `scale(${1 - 0.25 * k(12.1, 12.45)}) rotate(${-6 * k(12.1, 12.45)}deg)`, transformOrigin: '50% 60%'}}>
                <Card x={50} y={760} w={500} h={338} at={10.3} t={t} r={16} rot={-4} pad={7} bg="#fff" from="left"><Pic src="kand.jpg" /></Card>
                <Card x={600} y={730} w={400} h={543} at={11.0} t={t} r={16} rot={4} pad={7} bg="#fff" from="right"><Pic src="klee.jpg" /></Card>
                <Card x={230} y={1190} w={520} h={442} at={11.55} t={t} r={16} rot={-2} pad={7} bg="#fff" from="left" z={25}><Pic src="chagall.jpg" /></Card>
                {[['Кандинский', 10.0, 70, 1130], ['Клее', 10.9, 640, 1300], ['Шагал', 11.45, 120, 1560]].map(([txt, at, x, y], i) => <Chip key={txt} txt={txt} at={at} t={t} x={x} y={y} size={32} z={36} bg={i % 2 ? 'rgba(255,236,170,0.98)' : 'rgba(255,255,255,0.97)'} rot={i % 2 ? 3 : -3} />)}
              </div>
            )}
            {t >= 12.1 && (
              <>
                <Chip txt="и другие" at={12.15} t={t} x={690} y={660} size={36} z={38} bg="rgba(255,236,170,0.98)" rot={3} />
                {[['kand.jpg', 'Кандинский', 'left'], ['klee.jpg', 'Клее', 'up'], ['chagall.jpg', 'Шагал', 'right'], ['marc.jpg', 'Марк', 'left'], ['corinth.jpg', 'Коринт', 'up'], ['schlemmer.jpg', 'Шлеммер', 'right']].map(([src, nm, from], i) => {
                  const cx = 40 + (i % 3) * 345, cy = 770 + Math.floor(i / 3) * 400, at = 12.3 + i * 0.17;
                  return (
                    <React.Fragment key={src}>
                      <Card x={cx} y={cy} w={310} h={350} at={at} t={t} r={14} rot={(i % 2 ? 3 : -3) + (i > 2 ? 1 : 0)} pad={6} bg="#fff" from={from} z={26}><Pic src={src} /></Card>
                      <Chip txt={nm} at={at + 0.2} t={t} x={cx + 40} y={cy + 318} size={24} z={37} bg={i % 2 ? 'rgba(255,236,170,0.98)' : 'rgba(255,255,255,0.97)'} rot={i % 2 ? 2 : -2} />
                    </React.Fragment>
                  );
                })}
                <div style={{position: 'absolute', left: 40, top: 1560, width: 1000, textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 20, color: SOFT, opacity: k(13.2, 13.6)}}>примеры работ художников выставки</div>
              </>
            )}
"""
s = s[:a] + new_d + s[b:]

# 3. сцена E: справа три работы
a = s.index("              {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 50")
b = s.index("              <div style={{position: 'absolute', left: 20, top: 1100, width: 500, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 44")
new_e = """              {[['g1.png', 28, 520, 300, 226, -2, 15.7], ['g3.jpg', 236, 740, 296, 188, 2, 16.0], ['g2.png', 52, 950, 330, 248, -1.5, 16.3]].map(([src, x, y, w, h, rot, at], i) => {
                const q = easeOut(Math.min(1, Math.max(0, (t - at) / 0.45)));
                return <div key={src} style={{position: 'absolute', left: x, top: y, width: w, height: h, border: '9px solid #C9A14A', boxSizing: 'border-box', background: '#F8F6EE', boxShadow: '0 16px 30px rgba(60,60,100,0.28)', opacity: q, transform: `translateY(${(1 - q) * 80}px) rotate(${rot}deg) scale(${0.9 + 0.1 * q})`, overflow: 'hidden'}}><Img src={img(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>;
              })}
"""
s = s[:a] + new_e + s[b:]
s = s.replace("opacity: k(16.2, 16.5)}}>«ПРАВИЛЬНАЯ»</div>", "opacity: k(16.2, 16.5)}}>«ПРАВИЛЬНАЯ»</div>\n              <div style={{position: 'absolute', left: 20, top: 1165, width: 500, textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 18, color: '#4A5580', opacity: k(16.6, 16.9)}}>пейзажи с Большой германской выставки, 1938–39</div>")

# preload
s = s.replace("'kand.jpg', 'klee.jpg', 'p_ticket.png'", "'kand.jpg', 'klee.jpg', 'chagall.jpg', 'marc.jpg', 'corinth.jpg', 'schlemmer.jpg', 'g1.png', 'g2.png', 'g3.jpg', 'p_ticket.png'")
open(p, 'w', encoding='utf-8').write(s)

# gen: картинки и источники
g = r'C:\Users\awright\Desktop\Видео Клод\scripts\gen_n27.py'
t = open(g, encoding='utf-8').read()
t = t.replace('''        "dog": {"file": "n27/img/p_{ticket''', '''        "chagall": {"file": "n27/img/chagall.jpg", "size": [960, 815], "license": "Public domain (Commons), Шагал «Над Витебском», 1914"},
        "marc": {"file": "n27/img/marc.jpg", "size": [960, 1526], "license": "Public domain (Commons), Ф. Марк «Башня голубых лошадей», 1913 (была на выставке)"},
        "corinth": {"file": "n27/img/corinth.jpg", "size": [960, 1222], "license": "Public domain (Commons), Коринт «Се человек»"},
        "schlemmer": {"file": "n27/img/schlemmer.jpg", "size": [700, 1062], "license": "Public domain (Commons), Шлеммер «Четыре фигуры в пространстве»"},
        "g1": {"file": "n27/img/g1.png", "size": [960, 737], "license": "Public domain (Commons), Ф. Бурман «Вид на море», Большая германская выставка"},
        "g2": {"file": "n27/img/g2.png", "size": [960, 720], "license": "Public domain (Commons), А. Гриль «Старая липа у Штарнбергского озера», БГВ 1939"},
        "g3": {"file": "n27/img/g3.jpg", "size": [960, 606], "license": "Public domain (Commons), П. Шольц «Кимзее у Брайтбрунна», БГВ"},
        "dog": {"file": "n27/img/p_{ticket''', 1)
open(g, 'w', encoding='utf-8').write(t)
print('ok')
