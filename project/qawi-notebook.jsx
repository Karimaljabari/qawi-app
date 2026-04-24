// qawi-notebook.jsx — daily activity journal with pop-up circle

function NotebookCircle({ t, state, setState, profile }) {
  const [open, setOpen] = React.useState(false);
  const [workoutOpen, setWorkoutOpen] = React.useState(false);

  const entry = state.journal?.[state.today] || {
    workout: '', exercises: [], meals: '', water: 0, mood: '', notes: '',
  };

  // completeness: fraction of fields filled
  const fields = ['exercises', 'meals', 'water', 'mood', 'notes'];
  const filled = fields.filter(f => {
    const v = entry[f];
    if (f === 'water') return v > 0;
    if (f === 'exercises') return Array.isArray(v) && v.length > 0;
    return v && v.toString().trim();
  }).length;
  const pct = Math.round((filled / fields.length) * 100);
  const circum = 2 * Math.PI * 34;

  const update = (k, v) => setState(s => {
    const cur = (s.journal && s.journal[s.today]) || {
      workout: '', exercises: [], meals: '', water: 0, mood: '', notes: '',
    };
    return {
      ...s,
      journal: { ...(s.journal || {}), [s.today]: { ...cur, [k]: v } },
    };
  });

  return (
    <>
      <div style={{
        background: t.bg2, border: `1px solid ${t.border}`,
        borderRadius: 12, padding: 14,
        display: 'flex', alignItems: 'center', gap: 14,
        cursor: 'pointer', transition: 'all .2s',
      }}
      onClick={() => setOpen(true)}
      onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; }}>
        {/* Animated ring */}
        <div style={{ position: 'relative', width: 76, height: 76, flexShrink: 0 }}>
          <svg width={76} height={76} viewBox="0 0 76 76">
            <circle cx={38} cy={38} r={34} fill="none"
              stroke={t.bg4} strokeWidth={5} />
            <circle cx={38} cy={38} r={34} fill="none"
              stroke={t.accent} strokeWidth={5} strokeLinecap="round"
              strokeDasharray={circum}
              strokeDashoffset={circum - (circum * pct) / 100}
              transform="rotate(-90 38 38)"
              style={{ transition: 'stroke-dashoffset .6s ease' }} />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Barlow Condensed, sans-serif',
          }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: t.accent, lineHeight: 1 }}>{pct}<span style={{fontSize:11}}>%</span></div>
            <div style={{ fontSize: 8, color: t.text3,
              fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em', marginTop: 2 }}>
              {filled}/{fields.length}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'DM Mono, monospace', fontSize: 9,
            color: t.accent2, letterSpacing: '0.2em', marginBottom: 4,
          }}>// DAILY JOURNAL</div>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: 20, fontWeight: 800, letterSpacing: 2,
            color: t.text, lineHeight: 1,
          }}>TODAY'S LOG</div>
          <div style={{
            fontFamily: 'Amiri, Georgia, serif', fontSize: 13,
            color: t.accentDim, direction: 'rtl', marginTop: 4,
          }}>سجل اليوم</div>
          <div style={{
            fontSize: 11, color: t.text3, marginTop: 6,
            fontFamily: 'DM Mono, monospace',
          }}>
            {filled === 0 ? 'TAP TO LOG YOUR DAY' :
             filled === fields.length ? '✓ COMPLETE' :
             `${fields.length - filled} FIELDS REMAINING`}
          </div>
        </div>

        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: t.accent, color: '#000',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 700,
          flexShrink: 0,
        }}>✎</div>
      </div>

      {open && <NotebookModal t={t} entry={entry} update={update} onClose={() => setOpen(false)} pct={pct} filled={filled} total={fields.length} onOpenWorkout={() => setWorkoutOpen(true)} profile={profile} />}
      {workoutOpen && <WorkoutPicker t={t}
        existing={entry.exercises || []}
        existingCategory={entry.workout || null}
        onClose={() => setWorkoutOpen(false)}
        onSave={(session) => {
          update('workout', session.category);
          update('exercises', session.exercises);
          setWorkoutOpen(false);
        }} />}
    </>
  );
}

