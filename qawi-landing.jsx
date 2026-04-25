// qawi-landing.jsx — Minimal editorial landing.
// Reads `prefs` ({ tabs, hero }) to decide what to show.

function LandingScreen({ t, onNav, onBell, onPersonalize, onWidgets, profile, prefs }) {
  const isF = profile?.gender === 'female';
  const city = profile?.city || 'Detroit';
  const country = profile?.country ? window.QAWI_COUNTRY_NAME(profile.country) : 'United States';

  const METHOD = {
    AE:16, SA:4, KW:9, QA:10, BH:8, OM:8, YE:8,
    EG:5, JO:5, SY:5, LB:5, PS:5, IQ:5, SD:5,
    MA:3, DZ:3, TN:3, LY:3,
    PK:1, IN:1, BD:1, AF:1, MY:17, SG:11, BN:11, TH:11,
    TR:13, IR:7, FR:12, GB:3, RU:14,
  };
  const method = METHOD[profile?.country] || 2;

  const [live, setLive] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth() + 1;
    const url = `https://api.aladhan.com/v1/calendarByCity/${y}/${m}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`;
    fetch(url).then(r => r.json()).then(data => {
      if (cancelled || !data.data) return;
      const today = data.data[now.getDate() - 1] || data.data[0];
      const strip = s => (s || '').split(' ')[0];
      const list = [
        { name: 'FAJR',    ar: 'الفجر',    time: strip(today.timings.Fajr) },
        { name: 'DHUHR',   ar: 'الظهر',    time: strip(today.timings.Dhuhr) },
        { name: 'ASR',     ar: 'العصر',    time: strip(today.timings.Asr) },
        { name: 'MAGHRIB', ar: 'المغرب',   time: strip(today.timings.Maghrib) },
        { name: 'ISHA',    ar: 'العشاء',   time: strip(today.timings.Isha) },
      ];
      const nowM = now.getHours() * 60 + now.getMinutes();
      const toM = s => { const [hh, mm] = s.split(':').map(Number); return hh * 60 + mm; };
      let nextIdx = list.findIndex(p => toM(p.time) > nowM);
      if (nextIdx === -1) nextIdx = 0;
      list.forEach((p, i) => { p.passed = i < nextIdx; p.next = i === nextIdx; });
      setLive({ list });
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [city, country, method]);

  const fallback = [
    { name:'FAJR', ar:'الفجر', time:'05:12', passed:true },
    { name:'DHUHR', ar:'الظهر', time:'13:08', passed:true },
    { name:'ASR', ar:'العصر', time:'16:42', next:true },
    { name:'MAGHRIB', ar:'المغرب', time:'19:58' },
    { name:'ISHA', ar:'العشاء', time:'21:24' },
  ];
  const prayers = live?.list || fallback;

  const heroVariant = prefs?.hero || 'prayer';
  const tabs = prefs?.tabs || window.QAWI_ALL_TABS.map(x => ({ id: x.id, visible: true }));

  return (
    <div style={{
      minHeight: '100%', background: t.bg, color: t.text,
      position: 'relative', overflow: 'hidden',
      paddingTop: 54, paddingBottom: 40,
      fontFamily: 'DM Sans, sans-serif',
    }}>
      {/* Quiet background wash */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 0%, ${t.accentGlow} 0%, transparent 50%)`,
        pointerEvents: 'none',
      }} />

      {/* Faded calligraphic watermark */}
      <div style={{
        position: 'absolute', top: '12%', left: '50%',
        transform: 'translateX(-50%)', pointerEvents: 'none',
      }}>
        <QawiCalligraphy color={t.calligraphyColor} opacity={t.calligraphyOpacity * 0.4} size={300} />
      </div>

      {/* ═══════ MASTHEAD — wordmark + gear + bell ═══════ */}
      <div style={{
        position: 'relative', zIndex: 3,
        padding: '0 24px 28px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: 20, fontWeight: 900, letterSpacing: 6,
            color: t.accent, lineHeight: 1,
          }}>QAWI</div>
          <div style={{
            fontFamily: 'Amiri, Georgia, serif',
            fontSize: 15, color: t.accentDim,
            direction: 'rtl', lineHeight: 1,
          }}>قوي</div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={onWidgets} title="Widgets" style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'transparent', border: `1px solid ${t.border2}`,
            color: t.accent, cursor: 'pointer',
            display: 'grid', placeItems: 'center',
          }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1.5" stroke={t.accent} strokeWidth="1.3" fill="none"/>
              <rect x="9" y="1" width="6" height="6" rx="1.5" stroke={t.accent} strokeWidth="1.3" fill="none"/>
              <rect x="1" y="9" width="6" height="6" rx="1.5" stroke={t.accent} strokeWidth="1.3" fill="none"/>
              <rect x="9" y="9" width="6" height="6" rx="1.5" stroke={t.accent} strokeWidth="1.3" fill="none"/>
            </svg>
          </button>

          <button onClick={onPersonalize} title="Personalize" style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'transparent', border: `1px solid ${t.border2}`,
            color: t.accent, cursor: 'pointer',
            display: 'grid', placeItems: 'center',
          }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="2" stroke={t.accent} strokeWidth="1.3" fill="none"/>
              <path d="M8 1v2M8 13v2M14 8h-2M4 8H2M12.2 3.8l-1.4 1.4M5.2 10.8l-1.4 1.4M12.2 12.2l-1.4-1.4M5.2 5.2L3.8 3.8" stroke={t.accent} strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </button>

          <button onClick={onBell} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'transparent', border: `1px solid ${t.border2}`,
            color: t.accent, cursor: 'pointer',
            display: 'grid', placeItems: 'center', position: 'relative',
          }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5a4 4 0 0 0-4 4v2l-1.5 2.5h11L12 7.5v-2a4 4 0 0 0-4-4z" stroke={t.accent} strokeWidth="1.3" strokeLinejoin="round" fill="none"/>
              <path d="M6.5 12a1.5 1.5 0 0 0 3 0" stroke={t.accent} strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <div style={{
              position: 'absolute', top: 4, right: 4,
              width: 5, height: 5, borderRadius: '50%',
              background: t.accent2,
            }} />
          </button>
        </div>
      </div>

      {/* ═══════ HERO — swappable ═══════ */}
      <div style={{ position: 'relative', zIndex: 3, padding: '0 24px 40px' }}>
        {heroVariant === 'prayer'  && <PrayerHero  t={t} prayers={prayers} city={city} />}
        {heroVariant === 'athkar'  && <AthkarHero  t={t} />}
        {heroVariant === 'streak'  && <StreakHero  t={t} />}
        {heroVariant === 'verse'   && <VerseHero   t={t} />}
        {heroVariant === 'minimal' && <MinimalHero t={t} />}
      </div>

      {/* ═══════ INDEX — dynamic from prefs ═══════ */}
      <div style={{ position: 'relative', zIndex: 3, padding: '0 24px' }}>
        {tabs.filter(x => x.visible).map((tab, idx, arr) => {
          const meta = window.QAWI_ALL_TABS.find(x => x.id === tab.id);
          if (!meta) return null;
          const sub =
            tab.id === 'squad'
              ? `${isF ? 'Sisters' : 'Brothers'} · Ranking · Community`
              : meta.sub;
          const ar =
            tab.id === 'squad'
              ? (isF ? 'الأخوات' : 'الإخوة')
              : meta.ar;
          return (
            <IndexRow key={tab.id} t={t}
              label={meta.label} ar={ar} sub={sub}
              highlight={idx === 0}
              last={idx === arr.length - 1}
              onClick={() => onNav(tab.id)} />
          );
        })}
        {tabs.filter(x => x.visible).length === 0 && (
          <div style={{
            padding: '40px 10px', textAlign: 'center',
            fontFamily: 'DM Mono, monospace', fontSize: 10,
            letterSpacing: '0.2em', color: t.text3,
          }}>ALL TABS HIDDEN · TAP GEAR TO RESTORE</div>
        )}
      </div>

      {/* Manager access — faded corner */}
      <div style={{
        position: 'absolute', bottom: 10, right: 10, zIndex: 3,
      }}>
        <button onClick={() => onNav('manager')} title="Manager" style={{
          width: 24, height: 24, borderRadius: '50%',
          background: 'transparent', border: `1px solid ${t.border}`,
          color: t.text3, cursor: 'pointer',
          fontFamily: 'DM Mono, monospace',
          fontSize: 7, fontWeight: 600, letterSpacing: 0.5,
          display: 'grid', placeItems: 'center',
          opacity: 0.4,
        }}>K</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// HERO VARIANTS
// ═══════════════════════════════════════════════════════════════════════

function PrayerHero({ t, prayers, city }) {
  const next = prayers.find(p => p.next) || prayers[0];
  const [countdown, setCountdown] = React.useState({ h: '00', m: '00', s: '00' });

  React.useEffect(() => {
    if (!next) return;
    const tick = () => {
      const now = new Date();
      const [hh, mm] = next.time.split(':').map(Number);
      const target = new Date(now);
      target.setHours(hh, mm, 0, 0);
      if (target <= now) target.setDate(target.getDate() + 1);
      let s = Math.floor((target - now) / 1000);
      if (s < 0) s = 0;
      setCountdown({
        h: String(Math.floor(s / 3600)).padStart(2, '0'),
        m: String(Math.floor((s % 3600) / 60)).padStart(2, '0'),
        s: String(s % 60).padStart(2, '0'),
      });
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [next?.time]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: 'Amiri, Georgia, serif',
        fontSize: 64, color: t.accent,
        direction: 'rtl', lineHeight: 1, fontWeight: 700,
        marginBottom: 20,
        textShadow: `0 0 80px ${t.accentGlow}`,
      }}>{next.ar}</div>
      <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 10 }}>
        <TimeBlock digits={countdown.h} label="HRS" t={t} />
        <Colon t={t} />
        <TimeBlock digits={countdown.m} label="MIN" t={t} />
        <Colon t={t} />
        <TimeBlock digits={countdown.s} label="SEC" t={t} />
      </div>
      <div style={{
        marginTop: 14,
        fontFamily: 'DM Mono, monospace', fontSize: 10,
        letterSpacing: '0.24em', color: t.text3,
      }}>{next.name} · {next.time} · {city.toUpperCase()}</div>
    </div>
  );
}

function AthkarHero({ t }) {
  // Try to read real athkar progress
  const hour = new Date().getHours();
  const session = hour < 12 ? 'MORNING' : hour < 18 ? 'EVENING' : 'SLEEP';
  const sessionAr = hour < 12 ? 'الصباح' : hour < 18 ? 'المساء' : 'النوم';

  let done = 0, total = 18;
  try {
    const key = `qawi-athkar-${new Date().toISOString().slice(0,10)}-${session.toLowerCase()}`;
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    done = Object.values(saved).filter(v => v.complete).length;
  } catch {}
  if (session === 'EVENING') total = 15;
  if (session === 'SLEEP') total = 9;

  const pct = (done / total) * 100;
  const size = 180, stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size, margin: '0 auto 14px' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} stroke={t.border2} strokeWidth={stroke} fill="none"/>
          <circle cx={size/2} cy={size/2} r={r} stroke={t.accent} strokeWidth={stroke} fill="none"
            strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={c * (1 - pct/100)}
            style={{ transition: 'stroke-dashoffset .6s ease', filter: `drop-shadow(0 0 6px ${t.accentGlow})` }}/>
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        }}>
          <div style={{
            fontFamily: 'Amiri, Georgia, serif', fontSize: 34,
            color: t.accent, direction: 'rtl', lineHeight: 1, fontWeight: 700,
          }}>{sessionAr}</div>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: 40, fontWeight: 200, color: t.text, lineHeight: 1,
            marginTop: 6,
          }}>{done}<span style={{ color: t.text3, fontSize: 22 }}>/{total}</span></div>
        </div>
      </div>
      <div style={{
        fontFamily: 'DM Mono, monospace', fontSize: 10,
        letterSpacing: '0.24em', color: t.text3,
      }}>{session} ATHKAR · {Math.round(pct)}% COMPLETE</div>
    </div>
  );
}

function StreakHero({ t }) {
  const streak = 12; // from state in real usage
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: 'Amiri, Georgia, serif',
        fontSize: 44, color: t.accent,
        direction: 'rtl', lineHeight: 1, fontWeight: 700,
        marginBottom: 12,
        textShadow: `0 0 60px ${t.accentGlow}`,
      }}>مستمر</div>
      <div style={{
        fontFamily: 'Barlow Condensed, sans-serif',
        fontSize: 110, fontWeight: 200, letterSpacing: 2,
        color: t.accent, lineHeight: 0.9,
      }}>{streak}</div>
      <div style={{
        fontFamily: 'DM Mono, monospace', fontSize: 10,
        letterSpacing: '0.3em', color: t.text3,
        marginTop: 10,
      }}>DAY STREAK · STAY CONSISTENT</div>
    </div>
  );
}

const VERSES = [
  { ar:'إِنَّ مَعَ الْعُسْرِ يُسْرًا', en:'Indeed, with hardship comes ease.', ref:'Ash-Sharh · 94:6' },
  { ar:'وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ', en:'Be patient, for your patience is only by Allah.', ref:'An-Nahl · 16:127' },
  { ar:'فَاذْكُرُونِي أَذْكُرْكُمْ', en:'Remember Me; I will remember you.', ref:'Al-Baqarah · 2:152' },
  { ar:'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ', en:'Whoever relies on Allah, He is enough for him.', ref:'At-Talaq · 65:3' },
  { ar:'وَاللَّهُ خَيْرُ الرَّازِقِينَ', en:'Allah is the best of providers.', ref:'Al-Jumuah · 62:11' },
  { ar:'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', en:'In the remembrance of Allah hearts find rest.', ref:"Ar-Ra'd · 13:28" },
  { ar:'رَبِّ اشْرَحْ لِي صَدْرِي', en:'My Lord, expand for me my chest.', ref:'Taha · 20:25' },
];

function VerseHero({ t }) {
  const day = new Date();
  const idx = (day.getFullYear() * 366 + day.getMonth() * 31 + day.getDate()) % VERSES.length;
  const v = VERSES[idx];
  return (
    <div style={{ textAlign: 'center', padding: '0 4px' }}>
      <div style={{
        fontFamily: 'DM Mono, monospace', fontSize: 9,
        letterSpacing: '0.3em', color: t.accent, marginBottom: 16,
      }}>◊ VERSE · آية ◊</div>
      <div style={{
        fontFamily: 'Amiri, Georgia, serif',
        fontSize: 28, color: t.accent,
        direction: 'rtl', lineHeight: 1.8, fontWeight: 700,
        marginBottom: 18, textShadow: `0 0 40px ${t.accentGlow}`,
      }}>{v.ar}</div>
      <div style={{
        fontFamily: 'DM Sans, sans-serif', fontSize: 14,
        color: t.text2, fontStyle: 'italic',
        lineHeight: 1.5, marginBottom: 14,
        padding: '0 16px',
      }}>"{v.en}"</div>
      <div style={{
        fontFamily: 'DM Mono, monospace', fontSize: 9,
        letterSpacing: '0.24em', color: t.text3,
      }}>{v.ref}</div>
    </div>
  );
}

function MinimalHero({ t }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 5 ? 'As-salamu alaykum' :
    hour < 12 ? 'Sabah al-khayr' :
    hour < 18 ? 'Good afternoon' :
    'Masaa al-khayr';
  const greetingAr =
    hour < 5 ? 'السلام عليكم' :
    hour < 12 ? 'صباح الخير' :
    hour < 18 ? 'مساء النور' :
    'مساء الخير';
  return (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <div style={{
        fontFamily: 'Amiri, Georgia, serif',
        fontSize: 42, color: t.accent,
        direction: 'rtl', lineHeight: 1.3, fontWeight: 700,
        marginBottom: 14, textShadow: `0 0 60px ${t.accentGlow}`,
      }}>{greetingAr}</div>
      <div style={{
        fontFamily: 'DM Sans, sans-serif', fontSize: 13,
        color: t.text3, fontStyle: 'italic', letterSpacing: 2,
      }}>{greeting.toUpperCase()}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SHARED BLOCKS
// ═══════════════════════════════════════════════════════════════════════

function TimeBlock({ digits, label, t }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        fontFamily: 'Barlow Condensed, sans-serif',
        fontSize: 44, fontWeight: 200, letterSpacing: 2,
        color: t.accent, lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
      }}>{digits}</div>
      <div style={{
        fontFamily: 'DM Mono, monospace', fontSize: 7,
        letterSpacing: '0.3em', color: t.text3,
        marginTop: 4,
      }}>{label}</div>
    </div>
  );
}

function Colon({ t }) {
  return (
    <div style={{
      fontFamily: 'Barlow Condensed, sans-serif',
      fontSize: 36, fontWeight: 200, color: t.accentDim,
      lineHeight: 1, paddingBottom: 14,
      animation: 'pulse 1.2s infinite',
    }}>:</div>
  );
}

function IndexRow({ t, label, ar, sub, highlight, onClick, last }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 14,
        padding: '18px 4px',
        background: 'transparent',
        border: 'none',
        borderBottom: last ? 'none' : `1px solid ${t.border}`,
        cursor: 'pointer', fontFamily: 'inherit',
        textAlign: 'left', position: 'relative',
        transition: 'all .25s',
      }}>
      <div style={{
        position: 'absolute', left: 0, bottom: -1,
        height: 1, background: t.accent,
        width: hover ? '100%' : '0%',
        transition: 'width .35s ease',
      }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: highlight ? 32 : 26,
            fontWeight: highlight ? 900 : 800,
            letterSpacing: highlight ? 5 : 4,
            color: hover || highlight ? t.accent : t.text,
            lineHeight: 0.95,
            transition: 'color .2s',
          }}>{label}</div>
          <div style={{
            fontFamily: 'Amiri, Georgia, serif',
            fontSize: highlight ? 18 : 15,
            color: t.accentDim,
            direction: 'rtl', fontWeight: 700,
          }}>{ar}</div>
        </div>
        <div style={{
          fontFamily: 'DM Mono, monospace', fontSize: 9,
          letterSpacing: '0.14em', color: t.text3,
          marginTop: 6,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{sub}</div>
      </div>

      <div style={{
        fontFamily: 'Barlow Condensed, sans-serif',
        fontSize: 22, color: hover ? t.accent : t.accentDim,
        transform: hover ? 'translateX(4px)' : 'translateX(0)',
        transition: 'all .25s',
      }}>→</div>
    </button>
  );
}

window.LandingScreen = LandingScreen;
