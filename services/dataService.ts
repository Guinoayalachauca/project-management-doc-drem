import { DocumentRecord, User, DocStatus, DocPriority, SystemConfig } from '../types';
import { MOCK_DOCUMENTS, MOCK_USERS } from '../constants';

const KEYS = {
  DOCUMENTS: 'sisgedo_documents',
  USERS: 'sisgedo_users',
  CONFIG: 'sisgedo_config'
};

const DEFAULT_CONFIG: SystemConfig = {
  institutionName: 'Dirección Regional de Energía y Minas de Apurímac',
  currentYear: new Date().getFullYear().toString(),
  deadlineNormal: 7,
  deadlineUrgent: 2,
  autoNumbering: true,
  enable2FA: false,
  emailNotifications: true,
  systemMaintenanceMode: false
};

// --- Initializer ---
const initializeData = () => {
  if (!localStorage.getItem(KEYS.DOCUMENTS)) {
    localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(MOCK_DOCUMENTS));
  }
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(MOCK_USERS));
  }
  if (!localStorage.getItem(KEYS.CONFIG)) {
    localStorage.setItem(KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
  }
};

// Initialize on load
initializeData();

// --- Documents Service ---

export const getDocuments = (): DocumentRecord[] => {
  const data = localStorage.getItem(KEYS.DOCUMENTS);
  return data ? JSON.parse(data) : [];
};

export const getDocumentById = (id: string): DocumentRecord | undefined => {
  const docs = getDocuments();
  return docs.find(d => d.id === id);
};

export const addDocument = (doc: DocumentRecord): void => {
  const docs = getDocuments();
  docs.unshift(doc); // Add to beginning
  localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(docs));
};

export const updateDocument = (updatedDoc: DocumentRecord): void => {
  const docs = getDocuments();
  const index = docs.findIndex(d => d.id === updatedDoc.id);
  if (index !== -1) {
    docs[index] = updatedDoc;
    localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(docs));
  }
};

// --- Users Service ---

export const getUsers = (): User[] => {
  const data = localStorage.getItem(KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  
  if (index !== -1) {
    // Update existing
    users[index] = user;
  } else {
    // Create new
    users.push(user);
  }
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
};

export const deleteUser = (id: string): void => {
  let users = getUsers();
  users = users.filter(u => u.id !== id);
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
};

export const authenticateUser = (emailOrRole: string, password: string): User | undefined => {
  const users = getUsers();
  return users.find(u => 
    (u.email.toLowerCase() === emailOrRole.toLowerCase() || u.role.toLowerCase() === emailOrRole.toLowerCase()) 
    && u.password === password
  );
};

// --- Configuration Service ---

export const getSystemConfig = (): SystemConfig => {
  const data = localStorage.getItem(KEYS.CONFIG);
  return data ? JSON.parse(data) : DEFAULT_CONFIG;
};

export const saveSystemConfig = (config: SystemConfig): void => {
  localStorage.setItem(KEYS.CONFIG, JSON.stringify(config));
};