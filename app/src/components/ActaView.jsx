import logo from '../assets/minsa-logo.png';
import { secNavButtonStyle, actaButtonStyleInline } from '../lib/styles.js';

export default function ActaView({ acta, goHeader, saveActaToHistory, printActa }) {
  return (
    <div>
      <div id="bs2-topbar-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginBottom: 16 }}>
        <button onClick={goHeader} style={secNavButtonStyle}>← Volver a editar</button>
        <button onClick={saveActaToHistory} style={secNavButtonStyle}>💾 Guardar en historial</button>
        <button onClick={printActa} style={actaButtonStyleInline}>🖨 Imprimir / Exportar PDF</button>
      </div>

      <div className="bs2-acta-card" style={{ background: '#fff', border: '1px solid oklch(90% 0.006 90)', borderRadius: 14, padding: '44px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px solid oklch(52% 0.19 25)', paddingBottom: 16, marginBottom: 24 }}>
          <img src={logo} alt="MINSA Perú" style={{ height: 34, objectFit: 'contain' }} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>ACTA DE SUPERVISIÓN</div>
            <div style={{ fontSize: 12.5, color: 'oklch(50% 0.01 30)', fontWeight: 600 }}>Banco de Sangre Tipo II · DIBAN – DIGDOT – MINSA</div>
          </div>
        </div>

        <div className="bs2-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 32px', fontSize: 13.5, marginBottom: 20 }}>
          <div><b>Institución:</b> {acta.nombreIpress}</div>
          <div><b>Región:</b> {acta.region}</div>
          <div><b>Código RENIPRESS:</b> {acta.codigoRenipress}</div>
          <div><b>Categoría IPRESS:</b> {acta.categoriaIpress}</div>
          <div><b>Institución (sector):</b> {acta.institucionSector}</div>
          <div><b>Clasificación BS:</b> {acta.clasificacionBS}</div>
          <div><b>N° Acta:</b> {acta.actaNro}</div>
          <div><b>Expediente DIGDOT:</b> {acta.expedienteDigdot}</div>
          <div><b>Tipo de supervisión:</b> {acta.tipoSupervision}</div>
          <div><b>Modalidad:</b> {acta.modalidad}</div>
          <div><b>Supervisor DIBAN:</b> {acta.supervisorDiban}</div>
          <div><b>Fecha / hora de inicio:</b> {acta.fechaHoraInicio}</div>
        </div>

        <div style={{ display: 'flex', gap: 14, marginBottom: 26 }}>
          <div style={{ flex: 1, background: 'oklch(97% 0.01 90)', borderRadius: 10, padding: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{acta.totalItems}</div>
            <div style={{ fontSize: 11.5, color: 'oklch(50% 0.01 30)' }}>Ítems evaluados</div>
          </div>
          <div style={{ flex: 1, background: 'oklch(97% 0.05 150)', borderRadius: 10, padding: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'oklch(45% 0.14 150)' }}>{acta.pctCumplimiento}%</div>
            <div style={{ fontSize: 11.5, color: 'oklch(50% 0.01 30)' }}>% Cumplimiento</div>
          </div>
          <div style={{ flex: 1, background: 'oklch(96% 0.03 25)', borderRadius: 10, padding: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'oklch(45% 0.15 25)' }}>{acta.obsCount}</div>
            <div style={{ fontSize: 11.5, color: 'oklch(50% 0.01 30)' }}>Observaciones</div>
          </div>
        </div>

        <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>Observaciones y hallazgos</div>
        {acta.hasObs && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 8 }}>
            {acta.observations.map((obs, idx) => (
              <div key={idx} style={{ border: '1px solid oklch(90% 0.006 90)', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'oklch(52% 0.19 25)', textTransform: 'uppercase', letterSpacing: '.03em', marginBottom: 4 }}>{obs.sectionLabel} · {obs.subTitle}</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{obs.label}</div>
                <div style={{ fontSize: 13.5, color: '#333', marginBottom: 8, whiteSpace: 'pre-wrap' }}>{obs.text}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, background: 'oklch(94% 0.02 25)', color: 'oklch(40% 0.1 25)', borderRadius: 6, padding: '3px 9px' }}>{obs.clasif}</span>
                  <span style={obs.nivelBadgeStyle}>{obs.nivel}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {acta.noObs && (
          <div style={{ fontSize: 13.5, color: 'oklch(55% 0.01 30)', fontStyle: 'italic', marginBottom: 8 }}>Sin observaciones registradas — todos los ítems evaluados cumplen.</div>
        )}

        <div className="bs2-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 56 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #333', paddingTop: 8, fontSize: 13 }}>{acta.supervisorDiban}<br />Supervisor DIBAN</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #333', paddingTop: 8, fontSize: 13 }}>Responsable IPRESS<br />{acta.nombreIpress}</div>
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: 11.5, color: 'oklch(55% 0.01 30)', marginTop: 28 }}>Acta generada el {acta.generatedDate} a las {acta.generatedTime}</div>
      </div>
    </div>
  );
}
