// src/screens/HomeScreen.js
import React, { useEffect } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useModalUser } from '../hooks/useModalUser';
import { useUser } from '../hooks/useUser';
import ModalUser from '../components/ModalUser';

const HomeScreen = () => {
  const { currentUser, userData } = useAuth();
  const { logoutUser } = useUser();
  const navigation = useNavigation();
  
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
              // No necesitamos navegar manualmente, el logout ya maneja eso
            }
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    openEditModal({ ...currentUser, ...userData });
  };

  const handleModalSuccess = (mode) => {
    switch (mode) {
      case 'login':
        Alert.alert('Éxito', '¡Bienvenido! Login exitoso');
        break;
      case 'register':
        Alert.alert('Éxito', '¡Cuenta creada! Registro exitoso');
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
            <Text style={styles.welcomeEmoji}>📊</Text>
            <Text style={styles.title}>Sistema de Evaluación</Text>
            <Text style={styles.subtitle}>
              Plataforma educativa para gestión de evaluaciones y módulos de estudio
            </Text>
            
            <View style={styles.featuresList}>
              <Text style={styles.featureItem}>✅ Gestión de evaluaciones</Text>
              <Text style={styles.featureItem}>✅ Módulos de estudio</Text>
              <Text style={styles.featureItem}>✅ Reportes detallados</Text>
              <Text style={styles.featureItem}>✅ Seguimiento de progreso</Text>
            </View>
            
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
                <Text style={styles.registerButtonText}>Crear Cuenta</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.alternativeOptions}>
              <TouchableOpacity
                style={styles.guestButton}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.guestButtonText}>Ver página de login →</Text>
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
        <View style={styles.headerLeft}>
          <Text style={styles.headerEmoji}>📊</Text>
          <Text style={styles.headerTitle}>Sistema de Evaluación</Text>
        </View>
        
        <View style={styles.headerRight}>
          <Text style={styles.welcomeText}>
            Hola, {userData?.nombre || currentUser?.displayName || 'Usuario'}
          </Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Text style={styles.editButtonText}>Editar Perfil</Text>
            </TouchableOpacity>
            
           
          </View>
        </View>
      </View>

      {/* Main Content */}
       <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
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
                  {userData?.nombre || currentUser?.displayName || 'No especificado'}
                </Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Correo Electrónico</Text>
                <Text style={styles.infoValue}>{currentUser?.email}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Título Universitario</Text>
                <Text style={styles.infoValue}>
                  {userData?.tituloUniversitario || 'No especificado'}
                </Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Año de Graduación</Text>
                <Text style={styles.infoValue}>
                  {userData?.anoGraduacion || 'No especificado'}
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
    paddingHorizontal: 16,
  },
  welcomeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    padding: 24,
    width: '100%',
    maxWidth: 380,
  },
  welcomeContent: {
    alignItems: 'center',
  },
  welcomeEmoji: {
    fontSize: 64,
    marginBottom: 16,
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
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresList: {
    alignSelf: 'stretch',
    marginBottom: 32,
  },
  featureItem: {
    fontSize: 14,
    color: '#059669',
    marginBottom: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 16,
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
    borderColor: '#10B981',
  },
  registerButtonText: {
    color: '#10B981',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  alternativeOptions: {
    marginTop: 16,
  },
  guestButton: {
    paddingVertical: 8,
  },
  guestButtonText: {
    color: '#6B7280',
    fontSize: 14,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  welcomeText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  welcomeSection: {
    marginTop: 4,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  contentCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 16,
    marginBottom: 16,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  userInfoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  userInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 12,
  },
  infoGrid: {
    gap: 8,
  },
  infoItem: {
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E40AF',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#1E3A8A',
  },
  quickActionsGrid: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  actionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: '#047857',
    textAlign: 'center',
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default HomeScreen;