import ChecklistItem from './ChecklistItem.jsx';
import { secNavButtonStyle } from '../lib/styles.js';
import { isRestrictedClasif } from '../lib/constants.js';

export default function ChecklistView({ section, stats, answers, handlers, header, goPrevSection, goNextSection }) {
  const restricted = isRestrictedClasif(header.clasificacionBS);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 2 }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#000' }}>{section.id}</span>
        <div style={{ fontSize: 22, fontWeight: 800 }}>{section.title}</div>
      </div>
      <div style={{ fontSize: 13.5, color: 'oklch(50% 0.01 30)', marginBottom: 20 }}>
        {stats.answered} de {stats.total} ítems evaluados · {stats.obsCount} observaciones
      </div>

      <div className="bs2-card" style={{ background: '#fff', border: '1px solid oklch(90% 0.006 90)', borderRadius: 14, padding: '8px 24px' }}>
        {section.subs.map((sub, subIdx) => {
          const subDisabled = restricted && section.id === 'XI' && sub.title === 'PRUEBAS DEL DONANTE';
          return (
          <div key={subIdx}>
            <div style={{ marginTop: 22, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '.04em', textTransform: 'uppercase', color: '#000', paddingBottom: 8, borderBottom: '1px solid oklch(92% 0.006 90)', flex: 1 }}>{sub.title}</div>
              {subDisabled && (
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#fff', background: 'oklch(65% 0 0)', borderRadius: 5, padding: '2px 8px', marginBottom: 8 }}>NO APLICA (BS {header.clasificacionBS})</span>
              )}
            </div>
            <div style={subDisabled ? { opacity: .4, pointerEvents: 'none' } : undefined}>
            {sub.groups.map((grp, grpIdx) => (
              <div key={grpIdx}>
                {grp.title && (
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#000', margin: '14px 0 2px', padding: '4px 10px', background: 'oklch(95% 0 0)', borderRadius: 6, display: 'inline-block' }}>{grp.title}</div>
                )}
                {grp.items.map(item => (
                  <ChecklistItem key={item.id} item={item} answer={answers[item.id] || {}} handlers={handlers} />
                ))}
              </div>
            ))}
            </div>
          </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <button onClick={goPrevSection} style={secNavButtonStyle}>← Anterior</button>
        <button onClick={goNextSection} style={secNavButtonStyle}>Siguiente →</button>
      </div>
    </div>
  );
}
