"""Разные анимации для крупных плашек (Tile) и субтитров (Captions13): печать, выезд, падение, шторка, переворот."""
import re

base = r'C:\Users\awright\Desktop\Видео Клод'
p = base + r'\scripts\main13_part.jsx'
s = open(p, encoding='utf-8').read()

# ---------- Tile
a = s.index('// слово/надпись на клочке бумаги')
b = s.index('// нотный стан')
tile = '''// слово/надпись на клочке бумаги; anim: pop | type (печатается) | slideL | slideR | drop | wipe | flip
const outE = (x) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);
const Tile = ({text, cx, cy, rot = 0, bg = YEL, color = BLK, font = ANTON, size = 160, at = 0, f, fps, seed = 1, z = 40, pad = '0.08em 0.28em', ls = 2, anim = 'pop'}) => {
  const t = f - at;
  if (t < 0) return null;
  const p = spring({frame: t, fps, config: {damping: anim === 'drop' ? 9 : 14, stiffness: 340}});
  let tf = `translate(-50%,-50%) rotate(${rot}deg)`;
  let op = 1;
  let clip;
  let shown = text;
  if (anim === 'type') {
    const n = Math.min(text.length, Math.floor(t * 0.9));
    tf = `translate(-50%,-50%) rotate(${rot}deg) scale(${interpolate(Math.min(t / 4, 1), [0, 1], [0.88, 1])})`;
    op = Math.min(1, t / 3);
    shown = <><span>{text.slice(0, n)}</span><span style={{opacity: n < text.length ? 0.9 : 0}}>{n < text.length ? '▌' : ''}</span><span style={{opacity: 0}}>{text.slice(n + (n < text.length ? 1 : 0))}</span></>;
  } else if (anim === 'slideL' || anim === 'slideR') {
    tf = `translate(-50%,-50%) translateX(${(1 - outE(t / 9)) * (anim === 'slideL' ? -1400 : 1400)}px) rotate(${rot}deg)`;
  } else if (anim === 'drop') {
    tf = `translate(-50%,-50%) translateY(${-(1 - Math.min(p, 1.2)) * 1300}px) rotate(${rot}deg)`;
  } else if (anim === 'wipe') {
    clip = `inset(0 ${(1 - outE(t / 10)) * 100}% 0 0)`;
  } else if (anim === 'flip') {
    tf = `translate(-50%,-50%) perspective(900px) rotateX(${(1 - outE(t / 10)) * 90}deg) rotate(${rot}deg)`;
    op = Math.min(1, t / 3);
  } else {
    tf = `translate(-50%,-50%) rotate(${rot + (1 - Math.min(p, 1)) * 14}deg) scale(${interpolate(p, [0, 1], [2.2, 1])})`;
    op = Math.min(1, p * 3);
  }
  return (
    <div style={{position: 'absolute', left: cx, top: cy, zIndex: z, transform: tf, opacity: op, clipPath: clip, filter: 'drop-shadow(8px 14px 10px rgba(5,10,30,0.55))'}}>
      <div style={{clipPath: tornPoly(seed), background: bg, color, fontFamily: font, fontSize: size, lineHeight: 1.05, padding: pad, whiteSpace: 'nowrap', letterSpacing: ls, textTransform: 'uppercase'}}>{shown}</div>
    </div>
  );
};

'''
s = s[:a] + tile + s[b:]

