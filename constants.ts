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
  { id: '1', name: 'Juan Pérez', email: 'admin@drem.gob.pe', role: 'Administrador', password: 'admin', areaId: 'DIRECCION' },
  { id: '2', name: 'Maria Garcia', email: 'mesa@drem.gob.pe', role: 'Mesa de Partes', password: 'mesa', areaId: 'MESA' },
  { id: '3', name: 'Carlos Rojas', email: 'minas@drem.gob.pe', role: 'Especialista', password: 'minas', areaId: 'MINERIA' }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Nuevo Expediente', message: 'Se ha registrado la Res. 0892-2024.', time: 'Hace 5 min', read: false, type: 'info' },
  { id: '2', title: 'Plazo por Vencer', message: 'Expediente INF-2024-0905 vence hoy.', time: 'Hace 1 hora', read: false, type: 'warning' },
  { id: '3', title: 'Documento Derivado', message: 'Administración derivó 3 oficios a su área.', time: 'Hace 2 horas', read: true, type: 'success' },
];

// Mock Data simulating database state
export const MOCK_DOCUMENTS: DocumentRecord[] = [
  {
    id: '1',
    code: 'RES-2024-0892',
    type: 'Resolución',
    resolutionNumber: '0892-2024-DREM-AP',
    year: '2024',
    emissionDate: '2024-05-10',
    administrado: 'Minera El Dorado S.A.C.',
    ruc: '20100123456',
    subject: 'Otorgar concesión minera para el proyecto El Dorado zona II.',
    pdfUrl: 'https://example.com/resolucion.pdf',
    externalUrl: 'https://dremapurimac.gob.pe/docs/1',
    
    registerDate: '2024-05-10T09:00:00Z',
    currentAreaId: 'MINERIA',
    status: DocStatus.IN_PROCESS,
    priority: DocPriority.HIGH,
    movements: [
      {
        id: 'm1',
        documentId: '1',
        fromAreaId: 'MESA',
        toAreaId: 'DIRECCION',
        date: '2024-05-10T09:15:00Z',
        action: 'Registro Inicial',
        notes: 'Ingreso por mesa de partes.',
        user: 'Juan Pérez'
      },
      {
        id: 'm2',
        documentId: '1',
        fromAreaId: 'DIRECCION',
        toAreaId: 'MINERIA',
        date: '2024-05-11T10:00:00Z',
        action: 'Derivación',
        notes: 'Para evaluación técnica urgente.',
        user: 'Director Regional'
      }
    ]
  },
  {
    id: '2',
    code: 'INF-2024-0905',
    type: 'Informe',
    year: '2024',
    emissionDate: '2024-05-12',
    administrado: 'Comunidad Campesina San Jerónimo',
    ruc: '',
    subject: 'Informe técnico sobre vertimiento de residuos en Río Chumbao.',
    pdfUrl: 'https://example.com/informe.pdf',
    
    registerDate: '2024-05-12T14:30:00Z',
    currentAreaId: 'AMBIENTAL',
    status: DocStatus.IN_PROCESS,
    priority: DocPriority.URGENT,
    movements: [
      {
        id: 'm3',
        documentId: '2',
        fromAreaId: 'MESA',
        toAreaId: 'AMBIENTAL',
        date: '2024-05-12T14:45:00Z',
        action: 'Derivación Directa',
        notes: 'Atención prioritaria por riesgo ambiental.',
        user: 'Maria Garcia'
      }
    ]
  }
];