// Widget & Shortcuts setup screen

const SHORTCUT_ATHKAR = {
  morning: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ — We enter the morning and the kingdom belongs to Allah.',
  evening: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ — We enter the evening and the kingdom belongs to Allah.',
  sleep: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا — In Your name, O Allah, I die and I live.',
};

function WidgetsScreen({ t, onBack }) {
  const [copied, setCopied] = React.useState(false);
  const [tab, setTab] = React.useState('widget');

  const WIDGET_URL = 'https://karimaljabari.github.io/qawi-app/qawi-widget.js';
  const SCRIPT_LINE = `const s=new Request('${WIDGET_URL}');eval(await s.loadString());`;

  function copyScript() {
    try {
      navigator.clipboard.writeText(SCRIPT_LINE).then(() => {
        setCopied(true); setTimeout(() => setCopied(false), 2000);
      }).catch(fallback);
    } catch(e) { fallback(); }
    function fallback() {
      const el = document.createElement('textarea');
      el.value = SCRIPT_LINE;
      document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    }
  }

  const gold = t.accent;
  const goldSoft = t.accentDim;
  const bg = t.bg;
  const card = t.bg2;
  const card2 = t.bg3;
  const text = t.text;
  const dim = t.text2;
  const border = t.border;
  const border2 = t.border2;

  const Step = ({ n, children }) => (
    <div style={{ display:'flex', gap:12, marginBottom:16 }}>
      <div style={{ width:22, height:22, borderRadius:11, background:gold, color:'#000', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, flexShrink:0, marginTop:2 }}>{n}</div>
      <div style={{ color:text, fontSize:13, lineHeight:1.65 }}>{children}</div>
    </div>
  );

  const Tag = ({ children }) => (
    <span style={{ background:`rgba(201,168,76,0.12)`, border:`1px solid ${border2}`, borderRadius:5, padding:'1px 7px', fontSize:11, color:gold, fontFamily:'DM Mono, monospace' }}>{children}</span>
  );

  return (
    <div style={{ background:bg, minHeight:'100%', paddingBottom:48 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'52px 20px 0' }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:gold, fontSize:22, cursor:'pointer', padding:0, lineHeight:1 }}>‹</button>
        <div>
          <div style={{ color:text, fontSize:17, fontWeight:700, letterSpacing:-0.3 }}>Widgets & Shortcuts</div>
          <div style={{ color:dim, fontSize:11, marginTop:2 }}>Home screen · Lock screen · Notifications</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', margin:'20px 20px 0', background:'rgba(255,255,255,0.05)', borderRadius:10, padding:3 }}>
        {[['widget','◈  Widget'],['shortcuts','✧  Shortcuts']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ flex:1, padding:'8px 0', borderRadius:8, border:'none', cursor:'pointer', fontSize:12, fontWeight:700, transition:'all 0.2s',
            background: tab===id ? gold : 'transparent', color: tab===id ? '#000' : dim }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'widget' && (
        <div style={{ padding:'20px 20px 0' }}>
          {/* Live preview mockup */}
          <div style={{ background:'linear-gradient(135deg,#131320,#09090f)', border:`1px solid ${border2}`, borderRadius:18, padding:18, marginBottom:18 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
              <span style={{ color:gold, fontWeight:700, fontSize:12 }}>◐  QAWI</span>
              <span style={{ color:dim, fontSize:11 }}>3:24 PM</span>
            </div>
            <div style={{ color:'rgba(201,168,76,0.6)', fontSize:8, fontWeight:700, letterSpacing:1, marginBottom:3 }}>NEXT PRAYER</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:2 }}>
              <span style={{ color:'#F5F0E8', fontSize:21, fontWeight:700 }}>العصر</span>
              <span style={{ color:dim, fontSize:12 }}>Asr</span>
            </div>
            <div style={{ color:gold, fontSize:13, fontWeight:700, marginBottom:12 }}>4:47 PM  ·  in 1h 23m</div>
            <div style={{ height:1, background:'rgba(201,168,76,0.15)', marginBottom:10 }} />
            <div style={{ color:'rgba(201,168,76,0.6)', fontSize:7, fontWeight:700, letterSpacing:1, marginBottom:4 }}>MORNING THIKR · الصباح</div>
            <div style={{ color:'#F5F0E8', fontSize:11, lineHeight:1.5, marginBottom:3 }}>أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ</div>
            <div style={{ color:dim, fontSize:9, fontStyle:'italic' }}>We enter the morning and the kingdom belongs to Allah.</div>
          </div>

          {/* Get Scriptable */}
          <div style={{ background:card, borderRadius:16, padding:16, marginBottom:14, border:`1px solid ${border}` }}>
            <div style={{ color:text, fontSize:13, fontWeight:700, marginBottom:6 }}>Step 0 — Get Scriptable (free)</div>
            <div style={{ color:dim, fontSize:12, lineHeight:1.6, marginBottom:12 }}>
              Scriptable is a free iOS app that runs JavaScript widgets. Required for home screen + lock screen widgets.
            </div>
            <a href="https://apps.apple.com/app/scriptable/id1405459188" style={{ display:'block', textAlign:'center', background:gold, color:'#000', borderRadius:10, padding:'10px 0', fontWeight:700, fontSize:13, textDecoration:'none' }}>
              Download Scriptable — App Store
            </a>
          </div>

          {/* Setup steps */}
          <div style={{ background:card, borderRadius:16, padding:18, border:`1px solid ${border}` }}>
            <div style={{ color:text, fontSize:14, fontWeight:700, marginBottom:18 }}>Setup (2 minutes)</div>
            <Step n="1">Open <Tag>Scriptable</Tag> → tap <Tag>+</Tag> (top right)</Step>
            <Step n="2">Tap the script title at the top → rename it <Tag>QAWI</Tag></Step>
            <Step n="3">
              Delete any existing code, then paste this one line:
              <div style={{ background:'#000', borderRadius:8, padding:'10px 12px', marginTop:8, fontFamily:'DM Mono, monospace', fontSize:10, color:gold, wordBreak:'break-all', lineHeight:1.7 }}>
                {SCRIPT_LINE}
              </div>
              <button onClick={copyScript} style={{ marginTop:8, background: copied ? 'rgba(61,255,143,0.1)' : `rgba(201,168,76,0.1)`, border:`1px solid ${border2}`, borderRadius:8, padding:'8px 0', color: copied ? '#3DFF8F' : gold, fontSize:12, fontWeight:700, cursor:'pointer', width:'100%' }}>
                {copied ? '✓  Copied!' : '⎘  Copy Script'}
              </button>
            </Step>
            <Step n="4">Tap <Tag>▶ Run</Tag> — allow location access when asked</Step>
            <Step n="5">
              <strong style={{ color:gold }}>Home screen:</strong> Long-press home screen → <Tag>+</Tag> → search <Tag>Scriptable</Tag> → pick size → choose <Tag>QAWI</Tag>
            </Step>
            <Step n="6">
              <strong style={{ color:gold }}>Lock screen:</strong> Long-press lock screen → <Tag>Customize</Tag> → <Tag>Add Widget</Tag> → Scriptable → <Tag>QAWI</Tag>
            </Step>

            <div style={{ background:t.accentGlow, borderRadius:10, padding:12, marginTop:4 }}>
              <div style={{ color:gold, fontSize:11, fontWeight:700, marginBottom:4 }}>Widget features</div>
              <div style={{ color:dim, fontSize:11, lineHeight:1.75 }}>
                ◐  Next prayer name + countdown + time<br/>
                ✎  Morning · Evening · Sleep athkar (rotates daily)<br/>
                ↺  Auto-refreshes every 10 minutes<br/>
                ↗  Tap widget to open QAWI app
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'shortcuts' && (
        <div style={{ padding:'20px 20px 0' }}>
          <div style={{ color:dim, fontSize:12, lineHeight:1.7, marginBottom:18 }}>
            Three daily automations in the <span style={{ color:gold, fontWeight:600 }}>Shortcuts</span> app. They run silently and push a notification with the right athkar — no interaction needed after setup.
          </div>

          {[
            { time:'Morning', emoji:'☀️', timeVal:'06:00', thikr:SHORTCUT_ATHKAR.morning, desc:'Runs at 6:00 AM daily · morning athkar' },
            { time:'Evening', emoji:'🌅', timeVal:'16:00', thikr:SHORTCUT_ATHKAR.evening, desc:'Runs at 4:00 PM daily · evening athkar' },
            { time:'Sleep',   emoji:'🌙', timeVal:'21:30', thikr:SHORTCUT_ATHKAR.sleep,   desc:'Runs at 9:30 PM daily · sleep athkar'  },
          ].map(({ time, emoji, timeVal, thikr, desc }) => (
            <div key={time} style={{ background:card, borderRadius:16, padding:18, marginBottom:14, border:`1px solid ${border}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                <span style={{ fontSize:22 }}>{emoji}</span>
                <div>
                  <div style={{ color:text, fontSize:14, fontWeight:700 }}>{time} Thikr</div>
                  <div style={{ color:dim, fontSize:11 }}>{desc}</div>
                </div>
              </div>
              <Step n="1">Open <Tag>Shortcuts</Tag> → <Tag>Automation</Tag> tab → <Tag>+</Tag> → <Tag>Personal Automation</Tag></Step>
              <Step n="2">Choose <Tag>Time of Day</Tag> → set <Tag>{timeVal}</Tag> → Daily → Next</Step>
              <Step n="3">Tap <Tag>New Blank Automation</Tag> then <Tag>Add Action</Tag> → search <Tag>Show Notification</Tag></Step>
              <Step n="4">
                Title: <Tag>QAWI</Tag><br/>
                <span style={{ color:dim, fontSize:12 }}>Body — copy and paste:</span>
                <div style={{ background:'#000', borderRadius:8, padding:'10px 12px', marginTop:6, fontSize:12, color:text, lineHeight:1.7, direction:'rtl', textAlign:'right' }}>
                  {thikr.split(' — ')[0]}
                </div>
              </Step>
              <Step n="5">Tap <Tag>Next</Tag> → turn off <Tag>Ask Before Running</Tag> → <Tag>Done</Tag></Step>
            </div>
          ))}

          <div style={{ background:t.accentGlow, borderRadius:12, padding:14, border:`1px solid ${border}` }}>
            <div style={{ color:gold, fontSize:12, fontWeight:700, marginBottom:5 }}>Tip</div>
            <div style={{ color:dim, fontSize:12, lineHeight:1.65 }}>
              iOS asks "Allow" once per automation. After that it fires silently every day — no tapping needed.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

window.WidgetsScreen = WidgetsScreen;
