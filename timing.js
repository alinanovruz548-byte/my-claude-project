// Тайминги: всё привязано к словам озвучки (public/words.json, получен Whisper из scripts/transcribe.py).
import words from './words.json';

export const FPS = 30;
export const W = 1080;
export const H = 1920;

export const ws = (i) => words[i].start;
export const we = (i) => words[i].end;

// ролик = озвучка + 2 секунды на финальный вопрос
export const TOTAL_SEC = Math.ceil((we(words.length - 1) + 2.0) * FPS) / FPS;
export const TOTAL_FRAMES = Math.round(TOTAL_SEC * FPS);

// сцены: [id, первое слово сцены]; конец сцены = начало следующей
const starts = [
  ['hook1', 0],
  ['hook2', 5],
  ['y1911', 11],
  ['e1', 16],
  ['e2', 20],
  ['e3', 25],
  ['years2', 28],
  ['e4', 33],
  ['map', 39],
  ['e5', 42],
  ['back', 46],
  ['fame', 56],
  ['q', 63],
];
export const SCENES = starts.map(([id, w], i) => {
  const a = i === 0 ? 0 : ws(w);
  const b = i + 1 < starts.length ? ws(starts[i + 1][1]) : TOTAL_SEC;
  return {id, a, b, dur: b - a};
});

// субтитры: слова озвучки, где год произносится тремя словами, на экране — цифрами
const MERGE = {12: {len: 3, text: '1911'}, 47: {len: 3, text: '1914'}};
const tokens = [];
for (let i = 0; i < words.length; ) {
  if (MERGE[i]) {
    tokens.push({text: MERGE[i].text, start: ws(i), end: we(i + MERGE[i].len - 1)});
    i += MERGE[i].len;
  } else {
    tokens.push({text: words[i].word.replace(/́/g, ''), start: ws(i), end: we(i)});
    i += 1;
  }
}
// фразы не рвём: новая фраза после знака препинания
const chunks = [];
let cur = [];
tokens.forEach((t) => {
  cur.push(t);
  if (/[.,:?!]$/.test(t.text)) {
    chunks.push(cur);
    cur = [];
  }
});
if (cur.length) chunks.push(cur);
export const CHUNKS = chunks.map((tk, k) => ({
  tokens: tk,
  start: tk[0].start - 0.06,
  end: k + 1 < chunks.length ? chunks[k + 1][0].start - 0.06 : TOTAL_SEC,
}));
