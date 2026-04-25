// Widget & Shortcuts setup screen

const SHORTCUT_ATHKAR = {
  morning: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ — We enter the morning and the kingdom belongs to Allah.',
  evening: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ — We enter the evening and the kingdom belongs to Allah.',
  sleep: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا — In Your name, O Allah, I die and I live.',
};

function WidgetsScreen({ t, onBack }) {
  const [copied, setCopied] = React.useState(false);
  const [tab, setTab] = React.useState('widget'); // 'widget' | 'shortcuts'

  const WIDGET_URL = 'https://karimaljabari.github.io/qawi-app/qawi-widget.js';

  function copyWidgetUrl() {
    try {
      navigator.clipboard.writeText(WIDGET_URL).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch(e) {
      // fallback
      const el = document.createElement('textarea');
      el.value = WIDGET_URL;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const bg = t.colors.bg;
  const card = t.colors.card || '#111118';
  const gold = t.colors.gold;
  const text = t.colors.text;
  const dim = t.colors.textDim || 'rgba(255,255,255,0.5)';
  const border = t.colors.border || 'rgba(201,168,76,0.15)';

  const Step = ({ n, children }) => (
    <div style={{ display:'flex', gap:12, marginBottom:14 }}>
      <div style={{ width:24, height:24, borderRadius:12, background:gold, color:'#000', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, flexShrink:0, marginTop:2 }}>{n}</div>
      <div style={{ color:text, fontSize:13, lineHeight:1.6 }}>{children}</div>
    </div>
  );

  const Tag = ({ children }) => (
    <span style={{ background:'rgba(201,168,76,0.12)', border:`1px solid ${border}`, borderRadius:6, padding:'2px 8px', fontSize:12, color:gold, fontFamily:'DM Mono, monospace' }}>{children}</span>
  );

  return (
    <div style={{ background:bg, minHeight:'100%', paddingBottom:40 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'52px 20px 0' }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:gold, fontSize:20, cursor:'pointer', padding:0 }}>‹</button>
        <div>
          <div style={{ color:text, fontSize:18, fontWeight:700 }}>Widgets & Shortcuts</div>
          <div style={{ color:dim, fontSize:12 }}>Home screen · Lock screen · Notifications</div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display:'flex', margin:'20px 20px 0', background:'rgba(255,255,255,0.05)', borderRadius:10, padding:3 }}>
        {[['widget','◈  Widget'],['shortcuts','✧  Shortcuts']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ flex:1, padding:'8px 0', borderRadius:8, border:'none', cursor:'pointer', fontSize:12, fontWeight:700, transition:'all 0.2s',
            background: tab===id ? gold : 'transparent',
            color: tab===id ? '#000' : dim }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'widget' && (
        <div style={{ padding:'20px 20px 0' }}>
          {/* Preview card */}
          <div style={{ background:'linear-gradient(135deg,#131320,#09090f)', border:`1px solid ${border}`, borderRadius:18, padding:20, marginBottom:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <span style={{ color:gold, fontWeight:700, fontSize:13 }}>◐  QAWI</span>
              <span style={{ color:dim, fontSize:11 }}>3:24 PM</span>
            </div>
            <div style={{ color:'rgba(201,168,76,0.65)', fontSize:8, fontWeight:700, letterSpacing:1, marginBottom:4 }}>NEXT PRAYER</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:2 }}>
              <span style={{ color:text, fontSize:22, fontWeight:700 }}>العصر</span>
              <span style={{ color:dim, fontSize:13 }}>Asr</span>
            </div>
            <div style={{ color:gold, fontSize:13, fontWeight:700, marginBottom:12 }}>4:47 PM  ·  in 1h 23m</div>
            <div style={{ height:1, background:'rgba(201,168,76,0.15)', marginBottom:10 }} />
            <div style={{ color:'rgba(201,168,76,0.65)', fontSize:7, fontWeight:700, letterSpacing:1, marginBottom:4 }}>MORNING THIKR · الصباح</div>
            <div style={{ color:text, fontSize:11, lineHeight:1.5, marginBottom:3 }}>أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ</div>
            <div style={{ color:dim, fontSize:9, fontStyle:'italic' }}>We enter the morning and the kingdom belongs to Allah.</div>
          </div>

          <div style={{ background:card, borderRadius:16, padding:18, marginBottom:16, border:`1px solid ${border}` }}>
            <div style={{ color:text, fontSize:14, fontWeight:700, marginBottom:4 }}>What you need</div>
            <div style={{ color:dim, fontSize:12, lineHeight:1.6, marginBottom:12 }}>
              <span style={{ color:gold }}>Scriptable</span> — a free app on the App Store that runs JavaScript widgets natively on iOS. Supports home screen (small + medium) and lock screen widgets.
            </div>
            <a href="https://apps.apple.com/app/scriptable/id1405459188" style={{ display:'block', textAlign:'center', background:gold, color:'#000', borderRadius:10, padding:'10px 0', fontWeight:700, fontSize:13, textDecoration:'none' }}>
              Get Scriptable — Free
            </a>
          </div>

          <div style={{ background:card, borderRadius:16, padding:18, border:`1px solid ${border}` }}>
            <div style={{ color:text, fontSize:14, fontWeight:700, marginBottom:16 }}>Setup</div>

            <Step n="1">
              Open <Tag>Scriptable</Tag> → tap <Tag>+</Tag> to create a new script
            </Step>
            <Step n="2">
              Tap the script name → rename it <Tag>QAWI</Tag>
            </Step>
            <Step n="3">
              Paste this single line as the entire script content:
              <div style={{ background:'rgba(0,0,0,0.4)', borderRadius:8, padding:'10px 12px', marginTop:8, fontFamily:'DM Mono, monospace', fontSize:11, color:gold, wordBreak:'break-all', lineHeight:1.6 }}>
                {`const s=new Request('${WIDGET_URL}');eval(await s.loadString());`}
              </div>
              <button onClick={copyWidgetUrl} style={{ marginTop:8, background: copied ? 'rgba(61,255,143,0.15)' : 'rgba(201,168,76,0.12)', border:`1px solid ${border}`, borderRadius:8, padding:'7px 14px', color: copied ? '#3DFF8F' : gold, fontSize:12, fontWeight:700, cursor:'pointer', width:'100%' }}>
                {copied ? '✓ Copied!' : 'Copy Script URL'}
              </button>
            </Step>
            <Step n="4">
              Tap <Tag>▶ Run</Tag> — it will ask for location permission. Allow it once.
            </Step>
            <Step n="5">
              Long-press your home screen → tap <Tag>+</Tag> → search <Tag>Scriptable</Tag> → choose size → select <Tag>QAWI</Tag> script
            </Step>
            <Step n="6">
              <strong style={{ color:gold }}>Lock screen:</strong> Long-press lock screen → <Tag>Customize</Tag> → Add Widget → Scriptable → QAWI
            </Step>

            <div style={{ background:'rgba(201,168,76,0.07)', borderRadius:10, padding:12, marginTop:4 }}>
              <div style={{ color:gold, fontSize:11, fontWeight:700, marginBottom:4 }}>Widget shows</div>
              <div style={{ color:dim, fontSize:11, lineHeight:1.7 }}>
                Next prayer name + time + countdown<br/>
                Morning thikr · Evening thikr · Sleep thikr<br/>
                Auto-refreshes every 10 minutes
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'shortcuts' && (
        <div style={{ padding:'20px 20px 0' }}>
          <div style={{ color:dim, fontSize:12, lineHeight:1.6, marginBottom:16 }}>
            Set up these three automations in the <span style={{ color:gold }}>Shortcuts</span> app. They run silently and send a notification with the right athkar at the right time — no tapping needed.
          </div>

          {[
            { time:'Morning', emoji:'☀️', timeVal:'06:00', thikr: SHORTCUT_ATHKAR.morning, desc:'Runs daily after Fajr · sends morning athkar' },
            { time:'Evening', emoji:'🌅', timeVal:'16:00', thikr: SHORTCUT_ATHKAR.evening, desc:'Runs daily after Asr · sends evening athkar' },
            { time:'Sleep',   emoji:'🌙', timeVal:'21:30', thikr: SHORTCUT_ATHKAR.sleep,   desc:'Runs nightly after Isha · sends sleep athkar' },
          ].map(({ time, emoji, timeVal, thikr, desc }) => (
            <div key={time} style={{ background:card, borderRadius:16, padding:18, marginBottom:14, border:`1px solid ${border}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                <span style={{ fontSize:20 }}>{emoji}</span>
                <div>
                  <div style={{ color:text, fontSize:14, fontWeight:700 }}>{time} Thikr Automation</div>
                  <div style={{ color:dim, fontSize:11 }}>{desc}</div>
                </div>
              </div>
              <Step n="1">Open <Tag>Shortcuts</Tag> app → <Tag>Automation</Tag> tab → <Tag>+</Tag> → <Tag>Personal Automation</Tag></Step>
              <Step n="2">Choose <Tag>Time of Day</Tag> → set time to <Tag>{timeVal}</Tag> → Daily → Next</Step>
              <Step n="3">Tap <Tag>Add Action</Tag> → search <Tag>Show Notification</Tag></Step>
              <Step n="4">
                Title: <Tag>QAWI — {time} Thikr</Tag><br/>
                <span style={{ display:'block', marginTop:4 }}>Body: paste this thikr:</span>
                <div style={{ background:'rgba(0,0,0,0.4)', borderRadius:8, padding:'10px 12px', marginTop:6, fontSize:11, color:text, lineHeight:1.6, direction:'rtl', textAlign:'right' }}>
                  {thikr.split(' — ')[0]}
                </div>
              </Step>
              <Step n="5">Tap <Tag>Next</Tag> → turn off <Tag>Ask Before Running</Tag> → <Tag>Done</Tag></Step>
            </div>
          ))}

          <div style={{ background:'rgba(201,168,76,0.07)', borderRadius:12, padding:14, border:`1px solid ${border}` }}>
            <div style={{ color:gold, fontSize:12, fontWeight:700, marginBottom:6 }}>Pro tip</div>
            <div style={{ color:dim, fontSize:12, lineHeight:1.6 }}>
              After saving each automation, iOS will ask "Allow" once. After that it runs silently every day at the set time — no interaction needed.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

window.WidgetsScreen = WidgetsScreen;
