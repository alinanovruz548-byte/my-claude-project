const CAM_STARTS = [3.65, 5.2, 9.9, 13.0, 16.4, 19.5];
const camAt = (t) => {
  let z = 1 + Math.sin(t / 1.7) * 0.012, rot = 0, px = 0, py = 0, blur = 0;
  CAM_STARTS.forEach((s, i) => {
    const dt = t - s;
    if (dt >= 0 && dt < 0.75) {
      const q = 1 - easeOut(dt / 0.75);
      const sg = i % 2 ? 1 : -1;
      z += (i % 3 === 0 ? 0.55 : i % 3 === 1 ? 0.7 : 0.35) * q;
      rot += sg * 6 * q; px += sg * 220 * q; py += (i % 2 ? -120 : 160) * q; blur = Math.max(blur, q * 7);
    }
  });
  return {z, rot, px, py, blur};
};

export const Board18Main = () => {
  useFonts();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const k = (a, b, ease = easeIO) => interpolate(t, [a, b], [0, 1], {...clamp, easing: ease});
  const swipeA = t >= 2.9 && t < 3.65, swipeB = t >= 16.4 && t < 17.15;
  const dd = dogState(t);
  const edge = dd.x - 650;
  const clipFrom = (on, passed) => on ? `inset(0 0 0 ${Math.max(0, Math.min(1080, edge))}px)` : passed ? 'none' : 'inset(0 0 0 1080px)';
  const cam = camAt(t);
  const tapAt = 22.3, tap2At = 22.9;
  const endIn = k(19.5, 20.1, easeOut);
  const cur = t < tapAt ? 0 : t < tap2At ? 1 : 2;
  const curX = interpolate(t, [21.4, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [880, 560, 560, 600], clamp);
  const curY = interpolate(t, [21.4, tapAt - 0.1, tapAt + 0.3, tap2At - 0.2], [1500, 770, 780, 910], clamp);

  // хук
  const fly = k(1.1, 1.85, (x) => Easing.bezier(0.7, 0, 0.9, 0.3)(x));
  const flash = interpolate(t, [1.85, 1.9, 2.1], [0, 1, 0], clamp);
  const shake = t >= 1.9 && t < 2.9 ? Math.sin(f * 2.3) * 9 : 0;
  const shakeY = t >= 1.9 && t < 2.9 ? Math.cos(f * 2.9) * 7 : 0;
  const slide = k(14.4, 16.2);

  return (
    <AbsoluteFill style={{background: 'linear-gradient(172deg, #FCF5F2 0%, #F3EAF6 55%, #E8EEF9 100%)'}}>
      {['marat.jpg', 'face.jpg', 'boze.jpg', 'david.jpg', 'corday.jpg', 'p_peek.png', 'p_closed.png', 'p_wave.png', 'p_laugh.png', 'p_wash.png', 'p_jump.png', 'p_swipe.png', 'p_open.png', 'p_scared.png'].map((n) => <Img key={n} src={img(n)} style={{position: 'absolute', width: 1, height: 1, opacity: 0.01}} />)}
      <div style={{position: 'absolute', left: -150 + Math.sin(t / 2.2) * 40, top: 420, width: 620, height: 620, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,176,196,0.5), rgba(244,176,196,0))', zIndex: 1}} />
      <div style={{position: 'absolute', left: 560 + Math.cos(t / 2.7) * 50, top: 1060, width: 640, height: 640, borderRadius: '50%', background: 'radial-gradient(circle, rgba(170,190,250,0.5), rgba(170,190,250,0))', zIndex: 1}} />

      {/* A. ХУК: картина на весь экран, собака вылезает из угла, влёт в Марата, испуг */}
      {t < 2.9 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 15, overflow: 'hidden', background: '#1d1a14'}}>
          {t < 1.88 && (
            <div style={{position: 'absolute', inset: 0, transformOrigin: '17% 35%', transform: `scale(${1.0 + k(0, 1.2) * 0.12 + fly * 2.4})`, filter: `blur(${fly * 10}px)`}}>
              <div style={{position: 'absolute', inset: 0, backgroundImage: `url(${img('marat.jpg')})`, backgroundSize: 'cover', backgroundPosition: '35% 50%', filter: 'contrast(1.08) saturate(1.15) brightness(1.12)'}} />
            </div>
          )}
          {t < 1.88 && <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 400, background: 'linear-gradient(180deg, rgba(252,245,242,0.92), rgba(252,245,242,0))'}} />}
          {t < 1.88 && (() => {
            const q = easeOut(k(0.35, 1.7));
            const trem = Math.sin(f * 1.9) * 3 * q;
            const w = 640, hh = 640 * 855 * 0.9 / 896;
            return <div style={{position: 'absolute', right: -30, bottom: -hh * (1 - q), width: w, height: hh, zIndex: 20, transform: `translateX(${trem}px) rotate(${trem * 0.3}deg)`, filter: `blur(${fly * 6}px)`, opacity: 1 - fly * 0.6}}><Img src={img('p_peek.png')} style={{width: '100%', height: '100%'}} /></div>;
          })()}
          {t >= 1.88 && (
            <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 45%, #FFE7EF, #F6C7D7 70%, #E9A6BE)', zIndex: 16}}>
              <div style={{position: 'absolute', left: 540 - 575 * 1.95 / 2 + shake, top: 2050 - 890 * 1.95 + shakeY, width: 575 * 1.95, height: 890 * 1.95}}>
                <Img src={img('p_scared.png')} style={{width: '100%', height: '100%', filter: 'drop-shadow(0 30px 40px rgba(60,20,40,0.35))'}} />
              </div>
              <div style={{position: 'absolute', left: 0, right: 0, top: 370, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 130, color: '#fff', textShadow: '0 8px 30px rgba(120,30,70,0.55)', opacity: k(2.1, 2.35)}}>убийство!</div>
            </div>
          )}
          <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash, zIndex: 40}} />
        </div>
      )}

      <div style={{position: 'absolute', inset: 0, transform: `translate(${cam.px}px, ${cam.py}px) rotate(${cam.rot}deg) scale(${cam.z})`, transformOrigin: '50% 50%', filter: cam.blur > 0.4 ? `blur(${cam.blur}px)` : undefined}}>
        {/* B. 13 июля 1793: большая картина, лапка рисует год; затем покушение (мультяшная анимация без жестокости) */}
        {t >= 2.9 && t < 10.3 && (
          <div style={{position: 'absolute', inset: 0, clipPath: clipFrom(swipeA, t >= 3.65), zIndex: 16, opacity: 1 - k(9.9, 10.3)}}>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 350, textAlign: 'center'}}>
              <Kin txt="13 июля" at={3.5} t={t} size={120} italic color={ROSE} />
            </div>
            {/* год «рисуется» лапкой */}
            {t >= 4.3 && (() => {
              const q = k(4.3, 5.9, Easing.linear);
              return (
                <div style={{position: 'absolute', left: 0, width: 1080, top: 470, textAlign: 'center', zIndex: 30, opacity: 1 - k(7.5, 7.9)}}>
                  <div style={{position: 'relative', display: 'inline-block'}}>
                    <div style={{fontFamily: SERIF, fontWeight: 300, fontSize: 200, lineHeight: 1, color: INK, clipPath: `inset(0 ${(1 - q) * 100}% 0 0)`}}>1793</div>
                    <svg width="110" height="110" viewBox="0 0 110 110" style={{position: 'absolute', left: `calc(${q * 100}% - 40px)`, top: 70 + Math.sin(q * 30) * 14, filter: 'drop-shadow(0 8px 10px rgba(60,30,50,0.4))', opacity: q < 1 ? 1 : 0}}>
                      <path d="M10 100 L60 40" stroke="#8A5A3A" strokeWidth="9" strokeLinecap="round" />
                      <ellipse cx="62" cy="38" rx="9" ry="14" fill="#C4607E" transform="rotate(40 62 38)" />
                      <g fill="#F2A24C" stroke="#fff" strokeWidth="3"><ellipse cx="78" cy="58" rx="24" ry="20" /><circle cx="58" cy="44" r="9" /><circle cx="73" cy="34" r="9" /><circle cx="90" cy="38" r="9" /><circle cx="98" cy="54" r="8" /></g>
                    </svg>
                  </div>
                </div>
              );
            })()}
            <Card x={140} y={730} w={800} h={850} at={4.0} t={t} r={30} pad={12} rot={-1.5} z={18}><div style={{width: '100%', height: '100%', borderRadius: 20, overflow: 'hidden'}}><Paint src="marat.jpg" t={t} at={4.0} pos="35% 50%" zoomFrom={1.0} zoomTo={1.2} dur={4} /></div></Card>
            <Chip txt="«Смерть Марата», 1793" at={4.6} t={t} x={160} y={1590} size={28} z={25} />
            {/* анимация: ванна, Марат, Шарлотта Корде */}
            {t >= 7.6 && (() => {
              const e = k(7.6, 8.1, easeOut);
              const walk = k(7.7, 8.6);
              const stab = k(8.6, 8.95, easeOut);
              const flashS = interpolate(t, [8.9, 8.95, 9.35], [0, 1, 0], clamp);
              const slump = k(8.95, 9.5, easeOut);
              const paper = k(8.95, 9.8, easeOut);
              return (
                <div style={{position: 'absolute', left: 90, top: 640, width: 900, height: 900, borderRadius: 40, background: 'linear-gradient(160deg,#FFF1F6,#F1E6FA)', boxShadow: '0 40px 90px rgba(80,50,90,0.28)', overflow: 'hidden', zIndex: 40, opacity: e, transform: `scale(${0.9 + 0.1 * e})`}}>
                  <svg width="900" height="900" viewBox="0 0 900 900">
                    <rect x="0" y="660" width="900" height="240" fill="#E8D9F0" />
                    <rect x="0" y="120" width="900" height="540" fill="#F7E7EE" />
                    <rect x="60" y="150" width="260" height="360" rx="10" fill="#fff" stroke="#2B2433" strokeWidth="8" /><path d="M60 330 h260 M190 150 v360" stroke="#2B2433" strokeWidth="6" />
                    {/* ванна */}
                    <g stroke="#2B2433" strokeWidth="9" strokeLinejoin="round" strokeLinecap="round">
                      <path d="M470 470 h360 q40 0 40 40 v30 q0 150 -150 150 h-190 q-150 0 -150 -150 v-30 q0 -40 40 -40 z" fill="#fff" />
                      <path d="M490 520 h340 q30 0 30 30 v10 q0 40 -40 40 h-320 q-40 0 -40 -40 v-10 q0 -30 30 -30 z" fill="#BFE3F6" />
                      <path d="M520 705 l-14 50 M820 705 l14 50" fill="none" />
                      <ellipse cx="500" cy="760" rx="30" ry="12" fill="#C4607E" /><ellipse cx="840" cy="760" rx="30" ry="12" fill="#C4607E" />
                    </g>
                    {/* Марат */}
                    <g stroke="#2B2433" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" transform={`rotate(${slump * -18} 640 470)`}>
                      <rect x="580" y="470" width="150" height="100" rx="40" fill="#F4CBB0" />
                      <circle cx="650" cy="400" r="62" fill="#F4CBB0" />
                      <path d="M588 392 q62 -88 124 0 q-10 -26 -62 -30 q-52 4 -62 30 z" fill="#fff" />
                      <path d="M620 410 h12 M668 410 h12" /><path d="M630 440 q20 14 40 0" fill="none" />
                    </g>
                    <path d="M720 490 q40 10 90 -4" stroke="#2B2433" strokeWidth="8" fill="none" strokeLinecap="round" />
                    <g transform={`translate(${paper * 40} ${paper * 220}) rotate(${paper * 40} 810 470)`} opacity={1 - paper * 0.2}><rect x="780" y="440" width="64" height="80" rx="4" fill="#fff" stroke="#2B2433" strokeWidth="6" /><path d="M792 462 h40 M792 478 h40 M792 494 h26" stroke="#8A8296" strokeWidth="4" /></g>
                    {/* Шарлотта Корде */}
                    <g stroke="#2B2433" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" transform={`translate(${-250 + walk * 330} 0)`}>
                      <path d="M120 350 h120 l50 380 h-220 z" fill="#C4607E" /><path d="M130 420 h100 M138 480 h96 M146 540 h92 M154 600 h86" stroke="#fff" strokeWidth="9" />
                      <circle cx="180" cy="290" r="52" fill="#F4CBB0" /><path d="M128 280 q52 -90 104 0 q-52 -26 -104 0 z" fill="#4A2F2A" /><circle cx="205" cy="230" r="22" fill="#4A2F2A" />
                      <circle cx="166" cy="296" r="5" fill="#2B2433" /><circle cx="196" cy="296" r="5" fill="#2B2433" /><path d="M170 318 q10 8 20 0" fill="none" />
                      <path d={`M232 420 L${300 + stab * 60} ${400 - stab * 10}`} fill="none" strokeWidth="14" stroke="#F4CBB0" />
                      <path d={`M${296 + stab * 60} ${398 - stab * 10} l54 -6`} stroke="#B7BCC8" strokeWidth="12" fill="none" />
                    </g>
                    {flashS > 0 && <g transform={`translate(${560} ${470}) scale(${0.5 + flashS})`} opacity={flashS}><path d="M0 -70 L16 -22 L66 -22 L26 8 L40 58 L0 28 L-40 58 L-26 8 L-66 -22 L-16 -22 Z" fill="#FFD25A" stroke="#fff" strokeWidth="6" /></g>}
                  </svg>
                  <div style={{position: 'absolute', left: 20, top: 20, padding: '8px 20px', borderRadius: 24, background: '#fff', fontFamily: SANS, fontWeight: 700, fontSize: 22, color: INK}}>иллюстрация, без подробностей</div>
                  <div style={{position: 'absolute', left: 0, right: 0, bottom: 16, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: ROSE, opacity: k(8.0, 8.4)}}>ШАРЛОТТА КОРДЕ ПРИШЛА С ПИСЬМОМ</div>
                </div>
              );
            })()}
          </div>
        )}

        {/* C. Давид: художник, депутат, друг */}
        {t >= 9.9 && t < 13.4 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 17, opacity: Math.min(1, k(9.9, 10.3)) * (1 - k(13.0, 13.4))}}>
            <Card x={140} y={560} w={800} h={1000} at={10.0} t={t} r={34} pad={14}><div style={{width: '100%', height: '100%', borderRadius: 24, overflow: 'hidden'}}><Paint src="david.jpg" t={t} at={10.0} pos="50% 25%" zoomFrom={1.0} zoomTo={1.15} dur={3.2} /></div></Card>
            <Chip txt="художник" at={10.3} t={t} x={110} y={420} size={34} />
            <Chip txt="депутат" at={11.3} t={t} x={430} y={420} size={34} bg="rgba(244,176,196,0.95)" />
            <Chip txt="друг" at={11.9} t={t} x={730} y={420} size={34} />
          </div>
        )}

        {/* D. мученик / идеальная кожа вместо болезни: «фильтр идеала» стирает болезнь, блёстки */}
        {t >= 13.0 && t < 16.8 && (
          <div style={{position: 'absolute', inset: 0, zIndex: 18, opacity: Math.min(1, k(13.0, 13.4)) * (1 - k(16.4, 16.8))}}>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 370, textAlign: 'center'}}><Kin txt="мученик" at={13.3} t={t} size={150} italic color={ROSE} /></div>
            <div style={{position: 'absolute', left: 150, top: 610, width: 780, height: 760, transform: `rotate(${Math.sin(t * 2) * 0.6}deg)`}}>
              <div style={{position: 'absolute', inset: -40, borderRadius: 60, background: 'radial-gradient(circle, rgba(255,226,150,0.85), rgba(255,226,150,0))', opacity: k(13.4, 14.2) * (0.7 + Math.sin(t * 5) * 0.15)}} />
              <div style={{position: 'absolute', inset: 0, borderRadius: 34, overflow: 'hidden', boxShadow: '0 30px 70px rgba(80,50,90,0.3)', background: '#222', opacity: k(13.3, 13.7)}}>
                <div style={{position: 'absolute', inset: 0, backgroundImage: `url(${img('face.jpg')})`, backgroundSize: 'cover', backgroundPosition: '50% 40%', transform: `scale(${1 + (t - 13.3) * 0.03})`}} />
                <div style={{position: 'absolute', inset: 0, clipPath: `inset(0 ${(1 - slide) * 100}% 0 0)`}}>
                  <div style={{position: 'absolute', inset: 0, backgroundImage: `url(${img('boze.jpg')})`, backgroundSize: 'cover', backgroundPosition: '50% 35%'}} />
                </div>
                {slide > 0.02 && slide < 0.98 && (
                  <div style={{position: 'absolute', left: `${slide * 100}%`, top: 0, bottom: 0, width: 10, marginLeft: -5, background: 'linear-gradient(180deg,#fff,#FFE9A8,#fff)', boxShadow: '0 0 30px 10px rgba(255,235,170,0.9)'}} />
                )}
                {Array.from({length: 16}).map((_, i) => {
                  const life = (t * 1.6 + i * 0.37) % 1;
                  const sx = slide * 780 + (((i * 97) % 200) - 100), sy = ((i * 163) % 700) + 20;
                  return slide > 0.02 && slide < 0.98 ? <div key={i} style={{position: 'absolute', left: sx, top: sy, width: 22, height: 22, opacity: Math.sin(life * Math.PI), transform: `scale(${0.6 + life}) rotate(${life * 180}deg)`, background: '#fff', clipPath: 'polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%)', filter: 'drop-shadow(0 0 6px #FFE9A8)'}} /> : null;
                })}
                <div style={{position: 'absolute', left: 20, bottom: 20, padding: '10px 22px', borderRadius: 26, background: 'rgba(255,255,255,0.92)', fontFamily: SANS, fontWeight: 700, fontSize: 22, color: INK, opacity: k(14.6, 15.0)}}>портрет Марата</div>
                <div style={{position: 'absolute', right: 20, bottom: 20, padding: '10px 22px', borderRadius: 26, background: 'rgba(255,255,255,0.92)', fontFamily: SANS, fontWeight: 700, fontSize: 22, color: INK}}>картина Давида</div>
              </div>
            </div>
            <div style={{position: 'absolute', left: 90, top: 1410, width: 900, padding: '12px 26px', borderRadius: 40, background: 'rgba(255,255,255,0.92)', boxShadow: '0 12px 30px rgba(80,50,90,0.2)', opacity: k(14.4, 14.8)}}>
              <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: SOFT}}>ФИЛЬТР «ИДЕАЛ»</div>
              <div style={{height: 14, borderRadius: 7, background: '#F3EAF6', marginTop: 8, overflow: 'hidden'}}><div style={{width: `${slide * 100}%`, height: '100%', background: 'linear-gradient(90deg,#F4B0C4,#E79BB4)'}} /></div>
            </div>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 1510, textAlign: 'center'}}>
              <span style={{fontFamily: SERIF, fontWeight: 500, fontSize: 64, color: INK, opacity: k(14.4, 14.9)}}>идеальная кожа </span>
              <span style={{fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 64, color: ROSE, opacity: k(15.8, 16.1)}}>вместо болезни</span>
            </div>
          </div>
        )}

        {/* E. не репортаж, а плакат: розовый плакат с лавровым венком и лентой */}
        {t >= 16.4 && t < 19.9 && (
          <div style={{position: 'absolute', inset: 0, clipPath: clipFrom(swipeB, t >= 17.15), zIndex: 19, opacity: 1 - k(19.5, 19.9)}}>
            <div style={{position: 'absolute', left: 110, top: 380, width: 860, height: 1130, borderRadius: 14, background: 'linear-gradient(170deg,#FBD3E0 0%,#F4A9C4 55%,#E889AE 100%)', boxShadow: '0 40px 90px rgba(150,60,100,0.35)', transform: `rotate(${(1 - k(17.0, 17.5, easeOut)) * -4}deg) scale(${0.96 + 0.04 * k(17.0, 17.5, easeOut)})`}}>
              <div style={{position: 'absolute', inset: 22, border: '4px solid rgba(255,255,255,0.85)', borderRadius: 8}} />
              <div style={{position: 'absolute', inset: 40, border: '1.5px solid rgba(255,255,255,0.6)', borderRadius: 4}} />
              <div style={{position: 'absolute', left: 130, top: 180, width: 600, height: 700, borderRadius: 300, overflow: 'hidden', border: '10px solid #fff', boxShadow: '0 20px 50px rgba(120,40,80,0.35)'}}>
                <div style={{width: '100%', height: '100%', backgroundImage: `url(${img('marat.jpg')})`, backgroundSize: 'cover', backgroundPosition: '40% 40%', transform: `scale(${1.1 + (t - 17.2) * 0.03})`}} />
              </div>
              <svg width="860" height="1130" style={{position: 'absolute', inset: 0}}>
                {[-1, 1].map((sg) => Array.from({length: 9}).map((_, i) => {
                  const a2 = (i / 8) * 1.7 + 0.35;
                  const x = 430 + sg * (250 + Math.sin(a2 * 1.2) * 10 - i * 4), y = 880 - Math.cos(a2) * 520 + 40 - i * 36;
                  return <ellipse key={sg + '_' + i} cx={430 + sg * (300 - Math.sin(i / 8 * 1.57) * 30 - i * 3)} cy={780 - i * 62} rx="34" ry="14" fill="#FFF3F7" opacity={Math.min(1, Math.max(0, (t - 17.4 - i * 0.05) / 0.2)) * 0.95} transform={`rotate(${sg * (55 - i * 8)} ${430 + sg * (300 - Math.sin(i / 8 * 1.57) * 30 - i * 3)} ${780 - i * 62})`} />;
                }))}
                {[[170, 140], [690, 120], [740, 880], [120, 900]].map(([x, y], i) => <path key={i} d="M0 -22 L6 -6 L22 0 L6 6 L0 22 L-6 6 L-22 0 L-6 -6 Z" transform={`translate(${x} ${y}) scale(${0.8 + Math.sin(t * 3 + i) * 0.25})`} fill="#fff" opacity={0.9} />)}
              </svg>
              <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: 14, color: '#fff'}}>РЕВОЛЮЦИЯ · 1793</div>
              {t >= 18.5 && (() => {
                const dt = t - 18.5; const q = Math.min(1, dt / 0.35);
                return (
                  <div style={{position: 'absolute', left: -50, right: -50, top: 930, height: 160, transform: `rotate(-4deg) scaleX(${easeOut(q)})`, background: 'linear-gradient(180deg,#C4607E,#A8456A)', boxShadow: '0 24px 40px rgba(120,30,70,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', clipPath: 'polygon(0 0, 100% 0, 96% 50%, 100% 100%, 0 100%, 4% 50%)'}}>
                    <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 104, letterSpacing: 16, color: '#fff', textShadow: '0 4px 14px rgba(80,20,50,0.5)'}}>плакат</div>
                  </div>
                );
              })()}
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 70, textAlign: 'center', fontFamily: SERIF, fontWeight: 500, fontStyle: 'italic', fontSize: 52, color: '#fff', opacity: k(18.9, 19.3)}}>À Marat, David</div>
            </div>
            <div style={{position: 'absolute', left: 0, width: 1080, top: 1540, textAlign: 'center'}}>
              <div style={{position: 'relative', display: 'inline-block'}}>
                <Kin txt="репортаж" at={17.0} t={t} size={74} weight={500} color={SOFT} />
                <div style={{position: 'absolute', left: 0, top: '58%', height: 7, borderRadius: 4, background: INK, width: `${k(17.5, 17.9, easeOut) * 100}%`}} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* F. финал */}
      {t >= 19.5 && (
        <div style={{position: 'absolute', inset: 0, zIndex: 50, opacity: endIn}}>
          <div style={{position: 'absolute', left: 0, width: 1080, top: 345, textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontStyle: 'italic', fontSize: 100, color: INK, lineHeight: 1.05}}>Правда или<br />пропаганда?</div>
          {[['Правда', 640, 0], ['Пропаганда', 780, 1]].map(([txt, top, i]) => {
            const pr = spring({frame: f - Math.round((20.0 + i * 0.15) * fps), fps, config: {damping: 14, stiffness: 160}});
            const glow = i === 1 && t >= tap2At;
            const act = cur === i + 1 || glow;
            return (
              <div key={i} style={{position: 'absolute', left: 170, top, width: 740, height: 110, borderRadius: 55, background: glow ? 'linear-gradient(90deg,#F7C3D2,#E79BB4)' : 'rgba(255,255,255,0.92)', color: INK, fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: glow ? '0 20px 50px rgba(196,96,126,0.45)' : '0 16px 36px rgba(80,50,90,0.18)', transform: `scale(${Math.min(pr, 1.03) * (glow ? 1.05 : 1) * (act && !glow ? 0.97 : 1)})`, opacity: Math.min(1, pr * 2)}}>{txt}</div>
            );
          })}
          <svg width="120" height="140" viewBox="-10 -10 120 140" style={{position: 'absolute', left: curX, top: curY, zIndex: 80, filter: 'drop-shadow(8px 12px 10px rgba(0,0,0,0.3))', transform: `scale(${(t >= tapAt && t < tapAt + 0.2) || (t >= tap2At && t < tap2At + 0.2) ? 0.85 : 1})`}}>
            <path d="M5 5 L5 95 L30 72 L48 112 L66 104 L48 66 L82 66 Z" fill="#fff" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {t >= 2.9 && <Dog t={t} f={f} />}
      <div style={{position: 'absolute', left: 60, top: 1622, padding: '12px 26px', borderRadius: 30, background: 'rgba(255,255,255,0.94)', boxShadow: '0 10px 26px rgba(80,50,90,0.18)', fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: INK, zIndex: 95}}>{script.diagram.title}</div>
      <Captions />
    </AbsoluteFill>
  );
};
