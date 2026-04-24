import * as React from 'react'
import { QAWI_FOODS, QAWI_FOOD_CATEGORIES } from '../data/food-db.js'

// qawi-meals.jsx — MyFitnessPal-style meal logger, powered by QAWI_FOODS
// Shape of `value`: { breakfast: [{id, name, qty, serving, unit, cal, p, c, f, cat}], lunch, dinner, snacks }
// Profile provides optional profile.calGoal (kcal/day). If unset, ring uses 2400 default.

const MEAL_SLOTS = [
  { id: 'breakfast', label: 'BREAKFAST', ar: 'فطور', icon: '☀' },
  { id: 'lunch',     label: 'LUNCH',     ar: 'غداء', icon: '◐' },
  { id: 'dinner',    label: 'DINNER',    ar: 'عشاء', icon: '◑' },
  { id: 'snacks',    label: 'SNACKS',    ar: 'خفيف', icon: '·' },
];

function totalMacros(value) {
  const slots = ['breakfast','lunch','dinner','snacks'];
  let cal=0, p=0, c=0, f=0, items=0;
  for (const s of slots) {
    for (const it of (value[s] || [])) {
      cal += (it.cal || 0) * it.qty;
      p   += (it.p   || 0) * it.qty;
      c   += (it.c   || 0) * it.qty;
      f   += (it.f   || 0) * it.qty;
      items++;
    }
  }
  return { cal: Math.round(cal), p: Math.round(p), c: Math.round(c), f: Math.round(f), items };
}

function MacroRing({ t, cal, goal }) {
  const pct = Math.min(cal / Math.max(goal,1), 1);
  const R = 42, C = 2 * Math.PI * R;
  const color = pct >= 1 ? t.accent2 : pct >= 0.85 ? '#e0a060' : t.accent;
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={R} fill="none" stroke={t.border} strokeWidth="6" />
      <circle cx="50" cy="50" r={R} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={`${C*pct} ${C}`} strokeLinecap="round"
        transform="rotate(-90 50 50)" style={{ transition: 'stroke-dasharray 0.4s' }} />
      <text x="50" y="46" textAnchor="middle" fill={t.text}
        style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 22, fontWeight: 800 }}>
        {cal}
      </text>
      <text x="50" y="62" textAnchor="middle" fill={t.text3}
        style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.15em' }}>
        / {goal} KCAL
      </text>
    </svg>
  );
}

function MacroBar({ t, label, val, goal, color }) {
  const pct = Math.min(val / Math.max(goal,1), 1) * 100;
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 3 }}>
        <span style={{ fontFamily:'DM Mono, monospace', fontSize: 8, color: t.text3, letterSpacing:'0.12em' }}>{label}</span>
        <span style={{ fontFamily:'DM Mono, monospace', fontSize: 9, color: t.text2 }}>{val}<span style={{ color: t.text3 }}>/{goal}g</span></span>
      </div>
      <div style={{ height: 4, background: t.border, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, transition: 'width 0.3s' }} />
      </div>
    </div>
  );
}

