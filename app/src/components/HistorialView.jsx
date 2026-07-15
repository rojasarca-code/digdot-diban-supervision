import { secNavButtonStyle } from '../lib/styles.js';

export default function HistorialView({ history, loadFromHistory, deleteFromHistory }) {
  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Historial de supervisiones</div>
      <div style={{ fontSize: 14, color: 'oklch(50% 0.01 30)', marginBottom: 24 }}>Actas guardadas en este navegador.</div>
      {history.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {history.map(h => (
            <div key={h.id} style={{ background: '#fff', border: '1px solid oklch(90% 0.006 90)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{h.nombreIpress}</div>
                <div style={{ fontSize: 12.5, color: 'oklch(50% 0.01 30)' }}>Acta {h.actaNro} · {h.generatedDate} {h.generatedTime} · {h.obsCount} obs. · {h.pctCumplimiento}% cumplimiento</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => loadFromHistory(h)} style={secNavButtonStyle}>Ver</button>
                <button onClick={() => deleteFromHistory(h.id)} style={{ border: '1px solid oklch(85% 0.05 25)', background: '#fff', color: 'oklch(45% 0.15 25)', borderRadius: 8, padding: '7px 12px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: 13.5, color: 'oklch(55% 0.01 30)', fontStyle: 'italic' }}>Aún no hay actas guardadas.</div>
      )}
    </div>
  );
}
