import { fmtDate, fmtTime } from './format.js';
import { nivelBadgeStyle } from './styles.js';

export function computeActa(sections, header, answers, generatedAt) {
  let siCount = 0, noCount = 0, total = 0;
  const observations = [];
  sections.forEach(sec => sec.subs.forEach(sub => sub.groups.forEach(g => g.items.forEach(it => {
    if (it.type !== 'bool') return;
    total++;
    const a = answers[it.id];
    if (a && a.status === 'si') siCount++;
    if (a && a.status === 'no') {
      noCount++;
      observations.push({
        sectionLabel: sec.id + '- ' + sec.title,
        subTitle: g.title ? sub.title + ' · ' + g.title : sub.title,
        label: it.label,
        text: a.text || '(sin descripción)',
        clasif: a.clasif || '—',
        nivel: a.nivel || '—',
        nivelBadgeStyle: nivelBadgeStyle(a.nivel)
      });
    }
  }))));
  const answeredTotal = siCount + noCount;
  const pct = answeredTotal > 0 ? Math.round((siCount / answeredTotal) * 100) : 0;
  const at = generatedAt || Date.now();
  return {
    nombreIpress: header.nombreIpress || '(sin especificar)', region: header.region || '—',
    codigoRenipress: header.codigoRenipress || '—', categoriaIpress: header.categoriaIpress || '—',
    institucionSector: header.institucionSector || '—', clasificacionBS: header.clasificacionBS || '—',
    actaNro: header.actaNro || '—', expedienteDigdot: header.expedienteDigdot || '—',
    tipoSupervision: header.tipoSupervision || '—', modalidad: header.modalidad || '—',
    supervisorDiban: header.supervisorDiban || '—',
    fechaHoraInicio: (header.fechaSup || '—') + (header.horaInicio ? ' · ' + header.horaInicio : ''),
    totalItems: total, pctCumplimiento: pct, obsCount: noCount, hasObs: noCount > 0, noObs: noCount === 0,
    observations, generatedDate: fmtDate(at), generatedTime: fmtTime(at)
  };
}
