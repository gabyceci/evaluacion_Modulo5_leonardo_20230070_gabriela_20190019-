// src/hooks/useModalUser.js
import { useState } from 'react';

export const useModalUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('login'); // 'login', 'register', 'edit'
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    currentPassword: '',
    newPassword: '',
    tituloUniversitario: '',
    anoGraduacion: ''
  });

  // Abrir modal en modo login
  const openLoginModal = () => {
    setModalMode('login');
    clearForm();
    setIsModalOpen(true);
  };

  // Abrir modal en modo registro
  const openRegisterModal = () => {
    setModalMode('register');
    clearForm();
    setIsModalOpen(true);
  };

  // Abrir modal en modo edición con datos del usuario actual
  const openEditModal = (userData) => {
    setModalMode('edit');
    setFormData({
      nombre: userData?.nombre || userData?.displayName || '',
      email: userData?.email || '',
      password: '',
      currentPassword: '',
      newPassword: '',
      tituloUniversitario: userData?.tituloUniversitario || '',
      anoGraduacion: userData?.anoGraduacion || ''
    });
    setIsModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      clearForm();
    }, 300); // Esperar a que termine la animación de cierre
  };

  // Cambiar entre modos dentro del modal
  const switchToRegister = () => {
    setModalMode('register');
    // Mantener email si ya se ingresó
    const currentEmail = formData.email;
    clearForm();
    if (currentEmail) {
      setFormData(prev => ({ ...prev, email: currentEmail }));
    }
  };

  const switchToLogin = () => {
    setModalMode('login');
    // Mantener email si ya se ingresó
    const currentEmail = formData.email;
    clearForm();
    if (currentEmail) {
      setFormData(prev => ({ ...prev, email: currentEmail }));
    }
  };

  // Limpiar formulario
  const clearForm = () => {
    setFormData({
      nombre: '',
      email: '',
      password: '',
      currentPassword: '',
      newPassword: '',
      tituloUniversitario: '',
      anoGraduacion: ''
    });
  };

  // Actualizar campo del formulario
  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Actualizar múltiples campos
  const updateFields = (fields) => {
    setFormData(prev => ({
      ...prev,
      ...fields
    }));
  };

  // Obtener título del modal según el modo
  const getModalTitle = () => {
    switch (modalMode) {
      case 'login':
        return 'Iniciar Sesión';
      case 'register':
        return 'Registro de Usuario';
      case 'edit':
        return 'Editar Información del Usuario';
      default:
        return '';
    }
  };

  // Verificar si el formulario tiene cambios (para modo edición)
  const hasChanges = (originalData) => {
    if (modalMode !== 'edit') return true;
    
    return (
      formData.nombre !== (originalData?.nombre || originalData?.displayName || '') ||
      formData.tituloUniversitario !== (originalData?.tituloUniversitario || '') ||
      formData.anoGraduacion !== (originalData?.anoGraduacion || '') ||
      formData.newPassword.trim() !== ''
    );
  };

  // Validar formulario según el modo
  const validateForm = () => {
    const errors = {};

    if (modalMode === 'login') {
      if (!formData.email?.trim()) {
        errors.email = 'El correo electrónico es requerido';
      }
      if (!formData.password) {
        errors.password = 'La contraseña es requerida';
      }
    }

    if (modalMode === 'register') {
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
        if (isNaN(year) || year < 1950 || year > currentYear) {
          errors.anoGraduacion = `El año debe estar entre 1950 y ${currentYear}`;
        }
      }
    }

    if (modalMode === 'edit') {
      if (!formData.nombre?.trim()) {
        errors.nombre = 'El nombre es requerido';
      }
      if (formData.newPassword && !formData.currentPassword) {
        errors.currentPassword = 'Proporciona tu contraseña actual para cambiarla';
      }
      if (formData.newPassword && formData.newPassword.length < 6) {
        errors.newPassword = 'La nueva contraseña debe tener al menos 6 caracteres';
      }
      if (formData.anoGraduacion) {
        const currentYear = new Date().getFullYear();
        const year = parseInt(formData.anoGraduacion);
        if (isNaN(year) || year < 1950 || year > currentYear) {
          errors.anoGraduacion = `El año debe estar entre 1950 y ${currentYear}`;
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  return {
    // Estado del modal
    isModalOpen,
    modalMode,
    formData,
    
    // Funciones para controlar el modal
    openLoginModal,
    openRegisterModal,
    openEditModal,
    closeModal,
    switchToRegister,
    switchToLogin,
    
    // Funciones para el formulario
    updateField,
    updateFields,
    clearForm,
    
    // Utilidades
    getModalTitle,
    hasChanges,
    validateForm
  };
};