import logo from '../assets/minsa-logo.png';
import ModuleSwitch from './ModuleSwitch.jsx';
import { EQUIPO_DIBAN } from '../data/monitoreoData.js';
import { iniciales } from '../lib/monitoreo.js';
import { navButtonStyle, actaButtonStyle, inputStyle } from '../lib/styles.js';

export default function MonitoreoSidebar({
  modulo, setModulo, mon, view, activeRegion, filtro, setFiltro, visibleRegions, bancosPorRegion, regionStatsOf, totals,
  goResumen, goRegion, exportExcel, open, onClose
}) {
  const withClose = (fn) => (...args) => { fn(...args); if (onClose) onClose(); };
  const handleResumen = withClose(goResumen);
  const handleRegion = withClose(goRegion);
  const handleExport = withClose(exportExcel);

  const miembro = id => EQUIPO_DIBAN.find(m => m.id === id);
  const pctAsignadas = totals.regiones ? Math.round((totals.asignadas / totals.regiones) * 100) : 0;

  return (
    <div id="bs2-sidebar" className={open ? 'bs2-sidebar-open' : ''} style={{ width: 288, flexShrink: 0, background: '#ffffff', borderRight: '1px solid oklch(90% 0.006 90)', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="bs2-sb-header" style={{ padding: '20px 20px 16px', borderBottom: '1px solid oklch(90% 0.006 90)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <img src={logo} alt="MINSA Perú" className="bs2-sb-logo" style={{ height: 30, objectFit: 'contain', display: 'block', marginBottom: 12 }} />
          <div className="bs2-sb-title" style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.25 }}>Monitoreo Bancos de Sangre Tipo II</div>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: '#000', letterSpacing: '.03em', marginTop: 2 }}>Fenómeno El Niño · DIBAN · MINSA</div>
          <ModuleSwitch modulo={modulo} setModulo={setModulo} />
        </div>
        <button onClick={onClose} aria-label="Cerrar menú" className="bs2-sidebar-close" style={{ display: 'none', background: 'none', border: '1px solid oklch(88% 0.006 90)', borderRadius: 8, fontSize: 16, padding: '4px 9px', cursor: 'pointer', flexShrink: 0 }}>✕</button>
      </div>

      <div className="bs2-sb-quicknav" style={{ padding: '14px 14px 6px' }}>
        <button onClick={handleResumen} style={navButtonStyle(view === 'resumen')}>
          <span style={{ fontSize: 13.5 }}>📊 Resumen y distribución</span>
        </button>
        <div style={{ marginTop: 10 }}>
          <label htmlFor="mon-filtro" style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: 'oklch(55% 0.01 30)', letterSpacing: '.08em', textTransform: 'uppercase', margin: '0 6px 4px' }}>Ver regiones de</label>
          <select id="mon-filtro" value={filtro} onChange={e => setFiltro(e.target.value)} style={{ ...inputStyle, padding: '7px 10px', fontSize: 13 }}>
            <option value="">Todas las regiones</option>
            <option value="SIN_ASIGNAR">Sin asignar</option>
            {EQUIPO_DIBAN.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
          </select>
        </div>
      </div>

      <div className="bs2-sb-navlist" style={{ flex: 1, overflowY: 'auto', padding: '2px 14px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: 'oklch(55% 0.01 30)', letterSpacing: '.08em', textTransform: 'uppercase', margin: '10px 6px 2px' }}>Regiones ({visibleRegions.length})</div>
        {visibleRegions.length === 0 && (
          <div style={{ fontSize: 12.5, color: 'oklch(55% 0.01 30)', fontStyle: 'italic', padding: '4px 8px' }}>Ninguna región con este filtro.</div>
        )}
        {visibleRegions.map(r => {
          const st = regionStatsOf(r.key);
          const asignado = miembro(mon.regions[r.key].asignado);
          const active = view === 'region' && r.key === activeRegion;
          return (
            <button key={r.key} onClick={() => handleRegion(r.key)} style={navButtonStyle(active)}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 12.8, fontWeight: 600, lineHeight: 1.25, textAlign: 'left', minWidth: 0 }}>{r.key}</span>
                {asignado ? (
                  <span title={asignado.nombre} style={{ background: '#000', color: '#fff', fontSize: 10, fontWeight: 800, borderRadius: 20, padding: '1px 7px', flexShrink: 0 }}>{iniciales(asignado.nombre)}</span>
                ) : (
                  <span style={{ fontSize: 10.5, color: 'oklch(60% 0.01 30)', flexShrink: 0 }}>sin asignar</span>
                )}
              </div>
              <div style={{ fontSize: 11, color: 'oklch(55% 0.01 30)', marginTop: 2 }}>
                {st.bancos} {st.bancos === 1 ? 'banco' : 'bancos'} · {st.pct}% contactos
              </div>
              <div style={{ height: 3, borderRadius: 3, background: 'oklch(92% 0.006 90)', marginTop: 5, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: st.pct + '%', background: '#000', borderRadius: 3 }} />
              </div>
            </button>
          );
        })}
      </div>

      <div className="bs2-sb-footer" style={{ padding: 14, borderTop: '1px solid oklch(90% 0.006 90)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 11.5, color: 'oklch(50% 0.01 30)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Regiones asignadas</span><span style={{ fontWeight: 700 }}>{totals.asignadas}/{totals.regiones}</span>
        </div>
        <div style={{ height: 6, borderRadius: 6, background: 'oklch(92% 0.006 90)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: pctAsignadas + '%', background: '#000', borderRadius: 6 }} />
        </div>
        <button onClick={handleExport} style={actaButtonStyle}>⬇ Exportar lista a Excel</button>
        <div style={{ fontSize: 10.5, color: 'oklch(65% 0.01 30)' }}>Guardado automáticamente en este navegador</div>
      </div>
    </div>
  );
}
