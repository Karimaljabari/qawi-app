// qawi-workouts.jsx — structured workout picker for the journal

window.WORKOUT_PRESETS = {
  push: {
    label: 'PUSH DAY', ar: 'دفع', color: '#e07b5f',
    exercises: ['Bench Press','Incline DB Press','Overhead Press','Dumbbell Flyes','Tricep Pushdown','Lateral Raise','Cable Crossover','Dips','Skull Crushers','Close-Grip Bench'],
  },
  pull: {
    label: 'PULL DAY', ar: 'سحب', color: '#5fa8d6',
    exercises: ['Deadlift','Pull-Ups','Barbell Row','Lat Pulldown','Seated Cable Row','Face Pulls','Barbell Curl','DB Curl','Hammer Curl','Shrugs','T-Bar Row'],
  },
  legs: {
    label: 'LEG DAY', ar: 'أرجل', color: '#c9a84c',
    exercises: ['Back Squat','Front Squat','Leg Press','Romanian Deadlift','Walking Lunges','Leg Curl','Leg Extension','Calf Raise','Hip Thrust','Bulgarian Split Squat'],
  },
  cardio: {
    label: 'CARDIO', ar: 'تحمل', color: '#7ab87a',
    exercises: ['Treadmill Run','Outdoor Run','Stationary Bike','Stairmaster','Rower','Jump Rope','Incline Walk','Elliptical','Sprint Intervals'],
  },
  core: {
    label: 'CORE', ar: 'بطن', color: '#b07fd6',
    exercises: ['Plank','Hanging Leg Raise','Cable Crunch','Russian Twist','Ab Wheel','Side Plank','Decline Sit-Up','V-Ups','Dead Bug','Hollow Hold'],
  },
  combat: {
    label: 'BOXING / COMBAT', ar: 'قتال', color: '#d65f5f',
    exercises: ['Shadow Boxing','Heavy Bag','Speed Bag','Pad Work','Jump Rope','Sparring','Clinch Work','Kick Drills','Footwork'],
  },
};

