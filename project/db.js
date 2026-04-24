const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const DB_PATH = path.join(__dirname, 'db.json');
const BACKUP_PATH = path.join(__dirname, 'db.backup.json');

function loadDB() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf8');
      const d = JSON.parse(raw);
      if (!d.users) d.users = {};
      if (!d.monthData) d.monthData = {};
      if (!d.gymTicks) d.gymTicks = {};
      if (!d.photos) d.photos = {};
      if (!d.squads) d.squads = {};
      if (!d.notebook) d.notebook = {};
      return d;
    }
  } catch(e) { 
    console.error('DB load error:', e);
    // Try backup
    if (fs.existsSync(BACKUP_PATH)) {
      try {
        console.log('Loading from backup...');
        return JSON.parse(fs.readFileSync(BACKUP_PATH, 'utf8'));
      } catch(e2) {}
    }
  }
  return { users:{}, monthData:{}, gymTicks:{}, photos:{}, squads:{}, notebook:{}, adminQuote:null };
}

function saveDB(db) {
  try {
    // Always backup before saving
    if (fs.existsSync(DB_PATH)) {
      fs.copyFileSync(DB_PATH, BACKUP_PATH);
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  } catch(e) { console.error('DB save error:', e); }
}

function hashPw(pw) {
  return crypto.createHash('sha256').update(pw + 'qawi_salt_v3_2026').digest('hex');
}

const COLORS = ['#C9A84C','#4CAF7D','#5B8DD9','#E85555','#9B6DCA','#E88C30','#4DB8B8','#D45B8A','#7CB87C','#E8A030'];

function createUser(username, password, email, gender) {
  const db = loadDB();
  const id = username.toLowerCase().trim();
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(id)) return { error: 'Username must be 3-20 chars, letters/numbers/underscores only' };
  if (db.users[id]) return { error: 'Username already taken' };
  if (password.length < 6) return { error: 'Password must be at least 6 characters' };
  const color = COLORS[Object.keys(db.users).length % COLORS.length];
  db.users[id] = {
    id, username: id, displayName: username,
    passwordHash: hashPw(password),
    email: email || '',
    gender: gender || 'male',
    color, initials: username.slice(0,2).toUpperCase(),
    profile: { goal: null, targetWeight: '', gymDaysPerWeek: 4 },
    pushSubscriptions: [],
    theme: 'dark', language: 'en',
    city: 'Dubai', lat: null, lng: null,
    createdAt: Date.now(),
    isAdmin: id === 'karim'
  };
  saveDB(db);
  return { success: true, user: sanitizeUser(db.users[id]) };
}

function sanitizeUser(u) {
  return {
    username: u.username, displayName: u.displayName, color: u.color,
    initials: u.initials, profile: u.profile, email: u.email,
    gender: u.gender || 'male', theme: u.theme || 'dark',
    language: u.language || 'en', city: u.city || 'Dubai',
    lat: u.lat || null, lng: u.lng || null,
    pushSubscriptions: u.pushSubscriptions || [],
    isAdmin: u.isAdmin || false
  };
}

function getUser(username) {
  const db = loadDB();
  return db.users[username.toLowerCase()] || null;
}

function verifyUser(username, password) {
  const user = getUser(username);
  if (!user) return null;
  if (user.passwordHash !== hashPw(password)) return null;
  return user;
}

function updateUser(username, fields) {
  const db = loadDB();
  if (!db.users[username]) return false;
  Object.assign(db.users[username], fields);
  saveDB(db); return true;
}

function updateUserProfile(username, profile) {
  const db = loadDB();
  if (!db.users[username]) return false;
  db.users[username].profile = { ...db.users[username].profile, ...profile };
  saveDB(db); return true;
}

function getAllUsers() {
  const db = loadDB();
  return Object.values(db.users).map(sanitizeUser);
}

function getMonthData(username, year, month) {
  const db = loadDB();
  return db.monthData[`${username}_${year}_${month}`] || { weight:'', note:'', steps:{} };
}

