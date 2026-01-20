
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBUpAX1adL29DP5uphHta_b_2Mtbhd9okk",
  authDomain: "my-drem-sisgedo.firebaseapp.com",
  projectId: "my-drem-sisgedo",
  storageBucket: "my-drem-sisgedo.firebasestorage.app",
  messagingSenderId: "988549361558",
  appId: "1:988549361558:web:1747feeb3c6e5f153137b7",
  measurementId: "G-7CD8HHH8BT"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios con persistencia
export const db = getFirestore(app);
export const auth = getAuth(app);

// Habilitar persistencia offline para manejar el error de API deshabilitada
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        console.warn("Múltiples pestañas abiertas, la persistencia offline solo funcionará en una.");
    } else if (err.code === 'unimplemented') {
        console.warn("El navegador actual no soporta persistencia offline de Firestore.");
    }
});

export default app;
