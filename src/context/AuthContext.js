// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Registrar usuario
  const register = async (email, password, userData) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizar el perfil del usuario con información adicional
      await updateProfile(result.user, {
        displayName: userData.nombre
      });

      return {
        success: true,
        user: result.user
      };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error.code)
      };
    }
  };

  // Iniciar sesión
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        user: result.user
      };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error.code)
      };
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: 'Error al cerrar sesión'
      };
    }
  };

  // Actualizar perfil de usuario
  const updateUserProfile = async (userData, newPassword = null) => {
    try {
      if (!currentUser) throw new Error('No hay usuario autenticado');

      // Actualizar displayName y otros datos del perfil
      await updateProfile(currentUser, {
        displayName: userData.nombre
      });

      // Si se proporciona una nueva contraseña, actualizarla
      if (newPassword && newPassword.trim() !== '') {
        // Para cambiar la contraseña, necesitamos reautenticar al usuario
        if (userData.currentPassword) {
          const credential = EmailAuthProvider.credential(
            currentUser.email, 
            userData.currentPassword
          );
          await reauthenticateWithCredential(currentUser, credential);
        }
        await updatePassword(currentUser, newPassword);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error.code)
      };
    }
  };

  // Función para traducir errores de Firebase
  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/email-already-in-use': 'El correo electrónico ya está registrado',
      'auth/invalid-email': 'El correo electrónico no es válido',
      'auth/operation-not-allowed': 'Operación no permitida',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      'auth/user-not-found': 'No existe una cuenta con este correo electrónico',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-credential': 'Credenciales inválidas',
      'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
      'auth/requires-recent-login': 'Esta operación requiere autenticación reciente'
    };

    return errorMessages[errorCode] || 'Ha ocurrido un error inesperado';
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    register,
    login,
    logout,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};