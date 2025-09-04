// src/screens/Home.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useModalUser } from '../hooks/useModalUser';
import { useUser } from '../hooks/useUser';
import ModalUser from '../components/ModalUser';

const Home = () => {
  const { currentUser } = useAuth();
  const { logoutUser } = useUser();
  const {
    isModalOpen,
    modalMode,
    formData,
    openLoginModal,
    openRegisterModal,
    openEditModal,
    closeModal,
    updateField,
    switchToRegister,
    switchToLogin
  } = useModalUser();

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      console.log('Sesión cerrada exitosamente');
    }
  };

  const handleEditProfile = () => {
    openEditModal(currentUser);
  };

  const handleModalSuccess = (mode) => {
    switch (mode) {
      case 'login':
        console.log('Login exitoso');
        break;
      case 'register':
        console.log('Registro exitoso');
        break;
      case 'edit':
        console.log('Perfil actualizado exitosamente');
        break;
    }
  };

  // Componente para usuarios no autenticados
  const UnauthenticatedView = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Evaluación
          </h1>
          <p className="text-gray-600 mb-8">
            Accede a tu cuenta para continuar
          </p>
          
          <div className="space-y-4">
            <button
              onClick={openLoginModal}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Iniciar Sesión
            </button>
            
            <button
              onClick={openRegisterModal}
              className="w-full bg-white hover:bg-gray-50 text-blue-500 font-bold py-3 px-6 rounded-lg border-2 border-blue-500 transition duration-300"
            >
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Componente para usuarios autenticados
  const AuthenticatedView = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Sistema de Evaluación
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Bienvenido, <span className="font-medium">{currentUser?.displayName || 'Usuario'}</span>
              </div>
              
              <button
                onClick={handleEditProfile}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Editar Perfil
              </button>
              
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Panel Principal
          </h2>
          
          {/* User Info Card */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Información del Usuario
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Nombre
                </label>
                <p className="text-blue-900">
                  {currentUser?.displayName || 'No especificado'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Correo Electrónico
                </label>
                <p className="text-blue-900">
                  {currentUser?.email}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Título Universitario
                </label>
                <p className="text-blue-900">
                  {currentUser?.tituloUniversitario || 'No especificado'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Año de Graduación
                </label>
                <p className="text-blue-900">
                  {currentUser?.anoGraduacion || 'No especificado'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="text-green-600 text-3xl mb-3">📊</div>
              <h4 className="text-lg font-semibold text-green-900 mb-2">
                Evaluaciones
              </h4>
              <p className="text-green-700 text-sm mb-4">
                Gestiona tus evaluaciones académicas
              </p>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">
                Ver Evaluaciones
              </button>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <div className="text-purple-600 text-3xl mb-3">📚</div>
              <h4 className="text-lg font-semibold text-purple-900 mb-2">
                Módulos
              </h4>
              <p className="text-purple-700 text-sm mb-4">
                Accede a los módulos de estudio
              </p>
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">
                Ver Módulos
              </button>
            </div>

            <div className="bg-orange-50 rounded-lg p-6 text-center">
              <div className="text-orange-600 text-3xl mb-3">📈</div>
              <h4 className="text-lg font-semibold text-orange-900 mb-2">
                Reportes
              </h4>
              <p className="text-orange-700 text-sm mb-4">
                Consulta tus reportes y estadísticas
              </p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">
                Ver Reportes
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <>
      {currentUser ? <AuthenticatedView /> : <UnauthenticatedView />}
      
      <ModalUser
        isOpen={isModalOpen}
        onClose={closeModal}
        mode={modalMode}
        formData={formData}
        updateField={updateField}
        onSwitchToRegister={switchToRegister}
        onSwitchToLogin={switchToLogin}
        onSuccess={handleModalSuccess}
      />
    </>
  );
};

export default Home;