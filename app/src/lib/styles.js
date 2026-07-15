export const labelStyle = {
  fontSize: 12, fontWeight: 700, color: 'oklch(45% 0.01 30)', marginBottom: 6
};

export const inputStyle = {
  width: '100%', border: '1px solid oklch(85% 0.006 90)', borderRadius: 8, padding: '10px 12px',
  fontSize: 14, fontFamily: 'Manrope,sans-serif', background: '#fff'
};

export const secNavButtonStyle = {
  background: '#fff', border: '1px solid oklch(85% 0.006 90)', color: 'oklch(30% 0.01 30)',
  borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
  fontFamily: 'Manrope,sans-serif'
};

export const actaButtonStyle = {
  background: 'oklch(52% 0.19 25)', color: '#fff', border: 'none', borderRadius: 10,
  padding: '11px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Manrope,sans-serif'
};

export const actaButtonStyleInline = {
  background: 'oklch(52% 0.19 25)', color: '#fff', border: 'none', borderRadius: 8,
  padding: '9px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Manrope,sans-serif'
};

export function navButtonStyle(active) {
  return {
    width: '100%', textAlign: 'left', background: active ? 'oklch(96% 0.03 25)' : 'transparent',
    border: 'none', borderRadius: 10, padding: '10px 12px', cursor: 'pointer',
    fontFamily: 'Manrope,sans-serif', color: active ? 'oklch(45% 0.15 25)' : 'oklch(30% 0.01 30)',
    display: 'block'
  };
}

export function answerButtonStyle(kind, active) {
  const colors = kind === 'si'
    ? { bg: 'oklch(58% 0.14 150)', border: 'oklch(58% 0.14 150)', text: '#fff' }
    : { bg: 'oklch(52% 0.19 25)', border: 'oklch(52% 0.19 25)', text: '#fff' };
  if (!active) {
    return {
      background: '#fff', border: '1px solid oklch(85% 0.006 90)', color: 'oklch(40% 0.01 30)',
      borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
      fontFamily: 'Manrope,sans-serif', minWidth: 52
    };
  }
  return {
    background: colors.bg, border: '1px solid ' + colors.border, color: colors.text,
    borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
    fontFamily: 'Manrope,sans-serif', minWidth: 52
  };
}

export function nivelBadgeStyle(nivel) {
  const map = {
    'CRÍTICO': 'oklch(50% 0.2 25)', 'ALTO': 'oklch(55% 0.18 40)',
    'MEDIO': 'oklch(70% 0.15 85)', 'BAJO': 'oklch(60% 0.13 150)'
  };
  const color = map[nivel] || 'oklch(60% 0.01 30)';
  return {
    fontSize: 11, fontWeight: 700, background: color, color: '#fff', borderRadius: 6, padding: '3px 9px'
  };
}
