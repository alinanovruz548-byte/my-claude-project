base = r'C:\Users\awright\Desktop\Видео Клод'
p = base + r'\scripts\main29_part.jsx'
s = open(p, encoding='utf-8').read()


def rep(a, b, cnt=1):
    global s
    assert a in s, a[:80]
    s = s.replace(a, b, cnt)


# ---- зеркало: настоящее золочёное зеркало (вырез), Фрида в стекле
a0 = s.index("      <div style={{position: 'absolute', left: 130, top: 640, transform:")
a1 = s.index("      <Chip txt=\"зеркало\" at={3.2}")
new_mirror = r'''      <div style={{position: 'absolute', left: 220, top: 400, width: 640, height: 1000, transform: `scale(${1.5 - 0.5 * mirrorIn}) rotate(${(1 - mirrorIn) * -16}deg)`, opacity: Math.min(1, mirrorIn * 2), filter: mirrorIn < 0.9 ? `blur(${(1 - mirrorIn) * 8}px)` : undefined}}>
        <div style={{position: 'absolute', inset: 0, clipPath: 'polygon(23% 38.9%, 27.2% 31.7%, 44.6% 29.4%, 59.8% 31.7%, 66.5% 36.9%, 68.8% 47.4%, 64.3% 62.9%, 57.6% 71.9%, 42.4% 74.6%, 29.5% 71.1%, 22.8% 60%, 20.5% 47.1%)', overflow: 'hidden', background: '#D8D4CC'}}>
          <Img src={img('frida32.jpg')} style={{position: 'absolute', maxWidth: 'none', left: 100, top: 300, width: 380, height: 570, objectFit: 'cover'}} />
        </div>
        <Img src={img('mirror_fx.png')} style={{position: 'absolute', inset: 0, width: 640, height: 1000, filter: 'drop-shadow(0 30px 40px rgba(60,40,20,0.35))'}} />
        <div style={{position: 'absolute', inset: 0, clipPath: 'polygon(23% 38.9%, 27.2% 31.7%, 44.6% 29.4%, 59.8% 31.7%, 66.5% 36.9%, 68.8% 47.4%, 64.3% 62.9%, 57.6% 71.9%, 42.4% 74.6%, 29.5% 71.1%, 22.8% 60%, 20.5% 47.1%)', background: `linear-gradient(115deg, rgba(255,255,255,0) ${30 + (t * 120) % 140 - 40}%, rgba(255,255,255,0.5) ${30 + (t * 120) % 140}%, rgba(255,255,255,0) ${30 + (t * 120) % 140 + 12}%)`}} />
      </div>
      <div style={{position: 'absolute', left: 90, top: 1410, fontFamily: SANS, fontWeight: 700, fontSize: 18, color: '#5A4A66', opacity: k(3.4, 3.8)}}>Зеркало: Bemberg Foundation, CC BY-SA 4.0</div>
'''
s = s[:a0] + new_mirror + s[a1:]
rep('<Chip txt="зеркало" at={3.2} t={t} x={130} y={560}', '<Chip txt="зеркало" at={3.2} t={t} x={110} y={470}')
rep('<Chip txt="великая художница" at={2.2} t={t} x={560} y={1490}', '<Chip txt="великая художница" at={2.2} t={t} x={540} y={1470}')

# ---- сдвиг финала (+1,6 с из-за новой фразы) и тайминги
rep("const tapAt = 24.4, tap2At = 24.95;", "const tapAt = 26.0, tap2At = 26.55;")
rep("const endIn = k(22.4, 22.95, easeOut);", "const endIn = k(24.7, 25.25, easeOut);")
rep("[23.6, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [880, 560, 560, 600]", "[25.1, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [880, 560, 560, 600]")
rep("[23.6, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [1500, 790, 800, 930]", "[25.1, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [1500, 790, 800, 930]")
rep("const irisF = easeOut(k(22.0, 22.65));", "const irisF = easeOut(k(24.3, 24.95));")
rep("{t >= 15.9 && t < 22.6 && (", "{t >= 15.9 && t < 22.9 && (")
rep("{t >= 22.0 && (\n        <div style={{position: 'absolute', inset: 0, zIndex: 50, background: BG, clipPath: `circle(", "{t >= 24.3 && (\n        <div style={{position: 'absolute', inset: 0, zIndex: 50, background: BG, clipPath: `circle(")
rep("transform: `scale(${1.15 + 0.12 * k(22.0, 25.5, (x) => x)})`", "transform: `scale(${1.15 + 0.12 * k(24.3, 27.2, (x) => x)})`")
rep("const pr = spring({frame: f - Math.round((22.9 + i * 0.15) * fps), fps, config: {damping: 14, stiffness: 160}});", "const pr = spring({frame: f - Math.round((25.1 + i * 0.15) * fps), fps, config: {damping: 14, stiffness: 160}});")
rep("{t >= 22.0 && t < 22.9 && <div style={{position: 'absolute', left: 540 - irisF * 2100", "{t >= 24.3 && t < 25.2 && <div style={{position: 'absolute', left: 540 - irisF * 2100")
rep("opacity: 1 - k(22.5, 22.9), boxShadow", "opacity: 1 - k(24.8, 25.2), boxShadow")

