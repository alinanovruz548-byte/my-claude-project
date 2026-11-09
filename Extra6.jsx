import React from 'react';
import {useCurrentFrame, spring, interpolate, Easing, staticFile} from 'remotion';
import {script} from './current';
import {C, TITLE, BODY, clamp, ease, rel, rnd, useFx, Badge, Chip, Stage} from './Extra';

// Сцены видео 6 (Гентский алтарь): кража створки, письма вымогателя, смерть подозреваемого.
const ChipAt = ({text, p, y}) => (
  <div style={{position: 'absolute', left: 0, top: y, width: 1080, height: 0}}><Chip text={text} p={p} bottom={0} /></div>
);

// --- кража: створка отрывается от алтаря и уплывает ---------------------------------------
export const Theft = ({dur, scene}) => {
  const {f, fps, inP, out} = useFx(dur);
  const img = script.images[scene.image];
  const [rx, ry, rw, rh] = scene.region;
  const W = 880, H = Math.round(W * img.size[1] / img.size[0]);
  const liftAt = rel(scene.liftAt, scene, fps), awayAt = rel(scene.awayAt, scene, fps), tagAt = rel(scene.tagAt, scene, fps);
  const lift = interpolate(f, [liftAt, liftAt + 14], [0, 1], {...clamp, easing: ease});
  const away = interpolate(f, [awayAt, awayAt + 16], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const px = rx * W, py = ry * H, pw = rw * W, ph = rh * H;
  const tag = spring({frame: f - tagAt, fps, config: {damping: 9, stiffness: 190}});
  const S = 1 + 1.7 * lift;
  const dx = lift * (300 - px) + away * 700, dy = lift * (-60 - py) - away * 900;
  return (
    <Stage inP={inP} out={out} rot={-1}>
      <div style={{position: 'absolute', left: 100, top: 560, width: W, height: H}}>
        <div style={{position: 'absolute', inset: -14, borderRadius: 30, background: '#fff', boxShadow: '0 36px 70px rgba(30,30,30,0.25)'}} />
        <div style={{position: 'absolute', inset: 0, backgroundImage: `url(${staticFile(img.file)})`, backgroundSize: '100% 100%'}} />
        {f >= liftAt && (
          <div style={{position: 'absolute', left: px, top: py, width: pw, height: ph, background: '#E9E2D3', border: `5px dashed ${C.blue}`, boxSizing: 'border-box',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TITLE, fontWeight: 900, fontSize: 50, color: C.blue}}>?</div>
        )}
        {lift > 0 && away < 1 && (
          <div style={{position: 'absolute', left: px, top: py, width: pw, height: ph, zIndex: 12, transformOrigin: '0 0',
            transform: `translate(${dx}px, ${dy}px) rotate(${-5 * lift + away * 12}deg) scale(${S})`, border: '5px solid #fff', boxSizing: 'border-box',
            boxShadow: '0 30px 50px rgba(0,0,0,0.45)', backgroundImage: `url(${staticFile(img.file)})`, backgroundSize: `${W}px ${H}px`, backgroundPosition: `${-px}px ${-py}px`}} />
        )}
        <div style={{position: 'absolute', left: -14, top: -58, zIndex: 20, width: 420}}><Badge text="Улика №2" p={inP} /></div>
      </div>
      {f >= tagAt && (
        <div style={{position: 'absolute', left: 250, top: 1290, zIndex: 25, padding: '14px 34px', borderRadius: 14, background: C.blue, color: '#fff', fontFamily: TITLE, fontWeight: 900,
          fontSize: 58, whiteSpace: 'nowrap', transform: `rotate(-3deg) scale(${interpolate(tag, [0, 1], [2.2, 1])})`, opacity: Math.min(1, tag * 1.6), boxShadow: '0 16px 34px rgba(43,63,160,0.4)'}}>«Праведные судьи»</div>
      )}
      <ChipAt text="Собор св. Бавона · Гент" p={interpolate(f, [8, 20], [0, 1], clamp)} y={1275} />
    </Stage>
  );
};

// --- письма вымогателя: буквы, «вырезанные из газет» ------------------------------------------
const TILE_BG = ['#fff', '#F1E4C3', '#2B3FA0', '#1E1E1E', '#fff', '#E9DFC9', '#fff'];
const Tile = ({ch, k, w, h, size, p}) => {
  const bg = TILE_BG[Math.floor(rnd(k + 3) * TILE_BG.length)];
  const dark = bg === '#2B3FA0' || bg === '#1E1E1E';
  const fam = ['"Playfair Display", serif', 'Manrope, sans-serif', 'Georgia, serif'][Math.floor(rnd(k + 9) * 3)];
  return (
    <div style={{width: w, height: h, borderRadius: 4, background: bg, color: dark ? '#fff' : '#1E1E1E', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: fam, fontWeight: 900, fontStyle: rnd(k + 5) > 0.7 ? 'italic' : 'normal', fontSize: size, boxShadow: '0 6px 12px rgba(30,30,30,0.3)',
      transform: `rotate(${(rnd(k) - 0.5) * 12}deg) translateY(${(rnd(k + 1) - 0.5) * 14}px) scale(${interpolate(p, [0, 1], [2, 1])})`, opacity: Math.min(1, p * 2), margin: '0 5px'}}>{ch}</div>
  );
};

export const Ransom = ({dur, scene}) => {
  const {f, fps, inP, out} = useFx(dur);
  let kk = 0;
  const sigAt = rel(scene.sigAt, scene, fps);
  return (
    <Stage inP={inP} out={out} rot={2}>
      <div style={{position: 'absolute', left: 130, top: 470, width: 820, height: 900, background: '#FBF6E8', borderRadius: 10, boxShadow: '0 36px 70px rgba(30,30,30,0.3)',
        backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 58px, rgba(43,63,160,0.08) 58px 60px)'}}>
        <div style={{position: 'absolute', left: 280, top: -22, width: 190, height: 48, background: 'rgba(212,166,74,0.75)', transform: 'rotate(2deg)'}} />
        {scene.lines.map((ln, li) => {
          const start = rel(ln.at, scene, fps);
          return (
            <div key={li} style={{position: 'absolute', left: 0, right: 0, top: 80 + li * 240, display: 'flex', justifyContent: 'center'}}>
              {ln.text.split('').map((ch, i) => {
                const k = (kk++) + 1;
                if (ch === ' ') return <div key={i} style={{width: 34}} />;
                const p = spring({frame: f - start - i * 2.2, fps: 30, config: {damping: 10, stiffness: 220}});
                return f >= start + i * 2.2 ? <Tile key={i} ch={ch} k={k} w={ln.w} h={ln.h} size={ln.size} p={p} /> : <div key={i} style={{width: ln.w + 10}} />;
              })}
            </div>
          );
        })}
        <div style={{position: 'absolute', right: 40, top: 760, display: 'flex'}}>
          {f >= sigAt && 'D.U.A.'.split('').map((ch, i) => <Tile key={i} ch={ch} k={90 + i} w={58} h={72} size={44} p={spring({frame: f - sigAt - i * 2, fps: 30, config: {damping: 9, stiffness: 220}})} />)}
        </div>
      </div>
      <div style={{position: 'absolute', left: 130, top: 470, width: 820}}><Badge text="Улика №3" p={inP} /></div>
      <ChipAt text="Реконструкция письма" p={interpolate(f, [8, 20], [0, 1], clamp)} y={1425} />
    </Stage>
  );
};

// --- подозреваемый умер, унеся тайну ----------------------------------------------------------------
export const Deathbed = ({dur, scene}) => {
  const {f, fps, inP, out} = useFx(dur);
  const months = ['АПР', 'МАЙ', 'ИЮН', 'ИЮЛ', 'АВГ', 'СЕН', 'ОКТ', 'НОЯ'];
  const m0 = rel(scene.monthsAt, scene, fps), whoAt = rel(scene.whoAt, scene, fps), crossAt = rel(scene.crossAt, scene, fps), sayAt = rel(scene.sayAt, scene, fps);
  const who = spring({frame: f - whoAt, fps, config: {damping: 12, stiffness: 130}});
  const say = 'Только я знаю,\nгде она.';
  const n = Math.max(0, Math.min(say.length, Math.floor((f - sayAt) * 0.8)));
  const bubble = spring({frame: f - sayAt + 4, fps, config: {damping: 10, stiffness: 160}});
  const cross = spring({frame: f - crossAt, fps, config: {damping: 8, stiffness: 200}});
  return (
    <Stage inP={inP} out={out} rot={0}>
      <div style={{position: 'absolute', left: 54, top: 580, width: 972}}>
        <div style={{display: 'flex', gap: 6}}>
          {months.map((mn, i) => {
            const on = f >= m0 + i * 5;
            const last = i === months.length - 1;
            return (
              <div key={mn} style={{width: 115, height: 110, borderRadius: 14, background: on ? (last ? C.ink : C.blue) : '#E7DFD0', color: on ? '#fff' : '#B5AC9C',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 34,
                transform: `scale(${on ? 1 : 0.94})`, boxShadow: on ? '0 10px 20px rgba(43,63,160,0.3)' : 'none', position: 'relative'}}>
                {mn}
                {last && f >= crossAt && (
                  <svg width="70" height="70" viewBox="-35 -35 70 70" style={{position: 'absolute', top: -50, left: 22, transform: `scale(${Math.min(cross, 1.2)})`}}>
                    <rect x="-6" y="-32" width="12" height="64" rx="3" fill="#fff" stroke={C.ink} strokeWidth="3" />
                    <rect x="-24" y="-14" width="48" height="12" rx="3" fill="#fff" stroke={C.ink} strokeWidth="3" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
        <div style={{marginTop: 14, fontFamily: BODY, fontWeight: 800, fontSize: 28, letterSpacing: 6, color: C.grey}}>1934</div>
      </div>
      <div style={{position: 'absolute', left: 70, top: 800, width: 380, height: 600, transform: `translateY(${(1 - Math.min(who, 1)) * 600}px)`, opacity: Math.min(1, who * 2)}}>
        <svg width="380" height="600" viewBox="0 0 380 600" style={{overflow: 'visible'}}>
          <circle cx="190" cy="150" r="105" fill={C.blue} />
          <path d="M10 560 L10 350 Q10 270 190 270 Q370 270 370 350 L370 560 Z" fill="#1F2F85" />
          <text x="190" y="195" textAnchor="middle" fontFamily="Playfair Display" fontWeight="900" fontSize="160" fill="#fff" opacity="0.9">?</text>
        </svg>
        <div style={{position: 'absolute', left: 20, top: 470, width: 340, padding: '10px 0', textAlign: 'center', background: '#fff', borderRadius: 12, fontFamily: BODY, fontWeight: 800, fontSize: 30,
          color: C.ink, boxShadow: '0 12px 24px rgba(30,30,30,0.25)'}}>ПОДОЗРЕВАЕМЫЙ</div>
      </div>
      {f >= sayAt - 4 && (
        <div style={{position: 'absolute', left: 450, top: 800, width: 570, height: 380, transform: `scale(${Math.min(bubble, 1.06)}) rotate(1deg)`, transformOrigin: '0 100%'}}>
          <svg width="570" height="380" viewBox="0 0 570 380" style={{position: 'absolute', left: 0, top: 0, filter: 'drop-shadow(0 20px 26px rgba(30,30,30,0.25))'}}>
            <path d="M50 0 H520 Q570 0 570 50 V260 Q570 310 520 310 H140 L40 380 L70 310 H50 Q0 310 0 260 V50 Q0 0 50 0 Z" fill="#fff" />
          </svg>
          <div style={{position: 'absolute', left: 36, top: 54, fontFamily: TITLE, fontWeight: 800, fontSize: 64, lineHeight: 1.18, color: C.ink, whiteSpace: 'pre'}}>
            {say.slice(0, n)}<span style={{opacity: n < say.length ? 1 : 0}}>|</span>
          </div>
        </div>
      )}
      <div style={{position: 'absolute', left: 54, top: 490, width: 420}}><Badge text="Улика №5" p={inP} /></div>
    </Stage>
  );
};
