// src/hooks/useUser.js
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const useUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { register, login, logout, updateUserProfile } = useAuth();

  // Validar formulario de registro
  const validateRegistrationForm = (formData) => {
    const errors = {};

    if (!formData.nombre?.trim()) {
      errors.nombre = 'El nombre es requerido';
    }

    if (!formData.email?.trim()) {
      errors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'El correo electrónico no es válido';
    }

    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.tituloUniversitario?.trim()) {
      errors.tituloUniversitario = 'El título universitario es requerido';
    }

    if (!formData.anoGraduacion) {
      errors.anoGraduacion = 'El año de graduación es requerido';
    } else {
      const currentYear = new Date().getFullYear();
      const year = parseInt(formData.anoGraduacion);
      if (year < 1950 || year > currentYear) {
        errors.anoGraduacion = `El año debe estar entre 1950 y ${currentYear}`;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  // Registrar usuario
  const registerUser = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const validation = validateRegistrationForm(formData);
      if (!validation.isValid) {
        setError('Por favor corrige los errores en el formulario');
        return { success: false, errors: validation.errors };
      }

      const result = await register(formData.email, formData.password, {
        nombre: formData.nombre,
        tituloUniversitario: formData.tituloUniversitario,
        anoGraduacion: formData.anoGraduacion
      });

      if (result.success) {
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = 'Error inesperado durante el registro';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Iniciar sesión
  const loginUser = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!email?.trim() || !password) {
        setError('Email y contraseña son requeridos');
        return { success: false };
      }

      const result = await login(email, password);
      
      if (result.success) {
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = 'Error inesperado durante el login';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Cerrar sesión
  const logoutUser = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await logout();
      return result;
    } catch (err) {
      const errorMessage = 'Error al cerrar sesión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar información del usuario
  const updateUser = async (formData, newPassword = null) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validar datos básicos
      if (!formData.nombre?.trim()) {
        setError('El nombre es requerido');
        return { success: false };
      }

      if (formData.tituloUniversitario && !formData.tituloUniversitario.trim()) {
        setError('El título universitario no puede estar vacío si se proporciona');
        return { success: false };
      }

      if (formData.anoGraduacion) {
        const currentYear = new Date().getFullYear();
        const year = parseInt(formData.anoGraduacion);
        if (year < 1950 || year > currentYear) {
          setError(`El año debe estar entre 1950 y ${currentYear}`);
          return { success: false };
        }
      }

      // Si se quiere cambiar la contraseña, validar contraseña actual
      if (newPassword && !formData.currentPassword) {
        setError('Debes proporcionar tu contraseña actual para cambiarla');
        return { success: false };
      }

      const result = await updateUserProfile(formData, newPassword);
      
      if (result.success) {
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = 'Error al actualizar la información del usuario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Limpiar errores
  const clearError = () => {
    setError(null);
  };

  return {
    isLoading,
    error,
    registerUser,
    loginUser,
    logoutUser,
    updateUser,
    clearError
  };
};