function NotebookModal({ t, entry, update, onClose, pct, filled, total, onOpenWorkout, profile }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-end',
        overflow: 'hidden',
      }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxHeight: '88%',
          background: t.bg, border: `1px solid ${t.border2}`,
          borderRadius: '20px 20px 0 0',
          overflowY: 'auto', overflowX: 'hidden',
          position: 'relative',
          animation: 'slideUp .3s ease',
        }}>
        <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>

        {/* Drag handle */}
        <div style={{
          width: 40, height: 4, borderRadius: 4,
          background: t.border3, margin: '10px auto 0',
        }} />

        {/* Header */}
        <div style={{
          padding: '18px 20px 12px',
          display: 'flex', alignItems: 'center', gap: 14,
          borderBottom: `1px solid ${t.border}`,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -20, right: -10,
            fontFamily: 'Amiri, Georgia, serif', fontSize: 90,
            color: t.accent, opacity: 0.07,
            direction: 'rtl', lineHeight: 0.8, pointerEvents: 'none',
          }}>سجل</div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              fontFamily: 'DM Mono, monospace', fontSize: 9,
              color: t.accent, letterSpacing: '0.2em',
            }}>SUNDAY · APR 19 · 2026</div>
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 28, fontWeight: 900, letterSpacing: 3,
              color: t.text, lineHeight: 1, marginTop: 4,
            }}>DAILY LOG</div>
            <div style={{
              fontFamily: 'Amiri, Georgia, serif', fontSize: 14,
              color: t.accentDim, direction: 'rtl', marginTop: 4,
            }}>سجل اليوم</div>
          </div>

          <div style={{ marginLeft: 'auto', position: 'relative', zIndex: 1, textAlign: 'right' }}>
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 30, fontWeight: 900, color: t.accent, lineHeight: 1,
            }}>{pct}%</div>
            <div style={{
              fontFamily: 'DM Mono, monospace', fontSize: 9,
              color: t.text3, letterSpacing: '0.08em', marginTop: 2,
            }}>{filled}/{total} FIELDS</div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Workout — opens picker */}
          <div style={{
            background: t.bg2, border: `1px solid ${t.border}`,
            borderRadius: 10, padding: 12,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10,
            }}>
              <span style={{ color: t.accent, fontSize: 12 }}>⟳</span>
              <span style={{
                fontFamily: 'DM Mono, monospace', fontSize: 9,
                color: t.text3, letterSpacing: '0.15em', flex: 1,
              }}>WORKOUT</span>
              <span style={{
                fontFamily: 'Amiri, Georgia, serif', fontSize: 12,
                color: t.accentDim, direction: 'rtl',
              }}>تمرين</span>
            </div>

            {entry.exercises && entry.exercises.length > 0 ? (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 10 }}>
                  {entry.exercises.map((ex, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '7px 10px', background: t.bg3,
                      border: `1px solid ${t.border}`, borderRadius: 6,
                    }}>
                      <div style={{
                        fontFamily: 'Barlow Condensed, sans-serif',
                        fontSize: 12, fontWeight: 700, letterSpacing: 1,
                        color: t.text, flex: 1, textTransform: 'uppercase',
                      }}>{ex.name}</div>
                      <div style={{
                        fontFamily: 'DM Mono, monospace', fontSize: 11,
                        color: t.accent,
                      }}>{ex.sets}×{ex.reps}{ex.weight ? ` @${ex.weight}` : ''}</div>
                    </div>
                  ))}
                </div>
                <button onClick={onOpenWorkout} style={{
                  width: '100%', padding: 9, background: t.bg3,
                  border: `1px dashed ${t.accent}`, borderRadius: 6,
                  color: t.accent, cursor: 'pointer',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
                }}>+ ADD EXERCISE <span style={{fontFamily:'Amiri,Georgia,serif',fontSize:10,fontWeight:400,letterSpacing:0}}>· أضف</span></button>
              </>
            ) : (
              <button onClick={onOpenWorkout} style={{
                width: '100%', padding: '14px 10px', background: t.bg3,
                border: `1.5px dashed ${t.border2}`, borderRadius: 8,
                color: t.accent, cursor: 'pointer',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 13, fontWeight: 700, letterSpacing: 2,
              }}>+ PICK YOUR TRAINING <span style={{fontFamily:'Amiri,Georgia,serif',fontSize:11,fontWeight:400,letterSpacing:0}}>· ابدأ</span></button>
            )}
          </div>

          <MealLogger t={t} profile={profile}
            value={entry.mealsLog || { breakfast: [], lunch: [], dinner: [], snacks: [] }}
            onChange={v => {
              update('mealsLog', v);
              // Also mirror to 'meals' for completeness check
              const total = v.breakfast.length + v.lunch.length + v.dinner.length + v.snacks.length;
              update('meals', total > 0 ? `${total} items logged` : '');
            }} />

          {/* Water tally */}
          <div style={{
            background: t.bg2, border: `1px solid ${t.border}`,
            borderRadius: 10, padding: 12,
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 10,
            }}>
              <div>
                <div style={{
                  fontFamily: 'DM Mono, monospace', fontSize: 9,
                  color: t.text3, letterSpacing: '0.15em',
                }}>◦ WATER · <span style={{fontFamily:'Amiri,Georgia,serif',fontSize:11,letterSpacing:0}}>ماء</span></div>
                <div style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 20, fontWeight: 800, color: t.accent, marginTop: 2,
                }}>{entry.water} / 8 <span style={{fontSize:11,color:t.text3}}>glasses</span></div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => update('water', Math.max(0, (entry.water||0) - 1))} style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: t.bg3, border: `1px solid ${t.border2}`,
                  color: t.text2, cursor: 'pointer', fontSize: 16,
                }}>−</button>
                <button onClick={() => update('water', Math.min(12, (entry.water||0) + 1))} style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: t.accent, border: 'none',
                  color: '#000', cursor: 'pointer', fontSize: 16, fontWeight: 700,
                }}>+</button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {Array.from({length: 8}).map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 16, borderRadius: 3,
                  background: i < (entry.water||0) ? t.accent : t.bg3,
                  border: `1px solid ${i < (entry.water||0) ? t.accent : t.border}`,
                }} />
              ))}
            </div>
          </div>

          {/* Mood */}
          <div style={{
            background: t.bg2, border: `1px solid ${t.border}`,
            borderRadius: 10, padding: 12,
          }}>
            <div style={{
              fontFamily: 'DM Mono, monospace', fontSize: 9,
              color: t.text3, letterSpacing: '0.15em', marginBottom: 10,
            }}>◦ MOOD · <span style={{fontFamily:'Amiri,Georgia,serif',fontSize:11,letterSpacing:0}}>حال</span></div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                ['locked',  'LOCKED IN'],
                ['solid',   'SOLID'],
                ['ok',      'OK'],
                ['tired',   'TIRED'],
                ['off',     'OFF-DAY'],
              ].map(([id, lbl]) => (
                <button key={id} onClick={() => update('mood', id)} style={{
                  flex: 1, padding: '8px 4px',
                  background: entry.mood === id ? t.accentGlow : t.bg3,
                  border: `1px solid ${entry.mood === id ? t.accent : t.border}`,
                  borderRadius: 6,
                  color: entry.mood === id ? t.accent : t.text3,
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 10, fontWeight: 700, letterSpacing: 1,
                  cursor: 'pointer',
                }}>{lbl}</button>
              ))}
            </div>
          </div>

          <JournalField t={t} label="REFLECTIONS" ar="تأمل" icon="◎" value={entry.notes}
            placeholder="Du'a, wins, lessons, gratitude…"
            onChange={v => update('notes', v)} multi tall />

          {/* Past entries strip */}
          <div>
            <div style={{
              fontFamily: 'DM Mono, monospace', fontSize: 9,
              color: t.text3, letterSpacing: '0.15em', marginBottom: 8,
            }}>◦ PAST ENTRIES · <span style={{fontFamily:'Amiri,Georgia,serif',fontSize:11,letterSpacing:0}}>سابق</span></div>
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
              {[18, 17, 16, 15, 14, 13, 12].map((d, i) => {
                const dPct = [85, 100, 60, 40, 100, 80, 100][i];
                return (
                  <div key={d} style={{
                    flexShrink: 0, width: 52, padding: 8,
                    background: t.bg2, border: `1px solid ${t.border}`,
                    borderRadius: 8, textAlign: 'center',
                  }}>
                    <div style={{
                      fontFamily: 'DM Mono, monospace', fontSize: 8,
                      color: t.text3, letterSpacing: '0.08em',
                    }}>APR {d}</div>
                    <div style={{ margin: '6px auto 4px', width: 28, height: 28, position: 'relative' }}>
                      <svg width={28} height={28} viewBox="0 0 28 28">
                        <circle cx={14} cy={14} r={11} fill="none"
                          stroke={t.bg4} strokeWidth={2.5} />
                        <circle cx={14} cy={14} r={11} fill="none"
                          stroke={dPct === 100 ? t.accent : t.accent2}
                          strokeWidth={2.5} strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 11}
                          strokeDashoffset={(2 * Math.PI * 11) * (1 - dPct/100)}
                          transform="rotate(-90 14 14)" />
                      </svg>
                    </div>
                    <div style={{
                      fontFamily: 'Barlow Condensed, sans-serif',
                      fontSize: 11, fontWeight: 700, color: t.accent, lineHeight: 1,
                    }}>{dPct}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Save button */}
          <button onClick={onClose} style={{
            width: '100%', padding: 14,
            background: t.accent, border: 'none', borderRadius: 10,
            color: '#000', fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: 15, fontWeight: 800, letterSpacing: 3,
            cursor: 'pointer',
          }}>✓ SAVE TODAY'S LOG <span style={{fontFamily:'Amiri,Georgia,serif',fontSize:13,fontWeight:400}}>· احفظ</span></button>
        </div>
      </div>
    </div>
  );
}

