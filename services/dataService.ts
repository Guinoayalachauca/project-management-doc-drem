
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit 
} from "firebase/firestore";
import { db } from "./firebase";
import { DocumentRecord, User, SystemConfig, Notification } from '../types';
import { MOCK_USERS, MOCK_DOCUMENTS } from '../constants';

// --- DOCUMENTOS ---
export const getDocuments = async (): Promise<DocumentRecord[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "documents"));
    const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DocumentRecord));
    if (docs.length === 0) {
      for (const d of MOCK_DOCUMENTS) {
        await setDoc(doc(db, "documents", d.id), d);
      }
      return MOCK_DOCUMENTS;
    }
    return docs;
  } catch (error) {
    console.error("Error Firebase:", error);
    return [];
  }
};

export const addDocument = async (document: DocumentRecord): Promise<string> => {
  try {
    const { id, ...data } = document;
    await setDoc(doc(db, "documents", id), data);
    await addNotification({
      id: `notif-${Date.now()}`,
      title: 'Nuevo Registro',
      message: `Expediente ${document.code} registrado.`,
      time: 'Ahora',
      read: false,
      type: 'info'
    });
    return id;
  } catch (error) {
    throw error;
  }
};

export const updateDocument = async (updatedDoc: DocumentRecord): Promise<void> => {
  try {
    const { id, ...data } = updatedDoc;
    await updateDoc(doc(db, "documents", id), data);
  } catch (error) {
    throw error;
  }
};

export const deleteDocument = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "documents", id));
  } catch (error) {
    throw error;
  }
};

// --- USUARIOS (Firestore Sync) ---
export const getUsers = async (): Promise<User[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    // Semilla inicial si está vacío
    if (users.length === 0) {
      for (const u of MOCK_USERS) {
        await setDoc(doc(db, "users", u.id), u);
      }
      return MOCK_USERS;
    }
    return users;
  } catch (error) {
    console.error("Error al obtener usuarios de Firebase:", error);
    return [];
  }
};

export const saveUser = async (user: User): Promise<void> => {
  try {
    const { id, ...data } = user;
    // Usamos setDoc con merge:true para no borrar campos si solo actualizamos algunos
    await setDoc(doc(db, "users", id), data, { merge: true });
  } catch (error) {
    console.error("Error al guardar usuario en Firebase:", error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "users", id));
  } catch (error) {
    console.error("Error al eliminar usuario en Firebase:", error);
    throw error;
  }
};

export const authenticateUser = async (emailOrRole: string, password: string): Promise<User | undefined> => {
  try {
    // Nota: Para sistemas grandes se usaría Firebase Auth, 
    // pero para este flujo consultamos la colección de usuarios.
    const users = await getUsers();
    const cleanEntry = emailOrRole.trim().toLowerCase();
    return users.find(u => 
      (u.email.toLowerCase() === cleanEntry || u.role.toLowerCase() === cleanEntry) 
      && u.password === password
    );
  } catch (error) {
    return undefined;
  }
};

// --- NOTIFICACIONES ---
export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const q = query(collection(db, "notifications"), orderBy("id", "desc"), limit(20));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Notification);
  } catch (error) {
    return [];
  }
};

export const addNotification = async (notif: Notification): Promise<void> => {
  try {
    await setDoc(doc(db, "notifications", notif.id), notif);
  } catch (error) {
    console.error(error);
  }
};

// --- CONFIGURACIÓN ---
export const getSystemConfig = async (): Promise<SystemConfig> => {
  try {
    const docRef = doc(db, "config", "system");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return docSnap.data() as SystemConfig;
    const def = { institutionName: 'DREM Apurímac', currentYear: '2026', deadlineNormal: 7, deadlineUrgent: 2, autoNumbering: true, enable2FA: false, emailNotifications: true, systemMaintenanceMode: false };
    await setDoc(docRef, def);
    return def;
  } catch (error) {
    return {} as SystemConfig;
  }
};

export const saveSystemConfig = async (config: SystemConfig): Promise<void> => {
  try {
    await setDoc(doc(db, "config", "system"), config);
  } catch (error) {
    console.error(error);
  }
};
