import { SECTIONS as SECTIONS_TIPO_II } from '../data/checklistData.js';
import { SECTIONS_TIPO_I } from '../data/checklistDataITipoI.js';

/*
 * Selección y filtrado de la guía de supervisión según la clasificación del
 * banco de sangre.
 *
 *  · Tipo II  → guía completa (checklistData.js), todas las opciones habilitadas.
 *  · Tipo I‑A / I‑B / I‑C → guía de bancos tipo I (checklistDataITipoI.js),
 *    filtrando los nodos cuya propiedad `aplica` no incluye la subclasificación
 *    seleccionada.
 *
 * Un nodo (sub, grupo o ítem) sin `aplica` aplica siempre.
 */

const TIPO_I = ['IA', 'IB', 'IC'];

export const GUIA_LABEL = {
  IA: 'Tipo I-A',
  IB: 'Tipo I-B',
  IC: 'Tipo I-C',
  II: 'Tipo II'
};

export const isTipoI = clasif => TIPO_I.includes(clasif);

const applies = (node, clasif) => !node.aplica || node.aplica.includes(clasif);

function filterGuide(sections, clasif) {
  return sections
    .filter(sec => applies(sec, clasif))
    .map(sec => ({
      ...sec,
      subs: sec.subs
        .filter(sub => applies(sub, clasif))
        .map(sub => ({
          ...sub,
          groups: sub.groups
            .filter(grp => applies(grp, clasif))
            .map(grp => ({
              ...grp,
              items: grp.items.filter(it => applies(it, clasif))
            }))
            .filter(grp => grp.items.length > 0)
        }))
        .filter(sub => sub.groups.length > 0)
    }))
    .filter(sec => sec.subs.length > 0);
}

/**
 * Devuelve el arreglo de secciones que corresponde a la clasificación indicada.
 * Sin clasificación (o Tipo II) se devuelve la guía completa.
 */
export function resolveGuide(clasif) {
  if (isTipoI(clasif)) return filterGuide(SECTIONS_TIPO_I, clasif);
  return SECTIONS_TIPO_II;
}

export { SECTIONS_TIPO_II, SECTIONS_TIPO_I };
