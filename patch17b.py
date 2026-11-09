base = r'C:\Users\awright\Desktop\Видео Клод'
p = base + r'\remotion\src\Board17.jsx'
s = open(p, encoding='utf-8').read()
R = [
    ("const SIDE_R = {x: 890, y: 1795, s: 0.8}, SIDE_L = {x: 190, y: 1795, s: 0.8};", "const SIDE_R = {x: 890, y: 1795, s: 0.72}, SIDE_L = {x: 190, y: 1795, s: 0.72};"),
    ("x: 1250, y: 1895, s: 0.8, pose: 'wave'", "x: 1250, y: 1895, s: 0.72, pose: 'wave'"),
    ("x: 1250, y: 1895, s: 0.8, pose: 'laugh'", "x: 1250, y: 1895, s: 0.72, pose: 'laugh'"),
    ("<Plaster x={50} y={560} w={440} h={640} at={16.9} t={t} />", "<Plaster x={50} y={520} w={440} h={600} at={16.9} t={t} />"),
    ("left: 60, width: 420, top: 600, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 24", "left: 60, width: 420, top: 550, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 24"),
    ("left: 590, top: 560, width: 440, height: 640, borderRadius: 14,", "left: 590, top: 520, width: 440, height: 600, borderRadius: 14,"),
    ("top: lerp(600, 600, 0) - Math.sin(moveCanvas * Math.PI) * 80, width: 380, height: 560,", "top: 560 - Math.sin(moveCanvas * Math.PI) * 80, width: 380, height: 520,"),
    ("top: 1230, textAlign: 'center', zIndex: 25}}>\n            <Kin txt=\"через полвека\"", "top: 1150, textAlign: 'center', zIndex: 25}}>\n            <Kin txt=\"через полвека\""),
    ("<Chip txt=\"сняли со стен\" at={18.3} t={t} x={80} y={1360} size={30} />", "<Chip txt=\"сняли со стен\" at={18.3} t={t} x={560} y={1290} size={30} />"),
    ("<Chip txt=\"перенесли на холст\" at={19.4} t={t} x={430} y={1440} size={30} bg=\"rgba(244,176,196,0.95)\" />", "<Chip txt=\"перенесли на холст\" at={19.4} t={t} x={470} y={1380} size={30} bg=\"rgba(244,176,196,0.95)\" />"),
    ("<Card x={100} y={540} w={330} h={560} at={9.0}", "<Card x={100} y={540} w={330} h={520} at={9.0}"),
    ("<Plaster x={60} y={350} w={960} h={900} at={8.6} t={t} />", "<Plaster x={60} y={350} w={960} h={830} at={8.6} t={t} />"),
    ("<Card x={100} y={1130} w={620} h={150} at={11.5}", "<Card x={100} y={1010} w={620} h={150} at={11.5}"),
]
for x, y in R:
    assert x in s, x[:60]
    s = s.replace(x, y)
open(p, 'w', encoding='utf-8').write(s)
c = open(base + r'\CLAUDE.md', encoding='utf-8').read()
c = c.replace("Сделаны видео 1–16; следующее 17.", "Сделаны видео 1–17; следующее 18.")
c += """
Видео 17 (n17, `"style": "board17"`, `output/goya_n17.mp4`, «Стены кошмаров», Гойя): тот же светлый стиль, что 16b, но много хуков и переходов и собака БЕЗ привязки к голосу: `KEYS` в `remotion/src/Board17.jsx` расписывает собаку (позиция, поза, взгляд) каждые 2-3 с, она бегает между углами, прыгает, умывается, смеётся; два перехода «смах лапой через весь экран» (3,2 и 13,4 с), следующая сцена открывается по левому краю собаки (`clipFrom`). Хук: клип «собака рисует на мольберте» (MiniMax Hailuo 3.0 Turbo, 200 кредитов, start frame shiba2_b; Kling 2.5 был «at full capacity») без вырезки, 0–3,9 с. Сцены: Гойя (портрет Лопеса PD), 1819 и «Дом глухого», стена-штукатурка с «Чёрными картинами» (Собака, Ведьмин шабаш, Паломничество; Сатурн только названием), «названия дал не Гойя» с зачёркиванием, перенос стена -> холст, Прадо, финал «Кошмары или гениальность?». Код gen: `scripts/gen_n17.py`. Озвучка Polina Volkova темп 1,32. Картины Laurent 1874 (CC BY-SA) не использованы.
"""
open(base + r'\CLAUDE.md', 'w', encoding='utf-8').write(c)
print('ok')
