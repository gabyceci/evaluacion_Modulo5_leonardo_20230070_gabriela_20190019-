// src/context/AuthContext.js - Para Expo
import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
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

  const checkNetworkConnectivity = async () => {
    try {
      const netInfoState = await NetInfo.fetch();
      console.log('🔌 NetInfo connectivity check:', {
        isConnected: netInfoState.isConnected,
        isInternetReachable: netInfoState.isInternetReachable
      });
      
      return netInfoState.isConnected && netInfoState.isInternetReachable;
    } catch (error) {
      console.log('Error en checkNetworkConnectivity:', error);
      return false;
    }
  };

  // Registrar usuario
  const register = async (email, password, userData) => {
    try {
      console.log('=== FIREBASE CONNECTION DEBUG ===');
      
      // Test 1: Verificar que auth esté correctamente inicializado
      console.log('Auth initialized:', !!auth);
      console.log('App name:', auth?.app?.name);
      
      // Test 2: Verificar permisos de internet
      try {
        const netInfo = await NetInfo.fetch();
        console.log('NetInfo:', {
          isConnected: netInfo.isConnected,
          isInternetReachable: netInfo.isInternetReachable,
          type: netInfo.type
        });
      } catch (netError) {
        console.log('NetInfo error:', netError);
      }
  
      // Test 3: Verificar conectividad con Firebase específicamente
      try {
        const response = await fetch('https://practica-20230070-20190019.firebaseapp.com', {
          method: 'HEAD',
          timeout: 5000
        });
        console.log('Firebase domain connectivity:', response.status);
      } catch (firebaseError) {
        console.log('Firebase domain connection failed:', firebaseError.message);
      }
  
      const isConnected = await checkNetworkConnectivity();
      if (!isConnected) {
        return {
          success: false,
          error: 'Verifica tu conexión a internet e intenta nuevamente',
          errorCode: 'network-offline'
        };
      }
  
      console.log('Attempting to create user...');
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ User created successfully');
  
      await updateProfile(result.user, {
        displayName: userData.nombre
      });
  
      return { success: true, user: result.user };
  
    } catch (error) {
      console.error('❌ FIREBASE ERROR:', {
        code: error.code,
        message: error.message,
        name: error.name
      });
  
      // Manejo específico para errores de red
      if (error.code === 'auth/network-request-failed') {
        return {
          success: false,
          error: 'Problema de conexión con Firebase. Verifica:\n• Tu conexión a internet\n• Si estás usando VPN, desactívala\n• Firewall o bloqueadores de anuncios',
          errorCode: error.code
        };
      }
  
      return {
        success: false,
        error: getErrorMessage(error.code),
        errorCode: error.code
      };
    }
  };

  // Iniciar sesión
  const login = async (email, password) => {
    try {
      console.log('=== INICIO DEL PROCESO DE LOGIN ===');
      
      if (!isConnected) {
        console.log('⚠️  Sin conexión a internet según NetInfo');
        return {
          success: false,
          error: 'No hay conexión a internet. Verifica:\n• WiFi activado\n• Datos móviles activos\n• Señal estable',
          errorCode: 'network-offline'
        };
      }

      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Login exitoso:', result.user.uid);
      
      return {
        success: true,
        user: result.user
      };
    } catch (error) {
      console.error('❌ Error en login:', error.code, error.message);
      
      if (error.code === 'auth/network-request-failed') {
        return {
          success: false,
          error: 'Error de conexión con Firebase. Verifica tu internet y vuelve a intentar.',
          errorCode: error.code
        };
      }

      return {
        success: false,
        error: getErrorMessage(error.code),
        errorCode: error.code
      };
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      await signOut(auth);
      console.log('✅ Sesión cerrada exitosamente');
      return { success: true };
    } catch (error) {
      console.error('❌ Error cerrando sesión:', error);
      return {
        success: false,
        error: 'Error al cerrar sesión'
      };
    }
  };

  // Actualizar perfil
  const updateUserProfile = async (userData, newPassword = null) => {
    try {
      if (!currentUser) throw new Error('No hay usuario autenticado');

      const isConnected = await checkNetworkConnectivity();
      if (!isConnected) {
        return {
          success: false,
          error: 'Sin conexión a internet. Verifica tu red WiFi o datos móviles.'
        };
      }

      await updateProfile(currentUser, {
        displayName: userData.nombre
      });

      if (newPassword && newPassword.trim() !== '') {
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
      console.error('Error actualizando perfil:', error);
      return {
        success: false,
        error: getErrorMessage(error.code)
      };
    }
  };

  // Mensajes de error en español
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
      'auth/requires-recent-login': 'Esta operación requiere autenticación reciente',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
      'network-offline': 'Sin conexión a internet',
      'auth/timeout': 'La operación tardó demasiado. Intenta de nuevo',
      'auth/internal-error': 'Error interno del servidor',
      'auth/invalid-api-key': 'Configuración de Firebase inválida',
      'auth/app-not-authorized': 'App no autorizada para usar Firebase Auth'
    };

    return errorMessages[errorCode] || `Error: ${errorCode}`;
  };

  useEffect(() => {
    // Suscribirse a cambios de conectividad para debuggear
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('🔌 NetInfo Connectivity Change:', {
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        details: state.details
      });
    });
  
    return () => unsubscribe();
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
      {children}
    </AuthContext.Provider>
  );
};