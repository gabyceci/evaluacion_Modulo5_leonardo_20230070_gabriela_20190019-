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
  const openEditModal = (currentUser) => {
    setModalMode('edit');
    setFormData({
      nombre: currentUser?.displayName || '',
      email: currentUser?.email || '',
      password: '',
      currentPassword: '',
      newPassword: '',
      tituloUniversitario: currentUser?.tituloUniversitario || '',
      anoGraduacion: currentUser?.anoGraduacion || ''
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
    clearForm();
  };

  const switchToLogin = () => {
    setModalMode('login');
    clearForm();
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
      formData.nombre !== (originalData?.displayName || '') ||
      formData.tituloUniversitario !== (originalData?.tituloUniversitario || '') ||
      formData.anoGraduacion !== (originalData?.anoGraduacion || '') ||
      formData.newPassword.trim() !== ''
    );
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
    hasChanges
  };
};