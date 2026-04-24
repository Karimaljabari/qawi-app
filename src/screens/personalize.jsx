// qawi-personalize.jsx — Layout / Hero / Appearance
// Full-page screen reached via the gear on the home masthead.
// Edits a `prefs` object that LandingScreen reads from.
import * as React from 'react';
import { Topbar } from './dashboard.jsx';

const HERO_OPTIONS = [
  { id: 'prayer',  label: 'NEXT PRAYER',   ar: 'الصلاة',    desc: 'Countdown to the next prayer' },
  { id: 'athkar',  label: 'ATHKAR',         ar: 'الأذكار',   desc: "Today's morning/evening progress" },
  { id: 'streak',  label: 'STREAK',         ar: 'متتابع',    desc: 'Days in a row you showed up' },
  { id: 'verse',   label: 'VERSE',          ar: 'آية',       desc: 'Rotating Quranic ayah' },
  { id: 'minimal', label: 'MINIMAL',        ar: 'بساطة',     desc: 'Just the wordmark. Breathe.' },
];

const ALL_TABS = [
  { id: 'dash',    label: 'STRIVE',  ar: 'إجتهاد',   sub: 'Gym · Steps · Body · Journal', locked: false },
  { id: 'salah',   label: 'SALAH',   ar: 'الصلاة',   sub: 'Prayer times · Masjids · Schedule', locked: true },
  { id: 'athkar',  label: 'ATHKAR',  ar: 'الأذكار',   sub: 'Morning · Evening · Sleep', locked: false },
  { id: 'squad',   label: 'SQUAD',   ar: 'الإخوة',   sub: 'Brothers/Sisters · Ranking · Community', locked: false },
  { id: 'manager', label: 'MANAGER', ar: 'الإدارة',   sub: 'Broadcasts · Channels · Admin', locked: false, optional: true },
];

const VARIANTS = [
  { id: 'obsidian', label: 'OBSIDIAN', desc: 'Gold on black', swatchBg: '#0a0a0b', swatchAcc: '#c9a961' },
  { id: 'midnight', label: 'MIDNIGHT', desc: 'Indigo on deep blue', swatchBg: '#0a1428', swatchAcc: '#7aa7ff' },
  { id: 'blood',    label: 'BLOOD',    desc: 'Crimson on noir', swatchBg: '#0c0607', swatchAcc: '#c8453c' },
];