# ---- коллаж из 10 знаменитых картин (во весь экран)
a = s.index("      {/* повязки гипса: D -> E */}")
collage = r'''      {/* КОЛЛАЖ: самые знаменитые картины на весь экран */}
      {t >= 22.5 && t < 24.9 && (() => {
        const items = [['k1', 'Две Фриды', 1938], ['k2', 'Сломанная колонна', 1944], ['k3', 'Больница Генри Форда', 1932], ['k4', 'Раненый олень', 1946], ['k0', 'В бархатном платье', 1926], ['k6', 'Посвящение Троцкому', 1937], ['k7', 'Диего и я', 1949], ['k8', 'Корни', 1943], ['k5', 'Фрида и Диего Ривера', 1931], ['k9', 'Время летит', 1929]];
        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1], [0, 1], [0, -1]];
        const zoomOut = 1.0 + 0.05 * k(22.5, 24.9, (x) => x);
        return (
          <div style={{position: 'absolute', inset: 0, zIndex: 52, background: '#2A2433', overflow: 'hidden', opacity: 1 - k(24.6, 24.9)}}>
            <div style={{position: 'absolute', inset: 0, transform: `scale(${zoomOut})`, transformOrigin: '50% 50%'}}>
              {items.map(([key, name, yr], i) => {
                const col = i % 2, row = Math.floor(i / 2);
                const at = 22.55 + i * 0.1;
                const q = easeOut(Math.min(1, Math.max(0, (t - at) / 0.35)));
                const [dx, dy] = dirs[i];
                return (
                  <div key={key} style={{position: 'absolute', left: col * 540 + 3, top: row * 384 + 3, width: 534, height: 378, overflow: 'hidden', transform: `translate(${dx * (1 - q) * 700}px, ${dy * (1 - q) * 700}px) scale(${0.7 + 0.3 * q})`, opacity: Math.min(1, q * 2.5), boxShadow: '0 0 30px rgba(0,0,0,0.5)'}}>
                    <Img src={img(key + '.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%', transform: `scale(${1.04 + 0.1 * Math.min(1, (t - at) / 2)})`}} />
                    <div style={{position: 'absolute', left: 14, bottom: 14, padding: '6px 16px', borderRadius: 20, background: 'rgba(255,255,255,0.93)', fontFamily: SANS, fontWeight: 700, fontSize: 22, color: INK, opacity: Math.min(1, Math.max(0, (t - at - 0.3) / 0.25))}}>{name}, {yr}</div>
                  </div>
                );
              })}
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 380, background: 'linear-gradient(180deg, rgba(20,14,30,0.8) 0%, rgba(20,14,30,0))', zIndex: 5}} />
          </div>
        );
      })()}

'''
s = s[:a] + collage + s[a:]
open(p, 'w', encoding='utf-8').write(s)

# ---- mk29: камера, подписи, KEYS, события, источники
m = base + r'\scripts\mk29.py'
t = open(m, encoding='utf-8').read()


def rt(a, b):
    global t
    assert a in t, a[:80]
    t = t.replace(a, b, 1)


rt("[2.4, 4.0, 5.2, 10.3, 15.8, 18.4, 22.0]", "[2.4, 4.0, 5.2, 10.3, 15.8, 18.4, 22.55, 24.3]")
rt("(57, 62), (63, 64), (65, 69)]", "(57, 62), (63, 64), (65, 69), (70, 74)]")
rt("assert len(ws) == 70", "assert len(ws) == 75")
rt("  {t: 21.6, x: 890, y: 1830, s: 0.6, pose: 'jump', look: -1},\n  {t: 22.4, x: 540, y: 1790, s: 0.85, pose: 'open', look: 1},",
   "  {t: 21.6, x: 890, y: 1830, s: 0.6, pose: 'jump', look: -1},\n  {t: 22.4, x: 890, y: 1830, s: 0.6, pose: 'laugh', look: -1},\n  {t: 24.6, x: 890, y: 1830, s: 0.6, pose: 'laugh', look: -1},\n  {t: 25.1, x: 540, y: 1790, s: 0.85, pose: 'open', look: 1},")
rt('ev("stamp", 63, 0.0, 0.65),\n        ev("whoosh", 64, 0.1, 0.6), ev("ting", 69, 0.2, 0.5),',
   'ev("stamp", 63, 0.0, 0.65),\n        ev("whoosh", 65, -0.2, 0.6), ev("tick", 66, 0.0, 0.3), ev("tick", 67, 0.0, 0.3), ev("tick", 68, 0.0, 0.3), ev("tick", 69, 0.0, 0.3),\n        ev("whoosh", 70, -0.3, 0.6), ev("ting", 74, 0.2, 0.5),')
rt('"dingAt": 69', '"dingAt": 74')
rt('"Фото Фриды Кало 1932', '"Коллаж «знаменитые картины» (en.wikipedia, миниатюры, добросовестное использование для комментария; риск претензий платформы): Две Фриды, Сломанная колонна, Больница Генри Форда, Раненый олень, Автопортрет в бархатном платье, Посвящение Троцкому, Диего и я, Корни, Фрида и Диего Ривера, Время летит. Зеркало: 18th Century Venetian Mirror, Bemberg Foundation (Commons, CC BY-SA 4.0, вырезано Magnific). Фото Фриды в постели за работой свободного нет, в ролике иллюстрация комнаты. Фото Фриды Кало 1932')
rt('"room": {"file"', '"mirror": {"file": "n29/img/mirror_fx.png", "size": [1149, 1794], "license": "CC BY-SA 4.0 (Bemberg Foundation, Commons)"},\n        "paintings": {"file": "n29/img/k0..k9.jpg", "size": [700, 900], "license": "Авторские права возможны; миниатюры en.wikipedia, fair use"},\n        "room": {"file"')
open(m, 'w', encoding='utf-8').write(t)
print('ok')
