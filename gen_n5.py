"""Заготовка script_n5.json (видео 5 «Ночной дозор» не ночной), стиль noir. Дальше правим JSON вручную."""
import json

W = open("build/n5/text.txt", encoding="utf-8").read().strip()
ws = W.split()


def cap(a, b):
    return [[ws[i], i, i] for i in range(a, b + 1)]


caps = [cap(0, 2), cap(3, 5), cap(6, 9), cap(10, 13), cap(14, 16), cap(17, 19), cap(20, 22), cap(23, 24), cap(25, 27),
        [["в", 28, 28], ["1940-х", 29, 29], ["годах,", 30, 30]], cap(31, 33), cap(34, 36), cap(37, 38),
        [["в", 39, 39], ["1715", 40, 42], ["году", 43, 43]], cap(44, 45), cap(46, 50), cap(51, 54), cap(55, 58), cap(59, 61), cap(62, 64)]

S = {
    "title": "Ночной дозор не ночной", "style": "noir", "week": 1, "number": 5, "rubric": "А · Арт-детектив",
    "width": 1080, "height": 1920, "fps": 30, "output": "night_watch_n5.mp4",
    "voiceover": "assets/audio/voiceover_n5.mp3", "voiceover_text": W, "tail": 0.8,
    "music_file": "assets/audio/music_n5.mp3", "music_vol": 0.5,
    "sources": [
        "Wikipedia: The Night Watch (тёмный лак и копоть дали ложное название; лак сняли в 1940-х; в 1715 году при переезде в ратушу Амстердама картину обрезали со всех сторон, потеряны две фигуры слева)",
        "Rijksmuseum Bulletin: отчёт о реставрации 1946-1947 (van Schendel, Mertens); точный год снятия лака в ролике не называется, сказано «в сороковых»",
        "ВАЖНО: на экране «так картина выглядела под лаком» - иллюстрация (картина затемнена фильтром), не исторический снимок; границы обрезки на копии Лундена приблизительные",
    ],
    "images": {
        "watch": {"file": "n5/img/n5_01_watch.jpg", "size": [2000, 1675], "license": "Public domain (Rembrandt, The Night Watch 1642, Rijksmuseum, Wikimedia Commons: The Night Watch - HD.jpg)"},
        "lundens": {"file": "n5/img/n5_02_lundens.jpg", "size": [1920, 1504], "license": "Public domain (Gerrit Lundens, копия «Ночного дозора», ок. 1655, National Gallery London, Wikimedia Commons)"},
        "hall": {"file": "n5/img/n5_04_hall.jpg", "size": [1058, 800], "license": "Public domain (Gerrit Berckheyde, View of the Dam with the Town Hall, WGA, Wikimedia Commons)"},
    },
    "captions": caps,
    "diagram": {"title": "ДЕЛО №5 · ТАЙНА КАРТИНЫ", "nodes": [
        {"label": "ДЕНЬ", "sub": "не ночь", "at": 6}, {"label": "ЛАК", "sub": "потемнел", "at": 10},
        {"label": "1940-е", "sub": "очистка", "at": 25}, {"label": "1715", "sub": "обрезка", "at": 37},
        {"label": "?", "sub": "вопрос", "at": 55}]},
    "scenes": [
        {"id": 1, "type": "hook", "from": 0, "image": "watch", "smallAt": 3, "strikeAt": 4},
        {"id": 2, "type": "day", "from": 6, "trans": "burn", "image": "watch"},
        {"id": 3, "type": "darken", "from": 10, "trans": "curtain", "image": "watch", "darkFrom": 11, "darkTo": 16, "plaque": {"at": 23}},
        {"id": 4, "type": "clean", "from": 25, "trans": "blinds", "image": "watch", "wipeFrom": 26, "wipeTo": 33, "labelAt": 29, "label": "1940-е",
         "stamp": {"text": "СОЛНЦЕ", "at": 36}},
        {"id": 5, "type": "hall", "from": 37, "trans": "iris", "image": "hall", "year": 1715, "yearAt": 40},
        {"id": 6, "type": "cut", "from": 44, "trans": "tear", "image": "lundens", "cutAt": 45, "lostAt": 52, "crop": [0.13, 0.07, 0.985, 0.97]},
        {"id": 7, "type": "question", "from": 55, "trans": "scan", "text": "Что мы ещё не видим в старых шедеврах?"},
    ],
    "sfx": {"swoosh": "assets/audio/sfx5/curtain.mp3", "stamp": "assets/audio/sfx5/boom.mp3", "ding": "assets/audio/sfx5/spot.mp3",
            "tick": "assets/audio/sfx5/shutter.mp3", "projector": "assets/audio/sfx5/projector.mp3", "quill": "assets/audio/sfx5/quill.mp3",
            "spot": "assets/audio/sfx5/spot.mp3", "shutter": "assets/audio/sfx5/shutter.mp3", "boom": "assets/audio/sfx5/boom.mp3",
            "curtain": "assets/audio/sfx5/curtain.mp3"},
    "events": [
        {"sfx": "projector", "at": 0, "dt": 0, "vol": 0.6},
        {"sfx": "boom", "at": 4, "dt": 0.05, "vol": 0.8},
        {"sfx": "boom", "at": 6, "dt": 0.12, "vol": 0.7},
        {"sfx": "quill", "at": 11, "dt": 0, "vol": 0.5},
        {"sfx": "boom", "at": 23, "dt": 0.05, "vol": 0.8},
        {"sfx": "spot", "at": 26, "dt": -0.1, "vol": 0.6},
        {"sfx": "shutter", "at": 40, "dt": 0.15, "vol": 0.5}, {"sfx": "shutter", "at": 40, "dt": 0.3, "vol": 0.5},
        {"sfx": "shutter", "at": 40, "dt": 0.45, "vol": 0.5}, {"sfx": "boom", "at": 41, "dt": 0.1, "vol": 0.7},
        {"sfx": "quill", "at": 45, "dt": 0, "vol": 0.6, "filter": "highpass=f=1500"},
        {"sfx": "boom", "at": 52, "dt": 0.05, "vol": 0.6, "filter": "lowpass=f=900"},
    ],
}
json.dump(S, open("script_n5.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