# ---------- Captions13
a = s.index('const Captions13 = () => {')
b = s.index('const RedInk')
caps = '''const CAP_ANIM = ['pop', 'type', 'slide', 'wipe', 'drop', 'flip'];
const Captions13 = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const now = f / fps;
  let chunk = null;
  let ci = 0;
  script.captions.forEach((c, k) => { if (now >= t0(c[0][1]) - 0.02) { chunk = c; ci = k; } });
  if (!chunk) return null;
  const anim = CAP_ANIM[ci % CAP_ANIM.length];
  return (
    <div style={{position: 'absolute', left: 40, top: 160, width: 1000, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px 12px', zIndex: 90}}>
      {chunk.map(([txt, s0], k) => {
        const st = t0(s0) * fps;
        if (f < st - 1) return null;
        const dt = Math.max(f - st, 0);
        const p = spring({frame: f - st, fps, config: {damping: anim === 'drop' ? 9 : 12, stiffness: 340}});
        const [bg, col, font] = WORD_STYLE[(s0 * 7 + k) % 4];
        const rot = (rnd(s0 * 3 + 1) - 0.5) * 7;
        let tf = `rotate(${rot}deg)`, op = 1, clip, shown = txt;
        if (anim === 'pop') {
          tf = `rotate(${rot}deg) scale(${interpolate(p, [0, 1], [1.5, 1])})`;
          op = Math.min(1, p * 3);
        } else if (anim === 'type') {
          const n = Math.min(txt.length, Math.floor(dt * 1.5) + 1);
          shown = <><span>{txt.slice(0, n)}</span><span style={{opacity: 0}}>{txt.slice(n)}</span></>;
        } else if (anim === 'slide') {
          tf = `translateY(${(1 - outE(dt / 7)) * 90}px) rotate(${rot}deg)`;
          op = Math.min(1, dt / 4);
        } else if (anim === 'wipe') {
          clip = `inset(0 ${(1 - outE(dt / 8)) * 100}% 0 0)`;
        } else if (anim === 'drop') {
          tf = `translateY(${-(1 - Math.min(p, 1.15)) * 220}px) rotate(${rot}deg)`;
        } else {
          tf = `perspective(700px) rotateX(${(1 - outE(dt / 8)) * 90}deg) rotate(${rot}deg)`;
          op = Math.min(1, dt / 3);
        }
        return (
          <div key={k} style={{transform: tf, opacity: op, clipPath: clip, filter: 'drop-shadow(4px 7px 6px rgba(5,10,30,0.5))'}}>
            <div style={{clipPath: tornPoly(s0 + 5), background: bg, color: col, fontFamily: font, fontSize: font === ANTON ? 78 : 62, lineHeight: 1.05, padding: '4px 16px', textTransform: 'uppercase', letterSpacing: 1}}>{shown}</div>
          </div>
        );
      })}
    </div>
  );
};

'''
s = s[:a] + caps + s[b:]

# ---------- Cut быстрее
s = s.replace("const p = pop(f, at, fps);\n  if (f < at) return null;\n  const e = 1 - Math.min(p, 1);\n  const h = w * ratio;",
              "const p = spring({frame: f - at, fps, config: {damping: 14, stiffness: 300}});\n  if (f < at) return null;\n  const e = 1 - Math.min(p, 1);\n  const h = w * ratio;")
open(p, 'w', encoding='utf-8').write(s)

# ---------- видео 14: типы анимаций, опережение и скорость
p14 = base + r'\scripts\main14_part.jsx'
t = open(p14, encoding='utf-8').read()
t = t.replace("const T = (w) => sec(t0(w), fps);", "const T = (w) => sec(t0(w), fps) - 3;")
t = t.replace("config: {damping: 11, stiffness: 150}", "config: {damping: 14, stiffness: 300}")
A = {
    '<Tile text="БЕЛЫЕ?"': 'type', '<Tile text="ЦВЕТНЫЕ!"': 'pop', '<Tile text="ГРЕКИ"': 'slideL', '<Tile text="РИМЛЯНЕ"': 'slideR', '<Tile text="КРАСИЛИ МРАМОР"': 'type',
    '<Tile text="КРАСНЫЙ"': 'type', '<Tile text="СИНИЙ"': 'wipe', '<Tile text="ЗОЛОТОЙ"': 'drop', '<Tile text="УЛЬТРАФИОЛЕТ"': 'type', '<Tile text="ИЛЛЮСТРАЦИЯ"': 'wipe',
    '<Tile text="РЕКОНСТРУКЦИЯ"': 'wipe', '<Tile text="ВРЕМЯ"': 'drop', '<Tile text="ПОЗДНЕЙШИЕ ЭПОХИ"': 'type', '<Tile text="ИДЕАЛ?"': 'flip', '<Tile text="ЧТО ВЫБЕРЕТЕ?"': 'type',
}
for k, v in A.items():
    for m in re.finditer(re.escape(k) + r'[^\n]*?/>', t):
        seg = m.group(0)
        if 'anim=' not in seg:
            t = t.replace(seg, seg[:-2] + f'anim="{v}" />', 1)
open(p14, 'w', encoding='utf-8').write(t)

g = open(base + r'\scripts\gen_n14.py', encoding='utf-8').read()
g = g.replace(', 8),', ', 6),').replace(', 8)\n', ', 6)\n')
open(base + r'\scripts\gen_n14.py', 'w', encoding='utf-8').write(g)
print('ok', t.count('anim="'))
