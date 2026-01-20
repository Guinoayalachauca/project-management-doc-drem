
import { DocumentRecord, User, SystemConfig } from '../types';
import { MOCK_DOCUMENTS, MOCK_USERS } from '../constants';

const STORAGE_KEYS = {
  DOCUMENTS: 'sisgedo_documents',
  USERS: 'sisgedo_users',
  CONFIG: 'sisgedo_config'
};

// Auxiliar para inicializar datos si no existen
const getStoredData = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error accediendo a localStorage", error);
    return defaultValue;
  }
};

// Documentos
export const getDocuments = async (): Promise<DocumentRecord[]> => {
  return getStoredData<DocumentRecord[]>(STORAGE_KEYS.DOCUMENTS, MOCK_DOCUMENTS);
};

export const addDocument = async (document: DocumentRecord): Promise<string> => {
  const docs = await getDocuments();
  const updatedDocs = [document, ...docs];
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(updatedDocs));
  return document.id;
};

export const updateDocument = async (updatedDoc: DocumentRecord): Promise<void> => {
  const docs = await getDocuments();
  const updatedDocs = docs.map(d => d.id === updatedDoc.id ? updatedDoc : d);
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(updatedDocs));
};

export const deleteDocument = async (id: string): Promise<void> => {
  const docs = await getDocuments();
  const updatedDocs = docs.filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(updatedDocs));
};

// Usuarios
export const getUsers = async (): Promise<User[]> => {
  return getStoredData<User[]>(STORAGE_KEYS.USERS, MOCK_USERS);
};

export const saveUser = async (user: User): Promise<void> => {
  const users = await getUsers();
  const exists = users.find(u => u.id === user.id);
  const updatedUsers = exists 
    ? users.map(u => u.id === user.id ? user : u)
    : [...users, user];
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
};

export const deleteUser = async (id: string): Promise<void> => {
  const users = await getUsers();
  const updatedUsers = users.filter(u => u.id !== id);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
};

export const authenticateUser = async (emailOrRole: string, password: string): Promise<User | undefined> => {
  const cleanEmailOrRole = emailOrRole.trim().toLowerCase();
  
  // 1. Intentar buscar en los usuarios guardados en LocalStorage (datos dinámicos)
  const storedUsers = await getUsers();
  let user = storedUsers.find(u => 
    (u.email.toLowerCase() === cleanEmailOrRole || u.role.toLowerCase() === cleanEmailOrRole) 
    && u.password === password
  );

  // 2. SALVAGUARDA PARA HOSTING: 
  // Si no se encuentra en storage (o el storage se corrompió al subir), 
  // forzamos la verificación contra la lista original (MOCK_USERS).
  if (!user) {
    user = MOCK_USERS.find(u => 
        (u.email.toLowerCase() === cleanEmailOrRole || u.role.toLowerCase() === cleanEmailOrRole) 
        && u.password === password
    );
    
    // Si logueó exitosamente con un usuario base, nos aseguramos que exista en storage para la próxima
    if (user) {
        await saveUser(user);
    }
  }

  return user;
};

// Configuración
export const getSystemConfig = async (): Promise<SystemConfig> => {
  const defaultConfig: SystemConfig = {
    institutionName: 'DREM Apurímac',
    currentYear: '2026',
    deadlineNormal: 7,
    deadlineUrgent: 2,
    autoNumbering: true,
    enable2FA: false,
    emailNotifications: true,
    systemMaintenanceMode: false
  };
  return getStoredData<SystemConfig>(STORAGE_KEYS.CONFIG, defaultConfig);
};

export const saveSystemConfig = async (config: SystemConfig): Promise<void> => {
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
};
