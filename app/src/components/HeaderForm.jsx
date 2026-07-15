import { labelStyle, inputStyle } from '../lib/styles.js';
import { CATEGORIA_IPRESS, INSTITUCION_SECTOR, CLASIFICACION_BS, TIPO_SUPERVISION, MODALIDAD } from '../lib/constants.js';

function Field({ label, children }) {
  return (
    <div>
      <div style={labelStyle}>{label}</div>
      {children}
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <Field label={label}>
      <select value={value} onChange={onChange} style={inputStyle}>
        <option value="">Seleccionar…</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </Field>
  );
}

export default function HeaderForm({ header, setHeaderField }) {
  const set = (key) => (e) => setHeaderField(key, e.target.value);

  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Datos generales de la supervisión</div>
      <div style={{ fontSize: 14, color: 'oklch(50% 0.01 30)', marginBottom: 28 }}>Información de la institución supervisada y datos de la visita.</div>

      <div style={{ background: '#fff', border: '1px solid oklch(90% 0.006 90)', borderRadius: 14, padding: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Field label="Región">
          <input value={header.region} onChange={set('region')} placeholder="Ej. Lima" style={inputStyle} />
        </Field>
        <Field label="Nombre de la IPRESS">
          <input value={header.nombreIpress} onChange={set('nombreIpress')} placeholder="Nombre del establecimiento" style={inputStyle} />
        </Field>
        <Field label="Código único (RENIPRESS)">
          <input value={header.codigoRenipress} onChange={set('codigoRenipress')} placeholder="00000" style={inputStyle} />
        </Field>
        <SelectField label="Categoría de la IPRESS" value={header.categoriaIpress} onChange={set('categoriaIpress')} options={CATEGORIA_IPRESS} />
        <SelectField label="Institución (sector)" value={header.institucionSector} onChange={set('institucionSector')} options={INSTITUCION_SECTOR} />
        <SelectField label="Clasificación de banco de sangre" value={header.clasificacionBS} onChange={set('clasificacionBS')} options={CLASIFICACION_BS} />

        <div style={{ gridColumn: '1/-1', height: 1, background: 'oklch(92% 0.006 90)', margin: '4px 0' }} />

        <Field label="N° de Acta de supervisión">
          <input value={header.actaNro} onChange={set('actaNro')} placeholder="Ej. 045-2026-DIBAN" style={inputStyle} />
        </Field>
        <Field label="Expediente DIGDOT">
          <input value={header.expedienteDigdot} onChange={set('expedienteDigdot')} placeholder="N° de expediente" style={inputStyle} />
        </Field>
        <SelectField label="Tipo de supervisión" value={header.tipoSupervision} onChange={set('tipoSupervision')} options={TIPO_SUPERVISION} />
        <SelectField label="Modalidad" value={header.modalidad} onChange={set('modalidad')} options={MODALIDAD} />
        <Field label="Supervisor DIBAN">
          <input value={header.supervisorDiban} onChange={set('supervisorDiban')} placeholder="Nombre completo" style={inputStyle} />
        </Field>
        <Field label="Fecha de supervisión">
          <input type="date" value={header.fechaSup} onChange={set('fechaSup')} style={inputStyle} />
        </Field>
        <Field label="Hora de inicio">
          <input type="time" value={header.horaInicio} onChange={set('horaInicio')} style={inputStyle} />
        </Field>
      </div>

      <div style={{ marginTop: 24, padding: '18px 20px', background: 'oklch(96% 0.03 25)', border: '1px solid oklch(88% 0.06 25)', borderRadius: 12, fontSize: 13, color: 'oklch(35% 0.1 25)' }}>
        Completa estos datos y luego recorre las secciones I–XIV del panel izquierdo marcando cada ítem como <b>Sí</b> o <b>No</b>. Cuando termines, usa <b>«Generar Acta de Supervisión»</b> para producir el documento final.
      </div>
    </div>
  );
}
