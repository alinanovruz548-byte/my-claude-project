import re

base = r'C:\Users\awright\Desktop\Видео Клод'
s = open(base + r'\scripts\main12_part.jsx', encoding='utf-8').read()


def vid(name, at):
    return f"<Vid name=\"{name}\" at={{{at}}} f={{f}} />"


a = s.index('        {/* A: хук')
b = s.index('      {/* свет, пыль, зерно */}')
new = f'''        {{/* A: хук, настоящий «Эммаус» ван Мегерена, оживший */}}
        <Polaroid cx={{1500}} cy={{1100}} w={{700}} h={{933}} cap="ИЛЛЮСТРАЦИЯ ПО КАРТИНЕ ВАН МЕГЕРЕНА" rot={{-2}} at={{0}} f={{f}} fps={{fps}}>
          {vid('hook2', '0')}
        </Polaroid>
        <Tape text="«ВЕРМЕЕР»?" x={{1090}} y={{1500}} rot={{-4}} f={{f}} at={{T(3)}} fps={{fps}} size={{44}} />
        <Ink text="ПОДДЕЛКА" x={{1130}} y={{1240}} rot={{-8}} size={{78}} f={{f}} at={{T(18)}} fps={{fps}} />
        {{/* петля: угроза казни */}}
        <Polaroid cx={{1500}} cy={{2300}} w={{520}} h={{693}} cap="ИЛЛЮСТРАЦИЯ · КАЗНЬ" rot={{3}} at={{T(8)}} f={{f}} fps={{fps}}>
          {vid('noose', 'T(8)')}
        </Polaroid>
        <Ink text="КАЗНЬ?" x={{1290}} y={{2480}} rot={{-6}} size={{76}} f={{f}} at={{T(9)}} fps={{fps}} />
        <Cut file="cuffs_c.png" ratio={{688 / 1403}} cx={{1180}} cy={{2680}} w={{360}} rot={{-10}} at={{T(9)}} f={{f}} fps={{fps}} z={{16}} />
        {{/* B: подозреваемый */}}
        <Cut file="suspect.png" ratio={{1000 / 940}} cx={{600}} cy={{1950}} w={{540}} rot={{-3}} at={{T(19)}} f={{f}} fps={{fps}} z={{14}}>
          <div style={{{{position: 'absolute', left: '17%', top: '31%', width: `${{30 * barP}}%`, height: '6.5%', background: '#111', boxShadow: '0 4px 8px rgba(0,0,0,0.5)'}}}} />
        </Cut>
        <Pin x={{pins.B[0]}} y={{pins.B[1]}} s={{0.95}} p={{f >= T(19) ? 1 : 0}} />
        <Tape text="ХАН ВАН МЕГЕРЕН" x={{290}} y={{2215}} rot={{-3}} f={{f}} at={{T(20)}} fps={{fps}} size={{40}} />
        <Card cx={{1000}} cy={{1780}} w={{250}} h={{330}} rot={{5}} at={{T(23)}} f={{f}} fps={{fps}}>
          <div style={{{{position: 'absolute', left: 0, right: 0, top: 24, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: '#2a2418'}}}}>ПОСЛЕ ВОЙНЫ</div>
          <div style={{{{position: 'absolute', left: 0, right: 0, top: 100, textAlign: 'center', fontFamily: HEAD, fontWeight: 900, fontSize: 80, color: '#1C2A82'}}}}>1945</div>
          <div style={{{{position: 'absolute', left: 0, right: 0, top: 240, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: '#2a2418'}}}}>НИДЕРЛАНДЫ</div>
        </Card>
        <Ink text="ИЗМЕНА?" x={{150}} y={{2340}} rot={{-6}} size={{84}} f={{f}} at={{T(25)}} fps={{fps}} />
        {{/* C: Геринг и картина */}}
        <Polaroid cx={{2300}} cy={{1900}} w={{780}} h={{523}} file="supper.jpg" pos="50% 50%" cap="ДРУГАЯ ПОДДЕЛКА ВАН МЕГЕРЕНА" rot={{3}} at={{T(27)}} f={{f}} fps={{fps}} />
        <Tape text="ГЕРИНГ" x={{1880}} y={{1560}} rot={{-4}} f={{f}} at={{T(26)}} fps={{fps}} size={{52}} />
        <Tape text="«ХРИСТОС И ГРЕШНИЦА»" x={{1960}} y={{2300}} rot={{-3}} f={{f}} at={{T(31)}} fps={{fps}} size={{34}} />
        <Sticky x={{2230}} y={{1350}} text="национальное достояние" rot={{-5}} at={{T(29)}} f={{f}} fps={{fps}} size={{44}} />
        <Sticky x={{2650}} y={{2450}} text="НО!" rot={{6}} at={{T(35)}} f={{f}} fps={{fps}} size={{130}} />
        {{/* E: пишет при свидетелях */}}
        <Polaroid cx={{1050}} cy={{3450}} w={{560}} h={{400}} file="prison.jpg" pos="70% 40%" cap="1945 · ПИШЕТ «ВЕРМЕЕРА»" rot={{-3}} at={{T(40)}} f={{f}} fps={{fps}} />
        <Polaroid cx={{1750}} cy={{3500}} w={{500}} h={{667}} cap="ИЛЛЮСТРАЦИЯ · СВИДЕТЕЛИ" rot={{3}} at={{T(49)}} f={{f}} fps={{fps}}>
          {vid('wit', 'T(49)')}
        </Polaroid>
        <Tape text="ПРИ СВИДЕТЕЛЯХ" x={{1480}} y={{3890}} rot={{3}} f={{f}} at={{T(51)}} fps={{fps}} size={{36}} />
        {{/* F: приговор и смерть */}}
        <Polaroid cx={{1000}} cy={{4650}} w={{500}} h={{667}} cap="ИЛЛЮСТРАЦИЯ · ТЮРЬМА" rot={{-3}} at={{T(52)}} f={{f}} fps={{fps}}>
          {vid('cell', 'T(52)')}
        </Polaroid>
        <Ink text="1 ГОД" x={{820}} y={{4780}} rot={{-7}} size={{110}} f={{f}} at={{T(53)}} fps={{fps}} />
        <Polaroid cx={{1850}} cy={{4600}} w={{500}} h={{667}} cap="ИЛЛЮСТРАЦИЯ · 1947" rot={{3}} at={{T(57)}} f={{f}} fps={{fps}}>
          {vid('candle', 'T(57)')}
        </Polaroid>
        <Polaroid cx={{1850}} cy={{5360}} w={{460}} h={{377}} file="d1947.jpg" pos="50% 30%" cap="ВАН МЕГЕРЕН 1889—1947" rot={{-3}} at={{T(59)}} f={{f}} fps={{fps}} tint="grayscale(1)" />
      </div>
'''
s = s[:a] + new + s[b:]

