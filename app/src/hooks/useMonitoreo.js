import { useCallback, useEffect, useMemo, useState } from 'react';
import { EQUIPO_DIBAN, REGIONES } from '../data/monitoreoData.js';
import {
  MAX_ALTERNOS, emptyContacto, initialMonitoreo, loadMonitoreo, saveMonitoreo,
  regionStats, distribuirRegiones
} from '../lib/monitoreo.js';
import { exportMonitoreoExcel as exportMonitoreoExcelFile } from '../lib/exportMonitoreo.js';

export function useMonitoreo() {
  const [mon, setMon] = useState(loadMonitoreo);
  const [view, setView] = useState('resumen'); // 'resumen' | 'region'
  const [activeRegion, setActiveRegion] = useState(REGIONES[0].key);
  const [filtro, setFiltro] = useState(''); // '' = todas | 'SIN_ASIGNAR' | id de miembro DIBAN

  useEffect(() => { saveMonitoreo(mon); }, [mon]);

  const bancosPorRegion = useMemo(() => {
    const map = {};
    REGIONES.forEach(r => { map[r.key] = []; });
    mon.bancos.forEach(b => { (map[b.region] || (map[b.region] = [])).push(b); });
    return map;
  }, [mon.bancos]);

  const regionStatsOf = useCallback(
    (key) => regionStats(mon.regions[key], bancosPorRegion[key] || []),
    [mon.regions, bancosPorRegion]
  );

  const visibleRegions = useMemo(() => REGIONES.filter(r => {
    const asignado = mon.regions[r.key].asignado;
    if (!filtro) return true;
    if (filtro === 'SIN_ASIGNAR') return !asignado;
    return asignado === filtro;
  }), [mon.regions, filtro]);

  const patchRegion = useCallback((key, patch) => {
    setMon(prev => ({ ...prev, regions: { ...prev.regions, [key]: { ...prev.regions[key], ...patch } } }));
  }, []);

  const setRegionField = useCallback((key, field, value) => patchRegion(key, { [field]: value }), [patchRegion]);
  const assignRegion = useCallback((key, memberId) => patchRegion(key, { asignado: memberId }), [patchRegion]);

  const setAlterno = useCallback((key, idx, field, value) => {
    setMon(prev => {
      const cur = prev.regions[key].alternos.slice();
      cur[idx] = { ...cur[idx], [field]: value };
      return { ...prev, regions: { ...prev.regions, [key]: { ...prev.regions[key], alternos: cur } } };
    });
  }, []);

  const addAlterno = useCallback((key) => {
    setMon(prev => {
      const cur = prev.regions[key].alternos;
      if (cur.length >= MAX_ALTERNOS) return prev;
      return { ...prev, regions: { ...prev.regions, [key]: { ...prev.regions[key], alternos: [...cur, emptyContacto()] } } };
    });
  }, []);

  const removeAlterno = useCallback((key, idx) => {
    setMon(prev => {
      const cur = prev.regions[key].alternos.filter((_, i) => i !== idx);
      return { ...prev, regions: { ...prev.regions, [key]: { ...prev.regions[key], alternos: cur } } };
    });
  }, []);

  const setBancoField = useCallback((id, field, value) => {
    setMon(prev => ({ ...prev, bancos: prev.bancos.map(b => (b.id === id ? { ...b, [field]: value } : b)) }));
  }, []);

  const addBanco = useCallback((regionKey) => {
    const meta = REGIONES.find(r => r.key === regionKey);
    setMon(prev => ({
      ...prev,
      bancos: [...prev.bancos, {
        id: 'c' + Date.now(), renipress: '', region: regionKey, dirsa: meta ? meta.entidad : '', ipress: '',
        categoria: '', subsector: '', provincia: '', distrito: '', jefe: '', tel: '', correo: '', nota: '',
        estado: 'PENDIENTE', obs: '', custom: true
      }]
    }));
  }, []);

  const removeBanco = useCallback((id) => {
    if (!window.confirm('¿Quitar este banco de sangre de la lista?')) return;
    setMon(prev => ({ ...prev, bancos: prev.bancos.filter(b => b.id !== id) }));
  }, []);

  const setParticipa = useCallback((memberId, value) => {
    setMon(prev => ({ ...prev, team: { ...prev.team, [memberId]: { ...prev.team[memberId], participa: value } } }));
  }, []);

  const autoDistribuir = useCallback(() => {
    const miembros = EQUIPO_DIBAN.filter(m => mon.team[m.id] && mon.team[m.id].participa).map(m => m.id);
    if (!miembros.length) {
      window.alert('Marca al menos un integrante del equipo DIBAN como participante.');
      return;
    }
    const hayAsignadas = REGIONES.some(r => mon.regions[r.key].asignado);
    if (hayAsignadas && !window.confirm('Ya hay regiones asignadas. ¿Reemplazarlas con una distribución automática equilibrada por número de bancos?')) return;
    const conteo = {};
    REGIONES.forEach(r => { conteo[r.key] = (bancosPorRegion[r.key] || []).length; });
    const reparto = distribuirRegiones(REGIONES.map(r => r.key), conteo, miembros);
    setMon(prev => {
      const regions = { ...prev.regions };
      Object.keys(regions).forEach(k => { regions[k] = { ...regions[k], asignado: reparto[k] || '' }; });
      return { ...prev, regions };
    });
  }, [mon.team, mon.regions, bancosPorRegion]);

  const limpiarAsignaciones = useCallback(() => {
    if (!window.confirm('¿Quitar la asignación de todas las regiones?')) return;
    setMon(prev => {
      const regions = { ...prev.regions };
      Object.keys(regions).forEach(k => { regions[k] = { ...regions[k], asignado: '' }; });
      return { ...prev, regions };
    });
  }, []);

  const resetMonitoreo = useCallback(() => {
    if (!window.confirm('¿Restablecer toda la lista de monitoreo a los datos de origen? Se perderán las asignaciones y los datos que hayas registrado o modificado.')) return;
    setMon(initialMonitoreo());
    setFiltro('');
    setView('resumen');
  }, []);

  const goResumen = useCallback(() => setView('resumen'), []);
  const goRegion = useCallback((key) => { setActiveRegion(key); setView('region'); }, []);

  const goRelativeRegion = useCallback((delta) => {
    const list = visibleRegions.length ? visibleRegions : REGIONES;
    const idx = list.findIndex(r => r.key === activeRegion);
    const next = idx + delta;
    if (next < 0 || next >= list.length) { setView('resumen'); return; }
    setActiveRegion(list[next].key);
  }, [visibleRegions, activeRegion]);

  const exportExcel = useCallback(() => {
    exportMonitoreoExcelFile({ mon });
  }, [mon]);

  const totals = useMemo(() => {
    const asignadas = REGIONES.filter(r => mon.regions[r.key].asignado).length;
    const monitoreados = mon.bancos.filter(b => b.estado === 'MONITOREADO').length;
    return { regiones: REGIONES.length, asignadas, bancos: mon.bancos.length, monitoreados };
  }, [mon.regions, mon.bancos]);

  return {
    mon, view, activeRegion, filtro, setFiltro, bancosPorRegion, visibleRegions, totals,
    regionStatsOf, setRegionField, assignRegion, setAlterno, addAlterno, removeAlterno,
    setBancoField, addBanco, removeBanco, setParticipa, autoDistribuir, limpiarAsignaciones,
    resetMonitoreo, goResumen, goRegion, goRelativeRegion, exportExcel
  };
}
