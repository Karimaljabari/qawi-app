// qawi-landing.jsx — Home with STRIVE big + SALAH/SUJOOD squares

function LandingScreen({ t, onNav, onBell, profile }) {
  const isF = profile?.gender === 'female';
  const term = isF ? 'SISTERS' : 'BROTHERS';
  const termAr = isF ? 'الأخوات' : 'الإخوة';
  return (
    <div style={{
      minHeight: '100%', background: t.bg, color: t.text,
      position: 'relative', overflow: 'hidden',
      paddingTop: 54, paddingBottom: 40,
    }}>
      <div style={{ position: 'absolute', inset: 0, background: t.heroGlow, pointerEvents: 'none' }} />
      <PatternBackground color={t.accent} opacity={0.035} />

      <div style={{
        position: 'absolute', top: '14%', left: '50%',
        transform: 'translateX(-50%)', pointerEvents: 'none',
      }}>
        <QawiCalligraphy color={t.calligraphyColor} opacity={t.calligraphyOpacity} size={260} />
      </div>

      {/* Top nav */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        padding: '0 20px 16px',
      }}>
        <div>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: 28, fontWeight: 900, letterSpacing: 6,
            color: t.accent, lineHeight: 0.9,
          }}>QAWI</div>
          <div style={{
            fontFamily: 'Amiri, Georgia, serif',
            fontSize: 13, color: t.accentDim,
            direction: 'rtl', marginTop: 2,
          }}>قوي</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => onNav('manager')} title="Manager (admin)" style={{
            width: 36, height: 36, borderRadius: '50%',
            background: t.bg3, border: `1px solid ${t.accent}`,
            color: t.accent, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: 12, fontWeight: 900, letterSpacing: 1,
          }}>MGR</button>
          <button onClick={onBell} style={{
            width: 36, height: 36, borderRadius: '50%',
            background: t.bg3, border: `1px solid ${t.border2}`,
            color: t.accent, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5a4 4 0 0 0-4 4v2l-1.5 2.5h11L12 7.5v-2a4 4 0 0 0-4-4z" stroke={t.accent} strokeWidth="1.3" strokeLinejoin="round" fill="none"/>
              <path d="M6.5 12a1.5 1.5 0 0 0 3 0" stroke={t.accent} strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <div style={{
              position: 'absolute', top: 6, right: 6,
              width: 7, height: 7, borderRadius: '50%',
              background: t.accent2, border: `1.5px solid ${t.bg3}`,
            }} />
          </button>
          <div style={{
            display: 'flex', gap: 4,
            background: t.bg3, border: `1px solid ${t.border}`,
            borderRadius: 20, padding: 3,
          }}>
            <button style={{
              padding: '4px 10px', border: 'none', borderRadius: 16,
              background: t.accent, color: '#000', cursor: 'pointer',
              fontFamily: 'DM Mono, monospace', fontSize: 10, fontWeight: 700,
            }}>EN</button>
            <button style={{
              padding: '4px 10px', border: 'none', borderRadius: 16,
              background: 'none', color: t.text3, cursor: 'pointer',
              fontFamily: 'Amiri, Georgia, serif', fontSize: 12,
            }}>ع</button>
          </div>
        </div>
      </div>

      {/* Greeting */}
      {profile?.name && (
        <div style={{
          position: 'relative', zIndex: 2,
          padding: '0 22px 6px', textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'Amiri, Georgia, serif', fontSize: 14,
            color: t.accentDim, direction: 'rtl', marginBottom: 2,
          }}>السلام عليكم</div>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: 15, fontWeight: 600, letterSpacing: 2,
            color: t.text2, textTransform: 'uppercase',
          }}>AS-SALAAMU ALAYKUM, {isF ? 'UKHTI' : 'AKHI'} {profile.name.toUpperCase()}</div>
        </div>
      )}

      {/* Hero hadith */}
      <div style={{
        position: 'relative', zIndex: 2,
        padding: '18px 22px 16px', textAlign: 'center',
      }}>
        <div style={{
          fontFamily: 'DM Mono, monospace', fontSize: 9,
          letterSpacing: '0.3em', color: t.text3, marginBottom: 10,
        }}>— HADITH OF THE DAY —</div>

        <div style={{
          fontFamily: 'Amiri, Georgia, serif',
          fontSize: 16, color: t.accent,
          direction: 'rtl', lineHeight: 1.8, marginBottom: 10,
          fontWeight: 700,
        }}>
          المؤمن القوي خير وأحب إلى الله من المؤمن الضعيف، وفي كلٍّ خير. احرص على ما ينفعك، واستعن بالله ولا تعجز
        </div>

        <div style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 11, fontWeight: 600,
          color: t.text2, lineHeight: 1.45, letterSpacing: 0.3,
          maxWidth: 320, margin: '0 auto',
          fontStyle: 'italic',
        }}>
          "The strong believer is better and more beloved to Allah. Strive for what benefits you, seek Allah's help, and do not give up."
        </div>
        <div style={{
          fontSize: 9, color: t.text3, marginTop: 6,
          fontFamily: 'DM Mono, monospace', letterSpacing: '0.2em',
        }}>— SAHIH MUSLIM · 2664</div>
      </div>

      <DiamondDivider color={t.accent} label="ENTER" labelAr="ادخل" />

      {/* STRIVE — big hero tile */}
      <div style={{ position: 'relative', zIndex: 2, padding: '14px 20px 0' }}>
        <button onClick={() => onNav('dash')} style={{
          width: '100%', background: t.bg2,
          border: `1px solid ${t.border}`, borderRadius: 16,
          padding: 18, cursor: 'pointer', fontFamily: 'inherit',
          textAlign: 'left', position: 'relative', overflow: 'hidden',
          transition: 'all .2s', display: 'block',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.background = t.bg3; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.background = t.bg2; }}>
          <div style={{
            position: 'absolute', bottom: -30, right: -20,
            fontFamily: 'Amiri, Georgia, serif', fontSize: 140,
            color: t.accent, opacity: 0.08,
            direction: 'rtl', lineHeight: 0.8, pointerEvents: 'none',
            fontWeight: 700,
          }}>إجتهاد</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 1 }}>
            <GeometricStar color={t.accent} size={56} />
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 36, fontWeight: 900, letterSpacing: 4,
                color: t.accent, lineHeight: 0.95,
              }}>STRIVE</div>
              <div style={{
                fontFamily: 'Amiri, Georgia, serif',
                fontSize: 15, color: t.accentDim,
                direction: 'rtl', marginTop: 4,
              }}>إجتهاد</div>
            </div>
            <div style={{ color: t.accentDim, fontSize: 22 }}>→</div>
          </div>

          <div style={{
            marginTop: 14, paddingTop: 14,
            borderTop: `1px solid ${t.border}`,
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
            position: 'relative', zIndex: 1,
          }}>
            {[
              ['GYM',     'الصالة'],
              ['STEPS',   'الخطى'],
              ['BODY',    'الجسم'],
              ['JOURNAL', 'يومي'],
            ].map(([l, a]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 12, fontWeight: 700, letterSpacing: 1.5,
                  color: t.text2,
                }}>{l}</div>
                <div style={{
                  fontFamily: 'Amiri, Georgia, serif', fontSize: 11,
                  color: t.accentDim, direction: 'rtl', marginTop: 2,
                }}>{a}</div>
              </div>
            ))}
          </div>
        </button>
      </div>

      {/* SALAH + SUJOOD square pair */}
      <div style={{
        position: 'relative', zIndex: 2,
        padding: '10px 20px 0',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
      }}>
        <SquareTile t={t} onClick={() => onNav('salah')}
          label="SALAH" ar="الصلاة" desc="Prayer times"
          icon={<div style={{width:44,height:44,border:`1.5px solid ${t.accent}`,borderRadius:'50% 50% 50% 50% / 60% 60% 40% 40%',position:'relative'}}><div style={{position:'absolute',top:-4,left:'50%',transform:'translateX(-50%)',width:2,height:8,background:t.accent}}/></div>}
        />
        <SquareTile t={t} onClick={() => onNav('sujood')}
          label="SUJOOD" ar="المسجد" desc="Nearest masjid"
          icon={<div style={{width:44,height:44,position:'relative'}}><div style={{position:'absolute',bottom:0,left:4,right:4,height:24,border:`1.5px solid ${t.accent}`,borderRadius:'2px'}}/><div style={{position:'absolute',top:6,left:'50%',transform:'translateX(-50%)',width:22,height:22,border:`1.5px solid ${t.accent}`,borderRadius:'50% 50% 0 0 / 70% 70% 0 0',background:t.bg}}/><div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:1.5,height:8,background:t.accent}}/></div>}
        />
      </div>

      {/* SQUAD */}
      <div style={{ position: 'relative', zIndex: 2, padding: '10px 20px 0' }}>
        <button onClick={() => onNav('squad')} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 14,
          background: t.bg2, border: `1px solid ${t.border}`,
          borderRadius: 12, padding: '12px 16px',
          textAlign: 'left', cursor: 'pointer', transition: 'all .2s',
          fontFamily: 'inherit',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.background = t.bg3; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.background = t.bg2; }}>
          <div style={{width:44,height:44,position:'relative',flexShrink:0}}>
            {[0,1,2].map(i=><div key={i} style={{position:'absolute',width:20,height:20,borderRadius:'50%',border:`1px solid ${t.accent}`,top:i===0?0:14,left:i===1?22:(i===2?12:0)}}/>)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 18, fontWeight: 800, letterSpacing: 2.5,
              color: t.accent, lineHeight: 1,
            }}>SQUAD</div>
            <div style={{
              fontFamily: 'Amiri, Georgia, serif',
              fontSize: 13, color: t.accentDim,
              direction: 'rtl', marginTop: 3,
            }}>الإخوة</div>
            <div style={{
              fontSize: 10, color: t.text3, marginTop: 3,
              fontFamily: 'DM Mono, monospace', letterSpacing: '0.06em',
            }}>{isF ? 'Sisters' : 'Brothers'} · Gym rank · Masjids</div>
          </div>
          <div style={{ color: t.accentDim, fontSize: 18 }}>→</div>
        </button>
      </div>
    </div>
  );
}

