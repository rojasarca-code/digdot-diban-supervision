import logo from '../assets/minsa-logo.png';
import { navButtonStyle, actaButtonStyle } from '../lib/styles.js';

export default function Sidebar({ sections, sectionStats, view, activeSectionId, goHeader, goSection, goActa, goHistorial, newSupervision, historyCount }) {
  let overallAnswered = 0, overallTotal = 0;

  const navSections = sections.map(sec => {
    const st = sectionStats(sec);
    overallAnswered += st.answered;
    overallTotal += st.total;
    const active = view === 'checklist' && sec.id === activeSectionId;
    const pct = st.total ? Math.round((st.answered / st.total) * 100) : 0;
    return { sec, st, active, pct };
  });

  const overallPct = overallTotal ? Math.round((overallAnswered / overallTotal) * 100) : 0;

  return (
    <div id="bs2-sidebar" style={{ width: 288, flexShrink: 0, background: '#ffffff', borderRight: '1px solid oklch(90% 0.006 90)', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid oklch(90% 0.006 90)' }}>
        <img src={logo} alt="MINSA Perú" style={{ height: 30, objectFit: 'contain', display: 'block', marginBottom: 12 }} />
        <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.25 }}>Supervisión Bancos de Sangre Tipo II</div>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: 'oklch(52% 0.19 25)', letterSpacing: '.03em', marginTop: 2 }}>DIBAN · DIGDOT · MINSA</div>
      </div>

      <div style={{ padding: '14px 14px 6px' }}>
        <button onClick={goHeader} style={navButtonStyle(view === 'header')}>
          <span style={{ fontSize: 13.5 }}>📋 Datos generales</span>
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '2px 14px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: 'oklch(55% 0.01 30)', letterSpacing: '.08em', textTransform: 'uppercase', margin: '10px 6px 2px' }}>Secciones de verificación</div>
        {navSections.map(({ sec, st, active, pct }) => (
          <button key={sec.id} onClick={() => goSection(sec.id)} style={navButtonStyle(active)}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 800, opacity: .6, flexShrink: 0 }}>{sec.id}</span>
                <span style={{ fontSize: 12.8, fontWeight: 600, lineHeight: 1.25, textAlign: 'left' }}>{sec.title}</span>
              </span>
              {st.obsCount > 0 && (
                <span style={{ background: 'oklch(52% 0.19 25)', color: '#fff', fontSize: 10, fontWeight: 800, borderRadius: 20, padding: '1px 6px', flexShrink: 0 }}>{st.obsCount}</span>
              )}
            </div>
            <div style={{ height: 3, borderRadius: 3, background: 'oklch(92% 0.006 90)', marginTop: 6, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: pct + '%', background: 'oklch(52% 0.19 25)', borderRadius: 3 }} />
            </div>
          </button>
        ))}
      </div>

      <div style={{ padding: 14, borderTop: '1px solid oklch(90% 0.006 90)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 11.5, color: 'oklch(50% 0.01 30)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Avance general</span><span style={{ fontWeight: 700 }}>{overallPct}%</span>
        </div>
        <div style={{ height: 6, borderRadius: 6, background: 'oklch(92% 0.006 90)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: overallPct + '%', background: 'oklch(52% 0.19 25)', borderRadius: 6 }} />
        </div>
        <button onClick={goActa} style={actaButtonStyle}>🗎 Generar Acta de Supervisión</button>
        <button onClick={goHistorial} style={{ background: 'none', border: 'none', color: 'oklch(45% 0.01 30)', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: '4px 0', textAlign: 'left' }}>📁 Historial ({historyCount})</button>
        <button onClick={newSupervision} style={{ background: 'none', border: 'none', color: 'oklch(50% 0.01 30)', fontSize: 11.5, cursor: 'pointer', padding: 0, textAlign: 'left', textDecoration: 'underline' }}>Nueva supervisión (limpiar)</button>
        <div style={{ fontSize: 10.5, color: 'oklch(65% 0.01 30)' }}>Guardado automáticamente en este navegador</div>
      </div>
    </div>
  );
}
