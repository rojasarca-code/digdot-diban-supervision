export const CATEGORIA_IPRESS = ['I-1', 'I-2', 'I-3', 'I-4', 'II-1', 'II-2', 'III-1', 'III-2'];
export const INSTITUCION_SECTOR = ['MINSA', 'ESSALUD', 'PRIVADO', 'FFAA', 'PNP', 'OTROS'];
export const CLASIFICACION_BS = ['IA', 'IB', 'IIA', 'IIB'];
export const TIPO_SUPERVISION = ['INICIAL', 'SEGUIMIENTO', 'POST-SUBSANACIÓN', 'INOPINADA'];
export const MODALIDAD = ['PRESENCIAL', 'VIRTUAL', 'MIXTA'];
export const CLASIF_OBS = ['TIPO 1', 'TIPO 2', 'TIPO 3'];
export const NIVEL_RIESGO = ['CRÍTICO', 'ALTO', 'MEDIO', 'BAJO'];

export const DRAFT_KEY = 'bs2_supervision_draft';
export const HISTORY_KEY = 'bs2_supervision_history';

export const emptyHeader = () => ({
  region: '', nombreIpress: '', codigoRenipress: '', categoriaIpress: '', institucionSector: '',
  clasificacionBS: '', actaNro: '', expedienteDigdot: '', tipoSupervision: '', modalidad: '',
  supervisorDiban: '', fechaSup: '', horaInicio: ''
});
