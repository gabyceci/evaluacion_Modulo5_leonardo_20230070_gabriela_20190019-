// firebase.js - Versión mínima y funcional
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAW8BZ9cvR3b7mP__2FRkfx6CSrCvjdlME",
  authDomain: "practica-20230070-20190019.firebaseapp.com",
  projectId: "practica-20230070-20190019",
  storageBucket: "practica-20230070-20190019.firebasestorage.app",
  messagingSenderId: "741106579058",
  appId: "1:741106579058:web:f35eacb57100551e05b4eb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

export { auth };
export default app;