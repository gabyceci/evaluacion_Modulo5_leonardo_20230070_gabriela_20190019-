// src/screens/HomeScreen.js
import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  StatusBar,
  SafeAreaView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useModalUser } from '../hooks/useModalUser';
import { useUser } from '../hooks/useUser';
import ModalUser from '../components/ModalUser';

const HomeScreen = () => {
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
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sí, cerrar sesión", 
          style: "destructive",
          onPress: async () => {
            const result = await logoutUser();
            if (result.success) {
              console.log('Sesión cerrada exitosamente');
            }
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    openEditModal(currentUser);
  };

  const handleModalSuccess = (mode) => {
    switch (mode) {
      case 'login':
        Alert.alert('Éxito', 'Login exitoso');
        break;
      case 'register':
        Alert.alert('Éxito', 'Registro exitoso');
        break;
      case 'edit':
        Alert.alert('Éxito', 'Perfil actualizado exitosamente');
        break;
    }
  };

  // Componente para usuarios no autenticados
  const UnauthenticatedView = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      <LinearGradient
        colors={['#EFF6FF', '#E0F2FE', '#DBEAFE']}
        style={styles.gradientContainer}
      >
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeContent}>
            <Text style={styles.title}>Sistema de Evaluación</Text>
            <Text style={styles.subtitle}>Accede a tu cuenta para continuar</Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={openLoginModal}
              >
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.registerButton}
                onPress={openRegisterModal}
              >
                <Text style={styles.registerButtonText}>Registrarse</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );

  // Componente para usuarios autenticados
  const AuthenticatedView = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sistema de Evaluación</Text>
        
        <View style={styles.headerRight}>
          <Text style={styles.welcomeText}>
            Bienvenido, {currentUser?.displayName || 'Usuario'}
          </Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Text style={styles.editButtonText}>Editar Perfil</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentCard}>
          <Text style={styles.panelTitle}>Panel Principal</Text>
          
          {/* User Info Card */}
          <View style={styles.userInfoCard}>
            <Text style={styles.userInfoTitle}>Información del Usuario</Text>
            
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Nombre</Text>
                <Text style={styles.infoValue}>
                  {currentUser?.displayName || 'No especificado'}
                </Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Correo Electrónico</Text>
                <Text style={styles.infoValue}>{currentUser?.email}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Título Universitario</Text>
                <Text style={styles.infoValue}>
                  {currentUser?.tituloUniversitario || 'No especificado'}
                </Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Año de Graduación</Text>
                <Text style={styles.infoValue}>
                  {currentUser?.anoGraduacion || 'No especificado'}
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsGrid}>
            <View style={styles.actionCard}>
              <Text style={styles.actionEmoji}>📊</Text>
              <Text style={styles.actionTitle}>Evaluaciones</Text>
              <Text style={styles.actionDescription}>
                Gestiona tus evaluaciones académicas
              </Text>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Ver Evaluaciones</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.actionCard, { backgroundColor: '#FAF5FF' }]}>
              <Text style={styles.actionEmoji}>📚</Text>
              <Text style={[styles.actionTitle, { color: '#7C3AED' }]}>Módulos</Text>
              <Text style={[styles.actionDescription, { color: '#A855F7' }]}>
                Accede a los módulos de estudio
              </Text>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#7C3AED' }]}>
                <Text style={styles.actionButtonText}>Ver Módulos</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.actionCard, { backgroundColor: '#FFF7ED' }]}>
              <Text style={styles.actionEmoji}>📈</Text>
              <Text style={[styles.actionTitle, { color: '#EA580C' }]}>Reportes</Text>
              <Text style={[styles.actionDescription, { color: '#FB923C' }]}>
                Consulta tus reportes y estadísticas
              </Text>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#EA580C' }]}>
                <Text style={styles.actionButtonText}>Ver Reportes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  gradientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    padding: 32,
    width: '100%',
    maxWidth: 400,
  },
  welcomeContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  loginButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  registerButtonText: {
    color: '#3B82F6',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  headerRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 24,
    marginBottom: 20,
  },
  panelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
  },
  userInfoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  userInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 16,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E40AF',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#1E3A8A',
  },
  quickActionsGrid: {
    gap: 16,
  },
  actionCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  actionEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 8,
  },
  actionDescription: {
    fontSize: 14,
    color: '#047857',
    textAlign: 'center',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default HomeScreen;