// qawi-progress-photos.jsx — 12-month body progress photo grid
// Stores up to 3 photos per month as dataURLs in localStorage (key: 'qawi-progress-photos')
// Shape: { '2025-01': [dataUrl1, dataUrl2, dataUrl3], '2025-02': [...], ... }

const MONTHS = [
  { short: 'JAN', full: 'January',   ar: 'يناير' },
  { short: 'FEB', full: 'February',  ar: 'فبراير' },
  { short: 'MAR', full: 'March',     ar: 'مارس' },
  { short: 'APR', full: 'April',     ar: 'أبريل' },
  { short: 'MAY', full: 'May',       ar: 'مايو' },
  { short: 'JUN', full: 'June',      ar: 'يونيو' },
  { short: 'JUL', full: 'July',      ar: 'يوليو' },
  { short: 'AUG', full: 'August',    ar: 'أغسطس' },
  { short: 'SEP', full: 'September', ar: 'سبتمبر' },
  { short: 'OCT', full: 'October',   ar: 'أكتوبر' },
  { short: 'NOV', full: 'November',  ar: 'نوفمبر' },
  { short: 'DEC', full: 'December',  ar: 'ديسمبر' },
];

function useProgressPhotos() {
  const [photos, setPhotos] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('qawi-progress-photos') || '{}'); }
    catch { return {}; }
  });
  const save = (next) => {
    setPhotos(next);
    try { localStorage.setItem('qawi-progress-photos', JSON.stringify(next)); }
    catch {}
  };
  return [photos, save];
}

function monthKey(year, monthIdx) {
  return `${year}-${String(monthIdx+1).padStart(2,'0')}`;
}

