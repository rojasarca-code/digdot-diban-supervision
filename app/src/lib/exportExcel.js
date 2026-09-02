import { computeActa } from './acta.js';
import { GUIA_LABEL } from './guides.js';

function escXml(v) {
  return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function xmlCell(v, styleId) {
  const e = escXml(v);
  return '<Cell' + (styleId ? ' ss:StyleID="' + styleId + '"' : '') + '><Data ss:Type="String">' + e + '</Data></Cell>';
}

function xmlRow(cells, mergeFirstAcross) {
  let out = '<Row>';
  cells.forEach((c, i) => {
    const val = Array.isArray(c) ? c[0] : c;
    const style = Array.isArray(c) ? c[1] : null;
    if (i === 0 && mergeFirstAcross) {
      out += '<Cell ss:MergeAcross="' + mergeFirstAcross + '"' + (style ? ' ss:StyleID="' + style + '"' : '') + '><Data ss:Type="String">' + escXml(val) + '</Data></Cell>';
    } else {
      out += xmlCell(val, style);
    }
  });
  out += '</Row>';
  return out;
}

function sheetName(raw) {
  return String(raw).replace(/[:\\/?*[\]]/g, '-').slice(0, 31);
}

function formatItemResult(it, a) {
  if (!a) return '';
  if (it.type === 'bool') return a.status === 'si' ? 'SI' : (a.status === 'no' ? 'NO' : '');
  if (it.type === 'percent') return a.value ? a.value + '%' : '';
  if (it.type === 'int') return a.value || '';
  if (it.type === 'timerange') return (a.from || a.to) ? ((a.from || '—') + ' a ' + (a.to || '—')) : '';
  if (it.type === 'intText') return [a.cant, a.prof].filter(Boolean).join(' — ');
  if (it.type === 'institutionList') return (a.rows || []).filter(r => r.institucion || r.fecha).map(r => (r.institucion || '') + (r.fecha ? ' (' + r.fecha + ')' : '')).join('; ');
  return a.value || '';
}

function metaTitlesAndVals(headerObj, acta) {
  return [
    ['N° Acta', headerObj.actaNro || ''], ['Institución', headerObj.nombreIpress || ''], ['Región', headerObj.region || ''],
    ['Código RENIPRESS', headerObj.codigoRenipress || ''], ['Categoría IPRESS', headerObj.categoriaIpress || ''],
    ['Institución (sector)', headerObj.institucionSector || ''], ['Clasificación BS', headerObj.clasificacionBS || ''],
    ['Expediente DIGDOT', headerObj.expedienteDigdot || ''], ['Tipo de supervisión', headerObj.tipoSupervision || ''],
    ['Modalidad', headerObj.modalidad || ''], ['Supervisor DIBAN', headerObj.supervisorDiban || ''],
    ['Fecha supervisión', headerObj.fechaSup || ''], ['Hora inicio', headerObj.horaInicio || ''],
    ['% Cumplimiento', acta.pctCumplimiento + '%'], ['N° Observaciones', acta.obsCount], ['Fecha/hora generación', acta.generatedDate + ' ' + acta.generatedTime]
  ];
}

export function buildFileNameBase(header, acta) {
  const clean = s => String(s || '').trim().replace(/[^a-zA-Z0-9À-ÿ\-_ ]/g, '').replace(/\s+/g, '-').slice(0, 40);
  const fecha = header.fechaSup || acta.generatedDate.split('/').reverse().join('-');
  return [clean(acta.actaNro) || 'sin-numero', clean(acta.nombreIpress) || 'sin-institucion', clean(fecha) || 'sin-fecha'].join('_');
}

function buildGeneralSheet(sections, records) {
  const sampleActa = computeActa(sections, records[records.length - 1].header, records[records.length - 1].answers);
  const metaTitles = metaTitlesAndVals(records[records.length - 1].header, sampleActa).map(([k]) => k);
  let rows = xmlRow([['DATOS GENERALES Y CUMPLIMIENTO', 'header']], metaTitles.length - 1);
  rows += xmlRow(metaTitles.map(t => [t, 'bold']));
  records.forEach(r => {
    const acta = computeActa(sections, r.header, r.answers);
    const vals = metaTitlesAndVals(r.header, acta).map(([, v]) => v);
    rows += xmlRow(vals);
  });
  return '<Worksheet ss:Name="Datos Generales"><Table>' + rows + '</Table></Worksheet>';
}

function buildSectionRecordRow(headerObj, answersObj, itemCols) {
  return [headerObj.actaNro || ''].concat(itemCols.map(c => {
    const a = answersObj[c.id] || {};
    let v = formatItemResult({ id: c.id, type: c.type }, a);
    if (c.type === 'bool' && a.status === 'no') {
      const extra = [a.text, a.clasif, a.nivel].filter(Boolean).join(' | ');
      if (extra) v += ' (' + extra + ')';
    }
    return v;
  }));
}

function buildSectionSheet(sec, records) {
  const itemCols = [];
  sec.subs.forEach(sub => sub.groups.forEach(g => g.items.forEach(it => {
    itemCols.push({ id: it.id, type: it.type, title: it.label });
  })));
  const allTitles = ['N° Acta'].concat(itemCols.map(c => c.title));
  let rows = xmlRow([[sec.id + ' - ' + sec.title, 'header']], allTitles.length - 1);
  rows += xmlRow(allTitles.map(t => [t, 'bold']));
  records.forEach(r => {
    const vals = buildSectionRecordRow(r.header, r.answers, itemCols);
    rows += xmlRow(vals);
  });
  return '<Worksheet ss:Name="' + escXml(sheetName(sec.id + ' ' + sec.title)) + '"><Table>' + rows + '</Table></Worksheet>';
}

function buildFichaSheet(sections, header, answers) {
  const acta = computeActa(sections, header, answers);
  const guiaLabel = GUIA_LABEL[header.clasificacionBS] || 'Tipo II';
  let rows = xmlRow([['FICHA DE SUPERVISIÓN', 'header']], 2);
  rows += xmlRow([['Banco de Sangre ' + guiaLabel + ' · DIBAN – DIGDOT – MINSA', 'bold'], '', '']);
  rows += xmlRow([['', '']]);
  metaTitlesAndVals(header, acta).forEach(([k, v]) => { rows += xmlRow([[k, 'bold'], v, '']); });
  rows += xmlRow([['', '']]);
  rows += xmlRow([['RESULTADOS DE LA EVALUACIÓN POR SECCIÓN', 'header']], 3);
  rows += xmlRow([['Subsección / Grupo', 'bold'], ['Ítem', 'bold'], ['Resultado', 'bold'], ['Observación (clasif. / nivel)', 'bold']]);
  sections.forEach(sec => {
    rows += xmlRow([[sec.id + ' - ' + sec.title, 'header']], 3);
    sec.subs.forEach(sub => sub.groups.forEach(g => {
      const subLabel = g.title ? sub.title + ' · ' + g.title : sub.title;
      g.items.forEach(it => {
        const a = answers[it.id] || {};
        const resultado = formatItemResult(it, a);
        let obs = '';
        if (it.type === 'bool' && a.status === 'no') {
          obs = (a.text || '') + (a.clasif ? ' [' + a.clasif : '') + (a.nivel ? ' / ' + a.nivel + ']' : (a.clasif ? ']' : ''));
        }
        rows += xmlRow([subLabel, it.label, resultado, obs]);
      });
    }));
  });
  rows += xmlRow([['', '']]);
  rows += xmlRow([['RESUMEN', 'header']], 2);
  rows += xmlRow([['Ítems evaluados', 'bold'], acta.totalItems, '']);
  rows += xmlRow([['% Cumplimiento', 'bold'], acta.pctCumplimiento + '%', '']);
  rows += xmlRow([['Observaciones', 'bold'], acta.obsCount, '']);
  rows += xmlRow([['Acta generada', 'bold'], acta.generatedDate + ' ' + acta.generatedTime, '']);
  rows += xmlRow([['', '']]);
  rows += xmlRow([['Supervisor DIBAN', 'bold'], header.supervisorDiban || '', '']);
  rows += xmlRow([['Responsable IPRESS', 'bold'], header.nombreIpress || '', '']);
  return '<Worksheet ss:Name="Ficha de Supervisión"><Table>' + rows + '</Table></Worksheet>';
}

export function exportActaExcel({ sections, header, answers, history }) {
  const records = history.map(h => ({ header: { ...header, ...h.header }, answers: h.answers || {} }));
  records.push({ header, answers });

  const styles = '<Styles>' +
    '<Style ss:ID="bold"><Font ss:Bold="1"/></Style>' +
    '<Style ss:ID="header"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#000000" ss:Pattern="Solid"/></Style>' +
    '</Styles>';
  const sheets = buildGeneralSheet(sections, records) + sections.map(sec => buildSectionSheet(sec, records)).join('') + buildFichaSheet(sections, header, answers);
  const xml = '<?xml version="1.0"?>' +
    '<?mso-application progid="Excel.Sheet"?>' +
    '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' +
    styles + sheets + '</Workbook>';
  const blob = new Blob(['﻿' + xml], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = buildFileNameBase(header, computeActa(sections, header, answers)) + '.xls';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
