"""Сценарий видео 9 «Юдифь Артемизии» (метка n9), стиль aurora + коллаж. После запуска JSON правим вручную."""
import json

base = r'C:\Users\awright\Desktop\Видео Клод'

# Main.jsx: сцены видео 9; Aurora.jsx: путь фона-обложки из сценария
p = base + r'\remotion\src\Main.jsx'
s = open(p, encoding='utf-8').read()
if 'Extra9' not in s:
    s = s.replace("import {Duel, Ages, Tally, Tiles26} from './Extra7';", "import {Duel, Ages, Tally, Tiles26} from './Extra7';\nimport {Hero9, Court9, Doc9, Press9, Truth9, Power9, Academy9} from './Extra9';", 1)
    s = s.replace("          : s.type === 'duel' ? <Duel dur={dur} scene={s} />",
                  "          : s.type === 'hero9' ? <Hero9 dur={dur} scene={s} />\n          : s.type === 'court9' ? <Court9 dur={dur} scene={s} />\n          : s.type === 'doc9' ? <Doc9 dur={dur} scene={s} />\n"
                  "          : s.type === 'press9' ? <Press9 dur={dur} scene={s} />\n          : s.type === 'truth9' ? <Truth9 dur={dur} scene={s} />\n          : s.type === 'power9' ? <Power9 dur={dur} scene={s} />\n"
                  "          : s.type === 'academy9' ? <Academy9 dur={dur} scene={s} />\n          : s.type === 'duel' ? <Duel dur={dur} scene={s} />", 1)
    open(p, 'w', encoding='utf-8').write(s)
p = base + r'\remotion\src\Aurora.jsx'
s = open(p, encoding='utf-8').read()
if "script.bg ||" not in s:
    s = s.replace("staticFile('n8/img/bg_grain.jpg')} style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: idx === 0 ? 1 : 1 - k}}", "staticFile(script.bg || 'n8/img/bg_grain.jpg')} style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: idx === 0 ? 1 : 1 - k}}", 1)
    s = s.replace("          : s.type === 'compare' ? <CompareC dur={dur} scene={s} />", "          : s.type === 'compare' ? <CompareC dur={dur} scene={s} />\n          : s.type === 'plate9' ? <Plate dur={dur} scene={s} />", 1)
    open(p, 'w', encoding='utf-8').write(s)

W = open(base + r'\build\n9\text.txt', encoding='utf-8').read().strip()
ws = W.split()


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


caps = [cap(0, 3), cap(4, 7), [["В", 8, 8], ["1612", 9, 11], ["году", 12, 12]], cap(13, 17), cap(18, 21), cap(22, 23), cap(24, 28), cap(29, 34), cap(35, 38), cap(39, 40),
        cap(41, 47), cap(48, 52), cap(53, 57), cap(58, 61), cap(62, 64)]

IM = lambda f, w, h, lic: {"file": "n9/img/" + f, "size": [w, h], "license": lic}

