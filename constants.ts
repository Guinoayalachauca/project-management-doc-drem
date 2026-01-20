
import { Area, DocPriority, DocStatus, DocumentRecord, Notification, User } from './types';

export const AREAS: Area[] = [
  { id: 'DIRECCION', name: 'Dirección Regional' },
  { id: 'ADMIN', name: 'Oficina de Administración' },
  { id: 'LEGAL', name: 'Asesoría Jurídica' },
  { id: 'MINERIA', name: 'Dirección de Minería' },
  { id: 'ENERGIA', name: 'Dirección de Energía' },
  { id: 'AMBIENTAL', name: 'Asuntos Ambientales' },
  { id: 'MESA', name: 'Mesa de Partes' }
];

export const DOCUMENT_TYPES = [
  'Resolución',
  'Oficio',
  'Informe',
  'Memorándum',
  'Carta',
  'Solicitud'
];

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Director Regional', email: 'director@drem.gob.pe', role: 'Administrador', password: 'AdminDrem2026', areaId: 'DIRECCION' },
  { id: '2', name: 'Mesa de Partes', email: 'mesa@drem.gob.pe', role: 'Mesa de Partes', password: 'MesaDrem2026', areaId: 'MESA' },
  { id: '3', name: 'Analista Técnico', email: 'mineria@drem.gob.pe', role: 'Analista', password: 'Mineria2026', areaId: 'MINERIA' }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Nuevo Expediente', message: 'Se ha registrado la Res. 0892-2026.', time: 'Hace 5 min', read: false, type: 'info' },
  { id: '2', title: 'Plazo por Vencer', message: 'Expediente INF-2026-0905 vence hoy.', time: 'Hace 1 hora', read: false, type: 'warning' },
  { id: '3', title: 'Documento Derivado', message: 'Administración derivó 3 oficios a su área.', time: 'Hace 2 horas', read: true, type: 'success' },
];

export const MOCK_DOCUMENTS: DocumentRecord[] = [
  {
    id: '1',
    code: 'RES-2026-0001',
    type: 'Resolución',
    resolutionNumber: '0001-2026-DREM-AP',
    year: '2026',
    emissionDate: '2026-01-05',
    administrado: 'Minera El Dorado S.A.C.',
    ruc: '20100123456',
    province: 'Abancay',
    district: 'Curahuasi',
    subject: 'Otorgar concesión minera para el proyecto El Dorado zona II.',
    pdfUrl: 'https://example.com/resolucion1.pdf',
    registerDate: '2026-01-05T09:00:00Z',
    currentAreaId: 'MINERIA',
    status: DocStatus.IN_PROCESS,
    priority: DocPriority.HIGH,
    movements: [
      { id: 'm1', documentId: '1', fromAreaId: 'MESA', toAreaId: 'DIRECCION', date: '2026-01-05T09:15:00Z', action: 'Registro Inicial', notes: 'Ingreso por mesa de partes.', user: 'Mesa de Partes' },
      { id: 'm2', documentId: '1', fromAreaId: 'DIRECCION', toAreaId: 'MINERIA', date: '2026-01-06T10:00:00Z', action: 'Derivación', notes: 'Para evaluación técnica urgente.', user: 'Director Regional' }
    ]
  },
  {
    id: '2',
    code: 'INF-2026-0002',
    type: 'Informe',
    year: '2026',
    emissionDate: '2026-01-10',
    administrado: 'Comunidad Campesina San Jerónimo',
    ruc: '10445566778',
    province: 'Andahuaylas',
    district: 'San Jerónimo',
    subject: 'Informe técnico sobre vertimiento de residuos en Río Chumbao.',
    pdfUrl: 'https://example.com/informe2.pdf',
    registerDate: '2026-01-10T14:30:00Z',
    currentAreaId: 'AMBIENTAL',
    status: DocStatus.IN_PROCESS,
    priority: DocPriority.URGENT,
    movements: [
      { id: 'm3', documentId: '2', fromAreaId: 'MESA', toAreaId: 'AMBIENTAL', date: '2026-01-10T14:45:00Z', action: 'Derivación Directa', notes: 'Atención prioritaria por riesgo ambiental.', user: 'Mesa de Partes' }
    ]
  },
  {
    id: '3',
    code: 'OFI-2026-0045',
    type: 'Oficio',
    year: '2026',
    emissionDate: '2026-02-15',
    administrado: 'Municipalidad Provincial de Abancay',
    ruc: '20131367012',
    province: 'Abancay',
    district: 'Abancay',
    subject: 'Solicitud de apoyo técnico para electrificación rural en zonas periféricas.',
    pdfUrl: 'https://example.com/oficio3.pdf',
    registerDate: '2026-02-15T08:20:00Z',
    currentAreaId: 'ENERGIA',
    status: DocStatus.PENDING,
    priority: DocPriority.NORMAL,
    movements: [
      { id: 'm4', documentId: '3', fromAreaId: 'MESA', toAreaId: 'ENERGIA', date: '2026-02-15T08:45:00Z', action: 'Registro y Derivación', notes: 'Atender según disponibilidad de especialistas.', user: 'Mesa de Partes' }
    ]
  },
  {
    id: '4',
    code: 'SOL-2026-0102',
    type: 'Solicitud',
    year: '2026',
    emissionDate: '2026-03-01',
    administrado: 'Asociación de Mineros Artesanales de Huancabamba',
    ruc: '20556677889',
    province: 'Andahuaylas',
    district: 'Huancabamba',
    subject: 'Inscripción en el Registro Integral de Formalización Minera (REINFO).',
    pdfUrl: 'https://example.com/solicitud4.pdf',
    registerDate: '2026-03-01T11:00:00Z',
    currentAreaId: 'LEGAL',
    status: DocStatus.DERIVED,
    priority: DocPriority.HIGH,
    movements: [
      { id: 'm5', documentId: '4', fromAreaId: 'MESA', toAreaId: 'MINERIA', date: '2026-03-01T11:15:00Z', action: 'Ingreso', notes: 'Revisión de requisitos legales.', user: 'Mesa de Partes' },
      { id: 'm6', documentId: '4', fromAreaId: 'MINERIA', toAreaId: 'LEGAL', date: '2026-03-02T09:30:00Z', action: 'Derivación', notes: 'Opinión legal sobre vigencia de personería jurídica.', user: 'Analista Técnico' }
    ]
  },
  {
    id: '5',
    code: 'MEM-2026-0012',
    type: 'Memorándum',
    year: '2026',
    emissionDate: '2026-03-10',
    administrado: 'Oficina de Recursos Humanos - DREM',
    ruc: '',
    province: 'Abancay',
    district: 'Abancay',
    subject: 'Cronograma de capacitaciones en gestión pública para el segundo trimestre.',
    pdfUrl: '',
    registerDate: '2026-03-10T16:00:00Z',
    currentAreaId: 'ADMIN',
    status: DocStatus.IN_PROCESS,
    priority: DocPriority.LOW,
    movements: [
      { id: 'm7', documentId: '5', fromAreaId: 'DIRECCION', toAreaId: 'ADMIN', date: '2026-03-10T16:10:00Z', action: 'Instrucción Directa', notes: 'Ejecutar conforme a presupuesto aprobado.', user: 'Director Regional' }
    ]
  }
];
