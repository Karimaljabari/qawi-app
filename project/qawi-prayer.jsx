// qawi-prayer.jsx — Salah screen (no qibla per user request)

function PrayerScreen({ t, state, setState, onBack, profile, setProfile }) {
  const [pdfOpen, setPdfOpen] = React.useState(false);
  const [locOpen, setLocOpen] = React.useState(false);
  const [live, setLive] = React.useState(null);  // { prayers, date, location, monthly }
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState(null);

  const city = profile?.city || 'Detroit';
  const country = profile?.country ? window.QAWI_COUNTRY_NAME(profile.country) : 'United States';

  // Calculation method per country (Aladhan method codes)
  // Methods: 1=Karachi, 2=ISNA, 3=MWL, 4=Umm al-Qura, 5=Egypt, 7=Tehran,
  // 8=Gulf, 9=Kuwait, 10=Qatar, 11=Singapore, 12=UOIF France, 13=Diyanet Turkey,
  // 14=Russia, 15=Moonsighting Committee, 16=Dubai
  const METHOD_BY_COUNTRY = {
    // Gulf — official bodies
    AE: 16,   // Dubai / UAE Awqaf (matches Khaleej Times)
    SA: 4,    // Umm al-Qura — Saudi Arabia
    KW: 9,    // Kuwait
    QA: 10,   // Qatar
    BH: 8,    // Bahrain → Gulf Region
    OM: 8,    // Oman → Gulf Region
    YE: 8,    // Yemen → Gulf Region

    // Levant — Egyptian General Authority (standard across the region)
    EG: 5,    // Egypt
    JO: 5,    // Jordan — Ministry of Awqaf uses Egyptian
    SY: 5,    // Syria
    LB: 5,    // Lebanon
    PS: 5,    // Palestine
    IQ: 5,    // Iraq
    SD: 5,    // Sudan

    // North Africa
    MA: 3,    // Morocco — MWL (Moroccan Ministry uses MWL-like)
    DZ: 3,    // Algeria
    TN: 3,    // Tunisia
    LY: 3,    // Libya

    // South & Southeast Asia
    PK: 1,    // Pakistan — Karachi / University of Islamic Sciences
    IN: 1,    // India — Karachi method widely used
    BD: 1,    // Bangladesh
    AF: 1,    // Afghanistan
    ID: 20,   // Indonesia — Kemenag (Sihat method 20 if supported, else MWL)
    MY: 17,   // Malaysia — JAKIM
    SG: 11,   // Singapore — MUIS
    BN: 11,   // Brunei → MUIS
    TH: 11,   // Thailand → MUIS

    // Turkey & Iran
    TR: 13,   // Diyanet — Turkey
    IR: 7,    // Tehran — Iran

    // Africa
    NG: 3,    // Nigeria — MWL
    KE: 3,    // Kenya
    SO: 5,    // Somalia — Egyptian
    ZA: 3,    // South Africa — MWL

    // Europe
    FR: 12,   // UOIF — France
    DE: 3,    // MWL
    NL: 3,
    BE: 3,
    ES: 3,
    IT: 3,
    SE: 3,
    NO: 3,
    GB: 3,    // MWL
    RU: 14,   // Russia

    // Americas / Oceania — ISNA
    US: 2,
    CA: 2,
    MX: 2,
    BR: 2,
    AR: 2,
    AU: 2,
    NZ: 2,
  };
  const method = METHOD_BY_COUNTRY[profile?.country] || 2;

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true); setErr(null);

    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth() + 1;

    // Monthly calendar (covers "today" + timetable in one call)
    const url = `https://api.aladhan.com/v1/calendarByCity/${y}/${m}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`;

    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        if (!data.data || !Array.isArray(data.data)) throw new Error('No data');
        const today = data.data[now.getDate() - 1] || data.data[0];
        const t = today.timings;
        const strip = s => (s || '').split(' ')[0]; // "05:12 (EDT)" → "05:12"
        const prayers = [
          { name: 'FAJR',    ar: 'الفجر',   time: strip(t.Fajr) },
          { name: 'DHUHR',   ar: 'الظهر',   time: strip(t.Dhuhr) },
          { name: 'ASR',     ar: 'العصر',   time: strip(t.Asr) },
          { name: 'MAGHRIB', ar: 'المغرب',  time: strip(t.Maghrib) },
          { name: 'ISHA',    ar: 'العشاء',  time: strip(t.Isha) },
        ];
        // figure out which is next
        const nowM = now.getHours()*60 + now.getMinutes();
        const toM = s => { const [hh,mm] = s.split(':').map(Number); return hh*60+mm; };
        let nextIdx = prayers.findIndex(p => toM(p.time) > nowM);
        if (nextIdx === -1) nextIdx = 0; // all passed → tomorrow's fajr
        prayers.forEach((p, i) => {
          p.passed = i < nextIdx;
          p.next = i === nextIdx;
        });
        setLive({
          prayers,
          date: today.date,
          meta: today.meta,
          monthly: data.data,
        });
        setLoading(false);
      })
      .catch(e => {
        if (cancelled) return;
        setErr(e.message || 'Fetch failed');
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [city, country, method]);

  // Fallback static data if API fails or not yet loaded
  const fallbackPrayers = [
    { name: 'FAJR',    ar: 'الفجر',    time: '05:12', passed: true },
    { name: 'DHUHR',   ar: 'الظهر',    time: '13:08', passed: true },
    { name: 'ASR',     ar: 'العصر',    time: '16:42', passed: false, next: true },
    { name: 'MAGHRIB', ar: 'المغرب',   time: '19:58', passed: false },
    { name: 'ISHA',    ar: 'العشاء',   time: '21:24', passed: false },
  ];
  const prayers = live?.prayers || fallbackPrayers;
  const next = prayers.find(p => p.next);
  const [countdown, setCountdown] = React.useState('--:--:--');

  React.useEffect(() => {
    if (!next) return;
    const tick = () => {
      const now = new Date();
      const [hh, mm] = next.time.split(':').map(Number);
      const target = new Date(now);
      target.setHours(hh, mm, 0, 0);
      // if target already past, it means next is tomorrow's fajr
      if (target <= now) target.setDate(target.getDate() + 1);
      let s = Math.floor((target - now) / 1000);
      if (s < 0) s = 0;
      const h = String(Math.floor(s / 3600)).padStart(2,'0');
      const m = String(Math.floor((s % 3600) / 60)).padStart(2,'0');
      const ss = String(s % 60).padStart(2,'0');
      setCountdown(`${h}:${m}:${ss}`);
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [next?.time]);

  const weekDays = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const today = 0;

  return (
    <div style={{ minHeight: '100%', background: t.bg, color: t.text, paddingBottom: 40 }}>
      <Topbar t={t} onBack={onBack} title="SALAH" titleAr="الصلاة" />

      {/* Hero — next prayer */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: t.bg2, borderBottom: `1px solid ${t.border}`,
        padding: '28px 20px 24px', textAlign: 'center',
      }}>
        <PatternBackground color={t.accent} opacity={0.04} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'Amiri, Georgia, serif', fontSize: 180,
          color: t.accent, opacity: 0.05,
          direction: 'rtl', lineHeight: 0.9, pointerEvents: 'none',
        }}>{next?.ar}</div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontFamily: 'DM Mono, monospace', fontSize: 10,
            letterSpacing: '0.3em', color: t.text3, marginBottom: 10,
          }}>NEXT · UP NEXT · القادمة</div>

          <div style={{
            fontFamily: 'Amiri, Georgia, serif',
            fontSize: 44, color: t.accent,
            direction: 'rtl', lineHeight: 1, marginBottom: 6,
            fontWeight: 700,
          }}>{next?.ar}</div>

          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: 34, fontWeight: 900, letterSpacing: 4,
            color: t.text, marginBottom: 14,
          }}>{next?.name} · {next?.time}</div>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '8px 18px',
            background: t.bg3, border: `1px solid ${t.border2}`,
            borderRadius: 30,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%',
              background: t.accent2, boxShadow: `0 0 8px ${t.accent2}`,
              animation: 'pulse 1.6s infinite' }} />
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 20,
              color: t.accent, letterSpacing: 3, fontWeight: 500 }}>{countdown}</span>
          </div>
        </div>
      </div>

      {/* SUJOOD — nearest masjid shortcut */}
      <button
        onClick={() => { window.__qawiNav && window.__qawiNav('sujood'); }}
        style={{
          width: 'calc(100% - 24px)', margin: '14px 12px 0',
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 16px',
          background: t.bg2, border: `1px solid ${t.border2}`,
          borderRadius: 10, cursor: 'pointer',
          textAlign: 'left', color: t.text, fontFamily: 'inherit',
          position: 'relative', overflow: 'hidden',
        }}>
        {/* Tiny masjid glyph */}
        <div style={{
          width: 38, height: 38, flexShrink: 0,
          display: 'grid', placeItems: 'center',
          background: t.bg3, border: `1px solid ${t.accentDim}`,
          borderRadius: 8, position: 'relative',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 3c-1.2 1.5-2 2.8-2 4 0 1 .5 1.6 1 2 .5-.4 1-1 1-2 0 1 .5 1.6 1 2 .5-.4 1-1 1-2 0-1.2-.8-2.5-2-4z" fill={t.accent}/>
            <rect x="4" y="11" width="16" height="10" stroke={t.accent} strokeWidth="1.3" fill="none"/>
            <path d="M10 21v-4a2 2 0 0 1 4 0v4" stroke={t.accent} strokeWidth="1.3" fill="none"/>
            <circle cx="12" cy="9" r="0.8" fill={t.accent}/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 18, fontWeight: 900, letterSpacing: 3,
              color: t.accent, lineHeight: 1,
            }}>SUJOOD</div>
            <div style={{
              fontFamily: 'Amiri, Georgia, serif', fontSize: 14,
              color: t.accentDim, direction: 'rtl', fontWeight: 700,
            }}>المسجد</div>
          </div>
          <div style={{
            fontFamily: 'DM Mono, monospace', fontSize: 9,
            letterSpacing: '0.16em', color: t.text3, marginTop: 4,
          }}>NEAREST MASJID · TAP TO OPEN</div>
        </div>
        <div style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 20, color: t.accentDim,
        }}>→</div>
      </button>

      {/* All prayers today */}
      <div style={{ padding: '16px 12px' }}>
        <DiamondDivider color={t.accent} label="TODAY" labelAr="اليوم" />
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 6, marginTop: 12,
        }}>
          {prayers.map(p => (
            <div key={p.name} style={{
              background: p.next ? t.accentGlow : t.bg2,
              border: `1px solid ${p.next ? t.accent : t.border}`,
              borderRadius: 8, padding: '12px 4px',
              textAlign: 'center', opacity: p.passed ? 0.5 : 1,
              position: 'relative',
            }}>
              {p.passed && (
                <div style={{
                  position: 'absolute', top: 4, right: 4,
                  fontSize: 9, color: t.green,
                }}>✓</div>
              )}
              <div style={{
                fontFamily: 'Amiri, Georgia, serif', fontSize: 15,
                color: p.next ? t.accent : t.accentDim,
                direction: 'rtl', marginBottom: 6, fontWeight: 700,
              }}>{p.ar}</div>
              <div style={{
                fontFamily: 'Barlow Condensed, sans-serif', fontSize: 11,
                fontWeight: 700, letterSpacing: 1.5, color: t.text3,
                marginBottom: 4,
              }}>{p.name}</div>
              <div style={{
                fontFamily: 'DM Mono, monospace', fontSize: 12,
                fontWeight: 600, color: p.next ? t.accent : t.text,
              }}>{p.time}</div>
              {p.next && (
                <div style={{ fontSize: 8, color: t.accent,
                  fontFamily: 'DM Mono, monospace', marginTop: 3, letterSpacing: '0.1em' }}>NOW</div>
              )}
            </div>
          ))}
        </div>

        {/* Check-in tracker removed per request */}

        {/* Quranic ayah — An-Nisa 4:103 */}
        <div style={{
          marginTop: 14, padding: '22px 18px',
          background: `linear-gradient(180deg, ${t.bg2} 0%, ${t.bg} 100%)`,
          border: `1px solid ${t.accentDim}`,
          borderRadius: 12,
          position: 'relative', overflow: 'hidden', textAlign: 'center',
        }}>
          {/* Faded watermark glyph */}
          <div style={{
            position: 'absolute', top: -40, right: -30,
            fontFamily: 'Amiri, Georgia, serif', fontSize: 160,
            color: t.accent, opacity: 0.05,
            direction: 'rtl', lineHeight: 0.8, pointerEvents: 'none',
          }}>﴿</div>
          <div style={{
            position: 'absolute', bottom: -50, left: -30,
            fontFamily: 'Amiri, Georgia, serif', fontSize: 160,
            color: t.accent, opacity: 0.05,
            direction: 'ltr', lineHeight: 0.8, pointerEvents: 'none',
          }}>﴾</div>

          <div style={{
            position: 'relative', zIndex: 1,
            fontFamily: 'DM Mono, monospace', fontSize: 9,
            letterSpacing: '0.3em', color: t.accent, marginBottom: 4,
          }}>◊ QUR'AN · AN-NISA 4:103 ◊</div>
          <div style={{
            position: 'relative', zIndex: 1,
            fontFamily: 'Amiri, Georgia, serif', fontSize: 11,
            letterSpacing: '0.1em', color: t.text3, marginBottom: 18,
            direction: 'rtl',
          }}>سورة النساء · الآية ١٠٣</div>

          {/* Arabic ayah with ornamental markers */}
          <div style={{
            position: 'relative', zIndex: 1,
            fontFamily: 'Amiri, Georgia, serif',
            fontSize: 22, color: t.accent,
            direction: 'rtl', lineHeight: 2.2, fontWeight: 700,
            marginBottom: 18, padding: '0 4px',
          }}>
            <span style={{ fontSize: 18, color: t.accentDim, margin: '0 4px' }}>﴿</span>
            إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا
            <span style={{ fontSize: 18, color: t.accentDim, margin: '0 4px' }}>﴾</span>
          </div>

          {/* Decorative divider */}
          <div style={{
            position: 'relative', zIndex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, marginBottom: 14,
          }}>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${t.accentDim})` }} />
            <div style={{ color: t.accent, fontSize: 10 }}>◇</div>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${t.accentDim}, transparent)` }} />
          </div>

          <div style={{
            position: 'relative', zIndex: 1,
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: 13, fontWeight: 500,
            color: t.text2, lineHeight: 1.6, letterSpacing: 0.4,
            fontStyle: 'italic', padding: '0 6px',
          }}>
            "Indeed, prayer has been decreed upon the believers a decree of specified times."
          </div>
        </div>

        {/* Day of Judgement hadith */}
        <div style={{
          marginTop: 14, padding: '18px 16px',
          background: t.bg2,
          border: `1px solid ${t.border}`,
          borderRadius: 12,
          position: 'relative', overflow: 'hidden', textAlign: 'center',
        }}>
          <div style={{
            position: 'absolute', top: -30, left: -20,
            fontFamily: 'Amiri, Georgia, serif', fontSize: 140,
            color: t.accent, opacity: 0.05,
            direction: 'rtl', lineHeight: 0.8, pointerEvents: 'none',
          }}>الصلاة</div>

          <div style={{
            position: 'relative', zIndex: 1,
            fontFamily: 'DM Mono, monospace', fontSize: 9,
            letterSpacing: '0.28em', color: t.accent2, marginBottom: 14,
          }}>— ON THE DAY OF JUDGEMENT —</div>

          <div style={{
            position: 'relative', zIndex: 1,
            fontFamily: 'Amiri, Georgia, serif',
            fontSize: 18, color: t.accent,
            direction: 'rtl', lineHeight: 1.9, fontWeight: 700,
            marginBottom: 14, padding: '0 4px',
          }}>
            إن أول ما يحاسب به العبد يوم القيامة من عمله صلاته، فإن صلحت، فقد أفلح وأنجح، وإن فسدت، فقد خاب وخسر
          </div>

          <div style={{
            position: 'relative', zIndex: 1,
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: 13, fontWeight: 600,
            color: t.text2, lineHeight: 1.55, letterSpacing: 0.3,
            fontStyle: 'italic',
          }}>
            "The first thing a person will be questioned about on the Day of Judgment is their Salah. If it is complete and accepted, the rest of their deeds will follow suit, but if it is deficient, the rest of their deeds will be considered deficient."
          </div>

          <div style={{
            position: 'relative', zIndex: 1,
            fontSize: 9, color: t.text3, marginTop: 12,
            fontFamily: 'DM Mono, monospace', letterSpacing: '0.18em',
          }}>— TIRMIDHI · 413</div>
        </div>

        {/* Month prayer schedule preview */}
        <div style={{
          marginTop: 14, background: t.bg2,
          border: `1px solid ${t.border}`, borderRadius: 12, overflow: 'hidden',
        }}>
          <div style={{
            padding: '12px 14px 8px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 14, fontWeight: 700, letterSpacing: 2,
              color: t.accentDim, textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {(() => {
                const now = new Date();
                const monthName = now.toLocaleString('en-US', { month: 'long' }).toUpperCase();
                return `${monthName} · ${city.toUpperCase()}${live?.meta?.latitude ? ` · ${live.meta.latitude.toFixed(1)}°N` : ''}`;
              })()}
              <button onClick={() => setLocOpen(true)} title="Change location" style={{
                padding: '3px 8px', background: 'transparent',
                border: `1px solid ${t.border2}`, borderRadius: 4,
                color: t.accent, cursor: 'pointer',
                fontFamily: 'DM Mono, monospace', fontSize: 9,
                letterSpacing: '0.08em',
              }}>✎ EDIT</button>
            </div>
            <button onClick={() => setPdfOpen(true)} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 10px', background: t.accentGlow,
              border: `1px solid ${t.accent}`, borderRadius: 6,
              color: t.accent, cursor: 'pointer',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
            }}>↓ PDF</button>
          </div>
          {loading && (
            <div style={{
              padding: '30px 14px', textAlign: 'center',
              fontFamily: 'DM Mono, monospace', fontSize: 11,
              color: t.text3, letterSpacing: '0.15em',
            }}>◦ LOADING TIMES FOR {city.toUpperCase()}...</div>
          )}
          {err && !loading && (
            <div style={{
              padding: '18px 14px', textAlign: 'center',
              fontFamily: 'DM Mono, monospace', fontSize: 10,
              color: t.accent2, letterSpacing: '0.1em',
            }}>⚠ SHOWING SAMPLE — COULDN'T REACH API</div>
          )}
          {!loading && (
            <table id="month-schedule" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10,
              fontFamily: 'DM Mono, monospace' }}>
              <thead>
                <tr style={{ background: t.bg3 }}>
                  {['DAY','FAJR','DHUHR','ASR','MAGH','ISHA'].map(h => (
                    <th key={h} style={{
                      padding: '8px 4px', color: t.accent,
                      fontSize: 9, fontWeight: 600, letterSpacing: '0.08em',
                      borderBottom: `2px solid ${t.accentDim}`,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const strip = s => (s || '').split(' ')[0];
                  const todayDay = new Date().getDate();
                  const rows = live?.monthly ? live.monthly.map(d => {
                    const day = parseInt(d.date.gregorian.day, 10);
                    const tm = d.timings;
                    return [day, strip(tm.Fajr), strip(tm.Dhuhr), strip(tm.Asr), strip(tm.Maghrib), strip(tm.Isha)];
                  }) : Array.from({ length: 30 }, (_, i) => {
                    const day = i + 1;
                    const fmt = m => `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
                    return [day, fmt(5*60+30-i), fmt(13*60+10), fmt(16*60+40+Math.floor(i/8)), fmt(19*60+45+i), fmt(21*60+10+i)];
                  });
                  return rows.map(row => {
                    const isToday = row[0] === todayDay;
                    return (
                      <tr key={row[0]} style={{
                        background: isToday ? t.accentGlow : 'transparent',
                        borderLeft: isToday ? `3px solid ${t.accent}` : 'none',
                      }}>
                        {row.map((cell, j) => (
                          <td key={j} style={{
                            padding: '7px 4px', textAlign: 'center',
                            color: isToday ? t.accent : t.text2,
                            borderBottom: `1px solid ${t.border}`,
                            fontWeight: isToday ? 600 : 400,
                          }}>{cell}</td>
                        ))}
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {pdfOpen && <PrayerPdfModal t={t} onClose={() => setPdfOpen(false)} city={city} country={country} method={method} />}
      {locOpen && <LocationSheet t={t} profile={profile} setProfile={setProfile} onClose={() => setLocOpen(false)} />}
    </div>
  );
}

function LocationSheet({ t, profile, setProfile, onClose }) {
  const [country, setCountry] = React.useState(profile?.country || '');
  const [city, setCity] = React.useState(profile?.city || '');

  const save = () => {
    if (!country || !city.trim()) return;
    setProfile({ ...profile, country, city: city.trim() });
    onClose();
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 250,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 390,
        background: t.bg, border: `1px solid ${t.border2}`,
        borderRadius: '18px 18px 0 0', padding: '20px 20px 28px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <div>
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 22, fontWeight: 800, letterSpacing: 2,
              color: t.accent, lineHeight: 1,
            }}>CHANGE LOCATION</div>
            <div style={{
              fontFamily: 'Amiri, Georgia, serif', fontSize: 13,
              color: t.accentDim, direction: 'rtl', marginTop: 4,
            }}>غيّر الموقع</div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: t.bg3, border: `1px solid ${t.border}`,
            color: t.text2, cursor: 'pointer', fontSize: 18,
          }}>×</button>
        </div>

        <div style={{
          fontFamily: 'DM Mono, monospace', fontSize: 9,
          letterSpacing: '0.18em', color: t.text3, marginBottom: 6,
        }}>COUNTRY</div>
        <select value={country} onChange={e => setCountry(e.target.value)} style={{
          width: '100%', padding: '12px 14px', marginBottom: 12,
          background: t.bg2, border: `1.5px solid ${country ? t.accent : t.border2}`,
          borderRadius: 10, color: t.text,
          fontFamily: 'DM Sans, sans-serif', fontSize: 14,
          outline: 'none', boxSizing: 'border-box',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' stroke='${encodeURIComponent(t.accent)}' stroke-width='1.5' fill='none'/></svg>")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 14px center',
        }}>
          <option value="">— Select country —</option>
          {window.QAWI_COUNTRIES.map(c => (
            <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
          ))}
        </select>

        <div style={{
          fontFamily: 'DM Mono, monospace', fontSize: 9,
          letterSpacing: '0.18em', color: t.text3, marginBottom: 6,
        }}>CITY</div>
        <input value={city} onChange={e => setCity(e.target.value)}
          placeholder="e.g. Detroit, Cairo, Istanbul"
          style={{
            width: '100%', padding: '12px 14px', marginBottom: 16,
            background: t.bg2, border: `1.5px solid ${t.border2}`,
            borderRadius: 10, color: t.text,
            fontFamily: 'DM Sans, sans-serif', fontSize: 14,
            outline: 'none', boxSizing: 'border-box',
          }}
          onFocus={e => { e.target.style.borderColor = t.accent; }}
          onBlur={e => { e.target.style.borderColor = t.border2; }}
        />

        <button onClick={save} disabled={!country || !city.trim()} style={{
          width: '100%', padding: 14,
          background: (!country || !city.trim()) ? t.bg4 : t.accent,
          border: 'none', borderRadius: 10, color: '#000',
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 14, fontWeight: 800, letterSpacing: 3,
          cursor: (!country || !city.trim()) ? 'not-allowed' : 'pointer',
        }}>✓ UPDATE LOCATION</button>
      </div>
    </div>
  );
}

function PrayerPdfModal({ t, onClose, city, country, method }) {
  const src = `Prayer Schedule PDF.html?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method || 2}`;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 16px', background: '#0a0a0f',
        borderBottom: `1px solid ${t.border}`,
      }}>
        <button onClick={onClose} style={{
          padding: '8px 14px', background: 'transparent',
          border: `1px solid ${t.border2}`, borderRadius: 6,
          color: t.text2, cursor: 'pointer',
          fontFamily: 'DM Mono, monospace', fontSize: 11, letterSpacing: '0.12em',
        }}>← CLOSE</button>
        <div style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 14, fontWeight: 800, letterSpacing: 3, color: t.accent,
        }}>PDF PREVIEW</div>
        <button onClick={() => {
          const iframe = document.getElementById('pdf-iframe');
          if (iframe && iframe.contentWindow) iframe.contentWindow.print();
        }} style={{
          padding: '8px 14px', background: t.accent,
          border: 'none', borderRadius: 6,
          color: '#000', cursor: 'pointer',
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 12, fontWeight: 800, letterSpacing: 2,
        }}>↓ SAVE PDF</button>
      </div>
      <iframe id="pdf-iframe" src={src} style={{
        flex: 1, border: 'none', width: '100%', background: '#faf6ec',
      }} />
    </div>
  );
}

window.PrayerScreen = PrayerScreen;