R = [
    ("const peel = [T(11), T(20), T(36)];\n  const left = peel.filter((p) => f < p).length;\n", ""),
    ("const endIn = interpolate(f, [T(59) - 6, T(59) + 14], [0, 1], clamp);", "const endIn = interpolate(f, [T(63) - 6, T(63) + 14], [0, 1], clamp);"),
    ("const barP = interpolate(f, [T(12), T(12) + 10], [0, 1], {...clamp, easing: ease});", "const barP = interpolate(f, [T(20), T(20) + 10], [0, 1], {...clamp, easing: ease});"),
    ("const pins = {A: [1500, 583], B: [600, 1620], C: [2300, 1578], D: [2250, 2453], E1: [1050, 3199], E2: [1750, 3116], F1: [1000, 4266], F2: [1850, 4266]};",
     "const pins = {A: [1500, 583], D: [1500, 1903], B: [600, 1620], C: [2300, 1578], E1: [1050, 3199], E2: [1750, 3116], F1: [1000, 4266], F2: [1850, 4200]};"),
    ("const vote = Math.floor((f - T(61)) / 14) % 2;", "const vote = Math.floor((f - T(65)) / 14) % 2;"),
    ("T(61)", "T(65)"),
    ("f >= T(59) - 6", "f >= T(63) - 6"),
]
for x, y in R:
    assert x in s, x[:60]
    s = s.replace(x, y)

