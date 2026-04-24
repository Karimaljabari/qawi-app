// qawi-dashboard.jsx — Today screen: gym, steps, body metrics

function DashboardScreen({ t, state, setState, onBack, profile }) {
  const [tab, setTab] = React.useState('today');
  const pct = (v, g) => Math.min(100, Math.round((v / g) * 100));
  const stepsPct = pct(state.steps, state.stepsGoal);
  const monthDays = Array.from({length: 30}, (_, i) => i + 1);
  const today = 19;
  const gymDays = state.gymDays; // Set of day numbers

  return (
    <div style={{ minHeight: '100%', background: t.bg, color: t.text, paddingBottom: 40 }}>
      {/* Topbar */}
      <Topbar t={t} onBack={onBack} title="STRIVE" titleAr="إجتهاد" />

      {/* Tabs */}
      <div style={{
        display: 'flex', borderBottom: `1px solid ${t.border}`,
        padding: '0 16px', background: t.bg2, gap: 4,
      }}>
        {[['today','TODAY','اليوم'], ['month','MONTH','الشهر'], ['body','BODY','الجسم']].map(([id, lbl, ar]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            background: 'none', border: 'none',
            padding: '14px 10px', cursor: 'pointer',
            color: tab === id ? t.accent : t.text3,
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: 13, fontWeight: 700, letterSpacing: 2,
            borderBottom: tab === id ? `2px solid ${t.accent}` : '2px solid transparent',
            marginBottom: -1,
          }}>{lbl}<span style={{fontFamily:'Amiri,Georgia,serif',fontSize:10,marginLeft:4,opacity:.6,letterSpacing:0}}>{ar}</span></button>
        ))}
      </div>

      <div style={{ padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tab === 'today' && <>
          {/* Status */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', background: t.bg2,
            border: `1px solid ${t.border}`, borderRadius: 10,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.green,
              boxShadow: `0 0 8px ${t.green}` }} />
            <div style={{ flex: 1, fontSize: 12, fontWeight: 500 }}>Day {state.streak} · Streak alive</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: t.text3 }}>WEIGHT LOSS</div>
          </div>

          {/* Notebook pop-up circle */}
          <NotebookCircle t={t} state={state} setState={setState} profile={profile} />

          {/* Rings row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <RingCard t={t} label="STREAK" value={state.streak} unit="days" ar="أيام" />
            <RingCard t={t} label="GYM / MTH" value={gymDays.size} unit={`of ${state.gymTarget}`} ar="مرة" />
          </div>

          {/* Today big card */}
          <div style={{
            background: t.bg2, border: `1px solid ${t.border}`,
            borderRadius: 12, padding: 16, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -10, right: -10,
              fontFamily: 'Amiri, Georgia, serif', fontSize: 90,
              color: t.accent, opacity: 0.06,
              direction: 'rtl', lineHeight: 0.8, pointerEvents: 'none',
            }}>اليوم</div>

            <div style={{
              fontFamily: 'DM Mono, monospace', fontSize: 10,
              letterSpacing: '0.2em', color: t.text3, marginBottom: 14,
            }}>— SUNDAY · APR 19 · 2026 —</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {/* Gym button */}
              <div style={{
                background: t.bg3, border: `1px solid ${t.border}`,
                borderRadius: 8, padding: 14, textAlign: 'center',
              }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9,
                  color: t.text3, letterSpacing: '0.15em', marginBottom: 10 }}>GYM TODAY</div>
                <button onClick={() => setState(s => {
                  const newSet = new Set(s.gymDays);
                  if (newSet.has(today)) newSet.delete(today);
                  else newSet.add(today);
                  return { ...s, gymDays: newSet };
                })} style={{
                  width: 66, height: 66, borderRadius: '50%',
                  border: `2px solid ${gymDays.has(today) ? t.accent : t.border2}`,
                  background: gymDays.has(today) ? t.accent : t.bg4,
                  color: gymDays.has(today) ? '#000' : t.text2,
                  cursor: 'pointer', margin: '0 auto',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 700,
                  transition: 'all .2s',
                }}>{gymDays.has(today) ? '✓' : ''}</button>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9,
                  color: t.text3, marginTop: 8 }}>
                  {gymDays.has(today) ? 'LOGGED' : 'TAP TO LOG'}
                </div>
              </div>

              {/* Steps */}
              <div style={{
                background: t.bg3, border: `1px solid ${t.border}`,
                borderRadius: 8, padding: 14, textAlign: 'center',
              }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9,
                  color: t.text3, letterSpacing: '0.15em', marginBottom: 10 }}>STEPS</div>
                <input type="number" value={state.steps}
                  onChange={e => setState(s => ({ ...s, steps: Number(e.target.value) || 0 }))}
                  style={{
                    width: '100%', background: t.bg4, border: `1px solid ${t.border2}`,
                    borderRadius: 6, color: t.text,
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: 26, fontWeight: 800, textAlign: 'center',
                    padding: 4, outline: 'none',
                  }} />
                <div style={{
                  background: t.bg4, borderRadius: 20, height: 4,
                  marginTop: 8, overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${stepsPct}%`, height: '100%',
                    background: t.accent, transition: 'width .4s',
                  }} />
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 8, color: t.text3, fontFamily: 'DM Mono, monospace',
                  marginTop: 4,
                }}>
                  <span>{stepsPct}%</span>
                  <span>GOAL {state.stepsGoal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div style={{
            background: t.bg2, border: `1px solid ${t.border}`,
            borderLeft: `3px solid ${t.accent2}`,
            borderRadius: '0 10px 10px 0',
            padding: '12px 14px',
          }}>
            <div style={{ fontSize: 12, color: t.text, fontStyle: 'italic',
              lineHeight: 1.6 }}>"The pain you feel today will be the strength you feel tomorrow."</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9,
              color: t.accent, marginTop: 5, letterSpacing: '0.1em' }}>— DAVID GOGGINS</div>
          </div>
        </>}

        {tab === 'month' && <>
          <div style={{
            background: t.bg2, border: `1px solid ${t.border}`,
            borderRadius: 12, padding: 14,
          }}>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 15, fontWeight: 700, letterSpacing: 1.5,
              color: t.text2, textTransform: 'uppercase', marginBottom: 12 }}>
              APRIL · GYM GRID
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
              {monthDays.map(d => (
                <div key={d} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 8, color: t.text3,
                    fontFamily: 'DM Mono, monospace', marginBottom: 2 }}>{d}</div>
                  <div style={{
                    aspectRatio: '1', borderRadius: 3,
                    background: gymDays.has(d) ? t.accent : t.bg3,
                    border: `1px solid ${gymDays.has(d) ? t.accent : t.border}`,
                    borderColor: d === today ? t.border3 : (gymDays.has(d) ? t.accent : t.border),
                  }} />
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 12, padding: '10px 12px',
              background: t.bg3, borderRadius: 8,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 9, color: t.text3,
                  fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em' }}>SESSIONS THIS MONTH</div>
                <div style={{ fontFamily: 'Amiri, Georgia, serif',
                  fontSize: 10, color: t.accentDim, direction: 'rtl', marginTop: 2 }}>حصص الشهر</div>
              </div>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 28, fontWeight: 800, color: t.accent }}>{gymDays.size}<span style={{fontSize:14,color:t.text3}}>/{state.gymTarget}</span></div>
            </div>
          </div>
        </>}

        {tab === 'body' && <>
          <div style={{
            background: t.bg2, border: `1px solid ${t.border}`,
            borderRadius: 12, padding: 14,
          }}>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 15, fontWeight: 700, letterSpacing: 1.5,
              color: t.text2, textTransform: 'uppercase', marginBottom: 12 }}>
              LATEST METRICS
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
              {[
                ['WEIGHT', '82.4', 'kg', '-1.2'],
                ['CHEST', '102', 'cm', '+0.5'],
                ['WAIST', '86', 'cm', '-0.8'],
                ['ARM', '38', 'cm', '+0.3'],
              ].map(([lbl, v, u, d]) => (
                <div key={lbl} style={{
                  background: t.bg3, border: `1px solid ${t.border}`,
                  borderRadius: 8, padding: 11,
                }}>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9,
                    color: t.text3, letterSpacing: '0.1em' }}>{lbl}</div>
                  <div style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: 24, fontWeight: 700, color: t.accent,
                    marginTop: 4, lineHeight: 1,
                  }}>{v}<span style={{fontSize:11,color:t.text2,fontFamily:'DM Sans'}}> {u}</span></div>
                  <div style={{ fontSize: 9, color: d.startsWith('-') ? t.green : t.accent2,
                    fontFamily: 'DM Mono, monospace', marginTop: 3 }}>{d} this week</div>
                </div>
              ))}
            </div>
          </div>

          <ProgressPhotosCard t={t} />
        </>}
      </div>
    </div>
  );
}

function Topbar({ t, onBack, title, titleAr }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 10,
      background: t.bg, borderBottom: `1px solid ${t.border}`,
      padding: '56px 14px 12px',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <button onClick={onBack} style={{
        background: 'none', border: `1px solid ${t.border}`,
        borderRadius: 8, width: 32, height: 32,
        color: t.text2, cursor: 'pointer', fontSize: 18,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>←</button>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 18, fontWeight: 800, letterSpacing: 3,
          color: t.text, lineHeight: 1 }}>{title}</div>
        <div style={{ fontFamily: 'Amiri, Georgia, serif',
          fontSize: 11, color: t.accentDim, direction: 'rtl', marginTop: 2 }}>{titleAr}</div>
      </div>
      <div style={{
        fontFamily: 'Barlow Condensed, sans-serif',
        fontSize: 16, fontWeight: 900, letterSpacing: 3,
        color: t.accent,
      }}>QAWI</div>
    </div>
  );
}

function RingCard({ t, label, value, unit, ar }) {
  return (
    <div style={{
      background: t.bg2, border: `1px solid ${t.border}`,
      borderRadius: 10, padding: 12,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 38, height: 38, flexShrink: 0,
        border: `2px solid ${t.accent}`, borderRadius: '50%',
        borderRightColor: 'transparent',
        transform: 'rotate(-45deg)',
      }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9,
          color: t.text3, letterSpacing: '0.1em' }}>{label}</div>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 22, fontWeight: 800, color: t.accent, lineHeight: 1,
          marginTop: 2 }}>{value}</div>
        <div style={{ fontSize: 9, color: t.text3,
          fontFamily: 'DM Mono, monospace', marginTop: 2 }}>{unit} · <span style={{fontFamily:'Amiri,Georgia,serif',direction:'rtl'}}>{ar}</span></div>
      </div>
    </div>
  );
}

Object.assign(window, { DashboardScreen, Topbar, RingCard });
