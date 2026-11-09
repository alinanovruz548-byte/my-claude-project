import re
import urllib.request
import urllib.parse

base = r'C:\Users\awright\Desktop\Видео Клод'


def get(u):
    r = urllib.request.Request(u, headers={'User-Agent': 'ArtStoriesBot/1.0 (educational)'})
    return urllib.request.urlopen(r).read()


open(base + r'\remotion\public\n12\img\supper.jpg', 'wb').write(get('https://commons.wikimedia.org/wiki/Special:FilePath/' + urllib.parse.quote('Das letzte Abendmahl von Han van Meegeren (1939).jpg') + '?width=1600'))

s = open(base + r'\scripts\main12_part.jsx', encoding='utf-8').read()
a = s.index('        {/* A: хук')
b = s.index('      {/* миниатюра-прогресс')
VID = lambda name, at: f"<Sequence from={{{at}}}><OffthreadVideo src={{staticFile('n12/vid/{name}.mp4')}} muted style={{{{width: '100%', height: '100%', objectFit: 'cover'}}}} /></Sequence>"
new = f'''        {{/* A: хук, видео-иллюстрация */}}
        <Polaroid cx={{1500}} cy={{1100}} w={{700}} h={{933}} cap="ИЛЛЮСТРАЦИЯ" rot={{-2}} at={{0}} f={{f}} fps={{fps}}>
          {VID('hook', '0')}
        </Polaroid>
        <Tape text="«ВЕРМЕЕР»?" x={{1000}} y={{1500}} rot={{-4}} f={{f}} at={{T(3)}} fps={{fps}} size={{44}} />
        <Ink text="ПОДДЕЛКА" x={{1115}} y={{1230}} rot={{-8}} size={{96}} f={{f}} at={{T(10)}} fps={{fps}} />
        {{/* B: подозреваемый */}}
        <Cut file="suspect.png" ratio={{1000 / 940}} cx={{600}} cy={{1950}} w={{540}} rot={{-3}} at={{T(11)}} f={{f}} fps={{fps}} z={{14}}>
          <div style={{{{position: 'absolute', left: '17%', top: '31%', width: `${{30 * barP}}%`, height: '6.5%', background: '#111', boxShadow: '0 4px 8px rgba(0,0,0,0.5)'}}}} />
        </Cut>
        <Pin x={{pins.B[0]}} y={{pins.B[1]}} s={{0.95}} p={{f >= T(11) ? 1 : 0}} />
        <Tape text="ХАН ВАН МЕГЕРЕН" x={{380}} y={{2380}} rot={{-3}} f={{f}} at={{T(12)}} fps={{fps}} size={{40}} />
        <Card cx={{1000}} cy={{1780}} w={{250}} h={{330}} rot={{5}} at={{T(15)}} f={{f}} fps={{fps}}>
          <div style={{{{position: 'absolute', left: 0, right: 0, top: 24, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: '#2a2418'}}}}>ПОСЛЕ ВОЙНЫ</div>
          <div style={{{{position: 'absolute', left: 0, right: 0, top: 100, textAlign: 'center', fontFamily: HEAD, fontWeight: 900, fontSize: 80, color: '#1C2A82'}}}}>1945</div>
          <div style={{{{position: 'absolute', left: 0, right: 0, top: 240, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: '#2a2418'}}}}>НИДЕРЛАНДЫ</div>
        </Card>
        <Ink text="ИЗМЕНА?" x={{430}} y={{2250}} rot={{-6}} size={{84}} f={{f}} at={{T(19)}} fps={{fps}} />
        {{/* C: Геринг и картина */}}
        <Polaroid cx={{2300}} cy={{1900}} w={{640}} h={{430}} file="supper.jpg" pos="50% 50%" cap="ДРУГАЯ ПОДДЕЛКА ВАН МЕГЕРЕНА" rot={{3}} at={{T(21)}} f={{f}} fps={{fps}} />
        <Tape text="ГЕРИНГ" x={{1880}} y={{1560}} rot={{-4}} f={{f}} at={{T(20)}} fps={{fps}} size={{52}} />
        <Tape text="«ХРИСТОС И ГРЕШНИЦА»" x={{1960}} y={{2230}} rot={{-3}} f={{f}} at={{T(25)}} fps={{fps}} size={{34}} />
        <Sticky x={{1980}} y={{1330}} text="национальное достояние" rot={{-5}} at={{T(23)}} f={{f}} fps={{fps}} size={{44}} />
        {{/* D: угроза казни */}}
        <Polaroid cx={{2250}} cy={{2850}} w={{520}} h={{693}} cap="ИЛЛЮСТРАЦИЯ · КАЗНЬ" rot={{-3}} at={{T(29)}} f={{f}} fps={{fps}}>
          {VID('noose', 'T(29)')}
        </Polaroid>
        <Ink text="КАЗНЬ?" x={{2010}} y={{3050}} rot={{-6}} size={{76}} f={{f}} at={{T(30)}} fps={{fps}} />
        <Cut file="cuffs_c.png" ratio={{688 / 1403}} cx={{1700}} cy={{3250}} w={{420}} rot={{12}} at={{T(30)}} f={{f}} fps={{fps}} z={{16}} />
        <Sticky x={{1640}} y={{2650}} text="НО!" rot={{6}} at={{T(31)}} f={{f}} fps={{fps}} size={{130}} />
        {{/* E: пишет при свидетелях */}}
        <Polaroid cx={{1050}} cy={{3450}} w={{560}} h={{400}} file="prison.jpg" pos="70% 40%" cap="1945 · ПИШЕТ «ВЕРМЕЕРА»" rot={{-3}} at={{T(36)}} f={{f}} fps={{fps}} />
        <Polaroid cx={{1750}} cy={{3500}} w={{500}} h={{667}} cap="ИЛЛЮСТРАЦИЯ · СВИДЕТЕЛИ" rot={{3}} at={{T(45)}} f={{f}} fps={{fps}}>
          {VID('wit', 'T(45)')}
        </Polaroid>
        <Tape text="ПРИ СВИДЕТЕЛЯХ" x={{1480}} y={{3890}} rot={{3}} f={{f}} at={{T(47)}} fps={{fps}} size={{36}} />
        {{/* F: приговор и смерть */}}
        <Polaroid cx={{1000}} cy={{4650}} w={{500}} h={{667}} cap="ИЛЛЮСТРАЦИЯ · ТЮРЬМА" rot={{-3}} at={{T(48)}} f={{f}} fps={{fps}}>
          {VID('cell', 'T(48)')}
        </Polaroid>
        <Ink text="1 ГОД" x={{820}} y={{4780}} rot={{-7}} size={{110}} f={{f}} at={{T(49)}} fps={{fps}} />
        <Polaroid cx={{1850}} cy={{4650}} w={{500}} h={{667}} cap="ИЛЛЮСТРАЦИЯ · 1947" rot={{3}} at={{T(53)}} f={{f}} fps={{fps}}>
          {VID('candle', 'T(53)')}
        </Polaroid>
        <Polaroid cx={{1430}} cy={{5130}} w={{420}} h={{330}} file="d1947.jpg" pos="50% 30%" cap="ВАН МЕГЕРЕН · 1947" rot={{-4}} at={{T(55)}} f={{f}} fps={{fps}} tint="grayscale(1)" />
        <Tape text="1889—1947" x={{1640}} y={{4990}} rot={{-3}} f={{f}} at={{T(57)}} fps={{fps}} size={{40}} />
      </div>
'''
s = s[:a] + new + s[b:]
R = [
    ("{[0, 1, 2, 3].map((k) => (", "{[0, 1, 2, 3, 4, 5].map((k) => ("),
    ("rotate(${(k === 1 || k === 2) ? 180 : 0}deg)", "rotate(${[0, 1, 2, 4].includes(k) ? 180 : 0}deg)"),
    ("const pins = {A: [1500, 668], B: [640, 1620], C: [2350, 1500], D: [2250, 2560], E1: [1100, 3170], E2: [1850, 3170], F: [1000, 3880]};",
     "const pins = {A: [1500, 583], B: [600, 1620], C: [2300, 1634], D: [2250, 2453], E1: [1050, 3199], E2: [1750, 3116], F1: [1000, 4266], F2: [1850, 4266]};"),
    ("          <Thread a={pins.E2} b={pins.F} at={T(48)} f={f} fps={fps} sag={150} />",
     "          <Thread a={pins.E2} b={pins.F1} at={T(48)} f={f} fps={fps} sag={150} />\n          <Thread a={pins.F1} b={pins.F2} at={T(53)} f={f} fps={fps} sag={110} />"),
    ('<Cut file="lens_c.png" ratio={1291 / 1286} cx={420} cy={3000} w={300} rot={25} f={f} fps={fps} z={5} />',
     '<Cut file="easel_c.png" ratio={1482 / 685} cx={400} cy={3000} w={300} rot={-8} f={f} fps={fps} z={5} />'),
    ("left: 790, top: 1335, zIndex: 65", "left: 735, top: 1295, zIndex: 65"),
    ("<Covered w={230} h={209} peel={peel} f={f} fps={fps} s={0.36} />", "<Covered w={300} h={273} peel={peel} f={f} fps={fps} s={0.47} />"),
    ("fontSize: 24, letterSpacing: 3, color: '#1E1E1E', textShadow: '0 0 10px", "fontSize: 28, letterSpacing: 3, color: '#1E1E1E', textShadow: '0 0 10px"),
    ("'emmaus.jpg', 'suspect.png', 'prison.jpg', 'atelier.jpg', 'bg_kraft.jpg', 'easel_c.png', 'cuffs_c.png', 'scales_c.png', 'lens_c.png'",
     "'emmaus.jpg', 'suspect.png', 'prison.jpg', 'supper.jpg', 'd1947.jpg', 'bg_kraft.jpg', 'easel_c.png', 'cuffs_c.png', 'scales_c.png', 'lens_c.png'"),
]
for x, y in R:
    assert x in s, x[:50]
    s = s.replace(x, y)
open(base + r'\scripts\main12_part.jsx', 'w', encoding='utf-8').write(s)

g = open(base + r'\scripts\gen_n12.py', encoding='utf-8').read()
g = re.sub(r"CAM = \[.*?\n\]\n", """CAM = [
    (0, 1500, 1130, 1.1, 0, None), (7, 1500, 1100, 1.2, 0, None), (11, 640, 1980, 1.1, -2, 18), (20, 2300, 1900, 1.0, 2, 22), (29, 2250, 2800, 1.15, -2, 16),
    (36, 1050, 3450, 1.3, 1, 20), (45, 1750, 3500, 1.1, 0, 22), (48, 1000, 4650, 1.1, 0, 14), (53, 1850, 4800, 1.0, 0, 16),
]
""", g, flags=re.S)
open(base + r'\scripts\gen_n12.py', 'w', encoding='utf-8').write(g)
print('patched')