function setMonthData(username, year, month, data) {
  const db = loadDB();
  const key = `${username}_${year}_${month}`;
  db.monthData[key] = { ...db.monthData[key], ...data };
  saveDB(db);
}

function getGymTicks(username, year, month) {
  const db = loadDB();
  return db.gymTicks[`${username}_${year}_${month}`] || {};
}

function setGymTick(username, year, month, dayIndex, value) {
  const db = loadDB();
  const key = `${username}_${year}_${month}`;
  if (!db.gymTicks[key]) db.gymTicks[key] = {};
  if (value) db.gymTicks[key][dayIndex] = true;
  else delete db.gymTicks[key][dayIndex];
  saveDB(db);
  return Object.keys(db.gymTicks[key]).length;
}

function setStepDay(username, year, month, dayIndex, value) {
  const db = loadDB();
  const key = `${username}_${year}_${month}`;
  if (!db.monthData[key]) db.monthData[key] = { weight:'', note:'', steps:{} };
  if (!db.monthData[key].steps) db.monthData[key].steps = {};
  if (value > 0) db.monthData[key].steps[dayIndex] = value;
  else delete db.monthData[key].steps[dayIndex];
  saveDB(db);
  return Object.values(db.monthData[key].steps).reduce((a,b)=>a+(parseInt(b)||0),0);
}

function getAllMonthData(username) {
  const db = loadDB();
  const MS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const results = [];
  for (let y = 2025; y <= 2028; y++) {
    for (let m = 0; m < 12; m++) {
      const key = `${username}_${y}_${m}`;
      const d = db.monthData[key] || {};
      const ticks = db.gymTicks[key] || {};
      const steps = Object.values(d.steps||{}).reduce((a,b)=>a+(parseInt(b)||0),0);
      const gymDays = Object.keys(ticks).length;
      if (d.weight || gymDays > 0 || steps > 0) {
        results.push({ year:y, month:m, label:`${MS[m]}'${String(y).slice(2)}`, data:{...d, gymDays, steps} });
      }
    }
  }
  return results;
}

function savePhoto(username, year, month, slot, data) {
  const db = loadDB();
  if (!db.photos) db.photos = {};
  db.photos[`${username}_${year}_${month}_${slot}`] = data;
  saveDB(db);
}

function getAllPhotos(username) {
  const db = loadDB();
  const result = {};
  Object.entries(db.photos||{}).forEach(([k,v]) => {
    if (k.startsWith(username+'_')) result[k] = { data: v };
  });
  return result;
}

// NOTEBOOK
function getNotebook(username, dateKey) {
  const db = loadDB();
  return db.notebook[`${username}_${dateKey}`] || { exercises:[], notes:'', workoutName:'', date:dateKey };
}

function saveNotebook(username, dateKey, data) {
  const db = loadDB();
  if (!db.notebook) db.notebook = {};
  db.notebook[`${username}_${dateKey}`] = { ...data, username, date:dateKey, updatedAt:Date.now() };
  saveDB(db);
  return db.notebook[`${username}_${dateKey}`];
}

function getNotebookHistory(username) {
  const db = loadDB();
  return Object.entries(db.notebook||{})
    .filter(([k]) => k.startsWith(username+'_'))
    .map(([,v]) => v)
    .sort((a,b) => (b.date||'').localeCompare(a.date||''));
}

function getAdminQuote() { return loadDB().adminQuote || null; }
function setAdminQuote(text) { const db = loadDB(); db.adminQuote = text; saveDB(db); }

// SQUADS
function createSquad(ownerUsername, name) {
  const db = loadDB();
  const code = Math.random().toString(36).slice(2,8).toUpperCase();
  const id = 'sq_' + Date.now();
  db.squads[id] = { id, name, code, owner: ownerUsername, members: [ownerUsername], createdAt: Date.now() };
  saveDB(db);
  return db.squads[id];
}

