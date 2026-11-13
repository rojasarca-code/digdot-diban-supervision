import { EQUIPO_DIBAN, REGIONES, BANCOS_TIPO_II } from '../data/monitoreoData.js';

export const MON_KEY = 'bs2_monitoreo_v1';
export const MODULO_KEY = 'bs2_modulo';

export const ESTADOS_MONITOREO = ['PENDIENTE', 'CONTACTADO', 'MONITOREADO', 'SIN RESPUESTA'];
export const MAX_ALTERNOS = 3;

export const emptyContacto = () => ({ nombre: '', tel: '', correo: '' });

export function initialMonitoreo() {
  const team = {};
  EQUIPO_DIBAN.forEach(m => { team[m.id] = { participa: true }; });

  const regions = {};
  REGIONES.forEach(r => {
    regions[r.key] = {
      asignado: '',
      coordNombre: r.coordNombre,
      coordTel: r.coordTel,
      coordCorreo: r.coordCorreo,
      alternos: []
    };
  });

  const bancos = BANCOS_TIPO_II.map(b => ({ ...b, estado: 'PENDIENTE', obs: '', custom: false }));

  return { version: 1, team, regions, bancos };
}

export function loadMonitoreo() {
  const base = initialMonitoreo();
  try {
    const saved = JSON.parse(localStorage.getItem(MON_KEY) || 'null');
    if (!saved || saved.version !== 1) return base;

    const team = { ...base.team };
    Object.keys(team).forEach(id => { if (saved.team && saved.team[id]) team[id] = { ...team[id], ...saved.team[id] }; });

    const regions = {};
    Object.keys(base.regions).forEach(k => {
      regions[k] = { ...base.regions[k], ...(saved.regions && saved.regions[k]) };
      if (!Array.isArray(regions[k].alternos)) regions[k].alternos = [];
    });

    return {
      version: 1,
      team,
      regions,
      bancos: Array.isArray(saved.bancos) ? saved.bancos : base.bancos
    };
  } catch {
    return base;
  }
}

export function saveMonitoreo(mon) {
  try {
    localStorage.setItem(MON_KEY, JSON.stringify(mon));
  } catch {
    /* storage unavailable */
  }
}

export function loadModulo() {
  try {
    return localStorage.getItem(MODULO_KEY) === 'monitoreo' ? 'monitoreo' : 'supervision';
  } catch {
    return 'supervision';
  }
}

export function saveModulo(modulo) {
  try {
    localStorage.setItem(MODULO_KEY, modulo);
  } catch {
    /* storage unavailable */
  }
}

const filled = v => !!(v && String(v).trim());

/** Avance de registro de contactos de una región (coordinador + jefes de banco). */
export function regionStats(region, bancos) {
  let done = 0, total = 0;
  [region.coordNombre, region.coordTel, region.coordCorreo].forEach(v => { total++; if (filled(v)) done++; });
  bancos.forEach(b => [b.jefe, b.tel, b.correo].forEach(v => { total++; if (filled(v)) done++; }));
  return {
    done,
    total,
    pct: total ? Math.round((done / total) * 100) : 0,
    bancos: bancos.length,
    monitoreados: bancos.filter(b => b.estado === 'MONITOREADO').length
  };
}

/**
 * Reparte las regiones entre los miembros del equipo equilibrando el número de
 * bancos de sangre por persona (las regiones con más bancos se asignan primero
 * a quien tenga menos carga).
 */
export function distribuirRegiones(regionKeys, bancosPorRegion, miembros) {
  const out = {};
  if (!miembros.length) return out;
  const carga = {};
  miembros.forEach(id => { carga[id] = 0; });
  const orden = [...regionKeys].sort((a, b) => ((bancosPorRegion[b] || 0) - (bancosPorRegion[a] || 0)) || a.localeCompare(b));
  orden.forEach(k => {
    let mejor = miembros[0];
    miembros.forEach(id => { if (carga[id] < carga[mejor]) mejor = id; });
    out[k] = mejor;
    carga[mejor] += Math.max(1, bancosPorRegion[k] || 0);
  });
  return out;
}

export function iniciales(nombre) {
  const parts = String(nombre || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}
