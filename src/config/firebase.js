// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAW8BZ9cvR3b7mP__2FRkfx6CSrCvjdlME",
  authDomain: "practica-20230070-20190019.firebaseapp.com",
  databaseURL: "https://practica-20230070-20190019-default-rtdb.firebaseio.com",
  projectId: "practica-20230070-20190019",
  storageBucket: "practica-20230070-20190019.firebasestorage.app",
  messagingSenderId: "741106579058",
  appId: "1:741106579058:web:f35eacb57100551e05b4eb"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth con persistencia
let auth;
try {
  auth = getAuth(app);
} catch (error) {
  // Si ya está inicializado, usar initializeAuth
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

// Inicializar Firestore
const db = getFirestore(app);

// Verificar que todo esté inicializado correctamente
console.log('🔥 Firebase App initialized:', !!app);
console.log('🔐 Auth initialized:', !!auth);
console.log('📊 Firestore initialized:', !!db);
console.log('📊 Firestore app:', db.app?.name);

export { auth, db };
export default app;