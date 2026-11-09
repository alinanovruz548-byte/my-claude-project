import re

base = r'C:\Users\awright\Desktop\Видео Клод'
s = open(base + r'\scripts\main14_part.jsx', encoding='utf-8').read()

helpers = '''// видео-карточки на бумаге
const VDUR = {work: 151, uvv: 151, hall: 121};
const Vid = ({name, at, f}) => (
  <Sequence from={at}>
    <Freeze frame={Math.min(Math.max(f - at, 0), VDUR[name] - 3)}>
      <OffthreadVideo src={staticFile('n14/vid/' + name + '.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </Freeze>
  </Sequence>
);
const VidCard = ({name, cx, cy, w, rot = 0, at, back = '#2B5CC8', f, fps, z = 14, seed = 90}) => {
  const e = spring({frame: f - at, fps, config: {damping: 11, stiffness: 150}});
  if (f < at) return null;
  const h = w * 4 / 3;
  return (
    <div style={{position: 'absolute', left: cx, top: cy, zIndex: z, transform: `translate(-50%,-50%) rotate(${rot + (1 - Math.min(e, 1)) * 12}deg) scale(${Math.min(e, 1.03) * (1 + (1 - Math.min(e, 1)) * 0.3)})`, opacity: Math.min(1, e * 3),
      filter: 'drop-shadow(14px 22px 16px rgba(60,20,10,0.6))'}}>
      <div style={{position: 'absolute', left: 18, top: 14, right: -18, bottom: -14, clipPath: tornPoly(seed + 3), background: back, transform: 'rotate(2.5deg)'}} />
      <div style={{position: 'relative', clipPath: tornPoly(seed), background: PAPER, padding: 24}}>
        <div style={{position: 'relative', width: w, height: h, overflow: 'hidden', background: '#111'}}><Vid name={name} at={at} f={f} /></div>
      </div>
    </div>
  );
};

// хук: фото античных статуй падают как листья
const LEAVES = [0, 1, 2, 3, 4, 5, 6, 0, 2, 4, 1, 6];
const Leaves = ({f}) => (
  <>
    {LEAVES.map((k, i) => {
      const t = f - (i * 5 - 22);
      if (t < 0 || t > 52) return null;
      const w = 430 + (i % 3) * 50;
      const x = 460 + ((i * 263) % 800) + 90 * Math.sin(t / 6.5 + i * 1.7);
      const y = -480 + t * 66;
      const rot = (i % 2 ? 1 : -1) * (10 + (i % 4) * 3) + 28 * Math.sin(t / 8 + i);
      return <img key={i} src={img(`st_${k}.png`)} style={{position: 'absolute', left: x - w / 2, top: y, width: w, zIndex: 8, transform: `rotate(${rot}deg)`, filter: 'drop-shadow(10px 18px 14px rgba(60,20,10,0.55))'}} />;
    })}
  </>
);

'''
i = s.index('export const Board14Main')
s = s[:i] + helpers + s[i:]

R = [
    ('<AugCard cx={900} cy={1140} w={700} rot={-2} p={p0} divider={f < T(7) + 8} at={-8} f={f} fps={fps} seed={41} />',
     '<Leaves f={f} />\n        <AugCard cx={900} cy={1140} w={700} rot={-2} p={p0} divider={f < T(7) + 8} at={T(4)} f={f} fps={fps} seed={41} z={20} />'),
    ('<Tile text="БЕЛЫЕ?" cx={700} cy={600} rot={-6} bg={PAPER} size={150} at={-4}', '<Tile text="БЕЛЫЕ?" cx={700} cy={600} rot={-6} bg={PAPER} size={150} at={T(4)}'),
    ("['bg_terra.jpg', 'aug_src.jpg'", "['st_0.png', 'st_1.png', 'st_2.png', 'st_3.png', 'st_4.png', 'st_5.png', 'st_6.png', 'bg_terra.jpg', 'aug_src.jpg'"),
]
for a, b in R:
    assert a in s, a[:50]
    s = s.replace(a, b)