function PersonalizeScreen({ t, onBack, prefs, setPrefs, variant, setVariant }) {
  const setTab = (id, patch) => {
    const tabs = prefs.tabs.map(tab => tab.id === id ? { ...tab, ...patch } : tab);
    setPrefs({ ...prefs, tabs });
  };
  const moveTab = (idx, dir) => {
    const next = [...prefs.tabs];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    setPrefs({ ...prefs, tabs: next });
  };
  const resetDefaults = () => {
    if (!confirm('Reset personalization to defaults?')) return;
    setPrefs({
      tabs: ALL_TABS.map(tab => ({ id: tab.id, visible: !tab.optional })),
      hero: 'prayer',
    });
  };

  return (
    <div style={{ minHeight: '100%', background: t.bg, color: t.text, paddingBottom: 40 }}>
      <Topbar t={t} onBack={onBack} title="PERSONALIZE" titleAr="تخصيص" />

      {/* Intro */}
      <div style={{
        padding: '18px 20px 8px',
        borderBottom: `1px solid ${t.border}`,
      }}>
        <div style={{
          fontFamily: 'Amiri, Georgia, serif', fontSize: 13,
          color: t.accentDim, fontStyle: 'italic', lineHeight: 1.5,
          direction: 'rtl', textAlign: 'right', marginBottom: 8,
        }}>فرّدها كما تشاء</div>
        <div style={{
          fontFamily: 'DM Sans, sans-serif', fontSize: 13,
          color: t.text2, lineHeight: 1.5,
        }}>Your fortress, your layout. Reorder tabs, pick a hero, swap the theme.</div>
      </div>

      {/* ═══════ LAYOUT ═══════ */}
      <SectionHeader t={t} num="01" label="LAYOUT" ar="الترتيب"
        desc="Which tabs show on home, in what order." />

      <div style={{ padding: '0 16px' }}>
        {prefs.tabs.map((tab, idx) => {
          const meta = ALL_TABS.find(x => x.id === tab.id);
          if (!meta) return null;
          return (
            <div key={tab.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 10px',
              background: t.bg2, border: `1px solid ${t.border}`,
              borderRadius: 10, marginBottom: 8,
              opacity: tab.visible ? 1 : 0.45,
            }}>
              {/* Reorder arrows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <ArrowBtn t={t} disabled={idx === 0} onClick={() => moveTab(idx, -1)} dir="up" />
                <ArrowBtn t={t} disabled={idx === prefs.tabs.length - 1} onClick={() => moveTab(idx, 1)} dir="down" />
              </div>

              {/* Label */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <div style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: 18, fontWeight: 900, letterSpacing: 3,
                    color: t.accent, lineHeight: 1,
                  }}>{meta.label}</div>
                  <div style={{
                    fontFamily: 'Amiri, Georgia, serif', fontSize: 13,
                    color: t.accentDim, direction: 'rtl', fontWeight: 700,
                  }}>{meta.ar}</div>
                  {meta.locked && (
                    <div style={{
                      fontFamily: 'DM Mono, monospace', fontSize: 7,
                      letterSpacing: '0.2em', color: t.text3,
                      padding: '2px 6px', border: `1px solid ${t.border2}`,
                      borderRadius: 3,
                    }}>PINNED</div>
                  )}
                  {meta.optional && (
                    <div style={{
                      fontFamily: 'DM Mono, monospace', fontSize: 7,
                      letterSpacing: '0.2em', color: t.accent2 || t.accent,
                      padding: '2px 6px', border: `1px solid ${t.accent2 || t.accent}`,
                      borderRadius: 3,
                    }}>ADMIN</div>
                  )}
                </div>
                <div style={{
                  fontFamily: 'DM Mono, monospace', fontSize: 9,
                  letterSpacing: '0.12em', color: t.text3, marginTop: 4,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{meta.sub}</div>
              </div>

              {/* Visibility toggle */}
              <Toggle t={t}
                on={tab.visible}
                disabled={meta.locked}
                onChange={v => setTab(tab.id, { visible: v })} />
            </div>
          );
        })}
      </div>

      {/* ═══════ HERO ═══════ */}
      <SectionHeader t={t} num="02" label="HERO" ar="الفاتحة"
        desc="The top of your home screen." />

      <div style={{ padding: '0 16px', display: 'grid', gap: 8 }}>
        {HERO_OPTIONS.map(opt => {
          const active = prefs.hero === opt.id;
          return (
            <button key={opt.id}
              onClick={() => setPrefs({ ...prefs, hero: opt.id })}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 14px',
                background: active ? t.accentGlow : t.bg2,
                border: `1px solid ${active ? t.accent : t.border}`,
                borderRadius: 10, cursor: 'pointer',
                textAlign: 'left', fontFamily: 'inherit', color: t.text,
              }}>
              {/* Radio */}
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                border: `1.5px solid ${active ? t.accent : t.border2}`,
                display: 'grid', placeItems: 'center', flexShrink: 0,
              }}>
                {active && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.accent }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <div style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: 15, fontWeight: 900, letterSpacing: 2.5,
                    color: active ? t.accent : t.text, lineHeight: 1,
                  }}>{opt.label}</div>
                  <div style={{
                    fontFamily: 'Amiri, Georgia, serif', fontSize: 13,
                    color: t.accentDim, direction: 'rtl', fontWeight: 700,
                  }}>{opt.ar}</div>
                </div>
                <div style={{
                  fontFamily: 'DM Sans, sans-serif', fontSize: 11,
                  color: t.text3, marginTop: 4,
                }}>{opt.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ═══════ APPEARANCE ═══════ */}
      <SectionHeader t={t} num="03" label="APPEARANCE" ar="الهيئة"
        desc="Theme of the fortress." />

      <div style={{ padding: '0 16px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {VARIANTS.map(v => {
          const active = variant === v.id;
          return (
            <button key={v.id}
              onClick={() => setVariant(v.id)}
              style={{
                padding: '12px 8px',
                background: active ? t.accentGlow : t.bg2,
                border: `1px solid ${active ? t.accent : t.border}`,
                borderRadius: 10, cursor: 'pointer',
                textAlign: 'center', fontFamily: 'inherit', color: t.text,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: v.swatchBg,
                border: `2px solid ${v.swatchAcc}`,
                boxShadow: `0 0 12px ${v.swatchAcc}40`,
                display: 'grid', placeItems: 'center',
              }}>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%',
                  background: v.swatchAcc,
                }} />
              </div>
              <div style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 12, fontWeight: 900, letterSpacing: 2,
                color: active ? t.accent : t.text,
              }}>{v.label}</div>
              <div style={{
                fontFamily: 'DM Mono, monospace', fontSize: 7,
                letterSpacing: '0.15em', color: t.text3, lineHeight: 1.3,
              }}>{v.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Reset */}
      <div style={{ padding: '20px 16px 0', textAlign: 'center' }}>
        <button onClick={resetDefaults} style={{
          padding: '10px 22px',
          background: 'transparent',
          border: `1px solid ${t.border2}`,
          borderRadius: 20, cursor: 'pointer',
          fontFamily: 'DM Mono, monospace', fontSize: 9,
          letterSpacing: '0.2em', color: t.text3,
        }}>⟲ RESET TO DEFAULTS</button>
      </div>

      {/* Closing */}
      <div style={{ padding: '30px 20px 0', textAlign: 'center' }}>
        <div style={{
          fontFamily: 'Amiri, Georgia, serif', fontSize: 13,
          color: t.accentDim, fontStyle: 'italic',
          direction: 'rtl',
        }}>إن الله جميل يحب الجمال</div>
        <div style={{
          fontFamily: 'DM Sans, sans-serif', fontSize: 10,
          color: t.text3, marginTop: 6, fontStyle: 'italic',
        }}>"Allah is beautiful and loves beauty" · Muslim</div>
      </div>
    </div>
  );
}

