// src/context/AuthContext.js - Actualizado para Firestore
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
import { 
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../config/firebase.js';

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
  const [isConnected, setIsConnected] = useState(true);
  const [userData, setUserData] = useState(null);

  const checkNetworkConnectivity = async () => {
    try {
      const netInfoState = await NetInfo.fetch();
      console.log('🔌 NetInfo connectivity check:', {
        isConnected: netInfoState.isConnected,
        isInternetReachable: netInfoState.isInternetReachable
      });
      
      const connected = netInfoState.isConnected && netInfoState.isInternetReachable;
      setIsConnected(connected);
      return connected;
    } catch (error) {
      console.log('Error en checkNetworkConnectivity:', error);
      setIsConnected(false);
      return false;
    }
  };

  // Guardar usuario en Firestore
  const saveUserToDatabase = async (user, additionalData) => {
    try {
      console.log('💾 Guardando usuario en Firestore...');
      
      const userRef = doc(db, 'usuarios', user.uid);
      
      const userDataToSave = {
        uid: user.uid,
        email: user.email,
        nombre: additionalData.nombre,
        tituloUniversitario: additionalData.tituloUniversitario,
        anoGraduacion: additionalData.anoGraduacion,
        fechaRegistro: serverTimestamp(),
        ultimoAcceso: serverTimestamp(),
        activo: true
      };

      await setDoc(userRef, userDataToSave);
      console.log('✅ Usuario guardado en Firestore exitosamente');
      
      // Actualizar estado local (sin serverTimestamp para el estado)
      const localUserData = {
        ...userDataToSave,
        fechaRegistro: new Date().toISOString(),
        ultimoAcceso: new Date().toISOString()
      };
      setUserData(localUserData);
      
      return { success: true };
    } catch (error) {
      console.error('❌ Error guardando usuario en Firestore:', error);
      return { success: false, error: error.message };
    }
  };

  // Obtener datos del usuario desde Firestore
  const getUserData = async (userId) => {
    try {
      console.log('📖 Obteniendo datos del usuario desde Firestore...');
      
      const userRef = doc(db, 'usuarios', userId);
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('✅ Datos del usuario obtenidos:', data);
        
        // Convertir timestamps a strings para el estado local
        const processedData = {
          ...data,
          fechaRegistro: data.fechaRegistro?.toDate?.()?.toISOString() || data.fechaRegistro,
          ultimoAcceso: data.ultimoAcceso?.toDate?.()?.toISOString() || data.ultimoAcceso
        };
        
        setUserData(processedData);
        return { success: true, data: processedData };
      } else {
        console.log('Usuario no encontrado en Firestore, creando entrada básica...');
        
        const basicData = {
          uid: userId,
          email: auth.currentUser?.email,
          nombre: auth.currentUser?.displayName || 'Usuario',
          fechaRegistro: serverTimestamp(),
          ultimoAcceso: serverTimestamp(),
          activo: true
        };
        
        await setDoc(userRef, basicData);
        
        const localBasicData = {
          ...basicData,
          fechaRegistro: new Date().toISOString(),
          ultimoAcceso: new Date().toISOString()
        };
        
        setUserData(localBasicData);
        return { success: true, data: localBasicData };
      }
    } catch (error) {
      console.error('❌ Error obteniendo datos del usuario:', error);
      return { success: false, error: error.message };
    }
  };

  // Actualizar último acceso
  const updateLastAccess = async (userId) => {
    try {
      const userRef = doc(db, 'usuarios', userId);
      await updateDoc(userRef, {
        ultimoAcceso: serverTimestamp()
      });
      console.log('✅ Último acceso actualizado');
    } catch (error) {
      console.error('⚠️ Error actualizando último acceso:', error);
    }
  };

  // Registrar usuario
  const register = async (email, password, additionalData) => {
    try {
      console.log('=== FIREBASE REGISTRATION DEBUG ===');
      
      // Verificar que auth esté correctamente inicializado
      console.log('Auth initialized:', !!auth);
      console.log('Firestore initialized:', !!db);
      
      // Verificar conectividad
      const connected = await checkNetworkConnectivity();
      if (!connected) {
        return {
          success: false,
          error: 'Verifica tu conexión a internet e intenta nuevamente',
          errorCode: 'network-offline'
        };
      }
  
      console.log('Attempting to create user...');
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ User created successfully:', result.user.uid);
  
      // Actualizar perfil de Firebase Auth
      await updateProfile(result.user, {
        displayName: additionalData.nombre
      });

      // Guardar datos completos en Firestore
      const dbResult = await saveUserToDatabase(result.user, additionalData);
      if (!dbResult.success) {
        console.warn('⚠️ Usuario creado pero no se pudo guardar en Firestore');
      }
  
      return { success: true, user: result.user };
  
    } catch (error) {
      console.error('❌ FIREBASE REGISTRATION ERROR:', {
        code: error.code,
        message: error.message,
        name: error.name
      });
  
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
      console.log('=== FIREBASE LOGIN DEBUG ===');
      
      const connected = await checkNetworkConnectivity();
      if (!connected) {
        console.log('⚠️ Sin conexión a internet según NetInfo');
        return {
          success: false,
          error: 'No hay conexión a internet. Verifica:\n• WiFi activado\n• Datos móviles activos\n• Señal estable',
          errorCode: 'network-offline'
        };
      }

      console.log('Attempting login...');
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Login exitoso:', result.user.uid);
      
      // Obtener/actualizar datos del usuario en Firestore
      await getUserData(result.user.uid);
      
      // Actualizar último acceso
      await updateLastAccess(result.user.uid);
      
      return {
        success: true,
        user: result.user
      };
    } catch (error) {
      console.error('❌ Error en login:', error.code, error.message);
      
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
      setUserData(null);
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
  const updateUserProfile = async (newData, newPassword = null) => {
    try {
      if (!currentUser) throw new Error('No hay usuario autenticado');

      const connected = await checkNetworkConnectivity();
      if (!connected) {
        return {
          success: false,
          error: 'Sin conexión a internet. Verifica tu red WiFi o datos móviles.'
        };
      }

      // Actualizar perfil de Firebase Auth
      await updateProfile(currentUser, {
        displayName: newData.nombre
      });

      // Actualizar datos en Firestore
      const userRef = doc(db, 'usuarios', currentUser.uid);
      const updatedData = {
        nombre: newData.nombre,
        tituloUniversitario: newData.tituloUniversitario || userData?.tituloUniversitario || '',
        anoGraduacion: newData.anoGraduacion || userData?.anoGraduacion || '',
        ultimaActualizacion: serverTimestamp()
      };
      
      await updateDoc(userRef, updatedData);

      // Actualizar estado local
      const localUpdatedData = {
        ...updatedData,
        ultimaActualizacion: new Date().toISOString()
      };
      setUserData(prev => ({ ...prev, ...localUpdatedData }));

      // Cambiar contraseña si se proporciona
      if (newPassword && newPassword.trim() !== '') {
        if (newData.currentPassword) {
          const credential = EmailAuthProvider.credential(
            currentUser.email, 
            newData.currentPassword
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
    // Listener para cambios de autenticación
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      console.log('👤 Auth state changed:', user ? user.uid : 'No user');
      setCurrentUser(user);
      
      if (user) {
        // Obtener datos del usuario desde Firestore
        await getUserData(user.uid);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    // Listener para cambios de conectividad
    const unsubscribeNetwork = NetInfo.addEventListener(state => {
      console.log('🔌 NetInfo Connectivity Change:', {
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        details: state.details
      });
      setIsConnected(state.isConnected && state.isInternetReachable);
    });
  
    return () => {
      unsubscribeAuth();
      unsubscribeNetwork();
    };
  }, []);

  const value = {
    currentUser,
    userData,
    register,
    login,
    logout,
    updateUserProfile,
    getUserData,
    loading,
    isConnected
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};