# S1
a = s.index('        {/* S1: красили мрамор */}')
b = s.index('        {/* S2: ультрафиолет')
s1 = '''        {/* S1: красили мрамор */}
        <Tile text="ГРЕКИ" cx={1800} cy={1130} rot={-4} bg={PAPER} size={170} at={T(9)} f={f} fps={fps} seed={53} />
        <Tile text="РИМЛЯНЕ" cx={2250} cy={1360} rot={3} bg={BLK} color={PAPER} size={150} at={T(11)} f={f} fps={fps} seed={63} />
        <VidCard name="work" cx={2300} cy={1960} w={420} rot={3} at={T(12)} back="#C8191E" f={f} fps={fps} seed={65} />
        <Tile text="ИЛЛЮСТРАЦИЯ" cx={2330} cy={2400} rot={-3} bg={BLK} color={PAPER} font={ARCH} size={32} at={T(12)} f={f} fps={fps} seed={66} z={50} />
        <Tile text="КРАСИЛИ МРАМОР" cx={1800} cy={1560} rot={-2} bg={YEL} color={BLK} font={ARCH} size={50} at={T(12)} f={f} fps={fps} seed={64} z={50} />
        <Cut file="cut_chest_w.png" ratio={790 / 754} cx={1700} cy={1900} w={340} rot={-4} at={T(13)} f={f} fps={fps} z={12} />
        <Cut file="cut_chest.png" ratio={790 / 754} cx={1700} cy={1900} w={340} rot={-4} at={T(16)} f={f} fps={fps} z={13} />
        <Tile text="КРАСНЫЙ" cx={1790} cy={2230} rot={-5} bg="#C8191E" color="#fff" size={110} at={T(15)} f={f} fps={fps} seed={54} z={50} />
        <Tile text="СИНИЙ" cx={1900} cy={2400} rot={4} bg="#2B5CC8" color="#fff" size={110} at={T(16)} f={f} fps={fps} seed={55} z={50} />
        <Tile text="ЗОЛОТОЙ" cx={2050} cy={2580} rot={-2} bg="#D4A64A" color={BLK} size={130} at={T(18)} f={f} fps={fps} seed={56} z={50} />
'''
s = s[:a] + s1 + s[b:]

# S2: видео вместо картинки
old = '<Cut file="cut_uv.png" ratio={1333 / 1044} cx={800} cy={2650} w={640} rot={-3} at={T(19)} f={f} fps={fps} z={12} />'
assert old in s
s = s.replace(old, '<VidCard name="uvv" cx={800} cy={2650} w={520} rot={-3} at={T(19)} back="#5B2BA0" f={f} fps={fps} seed={67} />')

# S3: зал белых статуй на слове «приняли»
old = '        <Tile text="ВРЕМЯ"'
assert old in s
s = s.replace(old, '        <VidCard name="hall" cx={2100} cy={3600} w={500} rot={-2} at={T(39)} back="#F2C230" f={f} fps={fps} seed={68} z={16} />\n' + old, 1)
open(base + r'\scripts\main14_part.jsx', 'w', encoding='utf-8').write(s)

g = open(base + r'\scripts\gen_n14.py', encoding='utf-8').read()
a = '''head = s.split('export const Board10Main')[0].replace("staticFile('n10/img/'", "staticFile('n14/img/'")'''
assert a in g
g = g.replace(a, a + '''.replace("Img} from 'remotion'", "Img, Sequence, OffthreadVideo, Freeze} from 'remotion'")''', 1)
# события: листопад
g = g.replace('{"sfx": "pulse", "at": 0, "dt": 0.0, "vol": 0.8}, {"sfx": "slap", "at": 0, "dt": 0.02, "vol": 0.6},',
              '{"sfx": "pulse", "at": 0, "dt": 0.0, "vol": 0.8}, {"sfx": "slap", "at": 0, "dt": 0.02, "vol": 0.6},\n        ' +
              ', '.join('{"sfx": "whoosh", "at": 0, "dt": %.2f, "vol": 0.3}' % (0.12 * k) for k in range(1, 15)) + ',')
g = g.replace('"images": {', '''"images": {
        "statues": {"file": "n14/img/st_{0..6}.png", "size": [0, 0], "license": "Public domain / CC0 (Commons): Венера Милосская, Дискобол, Нике Самофракийская, Капитолийская Венера, Гермес Праксителя (Rijksmuseum), голова Дорифора, Венера Анцио; вырезки make_n14_statues.py"},
        "videos": {"file": "n14/vid/{work,uvv,hall}.mp4", "size": [720, 960], "license": "ВИДЕО-ИЛЛЮСТРАЦИИ, созданы нейросетью (Magnific, Seedance 2.0 Fast): мастерская, УФ-лампа, зал белых статуй; не архивные кадры"},''', 1)
open(base + r'\scripts\gen_n14.py', 'w', encoding='utf-8').write(g)
print('ok')
