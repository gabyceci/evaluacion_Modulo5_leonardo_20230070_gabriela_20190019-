// src/screens/Register.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../hooks/useUser';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    tituloUniversitario: '',
    anoGraduacion: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  const { currentUser } = useAuth();
  const { isLoading, error, registerUser, clearError } = useUser();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Limpiar errores cuando el componente se monta
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores específicos del campo cuando el usuario empiece a escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Limpiar error general
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      errors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar email
    if (!formData.email.trim()) {
      errors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'El correo electrónico no es válido';
    }

    // Validar contraseña
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Debes confirmar tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validar título universitario
    if (!formData.tituloUniversitario.trim()) {
      errors.tituloUniversitario = 'El título universitario es requerido';
    }

    // Validar año de graduación
    if (!formData.anoGraduacion) {
      errors.anoGraduacion = 'El año de graduación es requerido';
    } else {
      const currentYear = new Date().getFullYear();
      const year = parseInt(formData.anoGraduacion);
      if (isNaN(year) || year < 1950 || year > currentYear) {
        errors.anoGraduacion = `El año debe estar entre 1950 y ${currentYear}`;
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Limpiar errores previos
    setFormErrors({});
    
    const result = await registerUser(formData);
    
    if (result.success) {
      navigate('/');
    } else if (result.errors) {
      setFormErrors(result.errors);
    }
  };

  const getFieldError = (fieldName) => {
    return formErrors[fieldName] ? 'border-red-500' : 'border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Registro de Usuario
          </h1>
          <p className="text-gray-600">
            Crea tu cuenta en el Sistema de Evaluación
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${getFieldError('nombre')} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200`}
              placeholder="Tu nombre completo"
              required
            />
            {formErrors.nombre && (
              <p className="mt-1 text-sm text-red-600">{formErrors.nombre}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${getFieldError('email')} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200`}
              placeholder="tu@email.com"
              required
              autoComplete="email"
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${getFieldError('password')} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200`}
              placeholder="Mínimo 6 caracteres"
              required
              autoComplete="new-password"
            />
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${getFieldError('confirmPassword')} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200`}
              placeholder="Confirma tu contraseña"
              required
              autoComplete="new-password"
            />
            {formErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
            )}
          </div>

          {/* Título Universitario */}
          <div>
            <label htmlFor="tituloUniversitario" className="block text-sm font-medium text-gray-700 mb-2">
              Título Universitario *
            </label>
            <input
              type="text"
              id="tituloUniversitario"
              name="tituloUniversitario"
              value={formData.tituloUniversitario}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${getFieldError('tituloUniversitario')} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200`}
              placeholder="Ej: Ingeniero en Sistemas, Licenciado en Educación"
              required
            />
            {formErrors.tituloUniversitario && (
              <p className="mt-1 text-sm text-red-600">{formErrors.tituloUniversitario}</p>
            )}
          </div>

          {/* Año de Graduación */}
          <div>
            <label htmlFor="anoGraduacion" className="block text-sm font-medium text-gray-700 mb-2">
              Año de Graduación *
            </label>
            <input
              type="number"
              id="anoGraduacion"
              name="anoGraduacion"
              value={formData.anoGraduacion}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${getFieldError('anoGraduacion')} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200`}
              placeholder="2020"
              min="1950"
              max={new Date().getFullYear()}
              required
            />
            {formErrors.anoGraduacion && (
              <p className="mt-1 text-sm text-red-600">{formErrors.anoGraduacion}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition duration-300 ${
              isLoading
                ? 'bg-green-300 cursor-not-allowed text-white'
                : 'bg-green-500 hover:bg-green-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando cuenta...
              </div>
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link 
              to="/login" 
              className="text-green-500 hover:text-green-700 font-medium transition duration-200"
            >
              Inicia sesión aquí
            </Link>
          </p>
          
          <div className="mt-4">
            <Link 
              to="/" 
              className="text-sm text-gray-500 hover:text-gray-700 transition duration-200"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>

        {/* Info Panel */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-2">
            ℹ️ Información importante:
          </p>
          <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
            <li>Todos los campos marcados con (*) son obligatorios</li>
            <li>Tu contraseña debe tener al menos 6 caracteres</li>
            <li>El email será usado para iniciar sesión</li>
            <li>La información académica es requerida para el sistema</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;