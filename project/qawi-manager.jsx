// qawi-manager.jsx — Admin broadcast + full notification channel editor

function ManagerScreen({ t, onBack, gender, broadcasts, setBroadcasts, channels, setChannels }) {
  const [tab, setTab] = React.useState('broadcast'); // 'broadcast' | 'channels'
  const [msg, setMsg] = React.useState('');
  const [tone, setTone] = React.useState('motivational');
  const [target, setTarget] = React.useState('all');
  const [expanded, setExpanded] = React.useState(null);
  const term = gender === 'female' ? 'SISTERS' : 'BROTHERS';

  const send = () => {
    if (!msg.trim()) return;
    setBroadcasts([{ id: Date.now(), msg, tone, target, time: 'just now' }, ...broadcasts]);
    setMsg('');
  };

  const tones = [
    { id: 'motivational', label: 'HYPE' },
    { id: 'reminder',     label: 'REMINDER' },
    { id: 'urgent',       label: 'URGENT' },
    { id: 'reflect',      label: 'REFLECT' },
  ];

  const updateChannel = (key, patch) => {
    setChannels({ ...channels, [key]: { ...channels[key], ...patch } });
  };
  const updateTemplate = (key, tKey, value) => {
    setChannels({
      ...channels,
      [key]: { ...channels[key], templates: { ...channels[key].templates, [tKey]: value } },
    });
  };
  const resetChannel = (key) => {
    if (!window.confirm('Reset this channel to defaults?')) return;
    localStorage.removeItem('qawi-channels');
    window.location.reload();
  };

  const channelColor = (c) => {
    const map = {
      gold: '#C9A84C', amber: '#E09B3D', green: '#7FB069',
      bronze: '#B08050', blue: '#6B8CAE', purple: '#9B7EBD',
    };
    return map[c] || t.accent;
  };

  return (
    <div style={{ minHeight: '100%', background: t.bg, color: t.text, paddingBottom: 40 }}>
      <Topbar t={t} onBack={onBack} title="MANAGER" titleAr="المدرب" />

      {/* Admin badge */}
      <div style={{ padding: '10px 14px 0' }}>
        <div style={{
          padding: '10px 12px', background: t.bg2,
          border: `1.5px solid ${t.accent}`, borderRadius: 10,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6, background: t.accent,
            display: 'grid', placeItems: 'center', color: '#000',
            fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: 14,
          }}>K</div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'DM Mono, monospace', fontSize: 8,
              letterSpacing: '0.22em', color: t.accent2,
            }}>// ADMIN · KARIM</div>
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif', fontSize: 13,
              fontWeight: 700, letterSpacing: 1.5, color: t.text,
            }}>CONTROL CENTER · {term}</div>
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 6, padding: '12px 14px 0' }}>
        {[['broadcast','BROADCAST'],['channels','NOTIFICATIONS']].map(([id, lbl]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex: 1, padding: '10px 6px',
            background: tab === id ? t.accent : t.bg2,
            border: `1px solid ${tab === id ? t.accent : t.border}`,
            borderRadius: 8,
            color: tab === id ? '#000' : t.text3,
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: 12, fontWeight: 800, letterSpacing: 2,
            cursor: 'pointer',
          }}>{lbl}</button>
        ))}
      </div>

      {tab === 'broadcast' && (
        <div style={{ padding: 14 }}>
          {/* Compose */}
          <div style={{
            background: t.bg2, border: `1px solid ${t.border}`,
            borderRadius: 12, padding: 14,
          }}>
            <div style={{
              fontFamily: 'DM Mono, monospace', fontSize: 10,
              letterSpacing: '0.2em', color: t.text3, marginBottom: 10,
            }}>◦ COMPOSE · <span style={{fontFamily:'Amiri,Georgia,serif',fontSize:12,letterSpacing:0}}>اكتب</span></div>

            <textarea value={msg} onChange={e => setMsg(e.target.value)}
              placeholder="Write your message to the squad..."
              style={{
                width: '100%', minHeight: 100, padding: 12,
                background: t.bg3, border: `1px solid ${t.border}`, borderRadius: 8,
                color: t.text, outline: 'none', resize: 'vertical',
                fontFamily: 'DM Sans, sans-serif', fontSize: 14, lineHeight: 1.45,
                boxSizing: 'border-box',
              }} />

            <div style={{
              fontFamily: 'DM Mono, monospace', fontSize: 9,
              letterSpacing: '0.18em', color: t.text3, margin: '14px 0 6px',
            }}>TONE</div>
            <div style={{ display: 'flex', gap: 5, marginBottom: 12 }}>
              {tones.map(tn => (
                <button key={tn.id} onClick={() => setTone(tn.id)} style={{
                  flex: 1, padding: '7px 3px',
                  background: tone === tn.id ? t.accentGlow : t.bg3,
                  border: `1px solid ${tone === tn.id ? t.accent : t.border}`,
                  borderRadius: 6,
                  color: tone === tn.id ? t.accent : t.text3,
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 10, fontWeight: 700, letterSpacing: 1,
                  cursor: 'pointer',
                }}>{tn.label}</button>
              ))}
            </div>

            <div style={{
              fontFamily: 'DM Mono, monospace', fontSize: 9,
              letterSpacing: '0.18em', color: t.text3, marginBottom: 6,
            }}>SEND TO</div>
            <div style={{ display: 'flex', gap: 5, marginBottom: 14 }}>
              {[['all','EVERYONE'],['gym','GYM SLACKERS'],['prayer','PRAYER STREAK']].map(([id, lbl]) => (
                <button key={id} onClick={() => setTarget(id)} style={{
                  flex: 1, padding: '7px 3px',
                  background: target === id ? t.accentGlow : t.bg3,
                  border: `1px solid ${target === id ? t.accent : t.border}`,
                  borderRadius: 6,
                  color: target === id ? t.accent : t.text3,
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 10, fontWeight: 700, letterSpacing: 1,
                  cursor: 'pointer',
                }}>{lbl}</button>
              ))}
            </div>

            <button onClick={send} disabled={!msg.trim()} style={{
              width: '100%', padding: 14,
              background: msg.trim() ? t.accent : t.bg4, border: 'none',
              borderRadius: 10, color: '#000',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 14, fontWeight: 800, letterSpacing: 3,
              cursor: msg.trim() ? 'pointer' : 'not-allowed',
            }}>► BROADCAST NOW</button>
          </div>

          {/* History */}
          <div style={{ marginTop: 16 }}>
            <DiamondDivider color={t.accent} label="SENT BROADCASTS" labelAr="السابقة" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
              {broadcasts.length === 0 && <div style={{
                padding: 16, textAlign: 'center', color: t.text3, fontSize: 12,
                border: `1px dashed ${t.border}`, borderRadius: 10,
                fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em',
              }}>NO BROADCASTS YET</div>}
              {broadcasts.map(b => (
                <div key={b.id} style={{
                  padding: 12, background: t.bg2,
                  border: `1px solid ${t.border}`, borderLeft: `3px solid ${t.accent2}`,
                  borderRadius: '0 8px 8px 0',
                }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontFamily: 'DM Mono, monospace', fontSize: 9,
                    color: t.text3, letterSpacing: '0.12em', marginBottom: 5,
                  }}>
                    <span style={{color:t.accent2}}>{b.tone.toUpperCase()} · → {b.target.toUpperCase()}</span>
                    <span>{b.time}</span>
                  </div>
                  <div style={{ fontSize: 13, color: t.text, lineHeight: 1.4 }}>{b.msg}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'channels' && (
        <div style={{ padding: 14 }}>
          <div style={{
            padding: 12, background: t.bg2,
            border: `1px dashed ${t.border}`, borderRadius: 10,
            marginBottom: 14,
          }}>
            <div style={{
              fontFamily: 'DM Mono, monospace', fontSize: 9,
              letterSpacing: '0.2em', color: t.accent2, marginBottom: 4,
            }}>// EDITING FOR ALL {term}</div>
            <div style={{ fontSize: 11, color: t.text3, lineHeight: 1.5 }}>
              Customize every notification the squad receives. Tap a channel to edit timing, copy templates, and rules. <span style={{color:t.accent2}}>{'{variables}'}</span> fill in automatically.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.entries(channels).map(([key, ch]) => {
              const col = channelColor(ch.color);
              const isOpen = expanded === key;
              return (
                <div key={key} style={{
                  background: t.bg2,
                  border: `1px solid ${isOpen ? col : t.border}`,
                  borderLeft: `3px solid ${col}`,
                  borderRadius: '0 10px 10px 0',
                  overflow: 'hidden',
                }}>
                  {/* Header row */}
                  <div style={{
                    padding: 12,
                    display: 'flex', alignItems: 'center', gap: 10,
                    cursor: 'pointer',
                  }} onClick={() => setExpanded(isOpen ? null : key)}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 8,
                      background: ch.on ? col : t.bg3,
                      border: `1px solid ${ch.on ? col : t.border}`,
                      display: 'grid', placeItems: 'center',
                      color: ch.on ? '#000' : t.text3,
                      fontSize: 16,
                    }}>{ch.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: 'Barlow Condensed, sans-serif',
                        fontSize: 13, fontWeight: 800, letterSpacing: 2,
                        color: ch.on ? t.text : t.text3,
                      }}>{ch.label} <span style={{
                        fontFamily: 'Amiri, Georgia, serif',
                        fontSize: 11, fontWeight: 400, letterSpacing: 0,
                        color: t.text3, marginLeft: 4,
                      }}>{ch.labelAr}</span></div>
                      <div style={{
                        fontSize: 10, color: t.text3, marginTop: 2,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>{ch.desc}</div>
                    </div>
                    {/* iOS-style toggle */}
                    <div onClick={(e) => { e.stopPropagation(); updateChannel(key, { on: !ch.on }); }}
                      style={{
                        width: 40, height: 24, borderRadius: 12, flexShrink: 0,
                        background: ch.on ? col : t.bg3,
                        border: `1px solid ${ch.on ? col : t.border}`,
                        position: 'relative', cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}>
                      <div style={{
                        position: 'absolute', top: 2, left: ch.on ? 18 : 2,
                        width: 18, height: 18, borderRadius: '50%',
                        background: ch.on ? '#000' : t.text3,
                        transition: 'left 0.15s',
                      }}/>
                    </div>
                    <div style={{ color: t.text3, fontSize: 14, marginLeft: 4 }}>
                      {isOpen ? '▾' : '▸'}
                    </div>
                  </div>

                  {/* Expanded editor */}
                  {isOpen && (
                    <div style={{
                      padding: '4px 14px 14px',
                      borderTop: `1px solid ${t.border}`,
                      background: t.bg,
                    }}>
                      {/* Channel-specific controls */}
                      <ChannelControls t={t} chKey={key} ch={ch} col={col}
                        updateChannel={(patch) => updateChannel(key, patch)} />

                      {/* Templates */}
                      <div style={{
                        fontFamily: 'DM Mono, monospace', fontSize: 9,
                        letterSpacing: '0.2em', color: t.text3, margin: '14px 0 6px',
                      }}>◦ COPY TEMPLATES</div>
                      {Object.entries(ch.templates).map(([tKey, tVal]) => (
                        <div key={tKey} style={{ marginBottom: 8 }}>
                          <div style={{
                            fontFamily: 'DM Mono, monospace', fontSize: 8,
                            letterSpacing: '0.15em', color: col, marginBottom: 3,
                            textTransform: 'uppercase',
                          }}>{tKey}</div>
                          <textarea value={tVal}
                            onChange={(e) => updateTemplate(key, tKey, e.target.value)}
                            style={{
                              width: '100%', minHeight: 44, padding: 9,
                              background: t.bg3,
                              border: `1px solid ${t.border}`, borderRadius: 6,
                              color: t.text, outline: 'none', resize: 'vertical',
                              fontFamily: 'DM Sans, sans-serif', fontSize: 12, lineHeight: 1.4,
                              boxSizing: 'border-box',
                            }} />
                        </div>
                      ))}

                      {/* Preview */}
                      <div style={{
                        marginTop: 10, padding: 10,
                        background: 'rgba(30,30,40,0.72)',
                        border: `1px solid ${t.border}`, borderRadius: 10,
                        display: 'flex', gap: 9, alignItems: 'flex-start',
                      }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                          background: `linear-gradient(135deg, ${col}, ${col}99)`,
                          display: 'grid', placeItems: 'center', color: '#000',
                          fontSize: 13,
                        }}>{ch.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 10, fontWeight: 600, color: '#fff',
                            letterSpacing: 0.3,
                          }}>QAWI · {ch.label}</div>
                          <div style={{
                            fontSize: 12, color: 'rgba(255,255,255,0.85)',
                            lineHeight: 1.35, marginTop: 1,
                          }}>{Object.values(ch.templates)[0]
                              .replace(/\{mins\}/g, '10')
                              .replace(/\{time\}/g, '5:18 AM')
                              .replace(/\{prayer\}/g, 'Fajr')
                              .replace(/\{days\}/g, '12')
                              .replace(/\{streak\}/g, '5')
                              .replace(/\{remaining\}/g, '1,240')
                              .replace(/\{goal\}/g, '2,400')
                              .replace(/\{meal\}/g, 'lunch')
                              .replace(/\{grams\}/g, '45')
                              .replace(/\{fields\}/g, '4')
                              .replace(/\{name\}/g, 'Mustafa')
                              .replace(/\{count\}/g, '15')
                              .replace(/\{managerName\}/g, 'Karim')
                              .replace(/\{msg\}/g, 'Push day. 5pm. Be there.')
                              .replace(/\{quote\}/g, 'Actions are by intentions')
                            }</div>
                        </div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>now</div>
                      </div>

                      <button onClick={() => resetChannel(key)} style={{
                        marginTop: 10, width: '100%', padding: 8,
                        background: 'transparent',
                        border: `1px solid ${t.border}`, borderRadius: 6,
                        color: t.text3,
                        fontFamily: 'DM Mono, monospace', fontSize: 9,
                        letterSpacing: '0.18em', cursor: 'pointer',
                      }}>RESET TO DEFAULT</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Global quiet hours */}
          <div style={{
            marginTop: 16, padding: 12, background: t.bg2,
            border: `1px solid ${t.border}`, borderRadius: 10,
          }}>
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif', fontSize: 13,
              fontWeight: 800, letterSpacing: 2, color: t.text, marginBottom: 4,
            }}>QUIET HOURS</div>
            <div style={{ fontSize: 11, color: t.text3, lineHeight: 1.4 }}>
              No notifications between Isha and Fajr (except Prayer channel). Applies to everyone.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Channel-specific setting rows (times, lead-mins, frequency, etc.)
function ChannelControls({ t, chKey, ch, col, updateChannel }) {
  const rowStyle = { marginBottom: 10 };
  const labelStyle = {
    fontFamily: 'DM Mono, monospace', fontSize: 9,
    letterSpacing: '0.2em', color: t.text3, marginBottom: 5,
  };
  const input = (value, onChange, extra = {}) => (
    <input value={value} onChange={onChange} style={{
      padding: '7px 10px', background: t.bg3,
      border: `1px solid ${t.border}`, borderRadius: 6,
      color: t.text, outline: 'none',
      fontFamily: 'DM Mono, monospace', fontSize: 12,
      ...extra,
    }}/>
  );

  if (chKey === 'prayer') {
    return (
      <div>
        <div style={rowStyle}>
          <div style={labelStyle}>LEAD TIME (MINUTES BEFORE AZAN)</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[5, 10, 15, 30].map(n => (
              <button key={n} onClick={() => updateChannel({ leadMins: n })} style={{
                flex: 1, padding: '8px 0',
                background: ch.leadMins === n ? col : t.bg3,
                border: `1px solid ${ch.leadMins === n ? col : t.border}`,
                borderRadius: 6,
                color: ch.leadMins === n ? '#000' : t.text3,
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 12, fontWeight: 700, letterSpacing: 1,
                cursor: 'pointer',
              }}>{n} MIN</button>
            ))}
          </div>
        </div>
        <ToggleRow t={t} col={col} label="HONOR QUIET HOURS"
          on={ch.quietHours} onChange={(v) => updateChannel({ quietHours: v })} />
      </div>
    );
  }

  if (chKey === 'gym') {
    return (
      <div>
        <div style={rowStyle}>
          <div style={labelStyle}>DAILY REMINDER TIME</div>
          {input(ch.time, (e) => updateChannel({ time: e.target.value }), { type: 'time', width: 120 })}
        </div>
        <ToggleRow t={t} col={col} label="STREAK-AT-RISK ALERTS"
          on={ch.streakProtect} onChange={(v) => updateChannel({ streakProtect: v })} />
      </div>
    );
  }

  if (chKey === 'meals') {
    return (
      <div style={rowStyle}>
        <div style={labelStyle}>MEAL REMINDER TIMES</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {ch.times.map((tm, i) => (
            <input key={i} type="time" value={tm}
              onChange={(e) => {
                const next = [...ch.times];
                next[i] = e.target.value;
                updateChannel({ times: next });
              }}
              style={{
                padding: '7px 10px', background: t.bg3,
                border: `1px solid ${t.border}`, borderRadius: 6,
                color: t.text, outline: 'none',
                fontFamily: 'DM Mono, monospace', fontSize: 12,
              }}/>
          ))}
          <button onClick={() => updateChannel({ times: [...ch.times, '21:00'] })} style={{
            padding: '7px 12px', background: t.bg3,
            border: `1px dashed ${t.border}`, borderRadius: 6,
            color: t.accent2, fontFamily: 'DM Mono, monospace', fontSize: 11,
            cursor: 'pointer',
          }}>+ ADD</button>
        </div>
      </div>
    );
  }

  if (chKey === 'journal') {
    return (
      <div style={rowStyle}>
        <div style={labelStyle}>TRIGGER AT</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['maghrib','isha','20:00','21:30'].map(opt => (
            <button key={opt} onClick={() => updateChannel({ triggerAt: opt })} style={{
              flex: 1, padding: '8px 0',
              background: ch.triggerAt === opt ? col : t.bg3,
              border: `1px solid ${ch.triggerAt === opt ? col : t.border}`,
              borderRadius: 6,
              color: ch.triggerAt === opt ? '#000' : t.text3,
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 11, fontWeight: 700, letterSpacing: 1,
              cursor: 'pointer', textTransform: 'uppercase',
            }}>{opt}</button>
          ))}
        </div>
      </div>
    );
  }

  if (chKey === 'squad') {
    return (
      <ToggleRow t={t} col={col} label="GENDER-FILTER SQUAD FEEDS"
        on={ch.genderFiltered} onChange={(v) => updateChannel({ genderFiltered: v })} />
    );
  }

  if (chKey === 'motivation') {
    return (
      <div style={rowStyle}>
        <div style={labelStyle}>FREQUENCY</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['daily','weekly','milestone-only'].map(opt => (
            <button key={opt} onClick={() => updateChannel({ frequency: opt })} style={{
              flex: 1, padding: '8px 0',
              background: ch.frequency === opt ? col : t.bg3,
              border: `1px solid ${ch.frequency === opt ? col : t.border}`,
              borderRadius: 6,
              color: ch.frequency === opt ? '#000' : t.text3,
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 10, fontWeight: 700, letterSpacing: 1,
              cursor: 'pointer', textTransform: 'uppercase',
            }}>{opt}</button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

function ToggleRow({ t, col, label, on, onChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 0', borderTop: `1px dashed ${t.border}`,
    }}>
      <div style={{
        fontFamily: 'DM Mono, monospace', fontSize: 9,
        letterSpacing: '0.2em', color: t.text,
      }}>{label}</div>
      <div onClick={() => onChange(!on)} style={{
        width: 36, height: 22, borderRadius: 11,
        background: on ? col : t.bg3,
        border: `1px solid ${on ? col : t.border}`,
        position: 'relative', cursor: 'pointer',
      }}>
        <div style={{
          position: 'absolute', top: 2, left: on ? 16 : 2,
          width: 16, height: 16, borderRadius: '50%',
          background: on ? '#000' : t.text3,
          transition: 'left 0.15s',
        }}/>
      </div>
    </div>
  );
}

window.ManagerScreen = ManagerScreen;
