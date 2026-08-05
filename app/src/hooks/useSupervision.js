import { useCallback, useEffect, useMemo, useState } from 'react';
import { SECTIONS } from '../data/checklistData.js';
import { DRAFT_KEY, HISTORY_KEY, emptyHeader, DISABLED_SECTIONS_IF_RESTRICTED, isRestrictedClasif } from '../lib/constants.js';
import { computeActa } from '../lib/acta.js';
import { buildFileNameBase, exportActaExcel as exportActaExcelFile } from '../lib/exportExcel.js';

function loadDraft() {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
  } catch {
    return null;
  }
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveDraft(header, answers) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ header, answers }));
  } catch {
    /* storage unavailable */
  }
}

export function useSupervision() {
  const draft = useMemo(loadDraft, []);

  const [header, setHeader] = useState(() => (draft && draft.header) ? { ...emptyHeader(), ...draft.header } : emptyHeader());
  const [answers, setAnswers] = useState(() => (draft && draft.answers) ? draft.answers : {});
  const [view, setView] = useState('header');
  const [activeSectionId, setActiveSectionId] = useState(SECTIONS[0].id);
  const [actaSnapshot, setActaSnapshot] = useState(null);
  const [history, setHistory] = useState(loadHistory);

  useEffect(() => {
    saveDraft(header, answers);
  }, [header, answers]);

  const setHeaderField = useCallback((key, value) => {
    setHeader(prev => ({ ...prev, [key]: value }));
  }, []);

  const setClasificacionBS = useCallback((value) => {
    setHeader(prev => ({ ...prev, clasificacionBS: value }));
    setActiveSectionId(prevId => {
      if (isRestrictedClasif(value) && DISABLED_SECTIONS_IF_RESTRICTED.includes(prevId)) {
        const fallback = SECTIONS.find(sec => !DISABLED_SECTIONS_IF_RESTRICTED.includes(sec.id));
        return fallback ? fallback.id : prevId;
      }
      return prevId;
    });
  }, []);

  const updateAnswers = useCallback((updater) => {
    setAnswers(prev => updater(prev));
  }, []);

  const setAnswer = useCallback((id, status) => {
    updateAnswers(prev => {
      const cur = prev[id] || {};
      const nextStatus = cur.status === status ? null : status;
      return { ...prev, [id]: { text: '', clasif: '', nivel: '', ...cur, status: nextStatus } };
    });
  }, [updateAnswers]);

  const setObsField = useCallback((id, field, value) => {
    updateAnswers(prev => ({
      ...prev,
      [id]: { status: 'no', text: '', clasif: '', nivel: '', ...prev[id], [field]: value }
    }));
  }, [updateAnswers]);

  const setValue = useCallback((id, value) => {
    updateAnswers(prev => ({ ...prev, [id]: { ...prev[id], value } }));
  }, [updateAnswers]);

  const setRangeField = useCallback((id, field, value) => {
    updateAnswers(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }, [updateAnswers]);

  const setPercent = useCallback((id, value) => {
    let n = value.replace(/[^0-9]/g, '');
    if (n !== '' && parseInt(n, 10) > 100) n = '100';
    updateAnswers(prev => ({ ...prev, [id]: { ...prev[id], value: n } }));
  }, [updateAnswers]);

  const setIntTextField = useCallback((id, field, value) => {
    updateAnswers(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }, [updateAnswers]);

  const setInstRow = useCallback((id, idx, field, value) => {
    updateAnswers(prev => {
      const cur = (prev[id] && prev[id].rows) || [];
      const rows = cur.slice();
      rows[idx] = { ...rows[idx], [field]: value };
      return { ...prev, [id]: { ...prev[id], rows } };
    });
  }, [updateAnswers]);

  const addInstRow = useCallback((id, max) => {
    updateAnswers(prev => {
      const cur = (prev[id] && prev[id].rows) || [];
      if (cur.length >= max) return prev;
      return { ...prev, [id]: { ...prev[id], rows: [...cur, { institucion: '', fecha: '' }] } };
    });
  }, [updateAnswers]);

  const removeInstRow = useCallback((id, idx) => {
    updateAnswers(prev => {
      const cur = (prev[id] && prev[id].rows) || [];
      const rows = cur.filter((_, i) => i !== idx);
      return { ...prev, [id]: { ...prev[id], rows } };
    });
  }, [updateAnswers]);

  const goSection = useCallback((id) => { setView('checklist'); setActiveSectionId(id); }, []);
  const goHeader = useCallback(() => setView('header'), []);
  const goHistorial = useCallback(() => setView('historial'), []);
  const goActa = useCallback(() => { setActaSnapshot({ generatedAt: Date.now() }); setView('acta'); }, []);

  const goRelativeSection = useCallback((delta) => {
    const restricted = isRestrictedClasif(header.clasificacionBS);
    let nextIdx = SECTIONS.findIndex(s => s.id === activeSectionId) + delta;
    while (nextIdx >= 0 && nextIdx < SECTIONS.length && restricted && DISABLED_SECTIONS_IF_RESTRICTED.includes(SECTIONS[nextIdx].id)) {
      nextIdx += delta;
    }
    if (nextIdx < 0) { goHeader(); return; }
    if (nextIdx >= SECTIONS.length) { goActa(); return; }
    goSection(SECTIONS[nextIdx].id);
  }, [activeSectionId, header.clasificacionBS, goHeader, goActa, goSection]);

  const newSupervision = useCallback(() => {
    if (!window.confirm('¿Limpiar todos los datos de esta supervisión? Esta acción no se puede deshacer (el historial guardado no se borra).')) return;
    localStorage.removeItem(DRAFT_KEY);
    setHeader(emptyHeader());
    setAnswers({});
    setView('header');
    setActiveSectionId(SECTIONS[0].id);
    setActaSnapshot(null);
  }, []);

  const buildActa = useCallback(() => (
    computeActa(SECTIONS, header, answers, actaSnapshot && actaSnapshot.generatedAt)
  ), [answers, header, actaSnapshot]);

  const printActa = useCallback(() => {
    const prevTitle = document.title;
    document.title = buildFileNameBase(header, buildActa());
    window.print();
    setTimeout(() => { document.title = prevTitle; }, 1000);
  }, [header, buildActa]);

  const exportActaExcel = useCallback(() => {
    exportActaExcelFile({ sections: SECTIONS, header, answers, history });
  }, [header, answers, history]);

  const sectionStats = useCallback((section) => {
    let answered = 0, obsCount = 0, total = 0;
    section.subs.forEach(sub => sub.groups.forEach(g => g.items.forEach(it => {
      total++;
      const a = answers[it.id];
      if (it.type === 'bool') {
        if (a && a.status) answered++;
        if (a && a.status === 'no') obsCount++;
      } else if (it.type === 'timerange') {
        if (a && a.from && a.to) answered++;
      } else if (it.type === 'intText') {
        if (a && (a.cant || a.prof)) answered++;
      } else if (it.type === 'institutionList') {
        if (a && a.rows && a.rows.length) answered++;
      } else {
        if (a && a.value) answered++;
      }
    })));
    return { answered, obsCount, total };
  }, [answers]);

  const saveActaToHistory = useCallback(() => {
    const acta = buildActa();
    setHistory(prev => {
      const next = [{
        id: Date.now(), header, answers,
        nombreIpress: acta.nombreIpress, actaNro: acta.actaNro,
        generatedDate: acta.generatedDate, generatedTime: acta.generatedTime,
        obsCount: acta.obsCount, pctCumplimiento: acta.pctCumplimiento
      }, ...prev].slice(0, 50);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, [buildActa, header, answers]);

  const loadFromHistory = useCallback((entry) => {
    setHeader({ ...emptyHeader(), ...entry.header });
    setAnswers(entry.answers);
    setActaSnapshot({ generatedAt: new Date(entry.generatedDate + ' ' + entry.generatedTime).getTime() || Date.now() });
    setView('acta');
  }, []);

  const deleteFromHistory = useCallback((id) => {
    setHistory(prev => {
      const next = prev.filter(h => h.id !== id);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  return {
    sections: SECTIONS, header, answers, view, activeSectionId, history,
    setHeaderField, setClasificacionBS, setAnswer, setObsField, setValue, setRangeField, setPercent, setIntTextField,
    setInstRow, addInstRow, removeInstRow,
    goSection, goHeader, goHistorial, goActa, goRelativeSection, newSupervision,
    printActa, exportActaExcel, saveActaToHistory, loadFromHistory, deleteFromHistory,
    sectionStats, buildActa
  };
}
