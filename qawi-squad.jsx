// qawi-squad.jsx — Global leaderboard + User-created groups + Masjid directory

function SquadScreen({ t, state, setState, onBack, profile }) {
  const [tab, setTab] = React.useState('global');
  const isF = profile?.gender === 'female';
  const TERM = isF ? 'SISTERS' : 'BROTHERS';
  const TERM_AR = isF ? 'الأخوات' : 'الإخوة';
  const TERM_SINGULAR = isF ? 'sisters' : 'brothers';
  const meName = profile?.name || 'You';
  const meInitial = (profile?.name || 'Y')[0].toUpperCase();

  // Global leaderboard (mock users across the app)
  const globalRoster = React.useMemo(() => {
    const base = [
      { name: 'Hamza',   handle: '@hamza_x',  score: 28, country: 'UAE',    gender: 'male' },
      { name: 'Aisha',   handle: '@aishaz',   score: 26, country: 'UK',     gender: 'female' },
      { name: 'Yusuf',   handle: '@yusufz',   score: 24, country: 'EG',     gender: 'male' },
      { name: 'Khadija', handle: '@khadija',  score: 22, country: 'SA',     gender: 'female' },
      { name: 'Omar',    handle: '@omar22',   score: 21, country: 'JO',     gender: 'male' },
      { name: 'Maryam',  handle: '@maryam',   score: 20, country: 'MA',     gender: 'female' },
      { name: meName,    handle: `@${meName.toLowerCase()}`, score: 18, country: profile?.country || 'US', gender: profile?.gender, isMe: true },
      { name: 'Mustafa', handle: '@mus',      score: 15, country: 'US',     gender: 'male' },
      { name: 'Bassam',  handle: '@bass',     score: 12, country: 'CA',     gender: 'male' },
      { name: 'Noor',    handle: '@noor',     score: 10, country: 'TR',     gender: 'female' },
      { name: 'Ali',     handle: '@ali',      score: 8,  country: 'PK',     gender: 'male' },
    ];
    return base.sort((a, b) => b.score - a.score);
  }, [meName, profile?.country, profile?.gender]);

  const myRank = globalRoster.findIndex(u => u.isMe) + 1;

  // Groups
  const [groups, setGroups] = React.useState(() => {
    const saved = localStorage.getItem('qawi-groups');
    return saved ? JSON.parse(saved) : [
      {
        id: 'g1', name: 'THE BROTHERS', emoji: '⚔', createdBy: meName,
        members: [
          { name: meName,  score: 18, avatar: meInitial, isMe: true },
          { name: 'Mustafa', score: 15, avatar: 'M' },
          { name: 'Bassam',  score: 12, avatar: 'B' },
        ],
      },
    ];
  });
  const [activeGroup, setActiveGroup] = React.useState(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [inviteOpen, setInviteOpen] = React.useState(false);

  React.useEffect(() => {
    localStorage.setItem('qawi-groups', JSON.stringify(groups));
  }, [groups]);

  const [masjids, setMasjids] = React.useState([
    { id: 1, name: 'Masjid An-Nur',   addedBy: 'Karim',   dist: '0.3 mi', tag: 'FAVORITE · JUMUAH' },
    { id: 2, name: 'Islamic Center',  addedBy: 'Bassam',  dist: '0.7 mi', tag: 'LARGE · LECTURES' },
    { id: 3, name: 'Masjid Al-Falah', addedBy: 'Mustafa', dist: '1.1 mi', tag: 'QURAN SCHOOL' },
    { id: 4, name: 'Dar Al-Salam',    addedBy: 'Karim',   dist: '1.9 mi', tag: 'RAMADAN IFTAR' },
  ]);
  const [showAddMasjid, setShowAddMasjid] = React.useState(false);

  const createGroup = (data) => {
    const newGroup = {
      id: `g${Date.now()}`, ...data, createdBy: meName,
      members: [{ name: meName, score: 18, avatar: meInitial, isMe: true }],
    };
    setGroups([...groups, newGroup]);
    setCreateOpen(false);
    setActiveGroup(newGroup);
  };

  const addToGroup = (groupId, member) => {
    setGroups(groups.map(g => g.id === groupId
      ? { ...g, members: [...g.members, member] }
      : g));
    // update activeGroup reference if matching
    if (activeGroup && activeGroup.id === groupId) {
      setActiveGroup({ ...activeGroup, members: [...activeGroup.members, member] });
    }
  };

  return (
    <div style={{ minHeight: '100%', background: t.bg, color: t.text, paddingBottom: 40 }}>
      <Topbar t={t} onBack={onBack} title="SQUAD" titleAr={TERM_AR} />

      <div style={{ padding: '14px 14px 0' }}>
        {/* Tab switcher: GLOBAL | GROUPS | MASJIDS */}
        <div style={{
          display: 'flex', gap: 3,
          background: t.bg3, borderRadius: 10, padding: 3, marginBottom: 14,
        }}>
          {[
            ['global','GLOBAL','العالم'],
            ['groups','MY GROUPS','مجموعاتي'],
            ['salah','MASJIDS','المساجد'],
          ].map(([id,l,ar]) => (
            <button key={id} onClick={() => { setTab(id); setActiveGroup(null); }} style={{
              flex: 1, padding: '9px 2px', borderRadius: 6,
              border: tab === id ? `1px solid ${t.border}` : 'none',
              background: tab === id ? t.bg2 : 'none',
              color: tab === id ? t.accent : t.text3,
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: 1,
            }}>
              <span>{l}</span>
              <span style={{fontFamily:'Amiri,Georgia,serif',fontSize:9,letterSpacing:0,opacity:.6,fontWeight:400}}>{ar}</span>
            </button>
          ))}
        </div>

        {tab === 'global' && (
          <GlobalLeaderboard t={t} roster={globalRoster} myRank={myRank} />
        )}

        {tab === 'groups' && !activeGroup && (
          <GroupsList t={t} groups={groups} onOpen={setActiveGroup} onCreate={() => setCreateOpen(true)} TERM={TERM} />
        )}

        {tab === 'groups' && activeGroup && (
          <GroupDetail t={t} group={activeGroup} onBack={() => setActiveGroup(null)} onInvite={() => setInviteOpen(true)}
            onDelete={() => {
              setGroups(groups.filter(g => g.id !== activeGroup.id));
              setActiveGroup(null);
            }}
          />
        )}

        {tab === 'salah' && (
          <MasjidDirectory t={t} masjids={masjids} TERM_SINGULAR={TERM_SINGULAR}
            onAdd={() => setShowAddMasjid(true)} />
        )}
      </div>

      {createOpen && <CreateGroupSheet t={t} onClose={() => setCreateOpen(false)} onSave={createGroup} />}
      {inviteOpen && activeGroup && <InviteSheet t={t} group={activeGroup}
        onClose={() => setInviteOpen(false)}
        onAdd={(m) => { addToGroup(activeGroup.id, m); setInviteOpen(false); }} />}
      {showAddMasjid && (
        <AddMasjidSheet t={t} onClose={() => setShowAddMasjid(false)} onSave={(m) => {
          setMasjids([...masjids, { id: Date.now(), addedBy: meName, dist: '0.0 mi', tag: 'NEW', ...m }]);
          setShowAddMasjid(false);
        }} />
      )}
    </div>
  );
}

// ---- GLOBAL LEADERBOARD ----
function GlobalLeaderboard({ t, roster, myRank }) {
  const top = roster.slice(0, 3);
  const rest = roster.slice(3);
  return (
    <>
      <div style={{
        background: t.bg2, border: `1px solid ${t.border}`,
        borderRadius: 12, padding: 14, marginBottom: 14,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -20, right: -10,
          fontFamily: 'Amiri, Georgia, serif', fontSize: 90,
          color: t.accent, opacity: 0.06, direction: 'rtl',
        }}>العالم</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <div>
            <div style={{
              fontFamily: 'DM Mono, monospace', fontSize: 9,
              color: t.text3, letterSpacing: '0.2em',
            }}>// YOUR RANK</div>
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 34, fontWeight: 900, color: t.accent, lineHeight: 1,
            }}>#{myRank} <span style={{fontSize:14,color:t.text3,fontWeight:400}}>of {roster.length}</span></div>
          </div>
          <div style={{
            fontFamily: 'DM Mono, monospace', fontSize: 10,
            color: t.accent2, letterSpacing: '0.15em', textAlign: 'right',
          }}>GYM SESSIONS<br/>THIS MONTH</div>
        </div>
      </div>

      {/* Podium — top 3 */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: 6,
        alignItems: 'end', marginBottom: 16,
      }}>
        {[top[1], top[0], top[2]].filter(Boolean).map((user, idx) => {
          const ranks = [2, 1, 3];
          const rank = ranks[idx];
          const heights = [75, 95, 62];
          const colors = [t.text2, t.accent, t.accent2];
          const country = window.QAWI_COUNTRIES.find(c => c.code === user.country);
          return (
            <div key={user.handle} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <div style={{
                width: rank === 1 ? 56 : 46, height: rank === 1 ? 56 : 46,
                borderRadius: '50%',
                background: t.bg2, border: `2px solid ${colors[idx]}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: rank === 1 ? 22 : 18, fontWeight: 800,
                color: colors[idx], marginBottom: 6,
              }}>{user.name[0]}</div>
              <div style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 13, fontWeight: 700, letterSpacing: 1,
                color: t.text, lineHeight: 1, marginBottom: 2,
              }}>{user.name.toUpperCase()}</div>
              <div style={{ fontSize: 14, marginBottom: 6 }}>{country?.flag || '🌍'}</div>
              <div style={{
                width: '100%', height: heights[idx],
                background: colors[idx], opacity: 0.85,
                borderRadius: '6px 6px 0 0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: rank === 1 ? 32 : 24, fontWeight: 900,
                color: '#000',
              }}>#{rank}</div>
              <div style={{
                width: '100%', padding: '4px 0', textAlign: 'center',
                background: t.bg3, borderTop: `1px solid ${colors[idx]}`,
                fontFamily: 'DM Mono, monospace', fontSize: 11, fontWeight: 600,
                color: colors[idx],
              }}>{user.score}</div>
            </div>
          );
        })}
      </div>

      <DiamondDivider color={t.accent} label="ALL USERS" labelAr="الكل" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 10 }}>
        {rest.map((row, i) => {
          const country = window.QAWI_COUNTRIES.find(c => c.code === row.country);
          return (
            <div key={row.handle} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px',
              background: row.isMe ? t.accentGlow : t.bg2,
              border: `1px solid ${row.isMe ? t.accent : t.border}`,
              borderRadius: 8,
            }}>
              <div style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 18, fontWeight: 900,
                color: row.isMe ? t.accent : t.text3,
                width: 24, textAlign: 'center', lineHeight: 1,
              }}>{i + 4}</div>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: t.bg3, border: `1px solid ${t.border2}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 14, fontWeight: 700, color: t.text2,
                flexShrink: 0,
              }}>{row.name[0]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{row.name}{row.isMe && ' (YOU)'}</div>
                  <div style={{ fontSize: 12 }}>{country?.flag || ''}</div>
                </div>
                <div style={{ fontSize: 9, color: t.text3, fontFamily: 'DM Mono, monospace' }}>{row.handle}</div>
              </div>
              <div style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 20, fontWeight: 800, color: row.isMe ? t.accent : t.text2,
              }}>{row.score}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ---- GROUPS LIST ----
function GroupsList({ t, groups, onOpen, onCreate, TERM }) {
  return (
    <>
      <DiamondDivider color={t.accent} label="YOUR GROUPS" labelAr="مجموعاتك" />
      <div style={{
        fontSize: 11, color: t.text3, marginTop: 8, marginBottom: 12, lineHeight: 1.4,
      }}>Create private groups with your {TERM.toLowerCase()}. Compete, motivate, stay accountable — just your crew.</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {groups.length === 0 && (
          <div style={{
            padding: 20, textAlign: 'center',
            border: `1px dashed ${t.border2}`, borderRadius: 10,
            color: t.text3, fontSize: 12,
            fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em',
          }}>NO GROUPS YET · CREATE ONE</div>
        )}
        {groups.map(g => {
          const topMember = [...g.members].sort((a, b) => b.score - a.score)[0];
          return (
            <button key={g.id} onClick={() => onOpen(g)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: 12, background: t.bg2,
              border: `1px solid ${t.border}`, borderLeft: `3px solid ${t.accent}`,
              borderRadius: '0 10px 10px 0', cursor: 'pointer',
              fontFamily: 'inherit', textAlign: 'left',
            }}>
              <div style={{
                width: 44, height: 44, flexShrink: 0,
                background: t.bg3, border: `1px solid ${t.accent}`,
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>{g.emoji || '⚔'}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 16, fontWeight: 800, letterSpacing: 1.5,
                  color: t.accent, textTransform: 'uppercase', lineHeight: 1.1,
                }}>{g.name}</div>
                <div style={{
                  fontSize: 10, color: t.text3, marginTop: 3,
                  fontFamily: 'DM Mono, monospace', letterSpacing: '0.05em',
                }}>{g.members.length} MEMBERS · LEAD: <span style={{color:t.text}}>{topMember?.name.toUpperCase()}</span></div>
              </div>
              <div style={{
                display: 'flex', flexDirection: 'row-reverse',
                marginRight: 4,
              }}>
                {g.members.slice(0, 3).map((m, i) => (
                  <div key={i} style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: m.isMe ? t.accent : t.bg3,
                    border: `2px solid ${t.bg2}`,
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: 11, fontWeight: 700,
                    color: m.isMe ? '#000' : t.text2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginLeft: i === 0 ? 0 : -6,
                    zIndex: 3 - i,
                  }}>{m.avatar}</div>
                ))}
              </div>
              <div style={{ color: t.accentDim, fontSize: 18 }}>→</div>
            </button>
          );
        })}
      </div>

      <button onClick={onCreate} style={{
        width: '100%', marginTop: 14, padding: 14,
        background: 'transparent', border: `1.5px dashed ${t.accent}`,
        borderRadius: 10, color: t.accent,
        fontFamily: 'Barlow Condensed, sans-serif',
        fontSize: 14, fontWeight: 800, letterSpacing: 2,
        cursor: 'pointer',
      }}>+ CREATE NEW GROUP <span style={{fontFamily:'Amiri,Georgia,serif',fontSize:12,fontWeight:400}}>· أنشئ مجموعة</span></button>
    </>
  );
}

