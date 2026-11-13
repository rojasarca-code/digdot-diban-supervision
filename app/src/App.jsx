import { useEffect, useState } from 'react';
import { useSupervision } from './hooks/useSupervision.js';
import { useMonitoreo } from './hooks/useMonitoreo.js';
import { REGIONES } from './data/monitoreoData.js';
import { loadModulo, saveModulo } from './lib/monitoreo.js';
import Sidebar from './components/Sidebar.jsx';
import MonitoreoSidebar from './components/MonitoreoSidebar.jsx';
import MonitoreoResumen from './components/MonitoreoResumen.jsx';
import MonitoreoRegion from './components/MonitoreoRegion.jsx';
import HeaderForm from './components/HeaderForm.jsx';
import ChecklistView from './components/ChecklistView.jsx';
import ActaView from './components/ActaView.jsx';
import HistorialView from './components/HistorialView.jsx';
import { GUIA_LABEL } from './lib/guides.js';

export default function App() {
  const {
    sections, header, answers, view, activeSectionId, history,
    setHeaderField, setClasificacionBS, setAnswer, setObsField, setValue, setRangeField, setPercent, setIntTextField,
    setInstRow, addInstRow, removeInstRow,
    goSection, goHeader, goHistorial, goActa, goRelativeSection, newSupervision,
    printActa, exportActaExcel, saveActaToHistory, loadFromHistory, deleteFromHistory,
    sectionStats, buildActa
  } = useSupervision();

  const monitoreo = useMonitoreo();
  const [modulo, setModuloState] = useState(loadModulo);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const setModulo = (m) => {
    setModuloState(m);
    saveModulo(m);
    setSidebarOpen(false);
  };

  useEffect(() => {
    const main = document.getElementById('bs2-main');
    if (main) main.scrollTo(0, 0);
  }, [modulo, monitoreo.view, monitoreo.activeRegion]);

  const enMonitoreo = modulo === 'monitoreo';
  const regionActiva = REGIONES.find(r => r.key === monitoreo.activeRegion) || REGIONES[0];

  const activeSection = view === 'checklist' ? sections.find(s => s.id === activeSectionId) : null;

  const guiaLabel = GUIA_LABEL[header.clasificacionBS] || 'Tipo II';

  const mobileTitle = enMonitoreo
    ? (monitoreo.view === 'region' ? regionActiva.key : 'Monitoreo El Niño · Bancos Tipo II')
    : view === 'header' ? 'Datos generales'
    : view === 'checklist' && activeSection ? `${activeSection.id}  ${activeSection.title}`
    : view === 'acta' ? 'Acta de Supervisión'
    : view === 'historial' ? 'Historial'
    : `Supervisión Bancos de Sangre ${guiaLabel}`;

  const itemHandlers = {
    onSetAnswer: setAnswer,
    onObsField: setObsField,
    onSetValue: setValue,
    onSetRangeField: setRangeField,
    onSetPercent: setPercent,
    onSetIntTextField: setIntTextField,
    onSetInstRow: setInstRow,
    onAddInstRow: addInstRow,
    onRemoveInstRow: removeInstRow
  };

  return (
    <div id="bs2-root" style={{ display: 'flex', height: '100vh', width: '100%', background: 'oklch(98% 0.004 90)', fontFamily: "'Manrope',sans-serif", color: 'oklch(22% 0.01 30)' }}>
      <div id="bs2-mobile-topbar">
        <button onClick={() => setSidebarOpen(true)} aria-label="Abrir menú">☰</button>
        <div className="bs2-mobile-title">{mobileTitle}</div>
      </div>

      {sidebarOpen && <div className="bs2-overlay" onClick={() => setSidebarOpen(false)} />}

      {enMonitoreo ? (
        <MonitoreoSidebar
          modulo={modulo}
          setModulo={setModulo}
          mon={monitoreo.mon}
          view={monitoreo.view}
          activeRegion={monitoreo.activeRegion}
          filtro={monitoreo.filtro}
          setFiltro={monitoreo.setFiltro}
          visibleRegions={monitoreo.visibleRegions}
          bancosPorRegion={monitoreo.bancosPorRegion}
          regionStatsOf={monitoreo.regionStatsOf}
          totals={monitoreo.totals}
          goResumen={monitoreo.goResumen}
          goRegion={monitoreo.goRegion}
          exportExcel={monitoreo.exportExcel}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      ) : (
        <Sidebar
          sections={sections}
          sectionStats={sectionStats}
          view={view}
          activeSectionId={activeSectionId}
          header={header}
          guiaLabel={guiaLabel}
          goHeader={goHeader}
          goSection={goSection}
          goActa={goActa}
          goHistorial={goHistorial}
          newSupervision={newSupervision}
          historyCount={history.length}
          modulo={modulo}
          setModulo={setModulo}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      <div id="bs2-main" style={{ flex: 1, overflowY: 'auto', padding: '32px 40px 60px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {enMonitoreo && monitoreo.view === 'resumen' && (
            <MonitoreoResumen
              mon={monitoreo.mon}
              totals={monitoreo.totals}
              bancosPorRegion={monitoreo.bancosPorRegion}
              regionStatsOf={monitoreo.regionStatsOf}
              setParticipa={monitoreo.setParticipa}
              assignRegion={monitoreo.assignRegion}
              goRegion={monitoreo.goRegion}
              autoDistribuir={monitoreo.autoDistribuir}
              limpiarAsignaciones={monitoreo.limpiarAsignaciones}
              resetMonitoreo={monitoreo.resetMonitoreo}
              exportExcel={monitoreo.exportExcel}
            />
          )}

          {enMonitoreo && monitoreo.view === 'region' && (
            <MonitoreoRegion
              region={regionActiva}
              state={monitoreo.mon.regions[regionActiva.key]}
              team={monitoreo.mon.team}
              bancos={monitoreo.bancosPorRegion[regionActiva.key] || []}
              stats={monitoreo.regionStatsOf(regionActiva.key)}
              setRegionField={monitoreo.setRegionField}
              assignRegion={monitoreo.assignRegion}
              setAlterno={monitoreo.setAlterno}
              addAlterno={monitoreo.addAlterno}
              removeAlterno={monitoreo.removeAlterno}
              setBancoField={monitoreo.setBancoField}
              addBanco={monitoreo.addBanco}
              removeBanco={monitoreo.removeBanco}
              goPrev={() => monitoreo.goRelativeRegion(-1)}
              goNext={() => monitoreo.goRelativeRegion(1)}
            />
          )}

          {!enMonitoreo && view === 'header' && (
            <HeaderForm header={header} setHeaderField={setHeaderField} setClasificacionBS={setClasificacionBS} />
          )}

          {!enMonitoreo && view === 'checklist' && activeSection && (
            <ChecklistView
              section={activeSection}
              stats={sectionStats(activeSection)}
              answers={answers}
              handlers={itemHandlers}
              goPrevSection={() => goRelativeSection(-1)}
              goNextSection={() => goRelativeSection(1)}
            />
          )}

          {!enMonitoreo && view === 'acta' && (
            <ActaView
              acta={buildActa()}
              guiaLabel={guiaLabel}
              goHeader={goHeader}
              saveActaToHistory={saveActaToHistory}
              printActa={printActa}
              exportActaExcel={exportActaExcel}
            />
          )}

          {!enMonitoreo && view === 'historial' && (
            <HistorialView
              history={history}
              loadFromHistory={loadFromHistory}
              deleteFromHistory={deleteFromHistory}
            />
          )}
        </div>
      </div>
    </div>
  );
}
