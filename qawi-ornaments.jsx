// qawi-ornaments.jsx — decorative elements, all hand-kept simple

// Large Arabic wordmark as hero element (uses Amiri/Noto Naskh via Google Fonts)
function QawiCalligraphy({ color, opacity = 0.08, size = 260, style = {} }) {
  return (
    <div style={{
      fontFamily: '"Amiri", "Noto Naskh Arabic", "Georgia", serif',
      fontSize: size,
      color,
      opacity,
      lineHeight: 0.9,
      direction: 'rtl',
      userSelect: 'none',
      pointerEvents: 'none',
      fontWeight: 700,
      ...style,
    }}>قوي</div>
  );
}

// Small corner ornament — diamond + lines
function CornerOrnament({ color, size = 14, style = {} }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, ...style }}>
      <div style={{ width: 20, height: 1, background: color, opacity: 0.5 }} />
      <div style={{
        width: size, height: size,
        border: `1px solid ${color}`,
        transform: 'rotate(45deg)',
        opacity: 0.7,
      }} />
      <div style={{ width: 20, height: 1, background: color, opacity: 0.5 }} />
    </div>
  );
}

// Section divider with center diamond
function DiamondDivider({ color, label, labelAr }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '6px 0', margin: '4px 0',
    }}>
      <div style={{ flex: 1, height: 1, background: color, opacity: 0.25 }} />
      <div style={{
        width: 6, height: 6,
        background: color, transform: 'rotate(45deg)',
      }} />
      {label && (
        <div style={{
          fontFamily: 'DM Mono, monospace', fontSize: 9,
          letterSpacing: '0.2em', color, opacity: 0.8,
          textTransform: 'uppercase',
        }}>{label}{labelAr && <span style={{
          fontFamily: '"Amiri", Georgia, serif', marginLeft: 6,
          direction: 'rtl', opacity: 0.7,
        }}>· {labelAr}</span>}</div>
      )}
      <div style={{
        width: 6, height: 6,
        background: color, transform: 'rotate(45deg)',
      }} />
      <div style={{ flex: 1, height: 1, background: color, opacity: 0.25 }} />
    </div>
  );
}

// Pattern background — simple dots grid, Islamic geometric feel
function PatternBackground({ color, opacity = 0.04 }) {
  const dotSize = 1;
  const gap = 18;
  return (
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: `radial-gradient(circle, ${color} ${dotSize}px, transparent ${dotSize + 0.5}px)`,
      backgroundSize: `${gap}px ${gap}px`,
      opacity,
      pointerEvents: 'none',
    }} />
  );
}

// Geometric star pattern — 8-pointed star made from 2 rotated squares
function GeometricStar({ color, size = 40, opacity = 1, style = {} }) {
  return (
    <div style={{
      position: 'relative',
      width: size, height: size,
      opacity,
      ...style,
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        border: `1px solid ${color}`,
        transform: 'rotate(0deg)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        border: `1px solid ${color}`,
        transform: 'rotate(45deg)',
      }} />
      <div style={{
        position: 'absolute', inset: '35%',
        border: `1px solid ${color}`,
        transform: 'rotate(22.5deg)',
        opacity: 0.6,
      }} />
    </div>
  );
}

Object.assign(window, { QawiCalligraphy, CornerOrnament, DiamondDivider, PatternBackground, GeometricStar });