function MealLogger({ t, value, onChange, profile }) {
  const [pickerSlot, setPickerSlot] = React.useState(null);
  const tot = totalMacros(value);
  const calGoal = (profile && profile.calGoal) || 2400;
  // Standard macro split ~ 30/40/30 of calories → grams
  const pGoal = Math.round(calGoal * 0.30 / 4);
  const cGoal = Math.round(calGoal * 0.40 / 4);
  const fGoal = Math.round(calGoal * 0.30 / 9);

  const addFood = (slot, food) => {
    const existing = (value[slot] || []).find(f => f.id === food.id);
    const next = existing
      ? value[slot].map(f => f.id === food.id ? { ...f, qty: f.qty + 1 } : f)
      : [...(value[slot] || []), { ...food, qty: 1 }];
    onChange({ ...value, [slot]: next });
  };
  const removeFood = (slot, id) => {
    onChange({ ...value, [slot]: value[slot].filter(f => f.id !== id) });
  };
  const updateQty = (slot, id, delta) => {
    onChange({
      ...value,
      [slot]: value[slot].map(f => f.id === id
        ? { ...f, qty: Math.max(1, f.qty + delta) }
        : f),
    });
  };

  return (
    <>
      <div style={{
        background: t.bg2, border: `1px solid ${t.border}`,
        borderRadius: 10, padding: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <span style={{ color: t.accent, fontSize: 12 }}>✦</span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: t.text3, letterSpacing: '0.15em', flex: 1 }}>MEALS · NUTRITION</span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: tot.items > 0 ? t.accent : t.text3 }}>{tot.items} ITEMS</span>
        </div>

        {/* Macro summary */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: 10, marginBottom: 10,
          background: t.bg3, border: `1px solid ${t.border}`, borderRadius: 8,
        }}>
          <MacroRing t={t} cal={tot.cal} goal={calGoal} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <MacroBar t={t} label="PROTEIN" val={tot.p} goal={pGoal} color="#e07b5f" />
            <MacroBar t={t} label="CARBS"   val={tot.c} goal={cGoal} color={t.accent} />
            <MacroBar t={t} label="FAT"     val={tot.f} goal={fGoal} color="#7ab87a" />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {MEAL_SLOTS.map(slot => {
            const items = value[slot.id] || [];
            const slotCal = items.reduce((a,i) => a + (i.cal||0)*i.qty, 0);
            return (
              <div key={slot.id} style={{
                background: t.bg3, border: `1px solid ${t.border}`,
                borderRadius: 8, overflow: 'hidden',
              }}>
                <button onClick={() => setPickerSlot(slot.id)} style={{
                  width: '100%', padding: '9px 12px',
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'transparent', border: 'none',
                  cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                }}>
                  <span style={{ color: t.accent2, fontSize: 14, width: 16 }}>{slot.icon}</span>
                  <span style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: 12, fontWeight: 700, letterSpacing: 1.5,
                    color: items.length > 0 ? t.text : t.text3, flex: 1,
                  }}>{slot.label}</span>
                  {items.length > 0 && (
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: t.text2 }}>
                      {Math.round(slotCal)} kcal
                    </span>
                  )}
                  <span style={{
                    fontFamily: 'DM Mono, monospace', fontSize: 10,
                    color: items.length > 0 ? t.accent : t.text3,
                  }}>{items.length > 0 ? `${items.length}` : '+ ADD'}</span>
                </button>

                {items.length > 0 && (
                  <div style={{ padding: '0 10px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {items.map(f => (
                      <div key={f.id} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '6px 8px', background: t.bg2,
                        borderRadius: 5, border: `1px solid ${t.border}`,
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 12, color: t.text,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>{f.name}</div>
                          <div style={{ fontSize: 9, color: t.text3, fontFamily: 'DM Mono, monospace' }}>
                            {Math.round((f.cal||0)*f.qty)} kcal · P{Math.round((f.p||0)*f.qty)} C{Math.round((f.c||0)*f.qty)} F{Math.round((f.f||0)*f.qty)}
                          </div>
                        </div>
                        <button onClick={() => updateQty(slot.id, f.id, -1)} style={{
                          width: 20, height: 20, borderRadius: 4,
                          background: t.bg3, border: `1px solid ${t.border}`,
                          color: t.text2, cursor: 'pointer', fontSize: 12,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>−</button>
                        <span style={{
                          fontFamily: 'DM Mono, monospace', fontSize: 10,
                          color: t.accent, minWidth: 34, textAlign: 'center',
                        }}>{f.qty}×{f.serving}{f.unit === 'ea' || f.unit === 'ea half' ? '' : f.unit}</span>
                        <button onClick={() => updateQty(slot.id, f.id, 1)} style={{
                          width: 20, height: 20, borderRadius: 4,
                          background: t.accent, border: 'none',
                          color: '#000', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>+</button>
                        <button onClick={() => removeFood(slot.id, f.id)} style={{
                          background: 'none', border: 'none',
                          color: t.text3, cursor: 'pointer', fontSize: 14,
                          padding: 0, marginLeft: 2,
                        }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {pickerSlot && (
        <FoodPicker t={t}
          slot={MEAL_SLOTS.find(s => s.id === pickerSlot)}
          onClose={() => setPickerSlot(null)}
          onAdd={(food) => addFood(pickerSlot, food)}
        />
      )}
    </>
  );
}

function FoodPicker({ t, slot, onClose, onAdd }) {
  const [search, setSearch] = React.useState('');
  const [cat, setCat] = React.useState('all');
  const FOODS = QAWI_FOODS || [];
  const CATS = QAWI_FOOD_CATEGORIES || [];

  // Slot-based suggestions (shown when no search / cat=all)
  const SLOT_SUGGESTIONS = {
    breakfast: ['egg-whole','oats','oatmeal-cooked','greek-yogurt','labneh','dates-medjool','foul','zaatar-bread','banana','coffee-milk','karak','peanut-butter','bread-wheat'],
    lunch:     ['chicken-breast','rice-basmati','shawarma-chicken','falafel-wrap','hummus-plate','salmon','mandi-chicken','kabsa','tabbouleh','biryani-chicken','caesar-salad','sub-sandwich'],
    dinner:    ['salmon','ribeye','chicken-thigh','rice-basmati','kofta','kebab-chicken','mandi-lamb','biryani-mutton','iskender','karahi-chicken','sweet-potato','broccoli'],
    snacks:    ['almonds','mixed-nuts','protein-bar','dates-medjool','apple','banana','greek-yogurt','peanut-butter','chocolate-dark','hummus','baklava','whey-scoop'],
  };

  const q = search.trim().toLowerCase();
  let shown;
  if (q) {
    shown = FOODS.filter(f => f.name.toLowerCase().includes(q));
  } else if (cat !== 'all') {
    shown = FOODS.filter(f => f.cat === cat);
  } else {
    const ids = SLOT_SUGGESTIONS[slot.id] || [];
    shown = ids.map(id => FOODS.find(f => f.id === id)).filter(Boolean);
  }

  const canAddCustom = q.length > 0 &&
    !FOODS.find(f => f.name.toLowerCase() === q);

  const catColor = (c) => (CATS.find(x => x.id === c) || {}).color || t.accent2;

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 300,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxHeight: '92%',
        background: t.bg, border: `1px solid ${t.border2}`,
        borderRadius: '18px 18px 0 0', padding: '18px 16px 16px',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: t.accent2, letterSpacing: '0.2em' }}>// ADD TO</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 24, fontWeight: 800, letterSpacing: 3, color: t.accent, lineHeight: 1, marginTop: 2 }}>{slot.label}</div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: t.bg3, border: `1px solid ${t.border}`,
            color: t.text2, cursor: 'pointer', fontSize: 18,
          }}>×</button>
        </div>

        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search 350+ foods (chicken, biryani, hummus...)"
          autoFocus
          style={{
            width: '100%', padding: '11px 12px',
            background: t.bg2, border: `1px solid ${t.border2}`,
            borderRadius: 8, color: t.text, outline: 'none',
            fontSize: 13, boxSizing: 'border-box', marginBottom: 10,
          }}
        />

        {/* Category chips */}
        {!q && (
          <div style={{
            display: 'flex', gap: 5, overflowX: 'auto', marginBottom: 10,
            paddingBottom: 2,
          }}>
            <button onClick={() => setCat('all')} style={{
              padding: '6px 10px', whiteSpace: 'nowrap',
              borderRadius: 20, fontSize: 10, letterSpacing: '0.1em',
              fontFamily: 'DM Mono, monospace', cursor: 'pointer',
              background: cat === 'all' ? t.accent : t.bg2,
              color: cat === 'all' ? '#000' : t.text2,
              border: `1px solid ${cat === 'all' ? t.accent : t.border}`,
              fontWeight: 600,
            }}>FOR {slot.label}</button>
            {CATS.map(c => (
              <button key={c.id} onClick={() => setCat(c.id)} style={{
                padding: '6px 10px', whiteSpace: 'nowrap',
                borderRadius: 20, fontSize: 10, letterSpacing: '0.1em',
                fontFamily: 'DM Mono, monospace', cursor: 'pointer',
                background: cat === c.id ? c.color : t.bg2,
                color: cat === c.id ? '#000' : t.text2,
                border: `1px solid ${cat === c.id ? c.color : t.border}`,
                fontWeight: 600,
              }}>{c.label}</button>
            ))}
          </div>
        )}

        <div style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
          {canAddCustom && (
            <button onClick={() => {
              onAdd({
                id: 'custom-' + Date.now(),
                name: search.trim(), cat: 'meal',
                serving: 1, unit: 'serving',
                cal: 0, p: 0, c: 0, f: 0,
              });
              setSearch('');
            }} style={{
              width: '100%', padding: '11px 12px', marginBottom: 10,
              background: t.accentGlow, border: `1.5px dashed ${t.accent}`,
              borderRadius: 8, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
              fontFamily: 'inherit',
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: 6,
                background: t.accent, color: '#000',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700,
              }}>+</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: 1, color: t.accent }}>ADD "{search.toUpperCase()}"</div>
                <div style={{ fontSize: 9, color: t.text3, fontFamily: 'DM Mono, monospace' }}>CUSTOM · NO MACRO DATA</div>
              </div>
            </button>
          )}

          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: t.text3, letterSpacing: '0.15em', marginBottom: 8 }}>
            {q ? `${shown.length} RESULTS` : cat === 'all' ? 'SUGGESTED' : (CATS.find(c => c.id === cat) || {}).label}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {shown.map(f => (
              <button key={f.id} onClick={() => { onAdd(f); onClose(); }} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 10px',
                background: t.bg2, border: `1px solid ${t.border}`,
                borderRadius: 8, cursor: 'pointer',
                textAlign: 'left', fontFamily: 'inherit',
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 6, flexShrink: 0,
                  background: t.bg3, border: `1px solid ${catColor(f.cat)}55`,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: 12, fontWeight: 800, color: catColor(f.cat), lineHeight: 1,
                  }}>{Math.round(f.cal)}</div>
                  <div style={{ fontSize: 6, color: t.text3, fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em' }}>KCAL</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 600, color: t.text,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{f.name}</div>
                  <div style={{
                    fontSize: 9, color: t.text3, marginTop: 1,
                    fontFamily: 'DM Mono, monospace', letterSpacing: '0.05em',
                  }}>P{Math.round(f.p)} · C{Math.round(f.c)} · F{Math.round(f.f)} · {f.serving}{f.unit === 'ea' || f.unit === 'ea half' ? '' : f.unit}</div>
                </div>
                <div style={{ color: t.accent, fontSize: 20, fontWeight: 700 }}>+</div>
              </button>
            ))}
            {shown.length === 0 && !canAddCustom && (
              <div style={{
                padding: 24, textAlign: 'center',
                color: t.text3, fontSize: 12,
                fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em',
              }}>NO MATCHES</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { MealLogger, FoodPicker }
