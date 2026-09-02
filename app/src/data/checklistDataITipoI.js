/*
 * GUÍA DE EVALUACIÓN Y SUPERVISIÓN PARA BANCOS DE SANGRE TIPO I‑A / I‑B / I‑C
 * DIBAN – DIGDOT – MINSA · PRONAHEBAS · D.S. N° 017‑2022‑SA
 *
 * Transcrita del "MODELO DE GUÍA DE SUPERVISIÓN ACTUAL" (hojas UV_BS TIPO I A / I B / I C).
 * Las tres subclasificaciones comparten la misma estructura; los ítems o grupos que
 * sólo aplican a I‑B y/o I‑C llevan la propiedad `aplica`. Un nodo sin `aplica`
 * aplica a las tres subclasificaciones (I‑A, I‑B, I‑C).
 *
 * El Banco de Sangre Tipo II utiliza la guía completa (checklistData.js) sin filtros.
 */

const b = (id, label, aplica) => (aplica ? { id, label, type: 'bool', aplica } : { id, label, type: 'bool' });
const t = (id, label, aplica) => (aplica ? { id, label, type: 'text', aplica } : { id, label, type: 'text' });
const n = (id, label, aplica) => (aplica ? { id, label, type: 'int', aplica } : { id, label, type: 'int' });
const pct = (id, label) => ({ id, label, type: 'percent' });

