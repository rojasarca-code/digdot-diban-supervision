import { answerButtonStyle } from '../lib/styles.js';
import { CLASIF_OBS, NIVEL_RIESGO } from '../lib/constants.js';

const rowStyle = { display: 'flex', alignItems: 'center', gap: 16 };
const labelTextStyle = { flex: 1, fontSize: 14.5, lineHeight: 1.35 };
const numberInputStyle = { width: 110, border: '1px solid oklch(85% 0.006 90)', borderRadius: 8, padding: '8px 10px', fontSize: 14, fontFamily: 'Manrope,sans-serif', textAlign: 'right', flexShrink: 0 };
const textInputStyle = { width: 260, border: '1px solid oklch(85% 0.006 90)', borderRadius: 8, padding: '8px 10px', fontSize: 14, fontFamily: 'Manrope,sans-serif', flexShrink: 0 };
const timeInputStyle = { border: '1px solid oklch(85% 0.006 90)', borderRadius: 8, padding: '8px 10px', fontSize: 14, fontFamily: 'Manrope,sans-serif' };

function BoolItem({ item, answer, onSetAnswer, onObsField }) {
  const status = answer.status;
  const showObs = status === 'no';
  return (
    <>
      <div style={rowStyle}>
        <div style={labelTextStyle}>{item.label}</div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={() => onSetAnswer(item.id, 'si')} style={answerButtonStyle('si', status === 'si')}>Sí</button>
          <button onClick={() => onSetAnswer(item.id, 'no')} style={answerButtonStyle('no', status === 'no')}>No</button>
        </div>
      </div>
      {showObs && (
        <div style={{ marginTop: 10, background: 'oklch(97% 0.02 25)', border: '1px solid oklch(90% 0.05 25)', borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: 'oklch(45% 0.15 25)', marginBottom: 6 }}>OBSERVACIÓN / HALLAZGO</div>
          <textarea
            value={answer.text || ''}
            onChange={e => onObsField(item.id, 'text', e.target.value)}
            placeholder="Describa la observación o hallazgo…"
            style={{ width: '100%', minHeight: 56, border: '1px solid oklch(88% 0.006 90)', borderRadius: 8, padding: '9px 11px', fontFamily: 'Manrope,sans-serif', fontSize: 13.5, resize: 'vertical', background: '#fff' }}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <select value={answer.clasif || ''} onChange={e => onObsField(item.id, 'clasif', e.target.value)} style={{ flex: 1, border: '1px solid oklch(88% 0.006 90)', borderRadius: 8, padding: '8px 10px', fontSize: 13, background: '#fff', fontFamily: 'Manrope,sans-serif' }}>
              <option value="">Clasificación</option>
              {CLASIF_OBS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <select value={answer.nivel || ''} onChange={e => onObsField(item.id, 'nivel', e.target.value)} style={{ flex: 1, border: '1px solid oklch(88% 0.006 90)', borderRadius: 8, padding: '8px 10px', fontSize: 13, background: '#fff', fontFamily: 'Manrope,sans-serif' }}>
              <option value="">Nivel de riesgo</option>
              {NIVEL_RIESGO.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
      )}
    </>
  );
}

function IntItem({ item, answer, onSetValue }) {
  return (
    <div style={rowStyle}>
      <div style={labelTextStyle}>{item.label}</div>
      <input type="number" min="0" step="1" inputMode="numeric" value={answer.value || ''}
        onChange={e => onSetValue(item.id, e.target.value.replace(/[^0-9]/g, ''))}
        placeholder="0" style={numberInputStyle} />
    </div>
  );
}

function TextItem({ item, answer, onSetValue }) {
  return (
    <div style={rowStyle}>
      <div style={labelTextStyle}>{item.label}</div>
      <input type="text" value={answer.value || ''} onChange={e => onSetValue(item.id, e.target.value)}
        placeholder="Completar…" style={textInputStyle} />
    </div>
  );
}

function TimerangeItem({ item, answer, onSetRangeField }) {
  return (
    <div style={rowStyle}>
      <div style={labelTextStyle}>{item.label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <input type="time" value={answer.from || ''} onChange={e => onSetRangeField(item.id, 'from', e.target.value)} style={timeInputStyle} />
        <span style={{ fontSize: 12.5, color: 'oklch(55% 0.01 30)' }}>hasta</span>
        <input type="time" value={answer.to || ''} onChange={e => onSetRangeField(item.id, 'to', e.target.value)} style={timeInputStyle} />
      </div>
    </div>
  );
}

function PercentItem({ item, answer, onSetPercent }) {
  return (
    <div style={rowStyle}>
      <div style={labelTextStyle}>{item.label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <input type="number" min="0" max="100" step="1" inputMode="numeric" value={answer.value || ''}
          onChange={e => onSetPercent(item.id, e.target.value)}
          placeholder="0" style={{ width: 80, border: '1px solid oklch(85% 0.006 90)', borderRadius: 8, padding: '8px 10px', fontSize: 14, fontFamily: 'Manrope,sans-serif', textAlign: 'right' }} />
        <span style={{ fontSize: 14, color: 'oklch(45% 0.01 30)', fontWeight: 700 }}>%</span>
      </div>
    </div>
  );
}

function IntTextItem({ item, answer, onSetIntTextField }) {
  return (
    <div style={rowStyle}>
      <div style={labelTextStyle}>{item.label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <input type="number" min="0" step="1" inputMode="numeric" value={answer.cant || ''}
          onChange={e => onSetIntTextField(item.id, 'cant', e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="Cant." style={{ width: 80, border: '1px solid oklch(85% 0.006 90)', borderRadius: 8, padding: '8px 10px', fontSize: 14, fontFamily: 'Manrope,sans-serif', textAlign: 'right' }} />
        <input type="text" value={answer.prof || ''} onChange={e => onSetIntTextField(item.id, 'prof', e.target.value)}
          placeholder="Profesión" style={{ width: 180, border: '1px solid oklch(85% 0.006 90)', borderRadius: 8, padding: '8px 10px', fontSize: 14, fontFamily: 'Manrope,sans-serif' }} />
      </div>
    </div>
  );
}

function InstitutionListItem({ item, answer, onSetInstRow, onAddInstRow, onRemoveInstRow }) {
  const rows = answer.rows || [];
  const canAdd = rows.length < item.max;
  return (
    <div>
      <div style={{ fontSize: 14.5, lineHeight: 1.35, marginBottom: 10 }}>{item.label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map((row, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="text" value={row.institucion || ''} onChange={e => onSetInstRow(item.id, idx, 'institucion', e.target.value)}
              placeholder="Institución" style={{ flex: 1, border: '1px solid oklch(85% 0.006 90)', borderRadius: 8, padding: '8px 10px', fontSize: 13.5, fontFamily: 'Manrope,sans-serif' }} />
            <input type="date" value={row.fecha || ''} onChange={e => onSetInstRow(item.id, idx, 'fecha', e.target.value)}
              style={{ border: '1px solid oklch(85% 0.006 90)', borderRadius: 8, padding: '8px 10px', fontSize: 13.5, fontFamily: 'Manrope,sans-serif' }} />
            <button onClick={() => onRemoveInstRow(item.id, idx)} style={{ background: 'none', border: 'none', color: 'oklch(55% 0.15 25)', fontSize: 16, cursor: 'pointer', padding: '4px 8px' }}>✕</button>
          </div>
        ))}
      </div>
      {canAdd && (
        <button onClick={() => onAddInstRow(item.id, item.max)} style={{ marginTop: 8, background: 'oklch(96% 0.03 25)', border: '1px solid oklch(88% 0.06 25)', color: 'oklch(45% 0.15 25)', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Manrope,sans-serif' }}>+ Agregar institución</button>
      )}
    </div>
  );
}

export default function ChecklistItem({ item, answer, handlers }) {
  const { onSetAnswer, onObsField, onSetValue, onSetRangeField, onSetPercent, onSetIntTextField, onSetInstRow, onAddInstRow, onRemoveInstRow } = handlers;
  let body;
  switch (item.type) {
    case 'bool':
      body = <BoolItem item={item} answer={answer} onSetAnswer={onSetAnswer} onObsField={onObsField} />;
      break;
    case 'int':
      body = <IntItem item={item} answer={answer} onSetValue={onSetValue} />;
      break;
    case 'text':
      body = <TextItem item={item} answer={answer} onSetValue={onSetValue} />;
      break;
    case 'timerange':
      body = <TimerangeItem item={item} answer={answer} onSetRangeField={onSetRangeField} />;
      break;
    case 'percent':
      body = <PercentItem item={item} answer={answer} onSetPercent={onSetPercent} />;
      break;
    case 'intText':
      body = <IntTextItem item={item} answer={answer} onSetIntTextField={onSetIntTextField} />;
      break;
    case 'institutionList':
      body = <InstitutionListItem item={item} answer={answer} onSetInstRow={onSetInstRow} onAddInstRow={onAddInstRow} onRemoveInstRow={onRemoveInstRow} />;
      break;
    default:
      body = <TextItem item={item} answer={answer} onSetValue={onSetValue} />;
  }
  return (
    <div style={{ borderBottom: '1px solid oklch(94% 0.004 90)', padding: '12px 2px' }}>
      {body}
    </div>
  );
}