// ---- GROUP DETAIL (leaderboard for this group) ----
function GroupDetail({ t, group, onBack, onInvite, onDelete }) {
  const sorted = [...group.members].sort((a, b) => b.score - a.score);
  return (
    <>
      <button onClick={onBack} style={{
        background: 'none', border: 'none', color: t.accent,
        fontFamily: 'DM Mono, monospace', fontSize: 11,
        letterSpacing: '0.12em', padding: 0, marginBottom: 12,
        cursor: 'pointer',
      }}>← BACK TO GROUPS</button>

      <div style={{
        background: t.bg2, border: `1px solid ${t.accent}`,
        borderRadius: 12, padding: 16, marginBottom: 14,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 34, marginBottom: 6 }}>{group.emoji || '⚔'}</div>
        <div style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 24, fontWeight: 900, letterSpacing: 3,
          color: t.accent, lineHeight: 1,
        }}>{group.name}</div>
        <div style={{
          fontFamily: 'DM Mono, monospace', fontSize: 9,
          color: t.text3, letterSpacing: '0.18em', marginTop: 6,
        }}>{group.members.length} MEMBERS · CREATED BY {group.createdBy.toUpperCase()}</div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <button onClick={onInvite} style={{
          flex: 1, padding: 12, background: t.accent, border: 'none',
          borderRadius: 10, color: '#000',
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 12, fontWeight: 800, letterSpacing: 2,
          cursor: 'pointer',
        }}>+ INVITE</button>
        <button onClick={() => {
          if (confirm(`Delete "${group.name}"?`)) onDelete();
        }} style={{
          padding: '12px 16px', background: 'transparent',
          border: `1px solid ${t.accent2}`, borderRadius: 10, color: t.accent2,
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 12, fontWeight: 700, letterSpacing: 2,
          cursor: 'pointer',
        }}>DELETE</button>
      </div>

      <DiamondDivider color={t.accent} label="LEADERBOARD" labelAr="الترتيب" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
        {sorted.map((m, i) => (
          <div key={m.name} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '11px 12px',
            background: m.isMe ? t.accentGlow : t.bg2,
            border: `1px solid ${i === 0 ? t.accent : t.border}`,
            borderRadius: 8,
          }}>
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 20, fontWeight: 900,
              color: i === 0 ? t.accent : t.text3,
              width: 24, textAlign: 'center',
            }}>{i + 1}</div>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: i === 0 ? t.accent : t.bg3,
              border: `1px solid ${i === 0 ? t.accent : t.border2}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 14, fontWeight: 800,
              color: i === 0 ? '#000' : t.text2,
            }}>{m.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{m.name}{m.isMe && ' (YOU)'}</div>
              <div style={{ fontSize: 9, color: t.text3, fontFamily: 'DM Mono, monospace' }}>GYM · SESSIONS</div>
            </div>
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 22, fontWeight: 800, color: i === 0 ? t.accent : t.text2,
            }}>{m.score}</div>
          </div>
        ))}
      </div>
    </>
  );
}

// ---- MASJID DIRECTORY (unchanged) ----
function MasjidDirectory({ t, masjids, TERM_SINGULAR, onAdd }) {
  return (
    <>
      <DiamondDivider color={t.accent} label="SHARED MASJIDS" labelAr="المساجد" />

      <div style={{
        marginTop: 12, marginBottom: 12,
        padding: '12px 14px',
        background: t.bg2, border: `1px solid ${t.border}`,
        borderRadius: 10,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ fontSize: 11, color: t.text2, flex: 1, lineHeight: 1.4 }}>
          Masjids added by the {TERM_SINGULAR}. No leaderboard — just a shared directory.
        </div>
        <div style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 26, fontWeight: 800, color: t.accent, lineHeight: 1,
        }}>{masjids.length}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {masjids.map(m => (
          <div key={m.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: 12, background: t.bg2,
            border: `1px solid ${t.border}`, borderRadius: 10,
          }}>
            <div style={{
              width: 38, height: 38, flexShrink: 0,
              background: t.bg3, border: `1px solid ${t.border2}`,
              borderRadius: 8, position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ position:'absolute', bottom:6, left:8, right:8, height:18, border:`1px solid ${t.accent}`, borderRadius: 1 }} />
              <div style={{ position:'absolute', top:7, left:'50%', transform:'translateX(-50%)', width:16, height:14, border:`1px solid ${t.accent}`, borderRadius:'50% 50% 0 0', background:t.bg2 }} />
              <div style={{ position:'absolute', top:2, left:'50%', transform:'translateX(-50%)', width:1.5, height:6, background:t.accent }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 15, fontWeight: 700, letterSpacing: 1,
                color: t.text, textTransform: 'uppercase', lineHeight: 1.1,
              }}>{m.name}</div>
              <div style={{
                fontSize: 10, color: t.text3, marginTop: 3,
                fontFamily: 'DM Mono, monospace', letterSpacing: '0.05em',
              }}>ADDED BY <span style={{color:t.accent}}>{m.addedBy.toUpperCase()}</span> · {m.dist}</div>
              <div style={{
                fontSize: 9, color: t.accent2, marginTop: 3,
                fontFamily: 'DM Mono, monospace', letterSpacing: '0.08em',
              }}>{m.tag}</div>
            </div>
            <div style={{ color: t.accentDim, fontSize: 18 }}>→</div>
          </div>
        ))}
      </div>

      <button onClick={onAdd} style={{
        width: '100%', marginTop: 14, padding: 14,
        background: 'transparent', border: `1.5px dashed ${t.border2}`,
        borderRadius: 10, color: t.accent,
        fontFamily: 'Barlow Condensed, sans-serif',
        fontSize: 14, fontWeight: 800, letterSpacing: 2,
        cursor: 'pointer',
      }}>+ ADD A MASJID <span style={{fontFamily:'Amiri,Georgia,serif',fontSize:12,fontWeight:400}}>· أضف مسجدًا</span></button>
    </>
  );
}

// ---- CREATE GROUP SHEET ----
function CreateGroupSheet({ t, onClose, onSave }) {
  const [name, setName] = React.useState('');
  const [emoji, setEmoji] = React.useState('⚔');
  const emojis = ['⚔','🔥','💪','🕌','🌙','⚡','🏆','🛡','⭐','🌅'];
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 390,
        background: t.bg, border: `1px solid ${t.border2}`,
        borderRadius: '18px 18px 0 0', padding: '22px 20px 28px',
      }}>
        <div style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 22, fontWeight: 800, letterSpacing: 2,
          color: t.accent, marginBottom: 4,
        }}>CREATE GROUP</div>
        <div style={{
          fontFamily: 'Amiri, Georgia, serif', fontSize: 13,
          color: t.accentDim, direction: 'rtl', marginBottom: 18,
        }}>أنشئ مجموعة جديدة</div>

        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: t.text3, letterSpacing: '0.15em', marginBottom: 6 }}>GROUP NAME</div>
        <input value={name} onChange={e => setName(e.target.value.toUpperCase())} placeholder="E.g. UNI BROTHERS" style={{
          width: '100%', background: t.bg2, border: `1px solid ${t.border2}`,
          borderRadius: 8, padding: '10px 12px', color: t.text, outline: 'none',
          fontSize: 14, marginBottom: 14, boxSizing: 'border-box',
          fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: 1.5, fontWeight: 700,
        }} />

        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: t.text3, letterSpacing: '0.15em', marginBottom: 6 }}>ICON</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 18 }}>
          {emojis.map(e => (
            <button key={e} onClick={() => setEmoji(e)} style={{
              padding: '10px 0', fontSize: 22,
              background: emoji === e ? t.accentGlow : t.bg2,
              border: `1.5px solid ${emoji === e ? t.accent : t.border}`,
              borderRadius: 8, cursor: 'pointer',
            }}>{e}</button>
          ))}
        </div>

        <button onClick={() => name && onSave({ name, emoji })} disabled={!name} style={{
          width: '100%', padding: 12,
          background: name ? t.accent : t.bg4, border: 'none',
          borderRadius: 10, color: '#000',
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 14, fontWeight: 800, letterSpacing: 2,
          cursor: name ? 'pointer' : 'not-allowed',
        }}>✓ CREATE GROUP</button>
      </div>
    </div>
  );
}

// ---- INVITE MEMBER SHEET ----
function InviteSheet({ t, group, onClose, onAdd }) {
  const [search, setSearch] = React.useState('');
  const pool = [
    { name: 'Hamza',   avatar: 'H', score: 14 },
    { name: 'Yusuf',   avatar: 'Y', score: 11 },
    { name: 'Khadija', avatar: 'K', score: 16 },
    { name: 'Omar',    avatar: 'O', score: 9 },
    { name: 'Maryam',  avatar: 'M', score: 13 },
    { name: 'Noor',    avatar: 'N', score: 7 },
    { name: 'Ali',     avatar: 'A', score: 5 },
  ].filter(p => !group.members.find(m => m.name === p.name))
   .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 390, maxHeight: '80%',
        background: t.bg, border: `1px solid ${t.border2}`,
        borderRadius: '18px 18px 0 0', padding: '22px 20px 20px',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 22, fontWeight: 800, letterSpacing: 2,
          color: t.accent, marginBottom: 4,
        }}>INVITE TO {group.name}</div>
        <div style={{
          fontFamily: 'Amiri, Georgia, serif', fontSize: 13,
          color: t.accentDim, direction: 'rtl', marginBottom: 14,
        }}>أضف أعضاء</div>

        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or @handle..." style={{
          width: '100%', background: t.bg2, border: `1px solid ${t.border2}`,
          borderRadius: 8, padding: '10px 12px', color: t.text, outline: 'none',
          fontSize: 13, marginBottom: 14, boxSizing: 'border-box',
        }} />

        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {pool.length === 0 && (
            <div style={{
              padding: 20, textAlign: 'center', color: t.text3, fontSize: 12,
              fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em',
            }}>NO MATCHES</div>
          )}
          {pool.map(p => (
            <div key={p.name} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', background: t.bg2,
              border: `1px solid ${t.border}`, borderRadius: 8,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: t.bg3, border: `1px solid ${t.border2}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 14, fontWeight: 700, color: t.text2,
              }}>{p.avatar}</div>
              <div style={{ flex: 1, fontSize: 14, color: t.text, fontWeight: 600 }}>{p.name}</div>
              <button onClick={() => onAdd(p)} style={{
                padding: '6px 12px', background: t.accent, border: 'none',
                borderRadius: 6, color: '#000',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 11, fontWeight: 800, letterSpacing: 1.5,
                cursor: 'pointer',
              }}>+ ADD</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- ADD MASJID (reused) ----
