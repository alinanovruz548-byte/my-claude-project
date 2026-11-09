"""Сценарий видео 6 «Самый украденный шедевр» (Гентский алтарь, метка n6), светлый стиль. После запуска JSON правим вручную."""
import json
import re

base = r'C:\Users\awright\Desktop\Видео Клод'

# патчи Main.jsx: сцены theft/ransom/deathbed, ночной слой на фото
p = base + r'\remotion\src\Main.jsx'
s = open(p, encoding='utf-8').read()
if 'Extra6' not in s:
    s = s.replace("import {Calendar, Gallery, Lineup, Smile, Flip} from './Extra';",
                  "import {Calendar, Gallery, Lineup, Smile, Flip} from './Extra';\nimport {Theft, Ransom, Deathbed} from './Extra6';", 1)
    s = s.replace("          : s.type === 'flip' ? <Flip dur={dur} scene={s} />",
                  "          : s.type === 'flip' ? <Flip dur={dur} scene={s} />\n          : s.type === 'theft' ? <Theft dur={dur} scene={s} />\n"
                  "          : s.type === 'ransom' ? <Ransom dur={dur} scene={s} />\n          : s.type === 'deathbed' ? <Deathbed dur={dur} scene={s} />", 1)
    night = """            {scene.night && (
              <div style={{position: 'absolute', inset: 0}}>
                <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(8,14,60,0.72), rgba(10,18,70,0.45))'}} />
                {Array.from({length: 18}).map((_, i) => (
                  <div key={i} style={{position: 'absolute', left: (i * 211) % 860, top: (i * 97) % 300, width: 5, height: 5, borderRadius: '50%', background: '#fff',
                    opacity: 0.4 + 0.5 * Math.abs(Math.sin(f / 9 + i))}} />
                ))}
                <div style={{position: 'absolute', right: 60, top: 40, width: 150, height: 150, borderRadius: '50%', background: '#F6EBC0', boxShadow: '0 0 80px 30px rgba(246,235,192,0.5)',
                  transform: `translateY(${Math.sin(f / 20) * 6}px)`}}>
                  <div style={{position: 'absolute', left: 38, top: 20, width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.07)'}} />
                </div>
              </div>
            )}
"""
    anchor = "            {cut ? <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: 0.55 * Math.exp(-sf / 2.5)}} /> : null}\n"
    assert anchor in s
    s = s.replace(anchor, anchor + night, 1)
    open(p, 'w', encoding='utf-8').write(s)

W = open(base + r'\build\n6\text.txt', encoding='utf-8').read().strip()
ws = W.split()


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


caps = [cap(0, 2), cap(3, 5), cap(6, 9),
        [["В", 10, 10], ["ночь", 11, 11], ["на", 12, 12], ["10", 13, 13], ["апреля", 14, 14]],
        [["1934", 15, 18], ["года", 19, 19]], cap(20, 22), cap(23, 24), cap(25, 28), cap(29, 32), cap(33, 36), cap(37, 40), cap(41, 43),
        cap(44, 46), cap(47, 49), cap(50, 54), cap(55, 59), cap(60, 62), cap(63, 64)]

