// qawi-athkar.jsx — Morning / Evening / Sleep remembrance from Hisn al-Muslim
//
// Curated essential athkar. Structure:
//   { ar: Arabic, en: translation, count: times to recite, source: hadith ref }

const ATHKAR_MORNING = [
  {
    ar: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ. اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ، لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ، مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ، وَلَا يَئُودُهُ حِفْظُهُمَا، وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    en: "Ayat al-Kursi — Whoever recites this in the morning is protected from jinn until evening.",
    count: 1,
    source: "Al-Hakim · Sahih",
    label: "AYAT AL-KURSI",
  },
  {
    ar: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
    en: "Surah Al-Ikhlas · \"Say: He is Allah, the One...\"",
    count: 3,
    source: "Abu Dawud · Tirmidhi",
    label: "AL-IKHLAS",
  },
  {
    ar: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ ۝ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    en: "Surah Al-Falaq · Protection from evil",
    count: 3,
    source: "Abu Dawud · Tirmidhi",
    label: "AL-FALAQ",
  },
  {
    ar: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَهِ النَّاسِ ۝ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ",
    en: "Surah An-Nas · Protection from whispers",
    count: 3,
    source: "Abu Dawud · Tirmidhi",
    label: "AN-NAS",
  },
  {
    ar: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ",
    en: "We have entered the morning, and sovereignty belongs to Allah. I ask You for the good of this day and seek refuge from its evil.",
    count: 1,
    source: "Muslim · 2723",
    label: "MORNING DECLARATION",
  },
  {
    ar: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
    en: "O Allah, by You we enter the morning and the evening, by You we live and die, and to You is the resurrection.",
    count: 1,
    source: "Tirmidhi · 3391",
    label: "BY YOU WE LIVE",
  },
  {
    ar: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي، فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    en: "Sayyid al-Istighfar — The master of seeking forgiveness. Whoever says this in certainty and dies that day enters Paradise.",
    count: 1,
    source: "Bukhari · 6306",
    label: "SAYYID AL-ISTIGHFAR",
  },
  {
    ar: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ",
    en: "O Allah, I call on You, the bearers of Your throne, Your angels, and all creation to witness that You are Allah, there is no god but You.",
    count: 4,
    source: "Abu Dawud · 5069",
    label: "WITNESS OF FAITH",
  },
  {
    ar: "اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ، فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ",
    en: "O Allah, whatever blessing reached me or anyone of Your creation this morning is from You alone; to You is all praise and thanks.",
    count: 1,
    source: "Abu Dawud · 5073",
    label: "GRATITUDE FOR BLESSINGS",
  },
  {
    ar: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ، وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    en: "Allah is sufficient for me; there is no god but Him. Upon Him I rely — He is Lord of the mighty throne.",
    count: 7,
    source: "Abu Dawud · 5081",
    label: "HASBIYALLAH",
  },
  {
    ar: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ، وَهُوَ السَّمِيعُ الْعَلِيمُ",
    en: "In the name of Allah, with whose name nothing in the earth or sky can cause harm. He is All-Hearing, All-Knowing.",
    count: 3,
    source: "Abu Dawud · 5088",
    label: "PROTECTION BY HIS NAME",
  },
  {
    ar: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا",
    en: "I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad ﷺ as my Prophet.",
    count: 3,
    source: "Abu Dawud · 5072",
    label: "CONTENTMENT",
  },
  {
    ar: "يَا حَيُّ يَا قَيُّومُ، بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
    en: "O Ever-Living, O Self-Subsisting — by Your mercy I seek help. Set right all my affairs and do not leave me to myself for the blink of an eye.",
    count: 1,
    source: "An-Nasa'i · Sahih",
    label: "O EVER-LIVING",
  },
  {
    ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    en: "Glory to Allah, and praise is His.",
    count: 100,
    source: "Muslim · 2692",
    label: "TASBEEH",
  },
  {
    ar: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    en: "There is no god but Allah, alone with no partner. To Him is dominion, to Him is praise, and He is over all things capable.",
    count: 10,
    source: "Muslim · 2693",
    label: "TAHLIL",
  },
  {
    ar: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
    en: "I seek Allah's forgiveness and turn to Him in repentance.",
    count: 100,
    source: "Bukhari · 6307",
    label: "ISTIGHFAR",
  },
  {
    ar: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
    en: "O Allah, send prayers and peace upon our Prophet Muhammad ﷺ.",
    count: 10,
    source: "At-Tabarani",
    label: "SALAWAT",
  },
];