function SquareTile({ t, onClick, label, ar, desc, icon }) {
  return (
    <button onClick={onClick} style={{
      aspectRatio: '1', background: t.bg2,
      border: `1px solid ${t.border}`, borderRadius: 14,
      padding: 14, cursor: 'pointer', fontFamily: 'inherit',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative', overflow: 'hidden',
      transition: 'all .2s', textAlign: 'left',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.background = t.bg3; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.background = t.bg2; }}>
      <div style={{
        position: 'absolute', bottom: -20, right: -10,
        fontFamily: 'Amiri, Georgia, serif', fontSize: 80,
        color: t.accent, opacity: 0.08,
        direction: 'rtl', lineHeight: 0.8, pointerEvents: 'none',
        fontWeight: 700,
      }}>{ar}</div>

      <div style={{ position: 'relative', zIndex: 1 }}>{icon}</div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 22, fontWeight: 800, letterSpacing: 3,
          color: t.accent, lineHeight: 1,
        }}>{label}</div>
        <div style={{
          fontFamily: 'Amiri, Georgia, serif',
          fontSize: 13, color: t.accentDim,
          direction: 'rtl', marginTop: 4,
        }}>{ar}</div>
        <div style={{
          fontSize: 10, color: t.text3, marginTop: 3,
          fontFamily: 'DM Mono, monospace', letterSpacing: '0.05em',
        }}>{desc}</div>
      </div>
    </button>
  );
}

window.LandingScreen = LandingScreen;
