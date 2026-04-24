// qawi-finders.jsx — SUJOOD only now (Sweat merged into Strive).
// Shows nearest single location, no filters/categories.
import * as React from 'react';
import { Topbar } from './dashboard.jsx';
import { DiamondDivider } from '../components/ornaments.jsx';

function FinderScreen({ t, kind, onBack }) {
  // Kind is always 'sujood' now, but we keep the arg for flexibility
  const config = {
    title: 'SUJOOD', titleAr: 'المسجد',
    hero: 'سجود',
    nearest: {
      name: 'Masjid An-Nur',
      addr: '1875 Michigan Ave, Detroit MI',
      dist: '0.3 mi',
      walk: '6 min walk',
      next: 'Asr · 16:42',
      rating: 5.0,
    },
    others: [
      { name: 'Islamic Center of Detroit', addr: '15571 Joy Rd',     dist: '0.7 mi' },
      { name: 'Masjid Al-Falah',           addr: '4408 Tireman St',  dist: '1.1 mi' },
      { name: 'Dawah Center',              addr: '9925 Vernor Hwy',  dist: '1.6 mi' },
      { name: 'Masjid As-Salam',           addr: '2203 W McNichols', dist: '2.3 mi' },
    ],
  };

  return (
    <div style={{ minHeight: '100%', background: t.bg, color: t.text, paddingBottom: 40 }}>
      <Topbar t={t} onBack={onBack} title={config.title} titleAr={config.titleAr} />

      {/* Map hero */}
      <div style={{
        position: 'relative', height: 220, overflow: 'hidden',
        borderBottom: `1px solid ${t.border}`,
      }}>
        <div style={{
          position: 'absolute', inset: 0, background: t.bg2,
          backgroundImage: `
            linear-gradient(${t.border} 1px, transparent 1px),
            linear-gradient(90deg, ${t.border} 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }} />
        <div style={{ position: 'absolute', top: '45%', left: 0, right: 0, height: 3, background: t.bg4, transform: 'rotate(-4deg)' }} />
        <div style={{ position: 'absolute', top: '65%', left: 0, right: 0, height: 2, background: t.bg4, transform: 'rotate(3deg)' }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '38%', width: 2, background: t.bg4 }} />

        {/* Single nearest pin — highlighted */}
        <div style={{
          position: 'absolute', left: '48%', top: '42%',
          transform: 'translate(-50%, -100%)',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50% 50% 50% 0',
            background: t.accent,
            transform: 'rotate(-45deg)',
            border: `2px solid ${t.bg}`,
            boxShadow: `0 6px 16px ${t.accentGlow}, 0 0 24px ${t.accentGlow}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              transform: 'rotate(45deg)',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 14, fontWeight: 900, color: '#000',
            }}>★</div>
          </div>
        </div>

        {/* You are here */}
        <div style={{
          position: 'absolute', left: '50%', top: '62%',
          transform: 'translate(-50%, -50%)',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: `radial-gradient(circle, ${t.accent2}50 0%, transparent 70%)`,
            animation: 'pulse 2s infinite',
          }} />
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 12, height: 12, borderRadius: '50%',
            background: t.accent2, border: `2px solid ${t.bg}`,
          }} />
        </div>

        <div style={{
          position: 'absolute', right: 12, bottom: -20,
          fontFamily: 'Amiri, Georgia, serif', fontSize: 90,
          color: t.accent, opacity: 0.15,
          direction: 'rtl', lineHeight: 0.8, pointerEvents: 'none',
          fontWeight: 700,
        }}>{config.hero}</div>

        <div style={{
          position: 'absolute', top: 12, left: 12,
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 10px',
          background: `${t.bg}CC`, backdropFilter: 'blur(8px)',
          border: `1px solid ${t.border2}`, borderRadius: 20,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%',
            background: t.green, boxShadow: `0 0 6px ${t.green}` }} />
          <span style={{
            fontFamily: 'DM Mono, monospace', fontSize: 10,
            color: t.text, letterSpacing: '0.08em',
          }}>LIVE LOCATION</span>
        </div>
      </div>

      <div style={{ padding: '14px 14px' }}>
        <div style={{
          fontFamily: 'DM Mono, monospace', fontSize: 9,
          letterSpacing: '0.3em', color: t.text3, marginBottom: 10,
        }}>— NEAREST MASJID · الأقرب —</div>

        {/* Nearest — hero card */}
        <div style={{
          background: t.bg2, border: `1px solid ${t.accent}`,
          borderRadius: 14, padding: 16, position: 'relative', overflow: 'hidden',
          marginBottom: 14,
        }}>
          <div style={{
            position: 'absolute', bottom: -24, right: -14,
            fontFamily: 'Amiri, Georgia, serif', fontSize: 110,
            color: t.accent, opacity: 0.09,
            direction: 'rtl', lineHeight: 0.8, pointerEvents: 'none',
            fontWeight: 700,
          }}>مسجد</div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-block',
              fontSize: 9, color: '#000',
              padding: '3px 10px', background: t.accent,
              borderRadius: 4, marginBottom: 10,
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 800, letterSpacing: 2,
            }}>NEAREST</div>

            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 26, fontWeight: 800, letterSpacing: 1.5,
              color: t.text, lineHeight: 1.05,
            }}>{config.nearest.name.toUpperCase()}</div>

            <div style={{
              fontSize: 12, color: t.text3, marginTop: 6,
              fontFamily: 'DM Mono, monospace',
            }}>{config.nearest.addr}</div>

            <div style={{
              display: 'flex', gap: 14, marginTop: 14,
              padding: '10px 0', borderTop: `1px solid ${t.border}`,
              borderBottom: `1px solid ${t.border}`,
            }}>
              <div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9,
                  color: t.text3, letterSpacing: '0.12em' }}>DISTANCE</div>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 20, fontWeight: 800, color: t.accent, lineHeight: 1,
                  marginTop: 3 }}>{config.nearest.dist}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9,
                  color: t.text3, letterSpacing: '0.12em' }}>WALK</div>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 20, fontWeight: 800, color: t.accent, lineHeight: 1,
                  marginTop: 3 }}>{config.nearest.walk}</div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9,
                  color: t.text3, letterSpacing: '0.12em' }}>NEXT PRAYER</div>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 14, fontWeight: 700, color: t.accent2, lineHeight: 1,
                  marginTop: 3 }}>{config.nearest.next}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button style={{
                flex: 1, padding: 12, background: t.accent, border: 'none',
                borderRadius: 8, color: '#000',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 13, fontWeight: 800, letterSpacing: 2, cursor: 'pointer',
              }}>DIRECTIONS</button>
              <button style={{
                padding: '12px 16px', background: t.bg3,
                border: `1px solid ${t.border2}`, borderRadius: 8,
                color: t.accent, cursor: 'pointer',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 13, fontWeight: 800, letterSpacing: 2,
              }}>SAVE</button>
            </div>
          </div>
        </div>

        {/* Others — simple list, no filters */}
        <DiamondDivider color={t.accent} label="OTHER NEARBY" labelAr="أخرى" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
          {config.others.map((r, i) => (
            <div key={r.name} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 12px', background: t.bg2,
              border: `1px solid ${t.border}`, borderRadius: 10, cursor: 'pointer',
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 6,
                background: t.bg3, color: t.accentDim,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 14, fontWeight: 900,
              }}>{i + 2}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 14, fontWeight: 700, letterSpacing: 1,
                  color: t.text, textTransform: 'uppercase',
                }}>{r.name}</div>
                <div style={{
                  fontSize: 10, color: t.text3, marginTop: 2,
                  fontFamily: 'DM Mono, monospace',
                }}>{r.addr}</div>
              </div>
              <div style={{
                fontFamily: 'DM Mono, monospace', fontSize: 11,
                color: t.accent, letterSpacing: '0.05em',
              }}>{r.dist}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { FinderScreen };
