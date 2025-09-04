// src/components/ModalUser.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../hooks/useUser';

const ModalUser = ({ 
  isOpen, 
  onClose, 
  mode, 
  formData, 
  updateField,
  onSwitchToRegister,
  onSwitchToLogin,
  onSuccess 
}) => {
  const { currentUser } = useAuth();
  const { isLoading, error, registerUser, loginUser, updateUser, clearError } = useUser();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    let result;
    
    switch (mode) {
      case 'register':
        result = await registerUser(formData);
        break;
      case 'login':
        result = await loginUser(formData.email, formData.password);
        break;
      case 'edit':
        result = await updateUser(formData, formData.newPassword || null);
        break;
      default:
        return;
    }

    if (result.success) {
      onClose();
      if (onSuccess) {
        onSuccess(mode);
      }
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Iniciar Sesión';
      case 'register': return 'Registro de Usuario';
      case 'edit': return 'Editar Información del Usuario';
      default: return '';
    }
  };

  const renderLoginForm = () => (
    <>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Correo Electrónico
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          placeholder="tu@email.com"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Contraseña
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => updateField('password', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          placeholder="Tu contraseña"
          required
        />
      </div>
    </>
  );

  const renderRegisterForm = () => (
    <>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Nombre *
        </label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => updateField('nombre', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          placeholder="Tu nombre completo"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Correo Electrónico *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          placeholder="tu@email.com"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Contraseña *
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => updateField('password', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          placeholder="Mínimo 6 caracteres"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Título Universitario *
        </label>
        <input
          type="text"
          value={formData.tituloUniversitario}
          onChange={(e) => updateField('tituloUniversitario', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          placeholder="Ej: Ingeniero en Sistemas"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Año de Graduación *
        </label>
        <input
          type="number"
          value={formData.anoGraduacion}
          onChange={(e) => updateField('anoGraduacion', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          placeholder="2020"
          min="1950"
          max={new Date().getFullYear()}
          required
        />
      </div>
    </>
  );

  const renderEditForm = () => (
    <>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Nombre
        </label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => updateField('nombre', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          placeholder="Tu nombre completo"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Correo Electrónico
        </label>
        <input
          type="email"
          value={formData.email}
          className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
          disabled
          title="El email no se puede cambiar"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Título Universitario
        </label>
        <input
          type="text"
          value={formData.tituloUniversitario}
          onChange={(e) => updateField('tituloUniversitario', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          placeholder="Ej: Ingeniero en Sistemas"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Año de Graduación
        </label>
        <input
          type="number"
          value={formData.anoGraduacion}
          onChange={(e) => updateField('anoGraduacion', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          placeholder="2020"
          min="1950"
          max={new Date().getFullYear()}
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Cambiar Contraseña</h3>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Contraseña Actual
          </label>
          <input
            type="password"
            value={formData.currentPassword}
            onChange={(e) => updateField('currentPassword', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Tu contraseña actual"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Nueva Contraseña
          </label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) => updateField('newPassword', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Nueva contraseña (opcional)"
          />
          <p className="text-xs text-gray-500 mt-1">
            Deja en blanco si no quieres cambiar la contraseña
          </p>
        </div>
      </div>
    </>
  );

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{getTitle()}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === 'login' && renderLoginForm()}
            {mode === 'register' && renderRegisterForm()}
            {mode === 'edit' && renderEditForm()}

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {isLoading ? 'Procesando...' : 
                 mode === 'login' ? 'Iniciar Sesión' :
                 mode === 'register' ? 'Registrarse' :
                 'Actualizar Información'}
              </button>

              {mode === 'login' && (
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  ¿No tienes cuenta? Regístrate
                </button>
              )}

              {mode === 'register' && (
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  ¿Ya tienes cuenta? Inicia sesión
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalUser;