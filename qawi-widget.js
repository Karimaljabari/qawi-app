// ─────────────────────────────────────────────
//  QAWI — Scriptable Widget
//  Home screen: small (prayer only) or medium (prayer + thikr)
//  Lock screen: circular or rectangular
// ─────────────────────────────────────────────

const GOLD      = new Color("#C9A84C");
const GOLD_SOFT = new Color("#C9A84C", 0.65);
const GOLD_LINE = new Color("#C9A84C", 0.18);
const BG        = new Color("#09090f");
const WHITE     = Color.white();
const WHITE_DIM = new Color("#ffffff", 0.52);

const PRAYER_NAMES = ['Fajr','Sunrise','Dhuhr','Asr','Maghrib','Isha'];
const PRAYER_AR    = { Fajr:'الفجر', Sunrise:'الشروق', Dhuhr:'الظهر', Asr:'العصر', Maghrib:'المغرب', Isha:'العشاء' };

const ATHKAR = {
  morning: [
    { ar: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ', en: 'We enter the morning and the kingdom belongs to Allah — all praise is His.' },
    { ar: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ', en: 'O Allah, by You we enter morning and evening, by You we live and die, and to You is the resurrection.' },
    { ar: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ', en: 'O Allah, You are my Lord. None has the right to be worshipped but You. You created me and I am Your servant.' },
    { ar: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي', en: 'O Allah, grant me health in my body, my hearing, and my sight.' },
    { ar: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ — مِئَةَ مَرَّةٍ', en: 'Glory be to Allah and His is the praise — one hundred times.' },
  ],
  evening: [
    { ar: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ', en: 'We enter the evening and the kingdom belongs to Allah — all praise is His.' },
    { ar: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ', en: 'O Allah, by You we enter evening and morning, by You we live and die, and to You is the return.' },
    { ar: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', en: 'I seek refuge in the perfect words of Allah from the evil of what He has created.' },
    { ar: 'اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ', en: 'O Allah, whatever blessing I have this evening is from You alone. All praise and gratitude is Yours.' },
    { ar: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ', en: 'Allah is sufficient for me. There is no god but He. Upon Him I rely — He is the Lord of the great Throne.' },
  ],
  sleep: [
    { ar: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', en: 'In Your name, O Allah, I die and I live.' },
    { ar: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ', en: 'O Allah, protect me from Your punishment on the Day You resurrect Your servants.' },
    { ar: 'اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ وَفَوَّضْتُ أَمْرِي إِلَيْكَ وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ', en: 'O Allah, I submit myself to You, entrust my affairs to You, and place my back against You.' },
    { ar: 'سُبْحَانَ اللهِ (٣٣) · الْحَمْدُ لِلَّهِ (٣٣) · اللهُ أَكْبَرُ (٣٤)', en: 'Glory be to Allah ×33 · All praise to Allah ×33 · Allah is the Greatest ×34.' },
    { ar: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ — آيَةُ الْكُرْسِيِّ', en: 'Allah — there is no god but He, the Ever-Living, the Sustainer of existence. (Ayat al-Kursi)' },
  ],
};

// ─── Helpers ──────────────────────────────────

function toMins(timeStr) {
  const [t, period] = timeStr.split(' ');
  let [hh, mm] = t.split(':').map(Number);
  if (period === 'PM' && hh !== 12) hh += 12;
  if (period === 'AM' && hh === 12) hh = 0;
  return hh * 60 + mm;
}

function getNextPrayer(times) {
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  for (const name of PRAYER_NAMES) {
    if (!times[name]) continue;
    const m = toMins(times[name]);
    if (m > cur) {
      const diff = m - cur;
      return { name, nameAr: PRAYER_AR[name], time: times[name], diff,
               label: diff < 60 ? `${diff}m` : `${Math.floor(diff/60)}h ${diff % 60}m` };
    }
  }
  const diff = 1440 - now.getHours() * 60 - now.getMinutes() + toMins(times.Fajr);
  return { name: 'Fajr', nameAr: PRAYER_AR.Fajr, time: times.Fajr, diff,
           label: diff < 60 ? `${diff}m` : `${Math.floor(diff/60)}h ${diff % 60}m` };
}

function getTimeOfDay(times) {
  const cur = new Date().getHours() * 60 + new Date().getMinutes();
  const fajr = toMins(times.Fajr), dhuhr = toMins(times.Dhuhr);
  const asr  = toMins(times.Asr),  maghrib = toMins(times.Maghrib);
  const isha  = toMins(times.Isha);
  if (cur >= fajr && cur < dhuhr)    return 'morning';
  if (cur >= asr  && cur < maghrib)  return 'evening';
  if (cur >= isha || cur < fajr)     return 'sleep';
  return 'morning';
}

function getDailyThikr(list) {
  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return list[day % list.length];
}

async function fetchTimes() {
  const key = 'qawi_prayer_' + new Date().toDateString();
  try { const c = Keychain.get(key); if (c) return JSON.parse(c); } catch(e) {}
  Location.setAccuracyToKilometer();
  let loc;
  try { loc = await Location.current(); } catch(e) { return null; }
  const req = new Request(`https://api.aladhan.com/v1/timings?latitude=${loc.latitude}&longitude=${loc.longitude}&method=2`);
  req.timeoutInterval = 10;
  try {
    const res = await req.loadJSON();
    if (res.code === 200) {
      Keychain.set(key, JSON.stringify(res.data.timings));
      return res.data.timings;
    }
  } catch(e) {}
  return null;
}

// ─── Widget builders ──────────────────────────

function buildError(widget) {
  const t = widget.addText('◐  QAWI');
  t.textColor = GOLD; t.font = Font.boldSystemFont(13);
  widget.addSpacer(6);
  const e = widget.addText('Open QAWI app once\nto allow location access');
  e.textColor = WHITE_DIM; e.font = Font.systemFont(11);
}

function buildLockCircular(widget, next) {
  widget.backgroundColor = new Color('#000000', 0);
  const s = widget.addStack(); s.layoutVertically(); s.centerAlignContent();
  const ic = s.addText('◐'); ic.textColor = GOLD; ic.font = Font.boldSystemFont(18); ic.centerAlignText();
  const nm = s.addText(next.nameAr); nm.textColor = WHITE; nm.font = Font.boldSystemFont(10); nm.centerAlignText();
  const lb = s.addText(next.label); lb.textColor = WHITE_DIM; lb.font = Font.systemFont(9); lb.centerAlignText();
}

function buildLockRect(widget, next) {
  widget.backgroundColor = new Color('#000000', 0);
  const s = widget.addStack(); s.layoutHorizontally(); s.centerAlignContent();
  const ic = s.addText('◐ '); ic.textColor = GOLD; ic.font = Font.boldSystemFont(13);
  const tx = s.addText(`${next.nameAr}  ·  in ${next.label}`);
  tx.textColor = WHITE; tx.font = Font.boldSystemFont(13);
}

function buildSmall(widget, next) {
  widget.setPadding(14, 14, 14, 14);
  const hd = widget.addText('◐  QAWI');
  hd.textColor = GOLD; hd.font = Font.boldSystemFont(11);
  widget.addSpacer();
  const ar = widget.addText(next.nameAr);
  ar.textColor = WHITE; ar.font = Font.boldSystemFont(24);
  const en = widget.addText(next.name);
  en.textColor = WHITE_DIM; en.font = Font.systemFont(11);
  widget.addSpacer(4);
  const tm = widget.addText(next.time);
  tm.textColor = GOLD; tm.font = Font.boldSystemFont(16);
  const lb = widget.addText('in ' + next.label);
  lb.textColor = WHITE_DIM; lb.font = Font.systemFont(11);
}

function buildMedium(widget, next, timeOfDay, thikr) {
  widget.setPadding(14, 16, 14, 16);

  // Header
  const header = widget.addStack(); header.layoutHorizontally(); header.centerAlignContent();
  const logo = header.addText('◐  QAWI'); logo.textColor = GOLD; logo.font = Font.boldSystemFont(12);
  header.addSpacer();
  const now = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  const clk = header.addText(now); clk.textColor = WHITE_DIM; clk.font = Font.systemFont(11);

  widget.addSpacer(8);

  // Prayer
  const pLabel = widget.addText('NEXT PRAYER');
  pLabel.textColor = GOLD_SOFT; pLabel.font = Font.boldSystemFont(8);

  const pRow = widget.addStack(); pRow.layoutHorizontally(); pRow.centerAlignContent();
  const pAr = pRow.addText(next.nameAr + '  ');
  pAr.textColor = WHITE; pAr.font = Font.boldSystemFont(22);
  const pEn = pRow.addText(next.name);
  pEn.textColor = WHITE_DIM; pEn.font = Font.systemFont(13);

  const pTime = widget.addText(`${next.time}  ·  in ${next.label}`);
  pTime.textColor = GOLD; pTime.font = Font.boldSystemFont(13);

  widget.addSpacer(10);

  // Divider
  const div = widget.addStack();
  div.backgroundColor = GOLD_LINE; div.size = new Size(-1, 1);

  widget.addSpacer(8);

  // Thikr
  const tLabel = {morning:'MORNING THIKR · الصباح', evening:'EVENING THIKR · المساء', sleep:'SLEEP THIKR · النوم'}[timeOfDay];
  const tl = widget.addText(tLabel); tl.textColor = GOLD_SOFT; tl.font = Font.boldSystemFont(7);
  widget.addSpacer(3);

  const tAr = widget.addText(thikr.ar);
  tAr.textColor = WHITE; tAr.font = Font.systemFont(11); tAr.lineLimit = 2; tAr.minimumScaleFactor = 0.75;

  const tEn = widget.addText(thikr.en);
  tEn.textColor = WHITE_DIM; tEn.font = Font.italicSystemFont(9); tEn.lineLimit = 2; tEn.minimumScaleFactor = 0.75;
}

// ─── Main ─────────────────────────────────────

async function run() {
  const times = await fetchTimes();
  const widget = new ListWidget();
  widget.backgroundColor = BG;
  widget.url = 'https://karimaljabari.github.io/qawi-app/';
  widget.refreshAfterDate = new Date(Date.now() + 10 * 60 * 1000);

  if (!times) {
    buildError(widget);
  } else {
    const next = getNextPrayer(times);
    const tod  = getTimeOfDay(times);
    const thikr = getDailyThikr(ATHKAR[tod]);
    const fam = config.widgetFamily;

    if      (fam === 'accessoryCircular')    buildLockCircular(widget, next);
    else if (fam === 'accessoryRectangular') buildLockRect(widget, next);
    else if (fam === 'small')                buildSmall(widget, next);
    else                                     buildMedium(widget, next, tod, thikr);
  }

  Script.setWidget(widget);
  if (config.runsInApp) await widget.presentMedium();
  Script.complete();
}

run();
