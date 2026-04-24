// qawi-bell.jsx — Notifications/reminders panel

function BellSheet({ t, onClose }) {
  const [prefs, setPrefs] = React.useState({
    azan: true, gym: true, journal: true, squad: true,
  });
  const toggle = (k) => setPrefs(p => ({ ...p, [k]: !p[k] }));

  const recent = [
    { icon: '◆', tag: 'ASR',     msg: 'Asr in 12 minutes',                            time: '2m',  ar: 'الفجر', color: t.accent },
    { icon: '✦', tag: 'GYM',     msg: "You haven't logged the gym today",             time: '1h',  ar: 'صالة', color: t.accent2 },
    { icon: '◈', tag: 'JOURNAL', msg: 'Log your day before maghrib',                  time: '3h',  ar: 'يومي', color: t.green },
    { icon: '✧', tag: 'SQUAD',   msg: 'Mustafa just logged gym · 15 sessions',        time: '4h',  ar: 'الإخوة', color: t.accent },
    { icon: '◆', tag: 'DHUHR',   msg: 'Dhuhr time entered · 13:08',                   time: '6h',  ar: 'الظهر', color: t.accent },
  ];

  const toggles = [
    { key: 'azan',    label: 'PRAYER REMINDERS', ar: 'الصلاة', desc: 'Azan notifications for all 5 daily prayers' },
    { key: 'gym',     label: 'GYM REMINDERS',    ar: 'الصالة', desc: '"Hit the gym today" — evening nudge' },
    { key: 'journal', label: 'DAILY JOURNAL',    ar: 'يومي',    desc: 'Log your day before maghrib' },
    { key: 'squad',   label: 'SQUAD ACTIVITY',   ar: 'الإخوة',  desc: 'When brothers log gym / prayer / meals' },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 390, maxHeight: '88%',
        background: t.bg, border: `1px solid ${t.border2}`,
        borderRadius: '18px 18px 0 0', padding: 20,
        overflowY: 'auto', fontFamily: 'DM Sans, sans-serif',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          marginBottom: 18,
        }}>
          <div>
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 22, fontWeight: 800, letterSpacing: 2,
              color: t.accent, lineHeight: 1,
            }}>NOTIFICATIONS</div>
            <div style={{
              fontFamily: 'Amiri, Georgia, serif', fontSize: 13,
              color: t.accentDim, direction: 'rtl', marginTop: 4,
            }}>التنبيهات</div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: t.bg3, border: `1px solid ${t.border}`,
            color: t.text2, cursor: 'pointer', fontSize: 16,
          }}>×</button>
        </div>

        {/* Recent */}
        <div style={{
          fontFamily: 'DM Mono, monospace', fontSize: 9,
          letterSpacing: '0.2em', color: t.text3, marginBottom: 8,
        }}>// RECENT</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
          {recent.map((n, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', background: t.bg2,
              border: `1px solid ${t.border}`, borderRadius: 8,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: t.bg3, color: n.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, flexShrink: 0,
              }}>{n.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
                  color: n.color, marginBottom: 1,
                }}>{n.tag}</div>
                <div style={{ fontSize: 12, color: t.text, lineHeight: 1.3 }}>{n.msg}</div>
              </div>
              <div style={{
                fontFamily: 'DM Mono, monospace', fontSize: 10,
                color: t.text3,
              }}>{n.time}</div>
            </div>
          ))}
        </div>

        {/* Preferences */}
        <div style={{
          fontFamily: 'DM Mono, monospace', fontSize: 9,
          letterSpacing: '0.2em', color: t.text3, marginBottom: 8,
        }}>// REMIND ME FOR</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
          {toggles.map(tg => (
            <div key={tg.key} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: 12, background: t.bg2,
              border: `1px solid ${prefs[tg.key] ? t.border2 : t.border}`,
              borderRadius: 10,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 13, fontWeight: 700, letterSpacing: 1.5,
                  color: prefs[tg.key] ? t.accent : t.text2,
                }}>{tg.label} <span style={{fontFamily:'Amiri,Georgia,serif',fontSize:11,marginLeft:4,opacity:.7}}>· {tg.ar}</span></div>
                <div style={{
                  fontSize: 11, color: t.text3, marginTop: 3, lineHeight: 1.3,
                }}>{tg.desc}</div>
              </div>
              <button onClick={() => toggle(tg.key)} style={{
                width: 42, height: 24, borderRadius: 12,
                background: prefs[tg.key] ? t.accent : t.bg4,
                border: `1px solid ${prefs[tg.key] ? t.accent : t.border2}`,
                position: 'relative', cursor: 'pointer', flexShrink: 0,
                transition: 'all .2s',
              }}>
                <div style={{
                  position: 'absolute', top: 1, left: prefs[tg.key] ? 19 : 1,
                  width: 20, height: 20, borderRadius: '50%',
                  background: prefs[tg.key] ? '#000' : t.text3,
                  transition: 'left .2s',
                }} />
              </button>
            </div>
          ))}
        </div>

        <div style={{
          padding: 12, background: t.bg2,
          border: `1px solid ${t.border}`, borderLeft: `3px solid ${t.accent2}`,
          borderRadius: '0 8px 8px 0',
          fontSize: 11, color: t.text2, lineHeight: 1.5,
        }}>
          <span style={{color:t.accent2, fontFamily:'DM Mono, monospace', fontSize:9, letterSpacing:'0.2em'}}>// NOTE · </span>
          Azan uses Detroit · 42.3°N, Hanafi method. Change in Settings.
        </div>
      </div>
    </div>
  );
}

window.BellSheet = BellSheet;