S = {
    "title": "Юдифь Артемизии", "style": "aurora", "bg": "n9/img/bg_tex.jpg", "week": 2, "number": 9, "rubric": "Г · Судьбы художников",
    "width": 1080, "height": 1920, "fps": 30, "output": "artemisia_n9.mp4",
    "voiceover": "assets/audio/voiceover_n9.mp3", "voiceover_text": W, "tail": 0.8,
    "music_file": "assets/audio/music_n9.mp3", "music_vol": 0.5,
    "sources": [
        "Wikipedia: Artemisia Gentileschi (суд над Агостино Тасси в Риме в 1612; показания проверялись под давлением, она повторяла свои слова; «Юдифь, обезглавливающая Олоферна», около 1612-1613, Неаполь, и вторая версия около 1620, Уффици; в 1616 принята в Академию рисунка во Флоренции, первая женщина-член)",
        "ВАЖНО: тема чувствительная. В ролике нет подробностей преступления и насилия, только факты суда и творчество; в озвучке «показания проверяли под давлением». Слова «это правда» на экране соответствуют известной записи протокола, но точная форма фразы в источниках может немного отличаться",
        "Дату принятия в Академию (1616) стоит сверить по второму источнику; в ролике на удостоверении указан 1616",
        "Агостино Тасси на экране без портрета (подписи-ленты), так как надёжного портрета нет",
    ],
    "images": {
        "naples": IM("n9_01_naples.jpg", 1920, 2418, "Public domain (Артемизия Джентилески, Юдифь и Олоферн, Каподимонте, Неаполь, Wikimedia Commons)"),
        "uffizi": IM("n9_05_uffizi_clean.jpg", 1920, 2370, "Public domain (Артемизия Джентилески, Юдифь, обезглавливающая Олоферна, Уффици, Google Art Project, Wikimedia Commons)"),
        "self": IM("n9_03_self.jpg", 1920, 2593, "Public domain (Артемизия Джентилески, Автопортрет в образе Живописи, Королевская коллекция, Wikimedia Commons)"),
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО · АРТЕМИЗИЯ", "nodes": [{"label": "1612", "sub": "суд", "at": 8}, {"label": "Юдифь", "sub": "картина", "at": 35}, {"label": "1616", "sub": "академия", "at": 48}]},
    "scenes": [
        {"id": 1, "type": "hero9", "from": 0, "mood": "blue", "judithAt": 2, "womanAt": 4, "courtAt": 7},
        {"id": 2, "type": "court9", "from": 8, "mood": "deep", "trans": "ribbon", "yearAt": 9, "portAt": 15, "nameAt": 16},
        {"id": 3, "type": "versus9", "from": 18, "mood": "deep", "trans": "tornPaper", "herAt": 18, "vsAt": 19, "teacherAt": 21, "tassiAt": 22},
        {"id": 4, "type": "press9", "from": 24, "mood": "dawn", "trans": "inkBloom", "tapeAt": 25, "rampAt": 26},
        {"id": 5, "type": "truth9", "from": 29, "mood": "blue", "trans": "splitBars", "sayAt": 31, "tapeAt": 32, "checkAt": 33},
        {"id": 6, "type": "plate9", "from": 35, "mood": "dawn", "trans": "stripes", "image": "naples", "frame": "gold", "w": 740, "h": 930, "top": 520, "badge": "Неаполь · 1612–1613", "chip": "Каподимонте", "punches": [39],
         "shots": [{"at": 35, "focus": [0.5, 0.5], "zoom": 1}, {"at": 39, "focus": [0.78, 0.2], "zoom": 2.5, "ring": {"rx": 105, "ry": 120, "dx": 55, "dy": -12}}]},
        {"id": 7, "type": "power9", "from": 41, "mood": "gold", "trans": "confetti", "powerAt": 47},
        {"id": 8, "type": "academy9", "from": 48, "mood": "deep", "trans": "pageFlip", "nameAt": 49, "sealAt": 51, "womanAt": 52, "cityAt": 56},
        {"id": 9, "type": "question9", "from": 58, "mood": "gold", "trans": "dust", "text": "Почему эта картина так сильна?"},
    ],
    "sfx": {"swoosh": "assets/audio/sfx8/t_whoosh.mp3", "stamp": "assets/audio/sfx8/t_pulse.mp3", "ding": "assets/audio/sfx8/t_ting.mp3", "tick": "assets/audio/sfx_tick.mp3",
            "whoosh": "assets/audio/sfx8/t_whoosh.mp3", "ting": "assets/audio/sfx8/t_ting.mp3", "pulse": "assets/audio/sfx8/t_pulse.mp3", "riser": "assets/audio/sfx8/t_riser.mp3",
            "shing": "assets/audio/sfx8/t_shing.mp3", "projector": "assets/audio/sfx8/t_whoosh.mp3", "curtain": "assets/audio/sfx8/t_ting.mp3",
            "gavel": "assets/audio/sfx9/t_gavel.mp3", "quill": "assets/audio/sfx9/t_quill.mp3"},
    "events": [
        {"sfx": "whoosh", "at": 2, "dt": 0.1, "vol": 0.3}, {"sfx": "whoosh", "at": 4, "dt": 0.1, "vol": 0.3}, {"sfx": "gavel", "at": 7, "dt": 0.0, "vol": 0.7},
        {"sfx": "ting", "at": 9, "dt": 0.1, "vol": 0.3}, {"sfx": "pulse", "at": 15, "dt": 0.1, "vol": 0.4},
        {"sfx": "quill", "at": 18, "dt": 0.0, "vol": 0.5}, {"sfx": "gavel", "at": 19, "dt": 0.0, "vol": 0.6}, {"sfx": "quill", "at": 22, "dt": 0.0, "vol": 0.5},
        {"sfx": "riser", "at": 26, "dt": 0.0, "vol": 0.35}, {"sfx": "pulse", "at": 28, "dt": 0.0, "vol": 0.5},
        {"sfx": "quill", "at": 31, "dt": 0.0, "vol": 0.4}, {"sfx": "ting", "at": 33, "dt": 0.0, "vol": 0.35}, {"sfx": "ting", "at": 33, "dt": 0.2, "vol": 0.35}, {"sfx": "ting", "at": 33, "dt": 0.4, "vol": 0.35},
        {"sfx": "pulse", "at": 39, "dt": 0.0, "vol": 0.4},
        {"sfx": "pulse", "at": 47, "dt": 0.0, "vol": 0.6}, {"sfx": "shing", "at": 47, "dt": 0.0, "vol": 0.4},
        {"sfx": "quill", "at": 49, "dt": 0.0, "vol": 0.4}, {"sfx": "pulse", "at": 51, "dt": 0.0, "vol": 0.7}, {"sfx": "ting", "at": 52, "dt": 0.0, "vol": 0.4},
    ],
}
json.dump(S, open(base + r'\script_n9.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('ok')