# нити
t0 = s.index('          <Thread a={pins.A} b={pins.B}')
t1 = s.index('        </svg>', t0)
threads = '''          <Thread a={pins.A} b={pins.D} at={T(8)} f={f} fps={fps} sag={110} />
          <Thread a={pins.A} b={pins.B} at={T(19)} f={f} fps={fps} sag={150} />
          <Thread a={pins.B} b={pins.C} at={T(26)} f={f} fps={fps} sag={150} />
          <Thread a={pins.C} b={pins.E1} at={T(40)} f={f} fps={fps} sag={150} />
          <Thread a={pins.E1} b={pins.E2} at={T(49)} f={f} fps={fps} sag={110} />
          <Thread a={pins.E2} b={pins.F1} at={T(52)} f={f} fps={fps} sag={150} />
          <Thread a={pins.F1} b={pins.F2} at={T(57)} f={f} fps={fps} sag={110} />
'''
s = s[:t0] + threads + s[t1:]

# субтитры на плашке
old = "style={{position: 'absolute', left: 60, top: 170, width: 960, textAlign: 'center', fontFamily: HEAD, fontWeight: 700, fontSize: 48, lineHeight: 1.22, opacity: a, filter: `blur(${(1 - a) * 8}px)`,"
assert old in s
i = s.index('const Captions12')
j = s.index('export const Board12Main')
cap = '''const Captions12 = ({light}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const now = f / fps;
  let chunk = null;
  for (const c of script.captions) if (now >= t0(c[0][1]) - 0.06) chunk = c;
  if (!chunk) return null;
  const a = Math.min(1, Math.max(0, (now - (t0(chunk[0][1]) - 0.06)) / 0.2));
  const on = light ? '#fff' : '#1E1E1E', off = light ? 'rgba(255,255,255,0.32)' : 'rgba(30,30,30,0.4)';
  return (
    <div style={{position: 'absolute', left: 40, top: 165, width: 1000, display: 'flex', justifyContent: 'center', opacity: a, transform: `translateY(${(1 - a) * 12}px)`, zIndex: 90}}>
      <div style={{padding: light ? '0' : '12px 30px', borderRadius: 30, background: light ? 'none' : 'rgba(247,240,225,0.9)', boxShadow: light ? 'none' : '0 10px 24px rgba(40,24,6,0.35)', textAlign: 'center', fontFamily: HEAD, fontWeight: 700, fontSize: 46, lineHeight: 1.22,
        textWrap: 'balance', textShadow: light ? '0 4px 24px rgba(0,0,0,0.9)' : 'none'}}>
        {chunk.map(([txt, s0], k) => <span key={k} style={{color: now >= words[s0].start ? on : off}}>{txt}{' '}</span>)}
      </div>
    </div>
  );
};

'''
s = s[:i] + cap + s[j:]
s = s.replace("const VDUR = {hook: 151, noose: 121, wit: 151, cell: 121, candle: 121};", "const VDUR = {hook2: 151, noose: 121, wit: 151, cell: 121, candle: 121};")
s = s.replace("'emmaus.jpg', 'suspect.png'", "'suspect.png'")
open(base + r'\scripts\main12_part.jsx', 'w', encoding='utf-8').write(s)