function SectionHeader({ t, num, label, ar, desc }) {
  return (
    <div style={{ padding: '26px 20px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
        <div style={{
          fontFamily: 'DM Mono, monospace', fontSize: 9,
          letterSpacing: '0.24em', color: t.accent,
        }}>{num}</div>
        <div style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 20, fontWeight: 900, letterSpacing: 4,
          color: t.text,
        }}>{label}</div>
        <div style={{
          fontFamily: 'Amiri, Georgia, serif', fontSize: 14,
          color: t.accentDim, direction: 'rtl', fontWeight: 700,
        }}>{ar}</div>
      </div>
      <div style={{
        fontFamily: 'DM Sans, sans-serif', fontSize: 11,
        color: t.text3,
      }}>{desc}</div>
    </div>
  );
}

function ArrowBtn({ t, onClick, disabled, dir }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: 20, height: 16,
      background: disabled ? 'transparent' : t.bg3,
      border: `1px solid ${disabled ? t.border : t.border2}`,
      borderRadius: 3,
      color: disabled ? t.text3 : t.accent,
      cursor: disabled ? 'default' : 'pointer',
      display: 'grid', placeItems: 'center',
      fontSize: 8, padding: 0, opacity: disabled ? 0.35 : 1,
    }}>{dir === 'up' ? '▲' : '▼'}</button>
  );
}

function Toggle({ t, on, onChange, disabled }) {
  return (
    <button
      onClick={() => !disabled && onChange(!on)}
      disabled={disabled}
      style={{
        width: 42, height: 24, borderRadius: 12,
        background: on ? t.accent : t.bg3,
        border: `1px solid ${on ? t.accent : t.border2}`,
        position: 'relative', cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1, flexShrink: 0,
        transition: 'all .18s',
      }}>
      <div style={{
        position: 'absolute', top: 2, left: on ? 20 : 2,
        width: 18, height: 18, borderRadius: '50%',
        background: on ? t.bg : t.text3,
        transition: 'left .18s',
      }} />
    </button>
  );
}

export { PersonalizeScreen, HERO_OPTIONS as QAWI_HERO_OPTIONS, ALL_TABS as QAWI_ALL_TABS };
