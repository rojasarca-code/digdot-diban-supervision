import { useState } from 'react';
import { useSupervision } from './hooks/useSupervision.js';
import Sidebar from './components/Sidebar.jsx';
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

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeSection = view === 'checklist' ? sections.find(s => s.id === activeSectionId) : null;

  const guiaLabel = GUIA_LABEL[header.clasificacionBS] || 'Tipo II';

  const mobileTitle = view === 'header' ? 'Datos generales'
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
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div id="bs2-main" style={{ flex: 1, overflowY: 'auto', padding: '32px 40px 60px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {view === 'header' && (
            <HeaderForm header={header} setHeaderField={setHeaderField} setClasificacionBS={setClasificacionBS} />
          )}

          {view === 'checklist' && activeSection && (
            <ChecklistView
              section={activeSection}
              stats={sectionStats(activeSection)}
              answers={answers}
              handlers={itemHandlers}
              goPrevSection={() => goRelativeSection(-1)}
              goNextSection={() => goRelativeSection(1)}
            />
          )}

          {view === 'acta' && (
            <ActaView
              acta={buildActa()}
              guiaLabel={guiaLabel}
              goHeader={goHeader}
              saveActaToHistory={saveActaToHistory}
              printActa={printActa}
              exportActaExcel={exportActaExcel}
            />
          )}

          {view === 'historial' && (
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
