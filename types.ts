export enum DocStatus {
  PENDING = 'Pendiente',
  IN_PROCESS = 'En Trámite',
  ARCHIVED = 'Archivado',
  DERIVED = 'Derivado'
}

export enum DocPriority {
  LOW = 'Baja',
  NORMAL = 'Normal',
  HIGH = 'Alta',
  URGENT = 'Urgente'
}

export interface Area {
  id: string;
  name: string;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string; // 'Administrador' | 'Mesa de Partes' | 'Especialista', etc.
  password?: string; // For mock login
  areaId?: string;
  status?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}

export interface DocumentMovement {
  id: string;
  documentId: string;
  fromAreaId: string;
  toAreaId: string;
  date: string; // ISO string
  action: string;
  notes: string;
  user: string;
}

export interface DocumentRecord {
  id: string;
  // Campos específicos DREM
  type: string; // Resolución, Oficio, Informe
  resolutionNumber?: string; // N° de Resolución
  year: string;
  emissionDate: string;
  administrado: string; // Persona o Entidad
  ruc?: string;
  subject: string; // Resuelve / Asunto
  pdfUrl?: string; // URL del archivo PDF simulado
  externalUrl?: string; // URL opcional

  // Campos de sistema
  code: string; // Autogenerado o interno
  registerDate: string;
  currentAreaId: string;
  status: DocStatus;
  priority: DocPriority;
  movements: DocumentMovement[];
  aiSummary?: string;
}

// AI Response types
export interface AIRoutingSuggestion {
  suggestedAreaId: string;
  reasoning: string;
  prioritySuggestion: DocPriority;
}

// System Configuration
export interface SystemConfig {
  institutionName: string;
  currentYear: string;
  deadlineNormal: number;
  deadlineUrgent: number;
  autoNumbering: boolean;
  enable2FA: boolean;
  emailNotifications: boolean;
  systemMaintenanceMode: boolean;
}