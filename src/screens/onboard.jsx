// qawi-onboard.jsx — account creation flow
import * as React from 'react';
import { QawiCalligraphy, PatternBackground } from '../components/ornaments.jsx';
import { QAWI_COUNTRIES } from '../data/countries.js';

function OnboardScreen({ t, onDone }) {
  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState('');
  const [gender, setGender] = React.useState(null);
  const [goal, setGoal] = React.useState(null);
  const [country, setCountry] = React.useState(null);
  const [city, setCity] = React.useState('');
  // Calorie step (optional)
  const [age, setAge] = React.useState('');
  const [heightCm, setHeightCm] = React.useState('');
  const [weightKg, setWeightKg] = React.useState('');
  const [activity, setActivity] = React.useState('moderate');

  // Mifflin-St Jeor BMR → TDEE → goal-adjusted target
  const calcCalGoal = () => {
    const a = parseInt(age), h = parseFloat(heightCm), w = parseFloat(weightKg);
    if (!a || !h || !w || !gender) return null;
    const bmr = gender === 'male'
      ? (10*w + 6.25*h - 5*a + 5)
      : (10*w + 6.25*h - 5*a - 161);
    const mult = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 }[activity] || 1.55;
    const tdee = bmr * mult;
    const adj = { lose: -500, gain: 300, strong: 200, maint: 0 }[goal] || 0;
    return Math.round((tdee + adj) / 10) * 10;
  };
  const calGoal = calcCalGoal();

  const finish = () => onDone({ name, gender, goal, country, city, age, heightCm, weightKg, activity, calGoal });

  return (
    <div style={{
      minHeight: '100%', background: t.bg, color: t.text,
      position: 'relative', overflow: 'hidden',
      paddingTop: 60, paddingBottom: 30,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: t.heroGlow, pointerEvents: 'none' }} />
      <PatternBackground color={t.accent} opacity={0.03} />

      <div style={{
        position: 'absolute', top: '12%', left: '50%',
        transform: 'translateX(-50%)', pointerEvents: 'none',
      }}>
        <QawiCalligraphy color={t.calligraphyColor} opacity={0.08} size={260} />
      </div>

      <div style={{ position: 'relative', zIndex: 2, padding: '0 24px 20px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i <= step ? t.accent : t.bg4,
              transition: 'background .3s',
            }} />
          ))}
        </div>
        <div style={{
          fontFamily: 'DM Mono, monospace', fontSize: 10,
          letterSpacing: '0.25em', color: t.text3,
        }}>— STEP {step+1} OF 5 —</div>
      </div>

      <div style={{
        position: 'relative', zIndex: 2, flex: 1,
        padding: '30px 24px 20px', display: 'flex', flexDirection: 'column',
      }}>
        {step === 0 && <>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: 42, fontWeight: 900, letterSpacing: 4,
            color: t.accent, lineHeight: 1, marginBottom: 8,
          }}>BISMILLAH</div>
          <div style={{
            fontFamily: 'Amiri, Georgia, serif', fontSize: 22,
            color: t.accentDim, direction: 'rtl', marginBottom: 18, fontWeight: 700,
          }}>بسم الله</div>
          <div style={{
            fontSize: 14, color: t.text2, lineHeight: 1.5, marginBottom: 28,
          }}>Welcome to QAWI. Your strength — in body and in faith — starts here. What should we call you?</div>

          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
            style={{
              width: '100%', padding: '14px 16px',
              background: t.bg2, border: `1.5px solid ${t.border2}`,
              borderRadius: 10, color: t.text,
              fontFamily: 'DM Sans, sans-serif', fontSize: 16,
              outline: 'none', boxSizing: 'border-box',
            }}
            onFocus={e => { e.target.style.borderColor = t.accent; }}
            onBlur={e => { e.target.style.borderColor = t.border2; }} />
        </>}

        {step === 1 && <>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: 36, fontWeight: 900, letterSpacing: 3,
            color: t.accent, lineHeight: 1, marginBottom: 8,
          }}>YOU ARE A...</div>
          <div style={{
            fontFamily: 'Amiri, Georgia, serif', fontSize: 16,
            color: t.accentDim, direction: 'rtl', marginBottom: 28,
          }}>أنت...</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { id: 'male',   label: 'BROTHER', ar: 'أخ',   desc: 'Join the BROTHERS squad' },
              { id: 'female', label: 'SISTER',  ar: 'أخت',  desc: 'Join the SISTERS squad' },
            ].map(opt => (
              <button key={opt.id} onClick={() => setGender(opt.id)} style={{
                padding: '18px 18px', background: gender === opt.id ? t.accentGlow : t.bg2,
                border: `1.5px solid ${gender === opt.id ? t.accent : t.border}`,
                borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit',
                textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 16,
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: gender === opt.id ? t.accent : t.bg3,
                  border: `1.5px solid ${t.accent}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: gender === opt.id ? '#000' : t.accent,
                  fontFamily: 'Amiri, Georgia, serif', fontSize: 26, fontWeight: 700,
                }}>{opt.ar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: 22, fontWeight: 800, letterSpacing: 3,
                    color: gender === opt.id ? t.accent : t.text,
                  }}>{opt.label}</div>
                  <div style={{ fontSize: 12, color: t.text3, marginTop: 4 }}>{opt.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </>}

        {step === 2 && <>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: 36, fontWeight: 900, letterSpacing: 3,
            color: t.accent, lineHeight: 1, marginBottom: 8,
          }}>YOUR GOAL?</div>
          <div style={{
            fontFamily: 'Amiri, Georgia, serif', fontSize: 16,
            color: t.accentDim, direction: 'rtl', marginBottom: 24,
          }}>هدفك؟</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { id: 'lose',  label: 'WEIGHT LOSS',    ar: 'تخفيف' },
              { id: 'gain',  label: 'BUILD MUSCLE',   ar: 'عضلات' },
              { id: 'strong',label: 'GET STRONGER',   ar: 'قوة' },
              { id: 'maint', label: 'MAINTAIN',       ar: 'ثبات' },
            ].map(opt => (
              <button key={opt.id} onClick={() => setGoal(opt.id)} style={{
                padding: '14px 16px',
                background: goal === opt.id ? t.accentGlow : t.bg2,
                border: `1.5px solid ${goal === opt.id ? t.accent : t.border}`,
                borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 18, fontWeight: 800, letterSpacing: 2,
                  color: goal === opt.id ? t.accent : t.text,
                }}>{opt.label}</div>
                <div style={{
                  fontFamily: 'Amiri, Georgia, serif', fontSize: 16,
                  color: t.accentDim, direction: 'rtl',
                }}>{opt.ar}</div>
              </button>
            ))}
          </div>
        </>}
        {step === 3 && <>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: 36, fontWeight: 900, letterSpacing: 3,
            color: t.accent, lineHeight: 1, marginBottom: 8,
          }}>YOUR LOCATION</div>
          <div style={{
            fontFamily: 'Amiri, Georgia, serif', fontSize: 16,
            color: t.accentDim, direction: 'rtl', marginBottom: 8,
          }}>موقعك</div>
          <div style={{
            fontSize: 12, color: t.text3, lineHeight: 1.5, marginBottom: 20,
          }}>For accurate prayer times in your city.</div>

          <div style={{
            fontFamily: 'DM Mono, monospace', fontSize: 9,
            letterSpacing: '0.18em', color: t.text3, marginBottom: 6,
          }}>COUNTRY</div>
          <select value={country || ''} onChange={e => setCountry(e.target.value)}
            style={{
              width: '100%', padding: '14px 16px', marginBottom: 12,
              background: t.bg2, border: `1.5px solid ${country ? t.accent : t.border2}`,
              borderRadius: 10, color: t.text,
              fontFamily: 'DM Sans, sans-serif', fontSize: 15,
              outline: 'none', boxSizing: 'border-box',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' stroke='${encodeURIComponent(t.accent)}' stroke-width='1.5' fill='none'/></svg>")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 16px center',
            }}>
            <option value="">— Select country —</option>
            {QAWI_COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
            ))}
          </select>

          <div style={{
            fontFamily: 'DM Mono, monospace', fontSize: 9,
            letterSpacing: '0.18em', color: t.text3, marginBottom: 6,
          }}>CITY</div>
          <input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Detroit, Cairo, Istanbul"
            style={{
              width: '100%', padding: '14px 16px',
              background: t.bg2, border: `1.5px solid ${t.border2}`,
              borderRadius: 10, color: t.text,
              fontFamily: 'DM Sans, sans-serif', fontSize: 15,
              outline: 'none', boxSizing: 'border-box',
            }}
            onFocus={e => { e.target.style.borderColor = t.accent; }}
            onBlur={e => { e.target.style.borderColor = t.border2; }} />
          <div style={{ marginTop: 10, fontSize: 11, color: t.text3, lineHeight: 1.4 }}>
            Prayer times are fetched from Aladhan (AlAdhan.com) and calculated with the ISNA method by default.
          </div>
        </>}

        {step === 4 && <>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: 32, fontWeight: 900, letterSpacing: 3,
            color: t.accent, lineHeight: 1, marginBottom: 8,
          }}>FUEL TARGET</div>
          <div style={{
            fontFamily: 'Amiri, Georgia, serif', fontSize: 16,
            color: t.accentDim, direction: 'rtl', marginBottom: 8,
          }}>هدف السعرات</div>
          <div style={{ fontSize: 12, color: t.text3, lineHeight: 1.5, marginBottom: 18 }}>
            Optional. We'll calculate your daily calorie target to match your goal. Skip if you'd rather not track calories.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            {[
              ['age', 'AGE', age, setAge, 'yrs', 'number'],
              ['h',   'HEIGHT', heightCm, setHeightCm, 'cm', 'number'],
              ['w',   'WEIGHT', weightKg, setWeightKg, 'kg', 'number'],
            ].map(([k, lbl, v, setV, u]) => (
              <div key={k}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.18em', color: t.text3, marginBottom: 4 }}>{lbl}</div>
                <div style={{ position: 'relative' }}>
                  <input type="number" value={v} onChange={e => setV(e.target.value)} placeholder="—"
                    style={{
                      width: '100%', padding: '12px 10px', paddingRight: 28,
                      background: t.bg2, border: `1.5px solid ${v ? t.accent : t.border2}`,
                      borderRadius: 8, color: t.text,
                      fontFamily: 'DM Sans, sans-serif', fontSize: 15, textAlign: 'center',
                      outline: 'none', boxSizing: 'border-box',
                    }} />
                  <span style={{
                    position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 9, color: t.text3, fontFamily: 'DM Mono, monospace',
                  }}>{u}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.18em', color: t.text3, marginBottom: 6 }}>ACTIVITY</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }}>
            {[
              ['sedentary','DESK JOB','قليل'],
              ['light','LIGHT','خفيف'],
              ['moderate','MODERATE','معتدل'],
              ['active','VERY ACTIVE','نشيط'],
            ].map(([id, lbl, ar]) => (
              <button key={id} onClick={() => setActivity(id)} style={{
                padding: '10px 8px',
                background: activity === id ? t.accentGlow : t.bg2,
                border: `1.5px solid ${activity === id ? t.accent : t.border}`,
                borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
                textAlign: 'left',
              }}>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 13, fontWeight: 800, letterSpacing: 1.5, color: activity === id ? t.accent : t.text }}>{lbl}</div>
                <div style={{ fontFamily: 'Amiri, Georgia, serif', fontSize: 11, color: t.text3, direction: 'rtl' }}>{ar}</div>
              </button>
            ))}
          </div>

          {calGoal && (
            <div style={{
              padding: '14px 16px',
              background: t.accentGlow, border: `1.5px solid ${t.accent}`,
              borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                border: `2px solid ${t.accent}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 16, fontWeight: 800, color: t.accent }}>✓</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: t.text3, letterSpacing: '0.15em' }}>YOUR DAILY TARGET</div>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 26, fontWeight: 900, color: t.accent, lineHeight: 1.1, marginTop: 2 }}>
                  {calGoal} <span style={{ fontSize: 12, color: t.text2, letterSpacing: 2 }}>KCAL/DAY</span>
                </div>
              </div>
            </div>
          )}
        </>}

      </div>

      <div style={{ position: 'relative', zIndex: 2, padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          disabled={
            (step === 0 && !name) ||
            (step === 1 && !gender) ||
            (step === 2 && !goal) ||
            (step === 3 && (!country || !city.trim()))
          }
          onClick={() => step < 4 ? setStep(step+1) : finish()}
          style={{
            width: '100%', padding: 16,
            background: (
              (step === 0 && !name) ||
              (step === 1 && !gender) ||
              (step === 2 && !goal) ||
              (step === 3 && (!country || !city.trim()))
            ) ? t.bg4 : t.accent,
            border: 'none', borderRadius: 12, color: '#000',
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: 15, fontWeight: 800, letterSpacing: 3,
            cursor: 'pointer',
          }}>
          {step < 4 ? 'CONTINUE' : (calGoal ? 'ENTER QAWI' : 'SKIP & ENTER QAWI')} <span style={{fontFamily:'Amiri,Georgia,serif',fontSize:13,fontWeight:400}}>· {step < 4 ? 'متابعة' : 'ادخل'}</span>
        </button>
        {step === 4 && (
          <button onClick={() => finish()} style={{
            width: '100%', padding: 10,
            background: 'transparent', border: 'none',
            color: t.text3, cursor: 'pointer',
            fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.2em',
          }}>SKIP — I'LL SET IT LATER</button>
        )}
      </div>
    </div>
  );
}

export { OnboardScreen };