function joinSquad(username, code) {
  const db = loadDB();
  const squad = Object.values(db.squads).find(s => s.code === code.toUpperCase());
  if (!squad) return { error: 'Squad not found' };
  if (squad.members.includes(username)) return { error: 'Already a member' };
  squad.members.push(username);
  saveDB(db);
  return { success: true, squad };
}

function getUserSquads(username) {
  const db = loadDB();
  return Object.values(db.squads).filter(s => s.members.includes(username));
}

function getSquadLeaderboard(squadId) {
  const db = loadDB();
  const squad = db.squads[squadId];
  if (!squad) return null;
  return { squad, scores: computeScores(squad.members, db) };
}

function computeScores(usernames, db) {
  const now = new Date();
  return usernames.map(username => {
    const user = db.users[username];
    if (!user) return null;
    const y = now.getFullYear(), m = now.getMonth();
    const data = db.monthData[`${username}_${y}_${m}`] || {};
    const ticks = db.gymTicks[`${username}_${y}_${m}`] || {};
    const gymDays = Object.keys(ticks).length;
    const totalSteps = Object.values(data.steps||{}).reduce((a,b)=>a+(parseInt(b)||0),0);
    const daysIn = now.getDate();
    const gymTarget = Math.round((user.profile?.gymDaysPerWeek||4) * daysIn/7);
    const gymScore = Math.min(gymDays/Math.max(gymTarget,1),1)*40;
    const stepScore = Math.min(totalSteps/(10000*daysIn),1)*40;
    let streak = 0;
    const d = new Date();
    for (let i=0;i<30;i++) {
      const sd = db.monthData[`${username}_${d.getFullYear()}_${d.getMonth()}`];
      if ((parseInt((sd?.steps||{})[d.getDate()-1])||0) > 0) streak++;
      else if (i>0) break;
      d.setDate(d.getDate()-1);
    }
    const streakScore = Math.min(streak/7,1)*20;
    return { username, displayName: user.displayName||username, color: user.color, initials: user.initials, score: Math.round(gymScore+stepScore+streakScore), gymDays, totalSteps, streak, goal: user.profile?.goal||null };
  }).filter(Boolean).sort((a,b) => b.score-a.score);
}

function getGlobalLeaderboard() {
  const db = loadDB();
  return computeScores(Object.keys(db.users), db);
}

function savePushSubscription(username, sub) {
  const db = loadDB();
  if (!db.users[username]) return;
  if (!db.users[username].pushSubscriptions) db.users[username].pushSubscriptions = [];
  const idx = db.users[username].pushSubscriptions.findIndex(s => s.endpoint===sub.endpoint);
  if (idx>=0) db.users[username].pushSubscriptions[idx] = sub;
  else db.users[username].pushSubscriptions.push(sub);
  saveDB(db);
}

function removePushSubscription(username, endpoint) {
  const db = loadDB();
  if (!db.users[username]?.pushSubscriptions) return;
  db.users[username].pushSubscriptions = db.users[username].pushSubscriptions.filter(s=>s.endpoint!==endpoint);
  saveDB(db);
}

function isMonthLocked(year, month) {
  const now = new Date();
  if (new Date() < new Date(2026,4,2)) return false;
  if (year < now.getFullYear()) return true;
  if (year === now.getFullYear() && month < now.getMonth()) return true;
  return false;
}

module.exports = {
  createUser, getUser, verifyUser, updateUser, updateUserProfile, getAllUsers, sanitizeUser,
  getMonthData, setMonthData, getGymTicks, setGymTick, setStepDay, getAllMonthData,
  savePhoto, getAllPhotos, getAdminQuote, setAdminQuote,
  getNotebook, saveNotebook, getNotebookHistory,
  createSquad, joinSquad, getUserSquads, getSquadLeaderboard, getGlobalLeaderboard,
  savePushSubscription, removePushSubscription, isMonthLocked
};
