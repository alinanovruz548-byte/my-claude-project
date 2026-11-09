"""Тайминги слов озвучки для Remotion-версии.

python scripts/transcribe.py <озвучка.mp3> <текст.txt> <words.json>
Текст — то, что произносит голос (даты словами). Слова Whisper выравниваются по этому тексту,
лишние слова Whisper (например «Редактор субтитров…» в конце) отбрасываются.
"""
import difflib
import json
import re
import subprocess
import sys

import numpy as np


def norm(s):
    return re.sub(r"[^\w]", "", s.lower().replace("́", "").replace("ё", "е"))


def main(audio_path, text_path, out_path):
    from faster_whisper import WhisperModel
    text = open(text_path, encoding="utf-8").read().strip()
    # декодируем через ffmpeg: декодер PyAV в faster-whisper несовместим с установленной версией av
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", audio_path, "-f", "f32le", "-ac", "1", "-ar", "16000", "-"],
                         capture_output=True, check=True).stdout
    audio = np.frombuffer(raw, dtype=np.float32)
    model = WhisperModel("small", device="cpu", compute_type="int8")
    script = [w.replace("́", "") for w in text.split()]

    def run(prompt):
        segs, _ = model.transcribe(audio, language="ru", word_timestamps=True, initial_prompt=prompt)
        words = [{"word": w.word.strip(), "start": w.start, "end": w.end} for s in segs for w in s.words]
        sm = difflib.SequenceMatcher(None, [norm(w) for w in script], [norm(w["word"]) for w in words], autojunk=False)
        return words, sm, sum(n for _, _, n in sm.get_matching_blocks())

    words, sm, matched = run(text.replace("́", ""))
    if matched < 0.75 * len(script):  # подсказка иногда ломает распознавание: пробуем без неё
        words, sm, matched = run(None)
    out = [None] * len(script)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n):
            out[a + k] = {"word": script[a + k], "start": round(words[b + k]["start"], 3), "end": round(words[b + k]["end"], 3)}
    for i, w in enumerate(out):  # слова без пары: время берём между соседями
        if w is None:
            prev = next((out[j] for j in range(i - 1, -1, -1) if out[j]), None)
            nxt = next((out[j] for j in range(i + 1, len(out)) if out[j]), None)
            s = prev["end"] if prev else 0.0
            out[i] = {"word": script[i], "start": s, "end": max(nxt["start"] if nxt else s + 0.3, s + 0.1)}
    matched = sum(n for _, _, n in sm.get_matching_blocks())
    json.dump(out, open(out_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"слов в тексте {len(script)}, Whisper нашёл {len(words)}, совпало {matched} -> {out_path}")


if __name__ == "__main__":
    main(*sys.argv[1:4])