g = open(base + r'\scripts\gen_n12.py', encoding='utf-8').read()
g = re.sub(r"caps = \[.*?\n\n", '''caps = [cap(0, 3), cap(4, 7), cap(8, 9), cap(10, 14), cap(15, 18), cap(19, 22), cap(23, 25), cap(26, 30), cap(31, 34), cap(35, 39), cap(40, 42), cap(43, 45), cap(46, 48), cap(49, 51), cap(52, 54),
        [["а", 55, 55], ["в", 56, 56], ["1947", 57, 60], ["он", 61, 61], ["умер.", 62, 62]], cap(63, 64), cap(65, 67)]

''', g, flags=re.S)
g = re.sub(r"CAM = \[.*?\n\]\n", """CAM = [
    (0, 1500, 1130, 1.1, 0, None), (8, 1500, 2250, 1.1, 0, 12), (14, 1500, 1100, 1.15, 0, 14), (19, 640, 1980, 1.1, -2, 18), (26, 2300, 1900, 1.0, 2, 22),
    (40, 1050, 3450, 1.3, 1, 20), (49, 1750, 3500, 1.1, 0, 22), (52, 1000, 4650, 1.1, 0, 14), (57, 1850, 4900, 0.95, 0, 16),
]
""", g, flags=re.S)
ev = re.search(r'"events": \[.*?\n    \] \+', g, flags=re.S)
newev = '''"events": [
        {"sfx": "ting", "at": 3, "dt": 0.0, "vol": 0.4}, {"sfx": "pulse", "at": 8, "dt": 0.0, "vol": 0.45}, {"sfx": "cuffs", "at": 9, "dt": 0.0, "vol": 0.8}, {"sfx": "inkstamp", "at": 9, "dt": 0.1, "vol": 0.8},
        {"sfx": "pulse", "at": 14, "dt": 0.0, "vol": 0.4}, {"sfx": "inkstamp", "at": 18, "dt": 0.05, "vol": 0.95}, {"sfx": "shing", "at": 18, "dt": 0.1, "vol": 0.4},
        {"sfx": "pulse", "at": 19, "dt": 0.0, "vol": 0.4}, {"sfx": "ting", "at": 23, "dt": 0.0, "vol": 0.3}, {"sfx": "inkstamp", "at": 25, "dt": 0.0, "vol": 0.8},
        {"sfx": "pulse", "at": 26, "dt": 0.0, "vol": 0.4}, {"sfx": "ting", "at": 29, "dt": 0.0, "vol": 0.3}, {"sfx": "shing", "at": 35, "dt": 0.0, "vol": 0.4},
        {"sfx": "pulse", "at": 40, "dt": 0.0, "vol": 0.4}, {"sfx": "brush", "at": 45, "dt": 0.0, "vol": 0.6}, {"sfx": "brush", "at": 47, "dt": 0.1, "vol": 0.5},
        {"sfx": "ting", "at": 51, "dt": 0.0, "vol": 0.35}, {"sfx": "inkstamp", "at": 53, "dt": 0.0, "vol": 0.9}, {"sfx": "ting", "at": 57, "dt": 0.0, "vol": 0.35}, {"sfx": "pulse", "at": 62, "dt": 0.0, "vol": 0.4},
        {"sfx": "gavel", "at": 63, "dt": 0.0, "vol": 0.7}, {"sfx": "ting", "at": 65, "dt": 0.0, "vol": 0.4}, {"sfx": "ting", "at": 67, "dt": 0.0, "vol": 0.5}, {"sfx": "shing", "at": 67, "dt": 0.1, "vol": 0.4},
    ] +'''
g = g[:ev.start()] + newev + g[ev.end():]
g = g.replace('"dingAt": 63', '"dingAt": 67')
g = g.replace('"emmaus": {"file": "n12/img/emmaus.jpg"', '"hook_src": {"file": "n12/vid/hook2.mp4", "size": [960, 960], "license": "ВИДЕО-ИЛЛЮСТРАЦИЯ, анимация (Magnific, Seedance 2.0 Fast) по картине «Эммаус» (Han van Meegeren, 1937, Public domain, Wikimedia Commons: EmmausgangersVanMeegeren1937.jpg)"},\n        "emmaus": {"file": "n12/img/emmaus.jpg"')
open(base + r'\scripts\gen_n12.py', 'w', encoding='utf-8').write(g)
print('ok')
