import { EQUIPO_DIBAN, REGIONES } from '../data/monitoreoData.js';
import { actaButtonStyleInline, secNavButtonStyle, inputStyle } from '../lib/styles.js';
import { cardStyle, rowStyle, mutedText, Chip } from './MonCampos.jsx';

const sectionTitle = { fontSize: 15, fontWeight: 800, margin: '30px 0 4px' };

function Tile({ label, value, sub }) {
  return (
    <div style={{ ...cardStyle, padding: '14px 16px' }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: 'oklch(50% 0.01 30)' }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.2 }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: 'oklch(55% 0.01 30)' }}>{sub}</div>}
    </div>
  );
}

export default function MonitoreoResumen({
  mon, totals, bancosPorRegion, regionStatsOf, setParticipa, assignRegion, goRegion,
  autoDistribuir, limpiarAsignaciones, resetMonitoreo, exportExcel
}) {
  const carga = {};
  EQUIPO_DIBAN.forEach(m => { carga[m.id] = { regiones: [], bancos: 0 }; });
  REGIONES.forEach(r => {
    const id = mon.regions[r.key].asignado;
    if (id && carga[id]) {
      carga[id].regiones.push(r);
      carga[id].bancos += (bancosPorRegion[r.key] || []).length;
    }
  });

  let done = 0, total = 0;
  REGIONES.forEach(r => { const s = regionStatsOf(r.key); done += s.done; total += s.total; });
  const pctContactos = total ? Math.round((done / total) * 100) : 0;

  const opcionesMiembros = (actual) => EQUIPO_DIBAN.filter(m => (mon.team[m.id] && mon.team[m.id].participa) || m.id === actual);

  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Lista de monitoreo · Bancos de Sangre Tipo II</div>
      <div style={{ fontSize: 14, color: 'oklch(50% 0.01 30)', marginBottom: 22 }}>
        Monitoreo en el contexto del Fenómeno El Niño. Reparte las regiones entre el equipo técnico de la DIBAN y registra,
        por región, el coordinador regional de PRONAHEBAS y sus alternos, y el jefe de cada banco de sangre tipo II
        (con teléfonos y correos).
      </div>

      <div className="mon-stats" style={{ marginBottom: 18 }}>
        <Tile label="Regiones asignadas" value={totals.asignadas + '/' + totals.regiones} />
        <Tile label="Bancos de sangre tipo II" value={totals.bancos} />
        <Tile label="Bancos monitoreados" value={totals.monitoreados + '/' + totals.bancos} />
        <Tile label="Contactos registrados" value={pctContactos + '%'} sub="coordinadores y jefes" />
      </div>

      <div id="bs2-topbar-actions" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={autoDistribuir} style={actaButtonStyleInline}>⚖ Distribuir automáticamente</button>
        <button onClick={exportExcel} style={secNavButtonStyle}>⬇ Exportar a Excel</button>
        <button onClick={() => window.print()} style={secNavButtonStyle}>🖶 Imprimir</button>
        <button onClick={limpiarAsignaciones} style={secNavButtonStyle}>Quitar asignaciones</button>
        <button onClick={resetMonitoreo} style={secNavButtonStyle}>Restablecer datos de origen</button>
      </div>

      <div style={sectionTitle}>Equipo técnico DIBAN</div>
      <div style={{ ...mutedText, marginBottom: 10 }}>
        Marca quiénes participan en el monitoreo; la distribución automática solo considera a los marcados.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {EQUIPO_DIBAN.map(m => {
          const c = carga[m.id];
          const participa = !!(mon.team[m.id] && mon.team[m.id].participa);
          return (
            <div key={m.id} style={{ ...rowStyle, flexDirection: 'column', alignItems: 'stretch', gap: 8, opacity: participa ? 1 : 0.55 }}>
              <div className="bs2-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, cursor: 'pointer' }}>
                  <input type="checkbox" checked={participa} onChange={e => setParticipa(m.id, e.target.checked)} style={{ width: 17, height: 17, accentColor: '#000', flexShrink: 0 }} />
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: 'block', fontWeight: 700, fontSize: 14 }}>{m.nombre}</span>
                    <span style={mutedText}>{m.area} · {m.condicion} · Cel. {m.celular}</span>
                  </span>
                </label>
                <div style={{ fontSize: 12.5, fontWeight: 700, flexShrink: 0 }}>
                  {c.regiones.length} {c.regiones.length === 1 ? 'región' : 'regiones'} · {c.bancos} bancos
                </div>
              </div>
              {c.regiones.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {c.regiones.map(r => (
                    <button key={r.key} onClick={() => goRegion(r.key)} style={{ cursor: 'pointer', background: '#fff', border: '1px solid oklch(78% 0 0)', borderRadius: 20, padding: '3px 10px', fontSize: 11.5, fontWeight: 600, fontFamily: 'Manrope,sans-serif' }}>
                      {r.key} <span style={{ opacity: 0.55 }}>({(bancosPorRegion[r.key] || []).length})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={sectionTitle}>Asignación de regiones</div>
      <div style={{ ...mutedText, marginBottom: 10 }}>
        Elige el supervisor DIBAN responsable de cada región. El número entre paréntesis es la cantidad de bancos de sangre tipo II.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {REGIONES.map(r => {
          const st = mon.regions[r.key];
          const prog = regionStatsOf(r.key);
          const n = (bancosPorRegion[r.key] || []).length;
          return (
            <div key={r.key} className="bs2-row" style={rowStyle}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <button onClick={() => goRegion(r.key)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'Manrope,sans-serif', fontWeight: 800, fontSize: 14, textAlign: 'left', textDecoration: 'underline' }}>
                  {r.key} <span style={{ fontWeight: 600 }}>({n})</span>
                </button>
                <div style={mutedText}>
                  {r.entidad} · Coordinador: {st.coordNombre || 'sin registrar'} · {prog.pct}% contactos
                </div>
                {!st.asignado && <div style={{ marginTop: 4 }}><Chip>Sin asignar</Chip></div>}
              </div>
              <div className="mon-select-col">
                <select
                  value={st.asignado}
                  onChange={e => assignRegion(r.key, e.target.value)}
                  aria-label={'Supervisor DIBAN para ' + r.key}
                  style={inputStyle}
                >
                  <option value="">— Sin asignar —</option>
                  {opcionesMiembros(st.asignado).map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