S = {
    "title": "Самый украденный шедевр", "week": 1, "number": 6, "rubric": "А · Арт-детектив",
    "width": 1080, "height": 1920, "fps": 30, "output": "ghent_altarpiece_n6.mp4",
    "voiceover": "assets/audio/voiceover_n6.mp3", "voiceover_text": W, "tail": 0.8,
    "music_file": "assets/audio/music_n6.mp3", "music_vol": 0.5,
    "sources": [
        "Wikipedia: The Just Judges (кража в ночь на 10 апреля 1934, письма за подписью D.U.A., требование 1 000 000 бельгийских франков, возвращена створка Иоанна Крестителя, «Праведные судьи» не найдены)",
        "Арсен Гудертье (подозреваемый) умер 25 ноября 1934, перед смертью сказал адвокату, что только он знает, где створка; улики косвенные, поэтому в ролике он назван «подозреваемым»",
        "Копия «Праведных судей» работы Яна ван дер Векена висит на месте оригинала (по Wikipedia, написана в 1939 году)",
        "ВАЖНО: в источниках расходятся детали, куда вор подложил возвращённую створку (Брюссель или Гент); в ролике не называется. Письмо на экране это реконструкция, текст придуман",
        "Не использовано как неподтверждённое: «13 краж» (Britannica называет алтарь «самым украденным произведением», в найденных отрывках число не подтверждено)",
    ],
    "images": {
        "all": {"file": "n6/img/n6_01_all.jpg", "size": [2200, 1609], "license": "Public domain (Ван Эйки, Гентский алтарь, Wikimedia Commons: Lamgods open.jpg)"},
        "orig": {"file": "n6/img/n6_02_judges_orig.jpg", "size": [900, 2442], "license": "Public domain (фото Макса Фридлендера, оригинал «Праведных судей» до кражи, Wikimedia Commons)"},
        "copy": {"file": "n6/img/n6_03_judges_copy.jpg", "size": [634, 1785], "license": "Public domain (копия ван дер Векена, Wikimedia Commons: Ghent Altarpiece E - Just Judges by Vanderveken.jpg)"},
        "closed": {"file": "n6/img/n6_04_closed.jpg", "size": [1019, 1400], "license": "Public domain (Ван Эйки, Гентский алтарь, закрытый, WGA, Wikimedia Commons)"},
        "cathedral": {"file": "n6/img/n6_05_cathedral.jpg", "size": [1920, 2880], "license": "CC BY-SA 3.0 (Mylius, Wikimedia Commons: Gent-Sint-Baafskathedraal vom Belfried aus gesehen.jpg); указать автора Mylius"},
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО · ГЕНТСКИЙ АЛТАРЬ", "nodes": [
        {"label": "1934", "sub": "кража", "at": 10}, {"label": "Выкуп", "sub": "письма", "at": 29},
        {"label": "Тайна", "sub": "умер", "at": 44}, {"label": "Копия", "sub": "вместо", "at": 55}]},
    "scenes": [
        {"id": 1, "type": "sneak", "from": 0, "image": "all", "stealAt": 2, "hideAt": 3, "seekAt": 7, "stampAt": 9},
        {"id": 2, "type": "card", "from": 10, "trans": "ink", "image": "cathedral", "tilt": 2, "focus": [0.5, 0.35], "fit": True, "h": 1000, "top": 400,
         "badge": "Улика №1", "chip": "Собор св. Бавона · Гент", "night": True,
         "bgYear": {"from": 1930, "to": 1934, "at": 15}, "punches": [15],
         "shots": [{"at": 10, "focus": [0.5, 0.5], "zoom": 1}], "stamp": {"text": "10 АПРЕЛЯ", "at": 13, "angle": -8, "pos": {"right": 0, "top": 780}}},
        {"id": 3, "type": "theft", "from": 20, "trans": "glitch", "image": "all", "region": [0.0015, 0.589, 0.113, 0.374], "liftAt": 21, "awayAt": 26, "tagAt": 23},
        {"id": 4, "type": "ransom", "from": 29, "trans": "slices", "sigAt": 36,
         "lines": [{"text": "ВЫКУП", "at": 31, "w": 118, "h": 140, "size": 96},
                   {"text": "1 000 000", "at": 35, "w": 76, "h": 120, "size": 80},
                   {"text": "ФРАНКОВ", "at": 36, "w": 106, "h": 130, "size": 84}]},
        {"id": 5, "type": "card", "from": 37, "trans": "shatter", "image": "closed", "tilt": -2, "focus": [0.36, 0.78], "badge": "Улика №4",
         "chip": "Створка Иоанна Крестителя", "punches": [41],
         "shots": [{"at": 37, "focus": [0.36, 0.78], "zoom": 1.7, "note": {"text": "ВЕРНУЛ", "pos": [30, 30], "angle": -6}},
                   {"at": 41, "image": "orig", "focus": [0.5, 0.6], "zoom": 1, "note": {"text": "НЕТ", "pos": [60, 40], "angle": -6}}],
         },
        {"id": 6, "type": "grave", "from": 44, "trans": "circle", "monthsAt": 44, "walkAt": 44, "fallAt": 48, "sayAt": 50},
        {"id": 7, "type": "card", "from": 55, "trans": "spin", "image": "copy", "tilt": 2, "focus": [0.5, 0.5], "badge": "Улика №6", "chip": "Копия ван дер Векена",
         "punches": [59],
         "shots": [{"at": 55, "image": "orig", "focus": [0.5, 0.6], "zoom": 1}, {"at": 58, "focus": [0.5, 0.5], "zoom": 1}],
         "stamp": {"text": "КОПИЯ", "at": 59, "angle": -8}},
        {"id": 8, "type": "question", "from": 60, "trans": "flash", "text": "Где спрятана створка?"},
    ],
    "sfx": {"swoosh": "assets/audio/sfx_swoosh.mp3", "stamp": "assets/audio/sfx_stamp.mp3", "ding": "assets/audio/sfx_ding.mp3", "tick": "assets/audio/sfx_tick.mp3",
            "curtain": "assets/audio/sfx_swoosh.mp3", "boom": "assets/audio/sfx_stamp.mp3", "shutter": "assets/audio/sfx_tick.mp3", "quill": "assets/audio/sfx_tick.mp3",
            "projector": "assets/audio/sfx_swoosh.mp3", "bell": "assets/audio/sfx6/t_bell.mp3", "steps": "assets/audio/sfx6/t_steps.mp3",
            "envelope": "assets/audio/sfx6/t_envelope.mp3", "flash": "assets/audio/sfx6/t_flash.mp3", "type": "assets/audio/sfx6/t_type.mp3"},
    "events": [
        {"sfx": "steps", "at": 0, "dt": 0.1, "vol": 0.35}, {"sfx": "swoosh", "at": 2, "dt": 0.5, "vol": 0.35}, {"sfx": "stamp", "at": 3, "dt": 1.1, "vol": 0.5},
        {"sfx": "tick", "at": 7, "dt": 0.5, "vol": 0.35}, {"sfx": "tick", "at": 7, "dt": 0.7, "vol": 0.35},
        {"sfx": "bell", "at": 10, "dt": 0.0, "vol": 0.35}, {"sfx": "steps", "at": 20, "dt": 0.0, "vol": 0.35},
        {"sfx": "flash", "at": 21, "dt": 0.1, "vol": 0.3},
        {"sfx": "envelope", "at": 29, "dt": 0.0, "vol": 0.6}, {"sfx": "type", "at": 31, "dt": 0.0, "vol": 0.4},
        {"sfx": "type", "at": 35, "dt": 0.0, "vol": 0.4}, {"sfx": "type", "at": 36, "dt": 0.2, "vol": 0.4},
        {"sfx": "steps", "at": 44, "dt": 0.0, "vol": 0.3}, {"sfx": "swoosh", "at": 48, "dt": 0.1, "vol": 0.35}, {"sfx": "stamp", "at": 48, "dt": 0.6, "vol": 0.5},
        {"sfx": "bell", "at": 49, "dt": 0.0, "vol": 0.4}, {"sfx": "type", "at": 50, "dt": 0.0, "vol": 0.35},
        {"sfx": "flash", "at": 58, "dt": 0.05, "vol": 0.3},
    ],
}
json.dump(S, open(base + r'\script_n6.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