// Resize image to max 800px wide, return dataURL (keeps localStorage usable)
function resizeToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 800;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function ProgressPhotosCard({ t }) {
  const [photos, savePhotos] = useProgressPhotos();
  const [openMonth, setOpenMonth] = React.useState(null); // { year, monthIdx }
  const [viewerPhoto, setViewerPhoto] = React.useState(null);

  const now = new Date();
  const curYear = now.getFullYear();
  const curMonth = now.getMonth();

  return (
    <>
      <div style={{
        background: t.bg2, border: `1px solid ${t.border}`,
        borderRadius: 12, padding: 14,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
        }}>
          <span style={{ color: t.accent, fontSize: 12 }}>◆</span>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: 15, fontWeight: 700, letterSpacing: 1.5,
            color: t.text, textTransform: 'uppercase', flex: 1,
          }}>PROGRESS PHOTOS</div>
          <div style={{
            fontFamily: 'DM Mono, monospace', fontSize: 10,
            color: t.text3, letterSpacing: '0.1em',
          }}>{curYear}</div>
        </div>
        <div style={{
          fontFamily: 'Amiri, Georgia, serif', fontSize: 11,
          color: t.accentDim, direction: 'rtl', marginBottom: 12,
          textAlign: 'right',
        }}>صور التقدم · تابع تغييرك</div>

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {MONTHS.map((m, i) => {
            const key = monthKey(curYear, i);
            const monthPhotos = photos[key] || [];
            const count = monthPhotos.length;
            const future = i > curMonth;
            const isThis = i === curMonth;
            return (
              <button key={m.short}
                disabled={future}
                onClick={() => setOpenMonth({ year: curYear, monthIdx: i })}
                style={{
                  flexShrink: 0, background: 'transparent', border: 'none',
                  padding: 0, cursor: future ? 'default' : 'pointer',
                  opacity: future ? 0.3 : 1,
                  fontFamily: 'inherit',
                }}>
                <div style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 11, fontWeight: 800, letterSpacing: 1.5,
                  color: isThis ? t.accent : t.text2,
                  textAlign: 'center', marginBottom: 5,
                }}>{m.short}</div>
                <div style={{
                  width: 86, height: 120, borderRadius: 8,
                  background: count > 0 ? t.bg3 : `repeating-linear-gradient(45deg, ${t.bg3}, ${t.bg3} 6px, ${t.bg4} 6px, ${t.bg4} 12px)`,
                  border: isThis
                    ? `1.5px solid ${t.accent}`
                    : count > 0 ? `1px solid ${t.border2}` : `1px dashed ${t.border2}`,
                  overflow: 'hidden', position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {count > 0 ? (
                    <>
                      <img src={monthPhotos[0]} alt={m.short} style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                      }} />
                      {/* Corner badge for count */}
                      <div style={{
                        position: 'absolute', top: 4, right: 4,
                        background: 'rgba(0,0,0,0.75)',
                        color: t.accent, padding: '2px 6px', borderRadius: 10,
                        fontFamily: 'DM Mono, monospace', fontSize: 9,
                        letterSpacing: '0.08em',
                      }}>{count}/3</div>
                      {/* Mini dots */}
                      <div style={{
                        position: 'absolute', bottom: 5, left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex', gap: 3,
                      }}>
                        {[0,1,2].map(j => (
                          <div key={j} style={{
                            width: 5, height: 5, borderRadius: '50%',
                            background: j < count ? t.accent : 'rgba(255,255,255,0.3)',
                          }} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div style={{
                      fontFamily: 'DM Mono, monospace', fontSize: 9,
                      color: t.text3, textAlign: 'center', letterSpacing: '0.1em',
                    }}>
                      {future ? '—' : '+ ADD'}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {openMonth && (
        <MonthPhotoModal t={t}
          year={openMonth.year}
          monthIdx={openMonth.monthIdx}
          photos={photos[monthKey(openMonth.year, openMonth.monthIdx)] || []}
          onClose={() => setOpenMonth(null)}
          onSave={(slotPhotos) => {
            const k = monthKey(openMonth.year, openMonth.monthIdx);
            const next = { ...photos };
            if (slotPhotos.length === 0) delete next[k];
            else next[k] = slotPhotos;
            savePhotos(next);
          }}
          onView={(url) => setViewerPhoto(url)}
        />
      )}

      {viewerPhoto && (
        <div onClick={() => setViewerPhoto(null)} style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.95)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }}>
          <img src={viewerPhoto} alt="Progress photo" style={{
            maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
            borderRadius: 8,
          }} />
          <button onClick={() => setViewerPhoto(null)} style={{
            position: 'absolute', top: 20, right: 20,
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(0,0,0,0.6)', border: `1px solid ${t.border2}`,
            color: t.text, cursor: 'pointer', fontSize: 22,
          }}>×</button>
        </div>
      )}
    </>
  );
}

function MonthPhotoModal({ t, year, monthIdx, photos, onClose, onSave, onView }) {
  const month = MONTHS[monthIdx];
  const [slots, setSlots] = React.useState(() => {
    const arr = [null, null, null];
    photos.forEach((p, i) => { if (i < 3) arr[i] = p; });
    return arr;
  });

  const nonNull = slots.filter(Boolean);
  const hasChanged = JSON.stringify(nonNull) !== JSON.stringify(photos);

  const fileInputs = [React.useRef(null), React.useRef(null), React.useRef(null)];

  const handleFile = async (idx, file) => {
    if (!file) return;
    try {
      const url = await resizeToDataURL(file);
      setSlots(s => s.map((v, i) => i === idx ? url : v));
    } catch (e) {
      alert('Could not load image');
    }
  };

  const handleRemove = (idx) => {
    setSlots(s => s.map((v, i) => i === idx ? null : v));
  };

  const save = () => {
    onSave(slots.filter(Boolean));
    onClose();
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 420, maxHeight: '90vh',
        background: t.bg, border: `1px solid ${t.border2}`,
        borderRadius: 16, padding: 20,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 18 }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'DM Mono, monospace', fontSize: 9,
              color: t.accent2, letterSpacing: '0.2em',
            }}>// PROGRESS · {year}</div>
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 30, fontWeight: 800, letterSpacing: 3,
              color: t.accent, lineHeight: 1, marginTop: 2,
            }}>{month.full.toUpperCase()}</div>
            <div style={{
              fontFamily: 'Amiri, Georgia, serif', fontSize: 16,
              color: t.accentDim, direction: 'rtl', marginTop: 2,
            }}>{month.ar}</div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: t.bg3, border: `1px solid ${t.border}`,
            color: t.text2, cursor: 'pointer', fontSize: 18,
          }}>×</button>
        </div>

        <div style={{
          fontSize: 12, color: t.text3, lineHeight: 1.5, marginBottom: 14,
        }}>
          Add up to 3 photos — track front, side, back. Your progress stays private on this device.
        </div>

        {/* 3 slots */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10,
          overflowY: 'auto', marginBottom: 16,
        }}>
          {slots.map((photo, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              <div style={{
                fontFamily: 'DM Mono, monospace', fontSize: 9,
                color: t.text3, letterSpacing: '0.15em', marginBottom: 4,
                textAlign: 'center',
              }}>
                {idx === 0 ? 'FRONT' : idx === 1 ? 'SIDE' : 'BACK'}
              </div>
              <input ref={fileInputs[idx]}
                type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => handleFile(idx, e.target.files[0])} />
              {photo ? (
                <div style={{
                  aspectRatio: '3/4', borderRadius: 10,
                  overflow: 'hidden', position: 'relative',
                  border: `1px solid ${t.border2}`,
                }}>
                  <img src={photo} alt={`Slot ${idx+1}`}
                    onClick={() => onView(photo)}
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      cursor: 'pointer',
                    }} />
                  <button onClick={() => handleRemove(idx)} style={{
                    position: 'absolute', top: 4, right: 4,
                    width: 24, height: 24, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.75)',
                    border: `1px solid ${t.accent}`,
                    color: t.accent, cursor: 'pointer', fontSize: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>×</button>
                  <button onClick={() => fileInputs[idx].current?.click()} style={{
                    position: 'absolute', bottom: 4, left: 4, right: 4,
                    padding: '4px 6px', borderRadius: 6,
                    background: 'rgba(0,0,0,0.75)',
                    border: `1px solid ${t.border2}`,
                    color: t.accent, cursor: 'pointer',
                    fontFamily: 'DM Mono, monospace', fontSize: 8,
                    letterSpacing: '0.1em',
                  }}>RETAKE</button>
                </div>
              ) : (
                <button onClick={() => fileInputs[idx].current?.click()} style={{
                  width: '100%', aspectRatio: '3/4', borderRadius: 10,
                  background: `repeating-linear-gradient(45deg, ${t.bg2}, ${t.bg2} 6px, ${t.bg3} 6px, ${t.bg3} 12px)`,
                  border: `1.5px dashed ${t.border2}`,
                  cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: t.accentGlow, border: `1px solid ${t.accent}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: t.accent, fontSize: 18,
                  }}>+</div>
                  <div style={{
                    fontFamily: 'DM Mono, monospace', fontSize: 8,
                    color: t.text3, letterSpacing: '0.1em',
                  }}>ADD PHOTO</div>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Save button */}
        <button onClick={save}
          disabled={!hasChanged}
          style={{
            width: '100%', padding: 14,
            background: hasChanged ? t.accent : t.bg3,
            border: 'none', borderRadius: 10,
            color: hasChanged ? '#000' : t.text3,
            cursor: hasChanged ? 'pointer' : 'default',
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: 14, fontWeight: 800, letterSpacing: 2.5,
          }}>
          {hasChanged ? 'SAVE PROGRESS' : 'NO CHANGES'}
          <span style={{fontFamily:'Amiri,Georgia,serif',fontSize:11,fontWeight:400,marginLeft:6}}>· حفظ</span>
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { ProgressPhotosCard, MonthPhotoModal });
