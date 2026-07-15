import ChecklistItem from './ChecklistItem.jsx';
import { secNavButtonStyle } from '../lib/styles.js';

export default function ChecklistView({ section, stats, answers, handlers, goPrevSection, goNextSection }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 2 }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: 'oklch(52% 0.19 25)' }}>{section.id}</span>
        <div style={{ fontSize: 22, fontWeight: 800 }}>{section.title}</div>
      </div>
      <div style={{ fontSize: 13.5, color: 'oklch(50% 0.01 30)', marginBottom: 20 }}>
        {stats.answered} de {stats.total} ítems evaluados · {stats.obsCount} observaciones
      </div>

      <div className="bs2-card" style={{ background: '#fff', border: '1px solid oklch(90% 0.006 90)', borderRadius: 14, padding: '8px 24px' }}>
        {section.subs.map((sub, subIdx) => (
          <div key={subIdx}>
            <div style={{ marginTop: 22, marginBottom: 6 }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '.04em', textTransform: 'uppercase', color: 'oklch(45% 0.01 30)', paddingBottom: 8, borderBottom: '1px solid oklch(92% 0.006 90)' }}>{sub.title}</div>
            </div>
            {sub.groups.map((grp, grpIdx) => (
              <div key={grpIdx}>
                {grp.title && (
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: 'oklch(52% 0.19 25)', margin: '14px 0 2px', padding: '4px 10px', background: 'oklch(97% 0.02 25)', borderRadius: 6, display: 'inline-block' }}>{grp.title}</div>
                )}
                {grp.items.map(item => (
                  <ChecklistItem key={item.id} item={item} answer={answers[item.id] || {}} handlers={handlers} />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <button onClick={goPrevSection} style={secNavButtonStyle}>← Anterior</button>
        <button onClick={goNextSection} style={secNavButtonStyle}>Siguiente →</button>
      </div>
    </div>
  );
}