function WorkoutPicker({ t, onClose, onSave, existing, existingCategory }) {
  const [category, setCategory] = React.useState(existingCategory || null);
  const [picked, setPicked] = React.useState(existing || []); // [{name, sets, reps, weight}]
  const [customName, setCustomName] = React.useState('');

  const addExercise = (name) => {
    if (picked.find(p => p.name === name)) return;
    setPicked([...picked, { name, sets: 3, reps: 8, weight: '' }]);
  };
  const addCustom = () => {
    const n = customName.trim();
    if (!n || picked.find(p => p.name.toLowerCase() === n.toLowerCase())) return;
    setPicked([...picked, { name: n, sets: 3, reps: 8, weight: '', custom: true }]);
    setCustomName('');
  };
  const updatePicked = (i, k, v) => setPicked(p => p.map((x, idx) => idx === i ? { ...x, [k]: v } : x));
  const removePicked = (i) => setPicked(picked.filter((_, idx) => idx !== i));

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 390, maxHeight: '92%',
        background: t.bg, border: `1px solid ${t.border2}`,
        borderRadius: '18px 18px 0 0',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          padding: '18px 20px 14px', borderBottom: `1px solid ${t.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 22, fontWeight: 800, letterSpacing: 2,
              color: t.accent, lineHeight: 1,
            }}>{existing && existing.length > 0 ? 'ADD EXERCISE' : 'LOG WORKOUT'}</div>
            <div style={{
              fontFamily: 'Amiri, Georgia, serif', fontSize: 13,
              color: t.accentDim, direction: 'rtl', marginTop: 4,
            }}>{existing && existing.length > 0 ? 'أضف تمرينًا' : 'سجل التمرين'}</div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: t.bg3, border: `1px solid ${t.border}`,
            color: t.text2, cursor: 'pointer', fontSize: 18,
          }}>×</button>
        </div>

        <div style={{ overflowY: 'auto', padding: '14px 16px 16px', flex: 1 }}>
          {!category && <>
            <div style={{
              fontFamily: 'DM Mono, monospace', fontSize: 10,
              letterSpacing: '0.22em', color: t.text3, marginBottom: 10,
            }}>// PICK YOUR TRAINING</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {Object.entries(WORKOUT_PRESETS).map(([id, p]) => (
                <button key={id} onClick={() => setCategory(id)} style={{
                  aspectRatio: '1.2',
                  background: t.bg2, border: `1.5px solid ${t.border}`,
                  borderLeft: `3px solid ${p.color}`,
                  borderRadius: 10, padding: 12, cursor: 'pointer',
                  fontFamily: 'inherit', textAlign: 'left',
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                }}>
                  <div style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: 18, fontWeight: 800, letterSpacing: 2,
                    color: t.text, lineHeight: 1.1,
                  }}>{p.label}</div>
                  <div style={{
                    fontSize: 10, color: t.text3, marginTop: 6,
                    fontFamily: 'DM Mono, monospace',
                  }}>{p.exercises.length} EXERCISES</div>
                </button>
              ))}
            </div>
          </>}

          {category && <>
            <button onClick={() => setCategory(null)} style={{
              background: 'none', border: 'none', color: t.accent,
              fontFamily: 'DM Mono, monospace', fontSize: 11,
              cursor: 'pointer', marginBottom: 10, padding: 0, letterSpacing: '0.12em',
            }}>← BACK TO CATEGORIES</button>

            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 22, fontWeight: 800, letterSpacing: 3,
              color: WORKOUT_PRESETS[category].color, marginBottom: 4,
            }}>{WORKOUT_PRESETS[category].label}</div>
            <div style={{
              fontFamily: 'DM Mono, monospace', fontSize: 10,
              color: t.text3, letterSpacing: '0.15em', marginBottom: 12,
            }}>TAP TO ADD · SET REPS/WEIGHT</div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {WORKOUT_PRESETS[category].exercises.map(ex => {
                const isPicked = picked.find(p => p.name === ex);
                return (
                  <button key={ex} onClick={() => isPicked ? removePicked(picked.findIndex(p => p.name === ex)) : addExercise(ex)} style={{
                    padding: '8px 12px', border: `1px solid ${isPicked ? WORKOUT_PRESETS[category].color : t.border}`,
                    background: isPicked ? `${WORKOUT_PRESETS[category].color}20` : t.bg2,
                    borderRadius: 20, color: isPicked ? WORKOUT_PRESETS[category].color : t.text2,
                    fontFamily: 'Barlow Condensed, sans-serif', fontSize: 12, fontWeight: 600,
                    letterSpacing: 1, cursor: 'pointer',
                  }}>{isPicked ? '✓' : '+'} {ex.toUpperCase()}</button>
                );
              })}
            </div>

            {/* Custom exercise input */}
            <div style={{
              display: 'flex', gap: 6, marginBottom: 16,
              padding: 10, background: t.bg2,
              border: `1px dashed ${t.border2}`, borderRadius: 8,
            }}>
              <input
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustom()}
                placeholder="Add your own exercise..."
                style={{
                  flex: 1, background: t.bg3, border: `1px solid ${t.border}`,
                  borderRadius: 6, padding: '8px 10px', color: t.text, outline: 'none',
                  fontSize: 13, boxSizing: 'border-box',
                  fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: 1,
                }}
              />
              <button onClick={addCustom} disabled={!customName.trim()} style={{
                padding: '8px 14px',
                background: customName.trim() ? WORKOUT_PRESETS[category].color : t.bg4,
                border: 'none', borderRadius: 6, color: '#000',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 12, fontWeight: 800, letterSpacing: 1.5,
                cursor: customName.trim() ? 'pointer' : 'not-allowed',
              }}>+ ADD</button>
            </div>

            {picked.length > 0 && <>
              <div style={{
                fontFamily: 'DM Mono, monospace', fontSize: 10,
                letterSpacing: '0.22em', color: t.text3, marginBottom: 8,
              }}>// YOUR SESSION ({picked.length})</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {picked.map((p, i) => (
                  <div key={p.name} style={{
                    padding: 10, background: t.bg2,
                    border: `1px solid ${t.border}`, borderRadius: 8,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{
                        fontFamily: 'Barlow Condensed, sans-serif',
                        fontSize: 14, fontWeight: 700, letterSpacing: 1, color: t.text,
                      }}>{p.name.toUpperCase()}</div>
                      <button onClick={() => removePicked(i)} style={{
                        background: 'none', border: 'none', color: t.text3, cursor: 'pointer', fontSize: 14,
                      }}>×</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                      {[['sets','SETS'],['reps','REPS'],['weight','LBS']].map(([k, lbl]) => (
                        <div key={k}>
                          <div style={{
                            fontFamily: 'DM Mono, monospace', fontSize: 8,
                            color: t.text3, letterSpacing: '0.12em', marginBottom: 3,
                          }}>{lbl}</div>
                          <input type={k === 'weight' ? 'text' : 'number'} value={p[k]}
                            onChange={e => updatePicked(i, k, e.target.value)}
                            placeholder={k === 'weight' ? '135' : ''}
                            style={{
                              width: '100%', padding: '6px 8px',
                              background: t.bg3, border: `1px solid ${t.border}`,
                              borderRadius: 5, color: t.text, outline: 'none',
                              fontFamily: 'DM Mono, monospace', fontSize: 13,
                              boxSizing: 'border-box', textAlign: 'center',
                            }} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>}
          </>}
        </div>

        {picked.length > 0 && (
          <div style={{ padding: '10px 16px 16px', borderTop: `1px solid ${t.border}` }}>
            <button onClick={() => onSave({ category, exercises: picked })} style={{
              width: '100%', padding: 14,
              background: t.accent, border: 'none', borderRadius: 10, color: '#000',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 14, fontWeight: 800, letterSpacing: 3, cursor: 'pointer',
            }}>✓ SAVE {picked.length} EXERCISES <span style={{fontFamily:'Amiri,Georgia,serif',fontSize:12,fontWeight:400}}>· احفظ</span></button>
          </div>
        )}
      </div>
    </div>
  );
}

window.WorkoutPicker = WorkoutPicker;