// Evening is mostly the same structure, with "أصبحنا" → "أمسينا"
const ATHKAR_EVENING = [
  { ...ATHKAR_MORNING[0] },  // Ayat al-Kursi
  { ...ATHKAR_MORNING[1] },  // Ikhlas
  { ...ATHKAR_MORNING[2] },  // Falaq
  { ...ATHKAR_MORNING[3] },  // Nas
  {
    ar: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا",
    en: "We have entered the evening and sovereignty belongs to Allah. I ask You for the good of this night and seek refuge from its evil.",
    count: 1,
    source: "Muslim · 2723",
    label: "EVENING DECLARATION",
  },
  {
    ar: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ",
    en: "O Allah, by You we enter the evening and the morning, by You we live and die, and to You is the return.",
    count: 1,
    source: "Tirmidhi · 3391",
    label: "BY YOU WE LIVE",
  },
  { ...ATHKAR_MORNING[6] },  // Sayyid al-Istighfar
  {
    ar: "اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ",
    en: "O Allah, I call on You, the bearers of Your throne, Your angels, and all creation to witness that You are Allah.",
    count: 4,
    source: "Abu Dawud · 5069",
    label: "WITNESS OF FAITH",
  },
  {
    ar: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    en: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
    count: 3,
    source: "Muslim · 2708",
    label: "PERFECT WORDS",
  },
  { ...ATHKAR_MORNING[10] }, // Hasbiyallah
  { ...ATHKAR_MORNING[11] }, // Bismillah protection
  { ...ATHKAR_MORNING[12] }, // Contentment
  { ...ATHKAR_MORNING[14] }, // Tasbeeh
  { ...ATHKAR_MORNING[15] }, // Tahlil
  { ...ATHKAR_MORNING[16] }, // Istighfar
  { ...ATHKAR_MORNING[17] }, // Salawat
];

const ATHKAR_SLEEP = [
  {
    ar: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، إِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ",
    en: "In Your name, my Lord, I lay down my side, and in Your name I rise. If You take my soul, have mercy on it; if You return it, protect it as You protect Your righteous servants.",
    count: 1,
    source: "Bukhari · 6320",
    label: "LAYING DOWN",
  },
  {
    ar: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
    en: "O Allah, protect me from Your punishment on the Day You resurrect Your servants.",
    count: 3,
    source: "Abu Dawud · 5045",
    label: "PROTECTION FROM PUNISHMENT",
  },
  { ...ATHKAR_MORNING[0], count: 1 }, // Ayat al-Kursi
  { ...ATHKAR_MORNING[1], count: 1 }, // Ikhlas
  { ...ATHKAR_MORNING[2], count: 1 }, // Falaq
  { ...ATHKAR_MORNING[3], count: 1 }, // Nas
  {
    ar: "سُبْحَانَ اللَّهِ (٣٣) الْحَمْدُ لِلَّهِ (٣٣) اللَّهُ أَكْبَرُ (٣٤)",
    en: "SubhanAllah 33× · Alhamdulillah 33× · Allahu Akbar 34× — better than a servant, said the Prophet ﷺ to Fatima.",
    count: 1,
    source: "Bukhari · 5362",
    label: "FATIMA'S TASBEEH",
  },
  {
    ar: "اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ. آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ",
    en: "O Allah, I submit myself to You, entrust my affair to You, turn my face to You, and lay my back on You — in hope and fear of You. There is no refuge from You except to You.",
    count: 1,
    source: "Bukhari · 6311",
    label: "SUBMISSION",
  },
  { ...ATHKAR_MORNING[16], count: 1 }, // Istighfar (shorter)
];

