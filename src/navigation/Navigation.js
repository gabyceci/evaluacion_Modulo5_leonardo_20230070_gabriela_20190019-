// src/components/Navigation.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../hooks/useUser';

const Navigation = () => {
  const { currentUser } = useAuth();
  const { logoutUser } = useUser();
  const location = useLocation();

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      console.log('Sesión cerrada exitosamente');
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const linkClasses = (path) => {
    const baseClasses = "px-3 py-2 rounded-md text-sm font-medium transition duration-200";
    return isActive(path) 
      ? `${baseClasses} bg-blue-100 text-blue-700`
      : `${baseClasses} text-gray-600 hover:text-blue-600 hover:bg-blue-50`;
  };

  // Si el usuario está autenticado, mostrar navegación completa
  if (currentUser) {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="text-2xl mr-3">📊</div>
                <span className="text-xl font-semibold text-gray-900">
                  Sistema de Evaluación
                </span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className={linkClasses('/')}>
                Inicio
              </Link>
              <Link to="/evaluaciones" className={linkClasses('/evaluaciones')}>
                Evaluaciones
              </Link>
              <Link to="/modulos" className={linkClasses('/modulos')}>
                Módulos
              </Link>
              <Link to="/reportes" className={linkClasses('/reportes')}>
                Reportes
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-sm text-gray-700">
                Hola, <span className="font-medium">{currentUser?.displayName || 'Usuario'}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Cerrar Sesión
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Si el usuario NO está autenticado, mostrar navegación simple
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="text-2xl mr-3">📊</div>
              <span className="text-xl font-semibold text-gray-900">
                Sistema de Evaluación
              </span>
            </Link>
          </div>

          {/* Auth Links */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className={`${linkClasses('/login')} ${isActive('/login') ? 'bg-blue-100 text-blue-700' : ''}`}
            >
              Iniciar Sesión
            </Link>
            <Link 
              to="/register"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;