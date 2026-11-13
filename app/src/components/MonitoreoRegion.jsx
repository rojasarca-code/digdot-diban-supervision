import { EQUIPO_DIBAN } from '../data/monitoreoData.js';
import { ESTADOS_MONITOREO, MAX_ALTERNOS } from '../lib/monitoreo.js';
import { inputStyle, secNavButtonStyle, actaButtonStyleInline } from '../lib/styles.js';
import { cardStyle, mutedText, Campo, Entrada, Chip } from './MonCampos.jsx';

const blockTitle = { fontSize: 15, fontWeight: 800 };
const dangerButton = {
  border: '1px solid oklch(75% 0 0)', background: '#fff', color: '#000', borderRadius: 8,
  padding: '6px 12px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'Manrope,sans-serif'
};

const vacio = v => !(v && String(v).trim());

function BancoCard({ banco, setBancoField, removeBanco }) {
  const set = (field) => (value) => setBancoField(banco.id, field, value);
  const faltan = vacio(banco.jefe) || vacio(banco.tel) || vacio(banco.correo);
  const meta = [
    banco.renipress && 'RENIPRESS ' + banco.renipress,
    banco.categoria,
    banco.subsector,
    [banco.distrito, banco.provincia].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(' / ')
  ].filter(Boolean).join(' · ');

  return (
    <div className="mon-card" style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          {banco.custom ? (
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Banco agregado manualmente</div>
          ) : (
            <div style={{ fontSize: 14.5, fontWeight: 800, lineHeight: 1.3 }}>{banco.ipress}</div>
          )}
          {!banco.custom && <div style={mutedText}>{meta}</div>}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
          {faltan && <Chip>Faltan datos</Chip>}
          {banco.estado === 'MONITOREADO' && <Chip solid>Monitoreado</Chip>}
        </div>
      </div>

      {banco.custom && (
        <div className="mon-grid-3" style={{ marginTop: 12 }}>
          <Entrada label="Nombre del banco de sangre (IPRESS)" value={banco.ipress} onChange={set('ipress')} placeholder="Nombre de la IPRESS" />
          <Entrada label="Código RENIPRESS" value={banco.renipress} onChange={set('renipress')} placeholder="00000" mode="numeric" />
          <Entrada label="Categoría / sub sector" value={banco.categoria} onChange={set('categoria')} placeholder="Ej. II-2 · MINSA" />
        </div>
      )}

      {banco.nota && (
        <div style={{ marginTop: 10, padding: '8px 12px', border: '1.5px solid #000', borderRadius: 8, fontSize: 12.5 }}>
          <b>Atención:</b> {banco.nota}
        </div>
      )}

      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.04em', textTransform: 'uppercase', margin: '16px 0 8px' }}>Jefe del banco de sangre</div>
      <div className="mon-grid-3" style={{ gridTemplateColumns: '1.6fr 1fr 1fr' }}>
        <Entrada label="Nombre y apellidos" value={banco.jefe} onChange={set('jefe')} placeholder="Jefe del banco de sangre" />
        <Entrada label="Teléfono / celular" value={banco.tel} onChange={set('tel')} placeholder="9XX XXX XXX" mode="tel" />
        <Entrada label="Correo electrónico" value={banco.correo} onChange={set('correo')} placeholder="correo@ejemplo.com" mode="email" />
      </div>

      <div className="mon-grid-2" style={{ marginTop: 14, gridTemplateColumns: '220px 1fr' }}>
        <Campo label="Estado del monitoreo">
          <select value={banco.estado} onChange={e => setBancoField(banco.id, 'estado', e.target.value)} style={inputStyle}>
            {ESTADOS_MONITOREO.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Campo>
        <Entrada label="Observaciones" value={banco.obs} onChange={set('obs')} placeholder="Acuerdos, hallazgos, disponibilidad de hemocomponentes…" />
      </div>

      {banco.custom && (
        <div className="mon-noprint" style={{ marginTop: 12 }}>
          <button onClick={() => removeBanco(banco.id)} style={dangerButton}>Quitar este banco</button>
        </div>
      )}
    </div>
  );
}

export default function MonitoreoRegion({
  region, state, team, bancos, stats, setRegionField, assignRegion, setAlterno, addAlterno, removeAlterno,
  setBancoField, addBanco, removeBanco, goPrev, goNext
}) {
  const set = (field) => (value) => setRegionField(region.key, field, value);
  const miembros = EQUIPO_DIBAN.filter(m => (team[m.id] && team[m.id].participa) || m.id === state.asignado);
  const asignado = EQUIPO_DIBAN.find(m => m.id === state.asignado);
  const coordFalta = vacio(state.coordNombre) || vacio(state.coordTel) || vacio(state.coordCorreo);
  const lugar = [region.direccion, [region.distrito, region.provincia].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(' / ')].filter(Boolean).join(' · ');

  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>{region.key}</div>
      <div style={{ fontSize: 13.5, color: 'oklch(50% 0.01 30)', marginBottom: 4 }}>
        {region.entidad}{lugar ? ' · ' + lugar : ''}
      </div>
      <div style={{ fontSize: 13.5, color: 'oklch(50% 0.01 30)', marginBottom: 20 }}>
        {stats.bancos} {stats.bancos === 1 ? 'banco de sangre tipo II' : 'bancos de sangre tipo II'} · {stats.monitoreados} monitoreados · {stats.pct}% de contactos registrados
      </div>

      <div className="mon-card" style={cardStyle}>
        <div style={blockTitle}>Supervisor DIBAN asignado</div>
        <div className="mon-grid-2" style={{ marginTop: 10, gridTemplateColumns: '1fr 1fr', alignItems: 'end' }}>
          <Campo label="Responsable del monitoreo en esta región">
            <select value={state.asignado} onChange={e => assignRegion(region.key, e.target.value)} style={inputStyle}>
              <option value="">— Sin asignar —</option>
              {miembros.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
          </Campo>
          <div style={mutedText}>{asignado ? asignado.area + ' · Cel. ' + asignado.celular : 'Elige a un integrante del equipo DIBAN.'}</div>
        </div>
      </div>

      <div className="mon-card" style={{ ...cardStyle, marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div style={blockTitle}>Coordinador regional de PRONAHEBAS</div>
          {coordFalta && <Chip>Faltan datos</Chip>}
        </div>
        <div className="mon-grid-3" style={{ marginTop: 10 }}>
          <Entrada label="Nombres y apellidos" value={state.coordNombre} onChange={set('coordNombre')} placeholder="Coordinador regional" />
          <Entrada label="Teléfono / celular" value={state.coordTel} onChange={set('coordTel')} placeholder="9XX XXX XXX" mode="tel" />
          <Entrada label="Correo electrónico" value={state.coordCorreo} onChange={set('coordCorreo')} placeholder="correo@ejemplo.com" mode="email" />
        </div>

        <div style={{ ...blockTitle, marginTop: 22 }}>Coordinadores alternos</div>
        <div style={{ ...mutedText, marginTop: 2 }}>Hasta {MAX_ALTERNOS} alternos del coordinador regional.</div>
        {state.alternos.map((a, i) => (
          <div key={i} style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid oklch(92% 0.006 90)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 800 }}>Alterno {i + 1}</div>
              <button className="mon-noprint" onClick={() => removeAlterno(region.key, i)} style={dangerButton}>Quitar</button>
            </div>
            <div className="mon-grid-3">
              <Entrada label="Nombres y apellidos" value={a.nombre} onChange={v => setAlterno(region.key, i, 'nombre', v)} placeholder="Coordinador alterno" />
              <Entrada label="Teléfono / celular" value={a.tel} onChange={v => setAlterno(region.key, i, 'tel', v)} placeholder="9XX XXX XXX" mode="tel" />
              <Entrada label="Correo electrónico" value={a.correo} onChange={v => setAlterno(region.key, i, 'correo', v)} placeholder="correo@ejemplo.com" mode="email" />
            </div>
          </div>
        ))}
        {state.alternos.length < MAX_ALTERNOS && (
          <div className="mon-noprint" style={{ marginTop: 14 }}>
            <button onClick={() => addAlterno(region.key)} style={secNavButtonStyle}>+ Agregar alterno</button>
          </div>
        )}
      </div>

      <div style={{ ...blockTitle, margin: '28px 0 10px' }}>Bancos de sangre tipo II de la región ({bancos.length})</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {bancos.length === 0 && (
          <div style={{ fontSize: 13.5, color: 'oklch(55% 0.01 30)', fontStyle: 'italic' }}>
            No hay bancos de sangre tipo II registrados en la base de datos para esta región. Puedes agregar uno manualmente.
          </div>
        )}
        {bancos.map(b => (
          <BancoCard key={b.id} banco={b} setBancoField={setBancoField} removeBanco={removeBanco} />
        ))}
      </div>
      <div className="mon-noprint" style={{ marginTop: 14 }}>
        <button onClick={() => addBanco(region.key)} style={actaButtonStyleInline}>+ Agregar banco de sangre</button>
      </div>

      <div className="mon-noprint" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <button onClick={goPrev} style={secNavButtonStyle}>← Anterior</button>
        <button onClick={goNext} style={secNavButtonStyle}>Siguiente →</button>
      </div>
    </div>
  );
}