// ─── Screen ───────────────────────────────────────────────────────────────

function AthkarScreen({ t, onBack, profile, prayers }) {
  const now = new Date();
  const hr = now.getHours();
  const [session, setSession] = React.useState(() => {
    // Smart default based on time of day
    if (hr >= 4 && hr < 12) return 'morning';
    if (hr >= 12 && hr < 19) return 'evening';
    return 'sleep';
  });

  const data = session === 'morning' ? ATHKAR_MORNING
             : session === 'evening' ? ATHKAR_EVENING
             : ATHKAR_SLEEP;

  // Progress state — per session, persisted per day
  const dateKey = now.toISOString().split('T')[0];
  const storageKey = `qawi-athkar-${dateKey}-${session}`;

  const [counts, setCounts] = React.useState(() => {
    const saved = localStorage.getItem(storageKey);
    try { return saved ? JSON.parse(saved) : {}; } catch { return {}; }
  });
  const [current, setCurrent] = React.useState(() => {
    // Resume on first unfinished
    const saved = localStorage.getItem(storageKey);
    try {
      const c = saved ? JSON.parse(saved) : {};
      const idx = data.findIndex((d, i) => (c[i] || 0) < d.count);
      return idx === -1 ? 0 : idx;
    } catch { return 0; }
  });
  const [completed, setCompleted] = React.useState(false);

  React.useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(counts));
  }, [counts, storageKey]);

  // Reset current when session changes
  React.useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    try {
      const c = saved ? JSON.parse(saved) : {};
      setCounts(c);
      const idx = data.findIndex((d, i) => (c[i] || 0) < d.count);
      setCurrent(idx === -1 ? 0 : idx);
      setCompleted(idx === -1 && Object.keys(c).length > 0);
    } catch {}
  }, [session]);

  const dhikr = data[current];
  const curCount = counts[current] || 0;
  const done = curCount >= dhikr.count;
  const totalDone = data.reduce((s, _, i) => s + Math.min(counts[i] || 0, data[i].count), 0);
  const totalTarget = data.reduce((s, d) => s + d.count, 0);
  const sessionPct = Math.round((totalDone / totalTarget) * 100);
  const allComplete = data.every((d, i) => (counts[i] || 0) >= d.count);

  const tap = () => {
    if (done) {
      // Auto-advance
      const next = data.findIndex((d, i) => (counts[i] || 0) < d.count && i > current);
      if (next !== -1) setCurrent(next);
      else if (data.every((d, i) => (counts[i] || 0) >= d.count)) {
        setCompleted(true);
        // Update streak
        const streakKey = 'qawi-athkar-streak';
        const lastKey = 'qawi-athkar-last';
        const lastDay = localStorage.getItem(lastKey);
        const streak = parseInt(localStorage.getItem(streakKey) || '0', 10);
        if (lastDay !== dateKey) {
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          const y = yesterday.toISOString().split('T')[0];
          const newStreak = lastDay === y ? streak + 1 : 1;
          localStorage.setItem(streakKey, String(newStreak));
          localStorage.setItem(lastKey, dateKey);
        }
      }
      return;
    }
    setCounts({ ...counts, [current]: curCount + 1 });
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const undo = () => {
    if (curCount > 0) setCounts({ ...counts, [current]: curCount - 1 });
  };

  const reset = () => {
    if (window.confirm('Reset this session?')) {
      setCounts({});
      setCurrent(0);
      setCompleted(false);
    }
  };

  const streak = parseInt(localStorage.getItem('qawi-athkar-streak') || '0', 10);

  return (
    <div style={{ minHeight: '100%', background: t.bg, color: t.text, paddingBottom: 40 }}>
      <Topbar t={t} onBack={onBack} title="ATHKAR" titleAr="الأذكار" />

      {/* Session tabs */}
      <div style={{ padding: '12px 14px 0', display: 'flex', gap: 6 }}>
        {[
          ['morning', 'MORNING', 'الصباح', '☀'],
          ['evening', 'EVENING', 'المساء', '◐'],
          ['sleep',   'SLEEP',   'النوم',   '☾'],
        ].map(([id, lbl, ar, icon]) => (
          <button key={id} onClick={() => setSession(id)} style={{
            flex: 1, padding: '10px 4px',
            background: session === id ? t.accentGlow : t.bg2,
            border: `1px solid ${session === id ? t.accent : t.border}`,
            borderRadius: 8,
            color: session === id ? t.accent : t.text3,
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: 12, fontWeight: 800, letterSpacing: 2,
            cursor: 'pointer',
          }}>
            <div style={{ fontSize: 14, marginBottom: 2 }}>{icon}</div>
            <div>{lbl}</div>
            <div style={{
              fontFamily: 'Amiri, Georgia, serif', fontSize: 10,
              fontWeight: 400, letterSpacing: 0, marginTop: 2,
              color: session === id ? t.accentDim : t.text3,
            }}>{ar}</div>
          </button>
        ))}
      </div>

      {completed && allComplete ? (
        <CompletionScreen t={t} session={session} streak={streak} onReset={reset} onContinue={() => {
          // cycle to next session
          if (session === 'morning') setSession('evening');
          else if (session === 'evening') setSession('sleep');
          else setCompleted(false);
        }} />
      ) : (
        <>
          {/* Session progress arc */}
          <div style={{ padding: '14px 14px 6px' }}>
            <div style={{
              background: t.bg2, border: `1px solid ${t.border}`,
              borderRadius: 12, padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              {/* Circular progress */}
              <div style={{ position: 'relative', width: 52, height: 52, flexShrink: 0 }}>
                <svg width="52" height="52" viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="22"
                    stroke={t.border} strokeWidth="3" fill="none" />
                  <circle cx="26" cy="26" r="22"
                    stroke={t.accent} strokeWidth="3" fill="none"
                    strokeDasharray={`${2 * Math.PI * 22}`}
                    strokeDashoffset={`${2 * Math.PI * 22 * (1 - sessionPct / 100)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 26 26)"
                    style={{ transition: 'stroke-dashoffset .4s' }}/>
                </svg>
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'grid', placeItems: 'center',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 14, fontWeight: 800, color: t.accent,
                }}>{sessionPct}%</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 14, fontWeight: 800, letterSpacing: 2, color: t.text,
                }}>{current + 1} / {data.length} <span style={{color: t.text3, fontWeight: 500}}>· DHIKR</span></div>
                <div style={{
                  fontFamily: 'DM Mono, monospace', fontSize: 9,
                  letterSpacing: '0.2em', color: t.text3, marginTop: 3,
                }}>{totalDone} / {totalTarget} RECITATIONS</div>
              </div>
              {streak > 0 && (
                <div style={{
                  padding: '6px 10px',
                  background: t.accentGlow, border: `1px solid ${t.accent}`,
                  borderRadius: 6, textAlign: 'center',
                }}>
                  <div style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: 18, fontWeight: 900, color: t.accent, lineHeight: 1,
                  }}>{streak}</div>
                  <div style={{
                    fontFamily: 'DM Mono, monospace', fontSize: 7,
                    letterSpacing: '0.18em', color: t.accent, marginTop: 1,
                  }}>DAY STREAK</div>
                </div>
              )}
            </div>
          </div>

          {/* Dhikr card */}
          <div style={{ padding: '8px 14px 14px' }}>
            <div style={{
              background: `linear-gradient(180deg, ${t.bg2} 0%, ${t.bg3} 100%)`,
              border: `1px solid ${t.accentDim}`,
              borderRadius: 14,
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Header */}
              <div style={{
                padding: '10px 14px',
                borderBottom: `1px solid ${t.border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div style={{
                  fontFamily: 'DM Mono, monospace', fontSize: 9,
                  letterSpacing: '0.22em', color: t.text3,
                }}>{String(current + 1).padStart(2, '0')} / {String(data.length).padStart(2, '0')}</div>
                {dhikr.label && (
                  <div style={{
                    fontFamily: 'Barlow Condensed, sans-serif', fontSize: 10,
                    fontWeight: 700, letterSpacing: 2, color: t.accent,
                  }}>◆ {dhikr.label}</div>
                )}
              </div>

              {/* Arabic text */}
              <div style={{ padding: '22px 18px 16px', position: 'relative' }}>
                {/* Faded bismillah glyph */}
                <div style={{
                  position: 'absolute', top: -30, right: -20,
                  fontFamily: 'Amiri, Georgia, serif', fontSize: 120,
                  color: t.accent, opacity: 0.04,
                  direction: 'rtl', lineHeight: 0.8, pointerEvents: 'none',
                }}>ذكر</div>

                <div style={{
                  position: 'relative', zIndex: 1,
                  fontFamily: 'Amiri, Georgia, serif', fontSize: 20,
                  color: t.accent, direction: 'rtl', lineHeight: 2.2,
                  fontWeight: 700, textAlign: 'right', marginBottom: 14,
                }}>{dhikr.ar}</div>

                {/* Decorative divider */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  marginBottom: 12,
                }}>
                  <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${t.border2})` }} />
                  <div style={{ color: t.accentDim, fontSize: 9 }}>◇</div>
                  <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${t.border2}, transparent)` }} />
                </div>

                {/* Translation */}
                <div style={{
                  fontFamily: 'DM Sans, sans-serif', fontSize: 12,
                  color: t.text2, lineHeight: 1.55, fontStyle: 'italic',
                  marginBottom: 10,
                }}>"{dhikr.en}"</div>

                {/* Source */}
                <div style={{
                  fontFamily: 'DM Mono, monospace', fontSize: 8,
                  letterSpacing: '0.22em', color: t.text3,
                }}>— {dhikr.source}</div>
              </div>

              {/* Tap-to-count region */}
              <div onClick={tap} style={{
                padding: '18px 18px 20px',
                borderTop: `1px solid ${t.border}`,
                background: done ? t.accentGlow : t.bg3,
                cursor: 'pointer',
                transition: 'background .2s',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
                }}>
                  {/* Circular counter */}
                  <div style={{ position: 'relative', width: 86, height: 86 }}>
                    <svg width="86" height="86" viewBox="0 0 86 86">
                      <circle cx="43" cy="43" r="38"
                        stroke={t.border2} strokeWidth="4" fill="none" />
                      <circle cx="43" cy="43" r="38"
                        stroke={done ? t.accent : t.accent2} strokeWidth="4" fill="none"
                        strokeDasharray={`${2 * Math.PI * 38}`}
                        strokeDashoffset={`${2 * Math.PI * 38 * (1 - Math.min(curCount / dhikr.count, 1))}`}
                        strokeLinecap="round"
                        transform="rotate(-90 43 43)"
                        style={{ transition: 'stroke-dashoffset .25s' }}/>
                    </svg>
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{
                        fontFamily: 'Barlow Condensed, sans-serif',
                        fontSize: 32, fontWeight: 800, color: done ? t.accent : t.text,
                        lineHeight: 1,
                      }}>{curCount}</div>
                      <div style={{
                        fontFamily: 'DM Mono, monospace', fontSize: 9,
                        letterSpacing: '0.18em', color: t.text3, marginTop: 2,
                      }}>/ {dhikr.count}</div>
                    </div>
                  </div>
                  <div>
                    <div style={{
                      fontFamily: 'Barlow Condensed, sans-serif',
                      fontSize: 16, fontWeight: 800, letterSpacing: 2,
                      color: done ? t.accent : t.text,
                    }}>{done ? '✓ COMPLETE' : 'TAP TO COUNT'}</div>
                    <div style={{
                      fontFamily: 'DM Mono, monospace', fontSize: 9,
                      letterSpacing: '0.15em', color: t.text3, marginTop: 3,
                    }}>{done ? 'TAP AGAIN FOR NEXT' : `${dhikr.count - curCount} REMAINING`}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nav buttons */}
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button onClick={() => setCurrent(Math.max(0, current - 1))}
                disabled={current === 0}
                style={{
                  flex: 1, padding: 11,
                  background: t.bg2, border: `1px solid ${t.border}`,
                  borderRadius: 8, color: current === 0 ? t.text3 : t.text2,
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 12, fontWeight: 700, letterSpacing: 2,
                  cursor: current === 0 ? 'not-allowed' : 'pointer',
                  opacity: current === 0 ? 0.5 : 1,
                }}>← PREV</button>
              <button onClick={undo} disabled={curCount === 0} style={{
                padding: '11px 14px',
                background: t.bg2, border: `1px solid ${t.border}`,
                borderRadius: 8,
                color: curCount === 0 ? t.text3 : t.accent2,
                fontFamily: 'DM Mono, monospace', fontSize: 11,
                letterSpacing: '0.15em',
                cursor: curCount === 0 ? 'not-allowed' : 'pointer',
                opacity: curCount === 0 ? 0.5 : 1,
              }}>⟲</button>
              <button onClick={() => setCurrent(Math.min(data.length - 1, current + 1))}
                disabled={current === data.length - 1}
                style={{
                  flex: 1, padding: 11,
                  background: t.bg2, border: `1px solid ${t.border}`,
                  borderRadius: 8, color: current === data.length - 1 ? t.text3 : t.text2,
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 12, fontWeight: 700, letterSpacing: 2,
                  cursor: current === data.length - 1 ? 'not-allowed' : 'pointer',
                  opacity: current === data.length - 1 ? 0.5 : 1,
                }}>NEXT →</button>
            </div>

            {/* Dot nav */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center',
              marginTop: 14, padding: '0 10px',
            }}>
              {data.map((d, i) => {
                const c = counts[i] || 0;
                const dDone = c >= d.count;
                const dActive = i === current;
                return (
                  <button key={i} onClick={() => setCurrent(i)} style={{
                    width: dActive ? 20 : 8, height: 8, borderRadius: 4,
                    background: dDone ? t.accent : (dActive ? t.accent2 : t.border2),
                    border: 'none', cursor: 'pointer',
                    transition: 'all .2s',
                  }} title={d.label} />
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CompletionScreen({ t, session, streak, onReset, onContinue }) {
  const sessionName = session === 'morning' ? 'MORNING' : session === 'evening' ? 'EVENING' : 'SLEEP';
  const sessionAr = session === 'morning' ? 'الصباح' : session === 'evening' ? 'المساء' : 'النوم';
  const nextSession = session === 'morning' ? 'evening' : session === 'evening' ? 'sleep' : null;

  return (
    <div style={{ padding: '40px 24px', textAlign: 'center' }}>
      {/* Big ornamental frame */}
      <div style={{
        position: 'relative', padding: '40px 20px',
        background: `linear-gradient(180deg, ${t.bg2} 0%, ${t.bg} 100%)`,
        border: `1px solid ${t.accent}`, borderRadius: 14,
        overflow: 'hidden',
      }}>
        {/* Faded calligraphy */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'grid', placeItems: 'center', pointerEvents: 'none',
          fontFamily: 'Amiri, Georgia, serif', fontSize: 220,
          color: t.accent, opacity: 0.04,
          direction: 'rtl', lineHeight: 0.9,
        }}>تقبل</div>

        {/* Corner ornaments */}
        {['top-left','top-right','bottom-left','bottom-right'].map(pos => {
          const [v, h] = pos.split('-');
          return (
            <div key={pos} style={{
              position: 'absolute', [v]: 8, [h]: 8,
              color: t.accent, fontSize: 14, opacity: 0.5,
            }}>◆</div>
          );
        })}

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontFamily: 'DM Mono, monospace', fontSize: 9,
            letterSpacing: '0.35em', color: t.accent, marginBottom: 14,
          }}>◇ SESSION COMPLETE ◇</div>

          <div style={{
            fontFamily: 'Amiri, Georgia, serif', fontSize: 48,
            color: t.accent, direction: 'rtl', lineHeight: 1,
            fontWeight: 700, marginBottom: 8,
          }}>تقبل الله</div>

          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif', fontSize: 14,
            fontWeight: 500, color: t.text2, letterSpacing: 2,
            fontStyle: 'italic', marginBottom: 24,
          }}>May Allah accept it</div>

          <div style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: 13,
            color: t.text2, lineHeight: 1.6, maxWidth: 280, margin: '0 auto 20px',
          }}>
            You completed <span style={{color: t.accent, fontWeight: 600}}>{sessionName} athkar</span> <span style={{fontFamily:'Amiri,Georgia,serif'}}>· {sessionAr}</span>. Your fortress of remembrance is built.
          </div>

          {streak > 0 && (
            <div style={{
              display: 'inline-block',
              padding: '10px 20px',
              background: t.accentGlow, border: `1px solid ${t.accent}`,
              borderRadius: 30,
              fontFamily: 'Barlow Condensed, sans-serif', fontSize: 13,
              fontWeight: 700, letterSpacing: 2, color: t.accent,
              marginBottom: 24,
            }}>◆ {streak} DAY STREAK</div>
          )}

          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            {nextSession && (
              <button onClick={onContinue} style={{
                padding: '12px 20px',
                background: t.accent, border: 'none',
                borderRadius: 8, color: '#000',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 12, fontWeight: 800, letterSpacing: 2,
                cursor: 'pointer',
              }}>→ {nextSession.toUpperCase()} ATHKAR</button>
            )}
            <button onClick={onReset} style={{
              padding: '12px 20px',
              background: 'transparent', border: `1px solid ${t.border2}`,
              borderRadius: 8, color: t.text3,
              fontFamily: 'DM Mono, monospace',
              fontSize: 10, letterSpacing: '0.2em',
              cursor: 'pointer',
            }}>RESET</button>
          </div>
        </div>
      </div>

      {/* Hadith reminder */}
      <div style={{
        marginTop: 20, padding: '18px 16px',
        background: t.bg2, border: `1px solid ${t.border}`,
        borderRadius: 12,
      }}>
        <div style={{
          fontFamily: 'DM Mono, monospace', fontSize: 9,
          letterSpacing: '0.22em', color: t.accent2, marginBottom: 10,
          textAlign: 'center',
        }}>— THE PROPHET ﷺ SAID —</div>
        <div style={{
          fontFamily: 'Amiri, Georgia, serif', fontSize: 14,
          color: t.accent, direction: 'rtl', lineHeight: 1.9,
          fontWeight: 700, textAlign: 'center', marginBottom: 10,
        }}>مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لَا يَذْكُرُ رَبَّهُ مَثَلُ الْحَيِّ وَالْمَيِّتِ</div>
        <div style={{
          fontFamily: 'DM Sans, sans-serif', fontSize: 12,
          color: t.text2, lineHeight: 1.55, fontStyle: 'italic', textAlign: 'center',
        }}>"The one who remembers his Lord and the one who does not, are like the living and the dead."</div>
        <div style={{
          fontFamily: 'DM Mono, monospace', fontSize: 8,
          letterSpacing: '0.2em', color: t.text3, marginTop: 8, textAlign: 'center',
        }}>— BUKHARI · 6407</div>
      </div>
    </div>
  );
}

window.AthkarScreen = AthkarScreen;