function AddMasjidSheet({ t, onClose, onSave }) {
  const [name, setName] = React.useState('');
  const [notes, setNotes] = React.useState('');
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 390,
        background: t.bg, border: `1px solid ${t.border2}`,
        borderRadius: '18px 18px 0 0', padding: 20,
      }}>
        <div style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 20, fontWeight: 800, letterSpacing: 2,
          color: t.accent, marginBottom: 4,
        }}>ADD A MASJID</div>
        <div style={{
          fontFamily: 'Amiri, Georgia, serif', fontSize: 13,
          color: t.accentDim, direction: 'rtl', marginBottom: 16,
        }}>أضف مسجدًا</div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: t.text3, letterSpacing: '0.15em', marginBottom: 6 }}>NAME</div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Masjid name..." style={{
            width: '100%', background: t.bg2, border: `1px solid ${t.border2}`,
            borderRadius: 8, padding: '10px 12px', color: t.text, outline: 'none',
            fontSize: 14, boxSizing: 'border-box',
          }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: t.text3, letterSpacing: '0.15em', marginBottom: 6 }}>NOTES (jumu'ah time, etc.)</div>
          <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Jumu'ah 13:30..." style={{
            width: '100%', background: t.bg2, border: `1px solid ${t.border2}`,
            borderRadius: 8, padding: '10px 12px', color: t.text, outline: 'none',
            fontSize: 14, boxSizing: 'border-box',
          }} />
        </div>
        <button onClick={() => name && onSave({ name, tag: notes.toUpperCase() || 'NEW' })} style={{
          width: '100%', padding: 12, background: t.accent, border: 'none',
          borderRadius: 8, color: '#000', fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 14, fontWeight: 800, letterSpacing: 2, cursor: 'pointer',
        }}>SAVE</button>
      </div>
    </div>
  );
}

window.SquadScreen = SquadScreen;