function JournalField({ t, label, ar, icon, value, placeholder, onChange, multi, tall }) {
  const Tag = multi ? 'textarea' : 'input';
  return (
    <div style={{
      background: t.bg2, border: `1px solid ${t.border}`,
      borderRadius: 10, padding: 12,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
      }}>
        <span style={{ color: t.accent, fontSize: 12 }}>{icon}</span>
        <span style={{
          fontFamily: 'DM Mono, monospace', fontSize: 9,
          color: t.text3, letterSpacing: '0.15em', flex: 1,
        }}>{label}</span>
        <span style={{
          fontFamily: 'Amiri, Georgia, serif', fontSize: 12,
          color: t.accentDim, direction: 'rtl',
        }}>{ar}</span>
      </div>
      <Tag
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={multi ? (tall ? 4 : 2) : undefined}
        style={{
          width: '100%', background: t.bg3, border: `1px solid ${t.border}`,
          borderRadius: 6, padding: '9px 10px',
          color: t.text,
          fontFamily: 'DM Sans, sans-serif', fontSize: 13,
          outline: 'none', resize: 'vertical',
          minHeight: multi ? (tall ? 90 : 52) : undefined,
          boxSizing: 'border-box',
        }}
        onFocus={e => { e.target.style.borderColor = t.accent; }}
        onBlur={e => { e.target.style.borderColor = t.border; }}
      />
    </div>
  );
}

Object.assign(window, { NotebookCircle, NotebookModal, JournalField });