export const SECTIONS_TIPO_I = [
  {
    id: 'I',
    title: 'DOCUMENTACIÓN',
    subs: [
      {
        title: 'DOCUMENTOS DE GESTIÓN',
        groups: [
          {
            title: '1. ¿Cuenta con plan de capacitación o PDP con actividades para el personal del banco de sangre?',
            items: [
              b('t1_I_1a', 'Vigente y debidamente aprobado'),
              b('t1_I_1b', 'El personal recibe capacitación según cronograma')
            ]
          },
          {
            title: '2. ¿Cuenta con plan de mantenimiento preventivo y correctivo de los equipos biomédicos?',
            items: [
              b('t1_I_2a', 'Vigente y debidamente aprobado'),
              b('t1_I_2b', 'Evidencia de cumplimiento')
            ]
          },
          {
            title: '3. ¿Cuenta con plan de mejora?',
            items: [
              b('t1_I_3a', 'Vigente y debidamente aprobado'),
              b('t1_I_3b', 'Evidencia de cumplimiento')
            ]
          },
          {
            title: '4. ¿El banco de sangre ha presentado no conformidades?',
            items: [
              b('t1_I_4a', 'Cuenta con registro / documentación correspondiente'),
              t('t1_I_4b', '4.1 ¿En qué proceso se registró la no conformidad?')
            ]
          },
          {
            title: '5. Equipo correspondiente (equipo de cómputo — puede ser compartido con laboratorio)',
            items: [
              b('t1_I_5a', 'Verificar operatividad'),
              b('t1_I_5b', 'Ubicación')
            ]
          },
          {
            title: null,
            items: [
              b('t1_I_6', 'Área señalizada de acuerdo al D.S. N° 017-2022-SA (área administrativa)', ['IC'])
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'II',
    title: 'RECURSOS HUMANOS',
    subs: [
      {
        title: 'PERSONAL Y ORGANIZACIÓN',
        groups: [
          {
            title: '1. Responsable del Banco de Sangre según D.S. N° 017-2022-SA',
            items: [
              b('t1_II_1a', 'Se encuentra registrado en el expediente de autorización de DIBAN'),
              b('t1_II_1b', 'Cuenta con habilidad vigente'),
              b('t1_II_1c', 'Acredita 6 meses de experiencia laboral', ['IC'])
            ]
          },
          {
            title: '2. Personal tecnólogo médico / biólogo según D.S. N° 017-2022-SA',
            items: [
              b('t1_II_2a', 'Se encuentra registrado en el expediente de autorización de DIBAN'),
              b('t1_II_2b', 'Cuentan con habilidad vigente'),
              b('t1_II_2c', 'Acreditan 1 año de experiencia laboral', ['IC'])
            ]
          },
          {
            title: null,
            items: [
              b('t1_II_3', '3. Personal técnico de laboratorio según D.S. N° 017-2022-SA — registrado en el expediente de autorización de DIBAN (puede ser compartido con laboratorio)', ['IC'])
            ]
          },
          {
            title: '4. Personal responsable de la calidad del Banco de Sangre',
            aplica: ['IC'],
            items: [
              b('t1_II_4a', 'Médico asistente', ['IC']),
              b('t1_II_4b', 'Tecnólogo médico o biólogo', ['IC'])
            ]
          },
          {
            title: '5. Rol de turnos del banco de sangre',
            items: [
              b('t1_II_5a', 'Cumple con cobertura de atención 24 h o 12 h'),
              b('t1_II_5b', 'Validado por el director o representante de la IPRESS')
            ]
          },
          {
            title: null,
            items: [
              b('t1_II_6', '6. Área señalizada de acuerdo al D.S. N° 017-2022-SA (servicios higiénicos y vestuario para el personal — puede ser compartido con laboratorio)', ['IC'])
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'III',
    title: 'ATENCIÓN DEL BANCO DE SANGRE',
    subs: [
      {
        title: 'ATENCIÓN DE SOLICITUDES',
        groups: [
          {
            title: '1. ¿El banco de sangre atendió solicitudes transfusionales?',
            items: [
              b('t1_III_1a', 'Se verifica registro de atenciones de solicitudes'),
              n('t1_III_1b', '1.1 ¿Cuántos paquetes globulares se han despachado? (2025-2026) — correlacionar con registros de atenciones y HEMORED')
            ]
          },
          {
            title: '2. Equipo correspondiente (teléfono fijo y/o móvil)',
            aplica: ['IC'],
            items: [
              b('t1_III_2a', 'Verificar operatividad', ['IC']),
              b('t1_III_2b', 'Anexo', ['IC'])
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'IV',
    title: 'PROMOCIÓN DE LA DONACIÓN VOLUNTARIA DE SANGRE',
    subs: [
      {
        title: 'PLAN DE PROMOCIÓN',
        groups: [
          {
            title: null,
            items: [
              b('t1_IV_1', '1. ¿Cuenta con Plan de Promoción de Donación Voluntaria de Sangre vigente y debidamente aprobado?')
            ]
          },
          {
            title: null,
            items: [
              pct('t1_IV_2', '2. % de cumplimiento del cronograma de actividades del Plan de Donación Voluntaria de Sangre — (actividades realizadas / actividades programadas) × 100 %')
            ]
          },
          {
            title: '3. El Plan cuenta con las siguientes actividades para promover la donación voluntaria de sangre:',
            items: [
              b('t1_IV_3a', 'Charlas extramurales / intramurales'),
              b('t1_IV_3b', 'Sensibilización por redes sociales'),
              b('t1_IV_3c', 'Campañas de donación voluntaria'),
              t('t1_IV_3d', 'Otra actividad (especificar)')
            ]
          },
          {
            title: null,
            items: [
              t('t1_IV_4', '4. Recursos que aporta el BS tipo I-A / I-B / I-C según el convenio interinstitucional con el BS tipo II autorizado (informativo — revisar convenio)')
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'V',
    title: 'RECEPCIÓN Y ALMACENAMIENTO DE HEMOCOMPONENTES',
    subs: [
      {
        title: 'CONVENIO CON BANCO DE SANGRE TIPO II',
        groups: [
          {
            title: null,
            items: [
              b('t1_V_1', '1. ¿Cuenta con convenio interinstitucional con un Banco de Sangre tipo II autorizado, debidamente suscrito y vigente? (D.S. N° 017-2022-SA)'),
              b('t1_V_2', '2. ¿Remitió a la DIBAN el convenio vigente? (verificar en HEMORED o cargos)'),
              { id: 't1_V_3', label: '3. Instituciones con las que tiene convenios vigentes y fecha de vigencia', type: 'institutionList', max: 30 },
              b('t1_V_4', '4. ¿Cuenta con usuario HEMORED?')
            ]
          }
        ]
      },
      {
        title: 'RECEPCIÓN DE HEMOCOMPONENTES DEL BS TIPO II',
        groups: [
          {
            title: '5. Los hemocomponentes solicitados al banco de sangre tipo II cuentan con la siguiente documentación:',
            items: [
              b('t1_V_5a', 'Solicitud de hemocomponentes con firma y sello del representante de la IPRESS'),
              b('t1_V_5b', 'Constancia de transferencia con firma y sello del representante de la IPRESS'),
              b('t1_V_5c', 'Resultado serológico realizado a las unidades'),
              b('t1_V_5d', 'N° de Sello de Calidad')
            ]
          },
          {
            title: '6. Transporte y recepción de hemocomponentes',
            items: [
              b('t1_V_6a', 'Transporte: registro de cadena de frío (hora y temperatura de salida y llegada)'),
              b('t1_V_6b', 'Transporte: equipo conservador portátil / control de temperatura'),
              b('t1_V_6c', 'Recepción: registro de ingreso de hemocomponentes'),
              b('t1_V_6d', 'Recepción: registro de evaluación macroscópica del hemocomponente'),
              b('t1_V_6e', 'Recepción: cuenta con etiqueta de identificación procedente del BS tipo II')
            ]
          },
          {
            title: null,
            items: [
              b('t1_V_7', '7. ¿Los hemocomponentes cuentan con sello nacional de calidad adherido? (verificar que la numeración corresponde a los otorgados al Banco tipo II con que cuenta convenio)')
            ]
          }
        ]
      },
      {
        title: 'ALMACÉN DE HEMOCOMPONENTES — EQUIPAMIENTO',
        groups: [
          {
            title: 'Conservadora biomédica 2 °C a 8 °C (paquete globular)',
            items: [
              b('t1_V_8a', 'Reporte de temperatura cada 4 horas'),
              b('t1_V_8b', 'Registro de temperatura / alarma audiovisual'),
              b('t1_V_8c', 'Ficha de identificación'),
              b('t1_V_8d', 'Cronograma de mantenimiento')
            ]
          },
          {
            title: 'Congeladora biomédica -20 °C o menos (plasma fresco congelado)',
            items: [
              b('t1_V_9a', 'Reporte de temperatura cada 4 horas'),
              b('t1_V_9b', 'Registro de temperatura / alarma audiovisual'),
              b('t1_V_9c', 'Ficha de identificación'),
              b('t1_V_9d', 'Cronograma de mantenimiento')
            ]
          },
          {
            title: 'Rotador de plaquetas con cámara de temperatura 18 °C a 24 °C (incubadora)',
            aplica: ['IB', 'IC'],
            items: [
              b('t1_V_10a', 'Reporte de temperatura cada 4 horas', ['IB', 'IC']),
              b('t1_V_10b', 'Ficha de identificación', ['IB', 'IC']),
              b('t1_V_10c', 'Cronograma de mantenimiento', ['IB', 'IC'])
            ]
          },
          {
            title: null,
            items: [
              b('t1_V_11a', 'Conservadora portátil: verificar operatividad'),
              b('t1_V_11b', 'Equipo de aire acondicionado: cronograma de mantenimiento'),
              b('t1_V_11c', 'Registro de unidades almacenadas'),
              b('t1_V_11d', 'Registro de temperatura ambiental (cada 4 horas)'),
              b('t1_V_11e', 'Área señalizada de acuerdo al D.S. N° 017-2022-SA')
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'VI',
    title: 'PRUEBAS INMUNOHEMATOLÓGICAS',
    subs: [
      {
        title: 'METODOLOGÍA Y PRUEBAS',
        groups: [
          {
            title: '1. Metodología de trabajo (informativo)',
            items: [
              b('t1_VI_1a', 'Tubo'),
              b('t1_VI_1b', 'Columna / gel')
            ]
          },
          {
            title: '2. ¿Se determina el grupo ABO y factor Rh(D), globular y sérico?',
            items: [
              b('t1_VI_2a', 'Registro de prueba'),
              b('t1_VI_2b', 'Cuenta con antisueros A, B, Rh(D) / grupo ABO directo'),
              b('t1_VI_2c', 'Tarjeta gel (si amerita)'),
              b('t1_VI_2d', 'Cuenta con células A y B')
            ]
          },
          {
            title: '3. ¿Se realiza el rastreo de anticuerpos irregulares? (si la respuesta es NO, sustentar)',
            items: [
              b('t1_VI_3', 'Se realiza el rastreo de anticuerpos irregulares'),
              b('t1_VI_3_1a', '3.1 Reactivos para el procesamiento de la prueba: registro de prueba'),
              b('t1_VI_3_1b', '3.1 Albúmina'),
              b('t1_VI_3_1c', '3.1 Antiglobulina humana'),
              b('t1_VI_3_1d', '3.1 Tarjeta gel (si amerita)'),
              b('t1_VI_3_1e', '3.1 Cuenta con células I-II-III')
            ]
          },
          {
            title: '4. ¿Se realiza el test de Coombs directo? (si la respuesta es NO, sustentar)',
            items: [
              b('t1_VI_4', 'Se realiza el test de Coombs directo'),
              b('t1_VI_4_1a', '4.1 Reactivos para el procesamiento de la prueba: registro de prueba'),
              b('t1_VI_4_1b', '4.1 Cuenta con control de Coombs')
            ]
          },
          {
            title: '5. ¿El banco de sangre realiza la prueba cruzada serológica?',
            items: [
              b('t1_VI_5a', 'Registro de prueba'),
              b('t1_VI_5b', 'Albúmina'),
              b('t1_VI_5c', 'Antiglobulina humana'),
              b('t1_VI_5d', 'Tarjeta gel (si amerita)'),
              b('t1_VI_5e', 'LISS'),
              b('t1_VI_5f', 'Células control de Coombs')
            ]
          },
          {
            title: null,
            items: [
              b('t1_VI_6', '6. ¿Cuenta con reactivos vigentes?')
            ]
          }
        ]
      },
      {
        title: 'STOCK DE REACTIVOS',
        groups: [
          {
            title: '7. Indique el stock de reactivos',
            items: [
              n('t1_VI_7a', 'Anti-A'),
              n('t1_VI_7b', 'Anti-B'),
              n('t1_VI_7c', 'Anti-D'),
              n('t1_VI_7d', 'Albúmina'),
              n('t1_VI_7e', 'Antiglobulina humana'),
              n('t1_VI_7f', 'Solución salina'),
              n('t1_VI_7g', 'Tarjetas gel (si amerita)'),
              t('t1_VI_7h', 'Otros')
            ]
          }
        ]
      },
      {
        title: 'CONTROL DE CALIDAD',
        groups: [
          {
            title: null,
            items: [
              b('t1_VI_8', '8. ¿Realiza control de calidad a los reactivos e insumos en uso? (según la metodología que utilicen)')
            ]
          },
          {
            title: '9. ¿Participa en un programa de control de calidad externo para inmunohematología? (si la respuesta es NO, sustentar)',
            items: [
              b('t1_VI_9', 'Participa en un programa de control de calidad externo'),
              t('t1_VI_9_1', '9.1 Indicar el nombre del programa')
            ]
          }
        ]
      },
      {
        title: 'EQUIPAMIENTO CORRESPONDIENTE',
        groups: [
          {
            title: 'Conservadora de reactivos (puede ser compartida con laboratorio)',
            items: [
              b('t1_VI_10a1', 'Reporte de temperatura cada 4 horas'),
              b('t1_VI_10a2', 'Registro de temperatura / alarma audiovisual'),
              b('t1_VI_10a3', 'Ficha de identificación'),
              b('t1_VI_10a4', 'Cronograma de mantenimiento')
            ]
          },
          {
            title: 'Centrífuga de tubos',
            items: [
              b('t1_VI_10b1', 'Ficha de identificación'),
              b('t1_VI_10b2', 'Cronograma de mantenimiento')
            ]
          },
          {
            title: 'Centrífuga inmunohematológica',
            items: [
              b('t1_VI_10c1', 'Ficha de identificación'),
              b('t1_VI_10c2', 'Cronograma de mantenimiento')
            ]
          },
          {
            title: 'Baño maría / incubador de tarjetas',
            items: [
              b('t1_VI_10d1', 'Ficha de identificación'),
              b('t1_VI_10d2', 'Cronograma de mantenimiento')
            ]
          },
          {
            title: 'Pinza exprimidora de tubuladura',
            aplica: ['IC'],
            items: [
              b('t1_VI_10e1', 'Verificar operatividad', ['IC'])
            ]
          }
        ]
      },
      {
        title: 'STOCK Y ÁREA',
        groups: [
          {
            title: '11. Cuenta con stock de hemocomponentes',
            items: [
              n('t1_VI_11a', 'Paquete globular'),
              n('t1_VI_11b', 'Plasma fresco congelado'),
              n('t1_VI_11c', 'Plaquetas', ['IB', 'IC']),
              n('t1_VI_11d', 'Crioprecipitados', ['IC'])
            ]
          },
          {
            title: '12. Área señalizada de acuerdo al D.S. N° 017-2022-SA',
            items: [
              b('t1_VI_12a', 'Laboratorio de inmunohematología (puede ser compartido con laboratorio)'),
              b('t1_VI_12b', 'Almacenamiento de materiales e insumos médicos (puede ser compartido con laboratorio)'),
              b('t1_VI_12c', 'Control de calidad de los procesos de la cadena transfusional', ['IC'])
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'VII',
    title: 'DISTRIBUCIÓN INTERNA DE HEMOCOMPONENTES',
    subs: [
      {
        title: 'DISTRIBUCIÓN Y TRAZABILIDAD',
        groups: [
          {
            title: '1. ¿Almacena muestras de la unidad y del receptor?',
            items: [
              b('t1_VII_1a', 'Almacena mínimo 7 días (verificar POE)'),
              t('t1_VII_1b', 'Tiempo de almacenamiento indicado')
            ]
          },
          {
            title: '2. ¿Realiza el correcto llenado de las solicitudes transfusionales?',
            items: [
              b('t1_VII_2a', 'Firma y sello del médico solicitante'),
              b('t1_VII_2b', 'Diagnóstico'),
              b('t1_VII_2c', 'Tipo y cantidad de hemocomponente'),
              b('t1_VII_2d', 'Consentimiento informado firmado')
            ]
          },
          {
            title: '3. ¿Cuenta con evidencia para la trazabilidad posterior a la transfusión?',
            items: [
              b('t1_VII_3a', 'Hoja de conducción'),
              b('t1_VII_3b', 'Reacciones adversas al receptor')
            ]
          },
          {
            title: '4. ¿El banco de sangre atiende solicitudes transfusionales pediátricas?',
            items: [
              b('t1_VII_4', 'Atiende solicitudes transfusionales pediátricas'),
              b('t1_VII_4_1', '4.1 Cuenta con bolsas de transferencia para transfusiones de pacientes pediátricos')
            ]
          },
          {
            title: '5. ¿Realiza el registro completo de despacho de hemocomponente?',
            items: [
              b('t1_VII_5a', 'Datos del receptor'),
              b('t1_VII_5b', 'Grupo ABO, Rh(D)'),
              b('t1_VII_5c', 'Número de hemocomponente'),
              b('t1_VII_5d', 'Número de sello de calidad'),
              b('t1_VII_5e', 'Interpretación de la prueba de compatibilidad'),
              b('t1_VII_5f', 'Firma del personal que despacha'),
              b('t1_VII_5g', 'Fecha y hora de liberación')
            ]
          },
          {
            title: '6. Área señalizada de acuerdo al D.S. N° 017-2022-SA',
            items: [
              b('t1_VII_6a', 'Despacho y distribución'),
              b('t1_VII_6b', 'Recepción de solicitudes transfusionales')
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'VIII',
    title: 'ELIMINACIÓN DE HEMOCOMPONENTES',
    subs: [
      {
        title: 'ELIMINACIÓN Y REGISTROS',
        groups: [
          {
            title: null,
            items: [
              b('t1_VIII_1', '1. ¿Se cumple el flujograma de eliminación de hemocomponentes del banco de sangre? (registro de actas de eliminación)')
            ]
          },
          {
            title: '2. Las actas de eliminación se encuentran debidamente llenadas',
            items: [
              b('t1_VIII_2a', 'N° de unidad'),
              b('t1_VIII_2b', 'N° de sello de calidad'),
              b('t1_VIII_2c', 'Grupo sanguíneo'),
              b('t1_VIII_2d', 'Causa de eliminación'),
              b('t1_VIII_2e', 'Hemocomponente eliminado'),
              b('t1_VIII_2f', 'Firma y sello del responsable de banco'),
              b('t1_VIII_2g', 'Firma y sello del representante de epidemiología o quien haga sus veces'),
              b('t1_VIII_2h', 'Fecha y hora')
            ]
          },
          {
            title: '3. Equipamiento correspondiente — Autoclave (puede ser compartido con laboratorio)',
            items: [
              b('t1_VIII_3a', 'Ficha de identificación'),
              b('t1_VIII_3b', 'Cronograma de mantenimiento'),
              b('t1_VIII_3c', 'Ubicación')
            ]
          },
          {
            title: null,
            items: [
              b('t1_VIII_4', 'Área señalizada de acuerdo al D.S. N° 017-2022-SA (área de esterilización o autoclavado y descontaminación — puede ser compartido con laboratorio)', ['IC'])
            ]
          }
        ]
      }
    ]
  }
];
